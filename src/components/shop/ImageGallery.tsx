'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import { X, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog'

export interface ImageGalleryProps {
  images: string[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  
  // Embla for mobile swipe
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setActiveIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi, setActiveIndex])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  const scrollTo = useCallback((index: number) => {
    setActiveIndex(index)
    if (emblaApi) emblaApi.scrollTo(index)
  }, [emblaApi])

  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const cursorXSpring = useSpring(cursorX, { damping: 25, stiffness: 250 })
  const cursorYSpring = useSpring(cursorY, { damping: 25, stiffness: 250 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const localX = e.clientX - left
    const localY = e.clientY - top
    
    // Update custom cursor position
    cursorX.set(localX)
    cursorY.set(localY)

    // Panning logic
    const x = (localX / width) * 100
    const y = (localY / height) * 100
    
    const img = e.currentTarget.querySelector('img')
    if (img) {
      img.style.transformOrigin = `${x}% ${y}%`
    }
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const img = e.currentTarget.querySelector('img')
    if (img) {
      img.style.transformOrigin = 'center center'
      // Reset scale is handled by CSS group-hover removing the scale class
    }
  }

  if (!images || images.length === 0) return null

  return (
    <div className="flex flex-col w-full gap-4 lg:gap-6 relative">
      {/* Main Large Image */}
      <div 
        className="relative w-full aspect-[4/5] bg-white rounded-[2.5rem] overflow-hidden shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-ink/5" 
        ref={emblaRef}
      >
        <div className="flex h-full">
          {images.map((img, idx) => (
            <div 
              key={idx} 
              className="relative min-w-0 shrink-0 grow-0 basis-full h-full group overflow-hidden"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <Image
                src={img}
                alt={`Product view ${idx + 1}`}
                fill
                priority={idx === 0}
                className="object-cover scale-125 transition-transform duration-[400ms] ease-out group-hover:scale-[1.9]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />


            </div>
          ))}
        </div>
      </div>

      {/* Thumbnails Row (Glassmorphic Pill) */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <div className="flex gap-2 bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_4px_24px_rgb(0,0,0,0.1)] rounded-full p-2 overflow-x-auto scrollbar-none max-w-[90vw]">
            {images.map((img, idx) => {
              const isActive = activeIndex === idx
              return (
                <button
                  key={idx}
                  onClick={() => scrollTo(idx)}
                  className={cn(
                    "relative w-14 h-14 shrink-0 bg-white rounded-full overflow-hidden transition-all duration-500",
                    isActive 
                      ? "ring-2 ring-ink ring-offset-2 ring-offset-white opacity-100" 
                      : "opacity-50 hover:opacity-100 hover:scale-105"
                  )}
                aria-label={`View image ${idx + 1}`}
              >
                <Image 
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 80px, 80px"
                />
              </button>
            )
          })}
          </div>
        </div>
      )}

    </div>
  )
}
