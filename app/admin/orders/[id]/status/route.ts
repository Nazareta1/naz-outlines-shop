import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAYMENT_ALLOWED = new Set(["pending", "paid", "failed", "refunded"]);
const FULFILL_ALLOWED = new Set(["unfulfilled", "fulfilled", "shipped", "cancelled"]);

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
      return new NextResponse("Invalid type. Allowed: payment, fulfillment", { status: 400 });
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

    const data =
      type === "payment"
        ? { paymentStatus: status }
        : { fulfillmentStatus: status };

    const updated = await prisma.order.update({
      where: { id },
      data,
      select: { paymentStatus: true, fulfillmentStatus: true },
    });

    return NextResponse.json({ ok: true, ...updated });
  } catch (e: any) {
    console.error("Status update failed:", e);
    return new NextResponse(e?.message ?? "Failed to update order", { status: 500 });
  }
}