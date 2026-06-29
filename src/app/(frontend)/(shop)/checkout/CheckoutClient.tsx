'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown, ChevronUp, Lock, Loader2, ArrowRight, ShieldCheck, Tag, ShoppingCart, Sparkles } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useCartStore } from '@/lib/cart/store'
import { verifyCoupon, getUserDefaultAddress, getUserMaxxPoints, getUserAddresses } from '../actions'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth/AuthContext'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { StripeCheckoutForm } from './StripeCheckoutForm'
import { createPaymentIntent, getShippingMethods } from './actions'
import { Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
const stripePromise = typeof window !== 'undefined' && stripeKey.startsWith('pk_') ? loadStripe(stripeKey) : null

export function CheckoutClient() {
  const { items, couponCode: storedCouponCode, setCoupon } = useCartStore()
  const { user } = useAuth()
  
  // Mobile summary toggle
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(true)

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'zelle'>('zelle')

  // Stripe
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)

  // Maxx Points State
  const [availablePoints, setAvailablePoints] = useState(0)
  const [isRedeemingPoints, setIsRedeemingPoints] = useState(false)

  // Address Selection State
  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | 'new'>('new')

  // Form State
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zip: '',
    marketing: false,
    saveInfo: false
  })

  // Prefill Data
  useEffect(() => {
    const prefillData = async () => {
      if (!user) return
      
      setFormData(prev => ({
        ...prev,
        email: user.email || prev.email,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
      }))

      try {
        const userAddresses = await getUserAddresses()
        if (userAddresses && userAddresses.length > 0) {
          setAddresses(userAddresses)
          const defaultAddress = userAddresses.find((a: any) => a.isDefaultShipping) || userAddresses[0]
          setSelectedAddressId(String(defaultAddress.id))
          setFormData(prev => ({
            ...prev,
            address: defaultAddress.line1,
            apartment: defaultAddress.line2 || '',
            city: defaultAddress.city,
            state: defaultAddress.state,
            zip: defaultAddress.postalCode,
            phone: defaultAddress.phone || ''
          }))
        }
      } catch (err) {
        console.error('Failed to load user addresses:', err)
      }

      const points = await getUserMaxxPoints()
      setAvailablePoints(points)
    }
    
    prefillData()
  }, [user])

  // Shipping State
  const [availableShippingMethods, setAvailableShippingMethods] = useState<any[]>([])
  const [shippingMethod, setShippingMethod] = useState<string>('')
  const [activeFees, setActiveFees] = useState<any[]>([])
  
  // Fetch data
  useEffect(() => {
    getShippingMethods().then(methods => {
      setAvailableShippingMethods(methods)
      if (methods.length > 0) {
        setShippingMethod(methods[0].method)
      }
    })
    
    // Fetch processing fees from generic /api to avoid complex server actions import issues
    fetch('/api/processing-fees')
      .then(res => res.json())
      .then(data => {
         if (data?.docs) {
           const active = data.docs.filter((f: any) => f.isActive && !f.isOptional)
           setActiveFees(active)
         }
      })
  }, [])

  // Coupon State
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; freeShipping: boolean; description: string } | null>(null)
  const [isVerifyingCoupon, setIsVerifyingCoupon] = useState(false)

  // Order Calculations
  const subtotal = items.reduce((acc, item) => acc + item.priceSnapshot * item.quantity, 0)


  const visibleShippingMethods = availableShippingMethods.filter((method: any) => {
    if (method.minOrderAmount && method.minOrderAmount > 0) {
      return subtotal >= method.minOrderAmount
    }
    return true
  })

  useEffect(() => {
    if (visibleShippingMethods.length > 0) {
      const isCurrentValid = visibleShippingMethods.some(m => m.method === shippingMethod)
      if (!isCurrentValid) {
        setShippingMethod(visibleShippingMethods[0].method)
      }
    }
  }, [subtotal, availableShippingMethods, shippingMethod])

  const selectedMethodObj = visibleShippingMethods.find(m => m.method === shippingMethod) || visibleShippingMethods[0]
  const shippingCost = selectedMethodObj?.price || 0
  const isExpressShipping = shippingMethod.toLowerCase().includes('express')
  const finalShipping = (appliedCoupon?.freeShipping && !isExpressShipping) ? 0 : shippingCost
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0
  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount)
  
  // Calculate dynamic fees
  let processingFeeAmount = 0
  activeFees.forEach((fee: any) => {
    if (fee.type === 'percentage') {
      processingFeeAmount += subtotalAfterDiscount * (fee.amount / 100)
    } else if (fee.type === 'fixed_amount') {
      processingFeeAmount += (fee.amount / 100)
    }
  })

  const totalBeforePoints = subtotalAfterDiscount + finalShipping + processingFeeAmount
  
  const pointsToRedeem = isRedeemingPoints ? Math.min(availablePoints, totalBeforePoints) : 0
  const total = totalBeforePoints - pointsToRedeem

  // Stripe disabled for now — will be enabled later
  // useEffect(() => {
  //   if (items.length > 0 && total > 0 && paymentMethod === 'stripe') {
  //     createPaymentIntent(items, shippingMethod, appliedCoupon?.code, isRedeemingPoints)
  //       .then(res => {
  //         if (res.clientSecret && res.paymentIntentId) {
  //           setClientSecret(res.clientSecret)
  //           setPaymentIntentId(res.paymentIntentId)
  //         }
  //       })
  //   }
  // }, [items, shippingMethod, appliedCoupon, isRedeemingPoints, paymentMethod])

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleApplyCoupon = async (e?: React.FormEvent, codeToApply?: string) => {
    if (e) e.preventDefault()
    const code = codeToApply || couponCode
    if (!code || !code.trim()) return

    setIsVerifyingCoupon(true)
    try {
      const result = await verifyCoupon(code.trim(), subtotal, items)
      if (result.valid) {
        setAppliedCoupon({
          code: result.code || code.trim(),
          discount: result.discount || 0,
          freeShipping: result.freeShipping || false,
          description: result.description || 'Coupon applied'
        })
        setCouponCode('')
        setCoupon(result.code || code.trim())
        if (!codeToApply) toast.success(result.description || 'Coupon applied successfully')
      } else {
        setAppliedCoupon(null)
        if (!codeToApply) toast.error(result.error || 'Invalid coupon code')
        if (codeToApply) setCoupon(null)
      }
    } catch (err) {
      setAppliedCoupon(null)
      if (!codeToApply) toast.error('Failed to verify coupon')
      if (codeToApply) setCoupon(null)
    } finally {
      setIsVerifyingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCoupon(null)
    toast.info('Coupon removed')
  }

  const handleZeroTotalCheckout = async () => {
    if (!formData.email || !formData.firstName || !formData.address || !formData.city || !formData.state || !formData.zip) {
      toast.error('Please fill out all required shipping fields before completing your order.')
      return
    }

    setIsProcessing(true)

    try {
      const { createPayloadOrder } = await import('./actions')
      const orderRes = await createPayloadOrder(
        items, shippingMethod, appliedCoupon?.code, isRedeemingPoints, 
        { ...formData, email: user?.email || formData.email },
        'free_order',
        user?.id != null ? String(user.id) : undefined
      )

      if (orderRes.error || !orderRes.orderId) {
        toast.error(orderRes.error || 'Failed to initialize free order in database.')
        if ((orderRes as any).priceChanged && (orderRes as any).updatedItems) {
          useCartStore.getState().setItems((orderRes as any).updatedItems)
        }
        setIsProcessing(false)
        return
      }

      toast.success("Order successful! Redirecting...")
      useCartStore.getState().clear()
      window.location.href = `/order-confirmation/${orderRes.orderId}`
    } catch (e: any) {
      toast.error('An unexpected error occurred.')
      setIsProcessing(false)
    }
  }

  const handleZelleCheckout = async () => {
    if (!formData.email || !formData.firstName || !formData.address || !formData.city || !formData.state || !formData.zip) {
      toast.error('Please fill out all required shipping fields before completing your order.')
      return
    }

    setIsProcessing(true)
    try {
      const { createPayloadOrder } = await import('./actions')
      const orderRes = await createPayloadOrder(
        items, shippingMethod, appliedCoupon?.code, isRedeemingPoints,
        { ...formData, email: user?.email || formData.email },
        'zelle_pending',
        user?.id != null ? String(user.id) : undefined
      )

      if (orderRes.error || !orderRes.orderId) {
        toast.error(orderRes.error || 'Failed to create order.')
        setIsProcessing(false)
        return
      }

      toast.success('Order placed! Complete Zelle payment to confirm.')
      useCartStore.getState().clear()
      window.location.href = `/order-confirmation/${orderRes.orderId}`
    } catch {
      toast.error('An unexpected error occurred.')
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    if (storedCouponCode && !isVerifyingCoupon) {
      handleApplyCoupon(undefined, storedCouponCode)
    }
  }, [storedCouponCode, subtotal])

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-display-sm font-display text-ink mb-4">Your cart is empty</h1>
          <p className="text-body-md text-ink-muted mb-8">Looks like you haven't added anything yet.</p>
          <Link href="/products">
            <Button variant="dark" className="rounded-full h-14 px-8 tracking-widest text-sm uppercase">
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-32 pb-16 md:pt-36 md:pb-24 bg-white min-h-screen">
      <Container size="page">
        
        <div className="flex items-end justify-between mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold tracking-tight text-ink ${spaceGrotesk.className}`}>
            Secure Checkout
          </h1>
        </div>

        {/* Mobile Summary Accordion */}
        <div className="lg:hidden mb-8 bg-[#F5F5F7]/40 rounded-3xl p-1 shadow-sm border border-slate-100">
          <button 
            onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
            className="w-full p-4 flex items-center justify-between text-ink"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart size={20} className="text-ink/60" />
              <span className="text-sm font-bold uppercase tracking-widest">Order Summary</span>
              <motion.div animate={{ rotate: mobileSummaryOpen ? 180 : 0 }}>
                <ChevronDown size={16} />
              </motion.div>
            </div>
            <span className="text-lg font-bold">${total.toFixed(2)}</span>
          </button>
          
          <AnimatePresence>
            {mobileSummaryOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 border-t border-ink/5 flex flex-col gap-6 bg-[#fafafa]/50">
                  
                  {/* Items */}
                  <div className="flex flex-col gap-4 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2" data-lenis-prevent="true">
                    {items.map((item) => (
                      <div key={item.lineId} className="flex gap-4 group">
                        <div className="relative w-16 h-16 shrink-0">
                          <div className="w-full h-full bg-cream rounded-xl overflow-hidden border border-ink/5 relative">
                            <Image src={item.product?.imageUrl || '/placeholder.png'} alt={item.product?.name || 'Product'} fill className="object-cover" />
                          </div>
                          <div className="absolute -top-2 -right-2 w-5 h-5 bg-ink text-cream rounded-full flex items-center justify-center text-[10px] font-bold z-10">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex flex-col flex-1 justify-center py-1">
                          <span className="text-sm font-bold text-ink leading-tight">{item.product?.name}</span>
                          {item.variantSku && !['DEFAULT', 'DEFAULT TITLE'].includes(item.variantSku.toUpperCase()) && (
                            <span className="text-[10px] uppercase tracking-widest text-ink/40 mt-1">{item.variantSku}</span>
                          )}
                        </div>
                        <span className="text-sm text-ink font-bold self-center">
                          ${(item.priceSnapshot * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Promo Code */}
                  <div className="flex flex-col gap-3">
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-500/20 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <Tag size={16} className="text-green-600" />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-green-700">{appliedCoupon.code}</span>
                            <span className="text-xs font-medium text-green-600/70">{appliedCoupon.description}</span>
                          </div>
                        </div>
                        <button onClick={handleRemoveCoupon} className="text-xs font-bold text-green-700 hover:text-green-800 uppercase tracking-widest transition-colors">
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <Input 
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="Discount code or gift card" 
                          className="flex-1 h-12 rounded-2xl border-ink/10 bg-white focus-visible:ring-ink shadow-sm" 
                        />
                        <Button 
                          type="submit" 
                          variant="dark" 
                          disabled={!couponCode.trim() || isVerifyingCoupon}
                          className="h-12 px-6 rounded-2xl text-xs uppercase tracking-widest disabled:opacity-100 disabled:bg-ink/5 disabled:text-ink/40 disabled:border-transparent transition-colors text-white"
                        >
                          {isVerifyingCoupon ? <Loader2 size={16} className="animate-spin text-ink/40" /> : 'Apply'}
                        </Button>
                      </form>
                    )}
                  </div>

                  {/* Maxx Points */}
                  {availablePoints > 0 && (
                    <div className={`flex flex-col gap-3 p-4 rounded-2xl border transition-all ${isRedeemingPoints ? 'bg-amber-50 border-amber-200/60 shadow-inner-sm' : 'bg-white border-ink/10 shadow-sm'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isRedeemingPoints ? 'bg-amber-100 text-amber-600' : 'bg-cream text-ink/40'}`}>
                            <Sparkles size={14} />
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-sm font-bold ${isRedeemingPoints ? 'text-amber-700' : 'text-ink'}`}>Maxx Points</span>
                            <span className="text-xs font-medium text-ink/50">You have {Number(availablePoints.toFixed(2))} points</span>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={isRedeemingPoints}
                            onChange={() => setIsRedeemingPoints(!isRedeemingPoints)}
                          />
                          <div className="w-11 h-6 bg-ink/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="w-full h-px bg-ink/5" />

                  {/* Totals */}
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center text-sm font-medium text-ink/70">
                      <span>Subtotal</span>
                      <span className="text-ink font-bold">${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <AnimatePresence>
                      {appliedCoupon && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} 
                          animate={{ height: 'auto', opacity: 1 }} 
                          exit={{ height: 0, opacity: 0 }}
                          className="flex justify-between items-center text-sm font-medium text-green-600 overflow-hidden"
                        >
                          <span className="py-1">Discount ({appliedCoupon.code})</span>
                          <span className="py-1 font-bold">-${appliedCoupon.discount.toFixed(2)}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {isRedeemingPoints && pointsToRedeem > 0 && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }} 
                          animate={{ height: 'auto', opacity: 1 }} 
                          exit={{ height: 0, opacity: 0 }}
                          className="flex justify-between items-center text-sm font-medium text-green-600 overflow-hidden"
                        >
                          <span className="py-1 flex items-center gap-1.5"><Sparkles size={14} /> Points Applied</span>
                          <span className="py-1 font-bold">-${pointsToRedeem.toFixed(2)}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex justify-between items-center text-sm font-medium text-ink/70">
                      <span>Shipping {selectedMethodObj?.method ? `(${selectedMethodObj.method})` : ''}</span>
                      <span className="text-ink font-bold">{finalShipping === 0 ? 'Free' : `$${finalShipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium text-ink/70">
                      <span>Processing Fee</span>
                      <span className="text-ink font-bold">${processingFeeAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="w-full h-px bg-ink/5" />

                  <div className="flex justify-between items-end mb-2 mt-4">
                    <span className="text-sm font-bold uppercase tracking-widest text-ink/60">Total</span>
                    <span className={`text-4xl font-bold text-ink ${spaceGrotesk.className}`}>
                      ${total.toFixed(2)}
                    </span>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-12 lg:gap-20">
          
          {/* Left Column: Flow */}
          <div className="flex flex-col gap-10">
            
            {/* Express Checkout */}
            <div className="flex flex-col gap-4 p-6 sm:p-8 bg-white rounded-3xl border border-slate-100 shadow-sm items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-ink/40 text-center">Express Checkout</span>
              <div className="flex flex-col sm:flex-row w-full gap-3">
                <Button variant="dark" className="flex-1 h-12 rounded-full bg-[#000] text-white hover:bg-black/80 transition-colors shadow-sm whitespace-nowrap">
                  Apple Pay
                </Button>
                <Button variant="outline" className="flex-1 h-12 rounded-full bg-white text-ink border-ink/20 hover:border-ink/40 transition-colors shadow-sm whitespace-nowrap">
                  Google Pay
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 py-2 opacity-50">
              <div className="flex-1 h-px bg-ink/10" />
              <span className="text-xs font-bold uppercase tracking-widest text-ink/60">OR PAY WITH CARD</span>
              <div className="flex-1 h-px bg-ink/10" />
            </div>

            {/* Continuous Form */}
            <div className="flex flex-col gap-10">
              <input type="hidden" name="redeemPoints" value={isRedeemingPoints ? 'true' : 'false'} />
              <input type="hidden" name="couponCode" value={appliedCoupon?.code || ''} />
              
              {/* Contact */}
              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-display font-bold text-ink mb-2">Contact Information</h2>
                <Input 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address" 
                  type="email" 
                  className="h-14 rounded-2xl border-slate-100 bg-white shadow-sm focus-visible:ring-1 focus-visible:ring-ink"
                  required
                />
                <div className="flex items-start gap-3 mt-1 px-1">
                  <Checkbox 
                    id="marketing" 
                    name="marketing"
                    checked={formData.marketing}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, marketing: !!checked }))}
                    className="mt-0.5 rounded-md data-[state=checked]:bg-ink data-[state=checked]:border-ink" 
                  />
                  <label htmlFor="marketing" className="text-sm text-ink/60 cursor-pointer select-none">
                    Email me with news and exclusive offers.
                  </label>
                </div>
              </section>

              {/* Delivery */}
              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-display font-bold text-ink mb-2">Delivery Address</h2>
                
                {user && addresses.length > 0 && (
                  <div className="flex flex-col gap-3 mb-4">
                    {addresses.map((addr) => (
                      <label key={addr.id} className={`flex items-start gap-4 p-5 rounded-2xl border transition-colors cursor-pointer shadow-sm ${selectedAddressId === String(addr.id) ? 'border-ink bg-ink/5' : 'border-slate-100 bg-white hover:border-ink/30'}`}>
                        <input 
                          type="radio" 
                          name="addressSelection" 
                          value={addr.id} 
                          checked={selectedAddressId === String(addr.id)}
                          onChange={() => setSelectedAddressId(String(addr.id))}
                          className="mt-0.5 w-4 h-4 accent-black text-ink border-ink/20 focus:ring-ink focus:ring-offset-0 shrink-0" 
                        />
                        <div className="flex flex-col flex-1">
                          <div className="flex items-start justify-between w-full">
                            <span className="text-sm font-bold text-ink leading-tight">
                              {addr.firstName} {addr.lastName}
                            </span>
                            {addr.isDefaultShipping && (
                              <span className="text-[10px] font-bold uppercase tracking-widest text-ink/60 bg-white border border-slate-100 shadow-sm px-2 py-0.5 rounded-md shrink-0">
                                Default
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-ink/70 mt-1.5">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</span>
                          <span className="text-xs text-ink/70 mt-0.5">{addr.city}, {addr.state} {addr.postalCode}</span>
                        </div>
                      </label>
                    ))}

                    <label className={`flex items-center gap-4 p-5 rounded-2xl border transition-colors cursor-pointer shadow-sm ${selectedAddressId === 'new' ? 'border-ink bg-ink/5' : 'border-slate-100 bg-white hover:border-ink/30'}`}>
                      <input 
                        type="radio" 
                        name="addressSelection" 
                        value="new" 
                        checked={selectedAddressId === 'new'}
                        onChange={() => {
                          setSelectedAddressId('new')
                          setFormData(prev => ({ ...prev, address: '', apartment: '', city: '', state: '', zip: '', phone: '' }))
                        }}
                        className="w-4 h-4 accent-black text-ink border-ink/20 focus:ring-ink focus:ring-offset-0" 
                      />
                      <span className="text-sm font-bold text-ink">+ Add New Address</span>
                    </label>
                  </div>
                )}

                <input type="hidden" name="addressId" value={selectedAddressId} />

                {(!user || selectedAddressId === 'new') && (
                  <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-2 gap-4">
                      <Input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" className="h-14 rounded-2xl border-slate-100 bg-white shadow-sm focus-visible:ring-ink" required={selectedAddressId === 'new'} />
                      <Input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" className="h-14 rounded-2xl border-slate-100 bg-white shadow-sm focus-visible:ring-ink" required={selectedAddressId === 'new'} />
                    </div>
                    <Input name="address" value={formData.address} onChange={handleInputChange} placeholder="Address" className="h-14 rounded-2xl border-slate-100 bg-white shadow-sm focus-visible:ring-ink" required={selectedAddressId === 'new'} />
                    <Input name="apartment" value={formData.apartment} onChange={handleInputChange} placeholder="Apartment, suite, etc. (optional)" className="h-14 rounded-2xl border-slate-100 bg-white shadow-sm focus-visible:ring-ink" />
                    <div className="grid grid-cols-6 gap-4">
                      <Input name="city" value={formData.city} onChange={handleInputChange} placeholder="City" className="col-span-3 sm:col-span-2 h-14 rounded-2xl border-slate-100 bg-white shadow-sm focus-visible:ring-ink" required={selectedAddressId === 'new'} />
                      <Input name="state" value={formData.state} onChange={handleInputChange} placeholder="State" className="col-span-3 sm:col-span-2 h-14 rounded-2xl border-slate-100 bg-white shadow-sm focus-visible:ring-ink" required={selectedAddressId === 'new'} />
                      <Input name="zip" value={formData.zip} onChange={handleInputChange} placeholder="ZIP Code" className="col-span-6 sm:col-span-2 h-14 rounded-2xl border-slate-100 bg-white shadow-sm focus-visible:ring-ink" required={selectedAddressId === 'new'} />
                    </div>
                    <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone (for delivery updates)" type="tel" className="h-14 rounded-2xl border-slate-100 bg-white shadow-sm focus-visible:ring-ink" required={selectedAddressId === 'new'} />
                  </div>
                )}
              </section>

              {/* Shipping Method */}
              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-display font-bold text-ink mb-2">Shipping Method</h2>
                <div className="flex flex-col gap-3">
                  {visibleShippingMethods.map((method: any) => (
                    <label key={method.method} className={`flex items-center justify-between p-5 rounded-2xl border transition-colors cursor-pointer shadow-sm ${shippingMethod === method.method ? 'border-ink bg-ink/5' : 'border-slate-100 bg-white hover:border-ink/30'}`}>
                      <div className="flex items-center gap-4">
                        <input 
                          type="radio" 
                          name="shipping" 
                          value={method.method} 
                          checked={shippingMethod === method.method} 
                          onChange={() => setShippingMethod(method.method)}
                          className="w-4 h-4 accent-black text-ink border-ink/20 focus:ring-ink focus:ring-offset-0" 
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-ink">{method.method}</span>
                          {method.estimatedDays && (
                            <span className="text-xs text-ink/60 mt-0.5">{method.estimatedDays} business days</span>
                          )}
                        </div>
                      </div>
                      <span className="text-sm font-bold text-ink">
                        {(() => {
                          const isExpress = method.method.toLowerCase().includes('express')
                          const isFreeShipping = appliedCoupon?.freeShipping && !isExpress
                          if (isFreeShipping || method.price === 0) return 'Free'
                          return `$${method.price.toFixed(2)}`
                        })()}
                      </span>
                    </label>
                  ))}
                </div>
              </section>

              {/* Payment */}
              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-display font-bold text-ink mb-2">Payment</h2>
                <p className="text-xs font-medium text-ink/50 mb-2 flex items-center gap-1.5"><Lock size={12} /> All transactions are 256-bit encrypted and secure.</p>

                {total <= 0 ? (
                  <div className="w-full h-56 bg-green-50 border border-green-500/20 rounded-3xl flex flex-col items-center justify-center gap-4 shadow-sm relative overflow-hidden p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                       <Check size={24} />
                    </div>
                    <span className="text-sm font-bold text-green-800">Your order is completely covered!</span>
                    <Button onClick={handleZeroTotalCheckout} disabled={isProcessing} variant="dark" size="lg" className="w-full h-14 rounded-full">
                      {isProcessing ? <Loader2 className="animate-spin" /> : "Complete Free Order"}
                    </Button>
                  </div>
                ) : (
                  <div className="w-full bg-white border border-ink/10 rounded-3xl p-6 flex flex-col items-center gap-4 shadow-sm">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M13.559 24H6.832c-.91 0-1.376-1.1-.74-1.746L17.133 11.26H8.59a1.19 1.19 0 01-1.19-1.19V7.295c0-.657.533-1.19 1.19-1.19h6.869c.91 0 1.376 1.1.74 1.745L5.157 18.844h8.402c.657 0 1.19.533 1.19 1.19v2.776c0 .657-.533 1.19-1.19 1.19z" fill="#6D1ED4"/></svg>
                    </div>
                    <h3 className="text-sm font-bold text-ink">Pay with Zelle</h3>
                    <p className="text-sm text-center text-ink/70">
                      After placing your order, you'll receive Zelle payment instructions with a QR code on the confirmation page.
                    </p>
                    <Button onClick={handleZelleCheckout} disabled={isProcessing} variant="dark" size="lg" className="w-full h-14 rounded-full">
                      {isProcessing ? <Loader2 className="animate-spin" /> : `Place Order · $${total.toFixed(2)}`}
                    </Button>
                  </div>
                )}
              </section>

            </div>
          </div>

          {/* Right Column: Order Summary (Desktop) */}
          <div className="hidden lg:block relative">
            <div className="bg-[#F5F5F7]/40 p-8 md:p-10 rounded-[2rem] border border-slate-100 flex flex-col gap-8">
              
              <h2 className={`text-2xl font-bold text-ink ${spaceGrotesk.className}`}>
                Order Summary
              </h2>
              
              {/* Items List */}
              <div className="flex flex-col gap-6 max-h-[40vh] overflow-y-auto pt-4 pr-4 pb-2 custom-scrollbar" data-lenis-prevent="true">
                {items.map((item) => (
                  <div key={item.lineId} className="flex gap-4 group">
                    <div className="relative w-20 h-20 shrink-0 transition-transform group-hover:scale-105">
                      <div className="w-full h-full bg-cream border border-ink/5 rounded-2xl overflow-hidden relative">
                        <Image src={item.product?.imageUrl || '/placeholder.png'} alt={item.product?.name || 'Product'} fill className="object-cover" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-ink text-cream rounded-full flex items-center justify-center text-[11px] font-bold z-10 shadow-sm border-2 border-white">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 justify-center py-1">
                      <span className="text-sm font-bold text-ink leading-tight">{item.product?.name}</span>
                      {(item.variantTitle || item.variantSku) && !['DEFAULT', 'DEFAULT TITLE'].includes((item.variantTitle || item.variantSku || '').toUpperCase()) && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40 mt-1">{item.variantTitle || item.variantSku}</span>
                      )}
                    </div>
                    <span className="text-sm text-ink font-bold self-center">
                      ${(item.priceSnapshot * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="flex flex-col gap-3">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-500/20 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Tag size={16} className="text-green-600" />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-green-700">{appliedCoupon.code}</span>
                        <span className="text-xs font-medium text-green-600/70">{appliedCoupon.description}</span>
                      </div>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-xs font-bold text-green-700 hover:text-green-800 uppercase tracking-widest transition-colors">
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <Input 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Discount code or gift card" 
                      className="flex-1 h-12 rounded-2xl border-ink/10 bg-cream/50 focus-visible:ring-ink shadow-inner-sm" 
                    />
                    <Button 
                      type="submit" 
                      variant="dark" 
                      disabled={!couponCode.trim() || isVerifyingCoupon}
                      className="h-12 px-6 rounded-2xl text-xs uppercase tracking-widest disabled:opacity-100 disabled:bg-ink/5 disabled:text-ink/40 disabled:border-transparent transition-colors text-white"
                    >
                      {isVerifyingCoupon ? <Loader2 size={16} className="animate-spin text-ink/40" /> : 'Apply'}
                    </Button>
                  </form>
                )}
              </div>

              {/* Maxx Points */}
              {availablePoints > 0 && (
                <div className={`flex flex-col gap-3 p-5 rounded-2xl border transition-all ${isRedeemingPoints ? 'bg-amber-50 border-amber-200/60 shadow-inner-sm' : 'bg-white border-ink/10 shadow-sm'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isRedeemingPoints ? 'bg-amber-100 text-amber-600' : 'bg-cream text-ink/40'}`}>
                        <Sparkles size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold ${isRedeemingPoints ? 'text-amber-700' : 'text-ink'}`}>Maxx Points</span>
                        <span className="text-xs font-medium text-ink/50">You have {Number(availablePoints.toFixed(2))} points (${availablePoints.toFixed(2)})</span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={isRedeemingPoints}
                        onChange={() => setIsRedeemingPoints(!isRedeemingPoints)}
                      />
                      <div className="w-11 h-6 bg-ink/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>
                </div>
              )}

              <div className="w-full h-px bg-ink/5" />

              {/* Totals */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center text-sm font-medium text-ink/70">
                  <span>Subtotal</span>
                  <span className="text-ink font-bold">${subtotal.toFixed(2)}</span>
                </div>
                
                <AnimatePresence>
                  {appliedCoupon && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }}
                      className="flex justify-between items-center text-sm font-medium text-green-600 overflow-hidden"
                    >
                      <span className="py-1">Discount ({appliedCoupon.code})</span>
                      <span className="py-1 font-bold">-${appliedCoupon.discount.toFixed(2)}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {isRedeemingPoints && pointsToRedeem > 0 && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }}
                      className="flex justify-between items-center text-sm font-medium text-green-600 overflow-hidden"
                    >
                      <span className="py-1 flex items-center gap-1.5"><Sparkles size={14} /> Points Applied</span>
                      <span className="py-1 font-bold">-${pointsToRedeem.toFixed(2)}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-between items-center text-sm font-medium text-ink/70">
                  <span>Shipping {selectedMethodObj?.method ? `(${selectedMethodObj.method})` : ''}</span>
                  <span className="text-ink font-bold">{finalShipping === 0 ? 'Free' : `$${finalShipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium text-ink/70">
                  <span>Processing Fee</span>
                  <span className="text-ink font-bold">${processingFeeAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="w-full h-px bg-ink/5" />

              <div className="flex justify-between items-end mt-4">
                <span className="text-sm font-bold uppercase tracking-widest text-ink/60">Total</span>
                <span className={`text-4xl font-bold text-ink ${spaceGrotesk.className}`}>
                  ${total.toFixed(2)}
                </span>
              </div>
              
            </div>
          </div>

        </div>
      </Container>
    </div>
  )
}
