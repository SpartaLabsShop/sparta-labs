'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Heart } from 'lucide-react'
import { EmptyState } from '@/components/shared/EmptyState'
import { useWishlistStore } from '@/lib/wishlist/store'
import { useEffect, useState } from 'react'

export interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  descriptor: string;
  price: string;
}

export interface AccountWishlistProps {
  items: WishlistItem[];
}

export function WishlistClient({ items: serverItems }: AccountWishlistProps) {
  const { items: localItems, removeItem } = useWishlistStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const displayItems = mounted ? localItems : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col w-full gap-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-slate-900">
            My Wishlist
          </h1>
          <p className="text-sm text-slate-500">You have {displayItems.length} items saved for later.</p>
        </div>

        <button className="flex items-center justify-center gap-2 bg-[#CC292B] hover:bg-[#b02224] text-white rounded-xl px-6 py-3.5 text-sm font-bold transition-colors w-full sm:w-auto shadow-sm">
          <ShoppingBag size={18} />
          Move All to Cart
        </button>
      </div>

      <AnimatePresence>
        {displayItems.length > 0 ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {displayItems.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="group flex flex-col w-full bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:border-slate-300 transition-all duration-300"
              >
                {/* Image Area */}
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-slate-50">
                  <Link href={`/products/${product.slug}`}>
                    <motion.div
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full h-full relative"
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </motion.div>
                  </Link>

                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      removeItem(product.id)
                    }}
                    className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-slate-500 hover:text-[#CC292B] flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 shadow-sm"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Info Area */}
                <div className="flex flex-col flex-1 p-6">
                  <Link href={`/products/${product.slug}`}>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#CC292B] mb-2 block">
                      {/* @ts-ignore */}
                      {product.descriptor || 'Product'}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-[#CC292B] transition-colors leading-tight">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="mt-4 flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
                    <span className="text-xl font-bold text-slate-900 tracking-tight">
                      {/* @ts-ignore */}
                      {product.price || product.priceRange || ''}
                    </span>
                    <button className="bg-slate-50 hover:bg-[#FFF5F5] text-slate-700 hover:text-[#CC292B] border border-slate-200 hover:border-[#CC292B] rounded-xl px-5 py-2.5 text-xs font-bold transition-all shrink-0">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="w-full bg-white rounded-3xl border border-slate-100 shadow-sm p-12"
          >
            <div className="flex flex-col items-center text-center gap-4 py-8">
              <div className="w-20 h-20 rounded-full bg-[#FFF5F5] flex items-center justify-center">
                <Heart size={36} className="text-[#CC292B]" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Your wishlist is empty</h4>
                <p className="text-slate-500">Save items you want to buy later by clicking the heart icon on any product page.</p>
              </div>
              <Link href="/shop" className="bg-[#CC292B] text-white px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-[#b02224] transition-colors mt-4">
                Start Browsing
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
