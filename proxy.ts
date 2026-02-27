import { NextRequest, NextResponse } from "next/server";

function unauthorized() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="NAZ Admin", charset="UTF-8"',
    },
  });
}

function decodeBasicAuth(authHeader: string): { user: string; pass: string } | null {
  if (!authHeader.toLowerCase().startsWith("basic ")) return null;
  const base64 = authHeader.slice(6).trim();

  try {
    const decoded = Buffer.from(base64, "base64").toString("utf8"); // "user:pass"
    const idx = decoded.indexOf(":");
    if (idx === -1) return null;
    return { user: decoded.slice(0, idx), pass: decoded.slice(idx + 1) };
  } catch {
    return null;
  }
}

export default function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // only protect admin
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const envUser = process.env.ADMIN_USER ?? "";
  const envPass = process.env.ADMIN_PASSWORD ?? "";

  if (!envUser || !envPass) {
    return new NextResponse("Admin auth not configured", { status: 500 });
  }

  const auth = req.headers.get("authorization");
  if (!auth) return unauthorized();

  const creds = decodeBasicAuth(auth);
  if (!creds) return unauthorized();

  if (creds.user !== envUser || creds.pass !== envPass) return unauthorized();

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};