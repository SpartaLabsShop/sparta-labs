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
     
     const itemPrice = Number(item.priceSnapshot)
     const livePrice = Number(liveItem.priceSnapshot)
     
     if (itemPrice !== livePrice && !(Number.isNaN(itemPrice) && Number.isNaN(livePrice))) {
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
    return { error: error.message }
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
    if (!payloadUserId && formData.email) {
      const guestEmail = formData.email.toLowerCase()
      let isNewAccount = false

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

      // Send order email
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
      const orderNumber = (order as any).orderNumber || order.id
      const isZelle = paymentIntentId === 'zelle_pending'

      payload.sendEmail({
        to: guestEmail,
        subject: `Order #${orderNumber} — ${isZelle ? 'Zelle Payment Required' : 'Confirmed'} | Sparta Labs`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="font-size: 20px; font-weight: 700; color: #111; margin: 0;">SPARTA LABS</h1>
            </div>
            <h2 style="font-size: 24px; font-weight: 700; color: #111; margin-bottom: 16px;">
              Order #${orderNumber} Placed
            </h2>
            ${isZelle ? `
              <div style="background: #f3f0ff; border: 1px solid #d4c5f9; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                <p style="font-size: 14px; font-weight: 600; color: #6D1ED4; margin: 0 0 8px 0;">Zelle Payment Required</p>
                <p style="font-size: 13px; color: #555; margin: 0; line-height: 1.5;">
                  Send <strong>$${total.toFixed(2)}</strong> to <strong>kyle@spartalabs.shop</strong> via Zelle.<br/>
                  Include <strong>#${orderNumber}</strong> in the memo.
                </p>
              </div>
            ` : ''}
            <p style="font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 20px;">
              Thank you for your order, ${formData.firstName || 'there'}. ${isZelle ? 'Your order will be confirmed once payment is verified.' : 'Your order is confirmed and being processed.'}
            </p>
            ${isNewAccount ? `
              <p style="font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 20px;">
                We've created an account for you. Set your password to track your order:
              </p>
              <a href="${serverUrl}/forgot-password" style="display: inline-block; background: #111; color: #fff; padding: 14px 32px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; text-decoration: none;">
                Set Your Password
              </a>
            ` : `
              <a href="${serverUrl}/account" style="display: inline-block; background: #111; color: #fff; padding: 14px 32px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; text-decoration: none;">
                View Your Order
              </a>
            `}
            <p style="font-size: 12px; color: #999; margin-top: 32px; line-height: 1.6;">
              If you didn't place this order, you can safely ignore this email.
            </p>
          </div>
        `,
      }).catch((err: any) => console.error('Guest email send error:', err?.message || err))
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

    // Set a cookie to authorize the order confirmation page
    const cookieStore = await cookies()
    cookieStore.set(`order_auth_${order.id}`, 'true', { 
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })

    return { orderId: String(order.id) }
  } catch (error: any) {
    console.error('Failed to create Payload order:', error)
    return { error: error.message }
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
    return { error: error.message }
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
      to: 'support@spartalabs.shop',
      subject: `⚠️ Payment Failed - Order ${orderId}`,
      html: html,
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to send admin failure notification:', error)
    return { success: false }
  }
}

