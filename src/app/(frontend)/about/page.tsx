'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FadeUp } from '@/components/motion/FadeUp'
import { HeroBreadcrumb } from '@/components/shared/HeroBreadcrumb'
import { Button } from '@/components/ui/button'
import { ArrowRight, Globe } from 'lucide-react'
import { PillarsSection } from '@/components/about/PillarsSection'
import FAQ from '@/components/FAQ'
import { WhyChooseUs } from '@/components/about/WhyChooseUs'
import { SwipeCarousel } from '@/components/shared/SwipeCarousel'
import { getFeaturedProducts } from '@/app/(frontend)/actions/getFeaturedProducts'
import { CTASection } from '@/components/shared/CTASection'
const ABOUT_FAQS = [
  {
    question: "Are your products intended for human consumption?",
    answer: "No. All products sold by Sparta Labs are strictly for laboratory research purposes only. They are not intended for human consumption, diagnostic, or therapeutic use. Buyers must be qualified researchers."
  },
  {
    question: "Do you provide Certificates of Analysis (COA)?",
    answer: "Yes, absolute transparency is our philosophy. We utilize independent, US-based third-party laboratories to conduct HPLC and LC-MS testing. Relevant COAs are available on our product pages and included with orders to verify ≥99% purity."
  },
  {
    question: "Where do you ship from?",
    answer: "All of our inventory is securely stored and shipped directly from our fulfillment centers located within the United States, ensuring rapid, reliable delivery without customs delays for domestic researchers."
  },
  {
    question: "How should I store the lyophilized peptides?",
    answer: "Prior to reconstitution, lyophilized (freeze-dried) peptides should be stored in a freezer at -20°C or below for long-term stability. Short-term transit at room temperature does not degrade the compound due to the lyophilization process."
  }
];

export default function AboutPage() {
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  
  const [dynamicCompounds, setDynamicCompounds] = useState<any[]>([])
  const [isLoadingCompounds, setIsLoadingCompounds] = useState(true)

  useEffect(() => {
    getFeaturedProducts().then(products => {
      if (products && products.length > 0) {
        setDynamicCompounds(products)
      }
      setIsLoadingCompounds(false)
    })
  }, [])

  // Hero Parallax
  const { scrollYProgress: heroScroll } = useScroll({
    offset: ["start start", "end start"]
  });
  const heroImageY = useTransform(heroScroll, [0, 1], ["0%", "50%"]);

  const services = [
    {
      id: "01",
      title: "Retail Research Peptides",
      desc: "A comprehensive library of meticulously synthesized peptides available for immediate dispatch in single or multi-vial quantities.",
      image: "/Featured%20Images/three-floating-vials.webp"
    },
    {
      id: "02",
      title: "Wholesale & Bulk Sourcing",
      desc: "Tailored pricing and dedicated supply chains for institutional buyers requiring significant volumes and guaranteed consistency.",
      image: "/Featured%20Images/crushed-white-powder.webp"
    },
    {
      id: "03",
      title: "Custom Synthesis Inquiries",
      desc: "Capabilities to facilitate custom sequence synthesis for specialized or novel research applications upon request.",
      image: "/Featured%20Images/scientist-at-microscope.webp"
    }
  ];

  return (
    <main className="bg-white min-h-screen">
      
      {/* Redesigned Hero Banner */}
      <section className="px-4 md:px-8 container mx-auto mt-24 mb-8 lg:mb-12">
        <div className="relative w-full h-[250px] md:h-[350px] rounded-lg overflow-hidden bg-ink">
          {/* Background Image & Overlays */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <motion.div className="absolute inset-0 w-full h-[120%]" style={{ y: heroImageY }}>
              <Image 
                src="https://res.cloudinary.com/denskvdyt/image/upload/v1782002303/ChatGPT_Image_Jun_21_2026_06_07_18_AM_k3gx1h.png" 
                alt="Laboratory environment" 
                fill 
                className="object-cover object-center opacity-60"
                priority
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-ink/90 via-ink/20 to-ink/95" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 lg:p-16 z-10">
            <FadeUp>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight">About</h1>
            </FadeUp>
            <HeroBreadcrumb items={[{ label: 'Home', href: '/' }, { label: 'About' }]} />
          </div>
        </div>

        {/* Content Relocated from old Hero */}
        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
          <FadeUp delay={0.2} className="flex flex-col gap-8">
            <h2 className="text-[32px] sm:text-[40px] md:text-[48px] leading-[1.05] text-ink font-medium tracking-tight uppercase">
              Uncompromising Quality for Global Research.
            </h2>
            <div className="flex items-center gap-6 md:gap-10 text-ink">
              <div className="flex flex-col">
                <span className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">99%</span>
                <span className="text-xs md:text-sm font-light mt-2 text-ink/70 uppercase tracking-wider">Verified Purity</span>
              </div>
              <div className="w-px h-16 bg-ink/20" />
              <div className="flex flex-col">
                <span className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">USA</span>
                <span className="text-xs md:text-sm font-light mt-2 text-ink/70 uppercase tracking-wider">3rd Party Tested</span>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.4} className="flex flex-col items-start md:items-end justify-between h-full gap-8">
            <p className="text-ink/80 text-sm md:text-base md:text-right leading-relaxed font-light max-w-md">
              A premier, US-based supplier dedicated to rigorous third-party testing and absolute transparency in peptide synthesis.
            </p>
            
            <div className="flex flex-col items-start md:items-end w-full md:w-auto relative gap-6">
              <div className="w-full md:w-auto">
                <Link href="/shop" className="block w-full">
                  <Button className="w-full md:w-auto bg-ink text-white hover:bg-ink/90 rounded-full px-8 py-7 text-base lg:text-lg font-medium flex items-center justify-center gap-4 transition-all duration-300">
                    Explore Our Catalog <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center justify-start md:justify-end gap-4 w-full md:w-auto border-t border-ink/20 pt-4">
                <Globe className="w-4 h-4 text-ink/60" />
                <span className="text-ink/60 text-xs sm:text-sm font-light tracking-wide">
                  Established 2024
                </span>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* 2. Mission, Philosophy, Journey */}
      <PillarsSection />

      {/* 3. Why Choose Us Section - Interactive Split Layout */}
      <WhyChooseUs />

      {/* 3.5. Research Backed Compounds Carousel */}
      <SwipeCarousel 
        title="Research-Backed Compounds"
        description="Every compound is synthesized with purposeful, high-performance processes to ensure absolute purity and stability for your laboratory research."
        cards={dynamicCompounds}
      />

      {/* 4. Our Services Section */}
      <section className="bg-white text-ink py-16 lg:py-20 px-4 md:px-8 lg:px-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left — Heading + Service List */}
          <FadeUp>
            <div className="flex flex-col">
              <h2 className="text-[2.5rem] leading-[1.1] font-normal tracking-[-1.5px] text-ink min-[480px]:text-[3rem] md:text-[4rem] lg:text-[4.5rem] uppercase mb-6">
                Our Services
              </h2>

              <p className="text-base lg:text-lg text-ink-muted leading-relaxed font-light max-w-md mb-8 lg:mb-16">
                Beyond our extensive catalog of readily available research compounds, we provide highly specialized synthesis and bulk fulfillment services for institutional and large-scale researchers globally.
              </p>

              {/* Mobile Image Panel */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black mb-10 lg:hidden block">
                <button
                  onClick={() => setActiveServiceIndex((prev) => (prev + 1) % services.length)}
                  className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                  aria-label="Next service"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <motion.div
                  key={`bg-mobile-${activeServiceIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={services[activeServiceIndex].image}
                    alt={services[activeServiceIndex].title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                </motion.div>

                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <motion.p
                    key={`desc-mobile-${activeServiceIndex}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-[13px] text-white/90 leading-relaxed font-light border border-white/20 rounded-lg px-4 py-3 backdrop-blur-sm bg-white/5"
                  >
                    {services[activeServiceIndex].desc}
                  </motion.p>
                </div>
              </div>

              <div className="flex flex-col gap-5 lg:gap-6">
                {services.map((service, index) => {
                  const isActive = activeServiceIndex === index;
                  return (
                    <button
                      key={service.id}
                      onClick={() => setActiveServiceIndex(index)}
                      className="text-left group flex items-baseline gap-1 transition-all duration-300"
                    >
                      <span
                        className={`text-xl sm:text-2xl lg:text-3xl uppercase tracking-tight transition-all duration-300 ${
                          isActive
                            ? 'text-ink font-medium underline underline-offset-8 decoration-1'
                            : 'text-ink/30 font-normal hover:text-ink/50'
                        }`}
                      >
                        {service.title}
                      </span>
                      <sup className={`text-[11px] lg:text-xs ml-1 transition-colors duration-300 ${isActive ? 'text-ink' : 'text-ink/30'}`}>
                        {service.id}
                      </sup>
                    </button>
                  );
                })}
              </div>
            </div>
          </FadeUp>

          {/* Right — Image Panel (Desktop Only) */}
          <FadeUp delay={0.2} className="hidden lg:block">
            <div className="relative w-full aspect-[4/3] lg:aspect-[5/4] rounded-2xl overflow-hidden bg-black">
              {/* Arrow Button */}
              <button
                onClick={() => setActiveServiceIndex((prev) => (prev + 1) % services.length)}
                className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                aria-label="Next service"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <motion.div
                key={`bg-${activeServiceIndex}`}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute inset-0"
              >
                <Image
                  src={services[activeServiceIndex].image}
                  alt={services[activeServiceIndex].title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              </motion.div>

              {/* Description Overlay */}
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <motion.p
                  key={`desc-${activeServiceIndex}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                  className="text-sm lg:text-base text-white/90 leading-relaxed font-light border border-white/20 rounded-lg px-5 py-4 backdrop-blur-sm bg-white/5"
                >
                  {services[activeServiceIndex].desc}
                </motion.p>
              </div>
            </div>
          </FadeUp>

        </div>
      </section>

      {/* 5. FAQs Section */}
      <FAQ faqs={ABOUT_FAQS} />
      {/* 6. CTA section - Redesigned for Premium Aesthetic */}
      <CTASection
        subtitle="INITIATE YOUR GUIDELINE"
        title="Advance your research."
        description="Explore our catalog of highly purified, third-party verified compounds engineered for rigorous laboratory standards."
        primaryButtonText="Shop Collection"
        primaryButtonLink="/shop"
        secondaryButtonText="View COAs"
        secondaryButtonLink="/certificates"
      />
    </main>
  )
}
