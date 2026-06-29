import React from 'react'
import Link from 'next/link'
import { Container } from '@/components/ui/container'

export function MinimalHeader() {
  return (
    <div className="fixed top-0 inset-x-0 z-sticky bg-cream/90 backdrop-blur-md border-b border-border-subtle h-20">
      <Container size="wide" className="h-full flex items-center justify-center">
        <Link href="/" className="font-sans text-label-lg uppercase tracking-wider hover:opacity-80 transition-opacity">
          SPARTA LABS
        </Link>
      </Container>
    </div>
  )
}
