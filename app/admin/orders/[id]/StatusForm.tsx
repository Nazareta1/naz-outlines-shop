"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const PAYMENT = ["pending", "paid", "failed", "refunded"] as const;
const FULFILL = ["unfulfilled", "fulfilled", "shipped", "cancelled"] as const;

type PaymentStatus = (typeof PAYMENT)[number];
type FulfillmentStatus = (typeof FULFILL)[number];
type Type = "payment" | "fulfillment";

export default function StatusForm({
  orderId,
  type,
  initialStatus,
}: {
  orderId: string;
  type: Type;
  initialStatus: string;
}) {
  const router = useRouter();

  const list = type === "payment" ? PAYMENT : FULFILL;

  const normalized = String(initialStatus ?? "").toLowerCase();
  const safeInitial = (list.includes(normalized as any) ? normalized : list[0]) as
    | PaymentStatus
    | FulfillmentStatus;

  const [status, setStatus] = useState<typeof safeInitial>(safeInitial);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string>("");

  async function save(next?: string) {
    setMsg("");
    const toSave = (next ?? status) as string;

    const res = await fetch(`/admin/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, status: toSave }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      setMsg(text || "Failed to update status");
      return;
    }

    setMsg("Saved ✅");
    router.refresh();
    setTimeout(() => setMsg(""), 1200);
  }

  return (
    <div className="flex items-center gap-2">
      <div className="text-xs text-gray-500 min-w-[76px]">
        {type === "payment" ? "Payment" : "Fulfillment"}
      </div>

      <select
        className="border rounded-lg px-3 py-2 text-sm"
        value={status}
        onChange={(e) => {
          const v = e.target.value;
          setStatus(v as any);
          startTransition(() => save(v));
        }}
        disabled={isPending}
      >
        {list.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {msg ? <div className="text-xs text-gray-500">{msg}</div> : null}
    </div>
  );
}