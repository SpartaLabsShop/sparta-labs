import React from 'react'
import { Skeleton, ProductCardSkeleton } from '@/components/ui/skeleton'

export default function ShopLoading() {
  return (
    <div className="w-full bg-white min-h-screen">
      <div className="mx-auto max-w-[1700px] px-8 max-[768px]:px-4 max-[480px]:px-3 pt-12 pb-12">
        {/* Top Toolbar Skeleton */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8 bg-white/95 border border-ink/10 p-3 sm:p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-28 rounded-full" />
              <Skeleton className="h-5 w-20 hidden md:block" />
            </div>
            <Skeleton className="h-10 w-[140px] rounded-full" />
          </div>
        </div>

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="flex h-full w-full">
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
