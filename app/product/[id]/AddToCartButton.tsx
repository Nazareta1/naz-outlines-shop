"use client";

import { useState } from "react";
import { useCart } from "@/app/cart/context";

export default function AddToCartButton({
  product,
  selectedSize,
  inStock,
  accessToken,
}: {
  product: {
    id: string;
    name: string;
    priceCents: number;
    currency: string;
    imageUrl?: string | null;
  };
  selectedSize: "S" | "M" | "L";
  inStock: boolean;
  accessToken?: string | null;
}) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (!inStock) return;

    addToCart({
      id: product.id,
      name: product.name,
      priceCents: product.priceCents,
      currency: product.currency,
      imageUrl: product.imageUrl ?? undefined,
      size: selectedSize,
      quantity: 1,
      accessToken: accessToken ?? null,
    });

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={!inStock}
      className={[
        "inline-flex items-center justify-center rounded-full px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] transition",
        inStock
          ? "border border-white/20 bg-white text-black hover:opacity-90"
          : "cursor-not-allowed border border-white/10 bg-white/10 text-white/35",
      ].join(" ")}
    >
      {!inStock
        ? "Out of stock"
        : added
          ? `Added to cart · ${selectedSize}`
          : `Add to cart · ${selectedSize}`}
    </button>
  );
}