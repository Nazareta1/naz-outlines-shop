"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useCart } from "./context";

function eurFromCents(cents: number) {
  return (cents / 100).toFixed(2);
}

export default function CartPage() {
  const {
    items,
    subtotalCents,
    increment,
    decrement,
    removeFromCart,
    clearCart,
  } = useCart();

  const totalCents = subtotalCents;

  return (
    <main className="min-h-screen bg-[#0E0E10] text-[#F2F2F2]">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 pt-12 pb-24">
        {/* Header */}
        <div className="flex items-end justify-between gap-6 border-b border-white/10 pb-10">
          <div>
            <div className="text-xs tracking-[0.35em] uppercase text-white/45">
              Cart
            </div>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-[-0.02em] leading-[1.05]">
              Selected pieces
            </h1>
            <div className="mt-4 text-sm text-white/55">
              {items.length} {items.length === 1 ? "item" : "items"}
            </div>
          </div>

          <Link
            href="/products"
            className="hidden sm:inline-flex text-[11px] tracking-[0.28em] uppercase text-white/70 hover:text-white transition"
          >
            Continue shopping →
          </Link>
        </div>

        {/* Empty */}
        {items.length === 0 ? (
          <div className="mt-12 border border-white/10 bg-[#141416] rounded-[28px] p-10">
            <div className="text-xs tracking-[0.35em] uppercase text-white/45">
              Empty
            </div>
            <div className="mt-4 text-white/65 leading-relaxed">
              No items selected.
            </div>

            <div className="mt-10 flex gap-3">
              <Link
                href="/products"
                className="inline-flex items-center justify-center border border-white/15 bg-white/5 px-7 py-3 text-xs tracking-[0.28em] uppercase text-white/80 hover:bg-white/10 hover:text-white transition"
              >
                Explore
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center border border-white/10 bg-transparent px-7 py-3 text-xs tracking-[0.28em] uppercase text-white/60 hover:text-white/85 transition"
              >
                Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-12 grid gap-10 lg:grid-cols-12 items-start">
            {/* Items */}
            <div className="lg:col-span-7">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#141416]">
                {items.map((i, idx) => (
                  <div
                    key={i.id}
                    className={`p-6 md:p-7 ${idx === 0 ? "" : "border-t border-white/10"}`}
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="min-w-0">
                        <div className="text-sm tracking-[0.08em] text-white/90 truncate">
                          {i.name}
                        </div>
                        <div className="mt-1 text-[11px] tracking-[0.28em] uppercase text-white/45">
                          Smoke Black
                        </div>

                        <div className="mt-5 flex items-center gap-3">
                          <button
                            onClick={() => decrement(i.id)}
                            className="h-10 w-10 rounded-2xl border border-white/10 bg-white/[0.03] text-white/80 hover:bg-white/[0.06] hover:text-white transition"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>

                          <div className="w-10 text-center text-sm text-white/80">
                            {i.quantity}
                          </div>

                          <button
                            onClick={() => increment(i.id)}
                            className="h-10 w-10 rounded-2xl border border-white/10 bg-white/[0.03] text-white/80 hover:bg-white/[0.06] hover:text-white transition"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>

                          <button
                            onClick={() => removeFromCart(i.id)}
                            className="ml-2 text-[11px] tracking-[0.28em] uppercase text-white/45 hover:text-white/80 transition"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[11px] tracking-[0.28em] uppercase text-white/40">
                          Subtotal
                        </div>
                        <div className="mt-2 text-sm text-white/80">
                          €{eurFromCents(i.priceCents * i.quantity)}
                        </div>
                        <div className="mt-1 text-xs text-white/45">
                          €{eurFromCents(i.priceCents)} each
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <Link
                  href="/products"
                  className="text-[11px] tracking-[0.28em] uppercase text-white/70 hover:text-white transition"
                >
                  ← Back to shop
                </Link>

                <button
                  onClick={clearCart}
                  className="text-[11px] tracking-[0.28em] uppercase text-white/45 hover:text-white/80 transition"
                >
                  Clear cart
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-5">
              <div className="rounded-[28px] border border-white/10 bg-[#141416] p-7">
                <div className="text-xs tracking-[0.35em] uppercase text-white/45">
                  Summary
                </div>

                <div className="mt-6 grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-white/55">Subtotal</div>
                    <div className="text-sm text-white/80">
                      €{eurFromCents(subtotalCents)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-white/55">Shipping</div>
                    <div className="text-sm text-white/45">
                      Calculated at checkout
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4 flex items-end justify-between">
                    <div className="text-[11px] tracking-[0.28em] uppercase text-white/45">
                      Total
                    </div>
                    <div className="text-xl font-semibold text-white/85">
                      €{eurFromCents(totalCents)}
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid gap-3">
                  <Link
                    href="/checkout"
                    className="inline-flex items-center justify-center border border-white/15 bg-white/5 px-6 py-3 text-xs tracking-[0.28em] uppercase text-white/80 hover:bg-white/10 hover:text-white transition"
                  >
                    Continue to checkout →
                  </Link>

                  <div className="text-xs text-white/40 leading-relaxed">
                    No timers. No urgency. Controlled checkout.
                  </div>
                </div>
              </div>

              <div className="mt-6 text-[11px] tracking-[0.28em] uppercase text-white/40">
                Engineered for presence
              </div>
            </div>
          </div>
        )}
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-10 flex items-center justify-between">
          <div className="text-xs tracking-[0.35em] uppercase text-white/50">
            NAZ
          </div>
          <div className="text-xs text-white/35">
            © {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </main>
  );
}