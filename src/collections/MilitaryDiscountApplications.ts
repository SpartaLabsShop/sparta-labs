import type { CollectionConfig } from 'payload'
import { afterMilitaryApplicationChange } from '@/hooks/militaryDiscountApplications'

export const MilitaryDiscountApplications: CollectionConfig = {
  slug: 'military-discount-applications',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['firstName', 'lastName', 'email', 'branch', 'serviceStatus', 'status', 'createdAt'],
    group: 'Discounts',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      return ['admin', 'staff'].includes(user.role as string)
    },
    create: () => true,
    update: ({ req: { user } }) => !!user && ['admin', 'staff'].includes(user.role as string),
    delete: ({ req: { user } }) => !!user && ['admin', 'staff'].includes(user.role as string),
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'branch',
      type: 'select',
      required: true,
      options: [
        { label: 'Army', value: 'army' },
        { label: 'Navy', value: 'navy' },
        { label: 'Air Force', value: 'air_force' },
        { label: 'Marine Corps', value: 'marines' },
        { label: 'Coast Guard', value: 'coast_guard' },
        { label: 'Space Force', value: 'space_force' },
        { label: 'National Guard', value: 'national_guard' },
      ],
    },
    {
      name: 'serviceStatus',
      type: 'select',
      required: true,
      options: [
        { label: 'Active Duty', value: 'active_duty' },
        { label: 'Veteran', value: 'veteran' },
        { label: 'Retired', value: 'retired' },
        { label: 'Reservist', value: 'reservist' },
        { label: 'National Guard', value: 'national_guard' },
      ],
    },
    {
      name: 'idProof',
      type: 'relationship',
      relationTo: 'documents',
      required: true,
      admin: {
        description: 'Uploaded military ID or proof of service document.',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending Review', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'discountPercent',
      type: 'number',
      defaultValue: 15,
      admin: {
        position: 'sidebar',
        description: 'Discount % to apply when approving. Default 15.',
      },
    },
    {
      name: 'couponCode',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Auto-generated on approval.',
      },
    },
    {
      name: 'coupon',
      type: 'relationship',
      relationTo: 'coupons',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'reviewNotes',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        description: 'Internal notes (not sent to applicant).',
      },
    },
  ],
  hooks: {
    afterChange: [afterMilitaryApplicationChange],
  },
}
