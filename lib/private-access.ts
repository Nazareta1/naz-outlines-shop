import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function createPrivateAccessToken({
  email,
  dropSlug,
  expiresInHours = 48,
}: {
  email: string;
  dropSlug: string;
  expiresInHours?: number;
}) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

  return prisma.privateAccessToken.create({
    data: {
      email: email.toLowerCase().trim(),
      token,
      dropSlug,
      expiresAt,
    },
  });
}

export async function validatePrivateAccessToken({
  token,
  dropSlug,
}: {
  token: string;
  dropSlug: string;
}) {
  if (!token) return null;

  const record = await prisma.privateAccessToken.findUnique({
    where: { token },
  });

  if (!record) return null;
  if (record.dropSlug !== dropSlug) return null;
  if (record.expiresAt < new Date()) return null;

  return record;
}