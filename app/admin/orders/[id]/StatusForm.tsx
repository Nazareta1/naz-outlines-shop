"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["paid", "fulfilled", "shipped", "refunded"] as const;
type Status = (typeof STATUSES)[number];

export default function StatusForm({
  orderId,
  initialStatus,
}: {
  orderId: string;
  initialStatus: string;
}) {
  const router = useRouter();

  const normalized =
    (STATUSES.includes(initialStatus.toLowerCase() as Status)
      ? (initialStatus.toLowerCase() as Status)
      : "paid") as Status;

  const [status, setStatus] = useState<Status>(normalized);
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string>("");

  async function save() {
    setMsg("");

    const res = await fetch(`/admin/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      setMsg(text || "Failed to update status");
      return;
    }

    setMsg("Saved ✅");
    router.refresh(); // ✅ kad badge + puslapio duomenys atsinaujintų
  }

  return (
    <div className="flex items-center gap-3">
      <select
        className="border rounded-lg px-3 py-2 text-sm"
        value={status}
        onChange={(e) => setStatus(e.target.value as Status)}
        disabled={isPending}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <button
        className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50 disabled:opacity-60"
        disabled={isPending}
        onClick={() => startTransition(save)}
      >
        {isPending ? "Saving..." : "Save"}
      </button>

      {msg ? <div className="text-xs text-gray-500">{msg}</div> : null}
    </div>
  );
}