export function generateAdminAffiliateConversionEmail(order: any, affiliate: any, commissionAmount: number): string {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://spartalabs.shop';
  
  const affiliateName = affiliate.displayName || 'Partner';
  const orderNumber = order.orderNumber || order.id || 'N/A';
  const orderTotal = `$${(order.total || 0).toFixed(2)}`;
  const commissionFormatted = `$${(commissionAmount / 100).toFixed(2)}`;
  const customerEmail = (typeof order.owner === 'object' && order.owner !== null ? order.owner.email : order.guestEmail) || 'N/A';
  const adminUrl = `${serverUrl}/admin/collections/orders/${order.id}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; line-height: 1.5; color: #333; }
    h2 { color: #000; }
    .label { font-weight: bold; }
    .card { background-color: #f9f9f9; padding: 20px; border: 1px solid #eee; border-radius: 8px; }
  </style>
</head>
<body>
  <h2>New Affiliate Conversion! 🎉</h2>
  <p>An order has been placed by a customer using an affiliate link or coupon.</p>
  
  <div class="card">
    <p><span class="label">Affiliate:</span> ${affiliateName}</p>
    <p><span class="label">Affiliate ID:</span> ${affiliate.id}</p>
    <p><span class="label">Customer Email:</span> ${customerEmail}</p>
    <p><span class="label">Order Number:</span> ${orderNumber}</p>
    <p><span class="label">Order Total:</span> ${orderTotal}</p>
    <p><span class="label">Estimated Commission:</span> ${commissionFormatted}</p>
  </div>
  
  <p><a href="${adminUrl}">View Order in Payload Admin</a></p>
</body>
</html>
  `;
}
