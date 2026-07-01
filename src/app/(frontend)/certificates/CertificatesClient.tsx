'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { DownloadIcon, FileTextIcon } from 'lucide-react'
import { FadeUp } from '@/components/motion/FadeUp'
import { CTASection } from '@/components/shared/CTASection'
import { HeroBreadcrumb } from '@/components/shared/HeroBreadcrumb'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type COA = {
  id: string | number
  product: string
  category: string
  purity: string | null
  batch: string | null
  analyzed: string | null
  coaUrl: string | null
}

export function CertificatesClient({ coas }: { coas: COA[] }) {
  const [filter, setFilter] = useState('All')

  const categories = ['All', ...Array.from(new Set(coas.map((c) => c.category))).sort()]

  const filteredCOAs = filter === 'All' ? coas : coas.filter((c) => c.category === filter)

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Banner */}
      <section className="px-4 md:px-8 container mx-auto mt-24 mb-8 lg:mb-12">
        <div className="relative w-full h-[250px] md:h-[350px] rounded-lg overflow-hidden bg-ink">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute inset-0 w-full h-[120%]">
              <Image
                src="https://res.cloudinary.com/denskvdyt/image/upload/v1782708405/afilliate_hero_image_uum4vj.webp"
                alt="Laboratory Science"
                fill
                className="object-cover object-center opacity-60"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-ink/90 via-ink/20 to-ink/95" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 lg:p-16 z-10">
            <FadeUp>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight">Certificates</h1>
            </FadeUp>
            <HeroBreadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Certificates of Analysis' }]} />
          </div>
        </div>

        <div className="mt-12 md:mt-16 grid grid-cols-1 gap-10 max-w-4xl">
          <FadeUp delay={0.2} className="flex flex-col gap-8">
            <h2 className="text-[32px] sm:text-[40px] md:text-[48px] leading-[1.05] text-ink font-medium tracking-tight uppercase">
              Transparency is not optional.
            </h2>
            <p className="text-ink-muted text-base md:text-lg leading-relaxed font-light max-w-2xl">
              We verify every batch through independent, third-party US laboratories using high-performance liquid chromatography (HPLC) and mass spectrometry (MS).
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Filter and Table */}
      <section className="px-4 md:px-8 lg:px-10 mb-20 lg:mb-32 container mx-auto">
        <FadeUp delay={0.1}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h2 className="text-2xl font-medium text-ink tracking-tight">Testing Library</h2>
            <div className="w-full sm:w-64">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="h-12 rounded-xl bg-gray-50/50 border-gray-100 focus:ring-1 focus:ring-ink/20">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredCOAs.length === 0 ? (
            <div className="border border-gray-100 rounded-2xl bg-gray-50/50 py-20 px-6 text-center">
              <p className="text-ink font-medium mb-2">No certificates published yet.</p>
              <p className="text-ink-muted text-sm max-w-md mx-auto">
                Certificates of Analysis will appear here as each batch is independently tested and verified.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block w-full overflow-x-auto border border-gray-100 rounded-2xl shadow-sm bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="py-4 px-6 text-xs uppercase tracking-wider text-ink/50 font-medium">Product</th>
                      <th className="py-4 px-6 text-xs uppercase tracking-wider text-ink/50 font-medium">Purity</th>
                      <th className="py-4 px-6 text-xs uppercase tracking-wider text-ink/50 font-medium">Batch #</th>
                      <th className="py-4 px-6 text-xs uppercase tracking-wider text-ink/50 font-medium">Analyzed</th>
                      <th className="py-4 px-6 text-xs uppercase tracking-wider text-ink/50 font-medium text-right">COA Download</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCOAs.map((coa) => (
                      <tr key={coa.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-fast last:border-b-0">
                        <td className="py-6 px-6">
                          <div className="text-sm font-medium text-ink">{coa.product}</div>
                          <div className="text-xs text-ink/50 mt-1 uppercase tracking-wider">{coa.category}</div>
                        </td>
                        <td className="py-6 px-6 text-sm text-ink">{coa.purity || '—'}</td>
                        <td className="py-6 px-6 text-sm text-ink font-mono">{coa.batch || '—'}</td>
                        <td className="py-6 px-6 text-sm text-ink-muted">{coa.analyzed || '—'}</td>
                        <td className="py-6 px-6 text-right">
                          {coa.coaUrl ? (
                            <a
                              href={coa.coaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-accent hover:text-accent/80 transition-colors font-medium"
                            >
                              <FileTextIcon className="w-4 h-4" />
                              <span>PDF</span>
                            </a>
                          ) : (
                            <Link href="/contact" className="text-xs text-ink-muted hover:text-ink underline underline-offset-4 transition-colors">
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
                  <div key={coa.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-sm font-medium text-ink">{coa.product}</h3>
                        <span className="text-xs text-ink/50 uppercase tracking-wider block mt-1">{coa.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-lg font-medium text-ink tracking-tight">{coa.purity || '—'}</span>
                        <span className="text-[10px] uppercase tracking-wider text-ink/50">Purity</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-4 border-t border-b border-gray-100 mb-4">
                      <div>
                        <span className="block text-[10px] uppercase tracking-wider text-ink/50 mb-1">Batch</span>
                        <span className="text-sm font-mono text-ink">{coa.batch || '—'}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] uppercase tracking-wider text-ink/50 mb-1">Analyzed</span>
                        <span className="text-sm text-ink">{coa.analyzed || '—'}</span>
                      </div>
                    </div>

                    <div className="flex justify-center mt-2">
                      {coa.coaUrl ? (
                        <a
                          href={coa.coaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50/80 border border-gray-100 text-xs uppercase tracking-wider text-accent rounded-xl hover:bg-gray-100 hover:border-gray-200 transition-colors font-medium"
                        >
                          <DownloadIcon className="w-4 h-4" />
                          <span>Download COA</span>
                        </a>
                      ) : (
                        <Link href="/contact" className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 text-xs uppercase tracking-wider text-ink rounded-xl hover:bg-gray-50 transition-colors font-medium">
                          Request COA
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </FadeUp>
      </section>

      {/* Editorial Section */}
      <section className="bg-white text-ink py-16 lg:py-20 px-4 md:px-8 lg:px-10 border-t border-gray-100">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <FadeUp>
              <div className="relative w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <Image
                  src="/testing-methodology.png"
                  alt="HPLC Testing Machine"
                  fill
                  className="object-cover"
                />
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <span className="text-xs font-medium text-ink/40 uppercase tracking-[0.15em] mb-4 block">The Process</span>
              <h2 className="text-[2.5rem] leading-[1.1] font-normal tracking-[-1.5px] text-ink min-[480px]:text-[3rem] md:text-[3.5rem] uppercase mb-8">
                Testing Methodology
              </h2>
              <div className="text-base lg:text-lg text-ink-muted leading-relaxed font-light space-y-6">
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
