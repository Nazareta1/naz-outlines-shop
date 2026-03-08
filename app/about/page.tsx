import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description:
    "Discover the story behind NAZ — a luxury streetwear label shaped by confidence, elegance, and motorsport-inspired presence.",
};

export default function AboutPage() {
  return (
    <div className="bg-transparent text-white">
      <section className="border-b border-white/10">
        <div className="container-naz grid gap-10 py-20 md:grid-cols-[1fr_0.85fr] md:items-end md:py-24">
          <div className="max-w-3xl">
            <p className="naz-eyebrow mb-6">About NAZ</p>
            <h1 className="naz-heading-lg text-white">
              More than a name. A feeling of becoming fully yourself.
            </h1>
            <p className="mt-6 text-base leading-8 text-white/70 sm:text-lg">
              NAZ is a luxury streetwear label shaped by confidence, elegance,
              controlled intensity, and the kind of presence people remember.
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
            <h2 className="text-3xl font-medium leading-tight text-white sm:text-4xl">
              NAZ began with a name that finally felt right.
            </h2>
          </div>

          <div className="space-y-6 text-base leading-8 text-white/70">
            <p>
              For most of my life, people called me by one of my names,
              Paulina. I never questioned it too much, because my full name is
              Nazareta Paulina and people naturally chose the easier version.
            </p>

            <p>
              But when I was 21, I spent four months abroad and introduced
              myself simply as Nazareta. People started calling me NAZ, and
              something changed. For the first time, I felt fully aligned with
              myself — freer, stronger, more certain, and more confident in my
              own decisions.
            </p>

            <p>
              That period became deeply important to me because I felt accepted
              exactly as I was. I did things in my own way, trusted my own
              direction, and carried myself with a level of confidence I had not
              felt before.
            </p>

            <p>
              NAZ was not just a shorter version of my name. It became a symbol
              of identity, self-trust, and the energy of becoming who you were
              always meant to be.
            </p>
          </div>
        </div>
      </section>

      <section className="container-naz border-t border-white/10 py-20">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-6 text-base leading-8 text-white/70">
            <p className="naz-eyebrow">The brand philosophy</p>
            <h2 className="text-3xl font-medium leading-tight text-white sm:text-4xl">
              Fashion that carries elegance, darkness, and presence.
            </h2>

            <p>
              NAZ is inspired by the tension between elegance and force. It
              takes influence from motorsport, powerful silhouettes, dark
              aesthetics, and the kind of energy that does not need to be loud
              to dominate a room.
            </p>

            <p>
              This is not clothing designed to beg for attention. It is designed
              to create presence naturally — through structure, detail,
              confidence, and identity.
            </p>

            <p>
              Every piece is meant to feel sharp, elevated, and intentional.
              Strong lines, premium weight, and visual control are part of what
              makes NAZ feel distinct.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="naz-card rounded-[1.75rem] p-8">
              <p className="naz-eyebrow mb-3">What NAZ stands for</p>
              <ul className="space-y-4 text-sm leading-7 text-white/72">
                <li>Confidence without performance.</li>
                <li>Elegance with edge.</li>
                <li>Controlled attention.</li>
                <li>Luxury shaped by identity.</li>
                <li>Presence that feels natural, not forced.</li>
              </ul>
            </div>

            <div className="naz-card rounded-[1.75rem] p-8">
              <p className="naz-eyebrow mb-3">Visual direction</p>
              <ul className="space-y-4 text-sm leading-7 text-white/72">
                <li>Motorsport-inspired movement and tension.</li>
                <li>Dark, premium color direction.</li>
                <li>Oversized silhouettes and strong structure.</li>
                <li>Pieces designed to feel substantial and memorable.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="container-naz border-t border-white/10 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="naz-eyebrow mb-4">The intention</p>
          <h2 className="naz-heading-lg text-white">
            NAZ is for people who want to be felt before they are fully understood.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/68">
            It is for people with aura, taste, and self-belief. For those who
            do not need to chase attention because the way they move, dress, and
            carry themselves already says enough.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/products" className="naz-button">
              Shop Collection
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