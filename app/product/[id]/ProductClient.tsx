"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
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
  eyebrow,
}: {
  product: {
    id: string;
    displayName: string;
    engineeredName: string;
    description: string;
    narrative: string;
    detailsIntro: string;
    priceCents: number;
    currency: string;
    imageUrl?: string | null;
    stockS: number;
    stockM: number;
    stockL: number;
    isPrivateDrop?: boolean;
    dropSlug?: string | null;
    accessToken?: string | null;
  };
  specs: {
    gsm: string;
    composition: string;
    cut: string;
    energy: string;
    fit: string;
    finish: string;
    mood: string;
  };
  gallery: string[];
  eyebrow: string;
}) {
  const sizes = useMemo(
    () => [
      { value: "S" as const, stock: product.stockS },
      { value: "M" as const, stock: product.stockM },
      { value: "L" as const, stock: product.stockL },
    ],
    [product.stockS, product.stockM, product.stockL]
  );

  const firstAvailableSize =
    sizes.find((size) => size.stock > 0)?.value ?? ("S" as const);

  const [selectedSize, setSelectedSize] = useState<Size>(firstAvailableSize);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    setSelectedSize(firstAvailableSize);
  }, [firstAvailableSize]);

  const selectedStock =
    selectedSize === "S"
      ? product.stockS
      : selectedSize === "M"
        ? product.stockM
        : product.stockL;

  const totalStock = product.stockS + product.stockM + product.stockL;
  const inStock = selectedStock > 0;
  const isPrivate = Boolean(product.isPrivateDrop);

  const backHref =
    isPrivate && product.dropSlug && product.accessToken
      ? `/private-drop/${product.dropSlug}?token=${product.accessToken}`
      : "/products";

  const stockMessage =
    !totalStock
      ? "Sold out"
      : totalStock <= 3
        ? "Very limited availability"
        : totalStock <= 8
          ? "Limited availability"
          : "Available in limited quantities";

  return (
    <div className="container-naz py-12 pb-20 md:py-16 md:pb-24">
      <div className="mb-8">
        <Link
          href={backHref}
          className="text-xs uppercase tracking-[0.28em] text-white/65 transition hover:text-white"
        >
          ← Back to {isPrivate ? "private drop" : "shop"}
        </Link>
      </div>

      <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-14">
        <div className="lg:col-span-7">
          <div className="grid gap-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]">
              {isPrivate ? (
                <div className="absolute left-4 top-4 z-10 rounded-full border border-white/15 bg-black/60 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-white/75 backdrop-blur">
                  NAZ Private Access
                </div>
              ) : null}

              <Image
                src={gallery[selectedImage] || "/logo.png"}
                alt={product.engineeredName}
                fill
                className="object-contain p-8 opacity-95 transition duration-500 hover:scale-[1.02] sm:p-12"
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
                        ? "border-white/30 bg-white/[0.06]"
                        : "border-white/10 hover:border-white/20 hover:bg-white/[0.05]",
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

            <div className="naz-card rounded-[2rem] p-6 sm:p-8">
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/45">
                Why this piece
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-8 text-white/70 sm:text-[15px]">
                {product.narrative}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="naz-card rounded-[2rem] p-7 sm:p-9 lg:sticky lg:top-24">
            {isPrivate ? (
              <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-white/70">
                NAZ Private Access
              </div>
            ) : (
              <p className="naz-eyebrow mb-4">{eyebrow}</p>
            )}

            <h1 className="text-3xl font-medium leading-[1.02] tracking-[-0.035em] text-white sm:text-[2.7rem]">
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

              <p className="text-2xl font-medium text-white sm:text-[2rem]">
                {formatMoney(product.priceCents, product.currency)}
              </p>
            </div>

            <p className="mt-8 text-sm leading-8 text-white/68">
              {product.description}
            </p>

            {isPrivate ? (
              <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/45">
                  Release access
                </p>
                <p className="mt-2 text-sm leading-7 text-white/72">
                  You are viewing this piece ahead of the public release. Access
                  is reserved for selected clients and private drop recipients.
                </p>
                {product.dropSlug ? (
                  <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-white/38">
                    Drop: {product.dropSlug}
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">
                  Availability
                </p>
                <p className="text-xs text-white/52">
                  {inStock ? `${selectedStock} left in ${selectedSize}` : "Out of stock"}
                </p>
              </div>

              <p className="mt-3 text-sm text-white/72">{stockMessage}</p>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">
                  Size
                </p>
                <button
                  type="button"
                  className="text-[11px] uppercase tracking-[0.24em] text-white/45 transition hover:text-white"
                >
                  Size guide soon
                </button>
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

            <div className="mt-8 grid gap-4">
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
                accessToken={product.accessToken}
              />

              <Link
                href="/cart"
                className="text-xs uppercase tracking-[0.28em] text-white/60 transition hover:text-white"
              >
                View cart →
              </Link>
            </div>

            <div className="mt-8 grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 text-xs text-white/45">
              <TrustRow label="Secure checkout" value="Encrypted payment by Stripe" />
              <TrustRow label="Shipping" value="Tracked European delivery" />
              <TrustRow label="Returns" value="14-day return window" />
              <TrustRow
                label="Release"
                value={isPrivate ? "Private release access" : "Limited production run"}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-12">
        <div className="naz-card rounded-[2rem] p-7 sm:p-8 lg:col-span-7">
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/45">
            Product details
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-white/68">
            {product.detailsIntro}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <DetailCard label="Weight" value={specs.gsm} />
            <DetailCard label="Composition" value={specs.composition} />
            <DetailCard label="Construction" value={specs.cut} />
            <DetailCard label="Energy" value={specs.energy} />
            <DetailCard label="Fit" value={specs.fit} />
            <DetailCard label="Finish" value={specs.finish} />
          </div>
        </div>

        <div className="naz-card rounded-[2rem] p-7 sm:p-8 lg:col-span-5">
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/45">
            Wearing impression
          </p>

          <h2 className="mt-4 text-2xl font-medium leading-tight tracking-[-0.03em] text-white sm:text-3xl">
            {specs.mood}
          </h2>

          <div className="mt-6 grid gap-4 text-sm leading-8 text-white/68">
            <p>
              This piece is designed to feel substantial the moment it is worn.
              The silhouette is structured, the line is deliberate, and the
              overall presence is elevated without excess.
            </p>
            <p>
              As real product imagery is added later, this layout will continue
              to work as the permanent NAZ product template.
            </p>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <Link
              href="/shipping"
              className="text-xs uppercase tracking-[0.28em] text-white/60 transition hover:text-white"
            >
              Read shipping information →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrustRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="uppercase tracking-[0.28em] text-white/45">{label}</span>
      <span className="text-right text-white/68">{value}</span>
    </div>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
      <p className="text-[10px] uppercase tracking-[0.28em] text-white/42">
        {label}
      </p>
      <p className="mt-3 text-sm leading-7 text-white/78">{value}</p>
    </div>
  );
}