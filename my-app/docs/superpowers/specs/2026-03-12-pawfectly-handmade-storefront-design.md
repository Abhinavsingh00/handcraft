# Pawfectly Handmade - Public Storefront Design Specification

**Project:** Ecommerce website for handmade dog products
**Date:** 2026-03-12
**Status:** Approved
**Phase:** 1 - Public Storefront

---

## Executive Summary

Build a modern, accessible ecommerce storefront for handmade dog products called "Pawfectly Handmade." The site features a playful, friendly design with orange accents, craft typography, and focus on handmade quality.

**Scope:** Public-facing pages only (Home, Shop, Product, Cart, Checkout, Success). Admin dashboard and Supabase backend integration deferred to Phase 2.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Design System](#2-design-system)
3. [Component Design](#3-component-design)
4. [Page Layouts](#4-page-layouts)
5. [Data Flow & State Management](#5-data-flow--state-management)
6. [Folder Structure](#6-folder-structure--file-organization)
7. [API Routes & Supabase Preparation](#7-api-routes--supabase-preparation)
8. [Error Handling & Edge Cases](#8-error-handling--edge-cases)
9. [Testing Strategy](#9-testing-strategy)
10. [SEO & Performance](#10-seo--performance)
11. [Deployment Preparation](#11-deployment-preparation)

---

## 1. Architecture Overview

### Project Scope
Public-facing ecommerce storefront for handmade dog products

### Architecture Approach
Hybrid approach - Start with critical shared components, build pages, extract patterns as needed

### Tech Stack
- **Next.js 16** (App Router)
- **React 19** with React Compiler
- **TypeScript 5**
- **Tailwind CSS v4**
- **shadcn/ui** components
- **Supabase** (backend integration - Phase 2)

### Pages to Build
1. **Home** (`/`) - Hero, Featured Products, Categories, Testimonials
2. **Shop** (`/shop`) - Product listing with filters
3. **Product Detail** (`/product/[slug]`) - Single product view
4. **Cart** (`/cart`) - Cart management
5. **Checkout** (`/checkout`) - Multi-step checkout flow
6. **Checkout Success** (`/checkout/success`) - Order confirmation

### Critical Shared Components (Build First)
- `Navbar` - Navigation with cart icon
- `Footer` - Site links and info
- `ProductCard` - Reusable product display
- `CartBadge` - Cart item count indicator

### Data Strategy (Phase 1)
- Use mock product data initially
- Local storage for cart management
- Prepare Supabase integration points for Phase 2

---

## 2. Design System

### Design Theme
**Accessible & Ethical** - Handmade, friendly, trustworthy

### Color Palette
```css
/* Primary - Playful Orange */
--primary: #F97316      /* Orange-500 */
--primary-foreground: #FFF7ED

/* Secondary - Lighter Orange */
--secondary: #FB923C    /* Orange-400 */
--secondary-foreground: #7C2D12

/* CTA - Trust Blue */
--cta: #2563EB          /* Blue-600 */
--cta-foreground: #FFFFFF

/* Backgrounds */
--background: #FFF7ED   /* Orange-50 */
--foreground: #9A3412   /* Orange-900 */
--card: #FFFFFF
--card-foreground: #1F2937

/* Semantic */
--success: #22C55E
--warning: #F59E0B
--error: #EF4444
```

### Typography
```css
/* Google Fonts Import */
@import url('https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&family=Cabin:wght@400;500;600;700&display=swap');

/* Font Families */
--font-display: 'Amatic SC', cursive;    /* Headings - Craft, handmade feel */
--font-body: 'Cabin', sans-serif;         /* Body - Readable, friendly */

/* Type Scale */
--text-h1: 4.5rem / 1;      /* 72px - Hero titles */
--text-h2: 3rem / 1;        /* 48px - Section titles */
--text-h3: 2.25rem / 1.1;   /* 36px - Card titles */
--text-body: 1rem / 1.6;    /* 16px - Body text */
--text-small: 0.875rem / 1.5; /* 14px - Metadata */
```

### Spacing
```css
--radius-sm: 0.5rem;      /* 8px - Small elements */
--radius-md: 0.75rem;     /* 12px - Cards, buttons */
--radius-lg: 1rem;        /* 16px - Large cards */
--radius-full: 9999px;    /* Pill shapes, badges */
```

### Shadows
```css
--shadow-sm: 0 1px 2px rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
```

### Accessibility Requirements
- Minimum contrast ratio: 4.5:1 for body text
- Touch targets: Minimum 44x44px
- Focus visible: 3-4px solid rings
- Skip links for keyboard navigation
- ARIA labels on icon-only buttons

---

## 3. Component Design

### 3.1 Navbar Component

**Purpose:** Persistent navigation with cart access

**Features:**
- Logo (left) - "Pawfectly Handmade" text with paw icon
- Navigation links (center) - Home, Shop, About, Contact
- Cart icon (right) - With item count badge
- Mobile hamburger menu
- Sticky on scroll with backdrop blur

**States:**
- Default: Transparent at top, solid on scroll
- Hover: Links show underline animation
- Active: Current page link highlighted with orange

**Accessibility:**
- Skip to content link
- ARIA labels for icon buttons
- Keyboard navigation support

### 3.2 Footer Component

**Purpose:** Site navigation and trust signals

**Sections:**
- Brand column: Logo, tagline, social links
- Quick links: Shop, About, Contact, FAQ
- Customer service: Shipping, Returns, Privacy
- Newsletter signup with email input

**Style:**
- Dark background (#9A3412 - orange-900)
- Light text for contrast
- Social icons (SVG, no emojis)

### 3.3 ProductCard Component

**Purpose:** Reusable product display for grids and listings

**Props:**
```typescript
interface ProductCardProps {
  id: string
  slug: string
  name: string
  price: number
  comparePrice?: number
  image: string
  category: string
  badge?: 'new' | 'sale' | 'bestseller'
  bulkPricing?: { minQty: number; discount: number }[]
}
```

**Features:**
- Product image with hover zoom
- Badge overlay (new/sale/bestseller)
- Name (truncated if long)
- Price display with bulk discount hint
- Add to cart button (appears on hover)
- Wishlist heart icon

**Hover States:**
- Image zooms slightly
- Shadow increases
- Add to cart button appears

### 3.4 CartBadge Component

**Purpose:** Display cart item count on navbar

**Features:**
- Shopping bag icon (Lucide)
- Number badge (red dot with count)
- Bounce animation when item added
- Links to `/cart`

### 3.5 ProductGrid Component

**Purpose:** Responsive grid layout for products

**Props:**
```typescript
interface ProductGridProps {
  products: Product[]
  columns?: 2 | 3 | 4
  filters?: FilterOptions
}
```

**Responsive:**
- Mobile: 2 columns
- Tablet: 3 columns
- Desktop: 4 columns (configurable)

---

## 4. Page Layouts

### 4.1 Home Page (`/`)

**Sections:**

1. **Hero (80vh height)**
   - Background image: Happy dog with handmade products
   - Overlay: Gradient for text readability
   - Content: H1 "Handmade with Love for Your Furry Friend", subtext, primary CTA
   - Animation: Fade in on load

2. **Featured Products**
   - 4 hand-picked products
   - ProductCard components
   - "View All Products" link to shop

3. **Categories**
   - Large category cards with images
   - Category name, product count
   - Categories: Collars & Leashes, Treats & Chews, Beds & Blankets, Toys & Accessories

4. **Bestselling Products**
   - 8 products in ProductGrid
   - Filter by "bestseller" badge

5. **Testimonials**
   - 3 customer reviews
   - Photo, name, rating, quote
   - Verified purchase badge

6. **CTA Section**
   - "Join Our Pack" newsletter signup
   - Email input + subscribe button

### 4.2 Shop Page (`/shop`)

**Layout:** Sidebar filters + Product grid

**Features:**
- Filter by category (checkboxes)
- Filter by price range (slider)
- Sort by: Featured, Price, Newest, Bestselling
- Show results count
- Responsive: Filters become drawer on mobile

### 4.3 Product Detail Page (`/product/[slug]`)

**Features:**
- Image gallery with thumbnails
- Quantity selector
- Add to cart (primary CTA)
- Buy now (secondary CTA)
- Bulk pricing table (2+ items: 10% off, 5+ items: 20% off)
- Product details tabbed content
- Related products carousel

### 4.4 Cart Page (`/cart`)

**Features:**
- Cart item with image, name, price, quantity
- Quantity increment/decrement
- Remove item button
- Cart summary (subtotal, shipping, total)
- Empty cart state with CTA to shop
- Bulk discount applied automatically

### 4.5 Checkout Flow (`/checkout`)

**Multi-Step Process:**

1. **Cart Review** - Items, quantities, prices
2. **Shipping Information** - Email, phone, address
3. **Payment** - Card details or PayPal
4. **Review** - Order summary before confirmation

**Progress Indicator:**
- Step tracker at top: Cart → Shipping → Payment → Review
- Current step highlighted

### 4.6 Checkout Success (`/checkout/success`)

**Features:**
- Order confirmation message
- Order details summary
- Continue shopping button
- Track order button

---

## 5. Data Flow & State Management

### 5.1 Mock Product Data Structure

```typescript
interface Product {
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

interface BulkPricingTier {
  minQty: number
  discount: number // Percentage off
}

type ProductCategory =
  | 'collars-leashes'
  | 'treats-chews'
  | 'beds-blankets'
  | 'toys-accessories'
```

### 5.2 Cart Data Structure

```typescript
interface CartItem {
  product: Product
  quantity: number
  selectedBulkTier?: number
}

interface CartState {
  items: CartItem[]
  subtotal: number
  total: number
  bulkDiscount: number
}
```

### 5.3 Local Storage Keys

```typescript
const STORAGE_KEYS = {
  CART: 'pawfectly_cart',
  WISHLIST: 'pawfectly_wishlist',
  RECENTLY_VIEWED: 'pawfectly_recent',
} as const
```

### 5.4 State Management Approach

**For Phase 1 (Mock Data):**
- Use React Context API for cart state
- Local storage for persistence
- No global state library needed yet

**Context Structure:**
```typescript
interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartSubtotal: () => number
  getBulkDiscount: () => number
}
```

---

## 6. Folder Structure & File Organization

```
my-app/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page
│   │   ├── globals.css               # Global styles
│   │   ├── shop/page.tsx             # Shop listing
│   │   ├── product/[slug]/page.tsx   # Product detail
│   │   ├── cart/page.tsx             # Cart page
│   │   ├── checkout/page.tsx         # Checkout entry
│   │   └── checkout/success/page.tsx # Success page
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn/ui base components
│   │   ├── layout/                   # Navbar, Footer
│   │   ├── product/                  # Product components
│   │   ├── cart/                     # Cart components
│   │   ├── checkout/                 # Checkout components
│   │   └── shared/                   # Shared UI components
│   │
│   ├── contexts/                     # React Context providers
│   │   └── cart-context.tsx
│   │
│   ├── lib/                          # Utility functions
│   │   ├── utils.ts
│   │   ├── cart-utils.ts
│   │   └── storage-utils.ts
│   │
│   ├── types/                        # TypeScript types
│   │   ├── product.ts
│   │   ├── cart.ts
│   │   └── index.ts
│   │
│   ├── data/                         # Mock data (Phase 1)
│   │   └── mock-products.ts
│   │
│   └── hooks/                        # Custom React hooks
│       ├── use-cart.ts
│       └── use-local-storage.ts
│
├── public/
│   ├── images/
│   ├── products/
│   └── icons/
│
└── [config files]
```

---

## 7. API Routes & Supabase Preparation

### 7.1 API Routes Structure (Phase 2)

```
src/app/api/
├── products/route.ts              # GET all, POST new
├── products/[id]/route.ts         # GET, PUT, DELETE by ID
├── orders/route.ts                # POST create order
├── orders/[id]/route.ts           # GET order by ID
└── upload/route.ts                # POST upload image
```

### 7.2 Supabase Schema (For Phase 2)

**Products Table:**
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  category TEXT NOT NULL,
  badge TEXT CHECK (badge IN ('new', 'sale', 'bestseller')),
  images TEXT[] NOT NULL,
  features TEXT[],
  stock INTEGER DEFAULT 0,
  bulk_pricing JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Orders Table:**
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB NOT NULL,
  payment_method TEXT NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Order Items Table:**
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  bulk_discount DECIMAL(10,2) DEFAULT 0
);
```

---

## 8. Error Handling & Edge Cases

### Edge Cases to Handle

| Scenario | Handling Strategy |
|----------|------------------|
| Product out of stock | Disable "Add to Cart", show "Out of Stock" badge |
| Cart empty | Show empty state with CTA to shop |
| Invalid discount code | Show error message, allow retry |
| Payment failure | Show error, allow retry, save order data |
| Network error during checkout | Retry mechanism, show loading state |
| Image load failure | Fallback placeholder image |
| LocalStorage full | Clear old data, show warning |

### Validation Schemas

```typescript
import { z } from 'zod'

export const shippingSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(10),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().length(2),
  zip: z.string().regex(/^\d{5}$/),
})
```

---

## 9. Testing Strategy

### Unit Tests
- Cart utility functions
- Bulk discount calculations
- Validation schemas

### Integration Tests
- Cart Context operations
- Add to cart flow
- Checkout form validation

### E2E Testing Checklist
- Add to cart functionality
- Cart persistence
- Complete checkout flow
- Form validation
- Bulk discount application
- Mobile menu functionality

---

## 10. SEO & Performance

### Metadata Strategy
```typescript
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug)
  return {
    title: `${product.name} | Pawfectly Handmade`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.images[0]],
    },
  }
}
```

### Schema Markup
```typescript
const productSchema = {
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": product.name,
  "image": product.images,
  "description": product.description,
  "offers": {
    "@type": "Offer",
    "price": product.price,
    "availability": "https://schema.org/InStock"
  }
}
```

### Performance Checklist
- [ ] Use Next.js Image component
- [ ] Lazy load images below fold
- [ ] Implement skeleton loading
- [ ] Optimize font loading (next/font)
- [ ] Use WebP format for images

---

## 11. Deployment Preparation

### Vercel Configuration
```javascript
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### Pre-Deployment Checklist
- [ ] All TypeScript errors resolved
- [ ] ESLint passes
- [ ] All pages responsive
- [ ] All links work
- [ ] Forms validate properly
- [ ] Cart persists across pages
- [ ] Empty states handled
- [ ] Browser testing complete

---

## Summary

**What we're building:**
- 6 public pages: Home, Shop, Product, Cart, Checkout, Success
- Component library with 15+ reusable components
- Cart system with local storage persistence
- Mock product data for 20+ products
- Bulk discount pricing
- Multi-step checkout flow
- SEO optimized with schema markup

**Design System:**
- Playful orange theme (#F97316)
- Amatic SC + Cabin fonts (handmade feel)
- Soft, rounded cards with friendly aesthetics
- WCAG AAA compliant accessibility

**Next Phase:**
After Public Storefront is complete:
1. Admin Dashboard (product management, order management)
2. Supabase Backend Integration
3. Image upload functionality

---

*This specification was approved on 2026-03-12*
