'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Stripe from 'stripe'
import { verifyCoupon, getUserMaxxPoints } from '../actions'
import { cookies } from 'next/headers'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-04-10' as any,
  })
}

export async function getShippingMethods() {
  const payload = await getPayload({ config: configPromise })
  const zones = await payload.find({
    collection: 'shippingzones',
    limit: 1,
    depth: 0,
  })

  if (zones.docs.length > 0 && zones.docs[0].methods) {
    return zones.docs[0].methods
  }
  
  // Fallback if none exist
  return [
    { method: 'Standard Shipping', price: 0, estimatedDays: 5 },
    { method: 'Express Shipping', price: 25, estimatedDays: 2 }
  ]
}

export async function getActiveProcessingFees() {
  const payload = await getPayload({ config: configPromise })
  const fees = await payload.find({
    collection: 'processing-fees',
    depth: 0,
    overrideAccess: true,
    limit: 100,
  })
  return fees.docs.filter((f: any) => f.isActive)
}

export async function createPaymentIntent(
  items: any[], 
  shippingMethodName: string,
  couponCode: string | undefined,
  isRedeemingPoints: boolean
) {
  const payload = await getPayload({ config: configPromise })


  // Validate items, check stock, and calculate subtotal securely on server
  let subtotal = 0;
  let pricesChanged = false;
  const { revalidateCartPrices } = await import('@/app/(frontend)/actions/cart')
  const liveItems = await revalidateCartPrices(items)

  for (let i = 0; i < items.length; i++) {
     const item = items[i]
     const liveItem = liveItems[i]
     
     const itemPrice = Math.round(Number(item.priceSnapshot) * 100)
     const livePrice = Math.round(Number(liveItem.priceSnapshot) * 100)

     if (itemPrice !== livePrice) {
       pricesChanged = true
     }

     const productRes = await payload.findByID({ collection: 'products', id: (!isNaN(Number(item.productId)) ? Number(item.productId) : item.productId) as any, depth: 0 })
     if (!productRes) {
        return { error: `Product not found: ${item.productId}` }
     }
     if ((productRes.stock || 0) < item.quantity) {
        return { error: `Insufficient stock for ${productRes.name || 'item'}. Only ${productRes.stock} left.` }
     }
     subtotal += liveItem.priceSnapshot * item.quantity
  }

  if (pricesChanged) {
    return { 
      error: 'Prices for some items have updated since they were added to your cart. We have refreshed your cart with the latest live prices.', 
      updatedItems: liveItems,
      priceChanged: true
    }
  }

  let discountAmount = 0;
  let freeShipping = false;

  if (couponCode) {
    const couponRes = await verifyCoupon(couponCode, subtotal, items)
    if (couponRes.valid) {
      discountAmount = couponRes.discount || 0
      freeShipping = couponRes.freeShipping || false
    }
  }

  const methods = await getShippingMethods()
  const selectedMethod = methods.find((m: any) => m.method === shippingMethodName) || methods[0]
  
  // Validate minOrderAmount for the selected shipping method
  if ((selectedMethod as any)?.minOrderAmount && (selectedMethod as any).minOrderAmount > 0) {
    if (subtotal < (selectedMethod as any).minOrderAmount) {
       return { error: `Your cart subtotal must be at least $${(selectedMethod as any).minOrderAmount} to use ${selectedMethod.method}.` }
    }
  }

  const shippingCost = selectedMethod?.price || 0

  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount)
  const isExpressShipping = shippingMethodName.toLowerCase().includes('express')
  const finalShipping = (freeShipping && !isExpressShipping) ? 0 : shippingCost
  
  // Calculate dynamic processing fees
  const activeFees = await getActiveProcessingFees()
  let feeTotal = 0
  activeFees.forEach((fee: any) => {
    if (!fee.isOptional) {
      if (fee.type === 'percentage') {
        feeTotal += subtotalAfterDiscount * (fee.amount / 100)
      } else if (fee.type === 'fixed_amount') {
        feeTotal += (fee.amount / 100)
      }
    }
  })

  const tax = 0 // Statically 0 now, handled by ProcessingFees
  const totalBeforePoints = subtotalAfterDiscount + finalShipping + tax + feeTotal

  let pointsToRedeem = 0;
  if (isRedeemingPoints) {
    const availablePoints = await getUserMaxxPoints()
    pointsToRedeem = Math.min(availablePoints, totalBeforePoints)
  }

  const total = totalBeforePoints - pointsToRedeem
  const amountInCents = Math.round(total * 100)

  if (amountInCents < 50) {
      return { error: 'Order total too low for Stripe processing (minimum $0.50)' }
  }

  // Check for affiliate ref cookie
  const cookieStore = await cookies()
  const affiliateRef = cookieStore.get('affiliate_ref')?.value
  const clickCookie = cookieStore.get('affiliate_click_id')?.value

  try {
    const stripe = getStripe()
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        affiliateId: affiliateRef || null,
        clickId: clickCookie || null
      }
    })

    return { clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id, amount: total }
  } catch (error: any) {
    console.error('Checkout error:', error)
    return { error: 'Unable to process payment. Please try again.' }
  }
}

export async function createPayloadOrder(
  items: any[], 
  shippingMethodName: string,
  couponCode: string | undefined,
  isRedeemingPoints: boolean,
  formData: any,
  paymentIntentId: string,
  userId?: string
) {
  const payload = await getPayload({ config: configPromise })

  let subtotal = 0;
  let pricesChanged = false;
  const { revalidateCartPrices } = await import('@/app/(frontend)/actions/cart')
  const liveItems = await revalidateCartPrices(items)

  const productsCache = new Map()

  for (let i = 0; i < items.length; i++) {
     const item = items[i]
     const liveItem = liveItems[i]
     
     if (item.priceSnapshot !== liveItem.priceSnapshot) {
       pricesChanged = true
     }

     const productRes = await payload.findByID({ collection: 'products', id: (!isNaN(Number(item.productId)) ? Number(item.productId) : item.productId) as any, depth: 0 })
     if (!productRes) {
        return { error: `Product not found: ${item.productId}` }
     }
     productsCache.set(item.productId, productRes)
     if ((productRes.stock || 0) < item.quantity) {
        return { error: `Insufficient stock for ${productRes.name || 'item'}. Only ${productRes.stock} left.` }
     }
     subtotal += liveItem.priceSnapshot * item.quantity
  }

  if (pricesChanged) {
    return { 
      error: 'Prices for some items have updated since they were added to your cart. We have refreshed your cart with the latest live prices.', 
      updatedItems: liveItems,
      priceChanged: true
    }
  }

  let discountAmount = 0;
  let freeShipping = false;

  if (couponCode) {
    const couponRes = await verifyCoupon(couponCode, subtotal, items)
    if (couponRes.valid) {
      discountAmount = couponRes.discount || 0
      freeShipping = couponRes.freeShipping || false
    }
  }

  const methods = await getShippingMethods()
  const selectedMethod = methods.find((m: any) => m.method === shippingMethodName) || methods[0]

  // Validate minOrderAmount for the selected shipping method
  if ((selectedMethod as any)?.minOrderAmount && (selectedMethod as any).minOrderAmount > 0) {
    if (subtotal < (selectedMethod as any).minOrderAmount) {
       return { error: `Your cart subtotal must be at least $${(selectedMethod as any).minOrderAmount} to use ${selectedMethod.method}.` }
    }
  }

  const shippingCost = selectedMethod?.price || 0

  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount)
  const isExpressShipping = shippingMethodName.toLowerCase().includes('express')
  const finalShipping = (freeShipping && !isExpressShipping) ? 0 : shippingCost
  
  // Calculate dynamic processing fees
  const activeFees = await getActiveProcessingFees()
  let feeTotal = 0
  const appliedFees: any[] = []
  
  activeFees.forEach((fee: any) => {
    if (!fee.isOptional) {
      const amount = fee.type === 'percentage' 
        ? subtotalAfterDiscount * (fee.amount / 100)
        : (fee.amount / 100)
      
      feeTotal += amount
      appliedFees.push({
        feeId: fee.id,
        feeName: fee.name,
        amount: Math.round(amount * 100) // cents for Payload array
      })
    }
  })

  const tax = 0 // Statically 0 now, handled by ProcessingFees
  const totalBeforePoints = subtotalAfterDiscount + finalShipping + tax + feeTotal

  let pointsToRedeem = 0;
  if (isRedeemingPoints) {
    const availablePoints = await getUserMaxxPoints()
    pointsToRedeem = Math.min(availablePoints, totalBeforePoints)
  }

  const total = totalBeforePoints - pointsToRedeem

  try {
    const payloadUserId = userId ? Number(userId) : null

    // Format order items for Payload
    const orderItems = items.map(item => {
      const parsedId = parseInt(String(item.productId), 10)
      const productData = productsCache.get(item.productId)
      return {
        product: isNaN(parsedId) ? item.productId : parsedId,
        variant: item.variantSku || 'DEFAULT',
        price: item.priceSnapshot,
        quantity: item.quantity,
        productSnapshot: productData || null
      }
    })

    // Create pending Order in Payload
    const order = await payload.create({
      collection: 'orders',
      data: {
        owner: payloadUserId,
        customerFirstName: formData.firstName,
        customerLastName: formData.lastName,
        customerPhone: formData.phone,
        guestEmail: formData.email,
        shippingAddress: {
          line1: formData.address,
          line2: formData.apartment || '',
          city: formData.city,
          state: formData.state,
          postalCode: formData.zip,
          country: 'US', // default
        },
        items: orderItems,
        status: total <= 0 ? 'paid' : 'pending',
        paymentStatus: total <= 0 ? 'captured' : 'unpaid',
        fulfillmentStatus: 'unfulfilled',
        subtotal: subtotal,
        discountTotal: discountAmount,
        redeemedPoints: pointsToRedeem,
        shippingTotal: finalShipping,
        taxTotal: tax,
        feeTotal: Math.round(feeTotal * 100),
        appliedFees,
        total: total,
        shippingMethod: shippingMethodName,
        couponCode: couponCode || '',
      }
    })

    // Create guest account if no logged-in user
    let isNewAccount = false
    if (!payloadUserId && formData.email) {
      const guestEmail = formData.email.toLowerCase()

      try {
        const existingUser = await payload.find({
          collection: 'users',
          where: { email: { equals: guestEmail } },
          limit: 1,
          overrideAccess: true,
        })

        let guestUserId
        if (existingUser.docs.length === 0) {
          const crypto = await import('crypto')
          const guestUser = await payload.create({
            collection: 'users',
            data: {
              email: guestEmail,
              password: crypto.randomBytes(16).toString('hex') + '!A1a',
              firstName: formData.firstName || '',
              lastName: formData.lastName || '',
              role: 'customer',
            },
            overrideAccess: true,
          })
          guestUserId = guestUser.id
          isNewAccount = true
        } else {
          guestUserId = existingUser.docs[0].id
        }

        await payload.update({
          collection: 'orders',
          id: order.id,
          data: { owner: guestUserId },
          overrideAccess: true,
        })
      } catch (guestErr: any) {
        console.error('Guest account error:', guestErr?.message || guestErr)
      }
    }

    // Send order confirmation email to ALL customers (guest and logged-in)
    if (formData.email) {
      const customerEmail = formData.email.toLowerCase()
      const orderNumber = (order as any).orderNumber || order.id
      const isZelle = paymentIntentId === 'zelle_pending'
      const paymentMethod = isZelle ? 'Zelle' : 'Credit Card'

      const newAccountNote = isNewAccount
        ? `We've also created an account for you. Visit ${process.env.NEXT_PUBLIC_SERVER_URL || 'https://spartalabs.shop'}/forgot-password to set your password and track future orders.`
        : undefined

      const { generateOrderInvoiceHtml } = await import('@/lib/emails/generateOrderEmail')
      const invoiceHtml = await generateOrderInvoiceHtml(
        { ...order, paymentMethod },
        payload,
        newAccountNote,
      )

      payload.sendEmail({
        to: customerEmail,
        bcc: process.env.SUPPORT_EMAIL || 'support@spartalabs.shop',
        subject: `Order #${orderNumber} Received — Sparta Labs`,
        html: invoiceHtml,
      }).catch((err: any) => console.error('Order email send error:', err?.message || err))
    }

    // Update Stripe PaymentIntent with the Order ID (unless it's a free order or zelle)
    if (paymentIntentId && paymentIntentId !== 'free_order' && paymentIntentId !== 'zelle_pending') {
       await getStripe().paymentIntents.update(paymentIntentId, {
          metadata: {
             orderId: String(order.id)
          }
       })
    } else if (total <= 0) {
       // Instantly finalize the free order (deduct inventory, use coupons, give points)
       const { finalizeOrder } = await import('@/lib/orders/finalizeOrder')
       await finalizeOrder(order.id, {
          cartId: undefined, // user cart cleared in finalizeOrder, guest cart is in formData guestCart
          affiliateId: (await cookies()).get('affiliate_ref')?.value,
          clickId: (await cookies()).get('affiliate_click_id')?.value,
       })
    }

    // Set a signed cookie to authorize the order confirmation page.
    // Value is HMAC-SHA256 of the orderId so it cannot be forged without PAYLOAD_SECRET.
    const { createHmac } = await import('crypto')
    const cookieStore = await cookies()
    const sig = createHmac('sha256', process.env.PAYLOAD_SECRET || '')
      .update(String(order.id))
      .digest('hex')
    cookieStore.set(`order_auth_${order.id}`, sig, {
      maxAge: 60 * 60, // 1 hour
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    })

    return { orderId: String(order.id) }
  } catch (error: any) {
    console.error('Failed to create Payload order:', error)
    return { error: 'Unable to place order. Please try again.' }
  }
}

export async function syncPaymentStatus(paymentIntentId: string, orderId: string) {
  try {
    const paymentIntent = await getStripe().paymentIntents.retrieve(paymentIntentId)
    
    if (paymentIntent.status === 'succeeded') {
      const { finalizeOrder } = await import('@/lib/orders/finalizeOrder')
      await finalizeOrder(orderId, paymentIntent.metadata)
      return { success: true }
    }
    return { success: false, status: paymentIntent.status }
  } catch (error: any) {
    console.error('Failed to sync payment status:', error)
    return { error: 'Unable to verify payment status. Please contact support.' }
  }
}

export async function notifyAdminFailedPayment(orderId: string, errorMessage: string) {
  try {
    const payload = await getPayload({ config: configPromise })
    
    const order = await payload.findByID({
      collection: 'orders',
      id: isNaN(Number(orderId)) ? orderId : Number(orderId),
      depth: 0,
    })

    if (!order) return { success: false }

    const customerEmail = (typeof order.owner === 'object' && order.owner !== null ? order.owner.email : order.guestEmail) || 'N/A'
    const total = `$${(order.total || 0).toFixed(2)}`

    const html = `
      <h2>Payment Failed Alert</h2>
      <p>A customer attempted to checkout but their payment failed.</p>
      <ul>
        <li><strong>Order ID:</strong> ${orderId}</li>
        <li><strong>Customer Email:</strong> ${customerEmail}</li>
        <li><strong>Total:</strong> ${total}</li>
        <li><strong>Error Message:</strong> ${errorMessage}</li>
      </ul>
      <p>You can check their cart/order details in the Payload Admin panel to see what they were trying to buy.</p>
    `

    await payload.sendEmail({
      to: process.env.SUPPORT_EMAIL || 'support@spartalabs.shop',
      subject: `⚠️ Payment Failed - Order ${orderId}`,
      html: html,
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to send admin failure notification:', error)
    return { success: false }
  }
}

