'use client'

import { useEffect, useState } from 'react'
import { useCart } from '../cart/context'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { items, subtotal } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (items.length === 0) {
      // jei tu nori - gali palikti checkout be redirect
      // router.push('/cart')
    }
  }, [items.length, router])

  const startCheckout = async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to create checkout session')

      if (!data?.url) throw new Error('Missing Stripe session URL')
      window.location.href = data.url
    } catch (e: any) {
      setError(e.message || 'Checkout failed')
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', padding: 16 }}>
      <h1>Checkout</h1>

      <div style={{ marginTop: 16 }}>
        <div>Items: {items.reduce((acc, it) => acc + it.quantity, 0)}</div>
        <div>Total: €{subtotal.toFixed(2)}</div>
      </div>

      <button
        onClick={startCheckout}
        disabled={loading || items.length === 0}
        style={{
          marginTop: 20,
          padding: '12px 16px',
          borderRadius: 10,
          border: '1px solid #ccc',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Redirecting to Stripe…' : 'Pay with card'}
      </button>

      <div style={{ marginTop: 14 }}>
        <a href="/cart">← Back to cart</a>
      </div>

      {error && (
        <p style={{ marginTop: 16, color: 'crimson' }}>
          {error}
        </p>
      )}
    </div>
  )
}