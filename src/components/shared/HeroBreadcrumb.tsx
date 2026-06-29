'use client'

import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

export function HeroBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <div className="absolute bottom-0 right-6 md:right-16 z-10">
      <div className="relative bg-white rounded-t-xl px-6 md:px-8 py-2 md:py-3 flex items-center gap-1.5 text-xs md:text-sm font-medium">
        {/* Left concave curve */}
        <div
          className="absolute bottom-0 -left-3 w-3 h-3"
          style={{ background: 'radial-gradient(circle at top left, transparent 12px, white 12px)' }}
        />
        {/* Right concave curve */}
        <div
          className="absolute bottom-0 -right-3 w-3 h-3"
          style={{ background: 'radial-gradient(circle at top right, transparent 12px, white 12px)' }}
        />
        {items.map((item, index) => (
          <span key={index} className="flex items-center gap-1.5">
            {index > 0 && <span className="text-gray-300">/</span>}
            {item.href ? (
              <Link href={item.href} className="text-gray-400 hover:text-gray-600 transition-colors capitalize">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-600 capitalize">{item.label}</span>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}
