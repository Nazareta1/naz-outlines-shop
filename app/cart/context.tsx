"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: string;              // Product.id
  name: string;
  priceCents: number;      // cents
  currency?: string;       // "EUR"
  quantity: number;
  imageUrl?: string;
  size: "S" | "M" | "L";   // ✅ size required
};

// ✅ unique key per cart line (id + size)
function lineKey(item: Pick<CartItem, "id" | "size">) {
  return `${item.id}__${item.size}`;
}

export interface CartContextValue {
  items: CartItem[];
  subtotalCents: number;
  count: number;

  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;

  increment: (key: string) => void;
  decrement: (key: string) => void;
  removeFromCart: (key: string) => void;

  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "cart_items_v3"; // ✅ bump key so old carts don't break

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItemsState] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItemsState(parsed);
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [items]);

  const subtotalCents = useMemo(
    () => items.reduce((acc, it) => acc + it.priceCents * it.quantity, 0),
    [items]
  );

  const count = useMemo(
    () => items.reduce((acc, it) => acc + it.quantity, 0),
    [items]
  );

  const setItems = (newItems: CartItem[]) => setItemsState(newItems);

  const addToCart: CartContextValue["addToCart"] = (item) => {
    const qty = item.quantity ?? 1;

    setItemsState((prev) => {
      const key = lineKey(item);
      const existing = prev.find((p) => lineKey(p) === key);

      if (existing) {
        return prev.map((p) =>
          lineKey(p) === key ? { ...p, quantity: p.quantity + qty } : p
        );
      }

      return [
        ...prev,
        {
          ...item,
          quantity: qty,
        } as CartItem,
      ];
    });
  };

  const increment = (key: string) => {
    setItemsState((prev) =>
      prev.map((it) => (lineKey(it) === key ? { ...it, quantity: it.quantity + 1 } : it))
    );
  };

  const decrement = (key: string) => {
    setItemsState((prev) =>
      prev
        .map((it) => (lineKey(it) === key ? { ...it, quantity: it.quantity - 1 } : it))
        .filter((it) => it.quantity > 0)
    );
  };

  const removeFromCart = (key: string) => {
    setItemsState((prev) => prev.filter((it) => lineKey(it) !== key));
  };

  const clearCart = () => setItemsState([]);

  const value: CartContextValue = {
    items,
    subtotalCents,
    count,
    addToCart,
    increment,
    decrement,
    removeFromCart,
    clearCart,
    setItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

// ✅ export helper for pages (optional)
export const cartLineKey = lineKey;