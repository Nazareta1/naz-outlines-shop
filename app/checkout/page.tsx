"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useCart } from "../cart/context";

function eurFromCents(cents: number) {
  return (cents / 100).toFixed(2);
}

export default function CheckoutPage() {
  const { items, subtotalCents } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const itemCount = useMemo(
    () => items.reduce((acc, it) => acc + it.quantity, 0),
    [items]
  );

  useEffect(() => {
    // Jei norėsi griežto flow vėliau:
    // if (items.length === 0) router.push("/cart");
  }, [items.length, router]);

  const startCheckout = async () => {
    if (items.length === 0) return;

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.id,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create checkout session");
      if (!data?.url) throw new Error("Missing Stripe session URL");

      window.location.href = data.url;
    } catch (e: any) {
      setError(e?.message || "Checkout failed");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0E0E10] text-[#F2F2F2]">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 pt-12 pb-24">
        <div className="flex items-end justify-between gap-6 border-b border-white/10 pb-10">
          <div>
            <div className="text-xs tracking-[0.35em] uppercase text-white/45">
              Checkout
            </div>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-[-0.02em] leading-[1.05]">
              Secure payment
            </h1>
            <div className="mt-4 text-sm text-white/55">
              Redirect to Stripe. Controlled flow.
            </div>
          </div>

          <Link
            href="/cart"
            className="hidden sm:inline-flex text-[11px] tracking-[0.28em] uppercase text-white/70 hover:text-white transition"
          >
            Back to cart →
          </Link>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 items-start">
          <div className="lg:col-span-7">
            <div className="rounded-[28px] border border-white/10 bg-[#141416] p-7">
              <div className="text-xs tracking-[0.35em] uppercase text-white/45">
                Order summary
              </div>

              <div className="mt-6 grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white/55">Items</div>
                  <div className="text-sm text-white/80">{itemCount}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-white/55">Subtotal</div>
                  <div className="text-sm text-white/80">
                    €{eurFromCents(subtotalCents)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-white/55">Shipping</div>
                  <div className="text-sm text-white/45">Calculated in Stripe</div>
                </div>

                <div className="border-t border-white/10 pt-4 flex items-end justify-between">
                  <div className="text-[11px] tracking-[0.28em] uppercase text-white/45">
                    Total
                  </div>
                  <div className="text-xl font-semibold text-white/85">
                    €{eurFromCents(subtotalCents)}
                  </div>
                </div>
              </div>

              {items.length === 0 && (
                <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="text-[11px] tracking-[0.28em] uppercase text-white/45">
                    No items
                  </div>
                  <div className="mt-2 text-sm text-white/60">
                    Cart is empty. Return to shop to select a piece.
                  </div>

                  <div className="mt-6">
                    <Link
                      href="/products"
                      className="inline-flex items-center justify-center border border-white/15 bg-white/5 px-6 py-3 text-xs tracking-[0.28em] uppercase text-white/80 hover:bg-white/10 hover:text-white transition"
                    >
                      Explore
                    </Link>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="text-[11px] tracking-[0.28em] uppercase text-white/45">
                    Error
                  </div>
                  <div className="mt-2 text-sm text-white/60 leading-relaxed">
                    {error}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 text-[11px] tracking-[0.28em] uppercase text-white/40">
              No timers. No urgency. No noise.
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-[28px] border border-white/10 bg-[#141416] p-7">
              <div className="text-xs tracking-[0.35em] uppercase text-white/45">
                Payment
              </div>

              <div className="mt-6 text-sm text-white/60 leading-relaxed">
                You’ll be redirected to Stripe to complete payment securely.
                After payment, you return automatically.
              </div>

              <div className="mt-8 grid gap-3">
                <button
                  onClick={startCheckout}
                  disabled={loading || items.length === 0}
                  className="inline-flex items-center justify-center border border-white/15 bg-white/5 px-6 py-3 text-xs tracking-[0.28em] uppercase text-white/80 hover:bg-white/10 hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? "Redirecting…" : "Continue to Stripe →"}
                </button>

                <Link
                  href="/cart"
                  className="inline-flex items-center justify-center border border-white/10 bg-transparent px-6 py-3 text-xs tracking-[0.28em] uppercase text-white/60 hover:text-white/85 transition"
                >
                  Back
                </Link>
              </div>

              <div className="mt-8 border-t border-white/10 pt-6 grid gap-2 text-xs text-white/45">
                <div className="flex justify-between">
                  <span className="tracking-[0.28em] uppercase">Method</span>
                  <span className="text-white/55">Card / Apple Pay (Stripe)</span>
                </div>
                <div className="flex justify-between">
                  <span className="tracking-[0.28em] uppercase">Security</span>
                  <span className="text-white/55">Stripe hosted checkout</span>
                </div>
              </div>
            </div>

            <div className="mt-6 text-[11px] tracking-[0.28em] uppercase text-white/40">
              Engineered for presence
            </div>
          </div>
        </div>
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