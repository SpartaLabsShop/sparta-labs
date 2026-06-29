import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

async function run() {
  console.log('Initializing Payload...')
  const { getPayload } = await import('payload')
  const config = (await import('../src/payload.config')).default
  const payload = await getPayload({ config })

  console.log('Fetching existing categories...')
  const categoriesRes = await payload.find({ collection: 'categories', limit: 100 })
  const categoryIds = categoriesRes.docs.map(doc => doc.id)
  
  if (categoryIds.length === 0) {
    console.error('No categories found! Please seed categories first.')
    process.exit(1)
  }

  console.log('Cleaning up blocking relations (Carts, Orders, Wishlists)...')
  for (const coll of ['carts', 'orders', 'wishlists', 'reviews'] as const) {
    try {
      const docs = await payload.find({ collection: coll, limit: 1000 })
      for (const d of docs.docs) {
        await payload.delete({ collection: coll, id: d.id })
      }
    } catch (e) {}
  }

  console.log('Cleaning up old media...')
  const oldMedia = await payload.find({ collection: 'media', limit: 1000 })
  for (const m of oldMedia.docs) {
    try {
      await payload.delete({ collection: 'media', id: m.id })
    } catch (e: any) {
      console.warn(`Could not delete media ${m.id}: ${e.message}`)
    }
  }

  const imagesDir = path.resolve(process.cwd(), 'public/Temp Product Images')
  const files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.webp'))

  console.log(`Found ${files.length} images. Cleaning up old products...`)
  const oldProducts = await payload.find({ collection: 'products', limit: 1000 })
  for (const p of oldProducts.docs) {
    try {
      await payload.delete({ collection: 'products', id: p.id })
    } catch (e: any) {
      console.warn(`Could not delete product ${p.name}: ${e.message}`)
    }
  }

  const faqs = [
    { question: "What is the recommended storage temperature?", answer: "We recommend storing this compound at 2-8°C (36-46°F) to maintain optimal stability and prevent degradation. Lyophilized peptides should be kept away from direct light and moisture until reconstitution." },
    { question: "How long does it remain stable after reconstitution?", answer: "Once reconstituted with bacteriostatic water, the compound typically remains stable for 20-30 days when properly refrigerated. We advise against freezing and thawing cycles as they can damage the peptide bonds." },
    { question: "What purity standards do you maintain?", answer: "All our research compounds undergo strict HPLC and MS testing. We guarantee a minimum purity of 99%, ensuring that researchers receive the highest quality materials for their cellular studies with no heavy metals or unwanted synthetic byproducts." },
    { question: "Can this be used for human consumption?", answer: "No. All products available through Sparta Labs are strictly for laboratory research and in-vitro testing purposes only. They are not intended for human consumption, diagnostic, or therapeutic use." },
    { question: "What is the typical half-life of this compound?", answer: "In standard in-vitro models, the half-life varies depending on the surrounding enzymatic environment but generally ranges between 30 minutes to 2 hours. Protected analogs may demonstrate extended stability." },
    { question: "Are Certificates of Analysis (COAs) available?", answer: "Yes, every batch is independently tested by a third-party laboratory. We provide updated COAs detailing the exact purity percentage and mass spectrometry results upon request or directly on the product page." },
    { question: "How should I handle the lyophilized powder?", answer: "Always handle the vials in a clean, sterile environment. Use sterile gloves and wipe the vial stopper with an alcohol swab before introducing any reconstitution solvent. Avoid aggressive shaking." },
    { question: "What is the molecular weight?", answer: "The molecular weight is verified via mass spectrometry during our QA process. Exact specifications and chemical structural formulas are provided in the accompanying documentation for research precision." },
  ]

  const heavyDescription = `Our premium research compound represents the pinnacle of modern peptide synthesis. Developed specifically for advanced laboratory settings, this highly purified sequence offers unparalleled stability and precise molecular integrity. Researchers investigating cellular signaling pathways, metabolic regulation, and advanced proteomic interactions will find this compound to be an indispensable asset. Each batch is meticulously synthesized using solid-phase techniques and subjected to rigorous High-Performance Liquid Chromatography (HPLC) to isolate the target molecule from truncated sequences or synthesis impurities. The resulting lyophilized powder demonstrates exceptional solubility and consistency across experimental protocols. Furthermore, our state-of-the-art lyophilization process ensures maximum shelf-life and structural preservation, allowing for reproducible data in longitudinal studies. Whether you are conducting preliminary in-vitro assays or complex binding-affinity analyses, this compound delivers the precision required by top-tier academic and independent institutions globally.`
  
  const researchFocus = `This compound's primary research applications center around complex neuroendocrine pathways, systemic metabolic regulation, and localized tissue regeneration models. Recent literature indicates significant potential in modulating receptor-specific transcription factors and downstream kinase cascades. In laboratory environments, studies frequently observe enhanced expression of key metabolic markers and accelerated cellular turnover in isolated fibroblasts and myogenic precursor cells. It is highly recommended for use in comparative pharmacological profiling, where its structural analogs can be evaluated against wild-type peptide sequences. Investigators should note its rapid binding kinetics and dose-dependent activation thresholds, making it ideal for titration assays and threshold mapping.`
  
  const compliance = `DISCLAIMER: This product is strictly for research and laboratory use only. It is not approved by the FDA or any global regulatory body for human consumption, veterinary use, or therapeutic application. The purchaser assumes all responsibility for the proper handling, storage, and application of this compound. It must only be handled by qualified professionals in a controlled laboratory setting. By purchasing this product, you agree to abide by all local and international laws regarding the use of research chemicals.`

  console.log('Seeding products...')

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const title = file
      .replace('.jpg', '')
      .replace('.png', '')
      .replace('.webp', '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())

    const imagePath = path.join(imagesDir, file)
    const fileData = fs.readFileSync(imagePath)
    
    // 1. Create Media
    const media = await payload.create({
      collection: 'media',
      data: { alt: title },
      file: {
        data: fileData,
        mimetype: 'image/jpeg',
        name: file,
        size: fs.statSync(imagePath).size,
      }
    })

    const basePrice = Math.floor(Math.random() * 100) + 50
    const isSale = i % 3 === 0
    const salePrice = isSale ? basePrice - 20 : undefined
    
    const hasVariants = i % 2 === 0

    // Randomize categories
    const shuffledCategories = categoryIds.sort(() => 0.5 - Math.random())
    const selectedCategories = shuffledCategories.slice(0, 2)

    await payload.create({
      collection: 'products',
      data: {
        name: title,
        description: heavyDescription,
        seoTitle: `${title} - Premium Research Compound`,
        seoDescription: `Buy high-purity ${title} for laboratory research. 99%+ purity guaranteed with rigorous HPLC testing. Fast shipping and bulk pricing available.`,
        slug: title.toLowerCase().replace(/ /g, '-').replace(/\+/g, 'plus'),
        sku: `SKU-${Math.floor(Math.random() * 9000) + 1000}`,
        price: basePrice,
        salePrice: salePrice,
        stock: 500,
        weight: 0.05,
        dimensions: { length: 5, width: 2, height: 2 },
        categories: selectedCategories as any,
        images: [
          { image: media.id }
        ],
        hasVariants: hasVariants,
        variants: hasVariants ? [
          { sku: `VAR-${Math.floor(Math.random() * 9000)}`, price: basePrice, stock: 100, options: [{ key: 'Size', value: '5mg' }] },
          { sku: `VAR-${Math.floor(Math.random() * 9000)}`, price: basePrice + 30, stock: 100, options: [{ key: 'Size', value: '10mg' }] },
          { sku: `VAR-${Math.floor(Math.random() * 9000)}`, price: basePrice + 70, stock: 100, options: [{ key: 'Size', value: '15mg' }] }
        ] : [],
        isBundle: false,
        bundleItems: [],
        averageRating: 5,
        reviewCount: Math.floor(Math.random() * 50) + 5,
        productDetailsTitle: 'Comprehensive Product Details',
        productDetailsDescription: heavyDescription,
        researchFocusTitle: 'Advanced Research Focus',
        researchFocusDescription: researchFocus,
        qualityPurityTitle: 'Uncompromising Quality Standards',
        qualityPurityDescription: 'Our peptides are synthesized utilizing Solid-Phase Peptide Synthesis (SPPS) ensuring an ultra-pure final product. Subsequent purification via preparative HPLC eliminates truncated sequences and deletion impurities. Final verification is achieved through Electrospray Ionization Mass Spectrometry (ESI-MS), confirming the exact molecular mass. We guarantee >99% purity.',
        complianceNoticeTitle: 'Legal & Compliance Notice',
        complianceNoticeDescription: compliance,
        faqs: faqs,
        status: 'active',
        isVisible: true,
      } as any,
    })

    console.log(`Created product: ${title} ${hasVariants ? '(with variants)' : ''} ${isSale ? '(ON SALE)' : ''}`)
  }

  console.log('Product seeding complete!')
  process.exit(0)
}

run().catch((err) => {
  console.error('Error during seeding:', err)
  process.exit(1)
})
