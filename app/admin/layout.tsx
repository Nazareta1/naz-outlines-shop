import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: ReactNode }) {
  // Auth turi vykti middleware/proxy lygyje (HTTP),
  // o ne React layout'e.
  return <div className="min-h-screen">{children}</div>;
}