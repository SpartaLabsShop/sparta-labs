'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { QuantityStepper } from '@/components/shop/QuantityStepper'
import { useCartStore } from '@/lib/cart/store'
import { EmptyState } from '@/components/shared/EmptyState'
import { ShoppingBag } from 'lucide-react'
import { useLenis } from 'lenis/react'

export function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity } = useCartStore()
  const lenis = useLenis()

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      document.documentElement.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
      document.documentElement.style.overflow = 'unset'
    }
  }, [isOpen])

  // Esc key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [closeCart])

  const subtotal = items.reduce((acc, item) => acc + item.priceSnapshot * item.quantity, 0)
  const FREE_SHIPPING_THRESHOLD = 300
  const progressToFreeShipping = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Removed expensive backdrop-blur for performance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-[100]"
            aria-hidden="true"
          />

          {/* Drawer - Added will-change-transform for hardware acceleration */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: 'transform' }}
            className="fixed top-0 right-0 h-[100dvh] w-full md:w-[480px] bg-[#F8F8FA] z-[101] shadow-2xl flex flex-col overflow-hidden transform-gpu font-sans"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 md:p-8 bg-white shrink-0 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] z-10 relative">
              <h2 className="text-label-md uppercase tracking-widest text-ink font-bold flex items-center gap-2">
                Your Cart 
                <span className="flex items-center justify-center bg-ink text-white text-[10px] w-5 h-5 rounded-full font-bold">
                  {items.reduce((acc, i) => acc + i.quantity, 0)}
                </span>
              </h2>
              <button 
                onClick={closeCart}
                className="p-2 -mr-2 bg-black/5 hover:bg-black/10 rounded-xl text-ink/70 hover:text-ink transition-colors focus:outline-none"
                aria-label="Close cart"
              >
                <X size={20} strokeWidth={2} />
              </button>
            </div>

            {items.length === 0 ? (
              /* Empty State */
              <div className="flex-1 flex flex-col bg-[#F8F8FA]">
                <EmptyState
                    icon={ShoppingBag}
                    title="Your cart is empty"
                    description="Looks like you haven't added any compounds to your cart yet."
                    action={
                      <Link href="/shop" onClick={closeCart} className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-ink to-ink/90 text-white hover:shadow-lg hover:-translate-y-0.5 transition-all uppercase tracking-[0.15em] text-sm font-bold shadow-md">
                        Browse Products
                      </Link>
                    }
                  />
              </div>
            ) : (
              /* Populated Cart */
              <>
                {/* Shipping Progress */}
                <div className="px-6 md:px-8 py-5 bg-[#F8F8FA] shrink-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-ink/70 text-center mb-3">
                    {amountToFreeShipping > 0 
                      ? `Add $${amountToFreeShipping.toFixed(2)} more for free 2-day shipping`
                      : "🎉 You've unlocked free 2-day shipping!"}
                  </p>
                  <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full shadow-[0_0_12px_rgba(211,17,24,0.8)] relative"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressToFreeShipping}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                      <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)', transform: 'skewX(-20deg)' }} />
                    </motion.div>
                  </div>
                </div>

                {/* Items List */}
                <div 
                  className="flex-1 overflow-y-auto px-6 md:px-8 py-2 overscroll-y-contain" 
                  data-lenis-prevent="true"
                  style={{ WebkitOverflowScrolling: 'touch' }}
                >
                  <div className="flex flex-col gap-4 pb-4">
                    <AnimatePresence>
                      {items.map((item) => (
                        <motion.div 
                          key={item.lineId}
                          layout
                          initial={{ opacity: 0, scale: 0.95, height: 0 }}
                          animate={{ opacity: 1, scale: 1, height: 'auto' }}
                          exit={{ opacity: 0, scale: 0.95, height: 0 }}
                          className="flex gap-4 p-4 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] border border-white hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300"
                        >
                          <div className="relative w-[88px] h-[88px] bg-[#F8F8FA] rounded-xl shrink-0 overflow-hidden shadow-inner">
                            <Image src={item.product?.imageUrl || '/placeholder.png'} alt={item.product?.name || 'Product'} fill className="object-cover hover:scale-105 transition-transform duration-500" />
                          </div>
                          <div className="flex flex-col flex-1 justify-between py-0.5">
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex flex-col">
                                <Link href={`/products/${item.productId}`} onClick={closeCart} className="text-body-md font-bold font-display text-ink hover:text-accent transition-colors line-clamp-1 leading-tight">
                                  {item.product?.name}
                                </Link>
                                <span className="text-[10px] uppercase tracking-wider text-ink/50 mt-1.5 font-bold">
                                  {item.variantTitle || item.variantSku}
                                </span>
                              </div>
                              <button 
                                onClick={() => removeItem(item.lineId)}
                                className="text-ink/30 hover:text-error transition-colors p-1.5 bg-black/0 hover:bg-error/10 rounded-xl -mt-1 -mr-1"
                                aria-label="Remove item"
                              >
                                <X size={16} strokeWidth={2} />
                              </button>
                            </div>
                            <div className="flex items-end justify-between mt-3">
                              <QuantityStepper 
                                value={item.quantity} 
                                onChange={(val) => updateQuantity(item.lineId, val)} 
                              />
                              <span className="text-body-md font-extrabold text-ink">
                                ${(item.priceSnapshot * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Sticky Summary */}
                <div className="px-6 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:p-8 bg-white shrink-0 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.08)] z-10 relative">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-ink/60 uppercase tracking-widest">Subtotal</span>
                    <span className="text-xl text-ink font-black">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-bold text-ink/60 uppercase tracking-widest">Shipping</span>
                    <span className="text-sm text-ink font-bold">
                      {amountToFreeShipping > 0 ? 'Calculated at checkout' : <span className="text-accent">Free</span>}
                    </span>
                  </div>
                  <Link href="/checkout" onClick={closeCart} className="flex items-center justify-center w-full px-8 py-4 rounded-xl bg-gradient-to-r from-ink to-ink/90 text-white hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-[0.15em] text-sm font-black mb-4">
                    CHECKOUT
                  </Link>
                  <Link href="/cart" onClick={closeCart} className="flex items-center justify-center w-full text-ink/50 hover:text-ink text-xs uppercase tracking-widest font-bold transition-colors hover:underline underline-offset-4">
                    VIEW CART
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
