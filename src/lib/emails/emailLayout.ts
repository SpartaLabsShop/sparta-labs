// Shared building blocks for all Sparta Labs branded emails.

function logoImg(size: number): string {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://spartalabs.shop'
  return `<img src="${serverUrl}/sparta-labs-favicon.svg" alt="Sparta Labs Helmet" width="${size}" height="${size}" style="display:block;border-radius:${Math.round(size * 0.15)}px;" />`
}

function headerRow(): string {
  return `
  <tr>
    <td style="background:#0A0A0A;border-bottom:3px solid #E61C24;padding:24px 32px;">
      <table cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="padding-right:16px;vertical-align:middle;">${logoImg(48)}</td>
        <td style="vertical-align:middle;">
          <p style="margin:0;font-size:20px;font-weight:800;color:#fff;letter-spacing:2px;line-height:1.1;">SPARTA LABS</p>
          <p style="margin:3px 0 0;font-size:9px;font-weight:600;color:#9CA3AF;letter-spacing:3px;text-transform:uppercase;">Research Peptides</p>
        </td>
      </tr></table>
    </td>
  </tr>`
}

function customerFooterRow(serverUrl: string, supportEmail: string): string {
  return `
  <tr>
    <td style="background:#111827;border-top:3px solid #E61C24;padding:32px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="55%" valign="top" style="padding-right:20px;">
            <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;"><tr>
              <td style="padding-right:10px;vertical-align:middle;">${logoImg(28)}</td>
              <td style="vertical-align:middle;">
                <p style="margin:0;font-size:14px;font-weight:800;color:#fff;letter-spacing:1.5px;">SPARTA LABS</p>
              </td>
            </tr></table>
            <p style="margin:0 0 16px;font-size:11px;color:#9CA3AF;line-height:1.7;">Premium research peptides for<br/>scientific advancement and innovation.</p>
            <table cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="padding-right:12px;">
                <a href="${serverUrl}" style="text-decoration:none;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </a>
              </td>
              <td style="padding-right:12px;">
                <a href="#" style="text-decoration:none;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
              </td>
              <td>
                <a href="mailto:${supportEmail}" style="text-decoration:none;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </a>
              </td>
            </tr></table>
          </td>
          <td width="45%" valign="top" style="padding-left:20px;border-left:1px solid #1F2937;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E61C24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:8px;display:block;"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
            <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#fff;">Need help?</p>
            <p style="margin:0 0 12px;font-size:11px;color:#9CA3AF;line-height:1.6;">Our team is here to assist you with any questions.</p>
            <a href="mailto:${supportEmail}" style="font-size:11px;font-weight:700;color:#E61C24;text-decoration:none;">${supportEmail}</a>
          </td>
        </tr>
        <tr>
          <td colspan="2" align="center" style="padding-top:28px;border-top:1px solid #1F2937;">
            <p style="margin:0;font-size:10px;color:#6B7280;">&copy; ${new Date().getFullYear()} Sparta Labs. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>`
}

function adminFooterRow(adminUrl: string): string {
  return `
  <tr>
    <td style="background:#111827;padding:24px 32px;text-align:center;">
      <p style="margin:0 0 4px;font-size:11px;color:#9CA3AF;">This is an internal admin notification from Sparta Labs.</p>
      <p style="margin:0;font-size:10px;color:#6B7280;">&copy; ${new Date().getFullYear()} Sparta Labs</p>
    </td>
  </tr>`
}

function adminBannerRow(label: string): string {
  return `
  <tr>
    <td style="background:#FEF3C7;border-bottom:1px solid #FDE68A;padding:10px 32px;text-align:center;">
      <p style="margin:0;font-size:10px;font-weight:800;color:#92400E;letter-spacing:1.2px;text-transform:uppercase;">Admin Notification — ${label}</p>
    </td>
  </tr>`
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Wrap body rows in a full branded customer email (dark header + full footer).
 */
export function customerEmail(bodyRows: string, title = 'Sparta Labs'): string {
  const url = process.env.NEXT_PUBLIC_SERVER_URL || 'https://spartalabs.shop'
  const support = process.env.SUPPORT_EMAIL || 'support@spartalabs.shop'
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F3F4F6;padding:32px 16px;">
  <tr><td align="center">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.09);">
    ${headerRow()}
    ${bodyRows}
    ${customerFooterRow(url, support)}
  </table>
  </td></tr>
</table>
</body>
</html>`
}

/**
 * Wrap body rows in a branded admin notification email (header + amber banner + simple footer).
 */
export function adminEmail(bodyRows: string, label: string): string {
  const url = process.env.NEXT_PUBLIC_SERVER_URL || 'https://spartalabs.shop'
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Admin — ${label}</title>
</head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F3F4F6;padding:32px 16px;">
  <tr><td align="center">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.09);">
    ${headerRow()}
    ${adminBannerRow(label)}
    ${bodyRows}
    ${adminFooterRow(url)}
  </table>
  </td></tr>
</table>
</body>
</html>`
}

// ── Reusable snippet helpers ─────────────────────────────────────────────────

export function iconCircle(svgPath: string, color = '#E61C24', bg = '#FFF1F1'): string {
  return `<div style="display:inline-block;width:60px;height:60px;background:${bg};border-radius:50%;text-align:center;line-height:60px;margin-bottom:20px;">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;">${svgPath}</svg>
  </div>`
}

export function ctaButton(href: string, label: string, bg = '#111827'): string {
  return `<a href="${href}" style="display:inline-block;background:${bg};color:#fff;padding:14px 36px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;text-decoration:none;border-radius:8px;">${label}</a>`
}

export function infoTable(rows: [string, string][]): string {
  const cells = rows.map(([label, value]) => `
    <tr>
      <td style="padding:10px 16px;font-size:11px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.4px;border-bottom:1px solid #F3F4F6;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="padding:10px 16px;font-size:13px;color:#111827;border-bottom:1px solid #F3F4F6;vertical-align:top;">${value}</td>
    </tr>`).join('')
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAFAFA;border-radius:10px;border:1px solid #F3F4F6;">${cells}</table>`
}

export function codeBox(code: string, label?: string): string {
  return `<div style="background:#F9FAFB;border:2px dashed #E5E7EB;border-radius:10px;padding:20px;text-align:center;">
    ${label ? `<p style="margin:0 0 8px;font-size:10px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.5px;">${label}</p>` : ''}
    <p style="margin:0;font-size:26px;font-weight:800;letter-spacing:4px;color:#111827;font-family:monospace;">${code}</p>
  </div>`
}

export function sectionTitle(title: string, subtitle?: string): string {
  return `<p style="margin:0 0 ${subtitle ? '8px' : '20px'};font-size:11px;font-weight:800;color:#E61C24;text-transform:uppercase;letter-spacing:1.5px;">${title}</p>
  ${subtitle ? `<p style="margin:0 0 20px;font-size:22px;font-weight:800;color:#111827;line-height:1.25;">${subtitle}</p>` : ''}`
}
