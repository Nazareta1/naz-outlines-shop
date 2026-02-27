import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) throw new Error("Missing STRIPE_SECRET_KEY in env");

const stripe = new Stripe(stripeSecretKey, {
  // jei nori – gali įrašyti apiVersion, bet nebūtina jei veikia
  // apiVersion: "2024-06-20",
});

type CheckoutItemInput = {
  id: string; // Product.id
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

export async function POST(req: Request) {
  try {
    const origin = getOrigin(req);
    if (!origin) {
      return NextResponse.json(
        { error: "Could not determine site origin" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const rawItems: CheckoutItemInput[] = Array.isArray(body?.items) ? body.items : [];

    if (!rawItems.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // validate payload (no price/name from client)
    for (const it of rawItems) {
      if (!it?.id || typeof it.id !== "string" || !isSafeQty(it.quantity)) {
        return NextResponse.json(
          { error: "Invalid items payload" },
          { status: 400 }
        );
      }
    }

    // merge duplicates by id (just in case)
    const qtyById = new Map<string, number>();
    for (const it of rawItems) {
      qtyById.set(it.id, (qtyById.get(it.id) ?? 0) + it.quantity);
    }

    const ids = Array.from(qtyById.keys());

    const products = await prisma.product.findMany({
      where: {
        id: { in: ids },
        active: true,
      },
      select: {
        id: true,
        name: true,
        priceCents: true,
        currency: true,
      },
    });

    if (products.length !== ids.length) {
      return NextResponse.json(
        { error: "One or more products are unavailable" },
        { status: 400 }
      );
    }

    // build line items from DB
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = products.map(
      (p) => {
        const quantity = qtyById.get(p.id) ?? 1;

        // Stripe expects lowercase ISO currency (eur, usd...)
        const currency = (p.currency || "EUR").toLowerCase();

        return {
          quantity,
          price_data: {
            currency,
            unit_amount: p.priceCents,
            product_data: {
              name: p.name,
              metadata: {
                productId: p.id,
              },
            },
          },
        };
      }
    );

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      // controlled + clean checkout experience
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["LT", "LV", "EE", "PL", "DE"],
      },
      phone_number_collection: { enabled: true },

      // optional: if you want strict “no promo noise”, set false
      // allow_promotion_codes: false,
      allow_promotion_codes: true,

      metadata: {
        source: "naz-e-shop",
        productIds: ids.join(","),
      },

      line_items,

      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}