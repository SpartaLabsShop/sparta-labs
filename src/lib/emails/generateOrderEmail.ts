export async function generateOrderInvoiceHtml(order: any, payload?: any, customNote?: string): Promise<string> {
  const orderNumber = order.orderNumber || order.id
  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://spartalabs.shop'

  const fmt = (n: number) => `$${Number(n).toFixed(2)}`

  const subtotal     = order.subtotal     || 0
  const discountTotal= order.discountTotal|| 0
  const redeemedPts  = order.redeemedPoints|| 0
  const shippingTotal= order.shippingTotal || 0
  const taxTotal     = order.taxTotal      || 0
  const feeTotal     = (order.feeTotal     || 0) / 100
  const total        = order.total         || 0

  const paymentMethod  = order.paymentMethod  || 'Zelle'
  const shippingMethod = order.shippingMethod || 'Standard Shipping'
  const customerName   = `${order.customerFirstName || ''} ${order.customerLastName || ''}`.trim() || 'Customer'
  const shipAddr       = order.shippingAddress || {}

  // ── Build product rows ────────────────────────────────────────────────────
  let itemsHtml = ''
  if (order.items && Array.isArray(order.items)) {
    const rows = await Promise.all(
      order.items.map(async (item: any) => {
        const product = item.productSnapshot || {}
        const name    = product.name || 'Product'
        const variant = item.variant && item.variant !== 'DEFAULT' ? item.variant : ''

        let imageUrl = ''
        const imgRef = product.images?.[0]?.image
        if (imgRef && typeof imgRef === 'object' && imgRef.url) {
          imageUrl = imgRef.url.startsWith('http') ? imgRef.url : `${serverUrl}${imgRef.url}`
        } else if (imgRef && payload) {
          try {
            const media = await payload.findByID({ collection: 'media', id: imgRef, depth: 0 })
            if (media?.url) imageUrl = media.url.startsWith('http') ? media.url : `${serverUrl}${media.url}`
          } catch {}
        }

        const imgTag = imageUrl
          ? `<img src="${encodeURI(imageUrl)}" alt="${name}" width="48" height="56" style="object-fit:cover;border-radius:6px;display:block;" />`
          : `<div style="width:48px;height:56px;background:#F3F4F6;border-radius:6px;"></div>`

        return `
          <tr>
            <td style="padding:14px 0;border-bottom:1px solid #F3F4F6;vertical-align:middle;">
              <table cellpadding="0" cellspacing="0" border="0"><tr>
                <td style="padding-right:14px;vertical-align:middle;">${imgTag}</td>
                <td style="vertical-align:middle;">
                  <p style="margin:0;font-size:13px;font-weight:700;color:#111827;">${name}</p>
                  ${variant ? `<p style="margin:3px 0 0;font-size:11px;color:#9CA3AF;">${variant}</p>` : ''}
                </td>
              </tr></table>
            </td>
            <td align="center" style="padding:14px 0;border-bottom:1px solid #F3F4F6;font-size:13px;color:#4B5563;vertical-align:middle;">${item.quantity}</td>
            <td align="right"  style="padding:14px 0;border-bottom:1px solid #F3F4F6;font-size:13px;font-weight:700;color:#111827;vertical-align:middle;">${fmt(item.price)}</td>
          </tr>`
      })
    )
    itemsHtml = rows.join('')
  }

  // ── Totals rows ───────────────────────────────────────────────────────────
  const discountRow = discountTotal > 0 ? `
    <tr>
      <td style="font-size:12px;color:#6B7280;padding:3px 0;">Discount${order.couponCode ? ` (${order.couponCode})` : ''}</td>
      <td align="right" style="font-size:12px;color:#16A34A;font-weight:600;padding:3px 0;">-${fmt(discountTotal)}</td>
    </tr>` : ''

  const pointsRow = redeemedPts > 0 ? `
    <tr>
      <td style="font-size:12px;color:#6B7280;padding:3px 0;">Sparta Points</td>
      <td align="right" style="font-size:12px;color:#16A34A;font-weight:600;padding:3px 0;">-${fmt(redeemedPts)}</td>
    </tr>` : ''

  const feeRow = feeTotal > 0 ? `
    <tr>
      <td style="font-size:12px;color:#6B7280;padding:3px 0;">Fees</td>
      <td align="right" style="font-size:12px;color:#111827;font-weight:500;padding:3px 0;">${fmt(feeTotal)}</td>
    </tr>` : ''

  // ── Zelle instructions banner ─────────────────────────────────────────────
  const zelleBanner = (paymentMethod === 'Zelle' || customNote?.toLowerCase().includes('zelle')) ? `
    <tr>
      <td style="padding:0 32px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F5F3FF;border-radius:10px;border:1px solid #DDD6FE;">
          <tr>
            <td style="padding:20px 24px;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:800;color:#7C3AED;text-transform:uppercase;letter-spacing:.6px;">Action Required — Zelle Payment</p>
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td valign="top">
                    <p style="margin:0;font-size:13px;color:#4C1D95;line-height:1.6;">
                      Send <strong>${fmt(total)}</strong> via Zelle to <strong>${process.env.ZELLE_PAYMENT_EMAIL || 'kyle@spartalabs.shop'}</strong><br/>
                      Include <strong>#${orderNumber}</strong> in the memo. Your order ships once payment is confirmed.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:12px;">
                    <img src="https://res.cloudinary.com/denskvdyt/image/upload/v1782950051/zelle-qr_lsp1z4.jpg" alt="Zelle QR Code" width="120" height="120" style="display:block;background:#fff;padding:6px;border-radius:6px;border:1px solid #DDD6FE;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>` : ''

  // ── Custom note (admin messages) ──────────────────────────────────────────
  const customNoteBanner = customNote && !customNote.toLowerCase().includes('zelle') ? `
    <tr>
      <td style="padding:0 32px 24px;">
        <div style="background:#FFFBEB;border-left:4px solid #F59E0B;border-radius:0 8px 8px 0;padding:16px 20px;">
          <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#92400E;text-transform:uppercase;letter-spacing:.5px;">Note regarding your order</p>
          <p style="margin:0;font-size:13px;color:#78350F;line-height:1.6;white-space:pre-wrap;">${customNote}</p>
        </div>
      </td>
    </tr>` : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>Order Confirmation #${orderNumber}</title>
</head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F3F4F6;padding:32px 16px;">
  <tr><td align="center">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.09);">

    <!-- ═══════════ HEADER ═══════════ -->
    <tr>
      <td style="background:#0A0A0A;border-bottom:3px solid #E61C24;padding:28px 32px;">
        <table cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="padding-right:16px;vertical-align:middle;">
            <img src="${serverUrl}/sparta-labs-favicon.svg" alt="Sparta Labs" width="48" height="48" style="display:block;border-radius:8px;" />
          </td>
          <td style="vertical-align:middle;">
            <p style="margin:0;font-size:20px;font-weight:800;color:#fff;letter-spacing:2px;line-height:1.1;">SPARTA LABS</p>
            <p style="margin:2px 0 0;font-size:9px;font-weight:600;color:#9CA3AF;letter-spacing:3px;text-transform:uppercase;">Research Peptides</p>
          </td>
        </tr></table>
      </td>
    </tr>

    <!-- ═══════════ CONFIRMATION HERO ═══════════ -->
    <tr>
      <td style="padding:36px 32px 28px;text-align:center;">
        <!-- Checkmark circle -->
        <div style="display:inline-block;width:60px;height:60px;background:#FFF1F1;border-radius:50%;text-align:center;line-height:60px;margin-bottom:20px;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E61C24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <p style="margin:0 0 8px;font-size:11px;font-weight:800;color:#E61C24;text-transform:uppercase;letter-spacing:1.5px;">Order Confirmation</p>
        <h1 style="margin:0 0 12px;font-size:26px;font-weight:800;color:#111827;line-height:1.2;">Thank you for your order!</h1>
        <p style="margin:0;font-size:13px;color:#6B7280;line-height:1.7;">
          Hi ${customerName}, your order has been received and is now being processed.<br/>
          You will receive another email when your order ships.
        </p>
      </td>
    </tr>

    <!-- ═══════════ ORDER DETAILS GRID ═══════════ -->
    <tr>
      <td style="padding:0 32px 28px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #F3F4F6;border-radius:10px;overflow:hidden;">
          <tr>
            <!-- Order Number -->
            <td width="25%" align="center" style="padding:16px 8px;border-right:1px solid #F3F4F6;vertical-align:top;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E61C24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;margin:0 auto 8px;">
                <rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><polyline points="9 14 11 16 15 11"/>
              </svg>
              <p style="margin:0 0 4px;font-size:9px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.5px;">Order Number</p>
              <p style="margin:0;font-size:11px;font-weight:700;color:#111827;">#${orderNumber}</p>
            </td>
            <!-- Order Date -->
            <td width="25%" align="center" style="padding:16px 8px;border-right:1px solid #F3F4F6;vertical-align:top;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E61C24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;margin:0 auto 8px;">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <p style="margin:0 0 4px;font-size:9px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.5px;">Order Date</p>
              <p style="margin:0;font-size:11px;font-weight:700;color:#111827;">${orderDate}</p>
            </td>
            <!-- Payment Method -->
            <td width="25%" align="center" style="padding:16px 8px;border-right:1px solid #F3F4F6;vertical-align:top;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E61C24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;margin:0 auto 8px;">
                <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              <p style="margin:0 0 4px;font-size:9px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.5px;">Payment</p>
              <p style="margin:0;font-size:11px;font-weight:700;color:#111827;">${paymentMethod}</p>
            </td>
            <!-- Shipping Method -->
            <td width="25%" align="center" style="padding:16px 8px;vertical-align:top;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E61C24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display:block;margin:0 auto 8px;">
                <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
              <p style="margin:0 0 4px;font-size:9px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.5px;">Shipping</p>
              <p style="margin:0;font-size:11px;font-weight:700;color:#111827;">${shippingMethod}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ═══════════ ZELLE BANNER ═══════════ -->
    ${zelleBanner}
    ${customNoteBanner}

    <!-- ═══════════ ORDER SUMMARY ═══════════ -->
    <tr>
      <td style="padding:0 32px 28px;">
        <!-- Section header -->
        <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;"><tr>
          <td style="padding-right:10px;vertical-align:middle;">
            <div style="background:#FFF1F1;border-radius:6px;padding:6px;display:inline-block;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E61C24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
          </td>
          <td style="vertical-align:middle;">
            <p style="margin:0;font-size:13px;font-weight:800;color:#111827;text-transform:uppercase;letter-spacing:.5px;">Order Summary</p>
          </td>
        </tr></table>

        <!-- Products table -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAFAFA;border-radius:10px;border:1px solid #F3F4F6;padding:0 16px;">
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid #E5E7EB;">
              <p style="margin:0;font-size:10px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.5px;">Product</p>
            </td>
            <td align="center" style="padding:12px 0;border-bottom:1px solid #E5E7EB;">
              <p style="margin:0;font-size:10px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.5px;">Qty</p>
            </td>
            <td align="right" style="padding:12px 0;border-bottom:1px solid #E5E7EB;">
              <p style="margin:0;font-size:10px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.5px;">Price</p>
            </td>
          </tr>
          ${itemsHtml}

          <!-- Totals -->
          <tr>
            <td colspan="3" style="padding:16px 0 4px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-size:12px;color:#6B7280;padding:3px 0;">Subtotal</td>
                  <td align="right" style="font-size:12px;color:#111827;font-weight:500;padding:3px 0;">${fmt(subtotal)}</td>
                </tr>
                ${discountRow}
                ${pointsRow}
                <tr>
                  <td style="font-size:12px;color:#6B7280;padding:3px 0;">Shipping</td>
                  <td align="right" style="font-size:12px;color:#111827;font-weight:500;padding:3px 0;">${shippingTotal === 0 ? 'Free' : fmt(shippingTotal)}</td>
                </tr>
                ${feeRow}
                ${taxTotal > 0 ? `<tr>
                  <td style="font-size:12px;color:#6B7280;padding:3px 0;">Tax</td>
                  <td align="right" style="font-size:12px;color:#111827;font-weight:500;padding:3px 0;">${fmt(taxTotal)}</td>
                </tr>` : ''}
                <tr>
                  <td colspan="2" style="padding-top:12px;border-top:1px solid #E5E7EB;"></td>
                </tr>
                <tr>
                  <td style="font-size:15px;font-weight:800;color:#E61C24;text-transform:uppercase;padding-top:4px;">Total</td>
                  <td align="right" style="font-size:17px;font-weight:800;color:#E61C24;padding-top:4px;">${fmt(total)}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ═══════════ SHIPPING ADDRESS ═══════════ -->
    ${shipAddr.line1 ? `
    <tr>
      <td style="padding:0 32px 28px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F9FAFB;border-radius:10px;border:1px solid #F3F4F6;padding:16px 20px;">
          <tr><td>
            <p style="margin:0 0 8px;font-size:10px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.5px;">Shipping Address</p>
            <p style="margin:0;font-size:13px;color:#374151;line-height:1.6;">
              ${customerName}<br/>
              ${shipAddr.line1}${shipAddr.line2 ? ', ' + shipAddr.line2 : ''}<br/>
              ${shipAddr.city || ''}, ${shipAddr.state || ''} ${shipAddr.postalCode || ''}
            </p>
          </td></tr>
        </table>
      </td>
    </tr>` : ''}

    <!-- ═══════════ IMPORTANT INFO ═══════════ -->
    <tr>
      <td style="padding:0 32px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFF5F5;border-radius:10px;padding:16px 20px;">
          <tr>
            <td width="32" valign="top" style="padding-right:12px;padding-top:1px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E61C24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
              </svg>
            </td>
            <td valign="top">
              <p style="margin:0 0 3px;font-size:11px;font-weight:700;color:#111827;">Important Information</p>
              <p style="margin:0;font-size:11px;color:#6B7280;line-height:1.6;">For research purposes only. Not for human consumption.<br/>Please review our Terms &amp; Conditions for more information.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ═══════════ CTA BUTTON ═══════════ -->
    <tr>
      <td align="center" style="padding:0 32px 36px;">
        <a href="${serverUrl}/account" style="display:inline-block;background:#111827;color:#fff;padding:14px 36px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;text-decoration:none;border-radius:8px;">
          View Your Order
        </a>
      </td>
    </tr>

    <!-- ═══════════ FOOTER ═══════════ -->
    <tr>
      <td style="background:#111827;border-top:3px solid #E61C24;padding:32px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <!-- Left: Brand -->
            <td width="55%" valign="top" style="padding-right:20px;">
              <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;"><tr>
                <td style="padding-right:10px;vertical-align:middle;">
                  <img src="${serverUrl}/sparta-labs-favicon.svg" alt="Sparta Labs" width="28" height="28" style="display:block;border-radius:4px;" />
                </td>
                <td style="vertical-align:middle;">
                  <p style="margin:0;font-size:14px;font-weight:800;color:#fff;letter-spacing:1.5px;">SPARTA LABS</p>
                </td>
              </tr></table>
              <p style="margin:0 0 16px;font-size:11px;color:#9CA3AF;line-height:1.7;">Premium research peptides for<br/>scientific advancement and innovation.</p>
              <!-- Social icons -->
              <table cellpadding="0" cellspacing="0" border="0"><tr>
                <td style="padding-right:12px;">
                  <a href="${serverUrl}" style="text-decoration:none;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                  </a>
                </td>
                <td style="padding-right:12px;">
                  <a href="#" style="text-decoration:none;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  </a>
                </td>
                <td>
                  <a href="mailto:${process.env.SUPPORT_EMAIL || 'support@spartalabs.shop'}" style="text-decoration:none;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </a>
                </td>
              </tr></table>
            </td>
            <!-- Right: Support -->
            <td width="45%" valign="top" style="padding-left:20px;border-left:1px solid #1F2937;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E61C24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:8px;display:block;">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
              </svg>
              <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#fff;">Need help?</p>
              <p style="margin:0 0 12px;font-size:11px;color:#9CA3AF;line-height:1.6;">Our team is here to assist you with any questions or concerns.</p>
              <a href="mailto:${process.env.SUPPORT_EMAIL || 'support@spartalabs.shop'}" style="font-size:11px;font-weight:700;color:#E61C24;text-decoration:none;">${process.env.SUPPORT_EMAIL || 'support@spartalabs.shop'}</a>
            </td>
          </tr>
          <tr>
            <td colspan="2" align="center" style="padding-top:28px;border-top:1px solid #1F2937;margin-top:24px;">
              <p style="margin:0;font-size:10px;color:#6B7280;">&copy; ${new Date().getFullYear()} Sparta Labs. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</body>
</html>`
}
