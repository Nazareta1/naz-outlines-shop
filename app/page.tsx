// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatMoney(cents: number, currency: string) {
  const amount = (cents / 100).toFixed(2);
  const cur = (currency || "EUR").toUpperCase();
  return cur === "EUR" ? `€${amount}` : `${amount} ${cur}`;
}

function getProductNote(priceCents: number) {
  if (priceCents === 12500) return "Controlled silhouette";
  if (priceCents === 13900) return "Dark motorsport energy";
  return "Limited production";
}

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    take: 2,
  });

  return (
    <main className="min-h-screen bg-[#0B0B0D] text-[#F2F2F2]">
      <Navbar />

      {/* HERO */}
      <section className="relative">
        <div className="mx-auto grid max-w-7xl items-end gap-12 px-6 pt-12 pb-24 md:pt-16 md:pb-32 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="text-[11px] tracking-[0.42em] uppercase text-white/35">
              NAZ
            </div>

            <h1 className="mt-8 text-5xl font-semibold leading-[0.92] tracking-[-0.05em] text-white/96 md:text-7xl xl:text-[6rem]">
              Controlled
              <br />
              presence
            </h1>

            <p className="mt-8 max-w-sm text-sm leading-relaxed text-white/48 md:text-base">
              Structured garments shaped by weight, restraint and dark motorsport
              energy.
            </p>

            <div className="mt-10 flex items-center gap-6">
              <Link
                href="/products"
                className="inline-flex items-center justify-center border border-white/15 bg-white/[0.04] px-8 py-3 text-[11px] tracking-[0.32em] uppercase text-white/82 hover:bg-white hover:text-black transition"
              >
                Enter
              </Link>

              <div className="text-[11px] tracking-[0.28em] uppercase text-white/35">
                Drop 01
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#121214]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.07),transparent_42%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_35%,rgba(0,0,0,0.42))]" />

              <div className="relative aspect-[4/5] w-full md:aspect-[16/11]">
                <Image
                  src="/hero.jpg"
                  alt="NAZ"
                  fill
                  className="object-cover opacity-90"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  priority
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 text-[11px] tracking-[0.28em] uppercase text-white/32">
              <span>Architectural showroom</span>
              <span>Controlled light</span>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="mx-auto max-w-7xl px-6 pb-24 md:pb-32">
        <div className="border-t border-white/10 pt-16 md:pt-20">
          <div className="max-w-4xl">
            <div className="text-[11px] tracking-[0.38em] uppercase text-white/35">
              Manifesto
            </div>

            <div className="mt-6 text-3xl leading-[1.02] tracking-[-0.04em] text-white/88 md:text-5xl">
              Built on structure.
              <br />
              Engineered for presence.
            </div>

            <p className="mt-8 max-w-xl text-sm leading-relaxed text-white/42 md:text-base">
              NAZ is built around silhouette, pressure and control. Each piece is
              engineered, not decorated.
            </p>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="mx-auto max-w-7xl px-6 pb-24 md:pb-32">
        <div className="flex items-end justify-between gap-6 border-t border-white/10 pt-16 md:pt-20">
          <div>
            <div className="text-[11px] tracking-[0.38em] uppercase text-white/35">
              Drop 01
            </div>
            <h2 className="mt-5 text-2xl leading-[1.02] tracking-[-0.04em] text-white/92 md:text-4xl">
              Two pieces.
              <br />
              One direction.
            </h2>
          </div>

          <Link
            href="/products"
            className="hidden md:inline-flex text-[11px] tracking-[0.28em] uppercase text-white/55 hover:text-white transition"
          >
            Shop all →
          </Link>
        </div>

        <div className="mt-12 grid gap-12 md:grid-cols-2">
          {products.map((p) => (
            <Link key={p.id} href={`/product/${p.id}`} className="group block">
              <div className="overflow-hidden rounded-[34px] border border-white/10 bg-[#121214]">
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src={p.imageUrl || "/logo.png"}
                    alt={p.name}
                    fill
                    className="object-contain p-10 opacity-90 transition duration-500 group-hover:scale-[1.015] group-hover:opacity-100 md:p-14"
                    sizes="(max-width: 768px) 100vw, 48vw"
                  />
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="text-lg tracking-[-0.02em] text-white/92 md:text-xl">
                      {p.name}
                    </div>
                    <div className="mt-2 text-[11px] tracking-[0.28em] uppercase text-white/38">
                      {getProductNote(p.priceCents)}
                    </div>
                  </div>

                  <div className="text-sm text-white/72 md:text-base">
                    {formatMoney(p.priceCents, p.currency)}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5">
                  <div className="text-[11px] tracking-[0.28em] uppercase text-white/32">
                    Smoke Black
                  </div>
                  <div className="text-[11px] tracking-[0.28em] uppercase text-white/62 transition group-hover:text-white">
                    Explore →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 md:hidden">
          <Link
            href="/products"
            className="text-[11px] tracking-[0.28em] uppercase text-white/55 hover:text-white transition"
          >
            Shop all →
          </Link>
        </div>
      </section>

      {/* CLOSING NOTE */}
      <section className="mx-auto max-w-7xl px-6 pb-24 md:pb-32">
        <div className="border-t border-white/10 pt-16 md:pt-20">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-3">
              <div className="text-[11px] tracking-[0.38em] uppercase text-white/35">
                NAZ
              </div>
            </div>

            <div className="md:col-span-9">
              <div className="max-w-3xl text-2xl leading-[1.06] tracking-[-0.04em] text-white/82 md:text-4xl">
                Architecture in cut.
                <br />
                Control in surface.
                <br />
                Presence in motion.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center">
          <div className="text-xs tracking-[0.42em] uppercase text-white/48">
            NAZ
          </div>

          <div className="flex items-center gap-6 text-[11px] tracking-[0.28em] uppercase text-white/34">
            <Link href="/products" className="hover:text-white/70 transition">
              Shop
            </Link>
            <Link href="/studio" className="hover:text-white/70 transition">
              Studio
            </Link>
            <Link href="/about" className="hover:text-white/70 transition">
              About
            </Link>
            <Link href="/contacts" className="hover:text-white/70 transition">
              Contact
            </Link>
          </div>

          <div className="text-xs text-white/28">© {new Date().getFullYear()}</div>
        </div>
      </footer>
    </main>
  );
}