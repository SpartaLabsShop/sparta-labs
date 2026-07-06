import React from 'react'
import Link from 'next/link'
import { Container } from '@/components/ui/container'

export function MinimalFooter() {
  return (
    <footer className="w-full border-t border-border-subtle bg-cream py-8">
      <Container size="wide" className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-body-sm text-ink-muted">
          <div>© {new Date().getFullYear()} Sparta Labs. All rights reserved.</div>
          <span className="hidden md:block opacity-30">|</span>
          <div>Designed & Developed by <a href="https://www.belkdigital.com/" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700 transition-colors font-bold">Belk Digital</a></div>
        </div>
        <div className="flex items-center gap-6 text-label-sm uppercase tracking-wider text-ink-muted">
          <Link href="/privacy" className="hover:text-ink transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-ink transition-colors">Terms</Link>
          <Link href="/refund" className="hover:text-ink transition-colors">Refunds</Link>
        </div>
      </Container>
    </footer>
  )
}
