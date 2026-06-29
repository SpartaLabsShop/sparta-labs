export async function generateOrderInvoiceHtml(order: any, payload?: any, customNote?: string): Promise<string> {
  const orderNumber = order.orderNumber || order.id;
  const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://spartalabs.com';
  
  const formatMoney = (amount: number) => `$${(amount).toFixed(2)}`;
  
  const subtotal = order.subtotal || 0;
  const discountTotal = order.discountTotal || 0;
  const redeemedPoints = order.redeemedPoints || 0;
  const shippingTotal = order.shippingTotal || 0;
  const taxTotal = order.taxTotal || 0;
  const feeTotal = (order.feeTotal || 0) / 100; // stored in cents
  const total = order.total || 0;
  
  const customerName = `${order.customerFirstName || ''} ${order.customerLastName || ''}`.trim() || 'Customer';
  const email = order.guestEmail || 'Customer';
  const shipAddr = order.shippingAddress || {};
  const billAddr = order.billingAddress || {};

  let itemsHtml = '';
  if (order.items && Array.isArray(order.items)) {
    const itemPromises = order.items.map(async (item: any) => {
      const product = item.productSnapshot || {};
      const name = product.name || 'Product';
      const variant = item.variant && item.variant !== 'DEFAULT' ? ` - ${item.variant}` : '';
      
      let imageUrl = '';
      if (product.images && product.images.length > 0) {
        const imgRef = product.images[0].image;
        if (typeof imgRef === 'object' && imgRef?.url) {
          imageUrl = imgRef.url.startsWith('http') ? imgRef.url : `${serverUrl}${imgRef.url.startsWith('/') ? '' : '/'}${imgRef.url}`;
        } else if ((typeof imgRef === 'string' || typeof imgRef === 'number') && payload) {
          try {
            const mediaDoc = await payload.findByID({ collection: 'media', id: imgRef, depth: 0 });
            if (mediaDoc && mediaDoc.url) {
              imageUrl = mediaDoc.url.startsWith('http') ? mediaDoc.url : `${serverUrl}${mediaDoc.url.startsWith('/') ? '' : '/'}${mediaDoc.url}`;
            }
          } catch (e) {
             console.error('Failed to fetch media for email image', e)
          }
        }
      }
      
      // Fix spaces in URL for email clients (e.g. "Product Images" folder)
      if (imageUrl) {
         imageUrl = encodeURI(imageUrl);
      }

      const imgHtml = imageUrl 
        ? `<img src="${imageUrl}" alt="${name}" style="width: 60px; height: 90px; object-fit: contain; border-radius: 6px;" />` 
        : `<div style="width: 60px; height: 90px; background-color: #f3f4f6; border-radius: 6px; display: inline-block;"></div>`;

      return `
        <tr>
          <td style="padding: 16px 0; border-bottom: 1px solid #e5e7eb;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="75" valign="middle">
                  ${imgHtml}
                </td>
                <td valign="middle">
                  <p style="margin: 0; font-size: 14px; font-weight: 600; color: #111827;">${name}${variant}</p>
                  <p style="margin: 4px 0 0 0; font-size: 13px; color: #6b7280;">Qty: ${item.quantity}</p>
                </td>
                <td valign="middle" align="right">
                  <p style="margin: 0; font-size: 14px; font-weight: 600; color: #111827;">${formatMoney(item.price)}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `;
    });
    
    const itemsHtmlArray = await Promise.all(itemPromises);
    itemsHtml = itemsHtmlArray.join('');
  }

  const discountRow = discountTotal > 0 ? `
    <tr>
      <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Discount ${order.couponCode ? `(${order.couponCode})` : ''}</td>
      <td align="right" style="padding: 8px 0; font-size: 14px; color: #16a34a;">-${formatMoney(discountTotal)}</td>
    </tr>
  ` : '';

  const pointsRow = redeemedPoints > 0 ? `
    <tr>
      <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Maxx Points Redeemed</td>
      <td align="right" style="padding: 8px 0; font-size: 14px; color: #16a34a;">-${formatMoney(redeemedPoints)}</td>
    </tr>
  ` : '';

  const feeRow = feeTotal > 0 ? `
    <tr>
      <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Processing Fees</td>
      <td align="right" style="padding: 8px 0; font-size: 14px; color: #111827;">${formatMoney(feeTotal)}</td>
    </tr>
  ` : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Invoice #${orderNumber}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px 40px; text-align: center; border-bottom: 1px solid #f3f4f6;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #000000; letter-spacing: -1px;">Sparta Labs</h1>
              <p style="margin: 12px 0 0 0; font-size: 16px; color: #6b7280;">Thank you for your order, ${customerName}!</p>
            </td>
          </tr>

          ${customNote ? `
          <!-- Custom Admin Note -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="background-color: #FFFBEB; border-left: 4px solid #F59E0B; padding: 20px; border-radius: 4px;">
                <h3 style="margin: 0 0 8px 0; color: #92400E; font-size: 15px; font-weight: 600;">Message regarding your order</h3>
                <p style="margin: 0; color: #92400E; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${customNote}</p>
              </div>
            </td>
          </tr>
          ` : ''}

          <!-- Order Info -->
          <tr>
            <td style="padding: 30px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="50%">
                    <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; font-weight: 600;">Order Number</p>
                    <p style="margin: 4px 0 0 0; font-size: 16px; color: #111827; font-weight: 500;">${orderNumber}</p>
                  </td>
                  <td width="50%" align="right">
                    <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; font-weight: 600;">Date</p>
                    <p style="margin: 4px 0 0 0; font-size: 16px; color: #111827; font-weight: 500;">${orderDate}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items -->
          <tr>
            <td style="padding: 0 40px 20px 40px;">
              <p style="margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #111827;">Order Summary</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                ${itemsHtml}
              </table>
            </td>
          </tr>

          <!-- Totals -->
          <tr>
            <td style="padding: 20px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Subtotal</td>
                  <td align="right" style="padding: 8px 0; font-size: 14px; color: #111827;">${formatMoney(subtotal)}</td>
                </tr>
                ${discountRow}
                ${pointsRow}
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #6b7280;">Shipping (${order.shippingMethod || 'Standard'})</td>
                  <td align="right" style="padding: 8px 0; font-size: 14px; color: #111827;">${shippingTotal === 0 ? 'Free' : formatMoney(shippingTotal)}</td>
                </tr>
                ${feeRow}
                <tr>
                  <td style="padding: 16px 0 0 0; font-size: 16px; font-weight: 700; color: #111827; border-top: 1px solid #e5e7eb;">Total</td>
                  <td align="right" style="padding: 16px 0 0 0; font-size: 18px; font-weight: 800; color: #111827; border-top: 1px solid #e5e7eb;">${formatMoney(total)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping Info -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #f3f4f6;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="50%" valign="top">
                    <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #111827;">Shipping Address</p>
                    <p style="margin: 0; font-size: 14px; color: #4b5563; line-height: 1.5;">
                      ${customerName}<br>
                      ${shipAddr.line1 || ''} ${shipAddr.line2 ? `<br>${shipAddr.line2}` : ''}<br>
                      ${shipAddr.city || ''}, ${shipAddr.state || ''} ${shipAddr.postalCode || ''}<br>
                      ${shipAddr.country || ''}
                    </p>
                  </td>
                  <td width="50%" valign="top">
                    <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #111827;">Billing Address</p>
                    <p style="margin: 0; font-size: 14px; color: #4b5563; line-height: 1.5;">
                      ${customerName}<br>
                      ${billAddr.line1 || ''} ${billAddr.line2 ? `<br>${billAddr.line2}` : ''}<br>
                      ${billAddr.city || ''}, ${billAddr.state || ''} ${billAddr.postalCode || ''}<br>
                      ${billAddr.country || ''}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- View Order Button -->
          <tr>
            <td style="padding: 0 40px 30px 40px; text-align: center; background-color: #f9fafb;">
              <a href="${serverUrl}/account/orders/${order.id}" style="display: inline-block; padding: 12px 24px; background-color: #000000; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 6px;">View Order Status</a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">If you have any questions about this invoice, simply reply to this email or reach out to our support team.</p>
              <p style="margin: 12px 0 0 0; font-size: 12px; color: #d1d5db;">&copy; ${new Date().getFullYear()} Sparta Labs. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
