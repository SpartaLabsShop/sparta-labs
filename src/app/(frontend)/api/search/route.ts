import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Fuse from 'fuse.js'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    const payload = await getPayload({ config: configPromise })
    
    // Fetch all active products
    // We only need a few fields for search to keep memory lightweight
    const productsRes = await payload.find({
      collection: 'products',
      where: {
        status: { equals: 'active' },
        isVisible: { equals: true }
      },
      depth: 1, // To get categories
      limit: 1000,
    })

    const products = productsRes.docs.map((doc: any) => {
      // Flatten categories for easier searching
      const categoryNames = doc.categories?.map((c: any) => c.title || c.name).join(' ') || ''

      return {
        id: doc.id,
        name: doc.name,
        slug: doc.slug,
        description: doc.description || doc.seoDescription || '',
        price: doc.price,
        imageUrl: doc.images?.[0]?.image?.url || null,
        categories: categoryNames,
        descriptor: doc.descriptor || ''
      }
    })

    if (!query) {
      // If no query, just return empty array
      return NextResponse.json([])
    }

    // Configure Fuse.js for fuzzy searching
    const fuse = new Fuse(products, {
      keys: [
        { name: 'name', weight: 3 }, // Name is most important
        { name: 'categories', weight: 1.5 },
        { name: 'description', weight: 1 },
      ],
      threshold: 0.4, // 0.0 is perfect match, 1.0 is matches everything. 0.4 is a good fuzzy sweet spot.
      includeScore: true,
      ignoreLocation: true, // Don't penalize if the word is at the end of a string
    })

    const results = fuse.search(query)
    
    // Extract the raw items and limit to top 8 results
    const matchedProducts = results.slice(0, 8).map(result => result.item)

    return NextResponse.json(matchedProducts)
  } catch (error: any) {
    console.error('Search API Error:', error)
    return NextResponse.json({ error: 'Failed to perform search' }, { status: 500 })
  }
}
