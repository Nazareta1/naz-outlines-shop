// app/product/[id]/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import ProductClient from "./ProductClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatMoney(cents: number, currency: string) {
  const amount = (cents / 100).toFixed(2);
  const cur = (currency || "EUR").toUpperCase();
  return cur === "EUR" ? `€${amount}` : `${amount} ${cur}`;
}

function getSpecs(price: number) {
  // 125€ modelis
  if (price === 12500) {
    return {
      subtitle: "Structured Asymmetric Hoodie",
      gsm: "480 GSM Heavy French Terry",
      composition: "80% Cotton / 20% Polyester",
      cut: "Engineered asymmetrical cut",
      energy: "Controlled structure",
    };
  }

  // 139€ modelis
  return {
    subtitle: "Controlled Motorsport Structure Hoodie",
    gsm: "500 GSM Dense French Terry",
    composition: "80% Cotton / 20% Polyester",
    cut: "Architectural panel construction",
    energy: "Dark motorsport energy",
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product || !product.active) {
    return (
      <main className="min-h-screen bg-[#0E0E10] text-[#F2F2F2]">
        <Navbar />
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Link
            href="/products"
            className="text-xs tracking-[0.28em] uppercase text-white/70 hover:text-white transition"
          >
            ← Back
          </Link>
          <div className="mt-12 border border-white/10 bg-[#141416] rounded-[28px] p-12">
            <div className="text-xs tracking-[0.35em] uppercase text-white/45">
              Product
            </div>
            <h1 className="mt-4 text-3xl font-semibold">Not found</h1>
          </div>
        </div>
      </main>
    );
  }

  const specs = getSpecs(product.priceCents);

  const img = product.imageUrl || "/logo.png";
  const gallery = Array.from({ length: 6 }, () => img);

  return (
    <ProductClient
      product={{
        id: product.id,
        name: specs.subtitle, // rodome engineered pavadinimą
        priceCents: product.priceCents,
        currency: product.currency,
        imageUrl: product.imageUrl,
      }}
      specs={specs}
      gallery={gallery}
      formatMoney={formatMoney}
    />
  );
}