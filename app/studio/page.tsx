// app/studio/page.tsx
import Navbar from "@/components/Navbar";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function StudioPage() {
  return (
    <main className="min-h-screen bg-[#0E0E10] text-[#F2F2F2]">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 pt-12 pb-24">
        <div className="border-b border-white/10 pb-10">
          <div className="text-xs tracking-[0.35em] uppercase text-white/45">
            Studio
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-[-0.02em] leading-[1.05]">
            Build system.
            <span className="block text-white/60">Not decoration.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm md:text-base text-white/60 leading-relaxed">
            Here you’ll later place process: materials, cuts, prototypes, tests,
            and controlled production notes.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <Card title="Materials">
            GSM, composition, shrink control, washing tests, print durability.
          </Card>
          <Card title="Pattern & Cut">
            Boxy geometry, asymmetry, shoulder line, sleeve volume.
          </Card>
          <Card title="Production">
            Size-controlled inventory, quality checks, packaging system.
          </Card>
        </div>

        <div className="mt-12">
          <Link
            href="/products"
            className="inline-flex items-center justify-center border border-white/15 bg-white/5 px-7 py-3 text-xs tracking-[0.28em] uppercase text-white/80 hover:bg-white/10 hover:text-white transition"
          >
            Go to shop →
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

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-[#141416] p-7">
      <div className="text-[11px] tracking-[0.28em] uppercase text-white/45">
        {title}
      </div>
      <div className="mt-4 text-sm text-white/65 leading-relaxed">{children}</div>
    </div>
  );
}