import { headers } from "next/headers";
import { ReactNode } from "react";

export const dynamic = "force-dynamic";

function unauthorized() {
  return new Response("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin", charset="UTF-8"',
    },
  });
}

function parseBasicAuth(authHeader: string) {
  // authHeader: "Basic base64(user:pass)"
  const base64 = authHeader.slice("Basic ".length).trim();
  let decoded = "";
  try {
    decoded = Buffer.from(base64, "base64").toString("utf8");
  } catch {
    return null;
  }
  const idx = decoded.indexOf(":");
  if (idx === -1) return null;
  return {
    user: decoded.slice(0, idx),
    pass: decoded.slice(idx + 1),
  };
}

async function requireAdminAuth() {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;

  // jei nėra env – blokuojam, kad admin niekada neliktų atviras
  if (!user || !pass) {
    throw unauthorized();
  }

  const h = await headers();
  const auth = h.get("authorization") || "";
  if (!auth.startsWith("Basic ")) {
    throw unauthorized();
  }

  const creds = parseBasicAuth(auth);
  if (!creds) throw unauthorized();

  if (creds.user !== user || creds.pass !== pass) {
    throw unauthorized();
  }
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  try {
    await requireAdminAuth();
  } catch (res: any) {
    // kai throw'inam Response, Next jį priima kaip atsakymą
    if (res instanceof Response) return res as any;
    return unauthorized() as any;
  }

  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}