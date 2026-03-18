import * as React from "react";
import {
  EmailButton,
  EmailSection,
  EmailShell,
  EmailText,
} from "@/lib/emails/EmailShell";

type NazPrivateDropInviteProps = {
  customerName?: string | null;
  dropName: string;
  privateUrl: string;
};

export default function NazPrivateDropInvite({
  customerName,
  dropName,
  privateUrl,
}: NazPrivateDropInviteProps) {
  return (
    <EmailShell
      eyebrow="Private Access"
      badge="Private release"
      title="Your early access is open."
      previewText={`Private access to ${dropName} is now available.`}
    >
      <div style={{ paddingTop: "8px" }}>
        <EmailText>
          {customerName ? `Hi ${customerName}, ` : "Hi, "}
          you now have access to <strong>{dropName}</strong> before the public
          release.
          <br />
          This invitation is reserved for selected NAZ clients.
        </EmailText>
      </div>

      <EmailSection title="Access details">
        <EmailText>
          You can now view and order this release ahead of the public launch.
        </EmailText>

        <div style={{ marginTop: "20px" }}>
          <EmailButton href={privateUrl}>Open private drop</EmailButton>
        </div>
      </EmailSection>

      <EmailSection title="A note from NAZ">
        <EmailText>
          No discounts.
          <br />
          Just access, priority, and presence.
        </EmailText>
      </EmailSection>
    </EmailShell>
  );
}