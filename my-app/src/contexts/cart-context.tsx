// CartContext for Pawfectly Handmade ecommerce cart state management

'use client'

import React, { createContext, useContext } from 'react'
import { CartItem, Product } from '@/types'
import { STORAGE_KEYS } from '@/constants/storage'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { calculateSubtotal, calculateBulkDiscount, calculateTotal } from '@/lib/cart-utils'

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartSubtotal: () => number
  getBulkDiscount: () => number
  getCartTotal: () => number
  isLoaded: boolean
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems, isLoaded] = useLocalStorage<CartItem[]>(STORAGE_KEYS.CART, [])

  const addToCart = (product: Product, quantity = 1) => {
    setItems((currentItems) => {
      const existingIndex = currentItems.findIndex(
        (item) => item.product.id === product.id
      )

      if (existingIndex > -1) {
        // Product exists, update quantity
        const updated = [...currentItems]
        updated[existingIndex].quantity += quantity
        return updated
      }

      // New product, add to cart
      return [...currentItems, { product, quantity }]
    })
  }

  const removeFromCart = (productId: string) => {
    setItems((items) => items.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setItems((items) =>
      items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getCartSubtotal = () => calculateSubtotal(items)
  const getBulkDiscount = () => calculateBulkDiscount(items)
  const getCartTotal = () => calculateTotal(items)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartSubtotal,
        getBulkDiscount,
        getCartTotal,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
