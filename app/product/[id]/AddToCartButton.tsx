"use client";

import { useCart } from "@/app/cart/context";

export default function AddToCartButton({
  product,
  selectedSize,
}: {
  product: {
    id: string;
    name: string;
    priceCents: number;
    currency: string;
    imageUrl?: string | null;
  };
  selectedSize: "S" | "M" | "L";
}) {
  const { addToCart } = useCart();

  function handleAdd() {
    addToCart({
      id: product.id,
      name: product.name,
      priceCents: product.priceCents,
      currency: product.currency,
      imageUrl: product.imageUrl ?? undefined,
      size: selectedSize,
      quantity: 1,
    });
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="px-6 py-3 border border-white"
    >
      Add to cart
    </button>
  );
}