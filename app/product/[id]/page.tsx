// app/product/[id]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import AddToCartButton from "./AddToCartButton";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatMoney(cents: number, currency: string) {
  const amount = (cents / 100).toFixed(2);
  const cur = (currency || "EUR").toUpperCase();
  return cur === "EUR" ? `€${amount}` : `${amount} ${cur}`;
}

function getSpecs(price: number) {
  // 125€ modelis
  if (price === 12500) {
    return {
      subtitle: "Structured Asymmetric Hoodie",
      gsm: "480 GSM Heavy French Terry",
      composition: "80% Cotton / 20% Polyester",
      cut: "Engineered asymmetrical cut",
      energy: "Controlled structure",
    };
  }

  // 139€ modelis
  return {
    subtitle: "Controlled Motorsport Structure Hoodie",
    gsm: "500 GSM Dense French Terry",
    composition: "80% Cotton / 20% Polyester",
    cut: "Architectural panel construction",
    energy: "Dark motorsport energy",
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product || !product.active) {
    return (
      <main className="min-h-screen bg-[#0E0E10] text-[#F2F2F2]">
        <Navbar />
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Link
            href="/products"
            className="text-xs tracking-[0.28em] uppercase text-white/70 hover:text-white transition"
          >
            ← Back
          </Link>
          <div className="mt-12 border border-white/10 bg-[#141416] rounded-[28px] p-12">
            <div className="text-xs tracking-[0.35em] uppercase text-white/45">
              Product
            </div>
            <h1 className="mt-4 text-3xl font-semibold">Not found</h1>
          </div>
        </div>
      </main>
    );
  }

  const specs = getSpecs(product.priceCents);

  const img = product.imageUrl || "/logo.png";

  // placeholder 6 gallery images
  const gallery = Array.from({ length: 6 }, () => img);

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
                  alt={product.name}
                  fill
                  className="object-contain p-14 opacity-95"
                  priority
                />
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-3 gap-4">
                {gallery.slice(1).map((g, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-[#141416]"
                  >
                    <Image
                      src={g}
                      alt=""
                      fill
                      className="object-contain p-6 opacity-80"
                    />
                  </div>
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
                  <span className="tracking-[0.28em] uppercase">
                    Shipping
                  </span>
                  <span className="text-white/55">
                    Tracked EU shipping
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="tracking-[0.28em] uppercase">
                    Returns
                  </span>
                  <span className="text-white/55">
                    14 days
                  </span>
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

function SpecRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between">
      <span className="tracking-[0.28em] uppercase text-white/45">
        {label}
      </span>
      <span className="text-white/65">{value}</span>
    </div>
  );
}