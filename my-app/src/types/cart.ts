// Cart type definitions for Pawfectly Handmade ecommerce

import { Product } from './product'

export interface CartItem {
  product: Product
  quantity: number
  selectedBulkTier?: number // Which bulk discount tier applies
}

export interface CartState {
  items: CartItem[]
  subtotal: number
  total: number
  bulkDiscount: number
}
