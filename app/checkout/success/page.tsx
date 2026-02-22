'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCart } from '@/app/cart/context'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', padding: 16 }}>
      <h1>Payment successful ✅</h1>
      <p>Your order has been placed.</p>

      {sessionId && (
        <p style={{ opacity: 0.7 }}>
          Session ID: <code>{sessionId}</code>
        </p>
      )}

      <div style={{ marginTop: 20 }}>
        <a href="/products">Continue shopping →</a>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}