export const accessContent: any = {
  create: ({ req }: any) => req.user?.role === 'admin',
  read: ({ req }: any) => {
    if (req.user?.role === 'admin') return true
    return { status: { equals: 'published' } }
  },
  update: ({ req }: any) => req.user?.role === 'admin',
  delete: ({ req }: any) => req.user?.role === 'admin',
}
