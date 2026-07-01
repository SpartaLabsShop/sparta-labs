import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { OrderConfirmationClient } from './OrderConfirmationClient'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Order Confirmed | Sparta Labs',
}

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (!id || id === 'success') {
    return notFound()
  }

  const { cookies } = await import('next/headers')
  const { createHmac } = await import('crypto')
  const cookieStore = await cookies()
  const expectedSig = createHmac('sha256', process.env.PAYLOAD_SECRET || '')
    .update(id)
    .digest('hex')
  const isCookieAuthorized = cookieStore.get(`order_auth_${id}`)?.value === expectedSig

  const payload = await getPayload({ config: configPromise })
  
  let order;
  try {
     const numericId = parseInt(id, 10)
     order = await payload.findByID({
       collection: 'orders',
       id: isNaN(numericId) ? id : numericId,
       depth: 2
     })
  } catch (e) {
     return notFound()
  }

  if (!order) return notFound()

  // 1. Check Cookie Auth (Guest or Immediate Post-Checkout)
  let isAuthorized = isCookieAuthorized;

  // 2. Check User Auth (Logged in user returning to the page)
  if (!isAuthorized) {
     try {
       const { headers } = await import('next/headers')
       const { user } = await payload.auth({ headers: await headers() })
       if (user && order.owner) {
          const ownerId = typeof order.owner === 'object' ? order.owner.id : order.owner
          if (String(ownerId) === String(user.id)) {
             isAuthorized = true
          }
       }
     } catch (e) {
       console.error('Auth check failed', e)
     }
  }

  if (!isAuthorized) {
    return notFound()
  }

  // Format order items
  const formattedItems = (order.items || []).map((item: any, i: number) => {
     // Use product object since depth > 0 populates relationships
     const productData = typeof item.product === 'object' ? item.product : item.productSnapshot
     
     let displayVariant = item.variant || 'Standard';
     if (productData?.variants?.length) {
        for (const v of productData.variants) {
           const vTitle = v.options?.map((o:any) => o.value).join(' ') || `Variant`;
           
           if (displayVariant === v.sku) {
              displayVariant = vTitle;
              break;
           }
           if (displayVariant.startsWith(`${v.sku} - `)) {
              displayVariant = displayVariant.replace(`${v.sku} - `, `${vTitle} - `);
              break;
           }
        }
     }

     return {
        id: item.id || String(i),
        name: productData?.title || productData?.name || 'Product',
        variant: displayVariant, 
        quantity: item.quantity,
        price: typeof item.price === 'number' ? item.price : (productData?.price || productData?.basePrice || 0),
        image: productData?.images?.[0]?.image?.url || productData?.images?.[0]?.url || '/temp-products/product-image.png'
     }
  })

  // Format OrderData
  const orderData = {
    id: order.orderNumber || String(order.id),
    customerName: `${order.customerFirstName || ''} ${order.customerLastName || ''}`.trim() || 'Customer',
    email: order.guestEmail || '',
    shippingAddress: {
      line1: order.shippingAddress?.line1 || '',
      city: order.shippingAddress?.city || '',
      state: order.shippingAddress?.state || '',
      postalCode: order.shippingAddress?.postalCode || '',
      country: order.shippingAddress?.country || 'US'
    },
    estimatedDelivery: order.shippingMethod === 'express' ? '1-3 Business Days' : '5-7 Business Days',
    items: formattedItems,
    subtotal: order.subtotal || 0,
    shipping: order.shippingTotal || 0,
    processingFee: (order.feeTotal ? order.feeTotal / 100 : order.taxTotal) || 0,
    total: order.total || 0,
    discountTotal: order.discountTotal || 0,
    redeemedPoints: order.redeemedPoints || 0,
    couponCode: order.couponCode || '',
    paymentMethod: order.paymentStatus === 'unpaid' ? 'zelle_pending' : 'Credit Card'
  }

  return (
    <div className="pt-20">
      <OrderConfirmationClient order={orderData} />
    </div>
  )
}
