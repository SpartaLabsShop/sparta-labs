'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Check, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth/AuthContext'
import { useWishlistStore } from '@/lib/wishlist/store'
import { useCartStore } from '@/lib/cart/store'
import { toast } from 'sonner'

const HelmetLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 190 300" className={className} fill="#D31118">
    <path d="M94.02,228.41c-5.98-3.52-19.52-15.64-19.13-22.16l3.19-52.86-55.56-24.18c-.45,9.37,1.22,17.33,2.88,25.78,2.03,13.88,15.02,16.75,26.2,22.56,3.74,2.15,9.43,5.67,9.43,11.05v94.56S2.59,206.44,2.59,206.44c-2.8-3.68-2.25-8.49-2.59-12.84l.17-90.97c.02-10.06,3.04-19.08,8.62-27.26,17.61-25.3,57.52-45.01,84.79-58.71,28.42,14.43,62.61,31.25,82.58,55.75,5.71,7.74,10.53,15.88,10.55,26.07l.26,101.36c-1.24,3.84-2.61,6.9-5,10.05l-55.98,73.44-.54-89.59c-.04-5.96.76-11.19,6.44-14.24l17.88-9.14c6.75-3.45,11.37-9.02,11.89-16.81,1.64-8.05,3.33-15.91,2.67-24.57l-55.92,24.83,3.16,54.98c-2.32,8.15-11.11,13.39-17.57,19.62Z" />
  </svg>
)

export interface Product {
  id?: string
  name: string
  slug: string
  image: string
  hoverImage?: string
  shortDescription: string
  priceRange: string
  originalPrice?: string
  discountPercentage?: number
  category: string
}

export interface PrimaryProductCardProps {
  product: Product
  aspectRatio?: '4/5' | '16/10' | '3/4'
  size?: 'tall' | 'small'
  id?: string
}

export function PrimaryProductCard({ product, id }: PrimaryProductCardProps) {
  const addItem = useWishlistStore(state => state.addItem)
  const removeItem = useWishlistStore(state => state.removeItem)
  const isWishlistedGlobal = useWishlistStore(state => product.id ? state.hasItem(product.id) : false)
  const { user } = useAuth()
  const isSignedIn = !!user
  const cartStore = useCartStore()

  const [inWishlist, setInWishlist] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [qty, setQty] = useState(1)

  React.useEffect(() => {
    setInWishlist(isWishlistedGlobal)
  }, [isWishlistedGlobal])

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isSignedIn) {
      toast.error('Sign in required', {
        description: 'Please log in to add items to your wishlist.',
      })
      return
    }

    if (!product.id) {
      toast.error('Product ID missing', {
        description: 'Unable to add this product to wishlist.',
      })
      return
    }

    setIsPending(true)

    try {
      if (inWishlist) {
        await removeItem(product.id)
        toast('Removed from wishlist', {
          id: `wishlist-${product.id}`,
          description: `${product.name} has been removed.`,
        })
      } else {
        await addItem({
          id: product.id,
          name: product.name,
          slug: product.slug,
          image: product.image,
          priceRange: product.priceRange || ''
        })
        setShowParticles(true)
        setTimeout(() => setShowParticles(false), 1000)
        toast.success('Added to wishlist', {
          id: `wishlist-${product.id}`,
          description: `${product.name} is now in your wishlist.`,
          action: {
            label: 'View Wishlist',
            onClick: () => window.location.href = '/account/wishlist',
          },
        })
      }
    } catch (error: any) {
      toast.error('Failed to update wishlist', {
        description: error.message || 'An unexpected error occurred.',
      })
    } finally {
      setIsPending(false)
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    cartStore.addItem(
      { id: product.id || product.slug, name: product.name, imageUrl: product.image },
      'Default',
      qty,
      parseFloat(product.priceRange.replace(/[^0-9.]/g, '')) || 0
    )
    setIsAdded(true)
    toast.success('Added to cart', {
      action: { label: 'VIEW', onClick: cartStore.openCart }
    })
    cartStore.openCart()
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleQtyChange = (e: React.MouseEvent, delta: number) => {
    e.preventDefault()
    e.stopPropagation()
    setQty(prev => Math.max(1, prev + delta))
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      id={id}
      className="group relative flex flex-col overflow-hidden rounded-xl bg-[#f6f6f6] pt-8 px-6 pb-6 h-full w-full"
    >
      {/* Third-Party Tested Badge */}
      <div className="absolute top-0 left-1/2 z-10 flex h-7 w-[180px] -translate-x-1/2 items-center justify-center bg-white [clip-path:polygon(0_0,100%_0,88%_100%,12%_100%)]">
        <span className="-mt-0.5 flex items-center text-[0.65rem] font-medium text-[#333333]">
          <Check size={10} strokeWidth={3} className="mr-1" /> Third-Party Tested
        </span>
      </div>

      {/* Helmet Logo */}
      <div className="absolute top-5 left-5 z-10">
        <HelmetLogo className="h-7 w-6" />
      </div>

      {/* Wishlist Button */}
      <motion.div
        className="absolute top-4 right-4 z-20"
        whileHover={isPending ? {} : { scale: 1.05 }}
        whileTap={isPending ? {} : { scale: 0.9 }}
        onClick={handleWishlistClick}
        role="button"
        tabIndex={0}
      >
        <div className={`flex items-center justify-center transition-colors ${
          inWishlist
            ? 'text-red-500'
            : 'text-[#8A95A5] hover:text-red-500'
        }`}>
          <AnimatePresence>
            {showParticles && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {[...Array(8)].map((_, i) => {
                  const angle = (i * 45 * Math.PI) / 180
                  return (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-red-400 rounded-full"
                      initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                      animate={{
                        x: Math.cos(angle) * 35,
                        y: Math.sin(angle) * 35,
                        scale: [0, 1.5, 0],
                        opacity: [1, 1, 0]
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  )
                })}
              </div>
            )}
          </AnimatePresence>

          <motion.div
            initial={false}
            animate={inWishlist && !isPending ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            ) : (
              <Heart strokeWidth={inWishlist ? 2 : 1.5} className={`w-4 h-4 sm:w-5 sm:h-5 ${inWishlist ? 'fill-current' : ''}`} />
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* SALE Badge */}
      {(product.originalPrice || product.discountPercentage) && (
        <div className="absolute top-14 left-5 z-10">
          <span className="bg-red-600 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-sm">
            Sale
          </span>
        </div>
      )}

      {/* Product Image */}
      <div className="mt-2.5 mb-4 flex h-[220px] w-full items-center justify-center max-[768px]:h-[200px]">
        <div className="relative h-full w-full max-w-[90%]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>
      </div>

      {/* Info Area */}
      <div className="flex flex-1 flex-col text-center">
        <p className="mb-1.5 text-[0.7rem] tracking-[0.5px] text-[#999999] uppercase">{product.category}</p>
        <h3 className="mb-3 text-[1.2rem] font-normal text-ink">{product.name}</h3>

        {/* Price Row */}
        <div className="mb-5 flex items-center justify-center gap-2">
          {product.originalPrice && (
            <span className="text-xs sm:text-sm font-medium text-ink/40 line-through">
              {product.originalPrice}
            </span>
          )}
          <span className="text-base font-semibold text-[#111111]">{product.priceRange}</span>
          {product.discountPercentage && (
            <span className="rounded-xl bg-red-100 px-1.5 py-0.5 text-[0.65rem] font-bold text-red-600">
              -{product.discountPercentage}%
            </span>
          )}
        </div>

        {/* COA Available */}
        <div className="mb-4 flex items-center justify-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="text-[0.7rem] font-medium text-green-700 tracking-wide">COA Available</span>
        </div>

        {/* Add to Cart + Qty */}
        <div className="mt-auto flex gap-2" onClick={(e) => e.preventDefault()}>
          {isAdded ? (
            <div className="flex flex-1 items-center justify-center rounded bg-[#333333] p-3 text-[0.85rem] font-medium text-white">
              In Cart <Check size={14} className="ml-1" />
            </div>
          ) : (
            <>
              <div
                role="button"
                tabIndex={0}
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center rounded bg-[#111111] p-3 text-[0.85rem] font-medium text-white transition-colors duration-200 hover:bg-black cursor-pointer select-none"
              >
                Add to cart
              </div>
              <div className="flex h-auto w-[90px] items-center rounded border border-[#cccccc] bg-transparent">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => handleQtyChange(e, -1)}
                  className="flex h-full w-[30px] items-center justify-center text-[1.1rem] text-[#333333] hover:bg-black/5 cursor-pointer select-none"
                >-</div>
                <span className="flex-1 text-center text-[0.85rem] font-medium text-[#111111]">{qty}</span>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => handleQtyChange(e, 1)}
                  className="flex h-full w-[30px] items-center justify-center text-[1.1rem] text-[#333333] hover:bg-black/5 cursor-pointer select-none"
                >+</div>
              </div>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
