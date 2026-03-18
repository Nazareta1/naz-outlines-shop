import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { validatePrivateAccessToken } from "@/lib/private-access";
import ProductClient from "./ProductClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getProductContent(price: number) {
  if (price === 12500) {
    return {
      eyebrow: "NAZ Signature Piece",
      subtitle: "Structured Asymmetric Hoodie",
      shortDescription:
        "A sharp, heavyweight silhouette shaped by structure, restraint, and controlled presence.",
      narrative:
        "Designed for those who do not ask to be seen. The Structured Asymmetric Hoodie brings together weight, line, and quiet intensity in a form that feels deliberate from every angle.",
      detailsIntro:
        "Every element is considered to create a stronger visual stance and a more elevated wearing experience.",
      gsm: "480 GSM heavy French terry",
      composition: "80% cotton / 20% polyester",
      cut: "Engineered asymmetric construction",
      energy: "Controlled, architectural presence",
      fit: "Boxy silhouette with a structured fall",
      finish: "Dense hand feel with a premium weighted drape",
      mood: "Built for presence, not noise",
    };
  }

  return {
    eyebrow: "NAZ Signature Piece",
    subtitle: "Controlled Motorsport Structure Hoodie",
    shortDescription:
      "A dense, premium silhouette informed by tension, movement, and dark motorsport energy.",
    narrative:
      "This piece translates motorsport attitude into a sharper fashion language. Strong lines, elevated weight, and controlled construction give it a presence that feels immediate and intentional.",
    detailsIntro:
      "Created to feel substantial on the body and visually precise in motion.",
    gsm: "500 GSM dense French terry",
    composition: "80% cotton / 20% polyester",
    cut: "Architectural panel construction",
    energy: "Dark motorsport-inspired force",
    fit: "Oversized structure with a strong outline",
    finish: "Heavy premium feel with controlled shape retention",
    mood: "Engineered to be remembered",
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
      title: "Product | NAZ",
      description: "Luxury streetwear shaped by confidence, structure, and presence.",
    };
  }

  const content = getProductContent(product.priceCents);

  return {
    title: `${content.subtitle} | NAZ`,
    description:
      product.description ||
      `${content.subtitle} by NAZ. ${formatMoney(product.priceCents, product.currency)}. Luxury streetwear shaped by confidence, structure, and presence.`,
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
            This piece is unavailable
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-white/62">
            The product you are looking for is currently unavailable or no longer
            part of the active collection.
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

  const content = getProductContent(product.priceCents);
  const mainImage = product.imageUrl || "/logo.png";

  const gallery = [mainImage, mainImage, mainImage, mainImage];

  return (
    <ProductClient
      product={{
        id: product.id,
        displayName: product.name,
        engineeredName: content.subtitle,
        description: product.description || content.shortDescription,
        narrative: content.narrative,
        detailsIntro: content.detailsIntro,
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
        gsm: content.gsm,
        composition: content.composition,
        cut: content.cut,
        energy: content.energy,
        fit: content.fit,
        finish: content.finish,
        mood: content.mood,
      }}
      gallery={gallery}
      eyebrow={content.eyebrow}
    />
  );
}