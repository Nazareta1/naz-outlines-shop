import * as React from "react";
import {
  EmailButton,
  EmailSection,
  EmailShell,
  EmailText,
} from "@/lib/emails/EmailShell";

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
  carrier?: string | null;
};

export default function OrderShippedEmail({
  customerName,
  orderNumber,
  trackingNumber,
  trackingUrl,
  customerEmail,
  items = [],
  carrier,
}: OrderShippedEmailProps) {
  return (
    <EmailShell
      eyebrow="Shipping Update"
      title="Your order is on the way."
      previewText={`Your NAZ order #${orderNumber} has been dispatched.`}
    >
      <div style={{ paddingTop: "8px" }}>
        <EmailText>
          {customerName ? `Thank you, ${customerName}. ` : ""}
          Your NAZ order has now been dispatched and is moving toward its
          destination.
        </EmailText>
      </div>

      <EmailSection title="Shipment details">
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

            {carrier ? (
              <tr>
                <td
                  style={{
                    padding: "10px 0",
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.50)",
                  }}
                >
                  Carrier
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
                  {carrier}
                </td>
              </tr>
            ) : null}

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
            <EmailButton href={trackingUrl}>Track shipment</EmailButton>
          </div>
        ) : null}
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
                {item.size ? `Size: ${item.size}` : "Size: —"} &nbsp;•&nbsp; Qty:{" "}
                {item.quantity}
              </div>
            </div>
          ))}
        </EmailSection>
      ) : null}

      <EmailSection title="NAZ">
        <EmailText>Thank you for choosing NAZ.</EmailText>
      </EmailSection>
    </EmailShell>
  );
}