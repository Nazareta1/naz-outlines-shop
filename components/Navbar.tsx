import Link from "next/link";

export default function Navbar() {
  return (
    <header className="relative z-30">
      <div className="mx-auto max-w-7xl px-6 pt-6 md:pt-8">
        <nav className="flex items-center justify-between border-b border-white/10 pb-5">
          {/* LEFT */}
          <div className="flex items-center gap-10">
            <Link
              href="/"
              className="text-xs tracking-[0.42em] uppercase text-white/92 hover:text-white transition"
            >
              NAZ
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/products"
                className="text-[11px] tracking-[0.3em] uppercase text-white/48 hover:text-white transition"
              >
                Shop
              </Link>
              <Link
                href="/studio"
                className="text-[11px] tracking-[0.3em] uppercase text-white/48 hover:text-white transition"
              >
                Studio
              </Link>
              <Link
                href="/about"
                className="text-[11px] tracking-[0.3em] uppercase text-white/48 hover:text-white transition"
              >
                About
              </Link>
              <Link
                href="/contacts"
                className="text-[11px] tracking-[0.3em] uppercase text-white/48 hover:text-white transition"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-5">
            <Link
              href="/cart"
              className="text-[11px] tracking-[0.3em] uppercase text-white/58 hover:text-white transition"
            >
              Cart
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}