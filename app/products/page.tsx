import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Discover the latest NAZ pieces — luxury streetwear shaped by structure, presence, and controlled intensity.",
};

function formatMoney(cents: number, currency: string) {
  const amount = (cents / 100).toFixed(2);
  const cur = (currency || "EUR").toUpperCase();
  return cur === "EUR" ? `€${amount}` : `${amount} ${cur}`;
}

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-transparent text-white">
      <section className="border-b border-white/10">
        <div className="container-naz py-20 md:py-24">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="naz-eyebrow mb-5">Shop</p>
              <h1 className="naz-heading-lg text-white">Structured Drop 01</h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/68">
                Premium silhouettes, controlled presence, and dark luxury
                direction. Designed to feel sharp, substantial, and memorable.
              </p>
            </div>

            <div className="lg:text-right">
              <p className="text-xs uppercase tracking-[0.28em] text-white/45">
                Limited production
              </p>
              <p className="mt-3 text-sm leading-7 text-white/58">
                Each release is designed to carry the visual language of NAZ —
                elegance, tension, and power.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-naz py-16 md:py-20">
        {products.length === 0 ? (
          <div className="naz-card rounded-[1.75rem] p-8 sm:p-10">
            <p className="naz-eyebrow mb-4">No active pieces yet</p>
            <h2 className="text-2xl font-medium text-white sm:text-3xl">
              The next drop is being prepared.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-white/62">
              Add active products in your database and they will appear here
              automatically.
            </p>

            <div className="mt-8">
              <Link href="/" className="naz-button-secondary">
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                {products.length} piece{products.length > 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group block"
                >
                  <article className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] transition duration-300 hover:border-white/20 hover:bg-white/[0.045]">
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-white/[0.03]">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover object-center transition duration-500 group-hover:scale-[1.035]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-sm uppercase tracking-[0.28em] text-white/30">
                            NAZ
                          </span>
                        </div>
                      )}

                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    <div className="space-y-3 p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.24em] text-white/42">
                            NAZ
                          </p>
                          <h2 className="mt-2 text-lg font-medium text-white">
                            {product.name}
                          </h2>
                        </div>

                        <p className="whitespace-nowrap text-sm text-white/72">
                          {formatMoney(product.priceCents, product.currency)}
                        </p>
                      </div>

                      <p className="line-clamp-2 text-sm leading-7 text-white/56">
                        {product.description || "Premium NAZ piece."}
                      </p>

                      <div className="pt-2">
                        <span className="inline-flex items-center text-xs uppercase tracking-[0.22em] text-white/70 transition group-hover:text-white">
                          View piece
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}