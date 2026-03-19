# Authentication & Dashboard System - Design Specification

**Project:** Pawfectly Handmade E-commerce
**Date:** March 19, 2025
**Author:** Claude (glm-4.6)
**Status:** Approved

---

## Overview

Add authentication system and dual dashboards (Admin + Customer) to the existing Pawfectly Handmade e-commerce site. Customers can register, login, manage their orders and profiles. Admins get a complete dashboard to manage products, orders, customers, and reviews.

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Pawfectly Handmade                       │
├─────────────────────────────────────────────────────────────┤
│  Customer Site              │         Admin Panel                │
│  /shop, /cart, /checkout   │         /admin/*                    │
│  /login, /register         │         Protected by role           │
│  /account/*                │                                      │
└──────────┬───────────────────┴──────────────┬──────────────────┘
           │                                  │
           ↓                                  ↓
    ┌─────────────────────────────────────────────────────────────┐
    │         Supabase (Backend + Auth + Database)          │
    │  - Authentication (Email/Password + OAuth)               │
    │  - Database (PostgreSQL)                               │
    │  - Realtime subscriptions                           │
    └─────────────────────────────────────────────────────────────┘
```

### Tech Stack

- **Auth:** Supabase Auth v2
- **Database:** Supabase PostgreSQL (already using)
- **Realtime:** Supabase Realtime (for selective features)
- **UI:** Next.js 16 App Router
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **State:** React Context for auth state

---

## Database Schema

### New Tables

```sql
-- Users profile table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'confirmed', 'processing', 'ready_to_ship',
    'shipped', 'in_transit', 'delivered', 'cancelled', 'failed', 'refunded'
  )),
  return_status TEXT DEFAULT 'none' CHECK (return_status IN (
    'none', 'requested', 'approved', 'rejected', 'refunded'
  )),
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  shipping_address JSONB,
  billing_address JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_purchase DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Wishlist table
CREATE TABLE wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);
```

### Existing Tables to Update

```sql
-- Add tracking fields to products
ALTER TABLE products ADD COLUMN created_by UUID REFERENCES profiles(id);
ALTER TABLE products ADD COLUMN updated_by UUID REFERENCES profiles(id);
ALTER TABLE products ADD COLUMN stock INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN low_stock_threshold INTEGER DEFAULT 5;
```

---

## Route Structure

```
/src/app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx           # Login page (email + OAuth)
│   ├── register/
│   │   └── page.tsx           # Customer registration
│   ├── forgot-password/
│   │   └── page.tsx           # Password reset
│   └── layout.tsx             # Auth layout (minimal, centered)
│
├── account/                  # Customer Dashboard (protected)
│   ├── page.tsx               # Dashboard overview
│   ├── orders/
│   │   ├── page.tsx           # Order history list
│   │   └── [id]/
│   │       └── page.tsx       # Order details
│   ├── profile/
│   │   └── page.tsx           # Profile settings
│   ├── addresses/
│   │   ├── page.tsx           # Address book list
│   │   ├── new/page.tsx        # Add new address
│   │   └── [id]/
│   │       ├── page.tsx       # Edit address
│   │       └── delete/page.tsx  # Delete address
│   ├── wishlist/
│   │   └── page.tsx           # Wishlist items
│   └── reviews/
│       └── page.tsx           # My reviews
│
├── admin/                    # Admin Dashboard (role: admin)
│   ├── layout.tsx             # Admin layout (sidebar nav)
│   ├── page.tsx               # Dashboard overview
│   ├── orders/
│   │   ├── page.tsx           # All orders list with filters
│   │   └── [id]/
│   │       └── page.tsx       # Order details + status update
│   ├── products/
│   │   ├── page.tsx           # Product inventory
│   │   ├── new/
│   │   │   └── page.tsx       # Add new product form
│   │   └── [id]/
│   │       ├── page.tsx       # Edit product form
│   │       └── delete/
│   │           └── page.tsx   # Delete confirmation
│   ├── customers/
│   │   ├── page.tsx           # Customer list
│   │   └── [id]/
│   │       └── page.tsx       # Customer details + history
│   ├── reviews/
│   │   └── page.tsx           # Review moderation
│   └── settings/
│       └── page.tsx           # Admin settings
```

---

## Authentication Flow

### User Types & Permissions

| Role | Routes Access | Capabilities |
|------|----------------|--------------|
| **Guest** | /shop, /about, /contact, /faq, /shipping, etc. | Browse products, view pages |
| **Customer** | + /account/*, /cart, /checkout | Place orders, manage account, wishlist |
| **Admin** | + /admin/* | Manage products, orders, customers, reviews |

### Auth Pages

**Login Page (/login)**
- Email/password form
- "Sign in with Google" button (optional)
- "Sign in with GitHub" button (optional)
- "Don't have an account? Register" link
- "Forgot password?" link
- Remember me checkbox

**Register Page (/register)**
- Full name, email, password fields
- Confirm password field
- "Already have an account? Login" link
- Email validation

**Forgot Password (/forgot-password)**
- Email input only
- Send reset link
- "Back to login" link

### Auth Components

```tsx
// AuthProvider component for managing auth state
'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  profile: any | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  updateUser: (data: any) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  // ... auth implementation
}
```

---

## Admin Dashboard

### Dashboard Overview (/admin)

**Stats Cards Row:**
- Total Revenue (this month)
- Total Orders (this month)
- Total Customers
- Products Low in Stock
- Pending Returns

**Charts Section:**
- Sales chart (Last 7 days)
- Top 5 Products
- Order Status Breakdown (pie chart)

**Recent Activity:**
- Recent orders table (last 10)
- Quick action buttons for each order

**Alerts:**
- New order notifications (real-time)
- Low stock alerts (real-time)
- Return requests

### Orders Management (/admin/orders)

**Filters:**
- Status dropdown (all, pending, processing, shipped, etc.)
- Date range picker
- Customer search
- Order ID search

**Table Columns:**
- Order ID
- Customer Name
- Total Amount
- Status (badge color-coded)
- Date
- Actions (View, Update Status)

**Order Detail Modal:**
- Customer info
- Order items with images
- Shipping/billing addresses
- Order timeline
- Status update dropdown
- Add notes
- Send email to customer

### Products Management (/admin/products)

**Product List:**
- Thumbnail, name, SKU
- Price, stock level
- Category badges
- Low stock indicator (stock < 5)
- Actions: Edit, Delete

**Filters & Search:**
- Category filter
- Search by name/SKU
- Stock status (All, In Stock, Low Stock, Out of Stock)
- Sort by: Name, Price, Stock, Date

**Add/Edit Product Form:**
- Product images (upload multiple)
- Name, SKU
- Description (rich text editor)
- Price, Compare Price
- Category, Tags
- Stock quantity
- Bulk Pricing Tiers
- SEO metadata

### Customers Section (/admin/customers)

**Customer List:**
- Avatar, name, email
- Total spent, order count
- Last order date
- Actions: View Details

**Customer Detail Modal:**
- Contact information
- Order history list
- Total spent chart
- Recent reviews
- Notes field
- Send email button

### Reviews Management (/admin/reviews)

**Review List:**
- Product name, rating
- Customer name, date
- Review excerpt
- Status (Pending, Approved, Rejected)
- Actions: View, Approve, Reject, Delete

**Review Detail Modal:**
- Full review text
- Product and customer info
- Order context
- Approval/Rejection with notes

---

## Customer Dashboard

### My Account Overview (/account)

**Welcome Section:**
- Profile summary (avatar, name)
- Quick stats: Orders placed, Items in wishlist, Reviews written
- Recent activity: Last order, Last login

**Quick Links:**
- View Orders
- Manage Addresses
- View Wishlist
- Edit Profile

### My Orders (/account/orders)

**Order List:**
- Order ID, date, status
- Order total
- Thumbnail of first product
- Status badge (color-coded)
- Action: View Details

**Order Filters:**
- All Orders
- Pending
- Processing
- Shipped
- Delivered
- Cancelled
- Returned

**Order Detail Page:**
- Order information
- Items list with images and quantities
- Shipping address, Billing address
- Order status timeline
- Track order button (opens tracking in new tab)
- Download receipt (PDF)
- Reorder button (add all to cart)
- Request return button (if eligible)

### Profile Management (/account/profile)

**Profile Form:**
- Full Name
- Email Address
- Phone Number
- Avatar Upload
- Change Password (expandable section)

**Actions:**
- Save Changes button
- Delete Account button (with confirmation)

### Address Book (/account/addresses)

**Address List:**
- Address cards showing:
  - Default address badge
  - Full name, address line
  - City, State, ZIP
  - Phone
  - Actions: Edit, Delete, Set Default

**Add/Edit Address:**
- Full Name
- Address Line 1
- Address Line 2 (optional)
- City
  State/Province
  ZIP/Postal Code
- Country
- Phone
- Default checkbox

### Wishlist (/account/wishlist)

**Wishlist Items:**
- Product cards showing:
  - Product image, name, price
  - Stock status
  - Add to Cart button
  - Remove from Wishlist button
- Empty state with "Continue Shopping" CTA

### My Reviews (/account/reviews)

**Purchases to Review:**
- List of purchased products not yet reviewed
- "Write Review" button for each

**My Reviews:**
- Review cards showing:
  - Product name, image
  - Rating (stars)
  - Review excerpt
  - Date posted
  - Actions: Edit, Delete

---

## Real-time Features

### Selective Real-time Updates

**1. New Order Alerts (Admin Dashboard)**
- Supabase Realtime subscription on `orders` table
- When new order inserted → Show toast notification
- Play sound effect (optional)
- Auto-refresh dashboard stats

**2. Low Stock Alerts (Admin Dashboard)**
- Supabase Realtime subscription on `products` table
- When stock < threshold → Show alert banner
- Filter: Only show alert once per product per session
- Persistent dismiss button

**Implementation:**

```typescript
// hooks/useRealtimeOrders.ts
'use client'
import { useEffect, useState } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'

export function useRealtimeOrders() {
  const [newOrderCount, setNewOrderCount] = useState(0)

  useEffect(() => {
    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        setNewOrderCount(prev => prev + 1)
        // Play notification sound
        // Show toast notification
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  return { newOrderCount }
}
```

---

## UI Components

### Shared Components

**AuthButton** - Login/Register/Logout button
**UserMenu** - Dropdown with user info and logout
**ProtectedRoute** - Route wrapper for authenticated pages
**AdminRoute** - Route wrapper for admin-only pages
**StatusBadge** - Order status with color coding
**OrderTimeline** - Order status timeline component
**ReviewStars** - Interactive star rating component
**AddressForm** - Address add/edit form
**NotificationToast** - Real-time notification component

### Admin Components

**StatsCard** - Dashboard stat with trend indicator
**SalesChart** - Revenue trend chart
**OrderTable** - Filterable order list
**ProductTable** - Product inventory table
**CustomerTable** - Customer list with search
**ReviewCard** - Review with approve/reject actions
**StatusSelect** - Order status update dropdown
**LowStockAlert** - Banner for low stock warnings

### Customer Components

**OrderCard** - Order summary card
**AddressCard** - Address display with actions
**WishlistCard** - Wishlist product card
**ReviewForm** - Write review form
**ProfileForm** - Profile edit form

---

## Middleware & Protection

### Route Protection

```typescript
// middleware.ts (or proxy.ts in Next.js 16)
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes - no protection needed
  const publicRoutes = ['/', '/shop', '/about', '/contact', '/faq', '/shipping', '/returns', '/privacy', '/terms', '/login', '/register', '/forgot-password']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Protected routes - check auth
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Check admin routes
  if (pathname.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}
```

---

## Implementation Phases

### Phase 1: Authentication Infrastructure (Priority: High)
- Set up Supabase Auth
- Create profiles table
- Implement login/register pages
- Add auth components
- Configure middleware
- Test auth flow

### Phase 2: Database & Models (Priority: High)
- Create orders, order_items, reviews, wishlist tables
- Update products table with tracking fields
- Create TypeScript types
- Set up Supabase client utilities
- Test database operations

### Phase 3: Customer Dashboard (Priority: Medium)
- Build /account overview page
- Implement orders list and details
- Profile management
- Address book CRUD
- Wishlist functionality
- Reviews management
- Test customer flows

### Phase 4: Admin Dashboard - Overview (Priority: Medium)
- Build /admin layout with sidebar
- Dashboard overview with stats
- Real-time new order alerts
- Low stock alerts
- Recent orders table

### Phase 5: Admin - Orders Management (Priority: Medium)
- Orders list with filters
- Order detail modal
- Status update functionality
- Order timeline component
- Return management

### Phase 6: Admin - Products (Priority: Medium)
- Products inventory page
- Add product form with image upload
- Edit product functionality
- Delete product with confirmation
- Bulk pricing interface

### Phase 7: Admin - Customers & Reviews (Priority: Low)
- Customer list with search
- Customer detail view
- Reviews moderation
- Approve/reject reviews

### Phase 8: Real-time Features (Priority: Low)
- Supabase Realtime setup
- New order notifications
- Low stock alerts
- Test realtime functionality

---

## Success Criteria

### Authentication
- [ ] Customers can register with email/password
- [ ] Users can login with email/password or OAuth (Google/GitHub)
- [ ] Password reset flow works via email
- [ ] Protected routes redirect to login if not authenticated
- [ ] Admin routes redirect to home if not admin
- [ ] Logout works correctly and clears session

### Customer Dashboard
- [ ] Customers can view their order history
- [ ] Order details page shows all information
- [ ] Customers can update their profile
- [ ] Customers can manage shipping addresses
- [ ] Wishlist works - add/remove products
- [ ] Customers can write/edit reviews for purchased products
- [ ] All pages are mobile responsive

### Admin Dashboard
- [ ] Admins see dashboard with correct stats
- [ ] Real-time new order alerts appear
- [ ] Low stock alerts show correctly
- [ ] Orders list filters work correctly
- [ ] Order status can be updated
- [ ] Products can be added, edited, deleted
- [ ] Customer list loads with search
- [ ] Reviews can be moderated (approve/reject/delete)
- [ ] All admin pages are mobile responsive

### Technical
- [ ] No TypeScript errors
- [ ] All components have proper TypeScript types
- [ ] Database relationships work correctly
- [ ] Real-time subscriptions work without memory leaks
- [ ] Middleware protects routes correctly
- [ ] Responsive design on all pages
- [ ] No console errors in production

---

## Dependencies

### New Packages to Install

```bash
npm install @supabase/supabase-js@latest
npm install @supabase/auth-helpers-nextjs@latest
npm install lucide-react@latest  # icons
```

### Files to Create/Modify

**New Files:**
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/register/page.tsx`
- `src/app/(auth)/forgot-password/page.tsx`
- `src/app/(auth)/layout.tsx`
- `src/app/account/**` (multiple files)
- `src/app/admin/**` (multiple files)
- `src/components/auth/` (auth components)
- `src/components/admin/` (admin components)
- `src/components/dashboard/` (shared dashboard components)
- `src/contexts/auth-context.tsx`
- `src/hooks/useAuth.ts`
- `src/hooks/useRealtimeOrders.ts`
- `src/hooks/useRealtimeStock.ts`
- `src/lib/supabase/auth-helpers.ts`
- `src/lib/supabase/queries.ts`
- `src/lib/supabase/mutations.ts`
- `src/types/auth.ts`
- `src/middleware.ts` (or update `proxy.ts`)

**Modified Files:**
- `src/app/layout.tsx` (add auth provider)
- `src/app/globals.css` (add auth styles)
- `src/types/index.ts` (add auth types)
- `next.config.ts` (if needed for auth)
- `package.json` (dependencies)

---

## Notes

- **Image Uploads**: For product images, use Supabase Storage or a CDN service like Cloudinary
- **PDF Generation**: For receipts, use libraries like `jspdf` or `@react-pdf/renderer`
- **Email**: Supabase can be integrated with Sendgrid, Resend, or similar for transactional emails
- **Rate Limiting**: Consider rate limiting for auth endpoints to prevent abuse
- **SEO**: Ensure auth pages (login, register) have `noindex` meta tag
- **Testing**: Plan for E2E testing of critical auth and dashboard flows

---

## Appendix: Order Status Flow

```
Pending → Confirmed → Processing → Ready to Ship → Shipped → In Transit → Delivered
                                                    ↓
                                              Cancelled
                                                    ↓
                                                Failed (requires manual intervention)
                                                    ↓
                                              Refunded
```

## Return Flow

```
Delivered → Return Requested → Approved → Refund Processed
           ↓
        Cancelled
           ↓
        Rejected
```

---

**End of Design Specification**
