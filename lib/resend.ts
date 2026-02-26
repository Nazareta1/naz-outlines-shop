import { Resend } from "resend";

export const runtime = "nodejs";

if (!process.env.RESEND_API_KEY) {
  throw new Error("Missing RESEND_API_KEY");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export const EMAIL_FROM =
  process.env.EMAIL_FROM ||
  "Naz Outlines <orders@nazoutlines.com>";

export const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || "";