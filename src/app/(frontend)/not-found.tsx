import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6 font-[family-name:var(--font-inter)]">
      <div className="flex flex-col items-center text-center max-w-lg">

        <div className="relative mb-8">
          <span className="text-[180px] sm:text-[220px] md:text-[260px] font-bold leading-none tracking-tighter text-gray-100 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-2 border-[#D31118] flex items-center justify-center">
              <span className="text-[#D31118] text-3xl font-light">!</span>
            </div>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight mb-3">
          Page not found
        </h1>
        <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-10 max-w-sm">
          The page you are looking for doesn't exist or has been moved. Check the URL or head back home.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-ink text-white text-xs font-semibold uppercase tracking-[0.15em] px-8 py-4 rounded-full hover:bg-ink/90 transition-colors"
          >
            Return Home
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 border border-gray-200 text-ink text-xs font-semibold uppercase tracking-[0.15em] px-8 py-4 rounded-full hover:border-ink/40 transition-colors"
          >
            Browse Shop
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </main>
  )
}
