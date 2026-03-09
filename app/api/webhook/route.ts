import Stripe from "stripe";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import OrderConfirmationEmail from "@/lib/emails/orderConfirmation";
import { resend, EMAIL_FROM } from "@/lib/resend";

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

function formatMoneyText(cents: number, currency = "EUR") {
  const amount = cents / 100;

  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency.toUpperCase()}`;
  }
}

async function sendOrderConfirmationEmail(order: {
  id: string;
  email: string | null;
  name: string | null;
  totalCents: number;
  currency: string | null;
  items: Array<{
    quantity: number;
    size: string | null;
    price: number;
    product: {
      name: string;
    };
  }>;
}) {
  if (!order.email) {
    console.warn("Skipping order confirmation email: missing customer email", order.id);
    return;
  }

  const currency = (order.currency || "EUR").toUpperCase();

  const itemsForEmail = order.items.map((item) => ({
    name: item.product.name,
    size: item.size,
    quantity: item.quantity,
    price: item.price,
  }));

  const textItems =
    itemsForEmail.length > 0
      ? itemsForEmail
          .map(
            (item) =>
              `- ${item.name} | Size: ${item.size || "-"} | Qty: ${item.quantity}${
                item.price != null ? ` | ${formatMoneyText(item.price, currency)}` : ""
              }`
          )
          .join("\n")
      : "No items listed.";

  await resend.emails.send({
    from: EMAIL_FROM,
    to: order.email,
    subject: "NAZ — Order Confirmed",
    react: OrderConfirmationEmail({
      customerName: order.name,
      orderNumber: order.id,
      customerEmail: order.email,
      total: order.totalCents,
      currency,
      items: itemsForEmail,
    }),
    text: `NAZ — Order Confirmed

Order #${order.id}
Email: ${order.email}
Total: ${formatMoneyText(order.totalCents, currency)}

Items:
${textItems}

Your NAZ piece is now in motion.
We will send you another update as soon as your order is shipped.

go NAZ — win your own race`,
  });
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
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        })
      : null) ||
    (await prisma.order.findUnique({
      where: { stripeSessionId: session.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    }));

  if (!order) {
    console.warn("Webhook: order not found for session", session.id);
    return;
  }

  if (
    order.lastStripeEventId === stripeEventId ||
    order.paymentStatus === "paid"
  ) {
    return;
  }

  const details = session.customer_details;
  const address = details?.address;

  await prisma.$transaction(async (tx) => {
    const freshOrder = await tx.order.findUnique({
      where: { id: order.id },
      include: {
        items: true,
      },
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
        currency: (
          session.currency ||
          freshOrder.currency ||
          "eur"
        ).toUpperCase(),
        subtotalCents: session.amount_subtotal ?? freshOrder.subtotalCents,
        totalCents: session.amount_total ?? freshOrder.totalCents,
        shippingCents:
          session.total_details?.amount_shipping ?? freshOrder.shippingCents,
        lastStripeEventId: stripeEventId,
      },
    });
  });

  const paidOrder = await prisma.order.findUnique({
    where: { id: order.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!paidOrder) {
    console.warn("Webhook: paid order not found after update", order.id);
    return;
  }

  await sendOrderConfirmationEmail({
    id: paidOrder.id,
    email: paidOrder.email,
    name: paidOrder.name,
    totalCents: paidOrder.totalCents,
    currency: paidOrder.currency,
    items: paidOrder.items.map((item) => ({
      quantity: item.quantity,
      size: item.size,
      price: item.priceCents,
      product: {
        name: item.product.name,
      },
    })),
  });
}

export async function POST(req: Request) {
  const headerStore = await headers();
  const sig = headerStore.get("stripe-signature");

  if (!sig) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return new Response("Missing STRIPE_WEBHOOK_SECRET env var", {
      status: 500,
    });
  }

  const body = await req.text();

  let event: Stripe.Event;

  try {
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

      case "payment_intent.succeeded": {
        break;
      }

      default: {
        break;
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return new Response("Webhook handler failed", { status: 500 });
  }
}