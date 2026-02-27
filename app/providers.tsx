"use client";

import { CartProvider } from "@/app/cart/context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}