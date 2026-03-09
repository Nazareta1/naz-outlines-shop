import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend, EMAIL_FROM } from "@/lib/resend";
import OrderShippedEmail from "@/lib/emails/orderShipped";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAYMENT_ALLOWED = new Set(["pending", "paid", "failed", "refunded"]);
const FULFILL_ALLOWED = new Set(["unfulfilled", "fulfilled", "shipped", "cancelled"]);

async function sendShippedEmail(order: {
  id: string;
  email: string | null;
  name: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  items: Array<{
    quantity: number;
    size: string | null;
    product: {
      name: string;
    };
  }>;
}) {
  if (!order.email) {
    console.warn("Skipping shipped email: missing customer email", order.id);
    return;
  }

  const itemsForEmail = order.items.map((item) => ({
    name: item.product.name,
    size: item.size,
    quantity: item.quantity,
  }));

  const textItems =
    itemsForEmail.length > 0
      ? itemsForEmail
          .map(
            (item) =>
              `- ${item.name} | Size: ${item.size || "-"} | Qty: ${item.quantity}`
          )
          .join("\n")
      : "No items listed.";

  await resend.emails.send({
    from: EMAIL_FROM,
    to: order.email,
    subject: "NAZ — Your order is on the way",
    react: OrderShippedEmail({
      customerName: order.name,
      orderNumber: order.id,
      trackingNumber: order.trackingNumber || null,
      trackingUrl: order.trackingUrl || null,
      customerEmail: order.email,
      items: itemsForEmail,
    }),
    text: `NAZ — Your order is on the way

Order #${order.id}
Email: ${order.email}
Tracking number: ${order.trackingNumber || "Available soon"}
${order.trackingUrl ? `Tracking link: ${order.trackingUrl}` : ""}

Items:
${textItems}

Your NAZ piece has been shipped and is now in motion.

go NAZ — win your own race`,
  });
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const body = await req.json().catch(() => ({}));
    const type = String(body?.type ?? "").toLowerCase();
    const status = String(body?.status ?? "").toLowerCase();

    if (type !== "payment" && type !== "fulfillment") {
      return new NextResponse("Invalid type. Allowed: payment, fulfillment", {
        status: 400,
      });
    }

    if (type === "payment" && !PAYMENT_ALLOWED.has(status)) {
      return new NextResponse(
        "Invalid payment status. Allowed: pending, paid, failed, refunded",
        { status: 400 }
      );
    }

    if (type === "fulfillment" && !FULFILL_ALLOWED.has(status)) {
      return new NextResponse(
        "Invalid fulfillment status. Allowed: unfulfilled, fulfilled, shipped, cancelled",
        { status: 400 }
      );
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        fulfillmentStatus: true,
      },
    });

    if (!existingOrder) {
      return new NextResponse("Order not found", { status: 404 });
    }

    const data =
      type === "payment"
        ? { paymentStatus: status }
        : { fulfillmentStatus: status };

    const updated = await prisma.order.update({
      where: { id },
      data,
      select: { paymentStatus: true, fulfillmentStatus: true },
    });

    const becameShipped =
      type === "fulfillment" &&
      status === "shipped" &&
      existingOrder.fulfillmentStatus !== "shipped";

    if (becameShipped) {
      const orderWithItems = await prisma.order.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (orderWithItems) {
        await sendShippedEmail({
          id: orderWithItems.id,
          email: orderWithItems.email,
          name: orderWithItems.name,
          trackingNumber:
            "trackingNumber" in orderWithItems ? (orderWithItems as any).trackingNumber : null,
          trackingUrl:
            "trackingUrl" in orderWithItems ? (orderWithItems as any).trackingUrl : null,
          items: orderWithItems.items.map((item) => ({
            quantity: item.quantity,
            size: item.size,
            product: {
              name: item.product.name,
            },
          })),
        });
      }
    }

    return NextResponse.json({ ok: true, ...updated });
  } catch (e: any) {
    console.error("Status update failed:", e);
    return new NextResponse(e?.message ?? "Failed to update order", {
      status: 500,
    });
  }
}