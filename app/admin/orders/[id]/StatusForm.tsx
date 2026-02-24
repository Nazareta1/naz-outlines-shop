"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"] as const;
const FULFILLMENT_STATUSES = [
  "unfulfilled",
  "fulfilled",
  "shipped",
  "cancelled",
] as const;

type Props = {
  orderId: string;
  type: "payment" | "fulfillment";
  initialStatus: string;
};

const PAYMENT_SET = new Set<string>(PAYMENT_STATUSES);
const FULFILL_SET = new Set<string>(FULFILLMENT_STATUSES);

export default function StatusForm({ orderId, type, initialStatus }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState("");

  const normalized = String(initialStatus ?? "").toLowerCase();

  const options = type === "payment" ? PAYMENT_STATUSES : FULFILLMENT_STATUSES;
  const allowed = type === "payment" ? PAYMENT_SET : FULFILL_SET;

  const initial = allowed.has(normalized) ? normalized : options[0];

  const [status, setStatus] = useState<string>(initial);

  async function save(newStatus: string) {
    setMsg("");

    const res = await fetch(`/admin/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, status: newStatus }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      setMsg(text || "Failed ❌");
      return;
    }

    setMsg("Saved ✅");
    router.refresh();
    setTimeout(() => setMsg(""), 1200);
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => {
          const v = e.target.value;
          setStatus(v);
          startTransition(() => save(v));
        }}
        disabled={isPending}
        className="border rounded-lg px-3 py-1.5 text-sm"
      >
        {options.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {msg ? <span className="text-xs text-gray-500">{msg}</span> : null}
    </div>
  );
}