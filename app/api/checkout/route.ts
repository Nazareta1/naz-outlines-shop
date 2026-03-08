import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items = body?.items as CartItem[] | undefined;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return Response.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const productIds = [...new Set(items.map((item) => item.id))];

    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        active: true,
      },
    });

    if (products.length !== productIds.length) {
      return Response.json(
        { error: "One or more products are unavailable." },
        { status: 400 }
      );
    }

    for (const item of items) {
      const product = products.find((p) => p.id === item.id);

      if (!product) {
        return Response.json(
          { error: `Product not found: ${item.name}` },
          { status: 400 }
        );
      }

      if (product.priceCents !== item.priceCents) {
        return Response.json(
          { error: `Price changed for ${product.name}. Please refresh your cart.` },
          { status: 400 }
        );
      }

      const available = getAvailableStock(product, item.size);

      if (available < item.quantity) {
        return Response.json(
          {
            error: `Not enough stock for ${product.name} (${item.size}). Available: ${available}.`,
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
            images: item.imageUrl ? [item.imageUrl] : undefined,
          },
        },
      })
    );

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      new URL(req.url).origin;

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
      metadata: {
        orderId: order.id,
      },
    });

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
      { error: "Unable to start checkout." },
      { status: 500 }
    );
  }
}