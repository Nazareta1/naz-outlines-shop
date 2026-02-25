import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const body = await req.json().catch(() => ({}));

    const shippingCarrier = String(body?.shippingCarrier ?? "").trim();
    const trackingNumber = String(body?.trackingNumber ?? "").trim();
    const markShipped = Boolean(body?.markShipped);

    if (markShipped && !trackingNumber) {
      return new NextResponse("Tracking number is required to mark as shipped.", {
        status: 400,
      });
    }

    const data: any = {
      shippingCarrier: shippingCarrier || null,
      trackingNumber: trackingNumber || null,
    };

    if (markShipped) {
      data.fulfillmentStatus = "shipped";
      data.shippedAt = new Date();
    }

    const updated = await prisma.order.update({
      where: { id },
      data,
      select: {
        shippingCarrier: true,
        trackingNumber: true,
        shippedAt: true,
        fulfillmentStatus: true,
      },
    });

    return NextResponse.json({ ok: true, ...updated });
  } catch (e: any) {
    console.error("Shipping update failed:", e);
    return new NextResponse(e?.message ?? "Failed to update shipping", {
      status: 500,
    });
  }
}