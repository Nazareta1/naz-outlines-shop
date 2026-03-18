import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend, EMAIL_FROM } from "@/lib/resend";
import OrderShippedEmail from "@/lib/emails/orderShipped";
import OrderShippedVIP from "@/lib/emails/orderShippedVIP";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAYMENT_ALLOWED = new Set(["pending", "paid", "failed", "refunded"]);
const FULFILL_ALLOWED = new Set([
  "unfulfilled",
  "fulfilled",
  "shipped",
  "delivered",
  "cancelled",
]);

const NAZ_PRIVATE_ACCESS_MIN_ORDERS = 3;
const NAZ_PRIVATE_ACCESS_MIN_SPEND_CENTS = 40000;

function deliveredEmailHtml({
  customerName,
  orderNumber,
}: {
  customerName?: string | null;
  orderNumber: string;
}) {
  return `
  <!DOCTYPE html>
  <html>
    <body style="margin:0;padding:0;background:#020202;color:#ffffff;font-family:Inter,Arial,Helvetica,sans-serif;">
      <div style="max-width:620px;margin:0 auto;padding:28px 14px 40px;background:#020202;">
        <div style="border:1px solid rgba(255,255,255,0.10);border-radius:28px;overflow:hidden;background:linear-gradient(180deg,#07090d 0%,#040404 38%,#050505 100%);">
          <div style="padding:34px 28px 30px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.08);background:radial-gradient(circle at top center, rgba(255,255,255,0.08), transparent 34%);">
            <div style="font-size:30px;font-weight:800;letter-spacing:0.34em;line-height:1;">NAZ</div>
            <div style="margin-top:12px;font-size:11px;letter-spacing:0.24em;text-transform:uppercase;color:rgba(255,255,255,0.46);">
              Luxury streetwear with motorsport energy
            </div>
          </div>

          <div style="padding:34px 28px 10px;">
            <div style="display:inline-block;padding:8px 12px;border-radius:999px;border:1px solid rgba(255,255,255,0.10);background:rgba(255,255,255,0.03);font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.52);margin-bottom:18px;">
              Delivery update
            </div>

            <h1 style="margin:0;font-size:38px;line-height:1.06;font-weight:800;letter-spacing:-0.03em;">
              It has arrived.
            </h1>

            <p style="margin:18px 0 0;font-size:16px;line-height:1.9;color:rgba(255,255,255,0.75);">
              ${customerName ? `Thank you, ${customerName}. ` : ""}
              Your NAZ order has been delivered.
              <br />
              We hope it feels exactly the way it was meant to.
            </p>
          </div>

          <div style="padding:20px 28px 0;">
            <div style="border:1px solid rgba(255,255,255,0.10);border-radius:22px;background:linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.02));padding:22px 20px;">
              <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.48);margin-bottom:14px;">
                Delivery details
              </div>

              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <tbody>
                  <tr>
                    <td style="padding:10px 0;font-size:14px;color:rgba(255,255,255,0.50);border-bottom:1px solid rgba(255,255,255,0.06);">
                      Order number
                    </td>
                    <td align="right" style="padding:10px 0;font-size:14px;color:#ffffff;font-weight:700;border-bottom:1px solid rgba(255,255,255,0.06);">
                      #${orderNumber}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;font-size:14px;color:rgba(255,255,255,0.50);">
                      Status
                    </td>
                    <td align="right" style="padding:10px 0;font-size:14px;color:#ffffff;font-weight:700;">
                      Delivered
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style="padding:28px 28px 0;">
            <div style="padding:22px 20px;border:1px solid rgba(255,255,255,0.08);border-radius:20px;background:linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015));">
              <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.46);margin-bottom:10px;">
                A note from NAZ
              </div>

              <p style="margin:0;font-size:15px;line-height:1.9;color:rgba(255,255,255,0.72);">
                This is more than clothing.
                <br />
                This is presence.
              </p>
            </div>
          </div>

          <div style="padding:30px 28px 34px;text-align:center;">
            <div style="border-top:1px solid rgba(255,255,255,0.10);padding-top:22px;">
              <p style="margin:0;font-size:12px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.42);">
                Go NAZ — Win your own race
              </p>
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;
}

function nazPrivateAccessEmailHtml({
  customerName,
}: {
  customerName?: string | null;
}) {
  return `
  <!DOCTYPE html>
  <html>
    <body style="margin:0;padding:0;background:#020202;color:#ffffff;font-family:Inter,Arial,Helvetica,sans-serif;">
      <div style="max-width:620px;margin:0 auto;padding:28px 14px 40px;background:#020202;">
        <div style="border:1px solid rgba(255,255,255,0.10);border-radius:28px;overflow:hidden;background:linear-gradient(180deg,#07090d 0%,#040404 38%,#050505 100%);">
          <div style="padding:34px 28px 30px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.08);background:radial-gradient(circle at top center, rgba(255,255,255,0.08), transparent 34%);">
            <div style="font-size:30px;font-weight:800;letter-spacing:0.34em;line-height:1;">NAZ</div>
            <div style="margin-top:12px;font-size:11px;letter-spacing:0.24em;text-transform:uppercase;color:rgba(255,255,255,0.46);">
              NAZ Private Access
            </div>
          </div>

          <div style="padding:34px 28px 10px;">
            <div style="display:inline-block;padding:8px 12px;border-radius:999px;border:1px solid rgba(255,255,255,0.10);background:rgba(255,255,255,0.03);font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.52);margin-bottom:18px;">
              Access granted
            </div>

            <h1 style="margin:0;font-size:38px;line-height:1.06;font-weight:800;letter-spacing:-0.03em;">
              You now have NAZ Private Access.
            </h1>

            <p style="margin:18px 0 0;font-size:16px;line-height:1.9;color:rgba(255,255,255,0.75);">
              ${customerName ? `Thank you, ${customerName}. ` : ""}
              You are now part of a selected group that will be informed first about future drops.
              <br /><br />
              Before the next public release, you will receive early access and be able to view and order the next drop ahead of everyone else.
            </p>
          </div>

          <div style="padding:20px 28px 0;">
            <div style="border:1px solid rgba(255,255,255,0.10);border-radius:22px;background:linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.02));padding:22px 20px;">
              <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.48);margin-bottom:14px;">
                What this means
              </div>

              <div style="font-size:15px;line-height:1.9;color:rgba(255,255,255,0.76);">
                • Private notification before the next drop
                <br />
                • Early access before public release
                <br />
                • The chance to order one day earlier than everyone else
              </div>
            </div>
          </div>

          <div style="padding:28px 28px 0;">
            <div style="padding:22px 20px;border:1px solid rgba(255,255,255,0.08);border-radius:20px;background:linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015));">
              <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.46);margin-bottom:10px;">
                A note from NAZ
              </div>

              <p style="margin:0;font-size:15px;line-height:1.9;color:rgba(255,255,255,0.72);">
                No discounts.
                <br />
                Just access, priority, and presence.
              </p>
            </div>
          </div>

          <div style="padding:30px 28px 34px;text-align:center;">
            <div style="border-top:1px solid rgba(255,255,255,0.10);padding-top:22px;">
              <p style="margin:0;font-size:12px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.42);">
                Go NAZ — Win your own race
              </p>
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;
}

async function sendShippedEmail(order: {
  id: string;
  email: string | null;
  name: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  shippingCarrier?: string | null;
  nazPrivateAccess?: boolean;
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

  const isVIP = Boolean(order.nazPrivateAccess);

  await resend.emails.send({
    from: EMAIL_FROM,
    to: order.email,
    subject: isVIP
      ? "NAZ Private Access — Your order is in motion"
      : "NAZ — Your order is on the way",
    react: isVIP
      ? OrderShippedVIP({
          customerName: order.name,
          trackingUrl: order.trackingUrl || null,
        })
      : OrderShippedEmail({
          customerName: order.name,
          orderNumber: order.id,
          trackingNumber: order.trackingNumber || null,
          trackingUrl: order.trackingUrl || null,
          customerEmail: order.email,
          items: itemsForEmail,
          carrier: order.shippingCarrier || null,
        }),
    text: isVIP
      ? `NAZ Private Access — Your order is in motion

Your order is in motion.

You are part of a limited group receiving priority handling.
Your piece is now moving through our system with elevated attention and precision.

${order.trackingUrl ? `Track movement: ${order.trackingUrl}` : "Movement updates soon."}

Access defines timing.
You are already ahead.

— NAZ
Go NAZ — Win your own race`
      : `NAZ — Your order is on the way

Order #${order.id}
Email: ${order.email}
Carrier: ${order.shippingCarrier || "-"}
Tracking number: ${order.trackingNumber || "Tracking activates shortly"}
${order.trackingUrl ? `Tracking link: ${order.trackingUrl}` : ""}

Items:
${textItems}

Your NAZ piece is now in motion.

Go NAZ — Win your own race`,
  });
}

async function sendDeliveredEmail(order: {
  id: string;
  email: string | null;
  name: string | null;
}) {
  if (!order.email) {
    console.warn("Skipping delivered email: missing customer email", order.id);
    return;
  }

  await resend.emails.send({
    from: EMAIL_FROM,
    to: order.email,
    subject: "NAZ — Your order has arrived",
    html: deliveredEmailHtml({
      customerName: order.name,
      orderNumber: order.id,
    }),
    text: `NAZ — Your order has arrived

Order #${order.id}

${order.name ? `Thank you, ${order.name}.` : "Thank you."}
Your NAZ order has been delivered.

This is more than clothing.
This is presence.

Go NAZ — Win your own race`,
  });
}

async function sendNazPrivateAccessEmail(order: {
  id: string;
  email: string | null;
  name: string | null;
}) {
  if (!order.email) {
    console.warn(
      "Skipping NAZ Private Access email: missing customer email",
      order.id
    );
    return;
  }

  await resend.emails.send({
    from: EMAIL_FROM,
    to: order.email,
    subject: "NAZ Private Access — Access granted",
    html: nazPrivateAccessEmailHtml({
      customerName: order.name,
    }),
    text: `NAZ Private Access — Access granted

${order.name ? `Thank you, ${order.name}.` : "Thank you."}
You now have NAZ Private Access.

You will be informed first about future drops and will receive early access before the public release.

No discounts.
Just access, priority, and presence.

Go NAZ — Win your own race`,
  });
}

async function evaluateNazPrivateAccess(order: {
  id: string;
  email: string | null;
  name: string | null;
  nazPrivateAccess: boolean;
}) {
  if (!order.email) return;

  const email = order.email.toLowerCase().trim();

  const existingAccessOrder = await prisma.order.findFirst({
    where: {
      email,
      nazPrivateAccess: true,
    },
    select: {
      id: true,
      nazPrivateAccessEmailSentAt: true,
      nazPrivateAccessGrantedAt: true,
    },
  });

  if (existingAccessOrder) {
    if (!order.nazPrivateAccess) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          nazPrivateAccess: true,
          nazPrivateAccessGrantedAt:
            existingAccessOrder.nazPrivateAccessGrantedAt ?? new Date(),
        },
      });
    }
    return;
  }

  const paidOrders = await prisma.order.findMany({
    where: {
      email,
      paymentStatus: "paid",
    },
    select: {
      id: true,
      totalCents: true,
    },
  });

  const paidOrderCount = paidOrders.length;
  const totalSpentCents = paidOrders.reduce(
    (sum, item) => sum + (item.totalCents || 0),
    0
  );

  const qualifies =
    paidOrderCount >= NAZ_PRIVATE_ACCESS_MIN_ORDERS ||
    totalSpentCents >= NAZ_PRIVATE_ACCESS_MIN_SPEND_CENTS;

  if (!qualifies) return;

  const now = new Date();

  await prisma.order.updateMany({
    where: { email },
    data: {
      nazPrivateAccess: true,
      nazPrivateAccessGrantedAt: now,
    },
  });

  const alreadySentAccessEmail = await prisma.order.findFirst({
    where: {
      email,
      nazPrivateAccessEmailSentAt: {
        not: null,
      },
    },
    select: {
      id: true,
    },
  });

  if (!alreadySentAccessEmail) {
    await sendNazPrivateAccessEmail(order);

    await prisma.order.update({
      where: { id: order.id },
      data: {
        nazPrivateAccessEmailSentAt: now,
      },
    });
  }
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
        "Invalid fulfillment status. Allowed: unfulfilled, fulfilled, shipped, delivered, cancelled",
        { status: 400 }
      );
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        paymentStatus: true,
        fulfillmentStatus: true,
        shippingEmailSentAt: true,
        deliveredEmailSentAt: true,
        nazPrivateAccess: true,
      },
    });

    if (!existingOrder) {
      return new NextResponse("Order not found", { status: 404 });
    }

    const becameShipped =
      type === "fulfillment" &&
      status === "shipped" &&
      existingOrder.fulfillmentStatus !== "shipped";

    const becameDelivered =
      type === "fulfillment" &&
      status === "delivered" &&
      existingOrder.fulfillmentStatus !== "delivered";

    const data =
      type === "payment"
        ? { paymentStatus: status }
        : {
            fulfillmentStatus: status,
            ...(becameShipped ? { shippedAt: new Date() } : {}),
            ...(becameDelivered ? { deliveredAt: new Date() } : {}),
          };

    const updated = await prisma.order.update({
      where: { id },
      data,
      select: { paymentStatus: true, fulfillmentStatus: true },
    });

    const orderWithItems = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        paymentStatus: true,
        trackingNumber: true,
        trackingUrl: true,
        shippingCarrier: true,
        shippingEmailSentAt: true,
        deliveredEmailSentAt: true,
        nazPrivateAccess: true,
        items: {
          select: {
            quantity: true,
            size: true,
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!orderWithItems) {
      return NextResponse.json({ ok: true, ...updated });
    }

    if (orderWithItems.paymentStatus === "paid") {
      await evaluateNazPrivateAccess({
        id: orderWithItems.id,
        email: orderWithItems.email,
        name: orderWithItems.name,
        nazPrivateAccess: orderWithItems.nazPrivateAccess,
      });
    }

    const refreshedOrder = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        trackingNumber: true,
        trackingUrl: true,
        shippingCarrier: true,
        shippingEmailSentAt: true,
        deliveredEmailSentAt: true,
        nazPrivateAccess: true,
        items: {
          select: {
            quantity: true,
            size: true,
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!refreshedOrder) {
      return NextResponse.json({ ok: true, ...updated });
    }

    if (becameShipped && !refreshedOrder.shippingEmailSentAt) {
      await sendShippedEmail({
        id: refreshedOrder.id,
        email: refreshedOrder.email,
        name: refreshedOrder.name,
        trackingNumber: refreshedOrder.trackingNumber,
        trackingUrl: refreshedOrder.trackingUrl,
        shippingCarrier: refreshedOrder.shippingCarrier,
        nazPrivateAccess: refreshedOrder.nazPrivateAccess,
        items: refreshedOrder.items.map((item) => ({
          quantity: item.quantity,
          size: item.size,
          product: {
            name: item.product.name,
          },
        })),
      });

      await prisma.order.update({
        where: { id },
        data: {
          shippingEmailSentAt: new Date(),
        },
      });
    }

    if (becameDelivered && !refreshedOrder.deliveredEmailSentAt) {
      await sendDeliveredEmail({
        id: refreshedOrder.id,
        email: refreshedOrder.email,
        name: refreshedOrder.name,
      });

      await prisma.order.update({
        where: { id },
        data: {
          deliveredEmailSentAt: new Date(),
        },
      });
    }

    return NextResponse.json({ ok: true, ...updated });
  } catch (e: any) {
    console.error("Status update failed:", e);
    return new NextResponse(e?.message ?? "Failed to update order", {
      status: 500,
    });
  }
}