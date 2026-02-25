// app/order/success/page.tsx
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
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const sessionIdRaw = Array.isArray(sp.session_id) ? sp.session_id[0] : sp.session_id;
  const session_id = (sessionIdRaw ?? "").trim();

  const order = session_id
    ? await prisma.order.findUnique({
        where: { stripeSessionId: session_id },
        include: {
          items: true,
        },
      })
    : null;

  const itemsTotal = order
    ? order.items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0)
    : 0;

  return (
    <main className="max-w-4xl mx-auto p-6 md:p-10">
      <div className="border rounded-2xl shadow-sm bg-white p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Payment successful ✅</h1>
            <p className="text-gray-600 mt-2">
              Ačiū! Užsakymas priimtas. Jei užsakymas dar neatsirado – perkrauk puslapį po kelių
              sekundžių (webhook gali užtrukti).
            </p>
          </div>

          <Link
            href="/products"
            className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"
          >
            Continue shopping →
          </Link>
        </div>

        {/* session id missing */}
        {!session_id && (
          <div className="mt-6 rounded-xl border p-4 text-sm text-gray-700">
            Trūksta <span className="font-mono">session_id</span>. Į šį puslapį reikia patekti po
            Stripe apmokėjimo per success linką.
          </div>
        )}

        {/* session id exists but order not found yet */}
        {session_id && !order && (
          <div className="mt-6 rounded-xl border p-4 text-sm text-gray-700">
            Užsakymo pagal šį <span className="font-mono">session_id</span> dar nerasta.
            <div className="text-gray-500 mt-1">
              Session: <span className="font-mono">{shortId(session_id)}</span>
            </div>
            <div className="mt-3 flex gap-3">
              <Link
                href={`/order/success?session_id=${encodeURIComponent(session_id)}`}
                className="inline-flex items-center px-3 py-1.5 rounded-lg border text-sm hover:bg-gray-50"
              >
                Refresh
              </Link>
              <Link
                href="/"
                className="inline-flex items-center px-3 py-1.5 rounded-lg border text-sm hover:bg-gray-50"
              >
                Back home
              </Link>
            </div>
          </div>
        )}

        {/* order found */}
        {order && (
          <div className="mt-6 space-y-6">
            <div className="rounded-2xl border p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm text-gray-500">Order</div>
                  <div className="font-mono text-sm">{order.id}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Stripe session: <span className="font-mono">{shortId(order.stripeSessionId)}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-500">Total</div>
                  <div className="text-lg font-semibold">
                    {formatMoney(order.totalCents, order.currency)}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Shipping */}
              <div className="rounded-2xl border p-5">
                <div className="font-semibold mb-2">Shipping</div>
                <div className="text-sm text-gray-700 space-y-1">
                  <div>{order.name || "—"}</div>
                  <div className="text-gray-500">{order.email || "—"}</div>
                  <div className="text-gray-500">{order.phone || "—"}</div>

                  <div className="pt-3">
                    <div>{order.addressLine1 || "—"}</div>
                    {order.addressLine2 ? <div>{order.addressLine2}</div> : null}
                    <div>
                      {order.postalCode || "—"} {order.city || ""}
                    </div>
                    <div>{order.region || "—"}</div>
                    <div>{order.country || "—"}</div>
                  </div>
                </div>
              </div>

              {/* Totals */}
              <div className="rounded-2xl border p-5">
                <div className="font-semibold mb-2">Totals</div>
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

            {/* Items */}
            <div className="rounded-2xl border p-5">
              <div className="font-semibold mb-3">Items</div>
              <div className="space-y-3">
                {order.items.map((it) => (
                  <div
                    key={it.id}
                    className="flex items-center justify-between gap-3 border-b last:border-b-0 pb-3 last:pb-0"
                  >
                    <div>
                      <div className="font-medium">{it.name}</div>
                      <div className="text-xs text-gray-500">
                        Qty: {it.quantity} • {formatMoney(it.priceCents, order.currency)} each
                      </div>
                    </div>
                    <div className="font-semibold">
                      {formatMoney(it.priceCents * it.quantity, order.currency)}
                    </div>
                  </div>
                ))}

                {order.items.length === 0 && (
                  <div className="text-sm text-gray-500">No items found for this order.</div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex sm:hidden items-center px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"
              >
                Continue shopping →
              </Link>

              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 rounded-lg border hover:bg-gray-50"
              >
                Back to home
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}