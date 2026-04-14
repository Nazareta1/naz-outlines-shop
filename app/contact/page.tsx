"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export const dynamic = "force-dynamic";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      setSuccess("Your message has been sent.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send message."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_25%,transparent_75%,rgba(255,255,255,0.03))]" />

        <div className="container-naz relative py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="naz-eyebrow mb-6">Contact</p>

            <h1 className="naz-heading-lg text-white">Direct line to NAZ.</h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70">
              For selected communication — order support, collaborations,
              press, or business inquiries.
            </p>

            <div className="mt-8 inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm text-white/80 backdrop-blur-sm">
              Go Naz — win your own race
            </div>
          </div>
        </div>
      </section>

      <section className="container-naz py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr]">
          <div className="space-y-6">
            <div className="naz-card rounded-[2rem] p-7">
              <p className="naz-eyebrow mb-6">Contact</p>

              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/45">
                    Email
                  </p>
                  <a
                    href="mailto:support@nazofficial.com"
                    className="mt-2 block text-lg font-medium text-white transition hover:opacity-70"
                  >
                    support@nazofficial.com
                  </a>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/45">
                    Instagram
                  </p>
                  <Link
                    href="https://instagram.com/naz.official"
                    target="_blank"
                    className="mt-2 block text-lg font-medium text-white transition hover:opacity-70"
                  >
                    @naz.official
                  </Link>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/45">
                    Brand
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white/65">
                    NAZ <br />
                    Luxury streetwear shaped by presence, control, and energy.
                  </p>
                </div>
              </div>
            </div>

            <div className="naz-card rounded-[2rem] p-7">
              <p className="naz-eyebrow mb-4">Response</p>
              <p className="text-sm leading-7 text-white/65">
                Responses are typically provided within 24–48 hours.
                For order-related inquiries, include your order number.
              </p>
            </div>

            <div className="naz-card rounded-[2rem] p-7">
              <p className="naz-eyebrow mb-4">Note</p>
              <p className="text-sm leading-7 text-white/65">
                Every interaction reflects the brand. Clear, direct, and
                intentional.
              </p>
            </div>
          </div>

          <div className="naz-card rounded-[2rem] p-7 md:p-8">
            <div className="mb-8">
              <p className="naz-eyebrow mb-3">Message</p>
              <h2 className="text-2xl font-medium tracking-[-0.02em] md:text-3xl">
                Start the conversation
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-white/60">
                For support, collaborations, or brand-related inquiries.
              </p>
            </div>

            <form className="space-y-5" onSubmit={onSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/45">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  placeholder="Order / Collaboration / Business"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
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
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-black/50 px-4 py-3.5 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-white/40 focus:bg-white/[0.04]"
                />
              </div>

              {success ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80">
                  {success}
                </div>
              ) : null}

              {error ? (
                <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-full border border-white bg-white px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}