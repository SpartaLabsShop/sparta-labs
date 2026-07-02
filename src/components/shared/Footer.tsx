'use client'

import React, { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SOCIAL_LINKS } from './SocialIcons'
const FooterContent = () => {
  return (
  <div className="bg-[#28282B] text-[#cccccc] pt-12 pb-0 w-full flex flex-col items-center overflow-hidden">
    <div className="mx-auto flex w-full flex-col relative z-10 px-4 md:px-8 lg:px-10">
      
      {/* 1. Top Section */}
      <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-8 mb-12">
        
        {/* Left: Newsletter */}
        <div className="w-full lg:w-5/12 flex flex-col items-start text-left">
          <h2 className="text-sm font-medium mb-1 tracking-wide text-white/90">
            Research uninterrupted — Stay Ahead of New Compounds
          </h2>
          <p className="text-xs text-white/50 mb-6 max-w-[280px] leading-relaxed">
            Quiet updates on new compounds, lab notes, and exclusive availability.
          </p>
          <form className="flex w-full max-w-[280px] gap-0 border-b border-white/20 hover:border-white transition-colors pb-2" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your research email address" 
              required
              className="bg-transparent border-none text-white placeholder:text-white/30 focus:outline-none flex-1 px-0 h-6 text-xs"
            />
            <button type="submit" className="shrink-0 flex items-center justify-center text-white/50 hover:text-white transition-colors">
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right: Links Grid */}
        <div className="w-full lg:w-7/12 flex flex-wrap justify-between gap-x-8 gap-y-8">
          
          <div className="flex flex-col gap-6">
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-white/80 font-medium">Shop</h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="/shop" className="text-sm text-white/50 hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/shop" className="text-sm text-white/50 hover:text-white transition-colors">Best Sellers</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-white/80 font-medium">Connect</h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="/contact" className="text-sm text-white/50 hover:text-white transition-colors">Contact</Link></li>
            </ul>
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-white/80 font-medium">The Lab</h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="/about" className="text-sm text-white/50 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/journal" className="text-sm text-white/50 hover:text-white transition-colors">Journal</Link></li>
              <li><Link href="/affiliates" className="text-sm text-white/50 hover:text-white transition-colors">Affiliates</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-white/80 font-medium">Resources</h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="/certificates" className="text-sm text-white/50 hover:text-white transition-colors">COA Library</Link></li>
              <li><Link href="/faq" className="text-sm text-white/50 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* 2. Divider */}
      <div className="w-full relative flex items-center mb-8">
        <div className="flex-1 h-[1px] bg-white/20" />
      </div>

      {/* 3. Bottom Row: FDA Disclaimer & Legal */}
      <div className="w-full flex flex-col lg:flex-row justify-between items-start gap-12 mb-0">
        
        <div className="w-full lg:w-1/2 text-left">
          <p className="text-[10px] text-white/40 leading-relaxed max-w-[500px]">
            <strong className="text-white/60">FDA Disclaimer:</strong> These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease. All products offered are for laboratory and research use only. They are not intended for human consumption.
          </p>
        </div>

        <div className="w-full lg:w-1/2 flex flex-wrap justify-start lg:justify-end gap-x-8 gap-y-4">
          <Link href="/terms" className="text-[10px] text-white/70 hover:text-white uppercase tracking-widest transition-colors font-medium">Terms</Link>
          <Link href="/privacy" className="text-[10px] text-white/70 hover:text-white uppercase tracking-widest transition-colors font-medium">Privacy</Link>
          <Link href="/refund" className="text-[10px] text-white/70 hover:text-white uppercase tracking-widest transition-colors font-medium">Refund</Link>
          <Link href="/disclaimer" className="text-[10px] text-white/70 hover:text-white uppercase tracking-widest transition-colors font-medium">Disclaimer</Link>
          <div className="flex flex-col items-start lg:items-end w-full lg:w-auto mt-4 lg:mt-0 gap-1">
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-medium">
              © {new Date().getFullYear()} Sparta Labs.
            </p>
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-medium">
              Designed and developed by <a href="https://www.belkdigital.com/" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-400 transition-colors">Belk Digital</a>
            </p>
          </div>
        </div>

      </div>

    </div>
    {/* 4. Massive Overflow Text */}
    <div className="w-full flex justify-center items-end leading-none select-none pointer-events-none translate-y-[30%]">
      <div
        aria-hidden="true"
        className="text-[14vw] font-sans font-bold text-[#F62440] tracking-tighter whitespace-nowrap m-0 p-0 uppercase"
      >
        SPARTA LABS
      </div>
    </div>
  </div>
  )
}

export function Footer() {
  const [footerHeight, setFooterHeight] = useState(0)
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!footerRef.current) return
    const resizeObserver = new ResizeObserver((entries) => {
      setFooterHeight(entries[0].contentRect.height)
    })
    resizeObserver.observe(footerRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  return (
    <footer className="w-full relative z-40 bg-[#28282B] print:hidden" style={{ pointerEvents: 'auto' }}>
      <FooterContent />
    </footer>
  )
}
