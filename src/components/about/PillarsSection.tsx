'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FadeUp } from '@/components/motion/FadeUp'

const pillars = [
  {
    num: '01',
    title: 'Our Mission.',
    desc: 'To accelerate scientific discovery by providing researchers with the highest purity compounds available. We aim to remove the guesswork from research by setting an uncompromising standard for documentation and quality control.',
  },
  {
    num: '02',
    title: 'Our Philosophy.',
    desc: "Absolute transparency. We believe that researchers deserve to know exactly what they are working with. If a batch doesn't meet our strict ≥99% purity threshold through independent LC-MS and HPLC testing, it is destroyed.",
  },
  {
    num: '03',
    title: 'Our Journey.',
    desc: 'Born out of frustration with an industry plagued by vague COAs and unreliable suppliers. We built the infrastructure and partnered with elite US analytical labs to create the standard we always wished existed for our own research.',
  },
]

export function PillarsSection() {
  return (
    <section className="pt-16 pb-16 lg:pt-16 lg:pb-20 px-4 md:px-8 lg:px-10 bg-white relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] xl:grid-cols-[300px_1fr] gap-8 lg:gap-16">
          
          {/* Left Column: Title + Curve */}
          <div className="relative">
            {/* Title */}
            <FadeUp className="mb-12 lg:mb-0 lg:pt-10 relative z-20">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal text-ink leading-[1.1] tracking-tight">
                Our
                <br />
                Pillars.
              </h2>
            </FadeUp>

            {/* Decorative Curve (Desktop Only) */}
            <div className="hidden lg:block absolute left-0 top-[350px] bottom-[50px] w-full pointer-events-none z-0">
              <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M 0,0 Q 100,50 0,100" stroke="#e5e5e5" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
              </svg>
              
              {/* Dot 1 */}
              <div className="absolute top-[16.66%] right-0 h-px border-b border-dashed border-[#ccc]" style={{ left: '27.7%' }} />
              <div className="absolute top-[16.66%] w-2.5 h-2.5 rounded-full bg-[#888] -translate-x-1/2 -translate-y-1/2" style={{ left: '27.7%' }} />

              {/* Dot 2 */}
              <div className="absolute top-[50%] right-0 h-px border-b border-dashed border-[#ccc]" style={{ left: '50%' }} />
              <div className="absolute top-[50%] w-2.5 h-2.5 rounded-full bg-[#888] -translate-x-1/2 -translate-y-1/2" style={{ left: '50%' }} />

              {/* Dot 3 */}
              <div className="absolute top-[83.33%] right-0 h-px border-b border-dashed border-[#ccc]" style={{ left: '27.7%' }} />
              <div className="absolute top-[83.33%] w-2.5 h-2.5 rounded-full bg-[#888] -translate-x-1/2 -translate-y-1/2" style={{ left: '27.7%' }} />
            </div>
          </div>

          {/* Right Column: Items */}
          <div className="flex flex-col justify-around gap-16 lg:gap-0 lg:pt-[350px] lg:pb-[50px] min-h-[600px] lg:min-h-[1050px]">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10 xl:gap-16 w-full relative z-10"
              >
                {/* Number */}
                <div 
                  className="text-[80px] sm:text-[100px] xl:text-[120px] font-black text-red-400 leading-none tracking-tighter select-none shrink-0" 
                  style={{ fontFamily: 'Arial Black, Impact, sans-serif' }}
                >
                  {pillar.num}
                </div>

                {/* Text Block */}
                <div className="flex-1 max-w-xl">
                  <h3 className="text-2xl sm:text-3xl font-medium text-ink mb-3 tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-sm sm:text-base text-ink-muted leading-relaxed font-light">
                    {pillar.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
