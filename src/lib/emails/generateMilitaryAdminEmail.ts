export function generateMilitaryAdminEmail(application: {
  firstName: string
  lastName: string
  email: string
  branch: string
  serviceStatus: string
  documentUrl?: string
  documentTitle?: string
  adminUrl: string
}): string {
  const branchLabels: Record<string, string> = {
    army: 'Army', navy: 'Navy', air_force: 'Air Force', marines: 'Marine Corps',
    coast_guard: 'Coast Guard', space_force: 'Space Force', national_guard: 'National Guard',
  }
  const statusLabels: Record<string, string> = {
    active_duty: 'Active Duty', veteran: 'Veteran', retired: 'Retired',
    reservist: 'Reservist', national_guard: 'National Guard',
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111; background: #f9fafb; margin: 0; padding: 40px 20px; }
    .card { background: #fff; border-radius: 8px; padding: 32px; max-width: 560px; margin: 0 auto; border: 1px solid #e5e7eb; }
    h2 { margin: 0 0 4px 0; font-size: 20px; }
    .badge { display: inline-block; background: #fef3c7; color: #92400e; font-size: 12px; font-weight: 600; padding: 2px 10px; border-radius: 999px; margin-bottom: 24px; }
    .field { margin-bottom: 12px; }
    .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7280; margin-bottom: 2px; }
    .value { font-size: 15px; color: #111; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
    .btn { display: inline-block; background: #000; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 600; margin-top: 8px; }
    .doc-link { display: inline-block; background: #f3f4f6; color: #111; text-decoration: none; padding: 10px 18px; border-radius: 6px; font-size: 13px; font-weight: 500; margin-top: 8px; border: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="card">
    <h2>New Military Discount Application</h2>
    <div class="badge">Pending Review</div>

    <div class="field"><div class="label">Name</div><div class="value">${application.firstName} ${application.lastName}</div></div>
    <div class="field"><div class="label">Email</div><div class="value">${application.email}</div></div>
    <div class="field"><div class="label">Branch</div><div class="value">${branchLabels[application.branch] || application.branch}</div></div>
    <div class="field"><div class="label">Service Status</div><div class="value">${statusLabels[application.serviceStatus] || application.serviceStatus}</div></div>

    <hr />

    <div class="field">
      <div class="label">ID Proof Document</div>
      ${application.documentUrl
        ? `<a href="${application.documentUrl}" class="doc-link" target="_blank">📄 View / Download ${application.documentTitle || 'Document'}</a>`
        : '<div class="value" style="color:#6b7280;">No document attached</div>'
      }
    </div>

    <hr />

    <a href="${application.adminUrl}" class="btn">Review in Admin Panel →</a>

    <p style="margin-top:24px;font-size:12px;color:#9ca3af;">
      Approve or reject this application in the Payload admin panel. The applicant will receive their coupon code automatically upon approval.
    </p>
  </div>
</body>
</html>
  `
}
