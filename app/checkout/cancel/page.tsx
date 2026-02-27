import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen bg-[#0E0E10] text-[#F2F2F2]">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 pt-12 pb-24">
        <div className="border-b border-white/10 pb-10">
          <div className="text-xs tracking-[0.35em] uppercase text-white/45">
            Checkout
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-[-0.02em] leading-[1.05]">
            Payment cancelled
          </h1>
          <div className="mt-4 text-sm text-white/55">
            No charge was made.
          </div>
        </div>

        <div className="mt-12 border border-white/10 bg-[#141416] rounded-[28px] p-10">
          <div className="text-xs tracking-[0.35em] uppercase text-white/45">
            Next
          </div>
          <div className="mt-4 text-white/65 leading-relaxed">
            Return to cart and continue when ready.
          </div>

          <div className="mt-10 flex gap-3">
            <Link
              href="/cart"
              className="inline-flex items-center justify-center border border-white/15 bg-white/5 px-7 py-3 text-xs tracking-[0.28em] uppercase text-white/80 hover:bg-white/10 hover:text-white transition"
            >
              Back to cart
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center border border-white/10 bg-transparent px-7 py-3 text-xs tracking-[0.28em] uppercase text-white/60 hover:text-white/85 transition"
            >
              Explore
            </Link>
          </div>
        </div>

        <div className="mt-10 text-[11px] tracking-[0.28em] uppercase text-white/40">
          Engineered for presence
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