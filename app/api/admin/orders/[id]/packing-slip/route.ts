import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatMoney(cents: number, currency: string) {
  const amount = cents / 100;

  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency.toUpperCase()}`;
  }
}

function safe(value?: string | null) {
  return value?.trim() || "—";
}

function wrapText(text: string, maxChars: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;

    if (next.length <= maxChars) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);

  return lines;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]); // A4
  const width = page.getWidth();
  const height = page.getHeight();

  const fontRegular = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const colors = {
    bg: rgb(0.05, 0.05, 0.06),
    panel: rgb(0.08, 0.08, 0.09),
    text: rgb(0.96, 0.96, 0.94),
    sub: rgb(0.65, 0.65, 0.68),
    line: rgb(0.20, 0.20, 0.22),
    white: rgb(1, 1, 1),
  };

  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: colors.bg,
  });

  const left = 52;
  const right = width - 52;
  let y = height - 58;

  page.drawText("NAZ", {
    x: left,
    y,
    size: 30,
    font: fontBold,
    color: colors.text,
  });

  page.drawText("PACKING SLIP", {
    x: right - 110,
    y: y + 7,
    size: 11,
    font: fontBold,
    color: colors.sub,
  });

  y -= 22;

  page.drawLine({
    start: { x: left, y },
    end: { x: right, y },
    thickness: 1,
    color: colors.line,
  });

  y -= 28;

  page.drawText("ORDER", {
    x: left,
    y,
    size: 9,
    font: fontBold,
    color: colors.sub,
  });

  page.drawText(order.id, {
    x: left,
    y: y - 18,
    size: 13,
    font: fontRegular,
    color: colors.text,
  });

  page.drawText("CREATED", {
    x: 320,
    y,
    size: 9,
    font: fontBold,
    color: colors.sub,
  });

  page.drawText(new Date(order.createdAt).toLocaleString(), {
    x: 320,
    y: y - 18,
    size: 13,
    font: fontRegular,
    color: colors.text,
  });

  y -= 70;

  page.drawText("CUSTOMER", {
    x: left,
    y,
    size: 9,
    font: fontBold,
    color: colors.sub,
  });

  const customerLines = [
    safe(order.name),
    safe(order.email),
    safe(order.phone),
  ];

  let customerY = y - 18;
  for (const line of customerLines) {
    page.drawText(line, {
      x: left,
      y: customerY,
      size: 12,
      font: fontRegular,
      color: colors.text,
    });
    customerY -= 16;
  }

  page.drawText("SHIPPING ADDRESS", {
    x: 320,
    y,
    size: 9,
    font: fontBold,
    color: colors.sub,
  });

  const addressLines = [
    safe(order.addressLine1),
    order.addressLine2 ? order.addressLine2 : null,
    `${safe(order.postalCode)} ${order.city || ""}`.trim(),
    safe(order.region),
    safe(order.country),
  ].filter(Boolean) as string[];

  let addressY = y - 18;
  for (const line of addressLines) {
    page.drawText(line, {
      x: 320,
      y: addressY,
      size: 12,
      font: fontRegular,
      color: colors.text,
    });
    addressY -= 16;
  }

  y = Math.min(customerY, addressY) - 18;

  page.drawLine({
    start: { x: left, y },
    end: { x: right, y },
    thickness: 1,
    color: colors.line,
  });

  y -= 28;

  page.drawText("ITEMS", {
    x: left,
    y,
    size: 9,
    font: fontBold,
    color: colors.sub,
  });

  y -= 24;

  page.drawText("PRODUCT", {
    x: left,
    y,
    size: 9,
    font: fontBold,
    color: colors.sub,
  });
  page.drawText("SIZE", {
    x: 345,
    y,
    size: 9,
    font: fontBold,
    color: colors.sub,
  });
  page.drawText("QTY", {
    x: 405,
    y,
    size: 9,
    font: fontBold,
    color: colors.sub,
  });
  page.drawText("LINE TOTAL", {
    x: 455,
    y,
    size: 9,
    font: fontBold,
    color: colors.sub,
  });

  y -= 16;

  page.drawLine({
    start: { x: left, y },
    end: { x: right, y },
    thickness: 1,
    color: colors.line,
  });

  y -= 22;

  for (const item of order.items) {
    const productName = item.product?.name || item.name || "NAZ Item";
    const lines = wrapText(productName, 32);

    lines.forEach((line, index) => {
      page.drawText(line, {
        x: left,
        y: y - index * 15,
        size: 12,
        font: index === 0 ? fontBold : fontRegular,
        color: colors.text,
      });
    });

    page.drawText(item.size || "—", {
      x: 345,
      y,
      size: 12,
      font: fontRegular,
      color: colors.text,
    });

    page.drawText(String(item.quantity), {
      x: 405,
      y,
      size: 12,
      font: fontRegular,
      color: colors.text,
    });

    page.drawText(
      formatMoney(item.priceCents * item.quantity, order.currency),
      {
        x: 455,
        y,
        size: 12,
        font: fontRegular,
        color: colors.text,
      }
    );

    y -= Math.max(28, lines.length * 15 + 12);

    page.drawLine({
      start: { x: left, y },
      end: { x: right, y },
      thickness: 0.8,
      color: colors.line,
    });

    y -= 18;
  }

  y -= 6;

  page.drawText("SUBTOTAL", {
    x: 390,
    y,
    size: 10,
    font: fontBold,
    color: colors.sub,
  });

  page.drawText(formatMoney(order.subtotalCents, order.currency), {
    x: 470,
    y,
    size: 12,
    font: fontRegular,
    color: colors.text,
  });

  y -= 20;

  page.drawText("SHIPPING", {
    x: 390,
    y,
    size: 10,
    font: fontBold,
    color: colors.sub,
  });

  page.drawText(formatMoney(order.shippingCents, order.currency), {
    x: 470,
    y,
    size: 12,
    font: fontRegular,
    color: colors.text,
  });

  y -= 24;

  page.drawLine({
    start: { x: 390, y },
    end: { x: right, y },
    thickness: 1,
    color: colors.line,
  });

  y -= 24;

  page.drawText("TOTAL", {
    x: 390,
    y,
    size: 11,
    font: fontBold,
    color: colors.white,
  });

  page.drawText(formatMoney(order.totalCents, order.currency), {
    x: 470,
    y,
    size: 15,
    font: fontBold,
    color: colors.white,
  });

  y -= 70;

  page.drawText("FULFILLMENT NOTES", {
    x: left,
    y,
    size: 9,
    font: fontBold,
    color: colors.sub,
  });

  const notes = [
    "Prepare garment carefully.",
    "Check size before sealing the box.",
    "Insert packing slip and maintain premium presentation.",
    "Go NAZ — Win your own race",
  ];

  let notesY = y - 18;
  for (const note of notes) {
    page.drawText(note, {
      x: left,
      y: notesY,
      size: 12,
      font: fontRegular,
      color: colors.text,
    });
    notesY -= 18;
  }

  page.drawText("naz", {
    x: left,
    y: 34,
    size: 9,
    font: fontBold,
    color: colors.sub,
  });

  const pdfBytes = await pdf.save();

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="naz-packing-slip-${order.id}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}