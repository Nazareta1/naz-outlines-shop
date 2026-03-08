"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import AddToCartButton from "./AddToCartButton";

type Size = "S" | "M" | "L";

function formatMoney(cents: number, currency: string) {
  const amount = (cents / 100).toFixed(2);
  const cur = (currency || "EUR").toUpperCase();
  return cur === "EUR" ? `€${amount}` : `${amount} ${cur}`;
}

export default function ProductClient({
  product,
  specs,
  gallery,
}: {
  product: {
    id: string;
    displayName: string;
    engineeredName: string;
    description: string;
    priceCents: number;
    currency: string;
    imageUrl?: string | null;
    stockS: number;
    stockM: number;
    stockL: number;
  };
  specs: {
    gsm: string;
    composition: string;
    cut: string;
    energy: string;
  };
  gallery: string[];
}) {
  const [selectedSize, setSelectedSize] = useState<Size>("S");
  const [selectedImage, setSelectedImage] = useState(0);

  const sizes = useMemo(
    () => [
      { value: "S" as const, stock: product.stockS },
      { value: "M" as const, stock: product.stockM },
      { value: "L" as const, stock: product.stockL },
    ],
    [product.stockS, product.stockM, product.stockL]
  );

  const selectedStock =
    selectedSize === "S"
      ? product.stockS
      : selectedSize === "M"
        ? product.stockM
        : product.stockL;

  const inStock = selectedStock > 0;

  return (
    <div className="container-naz py-12 pb-20 md:py-16 md:pb-24">
      <div className="mb-8">
        <Link
          href="/products"
          className="text-xs uppercase tracking-[0.28em] text-white/65 transition hover:text-white"
        >
          ← Back to shop
        </Link>
      </div>

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <div className="grid gap-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]">
              <Image
                src={gallery[selectedImage] || "/logo.png"}
                alt={product.engineeredName}
                fill
                className="object-contain p-8 opacity-95 sm:p-12"
                priority
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            <div className="grid grid-cols-4 gap-3">
              {gallery.map((image, index) => {
                const active = index === selectedImage;

                return (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={[
                      "relative aspect-square overflow-hidden rounded-2xl border bg-white/[0.03] transition",
                      active
                        ? "border-white/30"
                        : "border-white/10 hover:border-white/20",
                    ].join(" ")}
                    aria-label={`Select image ${index + 1}`}
                  >
                    <Image
                      src={image}
                      alt=""
                      fill
                      className="object-contain p-4 opacity-85"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="naz-card rounded-[2rem] p-7 sm:p-9">
            <p className="naz-eyebrow mb-4">NAZ</p>

            <h1 className="text-3xl font-medium leading-[1.05] tracking-[-0.03em] text-white sm:text-4xl">
              {product.engineeredName}
            </h1>

            <p className="mt-3 text-sm uppercase tracking-[0.22em] text-white/42">
              {product.displayName}
            </p>

            <div className="mt-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/40">
                  Colour
                </p>
                <p className="mt-2 text-sm text-white/75">Smoke Black</p>
              </div>

              <p className="text-2xl font-medium text-white">
                {formatMoney(product.priceCents, product.currency)}
              </p>
            </div>

            <p className="mt-8 text-sm leading-8 text-white/65">
              {product.description}
            </p>

            <div className="mt-8 grid gap-3 border-t border-white/10 pt-8 text-xs text-white/55">
              <SpecRow label="Weight" value={specs.gsm} />
              <SpecRow label="Composition" value={specs.composition} />
              <SpecRow label="Construction" value={specs.cut} />
              <SpecRow label="Energy" value={specs.energy} />
            </div>

            <div className="mt-10">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">
                  Size
                </p>
                <p className="text-xs text-white/45">
                  {inStock ? `${selectedStock} left` : "Out of stock"}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {sizes.map((size) => {
                  const active = selectedSize === size.value;
                  const unavailable = size.stock <= 0;

                  return (
                    <button
                      key={size.value}
                      type="button"
                      onClick={() => !unavailable && setSelectedSize(size.value)}
                      disabled={unavailable}
                      className={[
                        "rounded-2xl border px-4 py-3 text-xs uppercase tracking-[0.18em] transition",
                        active
                          ? "border-white/30 bg-white/10 text-white"
                          : "border-white/10 bg-white/[0.03] text-white/70",
                        unavailable
                          ? "cursor-not-allowed opacity-35"
                          : "hover:bg-white/[0.06] hover:text-white",
                      ].join(" ")}
                      aria-pressed={active}
                    >
                      {size.value}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-10 grid gap-4">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.engineeredName,
                  priceCents: product.priceCents,
                  currency: product.currency,
                  imageUrl: product.imageUrl,
                }}
                selectedSize={selectedSize}
                inStock={inStock}
              />

              <Link
                href="/cart"
                className="text-xs uppercase tracking-[0.28em] text-white/60 transition hover:text-white"
              >
                View cart →
              </Link>
            </div>

            <div className="mt-10 grid gap-3 border-t border-white/10 pt-6 text-xs text-white/45">
              <div className="flex justify-between gap-4">
                <span className="uppercase tracking-[0.28em]">Shipping</span>
                <span className="text-right text-white/58">
                  Tracked EU shipping
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="uppercase tracking-[0.28em]">Returns</span>
                <span className="text-right text-white/58">14 days</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="uppercase tracking-[0.28em]">Drop</span>
                <span className="text-right text-white/58">
                  Limited production
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="uppercase tracking-[0.28em] text-white/45">{label}</span>
      <span className="text-right text-white/68">{value}</span>
    </div>
  );
}