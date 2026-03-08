import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatMoney(cents: number, currency: string) {
  const amount = (cents / 100).toFixed(2);
  const cur = (currency || "EUR").toUpperCase();
  return cur === "EUR" ? `€${amount}` : `${amount} ${cur}`;
}

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" as any },
    take: 4,
  });

  return (
    <div className="bg-transparent text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_35%,rgba(0,0,0,0.4))]" />

        <div className="container-naz relative grid min-h-[88vh] items-end gap-10 py-16 md:grid-cols-[1.15fr_0.85fr] md:py-20">
          <div className="max-w-3xl pb-8 md:pb-14">
            <p className="naz-eyebrow mb-6">Luxury streetwear / motorsport presence</p>

            <h1 className="naz-heading-xl max-w-4xl text-white">
              NAZ
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
              Luxury streetwear shaped by confidence, elegance, and controlled
              intensity. Designed for presence. Built to be remembered.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/products" className="naz-button">
                Shop Drop
              </Link>
              <Link href="/about" className="naz-button-secondary">
                Read the Story
              </Link>
            </div>
          </div>

          <div className="relative flex items-end justify-center md:justify-end">
            <div className="naz-card relative w-full max-w-[560px] overflow-hidden rounded-[2rem]">
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.65),rgba(0,0,0,0.15))]" />
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src="/logo.png"
                  alt="NAZ hero"
                  fill
                  className="object-cover object-center opacity-90"
                  priority
                />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/55">
                  Drop 01
                </p>
                <p className="mt-2 text-2xl font-medium text-white sm:text-3xl">
                  Designed for presence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-naz py-18 border-b border-white/10 py-20">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="naz-eyebrow mb-4">New drop</p>
            <h2 className="naz-heading-lg text-white">Featured pieces</h2>
          </div>

          <Link
            href="/products"
            className="text-sm uppercase tracking-[0.2em] text-white/65 transition hover:text-white"
          >
            View all
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="naz-card rounded-[1.75rem] p-8 text-white/70">
            No active products yet. Add your first NAZ pieces in the admin or database.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group block"
              >
                <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03]">
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-white/[0.04] text-sm uppercase tracking-[0.22em] text-white/35">
                        NAZ
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-sm font-medium uppercase tracking-[0.14em] text-white">
                        {product.name}
                      </h3>
                      <span className="text-sm text-white/70">
                        {formatMoney(product.priceCents, product.currency)}
                      </span>
                    </div>

                    {product.description ? (
                      <p className="line-clamp-2 text-sm leading-7 text-white/50">
                        {product.description}
                      </p>
                    ) : (
                      <p className="text-sm leading-7 text-white/40">
                        Premium NAZ piece.
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="container-naz border-b border-white/10 py-20">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="naz-card rounded-[1.75rem] p-8">
            <p className="naz-eyebrow mb-4">Presence</p>
            <h3 className="text-2xl font-medium text-white">
              Built to be noticed without asking for attention.
            </h3>
            <p className="mt-4 text-sm leading-8 text-white/62">
              NAZ is made for people who carry energy before they speak. Sharp,
              controlled, elegant, and impossible to ignore.
            </p>
          </div>

          <div className="naz-card rounded-[1.75rem] p-8">
            <p className="naz-eyebrow mb-4">Quality</p>
            <h3 className="text-2xl font-medium text-white">
              Premium silhouettes with heavyweight attitude.
            </h3>
            <p className="mt-4 text-sm leading-8 text-white/62">
              Oversized structure, strong lines, premium materials, and limited
              pieces designed to feel substantial the moment you put them on.
            </p>
          </div>

          <div className="naz-card rounded-[1.75rem] p-8">
            <p className="naz-eyebrow mb-4">Energy</p>
            <h3 className="text-2xl font-medium text-white">
              Motorsport influence, translated into fashion presence.
            </h3>
            <p className="mt-4 text-sm leading-8 text-white/62">
              Tension, movement, darkness, elegance, and speed shape the visual
              language behind every NAZ release.
            </p>
          </div>
        </div>
      </section>

      <section className="container-naz grid gap-10 py-20 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div className="max-w-2xl">
          <p className="naz-eyebrow mb-4">The story behind the name</p>
          <h2 className="naz-heading-lg text-white">
            NAZ began the moment confidence stopped asking for permission.
          </h2>
          <p className="mt-6 text-base leading-8 text-white/68">
            What started as a name became an identity. NAZ is rooted in a moment
            of freedom, self-trust, and becoming fully comfortable with being
            seen exactly as you are.
          </p>
          <p className="mt-4 text-base leading-8 text-white/68">
            That feeling now lives inside the brand — elegant, sharp, powerful,
            and unapologetically present.
          </p>

          <div className="mt-8">
            <Link href="/about" className="naz-button">
              Discover About NAZ
            </Link>
          </div>
        </div>

        <div className="naz-card overflow-hidden rounded-[2rem]">
          <div className="relative aspect-[4/5] w-full">
            <Image
              src="/logo.png"
              alt="About NAZ"
              fill
              className="object-cover object-center opacity-90"
            />
          </div>
        </div>
      </section>
    </div>
  );
}