import * as React from "react";

type EmailShellProps = {
  eyebrow?: string;
  title: string;
  previewText?: string;
  badge?: string;
  children: React.ReactNode;
  footerText?: string;
};

type SectionProps = {
  title?: string;
  children: React.ReactNode;
};

type ButtonProps = {
  href: string;
  children: React.ReactNode;
};

export function EmailShell({
  eyebrow = "NAZ",
  title,
  previewText,
  badge,
  children,
  footerText = "Go Naz — Win your own race",
}: EmailShellProps) {
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
      {previewText ? (
        <div
          style={{
            display: "none",
            overflow: "hidden",
            lineHeight: "1px",
            opacity: 0,
            maxHeight: 0,
            maxWidth: 0,
          }}
        >
          {previewText}
        </div>
      ) : null}

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
                color: "#ffffff",
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
              {eyebrow}
            </div>
          </div>

          <div style={{ padding: "34px 28px 10px" }}>
            {badge ? (
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
                {badge}
              </div>
            ) : null}

            <h1
              style={{
                margin: 0,
                fontSize: "38px",
                lineHeight: "1.06",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#ffffff",
              }}
            >
              {title}
            </h1>
          </div>

          <div style={{ padding: "0 28px 0" }}>{children}</div>

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
                {footerText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EmailSection({ title, children }: SectionProps) {
  return (
    <div style={{ paddingTop: "20px" }}>
      <div
        style={{
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: "22px",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.02))",
          padding: "22px 20px",
        }}
      >
        {title ? (
          <div
            style={{
              fontSize: "12px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.48)",
              marginBottom: "12px",
            }}
          >
            {title}
          </div>
        ) : null}

        {children}
      </div>
    </div>
  );
}

export function EmailButton({ href, children }: ButtonProps) {
  return (
    <a
      href={href}
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
      {children}
    </a>
  );
}

export function EmailText({
  children,
  muted = false,
}: {
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <p
      style={{
        margin: 0,
        fontSize: "15px",
        lineHeight: "1.9",
        color: muted ? "rgba(255,255,255,0.68)" : "rgba(255,255,255,0.76)",
      }}
    >
      {children}
    </p>
  );
}