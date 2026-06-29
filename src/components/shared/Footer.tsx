'use client'

import React, { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
const FooterContent = () => {
  return (
  <div className="bg-[#28282B] text-[#cccccc] pt-12 pb-0 w-full flex flex-col items-center overflow-hidden">
    <div className="mx-auto flex w-full flex-col relative z-10 px-4 md:px-8 lg:px-10">
      
      {/* 1. Top Section */}
      <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-8 mb-12">
        
        {/* Left: Socials & Newsletter */}
        <div className="w-full lg:w-5/12 flex flex-col items-start text-left">
          {/* Social Icons */}
          <div className="flex items-center gap-4 mb-8">
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#28282B] transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#28282B] transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#28282B] transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
            </a>
          </div>

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
              <li><a href="#" className="text-sm text-white/50 hover:text-white transition-colors">Instagram</a></li>
            </ul>
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
              <li><Link href="/peptide-calculator" className="text-sm text-white/50 hover:text-white transition-colors">Peptide Calculator</Link></li>
              <li><Link href="/certificates" className="text-sm text-white/50 hover:text-white transition-colors">COA Library</Link></li>
              <li><Link href="/faq" className="text-sm text-white/50 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* 2. Divider & Button */}
      <div className="w-full relative flex items-center mb-8">
        <div className="flex-1 h-[1px] bg-white/20" />
        <Link href="/shop" className="absolute right-0 bg-white text-[#28282B] px-6 lg:px-8 py-2 lg:py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/80 transition-colors shadow-lg">
          Get Started
        </Link>
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
              Designed and developed by <a href="https://www.belkdigital.com/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors">Belk Digital</a>
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
