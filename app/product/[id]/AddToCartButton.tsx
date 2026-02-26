"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  id: string;
  name: string;
  priceCents: number;
  currency: string;
  imageUrl?: string | null;
  quantity: number;
};

const CART_KEY = "naz_outlines_cart_v1";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

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
  const [msg, setMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  function add() {
    setMsg("");

    const cart = readCart();
    const idx = cart.findIndex((x) => x.id === product.id);

    if (idx >= 0) {
      cart[idx] = { ...cart[idx], quantity: cart[idx].quantity + 1 };
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        priceCents: product.priceCents,
        currency: product.currency,
        imageUrl: product.imageUrl ?? null,
        quantity: 1,
      });
    }

    writeCart(cart);
    setMsg("Added ✅");
    // optional: go to cart immediately
    router.push("/cart");
  }

  return (
    <div className="grid gap-2">
      <button
        onClick={() => startTransition(add)}
        disabled={isPending}
        className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black hover:opacity-90 transition disabled:opacity-70"
      >
        {isPending ? "Adding..." : "Add to cart"}
      </button>

      {msg ? <div className="text-xs text-white/60">{msg}</div> : null}
    </div>
  );
}