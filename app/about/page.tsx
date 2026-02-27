// app/about/page.tsx
import Navbar from "@/components/Navbar";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0E0E10] text-[#F2F2F2]">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 pt-12 pb-24">
        <div className="border-b border-white/10 pb-10">
          <div className="text-xs tracking-[0.35em] uppercase text-white/45">
            About
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-[-0.02em] leading-[1.05]">
            Engineered presence.
            <span className="block text-white/60">Controlled output.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm md:text-base text-white/60 leading-relaxed">
            NAZ OUTLINES is built around form, tension and restraint. Pieces are
            designed as systems: cut, weight, surface, and movement.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Block
            title="Design language"
            text="Architecture-first silhouettes. Sharp decisions. No noise."
          />
          <Block
            title="Quality control"
            text="Heavyweight fabric, stable shape, consistent finishing."
          />
          <Block
            title="Drop logic"
            text="Limited, size-controlled runs. Clear inventory. No oversell."
          />
          <Block
            title="Culture"
            text="Dark motorsport energy. Precision. Presence."
          />
        </div>

        <div className="mt-12 flex gap-3">
          <Link
            href="/products"
            className="inline-flex items-center justify-center border border-white/15 bg-white/5 px-7 py-3 text-xs tracking-[0.28em] uppercase text-white/80 hover:bg-white/10 hover:text-white transition"
          >
            Shop →
          </Link>
          <Link
            href="/contacts"
            className="inline-flex items-center justify-center border border-white/10 bg-transparent px-7 py-3 text-xs tracking-[0.28em] uppercase text-white/60 hover:text-white/85 transition"
          >
            Contacts →
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-10 flex items-center justify-between">
          <div className="text-xs tracking-[0.35em] uppercase text-white/50">
            NAZ
          </div>
          <div className="text-xs text-white/35">
            © {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </main>
  );
}

function Block({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-[#141416] p-7">
      <div className="text-[11px] tracking-[0.28em] uppercase text-white/45">
        {title}
      </div>
      <div className="mt-4 text-sm text-white/65 leading-relaxed">{text}</div>
    </div>
  );
}