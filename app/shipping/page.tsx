import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping",
  description: "Shipping information for NAZ orders.",
};

export default function ShippingPage() {
  return (
    <div className="container-naz py-12 pb-20 md:py-16 md:pb-24">
      <div className="mx-auto max-w-4xl">
        <p className="naz-eyebrow mb-4">Shipping</p>
        <h1 className="naz-heading-lg text-white">Shipping information</h1>
        <p className="mt-6 text-base leading-8 text-white/68">
          NAZ orders are prepared with care and shipped with tracked delivery.
          We currently ship to selected European countries shown at checkout.
        </p>

        <div className="mt-12 grid gap-6">
          <section className="naz-card rounded-[1.75rem] p-6 sm:p-8">
            <h2 className="text-2xl font-medium text-white">Processing time</h2>
            <p className="mt-4 text-sm leading-8 text-white/65">
              Orders are usually processed within 1–5 business days after payment
              confirmation. During drop launches or higher demand periods,
              processing may take a little longer.
            </p>
          </section>

          <section className="naz-card rounded-[1.75rem] p-6 sm:p-8">
            <h2 className="text-2xl font-medium text-white">Delivery</h2>
            <p className="mt-4 text-sm leading-8 text-white/65">
              Shipping rates are calculated at checkout. Once your order is shipped,
              you may receive tracking details when available. Delivery times vary
              depending on destination and carrier.
            </p>
          </section>

          <section className="naz-card rounded-[1.75rem] p-6 sm:p-8">
            <h2 className="text-2xl font-medium text-white">Customs and delays</h2>
            <p className="mt-4 text-sm leading-8 text-white/65">
              NAZ is not responsible for delivery delays caused by carriers,
              customs processing, weather, or other circumstances outside our
              control. Any customs charges or import duties, if applicable, are
              the responsibility of the customer.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}