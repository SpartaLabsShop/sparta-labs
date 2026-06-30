'use client'

import React from 'react'
import Image from 'next/image'
import { motion, useScroll, useSpring } from 'framer-motion'
import { FadeUp } from '@/components/motion/FadeUp'
import { PullQuote } from '@/components/editorial/PullQuote'
import { ImageFigure } from '@/components/editorial/ImageFigure'
import { BlogPostCard } from '@/components/editorial/BlogPostCard'
import { StaggerChildren, staggerItemVariants } from '@/components/motion/StaggerChildren'

export default function JournalPostPage() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <main className="bg-gray-50 min-h-screen pb-32">
      {/* Sticky Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-gold z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Hero Image */}
      <div className="w-full h-[60vh] relative mb-16 md:mb-24">
        <Image 
          src="/blog-nad-hero.png" 
          alt="Post hero" 
          fill 
          className="object-cover" 
          priority
        />
        <div className="absolute inset-0 bg-ink/20" />
      </div>

      <article className="px-6 max-w-[720px] mx-auto">
        <FadeUp>
          {/* Meta Row */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-label-md uppercase tracking-wider text-gold mb-8 text-center">
            <span>Emerging</span>
            <span className="text-ink-muted">·</span>
            <span className="text-ink-muted">March 12, 2026</span>
            <span className="text-ink-muted">·</span>
            <span className="text-ink-muted">7 min read</span>
          </div>

          {/* Headline */}
          <h1 className="text-display-lg font-sans uppercase text-ink mb-8 text-center leading-[1.1]">
            The case for NAD+ in mitochondrial research
          </h1>

          {/* Author */}
          <div className="text-body-md text-ink-muted text-center mb-16">
            By <span className="text-ink font-medium">Dr. Researcher Name</span>
          </div>

          {/* Body */}
          <div className="text-body-lg text-ink leading-relaxed space-y-8">
            <p className="first-letter:text-7xl first-letter:font-sans first-letter:float-left first-letter:mr-4 first-letter:text-ink first-letter:mt-2">
              Nicotinamide adenine dinucleotide (NAD+) is an essential pyridine nucleotide that serves as an electron carrier in cellular metabolism and plays a critical role in maintaining mitochondrial function. As we age, intracellular NAD+ levels decline, leading to compromised energy production and increased susceptibility to metabolic dysfunction.
            </p>

            <p>
              In recent years, the administration of NAD+ precursors such as NMN and NR has gained significant traction. However, direct NAD+ supplementation via intravenous or subcutaneous guidelines continues to be heavily researched for its immediate bioavailability and profound impact on sirtuin activation.
            </p>

            <h2 className="text-editorial-md font-sans uppercase text-ink mt-16 mb-6">Cellular Respiration and Sirtuins</h2>
            
            <p>
              The relationship between NAD+ and sirtuins—a family of NAD+-dependent deacetylases—forms the foundation of many longevity guidelines. Sirtuins regulate numerous cellular processes including DNA repair, inflammatory responses, and mitochondrial biogenesis.
            </p>

            <ImageFigure 
              src="/blog-mitochondria.png"
              alt="Mitochondrial structure"
              caption="Fig 1. Electron microscopy of mitochondrial networks demonstrating increased density post-administration."
            />

            <p>
              When NAD+ levels are elevated, sirtuin activity increases proportionally. This results in the deacetylation of target proteins like PGC-1α, which subsequently translocates to the nucleus to drive the transcription of genes responsible for creating new mitochondria.
            </p>

            <PullQuote attribution="Dr. E. Sinclair, Cellular Biology">
              Without sufficient NAD+, the cellular machinery responsible for repair and maintenance simply powers down. It is the molecular equivalent of a brownout.
            </PullQuote>

            <h2 className="text-editorial-md font-sans uppercase text-ink mt-16 mb-6">Clinical Observations</h2>

            <p>
              In controlled environments, subjects receiving direct NAD+ demonstrate accelerated recovery from muscular fatigue and enhanced cognitive baselines. The challenge remains in the stabilization of the compound during transport and the optimization of reconstitution guidelines to prevent rapid degradation.
            </p>

            {/* References */}
            <div className="mt-24 pt-8 border-t border-border-subtle">
              <h3 className="text-label-md uppercase tracking-wider text-ink mb-6">References</h3>
              <ol className="list-decimal list-outside ml-4 space-y-4 text-body-sm text-ink-muted">
                <li>Imai, S., & Guarente, L. (2014). NAD+ and sirtuins in aging and disease. Trends in cell biology, 24(8), 464-471.</li>
                <li>Verdin, E. (2015). NAD+ in aging, metabolism, and neurodegeneration. Science, 350(6265), 1208-1213.</li>
                <li>Gomes, A. P., et al. (2013). Declining NAD+ induces a pseudohypoxic state disrupting nuclear-mitochondrial communication during aging. Cell, 155(7), 1624-1638.</li>
              </ol>
            </div>
          </div>
        </FadeUp>
      </article>

      {/* Related Posts */}
      <section className="px-6 max-w-[1280px] mx-auto mt-32 pt-16 border-t border-border-subtle">
        <div className="mb-12">
          <span className="text-label-md uppercase tracking-wider text-gold mb-2 block">Related</span>
          <h3 className="text-editorial-lg font-sans uppercase text-ink">Continue reading</h3>
        </div>
        
        <StaggerChildren staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <motion.div key={i} variants={staggerItemVariants} className="h-full">
              <BlogPostCard 
                slug={`related-post-${i}`}
                title={`Exploring the synergistic effects of BPC-157 and TB-500 ${i}`}
                category="Guidelines"
                excerpt="An analysis of co-administration guidelines for enhanced tissue repair and angiogenesis."
                imageSrc="/blog-nad-hero.png"
                readTime="8 min read"
              />
            </motion.div>
          ))}
        </StaggerChildren>
      </section>
    </main>
  )
}
