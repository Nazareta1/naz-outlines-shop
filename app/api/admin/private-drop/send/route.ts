import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend, EMAIL_FROM } from "@/lib/resend";
import { createPrivateAccessToken } from "@/lib/private-access";
import NazPrivateDropInvite from "@/lib/emails/nazPrivateDropInvite";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const dropSlug = String(body?.dropSlug ?? "").trim();
    const dropName = String(body?.dropName ?? "").trim() || dropSlug;

    if (!dropSlug) {
      return new NextResponse("Missing dropSlug", { status: 400 });
    }

    const vipOrders = await prisma.order.findMany({
      where: {
        email: { not: null },
        nazPrivateAccess: true,
      },
      select: {
        email: true,
        name: true,
      },
      distinct: ["email"],
    });

    if (vipOrders.length === 0) {
      return NextResponse.json({ ok: true, sent: 0 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!siteUrl) {
      return new NextResponse("Missing NEXT_PUBLIC_SITE_URL", { status: 500 });
    }

    let sent = 0;

    for (const customer of vipOrders) {
      if (!customer.email) continue;

      const access = await createPrivateAccessToken({
        email: customer.email,
        dropSlug,
        expiresInHours: 48,
      });

      const privateUrl = `${siteUrl}/private-drop/${dropSlug}?token=${access.token}`;

      await resend.emails.send({
        from: EMAIL_FROM,
        to: customer.email,
        subject: `NAZ Private Access — ${dropName}`,
        react: NazPrivateDropInvite({
          customerName: customer.name,
          dropName,
          privateUrl,
        }),
        text: `NAZ Private Access — ${dropName}

Your early access is open.

Open your private drop:
${privateUrl}

No discounts.
Just access, priority, and presence.

Go NAZ — Win your own race`,
      });

      sent += 1;
    }

    return NextResponse.json({ ok: true, sent });
  } catch (e: any) {
    console.error("Private drop send failed:", e);
    return new NextResponse(e?.message ?? "Failed to send private drop emails", {
      status: 500,
    });
  }
}