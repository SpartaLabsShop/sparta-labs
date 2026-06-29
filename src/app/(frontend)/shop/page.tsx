import React from 'react'
import { ShopClient } from '@/components/shop/ShopClient'
import { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getShopProducts } from '../(shop)/actions'

export const metadata: Metadata = {
  title: 'Shop All Compounds | Sparta Labs',
  description: 'Browse our complete catalog of research-grade peptides and compounds. Filter by purity, category, and availability.',
}

export const dynamic = 'force-dynamic'

export default async function ShopPage() {
  let categories: any[] = []
  let dbError = null

  try {
    const payload = await getPayload({ config: configPromise })

    // Fetch all categories for the sidebar
    const categoriesRes = await payload.find({
      collection: 'categories',
      where: { isVisible: { equals: true } },
      limit: 100,
      sort: 'name',
      overrideAccess: true,
    })

    categories = categoriesRes.docs.map(cat => ({
      id: cat.id as string | number,
      name: cat.name,
      slug: cat.slug || ''
    }))
  } catch (error: any) {
    console.error("DB Connection Error on /shop:", error)
    dbError = error.message || 'Unknown database error'
  }

  // Fetch initial page of products
  const initialProductsRes = await getShopProducts({ page: 1, limit: 24 })

  if (dbError) {
    return (
      <div className="min-h-screen bg-white pt-32 px-6 flex flex-col items-center">
        <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-xl max-w-2xl w-full">
          <h2 className="text-xl font-bold mb-2">Database Connection Error</h2>
          <p className="mb-4">The shop page crashed because it couldn't connect to Supabase on Vercel.</p>
          <pre className="bg-red-100 p-4 rounded-lg overflow-x-auto text-xs font-mono">{dbError}</pre>
        </div>
      </div>
    )
  }

  return (
    <ShopClient 
      initialProducts={initialProductsRes.success ? (initialProductsRes.products as any) : []} 
      totalPages={initialProductsRes.success ? initialProductsRes.totalPages : 0} 
      categories={categories} 
    />
  )
}
