// Product type definitions for Pawfectly Handmade ecommerce

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  price: number
  comparePrice?: number
  category: ProductCategory
  badge?: 'new' | 'sale' | 'bestseller'
  images: string[]
  features: string[]
  stock: number
  bulkPricing?: BulkPricingTier[]
  metadata: {
    createdAt: Date
    updatedAt: Date
  }
}

export interface BulkPricingTier {
  minQty: number
  discount: number // Percentage off (e.g., 10 for 10% off)
}

export type ProductCategory =
  | 'collars-leashes'
  | 'treats-chews'
  | 'beds-blankets'
  | 'toys-accessories'
