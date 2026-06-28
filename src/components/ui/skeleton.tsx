import React from 'react'
import { cn } from '@/lib/utils'

// Base Skeleton Component using the custom CSS class from globals.css
function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('skeleton rounded-sm animate-pulse bg-ink/5', className)}
      {...props}
    />
  )
}

// 1. ProductCard Skeleton — matches PrimaryProductCard layout
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-white border border-[#eaeaea] pt-6 sm:pt-8 px-3 sm:px-6 pb-4 sm:pb-6 h-full w-full">
      {/* Third-Party Tested Badge */}
      <div className="flex justify-center mb-3 sm:mb-4">
        <Skeleton className="h-5 w-[120px] sm:w-[140px]" />
      </div>

      {/* Image Area */}
      <div className="mt-2.5 mb-3 sm:mb-4 flex h-[150px] sm:h-[220px] w-full items-center justify-center">
        <Skeleton className="h-full w-[70%] rounded-lg" />
      </div>

      {/* Category */}
      <div className="flex flex-col items-center text-center flex-1">
        <Skeleton className="h-3 w-16 sm:w-20 mb-1 sm:mb-2" />
        {/* Product Name */}
        <Skeleton className="h-5 sm:h-6 w-3/4 mb-2 sm:mb-3" />
        {/* Price */}
        <Skeleton className="h-4 sm:h-5 w-16 mb-3 sm:mb-4" />
        {/* COA Badge */}
        <Skeleton className="h-4 w-20 sm:w-24 mb-3 sm:mb-4" />
        {/* Add to Cart + Qty */}
        <div className="mt-auto flex gap-2 w-full">
          <Skeleton className="h-10 sm:h-12 flex-1 rounded" />
          <Skeleton className="hidden sm:block h-12 w-[90px] rounded" />
        </div>
      </div>
    </div>
  )
}

// 2. BlogPostCard Skeleton
export function BlogPostCardSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full group">
      {/* Image placeholder */}
      <Skeleton className="w-full aspect-[16/10] rounded-sm" />
      {/* Content placeholders */}
      <div className="space-y-4">
        {/* Meta row */}
        <div className="flex gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
        {/* Title */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-5/6" />
        </div>
        {/* Excerpt */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  )
}

// 3. Order Row Skeleton
export function OrderRowSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-6 border-b border-border-subtle gap-4">
      <div className="space-y-2">
        {/* Order ID */}
        <Skeleton className="h-5 w-24" />
        {/* Date */}
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
        {/* Amount */}
        <Skeleton className="h-5 w-20" />
        {/* Status Badge */}
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </div>
  )
}

// 4. Stat Card Skeleton
export function StatCardSkeleton() {
  return (
    <div className="bg-white border border-border-subtle rounded-md p-6 flex flex-col items-center text-center">
      {/* Large number placeholder */}
      <Skeleton className="h-10 w-24 mb-3" />
      {/* Label placeholder */}
      <Skeleton className="h-4 w-32" />
    </div>
  )
}

// 5. COA Table Row Skeleton
export function COARowSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 py-5 border-b border-border-subtle">
      {/* Product Name */}
      <div className="md:col-span-1">
        <Skeleton className="h-5 w-3/4" />
      </div>
      {/* Purity */}
      <div className="md:col-span-1 hidden md:block">
        <Skeleton className="h-4 w-12" />
      </div>
      {/* Batch */}
      <div className="md:col-span-1 hidden md:block">
        <Skeleton className="h-4 w-20" />
      </div>
      {/* Analyzed */}
      <div className="md:col-span-1 hidden md:block">
        <Skeleton className="h-4 w-24" />
      </div>
      {/* Download Action */}
      <div className="md:col-span-1 flex justify-end">
        <Skeleton className="h-8 w-24 rounded-sm" />
      </div>
    </div>
  )
}

export { Skeleton }
