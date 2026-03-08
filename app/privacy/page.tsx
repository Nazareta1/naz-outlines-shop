import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for NAZ.",
};

export default function PrivacyPage() {
  return (
    <div className="container-naz py-12 pb-20 md:py-16 md:pb-24">
      <div className="mx-auto max-w-4xl">
        <p className="naz-eyebrow mb-4">Privacy</p>
        <h1 className="naz-heading-lg text-white">Privacy policy</h1>
        <p className="mt-6 text-base leading-8 text-white/68">
          NAZ respects your privacy and handles personal information with care.
          This page explains what information may be collected when you use our
          store and how it may be used.
        </p>

        <div className="mt-12 grid gap-6">
          <section className="naz-card rounded-[1.75rem] p-6 sm:p-8">
            <h2 className="text-2xl font-medium text-white">Information collected</h2>
            <p className="mt-4 text-sm leading-8 text-white/65">
              We may collect information such as your name, email address, shipping
              address, phone number, and order details when you place an order or
              contact us through the store.
            </p>
          </section>

          <section className="naz-card rounded-[1.75rem] p-6 sm:p-8">
            <h2 className="text-2xl font-medium text-white">How information is used</h2>
            <p className="mt-4 text-sm leading-8 text-white/65">
              Your information may be used to process orders, deliver purchases,
              communicate about your order, provide customer support, and improve
              the store experience. Payment details are processed securely through
              third-party payment providers and are not stored directly by NAZ.
            </p>
          </section>

          <section className="naz-card rounded-[1.75rem] p-6 sm:p-8">
            <h2 className="text-2xl font-medium text-white">Data protection</h2>
            <p className="mt-4 text-sm leading-8 text-white/65">
              We take reasonable steps to protect your data. However, no system is
              completely immune from risk. By using the store, you acknowledge that
              information is transmitted at your own risk.
            </p>
          </section>

          <section className="naz-card rounded-[1.75rem] p-6 sm:p-8">
            <h2 className="text-2xl font-medium text-white">Contact</h2>
            <p className="mt-4 text-sm leading-8 text-white/65">
              If you have questions regarding privacy or your personal data, please
              contact NAZ through the contact details provided in the store.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}