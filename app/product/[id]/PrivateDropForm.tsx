"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  productId: string;
  initialIsPrivateDrop: boolean;
  initialDropSlug: string | null;
};

export default function PrivateDropForm({
  productId,
  initialIsPrivateDrop,
  initialDropSlug,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [isPrivateDrop, setIsPrivateDrop] = useState(initialIsPrivateDrop);
  const [dropSlug, setDropSlug] = useState(initialDropSlug ?? "");
  const [msg, setMsg] = useState("");

  async function save() {
    setMsg("");

    const res = await fetch(`/admin/products/${productId}/private-drop`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isPrivateDrop,
        dropSlug: dropSlug.trim() || null,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      setMsg(text || "Failed ❌");
      return;
    }

    setMsg("Saved ✅");
    router.refresh();
    setTimeout(() => setMsg(""), 1500);
  }

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Private drop</h2>
        <p className="mt-1 text-sm text-gray-500">
          Control whether this product appears inside a NAZ Private Access drop.
        </p>
      </div>

      <div className="space-y-4">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isPrivateDrop}
            onChange={(e) => setIsPrivateDrop(e.target.checked)}
            disabled={isPending}
            className="h-4 w-4 rounded border-gray-300"
          />
          <span className="text-sm font-medium text-gray-800">
            Enable private drop access
          </span>
        </label>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Drop slug
          </label>
          <input
            type="text"
            value={dropSlug}
            onChange={(e) => setDropSlug(e.target.value)}
            disabled={isPending}
            placeholder="summer-drop"
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none ring-0 placeholder:text-gray-400"
          />
          <p className="mt-2 text-xs text-gray-500">
            Example: <span className="font-medium">summer-drop</span>. This must
            match the slug used in your private drop emails and URLs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => startTransition(save)}
            disabled={isPending}
            className="inline-flex items-center rounded-full border border-black bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Save"}
          </button>

          {msg ? <span className="text-xs text-gray-500">{msg}</span> : null}
        </div>
      </div>
    </div>
  );
}