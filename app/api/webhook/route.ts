import Stripe from "stripe";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * Stripe price.product can be:
 * - string (product id) if not expanded
 * - Stripe.Product (has metadata)
 * - Stripe.DeletedProduct (no metadata)
 */
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
  let starting_after: string | undefined = undefined;

  while (true) {
    const page: Stripe.ApiList<Stripe.LineItem> =
      await stripe.checkout.sessions.listLineItems(sessionId, {
        limit: 100,
        starting_after,
        // ✅ expand product, kad galėtume paimti product.metadata.productId
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
  if (!sig) return new Response("Missing stripe-signature header", { status: 400 });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return new Response("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });

  let event: Stripe.Event;

  try {
    const body = await req.text(); // raw body is required
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err?.message ?? "Invalid signature"}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // 1) session details for address/phone/email
        const full = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ["customer_details"],
        });

        const cd = full.customer_details;
        const addr = cd?.address;

        const stripeSessionId = full.id;

        const stripePaymentId =
          typeof full.payment_intent === "string"
            ? full.payment_intent
            : full.payment_intent?.id ?? null;

        const currency = (full.currency ?? "eur").toUpperCase();

        const totalCents = full.amount_total ?? 0;
        const subtotalCents = full.amount_subtotal ?? 0;
        const shippingCents = full.total_details?.amount_shipping ?? 0;

        // 2) upsert Order (idempotent)
        // ✅ paymentStatus = paid
        // ✅ fulfillmentStatus = unfulfilled (tik kuriant; update metu neliečiam, kad neperrašyt admin veiksmų)
        const order = await prisma.order.upsert({
          where: { stripeSessionId },
          update: {
            stripePaymentId,
            paymentStatus: "paid",

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
          create: {
            stripeSessionId,
            stripePaymentId,
            paymentStatus: "paid",
            fulfillmentStatus: "unfulfilled",

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

        // 3) line items
        const lineItems = await listAllLineItems(stripeSessionId);

        // 4) idempotency for items
        await prisma.orderItem.deleteMany({ where: { orderId: order.id } });

        // 5) create items (ensure Product exists to avoid FK crash)
        for (const li of lineItems) {
          const price = li.price;
          const internalProductId = getInternalProductId(price?.product);

          if (!internalProductId) {
            throw new Error(
              `Missing product mapping: expected price.product.metadata.productId. ` +
                `Make sure checkout creates product_data.metadata.productId. ` +
                `(session=${stripeSessionId})`
            );
          }

          // ensure Product exists (FK safety)
          await prisma.product.upsert({
            where: { id: internalProductId },
            update: {
              name: li.description ?? "Item",
              priceCents: price?.unit_amount ?? 0,
              currency,
              active: true,
            },
            create: {
              id: internalProductId,
              name: li.description ?? "Item",
              description: null,
              priceCents: price?.unit_amount ?? 0,
              currency,
              imageUrl: null,
              active: true,
            },
          });

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

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.id) {
          await prisma.order.updateMany({
            where: { stripeSessionId: session.id },
            data: { paymentStatus: "failed" },
          });
        }
        break;
      }

      default:
        break;
    }

    return new Response("OK", { status: 200 });
  } catch (err: any) {
    console.error("Webhook handler failed:", err);
    return new Response(`Webhook handler failed: ${err?.message ?? "Unknown error"}`, {
      status: 500,
    });
  }
}