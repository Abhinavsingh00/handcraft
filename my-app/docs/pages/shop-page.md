# Shop Page Documentation

**Page Path:** `/shop`
**File Location:** `src/app/shop/page.tsx`
**Status:** ✅ Complete

---

## Overview
Main product catalog page with filtering, sorting, and grid display. Features a sidebar filter system and dynamic product loading via Server Actions.

---

## Features Implemented

### 1. Shop Hero Section
- Height: 40vh (min 300px)
- Background image: `/images/home/shop-hero.jpg`
- Gradient overlay: `from-black/60 via-black/40 to-black/20`
- Large heading: "Shop All Products"
- Tagline: "Handmade with love for your furry friends"

### 2. Filter System
**Sidebar with three filters:**

#### Categories (Checkbox)
- Collars & Leashes
- Treats & Chews
- Beds & Blankets
- Toys & Accessories

**Logic:** Single category filter via Server Action

#### Price Range (Slider)
- Range: $0 - $100
- Live display of max price
- Client-side filtering

#### Sort By (Select)
- Featured (default)
- Price: Low to High
- Price: High to Low
- Newest

### 3. Product Display
**States:**
- Loading: "Loading products..." with pulse animation
- Products found: Shows count + ProductGrid
- No products: Dog emoji + "No products found" + Clear Filters button

**Product Count:**
```
Showing {count} product(s)
```

### 4. Clear Filters
- Appears when any filter is active
- "Clear all filters" text link (top)
- "Clear Filters" button (when no results)

---

## State Management

### React State
```typescript
selectedCategories: ProductCategory[]
maxPrice: number (default: 100)
sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest'
products: Product[]
loading: boolean
```

### Filtering Logic
1. **Category:** Server-side via `getProducts()` action
2. **Price & Sort:** Client-side on fetched products

```typescript
// Fetch on category change
useEffect(() => {
  const categoryFilter = selectedCategories.length === 1 ? selectedCategories[0] : undefined
  const fetched = await getProducts({ category: categoryFilter })
  setProducts(fetched)
}, [selectedCategories])

// Filter/sort client-side
const filteredProducts = products
  .filter(p => p.price <= maxPrice)
  .sort((a, b) => { /* sort logic */ })
```

---

## Design Elements

### Layout
- **Desktop:** Sidebar left (264px), Product grid right (flex-1)
- **Mobile:** Stacked (filters top, products bottom)
- **Sticky Sidebar:** `sticky top-20`

### Colors
- Card bg: `bg-card`
- Primary accent: Orange
- Checkbox: `text-primary`
- Range slider: `accent-primary`

### Typography
- Headings: `font-display`
- Body: `font-body`
- Labels: Small text

---

## Technical Details

### Component Type
**Client Component** ('use client' directive)

**Why Client Component:**
- useState for filters and products
- useEffect for data fetching
- Interactive form controls
- Real-time filtering/sorting

### Key Files
- Page: `src/app/shop/page.tsx`
- ProductGrid Component: `@/components/product/product-grid`
- Server Action: `@/app/actions/products` (getProducts)
- Types: `@/types` (Product, ProductCategory)
- Hero Image: `public/images/home/shop-hero.jpg`

### Dependencies
```tsx
'use client'
import { useState, useEffect } from 'react'
import { ProductGrid } from '@/components/product/product-grid'
import { getProducts } from '@/app/actions/products'
import { ProductCategory } from '@/types'
import type { Product } from '@/types'
```

### Server Action Integration
```typescript
const fetched = await getProducts({ category: categoryFilter })
```

---

## Data Flow

```
User selects category
    ↓
selectedCategories state updates
    ↓
useEffect triggers
    ↓
getProducts() Server Action called
    ↓
products state updates
    ↓
Client-side filter/sort applied
    ↓
ProductGrid renders
```

---

## Future Improvements

### Potential Additions
- [ ] Search functionality
- [ ] Multiple category selection
- [ ] Filter tags/badges (visual representation)
- [ ] Quick view modal
- [ ] Wishlist integration
- [ ] Compare products feature
- [ ] Recently viewed products
- [ ] Infinite scroll/load more
- [ ] Filter presets (e.g., "Under $25", "New Arrivals")

### Performance
- [ ] Add product image lazy loading
- [ ] Implement pagination (instead of all products)
- [ ] Add loading skeletons
- [ ] Cache filtered results
- [ ] Optimistic UI updates

### UX Improvements
- [ ] Active filter count badge
- [ ] Filter collapse on mobile
- [ ] Price range inputs (min/max)
- [ ] Sort dropdown with icons
- [ ] "Save search" functionality
- [ ] URL params for shareable filters

---

## Related Pages
- Product Detail (`/product/[slug]`)
- Cart (`/cart`)
- Home (`/`)

---

## Last Updated
**Date:** March 18, 2026
**Status:** Complete with Server Actions integration
