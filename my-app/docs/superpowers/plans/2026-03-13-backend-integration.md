# Backend Integration - Products from Supabase

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace hardcoded mock product data with Supabase as the single source of truth for products, while maintaining backward compatibility with localStorage cart.

**Architecture:** Use React Server Actions to fetch products from Supabase, with an environment-based toggle to fall back to mock data for development. Create a data mapper to convert database rows to the existing `Product` interface, ensuring cart and other components continue working without changes.

**Tech Stack:** Next.js 16 (Server Actions), Supabase (PostgreSQL), TypeScript, existing Tailwind CSS v4 + shadcn/ui

---

## Chunk 1: Dependencies and Environment Setup

### Task 1: Install Supabase Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Supabase packages**

```bash
npm install @supabase/supabase-js @supabase/ssr
```

Expected output: Packages added to `dependencies` in package.json

- [ ] **Step 2: Install tsx for seed script**

```bash
npm install -D tsx dotenv
```

Expected output: `tsx` and `dotenv` added to `devDependencies`

- [ ] **Step 3: Verify installation**

Run: `npm list @supabase/supabase-js @supabase/ssr tsx dotenv`

Expected output: Shows installed versions

- [ ] **Step 4: Commit dependencies**

```bash
git add package.json package-lock.json
git commit -m "deps: install @supabase/supabase-js @supabase/ssr tsx dotenv"
```

---

### Task 2: Create Environment Configuration

**Files:**
- Create: `.env.example`
- Modify: `.env.local`

- [ ] **Step 1: Create .env.example with Supabase variables**

Create file `my-app/.env.example`:

```bash
# Data Source Configuration
# Options: 'mock' (local data) or 'supabase' (database)
NEXT_PUBLIC_DATA_SOURCE=mock

# Supabase Configuration (required when DATA_SOURCE=supabase)
# Get these from your Supabase project settings: https://supabase.com/dashboard/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

- [ ] **Step 2: Update .env.local with default (mock) mode**

Append to `my-app/.env.local` (create if doesn't exist):

```bash
# Start with mock mode for development
NEXT_PUBLIC_DATA_SOURCE=mock
```

- [ ] **Step 3: Verify .gitignore has .env.local**

Run: `grep .env.local .gitignore`

Expected output: `.env.local` is in gitignore

- [ ] **Step 4: Commit environment template**

```bash
git add .env.example
git commit -m "feat: add environment configuration template for Supabase"
```

---

## Chunk 2: Supabase Client Setup

### Task 3: Create Supabase Library Structure

**Files:**
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/client.ts`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p src/lib/supabase
```

- [ ] **Step 2: Create server client**

Create file `my-app/src/lib/supabase/server.ts`:

```typescript
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Creates a Supabase client for use in Server Components and Server Actions
 * Uses cookies for authentication (not used in Phase 2.1 but ready for future auth)
 * Note: Returns null if env vars are missing (Server Actions will fall back to mock)
 */
export async function createServerClient() {
  const cookieStore = await cookies()

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    // Return null instead of throwing - Server Actions will fall back to mock data
    console.warn('Supabase credentials not found, falling back to mock data. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to use Supabase.')
    return null
  }

  return createSupabaseServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  })
}
```

- [ ] **Step 3: Create browser client**

Create file `my-app/src/lib/supabase/client.ts`:

```typescript
'use client'

import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase client for use in Client Components
 * Not used in Phase 2.1 but included for future authentication features
 * Note: Returns null if env vars are missing
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.warn('Supabase credentials not found. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to use Supabase.')
    return null
  }

  return createBrowserClient(url, key)
}
```

- [ ] **Step 4: Test TypeScript compilation**

Run: `npx tsc --noEmit`

Expected output: No errors

- [ ] **Step 5: Commit Supabase client setup**

```bash
git add src/lib/supabase/
git commit -m "feat: add Supabase server and browser clients"
```

---

## Chunk 3: Server Actions for Product Fetching

### Task 4: Create Server Actions File

**Files:**
- Create: `src/app/actions/products.ts`

- [ ] **Step 1: Create actions directory**

```bash
mkdir -p src/app/actions
```

- [ ] **Step 2: Create Server Actions with environment toggle**

Create file `my-app/src/app/actions/products.ts`:

```typescript
'use server'

import { createServerClient } from '@/lib/supabase/server'
import { mockProducts } from '@/data/mock-products'
import { Product, BulkPricingTier } from '@/types'

const DATA_SOURCE = process.env.NEXT_PUBLIC_DATA_SOURCE || 'mock'

/**
 * Maps a database row to the Product interface
 * Ensures backward compatibility with existing components
 */
function mapDbProductToProduct(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    comparePrice: row.compare_price ? Number(row.compare_price) : undefined,
    category: row.category,
    badge: row.badge || undefined,
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
```

- [ ] **Step 3: Test TypeScript compilation**

Run: `npx tsc --noEmit`

Expected output: No errors

- [ ] **Step 4: Commit Server Actions**

```bash
git add src/app/actions/
git commit -m "feat: add Server Actions for product fetching with environment toggle"
```

---

## Chunk 4: Update Pages to Use Server Actions

### Task 5: Update Shop Page

**Files:**
- Modify: `src/app/shop/page.tsx`

- [ ] **Step 1: Update imports in shop page**

Replace lines 1-8 in `my-app/src/app/shop/page.tsx`:

```typescript
// Shop page for Pawfectly Handmade

'use client'

import { useState, useEffect } from 'react'
import { ProductGrid } from '@/components/product/product-grid'
import { getProducts } from '@/app/actions/products'
import { ProductCategory } from '@/types'
import type { Product } from '@/types'
```

Note: Added `useEffect` for data fetching, `getProducts` from actions, and `Product` type

- [ ] **Step 2: Add state for products and loading**

Add after line 13 (after the `sortBy` state declaration):

```typescript
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
```

- [ ] **Step 3: Add useEffect to fetch products on mount and filter changes**

Add after the `categories` array (after line 20):

```typescript
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
```

- [ ] **Step 4: Replace filteredProducts useMemo with client-side filtering**

Replace the `filteredProducts` useMemo (lines 22-47) with:

```typescript
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
```

- [ ] **Step 6: Add loading state to product grid section**

Replace lines 154-176 (the Product Grid section) with:

```typescript
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
```

- [ ] **Step 3: Test TypeScript compilation**

Run: `npx tsc --noEmit`

Expected output: No errors

- [ ] **Step 4: Commit shop page update**

```bash
git add src/app/shop/page.tsx
git commit -m "feat: integrate shop page with Server Actions for product fetching"
```

---

### Task 6: Update Product Detail Page

**Files:**
- Modify: `src/app/product/[slug]/page.tsx`

- [ ] **Step 1: Update imports in product detail page**

Replace lines 1-11 in `my-app/src/app/product/[slug]/page.tsx`:

```typescript
// Product detail page for Pawfectly Handmade

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getProductBySlug, getProductsByCategory } from '@/app/actions/products'
import { BulkPricingTable } from '@/components/product/bulk-pricing-table'
import { ProductGrid } from '@/components/product/product-grid'
import { AddToCartButton } from '@/components/cart/add-to-cart-button'
import { Star, Heart } from 'lucide-react'

interface ProductPageProps {
  params: { slug: string }
}
```

Note: Only change is importing from `@/app/actions/products` instead of `@/data/mock-products`

- [ ] **Step 2: Convert generateMetadata to async**

Replace lines 16-34 (the `generateMetadata` function) with:

```typescript
export async function generateMetadata({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  return {
    title: `${product.name} | Pawfectly Handmade`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images,
    },
  }
}
```

Note: Added `await` before `getProductBySlug` call

- [ ] **Step 3: Convert page component to async**

Replace lines 36-43 (the page component function declaration and product fetch) with:

```typescript
export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = (await getProductsByCategory(product.category))
    .filter(p => p.id !== product.id)
    .slice(0, 4)
```

Note: Added `await` before both Server Action calls

- [ ] **Step 4: Keep the rest of the component unchanged**

Lines 44-191 (the return statement with all JSX) remain exactly the same. No modifications needed.

- [ ] **Step 5: Test TypeScript compilation**

Run: `npx tsc --noEmit`

Expected output: No errors

- [ ] **Step 6: Commit product page update**

```bash
git add src/app/product/\[slug\]/page.tsx
git commit -m "feat: convert product detail page to async Server Component"
```

---

### Task 7: Update Home Page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Remove 'use client' directive**

Delete line 3 (`'use client'`) in `my-app/src/app/page.tsx`

- [ ] **Step 2: Update imports to use Server Actions**

Replace lines 9 with:

```typescript
import { getFeaturedProducts, getNewProducts } from '@/app/actions/products'
```

Note: Only change is importing from `@/app/actions/products` instead of `@/data/mock-products`

- [ ] **Step 3: Convert HomePage to async function**

Replace line 13 with:

```typescript
export default async function HomePage() {
```

Note: Add `async` keyword

- [ ] **Step 4: Make data fetches async**

Replace lines 14-15 with:

```typescript
  const featuredProducts = await getFeaturedProducts()
  const newProducts = await getNewProducts()
```

Note: Add `await` before both function calls

- [ ] **Step 6: Keep the rest of the component unchanged**

Lines 16-174 (categories array, testimonials array, and entire return statement) remain exactly the same. No modifications needed.

- [ ] **Step 3: Test TypeScript compilation**

Run: `npx tsc --noEmit`

Expected output: No errors

- [ ] **Step 4: Commit home page update**

```bash
git add src/app/page.tsx
git commit -m "feat: convert home page to async Server Component"
```

---

## Chunk 5: Database Schema and Seed Script

### Task 8: Create Supabase Migration Files

**Files:**
- Create: `supabase/migrations/20260313_init_products.sql`
- Create: `supabase/seed.sql`

- [ ] **Step 1: Create migrations directory**

```bash
mkdir -p supabase/migrations
```

- [ ] **Step 2: Create schema migration**

Create file `my-app/supabase/migrations/20260313_init_products.sql`:

```sql
-- =====================================================
-- Products Table Schema for Pawfectly Handmade
-- =====================================================

-- Products table with all product information
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  compare_price DECIMAL(10, 2),
  category TEXT NOT NULL CHECK (category IN ('collars-leashes', 'treats-chews', 'beds-blankets', 'toys-accessories')),
  badge TEXT CHECK (badge IN ('new', 'sale', 'bestseller')),
  images JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  stock INTEGER DEFAULT 0,
  bulk_pricing JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_badge ON products(badge) WHERE badge IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view products)
CREATE POLICY "Products are publicly readable" ON products
  FOR SELECT USING (true);

-- No write policies from frontend (admin only in future phase)

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment to table
COMMENT ON TABLE products IS 'Product catalog for Pawfectly Handmade e-commerce site';
```

- [ ] **Step 3: Create seed data file**

Create file `my-app/supabase/seed.sql`:

```sql
-- =====================================================
-- Seed Data for Pawfectly Handmade Products
-- =====================================================

-- Clear existing data (optional, for re-seeding)
-- TRUNCATE products RESTART IDENTITY CASCADE;

-- Insert products from each category
INSERT INTO products (slug, name, description, price, category, badge, images, features, stock, bulk_pricing) VALUES
-- Collars & Leashes
('handmade-leather-collar', 'Handmade Leather Collar', 'Premium leather collar with brass hardware, hand-stitched for durability. Each collar is crafted with care using high-quality vegetable-tanned leather that ages beautifully over time.', 29.99, 'collars-leashes', 'bestseller', '["/products/collars/leather-collar-1.jpg", "/products/collars/leather-collar-2.jpg"]'::jsonb, '["Genuine vegetable-tanned leather", "Solid brass buckle", "Hand-stitched construction", "Available in 5 sizes"]'::jsonb, 50, '[{"minQty": 2, "discount": 10}, {"minQty": 5, "discount": 20}]'::jsonb),

('braided-paracord-collar', 'Braided Paracord Collar', 'Strong and stylish paracord collar with quick-release buckle. Made from military-grade 550 paracord, this collar is both functional and fashionable.', 19.99, 'collars-leashes', 'new', '["/products/collars/paracord-collar-1.jpg"]'::jsonb, '["Military-grade 550 paracord", "Quick-release buckle", "Available in 12 colors", "Breakaway safety option"]'::jsonb, 75, '[{"minQty": 3, "discount": 15}]'::jsonb),

('vintage-rose-leash', 'Vintage Rose Leather Leash', 'Elegant 6-foot leather leash with comfortable handle. Perfect for leisurely walks with your furry friend.', 34.99, 'collars-leashes', NULL, '["/products/collars/leash-1.jpg"]'::jsonb, '["6-foot length", "Padded handle", "Solid brass swivel clip", "Matching collar available"]'::jsonb, 30, '[{"minQty": 2, "discount": 10}]'::jsonb),

('personalized-tag-collar', 'Personalized ID Collar', 'Custom engraved collar with your pup''s name and your phone number. Safety first!', 24.99, 'collars-leashes', 'new', '["/products/collars/id-collar-1.jpg"]'::jsonb, '["Custom engraved brass tag", "Comfort rolled leather", "Free engraving included", "Available in 8 colors"]'::jsonb, 45, '[]'::jsonb),

('hiking-adventure-collar', 'Hiking Adventure Collar', 'Rugged collar designed for outdoor adventures. Features a built-in bottle opener and reflective threading for safety.', 39.99, 'collars-leashes', NULL, '["/products/collars/hiking-collar-1.jpg"]'::jsonb, '["Integrated bottle opener", "Reflective threading", "Water-resistant coating", "D-ring for leash attachment"]'::jsonb, 25, '[{"minQty": 2, "discount": 15}]'::jsonb),

-- Treats & Chews
('peanut-butter-biscuits', 'Peanut Butter Biscuits', 'Homemade-style peanut butter dog biscuits made with all-natural ingredients. No preservatives, just love!', 12.99, 'treats-chews', 'bestseller', '["/products/treats/peanut-biscuits-1.jpg"]'::jsonb, '["All-natural ingredients", "No preservatives", "Made in small batches", "Vet approved"]'::jsonb, 100, '[{"minQty": 3, "discount": 10}, {"minQty": 6, "discount": 20}]'::jsonb),

('sweet-potato-chews', 'Sweet Potato Chews', 'Healthy sweet potato chews that are naturally sweet and packed with vitamins. A great alternative to rawhide!', 14.99, 'treats-chews', NULL, '["/products/treats/sweet-potato-1.jpg"]'::jsonb, '["100% sweet potato", "No additives", "Easy to digest", "Long-lasting chew"]'::jsonb, 80, '[{"minQty": 4, "discount": 15}]'::jsonb),

('birthday-cake-bites', 'Birthday Cake Bites', 'Celebrate your pup''s special day with these carob-frosted birthday cake bites. Perfect for parties!', 16.99, 'treats-chews', 'new', '["/products/treats/birthday-bites-1.jpg"]'::jsonb, '["Carob frosting (dog-safe)", "Sprinkle decorations", "Comes in gift box", "Party hat included"]'::jsonb, 40, '[]'::jsonb),

('training-reward-sticks', 'Training Reward Sticks', 'Soft, chewy training sticks that break easily into small pieces. Perfect for training sessions!', 11.99, 'treats-chews', NULL, '["/products/treats/training-sticks-1.jpg"]'::jsonb, '["Soft texture", "Easy to break", "High-value reward", "Low calorie"]'::jsonb, 90, '[{"minQty": 5, "discount": 20}]'::jsonb),

('beef-jerky-chews', 'Premium Beef Jerky Chews', 'Single-ingredient beef jerky made from free-range beef. No fillers, just pure meaty goodness!', 22.99, 'treats-chews', 'bestseller', '["/products/treats/beef-jerky-1.jpg"]'::jsonb, '["100% beef", "No additives", "Grain-free", "Long-lasting"]'::jsonb, 60, '[{"minQty": 3, "discount": 12}, {"minQty": 6, "discount": 25}]'::jsonb),

-- Beds & Blankets
('cozy-cave-bed', 'Cozy Cave Bed', 'Luxurious cave-style bed that provides a sense of security. The ultimate sleeping spot for anxious dogs.', 59.99, 'beds-blankets', 'bestseller', '["/products/beds/cave-bed-1.jpg"]'::jsonb, '["Soft faux fur lining", "Machine washable", "Available in 3 sizes", "Calming design"]'::jsonb, 35, '[{"minQty": 2, "discount": 10}]'::jsonb),

('orthopedic-memory-foam', 'Orthopedic Memory Foam Bed', 'Supportive memory foam bed for older dogs or those with joint issues. Your pup will wake up refreshed!', 79.99, 'beds-blankets', 'sale', '["/products/beds/memory-foam-1.jpg"]'::jsonb, '["4-inch memory foam", "Waterproof liner", "Removable cover", "Non-slip bottom"]'::jsonb, 25, '[]'::jsonb),

('knitted-dog-blanket', 'Hand-Knitted Dog Blanket', 'Beautiful hand-knitted blanket perfect for couch cuddles. Made with love and premium yarn.', 34.99, 'beds-blankets', NULL, '["/products/beds/knitted-blanket-1.jpg"]'::jsonb, '["Hand-knitted", "Machine washable", "Available in 6 colors", "Personalization available"]'::jsonb, 20, '[]'::jsonb),

('travel-dog-bed', 'Portable Travel Bed', 'Compact and lightweight travel bed that rolls up easily. Perfect for camping, road trips, or visits to grandma!', 29.99, 'beds-blankets', 'new', '["/products/beds/travel-bed-1.jpg"]'::jsonb, '["Rolls up for storage", "Water-resistant bottom", "Built-in pillow", "Carrying strap included"]'::jsonb, 45, '[{"minQty": 2, "discount": 15}]'::jsonb),

('elevated-dog-bed', 'Elevated Cooling Dog Bed', 'Raised cot-style bed that keeps your pup cool off the ground. Perfect for hot summer days!', 44.99, 'beds-blankets', NULL, '["/products/beds/elevated-bed-1.jpg"]'::jsonb, '["Breathable mesh fabric", "Powder-coated steel frame", "Easy assembly", "Indoor/outdoor use"]'::jsonb, 40, '[]'::jsonb),

-- Toys & Accessories
('rope-tug-toy', 'Handmade Rope Tug Toy', 'Sturdy cotton rope toy perfect for interactive tug-of-war games. Great for dental health too!', 14.99, 'toys-accessories', 'bestseller', '["/products/toys/rope-toy-1.jpg"]'::jsonb, '["Natural cotton rope", "Hand-tied knots", "Machine washable", "Available in 3 sizes"]'::jsonb, 85, '[{"minQty": 3, "discount": 20}]'::jsonb),

('squeaky-plush-toy', 'Squeaky Plush Toy', 'Adorable plush toy with hidden squeakers. Multiple textures for added entertainment!', 12.99, 'toys-accessories', 'new', '["/products/toys/plush-toy-1.jpg"]'::jsonb, '["Multiple squeakers", "Crinkle paper inside", "Reinforced seams", "No stuffing mess"]'::jsonb, 70, '[{"minQty": 4, "discount": 15}]'::jsonb),

('puzzle-feeder-toy', 'Puzzle Feeder Toy', 'Mental stimulation puzzle toy that dispenses treats. Keeps your pup smart and entertained!', 18.99, 'toys-accessories', NULL, '["/products/toys/puzzle-toy-1.jpg"]'::jsonb, '["Adjustable difficulty", "Dishwasher safe", "Non-slip base", "Works with any treat"]'::jsonb, 50, '[]'::jsonb),

('bandana-accessory', 'Handmade Bandana', 'Stylish bandana that slips onto your dog''s collar. Because every pup deserves to look dapper!', 8.99, 'toys-accessories', NULL, '["/products/toys/bandana-1.jpg"]'::jsonb, '["Slip-on design", "Reversible", "Available in 20+ patterns", "Machine washable"]'::jsonb, 150, '[{"minQty": 5, "discount": 25}]'::jsonb),

('bow-tie-collar-accessory', 'Handmade Bow Tie', 'Dapper bow tie that attaches to any collar. Perfect for special occasions or everyday style!', 9.99, 'toys-accessories', 'new', '["/products/toys/bowtie-1.jpg"]'::jsonb, '["Elastic strap fits any collar", "Hand-sewn", "Available in 15 patterns", "Gift packaging available"]'::jsonb, 120, '[{"minQty": 4, "discount": 20}]'::jsonb),

('car-seat-cover', 'Quilted Car Seat Cover', 'Beautiful quilted seat cover protects your car from fur and dirt. Waterproof backing ensures complete protection.', 49.99, 'toys-accessories', NULL, '["/products/toys/seat-cover-1.jpg"]'::jsonb, '["Waterproof backing", "Quilted cotton top", "Non-slip bottom", "Machine washable"]'::jsonb, 30, '[{"minQty": 2, "discount": 10}]'::jsonb),

('feeding-station', 'Elevated Feeding Station', 'Handmade elevated feeding station that promotes healthy digestion. Includes two ceramic bowls.', 54.99, 'toys-accessories', 'new', '["/products/toys/feeding-station-1.jpg"]'::jsonb, '["Handcrafted wood", "Two ceramic bowls", "Available in 3 heights", "Food-safe finish"]'::jsonb, 25, '[]'::jsonb)

ON CONFLICT (slug) DO NOTHING;

-- Update compare_price for sale items
UPDATE products SET compare_price = 99.99 WHERE slug = 'orthopedic-memory-foam';
```

- [ ] **Step 4: Add package.json scripts for seeding**

Add to the `scripts` section in `my-app/package.json`:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "seed:products": "tsx src/scripts/seed-products.ts",
  "seed:products:dry": "tsx src/scripts/seed-products.ts --dry-run",
  "seed:products:force": "tsx src/scripts/seed-products.ts --force"
}
```

- [ ] **Step 5: Commit migration files**

```bash
git add supabase/ package.json
git commit -m "feat: add Supabase migration and seed data for products"
```

---

### Task 9: Create Seed Script

**Files:**
- Create: `src/scripts/seed-products.ts`

- [ ] **Step 1: Create scripts directory**

```bash
mkdir -p src/scripts
```

- [ ] **Step 2: Create seed script**

Create file `my-app/src/scripts/seed-products.ts`:

```typescript
#!/usr/bin/env tsx
/**
 * Seed script to sync mock products to Supabase
 * Usage:
 *   npm run seed:products        # Insert new products, skip existing
 *   npm run seed:products:dry    # Preview changes without applying
 *   npm run seed:products:force  # Overwrite existing products
 */

import { createClient } from '@supabase/supabase-js'
import { mockProducts } from '../data/mock-products'
import type { Product } from '../types/product'
import dotenv from 'dotenv'
import { existsSync } from 'fs'
import { join } from 'path'

// Load environment variables from .env.local
const envPath = join(process.cwd(), '.env.local')
if (existsSync(envPath)) {
  dotenv.config({ path: envPath })
} else {
  dotenv.config()
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  console.error('   Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// CLI flags
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const force = args.includes('--force')

console.log('\n🌱 Seeding products to Supabase...')
console.log(`   Dry run: ${dryRun ? 'YES ✅' : 'NO ❌'}`)
console.log(`   Force mode: ${force ? 'YES ✅' : 'NO ❌'}`)
console.log(`   Products to sync: ${mockProducts.length}\n`)

async function seedProducts() {
  let inserted = 0
  let updated = 0
  let skipped = 0
  let errors = 0

  for (const product of mockProducts) {
    try {
      // Check if product exists
      const { data: existing, error: checkError } = await supabase
        .from('products')
        .select('id, slug')
        .eq('slug', product.slug)
        .maybeSingle()

      if (checkError) {
        throw checkError
      }

      const productData = {
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price,
        compare_price: product.comparePrice || null,
        category: product.category,
        badge: product.badge || null,
        images: product.images || [],
        features: product.features || [],
        stock: product.stock,
        bulk_pricing: product.bulkPricing || [],
      }

      if (existing && !force) {
        console.log(`⏭️  Skipping: ${product.name}`)
        skipped++
      } else if (existing && force) {
        // Update existing
        if (!dryRun) {
          const { error: updateError } = await supabase
            .from('products')
            .update(productData)
            .eq('slug', product.slug)

          if (updateError) throw updateError
        }
        console.log(`✏️  Updated: ${product.name}`)
        updated++
      } else {
        // Insert new
        if (!dryRun) {
          const { error: insertError } = await supabase
            .from('products')
            .insert(productData)

          if (insertError) throw insertError
        }
        console.log(`✅ Inserted: ${product.name}`)
        inserted++
      }
    } catch (error: any) {
      console.error(`❌ Error with ${product.name}:`, error.message)
      errors++
    }
  }

  console.log('\n📊 Summary:')
  console.log(`   ✅ Inserted: ${inserted}`)
  console.log(`   ✏️  Updated: ${updated}`)
  console.log(`   ⏭️  Skipped: ${skipped}`)
  console.log(`   ❌ Errors: ${errors}`)
  console.log(`   📦 Total: ${mockProducts.length}\n`)

  if (dryRun) {
    console.log('⚠️  Dry run complete - no changes made')
    console.log('   Run "npm run seed:products" to apply changes\n')
  } else if (errors === 0) {
    console.log('✅ Seeding complete!\n')
  } else {
    console.log(`⚠️  Seeding complete with ${errors} error(s)\n`)
    process.exit(1)
  }
}

seedProducts().catch(error => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
```

Note: Uses relative imports (`../data/mock-products` and `../types/product`) instead of path aliases, which works with standalone tsx scripts.

- [ ] **Step 3: Make seed script executable**

```bash
chmod +x src/scripts/seed-products.ts
```

- [ ] **Step 4: Test TypeScript compilation**

Run: `npx tsc --noEmit`

Expected output: No errors

- [ ] **Step 5: Test the script can run (dry run mode)**

```bash
npm run seed:products:dry
```

Expected output: Shows "Dry run" message, lists products that would be inserted

- [ ] **Step 6: Commit seed script**

```bash
git add src/scripts/
git commit -m "feat: add seed script for syncing products to Supabase"
```

---

## Chunk 6: Documentation and Testing

### Task 10: Create Setup Documentation

**Files:**
- Create: `docs/BACKEND-SETUP.md`

- [ ] **Step 1: Create backend setup documentation**

Create file `my-app/docs/BACKEND-SETUP.md`:

```markdown
# Backend Setup Guide - Supabase Integration

This guide walks you through setting up Supabase for the Pawfectly Handmade e-commerce site.

## Prerequisites

- A Supabase account (free tier works for development)
- Node.js and npm installed

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Enter project details:
   - **Name:** `pawfectly-handmade` (or your preferred name)
   - **Database Password:** Generate a secure password (save it!)
   - **Region:** Choose a region close to your users
4. Click "Create new project"
5. Wait for provisioning (2-3 minutes)

## Step 2: Get Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon/public key:** The long public key

## Step 3: Configure Environment Variables

1. Copy the credentials to your `.env.local` file:

```bash
NEXT_PUBLIC_DATA_SOURCE=supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Save the file

## Step 4: Run Database Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the contents of `supabase/migrations/20260313_init_products.sql`
4. Paste into the editor
5. Click "Run" (or press Cmd/Ctrl + Enter)

You should see "Success. No rows returned" confirming the table was created.

## Step 5: Seed Products

### Option A: Run Seed Script (Recommended)

```bash
npm run seed:products:dry   # Preview changes
npm run seed:products        # Insert products
```

### Option B: Use Supabase SQL Editor

1. In SQL Editor, create a new query
2. Copy contents of `supabase/seed.sql`
3. Run the query

## Step 6: Verify Setup

1. Start the development server:

```bash
npm run dev
```

2. Visit http://localhost:3000/shop

3. You should see products loaded from Supabase

4. Check browser console for any errors

## Toggling Between Mock and Supabase

To use mock data (offline development):

```bash
# In .env.local
NEXT_PUBLIC_DATA_SOURCE=mock
```

To use Supabase:

```bash
# In .env.local
NEXT_PUBLIC_DATA_SOURCE=supabase
```

**Note:** You need to restart the dev server when changing this variable.

## Troubleshooting

### "Missing Supabase environment variables"

- Ensure `.env.local` exists and contains the required variables
- Restart the dev server after adding environment variables

### "Error fetching products"

- Check Supabase credentials are correct
- Verify the database migration was run successfully
- Check Supabase logs in the dashboard

### Products not showing

- Try running the seed script again with `--force` flag
- Check the Supabase table editor to see if products exist
- Verify `NEXT_PUBLIC_DATA_SOURCE=supabase`

### Build errors

- Run `npx tsc --noEmit` to check for TypeScript errors
- Ensure all dependencies are installed: `npm install`

## Next Steps

After setup is complete:
- Products are now loaded from Supabase
- Cart still uses localStorage (unchanged)
- Future phases will add: orders, authentication, payments

## Production Deployment

When deploying to production:

1. Create a separate Supabase project for production
2. Add production environment variables to your hosting platform (Vercel, Netlify, etc.)
3. Run migrations on the production database
4. Run seed script (or manually add products)
5. Deploy your application

**Important:** Never commit `.env.local` to git. Use `.env.example` as a template.
```

- [ ] **Step 2: Commit documentation**

```bash
git add docs/BACKEND-SETUP.md
git commit -m "docs: add Supabase backend setup guide"
```

---

### Task 11: Manual Testing Checklist

**Files:**
- No file changes (testing only)

- [ ] **Step 1: Verify mock mode still works**

1. Ensure `.env.local` has `NEXT_PUBLIC_DATA_SOURCE=mock`
2. Run: `npm run dev`
3. Visit http://localhost:3000
4. Verify homepage loads with featured products
5. Visit http://localhost:3000/shop
6. Verify all 22 products appear
7. Click on a product
8. Verify product detail page loads

- [ ] **Step 2: Set up Supabase (follow setup guide)**

Follow the steps in `docs/BACKEND-SETUP.md` to:
1. Create Supabase project
2. Get credentials
3. Update `.env.local`
4. Run migration
5. Seed products

- [ ] **Step 3: Verify Supabase mode works**

1. Ensure `.env.local` has `NEXT_PUBLIC_DATA_SOURCE=supabase`
2. Restart dev server: `npm run dev`
3. Visit http://localhost:3000
4. Verify homepage loads with featured products from Supabase
5. Visit http://localhost:3000/shop
6. Verify all 22 products appear from Supabase
7. Test category filtering
8. Test price filtering
9. Test sort options
10. Click on a product
11. Verify product detail page loads from Supabase

- [ ] **Step 4: Test cart functionality**

1. Add a product to cart
2. Verify cart still works (localStorage)
3. Navigate to cart page
4. Verify product appears in cart
5. Update quantity
6. Verify calculations work

- [ ] **Step 5: Verify Supabase is actually being used (not mock fallback)**

1. Open browser DevTools → Network tab
2. Visit http://localhost:3000/shop
3. Look for requests to Supabase (URL containing your project URL)
4. If you see Supabase requests, it's working correctly
5. Alternatively, add a temporary console.log in Server Actions to verify

- [ ] **Step 6: Test environment toggle (rollback test)**

1. Stop the dev server
2. Change `.env.local`: `NEXT_PUBLIC_DATA_SOURCE=mock`
3. Restart dev server
4. Visit http://localhost:3000/shop
5. Verify products still load (from mock data)
6. Check Network tab - should NOT see Supabase requests
7. Change back to `NEXT_PUBLIC_DATA_SOURCE=supabase`
8. Restart and verify Supabase mode works again

- [ ] **Step 7: Test error handling**

1. Set invalid Supabase URL in `.env.local`
2. Restart dev server
3. Visit shop page
4. Verify graceful error (no crash, falls back to mock)
5. Fix credentials and verify recovery

- [ ] **Step 8: Run build test**

```bash
npm run build
```

Expected: Build completes successfully with no errors

- [ ] **Step 9: Commit any fixes discovered during testing**

```bash
git add .
git commit -m "fix: address issues found during testing"
```

---

## Chunk 7: Finalization

### Task 12: Update Project Documentation

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Update README with backend info**

Append to `my-app/README.md`:

```markdown
## Backend Integration

This project uses Supabase as the backend for product data. See [docs/BACKEND-SETUP.md](docs/BACKEND-SETUP.md) for setup instructions.

### Environment Configuration

```bash
# .env.local
NEXT_PUBLIC_DATA_SOURCE=mock|supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Data Source Toggle

- `mock`: Use local mock data (default, for development)
- `supabase`: Use Supabase database (production mode)

### Database Schema

Products table with categories, pricing, images, features, and bulk pricing tiers.

See `supabase/migrations/` for schema definitions.
```

- [ ] **Step 2: Update Phase 1 Summary**

Add to `my-app/docs/PHASE1-SUMMARY.md` at the end:

```markdown
## Phase 2 Updates

### Backend Integration (2026-03-13)

- Added Supabase integration for products
- Implemented Server Actions for data fetching
- Environment toggle between mock and Supabase
- Cart remains in localStorage
- See [BACKEND-SETUP.md](BACKEND-SETUP.md) for details

### Completed

- ✅ Supabase client setup
- ✅ Server Actions for products
- ✅ Database schema and seed data
- ✅ Pages updated to use Server Actions
- ✅ Environment-based data source toggle

### Next Steps

- [ ] Order storage in Supabase
- [ ] User authentication
- [ ] Payment processing with Stripe
- [ ] Admin dashboard
```

- [ ] **Step 3: Commit documentation updates**

```bash
git add README.md docs/PHASE1-SUMMARY.md
git commit -m "docs: update README and Phase 1 summary with backend info"
```

---

### Task 13: Final Verification

**Files:**
- No file changes (verification only)

- [ ] **Step 1: Run full TypeScript check**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 2: Run linter**

```bash
npm run lint
```

Expected: No errors

- [ ] **Step 3: Run production build**

```bash
npm run build
```

Expected: Build succeeds

- [ ] **Step 4: Verify all tests pass (if any exist)**

```bash
npm test 2>/dev/null || echo "No tests configured"
```

- [ ] **Step 5: Check git status**

```bash
git status
```

Expected: Only uncommitted files are intentional

- [ ] **Step 6: Create summary commit**

```bash
git add .
git commit -m "feat: complete Phase 2.1 - Backend Integration with Supabase

- Install Supabase dependencies
- Create Supabase server and browser clients
- Implement Server Actions for product fetching
- Add environment toggle for mock/supabase data
- Create database schema and seed data
- Update pages to use Server Actions
- Add setup documentation and seed script

Cart remains in localStorage (unchanged for this phase)"
```

---

### Task 14: Tag Release

**Files:**
- No file changes (git tag only)

- [ ] **Step 1: Create git tag**

```bash
git tag -a v2.1.0 -m "Phase 2.1: Backend Integration with Supabase

Features:
- Products from Supabase database
- Server Actions for data fetching
- Environment toggle (mock/supabase)
- Seed script and migrations
- Setup documentation"

git push origin v2.1.0
```

- [ ] **Step 2: Update implementation plan status**

```bash
# Mark plan as complete
echo "✅ Implementation plan executed successfully"
```

---

## Summary

After completing this implementation plan:

1. **Dependencies**: Supabase packages installed
2. **Environment**: `.env.local` configured with data source toggle
3. **Supabase Clients**: Server and browser clients created
4. **Server Actions**: Product fetching with mock/Supabase toggle
5. **Pages Updated**: Home, Shop, Product pages use Server Actions
6. **Database**: Schema migration and seed data ready
7. **Seed Script**: Utility for syncing products to Supabase
8. **Documentation**: Setup guide and updated README

**Files Created:**
- `src/lib/supabase/server.ts`
- `src/lib/supabase/client.ts`
- `src/app/actions/products.ts`
- `src/scripts/seed-products.ts`
- `supabase/migrations/20260313_init_products.sql`
- `supabase/seed.sql`
- `docs/BACKEND-SETUP.md`
- `.env.example`

**Files Modified:**
- `package.json`
- `src/app/page.tsx`
- `src/app/shop/page.tsx`
- `src/app/product/[slug]/page.tsx`
- `README.md`
- `docs/PHASE1-SUMMARY.md`

**Unchanged (backward compatible):**
- `src/data/mock-products.ts` (kept for fallback)
- `src/types/product.ts` (no changes needed)
- Cart functionality (still uses localStorage)
- All UI components (no changes needed)
