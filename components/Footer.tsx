import Link from "next/link";

const shopLinks = [
  { href: "/products", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contacts", label: "Contact" },
];

const legalLinks = [
  { href: "/shipping", label: "Shipping" },
  { href: "/returns", label: "Returns" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div className="max-w-md">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-white/50">
            NAZ
          </p>
          <h2 className="text-2xl font-medium leading-tight text-white sm:text-3xl">
            Designed for presence.
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/60">
            NAZ blends elegance, controlled intensity, and motorsport-inspired
            energy into premium streetwear built to be seen without asking for
            attention.
          </p>
        </div>

        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-white/50">
            Navigation
          </p>
          <div className="space-y-3">
            {shopLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm text-white/70 transition-colors duration-200 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-white/50">
            Legal
          </p>
          <div className="space-y-3">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm text-white/70 transition-colors duration-200 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs uppercase tracking-[0.18em] text-white/40 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© {year} NAZ. All rights reserved.</p>
          <p>Luxury streetwear shaped by presence.</p>
        </div>
      </div>
    </footer>
  );
}