import type { Metadata } from "next";
import SuccessContent from "./SuccessContent";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your NAZ order has been successfully placed.",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  return (
    <div className="container-naz py-12 pb-20 md:py-16 md:pb-24">
      <SuccessContent sessionId={session_id} />
    </div>
  );
}