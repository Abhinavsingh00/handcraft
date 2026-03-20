# Authentication & Dashboard System - Design Specification

**Project:** Pawfectly Handmade E-commerce
**Date:** March 19, 2025
**Author:** Claude (glm-4.6)
**Status:** Draft - Revision 1

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
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_purchase DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Wishlist table
CREATE TABLE wishlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Addresses table
CREATE TABLE addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  is_default BOOLEAN DEFAULT false,
  full_name TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'United States',
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Existing Tables to Update

```sql
-- Add tracking fields to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id);
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES profiles(id);
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 5;
```

### Database Indexes (Performance)

```sql
-- Orders indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_return_status ON orders(return_status);

-- Order items indexes
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Reviews indexes
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_status ON reviews(status);

-- Wishlist indexes
CREATE INDEX idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX idx_wishlist_product_id ON wishlist(product_id);

-- Addresses indexes
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_is_default ON addresses(is_default);

-- Profiles indexes
CREATE INDEX idx_profiles_role ON profiles(role);
```

### Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Orders policies
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Order items policies (inherited through orders)
CREATE POLICY "Users can view their own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Reviews policies
CREATE POLICY "Users can view approved reviews" ON reviews
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can view their own reviews" ON reviews
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all reviews" ON reviews
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update review status" ON reviews
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Wishlist policies
CREATE POLICY "Users can view their own wishlist" ON wishlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert to their own wishlist" ON wishlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own wishlist" ON wishlist
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all wishlist items" ON wishlist
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Addresses policies
CREATE POLICY "Users can view their own addresses" ON addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addresses" ON addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses" ON addresses
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses" ON addresses
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all addresses" ON addresses
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

### Database Migration Strategy

**Migration File:** `supabase/migrations/20250319_add_auth_and_orders.sql`

**Steps:**
1. Create all new tables
2. Add columns to existing products table
3. Create all indexes
4. Enable and configure RLS policies
5. Create triggers for updated_at timestamps

**Trigger for updated_at:**
```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**Rollback Strategy:**
- Keep migration file in version control
- Test migrations in staging environment first
- Create backup before running migrations in production
- Document rollback steps for each migration

**Rollback Commands:**
```sql
-- Rollback script (save as 20250319_add_auth_and_orders_rollback.sql)
DROP TRIGGER IF EXISTS update_addresses_updated_at ON addresses;
DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP FUNCTION IF EXISTS update_updated_at_column();

DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS wishlist CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

ALTER TABLE products DROP COLUMN IF EXISTS low_stock_threshold;
ALTER TABLE products DROP COLUMN IF EXISTS stock;
ALTER TABLE products DROP COLUMN IF EXISTS updated_by;
ALTER TABLE products DROP COLUMN IF EXISTS created_by;
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
import { useEffect, useState, useRef } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

export function useRealtimeOrders() {
  const [newOrderCount, setNewOrderCount] = useState(0)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const retryCountRef = useRef(0)
  const maxRetries = 3

  useEffect(() => {
    let channel: RealtimeChannel | null = null
    let mounted = true

    const setupSubscription = async () => {
      try {
        channel = supabase
          .channel('public:orders')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
            if (mounted) {
              setNewOrderCount(prev => prev + 1)
              // Play notification sound
              // Show toast notification
            }
          })
          .subscribe((status) => {
            if (!mounted) return
            if (status === 'SUBSCRIBED') {
              setIsConnected(true)
              setError(null)
              retryCountRef.current = 0
            } else if (status === 'SUBSCRIPTION_ERROR') {
              console.error('Subscription failed')
              setIsConnected(false)
              setError('Connection failed')
              // Retry logic
              if (retryCountRef.current < maxRetries) {
                retryCountRef.current++
                setTimeout(() => {
                  if (mounted) setupSubscription()
                }, 2000 * retryCountRef.current)
              }
            }
          })
      } catch (err) {
        console.error('Failed to setup subscription:', err)
        if (mounted) {
          setError('Failed to connect to real-time updates')
          setIsConnected(false)
        }
      }
    }

    setupSubscription()

    return () => {
      mounted = false
      if (channel) {
        channel.unsubscribe()
      }
    }
  }, [])

  return { newOrderCount, isConnected, error }
}
```

---

## Error Handling Strategy

### Authentication Errors

```typescript
// lib/errors/auth-errors.ts
export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage: string
  ) {
    super(message)
    this.name = 'AuthError'
  }
}

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: new AuthError(
    'Invalid credentials',
    'INVALID_CREDENTIALS',
    'Invalid email or password. Please try again.'
  ),
  WEAK_PASSWORD: new AuthError(
    'Weak password',
    'WEAK_PASSWORD',
    'Password must be at least 8 characters with a mix of letters, numbers, and symbols.'
  ),
  EMAIL_ALREADY_EXISTS: new AuthError(
    'Email already exists',
    'EMAIL_ALREADY_EXISTS',
    'An account with this email already exists. Please login instead.'
  ),
  SESSION_EXPIRED: new AuthError(
    'Session expired',
    'SESSION_EXPIRED',
    'Your session has expired. Please login again.'
  ),
  NETWORK_ERROR: new AuthError(
    'Network error',
    'NETWORK_ERROR',
    'Network error. Please check your connection and try again.'
  ),
}

// Error handler component
// components/ui/error-boundary.tsx
'use client'
import { Component, ReactNode } from 'react'
import { Button } from './button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
    // Log to error tracking service (e.g., Sentry)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <Button onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
```

### Database Error Handling

```typescript
// lib/errors/db-errors.ts
export class DatabaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage: string
  ) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export const DB_ERRORS = {
  CONNECTION_FAILED: new DatabaseError(
    'Database connection failed',
    'CONNECTION_FAILED',
    'Unable to connect to the database. Please try again.'
  ),
  QUERY_FAILED: new DatabaseError(
    'Query failed',
    'QUERY_FAILED',
    'An error occurred while fetching data. Please try again.'
  ),
  CONSTRAINT_VIOLATION: new DatabaseError(
    'Constraint violation',
    'CONSTRAINT_VIOLATION',
    'Invalid data provided. Please check your input.'
  ),
}

// Wrapper for database operations
// lib/supabase/with-error-handling.ts
export async function withDbErrorHandling<T>(
  operation: () => Promise<T>,
  errorMessage: string = 'Operation failed'
): Promise<{ data: T | null; error: string | null }> {
  try {
    const data = await operation()
    return { data, error: null }
  } catch (error) {
    console.error(`${errorMessage}:`, error)
    if (error instanceof DatabaseError) {
      return { data: null, error: error.userMessage }
    }
    return { data: null, error: 'An unexpected error occurred' }
  }
}
```

### User-Friendly Error Messages

| Error Type | User Message | Action |
|------------|-------------|--------|
| Invalid credentials | Invalid email or password. Please try again. | Show on login form |
| Weak password | Password must be at least 8 characters with letters, numbers, and symbols. | Show during registration |
| Email exists | An account with this email already exists. | Link to login page |
| Session expired | Your session has expired. Please login again. | Redirect to login |
| Network error | Network error. Please check your connection. | Retry button |
| Database error | Unable to load data. Please try again. | Retry button |
| Rate limited | Too many attempts. Please wait a few minutes. | Show countdown timer |

---

## Security Considerations

### Password Policy

**Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*)

**Validation:**
```typescript
// lib/auth/password-validation.ts
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  return { valid: errors.length === 0, errors }
}
```

### Rate Limiting

**Endpoints to Rate Limit:**
- Login: 5 attempts per 15 minutes per IP
- Register: 3 attempts per hour per IP
- Password reset: 3 attempts per hour per email
- API routes: 100 requests per minute per user

**Implementation:**
```typescript
// middleware.ts (rate limiting)
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '15 m'),
})

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/login') {
    const ip = request.ip ?? '127.0.0.1'
    const { success } = await ratelimit.limit(ip)

    if (!success) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      )
    }
  }
  // ... rest of middleware
}
```

### Session Configuration

**Settings:**
- Session timeout: 7 days
- Refresh token rotation: Enabled
- Remember me: 30 days
- Password change requires re-authentication: Yes

### CSRF Protection

**Implementation:**
- Use Supabase's built-in CSRF protection
- All state-changing operations require valid session
- Verify session on every protected route

### XSS Prevention

**Measures:**
- All user input sanitized before display
- React's built-in XSS protection
- Content Security Policy (CSP) headers
- No `dangerouslySetInnerHTML` without sanitization

### File Upload Validation

**Product Image Uploads:**
- Allowed types: image/jpeg, image/png, image/webp
- Max file size: 5MB
- Image dimensions: Min 800x800, Max 4000x4000
- Auto-optimization: WebP format, quality 85%
- Virus scanning: Enabled

**Implementation:**
```typescript
// lib/storage/image-validation.ts
export async function validateImageUpload(file: File): Promise<{ valid: boolean; error?: string }> {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' }
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 5MB' }
  }

  // Validate image dimensions
  const dimensions = await getImageDimensions(file)
  if (dimensions.width < 800 || dimensions.height < 800) {
    return { valid: false, error: 'Image must be at least 800x800 pixels' }
  }

  if (dimensions.width > 4000 || dimensions.height > 4000) {
    return { valid: false, error: 'Image must be less than 4000x4000 pixels' }
  }

  return { valid: true }
}
```

### OAuth Security

**Configuration:**
- OAuth callback URL: Verified and whitelisted
- Profile auto-creation: Enabled on first login
- Email verification: Required before account activation
- Existing email handling: Link OAuth to existing account

**OAuth Implementation Details:**
```typescript
// lib/auth/oauth-helpers.ts
export async function handleOAuthSignIn(provider: 'google' | 'github') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    }
  })

  if (error) throw error
  return data.url
}

export async function handleOAuthCallback(code: string) {
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) throw error

  // Check if profile exists, create if not
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single()

  if (!profile) {
    await supabase.from('profiles').insert({
      id: data.user.id,
      email: data.user.email,
      full_name: data.user.user_metadata.full_name,
      avatar_url: data.user.user_metadata.avatar_url,
      role: 'customer',
    })
  }

  return data
}
```

---

## Admin Initialization

### First Admin Setup

**Option 1: Manual Database Creation (Recommended for Production)**

```sql
-- Run this SQL in Supabase SQL Editor to create first admin
-- 1. Create user via Supabase Auth dashboard first, get the UUID
-- 2. Then run:

INSERT INTO profiles (id, email, role, full_name)
VALUES (
  'YOUR_USER_UUID_FROM_AUTH', -- Replace with actual UUID
  'admin@pawfectlyhandmade.com',
  'admin',
  'System Administrator'
);
```

**Option 2: Seed Script with Environment Variable Protection (Development)**

```typescript
// scripts/create-admin.ts
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Only works with service role key
)

async function createAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  const adminName = process.env.ADMIN_NAME || 'Admin'

  if (!adminEmail || !adminPassword) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set')
    process.exit(1)
  }

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
  })

  if (authError) {
    console.error('Error creating auth user:', authError)
    process.exit(1)
  }

  // Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      email: adminEmail,
      role: 'admin',
      full_name: adminName,
    })

  if (profileError) {
    console.error('Error creating profile:', profileError)
    process.exit(1)
  }

  console.log('Admin user created successfully!')
  console.log('Email:', adminEmail)
  console.log('Password:', adminPassword)
  console.log('IMPORTANT: Change this password immediately after first login!')
}

createAdmin()
```

**Usage:**
```bash
# In .env.local (DO NOT commit to version control)
ADMIN_EMAIL=admin@pawfectlyhandmade.com
ADMIN_PASSWORD=SecurePassword123!
ADMIN_NAME=System Administrator

# Run script
npm run create-admin
```

**Security Notes:**
- Never commit admin credentials to version control
- Use environment variables for all sensitive data
- Change admin password immediately after first login
- Enable two-factor authentication (2FA) for admin accounts in production
- Consider IP whitelist for admin dashboard access

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

**Note:** The project already has `@supabase/ssr` installed. Use that instead of the deprecated `@supabase/auth-helpers-nextjs`.

```bash
npm install @supabase/supabase-js@latest
npm install lucide-react@latest  # icons (already installed)
npm install zod@latest  # form validation
npm install react-hook-form@latest  # form handling
npm install @hookform/resolvers@latest  # Zod resolver for react-hook-form
```

**DO NOT install:**
- `@supabase/auth-helpers-nextjs` - This package is deprecated. Use `@supabase/ssr` instead (already installed).

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
