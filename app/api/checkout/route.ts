import Stripe from 'stripe'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

type CheckoutItem = {
  id: string
  name: string
  price: number // EUR
  quantity: number
}

export async function POST(req: Request) {
  try {
    const origin = process.env.NEXT_PUBLIC_SITE_URL
    if (!origin) {
      return NextResponse.json(
        { error: 'Missing NEXT_PUBLIC_SITE_URL in env' },
        { status: 500 }
      )
    }

    const body = await req.json()
    const items: CheckoutItem[] = Array.isArray(body?.items) ? body.items : []

    if (!items.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    for (const it of items) {
      if (!it?.name || typeof it.price !== 'number' || typeof it.quantity !== 'number') {
        return NextResponse.json({ error: 'Invalid items payload' }, { status: 400 })
      }
      if (it.price <= 0 || it.quantity <= 0) {
        return NextResponse.json({ error: 'Invalid price/quantity' }, { status: 400 })
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],

      shipping_address_collection: {
        allowed_countries: ['LT', 'LV', 'EE', 'PL', 'DE'],
      },
      phone_number_collection: { enabled: true },
      billing_address_collection: 'required',
      allow_promotion_codes: true,

      line_items: items.map((it) => ({
        quantity: it.quantity,
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(it.price * 100),
          product_data: {
            name: it.name,
            metadata: { productId: it.id },
          },
        },
      })),

      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Checkout error:', err)
    return NextResponse.json(
      { error: err?.message ?? 'Internal Server Error' },
      { status: 500 }
    )
  }
}