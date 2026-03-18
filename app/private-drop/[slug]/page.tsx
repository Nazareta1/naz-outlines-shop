import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { validatePrivateAccessToken } from "@/lib/private-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatMoney(cents: number, currency: string) {
  const amount = (cents / 100).toFixed(2);
  return currency?.toUpperCase() === "EUR"
    ? `${amount} €`
    : `${amount} ${currency}`;
}

export default async function PrivateDropPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { slug } = await params;
  const { token } = await searchParams;

  if (!token) {
    redirect("/");
  }

  const access = await validatePrivateAccessToken({
    token,
    dropSlug: slug,
  });

  if (!access) {
    redirect("/");
  }

  const accessEmail = access.email.toLowerCase().trim();

  const hasNazPrivateAccess = await prisma.order.findFirst({
    where: {
      email: accessEmail,
      nazPrivateAccess: true,
    },
    select: { id: true },
  });

  if (!hasNazPrivateAccess) {
    redirect("/");
  }

  const products = await prisma.product.findMany({
    where: {
      active: true,
      isPrivateDrop: true,
      dropSlug: slug,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 md:p-10">
          <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-white/70">
            NAZ Private Access
          </div>

          <h1 className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
            Private drop access.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-8 text-white/70 md:text-base">
            You are viewing this release before the public launch.
            This access is reserved for selected clients.
          </p>

          <div className="mt-6 text-[11px] uppercase tracking-[0.24em] text-white/40">
            Drop: {slug}
          </div>
        </div>

        {products.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 text-white/70">
            No products are available in this private drop yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]"
              >
                {product.imageUrl ? (
                  <div className="relative aspect-[4/5] bg-zinc-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/5] bg-zinc-950" />
                )}

                <div className="p-6">
                  <div className="mb-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/60">
                    Private release
                  </div>

                  <h2 className="text-2xl font-medium tracking-[-0.02em]">
                    {product.name}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-white/60">
                    {product.description || "NAZ Private Access release"}
                  </p>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <span className="text-lg font-semibold">
                      {formatMoney(product.priceCents, product.currency)}
                    </span>

                    <Link
                      href={`/product/${product.id}?token=${token}`}
                      className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black"
                    >
                      View piece
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}