import * as React from "react";

type OrderItem = {
  name: string;
  size?: string | null;
  quantity: number;
};

type OrderShippedEmailProps = {
  customerName?: string | null;
  orderNumber: string;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  customerEmail: string;
  items?: OrderItem[];
};

export default function OrderShippedEmail({
  customerName,
  orderNumber,
  trackingNumber,
  trackingUrl,
  customerEmail,
  items = [],
}: OrderShippedEmailProps) {
  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        backgroundColor: "#000000",
        color: "#ffffff",
        fontFamily: "Inter, Arial, Helvetica, sans-serif",
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

          <div style={{ padding: "36px 28px 20px" }}>
            <div
              style={{
                fontSize: "11px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.42)",
                marginBottom: "14px",
              }}
            >
              Shipping Update
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
              Your order is on the way.
            </h1>

            <p
              style={{
                margin: "16px 0 0",
                fontSize: "16px",
                lineHeight: "1.8",
                color: "rgba(255,255,255,0.72)",
              }}
            >
              {customerName ? `Thank you, ${customerName}. ` : ""}
              Your NAZ piece has been shipped and is now in motion.
            </p>
          </div>

          <div style={{ padding: "20px 28px 0" }}>
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
                Shipment Details
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
                      Tracking number
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
                      {trackingNumber || "Available soon"}
                    </td>
                  </tr>
                </tbody>
              </table>

              {trackingUrl ? (
                <div style={{ marginTop: "18px" }}>
                  <a
                    href={trackingUrl}
                    style={{
                      display: "inline-block",
                      padding: "12px 18px",
                      borderRadius: "14px",
                      backgroundColor: "#ffffff",
                      color: "#000000",
                      textDecoration: "none",
                      fontSize: "13px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Track Shipment
                  </a>
                </div>
              ) : null}
            </div>
          </div>

          {items.length > 0 && (
            <div style={{ padding: "20px 28px 0" }}>
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
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "#ffffff",
                        marginBottom: "6px",
                      }}
                    >
                      {item.name}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "rgba(255,255,255,0.55)",
                      }}
                    >
                      {item.size ? `Size: ${item.size}` : "Size: —"} &nbsp;•&nbsp;
                      Qty: {item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ padding: "28px 28px 0" }}>
            <p
              style={{
                margin: 0,
                fontSize: "15px",
                lineHeight: "1.8",
                color: "rgba(255,255,255,0.68)",
              }}
            >
              Thank you for choosing NAZ.
            </p>
          </div>

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