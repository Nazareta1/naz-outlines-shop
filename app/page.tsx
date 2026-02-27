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

export default async function HomePage() {
  // paimam tik 2 aktyvius produktus (pirmam dropui)
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" as any }, // jei neturi createdAt, pakeisim
    take: 2,
  });

  return (
    <main className="min-h-screen bg-[#0E0E10] text-[#F2F2F2]">
      <Navbar />

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pt-14 md:pt-20 pb-20">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-6">
            <div className="text-xs tracking-[0.35em] uppercase text-white/50">
              NAZ
            </div>

            <h1 className="mt-6 text-5xl md:text-6xl leading-[1.02] tracking-[-0.02em] font-semibold">
              Structured Drop 01
            </h1>

            <div className="mt-10">
              <Link
                href="/products"
                className="inline-flex items-center justify-center border border-white/15 bg-white/5 px-7 py-3 text-xs tracking-[0.28em] uppercase text-white/80 hover:text-white hover:bg-white/10 transition"
              >
                Explore
              </Link>
            </div>
          </div>

          {/* HERO IMAGE */}
          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#141416]">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] via-transparent to-black/40" />
              <div className="relative aspect-[4/5] w-full">
                {/* Pakeisi į savo realią hero nuotrauką */}
                <Image
                  src="/hero.jpg"
                  alt="NAZ — Structured Drop 01"
                  fill
                  className="object-cover opacity-90"
                  sizes="(max-width: 1024px) 95vw, 50vw"
                  priority
                />
              </div>
            </div>

            <div className="mt-3 text-[11px] tracking-[0.28em] uppercase text-white/40">
              Dark architectural showroom • controlled light
            </div>
          </div>
        </div>
      </section>

      {/* STATEMENT */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="border-t border-white/10 pt-16">
          <div className="max-w-2xl text-2xl md:text-3xl leading-tight tracking-[-0.02em] text-white/85">
            Built on structure.
            <br />
            Engineered for presence.
          </div>
        </div>
      </section>

      {/* PRODUCTS (2 only) */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-10 md:grid-cols-2">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              className="group"
            >
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#141416]">
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src={p.imageUrl || "/logo.png"}
                    alt={p.name}
                    fill
                    className="object-contain p-10 opacity-90 group-hover:opacity-100 transition"
                    sizes="(max-width: 768px) 95vw, 45vw"
                  />
                </div>
              </div>

              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm tracking-[0.08em] text-white/90">
                    {p.name}
                  </div>
                  <div className="mt-1 text-[11px] tracking-[0.28em] uppercase text-white/45">
                    Smoke Black
                  </div>
                </div>
                <div className="text-sm text-white/70">
                  {formatMoney(p.priceCents, p.currency)}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 border-t border-white/10 pt-10 flex items-center justify-between">
          <div className="text-[11px] tracking-[0.28em] uppercase text-white/40">
            Limited production
          </div>
          <Link
            href="/products"
            className="text-[11px] tracking-[0.28em] uppercase text-white/70 hover:text-white transition"
          >
            View all
          </Link>
        </div>
      </section>

      {/* FOOTER minimal */}
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