import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs"; // Prisma needs Node runtime on Vercel
export const dynamic = "force-dynamic";

function formatMoney(cents: number, currency: string) {
  const amount = (cents / 100).toFixed(2);
  return currency?.toUpperCase() === "EUR" ? `${amount} €` : `${amount} ${currency}`;
}

function shortId(id?: string | null) {
  if (!id) return "—";
  return id.length > 16 ? `${id.slice(0, 10)}…${id.slice(-6)}` : id;
}

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const sessionId = session_id?.trim();

  if (!sessionId) {
    return (
      <div className="max-w-3xl mx-auto p-6 md:p-10">
        <h1 className="text-2xl font-bold">Missing session</h1>
        <p className="text-sm text-gray-600 mt-2">
          This page needs <span className="font-medium">session_id</span> in the URL.
        </p>
        <div className="mt-6">
          <Link
            href="/products"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm hover:bg-gray-50"
          >
            ← Back to shop
          </Link>
        </div>
      </div>
    );
  }

  try {
    const order = await prisma.order.findFirst({
      where: { stripeSessionId: sessionId },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      return (
        <div className="max-w-3xl mx-auto p-6 md:p-10">
          <h1 className="text-2xl font-bold">Thank you! ✅</h1>
          <p className="text-sm text-gray-600 mt-2">
            Payment session received, but we couldn’t find the order in our database yet.
            This can happen if the webhook is still processing.
          </p>

          <div className="border rounded-2xl bg-white shadow-sm p-5 mt-6">
            <div className="text-sm text-gray-700">
              <span className="text-gray-500">Session:</span> {shortId(sessionId)}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Try refreshing in a minute.
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            <Link
              href="/products"
              className="inline-flex items-center px-4 py-2 rounded-lg border text-sm hover:bg-gray-50"
            >
              ← Back to shop
            </Link>
            <Link
              href={`/order/success?session_id=${encodeURIComponent(sessionId)}`}
              className="inline-flex items-center px-4 py-2 rounded-lg border text-sm hover:bg-gray-50"
            >
              Refresh
            </Link>
          </div>
        </div>
      );
    }

    const itemsTotal = order.items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);

    return (
      <div className="max-w-5xl mx-auto p-6 md:p-10">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Order confirmed ✅</h1>
            <p className="text-sm text-gray-600 mt-2">
              Thanks, {order.name || "friend"}! We’ve received your order.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm hover:bg-gray-50"
          >
            ← Back to shop
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Items */}
          <div className="lg:col-span-2 border rounded-2xl shadow-sm bg-white p-6">
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
                        <div className="font-medium">{item.product?.name ?? item.name}</div>
                      </td>
                      <td className="p-3">{item.quantity}</td>
                      <td className="p-3">{formatMoney(item.priceCents, order.currency)}</td>
                      <td className="p-3 font-semibold">
                        {formatMoney(item.priceCents * item.quantity, order.currency)}
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

          {/* Right: Summary */}
          <div className="border rounded-2xl shadow-sm bg-white p-6">
            <h2 className="text-xl font-bold mb-4">Summary</h2>

            <div className="text-sm text-gray-700 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Order ID</span>
                <span className="font-medium">{shortId(order.id)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Created</span>
                <span>{new Date(order.createdAt).toLocaleString()}</span>
              </div>

              <div className="flex justify-between pt-3 border-t">
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

              <div className="flex justify-between font-semibold pt-3 border-t">
                <span>Total</span>
                <span>{formatMoney(order.totalCents, order.currency)}</span>
              </div>
            </div>

            <h3 className="text-sm font-semibold mt-6 mb-2">Shipping to</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <div>{order.addressLine1 || "—"}</div>
              {order.addressLine2 ? <div>{order.addressLine2}</div> : null}
              <div>
                {order.postalCode || "—"} {order.city || ""}
              </div>
              <div>{order.region || "—"}</div>
              <div>{order.country || "—"}</div>
            </div>

            <div className="mt-6 text-xs text-gray-500">
              Session: <span className="font-medium">{shortId(order.stripeSessionId)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (e: any) {
    console.error("Order success page crashed:", e);

    return (
      <div className="max-w-3xl mx-auto p-6 md:p-10">
        <h1 className="text-2xl font-bold">Server error</h1>
        <p className="text-sm text-gray-600 mt-2">
          Open Vercel logs to see the exact Prisma/DB error.
        </p>
        <div className="mt-6">
          <Link
            href="/products"
            className="inline-flex items-center px-4 py-2 rounded-lg border text-sm hover:bg-gray-50"
          >
            ← Back to shop
          </Link>
        </div>
      </div>
    );
  }
}