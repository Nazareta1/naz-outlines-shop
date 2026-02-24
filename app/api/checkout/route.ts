import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY in env");
}

const stripe = new Stripe(stripeSecretKey);

type CheckoutItem = {
  id: string;      // tavo DB Product.id
  name: string;
  price: number;   // EUR
  quantity: number;
};

function getOrigin(req: Request) {
  // 1) Prefer env (production)
  const envOrigin = process.env.NEXT_PUBLIC_SITE_URL;
  if (envOrigin) return envOrigin.replace(/\/$/, "");

  // 2) Fallback from request headers (preview/dev)
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!host) return null;
  return `${proto}://${host}`;
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
    const items: CheckoutItem[] = Array.isArray(body?.items) ? body.items : [];

    if (!items.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    for (const it of items) {
      if (
        !it?.id ||
        !it?.name ||
        typeof it.price !== "number" ||
        typeof it.quantity !== "number"
      ) {
        return NextResponse.json({ error: "Invalid items payload" }, { status: 400 });
      }
      if (it.price <= 0 || it.quantity <= 0) {
        return NextResponse.json({ error: "Invalid price/quantity" }, { status: 400 });
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      shipping_address_collection: {
        allowed_countries: ["LT", "LV", "EE", "PL", "DE"],
      },
      phone_number_collection: { enabled: true },
      billing_address_collection: "required",
      allow_promotion_codes: true,

      // kad Stripe įraše matytum šaltinį
      metadata: {
        source: "naz-outlines-shop",
      },

      line_items: items.map((it) => ({
        quantity: it.quantity,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(it.price * 100),

          // ✅ SVARBIAUSIA: productId įrašom į PRICE metadata
          metadata: { productId: it.id },

          // Optional: paliekam ir product metadata (nebūtina, bet ok)
          product_data: {
            name: it.name,
            metadata: { productId: it.id },
          },
        },
      })),

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