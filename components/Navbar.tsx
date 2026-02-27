// components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="relative z-10 mx-auto max-w-6xl px-6 pt-8">
      <nav className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
        <Link href="/" className="group inline-flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/10">
            <span className="text-xs tracking-[0.3em] pl-1 opacity-90">NO</span>
          </span>
          <span className="text-sm font-semibold tracking-[0.18em]">
            NAZ OUTLINES
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-white/80">
          <Link href="/studio" className="hover:text-white transition">
            Studio
          </Link>
          <Link href="/about" className="hover:text-white transition">
            About
          </Link>
          <Link href="/contacts" className="hover:text-white transition">
            Contacts
          </Link>
          <Link href="/products" className="hover:text-white transition">
            Shop
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/15 transition"
          >
            Shop
          </Link>
          <Link
            href="/cart"
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90 transition"
          >
            Cart
          </Link>
        </div>
      </nav>
    </header>
  );
}