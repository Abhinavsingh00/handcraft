// Cart utility functions for Pawfectly Handmade ecommerce

import { CartItem, Product } from '@/types'

/**
 * Calculate the subtotal of all items in the cart (before discounts)
 */
export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity)
  }, 0)
}

/**
 * Calculate the bulk discount amount based on quantities
 */
export function calculateBulkDiscount(items: CartItem[]): number {
  let discount = 0

  items.forEach(item => {
    if (!item.product.bulkPricing) return

    // Find the applicable tier (highest quantity threshold met)
    const applicableTier = item.product.bulkPricing
      .filter(tier => item.quantity >= tier.minQty)
      .sort((a, b) => b.minQty - a.minQty)[0]

    if (applicableTier) {
      const itemTotal = item.product.price * item.quantity
      discount += itemTotal * (applicableTier.discount / 100)
    }
  })

  return discount
}

/**
 * Calculate the total after bulk discounts
 */
export function calculateTotal(items: CartItem[]): number {
  const subtotal = calculateSubtotal(items)
  const discount = calculateBulkDiscount(items)
  return subtotal - discount
}

/**
 * Get the bulk discount percentage for a specific product and quantity
 */
export function getBulkPricingForProduct(product: Product, quantity: number): number {
  if (!product.bulkPricing) return 0

  const applicableTier = product.bulkPricing
    .filter(tier => quantity >= tier.minQty)
    .sort((a, b) => b.minQty - a.minQty)[0]

  return applicableTier?.discount || 0
}
