# Backend Integration - Phase 2.1 Design

**Project:** Pawfectly Handmade E-Commerce
**Date:** 2026-03-13
**Status:** Draft

## Overview

Replace hardcoded mock product data with Supabase as the single source of truth for products, while keeping cart in localStorage. Add environment switch to toggle between Supabase and mock data for development flexibility.

## Scope

### In Scope
- Supabase project setup from scratch
- Database schema for products and categories
- SQL seed file with existing 22 products
- Sync script for product updates
- Server Actions for fetching products
- Environment-based data source toggle
- Integration with Shop and Product pages

### Out of Scope (Future Phases)
- User authentication
- Cart persistence in Supabase
- Order storage
- Payment processing
- Admin dashboard
- Real product images

## Architecture

### Data Flow

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Browser       │      │  Next.js 16      │      │   Supabase      │
│                 │      │  (Server Action) │      │                 │
│  Shop Page      │─────▶│  getProducts()   │─────▶│  products table │
│  Product Page   │─────▶│  getProduct(slug)│─────▶│  (PostgreSQL)   │
└─────────────────┘      └──────────────────┘      └─────────────────┘
                                      │
                                      ▼ (fallback, if NEXT_PUBLIC_DATA_SOURCE=mock)
                              ┌──────────────────┐
                              │  mock-products.ts│
                              │  (existing)      │
                              └──────────────────┘
```

### Environment Toggle

| Environment Variable | Value | Behavior |
|---------------------|-------|----------|
| `NEXT_PUBLIC_DATA_SOURCE` | `supabase` | Fetch from Supabase |
| `NEXT_PUBLIC_DATA_SOURCE` | `mock` | Use local mock data |

### Key Decisions

1. **Server Actions:** Direct data fetching in components, no API routes needed
2. **Environment Switch:** Easy toggle between sources without code changes
3. **Type Safety:** Supabase types generated from database schema
4. **Row Level Security:** Public read access, no write access from frontend

## Database Schema

**Design Decision:** Keeping categories as simple string literals (not a separate table) to minimize breaking changes to existing code. Categories will be: `'collars-leashes' | 'treats-chews' | 'beds-blankets' | 'toys-accessories'`

### Products Table

```sql
CREATE TABLE products (
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
```

### JSONB Structure

**images (array of strings):**
```json
["/products/collars/leather-collar-1.jpg", "/products/collars/leather-collar-2.jpg"]
```

**bulk_pricing (array of discount tiers):**
```json
[
  { "minQty": 2, "discount": 10 },
  { "minQty": 5, "discount": 20 }
]
```
**Note:** `discount` is a percentage (10 = 10% off), matching the existing mock data structure.

**features (array of strings):**
```json
["Handmade with love", "100% natural ingredients", "Eco-friendly packaging"]
```

### Indexes

```sql
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_badge ON products(badge) WHERE badge IS NOT NULL;
CREATE INDEX idx_products_price ON products(price);
```

### Row Level Security

```sql
-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Products are public" ON products FOR SELECT USING (true);

-- No write policies (admin only, future phase)
```

### Updated At Trigger

```sql
-- Auto-update updated_at on row modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Server Actions

**Location:** `src/app/actions/products.ts`

### API

```typescript
'use server'

export async function getProducts(filters?: {
  category?: string
  badge?: 'new' | 'sale' | 'bestseller'
  search?: string
}): Promise<Product[]>

export async function getProductBySlug(slug: string): Promise<Product | null>
```

### Implementation Code

```typescript
'use server'

import { createServerClient } from '@/lib/supabase/server'
import { mockProducts } from '@/data/mock-products'
import { Product } from '@/types'

const DATA_SOURCE = process.env.NEXT_PUBLIC_DATA_SOURCE || 'mock'

/**
 * Fetches products from Supabase or mock data based on environment
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
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (DATA_SOURCE === 'mock') {
    return mockProducts.find(p => p.slug === slug) || null
  }

  try {
    const supabase = await createServerClient()

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
 * Maps database row to Product interface
 * Ensures compatibility with existing code
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
```

### Helper Functions for Existing Code

```typescript
// Add to src/app/actions/products.ts for backward compatibility
export async function getFeaturedProducts(): Promise<Product[]> {
  return getProducts({ badge: 'bestseller' })
}

export async function getNewProducts(): Promise<Product[]> {
  return getProducts({ badge: 'new' })
}

export async function getSaleProducts(): Promise<Product[]> {
  // Products with 'sale' badge OR compare_price
  // This requires a more complex query, handled in implementation
  return getProducts({ badge: 'sale' })
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  return getProducts({ category })
}

export async function getRandomProducts(count: number): Promise<Product[]> {
  const products = await getProducts()
  const shuffled = [...products].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}
```

## Supabase Client Setup

### Server Client (`src/lib/supabase/server.ts`)

```typescript
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerClient() {
  const cookieStore = await cookies()

  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    }
  )
}
```

### Browser Client (`src/lib/supabase/client.ts`)

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### Type Generation (`src/lib/supabase/types.ts`)

**Generate types from database schema:**

```bash
# Run this command after schema changes
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/types.ts
```

**Or use the Supabase CLI:**

```bash
# Install Supabase CLI first
npx supabase init

# Generate types
npx supabase gen types typescript --local > src/lib/supabase/types.ts
```

**Generated types will be used for:**

```typescript
import { Database } from '@/lib/supabase/types'

type DbProduct = Database['public']['Tables']['products']['Row']
type DbProductInsert = Database['public']['Tables']['products']['Insert']
```

**Note:** We use a mapper function (`mapDbProductToProduct`) to convert DB types to our existing `Product` interface, maintaining backward compatibility with cart and other components.

## File Structure

```
my-app/
├── src/
│   ├── app/
│   │   ├── actions/
│   │   │   └── products.ts              # NEW: Server Actions
│   │   ├── shop/
│   │   │   └── page.tsx                 # MODIFY: Use getProducts()
│   │   ├── product/
│   │   │   └── [slug]/
│   │   │       └── page.tsx             # MODIFY: Use getProductBySlug()
│   │   └── layout.tsx                   # NO CHANGE: Keep CartProvider
│   ├── components/
│   │   ├── shared/
│   │   │   └── hero-section.tsx         # MODIFY: Use getFeaturedProducts()
│   │   └── ...
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts                # NEW: Browser client
│   │       ├── server.ts                # NEW: Server client
│   │       └── types.ts                 # NEW: Generated types (optional)
│   ├── scripts/
│   │   └── seed-products.ts             # NEW: Sync script
│   ├── data/
│   │   └── mock-products.ts             # KEEP: For fallback mode
│   └── types/
│       └── product.ts                   # KEEP: No changes needed
├── supabase/
│   ├── seed.sql                         # NEW: Initial seed data
│   └── migrations/
│       └── 20260313_init_products.sql   # NEW: Schema migration
├── .env.local                           # MODIFY: Add Supabase env vars
├── .env.example                         # MODIFY: Add Supabase env vars
└── package.json                         # MODIFY: Add dependencies
```

## Environment Variables

```bash
# .env.local (add to existing file)
NEXT_PUBLIC_DATA_SOURCE=mock|supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Dependencies

```json
{
  "@supabase/supabase-js": "^2.39.0",
  "@supabase/ssr": "^0.5.0"
}
```

## Error Handling

### Strategy

1. **Server Actions:** Return `null` or empty array on error
2. **Components:** Handle null/empty with "no products" state
3. **Development:** Console warnings for missing environment variables
4. **Production:** Graceful degradation, no crash on DB failure

### Error States

| Error Type | Handling |
|------------|----------|
| Invalid Supabase credentials | Console error, return empty array |
| Network timeout | Retry once, then return empty |
| Missing env var | Console warning, fall back to mock |
| Database connection fail | Log error, return empty array |

## Loading States

- Use Next.js `Suspense` boundaries for async components
- Show skeleton loaders during fetch
- Timeout after 5 seconds

## Testing Strategy

### Manual Testing Checklist

- [ ] Create Supabase project
- [ ] Run schema migration
- [ ] Run seed script
- [ ] Configure environment variables
- [ ] Toggle `NEXT_PUBLIC_DATA_SOURCE` between mock/supabase
- [ ] Verify shop page loads products from both sources
- [ ] Verify product detail pages work
- [ ] Test category filtering
- [ ] Test featured/bestseller filters
- [ ] Test search functionality
- [ ] Verify bulk pricing data persists correctly
- [ ] Test error handling (invalid credentials)
- [ ] Test with Supabase downtime

### No Automated Tests

Keeping scope minimal for this phase. Automated tests to be added in future phase.

## Supabase Project Setup Instructions

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Enter project details:
   - Name: `pawfectly-handmade`
   - Database Password: (generate secure password)
   - Region: Choose closest to your users
4. Wait for project to be provisioned (~2 minutes)

### Step 2: Get Project Credentials

1. Go to Project Settings → API
2. Copy:
   - Project URL
   - `anon` / `public` key

### Step 3: Run Schema Migration

1. Go to SQL Editor in Supabase dashboard
2. Create new query
3. Paste contents of `supabase/migrations/20260313_init_schema.sql`
4. Run query

### Step 4: Run Seed Data

1. In SQL Editor, create new query
2. Paste contents of `supabase/seed.sql`
3. Run query

### Step 5: Configure Environment Variables

1. Copy credentials to `.env.local`
2. Set `NEXT_PUBLIC_DATA_SOURCE=supabase`

### Step 6: Verify

1. Run `npm run dev`
2. Visit `/shop` - should see products from Supabase
3. Toggle to mock mode, verify fallback works

## Migration Script

**Location:** `src/scripts/seed-products.ts`

### Usage

```bash
# Preview what will be inserted (dry run)
npx tsx src/scripts/seed-products.ts --dry-run

# Insert all products (skip existing)
npx tsx src/scripts/seed-products.ts

# Force overwrite existing products
npx tsx src/scripts/seed-products.ts --force
```

### Implementation

```typescript
#!/usr/bin/env tsx
/**
 * Seed script to sync mock products to Supabase
 * Usage: npx tsx src/scripts/seed-products.ts [options]
 */

import { createClient } from '@supabase/supabase-js'
import { mockProducts } from '@/data/mock-products'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// CLI flags
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const force = args.includes('--force')

console.log(`🌱 Seeding products to Supabase...`)
console.log(`Dry run: ${dryRun ? 'YES' : 'NO'}`)
console.log(`Force mode: ${force ? 'YES' : 'NO'}`)

async function seedProducts() {
  let inserted = 0
  let updated = 0
  let skipped = 0
  let errors = 0

  for (const product of mockProducts) {
    try {
      // Check if product exists
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('slug', product.slug)
        .single()

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
        console.log(`⏭️  Skipping existing: ${product.name}`)
        skipped++
      } else if (existing && force) {
        // Update existing
        if (!dryRun) {
          await supabase
            .from('products')
            .update(productData)
            .eq('slug', product.slug)
        }
        console.log(`✏️  Updated: ${product.name}`)
        updated++
      } else {
        // Insert new
        if (!dryRun) {
          await supabase.from('products').insert(productData)
        }
        console.log(`✅ Inserted: ${product.name}`)
        inserted++
      }
    } catch (error) {
      console.error(`❌ Error with ${product.name}:`, error)
      errors++
    }
  }

  console.log('\n📊 Summary:')
  console.log(`   Inserted: ${inserted}`)
  console.log(`   Updated: ${updated}`)
  console.log(`   Skipped: ${skipped}`)
  console.log(`   Errors: ${errors}`)

  if (dryRun) {
    console.log('\n⚠️  Dry run complete - no changes made')
    console.log('Run without --dry-run to apply changes')
  }
}

seedProducts().catch(console.error)
```

### Package.json Script Addition

```json
{
  "scripts": {
    "seed:products": "tsx src/scripts/seed-products.ts",
    "seed:products:dry": "tsx src/scripts/seed-products.ts --dry-run",
    "seed:products:force": "tsx src/scripts/seed-products.ts --force"
  }
}
```

## Rollback Plan

If issues arise:

1. **Immediate rollback:** Set `NEXT_PUBLIC_DATA_SOURCE=mock` in `.env.local`
2. **Data rollback:** Supabase has point-in-time recovery (7 days)
3. **Code rollback:** Git revert to commit before backend integration

## Success Criteria

- [ ] Products load from Supabase when configured
- [ ] Mock data still works when env var set to `mock`
- [ ] Shop page displays products correctly
- [ ] Product detail pages work with Supabase data
- [ ] Bulk pricing persists correctly in JSONB columns
- [ ] Category filtering works
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Build succeeds

## Future Phases

After completion, proceed to:
- Phase 2.2: Orders & Checkout storage
- Phase 2.3: Admin Dashboard
- Phase 3.1: User Authentication
- Phase 3.2: Payment Processing
