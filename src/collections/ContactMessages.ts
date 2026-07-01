import { CollectionConfig } from 'payload'

export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  admin: { defaultColumns: ['name', 'email', 'subject', 'createdAt'] },
  access: {
    create: () => true,
    read: ({ req }) => !!req.user?.role && ['admin', 'staff'].includes(req.user.role as string),
    update: () => false,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'subject', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    { name: 'createdAt', type: 'date', defaultValue: () => new Date(), admin: { readOnly: true } },
  ],
}
