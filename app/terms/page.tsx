import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Terms and conditions governing purchases and use of the NAZ website.",
};

export default function TermsPage() {
  return (
    <div className="bg-black text-white">
      <section className="border-b border-white/10">
        <div className="container-naz py-16 md:py-20 max-w-3xl">
          <p className="naz-eyebrow mb-4">Terms</p>

          <h1 className="naz-heading-lg text-white">
            Terms of use and purchase.
          </h1>

          <p className="mt-6 text-base leading-8 text-white/70">
            By accessing this website and placing an order, you agree to the
            following terms and conditions.
          </p>
        </div>
      </section>

      <section className="container-naz py-16 md:py-20 max-w-4xl grid gap-6">

        <section className="naz-card rounded-[2rem] p-7">
          <p className="naz-eyebrow mb-4">Orders</p>
          <p className="text-sm leading-8 text-white/65">
            All orders are subject to availability and acceptance. NAZ reserves
            the right to cancel or refuse any order if necessary.
          </p>
        </section>

        <section className="naz-card rounded-[2rem] p-7">
          <p className="naz-eyebrow mb-4">Pricing</p>
          <p className="text-sm leading-8 text-white/65">
            Prices are displayed in EUR and may change without prior notice.
            The price at checkout is final.
          </p>
        </section>

        <section className="naz-card rounded-[2rem] p-7">
          <p className="naz-eyebrow mb-4">Payments</p>
          <p className="text-sm leading-8 text-white/65">
            Payments are processed securely via third-party providers. By
            completing a purchase, you confirm that the payment information
            provided is valid.
          </p>
        </section>

        <section className="naz-card rounded-[2rem] p-7">
          <p className="naz-eyebrow mb-4">Shipping</p>
          <p className="text-sm leading-8 text-white/65">
            Delivery times and costs are defined at checkout. NAZ is not
            responsible for delays caused by external factors.
          </p>
        </section>

        <section className="naz-card rounded-[2rem] p-7">
          <p className="naz-eyebrow mb-4">Returns</p>
          <p className="text-sm leading-8 text-white/65">
            Returns are handled according to our Returns Policy. By placing an
            order, you agree to those conditions.
          </p>
        </section>

        <section className="naz-card rounded-[2rem] p-7">
          <p className="naz-eyebrow mb-4">Liability</p>
          <p className="text-sm leading-8 text-white/65">
            NAZ is not liable for indirect or consequential damages related to
            the use of this website or purchased products, except where required
            by law.
          </p>
        </section>

        <section className="naz-card rounded-[2rem] p-7">
          <p className="naz-eyebrow mb-4">Changes</p>
          <p className="text-sm leading-8 text-white/65">
            These terms may be updated at any time. Continued use of the website
            constitutes acceptance of the updated terms.
          </p>
        </section>

        <section className="naz-card rounded-[2rem] p-7">
          <p className="naz-eyebrow mb-4">Contact</p>
          <p className="text-sm leading-8 text-white/65">
            For questions regarding these terms, contact{" "}
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