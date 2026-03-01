"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useCart } from "@/app/cart/context";

const SIZES: ("S" | "M" | "L")[] = ["S", "M", "L"];

export default function AddToCartButton({
  product,
}: {
  product: {
    id: string;
    name: string;
    priceCents: number;
    currency: string;
    imageUrl?: string | null;
  };
}) {
  const { addToCart } = useCart();
  const [size, setSize] = useState<"S" | "M" | "L" | null>(null);
  const [added, setAdded] = useState(false);
  const [isPending, startTransition] = useTransition();

  function add() {
    if (!size) return;

    addToCart({
  id: product.id,
  name: product.name,
  priceCents: product.priceCents,
  currency: product.currency,
  imageUrl: product.imageUrl ?? undefined,
  size: selectedSize,
});

    setAdded(true);
  }

  return (
    <div className="grid gap-6">
      {/* SIZE SELECTOR */}
      <div>
        <div className="text-[11px] tracking-[0.28em] uppercase text-white/45 mb-3">
          Size
        </div>

        <div className="flex gap-3">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`h-11 w-14 rounded-2xl border text-sm transition
                ${
                  size === s
                    ? "border-white bg-white text-black"
                    : "border-white/15 bg-white/[0.03] text-white/70 hover:bg-white/[0.07]"
                }
              `}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => startTransition(add)}
        disabled={!size || isPending}
        className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-xs tracking-[0.28em] uppercase text-white/80 hover:bg-white/10 hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isPending ? "Adding…" : "Add to cart"}
      </button>

      {added && (
        <div className="flex justify-between text-[11px] tracking-[0.28em] uppercase text-white/45">
          <span>Added • {size}</span>
          <Link
            href="/cart"
            className="text-white/70 hover:text-white transition"
          >
            View cart →
          </Link>
        </div>
      )}
    </div>
  );
}