'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { DownloadIcon, FileTextIcon, ArrowRightIcon } from 'lucide-react'
import { FadeUp } from '@/components/motion/FadeUp'
import { CTASection } from '@/components/shared/CTASection'
import { StaggerChildren, staggerItemVariants } from '@/components/motion/StaggerChildren'
import { EyebrowHeading } from '@/components/editorial/EyebrowHeading'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type COA = {
  id: number
  product: string
  category: string
  purity: string
  batch: string
  analyzed: string
  coaUrl: string | null
}

const SAMPLE_COAS: COA[] = [
  { id: 1, product: 'BPC-157 (5mg)', category: 'Recovery', purity: '99.8%', batch: 'BPC-2603-A', analyzed: 'Mar 15, 2026', coaUrl: '/pdfs/sample.pdf' },
  { id: 2, product: 'BPC-157 (10mg)', category: 'Recovery', purity: '99.5%', batch: 'BPC-2604-B', analyzed: 'Mar 18, 2026', coaUrl: '/pdfs/sample.pdf' },
  { id: 3, product: 'TB-500 (5mg)', category: 'Recovery', purity: '99.1%', batch: 'TB-2601-A', analyzed: 'Feb 28, 2026', coaUrl: '/pdfs/sample.pdf' },
  { id: 4, product: 'CJC-1295 (No DAC)', category: 'Growth', purity: '99.4%', batch: 'CJC-2602-A', analyzed: 'Apr 05, 2026', coaUrl: null },
  { id: 5, product: 'Ipamorelin (5mg)', category: 'Growth', purity: '99.7%', batch: 'IPA-2601-C', analyzed: 'Jan 12, 2026', coaUrl: '/pdfs/sample.pdf' },
  { id: 6, product: 'GHK-Cu (50mg)', category: 'Cosmetic', purity: '99.9%', batch: 'GHK-2605-A', analyzed: 'May 02, 2026', coaUrl: '/pdfs/sample.pdf' },
  { id: 7, product: 'MOTS-c (10mg)', category: 'Metabolic', purity: '99.2%', batch: 'MOTS-2603-B', analyzed: 'Mar 22, 2026', coaUrl: '/pdfs/sample.pdf' },
  { id: 8, product: 'SS-31 (10mg)', category: 'Metabolic', purity: '99.6%', batch: 'SS-2604-A', analyzed: 'Apr 10, 2026', coaUrl: null },
  { id: 9, product: 'Epitalon (10mg)', category: 'Longevity', purity: '99.8%', batch: 'EPI-2601-A', analyzed: 'Jan 25, 2026', coaUrl: '/pdfs/sample.pdf' },
  { id: 10, product: 'Selank (5mg)', category: 'Cognitive', purity: '99.3%', batch: 'SEL-2602-B', analyzed: 'Feb 14, 2026', coaUrl: '/pdfs/sample.pdf' },
  { id: 11, product: 'Semax (5mg)', category: 'Cognitive', purity: '99.5%', batch: 'SMX-2603-A', analyzed: 'Mar 05, 2026', coaUrl: '/pdfs/sample.pdf' },
  { id: 12, product: 'Tesamorelin (2mg)', category: 'Growth', purity: '99.1%', batch: 'TES-2604-C', analyzed: 'Apr 18, 2026', coaUrl: null },
  { id: 13, product: 'AOD-9604 (2mg)', category: 'Metabolic', purity: '99.4%', batch: 'AOD-2605-A', analyzed: 'May 10, 2026', coaUrl: '/pdfs/sample.pdf' },
  { id: 14, product: 'Tirzepatide (5mg)', category: 'Metabolic', purity: '99.7%', batch: 'TIR-2601-B', analyzed: 'Jan 30, 2026', coaUrl: '/pdfs/sample.pdf' },
  { id: 15, product: 'Retatrutide (2mg)', category: 'Metabolic', purity: '99.8%', batch: 'RET-2602-A', analyzed: 'Feb 20, 2026', coaUrl: '/pdfs/sample.pdf' },
]

export default function CertificatesPage() {
  const [filter, setFilter] = useState('All')

  const categories = ['All', ...Array.from(new Set(SAMPLE_COAS.map(c => c.category))).sort()]
  
  const filteredCOAs = filter === 'All' 
    ? SAMPLE_COAS 
    : SAMPLE_COAS.filter(c => c.category === filter)

  return (
    <main className="bg-cream min-h-screen pt-32 pb-24">
      {/* Header */}
      <section className="px-6 mb-16 max-w-page mx-auto">
        <FadeUp>
          <EyebrowHeading gold>Verification</EyebrowHeading>
          <h1 className="text-display-lg font-serif text-ink mt-4 mb-6">Certificates of Analysis</h1>
          <p className="text-body-lg text-ink-muted max-w-prose mb-8">
            Transparency is not optional. We verify every batch through independent, third-party US laboratories using high-performance liquid chromatography (HPLC) and mass spectrometry (MS).
          </p>
          <div className="flex gap-4">
            <Link href="/shop">
              <Button size="lg" className="h-14 px-8 rounded-full bg-ink text-white hover:bg-[#1a1a1a] hover:shadow-lg transition-all duration-300 font-bold tracking-wider uppercase text-sm border-none">
                Shop Verified Products
              </Button>
            </Link>
          </div>
        </FadeUp>
      </section>

      {/* Filter and Table */}
      <section className="px-6 mb-32 max-w-page mx-auto">
        <FadeUp delay={0.1}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h2 className="text-editorial-md font-serif text-ink">Recent Testing Library</h2>
            <div className="w-full sm:w-64">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-strong">
                  <th className="py-4 px-4 text-label-md uppercase tracking-wider text-ink-muted font-normal">Product</th>
                  <th className="py-4 px-4 text-label-md uppercase tracking-wider text-ink-muted font-normal">Purity</th>
                  <th className="py-4 px-4 text-label-md uppercase tracking-wider text-ink-muted font-normal">Batch #</th>
                  <th className="py-4 px-4 text-label-md uppercase tracking-wider text-ink-muted font-normal">Analyzed</th>
                  <th className="py-4 px-4 text-label-md uppercase tracking-wider text-ink-muted font-normal text-right">COA Download</th>
                </tr>
              </thead>
              <tbody>
                {filteredCOAs.map((coa) => (
                  <tr key={coa.id} className="border-b border-border-subtle hover:bg-cream-warm transition-colors duration-fast">
                    <td className="py-6 px-4">
                      <div className="text-body-md font-medium text-ink">{coa.product}</div>
                      <div className="text-body-sm text-ink-muted mt-1">{coa.category}</div>
                    </td>
                    <td className="py-6 px-4 text-body-md text-ink">{coa.purity}</td>
                    <td className="py-6 px-4 text-body-md text-ink font-mono">{coa.batch}</td>
                    <td className="py-6 px-4 text-body-md text-ink-muted">{coa.analyzed}</td>
                    <td className="py-6 px-4 text-right">
                      {coa.coaUrl ? (
                        <a 
                          href={coa.coaUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-label-md uppercase tracking-wider text-gold hover:text-gold-dark transition-colors"
                        >
                          <FileTextIcon className="w-4 h-4" />
                          <span>PDF</span>
                        </a>
                      ) : (
                        <Link href="/contact" className="text-body-sm text-ink-muted hover:text-ink underline underline-offset-4 transition-colors">
                          Available on request
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-4">
            {filteredCOAs.map((coa) => (
              <div key={coa.id} className="bg-cream-warm border border-border-subtle rounded-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-body-md font-medium text-ink">{coa.product}</h3>
                    <span className="text-body-sm text-ink-muted">{coa.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-body-lg font-serif text-ink">{coa.purity}</span>
                    <span className="text-label-sm uppercase tracking-wider text-ink-muted">Purity</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-3 border-t border-b border-border-subtle mb-4">
                  <div>
                    <span className="block text-label-sm uppercase tracking-wider text-ink-muted mb-1">Batch</span>
                    <span className="text-body-sm font-mono text-ink">{coa.batch}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-label-sm uppercase tracking-wider text-ink-muted mb-1">Analyzed</span>
                    <span className="text-body-sm text-ink">{coa.analyzed}</span>
                  </div>
                </div>

                <div className="flex justify-center">
                  {coa.coaUrl ? (
                    <a 
                      href={coa.coaUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2 border border-gold text-label-md uppercase tracking-wider text-gold rounded-sm hover:bg-gold hover:text-cream transition-colors"
                    >
                      <DownloadIcon className="w-4 h-4" />
                      <span>Download COA</span>
                    </a>
                  ) : (
                    <Link href="/contact" className="w-full flex items-center justify-center gap-2 py-2 border border-border-strong text-label-md uppercase tracking-wider text-ink rounded-sm hover:bg-ink hover:text-cream transition-colors">
                      Request COA
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </FadeUp>
      </section>

      {/* Editorial Section */}
      <section className="px-6 mb-32 bg-cream-sand py-24">
        <div className="max-w-page mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <div className="relative w-full aspect-square md:aspect-[4/3] rounded-sm overflow-hidden">
                <Image 
                  src="/hero-image.png" 
                  alt="HPLC Testing Machine" 
                  fill 
                  className="object-cover"
                />
              </div>
            </FadeUp>
            
            <FadeUp delay={0.1}>
              <EyebrowHeading gold>The Process</EyebrowHeading>
              <h2 className="text-display-sm font-serif text-ink mt-4 mb-8">About our testing methodology</h2>
              <div className="text-body-lg text-ink-muted space-y-6">
                <p>
                  Every raw material we receive undergoes rigorous High-Performance Liquid Chromatography (HPLC) prior to compounding. This analytical technique separates, identifies, and quantifies each component in a mixture, ensuring absolute sequence accuracy.
                </p>
                <p>
                  Following synthesis and lyophilization, random samples from the finished batch are submitted to independent third-party laboratories. They perform secondary HPLC alongside Mass Spectrometry (MS) to verify that the molecular weight perfectly matches the target peptide structure and that purity exceeds our 99% baseline standard.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        subtitle="VERIFICATION"
        title="Demanding a higher standard."
        description="Learn more about why rigorous independent testing is the only way to guarantee reproducible research results."
        primaryButtonText="Explore Our Science"
        primaryButtonLink="/science"
        secondaryButtonText=""
        secondaryButtonLink=""
      />
    </main>
  )
}
