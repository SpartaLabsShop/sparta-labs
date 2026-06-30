'use client'

import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { FadeUp } from '@/components/motion/FadeUp'

import { useRouter } from 'next/navigation'

export interface SwipeCard {
  title: string
  desc: string
  image: string
  link?: string
}

export interface SwipeCarouselProps {
  title: string
  description: string
  cards: SwipeCard[]
  isLoading?: boolean
}

export function SwipeCarousel({ title, description, cards, isLoading = false }: SwipeCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  
  // Custom Cursor state
  const [isHovered, setIsHovered] = useState(false)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  // Track dragging bounds and mobile state
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 })
  const [isMobile, setIsMobile] = useState(false)
  
  // Prevent click when dragging
  const isDragging = useRef(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    
    const updateConstraints = () => {
      checkMobile()
      if (containerRef.current && trackRef.current && !isMobile) {
        const containerWidth = containerRef.current.offsetWidth
        const trackWidth = trackRef.current.scrollWidth
        setDragConstraints({
          left: -Math.max(trackWidth - containerWidth + 48, 0),
          right: 0
        })
      }
    }
    
    setTimeout(updateConstraints, 100)
    window.addEventListener('resize', updateConstraints)
    return () => window.removeEventListener('resize', updateConstraints)
  }, [cards, isLoading, isMobile])

  // Mobile Auto-Scroll
  useEffect(() => {
    if (!isMobile || isLoading) return;
    
    const interval = setInterval(() => {
      if (trackRef.current) {
        const track = trackRef.current;
        const cardWidth = 280 + 16; // w-[280px] + gap-4
        
        // If we've reached the end, scroll back to start
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
          track.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          track.scrollBy({ left: cardWidth, behavior: 'smooth' })
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isMobile, isLoading]);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (containerRef.current && !isMobile) {
      const rect = containerRef.current.getBoundingClientRect()
      cursorX.set(e.clientX - rect.left)
      cursorY.set(e.clientY - rect.top)
    }
  }

  const handleCardClick = (e: React.MouseEvent, link?: string) => {
    if (isDragging.current) {
      e.preventDefault();
      return;
    }
    if (link) {
      router.push(link);
    }
  }

  return (
    <section className="py-16 lg:py-20 bg-gray-100 text-ink overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <FadeUp className="max-w-2xl mb-12 lg:mb-16">
          <h2 className="text-4xl lg:text-5xl font-sans font-medium tracking-tight mb-6 text-ink uppercase">
            {title}
          </h2>
          <p className="text-lg lg:text-xl text-ink/70 leading-relaxed font-light">
            {description}
          </p>
        </FadeUp>

        {/* Carousel Container */}
        <div 
          ref={containerRef}
          className="relative w-full md:cursor-none md:[&_*]:!cursor-none"
          onPointerMove={handlePointerMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Custom Cursor Bubble (Desktop Only) */}
          <motion.div
            className="pointer-events-none absolute z-50 hidden md:flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 bg-white/90 backdrop-blur-md rounded-full shadow-xl border border-white/20"
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
              translateX: '-50%',
              translateY: '-50%',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: isHovered && !isMobile && !isLoading ? 1 : 0, 
              opacity: isHovered && !isMobile && !isLoading ? 1 : 0 
            }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-ink font-sans font-medium text-[10px] lg:text-[12px] uppercase tracking-wider">SWIPE</span>
          </motion.div>

          {/* Draggable Track (Desktop) / Scrollable Track (Mobile) */}
          <motion.div 
            ref={trackRef}
            drag={isMobile || isLoading ? false : "x"}
            dragConstraints={dragConstraints}
            dragElastic={0.1}
            onDragStart={() => { isDragging.current = true }}
            onDragEnd={() => { setTimeout(() => { isDragging.current = false }, 50) }}
            whileTap={{ cursor: isMobile || isLoading ? "auto" : "none" }}
            className={`flex gap-4 md:gap-6 items-stretch pb-8 ${isMobile ? 'overflow-x-auto snap-x snap-mandatory' : ''} hide-scrollbar`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {isLoading ? (
              [...Array(5)].map((_, idx) => (
                <div 
                  key={`skeleton-${idx}`}
                  className="relative shrink-0 w-[280px] md:w-[350px] lg:w-[400px] h-[350px] md:h-[450px] lg:h-[500px] rounded-[2rem] overflow-hidden group border border-slate-200 snap-center bg-slate-300 animate-pulse"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-400 via-slate-300 to-transparent opacity-50" />
                  <div className="absolute bottom-0 left-0 w-full p-6 lg:p-8">
                    <div className="w-1/2 h-8 bg-slate-400 rounded-lg mb-4" />
                    <div className="w-full h-4 bg-slate-400 rounded-md mb-2" />
                    <div className="w-3/4 h-4 bg-slate-400 rounded-md" />
                  </div>
                </div>
              ))
            ) : (
              cards.map((card, idx) => (
                <motion.div 
                  key={idx}
                  onClick={(e) => handleCardClick(e, card.link)}
                  className={`relative shrink-0 w-[280px] md:w-[350px] lg:w-[400px] h-[350px] md:h-[450px] lg:h-[500px] rounded-[2rem] overflow-hidden group border border-slate-200 snap-center ${card.link ? 'cursor-pointer' : ''}`}
                >
                  <Image 
                    src={card.image} 
                    alt={card.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                    draggable={false} // Important so browser doesn't try to drag the image
                  />
                  
                  {/* Gradient overlay for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent pointer-events-none" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 w-full p-6 lg:p-8 pointer-events-none">
                    <h3 className="text-2xl lg:text-3xl font-sans text-white mb-3 tracking-wide">
                      {card.title}
                    </h3>
                    <p className="text-white/80 font-light leading-relaxed text-sm md:text-base">
                      {card.desc}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
          
        </div>
      </div>
    </section>
  )
}
