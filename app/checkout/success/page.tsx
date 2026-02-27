import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import SuccessContent from "./SuccessContent";

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-[#0E0E10] text-[#F2F2F2]">
      <Navbar />
      <Suspense
        fallback={
          <div className="mx-auto max-w-6xl px-6 pt-12 pb-24">
            <div className="border border-white/10 bg-[#141416] rounded-[28px] p-10">
              <div className="text-xs tracking-[0.35em] uppercase text-white/45">
                Loading
              </div>
              <div className="mt-4 text-white/60">Retrieving session.</div>
            </div>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </main>
  );
}