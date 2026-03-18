"use client";

import { useState, useTransition } from "react";

export default function SendPrivateDropForm() {
  const [isPending, startTransition] = useTransition();
  const [dropSlug, setDropSlug] = useState("");
  const [dropName, setDropName] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSend() {
    setMsg("");

    const slug = dropSlug.trim();
    const name = dropName.trim();

    if (!slug) {
      setMsg("Drop slug is required ❌");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/private-drop/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dropSlug: slug,
            dropName: name || slug,
          }),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          setMsg(data?.error || data?.message || "Failed ❌");
          return;
        }

        setMsg(`Sent ✅ ${data?.sent ?? 0} email(s)`);
      } catch (error) {
        setMsg("Something went wrong ❌");
      }
    });
  }

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Send private drop emails</h2>
        <p className="mt-1 text-sm text-gray-500">
          Send NAZ Private Access emails with tokenized links to all eligible
          clients.
        </p>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Drop slug
          </label>
          <input
            type="text"
            value={dropSlug}
            onChange={(e) => setDropSlug(e.target.value)}
            placeholder="summer-drop"
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none placeholder:text-gray-400"
            disabled={isPending}
          />
          <p className="mt-2 text-xs text-gray-500">
            This must match the private drop slug used on products.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Drop name
          </label>
          <input
            type="text"
            value={dropName}
            onChange={(e) => setDropName(e.target.value)}
            placeholder="Summer Drop"
            className="w-full rounded-xl border px-3 py-2 text-sm outline-none placeholder:text-gray-400"
            disabled={isPending}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSend}
            disabled={isPending}
            className="inline-flex items-center rounded-full border border-black bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Sending..." : "Send private drop emails"}
          </button>

          {msg ? <span className="text-xs text-gray-500">{msg}</span> : null}
        </div>
      </div>
    </div>
  );
}