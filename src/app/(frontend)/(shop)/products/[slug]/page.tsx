import React from 'react'
import { ProductClient } from './ProductClient'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  
  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1, // Need media depth for images
  })

  if (!docs || docs.length === 0) {
    return { title: 'Product Not Found' }
  }

  const product = docs[0]
  const title = product.seoTitle || product.name || 'Product'
  const description = product.seoDescription || product.description?.substring(0, 160) || ''

  // Get primary image for open graph
  let imageUrl = undefined
  if (product.images && product.images.length > 0 && typeof product.images[0].image === 'object' && product.images[0].image?.url) {
    imageUrl = product.images[0].image.url
    if (imageUrl.startsWith('/')) {
      imageUrl = `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}${imageUrl}`
    }
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    }
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  console.log('--- STARTING SERVER RENDER FOR PRODUCT PAGE ---')
  const { slug } = await params
  console.log(`Resolved slug: ${slug}, Initializing Payload...`)
  
  const payload = await getPayload({ config: configPromise })
  console.log('Payload initialized, querying product...')
  
  const { docs } = await payload.find({
    collection: 'products',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 2, // To fetch categories and media
  })

  if (!docs || docs.length === 0) {
    notFound()
  }

  const rawProduct = docs[0]

  // Map images
  const mappedImages = rawProduct.images?.map((img: any) => {
    if (typeof img.image === 'object' && img.image?.url) {
      return img.image.url
    }
    return ''
  }).filter(Boolean) || []

  // If no images are uploaded, provide a fallback
  if (mappedImages.length === 0) {
    mappedImages.push('/temp-products/product-image.png')
  }

  // Map categories
  const mappedCategories = rawProduct.categories?.map((cat: any) => {
    return typeof cat === 'object' ? cat.name : 'Category'
  }).filter(Boolean) || []

  // Map variants
  let mappedVariants = []
  if (rawProduct.hasVariants && rawProduct.variants?.length) {
    mappedVariants = rawProduct.variants.map((v: any, index: number) => ({
      id: v.sku || `v-${index}`,
      sku: v.sku || '',
      title: v.options?.map((o: any) => o.value).join(' ') || `Variant ${index + 1}`,
      price: `$${Number(v.price || 0).toFixed(2)}`,
      salePrice: v.salePrice ? `$${Number(v.salePrice).toFixed(2)}` : undefined,
      inStock: (v.stock || 0) > 0,
    }))
  } else {
    mappedVariants = [
      {
        id: rawProduct.sku || String(rawProduct.id),
        sku: rawProduct.sku || '',
        title: 'Standard',
        price: `$${Number(rawProduct.price || 0).toFixed(2)}`,
        salePrice: rawProduct.salePrice ? `$${Number(rawProduct.salePrice).toFixed(2)}` : undefined,
        inStock: (rawProduct.stock || 0) > 0,
      }
    ]
  }

  // Map tabs (Pass as strings to avoid Turbopack RSC serialization panics)
  const mappedTabs = []
  if (rawProduct.productDetailsDescription) {
    mappedTabs.push({
      id: 'product-details',
      label: rawProduct.productDetailsTitle || 'Product Details',
      content: rawProduct.productDetailsDescription
    })
  }
  if (rawProduct.researchFocusDescription) {
    mappedTabs.push({
      id: 'research-focus',
      label: rawProduct.researchFocusTitle || 'Research Focus & Mechanism Overview',
      content: rawProduct.researchFocusDescription
    })
  }
  if (rawProduct.qualityPurityDescription) {
    mappedTabs.push({
      id: 'quality-purity',
      label: rawProduct.qualityPurityTitle || 'Quality & Purity Standards',
      content: rawProduct.qualityPurityDescription
    })
  }
  if (rawProduct.complianceNoticeDescription) {
    mappedTabs.push({
      id: 'compliance-notice',
      label: rawProduct.complianceNoticeTitle || 'Compliance Notice',
      content: rawProduct.complianceNoticeDescription
    })
  }

  if (mappedTabs.length === 0 && rawProduct.description) {
    mappedTabs.push({
      id: 'description',
      label: 'Description',
      content: rawProduct.description
    })
  }

  // Map FAQs
  const mappedFaqs = rawProduct.faqs?.map((faq: any, i: number) => ({
    id: `faq-${i}`,
    question: faq.question,
    answer: faq.answer
  })) || []

  // Extract COA URL
  let coaFileUrl = undefined
  if (typeof rawProduct.coaFile === 'object' && rawProduct.coaFile?.url) {
    coaFileUrl = rawProduct.coaFile.url
  }

  // Map to ProductData interface
  const productData = {
    id: String(rawProduct.id),
    name: rawProduct.name,
    subtitle: rawProduct.seoDescription || '',
    category: mappedCategories[0] || 'Product',
    categories: mappedCategories,
    sku: rawProduct.sku,
    weight: rawProduct.weight,
    dimensions: rawProduct.dimensions,
    badges: rawProduct.status === 'active' ? [] : ['DRAFT'],
    description: rawProduct.description || '',
    shortDescription: rawProduct.seoDescription || rawProduct.description?.substring(0, 100) || '',
    averageRating: rawProduct.averageRating || 5.0,
    reviewCount: rawProduct.reviewCount || 0,

    bulkBundles: rawProduct.bulkBundles?.map((b: any) => ({
      id: b.id,
      name: b.name,
      quantity: b.quantity,
      discountPercentage: b.discountPercentage,
      price: b.price,
      salePrice: b.salePrice,
      image: typeof b.image === 'object' && b.image?.url ? b.image.url : undefined,
      variantOverrides: b.variantOverrides?.map((vo: any) => ({
        variantSku: vo.variantSku,
        price: vo.price,
        salePrice: vo.salePrice
      })) || []
    })) || [],
    images: mappedImages,
    variants: mappedVariants,
    coaFile: coaFileUrl,
    tabs: mappedTabs,
    faqs: mappedFaqs,
    reviews: [] as any[],
    relatedProducts: [] as any[],
  }

  // Fetch related products (same category)
  if (rawProduct.categories && rawProduct.categories.length > 0) {
    const categoryIds = rawProduct.categories.map((c: any) => typeof c === 'object' ? c.id : c).filter(Boolean)
    
    if (categoryIds.length > 0) {
      const { docs: relatedDocs } = await payload.find({
        collection: 'products',
        where: {
          and: [
            {
              id: {
                not_equals: rawProduct.id,
              }
            },
            {
              'categories': {
                in: categoryIds,
              }
            },
            {
              status: {
                equals: 'active'
              }
            }
          ]
        },
        limit: 4,
        depth: 1, // Only need basic info and main image
      })

      productData.relatedProducts = relatedDocs.map((p: any) => {
        let imageUrl = '/temp-products/product-image.png'
        let hoverImageUrl = undefined
        if (p.images && p.images.length > 0 && typeof p.images[0].image === 'object' && p.images[0].image?.url) {
          imageUrl = p.images[0].image.url
        }
        if (p.images && p.images.length > 1 && typeof p.images[1].image === 'object' && p.images[1].image?.url) {
          hoverImageUrl = p.images[1].image.url
        }

        const variantLabels = p.hasVariants && p.variants && p.variants.length > 1
          ? p.variants.map((v: any) => v.options?.map((o: any) => o.value).join(' ')).filter(Boolean)
          : []

        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          image: imageUrl,
          hoverImage: hoverImageUrl,
          shortDescription: p.seoDescription || 'High-purity research peptide for laboratory use.',
          category: typeof p.categories?.[0] === 'object' ? p.categories[0].title : '',
          priceRange: `$${p.price?.toFixed(2) || '0.00'}`,
          originalPrice: p.salePrice ? `$${p.salePrice.toFixed(2)}` : undefined,
          isFrom: p.bulkBundles && p.bulkBundles.length > 0,
          variantLabels,
        }
      })
    }
  }

  // If we couldn't find related products by category, just get the newest ones
  if (productData.relatedProducts.length === 0) {
    const { docs: recentDocs } = await payload.find({
      collection: 'products',
      where: {
        id: {
          not_equals: rawProduct.id,
        },
        status: {
          equals: 'active'
        }
      },
      sort: '-createdAt',
      limit: 4,
      depth: 1,
    })

    productData.relatedProducts = recentDocs.map((p: any) => {
      let imageUrl = '/temp-products/product-image.png'
      let hoverImageUrl = undefined
      if (p.images && p.images.length > 0 && typeof p.images[0].image === 'object' && p.images[0].image?.url) {
        imageUrl = p.images[0].image.url
      }
      if (p.images && p.images.length > 1 && typeof p.images[1].image === 'object' && p.images[1].image?.url) {
        hoverImageUrl = p.images[1].image.url
      }

      const variantLabels = p.hasVariants && p.variants && p.variants.length > 1
        ? p.variants.map((v: any) => v.options?.map((o: any) => o.value).join(' ')).filter(Boolean)
        : []

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        image: imageUrl,
        hoverImage: hoverImageUrl,
        shortDescription: p.seoDescription || 'High-purity research peptide for laboratory use.',
        category: typeof p.categories?.[0] === 'object' ? p.categories[0].title : '',
        priceRange: `$${p.price?.toFixed(2) || '0.00'}`,
        originalPrice: p.salePrice ? `$${p.salePrice.toFixed(2)}` : undefined,
        isFrom: p.bulkBundles && p.bulkBundles.length > 0,
        variantLabels,
      }
    })
  }

  console.log('--- FINISHED SERVER RENDER FOR PRODUCT PAGE ---')

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 mt-20">
        <ProductClient product={productData as any} />
      </main>
    </div>
  )
}
