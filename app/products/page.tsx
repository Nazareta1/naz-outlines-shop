import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatMoney(cents: number, currency: string) {
  const amount = (cents / 100).toFixed(2);
  const cur = (currency || "EUR").toUpperCase();
  return cur === "EUR" ? `${amount} €` : `${amount} ${cur}`;
}

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });

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

      {/* NAV (same as homepage) */}
      <header className="relative z-10 mx-auto max-w-6xl px-6 pt-8">
        <nav className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
          <Link href="/" className="group inline-flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/10">
              <span className="text-xs tracking-[0.3em] pl-1 opacity-90">NO</span>
            </span>
            <span className="text-sm font-semibold tracking-[0.18em]">
              NAZ OUTLINES
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm text-white/80">
            <Link href="/#about" className="hover:text-white transition">About</Link>
            <Link href="/#streetwear" className="hover:text-white transition">Streetwear</Link>
            <Link href="/#fabric" className="hover:text-white transition">Quality</Link>
            <Link href="/#faq" className="hover:text-white transition">FAQ</Link>
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
      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-12 pb-20">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs tracking-[0.25em] text-white/70">
              SHOP • HOODIES
              <span className="ml-2 h-1.5 w-1.5 rounded-full bg-white/60" />
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl font-semibold leading-[1.05] tracking-[-0.02em]">
              Hoodies.
              <span className="block text-white/70">Heavyweight • premium feel.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm md:text-base text-white/70 leading-relaxed">
              Kol kas shop’e rodom tik hoodius. Kai įkelsi realias produktų nuotraukas —
              tiesiog užpildysi <span className="text-white/85 font-semibold">imageUrl</span> DB ir viskas automatiškai atsinaujins.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
            <div className="text-xs tracking-[0.25em] text-white/60">AVAILABLE</div>
            <div className="mt-2 text-sm text-white/85">
              {products.length} item{products.length === 1 ? "" : "s"}
            </div>
            <div className="text-xs text-white/60">Active products</div>
          </div>
        </div>

        {/* Empty state */}
        {products.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">
            <div className="text-sm text-white/70">
              Dar nėra aktyvių produktų DB. Įkelk bent 1 hoodie į Prisma (Product),
              ir jis atsiras čia automatiškai.
            </div>
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="group rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl hover:bg-white/[0.07] transition"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                    <div className="aspect-[4/3] w-full">
                      <Image
                        src={p.imageUrl || "/logo.png"}
                        alt={p.name}
                        fill
                        className="object-contain p-10 opacity-90 group-hover:opacity-100 transition"
                        sizes="(max-width: 1024px) 90vw, 33vw"
                      />
                    </div>

                    <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] tracking-[0.25em] text-white/70">
                      HOODIE
                    </div>
                  </div>

                  {/* Info */}
                  <div className="mt-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="text-lg font-semibold leading-tight">
                        {p.name}
                      </div>
                      <div className="shrink-0 rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/80">
                        {formatMoney(p.priceCents, p.currency)}
                      </div>
                    </div>

                    {p.description ? (
                      <p className="mt-3 text-sm text-white/70 leading-relaxed">
                        {p.description}
                      </p>
                    ) : (
                      <p className="mt-3 text-sm text-white/50">
                        (Aprašymo dar nėra — pridėsi vėliau)
                      </p>
                    )}

                    <div className="mt-5 flex gap-3">
                      <Link
                        href={`/product/${p.id}`}
                        className="inline-flex flex-1 items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:opacity-90 transition"
                      >
                        View →
                      </Link>

                      <Link
                        href="/cart"
                        className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 transition"
                      >
                        Cart
                      </Link>
                    </div>

                    <div className="mt-4 text-xs text-white/55">
                      80% cotton / 20% polyester • 400–420 GSM • loopback
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="text-xs tracking-[0.25em] text-white/60">NEXT</div>
                <div className="mt-2 text-xl font-semibold">
                  Toliau padarom Product puslapį (dydžiai, nuotraukos, add to cart).
                </div>
                <div className="mt-1 text-white/70">
                  Tada shop’as atrodys kaip realus brand e-commerce.
                </div>
              </div>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 transition"
              >
                Back home →
              </Link>
            </div>
          </>
        )}
      </section>

      {/* Footer (simple, same vibe) */}
      <footer className="relative z-10 border-t border-white/10 bg-black/40">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-sm font-semibold tracking-[0.18em]">NAZ OUTLINES</div>
            <div className="mt-2 text-xs text-white/60">
              © {new Date().getFullYear()} • Auto culture × Premium streetwear
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-white/70">
            <Link href="/#about" className="hover:text-white transition">About</Link>
            <Link href="/#streetwear" className="hover:text-white transition">Streetwear</Link>
            <Link href="/#fabric" className="hover:text-white transition">Quality</Link>
            <Link href="/products" className="hover:text-white transition">Shop</Link>
            <Link href="/cart" className="hover:text-white transition">Cart</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}