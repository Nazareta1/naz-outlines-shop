import * as React from "react";

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
    <div
      style={{
        margin: 0,
        padding: 0,
        backgroundColor: "#020202",
        color: "#ffffff",
        fontFamily: "Inter, Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "620px",
          margin: "0 auto",
          padding: "28px 14px 40px",
          backgroundColor: "#020202",
        }}
      >
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: "28px",
            overflow: "hidden",
            background:
              "linear-gradient(180deg, #07090d 0%, #040404 38%, #050505 100%)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.03) inset",
          }}
        >
          <div
            style={{
              padding: "34px 28px 30px",
              textAlign: "center",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              background:
                "radial-gradient(circle at top center, rgba(255,255,255,0.08), transparent 34%)",
            }}
          >
            <div
              style={{
                fontSize: "30px",
                fontWeight: 800,
                letterSpacing: "0.34em",
                lineHeight: 1,
              }}
            >
              NAZ
            </div>

            <div
              style={{
                marginTop: "12px",
                fontSize: "11px",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.46)",
              }}
            >
              Private Access
            </div>
          </div>

          <div style={{ padding: "34px 28px 10px" }}>
            <div
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(255,255,255,0.03)",
                fontSize: "11px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.52)",
                marginBottom: "18px",
              }}
            >
              Private release
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "38px",
                lineHeight: "1.06",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              Your early access is open.
            </h1>

            <p
              style={{
                margin: "18px 0 0",
                fontSize: "16px",
                lineHeight: "1.9",
                color: "rgba(255,255,255,0.75)",
              }}
            >
              {customerName ? `Hi ${customerName}, ` : "Hi, "}
              you now have access to <strong>{dropName}</strong> before the
              public release.
              <br />
              This invitation is reserved for selected NAZ clients.
            </p>
          </div>

          <div style={{ padding: "20px 28px 0" }}>
            <div
              style={{
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: "22px",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.02))",
                padding: "22px 20px",
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
                Access details
              </div>

              <p
                style={{
                  margin: 0,
                  fontSize: "15px",
                  lineHeight: "1.9",
                  color: "rgba(255,255,255,0.76)",
                }}
              >
                You can now view and order this release ahead of the public
                launch.
              </p>

              <div style={{ marginTop: "20px" }}>
                <a
                  href={privateUrl}
                  style={{
                    display: "inline-block",
                    padding: "14px 22px",
                    borderRadius: "14px",
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    textDecoration: "none",
                    fontSize: "13px",
                    fontWeight: 800,
                    letterSpacing: "0.10em",
                    textTransform: "uppercase",
                  }}
                >
                  Open private drop
                </a>
              </div>
            </div>
          </div>

          <div style={{ padding: "28px 28px 0" }}>
            <div
              style={{
                padding: "22px 20px",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.46)",
                  marginBottom: "10px",
                }}
              >
                A note from NAZ
              </div>

              <p
                style={{
                  margin: 0,
                  fontSize: "15px",
                  lineHeight: "1.9",
                  color: "rgba(255,255,255,0.72)",
                }}
              >
                No discounts.
                <br />
                Just access, priority, and presence.
              </p>
            </div>
          </div>

          <div
            style={{
              padding: "30px 28px 34px",
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
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.42)",
                }}
              >
                Go Naz — Win your own race
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}