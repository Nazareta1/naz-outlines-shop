import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) throw new Error("Missing STRIPE_SECRET_KEY in env");

const stripe = new Stripe(stripeSecretKey);

type CheckoutItemInput = {
  id: unknown;
  quantity: unknown;
};

function getOrigin(req: Request) {
  const envOrigin = process.env.NEXT_PUBLIC_SITE_URL;
  if (envOrigin) return envOrigin.replace(/\/$/, "");

  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!host) return null;

  return `${proto}://${host}`;
}

function toInt(n: unknown) {
  const x = typeof n === "string" ? Number(n) : (n as number);
  return Number.isFinite(x) ? Math.floor(x) : NaN;
}

export async function POST(req: Request) {
  try {
    const origin = getOrigin(req);
    if (!origin) {
      return NextResponse.json({ error: "Could not determine site origin" }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const raw: CheckoutItemInput[] = Array.isArray(body?.items) ? body.items : [];

    if (!raw.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 1) normalize + validate
    const normalized: { id: string; quantity: number }[] = [];

    for (const it of raw) {
      const id = String(it?.id ?? "").trim();
      const qty = toInt(it?.quantity);

      if (!id || !Number.isInteger(qty) || qty <= 0 || qty > 20) {
        return NextResponse.json({ error: "Invalid items payload" }, { status: 400 });
      }

      normalized.push({ id, quantity: qty });
    }

    // 2) merge duplicates
    const qtyById = new Map<string, number>();
    for (const it of normalized) {
      qtyById.set(it.id, (qtyById.get(it.id) ?? 0) + it.quantity);
    }

    const ids = Array.from(qtyById.keys());

    // 3) load products from DB (price comes ONLY from DB)
    const products = await prisma.product.findMany({
      where: { id: { in: ids }, active: true },
      select: { id: true, name: true, priceCents: true, currency: true },
    });

    if (products.length !== ids.length) {
      return NextResponse.json({ error: "One or more products are unavailable" }, { status: 400 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = products.map((p) => {
      const quantity = qtyById.get(p.id) ?? 1;
      const currency = (p.currency || "EUR").toLowerCase();

      return {
        quantity,
        price_data: {
          currency,
          unit_amount: p.priceCents,
          product_data: {
            name: p.name,
            metadata: { productId: p.id },
          },
        },
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      billing_address_collection: "required",
      shipping_address_collection: { allowed_countries: ["LT", "LV", "EE", "PL", "DE"] },
      phone_number_collection: { enabled: true },
      allow_promotion_codes: true,

      metadata: { source: "naz-e-shop", productIds: ids.join(",") },

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