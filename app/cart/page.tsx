"use client";

import Link from "next/link";
import { useCart } from "./context";

function money(n: number) {
  return n.toFixed(2);
}

export default function CartPage() {
  const { items, subtotal, increment, decrement, removeFromCart, clearCart } =
    useCart();

  const total = subtotal;

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <h1 style={{ fontSize: 36, margin: 0 }}>Cart</h1>
        <span style={{ opacity: 0.6 }}>
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      {items.length === 0 ? (
        <div style={{ marginTop: 24 }}>
          <p style={{ opacity: 0.8, marginTop: 0 }}>
            Your cart is empty. Go pick something from the shop.
          </p>
          <Link href="/products" style={{ textDecoration: "underline" }}>
            Back to shop →
          </Link>
        </div>
      ) : (
        <div style={{ marginTop: 24, display: "grid", gap: 18 }}>
          {/* Items */}
          <div
            style={{
              border: "1px solid rgba(0,0,0,.12)",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {items.map((i, idx) => (
              <div
                key={i.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 16,
                  padding: 16,
                  borderTop:
                    idx === 0 ? "none" : "1px solid rgba(0,0,0,.08)",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{i.name}</div>
                  <div style={{ opacity: 0.7, marginTop: 4 }}>
                    €{money(i.price)} each
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginTop: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      onClick={() => decrement(i.id)}
                      style={btnStyle}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>

                    <div style={{ minWidth: 30, textAlign: "center" }}>
                      {i.quantity}
                    </div>

                    <button
                      onClick={() => increment(i.id)}
                      style={btnStyle}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>

                    <button
                      onClick={() => removeFromCart(i.id)}
                      style={{ ...linkBtnStyle, marginLeft: 6 }}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ opacity: 0.6, fontSize: 12 }}>Subtotal</div>
                  <div style={{ fontWeight: 700 }}>
                    €{money(i.price * i.quantity)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 12,
              border: "1px solid rgba(0,0,0,.12)",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <span style={{ opacity: 0.8 }}>Subtotal</span>
              <strong>€{money(subtotal)}</strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
                borderTop: "1px solid rgba(0,0,0,.08)",
                paddingTop: 12,
              }}
            >
              <span style={{ fontWeight: 700 }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: 18 }}>
                €{money(total)}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
                marginTop: 6,
              }}
            >
              <button onClick={clearCart} style={dangerBtnStyle}>
                Clear cart
              </button>

              {/* ✅ ČIA PAGRINDINIS PAKEITIMAS: linkas į /checkout */}
              <Link href="/checkout" style={checkoutLinkStyle}>
                Continue to checkout →
              </Link>
            </div>
          </div>

          <div>
            <Link href="/products" style={{ textDecoration: "underline" }}>
              ← Continue shopping
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

const btnStyle: React.CSSProperties = {
  border: "1px solid rgba(0,0,0,.18)",
  background: "white",
  borderRadius: 10,
  width: 34,
  height: 34,
  cursor: "pointer",
  fontSize: 18,
  lineHeight: "34px",
};

const linkBtnStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  textDecoration: "underline",
  opacity: 0.8,
};

const dangerBtnStyle: React.CSSProperties = {
  border: "1px solid rgba(0,0,0,.18)",
  background: "white",
  borderRadius: 12,
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: 700,
};

const checkoutLinkStyle: React.CSSProperties = {
  border: "1px solid rgba(0,0,0,.18)",
  background: "black",
  color: "white",
  borderRadius: 12,
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: 800,
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
};
