// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CartProvider } from "@/app/cart/context";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "NAZ — Structured Drop 01",
  description: "Engineered for presence.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-[#0E0E10]">
      <body className={`${inter.className} bg-[#0E0E10] text-[#F2F2F2] antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}