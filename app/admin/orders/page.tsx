import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAYMENT_ALLOWED = new Set(["pending", "paid", "failed", "refunded"]);
const FULFILL_ALLOWED = new Set(["unfulfilled", "fulfilled", "shipped", "cancelled"]);

function statusBadge(status: string) {
  const s = (status || "").toLowerCase();

  // payment
  if (s === "paid") return "bg-green-100 text-green-800 border-green-200";
  if (s === "pending") return "bg-yellow-100 text-yellow-800 border-yellow-200";
  if (s === "failed") return "bg-red-100 text-red-800 border-red-200";
  if (s === "refunded") return "bg-gray-100 text-gray-800 border-gray-200";

  // fulfillment
  if (s === "unfulfilled") return "bg-slate-100 text-slate-800 border-slate-200";
  if (s === "fulfilled") return "bg-blue-100 text-blue-800 border-blue-200";
  if (s === "shipped") return "bg-purple-100 text-purple-800 border-purple-200";
  if (s === "cancelled") return "bg-zinc-100 text-zinc-800 border-zinc-200";

  return "bg-slate-100 text-slate-800 border-slate-200";
}

function formatMoney(cents: number, currency: string) {
  const amount = (cents / 100).toFixed(2);
  return currency?.toUpperCase() === "EUR" ? `${amount} €` : `${amount} ${currency}`;
}

function qs(obj: Record<string, string | undefined>) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(obj)) {
    if (v && v.trim() !== "") p.set(k, v);
  }
  const s = p.toString();
  return s ? `?${s}` : "";
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};

  const paymentRaw = Array.isArray(sp.payment) ? sp.payment[0] : sp.payment;
  const fulfillmentRaw = Array.isArray(sp.fulfillment) ? sp.fulfillment[0] : sp.fulfillment;
  const qRaw = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const sortRaw = Array.isArray(sp.sort) ? sp.sort[0] : sp.sort;

  const payment =
    paymentRaw && PAYMENT_ALLOWED.has(paymentRaw.toLowerCase())
      ? paymentRaw.toLowerCase()
      : "";

  const fulfillment =
    fulfillmentRaw && FULFILL_ALLOWED.has(fulfillmentRaw.toLowerCase())
      ? fulfillmentRaw.toLowerCase()
      : "";

  const q = (qRaw ?? "").trim();
  const sort = (sortRaw ?? "new").toLowerCase() === "old" ? "old" : "new";

  const where: any = {};

  if (payment) where.paymentStatus = payment;
  if (fulfillment) where.fulfillmentStatus = fulfillment;

  if (q) {
    // paieška pagal id / email / name / stripeSessionId / stripePaymentId
    where.OR = [
      { id: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { name: { contains: q, mode: "insensitive" } },
      { stripeSessionId: { contains: q, mode: "insensitive" } },
      { stripePaymentId: { contains: q, mode: "insensitive" } },
    ];
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: sort === "old" ? "asc" : "desc" },
    take: 50,
    include: {
      items: true,
    },
  });

  const activeQuery = { payment, fulfillment, q, sort };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <div className="flex items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <div className="text-sm text-gray-500">Showing up to 50 results</div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center px-3 py-1.5 rounded-lg border text-sm hover:bg-gray-50"
        >
          ← Back to shop
        </Link>
      </div>

      {/* Filters */}
      <div className="border rounded-2xl bg-white p-4 md:p-5 shadow-sm mb-6">
        <form className="grid md:grid-cols-4 gap-3" method="get">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Search</label>
            <input
              name="q"
              defaultValue={q}
              placeholder="Order id, email, name…"
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Payment</label>
            <select
              name="payment"
              defaultValue={payment}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All</option>
              <option value="pending">pending</option>
              <option value="paid">paid</option>
              <option value="failed">failed</option>
              <option value="refunded">refunded</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Fulfillment</label>
            <select
              name="fulfillment"
              defaultValue={fulfillment}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All</option>
              <option value="unfulfilled">unfulfilled</option>
              <option value="fulfilled">fulfilled</option>
              <option value="shipped">shipped</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Sort</label>
            <div className="flex gap-2">
              <select
                name="sort"
                defaultValue={sort}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="new">newest first</option>
                <option value="old">oldest first</option>
              </select>

              <button className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50">
                Apply
              </button>
            </div>
          </div>
        </form>

        <div className="flex flex-wrap gap-2 mt-4">
          <Link
            href={qs({ ...activeQuery, payment: "paid" })}
            className="px-3 py-1.5 rounded-full border text-xs hover:bg-gray-50"
          >
            Paid
          </Link>
          <Link
            href={qs({ ...activeQuery, fulfillment: "unfulfilled" })}
            className="px-3 py-1.5 rounded-full border text-xs hover:bg-gray-50"
          >
            Unfulfilled
          </Link>
          <Link
            href={qs({ ...activeQuery, fulfillment: "shipped" })}
            className="px-3 py-1.5 rounded-full border text-xs hover:bg-gray-50"
          >
            Shipped
          </Link>
          <Link
            href={qs({ ...activeQuery, payment: "", fulfillment: "", q: "", sort: "new" })}
            className="px-3 py-1.5 rounded-full border text-xs hover:bg-gray-50"
          >
            Reset
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-2xl shadow-sm bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left">
                <th className="p-3 font-semibold">Order</th>
                <th className="p-3 font-semibold">Customer</th>
                <th className="p-3 font-semibold">Payment</th>
                <th className="p-3 font-semibold">Fulfillment</th>
                <th className="p-3 font-semibold">Total</th>
                <th className="p-3 font-semibold">Created</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((o) => {
                const itemsCount = o.items.reduce((sum, it) => sum + it.quantity, 0);

                return (
                  <tr key={o.id} className="border-b last:border-b-0 hover:bg-gray-50/40">
                    <td className="p-3">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="font-medium hover:underline"
                      >
                        {o.id.slice(0, 8)}…
                      </Link>
                      <div className="text-xs text-gray-500">{itemsCount} item(s)</div>
                    </td>

                    <td className="p-3">
                      <div className="text-sm">{o.name || "—"}</div>
                      <div className="text-xs text-gray-500">{o.email || "—"}</div>
                    </td>

                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${statusBadge(
                          o.paymentStatus
                        )}`}
                      >
                        {o.paymentStatus}
                      </span>
                    </td>

                    <td className="p-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${statusBadge(
                          o.fulfillmentStatus
                        )}`}
                      >
                        {o.fulfillmentStatus}
                      </span>
                    </td>

                    <td className="p-3 font-semibold">
                      {formatMoney(o.totalCents, o.currency)}
                    </td>

                    <td className="p-3 text-gray-600">
                      {new Date(o.createdAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })}

              {orders.length === 0 && (
                <tr>
                  <td className="p-6 text-gray-500" colSpan={6}>
                    No orders match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}