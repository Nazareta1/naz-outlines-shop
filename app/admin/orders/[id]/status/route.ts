import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED = new Set(["paid", "fulfilled", "shipped", "refunded"]);

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Next 16: params yra Promise, reikia await
    const { id } = await context.params;

    const body = await req.json().catch(() => ({}));
    const status = String(body?.status ?? "").toLowerCase();

    if (!ALLOWED.has(status)) {
      return new NextResponse(
        "Invalid status. Allowed: paid, fulfilled, shipped, refunded",
        { status: 400 }
      );
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { paymentStatus: status },
    });

    return NextResponse.json({ ok: true, status: updated.paymentStatus });
  } catch (e: any) {
    console.error("Status update failed:", e);
    return new NextResponse(e?.message ?? "Failed to update order", {
      status: 500,
    });
  }
}