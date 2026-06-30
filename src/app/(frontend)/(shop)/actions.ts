'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getPayloadUser } from '@/lib/auth/getPayloadUser'
import { revalidatePath } from 'next/cache'
import { attributeOrder } from '@/lib/affiliates/commission'
import { cookies } from 'next/headers'

export async function addToCart(productId: string | number, quantity: number = 1, providedVariantSku?: string, providedPriceSnapshot?: number) {
  try {
    const user = await getPayloadUser()
    if (!user) return { success: false, error: 'Must be logged in to add to cart' }

    const payload = await getPayload({ config: configPromise })

    // Fetch product details to get variantSku and priceSnapshot
    const product = await payload.findByID({ collection: 'products', id: productId as any })
    if (!product) return { success: false, error: 'Product not found' }

    // Normalize the product ID to a number so relationship fields and comparisons work
    const numericProductId = Number(product.id)

    const variantSku = providedVariantSku || product.sku || (product.variants && product.variants[0]?.sku) || `${product.id}`
    const priceSnapshot = providedPriceSnapshot !== undefined ? providedPriceSnapshot : (typeof product.salePrice === 'number' ? product.salePrice : (typeof product.price === 'number' ? product.price : 0))

    // Find existing cart — depth:0 so product comes back as raw ID
    const existingCarts = await payload.find({
      collection: 'carts',
      where: { user: { equals: user.id } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    let cart = existingCarts.docs[0]
    
    if (!cart) {
      cart = await payload.create({
        collection: 'carts',
        data: {
          user: user.id,
          items: [{
            product: numericProductId as any,
            variantSku,
            quantity,
            priceSnapshot,
            addedAt: new Date().toISOString(),
          }],
        },
        overrideAccess: true,
      })
    } else {
      const items = (cart.items || []).map((i: any) => ({
        product: Number(typeof i.product === 'object' ? i.product.id : i.product),
        variantSku: String(i.variantSku ?? ''),
        quantity: Number(i.quantity ?? 1),
        priceSnapshot: Number(i.priceSnapshot ?? 0),
      }))

      const existingItemIndex = items.findIndex((i) =>
        i.product === numericProductId && i.variantSku === variantSku
      )

      if (existingItemIndex > -1) {
        items[existingItemIndex].quantity += quantity
      } else {
        items.push({ product: numericProductId, quantity, variantSku, priceSnapshot })
      }

      cart = await payload.update({
        collection: 'carts',
        id: cart.id,
        data: { items: items as any },
        overrideAccess: true,
      })
    }

    revalidatePath('/products')
    revalidatePath('/cart')
    return { success: true, message: 'Added to cart' }
  } catch (error: any) {
    return { success: false, error: error.message || 'An unexpected error occurred' }
  }
}

export async function addToWishlist(productId: string | number, providedVariantSku?: string, providedPriceSnapshot?: number) {
  try {
    const user = await getPayloadUser()
    if (!user) return { success: false, error: 'Must be logged in to add to wishlist' }

    const payload = await getPayload({ config: configPromise })

    // Fetch product details for SKU and price snapshot
    const product = await payload.findByID({ collection: 'products', id: productId as any })
    if (!product) return { success: false, error: 'Product not found' }

    // Normalize the product ID to a number so comparisons never fail due to type mismatch
    const numericProductId = Number(product.id)

    const variantSku = providedVariantSku || product.sku || (product.variants && product.variants[0]?.sku) || `${product.id}`;
    const priceSnapshot = providedPriceSnapshot !== undefined ? providedPriceSnapshot : (typeof product.salePrice === 'number' ? product.salePrice : (typeof product.price === 'number' ? product.price : 0));

    // Find existing wishlist — use depth:0 so product fields come back as raw IDs, not populated objects
    const existingLists = await payload.find({
      collection: 'wishlists',
      where: { user: { equals: user.id } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    let list = existingLists.docs[0]

    if (!list) {
      // First wishlist for this user — create it
      list = await payload.create({
        collection: 'wishlists',
        data: {
          user: user.id,
          items: [{
            product: numericProductId as any,
            variantSku,
            quantity: 1,
            priceSnapshot,
            addedAt: new Date().toISOString(),
          }],
        },
        overrideAccess: true,
      })
    } else {
      const items: Array<{ product: number; variantSku: string; quantity: number; priceSnapshot: number; addedAt: string }> = (list.items || []).map((i: any) => ({
        product: Number(typeof i.product === 'object' ? i.product.id : i.product),
        variantSku: String(i.variantSku ?? ''),
        quantity: Number(i.quantity ?? 1),
        priceSnapshot: Number(i.priceSnapshot ?? 0),
        addedAt: i.addedAt ? String(i.addedAt) : new Date().toISOString(),
      }))

      // Check for duplicate using normalized numeric IDs
      const alreadyExists = items.some((i) => i.product === numericProductId)
      if (alreadyExists) {
        revalidatePath('/products')
        revalidatePath('/wishlist')
        return { success: false, error: 'Product is already in your wishlist' }
      }

      items.push({
        product: numericProductId,
        variantSku,
        quantity: 1,
        priceSnapshot,
        addedAt: new Date().toISOString(),
      })

      list = await payload.update({
        collection: 'wishlists',
        id: list.id,
        data: { items: items as any },
        overrideAccess: true,
      })
    }

    revalidatePath('/products')
    revalidatePath('/wishlist')
    return { success: true, message: 'Added to wishlist' }
  } catch (error: any) {
    return { success: false, error: error.message || 'An unexpected error occurred' }
  }
}

async function calculateCartTotals(cartItems: any[], payload: any, coupon?: any) {
  let eligibleSubtotal = 0;
  let totalSubtotal = 0;

  for (const item of cartItems) {
    let product = item.product;
    if (typeof product !== 'object' || product === null) {
      product = await payload.findByID({ collection: 'products', id: product as number });
    }
    const itemPrice = typeof item.priceSnapshot === 'number' 
      ? item.priceSnapshot 
      : (typeof product.salePrice === 'number' ? product.salePrice : (typeof product.price === 'number' ? product.price : 0));
    const itemQuantity = item.quantity || 1;
    const itemTotal = itemPrice * itemQuantity;
    totalSubtotal += itemTotal;

    if (coupon) {
      let eligible = true;
      if (coupon.excludeSaleItems && typeof product.salePrice === 'number' && product.salePrice > 0) {
        eligible = false;
      }

      // Check applicableProductTypes
      if (coupon.applicableProductTypes && coupon.applicableProductTypes !== 'all') {
        const isBulkBundle = typeof item.variantSku === 'string' && item.variantSku.includes(' - ');
        if (coupon.applicableProductTypes === 'normal_only' && isBulkBundle) {
          eligible = false;
        } else if (coupon.applicableProductTypes === 'bulk_only' && !isBulkBundle) {
          eligible = false;
        }
      }
      if (eligible && coupon.appliesTo === 'specific_products') {
        const allowedProductIds = (coupon.products || []).map((p: any) => typeof p.product === 'object' ? p.product.id : p.product);
        if (!allowedProductIds.includes(product.id)) eligible = false;
      }
      if (eligible && coupon.appliesTo === 'specific_categories') {
        const allowedCategoryIds = (coupon.categories || []).map((c: any) => typeof c.category === 'object' ? c.category.id : c.category);
        const productCategoryIds = (product.categories || []).map((c: any) => typeof c === 'object' ? c.id : c);
        const hasIntersect = productCategoryIds.some((id: any) => allowedCategoryIds.includes(id));
        if (!hasIntersect) eligible = false;
      }
      if (eligible) eligibleSubtotal += itemTotal;
    }
  }

  let discount = 0;
  let description = '';
  
  if (coupon) {
    if (eligibleSubtotal > 0 || coupon.type === 'free_shipping') {
      if (coupon.type === 'percentage' && coupon.value) {
        discount = Math.floor(eligibleSubtotal * (coupon.value / 100));
        description = `${coupon.value}% off eligible items`;
      } else if (coupon.type === 'fixed_amount' && coupon.value) {
        const discountValueDollars = coupon.value / 100;
        discount = Math.min(discountValueDollars, eligibleSubtotal);
        description = `$${discountValueDollars.toFixed(2)} off eligible items`;
      } else if (coupon.type === 'free_shipping') {
        discount = 0;
        description = 'Free shipping';
      } else if (coupon.type === 'buy_one_get_one') {
        description = 'Buy one get one free';
      } else if (coupon.type === 'store_credit' && coupon.remainingBalance) {
        const remainingDollars = coupon.remainingBalance / 100;
        discount = Math.min(remainingDollars, eligibleSubtotal);
        description = `$${remainingDollars.toFixed(2)} store credit applied`;
      }
    } else {
      description = 'No eligible items for this coupon';
    }
  }

  let freeShipping = false;
  if (coupon && coupon.type === 'free_shipping') {
    freeShipping = true;
  }

  return { discount, description, eligibleSubtotal, totalSubtotal, freeShipping };
}

export async function verifyCoupon(couponCode: string, subtotal: number, clientCartItems?: any[]) {
  try {
    const user = await getPayloadUser()

    if (!couponCode || !couponCode.trim()) return { valid: false, error: 'Please enter a coupon code' }

    const payload = await getPayload({ config: configPromise })
    const coupons = await payload.find({
      collection: 'coupons',
      where: { code: { equals: couponCode.trim().toUpperCase() } },
      limit: 1,
      overrideAccess: true,
    })



    const coupon = coupons.docs[0]
    if (!coupon) return { valid: false, error: 'Coupon code not found' }

    // Check expiration
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return { valid: false, error: 'This coupon has expired' }
    }

    // Check usage limit
    if (coupon.usageLimit && (coupon.usageCount || 0) >= coupon.usageLimit) {
      return { valid: false, error: 'This coupon has reached its usage limit' }
    }

    // Verify actual items
    let cartItems: any[] = []
    if (clientCartItems && clientCartItems.length > 0) {
      cartItems = clientCartItems.map((item: any) => ({
        product: item.productId || item.product?.id || item.product,
        quantity: item.quantity || 1,
        priceSnapshot: item.priceSnapshot,
        variantSku: item.variantSku
      }))
    } else if (user) {
      const carts = await payload.find({
        collection: 'carts',
        where: { user: { equals: user.id } },
        limit: 1,
        overrideAccess: true,
      })
      cartItems = carts.docs[0]?.items || []
    } else {
      // Dummy cart for guest testing
      cartItems = [{ product: 1, quantity: 1 }]
    }

    if (cartItems.length === 0) {
      return { valid: false, error: 'Cart is empty' }
    }

    const { discount, description, eligibleSubtotal, totalSubtotal } = await calculateCartTotals(cartItems, payload, coupon)

    // Check minimum spend (minSpend is in cents, totalSubtotal is in dollars)
    if (coupon.minSpend && (totalSubtotal * 100) < coupon.minSpend) {
      return { valid: false, error: `Minimum spend of $${(coupon.minSpend / 100).toFixed(2)} required` }
    }

    // Check locked emails
    if (coupon.lockedEmails && coupon.lockedEmails.length > 0) {
      if (!user) return { valid: false, error: 'Please sign in to use this coupon — your session may have expired' }
      const allowed = coupon.lockedEmails.some((e: any) => e.email?.toLowerCase() === user.email?.toLowerCase())
      if (!allowed) return { valid: false, error: 'This coupon is not available for your account' }
    }

    if (eligibleSubtotal === 0 && coupon.type !== 'free_shipping') {
      return { valid: false, error: 'This coupon does not apply to any items in your cart' }
    }

    return {
      valid: true,
      code: coupon.code,
      discount,
      description,
      freeShipping: coupon.freeShipping || coupon.type === 'free_shipping',
    }
  } catch (error: any) {
    return { valid: false, error: error.message || 'An unexpected error occurred' }
  }
}

export async function processCheckout(formData: FormData) {
  try {
    const user = await getPayloadUser()
    const payload = await getPayload({ config: configPromise })

    let cartItems: any[] = []
    let cartId: any = null

    if (user) {
      const carts = await payload.find({
        collection: 'carts',
        where: { user: { equals: user.id } },
        limit: 1,
        overrideAccess: true,
      })
      if (carts.docs[0]?.items) {
        cartItems = carts.docs[0].items
        cartId = carts.docs[0].id
      }
    } else {
      const guestCartStr = formData.get('guestCart') as string
      if (guestCartStr) {
        try { cartItems = JSON.parse(guestCartStr) } catch(e) {}
      } else {
        cartItems = [{ product: 1, quantity: 1 }]
      }
    }

    if (cartItems.length === 0) {
      return { success: false, error: 'Cart is empty' }
    }

    const guestEmail = formData.get('guestEmail') as string
    if (!user && !guestEmail) {
      return { success: false, error: 'Email is required for guest checkout' }
    }

    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const phone = formData.get('phone') as string
    const addressLine1 = formData.get('address') as string
    const apartment = formData.get('apartment') as string
    const city = formData.get('city') as string
    const state = formData.get('state') as string
    const postalCode = formData.get('zip') as string
    const country = formData.get('country') as string || 'US'
    const addressIdFromForm = formData.get('addressId') as string
    
    const couponCode = formData.get('couponCode') as string
    const paymentMethod = formData.get('paymentMethod') as string
    const redeemPoints = formData.get('redeemPoints') === 'true'

    // Fetch user maxx points securely
    let userMaxxPoints = 0
    if (user) {
      const payloadUser = await payload.findByID({ collection: 'users', id: user.id as any })
      if (payloadUser && typeof payloadUser.maxxPoints === 'number') {
        userMaxxPoints = payloadUser.maxxPoints
      }
    }

    let finalAddress = {
      line1: addressLine1,
      line2: apartment,
      city,
      state,
      postalCode,
      country
    }
    let finalFirstName = firstName
    let finalLastName = lastName
    let finalPhone = phone

    // Address handling logic
    if (user) {
      if (addressIdFromForm && addressIdFromForm !== 'new') {
        const existingAddress = await payload.findByID({
          collection: 'addresses',
          id: addressIdFromForm as any,
          overrideAccess: true,
        })
        if (existingAddress) {
          finalAddress = {
            line1: existingAddress.line1,
            line2: existingAddress.line2 || '',
            city: existingAddress.city,
            state: existingAddress.state,
            postalCode: existingAddress.postalCode,
            country: existingAddress.country || 'US'
          }
          finalFirstName = existingAddress.firstName
          finalLastName = existingAddress.lastName
          finalPhone = existingAddress.phone
        }
      } else if (addressLine1 && city && state && postalCode) {
        // Create new address
        const hasDefault = !!user.defaultShippingAddress
        const newAddress = await payload.create({
          collection: 'addresses',
          data: { 
            user: user.id, 
            label: 'Saved Address', 
            firstName: firstName || 'Customer', 
            lastName: lastName || 'User', 
            line1: addressLine1, 
            line2: apartment || '',
            city, 
            state, 
            postalCode, 
            country: country || 'US', 
            phone, 
            isDefaultShipping: !hasDefault 
          },
          overrideAccess: true,
        })

        if (!hasDefault) {
          await payload.update({
            collection: 'users',
            id: user.id,
            data: { defaultShippingAddress: newAddress.id as any },
            overrideAccess: true,
          })
        }
      }
    }

    let validCoupon = null
    if (couponCode) {
      const coupons = await payload.find({
        collection: 'coupons',
        where: { code: { equals: couponCode } },
        limit: 1,
      })
      validCoupon = coupons.docs[0]
    }

    const shippingMethodName = formData.get('shippingMethod') as string

    // Calculate totals
    const { discount: discountTotal, totalSubtotal: subtotal, freeShipping: couponFreeShipping } = await calculateCartTotals(cartItems, payload, validCoupon)

    // Validate shipping method against database
    const shippingZonesRes = await payload.find({
      collection: 'shippingzones',
      limit: 10,
      overrideAccess: true,
    })
    
    let baseShippingCost = 500 // fallback
    let validShippingMethodName = shippingMethodName || 'Standard Shipping'

    if (shippingMethodName) {
      for (const zone of shippingZonesRes.docs) {
        const found = zone.methods?.find((m: any) => m.method === shippingMethodName)
        if (found) {
          baseShippingCost = found.price
          validShippingMethodName = found.method
          break
        }
      }
    }

    // Determine final shipping cost
    const isFreeShipping = couponFreeShipping || validCoupon?.type === 'free_shipping' || validCoupon?.freeShipping
    const shippingTotal = isFreeShipping ? 0 : baseShippingCost

    const selectedFeeIds = formData.getAll('processingFees') as string[]
    let feeTotal = 0
    const appliedFees: any[] = []

    if (selectedFeeIds.length > 0) {
      const activeFeesRes = await payload.find({
        collection: 'processing-fees',
        where: {
          id: { in: selectedFeeIds },
          isActive: { equals: true }
        },
        overrideAccess: true,
      })

      for (const fee of activeFeesRes.docs) {
        const amount = fee.type === 'percentage' 
          ? Math.floor((subtotal * (fee.amount as number)) / 100) 
          : (fee.amount as number)
        
        feeTotal += amount
        appliedFees.push({
          feeId: fee.id,
          feeName: fee.name,
          amount
        })
      }
    }

    const taxTotal = 0
    const totalBeforePoints = Math.max(0, subtotal - discountTotal) + shippingTotal + taxTotal + feeTotal

    let pointsToRedeem = 0
    if (redeemPoints && userMaxxPoints > 0) {
      pointsToRedeem = Math.min(userMaxxPoints, totalBeforePoints)
    }

    const total = totalBeforePoints - pointsToRedeem

    // Create Order
    const order = await payload.create({
      collection: 'orders',
      data: {
        owner: user ? user.id : null,
        guestEmail: user ? user.email : guestEmail,
        customerFirstName: finalFirstName,
        customerLastName: finalLastName,
        customerPhone: finalPhone,
        status: 'pending',
        paymentStatus: paymentMethod === 'online' ? 'captured' : 'unpaid',
        fulfillmentStatus: 'unfulfilled',
        subtotal,
        discountTotal,
        redeemedPoints: pointsToRedeem,
        shippingTotal,
        taxTotal,
        feeTotal,
        total,
        appliedFees,
        shippingMethod: validShippingMethodName,
        couponCode: validCoupon ? validCoupon.code : undefined,
        items: cartItems.map((item: any) => ({
          product: typeof item.product === 'object' ? item.product.id : item.product,
          quantity: item.quantity,
          variant: item.variantSku || 'DEFAULT',
          price: typeof item.priceSnapshot === 'number' ? item.priceSnapshot : 0
        })) as any,
        shippingAddress: finalAddress
      },
      overrideAccess: true,
    })

    // Empty cart if logged in
    if (user && cartId) {
      await payload.update({
        collection: 'carts',
        id: cartId,
        data: { items: [] },
        overrideAccess: true,
      })
    }

    // Deduct redeemed points
    if (pointsToRedeem > 0 && user) {
      await payload.update({
        collection: 'users',
        id: user.id,
        data: { maxxPoints: userMaxxPoints - pointsToRedeem },
        overrideAccess: true,
      })
    }

    // Update coupon usage count and remaining balance
    if (validCoupon) {
      const updateData: any = {
        usageCount: (validCoupon.usageCount || 0) + 1,
      }
      
      if (validCoupon.type === 'store_credit' && typeof validCoupon.remainingBalance === 'number') {
        updateData.remainingBalance = Math.max(0, validCoupon.remainingBalance - discountTotal)
      }

      await payload.update({
        collection: 'coupons',
        id: validCoupon.id,
        data: updateData,
        overrideAccess: true,
      })
    }

    // Affiliate Attribution (Async)
    const cookieStore = cookies()
    const refCookie = (await cookieStore).get('affiliate_ref')
    const clickCookie = (await cookieStore).get('affiliate_click_id')
    
    if (refCookie?.value || clickCookie?.value || validCoupon) {
      attributeOrder(
        order as any,
        refCookie?.value || null,
        validCoupon ? validCoupon.code : null,
        clickCookie?.value || null
      ).catch(console.error)
    }

    revalidatePath('/checkout')
    return { success: true, orderId: order.id }
  } catch (error: any) {
    return { success: false, error: error.message || 'An unexpected error occurred' }
  }
}

export async function getShopProducts(params: {
  page?: number
  limit?: number
  categories?: string[]
  inStock?: boolean
  onSale?: boolean
  minPrice?: number
  maxPrice?: number
  sort?: string
}) {
  try {
    const payload = await getPayload({ config: configPromise })

    const where: any = {
      and: [
        { isVisible: { equals: true } },
        { status: { equals: 'active' } }
      ]
    }

    if (params.categories && params.categories.length > 0) {
      const cats = await payload.find({
        collection: 'categories',
        where: { name: { in: params.categories } }, // In FilterSidebar we filter by Category Name
        depth: 0,
        overrideAccess: true,
      })
      const catIds = cats.docs.map(c => c.id)
      if (catIds.length > 0) {
        where.and.push({ categories: { in: catIds } })
      } else {
        // If categories filter provided but none matched, return empty
        return { success: true, products: [], totalPages: 0, page: 1, hasNextPage: false }
      }
    }

    if (params.inStock) {
      where.and.push({ stock: { greater_than: 0 } })
    }

    if (params.onSale) {
      where.and.push({ salePrice: { greater_than: 0 } })
    }

    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      const priceQuery: any = {}
      if (params.minPrice !== undefined) priceQuery.greater_than_equal = params.minPrice
      if (params.maxPrice !== undefined) priceQuery.less_than_equal = params.maxPrice
      where.and.push({ price: priceQuery })
    }

    let sortParam = '-createdAt'
    if (params.sort === 'price-asc') sortParam = 'price'
    if (params.sort === 'price-desc') sortParam = '-price'
    if (params.sort === 'newest') sortParam = '-createdAt'
    if (params.sort === 'name-asc') sortParam = 'name'

    const limit = params.limit || 24
    const page = params.page || 1

    const results = await payload.find({
      collection: 'products',
      where,
      limit,
      page,
      sort: sortParam,
      depth: 1, // Fetches media URLs and category names
      overrideAccess: true,
    })

    const uiProducts = results.docs.map(doc => {
      let imageUrl = '/temp-products/product-image.png'
      let hoverImageUrl: string | undefined = undefined

      if (doc.images && doc.images.length > 0) {
        if (typeof doc.images[0].image === 'object' && doc.images[0].image !== null) {
          imageUrl = (doc.images[0].image as any).url || imageUrl
        }
        if (doc.images.length > 1 && typeof doc.images[1].image === 'object' && doc.images[1].image !== null) {
          hoverImageUrl = (doc.images[1].image as any).url
        }
      }

      let categoryName = 'Research'
      if (doc.categories && doc.categories.length > 0 && typeof doc.categories[0] === 'object') {
        categoryName = (doc.categories[0] as any).name || categoryName
      }


      let displayPrice = typeof doc.price === 'number' ? doc.price : 0
      let displaySalePrice = typeof doc.salePrice === 'number' && doc.salePrice > 0 ? doc.salePrice : undefined
      let isFrom = false

      if (doc.hasVariants && doc.variants && doc.variants.length > 0) {
        const prices = doc.variants.map((v: any) => typeof v.salePrice === 'number' && v.salePrice > 0 ? v.salePrice : v.price).filter(Boolean)
        if (prices.length > 0) {
          const minVariantPrice = Math.min(...prices)
          // If the variants have different prices, we can add "From " prefix
          const maxVariantPrice = Math.max(...prices)
          if (minVariantPrice !== maxVariantPrice) {
            isFrom = true
          }
          displayPrice = minVariantPrice
          
          // Try to find the original price of the cheapest variant to show the discount
          const cheapestVariant = doc.variants.find((v: any) => (v.salePrice || v.price) === minVariantPrice)
          if (cheapestVariant && typeof cheapestVariant.salePrice === 'number' && cheapestVariant.salePrice > 0) {
             displaySalePrice = cheapestVariant.salePrice
             displayPrice = cheapestVariant.price
          } else {
             displaySalePrice = undefined
          }
        }
      }

      const variantLabels = doc.hasVariants && doc.variants && doc.variants.length > 1
        ? doc.variants.map((v: any) => v.options?.map((o: any) => o.value).join(' ')).filter(Boolean)
        : []

      return {
        id: doc.id as number,
        name: doc.name,
        slug: doc.slug || '',
        image: imageUrl,
        hoverImage: hoverImageUrl,
        shortDescription: doc.description || '',
        priceRange: displaySalePrice
          ? `${isFrom ? 'From ' : ''}$${displaySalePrice.toFixed(2)}`
          : `${isFrom ? 'From ' : ''}$${displayPrice.toFixed(2)}`,
        originalPrice: (displaySalePrice && !isFrom)
          ? `$${displayPrice.toFixed(2)}`
          : undefined,
        discountPercentage: (displaySalePrice && displayPrice > 0)
          ? Math.round(((displayPrice - displaySalePrice) / displayPrice) * 100)
          : undefined,
        category: categoryName,
        variantLabels,
      }
    })

    return {
      success: true,
      products: uiProducts,
      totalPages: results.totalPages,
      page: results.page,
      hasNextPage: results.hasNextPage,
    }
  } catch (err: any) {
    return { success: false, error: err.message, products: [], totalPages: 0 }
  }
}

export async function getUserDefaultAddress() {
  try {
    const user = await getPayloadUser()
    if (!user) return null

    const payload = await getPayload({ config: configPromise })
    const addresses = await payload.find({
      collection: 'addresses',
      where: { 
        user: { equals: user.id },
        isDefaultShipping: { equals: true }
      },
      limit: 1,
      overrideAccess: true,
    })

    if (addresses.docs.length > 0) {
      return addresses.docs[0]
    }

    const anyAddress = await payload.find({
      collection: 'addresses',
      where: { user: { equals: user.id } },
      limit: 1,
      overrideAccess: true,
    })

    return anyAddress.docs.length > 0 ? anyAddress.docs[0] : null
  } catch (err) {
    return null
  }
}

export async function getUserMaxxPoints() {
  try {
    const user = await getPayloadUser()
    if (!user) return 0

    const payload = await getPayload({ config: configPromise })
    const payloadUser = await payload.findByID({
      collection: 'users',
      id: user.id as any,
    })

    return typeof payloadUser?.maxxPoints === 'number' ? payloadUser.maxxPoints : 0
  } catch (err) {
    return 0
  }
}

export async function syncGuestOrdersToUser(payload: any, user: any) {
  try {
    const guestOrders = await payload.find({
      collection: 'orders',
      where: {
        and: [
          { guestEmail: { equals: user.email } },
          { owner: { exists: false } }
        ]
      },
      limit: 100,
      overrideAccess: true,
    });

    for (const order of guestOrders.docs) {
      // 1. Save Address if it exists
      if (order.shippingAddress && order.shippingAddress.line1) {
        const existingAddr = await payload.find({
          collection: 'addresses',
          where: {
            and: [
              { user: { equals: user.id } },
              { line1: { equals: order.shippingAddress.line1 } },
              { postalCode: { equals: order.shippingAddress.postalCode } }
            ]
          },
          limit: 1,
          overrideAccess: true,
        });

        if (existingAddr.docs.length === 0) {
          await payload.create({
            collection: 'addresses',
            data: {
              user: user.id,
              label: 'Imported Address',
              firstName: order.customerFirstName || 'Customer',
              lastName: order.customerLastName || 'User',
              line1: order.shippingAddress.line1,
              line2: order.shippingAddress.line2 || '',
              city: order.shippingAddress.city || '',
              state: order.shippingAddress.state || '',
              postalCode: order.shippingAddress.postalCode || '',
              country: order.shippingAddress.country || 'US',
              phone: order.customerPhone || '',
              isDefaultShipping: false,
            },
            overrideAccess: true,
          });
        }
      }

      // 2. Claim Order
      await payload.update({
        collection: 'orders',
        id: order.id,
        data: { owner: user.id },
        overrideAccess: true,
      });
    }
  } catch (e) {
    console.error('Failed to sync guest orders', e);
  }
}

export async function getUserAddresses() {
  try {
    const user = await getPayloadUser()
    if (!user) return []

    const payload = await getPayload({ config: configPromise })
    
    // Auto-claim any unowned guest orders and import their addresses
    await syncGuestOrdersToUser(payload, user)

    const addresses = await payload.find({
      collection: 'addresses',
      where: { user: { equals: user.id } },
      limit: 50,
      overrideAccess: true,
    })

    return addresses.docs || []
  } catch (err) {
    return []
  }
}
