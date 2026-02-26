import Stripe from "stripe";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { resend, EMAIL_FROM, ADMIN_EMAIL } from "@/lib/resend";
import { buildOrderEmail } from "@/lib/emails/orderConfirmation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function getInternalProductId(
  product: Stripe.Product | Stripe.DeletedProduct | string | null | undefined
): string | undefined {
  if (!product) return undefined;
  if (typeof product === "string") return undefined;
  if ("deleted" in product) return undefined;
  return product.metadata?.productId || undefined;
}

async function listAllLineItems(sessionId: string) {
  const all: Stripe.LineItem[] = [];
  let starting_after: string | undefined;

  while (true) {
    const page = await stripe.checkout.sessions.listLineItems(sessionId, {
      limit: 100,
      starting_after,
      expand: ["data.price.product"],
    });

    all.push(...page.data);
    if (!page.has_more) break;

    starting_after = page.data[page.data.length - 1]?.id;
    if (!starting_after) break;
  }

  return all;
}

export async function POST(req: Request) {
  const sig = (await headers()).get("stripe-signature");
  if (!sig) return new Response("Missing stripe-signature", { status: 400 });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret)
    return new Response("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });

  let event: Stripe.Event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const stripeSessionId = session.id;

      // 🔐 Idempotency per event ID
      const existingByEvent = await prisma.order.findFirst({
        where: { lastStripeEventId: event.id },
      });

      if (existingByEvent) {
        return new Response("Already processed", { status: 200 });
      }

      const full = await stripe.checkout.sessions.retrieve(stripeSessionId, {
        expand: ["customer_details"],
      });

      const cd = full.customer_details;
      const addr = cd?.address;

      const stripePaymentId =
        typeof full.payment_intent === "string"
          ? full.payment_intent
          : full.payment_intent?.id ?? null;

      const currency = (full.currency ?? "eur").toUpperCase();
      const totalCents = full.amount_total ?? 0;
      const subtotalCents = full.amount_subtotal ?? 0;
      const shippingCents = full.total_details?.amount_shipping ?? 0;

      const order = await prisma.order.upsert({
        where: { stripeSessionId },
        update: {
          stripePaymentId,
          paymentStatus: "paid",
          lastStripeEventId: event.id,
        },
        create: {
          stripeSessionId,
          stripePaymentId,
          paymentStatus: "paid",
          fulfillmentStatus: "unfulfilled",
          lastStripeEventId: event.id,

          email: cd?.email ?? null,
          name: cd?.name ?? null,
          phone: cd?.phone ?? null,

          addressLine1: addr?.line1 ?? null,
          addressLine2: addr?.line2 ?? null,
          city: addr?.city ?? null,
          region: addr?.state ?? null,
          postalCode: addr?.postal_code ?? null,
          country: addr?.country ?? null,

          currency,
          subtotalCents,
          shippingCents,
          totalCents,
        },
      });

      const lineItems = await listAllLineItems(stripeSessionId);

      await prisma.orderItem.deleteMany({ where: { orderId: order.id } });

      for (const li of lineItems) {
        const price = li.price;
        const internalProductId = getInternalProductId(price?.product);
        if (!internalProductId) continue;

        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: internalProductId,
            name: li.description ?? "Item",
            priceCents: price?.unit_amount ?? 0,
            quantity: li.quantity ?? 1,
          },
        });
      }

      // 💎 SEND LUXURY EMAIL
      if (!order.confirmationEmailSentAt && order.email) {
        const email = buildOrderEmail({
          orderId: order.id,
          createdAt: order.createdAt,
          currency,
          items: lineItems.map((li) => ({
            name: li.description ?? "Item",
            quantity: li.quantity ?? 1,
            priceCents: li.price?.unit_amount ?? 0,
          })),
          subtotalCents,
          shippingCents,
          totalCents,
          customerName: order.name,
        });

        await resend.emails.send({
          from: EMAIL_FROM,
          to: order.email,
          subject: email.subject,
          html: email.html,
        });

        await prisma.order.update({
          where: { id: order.id },
          data: { confirmationEmailSentAt: new Date() },
        });
      }

      // Admin notification
      if (ADMIN_EMAIL) {
        await resend.emails.send({
          from: EMAIL_FROM,
          to: ADMIN_EMAIL,
          subject: `New Order — ${order.id}`,
          html: `<strong>New paid order:</strong> ${order.id}`,
        });
      }
    }

    return new Response("OK", { status: 200 });
  } catch (err: any) {
    console.error("Webhook error:", err);
    return new Response("Webhook handler failed", { status: 500 });
  }
}