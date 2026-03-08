import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "./providers";

export const metadata: Metadata = {
  title: {
    default: "NAZ",
    template: "%s | NAZ",
  },
  description:
    "NAZ is a luxury streetwear label shaped by presence, elegance, and motorsport-inspired energy.",
  keywords: [
    "NAZ",
    "luxury streetwear",
    "motorsport clothing",
    "premium hoodie",
    "designer streetwear",
    "oversized hoodie",
  ],
  openGraph: {
    title: "NAZ",
    description:
      "Luxury streetwear shaped by presence, elegance, and motorsport-inspired energy.",
    type: "website",
    siteName: "NAZ",
  },
  twitter: {
    card: "summary_large_image",
    title: "NAZ",
    description:
      "Luxury streetwear shaped by presence, elegance, and motorsport-inspired energy.",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            <Navbar />
            <main>{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}