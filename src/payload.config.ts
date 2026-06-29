import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { s3Storage } from '@payloadcms/storage-s3'
import { resendAdapter } from '@payloadcms/email-resend'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Documents } from './collections/Documents'
import { Addresses } from './collections/Addresses'
import { Categories } from './collections/Categories'
import { Products } from './collections/Products'
import { Carts } from './collections/Carts'
import { Coupons } from './collections/Coupons'
import { BlogPosts } from './collections/BlogPosts'
import { Pages } from './collections/Pages'
import { ContactMessages } from './collections/ContactMessages'
import { EmailLogs } from './collections/EmailLogs'
import { Wishlists } from './collections/Wishlists'
import { Reviews } from './collections/Reviews'
import { Orders } from './collections/Orders'
import { ShippingZones } from './collections/ShippingZones'
import { AffiliateApplications } from './collections/AffiliateApplications'
import { Affiliates } from './collections/Affiliates'
import { AffiliateClicks } from './collections/AffiliateClicks'
import { AffiliateConversions } from './collections/AffiliateConversions'
import { AffiliatePayouts } from './collections/AffiliatePayouts'
import { PayoutRequests } from './collections/PayoutRequests'
import { ProcessingFees } from './collections/ProcessingFees'
import { Trash } from './collections/Trash'
import { AffiliateSettings } from './globals/AffiliateSettings'
import { OrderCounters } from './collections/OrderCounters'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeNavLinks: ['@/components/admin/NavBadges'],
    },
  },
  globals: [
    AffiliateSettings,
  ],
  collections: [
    Trash,
    OrderCounters,
    Users,
    Media,
    Documents,
    Addresses,
    Categories,
    Products,
    Carts,
    Wishlists,
    Coupons,
    Orders,
    Reviews,
    ShippingZones,
    BlogPosts,
    Pages,
    ContactMessages,
    EmailLogs,
    AffiliateApplications,
    Affiliates,
    AffiliateClicks,
    AffiliateConversions,
    AffiliatePayouts,
    PayoutRequests,
    ProcessingFees,
  ].map((collection) => {
    if (collection.slug === 'trash') return collection

    collection.hooks = collection.hooks || {}
    collection.hooks.beforeDelete = collection.hooks.beforeDelete || []
    
    collection.hooks.beforeDelete.push(async (args: any) => {
      const { req, id, doc } = args
      try {
        let fullDoc = doc
        if (!fullDoc) {
          fullDoc = await req.payload.findByID({ collection: collection.slug as any, id, req, depth: 0 })
        }
        
        // Dynamically figure out the title of the deleted item
        const docTitle = fullDoc?.name || fullDoc?.title || fullDoc?.orderNumber || fullDoc?.code || fullDoc?.email || String(id)

        await req.payload.create({
          collection: 'trash',
          req,
          data: {
            title: String(docTitle),
            collectionSlug: collection.slug,
            originalId: String(id),
            documentData: JSON.parse(JSON.stringify(fullDoc || {})),
          },
          overrideAccess: true,
        })
      } catch (err: any) {
        console.error(`Failed to move ${collection.slug} ${id} to trash:`, err)
        require('fs').appendFileSync('trash-error.log', `\n[${new Date().toISOString()}] Error moving ${collection.slug} ${id}: ${err.message || err.toString()}`)
      }
    })

    return collection
  }),
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL || '',
      max: process.env.NODE_ENV === 'production' ? 10 : 10,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }),
  sharp: sharp as any,
  plugins: [
    ...(process.env.R2_BUCKET ? [
      s3Storage({
        collections: {
          media: {
            disableLocalStorage: true,
            disablePayloadAccessControl: true,
            prefix: 'media',
            generateFileURL: ({ filename, prefix }) => {
              const publicUrl = process.env.R2_PUBLIC_URL || ''
              const base = publicUrl.replace(/\/$/, '')
              return prefix ? `${base}/${prefix}/${filename}` : `${base}/${filename}`
            },
          },
          documents: {
            disableLocalStorage: true,
            disablePayloadAccessControl: true,
            prefix: 'documents',
            generateFileURL: ({ filename, prefix }) => {
              const publicUrl = process.env.R2_PUBLIC_URL || ''
              const base = publicUrl.replace(/\/$/, '')
              return prefix ? `${base}/${prefix}/${filename}` : `${base}/${filename}`
            },
          },
        },
        bucket: process.env.R2_BUCKET,
        config: {
          endpoint: process.env.R2_ENDPOINT || '',
          credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
          },
          region: 'auto',
          forcePathStyle: true,
        },
      })
    ] : []),
  ],
  email: resendAdapter({
    defaultFromAddress: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
    defaultFromName: 'Sparta Labs',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
})
