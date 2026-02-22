'use client'

import { useCart } from './context'

export default function CartBadge() {
  const { count } = useCart()

  if (count === 0) return null

  return (
    <span
      style={{
        background: 'black',
        color: 'white',
        borderRadius: '999px',
        padding: '4px 8px',
        fontSize: '12px',
        marginLeft: '6px',
      }}
    >
      {count}
    </span>
  )
}