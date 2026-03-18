import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { validatePrivateAccessToken } from "@/lib/private-access";
import ProductClient from "./ProductClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSpecs(price: number) {
  if (price === 12500) {
    return {
      subtitle: "Structured Asymmetric Hoodie",
      gsm: "480 GSM Heavy French Terry",
      composition: "80% Cotton / 20% Polyester",
      cut: "Engineered asymmetrical cut",
      energy: "Controlled structure",
      description:
        "A heavyweight NAZ silhouette built with sharp structure, premium density, and a controlled visual line.",
    };
  }

  return {
    subtitle: "Controlled Motorsport Structure Hoodie",
    gsm: "500 GSM Dense French Terry",
    composition: "80% Cotton / 20% Polyester",
    cut: "Architectural panel construction",
    energy: "Dark motorsport energy",
    description:
      "A premium NAZ hoodie shaped by tension, movement, and dark motorsport-inspired presence.",
  };
}

function formatMoney(cents: number, currency: string) {
  const amount = (cents / 100).toFixed(2);
  const cur = (currency || "EUR").toUpperCase();
  return cur === "EUR" ? `€${amount}` : `${amount} ${cur}`;
}

async function getProduct(id: string) {
  return prisma.product.findUnique({
    where: { id },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Product",
    };
  }

  return {
    title: product.name,
    description:
      product.description ||
      `${product.name} by NAZ. ${formatMoney(product.priceCents, product.currency)}.`,
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { id } = await params;
  const { token } = await searchParams;

  const product = await getProduct(id);

  if (!product || !product.active) {
    return (
      <div className="container-naz py-16 md:py-20">
        <Link
          href="/products"
          className="text-xs uppercase tracking-[0.28em] text-white/65 transition hover:text-white"
        >
          ← Back to shop
        </Link>

        <div className="naz-card mt-8 rounded-[2rem] p-8 sm:p-10">
          <p className="naz-eyebrow mb-4">Product</p>
          <h1 className="text-3xl font-medium text-white sm:text-4xl">
            Not found
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-white/62">
            This piece is unavailable or no longer active.
          </p>
        </div>
      </div>
    );
  }

  if (product.isPrivateDrop) {
    if (!product.dropSlug) {
      notFound();
    }

    if (!token) {
      redirect("/");
    }

    const access = await validatePrivateAccessToken({
      token,
      dropSlug: product.dropSlug,
    });

    if (!access) {
      redirect("/");
    }

    const tokenEmail = access.email?.toLowerCase().trim();
    const productAccessAllowed = await prisma.order.findFirst({
      where: {
        email: tokenEmail,
        nazPrivateAccess: true,
      },
      select: { id: true },
    });

    if (!productAccessAllowed) {
      redirect("/");
    }
  }

  const specs = getSpecs(product.priceCents);
  const mainImage = product.imageUrl || "/logo.png";

  const gallery = [mainImage, mainImage, mainImage, mainImage];

  return (
    <ProductClient
      product={{
        id: product.id,
        displayName: product.name,
        engineeredName: specs.subtitle,
        description: product.description || specs.description,
        priceCents: product.priceCents,
        currency: product.currency,
        imageUrl: product.imageUrl,
        stockS: product.stockS,
        stockM: product.stockM,
        stockL: product.stockL,
        isPrivateDrop: product.isPrivateDrop,
        dropSlug: product.dropSlug,
        accessToken: token || null,
      }}
      specs={{
        gsm: specs.gsm,
        composition: specs.composition,
        cut: specs.cut,
        energy: specs.energy,
      }}
      gallery={gallery}
    />
  );
}