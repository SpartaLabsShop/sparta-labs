import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

interface VariantConfig {
  dosages: { sku: string; label: string; price: number; salePrice?: number; stock: number }[]
}

interface ProductMock {
  variants: VariantConfig
  description: string
  detailsDescription: string
  researchDescription: string
  faqs: { question: string; answer: string }[]
}

function generateMockForProduct(name: string, basePrice: number): ProductMock {
  const nameLower = name.toLowerCase()

  // Determine dosage tiers based on product name patterns
  let dosages: VariantConfig['dosages']

  if (nameLower.includes('water') || nameLower.includes('bac') || nameLower.includes('aa ')) {
    dosages = [
      { sku: `${slugify(name)}-10ML`, label: '10ml', price: basePrice || 10, stock: 50 },
    ]
  } else if (nameLower.includes('blend') || nameLower.includes('+')) {
    dosages = [
      { sku: `${slugify(name)}-10MG`, label: '10mg', price: basePrice || 80, stock: 20 },
      { sku: `${slugify(name)}-20MG`, label: '20mg', price: Math.round((basePrice || 80) * 1.7), stock: 15 },
    ]
  } else if (nameLower.includes('semaglutide') || nameLower.includes('tirzepatide') || nameLower.includes('retatrutide') || nameLower.includes('cagrilintide')) {
    dosages = [
      { sku: `${slugify(name)}-5MG`, label: '5mg', price: basePrice || 65, stock: 25 },
      { sku: `${slugify(name)}-10MG`, label: '10mg', price: Math.round((basePrice || 65) * 1.8), stock: 20 },
      { sku: `${slugify(name)}-20MG`, label: '20mg', price: Math.round((basePrice || 65) * 3.2), stock: 12 },
    ]
  } else if (nameLower.includes('igf') || nameLower.includes('hgh') || nameLower.includes('fragment')) {
    dosages = [
      { sku: `${slugify(name)}-2MG`, label: '2mg', price: basePrice || 45, stock: 30 },
      { sku: `${slugify(name)}-5MG`, label: '5mg', price: Math.round((basePrice || 45) * 2), stock: 20 },
    ]
  } else {
    dosages = [
      { sku: `${slugify(name)}-5MG`, label: '5mg', price: basePrice || 50, stock: 25 },
      { sku: `${slugify(name)}-10MG`, label: '10mg', price: Math.round((basePrice || 50) * 1.7), stock: 18 },
    ]
  }

  const description = `${name} is a high-purity research compound supplied as a lyophilized powder in sealed, sterile glass vials. Manufactured using solid-phase peptide synthesis (SPPS) and purified via preparative HPLC. Each batch undergoes rigorous quality control including HPLC purity analysis and LC-MS identity confirmation. Reconstitute with sterile bacteriostatic water before use. Store lyophilized vials at -20°C for long-term storage or 2-8°C for short-term. For laboratory and research use only. Not for human or veterinary use.`

  const detailsDescription = `${name} is synthesized using advanced solid-phase peptide synthesis (SPPS) technology and purified to ≥99% via preparative HPLC. Each vial contains lyophilized peptide verified by electrospray ionization mass spectrometry (ESI-MS) for exact molecular mass confirmation. The lyophilization process is performed under inert nitrogen atmosphere to prevent oxidation and ensure maximum shelf stability. Supplied as a white to off-white lyophilized powder. Reconstitute with bacteriostatic water (0.9% benzyl alcohol) for optimal peptide preservation. Store reconstituted solutions at 2-8°C and use within 30 days.`

  const researchDescription = `${name} has been extensively characterized in preclinical research literature for its receptor binding affinity and downstream signaling activity. Published studies indicate dose-dependent activation of target receptor pathways with high selectivity. The compound demonstrates favorable pharmacokinetic properties in standard in-vitro assay systems, including rapid binding kinetics and sustained receptor engagement. Researchers should note the compound's stability profile under various buffer conditions when designing experimental protocols. Recommended for use in comparative pharmacological profiling, receptor binding assays, dose-response characterization, and mechanistic pathway studies.`

  const faqs: { question: string; answer: string }[] = [
    {
      question: `How should I reconstitute ${name}?`,
      answer: 'Slowly inject bacteriostatic water along the inside wall of the vial to avoid foaming. Do not shake — gently swirl until the powder is fully dissolved. Use sterile technique throughout. Store reconstituted solution refrigerated at 2-8°C and use within 30 days.',
    },
    {
      question: `What purity is guaranteed for ${name}?`,
      answer: 'Every batch is tested in-house via HPLC and independently verified by third-party LC-MS analysis. We guarantee a minimum purity of ≥99%. Certificates of Analysis (COA) are available for download on each product page.',
    },
    {
      question: `How should I store ${name}?`,
      answer: 'Store lyophilized (unreconstituted) vials at -20°C for long-term storage or 2-8°C for short-term. Protect from light and moisture. Reconstituted peptide should be kept refrigerated at 2-8°C and used within 30 days. Avoid repeated freeze-thaw cycles.',
    },
    {
      question: 'Is this product approved for human use?',
      answer: 'No. All Sparta Labs products are strictly intended for in-vitro laboratory research only. They are not drugs, supplements, or food products. Not approved by the FDA or any regulatory body for human or veterinary use.',
    },
  ]

  return { variants: { dosages }, description, detailsDescription, researchDescription, faqs }
}

function slugify(name: string): string {
  return name.toUpperCase().replace(/[^A-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

async function run() {
  console.log('Initializing Payload...')
  const { getPayload } = await import('payload')
  const config = (await import('../src/payload.config')).default
  const payload = await getPayload({ config })

  const { docs: allProducts } = await payload.find({
    collection: 'products',
    limit: 100,
    depth: 0,
  })

  console.log(`Found ${allProducts.length} products to update.\n`)

  if (allProducts.length === 0) {
    console.log('No products found in the database.')
    process.exit(0)
  }

  let updated = 0
  let skipped = 0

  for (const product of allProducts) {
    // Skip the Retatrutide product we already seeded
    if (product.slug === 'retatrutide-30mg') {
      console.log(`⏭  Skipping "${product.name}" (already seeded)`)
      skipped++
      continue
    }

    const mock = generateMockForProduct(product.name, product.price)
    const hasSingleVariant = mock.variants.dosages.length === 1

    const variants = mock.variants.dosages.map(d => ({
      sku: d.sku,
      price: d.price,
      salePrice: d.salePrice,
      stock: d.stock,
      options: [{ key: 'Dosage', value: d.label }],
    }))

    // Generate bulk bundles only for multi-variant products
    const bulkBundles = hasSingleVariant ? [] : [
      {
        name: '5 Kits',
        quantity: 5,
        discountPercentage: 10,
        variantOverrides: mock.variants.dosages.map(d => ({
          variantSku: d.sku,
          price: d.price * 5,
          salePrice: Math.round(d.price * 5 * 0.9),
        })),
      },
      {
        name: '10 Kits',
        quantity: 10,
        discountPercentage: 15,
        variantOverrides: mock.variants.dosages.map(d => ({
          variantSku: d.sku,
          price: d.price * 10,
          salePrice: Math.round(d.price * 10 * 0.85),
        })),
      },
    ]

    const rating = +(4.5 + Math.random() * 0.5).toFixed(1)
    const reviewCount = Math.floor(Math.random() * 40) + 5

    try {
      await payload.update({
        collection: 'products',
        id: product.id,
        data: {
          description: product.description || mock.description,
          seoTitle: `${product.name} | Research Peptide | Sparta Labs`,
          seoDescription: `High-purity ${product.name} for laboratory research. ≥99% purity, LC-MS verified, COA included. Available in ${mock.variants.dosages.map(d => d.label).join(' & ')} vials. US-based shipping.`,
          hasVariants: !hasSingleVariant,
          variants,
          bulkBundles,
          averageRating: rating,
          reviewCount,
          productDetailsTitle: 'Product Details',
          productDetailsDescription: mock.detailsDescription,
          researchFocusTitle: 'Research Focus & Mechanism Overview',
          researchFocusDescription: mock.researchDescription,
          qualityPurityTitle: 'Quality & Purity Standards',
          qualityPurityDescription: 'Every batch is tested in-house and verified by independent third-party laboratories. Purity ≥99% by HPLC. Identity confirmed via LC-MS. Endotoxin levels <0.1 EU/mg. Heavy metals below ICH Q3D limits. Peptide content ≥80% by weight (net peptide). Certificate of Analysis (COA) available for download on this page.',
          complianceNoticeTitle: 'Compliance Notice',
          complianceNoticeDescription: 'This product is intended solely for in-vitro research and laboratory use. It is not a drug, food, supplement, or cosmetic. Not approved for human or veterinary use. Purchasers assume full responsibility for compliance with applicable local, state, and federal regulations. By purchasing, you confirm that you are a qualified researcher or institution and that this product will not be used for any unauthorized purpose.',
          faqs: mock.faqs,
          status: 'active',
          isVisible: true,
        } as any,
      })

      const dosageList = mock.variants.dosages.map(d => d.label).join(', ')
      console.log(`✓  ${product.name} — ${mock.variants.dosages.length} variant(s) [${dosageList}]${bulkBundles.length ? ` + ${bulkBundles.length} bulk bundles` : ''}`)
      updated++
    } catch (err: any) {
      console.error(`✗  Failed to update "${product.name}": ${err.message}`)
    }
  }

  console.log(`\nDone! Updated ${updated} products, skipped ${skipped}.`)
  process.exit(0)
}

run().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
