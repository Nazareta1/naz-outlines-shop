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

function formatStatus(value: string) {
  if (!value) return "—";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
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
          `/api/orders/by-session?session_id=${encodeURIComponent(sessionId ?? "")}`,
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
        <h1 className="text-3xl font-medium tracking-[-0.03em] text-white sm:text-4xl">
          Preparing your order details...
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-8 text-white/62">
          Your checkout has been completed successfully.
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="naz-card rounded-[2rem] p-8 sm:p-10">
        <p className="naz-eyebrow mb-4">Order confirmed</p>
        <h1 className="text-3xl font-medium tracking-[-0.03em] text-white sm:text-4xl">
          Your payment was received.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-8 text-white/62">
          Your checkout was completed successfully, although the full order
          details could not be displayed at this moment.
        </p>

        {error ? (
          <p className="mt-4 text-sm text-white/45">{error}</p>
        ) : null}

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link href="/products" className="naz-button">
            Shop more pieces
          </Link>
          <Link href="/" className="naz-button-secondary">
            Back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
      <section className="grid gap-8">
        <div className="naz-card rounded-[2rem] p-8 sm:p-10">
          <p className="naz-eyebrow mb-4">Order confirmed</p>

          <h1 className="text-3xl font-medium tracking-[-0.03em] text-white sm:text-4xl">
            Thank you for your order.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-8 text-white/65">
            Your NAZ piece has been secured successfully. A confirmation email
            has been sent, and your order is now moving into preparation.
          </p>

          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/42">
              NAZ
            </p>
            <p className="mt-3 text-lg font-medium tracking-[-0.02em] text-white">
              Quiet confidence. Controlled presence. Energy that stays.
            </p>
          </div>

          <div className="mt-8 grid gap-4 border-t border-white/10 pt-8 text-sm text-white/68">
            <InfoRow label="Order ID" value={order.id} />
            <InfoRow label="Email" value={order.email || "—"} />
            <InfoRow label="Payment" value={formatStatus(order.paymentStatus)} />
            <InfoRow
              label="Fulfillment"
              value={formatStatus(order.fulfillmentStatus)}
            />
            <InfoRow
              label="Destination"
              value={[order.city, order.country].filter(Boolean).join(", ") || "—"}
            />
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/products" className="naz-button">
              Shop more pieces
            </Link>
            <Link href="/" className="naz-button-secondary">
              Back home
            </Link>
          </div>
        </div>

        <div className="naz-card rounded-[2rem] p-8">
          <p className="naz-eyebrow mb-4">What happens next</p>

          <div className="grid gap-4 text-sm leading-8 text-white/68">
            <p>
              Your order is now being reviewed and prepared for dispatch.
            </p>
            <p>
              Once your piece has been shipped, you will receive an email update
              with tracking details.
            </p>
            <p>
              For any questions related to your order, please contact support
              and include your order ID for faster assistance.
            </p>
          </div>
        </div>
      </section>

      <aside className="grid gap-8">
        <div className="naz-card rounded-[2rem] p-8 sm:p-10">
          <p className="naz-eyebrow mb-4">Order summary</p>

          <div className="grid gap-5">
            {order.items.map((item, index) => (
              <div
                key={`${item.id}-${item.size ?? "no-size"}-${index}`}
                className="border-b border-white/10 pb-5 last:border-b-0 last:pb-0"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-medium text-white">
                      {item.name}
                    </h2>
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
        </div>

        <div className="naz-card rounded-[2rem] p-8">
          <p className="naz-eyebrow mb-4">Support</p>

          <div className="grid gap-3 text-sm leading-7 text-white/68">
            <p>
              For order support, contact{" "}
              <a
                href="mailto:nazoutlines@gmail.com"
                className="text-white transition hover:opacity-70"
              >
                nazoutlines@gmail.com
              </a>
            </p>
            <p>Include your order ID for a faster response.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span>{label}</span>
      <span className="text-right text-white">{value}</span>
    </div>
  );
}