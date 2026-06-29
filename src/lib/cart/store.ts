import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { syncCartToPayload } from '@/app/(frontend)/actions/cart'

export type MinimalProduct = {
  id: string
  name: string
  imageUrl: string | null
}

export type CartLine = {
  lineId: string
  productId: string
  variantSku: string | null
  variantTitle?: string | null
  quantity: number
  priceSnapshot: number
  product: MinimalProduct
}

interface CartState {
  items: CartLine[]
  couponCode: string | null
  isOpen: boolean

  setItems: (items: CartLine[]) => void
  addItem: (
    product: MinimalProduct,
    variantSku: string | null,
    quantity: number,
    priceSnapshot: number,
    variantTitle?: string | null
  ) => void
  removeItem: (lineId: string) => void
  updateQuantity: (lineId: string, quantity: number) => void
  clear: () => void
  setCoupon: (code: string | null) => void
  toggleDrawer: () => void
  openCart: () => void
  closeCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      isOpen: false,

      setItems: (items) => set({ items }),

      addItem: (product, variantSku, quantity, priceSnapshot, variantTitle) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => String(item.productId) === String(product.id) && item.variantSku === variantSku,
          )

          if (existingItemIndex > -1) {
            const newItems = [...state.items]
            newItems[existingItemIndex].quantity += quantity
            newItems[existingItemIndex].priceSnapshot = priceSnapshot
            if (variantTitle) newItems[existingItemIndex].variantTitle = variantTitle
            syncCartToPayload(newItems).catch(console.error)
            return { items: newItems, isOpen: true }
          }

          const lineId =
            typeof crypto !== 'undefined' && crypto.randomUUID
              ? crypto.randomUUID()
              : Math.random().toString(36).substring(2, 15)

          const newItems = [
            ...state.items,
            {
              lineId,
              productId: product.id,
              variantSku,
              variantTitle: variantTitle || variantSku,
              quantity,
              priceSnapshot,
              product,
            },
          ]

          syncCartToPayload(newItems).catch(console.error)

          return {
            items: newItems,
            isOpen: true,
          }
        })
      },

      removeItem: (lineId) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.lineId !== lineId)
          syncCartToPayload(newItems).catch(console.error)
          return { items: newItems }
        })
      },

      updateQuantity: (lineId, quantity) => {
        set((state) => {
          const newItems = state.items.map((item) =>
            item.lineId === lineId ? { ...item, quantity: Math.max(1, quantity) } : item,
          )
          syncCartToPayload(newItems).catch(console.error)
          return { items: newItems }
        })
      },

      clear: () => {
        set({ items: [], couponCode: null })
        syncCartToPayload([]).catch(console.error)
      },

      setCoupon: (code) => set({ couponCode: code }),

      toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: 'sparta-cart-storage',
    },
  ),
)

export const useCartSubtotal = () => {
  return useCartStore((state) =>
    state.items.reduce((total, item) => total + item.priceSnapshot * item.quantity, 0),
  )
}

export const useCartItemCount = () => {
  return useCartStore((state) => state.items.reduce((count, item) => count + item.quantity, 0))
}
