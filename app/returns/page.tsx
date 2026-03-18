import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns",
  description:
    "Returns and refund policy for NAZ orders. Clear conditions, processing, and support.",
};

export default function ReturnsPage() {
  return (
    <div className="bg-black text-white">
      {/* HERO */}
      <section className="border-b border-white/10">
        <div className="container-naz py-16 md:py-20">
          <div className="max-w-3xl">
            <p className="naz-eyebrow mb-4">Returns</p>

            <h1 className="naz-heading-lg text-white">
              Returns, handled with clarity.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70">
              If your order is not as expected, you may request a return within
              14 days of delivery.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="container-naz py-16 md:py-20">
        <div className="mx-auto max-w-4xl grid gap-6">

          {/* CONDITIONS */}
          <section className="naz-card rounded-[2rem] p-7 sm:p-8">
            <p className="naz-eyebrow mb-4">Conditions</p>

            <h2 className="text-2xl font-medium text-white">
              Eligibility for returns
            </h2>

            <p className="mt-4 text-sm leading-8 text-white/65">
              Returned items must be unworn, unused, and unwashed, with all
              original tags attached and in their original condition. Returns
              that do not meet these standards may be refused.
            </p>
          </section>

          {/* PROCESS */}
          <section className="naz-card rounded-[2rem] p-7 sm:p-8">
            <p className="naz-eyebrow mb-4">Process</p>

            <h2 className="text-2xl font-medium text-white">
              How to request a return
            </h2>

            <p className="mt-4 text-sm leading-8 text-white/65">
              To initiate a return, contact us at{" "}
              <a
                href="mailto:nazoutlines@gmail.com"
                className="text-white transition hover:opacity-70"
              >
                nazoutlines@gmail.com
              </a>{" "}
              within 14 days of receiving your order. Please include your order
              ID and reason for the return.
            </p>
          </section>

          {/* SHIPPING */}
          <section className="naz-card rounded-[2rem] p-7 sm:p-8">
            <p className="naz-eyebrow mb-4">Shipping</p>

            <h2 className="text-2xl font-medium text-white">
              Return shipping
            </h2>

            <p className="mt-4 text-sm leading-8 text-white/65">
              Customers are responsible for return shipping costs unless the
              item received is incorrect or faulty.
            </p>
          </section>

          {/* REFUNDS */}
          <section className="naz-card rounded-[2rem] p-7 sm:p-8">
            <p className="naz-eyebrow mb-4">Refunds</p>

            <h2 className="text-2xl font-medium text-white">
              Processing and timing
            </h2>

            <p className="mt-4 text-sm leading-8 text-white/65">
              Once your return is received and inspected, approved refunds will
              be issued to the original payment method. Processing may take up
              to 5–10 business days depending on your payment provider.
            </p>
          </section>

          {/* NON RETURNABLE */}
          <section className="naz-card rounded-[2rem] p-7 sm:p-8">
            <p className="naz-eyebrow mb-4">Limitations</p>

            <h2 className="text-2xl font-medium text-white">
              Non-returnable items
            </h2>

            <p className="mt-4 text-sm leading-8 text-white/65">
              Items that are worn, damaged, altered, or returned without original
              presentation may not be accepted. Certain limited releases or
              custom pieces may be non-returnable where legally permitted.
            </p>
          </section>

          {/* EXCHANGES */}
          <section className="naz-card rounded-[2rem] p-7 sm:p-8">
            <p className="naz-eyebrow mb-4">Exchanges</p>

            <h2 className="text-2xl font-medium text-white">
              Exchange policy
            </h2>

            <p className="mt-4 text-sm leading-8 text-white/65">
              We do not offer direct exchanges. To change size or item, please
              return your order and place a new one.
            </p>
          </section>

          {/* EXPERIENCE */}
          <section className="naz-card rounded-[2rem] p-7 sm:p-8">
            <p className="naz-eyebrow mb-4">NAZ</p>

            <p className="text-sm leading-8 text-white/68">
              Every part of the experience is designed to feel controlled,
              transparent, and aligned with the brand.
            </p>
          </section>

        </div>
      </section>
    </div>
  );
}