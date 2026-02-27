"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SuccessContent() {
  const search = useSearchParams();
  const sessionId = search.get("session_id");

  return (
    <section className="mx-auto max-w-6xl px-6 pt-12 pb-24">
      <div className="border-b border-white/10 pb-10">
        <div className="text-xs tracking-[0.35em] uppercase text-white/45">
          Checkout
        </div>
        <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-[-0.02em] leading-[1.05]">
          Order confirmed
        </h1>
        <div className="mt-4 text-sm text-white/55">
          Payment received. Confirmation is being processed.
        </div>
      </div>

      <div className="mt-12 border border-white/10 bg-[#141416] rounded-[28px] p-10">
        <div className="text-xs tracking-[0.35em] uppercase text-white/45">
          Details
        </div>

        <div className="mt-4 text-white/65 leading-relaxed">
          You will receive an email confirmation shortly.
        </div>

        {sessionId ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-[11px] tracking-[0.28em] uppercase text-white/45">
              Session
            </div>
            <div className="mt-2 text-sm text-white/70 break-all">
              {sessionId}
            </div>
          </div>
        ) : null}

        <div className="mt-10 flex gap-3">
          <Link
            href="/products"
            className="inline-flex items-center justify-center border border-white/15 bg-white/5 px-7 py-3 text-xs tracking-[0.28em] uppercase text-white/80 hover:bg-white/10 hover:text-white transition"
          >
            Explore
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center border border-white/10 bg-transparent px-7 py-3 text-xs tracking-[0.28em] uppercase text-white/60 hover:text-white/85 transition"
          >
            Home
          </Link>
        </div>
      </div>

      <div className="mt-10 text-[11px] tracking-[0.28em] uppercase text-white/40">
        Built on structure. Engineered for presence.
      </div>
    </section>
  );
}