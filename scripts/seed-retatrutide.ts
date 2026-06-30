import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

async function run() {
  console.log('Initializing Payload...')
  const { getPayload } = await import('payload')
  const config = (await import('../src/payload.config')).default
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: 'retatrutide-30mg' } },
    limit: 1,
  })

  if (docs.length === 0) {
    console.error('Product "retatrutide-30mg" not found. Make sure it exists in the database.')
    process.exit(1)
  }

  const product = docs[0]
  console.log(`Found product: ${product.name} (ID: ${product.id})`)

  await payload.update({
    collection: 'products',
    id: product.id,
    data: {
      seoTitle: 'Retatrutide 30mg | Triple-Agonist Research Peptide | Sparta Labs',
      seoDescription: 'High-purity Retatrutide triple-agonist peptide available in 10mg and 20mg vials. ≥99% purity, LC-MS verified. COA included. US-based shipping.',
      hasVariants: true,
      variants: [
        {
          sku: 'RET-10MG',
          price: 80,
          stock: 13,
          options: [
            { key: 'Dosage', value: '10mg' },
          ],
        },
        {
          sku: 'RET-20MG',
          price: 155,
          stock: 18,
          options: [
            { key: 'Dosage', value: '20mg' },
          ],
        },
      ],
      bulkBundles: [
        {
          name: '5 Kits',
          quantity: 5,
          discountPercentage: 10,
          variantOverrides: [
            { variantSku: 'RET-10MG', price: 400, salePrice: 360 },
            { variantSku: 'RET-20MG', price: 775, salePrice: 697 },
          ],
        },
        {
          name: '10 Kits',
          quantity: 10,
          discountPercentage: 15,
          variantOverrides: [
            { variantSku: 'RET-10MG', price: 720, salePrice: 612 },
            { variantSku: 'RET-20MG', price: 1550, salePrice: 1317 },
          ],
        },
      ],
      averageRating: 4.8,
      reviewCount: 12,
      productDetailsTitle: 'Product Details',
      productDetailsDescription: 'Retatrutide is a novel triple-agonist peptide targeting GLP-1, GIP, and glucagon receptors simultaneously. Each vial contains lyophilized peptide at ≥99% purity confirmed by HPLC and LC-MS. Supplied as a white to off-white lyophilized powder in a sealed, sterile glass vial. Molecular weight: ~4,471 Da. Sequence length: 39 amino acids. Store lyophilized vials at -20°C. Reconstitute with bacteriostatic water before use.',
      researchFocusTitle: 'Research Focus & Mechanism Overview',
      researchFocusDescription: 'Retatrutide activates three incretin-related receptors: GLP-1R (glucagon-like peptide-1 receptor), GIPR (glucose-dependent insulinotropic polypeptide receptor), and GCGR (glucagon receptor). This triple-agonist mechanism is being studied in preclinical models for its effects on metabolic pathways, energy homeostasis, and body composition. Published literature suggests synergistic activity across all three receptor targets, distinguishing it from single- or dual-agonist compounds.',
      qualityPurityTitle: 'Quality & Purity Standards',
      qualityPurityDescription: 'Every batch is tested in-house and verified by independent third-party laboratories. Purity ≥99% by HPLC. Identity confirmed via LC-MS. Endotoxin levels <0.1 EU/mg. Heavy metals below ICH Q3D limits. Peptide content ≥80% by weight (net peptide). Certificate of Analysis (COA) available for download on this page.',
      complianceNoticeTitle: 'Compliance Notice',
      complianceNoticeDescription: 'This product is intended solely for in-vitro research and laboratory use. It is not a drug, food, supplement, or cosmetic. Not approved for human or veterinary use. Purchasers assume full responsibility for compliance with applicable local, state, and federal regulations. By purchasing, you confirm that you are a qualified researcher or institution and that this product will not be used for any unauthorized purpose.',
      faqs: [
        {
          question: 'How should I reconstitute Retatrutide?',
          answer: 'Slowly inject bacteriostatic water along the inside wall of the vial. Do not shake — gently swirl until the powder is fully dissolved. Use 1ml of BAC water per vial for standard concentration. Store reconstituted solution refrigerated at 2-8°C and use within 30 days.',
        },
        {
          question: 'What is the difference between the 10mg and 20mg vials?',
          answer: 'Both vials contain the same Retatrutide peptide at identical purity (≥99%). The only difference is the amount of lyophilized peptide per vial — 10mg or 20mg. Choose based on your research protocol\'s dosing requirements.',
        },
        {
          question: 'How should I store Retatrutide?',
          answer: 'Store lyophilized (unreconstituted) vials at -20°C for long-term storage or 2-8°C for short-term. Reconstituted peptide should be kept refrigerated at 2-8°C and used within 30 days. Avoid repeated freeze-thaw cycles.',
        },
      ],
    } as any,
  })

  console.log('Successfully updated Retatrutide 30mg with all mock data!')
  console.log('  - 2 variants (10mg, 20mg) with dosage options')
  console.log('  - 2 bulk bundles (5 Kits, 10 Kits) with variant overrides')
  console.log('  - Product detail tabs (4 tabs)')
  console.log('  - 3 FAQs')
  console.log('  - SEO metadata')
  console.log('  - Rating: 4.8 (12 reviews)')
  process.exit(0)
}

run().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
