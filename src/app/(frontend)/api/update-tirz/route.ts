import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || request.headers.get('Authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config: configPromise })

    const existing = await payload.find({
      collection: 'products',
      where: { slug: { equals: 'tirzepatide' } },
      limit: 1
    })

    if (existing.totalDocs === 0) {
      return NextResponse.json({ error: 'Tirzepatide product not found in database.' }, { status: 404 })
    }

    const product = existing.docs[0]

    await payload.update({
      collection: 'products',
      id: product.id,
      data: {
        hasVariants: true,
        price: 129.99,
        variants: [
          {
            sku: 'TIRZ-5',
            price: 129.99,
            salePrice: 99.99,
            stock: 100,
            options: [
              { key: 'Size', value: '5mg' }
            ]
          },
          {
            sku: 'TIRZ-10',
            price: 249.99,
            salePrice: 199.99,
            stock: 100,
            options: [
              { key: 'Size', value: '10mg' }
            ]
          },
          {
            sku: 'TIRZ-15',
            price: 349.99,
            salePrice: 299.99,
            stock: 50,
            options: [
              { key: 'Size', value: '15mg' }
            ]
          }
        ],
        faqs: [
          {
            question: 'How is this shipped?',
            answer: 'All our products are shipped discreetly with temperature controlled ice packs to ensure maximum stability during transit.'
          },
          {
            question: 'Are there third-party lab tests available?',
            answer: 'Yes! Every single batch undergoes rigorous HPLC testing by independent US-based laboratories to verify 99% purity before it is ever sent to you.'
          }
        ],
        productDetailsDescription: 'Tirzepatide is an advanced compound known for its structural purity. This formulation has been optimized for precise application.',
        researchFocusDescription: 'Targeting dual-receptors, this sequence is engineered for maximum structural integrity and prolonged stability under testing environments.',
        qualityPurityDescription: 'Our peptides are synthesized using automated Solid Phase Peptide Synthesis (SPPS), yielding 99%+ purity as verified by third-party HPLC/MS tests.',
        complianceNoticeDescription: 'This product is strictly for laboratory research use only. It is not intended for human consumption or therapeutic use.'
      }
    })

    // Create Bundle 1
    const existing5Kit = await payload.find({
      collection: 'products',
      where: { slug: { equals: 'tirzepatide-5-kits' } },
      limit: 1
    })

    if (existing5Kit.totalDocs === 0) {
      await payload.create({
        collection: 'products',
        data: {
          name: 'Tirzepatide - 5 Kits Bundle',
          slug: 'tirzepatide-5-kits',
          description: 'Save big by purchasing 5 kits of our pure Tirzepatide research compound.',
          price: 449.99,
          salePrice: 399.99,
          stock: 50,
          status: 'active',
          images: product.images,
          categories: product.categories
        }
      })
    }

    // Create Bundle 2
    const existing10Kit = await payload.find({
      collection: 'products',
      where: { slug: { equals: 'tirzepatide-10-kits' } },
      limit: 1
    })

    if (existing10Kit.totalDocs === 0) {
      await payload.create({
        collection: 'products',
        data: {
          name: 'Tirzepatide - 10 Kits Bundle',
          slug: 'tirzepatide-10-kits',
          description: 'The ultimate research package. 10 kits of our premium Tirzepatide compound.',
          price: 799.99,
          salePrice: 699.99,
          stock: 25,
          status: 'active',
          images: product.images,
          categories: product.categories
        }
      })
    }

    return NextResponse.json({ success: true, message: 'Updated Tirzepatide and created Bundles!' })
  } catch (error: any) {
    console.error('update-tirz error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
