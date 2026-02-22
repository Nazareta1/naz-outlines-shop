import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import Providers from "./providers";
import CartBadge from "./cart/badge";

export const metadata: Metadata = {
  title: "NAZ OUTLINES",
  description: "NAZ OUTLINES shop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="lt">
      <body>
        <Providers>
          <header
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 24px",
              borderBottom: "1px solid #e5e5e5",
            }}
          >
            {/* LEFT: LOGO */}
            <Link
              href="/products"
              style={{ display: "flex", alignItems: "center", gap: 10 }}
            >
              <Image
                src="/logo.png"
                alt="NAZ OUTLINES"
                width={140}
                height={40}
                priority
              />
            </Link>

            {/* CENTER: LANGUAGE */}
            <div style={{ display: "flex", gap: 10 }}>
              {/* Čia tik UI mygtukai.
                  Jei turi realų i18n (pvz /lt, /en), pakeisk href pagal savo sistemą. */}
              <Link href="#" style={{ textDecoration: "underline" }}>
                LT
              </Link>
              <Link href="#" style={{ textDecoration: "underline" }}>
                EN
              </Link>
            </div>

            {/* RIGHT: NAV */}
            <nav style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <Link href="/products">Shop</Link>
              <Link href="/cart" style={{ display: "flex", gap: 6 }}>
                Cart <CartBadge />
              </Link>
            </nav>
          </header>

          <main style={{ padding: "24px" }}>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
