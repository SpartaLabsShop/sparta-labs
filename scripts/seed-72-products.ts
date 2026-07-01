import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import slugify from 'slugify'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const IMAGES_DIR = path.resolve(process.cwd(), 'public/new-products')
const DEFAULT_STOCK = 25

type Dosage = { label: string; price: number; kitPrice: number }
type Compound = {
  name: string
  skuCode: string
  category: string
  isDiluent?: boolean
  mechanism: string
  dosages: Dosage[]
}

// Prices/kit prices sourced directly from Sparta-Labs-Price-List-Official.pdf
const COMPOUNDS: Compound[] = [
  {
    name: 'AA Water',
    skuCode: 'AAW',
    category: 'Essentials',
    isDiluent: true,
    mechanism: 'Acetic acid water is a low-pH diluent used to reconstitute peptides that are prone to gelling or poor solubility in standard bacteriostatic water, particularly larger or more hydrophobic sequences.',
    dosages: [{ label: '10ml', price: 10, kitPrice: 70 }],
  },
  {
    name: 'AOD9604',
    skuCode: 'AOD',
    category: 'Metabolic Research Peptides',
    mechanism: 'AOD9604 is a modified fragment of the human growth hormone molecule (hGH 176-191) studied for its lipolytic activity in adipose tissue models without the glucogenic or growth-promoting effects associated with full-length GH.',
    dosages: [
      { label: '5mg', price: 80, kitPrice: 560 },
      { label: '10mg', price: 135, kitPrice: 945 },
    ],
  },
  {
    name: 'BAC Water',
    skuCode: 'BACW',
    category: 'Essentials',
    isDiluent: true,
    mechanism: 'Bacteriostatic water contains 0.9% benzyl alcohol as a preservative, allowing reconstituted peptide solutions to be stored for extended periods with reduced risk of microbial contamination.',
    dosages: [{ label: '10ml', price: 10, kitPrice: 70 }],
  },
  {
    name: 'BPC 157',
    skuCode: 'BPC157',
    category: 'Recovery Research Peptides',
    mechanism: 'BPC-157 is a synthetic pentadecapeptide derived from a partial sequence of body protection compound found in gastric juice, studied extensively in animal models for its role in angiogenesis, tendon and ligament healing, and gastrointestinal tissue repair.',
    dosages: [
      { label: '10mg', price: 50, kitPrice: 350 },
      { label: '20mg', price: 90, kitPrice: 630 },
    ],
  },
  {
    name: 'BPC157 10mg + TB500 10mg Blend',
    skuCode: 'BPCTB-B1',
    category: 'Recovery Research Peptides',
    mechanism: 'This blend combines BPC-157, studied for angiogenesis and gastrointestinal tissue repair, with TB-500 (a Thymosin Beta-4 fragment) studied for actin-binding activity and cell migration, for combined tissue-repair research protocols.',
    dosages: [{ label: '20mg', price: 135, kitPrice: 945 }],
  },
  {
    name: 'BPC157 5mg + TB500 5mg Blend',
    skuCode: 'BPCTB-B2',
    category: 'Recovery Research Peptides',
    mechanism: 'This lower-ratio blend pairs BPC-157 and TB-500 in equal proportions for researchers studying dose-dependent synergy between the two peptides in tissue-repair and recovery models.',
    dosages: [{ label: '10mg', price: 80, kitPrice: 560 }],
  },
  {
    name: 'Cagrilintide',
    skuCode: 'CAGRI',
    category: 'Metabolic Research Peptides',
    mechanism: 'Cagrilintide is a long-acting amylin receptor agonist studied for its role in appetite regulation and satiety signaling, often examined alongside GLP-1 receptor agonists for combined effects on energy intake in preclinical models.',
    dosages: [
      { label: '10mg', price: 115, kitPrice: 805 },
      { label: '20mg', price: 210, kitPrice: 1470 },
    ],
  },
  {
    name: 'CJC-1295 With DAC',
    skuCode: 'CJCDAC',
    category: 'Growth Factor Research Peptides',
    mechanism: 'CJC-1295 with DAC is a growth hormone releasing hormone (GHRH) analog modified with a Drug Affinity Complex that binds serum albumin, extending its half-life and producing sustained elevation of GH and IGF-1 levels in research models.',
    dosages: [
      { label: '5mg', price: 120, kitPrice: 840 },
      { label: '10mg', price: 220, kitPrice: 1540 },
    ],
  },
  {
    name: 'CJC-1295 Without DAC',
    skuCode: 'CJCNODAC',
    category: 'Growth Factor Research Peptides',
    mechanism: 'CJC-1295 without DAC (also known as Mod GRF 1-29) is a short-acting GHRH analog studied for producing sharp, pulsatile growth hormone release that more closely mimics natural GH secretion patterns than the DAC-conjugated variant.',
    dosages: [
      { label: '5mg', price: 65, kitPrice: 455 },
      { label: '10mg', price: 105, kitPrice: 735 },
    ],
  },
  {
    name: 'Epithalon',
    skuCode: 'EPI',
    category: 'Bioregulators',
    mechanism: 'Epithalon is a synthetic tetrapeptide (Ala-Glu-Asp-Gly) developed from pineal gland extract research, studied for its potential to activate telomerase activity and modulate circadian rhythm regulation in cellular aging models.',
    dosages: [
      { label: '10mg', price: 40, kitPrice: 280 },
      { label: '40mg', price: 125, kitPrice: 875 },
      { label: '50mg', price: 135, kitPrice: 945 },
    ],
  },
  {
    name: 'GHK-Cu',
    skuCode: 'GHKCU',
    category: 'Recovery Research Peptides',
    mechanism: 'GHK-Cu is a naturally occurring copper-binding tripeptide studied for its role in collagen and glycosaminoglycan synthesis, wound healing signaling, and anti-inflammatory activity in dermal and connective tissue research models.',
    dosages: [
      { label: '50mg', price: 30, kitPrice: 210 },
      { label: '100mg', price: 45, kitPrice: 315 },
    ],
  },
  {
    name: 'GHRP-2 Acetate',
    skuCode: 'GHRP2',
    category: 'Growth Factor Research Peptides',
    mechanism: 'GHRP-2 is a synthetic hexapeptide and ghrelin receptor agonist studied for its potent stimulation of growth hormone secretion via the pituitary gland, along with secondary effects on appetite signaling pathways.',
    dosages: [
      { label: '5mg', price: 30, kitPrice: 210 },
      { label: '10mg', price: 45, kitPrice: 315 },
    ],
  },
  {
    name: 'GHRP-6 Acetate',
    skuCode: 'GHRP6',
    category: 'Growth Factor Research Peptides',
    mechanism: 'GHRP-6 is a ghrelin receptor agonist studied for growth hormone secretagogue activity, distinguished in the literature by a more pronounced effect on appetite stimulation compared to other GHRP analogs.',
    dosages: [
      { label: '5mg', price: 30, kitPrice: 210 },
      { label: '10mg', price: 45, kitPrice: 315 },
    ],
  },
  {
    name: 'Glutathione',
    skuCode: 'GLUT',
    category: 'Cellular Health Research',
    mechanism: 'Glutathione is a tripeptide composed of glutamine, cysteine, and glycine, recognized as a principal intracellular antioxidant studied for its role in neutralizing reactive oxygen species and supporting cellular detoxification pathways.',
    dosages: [{ label: '1500mg', price: 80, kitPrice: 560 }],
  },
  {
    name: 'Hexarelin',
    skuCode: 'HEXA',
    category: 'Growth Factor Research Peptides',
    mechanism: 'Hexarelin is a potent synthetic growth hormone secretagogue and ghrelin receptor agonist, studied both for GH release and for independent cardioprotective signaling activity observed in cardiac tissue models.',
    dosages: [{ label: '5mg', price: 70, kitPrice: 490 }],
  },
  {
    name: 'IGF-1 LR3',
    skuCode: 'IGF1LR3',
    category: 'Growth Factor Research Peptides',
    mechanism: 'IGF-1 LR3 is a long-arginine analog of insulin-like growth factor 1 engineered to reduce binding-protein affinity, extending its half-life and making it a common tool in studies of muscle cell proliferation and hyperplasia.',
    dosages: [{ label: '1mg', price: 165, kitPrice: 1155 }],
  },
  {
    name: 'Ipamorelin',
    skuCode: 'IPAM',
    category: 'Growth Factor Research Peptides',
    mechanism: 'Ipamorelin is a selective ghrelin receptor agonist and growth hormone secretagogue studied for stimulating GH release with minimal impact on cortisol, prolactin, or acetylcholine levels compared to earlier-generation secretagogues.',
    dosages: [
      { label: '5mg', price: 35, kitPrice: 245 },
      { label: '10mg', price: 55, kitPrice: 385 },
    ],
  },
  {
    name: 'KissPeptin-10',
    skuCode: 'KISS10',
    category: 'Receptor Agonist Research Peptides',
    mechanism: 'Kisspeptin-10 is a decapeptide fragment and potent agonist of the kisspeptin receptor (KISS1R/GPR54), studied in reproductive endocrinology research for its role in regulating GnRH pulsatility and the hypothalamic-pituitary-gonadal axis.',
    dosages: [
      { label: '5mg', price: 45, kitPrice: 315 },
      { label: '10mg', price: 65, kitPrice: 455 },
    ],
  },
  {
    name: 'KLOW (GHK-Cu+TB500+BPC157+KPV Blend)',
    skuCode: 'KLOW',
    category: 'Recovery Research Peptides',
    mechanism: 'KLOW combines four extensively studied recovery-focused peptides — GHK-Cu, TB-500, BPC-157, and KPV — into a single blend for researchers studying combined effects on tissue repair, angiogenesis, and localized inflammatory response.',
    dosages: [{ label: '80mg', price: 175, kitPrice: 1225 }],
  },
  {
    name: 'KPV',
    skuCode: 'KPV',
    category: 'Recovery Research Peptides',
    mechanism: 'KPV is the C-terminal tripeptide fragment of alpha-MSH, studied for potent anti-inflammatory activity that occurs independently of melanocortin receptor-driven pigmentation effects, with particular research interest in gut inflammation models.',
    dosages: [
      { label: '10mg', price: 50, kitPrice: 350 },
      { label: '30mg', price: 135, kitPrice: 945 },
    ],
  },
  {
    name: 'Mazdutide',
    skuCode: 'MAZD',
    category: 'Metabolic Research Peptides',
    mechanism: 'Mazdutide is a dual GLP-1/glucagon receptor agonist studied for combined effects on appetite suppression and energy expenditure, positioning it among the newer generation of multi-receptor metabolic research peptides.',
    dosages: [
      { label: '5mg', price: 100, kitPrice: 700 },
      { label: '10mg', price: 170, kitPrice: 1190 },
    ],
  },
  {
    name: 'MOTS-C',
    skuCode: 'MOTSC',
    category: 'Metabolic Research Peptides',
    mechanism: 'MOTS-C is a mitochondrial-derived peptide studied for its role in activating AMPK signaling and regulating cellular metabolic homeostasis, frequently investigated as an exercise-mimetic in metabolic research models.',
    dosages: [
      { label: '10mg', price: 50, kitPrice: 350 },
      { label: '40mg', price: 155, kitPrice: 1085 },
    ],
  },
  {
    name: 'MT2',
    skuCode: 'MT2',
    category: 'Receptor Agonist Research Peptides',
    mechanism: 'MT2 (Melanotan II) is a non-selective melanocortin receptor agonist studied primarily for its activation of melanogenesis pathways via MC1R, with secondary research interest in MC4R-mediated pathways.',
    dosages: [{ label: '10mg', price: 55, kitPrice: 385 }],
  },
  {
    name: 'NA Selank Amidate',
    skuCode: 'NASEL',
    category: 'Cognitive Function Studies',
    mechanism: 'NA Selank Amidate is an N-acetylated, amidated analog of Selank formulated for improved stability, studied as a heptapeptide with anxiolytic and nootropic activity linked to modulation of GABA and enkephalase pathways.',
    dosages: [{ label: '30mg', price: 120, kitPrice: 840 }],
  },
  {
    name: 'NA Semax Amidate',
    skuCode: 'NASEM',
    category: 'Cognitive Function Studies',
    mechanism: 'NA Semax Amidate is a modified, amidated analog of Semax, an ACTH(4-10) heptapeptide fragment studied for neuroprotective activity and upregulation of BDNF expression in cognitive and neurological research models.',
    dosages: [{ label: '30mg', price: 120, kitPrice: 840 }],
  },
  {
    name: 'NAD+',
    skuCode: 'NAD',
    category: 'Cellular Health Research',
    mechanism: 'NAD+ (nicotinamide adenine dinucleotide) is a coenzyme central to cellular energy metabolism, studied for its role in mitochondrial function, sirtuin activation, and DNA repair pathways implicated in cellular aging research.',
    dosages: [
      { label: '500mg', price: 65, kitPrice: 455 },
      { label: '1000mg', price: 110, kitPrice: 770 },
    ],
  },
  {
    name: 'Oxytocin Acetate',
    skuCode: 'OXY',
    category: 'Receptor Agonist Research Peptides',
    mechanism: 'Oxytocin Acetate is the acetate salt form of the neuropeptide oxytocin, an oxytocin receptor agonist widely studied in behavioral neuroscience research for its role in social bonding and neuroendocrine signaling.',
    dosages: [
      { label: '5mg', price: 45, kitPrice: 315 },
      { label: '10mg', price: 55, kitPrice: 385 },
    ],
  },
  {
    name: 'Pinealon',
    skuCode: 'PINE',
    category: 'Bioregulators',
    mechanism: 'Pinealon is a synthetic tripeptide bioregulator studied for neuroprotective activity and support of pineal gland function, with research interest centered on cognitive aging and neuronal cell regulation models.',
    dosages: [
      { label: '10mg', price: 55, kitPrice: 385 },
      { label: '20mg', price: 85, kitPrice: 595 },
    ],
  },
  {
    name: 'PT-141',
    skuCode: 'PT141',
    category: 'Receptor Agonist Research Peptides',
    mechanism: 'PT-141 (Bremelanotide) is a melanocortin 4 receptor (MC4R) agonist studied in preclinical models for its role in central nervous system pathways associated with sexual arousal signaling.',
    dosages: [{ label: '10mg', price: 45, kitPrice: 315 }],
  },
  {
    name: 'Retatrutide',
    skuCode: 'RETA',
    category: 'Metabolic Research Peptides',
    mechanism: 'Retatrutide is a novel triple-agonist peptide activating GLP-1, GIP, and glucagon receptors simultaneously, studied for synergistic effects on metabolic pathways, energy homeostasis, and body composition in preclinical models.',
    dosages: [
      { label: '10mg', price: 80, kitPrice: 560 },
      { label: '20mg', price: 125, kitPrice: 875 },
      { label: '30mg', price: 155, kitPrice: 1085 },
      { label: '50mg', price: 225, kitPrice: 1575 },
    ],
  },
  {
    name: 'Selank',
    skuCode: 'SELANK',
    category: 'Cognitive Function Studies',
    mechanism: 'Selank is a synthetic analog of the immunomodulatory peptide tuftsin, studied for anxiolytic and nootropic activity along with effects on BDNF expression and immune signaling in neurobehavioral research models.',
    dosages: [
      { label: '10mg', price: 50, kitPrice: 350 },
      { label: '30mg', price: 110, kitPrice: 770 },
    ],
  },
  {
    name: 'Semaglutide',
    skuCode: 'SEMAG',
    category: 'Metabolic Research Peptides',
    mechanism: 'Semaglutide is a GLP-1 receptor agonist extensively studied in incretin research for its effects on glucose-dependent insulin secretion, gastric emptying, and appetite regulation pathways.',
    dosages: [
      { label: '10mg', price: 50, kitPrice: 350 },
      { label: '20mg', price: 70, kitPrice: 490 },
      { label: '30mg', price: 90, kitPrice: 630 },
    ],
  },
  {
    name: 'Semax',
    skuCode: 'SEMAX',
    category: 'Cognitive Function Studies',
    mechanism: 'Semax is a heptapeptide analog of ACTH(4-10) studied extensively for neuroprotective activity and upregulation of BDNF and NGF expression in models of cognitive performance and neuronal stress.',
    dosages: [
      { label: '10mg', price: 50, kitPrice: 350 },
      { label: '30mg', price: 110, kitPrice: 770 },
    ],
  },
  {
    name: 'SS-31',
    skuCode: 'SS31',
    category: 'Cellular Health Research',
    mechanism: 'SS-31 (Elamipretide) is a mitochondria-targeted peptide that selectively binds cardiolipin on the inner mitochondrial membrane, studied for its role in reducing oxidative stress and preserving mitochondrial bioenergetics.',
    dosages: [
      { label: '10mg', price: 75, kitPrice: 525 },
      { label: '50mg', price: 280, kitPrice: 1960 },
    ],
  },
  {
    name: 'TB-500 (TB4)',
    skuCode: 'TB500',
    category: 'Recovery Research Peptides',
    mechanism: 'TB-500 is a synthetic fragment of Thymosin Beta-4 studied for actin-binding activity that promotes cell migration, angiogenesis, and tissue repair signaling across muscle, tendon, and dermal research models.',
    dosages: [
      { label: '5mg', price: 60, kitPrice: 420 },
      { label: '10mg', price: 115, kitPrice: 805 },
      { label: '20mg', price: 165, kitPrice: 1155 },
    ],
  },
  {
    name: 'Tesamorelin',
    skuCode: 'TESA',
    category: 'Growth Factor Research Peptides',
    mechanism: 'Tesamorelin is a GHRH analog studied for stimulating endogenous growth hormone release, with a body of research literature focused specifically on its effects on visceral adipose tissue reduction.',
    dosages: [
      { label: '5mg', price: 70, kitPrice: 490 },
      { label: '10mg', price: 120, kitPrice: 840 },
      { label: '20mg', price: 225, kitPrice: 1575 },
    ],
  },
  {
    name: 'Thymosin Alpha-1',
    skuCode: 'TA1',
    category: 'Recovery Research Peptides',
    mechanism: 'Thymosin Alpha-1 is an immune-modulating peptide studied for its role in regulating T-cell maturation and function, with broad research interest across immunology and infectious disease models.',
    dosages: [
      { label: '5mg', price: 70, kitPrice: 490 },
      { label: '10mg', price: 120, kitPrice: 840 },
    ],
  },
  {
    name: 'Tirzepatide',
    skuCode: 'TIRZ',
    category: 'Metabolic Research Peptides',
    mechanism: 'Tirzepatide is a dual GLP-1/GIP receptor agonist studied for synergistic incretin activity, with research literature examining its combined effects on glycemic control, appetite regulation, and body composition.',
    dosages: [
      { label: '10mg', price: 50, kitPrice: 350 },
      { label: '20mg', price: 70, kitPrice: 490 },
      { label: '30mg', price: 90, kitPrice: 630 },
      { label: '50mg', price: 130, kitPrice: 910 },
    ],
  },
]

const QUALITY_TEXT =
  'Every batch is tested in-house and verified by independent third-party laboratories. Purity ≥99% by HPLC. Identity confirmed via LC-MS. Endotoxin levels <0.1 EU/mg. Heavy metals below ICH Q3D limits. Peptide content ≥80% by weight (net peptide). Certificate of Analysis (COA) available for download on this page.'

const DILUENT_QUALITY_TEXT =
  'Every batch is produced under controlled conditions and passes 0.2 micron sterile filtration. Each lot is tested for sterility, endotoxin levels (<0.1 EU/mL), and pH. Certificate of Analysis (COA) available for download on this page.'

const COMPLIANCE_TEXT =
  'This product is intended solely for in-vitro research and laboratory use. It is not a drug, food, supplement, or cosmetic. Not approved for human or veterinary use. Purchasers assume full responsibility for compliance with applicable local, state, and federal regulations. By purchasing, you confirm that you are a qualified researcher or institution and that this product will not be used for any unauthorized purpose.'

function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-z0-9]/g, '')
}

function findImageFile(dirFiles: string[], compoundName: string, dosageLabel: string): string {
  const target = norm(`${compoundName} ${dosageLabel}`)
  const match = dirFiles.find((f) => norm(f) === target)
  if (!match) {
    throw new Error(
      `No image match for "${compoundName} ${dosageLabel}" (normalized target: "${target}"). Check filenames in ${IMAGES_DIR}.`,
    )
  }
  return match
}

function buildContent(compound: Compound) {
  const { name, mechanism, isDiluent, dosages } = compound
  const dosageList = dosages.map((d) => d.label).join(', ')

  const description = isDiluent
    ? `${name} is a sterile diluent used for reconstituting lyophilized research peptides prior to laboratory use. ${mechanism} Supplied in a sealed, sterile vial, manufactured under controlled conditions with 0.2 micron filtration. For laboratory and research use only. Not for human or veterinary use.`
    : `${name} is a high-purity research compound supplied as a lyophilized powder in a sealed, sterile glass vial. ${mechanism} Manufactured using solid-phase peptide synthesis (SPPS) and purified via preparative HPLC to ≥99% purity, with identity confirmed by LC-MS. Reconstitute with sterile bacteriostatic water before use. Store lyophilized vials at -20°C for long-term storage or 2-8°C for short-term. For laboratory and research use only. Not for human or veterinary use.`

  const productDetailsDescription = isDiluent
    ? `${name} is manufactured under controlled conditions and passes through 0.2 micron sterile filtration to remove particulate contamination. ${mechanism} Supplied in a sealed, sterile vial with a rubber septum for repeated sterile draws. Store at 2-8°C after opening and discard if solution becomes cloudy or discolored.`
    : `${name} is synthesized using advanced solid-phase peptide synthesis (SPPS) technology and purified to ≥99% via preparative HPLC. Each vial contains lyophilized peptide verified by electrospray ionization mass spectrometry (ESI-MS) for exact molecular mass confirmation. The lyophilization process is performed under inert nitrogen atmosphere to prevent oxidation and ensure maximum shelf stability. Reconstitute with bacteriostatic water for optimal peptide preservation. Store reconstituted solutions at 2-8°C and use within 30 days.`

  const researchFocusDescription = isDiluent
    ? `${mechanism} Researchers should select the appropriate diluent based on the solubility profile of the specific peptide being reconstituted, as some sequences are prone to gelling or precipitation in standard bacteriostatic water.`
    : `${mechanism} Researchers should note the compound's stability profile under various buffer conditions when designing experimental protocols. Recommended for use in comparative pharmacological profiling, receptor binding assays, dose-response characterization, and mechanistic pathway studies.`

  const faqs: { question: string; answer: string }[] = isDiluent
    ? [
        {
          question: `What is ${name} used for?`,
          answer: `${name} is used exclusively to reconstitute lyophilized research peptides prior to laboratory use. It is not a compound under study itself.`,
        },
        {
          question: `How should I store ${name}?`,
          answer:
            'Store refrigerated at 2-8°C. Once opened, use within the timeframe recommended for the specific peptide being reconstituted, and discard if the solution becomes cloudy or discolored.',
        },
        {
          question: 'Is this product approved for human use?',
          answer:
            'No. All Sparta Labs products are strictly intended for in-vitro laboratory research only. They are not drugs, supplements, or food products. Not approved by the FDA or any regulatory body for human or veterinary use.',
        },
      ]
    : [
        {
          question: `How should I reconstitute ${name}?`,
          answer:
            'Slowly inject bacteriostatic water along the inside wall of the vial to avoid foaming. Do not shake — gently swirl until the powder is fully dissolved. Use sterile technique throughout. Store reconstituted solution refrigerated at 2-8°C and use within 30 days.',
        },
        {
          question: `What purity is guaranteed for ${name}?`,
          answer:
            'Every batch is tested in-house via HPLC and independently verified by third-party LC-MS analysis. We guarantee a minimum purity of ≥99%. Certificates of Analysis (COA) are available for download on each product page.',
        },
        {
          question: `How should I store ${name}?`,
          answer:
            'Store lyophilized (unreconstituted) vials at -20°C for long-term storage or 2-8°C for short-term. Protect from light and moisture. Reconstituted peptide should be kept refrigerated at 2-8°C and used within 30 days. Avoid repeated freeze-thaw cycles.',
        },
        {
          question: 'Is this product approved for human use?',
          answer:
            'No. All Sparta Labs products are strictly intended for in-vitro laboratory research only. They are not drugs, supplements, or food products. Not approved by the FDA or any regulatory body for human or veterinary use.',
        },
      ]

  if (dosages.length > 1) {
    faqs.splice(faqs.length - 1, 0, {
      question: `What is the difference between the ${dosageList} vials?`,
      answer: `Both vials contain the same ${name} at identical purity. The only difference is the amount of lyophilized peptide per vial. Choose based on your research protocol's dosing requirements.`,
    })
  }

  const seoTitle = isDiluent
    ? `${name} | Peptide Reconstitution Diluent | Sparta Labs`
    : `${name} | Research Peptide | Sparta Labs`

  const seoDescription = isDiluent
    ? `Sterile ${name} for reconstituting research peptides. 0.2 micron filtered, sterility tested. Available in ${dosageList}. US-based shipping.`
    : `High-purity ${name} for laboratory research. ≥99% purity, LC-MS verified, COA included. Available in ${dosageList} vials. US-based shipping.`

  return {
    description,
    productDetailsDescription,
    researchFocusDescription,
    faqs,
    seoTitle,
    seoDescription,
  }
}

async function run() {
  console.log('Initializing Payload...')
  const { getPayload } = await import('payload')
  const config = (await import('../src/payload.config')).default
  const payload = await getPayload({ config })

  if (!fs.existsSync(IMAGES_DIR)) {
    throw new Error(`Images directory not found: ${IMAGES_DIR}`)
  }
  const dirFiles = fs.readdirSync(IMAGES_DIR).filter((f) => f.toLowerCase().endsWith('.webp'))
  console.log(`Found ${dirFiles.length} images in ${IMAGES_DIR}`)

  const { docs: categories } = await payload.find({ collection: 'categories', limit: 100 })
  const categoryMap = new Map(categories.map((c: any) => [c.name, c.id]))

  const requiredCategories = Array.from(new Set(COMPOUNDS.map((c) => c.category)))
  for (const catName of requiredCategories) {
    if (categoryMap.has(catName)) continue
    const catSlug = slugify(catName, { lower: true, strict: true })
    const newCat = await payload.create({
      collection: 'categories',
      data: { name: catName, slug: catSlug, isVisible: true },
    })
    categoryMap.set(catName, newCat.id)
    console.log(`+ Created missing category: ${catName}`)
  }

  let created = 0
  let skipped = 0
  let failed = 0

  for (const compound of COMPOUNDS) {
    const slug = slugify(compound.name, { lower: true, strict: true })

    try {
      const existing = await payload.find({
        collection: 'products',
        where: { slug: { equals: slug } },
        limit: 1,
      })
      if (existing.docs.length > 0) {
        console.log(`Skip (already exists): ${compound.name}`)
        skipped++
        continue
      }

      const categoryId = categoryMap.get(compound.category)
      if (!categoryId) {
        throw new Error(`Category "${compound.category}" could not be found or created.`)
      }

      const dosageMedia: { dosage: Dosage; mediaId: string | number }[] = []
      for (const dosage of compound.dosages) {
        const file = findImageFile(dirFiles, compound.name, dosage.label)
        const filePath = path.join(IMAGES_DIR, file)
        const fileBuffer = fs.readFileSync(filePath)

        const media = await payload.create({
          collection: 'media',
          data: { alt: `${compound.name} ${dosage.label} research peptide vial – Sparta Labs` },
          file: {
            data: fileBuffer,
            mimetype: 'image/webp',
            name: file,
            size: fs.statSync(filePath).size,
          },
        })
        dosageMedia.push({ dosage, mediaId: media.id })
      }

      const hasVariants = compound.dosages.length > 1
      const content = buildContent(compound)

      const productData: Record<string, any> = {
        name: compound.name,
        description: content.description,
        images: dosageMedia.map((dm) => ({ image: dm.mediaId })),
        seoTitle: content.seoTitle,
        seoDescription: content.seoDescription,
        slug,
        stock: DEFAULT_STOCK,
        categories: [categoryId],
        hasVariants,
        productDetailsTitle: 'Product Details',
        productDetailsDescription: content.productDetailsDescription,
        researchFocusTitle: 'Research Focus & Mechanism Overview',
        researchFocusDescription: content.researchFocusDescription,
        qualityPurityTitle: 'Quality & Purity Standards',
        qualityPurityDescription: compound.isDiluent ? DILUENT_QUALITY_TEXT : QUALITY_TEXT,
        complianceNoticeTitle: 'Compliance Notice',
        complianceNoticeDescription: COMPLIANCE_TEXT,
        faqs: content.faqs,
        status: 'active',
        isVisible: true,
      }

      if (hasVariants) {
        productData.price = compound.dosages[0].price
        productData.variants = dosageMedia.map(({ dosage, mediaId }) => ({
          sku: `${compound.skuCode}-${dosage.label.toUpperCase()}`,
          image: mediaId,
          price: dosage.price,
          stock: DEFAULT_STOCK,
          options: [{ key: 'Dosage', value: dosage.label }],
        }))
        productData.bulkBundles = [
          {
            name: '10 Vial Kit',
            quantity: 10,
            variantOverrides: dosageMedia.map(({ dosage }) => ({
              variantSku: `${compound.skuCode}-${dosage.label.toUpperCase()}`,
              price: dosage.kitPrice,
            })),
          },
        ]
      } else {
        const dosage = compound.dosages[0]
        productData.sku = `${compound.skuCode}-${dosage.label.toUpperCase()}`
        productData.price = dosage.price
        productData.bulkBundles = [
          {
            name: '10 Vial Kit',
            quantity: 10,
            price: dosage.kitPrice,
          },
        ]
      }

      await payload.create({ collection: 'products', data: productData as any })

      const dosageList = compound.dosages.map((d) => d.label).join(', ')
      console.log(`✓  ${compound.name} — [${dosageList}]`)
      created++
    } catch (err: any) {
      console.error(`✗  Failed "${compound.name}": ${err.message}`)
      failed++
    }
  }

  console.log(`\nDone. Created ${created}, skipped ${skipped}, failed ${failed}.`)
  process.exit(failed > 0 ? 1 : 0)
}

run().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
