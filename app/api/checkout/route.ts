import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { validatePrivateAccessToken } from "@/lib/private-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

type CartItem = {
  id: string;
  name: string;
  priceCents: number;
  currency: string;
  imageUrl?: string;
  size: "S" | "M" | "L";
  quantity: number;
  accessToken?: string | null;
};

function getAvailableStock(
  product: {
    stockS: number;
    stockM: number;
    stockL: number;
  },
  size: "S" | "M" | "L"
) {
  if (size === "S") return product.stockS;
  if (size === "M") return product.stockM;
  return product.stockL;
}

function isValidCartItem(item: unknown): item is CartItem {
  if (!item || typeof item !== "object") return false;

  const value = item as Record<string, unknown>;

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.priceCents === "number" &&
    Number.isInteger(value.priceCents) &&
    value.priceCents > 0 &&
    typeof value.currency === "string" &&
    (value.size === "S" || value.size === "M" || value.size === "L") &&
    typeof value.quantity === "number" &&
    Number.isInteger(value.quantity) &&
    value.quantity > 0 &&
    value.quantity <= 10 &&
    (value.accessToken === undefined ||
      value.accessToken === null ||
      typeof value.accessToken === "string")
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawItems = body?.items;

    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return Response.json({ error: "Your cart is empty." }, { status: 400 });
    }

    if (!rawItems.every(isValidCartItem)) {
      return Response.json(
        { error: "Your cart contains invalid data. Please refresh and try again." },
        { status: 400 }
      );
    }

    const items: CartItem[] = rawItems;

    const productIds = [...new Set(items.map((item) => item.id))];

    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        active: true,
      },
      select: {
        id: true,
        name: true,
        priceCents: true,
        currency: true,
        stockS: true,
        stockM: true,
        stockL: true,
        isPrivateDrop: true,
        dropSlug: true,
      },
    });

    if (products.length !== productIds.length) {
      return Response.json(
        { error: "One or more selected pieces are no longer available." },
        { status: 400 }
      );
    }

    for (const item of items) {
      const product = products.find((p) => p.id === item.id);

      if (!product) {
        return Response.json(
          { error: `Product not found: ${item.name}.` },
          { status: 400 }
        );
      }

      if (product.currency.toUpperCase() !== item.currency.toUpperCase()) {
        return Response.json(
          {
            error: `Currency mismatch for ${product.name}. Please refresh your cart.`,
          },
          { status: 400 }
        );
      }

      if (product.priceCents !== item.priceCents) {
        return Response.json(
          {
            error: `The price for ${product.name} has changed. Please refresh your cart.`,
          },
          { status: 400 }
        );
      }

      if (product.isPrivateDrop) {
        const token = item.accessToken;

        if (!token) {
          return Response.json(
            { error: "Private drop access is required for this piece." },
            { status: 403 }
          );
        }

        if (!product.dropSlug) {
          return Response.json(
            { error: "This private drop is not configured correctly." },
            { status: 400 }
          );
        }

        const access = await validatePrivateAccessToken({
          token,
          dropSlug: product.dropSlug,
        });

        if (!access) {
          return Response.json(
            { error: "Your private access has expired or is invalid." },
            { status: 403 }
          );
        }

        const tokenEmail = access.email?.toLowerCase().trim();

        if (!tokenEmail) {
          return Response.json(
            { error: "Private access could not be verified." },
            { status: 403 }
          );
        }

        const hasNazPrivateAccess = await prisma.order.findFirst({
          where: {
            email: tokenEmail,
            nazPrivateAccess: true,
          },
          select: { id: true },
        });

        if (!hasNazPrivateAccess) {
          return Response.json(
            { error: "This private piece is not available for this access." },
            { status: 403 }
          );
        }
      }

      const available = getAvailableStock(product, item.size);

      if (available < item.quantity) {
        return Response.json(
          {
            error: `Not enough stock for ${product.name} in size ${item.size}. Available: ${available}.`,
          },
          { status: 400 }
        );
      }
    }

    const subtotalCents = items.reduce(
      (sum, item) => sum + item.priceCents * item.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        currency: "EUR",
        paymentStatus: "pending",
        fulfillmentStatus: "unfulfilled",
        subtotalCents,
        totalCents: subtotalCents,
        items: {
          create: items.map((item) => ({
            productId: item.id,
            name: item.name,
            priceCents: item.priceCents,
            quantity: item.quantity,
            size: item.size,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "eur",
          unit_amount: item.priceCents,
          product_data: {
            name: `${item.name} / ${item.size}`,
            description: "NAZ luxury streetwear",
          },
        },
      })
    );

    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      phone_number_collection: {
        enabled: true,
      },
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["LT", "LV", "EE", "PL", "DE"],
      },
      customer_creation: "always",
      allow_promotion_codes: false,
      metadata: {
        orderId: order.id,
        brand: "NAZ",
      },
      custom_text: {
        submit: {
          message: "Secure payment processed by Stripe.",
        },
      },
    });

    if (!session.url) {
      throw new Error("Stripe session URL is missing.");
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripeSessionId: session.id,
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to start checkout at the moment.",
      },
      { status: 500 }
    );
  }
}