// components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#101012]/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm tracking-[0.35em] uppercase text-white/90 hover:text-white transition"
          aria-label="NAZ Home"
        >
          NAZ
        </Link>

        <nav className="flex items-center gap-6 text-xs tracking-[0.28em] uppercase text-white/60">
          <Link href="/products" className="hover:text-white/90 transition">
            SHOP
          </Link>
          <Link href="/studio" className="hover:text-white/90 transition">
            STUDIO
          </Link>
          <Link href="/about" className="hover:text-white/90 transition">
            ABOUT
          </Link>
          <Link href="/contact" className="hover:text-white/90 transition">
            CONTACT
          </Link>
        </nav>
      </div>
    </header>
  );
}