"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import AddToCartButton from "./AddToCartButton";
import { useMemo, useState } from "react";

type Size = "S" | "M" | "L";

export default function ProductClient({
  product,
  specs,
  gallery,
  formatMoney,
}: {
  product: {
    id: string;
    name: string;
    priceCents: number;
    currency: string;
    imageUrl?: string | null;
  };
  specs: {
    subtitle: string;
    gsm: string;
    composition: string;
    cut: string;
    energy: string;
  };
  gallery: string[];
  formatMoney: (cents: number, currency: string) => string;
}) {
  const [selectedSize, setSelectedSize] = useState<Size>("S");

  const sizes: Size[] = useMemo(() => ["S", "M", "L"], []);

  return (
    <main className="min-h-screen bg-[#0E0E10] text-[#F2F2F2]">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 pt-12 pb-28">
        {/* Back */}
        <div className="mb-10">
          <Link
            href="/products"
            className="text-xs tracking-[0.28em] uppercase text-white/70 hover:text-white transition"
          >
            ← Back to shop
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-14 items-start">
          {/* LEFT — GALLERY */}
          <div className="lg:col-span-7">
            <div className="grid gap-4">
              {/* Main image */}
              <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden border border-white/10 bg-[#141416]">
                <Image
                  src={gallery[0]}
                  alt={specs.subtitle}
                  fill
                  className="object-contain p-14 opacity-95"
                  priority
                />
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-3 gap-4">
                {gallery.slice(1).map((g, i) => (
                  <button
                    key={i}
                    type="button"
                    className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-[#141416] focus:outline-none focus:ring-2 focus:ring-white/20"
                    // placeholder: vėliau galėsim padaryti click keisti main image
                    onClick={() => {}}
                    aria-label={`Gallery image ${i + 2}`}
                  >
                    <Image
                      src={g}
                      alt=""
                      fill
                      className="object-contain p-6 opacity-80"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — INFO */}
          <div className="lg:col-span-5">
            <div className="border border-white/10 bg-[#141416] rounded-[32px] p-10">
              <div className="text-xs tracking-[0.35em] uppercase text-white/45">
                NAZ
              </div>

              <h1 className="mt-5 text-3xl md:text-4xl font-semibold tracking-[-0.02em] leading-[1.05]">
                {specs.subtitle}
              </h1>

              <div className="mt-5 flex items-end justify-between">
                <div className="text-xs tracking-[0.28em] uppercase text-white/45">
                  Smoke Black
                </div>
                <div className="text-xl font-semibold text-white/85">
                  {formatMoney(product.priceCents, product.currency)}
                </div>
              </div>

              {/* Engineered description */}
              <div className="mt-8 text-sm leading-relaxed text-white/60">
                {specs.gsm}.
                <br />
                {specs.cut}.
                <br />
                {specs.energy}.
              </div>

              {/* SPECS BLOCK */}
              <div className="mt-10 border-t border-white/10 pt-8 grid gap-4 text-xs text-white/55">
                <SpecRow label="Weight" value={specs.gsm} />
                <SpecRow label="Composition" value={specs.composition} />
                <SpecRow label="Construction" value={specs.cut} />
                <SpecRow label="Colour" value="Smoke Black" />
              </div>

              {/* SIZE */}
              <div className="mt-10">
                <div className="text-xs tracking-[0.28em] uppercase text-white/45">
                  Size
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  {sizes.map((s) => {
                    const active = selectedSize === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={[
                          "rounded-2xl px-4 py-3 text-xs tracking-[0.18em] uppercase transition border",
                          active
                            ? "border-white/30 bg-white/10 text-white"
                            : "border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.06] hover:text-white",
                        ].join(" ")}
                        aria-pressed={active}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CTA */}
              <div className="mt-12 grid gap-4">
                <AddToCartButton
                  product={{
                    id: product.id,
                    name: specs.subtitle,
                    priceCents: product.priceCents,
                    currency: product.currency,
                    imageUrl: product.imageUrl,
                  }}
                  selectedSize={selectedSize}
                />

                <Link
                  href="/cart"
                  className="text-xs tracking-[0.28em] uppercase text-white/60 hover:text-white transition"
                >
                  View cart →
                </Link>
              </div>

              <div className="mt-12 border-t border-white/10 pt-6 grid gap-3 text-xs text-white/45">
                <div className="flex justify-between">
                  <span className="tracking-[0.28em] uppercase">Shipping</span>
                  <span className="text-white/55">Tracked EU shipping</span>
                </div>
                <div className="flex justify-between">
                  <span className="tracking-[0.28em] uppercase">Returns</span>
                  <span className="text-white/55">14 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-10 flex items-center justify-between">
          <div className="text-xs tracking-[0.35em] uppercase text-white/50">
            NAZ
          </div>
          <div className="text-xs text-white/35">
            © {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </main>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="tracking-[0.28em] uppercase text-white/45">{label}</span>
      <span className="text-white/65">{value}</span>
    </div>
  );
}