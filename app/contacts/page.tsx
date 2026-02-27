// app/contacts/page.tsx
import Navbar from "@/components/Navbar";

export const dynamic = "force-dynamic";

export default function ContactsPage() {
  return (
    <main className="min-h-screen bg-[#0E0E10] text-[#F2F2F2]">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 pt-12 pb-24">
        <div className="border-b border-white/10 pb-10">
          <div className="text-xs tracking-[0.35em] uppercase text-white/45">
            Contacts
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-[-0.02em] leading-[1.05]">
            Controlled communication.
            <span className="block text-white/60">Fast response.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm md:text-base text-white/60 leading-relaxed">
            Add your real contact endpoints here (email, IG, business inbox).
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <Card title="Email">orders@nazoutlines.com</Card>
          <Card title="Instagram">@nazoutlines</Card>
          <Card title="Support">Responses within 24–48h</Card>
        </div>

        <div className="mt-10 text-xs text-white/40">
          Tip: kai turėsi realų support email, įrašysim jį ir į Stripe / Resend.
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
      <div className="mt-4 text-sm text-white/70">{children}</div>
    </div>
  );
}