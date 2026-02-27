import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatMoney(cents: number, currency: string) {
  const amount = (cents / 100).toFixed(2);
  const cur = (currency || "EUR").toUpperCase();
  return cur === "EUR" ? `${amount} €` : `${amount} ${cur}`;
}

function badge(status: string) {
  const s = (status || "").toLowerCase();

  if (s === "paid") return "border-green-500/20 bg-green-500/10 text-green-200";
  if (s === "pending") return "border-yellow-500/20 bg-yellow-500/10 text-yellow-200";
  if (s === "failed") return "border-red-500/20 bg-red-500/10 text-red-200";
  if (s === "refunded") return "border-zinc-500/20 bg-zinc-500/10 text-zinc-200";

  if (s === "unfulfilled") return "border-white/10 bg-white/[0.03] text-white/70";
  if (s === "fulfilled") return "border-blue-500/20 bg-blue-500/10 text-blue-200";
  if (s === "shipped") return "border-purple-500/20 bg-purple-500/10 text-purple-200";
  if (s === "cancelled") return "border-zinc-500/20 bg-zinc-500/10 text-zinc-200";

  return "border-white/10 bg-white/[0.03] text-white/70";
}

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      createdAt: true,
      email: true,
      name: true,
      country: true,
      currency: true,
      totalCents: true,
      paymentStatus: true,
      fulfillmentStatus: true,
      shippingCarrier: true,
      trackingNumber: true,
      items: { select: { quantity: true } },
    },
  });

  const totalCount = orders.length;

  return (
    <main className="min-h-screen bg-[#0E0E10] text-[#F2F2F2]">
      <div className="mx-auto max-w-6xl px-6 pt-12 pb-24">
        {/* Header */}
        <div className="flex items-end justify-between gap-6 border-b border-white/10 pb-10">
          <div>
            <div className="text-xs tracking-[0.35em] uppercase text-white/45">
              Admin
            </div>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-[-0.02em] leading-[1.05]">
              Orders
            </h1>
            <div className="mt-4 text-sm text-white/55">
              Showing {totalCount} most recent
            </div>
          </div>

          <Link
            href="/"
            className="hidden sm:inline-flex text-[11px] tracking-[0.28em] uppercase text-white/70 hover:text-white transition"
          >
            Back to store →
          </Link>
        </div>

        {/* Empty */}
        {orders.length === 0 ? (
          <div className="mt-12 border border-white/10 bg-[#141416] rounded-[28px] p-10">
            <div className="text-xs tracking-[0.35em] uppercase text-white/45">
              Empty
            </div>
            <div className="mt-4 text-white/65">No orders yet.</div>
          </div>
        ) : (
          <div className="mt-12 overflow-hidden rounded-[28px] border border-white/10 bg-[#141416]">
            <div className="grid grid-cols-12 gap-3 border-b border-white/10 px-6 py-4 text-[11px] tracking-[0.28em] uppercase text-white/45">
              <div className="col-span-4">Order</div>
              <div className="col-span-3">Customer</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-1 text-right">Items</div>
            </div>

            {orders.map((o) => {
              const itemsCount = o.items.reduce((acc, it) => acc + it.quantity, 0);

              return (
                <Link
                  key={o.id}
                  href={`/admin/orders/${o.id}`}
                  className="block px-6 py-5 hover:bg-white/[0.04] transition border-b border-white/10 last:border-b-0"
                >
                  <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-4 min-w-0">
                      <div className="text-sm text-white/85 truncate">{o.id}</div>
                      <div className="mt-1 text-xs text-white/45">
                        {new Date(o.createdAt).toLocaleString()}
                        {o.country ? ` • ${o.country}` : ""}
                      </div>
                      {o.trackingNumber ? (
                        <div className="mt-1 text-xs text-white/45">
                          {o.shippingCarrier ? `${o.shippingCarrier} • ` : ""}{o.trackingNumber}
                        </div>
                      ) : null}
                    </div>

                    <div className="col-span-3 min-w-0">
                      <div className="text-sm text-white/80 truncate">
                        {o.name || "—"}
                      </div>
                      <div className="mt-1 text-xs text-white/45 truncate">
                        {o.email || "—"}
                      </div>
                    </div>

                    <div className="col-span-2 flex flex-col gap-2">
                      <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs ${badge(o.paymentStatus)}`}>
                        {o.paymentStatus}
                      </span>
                      <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs ${badge(o.fulfillmentStatus)}`}>
                        {o.fulfillmentStatus}
                      </span>
                    </div>

                    <div className="col-span-2 text-right">
                      <div className="text-sm font-semibold text-white/85">
                        {formatMoney(o.totalCents, o.currency)}
                      </div>
                      <div className="mt-1 text-xs text-white/45">
                        {o.currency}
                      </div>
                    </div>

                    <div className="col-span-1 text-right text-sm text-white/70">
                      {itemsCount}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-10 text-[11px] tracking-[0.28em] uppercase text-white/40">
          Controlled operations
        </div>
      </div>
    </main>
  );
}