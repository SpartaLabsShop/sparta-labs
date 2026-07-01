import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Search, Heart, User, LogIn, ArrowUpRight,
  Activity, Dna, Brain, ShieldPlus, Sparkles, Zap, Network, BatteryCharging,
  ShoppingBag, BookOpen, Microscope,
  HelpCircle, Mail, Users, ChevronDown
} from 'lucide-react'
import Link from 'next/link'

export interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  isLoggedIn?: boolean
  onSearchClick?: () => void
  categories?: { id: string | number; name: string; slug: string }[]
}

// Keyed by real category name (as stored in Payload) so icons still match
// once real categories are wired in; anything unmapped falls back to Activity.
const CATEGORY_ICONS: Record<string, typeof Activity> = {
  'Bioregulators': Activity,
  'Cellular Health Research': Dna,
  'Cognitive Function Studies': Brain,
  'Essentials': ShieldPlus,
  'Growth Factor Research Peptides': Sparkles,
  'Metabolic Research Peptides': Zap,
  'Receptor Agonist Research Peptides': Network,
  'Recovery Research Peptides': BatteryCharging,
}

const DISCOVER_LINKS = [
  { label: 'Shop All Formulations', href: '/shop', icon: ShoppingBag },
  { label: 'Scientific Journal', href: '/journal', icon: BookOpen },
  { label: 'Our Laboratory', href: '/about', icon: Microscope },
]

const SUPPORT_LINKS = [
  { label: 'F.A.Q', href: '/faq', icon: HelpCircle },
  { label: 'Contact Support', href: '/contact', icon: Mail },
  { label: 'Affiliate Program', href: '/affiliates', icon: Users },
]

export function MobileMenu({ isOpen, onClose, isLoggedIn = false, onSearchClick, categories = [] }: MobileMenuProps) {

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose()
      }
      window.addEventListener('keydown', handleEsc)
      return () => {
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        window.scrollTo(0, scrollY)
        window.removeEventListener('keydown', handleEsc)
      }
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[2000] bg-black/40 backdrop-blur-[4px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Side Panel */}
          <motion.div
            className="fixed inset-y-0 right-0 z-[2001] flex w-full max-w-[450px] flex-col border-l border-white/50 bg-white/85 shadow-[-10px_0_30px_rgba(0,0,0,0.1)] backdrop-blur-[20px] max-[768px]:max-w-[80%]"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
          >
            {/* Close Button */}
            <div className="flex items-center justify-end px-10 pt-8">
              <button
                onClick={onClose}
                className="bg-transparent p-2 -mr-2 text-ink transition-opacity duration-200 hover:opacity-70"
              >
                <X size={28} strokeWidth={1.5} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-10 pt-8 pb-28 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden" style={{ WebkitOverflowScrolling: 'touch' }}>
              {/* Main Nav Links */}
              <ul className="flex flex-col gap-[30px] list-none mb-12">
                {DISCOVER_LINKS.map((link, i) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center text-[28px] font-light tracking-[-0.5px] text-ink transition-opacity duration-200 hover:opacity-60"
                      onClick={onClose}
                    >
                      {link.label}
                      {link.label === 'Shop All Formulations' && <ChevronDown size={16} className="ml-2" />}
                    </Link>
                  </motion.li>
                ))}
                {SUPPORT_LINKS.map((link, i) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center text-[28px] font-light tracking-[-0.5px] text-ink transition-opacity duration-200 hover:opacity-60"
                      onClick={onClose}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              {/* Categories */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink/40 mb-5">Shop by Category</h3>
                <div className="flex flex-col gap-1">
                  {categories.map((cat) => {
                    const Icon = CATEGORY_ICONS[cat.name] || Activity
                    return (
                      <Link
                        key={cat.id}
                        href={`/shop?category=${encodeURIComponent(cat.name)}`}
                        onClick={onClose}
                        className="flex items-center gap-3 py-2.5 text-ink/70 transition-all duration-200 hover:text-ink hover:pl-1"
                      >
                        <Icon size={14} strokeWidth={1.5} />
                        <span className="text-[14px] font-light">{cat.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </motion.div>
            </div>

            {/* Footer Utility Dock */}
            <div className="border-t border-black/10 bg-white/95 backdrop-blur-md">
              <div className="grid grid-cols-3 h-[72px]">
                <button
                  onClick={() => {
                    onClose();
                    onSearchClick?.();
                  }}
                  className="flex flex-col items-center justify-center gap-1.5 text-ink/60 hover:text-ink hover:bg-black/5 transition-colors"
                >
                  <Search size={18} strokeWidth={1.5} />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Search</span>
                </button>

                <Link href="/account/wishlist" onClick={onClose} className="flex flex-col items-center justify-center gap-1.5 text-ink/60 hover:text-ink hover:bg-black/5 transition-colors border-l border-r border-black/10">
                  <Heart size={18} strokeWidth={1.5} />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Wishlist</span>
                </Link>

                {isLoggedIn ? (
                  <Link href="/account" onClick={onClose} className="flex flex-col items-center justify-center gap-1.5 text-ink/60 hover:text-ink hover:bg-black/5 transition-colors">
                    <User size={18} strokeWidth={1.5} />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Account</span>
                  </Link>
                ) : (
                  <Link href="/login" onClick={onClose} className="flex flex-col items-center justify-center gap-1.5 text-ink/60 hover:text-ink hover:bg-black/5 transition-colors h-full w-full">
                    <LogIn size={18} strokeWidth={1.5} />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Login</span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
