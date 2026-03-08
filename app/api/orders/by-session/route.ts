import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return Response.json({ error: "Missing session_id" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { stripeSessionId: sessionId },
    include: {
      items: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!order) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }

  return Response.json({ order });
}