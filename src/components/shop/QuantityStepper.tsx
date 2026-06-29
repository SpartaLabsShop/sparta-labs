'use client'

import React from 'react'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuantityStepperProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  className?: string
  theme?: 'light' | 'dark'
}

export function QuantityStepper({ 
  value, 
  onChange, 
  min = 1, 
  max = 99,
  className,
  theme = 'light'
}: QuantityStepperProps) {
  
  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault()
    if (value > min) onChange(value - 1)
  }

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault()
    if (value < max) onChange(value + 1)
  }

  return (
    <div className={cn("inline-flex items-center justify-between border border-ink/10 rounded-xl bg-white h-12 px-1 w-[120px] shadow-sm transition-all hover:border-ink/20", className)}>
      <button 
        onClick={handleDecrement}
        disabled={value <= min}
        className="w-10 h-10 flex items-center justify-center text-ink/60 hover:text-ink hover:bg-ink/5 rounded-xl transition-colors disabled:opacity-30 flex-shrink-0"
        aria-label="Decrease quantity"
      >
        <Minus size={16} strokeWidth={2} />
      </button>
      
      <div className="flex-1 flex items-center justify-center font-bold text-base select-none text-ink">
        {value}
      </div>
      
      <button 
        onClick={handleIncrement}
        disabled={value >= max}
        className="w-10 h-10 flex items-center justify-center text-ink/60 hover:text-ink hover:bg-ink/5 rounded-xl transition-colors disabled:opacity-30 flex-shrink-0"
        aria-label="Increase quantity"
      >
        <Plus size={16} strokeWidth={2} />
      </button>
    </div>
  )
}
