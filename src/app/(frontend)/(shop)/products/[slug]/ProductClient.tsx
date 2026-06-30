'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useMotionValue, useSpring } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import { Heart, ChevronRight, ChevronLeft, Download, Star, Check, ShieldCheck, FlaskConical, MapPin, Zap, ShoppingCart, Truck, Sparkles, Loader2 } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StockIndicator } from '@/components/ui/stock-indicator'
import { useCartStore } from '@/lib/cart/store'
import { useWishlistStore } from '@/lib/wishlist/store'
import { useAuth } from '@/lib/auth/AuthContext'
import { toast } from 'sonner'

import { ImageGallery } from '@/components/shop/ImageGallery'
import { VariantSelector, Variant } from '@/components/shop/VariantSelector'
import { QuantityStepper } from '@/components/shop/QuantityStepper'
import { ProductTabs, Tab } from '@/components/shop/ProductTabs'
import type { FaqItem } from '@/components/shared/FaqCarousel'
import { TrustBadges } from '@/components/shared/TrustBadges'
import { StaggerChildren, staggerItemVariants } from '@/components/motion/StaggerChildren'
import { CompactProductCard } from '@/components/shop/CompactProductCard'
import { PrimaryProductCard } from '@/components/shop/PrimaryProductCard'
import { FadeUp } from '@/components/motion/FadeUp'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })

interface ProductData {
  id: string
  name: string
  subtitle: string
  category: string
  categories?: string[]
  averageRating?: number
  reviewCount?: number

  sku?: string
  weight?: number
  dimensions?: {
    length?: number
    width?: number
    height?: number
  }
  badges?: string[]
  bulkBundles?: {
    id?: string
    name: string
    quantity: number
    discountPercentage?: number
    price?: number
    salePrice?: number
    image?: string
  }[]
  description: string
  shortDescription?: string
  images: string[]
  variants: Variant[]
  coaFile?: string
  tabs: Tab[]
  faqs?: FaqItem[]
  reviews: any[]
  relatedProducts: any[]
}

interface ProductClientProps {
  product: ProductData
}

function SlideToCartButton({ onAdd, disabled, isAdded }: { onAdd: () => void, disabled: boolean, isAdded: boolean }) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  
  const handleDragEnd = (event: any, info: any) => {
    if (disabled || isAdded) return
    // threshold to trigger add to cart
    if (info.offset.x > 60) {
      onAdd()
    }
  }

  React.useEffect(() => {
    const node = containerRef.current
    if (!node) return
    const stop = (e: Event) => e.stopPropagation()
    node.addEventListener('pointerdown', stop)
    node.addEventListener('touchstart', stop, { passive: false })
    node.addEventListener('mousedown', stop)
    return () => {
      node.removeEventListener('pointerdown', stop)
      node.removeEventListener('touchstart', stop)
      node.removeEventListener('mousedown', stop)
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      className={`relative flex-1 h-16 bg-white border border-ink/10 rounded-xl flex items-center overflow-hidden z-10 transition-colors hover:border-ink/30 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div className="absolute inset-0 flex items-center justify-center pl-10 text-[13px] font-bold text-ink uppercase tracking-widest pointer-events-none select-none">
        {isAdded ? 'Added to Cart' : <>Slide to Add <ChevronRight size={16} className="inline ml-1 opacity-50" /></>}
      </div>
      
      <motion.button
        type="button"
        drag={disabled || isAdded ? false : "x"}
        dragConstraints={containerRef}
        dragElastic={0.05}
        dragSnapToOrigin={true}
        onDragEnd={handleDragEnd}
        whileTap={disabled || isAdded ? {} : { scale: 0.95 }}
        className={`absolute left-2 w-12 h-12 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing z-20 shadow-sm transition-colors duration-300 ${
          isAdded ? 'bg-green-600 text-white' : 'bg-ink text-white'
        }`}
      >
        {isAdded ? <Check size={20} /> : <ShoppingCart size={20} />}
      </motion.button>
    </div>
  )
}

export function ProductClient({ product }: ProductClientProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id || '')
  const [quantity, setQuantity] = useState(1)
  const [descOpen, setDescOpen] = useState(true)
  const [deliveryOpen, setDeliveryOpen] = useState(true)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  React.useEffect(() => {
    // Force scroll to top on mount to fix Next.js scroll restoration issues
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [product.id])

  // Mobile Sticky Bar Logic
  const [showMobileBar, setShowMobileBar] = useState(false)
  const { scrollY } = useScroll()

  // Swipe Cursor Logic
  const [isHoveringSlider, setIsHoveringSlider] = useState(false)
  const [isSliderAtEnd, setIsSliderAtEnd] = useState(false)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  const handleSliderMouseMove = (e: React.MouseEvent) => {
    cursorX.set(e.clientX - 36)
    cursorY.set(e.clientY - 36)
  }



  useEffect(() => {
    // Show initially on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      const pageHeight = document.documentElement.scrollHeight
      const viewportHeight = window.innerHeight
      const isNearBottom = window.scrollY + viewportHeight >= pageHeight - 300
      setShowMobileBar(!isNearBottom)
    }
  }, [])

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      const pageHeight = document.documentElement.scrollHeight
      const viewportHeight = window.innerHeight
      // Hide when near the footer (bottom 300px)
      const isNearBottom = latest + viewportHeight >= pageHeight - 300

      if (!isNearBottom) {
        setShowMobileBar(true)
      } else {
        setShowMobileBar(false)
      }
    }
  })

  const [relatedEmblaRef, relatedEmblaApi] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'trimSnaps'
  })

  useEffect(() => {
    if (!relatedEmblaApi) return
    
    let isDragging = false
    
    const checkEnd = () => {
      if (isDragging) {
        setIsSliderAtEnd(!relatedEmblaApi.canScrollNext())
      }
    }

    const onPointerDown = () => {
      isDragging = true
      checkEnd()
    }
    
    const onPointerUp = () => {
      isDragging = false
      setIsSliderAtEnd(false) // Instantly reset to SWIPE when they let go
    }

    relatedEmblaApi.on('pointerDown', onPointerDown)
    relatedEmblaApi.on('pointerUp', onPointerUp)
    relatedEmblaApi.on('scroll', checkEnd)
    relatedEmblaApi.on('select', checkEnd)
  }, [relatedEmblaApi])



  const selectedVariant = product.variants.find(v => v.id === selectedVariantId) || product.variants[0]
  const currentStock = selectedVariant?.inStock ? 50 : 0 // Fake stock level for testing

  const [justAdded, setJustAdded] = useState(false)
  const cartStore = useCartStore()
  
  const addItemToWishlist = useWishlistStore(state => state.addItem)
  const removeItemFromWishlist = useWishlistStore(state => state.removeItem)
  const isWishlistedGlobal = useWishlistStore(state => state.hasItem(product.id))
  const { user } = useAuth()
  const isSignedIn = !!user
  
  const [inWishlist, setInWishlist] = useState(false)
  const [isWishlistPending, setIsWishlistPending] = useState(false)
  const [showParticles, setShowParticles] = useState(false)

  useEffect(() => {
    setInWishlist(isWishlistedGlobal)
  }, [isWishlistedGlobal])

  const handleWishlistClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    
    if (!isSignedIn) {
      toast.error('Sign in required', {
        description: 'Please log in to add items to your wishlist.',
      })
      return
    }

    setIsWishlistPending(true)

    try {
      if (inWishlist) {
        await removeItemFromWishlist(product.id)
        toast('Removed from wishlist', {
          id: `wishlist-${product.id}`,
          description: `${product.name} has been removed.`,
        })
      } else {
        await addItemToWishlist({
          id: product.id,
          name: product.name,
          slug: product.id, // Or product.slug if we had it
          image: product.images[0],
          priceRange: selectedVariant?.price || ''
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
      setIsWishlistPending(false)
    }
  }

  const handleAddToCart = () => {
    if (!selectedVariant?.inStock) return

    cartStore.addItem(
      { id: product.id, name: product.name, imageUrl: product.images[0] },
      selectedVariant.sku || selectedVariant.title,
      quantity,
      parseFloat((selectedVariant.salePrice || selectedVariant.price).replace(/[^0-9.]/g, '')),
      selectedVariant.title
    )

    setJustAdded(true)
    toast.success('Added to cart', { 
      action: { label: 'VIEW', onClick: cartStore.openCart } 
    })
    
    // Auto-open drawer as per standard e-com flows, or just rely on pulse
    cartStore.openCart()

    setTimeout(() => setJustAdded(false), 1500)
  }

  return (
    <div className={`flex flex-col w-full bg-[#f3f4f6] min-h-screen ${inter.className}`}>
      
      {/* 1. Hero Section */}
      <section className="w-full relative z-10 pt-8 pb-32">
        
        <Container size="wide" className="relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm font-medium text-gray-500 mt-4 mb-8 relative z-20">
            <Link href="/" className="hover:text-ink transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/shop" className="hover:text-ink transition-colors">Products</Link>
            <ChevronRight size={14} />
            <span className="text-ink">{product.name}</span>
          </nav>

        <div className="flex flex-col lg:flex-row gap-16 xl:gap-24 items-start relative z-10">
          
          {/* Left Column (Massive Cinematic Gallery) */}
          <div className="w-full lg:w-[45%] relative lg:sticky lg:top-32 lg:mt-6">
            <ImageGallery images={product.images} />
          </div>

          {/* Right Column (Clean Flow) */}
          <div className="w-full lg:w-[50%] flex flex-col pt-4 pb-12">
            
            {/* Header Info */}
            <div className="flex items-center gap-3 mb-6">
              {product.categories ? (
                product.categories.map(cat => (
                  <span key={cat} className="text-[10px] uppercase tracking-widest text-ink/50 font-bold bg-white/50 px-3 py-1 rounded-xl border border-ink/5">{cat}</span>
                ))
              ) : (
                <span className="text-[10px] uppercase tracking-widest text-ink/50 font-bold bg-white/50 px-3 py-1 rounded-xl border border-ink/5">{product.category}</span>
              )}
              {product.badges?.map(badge => (
                <Badge key={badge} variant="new" className="bg-ink text-white border-none px-3 py-1 shadow-sm text-[10px] tracking-wider uppercase rounded-xl">{badge}</Badge>
              ))}
            </div>

            <h1 className={`text-4xl md:text-5xl lg:text-[52px] leading-[1.05] font-semibold text-ink mb-6 tracking-tight ${inter.className}`}>
              {product.name}
            </h1>
            
            <div className="text-[32px] font-medium text-ink mb-10 flex items-center">
              {selectedVariant?.salePrice ? (
                <>
                  <span className="text-ink/30 line-through mr-4 text-2xl font-light">{selectedVariant.price}</span>
                  <span className="text-ink">{selectedVariant.salePrice}</span>
                  <span className="ml-4 px-2.5 py-1 rounded-md bg-ink/5 text-ink text-sm font-bold tracking-tight flex items-center h-8">
                    -{Math.round(((parseFloat(selectedVariant.price.replace(/[^0-9.]/g, '')) - parseFloat(selectedVariant.salePrice.replace(/[^0-9.]/g, ''))) / parseFloat(selectedVariant.price.replace(/[^0-9.]/g, ''))) * 100)}%
                  </span>
                </>
              ) : (
                <span>{selectedVariant?.price}</span>
              )}
            </div>

            {/* Variants */}
            {product.variants.length > 1 && (
            <div className="mb-8 sm:mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <VariantSelector 
                  variants={product.variants}
                  value={selectedVariantId}
                  onChange={setSelectedVariantId}
                />
              </div>
            )}

            {/* Bulk Bundles */}
            {product.bulkBundles && product.bulkBundles.length > 0 && (
              <div className="mb-8">
                <div className="flex flex-col mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold uppercase tracking-widest text-ink">Bulk Bundles</span>
                    {(() => {
                      let maxDiscount = 0
                      product.bulkBundles.forEach((bundle) => {
                        const pNum = typeof bundle.price === 'number' ? bundle.price : parseFloat(String(bundle.price || 0).replace(/[^0-9.]/g, ''))
                        const sNum = bundle.salePrice ? (typeof bundle.salePrice === 'number' ? bundle.salePrice : parseFloat(String(bundle.salePrice).replace(/[^0-9.]/g, ''))) : null
                        let discount = 0
                        if (typeof bundle.discountPercentage === 'number' && bundle.discountPercentage > 0) {
                          discount = bundle.discountPercentage
                        } else if (sNum && pNum > 0) {
                          discount = Math.round(((pNum - sNum) / pNum) * 100)
                        }
                        if (discount > maxDiscount) maxDiscount = discount
                      })
                      return maxDiscount > 0 ? (
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">Save up to {maxDiscount}%</span>
                      ) : null
                    })()}
                  </div>
                  <span className="text-[11px] text-ink/50 mt-1.5 font-medium tracking-wide">Please select your dosage above to view accurate bulk pricing.</span>
                </div>
                <div className="flex flex-col gap-3">
                  {product.bulkBundles.map((bundle, idx) => {
                    let priceNum = 0;
                    let salePriceNum = 0;
                    let discount = 0;
                    let bundleVariantSku = bundle.name;
                    let bundleVariantTitle = bundle.name;
                    
                    const currentVariantSku = selectedVariant?.sku || selectedVariant?.title || 'Variant';
                    const currentVariantTitle = selectedVariant?.title || 'Variant';
                    
                    // Check for hardcoded Variant Overrides first
                    const override = (bundle as any).variantOverrides?.find((vo: any) => vo.variantSku === currentVariantSku || vo.variantSku === selectedVariant?.sku || vo.variantSku === selectedVariant?.title);

                    if (override) {
                      // Manual Override pricing
                      priceNum = override.price;
                      salePriceNum = override.salePrice || 0;
                      discount = salePriceNum ? Math.round(((priceNum - salePriceNum) / priceNum) * 100) : 0;
                      bundleVariantSku = `${currentVariantSku} - ${bundle.name}`;
                      bundleVariantTitle = `${currentVariantTitle} - ${bundle.name}`;
                    } else if (typeof bundle.discountPercentage === 'number' && bundle.discountPercentage > 0) {
                      // Dynamic variant-based pricing
                      const basePrice = parseFloat(String(selectedVariant?.salePrice || selectedVariant?.price || 0).replace(/[^0-9.]/g, ''))
                      priceNum = basePrice * bundle.quantity
                      salePriceNum = priceNum * (1 - (bundle.discountPercentage / 100))
                      discount = bundle.discountPercentage
                      bundleVariantSku = `${currentVariantSku} - ${bundle.name}`
                      bundleVariantTitle = `${currentVariantTitle} - ${bundle.name}`;
                    } else {
                      // Legacy hardcoded pricing
                      priceNum = typeof bundle.price === 'number' ? bundle.price : parseFloat(String(bundle.price || 0).replace(/[^0-9.]/g, ''))
                      salePriceNum = bundle.salePrice ? (typeof bundle.salePrice === 'number' ? bundle.salePrice : parseFloat(String(bundle.salePrice).replace(/[^0-9.]/g, ''))) : 0
                      discount = salePriceNum ? Math.round(((priceNum - salePriceNum) / priceNum) * 100) : 0
                    }

                    return (
                      <button
                        key={bundle.id || idx}
                        onClick={() => {
                          cartStore.addItem(
                            { id: product.id, name: product.name, imageUrl: product.images[0] },
                            bundleVariantSku,
                            1,
                            salePriceNum || priceNum,
                            bundleVariantTitle
                          )
                          setJustAdded(true)
                          toast.success('Added bundle to cart', { action: { label: 'VIEW', onClick: cartStore.openCart } })
                          setTimeout(() => setJustAdded(false), 1500)
                        }}
                        className="relative w-full flex items-center justify-between p-4 sm:p-5 rounded-xl border border-ink/10 hover:border-ink/30 hover:shadow-lg hover:shadow-ink/5 transition-all duration-300 group bg-white text-left overflow-hidden"
                      >
                        {/* Hover Gradient Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ink/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -translate-x-full group-hover:translate-x-full ease-out" />
                        
                        <div className="flex items-center gap-4 relative z-10">
                          {bundle.image ? (
                            <img src={bundle.image} alt={bundle.name} className="w-12 h-12 rounded-lg object-cover bg-ink/5" />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-ink/5 flex flex-col items-center justify-center border border-ink/10">
                              <span className="text-sm font-black text-ink tracking-tighter leading-none">{bundle.quantity}x</span>
                              <span className="text-[8px] font-bold uppercase tracking-widest text-ink/50 mt-0.5">Kits</span>
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-bold text-ink text-sm sm:text-base">{bundle.name}</span>
                            <span className="text-xs font-medium text-ink/50 mt-0.5">{bundle.quantity} vials included</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end relative z-10">
                          {salePriceNum ? (
                            <div className="flex flex-col items-end">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs line-through text-ink/40 font-medium">${priceNum.toFixed(2)}</span>
                                <span className="font-bold text-ink text-lg leading-none">${salePriceNum.toFixed(2)}</span>
                              </div>
                              {discount > 0 && (
                                <span className="text-[10px] font-bold text-white bg-ink px-2 py-0.5 rounded-lg uppercase tracking-widest shadow-sm">Save {discount}%</span>
                              )}
                            </div>
                          ) : (
                            <span className="font-bold text-ink text-lg">${priceNum.toFixed(2)}</span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Action Zone (Quantity & Buttons) */}
            <div className="flex flex-col gap-4 mb-12 relative z-10">
              
              {/* Row 1: Quantity & Wishlist */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <QuantityStepper value={quantity} onChange={setQuantity} className="w-full h-16 rounded-xl px-2 shadow-none" />
                </div>
                <motion.button 
                  whileHover={isWishlistPending ? {} : { scale: 1.05 }}
                  whileTap={isWishlistPending ? {} : { scale: 0.95 }}
                  className={`relative w-16 h-16 p-0 flex-shrink-0 rounded-xl font-bold border transition-colors duration-300 flex items-center justify-center group outline-none disabled:opacity-70 ${
                    inWishlist 
                      ? 'border-red-500 bg-red-50 text-red-500 shadow-sm' 
                      : 'border-ink/10 bg-white hover:border-ink/30 hover:bg-gray-50 text-ink/60 hover:text-ink'
                  }`}
                  aria-label="Toggle Wishlist"
                  onClick={handleWishlistClick}
                  disabled={isWishlistPending}
                >
                  <AnimatePresence>
                    {showParticles && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        {[...Array(8)].map((_, i) => {
                          const angle = (i * 45 * Math.PI) / 180;
                          return (
                            <motion.div
                              key={i}
                              className="absolute w-1.5 h-1.5 bg-red-400 rounded-full"
                              initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                              animate={{
                                x: Math.cos(angle) * 45,
                                y: Math.sin(angle) * 45,
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
                    animate={inWishlist && !isWishlistPending ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    {isWishlistPending ? (
                      <Loader2 size={24} className={`animate-spin ${inWishlist ? 'text-red-500' : 'text-ink/60'}`} />
                    ) : (
                      <Heart 
                        size={24} 
                        className={`transition-colors duration-300 ${inWishlist ? 'fill-current' : ''}`} 
                        strokeWidth={inWishlist ? 2.5 : 2} 
                      />
                    )}
                  </motion.div>
                </motion.button>
              </div>

              {/* Row 2: Main Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <SlideToCartButton 
                    onAdd={handleAddToCart}
                    disabled={!selectedVariant?.inStock}
                    isAdded={justAdded}
                  />
                </div>
                <Button 
                  variant="dark" 
                  className="flex-1 h-16 rounded-xl font-bold text-white bg-gradient-to-r from-ink to-gray-800 hover:from-black hover:to-ink transition-all duration-500 text-sm uppercase tracking-widest border-none shadow-[0_8px_20px_rgb(0,0,0,0.15)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.25)] hover:-translate-y-0.5"
                  onClick={() => {
                    handleAddToCart()
                    setTimeout(() => window.location.href = '/checkout', 300)
                  }}
                  disabled={!selectedVariant?.inStock}
                >
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Trust Badges Inline Flow */}
            <div className="flex flex-wrap gap-x-8 gap-y-6 mb-12 pt-6 border-t border-ink/10">
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl border border-ink/10 text-ink flex items-center justify-center font-bold text-lg group-hover:scale-110 group-hover:border-ink/30 transition-all duration-300">
                  <ShieldCheck size={18} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-ink/40 font-bold">Purity</span>
                  <span className="text-sm font-semibold text-ink">≥99% Tested</span>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl border border-ink/10 text-ink flex items-center justify-center font-bold text-lg group-hover:scale-110 group-hover:border-ink/30 transition-all duration-300">
                  <FlaskConical size={18} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-ink/40 font-bold">Testing</span>
                  <span className="text-sm font-semibold text-ink">LC-MS Verified</span>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl border border-ink/10 text-ink flex items-center justify-center font-bold text-lg group-hover:scale-110 group-hover:border-ink/30 transition-all duration-300">
                  <MapPin size={18} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-ink/40 font-bold">Location</span>
                  <span className="text-sm font-semibold text-ink">US Based</span>
                </div>
              </div>
              {product.coaFile && (
                <a href={product.coaFile} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group hover:opacity-80 transition-opacity">
                  <div className="w-10 h-10 rounded-xl bg-ink text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <Download size={16} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-ink/40 font-bold">Download</span>
                    <span className="text-sm font-semibold text-ink border-b border-ink/20">COA File</span>
                  </div>
                </a>
              )}
            </div>

            {/* Accordions (Clean Line Style) */}
            <div className="border-t border-ink/10">
              
              {/* Description */}
              <div className="border-b border-ink/10">
                <button 
                  className="w-full flex justify-between items-center py-6 bg-transparent focus:outline-none group"
                  onClick={() => setDescOpen(!descOpen)}
                >
                  <h3 className="text-sm uppercase tracking-[0.2em] font-bold text-ink group-hover:text-ink/70 transition-colors">Description</h3>
                  <motion.div animate={{ rotate: descOpen ? -90 : 90 }} transition={{ duration: 0.2 }}>
                    <ChevronRight className="text-ink/50" size={18} strokeWidth={2} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {descOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-ink/70 leading-[1.8] text-[15px] pb-8 pr-4 font-medium">
                        {product.description || product.shortDescription}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Delivery Options */}
              <div className="border-b border-ink/10">
                <button 
                  className="w-full flex justify-between items-center py-6 bg-transparent focus:outline-none group"
                  onClick={() => setDeliveryOpen(!deliveryOpen)}
                >
                  <h3 className="text-sm uppercase tracking-[0.2em] font-bold text-ink group-hover:text-ink/70 transition-colors">Delivery Options</h3>
                  <motion.div animate={{ rotate: deliveryOpen ? -90 : 90 }} transition={{ duration: 0.2 }}>
                    <ChevronRight className="text-ink/50" size={18} strokeWidth={2} />
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {deliveryOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden pb-8"
                    >
                      <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4 group">
                          <div className="w-10 h-10 rounded-xl border border-ink/10 text-ink flex items-center justify-center font-bold text-lg shrink-0 group-hover:scale-110 group-hover:border-ink/30 transition-all duration-300">
                            <Truck size={18} strokeWidth={1.5} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider text-ink/40 font-bold">Standard Delivery</span>
                            <span className="text-sm font-semibold text-ink">3-4 Working Days</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 group">
                          <div className="w-10 h-10 rounded-xl border border-ink/10 text-ink flex items-center justify-center font-bold text-lg shrink-0 group-hover:scale-110 group-hover:border-ink/30 transition-all duration-300">
                            <Sparkles size={18} strokeWidth={1.5} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider text-ink/40 font-bold">Free Shipping</span>
                            <span className="text-sm font-semibold text-ink">On all orders above $300</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

          </div>
        </div>
        
        {/* Merged Tabs Section */}
        <div className="mt-32 w-full">
          <ProductTabs tabs={product.tabs} />
        </div>

        </Container>
      </section>

      {/* 5. Related Editorial Carousel */}
      <section className="w-full py-32 bg-[#f8fafc] border-t border-blue-100/50 overflow-hidden relative">
        <Container size="wide" className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-[#5984c4] text-label-sm uppercase tracking-[0.2em] font-bold mb-4 block">Continue Exploring</span>
              <h2 className={`text-[44px] sm:text-[56px] lg:text-[64px] leading-none font-bold tracking-tighter text-ink ${inter.className}`}>
                Also Considered.
              </h2>
            </div>
            
            {/* Carousel Navigation */}
            <div className="flex gap-3">
              <button 
                onClick={() => relatedEmblaApi?.scrollPrev()}
                className="w-12 h-12 rounded-xl border border-blue-200 flex items-center justify-center text-ink hover:bg-ink hover:text-white transition-all shadow-sm bg-white"
                aria-label="Previous Products"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => relatedEmblaApi?.scrollNext()}
                className="w-12 h-12 rounded-xl border border-blue-200 flex items-center justify-center text-ink hover:bg-ink hover:text-white transition-all shadow-sm bg-white"
                aria-label="Next Products"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div 
            className="relative -mx-4 px-4 sm:mx-0 sm:px-0 md:cursor-none md:[&_*]:!cursor-none"
            onMouseEnter={() => setIsHoveringSlider(true)}
            onMouseLeave={() => setIsHoveringSlider(false)}
            onMouseMove={handleSliderMouseMove}
          >
            <div className="overflow-hidden" ref={relatedEmblaRef}>
              <div className="flex gap-6 lg:gap-8 pb-12">
                {product.relatedProducts.map((p) => (
                  <div key={p.id} className="flex-[0_0_100%] sm:flex-[0_0_45%] lg:flex-[0_0_calc(25%-1.5rem)] min-w-0">
                    <PrimaryProductCard product={p as any} aspectRatio="4/5" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQs Section */}
      {product.faqs && product.faqs.length > 0 && (
        <section className="relative bg-white py-24 max-[992px]:py-20 max-[768px]:py-16">
          <div className="relative z-2 mx-auto flex max-w-[800px] flex-col items-center gap-12 px-8 max-[992px]:gap-8 max-[768px]:gap-6 max-[768px]:px-4 max-[480px]:px-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex items-center justify-center gap-3">
                <span className="text-[0.9rem] font-medium tracking-[0.05em] text-accent uppercase">Support</span>
              </div>
              <h2 className="m-0 text-[clamp(2rem,3.5vw,3rem)] leading-[1.15] font-normal text-[#222222] max-[768px]:text-[2rem] max-[480px]:text-[1.75rem]">
                FREQUENTLY ASKED <br /> QUESTIONS
              </h2>
            </div>

            <div className="flex w-full flex-col gap-4">
              {product.faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index
                return (
                  <div
                    key={index}
                    className={`cursor-pointer overflow-hidden rounded-xl border bg-white p-6 px-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d0d0d0] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] max-[768px]:rounded-[10px] max-[768px]:px-5 max-[768px]:py-[1.2rem] ${isOpen ? 'border-[#222222]' : 'border-[#e5e7eb]'}`}
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="m-0 pr-5 text-[1.2rem] font-medium text-[#111111] max-[768px]:pr-3 max-[768px]:text-base max-[480px]:text-[0.95rem]">
                        {faq.question}
                      </h3>
                      <div
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 max-[768px]:h-7 max-[768px]:w-7 ${isOpen ? 'bg-[#111111] text-white' : 'bg-black/[0.03]'}`}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                    </div>
                    <div
                      className={`transition-all duration-300 ease-in-out ${isOpen ? 'mt-4' : 'mt-0'}`}
                      style={{
                        maxHeight: isOpen ? '200px' : '0',
                        opacity: isOpen ? 1 : 0,
                      }}
                    >
                      <p className="m-0 text-base leading-[1.6] text-[#666666] max-[768px]:text-[0.95rem] max-[480px]:text-[0.9rem]">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Mobile Fixed Action Bar */}
      <AnimatePresence>
        {showMobileBar && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/90 backdrop-blur-xl border-t border-gray-200 flex items-center gap-3 lg:hidden shadow-[0_-8px_30px_rgba(0,0,0,0.05)] pb-safe"
          >
            <motion.button 
              whileHover={isWishlistPending ? {} : { scale: 1.05 }}
              whileTap={isWishlistPending ? {} : { scale: 0.9 }}
              className={`relative w-11 h-11 p-0 flex-shrink-0 rounded-xl font-bold border transition-colors duration-300 flex items-center justify-center group outline-none disabled:opacity-70 ${
                inWishlist ? 'border-red-500 bg-red-50 text-red-500 shadow-sm' : 'border-ink/10 bg-white text-ink/60 hover:text-ink hover:bg-gray-50'
              }`}
              aria-label="Toggle Wishlist"
              onClick={handleWishlistClick}
              disabled={isWishlistPending}
            >
              <AnimatePresence>
                {showParticles && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    {[...Array(8)].map((_, i) => {
                      const angle = (i * 45 * Math.PI) / 180;
                      return (
                        <motion.div
                          key={i}
                          className="absolute w-1.5 h-1.5 bg-red-400 rounded-full"
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
                animate={inWishlist && !isWishlistPending ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {isWishlistPending ? (
                  <Loader2 size={18} className={`animate-spin ${inWishlist ? 'text-red-500' : 'text-ink/60'}`} />
                ) : (
                  <Heart size={18} className={`transition-colors duration-300 ${inWishlist ? 'fill-current' : ''}`} strokeWidth={inWishlist ? 2.5 : 2} />
                )}
              </motion.div>
            </motion.button>

            <Button 
              variant="outline" 
              className="w-11 h-11 p-0 flex-shrink-0 rounded-xl font-bold text-ink border border-ink bg-white hover:bg-ink hover:text-white transition-all duration-300 flex items-center justify-center group"
              aria-label="Add to Cart"
              onClick={handleAddToCart}
              disabled={!selectedVariant?.inStock || justAdded}
            >
              <AnimatePresence mode="wait">
                {justAdded ? (
                  <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Check size={18} strokeWidth={2.5} />
                  </motion.div>
                ) : (
                  <motion.div key="cart" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <ShoppingCart size={18} strokeWidth={1.5} className="group-hover:text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>

            <Button 
              variant="dark" 
              className="flex-1 h-11 rounded-xl font-bold text-white bg-gradient-to-r from-ink to-gray-800 hover:from-black hover:to-ink transition-all duration-300 text-[11px] uppercase tracking-widest border-none shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:-translate-y-0.5"
              onClick={() => {
                handleAddToCart()
                setTimeout(() => window.location.href = '/checkout', 300)
              }}
              disabled={!selectedVariant?.inStock}
            >
              Buy Now
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Swipe Cursor */}
      <AnimatePresence>
        {isHoveringSlider && (
          <motion.div
            initial={{ scale: 0, opacity: 0, padding: '0px' }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              padding: isSliderAtEnd ? '0 24px' : '0px'
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="fixed top-0 left-0 h-[72px] bg-white/90 backdrop-blur-md text-ink rounded-xl flex items-center justify-center pointer-events-none z-[100] text-[10px] font-bold tracking-[0.2em] shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-ink/10 hidden md:flex overflow-hidden"
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
              minWidth: '72px',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={isSliderAtEnd ? 'end' : 'swipe'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="whitespace-nowrap"
              >
                {isSliderAtEnd ? "AH, THAT'S IT" : "SWIPE"}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
