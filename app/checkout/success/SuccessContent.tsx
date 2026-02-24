"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/app/cart/context";

type OrderItem = {
  id: string;
  name: string;
  priceCents: number;
  quantity: number;
};

type Order = {
  id: string;
  totalCents: number;
  currency: string;
  name?: string;
  email?: string;
  addressLine1?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  items: OrderItem[];
};

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const { clearCart } = useCart();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;

    async function fetchOrder() {
      const res = await fetch(
        `/api/orders/by-session?session_id=${sessionId}`
      );

      if (res.ok) {
        const data = await res.json();
        setOrder(data);
        clearCart();
      }

      setLoading(false);
    }

    fetchOrder();
  }, [sessionId, clearCart]);

  if (loading) {
    return <div className="p-10 text-center">Loading your order...</div>;
  }

  if (!order) {
    return (
      <div className="p-10 text-center">
        Order not found.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">
        🎉 Payment successful!
      </h1>

      <p className="mb-4">
        Order ID: <strong>{order.id}</strong>
      </p>

      <h2 className="text-xl font-semibold mb-2">Items:</h2>

      <div className="space-y-2 mb-6">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between border-b pb-2"
          >
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>
              {(item.priceCents * item.quantity / 100).toFixed(2)} €
            </span>
          </div>
        ))}
      </div>

      <div className="text-lg font-semibold mb-6">
        Total: {(order.totalCents / 100).toFixed(2)} €
      </div>

      <div className="text-sm text-gray-600">
        <p>{order.name}</p>
        <p>{order.addressLine1}</p>
        <p>
          {order.postalCode} {order.city}
        </p>
        <p>{order.country}</p>
      </div>
    </div>
  );
}