"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/cart/context";

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
  const router = useRouter();
  const { addToCart } = useCart();
  const [isPending, startTransition] = useTransition();

  function add() {
    addToCart({
      id: product.id,
      name: product.name,
      priceCents: product.priceCents,
      currency: product.currency,
      imageUrl: product.imageUrl ?? undefined,
      quantity: 1,
    });

    // tavo dabartinis flow (ok):
    router.push("/cart");
  }

  return (
    <button
      onClick={() => startTransition(add)}
      disabled={isPending}
      className="inline-flex items-center justify-center border border-white/15 bg-white/5 px-6 py-3 text-xs tracking-[0.28em] uppercase text-white/80 hover:bg-white/10 hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {isPending ? "Adding…" : "Add to cart"}
    </button>
  );
}