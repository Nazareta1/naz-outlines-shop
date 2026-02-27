"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  id: string;
  name: string;
  priceCents: number; // ✅ cents (int)
  currency?: string; // optional, default EUR UI
  quantity: number;
  imageUrl?: string;
};

export interface CartContextValue {
  items: CartItem[];
  subtotalCents: number;
  count: number;
  addToCart: (item: CartItem) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// ✅ new key so old cart doesn't break
const STORAGE_KEY = "cart_items_v2";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItemsState] = useState<CartItem[]>([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItemsState(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [items]);

  const subtotalCents = useMemo(() => {
    return items.reduce((acc, item) => acc + item.priceCents * item.quantity, 0);
  }, [items]);

  const count = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const setItems = (newItems: CartItem[]) => setItemsState(newItems);

  const addToCart = (item: CartItem) => {
    setItemsState((prev) => {
      const existing = prev.find((p) => p.id === item.id);

      if (existing) {
        return prev.map((p) =>
          p.id === item.id
            ? { ...p, quantity: p.quantity + item.quantity }
            : p
        );
      }

      return [...prev, item];
    });
  };

  const increment = (id: string) => {
    setItemsState((prev) =>
      prev.map((it) => (it.id === id ? { ...it, quantity: it.quantity + 1 } : it))
    );
  };

  const decrement = (id: string) => {
    setItemsState((prev) =>
      prev
        .map((it) => (it.id === id ? { ...it, quantity: it.quantity - 1 } : it))
        .filter((it) => it.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setItemsState((prev) => prev.filter((it) => it.id !== id));
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