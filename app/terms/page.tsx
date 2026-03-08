import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms and conditions for NAZ.",
};

export default function TermsPage() {
  return (
    <div className="container-naz py-12 pb-20 md:py-16 md:pb-24">
      <div className="mx-auto max-w-4xl">
        <p className="naz-eyebrow mb-4">Terms</p>
        <h1 className="naz-heading-lg text-white">Terms and conditions</h1>
        <p className="mt-6 text-base leading-8 text-white/68">
          By using the NAZ store, you agree to these terms and conditions. Please
          read them carefully before placing an order.
        </p>

        <div className="mt-12 grid gap-6">
          <section className="naz-card rounded-[1.75rem] p-6 sm:p-8">
            <h2 className="text-2xl font-medium text-white">Products and availability</h2>
            <p className="mt-4 text-sm leading-8 text-white/65">
              All products are subject to availability. We reserve the right to
              change product details, pricing, or availability at any time without
              prior notice.
            </p>
          </section>

          <section className="naz-card rounded-[1.75rem] p-6 sm:p-8">
            <h2 className="text-2xl font-medium text-white">Orders</h2>
            <p className="mt-4 text-sm leading-8 text-white/65">
              Once an order is placed, you will receive confirmation through the
              checkout process or by email where available. We reserve the right
              to cancel or refuse an order in cases of suspected fraud, pricing
              errors, or product unavailability.
            </p>
          </section>

          <section className="naz-card rounded-[1.75rem] p-6 sm:p-8">
            <h2 className="text-2xl font-medium text-white">Pricing and payment</h2>
            <p className="mt-4 text-sm leading-8 text-white/65">
              All prices are shown in the selected store currency where applicable.
              Payment is processed securely by third-party payment providers.
            </p>
          </section>

          <section className="naz-card rounded-[1.75rem] p-6 sm:p-8">
            <h2 className="text-2xl font-medium text-white">Liability</h2>
            <p className="mt-4 text-sm leading-8 text-white/65">
              To the fullest extent permitted by law, NAZ shall not be liable for
              indirect, incidental, or consequential damages arising from the use
              of the store, delayed delivery, or inability to access the website.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}