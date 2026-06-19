'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { ShoppingBag, Menu, Search, X, User, Heart } from 'lucide-react'
import { MobileMenu } from './MobileMenu'
import { useCartStore } from '@/lib/cart/store'
import { useWishlistStore } from '@/lib/wishlist/store'
import dynamic from 'next/dynamic'
import { SearchOverlay } from './SearchOverlay'

const CartDrawer = dynamic(() => import('@/components/cart/CartDrawer').then(mod => mod.CartDrawer), { ssr: false })

const ANNOUNCEMENTS = [
  "FREE SHIPPING ON ORDERS OVER $150",
  "NEW PEPTIDE BLENDS JUST DROPPED",
  "SUBSCRIBE FOR 15% OFF YOUR FIRST ORDER"
]

export function ClientHeader({ cartItemCount = 0, wishlistItemCount = 0, isLoggedIn = false, categories: initialCategories = [], initialWishlistItems = [], initialCartItems = [] }: any) {
  const cartStore = useCartStore()
  const setCartItems = useCartStore((state) => state.setItems)
  const setWishlistItems = useWishlistStore((state) => state.setItems)
  const activeCartCount = cartStore.items.reduce((acc: any, i: any) => acc + i.quantity, 0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [announcementIndex, setAnnouncementIndex] = useState(0)
  const [announcementClosed, setAnnouncementClosed] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  

  const cartHydrated = useRef(false)
  const wishlistHydrated = useRef(false)

  // Sync Cart with Backend
  useEffect(() => {
    if (isLoggedIn && !cartHydrated.current) {
      const localItems = cartStore.items
      if (initialCartItems.length > 0) {
        // Backend has a cart, use it
        setCartItems(initialCartItems)
      } else if (localItems.length > 0) {
        // Backend cart is empty, but local has items (e.g. they added items before logging in)
        // Push local items to backend
        import('@/app/(frontend)/actions/cart').then(m => m.syncCartToPayload(localItems))
      }
      cartHydrated.current = true
    }
  }, [isLoggedIn, initialCartItems]) // removed setCartItems and cartStore.items from deps to prevent loop

  // Sync Wishlist with Backend
  useEffect(() => {
    if (isLoggedIn && !wishlistHydrated.current) {
      const localItems = useWishlistStore.getState().items
      if (initialWishlistItems.length > 0) {
        setWishlistItems(initialWishlistItems)
      } else if (localItems.length > 0) {
        // Push local items to backend one by one, since there's no bulk sync for wishlist
        import('@/app/(frontend)/actions/wishlist').then(m => {
          localItems.forEach(item => m.toggleWishlistInPayload(item.id, true))
        })
      }
      wishlistHydrated.current = true
    }
  }, [isLoggedIn, initialWishlistItems])

  // Global Search Shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const pathname = usePathname()
  const isHome = pathname === '/' || pathname === '/en' || pathname === '/shop' || pathname === '/journal'

  useEffect(() => {
    const isClosed = sessionStorage.getItem('announcement_closed') === 'true'
    setAnnouncementClosed(isClosed)
    setMounted(true)
    
    if (!isClosed) {
      const timer = setInterval(() => {
        setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length)
      }, 4000)
      return () => clearInterval(timer)
    }
  }, [])

  const closeAnnouncement = () => {
    setAnnouncementClosed(true)
    sessionStorage.setItem('announcement_closed', 'true')
  }
  
  const { scrollY } = useScroll()
  const lastYRef = useRef(0)

  useMotionValueEvent(scrollY, 'change', (y) => {
    setIsScrolled(y > 50)
    const difference = y - lastYRef.current
    if (Math.abs(difference) > 20) {
      if (difference > 0 && y > 150) {
        setHidden(true)
      } else {
        setHidden(false)
      }
      lastYRef.current = y
    }
  })

  const isTransparent = !isScrolled && isHome;
  const headerClasses = `w-full h-[72px] flex items-center justify-between px-4 md:px-8 lg:px-10 pointer-events-auto transition-all duration-300 relative ${
    isTransparent
      ? 'bg-transparent border-transparent'
      : 'bg-white/95 backdrop-blur-md border-b border-black/10 shadow-sm'
  }`

  const textColor = isTransparent ? 'text-white' : 'text-ink';
  const textHoverColor = isTransparent ? 'hover:text-white/70' : 'hover:text-ink/70';
  const iconColor = isTransparent ? 'white' : 'black';
  const buttonBorder = isTransparent ? 'border-white/30 hover:bg-white hover:text-black' : 'border-black/30 hover:bg-black hover:text-white';

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-sticky flex flex-col pointer-events-none print:hidden">
        
        <motion.div
          variants={{
            visible: { y: 0, opacity: 1 },
            hidden: { y: -100, opacity: 0 }
          }}
          initial="hidden"
          animate={hidden ? "hidden" : "visible"}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full flex flex-col"
        >
          {/* Announcement Bar */}
          {!announcementClosed && (
            <div className="w-full bg-black text-white h-[32px] flex items-center justify-center pointer-events-auto overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.p
                  key={announcementIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-[9px] font-bold tracking-[0.2em] uppercase absolute text-center w-full px-4"
                >
                  {ANNOUNCEMENTS[announcementIndex]}
                </motion.p>
              </AnimatePresence>
              <button 
                onClick={closeAnnouncement}
                className="absolute right-4 text-white/70 hover:text-white transition-colors"
                aria-label="Close announcement"
              >
                <X size={14} strokeWidth={2} />
              </button>
            </div>
          )}

          <header className={headerClasses}>
          {/* Left: Logo */}
          <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <svg
                viewBox="0 0 190 300"
                width="28"
                height="36"
                className={`transition-[fill] duration-300 ${isTransparent ? 'fill-white' : 'fill-accent'}`}
              >
                <path d="M94.02,228.41c-5.98-3.52-19.52-15.64-19.13-22.16l3.19-52.86-55.56-24.18c-.45,9.37,1.22,17.33,2.88,25.78,2.03,13.88,15.02,16.75,26.2,22.56,3.74,2.15,9.43,5.67,9.43,11.05v94.56S2.59,206.44,2.59,206.44c-2.8-3.68-2.25-8.49-2.59-12.84l.17-90.97c.02-10.06,3.04-19.08,8.62-27.26,17.61-25.3,57.52-45.01,84.79-58.71,28.42,14.43,62.61,31.25,82.58,55.75,5.71,7.74,10.53,15.88,10.55,26.07l.26,101.36c-1.24,3.84-2.61,6.9-5,10.05l-55.98,73.44-.54-89.59c-.04-5.96.76-11.19,6.44-14.24l17.88-9.14c6.75-3.45,11.37-9.02,11.89-16.81,1.64-8.05,3.33-15.91,2.67-24.57l-55.92,24.83,3.16,54.98c-2.32,8.15-11.11,13.39-17.57,19.62Z" />
              </svg>
              <span className={`text-xl font-semibold tracking-[0.2em] uppercase transition-colors duration-300 hidden md:inline ${isTransparent ? 'text-white' : 'text-ink'}`}>
                SPARTA LABS
              </span>
            </Link>
          </div>

          {/* Right: Search, SHOP NOW Button & Cart */}
          <div className="flex items-center justify-end gap-4 md:gap-5 flex-1">
            {/* Search Button */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className={`p-1 transition-colors relative flex items-center justify-center ${textColor} ${textHoverColor}`}
              aria-label="Open search"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>

            <button onClick={cartStore.openCart} className={`p-1 transition-colors relative flex items-center justify-center ${textColor} ${textHoverColor}`}>
              <ShoppingBag size={18} strokeWidth={1.5} />
              <AnimatePresence>
                {activeCartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className={`absolute -top-1 -right-1 text-[9px] font-bold w-[14px] h-[14px] flex items-center justify-center rounded-full ${isTransparent ? 'bg-white text-black' : 'bg-black text-white'}`}
                  >
                    {activeCartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            
            <div className="flex items-center md:min-w-[34px] justify-center">
              {mounted ? (
                isLoggedIn ? (
                  <Link href="/account" className={`p-1 transition-colors flex items-center justify-center ${textColor} ${textHoverColor}`}>
                    <User size={18} strokeWidth={1.5} />
                  </Link>
                ) : (
                  <Link href="/login" className={`hidden md:inline-flex px-7 py-2.5 text-[9px] font-semibold tracking-[0.2em] uppercase transition-all shadow-md ${isTransparent ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}>
                    LOGIN
                  </Link>
                )
              ) : null}
            </div>
            
            <Link href="/account/wishlist" className={`p-1 transition-colors flex items-center justify-center ${textColor} ${textHoverColor}`} aria-label="Wishlist">
              <Heart size={18} strokeWidth={1.5} />
            </Link>

            {/* Hamburger Menu */}
            <button onClick={() => setMobileMenuOpen(true)} className={`p-1 -mr-1 transition-colors ${textColor}`}>
              <Menu size={20} strokeWidth={1.5} />
            </button>
          </div>
          </header>
        </motion.div>

      </div>

      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        isLoggedIn={isLoggedIn}
        onSearchClick={() => setIsSearchOpen(true)}
      />
      <CartDrawer />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
