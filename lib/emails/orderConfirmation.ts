type Item = {
  name: string;
  quantity: number;
  priceCents: number;
};

function money(cents: number, currency: string) {
  const amount = (cents / 100).toFixed(2);
  return currency === "EUR" ? `${amount} €` : `${amount} ${currency}`;
}

export function orderConfirmationEmail(data: {
  orderId: string;
  createdAt: Date;
  currency: string;
  items: Item[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  customerName?: string | null;
}) {
  const {
    orderId,
    createdAt,
    currency,
    items,
    subtotalCents,
    shippingCents,
    totalCents,
    customerName,
  } = data;

  const itemsHtml = items
    .map(
      (i) => `
        <tr>
          <td style="padding:12px 0;color:#fff;">
            <strong>${i.name}</strong><br/>
            <span style="color:#aaa;font-size:12px;">Qty: ${i.quantity}</span>
          </td>
          <td style="text-align:right;color:#fff;">
            ${money(i.priceCents * i.quantity, currency)}
          </td>
        </tr>
      `
    )
    .join("");

  const subject = `Naz Outlines — Order Confirmed`;

  const html = `
  <div style="background:#0b0f14;padding:40px 0;font-family:Arial, sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:#111;border-radius:16px;padding:30px;">
      <div style="letter-spacing:4px;color:#888;font-size:12px;">NAZ OUTLINES</div>
      <h1 style="color:#fff;margin-top:10px;">Order confirmed</h1>
      <p style="color:#aaa;">
        ${customerName ? `Hi ${customerName},` : ""} thank you for your purchase.
      </p>

      <div style="margin-top:20px;border-top:1px solid #222;padding-top:20px;">
        <p style="color:#888;font-size:13px;">
          Order ID: <strong style="color:#fff;">${orderId}</strong><br/>
          Date: ${createdAt.toLocaleString()}
        </p>

        <table width="100%" style="margin-top:20px;">
          ${itemsHtml}
        </table>

        <div style="margin-top:20px;border-top:1px solid #222;padding-top:20px;">
          <div style="display:flex;justify-content:space-between;color:#aaa;">
            <span>Subtotal</span>
            <span>${money(subtotalCents, currency)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;color:#aaa;margin-top:8px;">
            <span>Shipping</span>
            <span>${money(shippingCents, currency)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;color:#fff;margin-top:12px;font-weight:bold;">
            <span>Total</span>
            <span>${money(totalCents, currency)}</span>
          </div>
        </div>
      </div>

      <p style="color:#666;font-size:12px;margin-top:30px;">
        This is an automated email.
      </p>
    </div>
  </div>
  `;

  return { subject, html };
}