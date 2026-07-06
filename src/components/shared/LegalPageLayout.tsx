import React from 'react'
import { Container } from '@/components/ui/container'
import { HeroBreadcrumb } from '@/components/shared/HeroBreadcrumb'

export function LegalPageLayout({
  title,
  lastUpdated,
  breadcrumbLabel,
  children,
}: {
  title: string
  lastUpdated: string
  breadcrumbLabel: string
  children: React.ReactNode
}) {
  return (
    <main className="bg-white min-h-screen pt-24 pb-24">
      <section className="px-4 md:px-8 container mx-auto mb-16">
        <div className="relative w-full py-16 md:py-20 px-6 md:px-12 rounded-lg overflow-hidden bg-[#f5f5f5]">
          <h1 className="text-4xl md:text-6xl font-semibold text-ink tracking-tight">{title}</h1>
          <p className="text-sm text-gray-500 mt-4">Last updated: {lastUpdated}</p>
          <HeroBreadcrumb items={[{ label: 'Home', href: '/' }, { label: breadcrumbLabel }]} />
        </div>
      </section>

      <Container size="prose">
        <div className="[&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-semibold [&_h2]:text-ink [&_h2]:tracking-tight [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:first:mt-0 [&_p]:text-gray-600 [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:text-gray-600 [&_ul]:mb-4 [&_strong]:text-ink [&_strong]:font-semibold [&_a]:text-ink [&_a]:underline [&_a]:hover:text-gray-600">
          {children}
        </div>
      </Container>
    </main>
  )
}
