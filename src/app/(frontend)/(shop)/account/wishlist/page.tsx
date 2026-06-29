import React from 'react'
import { WishlistClient, WishlistItem } from './WishlistClient'
import { getPayloadUser } from '@/lib/auth/getPayloadUser'
import { getPayload } from 'payload'
import config from '@payload-config'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'My Wishlist | Sparta Labs',
}

export default async function WishlistPage() {
  const user = await getPayloadUser()
  if (!user) redirect('/login')

  const payload = await getPayload({ config })

  const { docs: wishlists } = await payload.find({
    collection: 'wishlists',
    where: { user: { equals: user.id } },
    limit: 1,
    depth: 2, // Populate product relationship
    overrideAccess: true,
  })

  const wishlistItems: WishlistItem[] = []

  if (wishlists.length > 0 && wishlists[0].items) {
    for (const item of wishlists[0].items) {
      if (typeof item.product === 'object' && item.product !== null) {
        const product = item.product as any
        
        // Extract image URL safely
        let imageUrl = '/placeholder-product.png'
        if (product.images && product.images.length > 0 && typeof product.images[0].image === 'object') {
          imageUrl = product.images[0].image.url
        } else if (product.featuredImage && typeof product.featuredImage === 'object') {
          imageUrl = product.featuredImage.url
        }

        wishlistItems.push({
          id: String(product.id),
          name: product.title || product.name || 'Unknown Product',
          slug: product.slug,
          image: imageUrl,
          descriptor: product.categories?.[0]?.title || 'PEPTIDE',
          price: `$${(item.priceSnapshot || 0).toFixed(2)}`,
        })
      }
    }
  }

  return <WishlistClient items={wishlistItems} />
}
