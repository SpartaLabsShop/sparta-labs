'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Loader2, Zap, Sparkles, BatteryCharging, Dna, ArrowRight, Command, Activity, Brain, ShieldPlus, Network } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
  categories?: { id: string | number; name: string; slug: string }[]
}

// Keyed by real category name (as stored in Payload); unmapped falls back to Sparkles.
const CATEGORY_ICONS: Record<string, typeof Zap> = {
  'Metabolic Research Peptides': Zap,
  'Growth Factor Research Peptides': Sparkles,
  'Recovery Research Peptides': BatteryCharging,
  'Cellular Health Research': Dna,
  'Bioregulators': Activity,
  'Cognitive Function Studies': Brain,
  'Essentials': ShieldPlus,
  'Receptor Agonist Research Peptides': Network,
}

export function SearchOverlay({ isOpen, onClose, categories = [] }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Cmd+K to open (if we want to add that globally, we'd do it outside, but we can mention it here)

  // Debounced search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (res.ok) {
          const data = await res.json()
          setResults(data)
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsLoading(false)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [query])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-4 sm:p-6 pt-20 sm:pt-6 pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-3xl bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col relative z-10"
          >
            {/* Search Input Area */}
            <div className="flex items-center gap-4 p-5 sm:p-6 border-b border-black/5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white border border-black/10 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                {isLoading ? (
                  <Loader2 className="text-black animate-spin" strokeWidth={1.5} size={24} />
                ) : (
                  <Search className="text-black" strokeWidth={1.5} size={24} />
                )}
              </div>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search compounds..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-xl sm:text-2xl text-black placeholder:text-black/30 focus:outline-none font-medium"
              />
              <button
                onClick={onClose}
                className="p-2 text-black/30 hover:text-black hover:bg-black/5 rounded-full transition-colors shrink-0"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto max-h-[60vh]">
              {query && !isLoading && results.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 mb-2">0 Results Found</p>
                  <p className="text-sm text-black/40">Try adjusting your search terms.</p>
                </div>
              )}

              {/* Show Quick Categories if no query */}
              {!query && categories.length > 0 && (
                <div className="py-2">
                  <div className="flex items-center gap-4 px-6 pt-6">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-black/40 shrink-0">
                      Quick Categories
                    </span>
                    <div className="flex-1 h-px bg-black/5" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
                    {categories.map((cat, index) => {
                      const Icon = CATEGORY_ICONS[cat.name] || Sparkles
                      return (
                        <Link
                          key={cat.id}
                          href={`/shop?category=${encodeURIComponent(cat.name)}`}
                          onClick={onClose}
                          className={`group items-center p-4 rounded-2xl bg-[#FAFAFA] border border-black/5 hover:border-black/20 hover:bg-white transition-all shadow-sm hover:shadow-md ${
                            index >= 4 ? 'hidden sm:flex' : 'flex'
                          }`}
                        >
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-black/5 shrink-0 group-hover:scale-105 transition-transform">
                            <Icon size={18} className="text-black" strokeWidth={1.5} />
                          </div>
                          <span className="ml-4 text-sm font-semibold text-black flex-1">
                            {cat.name}
                          </span>
                          <ArrowRight size={16} className="text-black/20 group-hover:text-black/60 transition-colors" />
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Show Results if query exists */}
              {results.length > 0 && (
                <div className="py-2">
                  <div className="flex items-center gap-4 px-6 pt-6">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-black/40 shrink-0">
                      Search Results ({results.length})
                    </span>
                    <div className="flex-1 h-px bg-black/5" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={onClose}
                        className="group flex items-center p-4 rounded-2xl bg-white border border-black/5 hover:border-black/20 hover:shadow-md transition-all"
                      >
                        <div className="relative w-14 h-14 bg-[#F5F5F5] rounded-xl overflow-hidden shrink-0 mix-blend-multiply border border-black/5">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full bg-black/5" />
                          )}
                        </div>
                        
                        <div className="ml-4 flex-1 flex flex-col justify-center min-w-0">
                          <h3 className="text-sm font-bold text-black uppercase tracking-[0.1em] group-hover:text-black/70 transition-colors truncate">
                            {product.name}
                          </h3>
                          {product.descriptor && (
                            <p className="text-[11px] text-black/50 mt-0.5 truncate">
                              {product.descriptor}
                            </p>
                          )}
                        </div>

                        <div className="ml-3 shrink-0">
                          <p className="text-xs font-bold text-black tracking-widest">${product.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Footer Section */}
            <div className="p-5 sm:p-6 bg-[#FAFAFA] border-t border-black/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center shrink-0">
                  <Command size={18} className="text-black/40" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] font-bold text-black uppercase tracking-[0.2em] mb-0.5">
                    Institutional Access
                  </p>
                  <p className="text-[10px] text-black/40">
                    Use <kbd className="font-sans px-1 py-0.5 bg-black/5 rounded mx-1">⌘ + K</kbd> to search from any laboratory module
                  </p>
                </div>
                <div className="block sm:hidden">
                  <p className="text-[10px] font-bold text-black uppercase tracking-[0.2em]">
                    Institutional Access
                  </p>
                </div>
              </div>
              
              <Link 
                href="/faq" 
                onClick={onClose}
                className="px-4 py-2 border border-black/10 rounded-full text-[9px] font-bold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-colors shrink-0"
              >
                Help Center
              </Link>
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
