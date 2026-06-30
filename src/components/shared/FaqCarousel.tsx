'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useMotionValueEvent, useMotionValue, useSpring } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { FadeUp } from '@/components/motion/FadeUp'

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCarouselProps {
  faqs: FaqItem[];
  title?: string;
  accentTitle?: string;
  description?: string;
  sectionLabel?: string;
  theme?: 'light' | 'dark';
}

export function FaqCarousel({ 
  faqs, 
  title = "Frequently", 
  accentTitle = "Asked Questions", 
  description = "Find answers to common questions about our research compounds, laboratory guidelines, and purity standards.",
  sectionLabel,
  theme = 'light'
}: FaqCarouselProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Custom Cursor state
  const [isHovered, setIsHovered] = useState(false);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-ink' : 'bg-[#f4f7fb]';
  const titleClass = isDark ? 'text-cream' : 'text-ink';
  const descClass = isDark ? 'text-cream-warm/70' : 'text-ink/70';
  
  // Active/Inactive Card Styles
  const activeCardBg = isDark ? 'bg-white text-ink' : 'bg-[#1c4477] text-white';
  const inactiveCardBg = isDark ? 'bg-white/5 text-white/50' : 'bg-[#e6ebf0] text-[#1c4477]/70';

  // Set up scroll-jacking
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Determine active index based on scroll progress
    // If we have 4 items, progress 0-0.25 is index 0, 0.25-0.5 is index 1, etc.
    const chunk = 1 / faqs.length;
    let index = Math.floor(latest / chunk);
    // Ensure index doesn't go out of bounds (can happen exactly at 1.0)
    index = Math.max(0, Math.min(faqs.length - 1, index));
    
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  });

  // Enforce bounding: Only scroll the container if the newly expanded card falls outside the viewport
  useEffect(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    
    // We can approximate the positions based on card widths
    // Inactive width is min(70vw, 280px). Active width is min(85vw, 480px). Gap is 24px.
    // For simplicity, we get the actual DOM rects.
    // Wait for Framer Motion layout to start
    setTimeout(() => {
      const cards = container.querySelectorAll('.faq-card');
      const activeCard = cards[activeIndex] as HTMLElement;
      if (!activeCard) return;

      const containerRect = container.getBoundingClientRect();
      const cardRect = activeCard.getBoundingClientRect();

      let newScrollLeft = container.scrollLeft;

      // If the right edge of the card overflows the right edge of the container
      if (cardRect.right > containerRect.right) {
        newScrollLeft += (cardRect.right - containerRect.right) + 24; 
      }
      // If the left edge of the card is hidden past the left edge of the container
      else if (cardRect.left < containerRect.left) {
        newScrollLeft -= (containerRect.left - cardRect.left) + 24;
      }

      if (newScrollLeft !== container.scrollLeft) {
        container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
      }
    }, 50);
  }, [activeIndex]);

  const scrollWindow = (direction: 'left' | 'right') => {
    if (!sectionRef.current) return;
    
    const rect = sectionRef.current.getBoundingClientRect();
    const startY = window.scrollY + rect.top; 
    const sectionHeight = sectionRef.current.offsetHeight - window.innerHeight;
    
    // We divide the scrollable area into (faqs.length) segments
    const chunkHeight = sectionHeight / faqs.length;
    
    let newIndex = direction === 'right' ? activeIndex + 1 : activeIndex - 1;
    newIndex = Math.max(0, Math.min(faqs.length - 1, newIndex));
    
    // Target the middle of the corresponding chunk
    const targetY = startY + (chunkHeight * newIndex) + (chunkHeight / 2);
    
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  // Card Widths
  // Adjusted for better mobile peek (Active is 80vw to show more of the next card)
  const getCardStyle = (isActive: boolean) => {
    if (isActive) {
      return { width: 'min(80vw, 480px)', minWidth: 'min(80vw, 480px)' };
    }
    return { width: 'min(60vw, 280px)', minWidth: 'min(60vw, 280px)' };
  };

  return (
    <section 
      ref={sectionRef} 
      className={`w-full relative ${bgClass}`}
      style={{ height: `${faqs.length * 80}vh` }} // Make section taller based on number of FAQs
    >
      <div 
        className="sticky top-0 h-[100dvh] w-full flex flex-col justify-start pt-10 lg:pt-16 pb-12 overflow-hidden md:cursor-none"
        onPointerMove={(e) => {
          cursorX.set(e.clientX);
          cursorY.set(e.clientY);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        
        {/* Custom Cursor Bubble (Desktop Only) */}
        <motion.div
          className={`pointer-events-none absolute z-50 hidden xl:flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 rounded-full shadow-xl border border-white/20 ${
            isDark ? 'bg-[#5984c4]/90 backdrop-blur-md text-white' : 'bg-white/90 backdrop-blur-md text-[#5984c4]'
          }`}
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            translateX: '-50%',
            translateY: '-50%',
            top: 0,
            left: 0,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: isHovered && !isHoveringButton ? 1 : 0, 
            opacity: isHovered && !isHoveringButton ? 1 : 0 
          }}
          transition={{ duration: 0.2 }}
        >
          <span className="font-sans font-medium text-[10px] lg:text-[12px] uppercase tracking-wider text-center leading-[1.2]">
            KEEP<br/>SCROLLING
          </span>
        </motion.div>

        {/* Background Elements */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
          
          {/* Subtle Glow Orbs */}
          <div className="absolute top-0 right-0 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-gold/5 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[100vw] h-[100vw] md:w-[50vw] md:h-[50vw] bg-ink/5 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4" />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10">
          
          {/* Header */}
          <div className="mb-12 lg:mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
            <FadeUp className="max-w-2xl">
              {sectionLabel && (
                <span className={`text-label-md uppercase tracking-widest mb-4 block font-bold ${isDark ? 'text-gold' : 'text-[#5984c4]'}`}>
                  {sectionLabel}
                </span>
              )}
              <h2 className={`text-4xl sm:text-5xl xl:text-6xl font-sans uppercase tracking-tight leading-[1.1] ${titleClass}`}>
                {title} <span className={isDark ? 'text-gold' : 'text-[#1c4477]'}>{accentTitle}</span>
              </h2>
            </FadeUp>
            
            <FadeUp delay={0.1} className="max-w-xs md:text-right">
              <p className={`text-sm lg:text-base leading-relaxed mb-6 ${descClass}`}>
                {description}
              </p>
              <div 
                className="flex items-center md:justify-end gap-4"
                onMouseEnter={() => setIsHoveringButton(true)}
                onMouseLeave={() => setIsHoveringButton(false)}
              >
                <button 
                  onClick={() => scrollWindow('left')}
                  disabled={activeIndex === 0}
                  aria-label="Previous question"
                  className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors group disabled:opacity-30 disabled:cursor-not-allowed !cursor-default ${
                    isDark 
                      ? 'border-cream/20 hover:bg-cream/10 text-cream' 
                      : 'border-slate-300 hover:bg-slate-100 text-slate-500 bg-white shadow-sm'
                  }`}
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform pointer-events-none" />
                </button>
                <button 
                  onClick={() => scrollWindow('right')}
                  disabled={activeIndex === faqs.length - 1}
                  aria-label="Next question"
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors group disabled:opacity-30 disabled:cursor-not-allowed shadow-md !cursor-default ${
                    isDark 
                      ? 'bg-cream text-ink hover:bg-cream/90' 
                      : 'bg-ink text-white hover:bg-ink/90'
                  }`}
                >
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform pointer-events-none" />
                </button>
              </div>
            </FadeUp>
          </div>
        </div>

        {/* Carousel Track Container (100vw Full Bleed) */}
        {/* We moved this outside the max-w-[1400px] wrapper. This ensures the overflow-x-auto container 
            spans the entire physical screen, meaning shadows can NEVER be clipped by an invisible wrapper edge! */}
        <div className="w-full relative z-10 flex-1 min-h-0 flex flex-col md:[&_*]:!cursor-none">
          <div ref={scrollRef} className="w-full overflow-x-auto hide-scrollbar pb-24 pt-16 -mt-16 flex-1 min-h-0 flex flex-col">
            <motion.div 
              className="flex gap-6 py-8 flex-1 min-h-0"
              // We use layout to allow cards to flex smoothly, removing explicit x translation
            >
              {/* Leading Spacer: Mathematically aligns the first card with the px-6 padding of the max-w-[1400px] header */}
              <div className="shrink-0" style={{ width: 'max(1.5rem, calc(50vw - 700px + 1.5rem))' }} aria-hidden="true" />
              {faqs.map((faq, index) => {
                const isActive = index === activeIndex;

                return (
                  <div 
                    key={index}
                    onClick={() => {
                      if (!isActive) {
                         if (sectionRef.current) {
                           const rect = sectionRef.current.getBoundingClientRect();
                           const startY = window.scrollY + rect.top; 
                           const sectionHeight = sectionRef.current.offsetHeight - window.innerHeight;
                           const chunkHeight = sectionHeight / faqs.length;
                           const targetY = startY + (chunkHeight * index) + (chunkHeight / 2);
                           window.scrollTo({ top: targetY, behavior: 'smooth' });
                         }
                      }
                    }}
                    className={`faq-card shrink-0 overflow-y-auto hide-scrollbar rounded-[2rem] p-6 md:p-8 lg:p-12 transition-all duration-500 ease-out flex flex-col cursor-pointer min-h-[350px] lg:min-h-[min(480px,60vh)] h-fit max-h-full ${
                      isActive 
                        ? `${activeCardBg} shadow-2xl relative z-10` 
                        : `${inactiveCardBg} hover:opacity-80 relative z-0`
                    }`}
                    style={{ ...getCardStyle(isActive) }}
                  >
                    {/* Subtle Noise Texture on Cards (Optimized for performance) */}
                    <div 
                      className="absolute inset-0 opacity-[0.04] pointer-events-none"
                      style={{ 
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                        transform: 'translateZ(0)'
                      }}
                    />
                    
                    {/* Inner wrapper allows text to naturally wrap based on the card's current width */}
                    <div className="w-full h-full flex flex-col relative z-10">
                      {/* Let the question fill the width on active cards, but lock it on inactive cards to prevent reflow during transition */}
                      <h3 className={`text-2xl lg:text-3xl font-sans uppercase leading-tight mb-6 md:mb-8 w-full ${isActive ? 'max-w-none' : 'max-w-[216px] lg:max-w-[184px] line-clamp-4'}`}>
                        {faq.question}
                      </h3>

                      {/* We lock the answer to the active width so it doesn't reflow while fading in/out */}
                      <div 
                        className={`transition-all duration-500 w-full md:w-[384px] ${
                          isActive ? 'max-h-[1000px] opacity-100 mt-6' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <p className={`text-sm lg:text-base leading-relaxed font-light ${
                          isActive 
                            ? (isDark ? 'text-ink/70' : 'text-white/80') 
                            : ''
                        }`}>
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Trailing Spacer: Provides symmetrical padding on the right side so the last card aligns nicely */}
              <div className="shrink-0" style={{ width: 'max(1.5rem, calc(50vw - 700px + 1.5rem))' }} aria-hidden="true" />
            </motion.div>
          </div>
        </div>


      </div>
    </section>
  )
}
