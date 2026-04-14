import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend, ADMIN_EMAIL, EMAIL_FROM } from "@/lib/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getIpAddress(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || null;
  }

  return request.headers.get("x-real-ip") || null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const subject = String(body.subject || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    if (name.length > 120 || email.length > 200 || subject.length > 200 || message.length > 5000) {
      return NextResponse.json(
        { error: "Submitted content is too long." },
        { status: 400 }
      );
    }

    const createdMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject: subject || null,
        message,
        ipAddress: getIpAddress(request),
      },
    });

    if (ADMIN_EMAIL) {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: ADMIN_EMAIL,
        subject: `NAZ Contact${subject ? ` — ${subject}` : ""}`,
        html: `
          <div style="background:#0b0b0c;padding:40px 24px;font-family:Arial,Helvetica,sans-serif;color:#f5f5f3;">
            <div style="max-width:680px;margin:0 auto;border:1px solid #232326;border-radius:20px;padding:32px;background:#111214;">
              <div style="font-size:11px;letter-spacing:0.24em;text-transform:uppercase;color:#8f9095;margin-bottom:12px;">NAZ Contact</div>
              <h1 style="margin:0 0 24px 0;font-size:28px;line-height:1.2;color:#ffffff;">New message received</h1>

              <div style="margin-bottom:22px;padding:18px 20px;border:1px solid #232326;border-radius:16px;background:#0d0e10;">
                <p style="margin:0 0 10px 0;font-size:14px;line-height:1.7;"><strong>Name:</strong> ${escapeHtml(name)}</p>
                <p style="margin:0 0 10px 0;font-size:14px;line-height:1.7;"><strong>Email:</strong> ${escapeHtml(email)}</p>
                <p style="margin:0;font-size:14px;line-height:1.7;"><strong>Subject:</strong> ${escapeHtml(subject || "-")}</p>
              </div>

              <div style="padding:20px;border:1px solid #232326;border-radius:16px;background:#0d0e10;">
                <p style="margin:0 0 10px 0;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#8f9095;">Message</p>
                <p style="margin:0;font-size:15px;line-height:1.8;white-space:pre-wrap;color:#f5f5f3;">${escapeHtml(message)}</p>
              </div>

              <p style="margin:22px 0 0 0;font-size:12px;color:#8f9095;">Message ID: ${createdMessage.id}</p>
            </div>
          </div>
        `,
        text: `NAZ Contact

Name: ${name}
Email: ${email}
Subject: ${subject || "-"}

Message:
${message}

Message ID: ${createdMessage.id}`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CONTACT_POST_ERROR", error);

    return NextResponse.json(
      { error: "Failed to send message." },
      { status: 500 }
    );
  }
}