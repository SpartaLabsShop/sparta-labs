import type { CollectionConfig } from 'payload'
import { beforeChangeEmailLowercase, afterCreateUserTodo } from '@/hooks/users'
import { accessUsers } from '@/access/users'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    tokenExpiration: 7200,
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  access: accessUsers,
  fields: [
    // default fields added by Payload: email, password
    {
      name: 'firstName',
      type: 'text',
      required: false,
    },
    {
      name: 'lastName',
      type: 'text',
      required: false,
    },
    {
      name: 'phone',
      type: 'text',
      validate: (val: string | null | undefined) => {
        if (!val) return true
        const regex = /^\+?[1-9]\d{1,14}$/
        return regex.test(val) || 'Phone must be in E.164 format'
      },
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'customer',
      options: [
        { label: 'Customer', value: 'customer' },
        { label: 'Admin', value: 'admin' },
        { label: 'Staff', value: 'staff' },
      ],
    },

    {
      name: 'emailVerified',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'acceptsMarketing',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'preferredLocale',
      type: 'select',
      defaultValue: 'en',
      options: [
        { label: 'English', value: 'en' },
        { label: 'Español', value: 'es' },
      ],
    },
    {
      name: 'dateOfBirth',
      type: 'date',
    },
    {
      name: 'stripeCustomerId',
      type: 'text',
      admin: {
        readOnly: true,
        condition: ({ user }) => !!user?.role && ['admin', 'staff'].includes(user.role),
      },
    },
    {
      name: 'defaultShippingAddress',
      type: 'relationship',
      relationTo: 'addresses',
      hasMany: false,
      // TODO: implement lazy loading / null handling once Addresses collection is ready
    },
    {
      name: 'defaultBillingAddress',
      type: 'relationship',
      relationTo: 'addresses',
      hasMany: false,
      // TODO: implement lazy loading / null handling once Addresses collection is ready
    },
    {
      name: 'lastLoginAt',
      type: 'date',
      admin: {
        readOnly: true,
        condition: ({ user }) => !!user?.role && ['admin', 'staff'].includes(user.role),
      },
    },
    {
      name: 'googleId',
      type: 'text',
      unique: true,
      admin: {
        readOnly: true,
        condition: ({ user }) => !!user?.role && ['admin', 'staff'].includes(user.role),
      },
    },
    {
      name: 'authProvider',
      type: 'select',
      defaultValue: 'email',
      options: [
        { label: 'Email', value: 'email' },
        { label: 'Google', value: 'google' },
      ],
      admin: {
        readOnly: true,
        condition: ({ user }) => !!user?.role && ['admin', 'staff'].includes(user.role),
      },
    },
    {
      name: 'metadata',
      type: 'json',
    },
    {
      name: 'maxxPoints',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Maxx Points ($1 per point). Can be used by users at checkout.',
      },
    },
  ],
  hooks: {
    beforeChange: [beforeChangeEmailLowercase],
    afterChange: [afterCreateUserTodo],
  },
}
