'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { RotateCcw, ArrowRight } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global Error Boundary caught an error:', error)
  }, [error])

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6 font-[family-name:var(--font-inter)]">
      <div className="flex flex-col items-center text-center max-w-lg">

        <div className="relative mb-8">
          <span className="text-[180px] sm:text-[220px] md:text-[260px] font-bold leading-none tracking-tighter text-gray-100 select-none">
            500
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-2 border-[#D31118] flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D31118" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight mb-3">
          Something went wrong
        </h1>
        <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-10 max-w-sm">
          We encountered an unexpected error while processing your request. Please try again or return to the homepage.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 bg-ink text-white text-xs font-semibold uppercase tracking-[0.15em] px-8 py-4 rounded-full hover:bg-ink/90 transition-colors"
          >
            <RotateCcw size={14} />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-gray-200 text-ink text-xs font-semibold uppercase tracking-[0.15em] px-8 py-4 rounded-full hover:border-ink/40 transition-colors"
          >
            Return Home
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </main>
  )
}
