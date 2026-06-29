'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Loader2, ShieldCheck, ArrowLeft, Sparkles, Tag, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useCartStore } from '@/lib/cart/store'
import { verifyCoupon, getUserMaxxPoints, getUserAddresses } from '../actions'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth/AuthContext'
import { getShippingMethods } from './actions'

export function CheckoutClient() {
  const { items, couponCode: storedCouponCode, setCoupon } = useCartStore()
  const { user } = useAuth()

  const [availablePoints, setAvailablePoints] = useState(0)
  const [isRedeemingPoints, setIsRedeemingPoints] = useState(false)
  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | 'new'>('new')
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
    country: 'United States',
    marketing: false,
    saveInfo: false
  })

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

  const [availableShippingMethods, setAvailableShippingMethods] = useState<any[]>([])
  const [shippingMethod, setShippingMethod] = useState<string>('')
  const [activeFees, setActiveFees] = useState<any[]>([])

  useEffect(() => {
    getShippingMethods().then(methods => {
      setAvailableShippingMethods(methods)
      if (methods.length > 0) setShippingMethod(methods[0].method)
    })
    fetch('/api/processing-fees')
      .then(res => res.json())
      .then(data => {
        if (data?.docs) {
          const active = data.docs.filter((f: any) => f.isActive && !f.isOptional)
          setActiveFees(active)
        }
      })
  }, [])

  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; freeShipping: boolean; description: string } | null>(null)
  const [isVerifyingCoupon, setIsVerifyingCoupon] = useState(false)

  const subtotal = items.reduce((acc, item) => acc + item.priceSnapshot * item.quantity, 0)

  const visibleShippingMethods = availableShippingMethods.filter((method: any) => {
    if (method.minOrderAmount && method.minOrderAmount > 0) return subtotal >= method.minOrderAmount
    return true
  })

  useEffect(() => {
    if (visibleShippingMethods.length > 0) {
      const isCurrentValid = visibleShippingMethods.some(m => m.method === shippingMethod)
      if (!isCurrentValid) setShippingMethod(visibleShippingMethods[0].method)
    }
  }, [subtotal, availableShippingMethods, shippingMethod])

  const selectedMethodObj = visibleShippingMethods.find(m => m.method === shippingMethod) || visibleShippingMethods[0]
  const shippingCost = selectedMethodObj?.price || 0
  const isExpressShipping = shippingMethod.toLowerCase().includes('express')
  const finalShipping = (appliedCoupon?.freeShipping && !isExpressShipping) ? 0 : shippingCost
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0
  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount)

  let processingFeeAmount = 0
  activeFees.forEach((fee: any) => {
    if (fee.type === 'percentage') processingFeeAmount += subtotalAfterDiscount * (fee.amount / 100)
    else if (fee.type === 'fixed_amount') processingFeeAmount += (fee.amount / 100)
  })

  const totalBeforePoints = subtotalAfterDiscount + finalShipping + processingFeeAmount
  const pointsToRedeem = isRedeemingPoints ? Math.min(availablePoints, totalBeforePoints) : 0
  const total = totalBeforePoints - pointsToRedeem

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
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
    } catch {
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
      toast.error('Please fill out all required shipping fields.')
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
        toast.error(orderRes.error || 'Failed to create order.')
        if ((orderRes as any).priceChanged && (orderRes as any).updatedItems) {
          useCartStore.getState().setItems((orderRes as any).updatedItems)
        }
        setIsProcessing(false)
        return
      }
      toast.success('Order successful! Redirecting...')
      useCartStore.getState().clear()
      window.location.href = `/order-confirmation/${orderRes.orderId}`
    } catch {
      toast.error('An unexpected error occurred.')
      setIsProcessing(false)
    }
  }

  const handleZelleCheckout = async () => {
    if (!formData.email || !formData.firstName || !formData.address || !formData.city || !formData.state || !formData.zip) {
      toast.error('Please fill out all required shipping fields.')
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
      <div className="pt-32 pb-24 min-h-[70vh] flex items-center justify-center font-[family-name:var(--font-inter)]">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-ink mb-3">Your cart is empty</h1>
          <p className="text-sm text-gray-400 mb-8">Looks like you haven't added anything yet.</p>
          <Link href="/shop">
            <Button variant="dark" className="rounded-full h-12 px-8 text-xs uppercase tracking-[0.15em] font-semibold">
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const inputClass = 'h-12 rounded-lg border-gray-200 bg-white text-sm text-ink placeholder:text-gray-300 focus-visible:ring-1 focus-visible:ring-ink focus-visible:border-ink font-[family-name:var(--font-inter)]'
  const labelClass = 'text-xs font-medium text-ink mb-1.5 block'

  return (
    <div className="pt-28 pb-16 md:pt-32 md:pb-24 bg-white min-h-screen font-[family-name:var(--font-inter)]">
      <div className="max-w-6xl mx-auto px-4 md:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 lg:gap-16">

          {/* ═══════ LEFT COLUMN ═══════ */}
          <div className="flex flex-col gap-8">

            {/* Guest / Sign In Header */}
            <div className="flex items-center justify-between border border-gray-100 rounded-xl p-5">
              <div>
                <h2 className="text-base font-semibold text-ink">{user ? `Welcome back, ${user.firstName || 'User'}` : 'Checkout as Guest'}</h2>
                {!user && <p className="text-xs text-gray-400 mt-1">Sign in to track your order and save your information for faster checkout.</p>}
              </div>
              {!user && (
                <Link href="/login?redirect=/checkout" className="text-xs font-semibold text-ink hover:underline shrink-0">
                  Sign In
                </Link>
              )}
            </div>

            {/* Contact */}
            <section>
              <label className={labelClass}>Email Address</label>
              <Input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                type="email"
                className={inputClass}
                required
              />
              <div className="flex items-start gap-2.5 mt-3">
                <Checkbox
                  id="marketing"
                  name="marketing"
                  checked={formData.marketing}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, marketing: !!checked }))}
                  className="mt-0.5 rounded data-[state=checked]:bg-ink data-[state=checked]:border-ink"
                />
                <label htmlFor="marketing" className="text-xs text-gray-400 cursor-pointer select-none">
                  Email me with news and exclusive offers
                </label>
              </div>
            </section>

            {/* Shipping Information */}
            <section className="border border-gray-100 rounded-xl p-6">
              <h2 className="text-base font-semibold text-ink mb-5">Shipping Information</h2>

              {user && addresses.length > 0 && (
                <div className="flex flex-col gap-2.5 mb-5">
                  {addresses.map((addr) => (
                    <label key={addr.id} className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${selectedAddressId === String(addr.id) ? 'border-ink bg-gray-50/50' : 'border-gray-100 hover:border-gray-200'}`}>
                      <input
                        type="radio"
                        name="addressSelection"
                        value={addr.id}
                        checked={selectedAddressId === String(addr.id)}
                        onChange={() => {
                          setSelectedAddressId(String(addr.id))
                          setFormData(prev => ({
                            ...prev,
                            firstName: addr.firstName || prev.firstName,
                            lastName: addr.lastName || prev.lastName,
                            address: addr.line1,
                            apartment: addr.line2 || '',
                            city: addr.city,
                            state: addr.state,
                            zip: addr.postalCode,
                            phone: addr.phone || prev.phone,
                          }))
                        }}
                        className="mt-0.5 w-4 h-4 accent-black"
                      />
                      <div className="flex flex-col text-xs text-gray-500">
                        <span className="text-sm font-medium text-ink">{addr.firstName} {addr.lastName}</span>
                        <span className="mt-0.5">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} {addr.postalCode}</span>
                      </div>
                    </label>
                  ))}
                  <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${selectedAddressId === 'new' ? 'border-ink bg-gray-50/50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <input
                      type="radio"
                      name="addressSelection"
                      value="new"
                      checked={selectedAddressId === 'new'}
                      onChange={() => {
                        setSelectedAddressId('new')
                        setFormData(prev => ({ ...prev, address: '', apartment: '', city: '', state: '', zip: '', phone: '' }))
                      }}
                      className="w-4 h-4 accent-black"
                    />
                    <span className="text-sm font-medium text-ink">+ New Address</span>
                  </label>
                </div>
              )}

              {(!user || selectedAddressId === 'new') && (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>First Name</label>
                      <Input name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" className={inputClass} required />
                    </div>
                    <div>
                      <label className={labelClass}>Last Name</label>
                      <Input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" className={inputClass} required />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Address</label>
                    <Input name="address" value={formData.address} onChange={handleInputChange} placeholder="123 Main Street" className={inputClass} required />
                  </div>
                  <Input name="apartment" value={formData.apartment} onChange={handleInputChange} placeholder="Apartment, suite, etc. (optional)" className={inputClass} />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>City</label>
                      <Input name="city" value={formData.city} onChange={handleInputChange} placeholder="New York" className={inputClass} required />
                    </div>
                    <div>
                      <label className={labelClass}>ZIP Code</label>
                      <Input name="zip" value={formData.zip} onChange={handleInputChange} placeholder="10001" className={inputClass} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>State</label>
                      <Input name="state" value={formData.state} onChange={handleInputChange} placeholder="NY" className={inputClass} required />
                    </div>
                    <div>
                      <label className={labelClass}>Country</label>
                      <Input name="country" value={formData.country} onChange={handleInputChange} placeholder="United States" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <Input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1 (555) 123-4567" type="tel" className={inputClass} />
                  </div>
                  <div className="flex items-start gap-2.5 mt-1">
                    <Checkbox
                      id="saveInfo"
                      name="saveInfo"
                      checked={formData.saveInfo}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, saveInfo: !!checked }))}
                      className="mt-0.5 rounded data-[state=checked]:bg-ink data-[state=checked]:border-ink"
                    />
                    <label htmlFor="saveInfo" className="text-xs text-gray-400 cursor-pointer select-none">
                      Save this information for next time
                    </label>
                  </div>
                </div>
              )}
            </section>

            {/* Shipping Method */}
            {visibleShippingMethods.length > 0 && (
              <section className="border border-gray-100 rounded-xl p-6">
                <h2 className="text-base font-semibold text-ink mb-5">Shipping Method</h2>
                <div className="flex flex-col gap-2.5">
                  {visibleShippingMethods.map((method: any) => (
                    <label key={method.method} className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${shippingMethod === method.method ? 'border-ink bg-gray-50/50' : 'border-gray-100 hover:border-gray-200'}`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          value={method.method}
                          checked={shippingMethod === method.method}
                          onChange={() => setShippingMethod(method.method)}
                          className="w-4 h-4 accent-black"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-ink">{method.method}</span>
                          {method.estimatedDays && <span className="text-[11px] text-gray-400">{method.estimatedDays} business days</span>}
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-ink">
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
            )}

            {/* Payment — Zelle Only */}
            <section className="border border-gray-100 rounded-xl p-6">
              <h2 className="text-base font-semibold text-ink mb-5">Payment Method</h2>
              <div className={`flex items-center gap-3 p-4 rounded-lg border border-ink bg-gray-50/50`}>
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M13.559 24H6.832c-.91 0-1.376-1.1-.74-1.746L17.133 11.26H8.59a1.19 1.19 0 01-1.19-1.19V7.295c0-.657.533-1.19 1.19-1.19h6.869c.91 0 1.376 1.1.74 1.745L5.157 18.844h8.402c.657 0 1.19.533 1.19 1.19v2.776c0 .657-.533 1.19-1.19 1.19z" fill="#6D1ED4"/></svg>
                </div>
                <span className="text-sm font-medium text-ink">Zelle</span>
                <Check size={16} className="ml-auto text-ink" />
              </div>
              <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                After placing your order, you'll receive Zelle payment instructions with a QR code on the confirmation page.
              </p>
            </section>

            {/* Promo Code */}
            <section className="border border-gray-100 rounded-xl p-6">
              <h2 className="text-base font-semibold text-ink mb-4">Promo Code</h2>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-green-600" />
                    <span className="text-sm font-semibold text-green-700">{appliedCoupon.code}</span>
                    <span className="text-xs text-green-600">— {appliedCoupon.description}</span>
                  </div>
                  <button onClick={handleRemoveCoupon} className="text-xs font-semibold text-green-700 hover:underline">Remove</button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter promo code"
                    className={`flex-1 ${inputClass}`}
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={!couponCode.trim() || isVerifyingCoupon}
                    className="h-12 px-6 rounded-lg text-xs font-semibold border-gray-200 hover:border-ink hover:bg-ink hover:text-white transition-colors"
                  >
                    {isVerifyingCoupon ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
                  </Button>
                </form>
              )}
            </section>

          </div>

          {/* ═══════ RIGHT COLUMN — Order Summary ═══════ */}
          <div>
            <div className="border border-gray-100 rounded-xl p-6 lg:sticky lg:top-28">
              <h2 className="text-base font-semibold text-ink mb-6">Order Summary</h2>

              {/* Items */}
              <div className="flex flex-col gap-5 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar mb-6" data-lenis-prevent="true">
                {items.map((item) => (
                  <div key={item.lineId} className="flex gap-4">
                    <div className="relative w-16 h-16 shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                      <Image src={item.product?.imageUrl || '/placeholder.png'} alt={item.product?.name || 'Product'} fill className="object-contain p-1" sizes="64px" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center min-w-0">
                      <span className="text-sm font-medium text-ink truncate">{item.product?.name}</span>
                      {(item.variantTitle || item.variantSku) && !['DEFAULT', 'DEFAULT TITLE'].includes((item.variantTitle || item.variantSku || '').toUpperCase()) && (
                        <span className="text-[11px] text-gray-400 mt-0.5">{item.variantTitle || item.variantSku}</span>
                      )}
                      <span className="text-[11px] text-gray-300 mt-0.5">Qty: {item.quantity}</span>
                    </div>
                    <span className="text-sm font-semibold text-ink self-center shrink-0">
                      ${(item.priceSnapshot * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Maxx Points */}
              {availablePoints > 0 && (
                <div className={`flex items-center justify-between p-4 rounded-lg border mb-5 transition-colors ${isRedeemingPoints ? 'bg-amber-50 border-amber-200' : 'border-gray-100'}`}>
                  <div className="flex items-center gap-2.5">
                    <Sparkles size={14} className={isRedeemingPoints ? 'text-amber-500' : 'text-gray-300'} />
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-ink">Maxx Points</span>
                      <span className="text-[11px] text-gray-400">{Number(availablePoints.toFixed(2))} pts (${availablePoints.toFixed(2)})</span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isRedeemingPoints}
                      onChange={() => setIsRedeemingPoints(!isRedeemingPoints)}
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
              )}

              <div className="h-px bg-gray-100 mb-5" />

              {/* Totals */}
              <div className="flex flex-col gap-3 text-sm mb-5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-ink">${subtotal.toFixed(2)}</span>
                </div>

                <AnimatePresence>
                  {appliedCoupon && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex justify-between text-green-600 overflow-hidden">
                      <span className="py-0.5">Discount ({appliedCoupon.code})</span>
                      <span className="py-0.5 font-medium">-${appliedCoupon.discount.toFixed(2)}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {isRedeemingPoints && pointsToRedeem > 0 && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex justify-between text-green-600 overflow-hidden">
                      <span className="py-0.5 flex items-center gap-1"><Sparkles size={12} /> Points</span>
                      <span className="py-0.5 font-medium">-${pointsToRedeem.toFixed(2)}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium text-ink">{finalShipping === 0 ? 'Free' : `$${finalShipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax</span>
                  <span className="font-medium text-ink">${processingFeeAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="h-px bg-gray-100 mb-5" />

              <div className="flex justify-between items-center mb-6">
                <span className="text-base font-semibold text-ink">Total</span>
                <span className="text-xl font-bold text-ink">${total.toFixed(2)}</span>
              </div>

              {/* Free Shipping Notice */}
              {finalShipping === 0 && (
                <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 border border-green-100 rounded-lg px-4 py-2.5 mb-5">
                  <Check size={14} />
                  <span className="font-medium">Free shipping on this order</span>
                </div>
              )}

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-5 text-[10px] text-gray-300 mb-6">
                <span className="flex items-center gap-1"><Lock size={10} /> Secure Payment</span>
                <span className="flex items-center gap-1"><ShieldCheck size={10} /> SSL Encrypted</span>
              </div>

              {/* Place Order */}
              {total <= 0 ? (
                <Button onClick={handleZeroTotalCheckout} disabled={isProcessing} className="w-full h-12 rounded-lg bg-ink text-white hover:bg-ink/90 text-sm font-semibold">
                  {isProcessing ? <Loader2 className="animate-spin" size={16} /> : 'Complete Free Order'}
                </Button>
              ) : (
                <Button onClick={handleZelleCheckout} disabled={isProcessing} className="w-full h-12 rounded-lg bg-ink text-white hover:bg-ink/90 text-sm font-semibold flex items-center justify-center gap-2">
                  {isProcessing ? <Loader2 className="animate-spin" size={16} /> : (
                    <>Place Order <span className="opacity-60">·</span> ${total.toFixed(2)}</>
                  )}
                </Button>
              )}

              <Link href="/shop" className="flex items-center justify-center gap-2 text-xs font-medium text-gray-400 hover:text-ink transition-colors mt-4">
                <ArrowLeft size={12} />
                Continue Shopping
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
