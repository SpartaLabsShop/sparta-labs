import React from 'react'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-6">
      <div className="bg-cream-warm border border-gold/20 rounded-full p-4 mb-6 shadow-sm">
        <Icon className="w-12 h-12 text-gold" strokeWidth={1.5} />
      </div>
      <h3 className="text-display-sm font-sans uppercase text-ink mb-3">{title}</h3>
      {description && (
        <p className="text-body-lg text-ink-muted max-w-md mx-auto mb-8">
          {description}
        </p>
      )}
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  )
}
