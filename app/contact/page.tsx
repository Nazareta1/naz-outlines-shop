// app/contact/page.tsx

import Navbar from "@/components/Navbar";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black text-white">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_25%,transparent_75%,rgba(255,255,255,0.03))]" />

          <div className="relative mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
            <div className="max-w-3xl">
              <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-white/55">
                NAZ / Contact
              </p>

              <h1 className="text-4xl font-semibold tracking-[-0.03em] md:text-6xl">
                Let’s talk.
              </h1>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/65 md:text-base">
                For order support, collaborations, press, or business inquiries,
                contact NAZ directly. Built with presence, precision, and a
                motorsport state of mind.
              </p>

              <div className="mt-8 inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
                go NAZ — win your own race
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_1.2fr]">
            {/* Left side */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/45">
                  Direct Contact
                </p>

                <div className="mt-6 space-y-6">
                  <div>
                    <h2 className="text-sm uppercase tracking-[0.18em] text-white/50">
                      Email
                    </h2>
                    <a
                      href="mailto:support@nazofficial.com"
                      className="mt-2 inline-block text-lg font-medium text-white transition hover:text-white/75"
                    >
                      support@nazofficial.com
                    </a>
                  </div>

                  <div>
                    <h2 className="text-sm uppercase tracking-[0.18em] text-white/50">
                      Instagram
                    </h2>
                    <Link
                      href="https://instagram.com/naz.official"
                      target="_blank"
                      className="mt-2 inline-block text-lg font-medium text-white transition hover:text-white/75"
                    >
                      @naz.official
                    </Link>
                  </div>

                  <div>
                    <h2 className="text-sm uppercase tracking-[0.18em] text-white/50">
                      Brand
                    </h2>
                    <p className="mt-2 text-base leading-7 text-white/75">
                      NAZ
                      <br />
                      Luxury streetwear with motorsport energy.
                      <br />
                      Built for confidence, presence, and motion.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-7">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/45">
                  Response Time
                </p>
                <p className="mt-4 text-sm leading-7 text-white/70">
                  We usually respond within 24–48 hours on business days. For
                  order-related questions, include your order number for faster
                  support.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-7">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/45">
                  NAZ Note
                </p>
                <p className="mt-4 text-sm leading-7 text-white/70">
                  This is not just customer service. Every message is part of
                  the experience. Clean communication, strong identity, no
                  noise.
                </p>
              </div>
            </div>

            {/* Right side */}
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-7 md:p-8">
              <div className="mb-8">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/45">
                  Send Message
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] md:text-3xl">
                  Start the conversation
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-white/60">
                  Whether it’s support, collaboration, or brand interest, send
                  your message below.
                </p>
              </div>

              <form className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/45">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3.5 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-white/40 focus:bg-white/[0.04]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/45">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3.5 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-white/40 focus:bg-white/[0.04]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/45">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Order support / Collaboration / Business"
                    className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3.5 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-white/40 focus:bg-white/[0.04]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/45">
                    Message
                  </label>
                  <textarea
                    rows={7}
                    placeholder="Write your message..."
                    className="w-full resize-none rounded-2xl border border-white/10 bg-black/50 px-4 py-3.5 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-white/40 focus:bg-white/[0.04]"
                  />
                </div>

                <button
                  type="submit"
                  className="group inline-flex w-full items-center justify-center rounded-2xl border border-white bg-white px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-transparent hover:text-white"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}