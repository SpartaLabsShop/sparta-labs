import type { CollectionConfig } from 'payload'
import { beforeChangeEmailLowercase, afterCreateUserTodo } from '@/hooks/users'
import { accessUsers } from '@/access/users'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    tokenExpiration: 2592000,
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
    forgotPassword: {
      generateEmailHTML: (args) => {
        const token = args?.token || ''
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
        return `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="font-size: 20px; font-weight: 700; color: #111; margin: 0;">SPARTA LABS</h1>
            </div>
            <h2 style="font-size: 24px; font-weight: 700; color: #111; margin-bottom: 16px;">Reset your password</h2>
            <p style="font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 24px;">
              We received a request to reset your password. Click the button below to choose a new one. This link will expire in 1 hour.
            </p>
            <a href="${serverUrl}/reset-password?token=${token}" style="display: inline-block; background: #111; color: #fff; padding: 14px 32px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; text-decoration: none;">
              Reset Password
            </a>
            <p style="font-size: 12px; color: #999; margin-top: 32px; line-height: 1.6;">
              If you didn't request this, you can safely ignore this email. Your password will not change.
            </p>
          </div>
        `
      },
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
      name: 'avatarUrl',
      type: 'text',
      admin: { readOnly: true },
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
