'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'

export function AboutTeaser() {
  const containerRef = useRef<HTMLElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Deep Background Layer (moves very slowly)
  const bgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"])
  
  // Mid Text Layer (moves slightly faster)
  const textY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"])
  
  // Foreground Focus Layer (moves fast)
  const fgFocusY = useTransform(scrollYProgress, [0, 1], ["30%", "-30%"])
  
  // Extreme Foreground Blur Layer (moves extremely fast)
  const fgBlurY = useTransform(scrollYProgress, [0, 1], ["80%", "-80%"])

  return (
    <div className="w-full mx-auto my-16 md:my-24">
      <section ref={containerRef} className="relative w-full max-w-[96%] mx-auto h-[85vh] md:h-[95vh] overflow-hidden bg-white flex items-center justify-center rounded-[2.5rem] shadow-2xl border border-slate-100">
        
        {/* 1. Deep Background Layer */}
        <motion.div 
          style={{ y: bgY, willChange: 'transform' }}
          className="absolute inset-[-20%] w-[140%] h-[140%] z-0"
        >
          <Image 
            src="/Featured%20Images/scientist-at-microscope.webp"
            alt="US-based peptide synthesis facility — ISO-certified laboratory where Sparta Labs compounds are produced"
            fill
            className="object-cover opacity-100"
          />
          {/* Light color overlay to soften the image */}
          <div className="absolute inset-0 bg-white/10" />
          {/* Sky blue color tint overlay */}
          <div className="absolute inset-0 bg-[#5984c4]/20 mix-blend-color" />
          {/* Vignette & Gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-white/20 to-transparent" />
        </motion.div>

        {/* 4. Extreme Foreground Blur Layer (Left Side, huge scale, blurred, placed BEHIND text for depth) */}
        <motion.div 
          style={{ y: fgBlurY, willChange: 'transform' }}
          className="absolute top-[-10%] left-[-30%] sm:left-[-15%] md:left-[-5%] w-[80vw] max-w-[600px] aspect-[1/2.2] z-0 pointer-events-none opacity-40 rotate-12 transform-gpu"
        >
          <Image 
            src="/Featured%20Images/vial-no-bg.webp"
            alt="Foreground Blur Vial"
            fill
            className="object-contain blur-xl opacity-20 transform-gpu"
          />
        </motion.div>

        {/* 2. Middle Layer: Huge Typography */}
        <motion.div 
          style={{ y: textY, willChange: 'transform' }}
          className="relative z-10 w-full flex flex-col items-center justify-center text-center px-6 pointer-events-none transform-gpu"
        >
          <span className="text-label-md uppercase tracking-widest text-[#5984c4] mb-6 md:mb-8 block font-bold">
            THE LAB
          </span>
          <h2 className="text-[10vw] sm:text-[8vw] md:text-[6vw] font-display text-ink leading-[0.9] tracking-tight max-w-[95%] md:max-w-[70%] drop-shadow-sm">
            Considered Compounds for Considered Research.
          </h2>
          <p className="mt-8 text-ink/70 max-w-[600px] text-sm sm:text-base md:text-lg mx-auto leading-relaxed">
            We synthesize ultra-pure research peptides using advanced solid-phase peptide synthesis (SPPS) in US-based, ISO-certified facilities. Every compound undergoes independent third-party LC-MS and HPLC analysis to verify both molecular identity and ≥99% purity before it reaches your bench. No overseas raw powders. No shortcuts. Just verifiable science.
          </p>
          <div className="pointer-events-auto mt-10">
            <Button variant="outline" asChild className="border-slate-300 text-ink hover:bg-[#5984c4] hover:text-white hover:border-[#5984c4] rounded-[1.5rem] px-8 py-6 backdrop-blur-md transition-all duration-300 uppercase tracking-widest text-[10px] font-bold shadow-sm transform-gpu">
              <Link href="/about">Read About Us →</Link>
            </Button>
          </div>
        </motion.div>

        {/* 3. Foreground Focus Layer (Right Side) */}
        <motion.div 
          style={{ y: fgFocusY, willChange: 'transform' }}
          className="absolute bottom-[-30%] right-[-10%] sm:right-0 md:right-[5%] lg:right-[10%] w-[50vw] max-w-[400px] aspect-[1/2.2] z-20 pointer-events-none drop-shadow-2xl -rotate-6 transform-gpu"
        >
          <Image 
            src="/Featured%20Images/vial-no-bg.webp"
            alt="Foreground Vial"
            fill
            className="object-contain drop-shadow-xl transform-gpu"
          />
        </motion.div>

      </section>

      {/* Proof Points Grid (Added for SEO Strategy) */}
      <section className="w-full max-w-[90%] mx-auto mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 relative z-10 px-4">
        
        <div className="flex flex-col text-center md:text-left">
          <div className="w-12 h-12 rounded-full bg-[#5984c4]/10 flex items-center justify-center mb-6 mx-auto md:mx-0">
            <span className="text-[#5984c4] font-bold">01</span>
          </div>
          <h3 className="text-xl font-display font-bold text-ink mb-4">
            ≥99% HPLC Purity — Every Batch, No Exceptions
          </h3>
          <p className="text-slate-600 leading-relaxed text-sm">
            High-Performance Liquid Chromatography (HPLC) testing is performed on every production batch. Any sample failing to meet our strict 99% purity threshold is immediately discarded — never sold.
          </p>
        </div>

        <div className="flex flex-col text-center md:text-left">
          <div className="w-12 h-12 rounded-full bg-[#5984c4]/10 flex items-center justify-center mb-6 mx-auto md:mx-0">
            <span className="text-[#5984c4] font-bold">02</span>
          </div>
          <h3 className="text-xl font-display font-bold text-ink mb-4">
            LC-MS Verified Peptide Identity
          </h3>
          <p className="text-slate-600 leading-relaxed text-sm">
            Mass spectrometry (LC-MS) confirms the exact molecular weight and identity of every compound we ship. You receive the peptide on the label, exactly as described.
          </p>
        </div>

        <div className="flex flex-col text-center md:text-left">
          <div className="w-12 h-12 rounded-full bg-[#5984c4]/10 flex items-center justify-center mb-6 mx-auto md:mx-0">
            <span className="text-[#5984c4] font-bold">03</span>
          </div>
          <h3 className="text-xl font-display font-bold text-ink mb-4">
            COA with Every Order — Full Transparency
          </h3>
          <p className="text-slate-600 leading-relaxed text-sm">
            Every order ships with a lot-specific Certificate of Analysis (COA) traceable to its independent test results. Our full COA library is publicly accessible at any time.
          </p>
        </div>

      </section>
    </div>
  )
}
