'use client'

import React, { useState, useEffect, useRef, createContext, useContext } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const PreloaderContext = createContext({ isReady: true })
export const usePreloader = () => useContext(PreloaderContext)

const QUOTES = [
  "Brace for impact. 99.9% purity landing...",
  "Incoming delivery. Clear the drop zone...",
  "Dropping the purest peptides on the market...",
  "Gravity works. Our peptides work better.",
]

export function HomePreloaderWrapper({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const [quote, setQuote] = useState("")
  const preloaderRef = useRef<HTMLDivElement>(null)
  const vialRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const brandRef = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)])
  }, [])

  useGSAP(() => {
    // Check if the preloader has already been shown in this browser session
    const hasPlayed = sessionStorage.getItem('spartaPreloaderPlayed')
    
    if (hasPlayed === 'true') {
      // Immediately hide preloader and set ready without animation
      setIsReady(true)
      gsap.set(preloaderRef.current, { display: 'none' })
      return
    }

    // Mark as played for future navigations
    sessionStorage.setItem('spartaPreloaderPlayed', 'true')

    const tl = gsap.timeline({
      onComplete: () => {
        setIsReady(true)
        gsap.to(preloaderRef.current, { opacity: 0, display: 'none', duration: 0.6, ease: 'power2.inOut' })
      }
    })

    // 1. The Realistic Fall
    // Start vial high up (off-screen) with a slight tilt
    tl.fromTo(vialRef.current, 
      { y: -window.innerHeight, opacity: 1, rotation: 12 },
      { 
        y: 0, 
        duration: 1.4, // Slower drop
        ease: "power2.in",
        delay: 0.2
      }
    )
    
    // 2. Impact & Wobble (Slight left right motion)
    tl.add("impact")
    
    // Hit the invisible base and wobble to settle (slower motion)
    tl.to(vialRef.current, { rotation: -6, duration: 0.35, ease: "power1.out" }, "impact")
    tl.to(vialRef.current, { rotation: 4, duration: 0.3, ease: "power1.inOut" })
    tl.to(vialRef.current, { rotation: -2, duration: 0.25, ease: "power1.inOut" })
    tl.to(vialRef.current, { rotation: 0, duration: 0.2, ease: "power1.out" })

    // Circle background zoom in effect on impact
    tl.fromTo(glowRef.current, 
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.5)" },
      "impact" // Start exactly when it hits the ground
    )
    
    // 3. Reveal Text below the vial
    // Fade in branding and humorous quote
    tl.to(brandRef.current, { opacity: 1, duration: 0.5, ease: "power2.out" }, "impact+=0.3")
    tl.fromTo(quoteRef.current, 
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      "<"
    )

    // 4. Pause for reading before fading out
    tl.to({}, { duration: 1.5 })

    // 5. Zoom in and fade out the vial and text
    tl.to(vialRef.current, { scale: 3, opacity: 0, duration: 0.6, ease: "power2.in" })
    tl.to(brandRef.current, { opacity: 0, duration: 0.4 }, "<")
    tl.to(quoteRef.current, { opacity: 0, duration: 0.4 }, "<")
    tl.to(glowRef.current, { opacity: 0, duration: 0.6, ease: "power2.inOut" }, "<")

  }, [])

  return (
    <PreloaderContext.Provider value={{ isReady }}>
      {/* Background Page Content */}
      {children}

      {/* Fullscreen Overlay */}
      <div 
        ref={preloaderRef}
        className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-white overflow-hidden"
      >
         <div className="relative flex items-center justify-center flex-1 w-full">
           {/* Solid Circular Background behind vial */}
           <div 
             ref={glowRef}
             className="absolute w-[220px] h-[220px] md:w-[320px] md:h-[320px] bg-cream rounded-full -z-10" 
             style={{ opacity: 0, transform: 'scale(0)' }}
           />
           
           {/* The Vial */}
           <div 
             ref={vialRef}
             className="relative w-[140px] sm:w-[180px] lg:w-[240px] aspect-[1/2.2]"
             style={{ opacity: 0, willChange: 'transform' }}
           >
             <Image 
               src="/Featured%20Images/vial-no-bg.webp"
               alt="Vial Preloader"
               fill
               className="object-contain"
               priority
             />
           </div>
         </div>

         {/* Branding Footer */}
         <div 
           ref={brandRef}
           className="absolute bottom-12 md:bottom-[10%] flex flex-col items-center gap-4 text-ink/50"
           style={{ opacity: 0 }}
         >
           <svg width="48" height="24" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 15 C15 7, 45 7, 45 15 C45 23, 20 23, 20 15 C20 11, 40 11, 40 15 C40 19, 25 19, 25 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 15 C5 2, 55 2, 55 15 C55 28, 10 28, 10 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="58" cy="4" r="1.5" fill="currentColor" />
           </svg>
           <span className="text-[10px] md:text-label-sm uppercase tracking-[0.3em] font-bold text-center">
             Sparta Labs
           </span>
         </div>

         {/* Humorous Quote (Fades in to replace branding, shoots up with vial) */}
         <div 
           ref={quoteRef}
           className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[90%] text-center pointer-events-none"
           style={{ opacity: 0 }}
         >
           <span className="text-xs md:text-sm font-sans uppercase tracking-[0.2em] font-bold text-ink drop-shadow-sm">
             {quote}
           </span>
         </div>
      </div>
    </PreloaderContext.Provider>
  )
}
