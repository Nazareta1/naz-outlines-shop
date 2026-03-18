import Link from "next/link";
import SendPrivateDropForm from "./SendPrivateDropForm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function AdminPrivateDropPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link
          href="/admin/orders"
          className="inline-flex items-center px-3 py-1.5 rounded-lg border text-sm hover:bg-gray-50"
        >
          ← Back to admin
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Private Drop</h1>
        <p className="mt-2 text-sm text-gray-500">
          Control and distribute NAZ Private Access drop invitations.
        </p>
      </div>

      <SendPrivateDropForm />
    </div>
  );
}