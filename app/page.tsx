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
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_40%,rgba(0,0,0,0.5))]" />

        <div className="container-naz relative grid min-h-[88vh] items-end gap-10 py-16 md:grid-cols-[1.15fr_0.85fr] md:py-20">
          <div className="max-w-3xl pb-8 md:pb-14">
            <p className="naz-eyebrow mb-6">
              NAZ / Luxury streetwear / Motorsport influence
            </p>

            <h1 className="naz-heading-xl max-w-4xl text-white">
              Designed for presence.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
              A controlled expression of confidence, elegance, and movement.
              Each piece is built to hold attention without asking for it.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/products" className="naz-button">
                Shop Drop 01
              </Link>

              <Link href="/about" className="naz-button-secondary">
                Discover the story
              </Link>
            </div>

            <p className="mt-6 text-xs uppercase tracking-[0.28em] text-white/40">
              Limited release · No restock
            </p>
          </div>

          <div className="relative flex items-end justify-center md:justify-end">
            <div className="naz-card relative w-full max-w-[560px] overflow-hidden rounded-[2rem]">
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.65),rgba(0,0,0,0.1))]" />

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
                  Built to be remembered.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-b border-white/10">
        <div className="container-naz grid gap-6 py-6 text-xs uppercase tracking-[0.28em] text-white/45 sm:grid-cols-3">
          <div className="flex justify-between sm:block">
            <span>Secure checkout</span>
            <span className="text-white/70">Stripe</span>
          </div>
          <div className="flex justify-between sm:block">
            <span>Shipping</span>
            <span className="text-white/70">Tracked EU delivery</span>
          </div>
          <div className="flex justify-between sm:block">
            <span>Returns</span>
            <span className="text-white/70">14-day window</span>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="container-naz border-b border-white/10 py-20">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="naz-eyebrow mb-4">Current release</p>
            <h2 className="naz-heading-lg text-white">Drop 01</h2>
          </div>

          <Link
            href="/products"
            className="text-sm uppercase tracking-[0.2em] text-white/65 transition hover:text-white"
          >
            View all pieces
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="naz-card rounded-[1.75rem] p-8 text-white/70">
            No active products yet.
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
                        className="object-cover object-center transition duration-500 group-hover:scale-[1.04]"
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

                    <p className="text-xs uppercase tracking-[0.24em] text-white/35">
                      Limited piece
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* BRAND BLOCKS */}
      <section className="container-naz border-b border-white/10 py-20">
        <div className="grid gap-8 lg:grid-cols-3">
          <FeatureCard
            title="Presence"
            text="Built for individuals who hold attention without seeking it."
          />
          <FeatureCard
            title="Structure"
            text="Heavyweight silhouettes with controlled lines and strong identity."
          />
          <FeatureCard
            title="Energy"
            text="Motorsport influence translated into a refined visual language."
          />
        </div>
      </section>

      {/* STORY */}
      <section className="container-naz grid gap-10 py-20 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div className="max-w-2xl">
          <p className="naz-eyebrow mb-4">The origin</p>

          <h2 className="naz-heading-lg text-white">
            NAZ began with a shift in identity.
          </h2>

          <p className="mt-6 text-base leading-8 text-white/68">
            A moment where self-perception changed, and confidence no longer
            required validation. What started as a name became a presence.
          </p>

          <p className="mt-4 text-base leading-8 text-white/68">
            Today, NAZ represents a refined form of that feeling — controlled,
            elegant, and impossible to overlook.
          </p>

          <div className="mt-8">
            <Link href="/about" className="naz-button">
              Read full story
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

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="naz-card rounded-[1.75rem] p-8">
      <p className="naz-eyebrow mb-4">{title}</p>

      <h3 className="text-2xl font-medium text-white">{title}</h3>

      <p className="mt-4 text-sm leading-8 text-white/62">{text}</p>
    </div>
  );
}