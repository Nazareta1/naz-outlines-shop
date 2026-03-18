"use client";

import { useCart } from "./context";

export default function CartBadge() {
  const { itemCount } = useCart();

  if (itemCount === 0) return null;

  return (
    <span className="ml-2 inline-flex min-w-[18px] items-center justify-center rounded-full border border-white/10 bg-white px-[6px] py-[2px] text-[10px] font-semibold text-black">
      {itemCount}
    </span>
  );
}