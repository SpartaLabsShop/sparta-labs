'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface Variant {
  id: string
  sku?: string
  title: string
  price: string
  salePrice?: string
  inStock: boolean
  image?: string
}

interface VariantSelectorProps {
  variants: Variant[]
  value: string
  onChange: (id: string) => void
  label?: string
  theme?: 'light' | 'dark'
}

export function VariantSelector({ variants, value, onChange, label = '', theme = 'light' }: VariantSelectorProps) {
  if (!variants || variants.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <span className="text-xs font-bold uppercase tracking-widest text-ink/50">
          {label}
        </span>
      )}
      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => {
          const isSelected = value === variant.id
          return (
            <button
              key={variant.id}
              onClick={() => variant.inStock && onChange(variant.id)}
              disabled={!variant.inStock}
              className={cn(
                "relative flex flex-col items-center justify-center min-w-[80px] px-6 py-3 border rounded-xl transition-all duration-300",
                isSelected 
                  ? theme === 'dark' ? "border-white bg-white text-ink shadow-sm ring-1 ring-white/20" : "border-ink bg-ink text-white shadow-md ring-1 ring-ink/10" 
                  : theme === 'dark' ? "border-white/20 bg-transparent text-white/80 hover:text-white hover:border-white/50" : "border-ink/10 bg-white text-ink hover:border-ink/30 hover:bg-gray-50",
                !variant.inStock && "opacity-40 cursor-not-allowed hover:border-inherit hover:bg-inherit"
              )}
            >
              <span className={cn(
                "text-[13px] font-bold uppercase tracking-widest",
                !variant.inStock && "line-through"
              )}>
                {variant.title || `Option`}
              </span>
              
              {/* Optional tiny price diff indicator - omitted for maximum cleanliness since top price updates */}
            </button>
          )
        })}
      </div>
    </div>
  )
}
