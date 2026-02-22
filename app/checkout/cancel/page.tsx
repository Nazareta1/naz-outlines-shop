export default function CheckoutCancelPage() {
  return (
    <div style={{ maxWidth: 720, margin: '40px auto', padding: 16 }}>
      <h1>Payment cancelled</h1>
      <p>You can return to your cart and try again.</p>
      <div style={{ marginTop: 20 }}>
        <a href="/cart">← Back to cart</a>
      </div>
    </div>
  )
}