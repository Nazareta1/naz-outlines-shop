import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StatusForm from "./StatusForm";

export const runtime = "nodejs"; // ✅ PRISMAI būtina Node runtime
export const dynamic = "force-dynamic";

function formatMoney(cents: number, currency: string) {
  const amount = (cents / 100).toFixed(2);
  return currency?.toUpperCase() === "EUR"
    ? `${amount} €`
    : `${amount} ${currency}`;
}

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

function shortId(id?: string | null) {
  if (!id) return "—";
  return id.length > 16 ? `${id.slice(0, 10)}…${id.slice(-6)}` : id;
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      return (
        <div className="max-w-4xl mx-auto p-10">
          <div className="mb-6">
            <Link
              href="/admin/orders"
              className="inline-flex items-center px-3 py-1.5 rounded-lg border text-sm hover:bg-gray-50"
            >
              ← Back to orders
            </Link>
          </div>

          <h1 className="text-2xl font-bold">Order not found</h1>
          <div className="text-sm text-gray-500 mt-2">ID: {id}</div>
        </div>
      );
    }

    const itemsTotal = order.items.reduce(
      (sum, i) => sum + i.priceCents * i.quantity,
      0
    );

    return (
      <div className="max-w-5xl mx-auto p-6 md:p-10">
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            href="/admin/orders"
            className="inline-flex items-center px-3 py-1.5 rounded-lg border text-sm hover:bg-gray-50"
          >
            ← Back
          </Link>

          {/* ✅ 2 statusai: Payment + Fulfillment */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${statusBadge(
                  order.paymentStatus
                )}`}
              >
                {order.paymentStatus}
              </span>

              <StatusForm
                orderId={order.id}
                type="payment"
                initialStatus={order.paymentStatus}
              />
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${statusBadge(
                  order.fulfillmentStatus
                )}`}
              >
                {order.fulfillmentStatus}
              </span>

              <StatusForm
                orderId={order.id}
                type="fulfillment"
                initialStatus={order.fulfillmentStatus}
              />
            </div>
          </div>
        </div>

        <div className="border rounded-2xl shadow-sm bg-white p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2">Order {order.id}</h1>
          <div className="text-sm text-gray-600">
            Created: {new Date(order.createdAt).toLocaleString()}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Customer</h2>
              <div className="text-sm text-gray-700 space-y-1">
                <div>
                  <span className="text-gray-500">Name:</span>{" "}
                  {order.name || "—"}
                </div>
                <div>
                  <span className="text-gray-500">Email:</span>{" "}
                  {order.email || "—"}
                </div>
                <div>
                  <span className="text-gray-500">Phone:</span>{" "}
                  {order.phone || "—"}
                </div>
              </div>

              <h2 className="text-lg font-semibold mt-6 mb-2">
                Shipping address
              </h2>
              <div className="text-sm text-gray-700 space-y-1">
                <div>{order.addressLine1 || "—"}</div>
                {order.addressLine2 ? <div>{order.addressLine2}</div> : null}
                <div>
                  {order.postalCode || "—"} {order.city || ""}
                </div>
                <div>{order.region || "—"}</div>
                <div>{order.country || "—"}</div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Payment</h2>
              <div className="text-sm text-gray-700 space-y-1">
                <div>
                  <span className="text-gray-500">Stripe session:</span>{" "}
                  {shortId(order.stripeSessionId)}
                </div>
                <div>
                  <span className="text-gray-500">Stripe payment:</span>{" "}
                  {shortId(order.stripePaymentId)}
                </div>
                <div>
                  <span className="text-gray-500">Currency:</span>{" "}
                  {order.currency}
                </div>
              </div>

              <h2 className="text-lg font-semibold mt-6 mb-2">Totals</h2>
              <div className="text-sm text-gray-700 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Items total</span>
                  <span>{formatMoney(itemsTotal, order.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatMoney(order.subtotalCents, order.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span>{formatMoney(order.shippingCents, order.currency)}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>{formatMoney(order.totalCents, order.currency)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border rounded-2xl shadow-sm bg-white p-6">
          <h2 className="text-xl font-bold mb-4">Items</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left">
                  <th className="p-3 font-semibold">Product</th>
                  <th className="p-3 font-semibold">Qty</th>
                  <th className="p-3 font-semibold">Price</th>
                  <th className="p-3 font-semibold">Line total</th>
                </tr>
              </thead>

              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b last:border-b-0">
                    <td className="p-3">
                      <div className="font-medium">
                        {item.product?.name ?? item.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        Product ID: {item.productId}
                      </div>
                    </td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3">
                      {formatMoney(item.priceCents, order.currency)}
                    </td>
                    <td className="p-3 font-semibold">
                      {formatMoney(
                        item.priceCents * item.quantity,
                        order.currency
                      )}
                    </td>
                  </tr>
                ))}

                {order.items.length === 0 && (
                  <tr>
                    <td className="p-4 text-gray-500" colSpan={4}>
                      No items found for this order.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  } catch (e: any) {
    console.error("Admin order detail page crashed:", e);

    return (
      <div className="max-w-4xl mx-auto p-10">
        <div className="mb-6">
          <Link
            href="/admin/orders"
            className="inline-flex items-center px-3 py-1.5 rounded-lg border text-sm hover:bg-gray-50"
          >
            ← Back to orders
          </Link>
        </div>

        <h1 className="text-2xl font-bold">Server error</h1>
        <p className="text-sm text-gray-600 mt-2">
          Open Vercel logs to see the exact Prisma/DB error.
        </p>
        <p className="text-xs text-gray-500 mt-4">Order ID: {id}</p>
      </div>
    );
  }
}