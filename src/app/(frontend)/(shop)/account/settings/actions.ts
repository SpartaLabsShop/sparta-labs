'use server'

import { getPayloadUser } from '@/lib/auth/getPayloadUser'
import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name required').max(50),
  lastName: z.string().min(1, 'Last name required').max(50),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional().or(z.literal('')),
})

export async function updateProfile(formData: FormData) {
  try {
    const user = await getPayloadUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const parsed = profileSchema.safeParse({
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      phone: formData.get('phone') || '',
    })
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Invalid input' }
    }

    const { firstName, lastName, phone } = parsed.data

    const payload = await getPayload({ config })

    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        firstName,
        lastName,
        phone,
      } as any,
      overrideAccess: true,
    })

    revalidatePath('/account/settings')
    revalidatePath('/account')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'An unexpected error occurred' }
  }
}
