"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "./context";

function formatMoney(cents: number, currency: string) {
  const amount = (cents / 100).toFixed(2);
  const cur = (currency || "EUR").toUpperCase();
  return cur === "EUR" ? `€${amount}` : `${amount} ${cur}`;
}

export default function CartPage() {
  const {
    items,
    subtotalCents,
    itemCount,
    removeFromCart,
    decreaseQuantity,
    increaseQuantity,
  } = useCart();

  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    if (items.length === 0) return;

    try {
      setLoading(true);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Checkout failed.");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("Something went wrong while starting checkout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-naz py-12 pb-20 md:py-16 md:pb-24">
      <div className="mb-8">
        <p className="naz-eyebrow mb-4">Cart</p>
        <h1 className="naz-heading-lg text-white">Your selection</h1>
      </div>

      {items.length === 0 ? (
        <div className="naz-card rounded-[2rem] p-8 sm:p-10">
          <h2 className="text-2xl font-medium text-white">Your cart is empty.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-white/62">
            Explore the current NAZ drop and add your piece to continue.
          </p>

          <div className="mt-8">
            <Link href="/products" className="naz-button">
              Shop now
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-4">
            {items.map((item) => (
              <article
                key={`${item.id}-${item.size}`}
                className="naz-card rounded-[2rem] p-5 sm:p-6"
              >
                <div className="flex flex-col gap-5 sm:flex-row">
                  <div className="relative h-28 w-28 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-contain p-3"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.24em] text-white/30">
                        NAZ
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-white/40">
                          NAZ
                        </p>
                        <h2 className="mt-2 text-lg font-medium text-white">
                          {item.name}
                        </h2>
                        <p className="mt-2 text-sm text-white/55">Size: {item.size}</p>
                      </div>

                      <p className="text-sm text-white/72">
                        {formatMoney(item.priceCents, item.currency)}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <div className="flex items-center rounded-full border border-white/10">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.id, item.size)}
                          className="px-4 py-2 text-sm text-white/75 transition hover:text-white"
                        >
                          −
                        </button>
                        <span className="min-w-10 text-center text-sm text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.id, item.size)}
                          className="px-4 py-2 text-sm text-white/75 transition hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-xs uppercase tracking-[0.22em] text-white/50 transition hover:text-white"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="h-fit naz-card rounded-[2rem] p-6 sm:p-8">
            <p className="naz-eyebrow mb-4">Summary</p>

            <div className="grid gap-4 text-sm text-white/68">
              <div className="flex justify-between gap-4">
                <span>Items</span>
                <span>{itemCount}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Subtotal</span>
                <span>{formatMoney(subtotalCents, "EUR")}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-6">
              <div className="flex justify-between gap-4">
                <span className="text-sm text-white/60">Estimated total</span>
                <span className="text-xl font-medium text-white">
                  {formatMoney(subtotalCents, "EUR")}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={loading}
              className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Redirecting..." : "Secure checkout"}
            </button>

            <Link
              href="/products"
              className="mt-4 inline-flex text-xs uppercase tracking-[0.22em] text-white/58 transition hover:text-white"
            >
              Continue shopping →
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}