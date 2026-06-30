'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

interface ProductTabsProps {
  tabs: Tab[]
}

export function ProductTabs({ tabs }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id)
  const [headerVisible, setHeaderVisible] = useState(true)

  React.useEffect(() => {
    let lastScrollY = window.scrollY
    const handleScrollDir = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY < 100) {
        setHeaderVisible(true)
      } else if (currentScrollY > lastScrollY) {
        setHeaderVisible(false) // Scrolling down
      } else if (currentScrollY < lastScrollY - 5) {
        setHeaderVisible(true) // Scrolling up
      }
      lastScrollY = currentScrollY
    }
    window.addEventListener('scroll', handleScrollDir, { passive: true })
    return () => window.removeEventListener('scroll', handleScrollDir)
  }, [])

  React.useEffect(() => {
    if (!tabs || tabs.length === 0) return

    const handleScroll = () => {
      let currentId = tabs[0]?.id
      // Check which section is currently closest to the top of the viewport
      for (const tab of tabs) {
        const element = document.getElementById(`tab-section-${tab.id}`)
        if (element) {
          const rect = element.getBoundingClientRect()
          // 240px offset ensures active tab highlights correctly even with the new spacing
          if (rect.top <= 240) {
            currentId = tab.id
          }
        }
      }
      setActiveTab(currentId)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Initial check
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [tabs])

  const scrollToSection = (id: string) => {
    setActiveTab(id)
    const element = document.getElementById(`tab-section-${id}`)
    if (element) {
      // 200px offset ensures we clear both the reappearing header AND the sticky pill
      const y = element.getBoundingClientRect().top + window.scrollY - 200
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  if (!tabs || tabs.length === 0) return null

  return (
    <div className="w-full flex flex-col items-center">
      {/* Sticky Mobile-Scrollable Floating Tab Container */}
      <div 
        className={cn(
          "w-full sticky pt-4 pb-4 z-40 transition-all duration-300",
          headerVisible ? "top-[120px] sm:top-[140px]" : "top-2 sm:top-6"
        )}
      >
        <div className="grid grid-cols-2 md:flex md:items-center md:justify-between gap-1.5 sm:gap-2 p-1.5 bg-ink/5 backdrop-blur-xl rounded-[1.5rem] w-full mx-auto border border-ink/10">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={cn(
                  "relative flex-1 px-2 md:px-4 py-3 md:py-5 rounded-[1rem] text-[9px] md:text-[11px] lg:text-xs font-bold uppercase tracking-widest transition-colors z-10 text-center flex items-center justify-center",
                  isActive ? "text-ink" : "text-ink/60 hover:text-ink/90"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 bg-white rounded-[1.2rem] -z-10 shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-ink/5"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content Cards (Stacked Vertically) */}
      <div className="w-full flex flex-col gap-8 md:gap-12 mt-8 md:mt-12 relative z-10">
        {tabs.map((tab) => (
          <div 
            key={tab.id}
            id={`tab-section-${tab.id}`}
            className="w-full bg-white border border-ink/5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.04)] rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 lg:p-16 relative overflow-hidden scroll-mt-[160px]"
          >
            {/* Subtle decorative background glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/40 rounded-full blur-3xl -z-10 transform translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-50/60 rounded-full blur-3xl -z-10 transform -translate-x-1/3 translate-y-1/3 pointer-events-none" />
            
            <div className="w-full">
              {typeof tab.content === 'string' ? (
                <div className="max-w-4xl mx-auto">
                  <h3 className="text-xl md:text-3xl font-sans uppercase text-ink mb-6 tracking-tight">
                    {tab.label}
                  </h3>
                  <div className="flex flex-col gap-5 text-[15px] sm:text-base md:text-lg text-ink/70 leading-relaxed font-light">
                    {tab.content.split('\n').filter(p => p.trim() !== '').map((p, i) => (
                      <p key={i} className={i === 0 ? "text-lg sm:text-xl md:text-2xl text-ink font-medium leading-relaxed tracking-tight" : ""}>
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto">
                  {tab.content}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
