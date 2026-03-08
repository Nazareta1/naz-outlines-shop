import Stripe from "stripe";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

async function decrementStockForItem(
  tx: Omit<
    typeof prisma,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >,
  item: {
    productId: string;
    quantity: number;
    size: string | null;
  }
) {
  if (!item.size) {
    throw new Error(`Missing size for order item ${item.productId}`);
  }

  if (item.size === "S") {
    const result = await tx.product.updateMany({
      where: {
        id: item.productId,
        stockS: { gte: item.quantity },
      },
      data: {
        stockS: { decrement: item.quantity },
      },
    });

    if (result.count === 0) {
      throw new Error(`Insufficient S stock for product ${item.productId}`);
    }

    return;
  }

  if (item.size === "M") {
    const result = await tx.product.updateMany({
      where: {
        id: item.productId,
        stockM: { gte: item.quantity },
      },
      data: {
        stockM: { decrement: item.quantity },
      },
    });

    if (result.count === 0) {
      throw new Error(`Insufficient M stock for product ${item.productId}`);
    }

    return;
  }

  if (item.size === "L") {
    const result = await tx.product.updateMany({
      where: {
        id: item.productId,
        stockL: { gte: item.quantity },
      },
      data: {
        stockL: { decrement: item.quantity },
      },
    });

    if (result.count === 0) {
      throw new Error(`Insufficient L stock for product ${item.productId}`);
    }

    return;
  }

  throw new Error(`Unsupported size ${item.size}`);
}

async function handlePaidCheckout(
  session: Stripe.Checkout.Session,
  stripeEventId: string
) {
  const orderId = session.metadata?.orderId;

  const order =
    (orderId
      ? await prisma.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        })
      : null) ||
    (await prisma.order.findUnique({
      where: { stripeSessionId: session.id },
      include: { items: true },
    }));

  if (!order) {
    console.warn("Webhook: order not found for session", session.id);
    return;
  }

  if (order.lastStripeEventId === stripeEventId || order.paymentStatus === "paid") {
    return;
  }

  const details = session.customer_details;
  const address = details?.address;

  await prisma.$transaction(async (tx) => {
    const freshOrder = await tx.order.findUnique({
      where: { id: order.id },
      include: { items: true },
    });

    if (!freshOrder) {
      throw new Error(`Order ${order.id} no longer exists`);
    }

    if (
      freshOrder.lastStripeEventId === stripeEventId ||
      freshOrder.paymentStatus === "paid"
    ) {
      return;
    }

    for (const item of freshOrder.items) {
      await decrementStockForItem(tx, {
        productId: item.productId,
        quantity: item.quantity,
        size: item.size,
      });
    }

    await tx.order.update({
      where: { id: freshOrder.id },
      data: {
        stripeSessionId: session.id,
        stripePaymentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id,
        paymentStatus: "paid",
        fulfillmentStatus: "processing",
        email: details?.email || freshOrder.email,
        name: details?.name || freshOrder.name,
        phone: details?.phone || freshOrder.phone,
        addressLine1: address?.line1 || freshOrder.addressLine1,
        addressLine2: address?.line2 || freshOrder.addressLine2,
        city: address?.city || freshOrder.city,
        region: address?.state || freshOrder.region,
        postalCode: address?.postal_code || freshOrder.postalCode,
        country: address?.country || freshOrder.country,
        currency: (session.currency || freshOrder.currency || "eur").toUpperCase(),
        subtotalCents:
          session.amount_subtotal ?? freshOrder.subtotalCents,
        totalCents: session.amount_total ?? freshOrder.totalCents,
        shippingCents:
          session.total_details?.amount_shipping ?? freshOrder.shippingCents,
        lastStripeEventId: stripeEventId,
      },
    });
  });
}

export async function POST(req: Request) {
  const sig = (await headers()).get("stripe-signature");

  if (!sig) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return new Response("Missing STRIPE_WEBHOOK_SECRET env var", { status: 500 });
  }

  let event: Stripe.Event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handlePaidCheckout(session, event.id);
        break;
      }

      default:
        break;
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return new Response("Webhook handler failed", { status: 500 });
  }
}