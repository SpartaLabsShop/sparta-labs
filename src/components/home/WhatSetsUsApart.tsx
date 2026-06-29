'use client'

import React, { useState, useRef } from 'react'
import { Container } from '@/components/ui/container'
import { FadeUp } from '@/components/motion/FadeUp'
import { ShieldCheck, Dna, Snowflake } from 'lucide-react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import Image from 'next/image'

const PILLARS = [
  {
    title: "US-Based Synthesis — Zero Overseas Powders",
    description: "Every compound is synthesized in US-based, ISO-certified peptide laboratories using closed-loop solid-phase peptide synthesis (SPPS). We do not purchase raw, untested powders from overseas suppliers or third-party bulk brokers. Our closed-loop supply chain ensures complete molecular traceability from synthesis to shipping.",
    icon: Dna,
    image: "/Featured%20Images/us-based-synthesis.webp"
  },
  {
    title: "99%+ Purity Floor — Any Batch Below This Gets Discarded",
    description: "We enforce a non-negotiable 99% purity minimum across our entire catalog. Every single batch is independently tested by third-party laboratories using both HPLC chromatography and LC-MS mass spectrometry. If a batch fails to meet this threshold — for any reason — it is discarded immediately and never fulfilled.",
    icon: ShieldCheck,
    image: "/Featured%20Images/three-floating-vials.webp"
  },
  {
    title: "Cold-Chain Logistics — Molecular Integrity, Guaranteed",
    description: "Peptides are structurally fragile molecules. Thermal degradation begins at room temperature and accelerates over time. We store all inventory in climate-controlled, medical-grade refrigeration and ship using validated cold-chain packaging specifically designed to maintain peptide integrity from our facility to your bench — regardless of transit conditions.",
    icon: Snowflake,
    image: "/Featured%20Images/nad-retatrutide-vials-on-ice.webp"
  }
]

export function WhatSetsUsApart() {
  const containerRef = useRef<HTMLElement>(null)
  const [activeTab, setActiveTab] = useState(0)

  // Track scroll progress through this specific section for Desktop
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Map scroll progress (0 to 1) into 3 distinct active states
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.33) {
      setActiveTab(0)
    } else if (latest >= 0.33 && latest < 0.66) {
      setActiveTab(1)
    } else {
      setActiveTab(2)
    }
  })

  return (
    <section ref={containerRef} className="w-full h-auto lg:h-[250vh] bg-white relative z-10 border-y border-ink/5">
      
      {/* ----------------------------- */}
      {/* DESKTOP LAYOUT (Sticky Scroll) */}
      {/* ----------------------------- */}
      <div className="hidden xl:flex sticky top-0 h-screen w-full flex-col justify-center overflow-hidden">
        <Container size="wide">
          <div className="flex flex-row gap-16 xl:gap-24 items-center">
            
            {/* Left Column: Headers & Tabs */}
            <div className="w-5/12 flex flex-col">
              <FadeUp>
                <span className="text-label-md uppercase tracking-widest text-[#5984c4] mb-4 block font-bold">
                  THE SPARTA STANDARD
                </span>
              </FadeUp>
              <FadeUp delay={0.1}>
                <h2 className="text-[clamp(2rem,5vh,3.5rem)] font-display text-ink leading-[0.9] tracking-tight mb-4 lg:mb-6">
                  The Sparta Standard: Why Purity Matters
                </h2>
              </FadeUp>
              <FadeUp delay={0.2}>
                <p className="text-[clamp(0.875rem,1.5vh,1.125rem)] text-ink/70 leading-relaxed mb-4 lg:mb-8 max-w-md">
                  Purity is not a marketing claim — it is a measurable, verifiable fact. Impure compounds produce unreliable research results. We operate at the intersection of aesthetic science and analytical chemistry so that every batch you receive is exactly what it claims to be.
                </p>
              </FadeUp>

              {/* Interactive Scroll Prompt */}
              <FadeUp delay={0.3}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-5 h-8 rounded-full border-[1.5px] border-ink/20 flex justify-center pt-1.5 shrink-0">
                    <motion.div 
                      animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }} 
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="w-1 h-1.5 bg-ink/40 rounded-full"
                    />
                  </div>
                  <span className="text-[9px] font-sans uppercase tracking-[0.25em] font-bold text-ink/40">
                    Scroll to Explore
                  </span>
                </div>
              </FadeUp>

              {/* Passive Scroll Indicators */}
              <div className="flex flex-col gap-2 relative">
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-ink/5" />
                
                {PILLARS.map((pillar, idx) => {
                  const isActive = activeTab === idx
                  return (
                    <div 
                      key={idx}
                      className={`relative text-left flex items-center py-[clamp(0.5rem,2vh,1.25rem)] pl-8 transition-all duration-500 ${isActive ? 'text-ink' : 'text-ink/20'}`}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="activeScrollIndicator"
                          className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#5984c4]"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <h3 className="text-[clamp(1.25rem,3vh,1.875rem)] font-display tracking-tight">
                        {pillar.title}
                      </h3>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right Column: Dynamic Display Area */}
            <div className="w-7/12">
              <FadeUp delay={0.3} className="w-full h-full">
                <div className="relative w-full h-[60vh] max-h-[600px] rounded-[2rem] bg-ink overflow-hidden shadow-2xl flex flex-col justify-end">
                  
                  {/* Background Imagery Crossfade */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0"
                    >
                      {/* Lighter bottom gradient to ensure text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent z-20 pointer-events-none" />
                      
                      <Image 
                        src={PILLARS[activeTab].image}
                        alt={PILLARS[activeTab].title}
                        fill
                        className="object-cover opacity-90"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Content Overlay */}
                  <div className="relative z-30 p-12 w-full">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-md"
                      >
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border border-white/20">
                          {React.createElement(PILLARS[activeTab].icon, {
                            className: "w-6 h-6 text-gold",
                            strokeWidth: 1.5
                          })}
                        </div>
                        <p className="text-cream leading-relaxed text-lg">
                          {PILLARS[activeTab].description}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  
                </div>
              </FadeUp>
            </div>

          </div>
        </Container>
      </div>

      {/* ----------------------------- */}
      {/* MOBILE/TABLET LAYOUT (Static) */}
      {/* ----------------------------- */}
      <div className="flex xl:hidden flex-col w-full py-16 sm:py-24">
        <Container size="wide">
          
          <div className="flex flex-col mb-12">
            <FadeUp>
              <span className="text-label-md uppercase tracking-widest text-[#5984c4] mb-4 block font-bold">
                THE SPARTA STANDARD
              </span>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="text-[10vw] sm:text-display-sm font-display text-ink leading-[0.9] tracking-tight mb-6">
                The Sparta Standard: Why Purity Matters
              </h2>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="text-body-md text-ink/70 leading-relaxed max-w-md">
                Purity is not a marketing claim — it is a measurable, verifiable fact. Impure compounds produce unreliable research results. We operate at the intersection of aesthetic science and analytical chemistry so that every batch you receive is exactly what it claims to be.
              </p>
            </FadeUp>
          </div>

          <div className="flex flex-col gap-6 sm:gap-8">
            {PILLARS.map((pillar, idx) => (
              <FadeUp key={idx} delay={0.2 + (idx * 0.1)}>
                <div className="relative w-full aspect-[4/5] sm:aspect-[16/9] rounded-[2rem] bg-ink overflow-hidden shadow-xl flex flex-col justify-end">
                  
                  {/* Background Image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent z-20 pointer-events-none" />
                  <Image 
                    src={pillar.image}
                    alt={pillar.title}
                    fill
                    className="object-cover opacity-90"
                  />
                  
                  {/* Content Overlay */}
                  <div className="relative z-30 p-6 sm:p-8 w-full">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-4 border border-white/20">
                      <pillar.icon className="w-5 h-5 sm:w-6 sm:h-6 text-gold" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-display text-white mb-3 tracking-tight drop-shadow-md">
                      {pillar.title}
                    </h3>
                    <p className="text-cream leading-relaxed text-sm sm:text-base drop-shadow-md">
                      {pillar.description}
                    </p>
                  </div>
                  
                </div>
              </FadeUp>
            ))}
          </div>

        </Container>
      </div>
      
    </section>
  )
}
