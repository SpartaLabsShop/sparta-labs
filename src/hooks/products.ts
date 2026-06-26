import type { CollectionBeforeChangeHook } from 'payload'
import slugify from 'slugify'

export const productsBeforeChange: CollectionBeforeChangeHook = async ({
  data,
  operation,
  originalDoc,
}) => {
  // Auto-generate slug from name if not provided or empty
  if (!data.slug) {
    const nameStr = typeof data.name === 'string'
      ? data.name
      : (typeof data.name === 'object' && data.name?.en ? data.name.en : '')
    if (nameStr) {
      data.slug = slugify(nameStr, { lower: true, strict: true })
    }
  }

  // Safely check variants to avoid crashing on partial updates
  const hasVariants = data.hasVariants !== undefined ? data.hasVariants : originalDoc?.hasVariants
  const variants = data.variants !== undefined ? data.variants : originalDoc?.variants

  // Validate variants when hasVariants is true
  if (hasVariants) {
    if (!Array.isArray(variants) || variants.length === 0) {
      throw new Error('When hasVariants is true, at least one variant is required')
    }
    // Check for duplicate SKUs within this product
    const skuSet = new Set()
    for (const variant of variants) {
      if (!variant.sku) {
        throw new Error('Each variant must have a SKU')
      }
      if (skuSet.has(variant.sku)) {
        throw new Error(`Duplicate SKU detected: ${variant.sku}`)
      }
      skuSet.add(variant.sku)
    }
  }

  return data
}
