import Link from "next/link";
import CartBadge from "@/app/cart/badge";

const navLinks = [
  { href: "/products", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* LEFT */}
        <div className="flex items-center gap-10">

          <Link
            href="/"
            className="tracking-[0.4em] text-sm font-semibold uppercase text-white transition-opacity duration-200 hover:opacity-80"
          >
            NAZ
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm uppercase tracking-[0.22em] text-white/65 transition-colors duration-200 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3 sm:gap-4">

          <Link
            href="/products"
            className="hidden rounded-full border border-white/15 px-5 py-2 text-[11px] font-medium uppercase tracking-[0.28em] text-white/85 transition-all duration-200 hover:border-white/30 hover:text-white sm:inline-flex"
          >
            Enter Drop
          </Link>

          <Link
            href="/cart"
            className="relative inline-flex items-center gap-1 rounded-full border border-white/15 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-white transition-all duration-200 hover:border-white/30 hover:bg-white hover:text-black"
          >
            Cart
            <CartBadge />
          </Link>
        </div>
      </div>

      {/* MOBILE */}
      <div className="border-t border-white/5 md:hidden">
        <nav className="mx-auto flex max-w-7xl items-center justify-center gap-6 px-4 py-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] uppercase tracking-[0.24em] text-white/65 transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}