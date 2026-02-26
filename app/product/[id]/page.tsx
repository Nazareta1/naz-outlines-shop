import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import AddToCartButton from "./AddToCartButton";

export const runtime = "nodejs"; // Prisma on Vercel
export const dynamic = "force-dynamic";

function formatMoney(cents: number, currency: string) {
  const amount = (cents / 100).toFixed(2);
  const cur = (currency || "EUR").toUpperCase();
  return cur === "EUR" ? `${amount} €` : `${amount} ${cur}`;
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
      <main className="min-h-screen bg-[#07070A] text-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Link
            href="/products"
            className="inline-flex items-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/85 hover:bg-white/10 transition"
          >
            ← Back to shop
          </Link>

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">
            <div className="text-xs tracking-[0.25em] text-white/60">
              PRODUCT
            </div>
            <h1 className="mt-3 text-3xl font-semibold">Not found</h1>
            <p className="mt-3 text-white/70">
              This product doesn’t exist or is not active.
            </p>
            <div className="mt-6 text-xs text-white/50">ID: {id}</div>
          </div>
        </div>
      </main>
    );
  }

  const img = product.imageUrl || "/logo.png";
  const price = formatMoney(product.priceCents, product.currency);

  return (
    <main className="min-h-screen bg-[#07070A] text-white overflow-hidden">
      {/* Ambient background (same vibe as homepage) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-24 left-20 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-56 right-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06),transparent_28%,rgba(0,0,0,0.65))]" />
      </div>

      {/* NAV */}
      <header className="relative z-10 mx-auto max-w-6xl px-6 pt-8">
        <nav className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
          <Link href="/" className="group inline-flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/10">
              <span className="text-xs tracking-[0.3em] pl-1 opacity-90">
                NO
              </span>
            </span>
            <span className="text-sm font-semibold tracking-[0.18em]">
              NAZ OUTLINES
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm text-white/80">
            <Link href="/#about" className="hover:text-white transition">
              About
            </Link>
            <Link href="/#streetwear" className="hover:text-white transition">
              Streetwear
            </Link>
            <Link href="/#fabric" className="hover:text-white transition">
              Quality
            </Link>
            <Link href="/#faq" className="hover:text-white transition">
              FAQ
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/15 transition"
            >
              Shop
            </Link>
            <Link
              href="/cart"
              className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90 transition"
            >
              Cart
            </Link>
          </div>
        </nav>
      </header>

      {/* CONTENT */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-10 pb-20">
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/85 hover:bg-white/10 transition"
          >
            ← Back to shop
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left: image */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                <div className="aspect-[4/3] w-full">
                  <Image
                    src={img}
                    alt={product.name}
                    fill
                    className="object-contain p-10 opacity-95"
                    sizes="(max-width: 1024px) 95vw, 55vw"
                  />
                </div>

                <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] tracking-[0.25em] text-white/70">
                  HOODIE
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Pill label="Heavyweight 400–420 GSM" />
                <Pill label="80% cotton / 20% polyester" />
                <Pill label="Loopback French Terry" />
              </div>
            </div>
          </div>

          {/* Right: details */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl">
              <div className="text-xs tracking-[0.25em] text-white/60">
                NAZ OUTLINES • PREMIUM STREETWEAR
              </div>

              <h1 className="mt-4 text-3xl md:text-4xl font-semibold leading-[1.1] tracking-[-0.02em]">
                {product.name}
              </h1>

              <div className="mt-3 flex items-center justify-between gap-4">
                <div className="text-sm text-white/70">
                  Minimal outlines. Maximum presence.
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm font-semibold text-white/90">
                  {price}
                </div>
              </div>

              {product.description ? (
                <p className="mt-5 text-sm text-white/70 leading-relaxed">
                  {product.description}
                </p>
              ) : (
                <p className="mt-5 text-sm text-white/55 leading-relaxed">
                  Premium hoodie built for everyday wear — heavyweight feel, clean
                  silhouette, and outline-driven design language.
                </p>
              )}

              {/* Size selector (UI) */}
              <div className="mt-6">
                <div className="text-xs tracking-[0.25em] text-white/60">
                  SIZE
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  <SizeChip label="S" />
                  <SizeChip label="M" />
                  <SizeChip label="L" />
                  <SizeChip label="XL" />
                </div>
                <div className="mt-2 text-xs text-white/50">
                  (Kol kas UI — vėliau padarysim realius variantus per DB.)
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6 grid grid-cols-1 gap-3">
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
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 transition"
                >
                  Go to cart →
                </Link>
              </div>

              {/* Shipping / returns */}
              <div className="mt-7 grid gap-3">
                <InfoRow k="Shipping" v="Tracked shipping. EU-ready." />
                <InfoRow k="Returns" v="14 days (policy page coming next)." />
                <InfoRow k="Support" v="Email support (order updates + tracking)." />
              </div>
            </div>

            {/* Spec block */}
            <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl">
              <div className="text-xs tracking-[0.25em] text-white/60">
                FABRIC SPEC
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <SpecCard k="Composition" v="80% cotton / 20% polyester" />
                <SpecCard k="Weight" v="400–420 GSM" />
                <SpecCard k="Knit" v="French Terry (loopback)" />
                <SpecCard k="Finish" v="Pre-shrunk • Enzyme washed" />
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-5 text-sm text-white/70 leading-relaxed">
                <span className="text-white/85 font-semibold">Why it matters:</span>{" "}
                heavyweight GSM gives a premium drape and structure; pre-shrunk reduces
                shrink risk; enzyme wash adds a softer, high-end handfeel.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 bg-black/40">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-sm font-semibold tracking-[0.18em]">
              NAZ OUTLINES
            </div>
            <div className="mt-2 text-xs text-white/60">
              © {new Date().getFullYear()} • Auto culture × Premium streetwear
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-white/70">
            <Link href="/#about" className="hover:text-white transition">
              About
            </Link>
            <Link href="/#streetwear" className="hover:text-white transition">
              Streetwear
            </Link>
            <Link href="/#fabric" className="hover:text-white transition">
              Quality
            </Link>
            <Link href="/products" className="hover:text-white transition">
              Shop
            </Link>
            <Link href="/cart" className="hover:text-white transition">
              Cart
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-center text-xs text-white/75">
      {label}
    </div>
  );
}

function SizeChip({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 transition"
    >
      {label}
    </button>
  );
}

function InfoRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
      <div className="text-xs tracking-[0.25em] text-white/55">{k}</div>
      <div className="text-sm text-white/80 text-right">{v}</div>
    </div>
  );
}

function SpecCard({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-5 hover:bg-black/40 transition">
      <div className="text-xs tracking-[0.25em] text-white/55">{k}</div>
      <div className="mt-2 text-sm text-white/85">{v}</div>
    </div>
  );
}