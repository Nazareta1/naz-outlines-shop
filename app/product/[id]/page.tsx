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
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Link
            href="/products"
            className="text-[11px] tracking-[0.28em] uppercase text-white/70 hover:text-white transition"
          >
            ← Back
          </Link>
          <div className="mt-10 border border-white/10 bg-[#141416] rounded-[28px] p-10">
            <div className="text-xs tracking-[0.35em] uppercase text-white/45">
              Product
            </div>
            <h1 className="mt-4 text-3xl font-semibold">Not found</h1>
            <p className="mt-3 text-white/55">
              This product doesn’t exist or is not active.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const img = product.imageUrl || "/logo.png";

  return (
    <main className="min-h-screen bg-[#0E0E10] text-[#F2F2F2]">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 pt-10 pb-24">
        <div className="mb-8">
          <Link
            href="/products"
            className="text-[11px] tracking-[0.28em] uppercase text-white/70 hover:text-white transition"
          >
            ← Back to shop
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* LEFT: IMAGE */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#141416]">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={img}
                  alt={product.name}
                  fill
                  className="object-contain p-10 opacity-95"
                  sizes="(max-width: 1024px) 95vw, 55vw"
                  priority
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <DetailPill label="480 GSM Heavy French Terry" />
              <DetailPill label="Engineered asymmetrical cut" />
              <DetailPill label="Limited production" />
              <DetailPill label="Smoke Black" />
            </div>
          </div>

          {/* RIGHT: INFO */}
          <div className="lg:col-span-5">
            <div className="border border-white/10 bg-[#141416] rounded-[28px] p-8">
              <div className="text-xs tracking-[0.35em] uppercase text-white/45">
                NAZ
              </div>

              <h1 className="mt-4 text-3xl md:text-4xl font-semibold tracking-[-0.02em] leading-[1.05]">
                {product.name}
              </h1>

              <div className="mt-4 flex items-baseline justify-between gap-6">
                <div className="text-[11px] tracking-[0.28em] uppercase text-white/45">
                  Smoke Black
                </div>
                <div className="text-lg text-white/80">
                  {formatMoney(product.priceCents, product.currency)}
                </div>
              </div>

              <div className="mt-6 text-sm leading-relaxed text-white/60">
                {product.description || (
                  <>
                    480 GSM Heavy French Terry.
                    <br />
                    Engineered asymmetrical cut.
                    <br />
                    Limited production.
                  </>
                )}
              </div>

              {/* SIZE UI minimal */}
              <div className="mt-8">
                <div className="text-[11px] tracking-[0.28em] uppercase text-white/45">
                  Size
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  <SizeChip label="S" />
                  <SizeChip label="M" />
                  <SizeChip label="L" />
                  <SizeChip label="XL" />
                </div>
              </div>

              <div className="mt-8 grid gap-3">
                <AddToCartButton
                  product={{
                    id: product.id,
                    name: product.name,
                    priceCents: product.priceCents,
                    currency: product.currency,
                    imageUrl: product.imageUrl,
                  }}
                />
                <Link
                  href="/cart"
                  className="inline-flex items-center justify-center border border-white/15 bg-white/5 px-6 py-3 text-xs tracking-[0.28em] uppercase text-white/80 hover:bg-white/10 hover:text-white transition"
                >
                  Cart
                </Link>
              </div>

              <div className="mt-10 border-t border-white/10 pt-6 grid gap-2 text-xs text-white/45">
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
        <div className="mx-auto max-w-6xl px-6 py-10 flex items-center justify-between">
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

function DetailPill({ label }: { label: string }) {
  return (
    <div className="border border-white/10 bg-white/[0.03] rounded-2xl px-4 py-3 text-xs text-white/60">
      {label}
    </div>
  );
}

function SizeChip({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="border border-white/10 bg-white/[0.03] rounded-2xl px-4 py-3 text-xs tracking-[0.18em] uppercase text-white/70 hover:bg-white/[0.06] hover:text-white transition"
    >
      {label}
    </button>
  );
}