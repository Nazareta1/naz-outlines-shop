import * as React from "react";
import {
  EmailButton,
  EmailSection,
  EmailShell,
  EmailText,
} from "@/lib/emails/EmailShell";

type OrderShippedVIPProps = {
  customerName?: string | null;
  trackingUrl?: string | null;
};

export default function OrderShippedVIP({
  customerName,
  trackingUrl,
}: OrderShippedVIPProps) {
  return (
    <EmailShell
      eyebrow="Private Access"
      badge="Priority dispatch"
      title="Your order is in motion."
      previewText="Your private-access order has been prioritised and dispatched."
    >
      <div style={{ paddingTop: "8px" }}>
        <EmailText>
          {customerName ? `Hi ${customerName}, ` : "Hi, "}
          your order is being handled with priority attention as part of private
          access.
          <br />
          Your piece is now moving through our system with precision.
        </EmailText>
      </div>

      <EmailSection title="Movement">
        <EmailText>Track your shipment below.</EmailText>

        <div style={{ marginTop: "20px" }}>
          {trackingUrl ? (
            <EmailButton href={trackingUrl}>Track shipment</EmailButton>
          ) : (
            <div
              style={{
                display: "inline-block",
                padding: "14px 18px",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.10)",
                backgroundColor: "rgba(255,255,255,0.03)",
                color: "rgba(255,255,255,0.62)",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Tracking updates soon
            </div>
          )}
        </div>
      </EmailSection>

      <EmailSection title="A note from NAZ">
        <EmailText>
          Access defines timing.
          <br />
          You are already ahead.
        </EmailText>
      </EmailSection>
    </EmailShell>
  );
}