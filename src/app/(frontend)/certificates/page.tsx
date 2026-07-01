import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { CertificatesClient, type COA } from './CertificatesClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Certificates of Analysis | Sparta Labs',
  description: 'Independent, third-party lab-verified Certificates of Analysis for every batch we release.',
}

export default async function CertificatesPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'products',
    where: {
      status: { equals: 'active' },
      isVisible: { equals: true },
    },
    sort: 'name',
    limit: 200,
    depth: 2,
    overrideAccess: true,
  })

  const coas: COA[] = docs.map((p: any) => ({
    id: p.id,
    product: p.name,
    category: typeof p.categories?.[0] === 'object' && p.categories[0]?.name ? p.categories[0].name : 'Research',
    purity: p.coaPurity || null,
    batch: p.coaBatchNumber || null,
    analyzed: p.coaAnalyzedDate
      ? new Date(p.coaAnalyzedDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      : null,
    coaUrl: typeof p.coaFile === 'object' && p.coaFile?.url ? p.coaFile.url : null,
  }))

  return <CertificatesClient coas={coas} />
}
