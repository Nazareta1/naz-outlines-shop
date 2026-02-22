import Stripe from "stripe";
import { headers } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
});

export async function POST(req: Request) {
  const sig = (await headers()).get("stripe-signature");
  if (!sig) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response("Missing STRIPE_WEBHOOK_SECRET env var", { status: 500 });
  }

  let event: Stripe.Event;

  try {
    const body = await req.text(); // IMPORTANT: raw body
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err?.message ?? "Invalid signature"}`, {
      status: 400,
    });
  }

  try {
    // ✅ čia gali daryti savo logiką / DB update
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // console.log("✅ checkout.session.completed", session.id);
        break;
      }

      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;
        // console.log("✅ payment_intent.succeeded", pi.id);
        break;
      }

      default:
        // console.log(`Unhandled event type ${event.type}`);
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(`Webhook handler error: ${err?.message ?? "Unknown error"}`, {
      status: 500,
    });
  }
}