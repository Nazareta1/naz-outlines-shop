'use client'

import { useCart } from '@/app/cart/context'

export default function AddToCartButton({
  id,
  name,
  price,
  image,
}: {
  id: string
  name: string
  price: number
  image?: string
}) {
  const { addToCart } = useCart()

  return (
    <button
      onClick={() =>
        addToCart({
          id,
          name,
          price,
          quantity: 1,
          image,
        })
      }
      style={{
        padding: '12px 16px',
        borderRadius: 10,
        border: '1px solid #ccc',
        cursor: 'pointer',
      }}
    >
      Add to cart
    </button>
  )
}