// app/products/page.tsx
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatMoney(cents: number, currency: string) {
  const amount = (cents / 100).toFixed(2);
  const cur = (currency || "EUR").toUpperCase();
  return cur === "EUR" ? `€${amount}` : `${amount} ${cur}`;
}

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    take: 2, // first drop: 2 models only
  });

  return (
    <main className="min-h-screen bg-[#0E0E10] text-[#F2F2F2]">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 pt-12 pb-24">
        {/* Header */}
        <div className="flex items-end justify-between gap-6 border-b border-white/10 pb-10">
          <div>
            <div className="text-xs tracking-[0.35em] uppercase text-white/45">
              Shop
            </div>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-[-0.02em] leading-[1.05]">
              Structured Drop 01
            </h1>
            <div className="mt-4 text-sm text-white/55 max-w-xl leading-relaxed">
              Two models. One direction. Controlled presence.
            </div>
          </div>

          <div className="hidden sm:block text-[11px] tracking-[0.28em] uppercase text-white/40">
            Limited production
          </div>
        </div>

        {/* Empty */}
        {products.length === 0 ? (
          <div className="mt-12 border border-white/10 bg-[#141416] rounded-[28px] p-10">
            <div className="text-xs tracking-[0.35em] uppercase text-white/45">
              No products
            </div>
            <div className="mt-4 text-white/65">
              No active products found. Add active Product items in Prisma and they
              will appear here.
            </div>
            <div className="mt-8">
              <Link
                href="/"
                className="text-[11px] tracking-[0.28em] uppercase text-white/70 hover:text-white transition"
              >
                Back
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="mt-12 grid gap-10 md:grid-cols-2">
              {products.map((p) => (
                <Link key={p.id} href={`/product/${p.id}`} className="group">
                  <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#141416]">
                    <div className="relative aspect-[4/5] w-full">
                      <Image
                        src={p.imageUrl || "/logo.png"}
                        alt={p.name}
                        fill
                        className="object-contain p-10 opacity-90 group-hover:opacity-100 transition"
                        sizes="(max-width: 768px) 95vw, 45vw"
                        priority={true}
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex items-start justify-between gap-4">
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

                  <div className="mt-4 text-[11px] tracking-[0.28em] uppercase text-white/50">
                    Explore →
                  </div>
                </Link>
              ))}
            </div>

            {/* Footer row */}
            <div className="mt-16 border-t border-white/10 pt-10 flex items-center justify-between">
              <div className="text-[11px] tracking-[0.28em] uppercase text-white/40">
                Engineered for presence
              </div>
              <Link
                href="/"
                className="text-[11px] tracking-[0.28em] uppercase text-white/70 hover:text-white transition"
              >
                Home
              </Link>
            </div>
          </>
        )}
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