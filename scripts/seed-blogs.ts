import { getPayload } from 'payload'
import config from '../src/payload.config'

const blogPosts = [
  {
    title: 'BPC-157: The Ultimate Healing Peptide for Accelerated Tissue Recovery',
    slug: 'bpc-157-healing-peptide-tissue-recovery',
    status: 'published',
    publishedAt: new Date('2026-06-20').toISOString(),
    content: {
      root: {
        type: 'root',
        children: [
          { type: 'paragraph', children: [{ type: 'text', text: 'BPC-157, or Body Protection Compound-157, is a synthetic peptide derived from a protein found in human gastric juice. It has gained significant attention in research for its remarkable regenerative properties, particularly in accelerating tissue repair across muscles, tendons, ligaments, and the gastrointestinal tract.' }], direction: 'ltr', format: '', indent: 0, version: 1 },
          { type: 'paragraph', children: [{ type: 'text', text: 'Studies have demonstrated that BPC-157 promotes angiogenesis — the formation of new blood vessels — which is critical for delivering nutrients and oxygen to damaged tissues. This mechanism is believed to be one of the primary pathways through which the peptide accelerates healing.' }], direction: 'ltr', format: '', indent: 0, version: 1 },
          { type: 'paragraph', children: [{ type: 'text', text: 'Additionally, BPC-157 has shown anti-inflammatory effects, reducing levels of pro-inflammatory cytokines while simultaneously upregulating growth factors. In animal models, it has demonstrated the ability to heal severed Achilles tendons, repair damaged intestinal linings, and even counteract the toxic effects of certain compounds on the liver.' }], direction: 'ltr', format: '', indent: 0, version: 1 },
          { type: 'paragraph', children: [{ type: 'text', text: 'Current research is exploring its potential applications in treating inflammatory bowel disease, musculoskeletal injuries, and neurological damage. While human clinical trials remain limited, the preclinical data is compelling enough to warrant continued investigation into this promising peptide.' }], direction: 'ltr', format: '', indent: 0, version: 1 },
        ],
        direction: 'ltr', format: '', indent: 0, version: 1,
      },
    },
  },
  {
    title: 'Understanding the Role of GHK-Cu in Cellular Rejuvenation',
    slug: 'ghk-cu-cellular-rejuvenation',
    status: 'published',
    publishedAt: new Date('2026-06-18').toISOString(),
    content: {
      root: {
        type: 'root',
        children: [
          { type: 'paragraph', children: [{ type: 'text', text: 'GHK-Cu (glycyl-L-histidyl-L-lysine copper complex) is a naturally occurring tripeptide-copper complex found in human plasma, saliva, and urine. Its concentration in plasma decreases significantly with age, dropping from approximately 200 ng/mL at age 20 to 80 ng/mL by age 60.' }], direction: 'ltr', format: '', indent: 0, version: 1 },
          { type: 'paragraph', children: [{ type: 'text', text: 'Research has revealed that GHK-Cu plays a fundamental role in tissue remodeling and repair. It stimulates collagen and glycosaminoglycan synthesis in skin fibroblasts, promotes blood vessel formation, and enhances the function of dermal stem cells. These properties make it a subject of intense study in the fields of wound healing and anti-aging research.' }], direction: 'ltr', format: '', indent: 0, version: 1 },
          { type: 'paragraph', children: [{ type: 'text', text: 'Beyond its regenerative effects on skin, GHK-Cu has demonstrated anti-inflammatory and antioxidant properties. It modulates the expression of multiple genes involved in tissue repair, with studies showing it can reset gene expression patterns of damaged cells toward a healthier state.' }], direction: 'ltr', format: '', indent: 0, version: 1 },
          { type: 'paragraph', children: [{ type: 'text', text: 'The peptide also shows promise in hair follicle regeneration research, with studies indicating it can increase hair follicle size and stimulate hair growth. As research continues, GHK-Cu represents one of the most versatile peptides in regenerative medicine studies.' }], direction: 'ltr', format: '', indent: 0, version: 1 },
        ],
        direction: 'ltr', format: '', indent: 0, version: 1,
      },
    },
  },
  {
    title: 'TB-500: Mechanisms of Tissue Repair and Inflammation Reduction',
    slug: 'tb-500-tissue-repair-inflammation',
    status: 'published',
    publishedAt: new Date('2026-06-15').toISOString(),
    content: {
      root: {
        type: 'root',
        children: [
          { type: 'paragraph', children: [{ type: 'text', text: 'TB-500, a synthetic version of the naturally occurring peptide Thymosin Beta-4, is a 43-amino acid peptide that plays a crucial role in cell migration, blood cell and vessel development, and cellular differentiation. It is found in virtually all tissues and cell types, underscoring its fundamental biological importance.' }], direction: 'ltr', format: '', indent: 0, version: 1 },
          { type: 'paragraph', children: [{ type: 'text', text: 'The primary mechanism of TB-500 centers on its ability to upregulate actin, a cell-building protein essential for cell structure and movement. By promoting actin polymerization, TB-500 facilitates cell migration to sites of injury, enabling faster tissue repair and regeneration.' }], direction: 'ltr', format: '', indent: 0, version: 1 },
          { type: 'paragraph', children: [{ type: 'text', text: 'In preclinical studies, TB-500 has shown remarkable efficacy in reducing inflammation through downregulation of inflammatory cytokines. It has been studied in the context of cardiac repair following myocardial infarction, where it demonstrated the ability to promote cardiomyocyte survival and reduce scar formation.' }], direction: 'ltr', format: '', indent: 0, version: 1 },
          { type: 'paragraph', children: [{ type: 'text', text: 'Research also points to TB-500\'s neuroprotective properties, with studies exploring its potential in treating traumatic brain injuries and neurodegenerative conditions. Its small molecular size allows it to travel efficiently through tissues, making it particularly effective for reaching damaged areas.' }], direction: 'ltr', format: '', indent: 0, version: 1 },
        ],
        direction: 'ltr', format: '', indent: 0, version: 1,
      },
    },
  },
  {
    title: 'Ipamorelin vs. CJC-1295: A Deep Dive into Growth Hormone Secretagogues',
    slug: 'ipamorelin-vs-cjc-1295-growth-hormone',
    status: 'published',
    publishedAt: new Date('2026-06-12').toISOString(),
    content: {
      root: {
        type: 'root',
        children: [
          { type: 'paragraph', children: [{ type: 'text', text: 'Growth hormone secretagogues (GHS) represent a class of peptides that stimulate the pituitary gland to produce and release growth hormone. Among the most widely studied are Ipamorelin and CJC-1295, each with distinct mechanisms of action and pharmacological profiles.' }], direction: 'ltr', format: '', indent: 0, version: 1 },
          { type: 'paragraph', children: [{ type: 'text', text: 'Ipamorelin is a selective growth hormone secretagogue that mimics ghrelin, binding to the ghrelin receptor (GHSR) in the pituitary gland. What sets Ipamorelin apart is its remarkable selectivity — it stimulates GH release without significantly affecting cortisol, prolactin, or ACTH levels, making it one of the cleanest GHS peptides available for research.' }], direction: 'ltr', format: '', indent: 0, version: 1 },
          { type: 'paragraph', children: [{ type: 'text', text: 'CJC-1295, particularly the DAC (Drug Affinity Complex) variant, operates through a different pathway. It is a synthetic analog of growth hormone-releasing hormone (GHRH) that extends the half-life of endogenous GHRH. The DAC modification allows it to bind to albumin in the bloodstream, extending its half-life from minutes to approximately 8 days.' }], direction: 'ltr', format: '', indent: 0, version: 1 },
          { type: 'paragraph', children: [{ type: 'text', text: 'When used in combination in research settings, Ipamorelin and CJC-1295 create a synergistic effect — CJC-1295 amplifies the GH pulse while Ipamorelin initiates it. This combination has become a standard protocol in peptide research focused on growth hormone optimization, body composition, and recovery studies.' }], direction: 'ltr', format: '', indent: 0, version: 1 },
        ],
        direction: 'ltr', format: '', indent: 0, version: 1,
      },
    },
  },
  {
    title: 'Proper Storage and Reconstitution of Lyophilized Peptides: A Complete Guide',
    slug: 'storage-reconstitution-lyophilized-peptides',
    status: 'published',
    publishedAt: new Date('2026-06-10').toISOString(),
    content: {
      root: {
        type: 'root',
        children: [
          { type: 'paragraph', children: [{ type: 'text', text: 'Proper handling of lyophilized (freeze-dried) peptides is essential for maintaining their structural integrity and biological activity. This guide covers best practices for storage, reconstitution, and handling that every researcher should follow.' }], direction: 'ltr', format: '', indent: 0, version: 1 },
          { type: 'paragraph', children: [{ type: 'text', text: 'Lyophilized peptides should be stored at -20°C or lower for long-term stability. At these temperatures, most peptides remain stable for years. Avoid repeated freeze-thaw cycles, as these can degrade the peptide through ice crystal formation and oxidation. If you need to use a peptide multiple times, aliquot the reconstituted solution into single-use vials before freezing.' }], direction: 'ltr', format: '', indent: 0, version: 1 },
          { type: 'paragraph', children: [{ type: 'text', text: 'For reconstitution, bacteriostatic water (BAC water) is the preferred solvent for most peptides. The bacteriostatic agent (0.9% benzyl alcohol) prevents microbial growth, allowing the reconstituted peptide to be stored for up to 28 days when refrigerated at 2-8°C. When reconstituting, add the solvent slowly along the wall of the vial — never inject directly onto the lyophilized powder, as this can denature the peptide.' }], direction: 'ltr', format: '', indent: 0, version: 1 },
          { type: 'paragraph', children: [{ type: 'text', text: 'Once reconstituted, gently swirl the vial to dissolve the peptide completely. Do not shake vigorously, as this introduces air bubbles and can cause protein aggregation. Store the reconstituted solution in a refrigerator at 2-8°C, protected from light. Following these protocols ensures maximum potency and reproducible results in your research.' }], direction: 'ltr', format: '', indent: 0, version: 1 },
        ],
        direction: 'ltr', format: '', indent: 0, version: 1,
      },
    },
  },
]

async function seed() {
  const payload = await getPayload({ config })

  // Find first user to use as author
  const { docs: users } = await payload.find({ collection: 'users', limit: 1 })
  if (users.length === 0) {
    console.error('No users found. Create a user first.')
    process.exit(1)
  }
  const authorId = users[0].id

  for (const post of blogPosts) {
    const existing = await payload.find({
      collection: 'blog-posts',
      where: { slug: { equals: post.slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`Skipping "${post.title}" — already exists`)
      continue
    }

    await payload.create({
      collection: 'blog-posts',
      data: {
        ...post,
        author: authorId,
      } as any,
    })
    console.log(`Created: ${post.title}`)
  }

  console.log('Done seeding blog posts!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed error:', err)
  process.exit(1)
})
