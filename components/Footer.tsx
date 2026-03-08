import Link from "next/link";

const nav = [
  { href: "/products", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contacts", label: "Contact" },
];

const legal = [
  { href: "/shipping", label: "Shipping" },
  { href: "/returns", label: "Returns" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black">
      
      {/* ghost NAZ background */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="text-[22vw] font-semibold tracking-[-0.06em] text-white/[0.03]">
          NAZ
        </span>
      </div>

      <div className="container-naz relative py-20">

        {/* TOP GRID */}
        <div className="grid gap-16 border-b border-white/10 pb-16 lg:grid-cols-[1.4fr_0.7fr_0.7fr_0.9fr]">

          {/* BRAND */}
          <div className="max-w-xl">

            <p className="mb-6 text-xs uppercase tracking-[0.4em] text-white/45">
              NAZ
            </p>

            <h2 className="text-4xl font-medium leading-[1.02] tracking-[-0.05em] text-white">
              Presence.  
              Confidence.  
              Motorsport elegance.
            </h2>

            <p className="mt-6 max-w-md text-sm leading-8 text-white/60">
              NAZ is a motorsport-inspired luxury streetwear label built around
              controlled intensity, architectural silhouettes and visual
              presence. Every piece is designed to feel powerful the moment it
              is worn.
            </p>

          </div>

          {/* NAVIGATION */}
          <div>

            <p className="mb-6 text-xs uppercase tracking-[0.3em] text-white/45">
              Navigation
            </p>

            <div className="space-y-4">
              {nav.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="block text-sm text-white/65 transition hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
            </div>

          </div>

          {/* LEGAL */}
          <div>

            <p className="mb-6 text-xs uppercase tracking-[0.3em] text-white/45">
              Legal
            </p>

            <div className="space-y-4">
              {legal.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="block text-sm text-white/65 transition hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
            </div>

          </div>

          {/* CONTACT */}
          <div>

            <p className="mb-6 text-xs uppercase tracking-[0.3em] text-white/45">
              Contact
            </p>

            <div className="space-y-4 text-sm text-white/65">

              <a
                href="mailto:nazoutlines@gmail.com"
                className="block transition hover:text-white"
              >
                nazoutlines@gmail.com
              </a>

              <p className="text-white/40">
                Limited releases.  
                Selected European shipping.
              </p>

              <div className="pt-2 space-y-2">

                <a
                  href="#"
                  className="block transition hover:text-white"
                >
                  Instagram
                </a>

                <a
                  href="#"
                  className="block transition hover:text-white"
                >
                  TikTok
                </a>

              </div>

            </div>

          </div>

        </div>

        {/* BOTTOM */}
        <div className="flex flex-col gap-4 pt-6 text-xs uppercase tracking-[0.2em] text-white/35 sm:flex-row sm:items-center sm:justify-between">

          <p>
            © {year} NAZ
          </p>

          <p>
            Designed for presence
          </p>

        </div>

      </div>
    </footer>
  );
}