import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatMoney(cents: number, currency: string) {
  const amount = (cents / 100).toFixed(2);
  // pas tave currency default "EUR", bet paliekam universalų
  return currency?.toUpperCase() === "EUR" ? `${amount} €` : `${amount} ${currency}`;
}

function shortId(id: string) {
  if (!id) return "";
  return id.length > 10 ? `${id.slice(0, 6)}…${id.slice(-4)}` : id;
}

function statusBadge(status: string) {
  const s = (status || "").toLowerCase();

  if (s === "paid") {
    return "bg-green-100 text-green-800 border-green-200";
  }
  if (s === "pending") {
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  }
  if (s === "failed") {
    return "bg-red-100 text-red-800 border-red-200";
  }
  if (s === "refunded") {
    return "bg-gray-100 text-gray-800 border-gray-200";
  }
  return "bg-slate-100 text-slate-800 border-slate-200";
}

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin – Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            Total orders: {orders.length}
          </p>
        </div>

        <div className="text-sm text-gray-500">
          {/* vieta ateityje filtrams/search */}
        </div>
      </div>

      <div className="overflow-x-auto border rounded-2xl shadow-sm bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left">
              <th className="p-4 font-semibold">Order</th>
              <th className="p-4 font-semibold">Customer</th>
              <th className="p-4 font-semibold">Items</th>
              <th className="p-4 font-semibold">Total</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold"></th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => {
              const itemsCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

              return (
                <tr key={order.id} className="border-b last:border-b-0">
                  <td className="p-4">
                    <div className="font-medium">{shortId(order.id)}</div>
                    <div className="text-xs text-gray-500">
                      session: {order.stripeSessionId ? shortId(order.stripeSessionId) : "—"}
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="font-medium">{order.name || "—"}</div>
                    <div className="text-xs text-gray-500">{order.email || "—"}</div>
                    <div className="text-xs text-gray-500">{order.phone || "—"}</div>
                  </td>

                  <td className="p-4">
                    <div className="font-medium">{itemsCount}</div>
                    <div className="text-xs text-gray-500">
                      {order.items.slice(0, 2).map((i) => i.name).join(", ")}
                      {order.items.length > 2 ? "…" : ""}
                    </div>
                  </td>

                  <td className="p-4 font-semibold">
                    {formatMoney(order.totalCents, order.currency)}
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${statusBadge(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>

                  <td className="p-4 text-gray-700">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>

                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg border text-sm hover:bg-gray-50"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              );
            })}

            {orders.length === 0 && (
              <tr>
                <td className="p-6 text-gray-500" colSpan={7}>
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Tip: next step – add order detail page + status update (fulfilled/shipped).
      </p>
    </div>
  );
}