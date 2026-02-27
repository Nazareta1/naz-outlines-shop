import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Size = "S" | "M" | "L";

type CheckoutItemInput = {
  id: string;
  size: Size;
  quantity: number;
};

function getOrigin(req: Request) {
  const envOrigin = process.env.NEXT_PUBLIC_SITE_URL;
  if (envOrigin) return envOrigin.replace(/\/$/, "");

  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!host) return null;

  return `${proto}://${host}`;
}

function isSafeQty(n: unknown) {
  return Number.isInteger(n) && (n as number) > 0 && (n as number) <= 20;
}

function isSize(s: any): s is Size {
  return s === "S" || s === "M" || s === "L";
}

function stockFor(p: { stockS: number; stockM: number; stockL: number }, size: Size) {
  if (size === "S") return p.stockS;
  if (size === "M") return p.stockM;
  return p.stockL;
}

export async function POST(req: Request) {
  try {
    const origin = getOrigin(req);
    if (!origin) {
      return NextResponse.json({ error: "Could not determine site origin" }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const rawItems: CheckoutItemInput[] = Array.isArray(body?.items) ? body.items : [];

    if (!rawItems.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    for (const it of rawItems) {
      if (!it?.id || typeof it.id !== "string" || !isSize(it.size) || !isSafeQty(it.quantity)) {
        return NextResponse.json({ error: "Invalid items payload" }, { status: 400 });
      }
    }

    // merge duplicates by (id,size)
    const key = (id: string, size: Size) => `${id}__${size}`;
    const qtyByKey = new Map<string, number>();
    for (const it of rawItems) {
      qtyByKey.set(key(it.id, it.size), (qtyByKey.get(key(it.id, it.size)) ?? 0) + it.quantity);
    }

    const ids = Array.from(new Set(rawItems.map((x) => x.id)));

    const products = await prisma.product.findMany({
      where: { id: { in: ids }, active: true },
      select: { id: true, name: true, priceCents: true, currency: true, stockS: true, stockM: true, stockL: true },
    });

    if (products.length !== ids.length) {
      return NextResponse.json({ error: "One or more products are unavailable" }, { status: 400 });
    }

    // stock check
    for (const it of rawItems) {
      const p = products.find((pp) => pp.id === it.id)!;
      const requested = qtyByKey.get(key(it.id, it.size)) ?? 0;
      const available = stockFor(p, it.size);
      if (requested > available) {
        return NextResponse.json(
          { error: `Insufficient stock for ${p.name} (${it.size}). Available: ${available}` },
          { status: 400 }
        );
      }
    }

    const mergedCart = Array.from(qtyByKey.entries()).map(([k, q]) => {
      const [id, size] = k.split("__") as [string, Size];
      return { id, size, quantity: q };
    });

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = mergedCart.map((it) => {
      const p = products.find((pp) => pp.id === it.id)!;
      const currency = (p.currency || "EUR").toLowerCase();

      return {
        quantity: it.quantity,
        price_data: {
          currency,
          unit_amount: p.priceCents,
          product_data: {
            name: `${p.name} — ${it.size}`,
            metadata: {
              productId: p.id,
              size: it.size,
            },
          },
        },
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      billing_address_collection: "required",
      shipping_address_collection: { allowed_countries: ["LT", "LV", "EE", "PL", "DE"] },
      phone_number_collection: { enabled: true },

      allow_promotion_codes: false, // ✅ luxury clean

      metadata: {
        source: "naz-e-shop",
        cart: JSON.stringify(mergedCart), // ✅ webhook nurašymui
      },

      line_items,

      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: err?.message ?? "Internal Server Error" }, { status: 500 });
  }
}