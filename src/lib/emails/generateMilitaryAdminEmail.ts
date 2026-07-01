import { escapeHtml } from '@/lib/utils'
import { adminEmail, infoTable, ctaButton } from './emailLayout'

const BRANCH_LABELS: Record<string, string> = {
  army: 'Army', navy: 'Navy', air_force: 'Air Force', marines: 'Marine Corps',
  coast_guard: 'Coast Guard', space_force: 'Space Force', national_guard: 'National Guard',
}
const STATUS_LABELS: Record<string, string> = {
  active_duty: 'Active Duty', veteran: 'Veteran', retired: 'Retired',
  reservist: 'Reservist', national_guard: 'National Guard',
}

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
  const docCell = application.documentUrl
    ? `<a href="${application.documentUrl}" style="color:#E61C24;font-weight:600;">${escapeHtml(application.documentTitle || 'View Document')}</a>`
    : '<span style="color:#9CA3AF;">No document attached</span>'

  const body = `
  <tr><td style="padding:32px 32px 24px;">
    <p style="margin:0 0 6px;font-size:20px;font-weight:800;color:#111827;">New Military Discount Application</p>
    <p style="margin:0;font-size:13px;color:#6B7280;line-height:1.6;">
      A new military discount application requires your review.
    </p>
  </td></tr>

  <tr><td style="padding:0 32px 24px;">
    <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.4px;">Applicant Details</p>
    ${infoTable([
      ['Full Name', `${escapeHtml(application.firstName)} ${escapeHtml(application.lastName)}`],
      ['Email', escapeHtml(application.email)],
      ['Branch', escapeHtml(BRANCH_LABELS[application.branch] || application.branch)],
      ['Service Status', escapeHtml(STATUS_LABELS[application.serviceStatus] || application.serviceStatus)],
      ['ID Proof', docCell],
    ])}
  </td></tr>

  <tr><td style="padding:0 32px 28px;">
    <div style="background:#FEF3C7;border-radius:10px;padding:16px 20px;border:1px solid #FDE68A;">
      <p style="margin:0;font-size:12px;font-weight:600;color:#92400E;line-height:1.6;">
        Approve or reject this application in the admin panel. The applicant will receive their coupon code automatically upon approval.
      </p>
    </div>
  </td></tr>

  <tr><td align="center" style="padding:0 32px 36px;">
    ${ctaButton(application.adminUrl, 'Review Application in Admin')}
  </td></tr>`

  return adminEmail(body, 'Military Discount Application')
}
