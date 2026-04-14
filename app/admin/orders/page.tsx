import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatMoney(cents: number, currency: string) {
  const amount = (cents / 100).toFixed(2);
  return currency?.toUpperCase() === "EUR"
    ? `${amount} €`
    : `${amount} ${currency}`;
}

function statusBadge(status: string) {
  const s = (status || "").toLowerCase();

  if (s === "paid") return "bg-green-100 text-green-800 border-green-200";
  if (s === "pending") return "bg-yellow-100 text-yellow-800 border-yellow-200";
  if (s === "failed") return "bg-red-100 text-red-800 border-red-200";
  if (s === "refunded") return "bg-gray-100 text-gray-800 border-gray-200";

  if (s === "unfulfilled") return "bg-slate-100 text-slate-800 border-slate-200";
  if (s === "processing") return "bg-orange-100 text-orange-800 border-orange-200";
  if (s === "fulfilled") return "bg-blue-100 text-blue-800 border-blue-200";
  if (s === "shipped") return "bg-purple-100 text-purple-800 border-purple-200";
  if (s === "delivered") return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (s === "cancelled") return "bg-zinc-100 text-zinc-800 border-zinc-200";

  return "bg-slate-100 text-slate-800 border-slate-200";
}

function shortId(id?: string | null) {
  if (!id) return "—";
  return id.length > 18 ? `${id.slice(0, 10)}…${id.slice(-6)}` : id;
}

function buildQueryString(params: {
  paymentStatus?: string;
  fulfillmentStatus?: string;
  q?: string;
  sort?: string;
}) {
  const search = new URLSearchParams();

  if (params.paymentStatus && params.paymentStatus !== "all") {
    search.set("paymentStatus", params.paymentStatus);
  }

  if (params.fulfillmentStatus && params.fulfillmentStatus !== "all") {
    search.set("fulfillmentStatus", params.fulfillmentStatus);
  }

  if (params.q) {
    search.set("q", params.q);
  }

  if (params.sort && params.sort !== "new") {
    search.set("sort", params.sort);
  }

  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    paymentStatus?: string;
    fulfillmentStatus?: string;
    q?: string;
    sort?: string;
  }>;
}) {
  const params = await searchParams;

  const paymentStatus = params.paymentStatus || "all";
  const fulfillmentStatus = params.fulfillmentStatus || "all";
  const q = (params.q || "").trim();
  const sort = params.sort === "old" ? "old" : "new";

  const where = {
    ...(paymentStatus !== "all" ? { paymentStatus } : {}),
    ...(fulfillmentStatus !== "all" ? { fulfillmentStatus } : {}),
    ...(q
      ? {
          OR: [
            { id: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
            { name: { contains: q, mode: "insensitive" as const } },
            { stripeSessionId: { contains: q, mode: "insensitive" as const } },
            { stripePaymentId: { contains: q, mode: "insensitive" as const } },
            { trackingNumber: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const orders = await prisma.order.findMany({
    where,
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: sort === "old" ? "asc" : "desc",
    },
  });

  const totalOrders = orders.length;
  const paidOrders = orders.filter((o) => o.paymentStatus === "paid").length;
  const processingOrders = orders.filter(
    (o) => o.fulfillmentStatus === "processing"
  ).length;
  const shippedOrders = orders.filter(
    (o) => o.fulfillmentStatus === "shipped"
  ).length;

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-sm text-gray-500 mt-2">
            Manage payments, fulfillment, shipping, and order details.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/contact"
            className="inline-flex items-center px-3 py-2 rounded-lg border text-sm hover:bg-gray-50"
          >
            Contact Messages
          </Link>

          <Link
            href="/admin/private-drop"
            className="inline-flex items-center px-3 py-2 rounded-lg border text-sm hover:bg-gray-50"
          >
            Private Drop
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="text-xs uppercase tracking-wide text-gray-500">
            Total orders
          </div>
          <div className="mt-2 text-2xl font-bold">{totalOrders}</div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="text-xs uppercase tracking-wide text-gray-500">
            Paid
          </div>
          <div className="mt-2 text-2xl font-bold">{paidOrders}</div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="text-xs uppercase tracking-wide text-gray-500">
            Processing
          </div>
          <div className="mt-2 text-2xl font-bold">{processingOrders}</div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="text-xs uppercase tracking-wide text-gray-500">
            Shipped
          </div>
          <div className="mt-2 text-2xl font-bold">{shippedOrders}</div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm mb-8">
        <form className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">
              Search
            </label>
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Order ID, email, name..."
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">
              Payment status
            </label>
            <select
              name="paymentStatus"
              defaultValue={paymentStatus}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
            >
              <option value="all">All</option>
              <option value="pending">pending</option>
              <option value="paid">paid</option>
              <option value="failed">failed</option>
              <option value="refunded">refunded</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">
              Fulfillment status
            </label>
            <select
              name="fulfillmentStatus"
              defaultValue={fulfillmentStatus}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
            >
              <option value="all">All</option>
              <option value="unfulfilled">unfulfilled</option>
              <option value="processing">processing</option>
              <option value="fulfilled">fulfilled</option>
              <option value="shipped">shipped</option>
              <option value="delivered">delivered</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500 mb-2">
              Sort
            </label>
            <select
              name="sort"
              defaultValue={sort}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
            >
              <option value="new">Newest first</option>
              <option value="old">Oldest first</option>
            </select>
          </div>

          <div className="md:col-span-4 flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-black text-white text-sm hover:opacity-90"
            >
              Apply filters
            </button>

            <Link
              href="/admin/orders"
              className="inline-flex items-center px-4 py-2 rounded-lg border text-sm hover:bg-gray-50"
            >
              Reset
            </Link>
          </div>
        </form>
      </div>

      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left">
                <th className="p-4 font-semibold">Order</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Items</th>
                <th className="p-4 font-semibold">Payment</th>
                <th className="p-4 font-semibold">Fulfillment</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold">Created</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => {
                const itemCount = order.items.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                );

                return (
                  <tr key={order.id} className="border-b last:border-b-0 align-top">
                    <td className="p-4">
                      <div className="font-medium">{shortId(order.id)}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Session: {shortId(order.stripeSessionId)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Payment: {shortId(order.stripePaymentId)}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-medium">{order.name || "—"}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {order.email || "—"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.country || "—"}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-medium">{itemCount}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={item.id}>
                            {item.product?.name ?? item.name}
                            {item.size ? ` · ${item.size}` : ""}
                            {index === 1 && order.items.length > 2
                              ? " ..."
                              : ""}
                          </div>
                        ))}
                      </div>
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

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${statusBadge(
                          order.fulfillmentStatus
                        )}`}
                      >
                        {order.fulfillmentStatus}
                      </span>

                      {order.trackingNumber ? (
                        <div className="text-xs text-gray-500 mt-2">
                          Tracking: {order.trackingNumber}
                        </div>
                      ) : null}
                    </td>

                    <td className="p-4 font-semibold">
                      {formatMoney(order.totalCents, order.currency)}
                    </td>

                    <td className="p-4 text-gray-600">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col gap-2">
                        <Link
                          href={`/admin/orders/${order.id}${buildQueryString({
                            paymentStatus,
                            fulfillmentStatus,
                            q,
                            sort,
                          })}`}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg border text-xs hover:bg-gray-50"
                        >
                          Open
                        </Link>

                        <a
                          href={`/api/admin/orders/${order.id}/packing-slip`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center px-3 py-1.5 rounded-lg border text-xs hover:bg-gray-50"
                        >
                          Print slip
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    No orders found.
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