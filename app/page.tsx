import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#07070A] text-white overflow-hidden">
      {/* Top ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-24 left-20 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-56 right-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06),transparent_28%,rgba(0,0,0,0.65))]" />
      </div>

      {/* NAV */}
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
            <a href="#about" className="hover:text-white transition">About</a>
            <a href="#streetwear" className="hover:text-white transition">Streetwear</a>
            <a href="#fabric" className="hover:text-white transition">Quality</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
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

      {/* HERO */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-16 md:pt-24 pb-16">
        <div className="grid gap-10 md:grid-cols-12 items-start">
          <div className="md:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs tracking-[0.25em] text-white/70">
              AUTO CULTURE • PREMIUM STREETWEAR
              <span className="ml-2 h-1.5 w-1.5 rounded-full bg-white/60" />
            </div>

            <h1 className="mt-6 text-5xl md:text-6xl font-semibold leading-[1.05] tracking-[-0.02em]">
              Minimal outlines.
              <span className="block text-white/70">Maximum presence.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base md:text-lg text-white/70 leading-relaxed">
              NAZ OUTLINES kuria auto-įkvėptą streetwear su premium audiniais,
              švariu line-work ir high-end siluetais. Sukurta dėvėti kasdien,
              bet atrodyti kaip editorials.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black hover:opacity-90 transition"
              >
                Shop Now →
              </Link>
              <a
                href="#streetwear"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 transition"
              >
                View Collection
              </a>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 max-w-xl">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="text-xs tracking-[0.25em] text-white/60">FABRIC</div>
                <div className="mt-2 text-sm text-white/85">
                  80% cotton / 20% polyester
                </div>
                <div className="text-sm text-white/65">400–420 GSM loopback</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="text-xs tracking-[0.25em] text-white/60">PRINT</div>
                <div className="mt-2 text-sm text-white/85">Heat transfer vinyl ready</div>
                <div className="text-sm text-white/65">Clean outlines, long-lasting</div>
              </div>
            </div>
          </div>

          {/* Right side: “editorial” cards */}
          <div className="md:col-span-5">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs tracking-[0.25em] text-white/60">FEATURED DROP</div>
                  <div className="mt-2 text-lg font-semibold">Streetwear Essentials</div>
                  <div className="text-sm text-white/70">4 pieces • outline graphics</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white/70">
                  SS26
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <FeatureLine title="Cropped Porsche Outline Hoodie" tag="CROPPED • BACK PRINT" />
                <FeatureLine title="Cut-Out Statement Hoodie" tag="ASYMMETRIC • LOGO HOOD" />
                <FeatureLine title="G-Class Distressed Hoodie" tag="HEAVY • DISTRESSED" />
                <FeatureLine title="Flame Muscle Hoodie" tag="FLAMES • OUTLINE CAR" />
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="text-xs text-white/60">
                  Made for everyday wear. Built like premium.
                </div>
                <a href="#fabric" className="text-xs font-semibold text-white/85 hover:text-white transition">
                  Learn quality →
                </a>
              </div>
            </div>

            <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="text-xs tracking-[0.25em] text-white/60">DESIGN LANGUAGE</div>
              <div className="mt-2 text-sm text-white/80 leading-relaxed">
                Monochrome palette. Strong silhouettes. Clean line-work.
                Vibe: luxury street, auto culture, minimal aggression.
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <MiniPill label="Minimal" />
                <MiniPill label="Heavyweight" />
                <MiniPill label="Outline" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10 backdrop-blur-xl">
          <div className="grid md:grid-cols-12 gap-10">
            <div className="md:col-span-5">
              <div className="text-xs tracking-[0.25em] text-white/60">ABOUT</div>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-[-0.02em]">
                Built from culture.
              </h2>
              <p className="mt-5 text-white/70 leading-relaxed">
                NAZ OUTLINES – auto + streetwear brand’as, kuriantis daiktus,
                kurie atrodo brangiai, jaučiasi sunkiai ir dėvisi ilgai.
              </p>
            </div>

            <div className="md:col-span-7 grid sm:grid-cols-2 gap-4">
              <InfoCard
                title="Silhouette first"
                desc="Boxy / cropped / statement kirpimai. Forma – prioritetas."
              />
              <InfoCard
                title="Premium feel"
                desc="Heavyweight audinys, pre-shrunk ir enzyme washed."
              />
              <InfoCard
                title="Clean graphics"
                desc="Minimal line-work, tikslūs outline dizainai, be triukšmo."
              />
              <InfoCard
                title="Wearable luxury"
                desc="Street, bet su luxury tvarka: švaru, solidu, stipru."
              />
            </div>
          </div>
        </div>
      </section>

      {/* STREETWEAR */}
      <section id="streetwear" className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-xs tracking-[0.25em] text-white/60">STREETWEAR</div>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-[-0.02em]">
              Collection (4 pieces)
            </h2>
            <p className="mt-4 text-white/70 max-w-2xl">
              Pagal tavo 4 produktus – aprašymai paruošti taip, kad atrodytų kaip
              tikro fashion brando drop’as.
            </p>
          </div>

          <Link
            href="/products"
            className="hidden sm:inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 transition"
          >
            Open Shop →
          </Link>
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-5">
          <ProductCard
            title="Cropped Porsche Outline Hoodie"
            subtitle="Oversized crop • back outline"
            desc="Dramatiškas crop siluetas su švariu white outline Porsche dizainu nugaroje. Minimal, bet agresyvu."
            bullets={["Statement back print", "Street fit", "Clean outline aesthetic"]}
          />
          <ProductCard
            title="Cut-Out Statement Hoodie"
            subtitle="Asymmetric cut • logo hood"
            desc="Asimetriškas kirpimas su cut-out vibe. NAZ OUTLINES ant kapišono, papildomos detalės ant rankovės."
            bullets={["High-fashion shape", "Strong fit", "Signature branding"]}
          />
          <ProductCard
            title="G-Class Distressed Hoodie"
            subtitle="Heavy boxy • distressed"
            desc="Sunkus, boxy oversized fit su distressed detalėmis ir dideliu G-Class back print. Tikras street presence."
            bullets={["Heavy look", "Distressed accents", "Big back graphic"]}
          />
          <ProductCard
            title="Flame Muscle Hoodie"
            subtitle="Flames • muscle outline"
            desc="Flame detalės ant rankovių + outline muscle car nugaroje. Labai stiprus statement piece."
            bullets={["Flame sleeves", "Outline back print", "Bold streetwear"]}
          />
        </div>

        <div className="mt-8 sm:hidden">
          <Link
            href="/products"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black hover:opacity-90 transition"
          >
            Shop Now →
          </Link>
        </div>
      </section>

      {/* FABRIC */}
      <section id="fabric" className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10 backdrop-blur-xl">
          <div className="grid md:grid-cols-12 gap-10">
            <div className="md:col-span-5">
              <div className="text-xs tracking-[0.25em] text-white/60">QUALITY</div>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-[-0.02em]">
                Fabric & production spec
              </h2>
              <p className="mt-5 text-white/70 leading-relaxed">
                Tekstas “kaip pas rimtą e-shop’ą” — aiškus, konkrečiais skaičiais.
              </p>
            </div>

            <div className="md:col-span-7 grid sm:grid-cols-2 gap-4">
              <SpecCard k="Composition" v="80% cotton / 20% polyester" />
              <SpecCard k="Weight" v="400–420 GSM (heavyweight)" />
              <SpecCard k="Knit" v="French Terry (loopback)" />
              <SpecCard k="Finish" v="Pre-shrunk • Enzyme washed" />
              <SpecCard k="Printing" v="Suitable for heat transfer vinyl" />
              <SpecCard k="Feel" v="Warm, heavy, premium handfeel" />
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-6 text-white/70 leading-relaxed">
            <span className="text-white/85 font-semibold">Kodėl tai svarbu?</span>{" "}
            400–420 GSM reiškia, kad džemperis krenta “sunkiai” ir atrodo brangiai.
            Pre-shrunk sumažina susitraukimo riziką, enzyme washed duoda soft premium
            tekstūrą. Loopback French Terry puikiai tinka kasdieniam dėvėjimui.
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative z-10 mx-auto max-w-6xl px-6 py-16 pb-24">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-xs tracking-[0.25em] text-white/60">FAQ</div>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-[-0.02em]">
              Dažniausi klausimai
            </h2>
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-4">
          <FaqItem
            q="Ar bus realios produktų nuotraukos?"
            a="Taip. Kol kas naudojam luxury landing su tipografija, o kai turėsi foto — įdėsim į hero ir product puslapius."
          />
          <FaqItem
            q="Ar galima pridėti dydžius (S/M/L) ir variantus?"
            a="Taip. Sekantis žingsnis: Product variants (size/color) + stock + admin valdymas."
          />
          <FaqItem
            q="Kaip su siuntimu ir tracking?"
            a="Admin dalyje jau turi tracking formą. Toliau padarysim: automatinį email su tracking + order status timeline."
          />
          <FaqItem
            q="Ar galima pridėti ‘Terms / Privacy / Returns’ puslapius?"
            a="Būtinai. Tai būtina profesionaliam e-shop’ui. Padarysim footer su nuorodom ir LT/EN tekstais."
          />
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-xs tracking-[0.25em] text-white/60">NEXT STEP</div>
            <div className="mt-2 text-xl font-semibold">Padarom “Shop” puslapį kaip luxury brand</div>
            <div className="mt-1 text-white/70">Filtrai, kategorijos, product page, size selector, clean UX.</div>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black hover:opacity-90 transition"
          >
            Continue →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 bg-black/40">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-sm font-semibold tracking-[0.18em]">NAZ OUTLINES</div>
            <div className="mt-2 text-xs text-white/60">
              © {new Date().getFullYear()} • Auto culture × Premium streetwear
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-white/70">
            <a href="#about" className="hover:text-white transition">About</a>
            <a href="#streetwear" className="hover:text-white transition">Streetwear</a>
            <a href="#fabric" className="hover:text-white transition">Quality</a>
            <Link href="/products" className="hover:text-white transition">Shop</Link>
            <Link href="/cart" className="hover:text-white transition">Cart</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureLine({ title, tag }: { title: string; tag: string }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-black/30 p-4 hover:bg-black/40 transition">
      <div className="flex items-start justify-between gap-4">
        <div className="text-sm font-semibold text-white/90">{title}</div>
        <div className="text-[10px] tracking-[0.25em] text-white/55">
          {tag}
        </div>
      </div>
    </div>
  );
}

function MiniPill({ label }: { label: string }) {
  return (
    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-center text-xs text-white/75">
      {label}
    </div>
  );
}

function InfoCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-6 hover:bg-black/40 transition">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-2 text-sm text-white/70 leading-relaxed">{desc}</div>
    </div>
  );
}

function ProductCard({
  title,
  subtitle,
  desc,
  bullets,
}: {
  title: string;
  subtitle: string;
  desc: string;
  bullets: string[];
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl hover:bg-white/[0.07] transition">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-semibold">{title}</div>
          <div className="mt-1 text-xs tracking-[0.25em] text-white/60">{subtitle}</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/70">
          DROP
        </div>
      </div>

      <p className="mt-4 text-sm text-white/70 leading-relaxed">{desc}</p>

      <div className="mt-5 grid gap-2">
        {bullets.map((b) => (
          <div key={b} className="flex items-center gap-2 text-sm text-white/75">
            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
            {b}
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <Link
          href="/products"
          className="inline-flex flex-1 items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:opacity-90 transition"
        >
          Shop →
        </Link>
        <a
          href="#fabric"
          className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 transition"
        >
          Spec
        </a>
      </div>
    </div>
  );
}

function SpecCard({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-6 hover:bg-black/40 transition">
      <div className="text-xs tracking-[0.25em] text-white/55">{k}</div>
      <div className="mt-2 text-sm text-white/85">{v}</div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl hover:bg-white/[0.07] transition">
      <div className="text-sm font-semibold">{q}</div>
      <div className="mt-3 text-sm text-white/70 leading-relaxed">{a}</div>
    </div>
  );
}