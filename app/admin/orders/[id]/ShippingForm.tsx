"use client";

import { useMemo, useState, useTransition } from "react";

const CARRIERS = ["", "Omniva", "DPD", "LP Express", "UPS", "DHL", "FedEx"] as const;

export default function ShippingForm({
  orderId,
  initialCarrier,
  initialTracking,
  initialFulfillmentStatus,
}: {
  orderId: string;
  initialCarrier?: string | null;
  initialTracking?: string | null;
  initialFulfillmentStatus?: string | null;
}) {
  const [carrier, setCarrier] = useState<string>(initialCarrier ?? "");
  const [tracking, setTracking] = useState<string>(initialTracking ?? "");
  const [msg, setMsg] = useState<string>("");

  const [isPending, startTransition] = useTransition();

  const canMarkShipped = useMemo(() => tracking.trim().length > 0, [tracking]);

  async function save(markShipped: boolean) {
    setMsg("");

    const res = await fetch(`/admin/orders/${orderId}/shipping`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shippingCarrier: carrier,
        trackingNumber: tracking,
        markShipped,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      setMsg(text || "Failed to save shipping");
      return;
    }

    const data = await res.json().catch(() => null);

    if (data?.fulfillmentStatus === "shipped") {
      setMsg("Saved + marked as shipped ✅ (refresh page)");
    } else {
      setMsg("Saved ✅");
    }
  }

  return (
    <div className="border rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="text-sm font-semibold">Shipping</div>
          <div className="text-xs text-gray-500">
            Add tracking and optionally mark as shipped.
          </div>
        </div>

        <div className="text-xs text-gray-500">
          Current: <span className="font-medium">{initialFulfillmentStatus ?? "—"}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Carrier</label>
          <select
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            disabled={isPending}
          >
            {CARRIERS.map((c) => (
              <option key={c} value={c}>
                {c === "" ? "—" : c}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs text-gray-500 mb-1">Tracking number</label>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            placeholder="e.g. XX123456789LT"
            disabled={isPending}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-3">
        <button
          className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50 disabled:opacity-60"
          disabled={isPending}
          onClick={() => startTransition(() => save(false))}
        >
          {isPending ? "Saving..." : "Save"}
        </button>

        <button
          className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50 disabled:opacity-60"
          disabled={isPending || !canMarkShipped}
          onClick={() => startTransition(() => save(true))}
          title={!canMarkShipped ? "Enter tracking number first" : ""}
        >
          {isPending ? "Saving..." : "Save + Mark shipped"}
        </button>

        {msg ? <div className="text-xs text-gray-500">{msg}</div> : null}
      </div>
    </div>
  );
}