import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping",
  description:
    "Shipping information for NAZ orders. Delivery, processing, and tracking details.",
};

export default function ShippingPage() {
  return (
    <div className="bg-black text-white">
      {/* HERO */}
      <section className="border-b border-white/10">
        <div className="container-naz py-16 md:py-20">
          <div className="max-w-3xl">
            <p className="naz-eyebrow mb-4">Shipping</p>

            <h1 className="naz-heading-lg text-white">
              Delivery, handled with precision.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70">
              Every NAZ order is prepared with attention and shipped with tracked
              delivery across selected European regions.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="container-naz py-16 md:py-20">
        <div className="mx-auto max-w-4xl grid gap-6">

          <section className="naz-card rounded-[2rem] p-7 sm:p-8">
            <p className="naz-eyebrow mb-4">Processing</p>

            <h2 className="text-2xl font-medium text-white">
              Preparation before dispatch
            </h2>

            <p className="mt-4 text-sm leading-8 text-white/65">
              Orders are typically prepared within 1–5 business days after
              payment confirmation. During limited drops or high-demand periods,
              processing time may extend slightly.
            </p>
          </section>

          <section className="naz-card rounded-[2rem] p-7 sm:p-8">
            <p className="naz-eyebrow mb-4">Delivery</p>

            <h2 className="text-2xl font-medium text-white">
              Tracked European shipping
            </h2>

            <p className="mt-4 text-sm leading-8 text-white/65">
              Shipping rates are calculated at checkout based on destination.
              Once dispatched, tracking details are provided when available.
              Delivery time depends on location and carrier operations.
            </p>
          </section>

          <section className="naz-card rounded-[2rem] p-7 sm:p-8">
            <p className="naz-eyebrow mb-4">External factors</p>

            <h2 className="text-2xl font-medium text-white">
              Customs and delays
            </h2>

            <p className="mt-4 text-sm leading-8 text-white/65">
              NAZ is not responsible for delays caused by shipping carriers,
              customs procedures, or conditions outside our control. Any customs
              duties or import taxes, if applicable, remain the responsibility of
              the customer.
            </p>
          </section>

          <section className="naz-card rounded-[2rem] p-7 sm:p-8">
            <p className="naz-eyebrow mb-4">Experience</p>

            <p className="text-sm leading-8 text-white/68">
              Every order is part of the NAZ experience. From preparation to
              delivery, the process is designed to feel controlled, reliable,
              and aligned with the brand.
            </p>
          </section>

        </div>
      </section>
    </div>
  );
}