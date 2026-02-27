import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) throw new Error("Missing STRIPE_SECRET_KEY");

const stripe = new Stripe(stripeSecretKey, {
  // jei pas tave jau nustatyta kitur – ok. Šita versija saugi palikti.

});

function toCents(n: number | null | undefined) {
  return typeof n === "number" ? n : 0;
}

export async function POST(req: Request) {
  const sig = (await headers()).get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    const rawBody = await req.text(); // ✅ raw body required for signature verification
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err?.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // ✅ idempotency guard by event id (you have lastStripeEventId unique)
  try {
    const already = await prisma.order.findFirst({
      where: { lastStripeEventId: event.id },
      select: { id: true },
    });
    if (already) return NextResponse.json({ ok: true, deduped: true });
  } catch {
    // if lookup fails, continue (we'll still try to process)
  }

  try {
    switch (event.type) {
      /**
       * Primary event: payment done and checkout completed
       */
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (!session.id) {
          return NextResponse.json({ error: "Missing session.id" }, { status: 400 });
        }

        // Fetch full session with line items + product metadata
        const full = await stripe.checkout.sessions.retrieve(session.id, {
          expand: [
            "line_items.data.price.product",
            "payment_intent",
            "customer_details",
          ],
        });

        const customer = full.customer_details;
        const address = customer?.address ?? null;

        const currency = (full.currency ?? "eur").toUpperCase();

        const amountSubtotal = toCents(full.amount_subtotal); // cents
        const amountTotal = toCents(full.amount_total); // cents
        const shippingCents = toCents(full.total_details?.amount_shipping);

        const stripePaymentId =
          typeof full.payment_intent === "string"
            ? full.payment_intent
            : full.payment_intent?.id ?? null;

        // Build order items from Stripe line items
        const lineItems = full.line_items?.data ?? [];

        // Create/Update order by stripeSessionId (unique)
        const order = await prisma.order.upsert({
          where: { stripeSessionId: full.id },
          update: {
            email: customer?.email ?? null,
            name: customer?.name ?? null,
            phone: customer?.phone ?? null,

            addressLine1: address?.line1 ?? null,
            addressLine2: address?.line2 ?? null,
            city: address?.city ?? null,
            region: address?.state ?? null,
            postalCode: address?.postal_code ?? null,
            country: address?.country ?? null,

            currency,
            shippingCents,
            subtotalCents: amountSubtotal,
            totalCents: amountTotal,

            paymentStatus: "paid",
            fulfillmentStatus: "unfulfilled",

            stripePaymentId: stripePaymentId ?? undefined,
            lastStripeEventId: event.id,
          },
          create: {
            stripeSessionId: full.id,
            stripePaymentId: stripePaymentId ?? null,
            lastStripeEventId: event.id,

            email: customer?.email ?? null,
            name: customer?.name ?? null,
            phone: customer?.phone ?? null,

            addressLine1: address?.line1 ?? null,
            addressLine2: address?.line2 ?? null,
            city: address?.city ?? null,
            region: address?.state ?? null,
            postalCode: address?.postal_code ?? null,
            country: address?.country ?? null,

            currency,
            shippingCents,
            subtotalCents: amountSubtotal,
            totalCents: amountTotal,

            paymentStatus: "paid",
            fulfillmentStatus: "unfulfilled",
          },
          select: { id: true },
        });

        // Replace items (safe idempotent strategy)
        await prisma.orderItem.deleteMany({
          where: { orderId: order.id },
        });

        // Create items based on Stripe line items
        const createItems = lineItems.map((li) => {
          const qty = li.quantity ?? 1;
          const unitAmount = toCents(li.price?.unit_amount);

          // productId comes from Stripe Product metadata (created from price_data.product_data)
          const stripeProduct = li.price?.product as Stripe.Product | null;
          const productIdFromMetadata =
            (stripeProduct?.metadata?.productId as string | undefined) ?? undefined;

          return prisma.orderItem.create({
            data: {
              orderId: order.id,
              productId: productIdFromMetadata ?? "unknown", // fallback (should not happen)
              name: li.description ?? stripeProduct?.name ?? "Item",
              priceCents: unitAmount,
              quantity: qty,
            },
          });
        });

        // Run creates in transaction
        await prisma.$transaction(createItems);

        return NextResponse.json({ ok: true });
      }

      /**
       * Optional: mark failed payment
       */
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (!session?.id) return NextResponse.json({ ok: true });

        await prisma.order.updateMany({
          where: { stripeSessionId: session.id },
          data: {
            paymentStatus: "failed",
            lastStripeEventId: event.id,
          },
        });

        return NextResponse.json({ ok: true });
      }

      default: {
        // For other events: acknowledge (Stripe requires 2xx)
        return NextResponse.json({ ok: true, ignored: true });
      }
    }
  } catch (err: any) {
    console.error("Webhook handler error:", err);
    // still return 200 sometimes? No—better return 500 so Stripe retries.
    return NextResponse.json({ error: err?.message ?? "Webhook error" }, { status: 500 });
  }
}