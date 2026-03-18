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

    const isPrivateDrop = Boolean(body?.isPrivateDrop);
    const rawDropSlug =
      typeof body?.dropSlug === "string" ? body.dropSlug.trim() : "";
    const dropSlug = rawDropSlug || null;

    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    if (isPrivateDrop && !dropSlug) {
      return new NextResponse(
        "dropSlug is required when private drop is enabled",
        { status: 400 }
      );
    }

    await prisma.product.update({
      where: { id },
      data: {
        isPrivateDrop,
        dropSlug: isPrivateDrop ? dropSlug : null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Private drop update failed:", e);
    return new NextResponse(e?.message ?? "Failed to update private drop", {
      status: 500,
    });
  }
}