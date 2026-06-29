'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Minus, Plus, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCartStore } from '@/lib/cart/store'
import { useRouter } from 'next/navigation'

type OrderStatus = 'Placed' | 'Processing' | 'Shipped' | 'Delivered'
const STATUS_STEPS = ['Order Placed', 'Order Packed', 'In Transit', 'Out for Delivery']

function getMappedStatus(payloadStatus: string): number {
  switch (payloadStatus) {
    case 'pending': return 0
    case 'paid':
    case 'fulfilled':
      return 1
    case 'shipped': return 2
    case 'completed': return 3
    case 'refunded':
    case 'cancelled':
    default:
      return 0
  }
}

export interface OrderDetailProps {
  order: any
}

export function OrderDetailClient({ order }: OrderDetailProps) {
  const router = useRouter()
  const addItem = useCartStore(state => state.addItem)
  const openCart = useCartStore(state => state.openCart)

  const handleReorder = () => {
    if (!order.items) return
    for (const item of order.items) {
      const product = item.product || item.productSnapshot || {}
      if (product.id) {
        const title = product.title || product.name || 'Unknown Product'
        const imageUrl = product.images?.[0]?.image?.url || product.images?.[0]?.url || '/temp-products/product-image.png'
        const price = typeof item.price === 'number' ? item.price : (product.basePrice || product.price || 0)
        addItem(
          { id: product.id, name: title, imageUrl },
          item.variant || null,
          item.quantity || 1,
          price
        )
      }
    }
    openCart()
    router.push('/cart')
  }

  const currentStepIndex = getMappedStatus(order.status)

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).format(new Date(date))
  }

  const formattedDate = formatDate(order.createdAt)
  const subtotal = order.subtotal || 0
  const shipping = order.shippingTotal || 0
  const discount = order.discountTotal || 0
  const total = order.total || 0
  const itemCount = order.items?.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0) || 0

  const statusLabel =
    order.status === 'completed' ? 'Delivered' :
    order.status === 'shipped' ? 'Shipped' :
    order.status === 'cancelled' ? 'Cancelled' :
    order.status === 'refunded' ? 'Refunded' :
    order.status === 'paid' || order.status === 'fulfilled' ? 'Processing' : 'Placed'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col w-full max-w-4xl mx-auto"
    >
      {/* Back Link */}
      <Link href="/account/orders" className="flex items-center gap-2 text-sm text-gray-400 hover:text-ink transition-colors mb-8 w-fit">
        <ArrowLeft size={14} />
        Back to Orders
      </Link>

      {/* Page Title */}
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-ink mb-2">Order Tracking</h1>
        <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
          Order tracking allows you to monitor the progress and location of your purchase from the time it is placed until it is delivered.
        </p>
      </div>

      {/* Order Details Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-base font-semibold text-ink">Order Details</h2>
        <button
          onClick={handleReorder}
          className="text-xs font-semibold text-white bg-[#D31118] hover:bg-red-700 px-5 py-2.5 rounded-lg transition-colors"
        >
          Reorder Items
        </button>
      </div>

      {/* Order Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 border-b border-gray-100 pb-8 mb-10">
        <div>
          <p className="text-[11px] text-gray-400 mb-1">Order Number</p>
          <p className="text-sm font-semibold text-ink">{order.orderNumber}</p>
        </div>
        <div>
          <p className="text-[11px] text-gray-400 mb-1">Order Placed</p>
          <p className="text-sm font-semibold text-ink">{formattedDate}</p>
        </div>
        <div>
          <p className="text-[11px] text-gray-400 mb-1">Order Delivered</p>
          <p className="text-sm font-semibold text-ink">{order.status === 'completed' ? formattedDate : '—'}</p>
        </div>
        <div>
          <p className="text-[11px] text-gray-400 mb-1">No of Items</p>
          <p className="text-sm font-semibold text-ink">{itemCount} Item{itemCount !== 1 ? 's' : ''}</p>
        </div>
        <div>
          <p className="text-[11px] text-gray-400 mb-1">Status</p>
          <p className="text-sm font-semibold text-ink">{statusLabel}</p>
        </div>
      </div>

      {/* Order Tracking Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold text-ink">Order Tracking</h2>
        <p className="text-sm text-gray-400">Order ID: <span className="text-ink font-medium">#{order.orderNumber}</span></p>
      </div>

      {/* Tracking Timeline */}
      <div className="border border-gray-100 rounded-2xl p-6 sm:p-8 mb-10">
        <div className="relative flex justify-between">
          {/* Background line */}
          <div className="absolute top-4 left-[calc(12.5%)] right-[calc(12.5%)] h-[3px] bg-gray-100 rounded-full" />
          {/* Progress line */}
          <div
            className="absolute top-4 left-[calc(12.5%)] h-[3px] bg-[#D31118] rounded-full transition-all duration-1000 ease-out"
            style={{ width: `calc(${(Math.max(currentStepIndex, 0) / (STATUS_STEPS.length - 1)) * 75}%)` }}
          />

          {STATUS_STEPS.map((step, index) => {
            const isCompleted = index <= currentStepIndex
            return (
              <div key={step} className="flex flex-col items-center gap-2 z-10 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                  isCompleted
                    ? 'bg-[#D31118] text-white'
                    : 'bg-white border-2 border-gray-200 text-gray-300'
                }`}>
                  {index + 1}
                </div>
                <span className={`text-[10px] sm:text-[11px] font-medium text-center leading-tight ${
                  isCompleted ? 'text-ink' : 'text-gray-300'
                }`}>
                  {step}
                </span>
                <span className={`text-[9px] sm:text-[10px] ${isCompleted ? 'text-gray-400' : 'text-gray-200'}`}>
                  {isCompleted ? formattedDate : '—'}
                </span>
              </div>
            )
          })}
        </div>

        {order.status === 'cancelled' && (
          <div className="mt-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
            This order has been cancelled.
          </div>
        )}
      </div>

      {/* Items Table */}
      <h2 className="text-base font-semibold text-ink mb-4">Items from the order</h2>
      <div className="border-b border-gray-100 mb-2">
        <div className="hidden sm:grid grid-cols-12 gap-4 py-3 text-[11px] text-gray-400 font-medium">
          <div className="col-span-5">Product</div>
          <div className="col-span-2 text-center">Size</div>
          <div className="col-span-3 text-center">Quantity</div>
          <div className="col-span-2 text-right">Price</div>
        </div>
      </div>

      <div className="flex flex-col divide-y divide-gray-50 mb-10">
        {order.items?.map((item: any) => {
          const product = item.product || item.productSnapshot || {}
          const title = product.title || product.name || 'Unknown Product'
          const price = typeof item.price === 'number' ? item.price : (product.basePrice || product.price || 0)
          const imageUrl = product.images?.[0]?.image?.url || product.images?.[0]?.url || '/temp-products/product-image.png'

          let displayVariant = item.variant || '—'
          if (product?.variants?.length) {
            for (const v of product.variants) {
              const vTitle = v.options?.map((o: any) => o.value).join(' ') || 'Variant'
              if (displayVariant === v.sku) { displayVariant = vTitle; break }
              if (displayVariant.startsWith(`${v.sku} - `)) { displayVariant = displayVariant.replace(`${v.sku} - `, `${vTitle} - `); break }
            }
          }

          return (
            <div key={item.id || Math.random()} className="grid grid-cols-12 gap-4 items-center py-5">
              {/* Product */}
              <div className="col-span-12 sm:col-span-5 flex items-center gap-4">
                <Link href={`/products/${product.slug || ''}`} className="relative w-14 h-14 bg-gray-50 shrink-0 rounded-lg overflow-hidden border border-gray-100">
                  <Image src={imageUrl} alt={title} fill className="object-contain p-1" sizes="56px" />
                </Link>
                <div className="flex flex-col">
                  <Link href={`/products/${product.slug || ''}`}>
                    <span className="text-sm font-semibold text-ink hover:text-[#D31118] transition-colors">
                      {title}
                    </span>
                  </Link>
                  {product.id && (
                    <span className="text-[10px] text-gray-300 mt-0.5">Product ID: {product.id}</span>
                  )}
                </div>
              </div>

              {/* Size/Variant */}
              <div className="hidden sm:flex col-span-2 justify-center">
                <span className="text-sm text-gray-500">{displayVariant}</span>
              </div>

              {/* Quantity */}
              <div className="hidden sm:flex col-span-3 justify-center">
                <div className="flex items-center gap-3 border border-gray-100 rounded-lg px-2 py-1">
                  <button className="w-6 h-6 flex items-center justify-center text-gray-300">
                    <Minus size={12} />
                  </button>
                  <span className="text-sm font-medium text-ink w-6 text-center">
                    {String(item.quantity || 1).padStart(2, '0')}
                  </span>
                  <button className="w-6 h-6 flex items-center justify-center text-gray-300">
                    <Plus size={12} />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="hidden sm:flex col-span-2 justify-end items-center gap-4">
                <span className="text-sm font-semibold text-ink">${(price * (item.quantity || 1)).toFixed(2)}</span>
                <button className="text-gray-300 hover:text-gray-400 transition-colors">
                  <X size={14} />
                </button>
              </div>

              {/* Mobile: variant, qty, price inline */}
              <div className="col-span-12 sm:hidden flex items-center justify-between pl-[72px]">
                <span className="text-xs text-gray-400">{displayVariant}</span>
                <span className="text-xs text-gray-400">Qty: {item.quantity || 1}</span>
                <span className="text-sm font-semibold text-ink">${(price * (item.quantity || 1)).toFixed(2)}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom Summary — Two Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gray-100 pt-6 mb-4">
        {/* Left: Discount & Delivery */}
        <div className="border border-gray-100 rounded-xl p-5 flex flex-col gap-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Discount</span>
            <span className="font-semibold text-ink">${discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Delivery</span>
            <span className="font-semibold text-ink">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
          </div>
        </div>

        {/* Right: Subtotal & Total */}
        <div className="border border-gray-100 rounded-xl p-5 flex flex-col gap-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-semibold text-ink">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total</span>
            <span className="font-bold text-ink text-base">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Status */}
      <div className={`text-[10px] font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-lg text-center border w-fit mx-auto mt-2 ${
        ['captured', 'paid', 'succeeded'].includes(order.paymentStatus) ? 'bg-green-50 text-green-600 border-green-100' :
        order.paymentStatus === 'refunded' ? 'bg-red-50 text-red-600 border-red-100' :
        'bg-amber-50 text-amber-600 border-amber-100'
      }`}>
        {['captured', 'paid', 'succeeded'].includes(order.paymentStatus) ? 'Payment Successful' :
         order.paymentStatus === 'refunded' ? 'Refunded' :
         'Payment Processing'}
      </div>
    </motion.div>
  )
}
