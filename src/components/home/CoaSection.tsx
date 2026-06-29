'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { Container } from '@/components/ui/container'
import { FadeUp } from '@/components/motion/FadeUp'
import { motion, useSpring, useTransform } from 'framer-motion'
import { CheckCircle2, ShieldCheck, FileSearch, ArrowUpRight } from 'lucide-react'

// Desktop Animated HUD Card
const AnimatedHUDCard = ({
  icon, title, desc, direction, delay, positionClass, tooltip
}: {
  icon: React.ReactNode, title: string, desc: string, direction: 'left' | 'right', delay: number, positionClass: string, tooltip?: string
}) => {
  const isLeft = direction === 'left'
  
  const lineVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: { 
      scaleX: 1, 
      opacity: 1,
      transition: { duration: 0.5, delay: delay, ease: [0.16, 1, 0.3, 1] as const } 
    }
  }

  // Wipe the box into existence from the side the line touches it
  const boxVariants = {
    hidden: { clipPath: isLeft ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)', opacity: 0 },
    visible: { 
      clipPath: 'inset(0% 0% 0% 0%)',
      opacity: 1,
      transition: { duration: 0.6, delay: delay + 0.4, ease: [0.16, 1, 0.3, 1] as const }
    }
  }

  const contentVariants = {
    hidden: { opacity: 0, filter: 'blur(4px)', y: 5 },
    visible: { 
      opacity: 1, filter: 'blur(0px)', y: 0,
      transition: { duration: 0.5, delay: delay + 0.7, ease: "easeOut" as const } 
    }
  }

  return (
    <div className={`hidden lg:block absolute z-30 ${positionClass}`}>
       <motion.div 
         initial="hidden"
         whileInView="visible"
         viewport={{ once: true, margin: "-10%" }}
         className={`relative group cursor-default w-full flex ${isLeft ? 'justify-start' : 'justify-end'}`}
       >
          {/* Connecting Line */}
          <motion.div 
            variants={lineVariants}
            style={{ transformOrigin: isLeft ? 'right center' : 'left center' }}
            className={`absolute top-1/2 h-[1px] bg-[#5984c4]/40 group-hover:bg-[#5984c4]/80 transition-colors duration-500 z-0 ${isLeft ? 'left-[240px] right-[150px]' : 'left-[150px] right-[240px]'}`} 
          >
            {/* Single dot at the start (closest to the vial) */}
            <div className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#5984c4]/80 group-hover:bg-[#5984c4] transition-colors duration-500 ${isLeft ? 'right-0' : 'left-0'}`} />
          </motion.div>
          
          {/* The Box */}
          <motion.div 
            variants={boxVariants}
            title={tooltip}
            className="relative z-10 shrink-0 mx-0 w-[240px] bg-white/80 border border-[#5984c4]/20 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm"
          >
            {/* Hover Effects */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white transition-colors duration-500 pointer-events-none" />
            <div className="absolute inset-0 border border-[#5984c4]/0 group-hover:border-[#5984c4]/50 rounded-2xl transition-colors duration-500 pointer-events-none" />
            
            {/* Inner Content */}
            <motion.div variants={contentVariants} className="p-5 lg:p-6 w-full h-full relative z-20">
              <div className="w-10 h-10 rounded-full bg-[#5984c4]/10 flex items-center justify-center mb-4">
                {icon}
              </div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-2 text-ink">{title}</h4>
              <p className="text-xs text-ink/70 leading-relaxed">{desc}</p>
            </motion.div>
          </motion.div>
       </motion.div>
    </div>
  )
}

// Mobile Animated Metric Card
const MobileAnimatedCard = ({ icon, title, desc, delay, tooltip }: { icon: React.ReactNode, title: string, desc: string, delay: number, tooltip?: string }) => {
  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-5%" }}
      className="relative group cursor-default w-full"
    >
      <motion.div 
        variants={{
          hidden: { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
          visible: { 
            clipPath: 'inset(0% 0% 0% 0%)', opacity: 1,
            transition: { duration: 0.6, delay: delay, ease: [0.16, 1, 0.3, 1] as const }
          }
        }}
        title={tooltip}
        className="relative z-10 w-full bg-white/80 border border-[#5984c4]/20 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm"
      >
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { 
              opacity: 1, y: 0,
              transition: { duration: 0.5, delay: delay + 0.3, ease: "easeOut" } 
            }
          }}
          className="p-5 w-full h-full relative z-20"
        >
          <div className="w-10 h-10 rounded-full bg-[#5984c4]/10 flex items-center justify-center mb-4">
            {icon}
          </div>
          <h4 className="text-sm font-bold uppercase tracking-wider mb-2 text-ink">{title}</h4>
          <p className="text-xs text-ink/70 leading-relaxed">{desc}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}


export function CoaSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Create a mouse-tracking effect for the 3D vial
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePosition({ x, y })
  }

  // Smooth springs for mouse movement
  const springConfig = { damping: 20, stiffness: 50, mass: 1 }
  const rotateX = useSpring(mousePosition.y * 30, springConfig)
  const rotateY = useSpring(mousePosition.x * -30, springConfig)
  
  return (
      <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
      className="relative w-full bg-[#f8fafd] text-ink py-24 lg:py-48 overflow-hidden z-10"
    >
       {/* Aesthetic Ambient Background Glow */}
       <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
          <div className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[700px] lg:h-[700px] rounded-full bg-gradient-to-tr from-[#5984c4]/5 to-[#5984c4]/10 blur-[80px] lg:blur-[140px] transform translate-y-16 transform-gpu will-change-transform opacity-60" />
       </div>
       
       <Container size="wide" className="relative z-10">
         
         {/* Header */}
         <div className="text-center mb-8 lg:mb-16">
            <FadeUp>
              <span className="text-label-md uppercase tracking-widest text-[#5984c4] mb-4 lg:mb-6 block font-bold">
                ABSOLUTE TRANSPARENCY
              </span>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="text-[12vw] md:text-5xl lg:text-7xl font-display leading-[0.9] tracking-tight text-ink">
                Verified Purity.<br/>Every Single Batch.
              </h2>
            </FadeUp>
            <FadeUp delay={0.2}>
              <p className="mt-6 text-body-md text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Third-party purity verification is the cornerstone of research-grade compounds. Every vial we ship carries an independently verified COA that proves what is inside — not what we claim is inside. Here is exactly what we test for, and why it matters.
              </p>
            </FadeUp>
         </div>

         {/* Interactive Arena (Vial & Desktop HUD) */}
         <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[700px] flex items-center justify-center">
            
            {/* The Central "Hologram" Vial */}
            <motion.div 
              style={{ rotateX, rotateY }}
              className="relative w-[140px] sm:w-[180px] lg:w-[300px] aspect-[1/2.2] z-20 pointer-events-none perspective-[1000px]"
            >
               <Image 
                 src="/Featured%20Images/vial-no-bg.webp"
                 alt="Single precision research peptide vial with Certificate of Analysis document — Sparta Labs"
                 fill
                 className="object-contain"
                 priority
               />
            </motion.div>

            {/* Desktop HUD: Metric 1 (Middle Left) */}
            <AnimatedHUDCard 
              direction="left"
              delay={0.1}
              positionClass="top-[40%] left-[5%] xl:left-[10%] right-[50%]"
              icon={<CheckCircle2 className="w-5 h-5 text-[#5984c4]" strokeWidth={1.5} />}
              title="≥99% HPLC Purity"
              desc="Stringent chromatographic isolation for every compound — verified before any order ships."
              tooltip="HPLC separates compound mixtures by molecular polarity, confirming concentration and purity to ≥99%."
            />

            {/* Desktop HUD: Metric 2 (Top Right) */}
            <AnimatedHUDCard 
              direction="right"
              delay={0.4}
              positionClass="top-[15%] right-[5%] xl:right-[10%] left-[50%]"
              icon={<FileSearch className="w-5 h-5 text-[#5984c4]" strokeWidth={1.5} />}
              title="Mass Spectrometry (LC-MS)"
              desc="Exact molecular weight verification confirms you are receiving the compound on the label."
              tooltip="LC-MS cross-references molecular mass against known peptide databases. Cannot be faked."
            />

            {/* Desktop HUD: Metric 3 (Bottom Right) */}
            <AnimatedHUDCard 
              direction="right"
              delay={0.7}
              positionClass="bottom-[20%] right-[5%] xl:right-[10%] left-[50%]"
              icon={<ShieldCheck className="w-5 h-5 text-[#5984c4]" strokeWidth={1.5} />}
              title="Endotoxin-Free"
              desc="Limulus Amebocyte Lysate (LAL) testing confirms endotoxin levels below research-safe thresholds."
              tooltip="Endotoxin contamination invalidates in-vitro research results. We test and confirm absence."
            />

         </div>

         {/* Mobile Metrics Stack */}
         <div className="flex lg:hidden flex-col gap-4 w-full max-w-sm mx-auto mt-8 relative z-30 px-4">
            <MobileAnimatedCard 
              delay={0.1}
              icon={<CheckCircle2 className="w-5 h-5 text-[#5984c4]" strokeWidth={1.5} />}
              title="≥99% HPLC Purity"
              desc="Stringent chromatographic isolation for every compound — verified before any order ships."
              tooltip="HPLC separates compound mixtures by molecular polarity, confirming concentration and purity to ≥99%."
            />
            <MobileAnimatedCard 
              delay={0.4}
              icon={<FileSearch className="w-5 h-5 text-[#5984c4]" strokeWidth={1.5} />}
              title="Mass Spectrometry (LC-MS)"
              desc="Exact molecular weight verification confirms you are receiving the compound on the label."
              tooltip="LC-MS cross-references molecular mass against known peptide databases. Cannot be faked."
            />
            <MobileAnimatedCard 
              delay={0.7}
              icon={<ShieldCheck className="w-5 h-5 text-[#5984c4]" strokeWidth={1.5} />}
              title="Endotoxin-Free"
              desc="Limulus Amebocyte Lysate (LAL) testing confirms endotoxin levels below research-safe thresholds."
              tooltip="Endotoxin contamination invalidates in-vitro research results. We test and confirm absence."
            />
         </div>

         {/* Call to action */}
         <div className="mt-12 lg:mt-16 flex justify-center px-4">
           <FadeUp delay={1.2}>
             <a href="/certificates" className="group bg-transparent border border-[#5984c4]/30 text-ink hover:bg-[#5984c4] hover:border-[#5984c4] hover:text-white rounded-full px-6 lg:px-8 py-4 uppercase tracking-widest text-[10px] md:text-xs font-bold transition-all duration-300 flex items-center gap-3">
               VIEW COA LIBRARY
               <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
             </a>
           </FadeUp>
         </div>

       </Container>
    </section>
  )
}
