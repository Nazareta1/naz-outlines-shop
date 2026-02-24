import Stripe from "stripe";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * Stripe price.product can be:
 * - string (product id) if not expanded
 * - Stripe.Product (has metadata)
 * - Stripe.DeletedProduct (has deleted: true, no metadata)
 */
function getInternalProductId(
  product: Stripe.Product | Stripe.DeletedProduct | string | null | undefined
): string | undefined {
  if (!product) return undefined;
  if (typeof product === "string") return undefined;
  if ("deleted" in product) return undefined; // DeletedProduct
  return product.metadata?.productId || undefined;
}

async function listAllLineItems(sessionId: string) {
  const all: Stripe.LineItem[] = [];
  let starting_after: string | undefined = undefined;

  while (true) {
    const page: Stripe.ApiList<Stripe.LineItem> =
      await stripe.checkout.sessions.listLineItems(sessionId, {
        limit: 100,
        starting_after,
        expand: ["data.price.product"],
      });

    all.push(...page.data);

    if (!page.has_more) break;

    starting_after = page.data[page.data.length - 1]?.id;
    if (!starting_after) break;
  }

  return all;
}

export async function POST(req: Request) {
  const sig = (await headers()).get("stripe-signature");
  if (!sig) return new Response("Missing stripe-signature header", { status: 400 });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return new Response("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });

  let event: Stripe.Event;

  try {
    const body = await req.text(); // raw body
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // 1) Retrieve session + customer_details for address/phone/email
        const full = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ["customer_details"],
        });

        const cd = full.customer_details;
        const addr = cd?.address;

        const stripeSessionId = full.id;

        const stripePaymentId =
          typeof full.payment_intent === "string"
            ? full.payment_intent
            : full.payment_intent?.id ?? null;

        const currency = (full.currency ?? "eur").toUpperCase();

        const totalCents = full.amount_total ?? 0;
        const subtotalCents = full.amount_subtotal ?? 0;
        const shippingCents = full.total_details?.amount_shipping ?? 0;

        // 2) Upsert Order (idempotent)
        const order = await prisma.order.upsert({
          where: { stripeSessionId },
          update: {
            stripePaymentId,
            paymentStatus: "paid",

            email: cd?.email ?? null,
            name: cd?.name ?? null,
            phone: cd?.phone ?? null,

            addressLine1: addr?.line1 ?? null,
            addressLine2: addr?.line2 ?? null,
            city: addr?.city ?? null,
            region: addr?.state ?? null,
            postalCode: addr?.postal_code ?? null,
            country: addr?.country ?? null,

            currency,
            subtotalCents,
            shippingCents,
            totalCents,
          },
          create: {
            stripeSessionId,
            stripePaymentId,
            paymentStatus: "paid",

            email: cd?.email ?? null,
            name: cd?.name ?? null,
            phone: cd?.phone ?? null,

            addressLine1: addr?.line1 ?? null,
            addressLine2: addr?.line2 ?? null,
            city: addr?.city ?? null,
            region: addr?.state ?? null,
            postalCode: addr?.postal_code ?? null,
            country: addr?.country ?? null,

            currency,
            subtotalCents,
            shippingCents,
            totalCents,
          },
        });

        // 3) Get Line Items the reliable way (listLineItems)
        const lineItems = await listAllLineItems(stripeSessionId);

        // 4) Idempotency for items: delete then recreate
        await prisma.orderItem.deleteMany({ where: { orderId: order.id } });

        const createItems = lineItems.map((li) => {
          const price = li.price;
          const prod = price?.product;

          const internalProductId = getInternalProductId(prod);

          if (!internalProductId) {
            throw new Error(
              `Missing metadata.productId on Stripe Product. ` +
                `Set Stripe Product metadata.productId = your DB Product.id. ` +
                `(session=${stripeSessionId})`
            );
          }

          return {
            orderId: order.id,
            productId: internalProductId,
            name: li.description ?? "Item",
            priceCents: price?.unit_amount ?? 0,
            quantity: li.quantity ?? 1,
          };
        });

        if (createItems.length) {
          await prisma.orderItem.createMany({ data: createItems });
        }

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.id) {
          await prisma.order.updateMany({
            where: { stripeSessionId: session.id },
            data: { paymentStatus: "failed" },
          });
        }
        break;
      }

      default:
        break;
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Webhook handler failed:", err);
    return new Response("Webhook handler failed", { status: 500 });
  }
}