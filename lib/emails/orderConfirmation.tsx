import * as React from "react";

type OrderItem = {
  name: string;
  size?: string | null;
  quantity: number;
  price?: number | null; // cents
};

type OrderConfirmationEmailProps = {
  customerName?: string | null;
  orderNumber: string;
  customerEmail: string;
  total: number; // cents
  currency?: string | null;
  items?: OrderItem[];
};

function formatMoney(cents: number, currency = "EUR") {
  const amount = cents / 100;

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

export default function OrderConfirmationEmail({
  customerName,
  orderNumber,
  customerEmail,
  total,
  currency = "EUR",
  items = [],
}: OrderConfirmationEmailProps) {
  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        backgroundColor: "#000000",
        color: "#ffffff",
        fontFamily:
          "Inter, Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "40px 20px",
          backgroundColor: "#000000",
        }}
      >
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: "24px",
            overflow: "hidden",
            backgroundColor: "#050505",
          }}
        >
          {/* Top */}
          <div
            style={{
              padding: "32px 28px",
              borderBottom: "1px solid rgba(255,255,255,0.10)",
              textAlign: "center",
              background:
                "radial-gradient(circle at top, rgba(255,255,255,0.07), transparent 45%)",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                fontWeight: 800,
                letterSpacing: "0.30em",
                color: "#ffffff",
              }}
            >
              NAZ
            </div>

            <div
              style={{
                marginTop: "10px",
                fontSize: "11px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              Luxury streetwear with motorsport energy
            </div>
          </div>

          {/* Hero */}
          <div
            style={{
              padding: "36px 28px 20px",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.42)",
                marginBottom: "14px",
              }}
            >
              Order Confirmation
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "34px",
                lineHeight: "1.1",
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              Order confirmed.
            </h1>

            <p
              style={{
                margin: "16px 0 0",
                fontSize: "16px",
                lineHeight: "1.8",
                color: "rgba(255,255,255,0.72)",
              }}
            >
              {customerName ? `Thank you, ${customerName}. ` : "Thank you. "}
              Your NAZ piece is now in motion.
            </p>
          </div>

          {/* Order summary */}
          <div
            style={{
              padding: "20px 28px 0",
            }}
          >
            <div
              style={{
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: "18px",
                backgroundColor: "rgba(255,255,255,0.03)",
                padding: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.48)",
                  marginBottom: "14px",
                }}
              >
                Order Details
              </div>

              <table
                width="100%"
                cellPadding="0"
                cellSpacing="0"
                style={{ borderCollapse: "collapse" }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        padding: "10px 0",
                        fontSize: "14px",
                        color: "rgba(255,255,255,0.50)",
                      }}
                    >
                      Order number
                    </td>
                    <td
                      align="right"
                      style={{
                        padding: "10px 0",
                        fontSize: "14px",
                        color: "#ffffff",
                        fontWeight: 600,
                      }}
                    >
                      #{orderNumber}
                    </td>
                  </tr>

                  <tr>
                    <td
                      style={{
                        padding: "10px 0",
                        fontSize: "14px",
                        color: "rgba(255,255,255,0.50)",
                      }}
                    >
                      Email
                    </td>
                    <td
                      align="right"
                      style={{
                        padding: "10px 0",
                        fontSize: "14px",
                        color: "#ffffff",
                      }}
                    >
                      {customerEmail}
                    </td>
                  </tr>

                  <tr>
                    <td
                      style={{
                        padding: "10px 0",
                        fontSize: "14px",
                        color: "rgba(255,255,255,0.50)",
                      }}
                    >
                      Total
                    </td>
                    <td
                      align="right"
                      style={{
                        padding: "10px 0",
                        fontSize: "14px",
                        color: "#ffffff",
                        fontWeight: 700,
                      }}
                    >
                      {formatMoney(total, currency || "EUR")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Items */}
          {items.length > 0 && (
            <div
              style={{
                padding: "20px 28px 0",
              }}
            >
              <div
                style={{
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: "18px",
                  backgroundColor: "rgba(255,255,255,0.02)",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.48)",
                    marginBottom: "12px",
                  }}
                >
                  Items
                </div>

                {items.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    style={{
                      padding: "14px 0",
                      borderTop:
                        index === 0
                          ? "none"
                          : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <table
                      width="100%"
                      cellPadding="0"
                      cellSpacing="0"
                      style={{ borderCollapse: "collapse" }}
                    >
                      <tbody>
                        <tr>
                          <td
                            style={{
                              fontSize: "15px",
                              fontWeight: 600,
                              color: "#ffffff",
                              paddingBottom: "6px",
                            }}
                          >
                            {item.name}
                          </td>
                          <td
                            align="right"
                            style={{
                              fontSize: "14px",
                              color: "#ffffff",
                              fontWeight: 600,
                              paddingBottom: "6px",
                            }}
                          >
                            {item.price != null
                              ? formatMoney(item.price, currency || "EUR")
                              : ""}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              fontSize: "13px",
                              color: "rgba(255,255,255,0.55)",
                            }}
                          >
                            {item.size ? `Size: ${item.size}` : "Size: —"}{" "}
                            &nbsp;•&nbsp; Qty: {item.quantity}
                          </td>
                          <td />
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message */}
          <div
            style={{
              padding: "28px 28px 0",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "15px",
                lineHeight: "1.8",
                color: "rgba(255,255,255,0.68)",
              }}
            >
              We will send you another update as soon as your order is shipped.
            </p>
          </div>

          {/* Trust */}
          <div
            style={{
              padding: "22px 28px 0",
            }}
          >
            <div
              style={{
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: "18px",
                padding: "18px 20px",
                backgroundColor: "rgba(255,255,255,0.02)",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.42)",
                  marginBottom: "10px",
                }}
              >
                NAZ Standard
              </div>

              <div
                style={{
                  fontSize: "14px",
                  lineHeight: "2",
                  color: "rgba(255,255,255,0.68)",
                }}
              >
                Secure payment via Stripe
                <br />
                Fast EU shipping
                <br />
                Limited production
                <br />
                Premium heavyweight fabric
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "28px 28px 32px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.10)",
                paddingTop: "22px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.40)",
                }}
              >
                go NAZ — win your own race
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}