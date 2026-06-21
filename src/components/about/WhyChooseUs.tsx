'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'

const PILLARS = [
  {
    id: '01',
    title: 'Independent Testing',
    desc: 'Every single batch is tested by accredited US-based third-party laboratories via HPLC & Mass Spectrometry before it is ever made available for research.',
    image: '/Featured%20Images/scientist-at-microscope.webp',
  },
  {
    id: '02',
    title: '≥99% Purity Guarantee',
    desc: 'We enforce a strict 99% purity floor across our entire catalog. If a batch tests at 98.9%, it is discarded. There are no exceptions to this standard.',
    image: '/Featured%20Images/clear-glass-dropper.webp',
  },
  {
    id: '03',
    title: 'USA Fulfillment',
    desc: 'Our compounds are stocked securely in domestic, climate-controlled facilities. We fulfill and ship all orders directly from the United States for rapid delivery.',
    image: '/Featured%20Images/three-floating-vials.webp',
  },
  {
    id: '04',
    title: 'Lyophilized Stability',
    desc: 'Compounds are rigorously lyophilized and vacuum-sealed to prevent degradation, ensuring structural integrity from our laboratory to yours.',
    image: '/Featured%20Images/crushed-white-powder.webp',
  },
]

export function WhyChooseUs() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const step = Math.min(
      Math.floor(latest * PILLARS.length),
      PILLARS.length - 1,
    )
    if (step !== activeIndex) setActiveIndex(step)
  })

  return (
    <section
      ref={sectionRef}
      className="relative bg-white h-auto lg:h-[400vh]"
    >
      <div className="lg:sticky lg:top-0 lg:h-screen flex items-center justify-center lg:overflow-hidden px-4 md:px-8 lg:px-10 py-16 lg:py-0">
        <div className="w-full grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 items-center">

          {/* Left — Image Panel */}
          <div className="relative w-full aspect-square sm:aspect-[4/3] lg:aspect-[4/5] rounded-2xl overflow-hidden bg-black order-last lg:order-first mt-8 lg:mt-0">
            <button
              onClick={() =>
                setActiveIndex((prev) => (prev + 1) % PILLARS.length)
              }
              className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              aria-label="Next pillar"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <motion.div
              key={`gs-img-${activeIndex}`}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              <Image
                src={PILLARS[activeIndex].image}
                alt={PILLARS[activeIndex].title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            </motion.div>

            {/* Description Overlay */}
            <div className="absolute bottom-6 left-6 right-6 z-10">
              <motion.p
                key={`gs-desc-${activeIndex}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="text-xs sm:text-sm lg:text-base text-white/90 leading-relaxed font-light border border-white/20 rounded-lg px-4 sm:px-5 py-4 backdrop-blur-sm bg-white/5"
              >
                {PILLARS[activeIndex].desc}
              </motion.p>
            </div>
          </div>

          {/* Right — Heading + Pillar List */}
          <div className="flex flex-col">
            <h2 className="text-4xl sm:text-5xl md:text-[4rem] lg:text-[4.5rem] leading-[1.1] font-normal tracking-[-1.5px] text-ink uppercase mb-6">
              The Gold
              <br className="hidden lg:block" />
              Standard
            </h2>

            <p className="text-base lg:text-lg text-ink-muted leading-relaxed font-light max-w-md mb-8 lg:mb-16">
              Four non-negotiable pillars that define every compound we release — from synthesis to shipment.
            </p>

            <div className="flex flex-col gap-4 lg:gap-6">
              {PILLARS.map((pillar, index) => {
                const isActive = activeIndex === index
                return (
                  <button
                    key={pillar.id}
                    onClick={() => setActiveIndex(index)}
                    className="text-left group flex items-baseline gap-1 transition-all duration-300"
                  >
                    <span
                      className={`text-lg sm:text-xl lg:text-3xl uppercase tracking-tight transition-all duration-300 ${
                        isActive
                          ? 'text-ink font-medium underline underline-offset-4 lg:underline-offset-8 decoration-1'
                          : 'text-ink/30 font-normal hover:text-ink/50'
                      }`}
                    >
                      {pillar.title}
                    </span>
                    <sup
                      className={`text-[10px] lg:text-xs ml-1 transition-colors duration-300 ${
                        isActive ? 'text-ink' : 'text-ink/30'
                      }`}
                    >
                      {pillar.id}
                    </sup>
                  </button>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
