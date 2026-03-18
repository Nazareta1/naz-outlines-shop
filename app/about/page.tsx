import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description:
    "Discover the story behind NAZ — a luxury streetwear label shaped by confidence, presence, and motorsport-inspired energy.",
};

export default function AboutPage() {
  return (
    <div className="bg-transparent text-white">
      <section className="border-b border-white/10">
        <div className="container-naz grid gap-10 py-20 md:grid-cols-[1fr_0.85fr] md:items-end md:py-24">
          <div className="max-w-3xl">
            <p className="naz-eyebrow mb-6">About NAZ</p>
            <h1 className="naz-heading-lg text-white">
              More than a name. A shift in identity.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              NAZ is a luxury streetwear label shaped by quiet confidence,
              controlled presence, and a refined motorsport-inspired energy.
            </p>
          </div>

          <div className="naz-card overflow-hidden rounded-[2rem]">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src="/logo.png"
                alt="NAZ brand story"
                fill
                className="object-cover object-center opacity-90"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container-naz py-20">
        <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="naz-eyebrow mb-4">The origin</p>
            <h2 className="text-3xl font-medium leading-tight tracking-[-0.03em] text-white sm:text-4xl">
              NAZ is not just a name. It is a moment.
            </h2>
          </div>

          <div className="space-y-6 text-base leading-8 text-white/70">
            <p>
              A moment when identity became clear, and confidence stopped asking
              for permission.
            </p>

            <p>
              Before that, there was hesitation. After that, there was only
              direction.
            </p>

            <p>
              Somewhere in that shift, a simple phrase started to follow me —
              <span className="italic"> “Go Naz.”</span>
            </p>

            <p>
              It was said lightly, almost without meaning. But each time, it
              removed doubt. It replaced hesitation with movement.
            </p>

            <p>
              That idea became something bigger.
            </p>

            <p className="text-white/82 italic">
              Go Naz. <br />
              Win your own race.
            </p>

            <p>
              NAZ exists in that space — between control and expression, between
              silence and presence.
            </p>

            <p>
              Every piece reflects that state.
            </p>

            <p className="text-white/82">
              Quiet confidence. <br />
              Controlled presence. <br />
              Energy that stays.
            </p>
          </div>
        </div>
      </section>

      <section className="container-naz border-t border-white/10 py-20">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-6 text-base leading-8 text-white/70">
            <p className="naz-eyebrow">The philosophy</p>
            <h2 className="text-3xl font-medium leading-tight tracking-[-0.03em] text-white sm:text-4xl">
              Designed to hold attention without asking for it.
            </h2>

            <p>
              NAZ is built on the tension between elegance and force. It draws
              from motorsport, dark visual discipline, and silhouettes that feel
              controlled, elevated, and immediate.
            </p>

            <p>
              This is not clothing created to chase attention. It is created for
              presence — the kind that is felt naturally through attitude,
              proportion, detail, and self-assurance.
            </p>

            <p>
              Every release is designed to feel substantial the moment it is
              worn. Strong lines, premium weight, and visual restraint are part
              of what gives NAZ its identity.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="naz-card rounded-[1.75rem] p-8">
              <p className="naz-eyebrow mb-3">What defines NAZ</p>
              <ul className="space-y-4 text-sm leading-7 text-white/72">
                <li>Quiet confidence.</li>
                <li>Elegance with edge.</li>
                <li>Controlled presence.</li>
                <li>Luxury shaped by identity.</li>
                <li>Energy that stays.</li>
              </ul>
            </div>

            <div className="naz-card rounded-[1.75rem] p-8">
              <p className="naz-eyebrow mb-3">Visual language</p>
              <ul className="space-y-4 text-sm leading-7 text-white/72">
                <li>Motorsport-inspired movement and tension.</li>
                <li>Dark, refined colour direction.</li>
                <li>Strong silhouettes with clear structure.</li>
                <li>Pieces designed to feel memorable on the body.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="container-naz border-t border-white/10 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="naz-eyebrow mb-4">The intention</p>
          <h2 className="naz-heading-lg text-white">
            NAZ is for those who move with certainty.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/68">
            For people who do not need to perform confidence, because the way
            they carry themselves already says enough. For those who understand
            that presence is not volume — it is energy, restraint, and identity.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/products" className="naz-button">
              Shop Drop 01
            </Link>
            <Link href="/" className="naz-button-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}