

export const couponsAccess: any = {
  // Internal code (verifyCoupon, finalizeOrder) always uses overrideAccess — public REST read
  // would expose lockedEmails (PII) and unreleased codes, so restrict to admin/staff only.
  read: ({ req }: any) => !!req?.user && ['admin', 'staff'].includes(req.user.role),
  create: ({ req }: any) => req?.user?.role === 'admin',
  update: ({ req }: any) => req?.user?.role === 'admin',
  delete: ({ req }: any) => req?.user?.role === 'admin',
}
