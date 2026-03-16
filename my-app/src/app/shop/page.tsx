// Shop page for Pawfectly Handmade

'use client'

import { useState, useEffect } from 'react'
import { ProductGrid } from '@/components/product/product-grid'
import { getProducts } from '@/app/actions/products'
import { ProductCategory } from '@/types'
import type { Product } from '@/types'

export default function ShopPage() {
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([])
  const [maxPrice, setMaxPrice] = useState(100)
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const categories: { value: ProductCategory; label: string }[] = [
    { value: 'collars-leashes', label: 'Collars & Leashes' },
    { value: 'treats-chews', label: 'Treats & Chews' },
    { value: 'beds-blankets', label: 'Beds & Blankets' },
    { value: 'toys-accessories', label: 'Toys & Accessories' },
  ]

  // Fetch products from Server Action on mount and when category filter changes
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      // Only use single category filter (or none for all products)
      const categoryFilter = selectedCategories.length === 1 ? selectedCategories[0] : undefined
      const fetched = await getProducts({ category: categoryFilter })
      setProducts(fetched)
      setLoading(false)
    }
    fetchProducts()
  }, [selectedCategories])

  // Client-side filtering for price and sorting (already fetched by category)
  const filteredProducts = products
    .filter(p => p.price <= maxPrice)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'newest':
          return b.metadata.createdAt.getTime() - a.metadata.createdAt.getTime()
        default:
          return 0
      }
    })

  const toggleCategory = (category: ProductCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setMaxPrice(100)
    setSortBy('featured')
  }

  const hasActiveFilters = selectedCategories.length > 0 || maxPrice < 100 || sortBy !== 'featured'

  return (
    <div className="min-h-screen bg-background">
      {/* Shop Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center overflow-hidden mb-8">
        <div className="absolute inset-0">
          <img
            src="/images/home/shop-hero.jpg"
            alt="Shop all products"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-4">
              Shop All Products
            </h1>
            <p className="font-body text-lg text-white/90">
              Handmade with love for your furry friends
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-card rounded-lg p-6 shadow-sm sticky top-20">
              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-display text-lg font-semibold mb-3 text-foreground">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label
                      key={category.value}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.value)}
                        onChange={() => toggleCategory(category.value)}
                        className="w-4 h-4 text-primary rounded focus:ring-primary"
                      />
                      <span className="font-body text-sm text-foreground group-hover:text-primary transition-colors">
                        {category.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-display text-lg font-semibold mb-3 text-foreground">
                  Price Range
                </h3>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>$0</span>
                    <span>${maxPrice}</span>
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h3 className="font-display text-lg font-semibold mb-3 text-foreground">
                  Sort By
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc' | 'newest')}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <p className="font-body text-sm text-muted-foreground mb-6">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-pulse text-muted-foreground">Loading products...</div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} />
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🐕</div>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
                  No products found
                </h2>
                <p className="font-body text-muted-foreground mb-6">
                  Try adjusting your filters to see more results.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
