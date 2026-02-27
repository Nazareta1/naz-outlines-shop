"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartSize = "S" | "M" | "L";

export type CartItem = {
  id: string;
  name: string;
  size: CartSize;
  priceCents: number;
  currency?: string;
  quantity: number;
  imageUrl?: string;
};

export interface CartContextValue {
  items: CartItem[];
  subtotalCents: number;
  count: number;

  addToCart: (item: CartItem) => void;
  increment: (id: string, size: CartSize) => void;
  decrement: (id: string, size: CartSize) => void;
  removeFromCart: (id: string, size: CartSize) => void;

  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "naz_cart_v3";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItemsState] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItemsState(JSON.parse(raw));
    } catch (e) {
      console.error("Cart load error", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Cart save error", e);
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

  const addToCart = (item: CartItem) => {
    setItemsState((prev) => {
      const existing = prev.find((p) => p.id === item.id && p.size === item.size);
      if (existing) {
        return prev.map((p) =>
          p.id === item.id && p.size === item.size
            ? { ...p, quantity: p.quantity + item.quantity }
            : p
        );
      }
      return [...prev, item];
    });
  };

  const increment = (id: string, size: CartSize) => {
    setItemsState((prev) =>
      prev.map((it) =>
        it.id === id && it.size === size ? { ...it, quantity: it.quantity + 1 } : it
      )
    );
  };

  const decrement = (id: string, size: CartSize) => {
    setItemsState((prev) =>
      prev
        .map((it) =>
          it.id === id && it.size === size ? { ...it, quantity: it.quantity - 1 } : it
        )
        .filter((it) => it.quantity > 0)
    );
  };

  const removeFromCart = (id: string, size: CartSize) => {
    setItemsState((prev) => prev.filter((it) => !(it.id === id && it.size === size)));
  };

  const clearCart = () => setItemsState([]);

  return (
    <CartContext.Provider
      value={{
        items,
        subtotalCents,
        count,
        addToCart,
        increment,
        decrement,
        removeFromCart,
        clearCart,
        setItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}