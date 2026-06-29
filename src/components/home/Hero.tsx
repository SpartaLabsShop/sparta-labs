'use client'

import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Space_Grotesk } from 'next/font/google'
import { usePreloader } from './HomePreloaderWrapper'
import { Marquee } from '@/components/shared/Marquee'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['300', '400', '500', '700'] })

gsap.registerPlugin(useGSAP, ScrollTrigger);

const MagneticButton = ({ children, className, variant = "default", size = "default", href }: any) => {
  if (href) {
    return (
      <div className="inline-block">
        <Button variant={variant} size={size} className={className} asChild>
          <Link href={href}>{children}</Link>
        </Button>
      </div>
    )
  }
  return (
    <div className="inline-block">
      <Button variant={variant} size={size} className={className}>
        {children}
      </Button>
    </div>
  )
}

const backgroundImages = [
  '/temp-homepage/hero-1.webp',
  '/temp-homepage/hero-2.webp',
  '/temp-homepage/hero-3.webp'
]

export function Hero() {
  const { isReady } = usePreloader()
  const textContainerRef = useRef<HTMLDivElement>(null)

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Auto-scroll carousel every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useGSAP(() => {
    if (!isReady) return;

    // Staggered text entrance
    const elements = textContainerRef.current?.querySelectorAll('.gsap-reveal')
    if (elements) {
      gsap.fromTo(elements,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.2
        }
      )
    }
  }, [isReady])

  return (
    <section className="relative w-full h-[100dvh] min-h-[600px] lg:min-h-[min(800px,100dvh)] overflow-hidden bg-black">

      {/* Background Image Carousel */}
      <div className="absolute inset-0 w-full h-full z-0 bg-ink">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={backgroundImages[currentImageIndex]}
              alt="Dark blue laboratory environment with premium glass peptide vials — Sparta Labs research peptides"
              fill
              className="object-cover object-center"
              priority={currentImageIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

      </div>

      <div className="relative w-full h-full px-6 md:px-12 lg:px-16 flex flex-col items-center lg:items-start justify-center pt-32 lg:pt-0 pb-16 lg:pb-0 z-20">

        {/* Text & CTA */}
        <div ref={textContainerRef} className="w-full lg:w-[55%] xl:w-[50%] flex flex-col items-center lg:items-start text-center lg:text-left mt-4 lg:mt-0 drop-shadow-md">

          <div className="gsap-reveal overflow-hidden mb-6 lg:mb-8">
            <span className="block text-label-md font-bold text-white tracking-[0.2em] uppercase">
              PRECISION. PURITY. PERFORMANCE.
            </span>
          </div>

          <div className="gsap-reveal overflow-hidden mb-5 lg:mb-8">
            <h1 className={`text-[clamp(2.75rem,8vw,3.5rem)] lg:text-[clamp(3.5rem,4.5vw,5.25rem)] leading-[1.05] font-bold tracking-tighter text-white ${spaceGrotesk.className}`}>
              Research-Grade Peptides <br className="hidden lg:block" />
              for Peak Performance
            </h1>
          </div>

          <div className="gsap-reveal overflow-hidden mb-8 lg:mb-12">
            <p className="text-body-md lg:text-body-lg text-white/90 max-w-[480px]">
              US-synthesized research peptides verified at ≥99% HPLC purity — with a full Certificate of Analysis on every order. Built for researchers who refuse to compromise on quality.
            </p>
          </div>

          <div className="gsap-reveal flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <MagneticButton href="/shop" variant="ghost" className="group w-full sm:w-auto px-9 py-6 rounded-none uppercase text-[10px] tracking-[0.25em] font-bold bg-white text-black hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-300 flex items-center justify-center gap-3">
              SHOP RESEARCH PEPTIDES
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1.5" />
            </MagneticButton>
            <MagneticButton href="/about" variant="ghost" className="group w-full sm:w-auto px-9 py-6 rounded-none uppercase text-[10px] tracking-[0.25em] font-bold border border-white/50 text-white hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-md bg-white/5 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3">
              DISCOVER THE LAB
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1.5" />
            </MagneticButton>
          </div>

          {/* Functional Carousel Dots Indicator */}
          <div className="gsap-reveal flex items-center gap-3 mt-12 lg:mt-24">
            {backgroundImages.map((_, idx) => (
              <div
                key={idx}
                className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${currentImageIndex === idx ? 'bg-[#1e4066] w-8' : 'bg-ink/20 hover:bg-ink/40 w-2.5'}`}
                onClick={() => setCurrentImageIndex(idx)}
              ></div>
            ))}
          </div>
        </div>

      </div>

      {/* Modern White Marquee overlaying the bottom of the Hero */}
      <div className="absolute bottom-0 inset-x-0 z-30 shadow-[0_-10px_50px_rgba(0,0,0,0.2)]">
        <Marquee
          className="bg-white border-none py-5"
          textClassName="text-black font-bold tracking-[0.35em]"
          dotClassName="text-black/30 text-[14px]"
        />
      </div>
    </section>
  )
}
