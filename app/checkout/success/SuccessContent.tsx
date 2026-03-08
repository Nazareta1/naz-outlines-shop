"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/app/cart/context";

type OrderItem = {
  id: string;
  name: string;
  priceCents: number;
  quantity: number;
  size: string | null;
};

type Order = {
  id: string;
  email: string | null;
  name: string | null;
  city: string | null;
  country: string | null;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  currency: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  items: OrderItem[];
};

function formatMoney(cents: number, currency: string) {
  const amount = (cents / 100).toFixed(2);
  const cur = (currency || "EUR").toUpperCase();
  return cur === "EUR" ? `€${amount}` : `${amount} ${cur}`;
}

export default function SuccessContent({
  sessionId,
}: {
  sessionId?: string;
}) {
  const { clearCart } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(Boolean(sessionId));
  const [error, setError] = useState<string | null>(null);
  const didClearCart = useRef(false);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      setError("Missing checkout session.");
      return;
    }

    let cancelled = false;

    async function loadOrder() {
      try {
        const res = await fetch(
          `/api/orders/by-session?session_id=${encodeURIComponent(sessionId)}`,
          {
            cache: "no-store",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load order.");
        }

        if (!cancelled) {
          setOrder(data.order);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load order.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadOrder();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  useEffect(() => {
    if (order && !didClearCart.current) {
      clearCart();
      didClearCart.current = true;
    }
  }, [order, clearCart]);

  if (loading) {
    return (
      <div className="naz-card rounded-[2rem] p-8 sm:p-10">
        <p className="naz-eyebrow mb-4">Order confirmed</p>
        <h1 className="text-3xl font-medium text-white sm:text-4xl">
          Loading your order...
        </h1>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="naz-card rounded-[2rem] p-8 sm:p-10">
        <p className="naz-eyebrow mb-4">Order confirmed</p>
        <h1 className="text-3xl font-medium text-white sm:text-4xl">
          Your payment was received.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-8 text-white/62">
          We could not load the full order details right now, but your checkout
          has been completed.
        </p>

        {error ? (
          <p className="mt-4 text-sm text-white/45">{error}</p>
        ) : null}

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link href="/products" className="naz-button">
            Continue shopping
          </Link>
          <Link href="/" className="naz-button-secondary">
            Back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="naz-card rounded-[2rem] p-8 sm:p-10">
        <p className="naz-eyebrow mb-4">Order confirmed</p>
        <h1 className="text-3xl font-medium text-white sm:text-4xl">
          Thank you for your order.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-8 text-white/65">
          Your NAZ order has been placed successfully and is now being prepared.
        </p>

        <div className="mt-8 grid gap-4 border-t border-white/10 pt-8 text-sm text-white/68">
          <div className="flex justify-between gap-4">
            <span>Order ID</span>
            <span className="text-right text-white">{order.id}</span>
          </div>

          <div className="flex justify-between gap-4">
            <span>Email</span>
            <span className="text-right text-white">
              {order.email || "—"}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span>Payment</span>
            <span className="text-right capitalize text-white">
              {order.paymentStatus}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span>Fulfillment</span>
            <span className="text-right capitalize text-white">
              {order.fulfillmentStatus}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span>Destination</span>
            <span className="text-right text-white">
              {[order.city, order.country].filter(Boolean).join(", ") || "—"}
            </span>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link href="/products" className="naz-button">
            Continue shopping
          </Link>
          <Link href="/" className="naz-button-secondary">
            Back home
          </Link>
        </div>
      </section>

      <aside className="naz-card rounded-[2rem] p-8 sm:p-10">
        <p className="naz-eyebrow mb-4">Summary</p>

        <div className="grid gap-5">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="border-b border-white/10 pb-5 last:border-b-0 last:pb-0"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-sm font-medium text-white">{item.name}</h2>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/45">
                    Size {item.size || "—"} · Qty {item.quantity}
                  </p>
                </div>

                <p className="text-sm text-white/72">
                  {formatMoney(item.priceCents * item.quantity, order.currency)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 border-t border-white/10 pt-6 text-sm text-white/68">
          <div className="flex justify-between gap-4">
            <span>Subtotal</span>
            <span>{formatMoney(order.subtotalCents, order.currency)}</span>
          </div>

          <div className="flex justify-between gap-4">
            <span>Shipping</span>
            <span>{formatMoney(order.shippingCents, order.currency)}</span>
          </div>

          <div className="flex justify-between gap-4 text-white">
            <span>Total</span>
            <span>{formatMoney(order.totalCents, order.currency)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}