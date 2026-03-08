import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns",
  description: "Returns policy for NAZ orders.",
};

export default function ReturnsPage() {
  return (
    <div className="container-naz py-12 pb-20 md:py-16 md:pb-24">
      <div className="mx-auto max-w-4xl">
        <p className="naz-eyebrow mb-4">Returns</p>
        <h1 className="naz-heading-lg text-white">Returns policy</h1>
        <p className="mt-6 text-base leading-8 text-white/68">
          We want every NAZ order to arrive as expected. If there is an issue with
          your order, please contact us within 14 days of delivery.
        </p>

        <div className="mt-12 grid gap-6">
          <section className="naz-card rounded-[1.75rem] p-6 sm:p-8">
            <h2 className="text-2xl font-medium text-white">Return conditions</h2>
            <p className="mt-4 text-sm leading-8 text-white/65">
              Returned items must be unworn, unused, unwashed, and in their
              original condition. We reserve the right to refuse returns that do
              not meet these conditions.
            </p>
          </section>

          <section className="naz-card rounded-[1.75rem] p-6 sm:p-8">
            <h2 className="text-2xl font-medium text-white">Non-returnable items</h2>
            <p className="mt-4 text-sm leading-8 text-white/65">
              Items returned damaged, worn, altered, or without original
              presentation may not be accepted. Limited drops and special releases
              may be subject to additional return limitations where legally allowed.
            </p>
          </section>

          <section className="naz-card rounded-[1.75rem] p-6 sm:p-8">
            <h2 className="text-2xl font-medium text-white">Refunds</h2>
            <p className="mt-4 text-sm leading-8 text-white/65">
              Once your return is received and inspected, any approved refund will
              be processed to the original payment method. Shipping costs are
              generally non-refundable unless required by law or in the case of an
              incorrect or faulty item.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}