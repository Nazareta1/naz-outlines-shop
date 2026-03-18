import * as React from "react";
import {
  EmailSection,
  EmailShell,
  EmailText,
} from "@/lib/emails/EmailShell";

type OrderItem = {
  name: string;
  size?: string | null;
  quantity: number;
  price?: number | null;
};

type OrderConfirmationEmailProps = {
  customerName?: string | null;
  orderNumber: string;
  customerEmail: string;
  total: number;
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
    <EmailShell
      eyebrow="Order Confirmation"
      title="Order confirmed."
      previewText={`Your NAZ order #${orderNumber} has been received successfully.`}
    >
      <div style={{ paddingTop: "8px" }}>
        <EmailText>
          {customerName ? `Thank you, ${customerName}. ` : "Thank you. "}
          Your NAZ order has been received successfully and is now moving into
          preparation.
        </EmailText>
      </div>

      <EmailSection title="Order details">
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
      </EmailSection>

      {items.length > 0 ? (
        <EmailSection title="Items">
          {items.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              style={{
                padding: "14px 0",
                borderTop:
                  index === 0 ? "none" : "1px solid rgba(255,255,255,0.08)",
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
                      {item.size ? `Size: ${item.size}` : "Size: —"} &nbsp;•&nbsp;
                      Qty: {item.quantity}
                    </td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </EmailSection>
      ) : null}

      <EmailSection title="What happens next">
        <EmailText>
          We will send you another update as soon as your order has been
          dispatched.
        </EmailText>
      </EmailSection>

      <EmailSection title="NAZ standard">
        <EmailText muted>
          Secure payment via Stripe
          <br />
          Tracked European shipping
          <br />
          Limited production
          <br />
          Premium heavyweight construction
        </EmailText>
      </EmailSection>
    </EmailShell>
  );
}