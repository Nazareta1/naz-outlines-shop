import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "Privacy policy explaining how NAZ collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-black text-white">
      <section className="border-b border-white/10">
        <div className="container-naz py-16 md:py-20 max-w-3xl">
          <p className="naz-eyebrow mb-4">Privacy</p>

          <h1 className="naz-heading-lg text-white">
            Your data, handled with respect.
          </h1>

          <p className="mt-6 text-base leading-8 text-white/70">
            NAZ collects and processes personal data only where necessary to
            provide our services, process orders, and improve the experience.
          </p>
        </div>
      </section>

      <section className="container-naz py-16 md:py-20 max-w-4xl grid gap-6">

        <section className="naz-card rounded-[2rem] p-7">
          <p className="naz-eyebrow mb-4">Data collection</p>
          <p className="text-sm leading-8 text-white/65">
            We may collect your name, email address, shipping address, phone
            number, and payment-related details when you place an order or
            contact us.
          </p>
        </section>

        <section className="naz-card rounded-[2rem] p-7">
          <p className="naz-eyebrow mb-4">Usage</p>
          <p className="text-sm leading-8 text-white/65">
            Your data is used to process orders, provide customer support,
            communicate updates, and improve our services.
          </p>
        </section>

        <section className="naz-card rounded-[2rem] p-7">
          <p className="naz-eyebrow mb-4">Payments</p>
          <p className="text-sm leading-8 text-white/65">
            Payments are processed securely through third-party providers such
            as Stripe. NAZ does not store your full payment details.
          </p>
        </section>

        <section className="naz-card rounded-[2rem] p-7">
          <p className="naz-eyebrow mb-4">Sharing</p>
          <p className="text-sm leading-8 text-white/65">
            Your data may be shared only with trusted partners such as shipping
            carriers and payment providers, strictly for order fulfillment.
          </p>
        </section>

        <section className="naz-card rounded-[2rem] p-7">
          <p className="naz-eyebrow mb-4">Retention</p>
          <p className="text-sm leading-8 text-white/65">
            We retain your data only as long as necessary for legal, operational,
            and service-related purposes.
          </p>
        </section>

        <section className="naz-card rounded-[2rem] p-7">
          <p className="naz-eyebrow mb-4">Your rights</p>
          <p className="text-sm leading-8 text-white/65">
            You have the right to access, update, or request deletion of your
            personal data. To do so, contact us directly.
          </p>
        </section>

        <section className="naz-card rounded-[2rem] p-7">
          <p className="naz-eyebrow mb-4">Contact</p>
          <p className="text-sm leading-8 text-white/65">
            For any privacy-related questions, contact{" "}
            <a
              href="mailto:nazoutlines@gmail.com"
              className="text-white hover:opacity-70"
            >
              nazoutlines@gmail.com
            </a>
          </p>
        </section>

      </section>
    </div>
  );
}