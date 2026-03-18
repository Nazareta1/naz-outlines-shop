import type { Metadata } from "next";
import SuccessContent from "./SuccessContent";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description:
    "Your NAZ order has been successfully placed. Welcome to the experience.",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  return (
    <div className="bg-black text-white">
      <section className="relative border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%)]" />

        <div className="container-naz py-16 md:py-20">
          <div className="max-w-2xl">
            <p className="naz-eyebrow mb-4">NAZ / Checkout</p>

            <h1 className="naz-heading-lg text-white">
              Order confirmed.
            </h1>

            <p className="mt-4 text-base leading-8 text-white/70">
              Your piece is now part of your story.
            </p>
          </div>
        </div>
      </section>

      <div className="container-naz py-12 pb-20 md:py-16 md:pb-24">
        <SuccessContent sessionId={session_id} />
      </div>
    </div>
  );
}