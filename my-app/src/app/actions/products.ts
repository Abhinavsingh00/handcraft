'use server'

import { createServerClient } from '@/lib/supabase/server'
import { mockProducts } from '@/data/mock-products'
import { Product, BulkPricingTier, ProductCategory } from '@/types'

const DATA_SOURCE = process.env.NEXT_PUBLIC_DATA_SOURCE || 'mock'

/**
 * Maps a database row to the Product interface
 * Ensures backward compatibility with existing components
 */
function mapDbProductToProduct(row: { id: string; slug: string; name: string; description: string; price: number; compare_price?: number; category: string; badge?: string; images: string[]; features: string[]; stock: number; bulk_pricing: BulkPricingTier[]; created_at: string; updated_at: string }): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    comparePrice: row.compare_price ? Number(row.compare_price) : undefined,
    category: row.category as ProductCategory,
    badge: row.badge as 'new' | 'sale' | 'bestseller' | undefined,
    images: (row.images || []) as string[],
    features: (row.features || []) as string[],
    stock: row.stock || 0,
    bulkPricing: (row.bulk_pricing || []) as BulkPricingTier[],
    metadata: {
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    },
  }
}

/**
 * Fetches all products with optional filters
 * Falls back to mock data when NEXT_PUBLIC_DATA_SOURCE=mock
 */
export async function getProducts(filters?: {
  category?: string
  badge?: 'new' | 'sale' | 'bestseller'
  search?: string
}): Promise<Product[]> {
  // Use mock data if configured
  if (DATA_SOURCE === 'mock') {
    let products = [...mockProducts]

    if (filters?.category) {
      products = products.filter(p => p.category === filters.category)
    }
    if (filters?.badge) {
      products = products.filter(p => p.badge === filters.badge)
    }
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      )
    }

    return products
  }

  // Fetch from Supabase
  try {
    const supabase = await createServerClient()

    // Fall back to mock if Supabase client couldn't be created
    if (!supabase) {
      console.warn('Supabase client not available, falling back to mock data')
      let products = [...mockProducts]

      if (filters?.category) {
        products = products.filter(p => p.category === filters.category)
      }
      if (filters?.badge) {
        products = products.filter(p => p.badge === filters.badge)
      }
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase()
        products = products.filter(p =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
        )
      }

      return products
    }

    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (filters?.category) {
      query = query.eq('category', filters.category)
    }
    if (filters?.badge) {
      query = query.eq('badge', filters.badge)
    }
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching products:', error)
      return []
    }

    // Transform DB rows to Product interface
    return (data || []).map(mapDbProductToProduct)
  } catch (error) {
    console.error('Unexpected error fetching products:', error)
    return []
  }
}

/**
 * Fetches a single product by slug
 * Returns null if product not found
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (DATA_SOURCE === 'mock') {
    return mockProducts.find(p => p.slug === slug) || null
  }

  try {
    const supabase = await createServerClient()

    // Fall back to mock if Supabase client couldn't be created
    if (!supabase) {
      console.warn('Supabase client not available, falling back to mock data')
      return mockProducts.find(p => p.slug === slug) || null
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return null
    }

    return data ? mapDbProductToProduct(data) : null
  } catch (error) {
    console.error('Unexpected error fetching product:', error)
    return null
  }
}

/**
 * Fetches featured (bestseller) products
 * Backward compatibility helper for existing code
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  return getProducts({ badge: 'bestseller' })
}

/**
 * Fetches new products
 * Backward compatibility helper for existing code
 */
export async function getNewProducts(): Promise<Product[]> {
  return getProducts({ badge: 'new' })
}

/**
 * Fetches products on sale
 * Backward compatibility helper for existing code
 */
export async function getSaleProducts(): Promise<Product[]> {
  return getProducts({ badge: 'sale' })
}

/**
 * Fetches products by category
 * Backward compatibility helper for existing code
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  return getProducts({ category })
  }

/**
 * Fetches random products
 * Backward compatibility helper for existing code
 */
export async function getRandomProducts(count: number): Promise<Product[]> {
  const products = await getProducts()
  const shuffled = [...products].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}
