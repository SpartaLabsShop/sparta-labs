import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { ClientHeader } from './ClientHeader'

export async function Header() {
  try {
    const payload = await getPayload({ config: configPromise })
    const { user } = await payload.auth({ headers: await headers() })

    let cartItemCount = 0
    let wishlistItemCount = 0
    let initialWishlistItems: any[] = []
    let initialCartItems: any[] = []

    if (user) {
      const carts = await payload.find({
        collection: 'carts',
        where: { user: { equals: user.id } },
        limit: 1,
        overrideAccess: true,
      })
      if (carts.docs[0]?.items) {
        cartItemCount = carts.docs[0].items.reduce((sum: any, item: any) => sum + (item.quantity || 1), 0)
        initialCartItems = carts.docs[0].items.map((item: any) => {
          const prod = item.product || {}
          return {
            lineId: item.id || Math.random().toString(36).substring(2, 15),
            productId: String(prod.id || item.product),
            variantSku: item.variantSku || 'default',
            quantity: item.quantity || 1,
            priceSnapshot: item.priceSnapshot || 0,
            product: {
              id: String(prod.id || item.product),
              name: prod.name || '',
              imageUrl: prod.images?.[0]?.image?.url || null,
            },
          }
        })
      }

      const wishlists = await payload.find({
        collection: 'wishlists',
        where: { user: { equals: user.id } },
        limit: 1,
        overrideAccess: true,
      })
      if (wishlists.docs[0]?.items) {
        wishlistItemCount = wishlists.docs[0].items.length
        initialWishlistItems = wishlists.docs[0].items.map((item: any) => {
          const prod = item.product || {}
          return {
            id: prod.id || item.product,
            name: prod.name || '',
            slug: prod.slug || '',
            image: prod.images?.[0]?.image?.url || '',
            priceRange: prod.price ? `$${prod.price}` : '',
            descriptor: prod.descriptor || '',
            price: prod.price ? `$${prod.price}` : '',
          }
        })
      }
    }

    return (
      <ClientHeader
        cartItemCount={cartItemCount}
        wishlistItemCount={wishlistItemCount}
        isLoggedIn={!!user}
        userEmail={(user as any)?.email || ''}
        avatarUrl={(user as any)?.avatarUrl || ''}
        categories={[]}
        initialWishlistItems={initialWishlistItems}
        initialCartItems={initialCartItems}
      />
    )
  } catch (error) {
    console.error('Error in Header:', error)
    return (
      <ClientHeader
        cartItemCount={0}
        wishlistItemCount={0}
        isLoggedIn={false}
        categories={[]}
        initialWishlistItems={[]}
        initialCartItems={[]}
      />
    )
  }
}
