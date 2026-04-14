import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Date(date).toLocaleString();
}

function statusBadge(status: string) {
  const s = (status || "").toLowerCase();

  if (s === "new") return "bg-yellow-100 text-yellow-800 border-yellow-200";
  if (s === "read") return "bg-blue-100 text-blue-800 border-blue-200";
  if (s === "replied") return "bg-green-100 text-green-800 border-green-200";
  if (s === "archived") return "bg-zinc-100 text-zinc-800 border-zinc-200";

  return "bg-slate-100 text-slate-800 border-slate-200";
}

export default async function AdminContactPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Contact Messages</h1>
          <p className="text-sm text-gray-500 mt-1">
            All inbound contact form messages.
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="inline-flex items-center px-3 py-1.5 rounded-lg border text-sm hover:bg-gray-50"
        >
          Back to orders
        </Link>
      </div>

      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="border rounded-2xl bg-white shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div>
                <div className="text-lg font-semibold">{message.name}</div>
                <div className="text-sm text-gray-500">{message.email}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {formatDate(message.createdAt)}
                </div>
              </div>

              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium w-fit ${statusBadge(
                  message.status
                )}`}
              >
                {message.status}
              </span>
            </div>

            <div className="mb-3">
              <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                Subject
              </div>
              <div className="text-sm text-gray-800">
                {message.subject || "—"}
              </div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                Message
              </div>
              <div className="text-sm text-gray-800 whitespace-pre-wrap leading-7">
                {message.message}
              </div>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="border rounded-2xl bg-white shadow-sm p-8 text-sm text-gray-500">
            No contact messages yet.
          </div>
        )}
      </div>
    </div>
  );
}