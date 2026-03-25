# Admin Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-step. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a WordPress-style admin dashboard with role-based access control, allowing admins to manage users and products while customers are redirected to their account page.

**Architecture:** Hybrid approach with server-side route protection (Next.js 16 proxy middleware), Server Actions for mutations, and client components for interactive UI. Role is stored in `profiles` table with 'customer' as default.

**Tech Stack:** Next.js 16, Supabase (auth + database), React Server Components, Server Actions, TypeScript, Tailwind CSS v4, shadcn/ui, Zod

---

## Notes for Implementer

**Critical fixes applied in this revision:**
- `deleteUser` now uses soft-delete (modifies profile) instead of `supabase.auth.admin.deleteUser()` which requires service role key
- Auth context redirect logic now properly awaits `fetchProfile()` return value before checking role
- `useRouter` import added to auth context
- Task 2 removed (role already exists in Profile type)
- Task 2 now installs all dependencies (zod, lucide-react, sonner) and shadcn components upfront
- File structure updated to remove unused files (constants.ts, image-upload.tsx, products/[id]/page.tsx)
- Added loading.tsx and error.tsx to file structure

**Still needs manual verification:**
- Check if profiles table has a trigger that auto-creates profiles on signup (if yes, Task 5 can be skipped)
- Verify role column exists in profiles table before starting

---

## File Structure

### New Files to Create

```
src/
├── app/
│   ├── proxy.ts                          # Server-side route protection (NEW - at root of app/)
│   └── admin/
│       ├── layout.tsx                    # Protected admin layout with sidebar (NEW)
│       ├── loading.tsx                   # Loading state for admin routes (NEW)
│       ├── error.tsx                     # Error boundary for admin routes (NEW)
│       ├── dashboard/
│       │   └── page.tsx                  # Admin dashboard overview (NEW)
│       ├── users/
│       │   └── page.tsx                  # User management page (NEW)
│       └── products/
│           └── page.tsx                  # Product list page (NEW)
├── components/admin/
│   ├── admin-sidebar.tsx                 # Navigation sidebar (NEW)
│   ├── dashboard-stats.tsx               # Stats cards component (NEW)
│   ├── users-table.tsx                   # User list with actions (NEW)
│   ├── products-grid.tsx                 # Product grid/list (NEW)
│   └── product-form-modal.tsx            # Add/Edit product modal (NEW)
├── actions/admin.ts                      # Admin Server Actions (NEW)
├── lib/
│   └── admin-validations.ts              # Zod schemas (NEW)
└── types/
    └── admin.ts                          # Admin-specific types (NEW)
```

### Files to Modify

```
src/
├── contexts/auth-context.tsx             # Add isAdmin flag, role-based redirect
├── app/(auth)/login/page.tsx             # Simplify (auth context handles redirect)
└── app/layout.tsx                        # Add Toaster for notifications
```

---

## Task 1: Database Schema Setup

**Files:**
- Modify: SQL to run in Supabase SQL Editor

**Execute this SQL in Supabase Dashboard → SQL Editor:**

```sql
-- Step 1: Add role column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer';
ALTER TABLE profiles ADD CONSTRAINT check_role CHECK (role IN ('customer', 'admin'));
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Step 2: Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  category TEXT,
  status TEXT DEFAULT 'active',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_by ON products(created_by);

-- Step 3: Create update trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 4: Enable RLS and create policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active products" ON products;
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Admins can insert products" ON products;
CREATE POLICY "Admins can insert products"
  ON products FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can update products" ON products;
CREATE POLICY "Admins can update products"
  ON products FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can delete products" ON products;
CREATE POLICY "Admins can delete products"
  ON products FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

- [ ] **Step 1: Run SQL in Supabase SQL Editor**

Go to: Supabase Dashboard → SQL Editor → New Query
Paste the SQL above and click "Run"

- [ ] **Step 2: Verify tables created**

Check: Supabase Dashboard → Table Editor
Verify: `profiles` has `role` column, `products` table exists

- [ ] **Step 3: Create first admin user**

```sql
-- After signing up a user through the app, run this:
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

---

## Task 2: Install Required Dependencies

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Install npm packages**

Run: `npm install zod lucide-react sonner`

- [ ] **Step 2: Install shadcn/ui components**

Run: `npx shadcn@latest add card table badge dialog input textarea select label`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json src/components/ui/
git commit -m "feat: install admin dependencies (zod, sonner, lucide-react, shadcn)"
```

---

## Task 3: Create Admin Types

```typescript
export interface Product {
  id: string
  title: string
  description: string | null
  price: number
  images: string[]
  category: string | null
  status: 'active' | 'draft' | 'archived'
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface ProductFormData {
  title: string
  description?: string
  price: number
  category?: string
  status: 'active' | 'draft' | 'archived'
  images: string[]
}

export interface DashboardStats {
  totalUsers: number
  totalProducts: number
  activeProducts: number
  draftProducts: number
}
```

- [ ] **Step 3: Commit**

```bash
git add src/types/
git commit -m "feat: add role and admin types"
```

---

## Task 3: Create Validation Schemas

**Files:**
- Create: `src/lib/admin-validations.ts`

- [ ] **Step 1: Create validation schemas**

Create `src/lib/admin-validations.ts`:

```typescript
import { z } from 'zod'

export const ProductSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().optional(),
  price: z.coerce
    .number()
    .min(0, 'Price must be positive')
    .max(999999.99, 'Price too large'),
  category: z.string().optional(),
  status: z.enum(['active', 'draft', 'archived']).default('active'),
  images: z.array(z.string().url('Invalid image URL')).default([]),
})

export type ProductInput = z.infer<typeof ProductSchema>

export const UserRoleSchema = z.enum(['customer', 'admin'])

export type UserRole = z.infer<typeof UserRoleSchema>
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/admin-validations.ts
git commit -m "feat: add admin validation schemas with Zod"
```

---

## Task 4: Update Auth Context for Role-Based Redirect

**Files:**
- Modify: `src/contexts/auth-context.tsx`

- [ ] **Step 1: Add useRouter import**

At the top of the file, add:
```typescript
import { useRouter } from 'next/navigation'
```

- [ ] **Step 2: Update AuthContextType interface**

```typescript
interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  isAdmin: boolean  // ADD THIS
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
}
```

- [ ] **Step 3: Add router and isAdmin in AuthProvider**

In AuthProvider component, after state declarations:
```typescript
const router = useRouter()
const isAdmin = profile?.role === 'admin'
```

- [ ] **Step 4: Update fetchProfile to return profile data**

Modify the fetchProfile function to return the profile:
```typescript
const fetchProfile = async (userId: string) => {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (data && !error) {
    setProfile(data)
  }
  setLoading(false)
  return data  // ADD THIS
}
```

- [ ] **Step 5: Update onAuthStateChange to handle role-based redirect**

Find the `supabase.auth.onAuthStateChange` callback and update:

```typescript
const {
  data: { subscription },
} = supabase.auth.onAuthStateChange(async (event, session) => {
  setUser(session?.user ?? null)

  if (session?.user) {
    const profile = await fetchProfile(session.user.id)  // GET RETURNED PROFILE

    // Auto-redirect based on role after sign in
    if (event === 'SIGNED_IN' && profile?.role === 'admin') {
      router.push('/admin/dashboard')
      router.refresh()
    }
  } else {
    setProfile(null)
    setLoading(false)
  }
})
```

- [ ] **Step 4: Update context provider value**

```typescript
return (
  <AuthContext.Provider
    value={{
      user,
      profile,
      loading,
      isAdmin,  // ADD THIS
      signIn,
      signUp,
      signOut,
      signInWithGoogle,
    }}
  >
    {children}
  </AuthContext.Provider>
)
```

- [ ] **Step 5: Commit**

```bash
git add src/contexts/auth-context.tsx
git commit -m "feat: add isAdmin and role-based redirect to auth context"
```

---

## Task 5: Update Register to Set Default Role

**Files:**
- Modify: `src/app/(auth)/register/page.tsx`

- [ ] **Step 1: Find the signUp function call in auth-context**

In `src/contexts/auth-context.tsx`, find the `signUp` function and update it to include role:

```typescript
const signUp = async (email: string, password: string, fullName: string) => {
  if (!supabase) return { error: 'Supabase not configured' }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // ADD: Create profile with default customer role
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email: email,
        full_name: fullName,
        role: 'customer',  // Default to customer
      })

    if (profileError) {
      console.error('Profile creation failed:', profileError)
      return { error: 'Account created but profile setup failed' }
    }
  }

  return { error: null }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/contexts/auth-context.tsx
git commit -m "feat: set default customer role on registration"
```

---

## Task 6: Update Login for Role-Based Redirect

**Files:**
- Modify: `src/app/(auth)/login/page.tsx`

- [ ] **Step 1: Simplify login handler (auth context handles redirect now)**

Update the `handleSubmit` function:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError('')
  setIsLoading(true)

  const { error } = await signIn(email, password)

  if (error) {
    setError(error)
    setIsLoading(false)
    return
  }

  // Auth context will handle redirect based on role
  // Just show loading state
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\(auth\)/login/page.tsx
git commit -m "feat: simplify login redirect (handled by auth context)"
```

---

## Task 7: Create Server-Side Protection (Proxy Middleware)

**Files:**
- Create: `src/app/proxy.ts`

- [ ] **Step 1: Create proxy middleware**

Create `src/app/proxy.ts`:

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function proxy(request: NextRequest) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options)
        },
        remove(name: string, options: any) {
          cookieStore.delete(name, options)
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/account', request.url))
    }
  }

  return NextResponse.next()
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/proxy.ts
git commit -m "feat: add server-side role protection with proxy middleware"
```

---

## Task 8: Create Admin Server Actions

**Files:**
- Create: `src/actions/admin.ts`

- [ ] **Step 1: Create admin actions file**

Create `src/actions/admin.ts`:

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { ProductSchema, type ProductInput } from '@/lib/admin-validations'
import type { Product, DashboardStats } from '@/types/admin'

// ============================================
// PRODUCT ACTIONS
// ============================================

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch products:', error)
    return []
  }

  return data || []
}

export async function getProduct(id: string): Promise<Product | null> {
  const supabase = await createClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Failed to fetch product:', error)
    return null
  }

  return data
}

export async function createProduct(formData: FormData): Promise<{ success: boolean; error?: string; data?: Product }> {
  const supabase = await createClient()
  if (!supabase) return { error: 'Database not configured', success: false }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Authentication required', success: false }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    console.warn(`Unauthorized product creation by user ${user.id}`)
    return { error: 'Unauthorized', success: false }
  }

  // Validate input
  const validatedData = ProductSchema.safeParse(Object.fromEntries(formData))
  if (!validatedData.success) {
    return { error: validatedData.error.errors[0].message, success: false }
  }

  const { data: product, error } = await supabase
    .from('products')
    .insert({
      ...validatedData.data,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Product creation failed:', error)
    return { error: 'Failed to create product', success: false }
  }

  revalidatePath('/admin/products')
  revalidatePath('/shop')

  return { success: true, data: product }
}

export async function updateProduct(id: string, formData: FormData): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  if (!supabase) return { error: 'Database not configured', success: false }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Authentication required', success: false }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    console.warn(`Unauthorized product update by user ${user.id}`)
    return { error: 'Unauthorized', success: false }
  }

  const validatedData = ProductSchema.safeParse(Object.fromEntries(formData))
  if (!validatedData.success) {
    return { error: validatedData.error.errors[0].message, success: false }
  }

  const { error } = await supabase
    .from('products')
    .update(validatedData.data)
    .eq('id', id)

  if (error) {
    console.error('Product update failed:', error)
    return { error: 'Failed to update product', success: false }
  }

  revalidatePath('/admin/products')
  revalidatePath('/admin/products/[id]')
  revalidatePath('/shop')
  revalidatePath('/product/[id]')

  return { success: true }
}

export async function deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  if (!supabase) return { error: 'Database not configured', success: false }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Authentication required', success: false }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    console.warn(`Unauthorized product deletion by user ${user.id}`)
    return { error: 'Unauthorized', success: false }
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Product deletion failed:', error)
    return { error: 'Failed to delete product', success: false }
  }

  revalidatePath('/admin/products')
  revalidatePath('/shop')

  return { success: true }
}

// ============================================
// USER ACTIONS
// ============================================

export async function getUsers(): Promise<any[]> {
  const supabase = await createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch users:', error)
    return []
  }

  return data || []
}

export async function updateUserRole(userId: string, newRole: 'customer' | 'admin'): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  if (!supabase) return { error: 'Database not configured', success: false }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Authentication required', success: false }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    console.warn(`Unauthorized role change by user ${user.id}`)
    return { error: 'Unauthorized', success: false }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId)

  if (error) {
    console.error('Role update failed:', error)
    return { error: 'Failed to update role', success: false }
  }

  return { success: true }
}

export async function deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  if (!supabase) return { error: 'Database not configured', success: false }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Authentication required', success: false }

  // Prevent self-deletion
  if (userId === user.id) {
    return { error: 'Cannot delete your own account', success: false }
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    console.warn(`Unauthorized user deletion by user ${user.id}`)
    return { error: 'Unauthorized', success: false }
  }

  // Soft-delete: mark user email as deleted and revoke sessions
  // Note: For full deletion, you would need to use Supabase Management API with service role key
  const { error } = await supabase
    .from('profiles')
    .update({
      email: `deleted_${userId}@deleted.local`,
      full_name: 'Deleted User',
      role: 'customer',
    })
    .eq('id', userId)

  if (error) {
    console.error('User deletion failed:', error)
    return { error: 'Failed to delete user', success: false }
  }

  revalidatePath('/admin/users')

  return { success: true }
}

// ============================================
// DASHBOARD ACTIONS
// ============================================

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient()
  if (!supabase) {
    return { totalUsers: 0, totalProducts: 0, activeProducts: 0, draftProducts: 0 }
  }

  const [usersResult, productsResult] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('products').select('id', { count: 'exact', head: true }),
  ])

  const activeResult = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'active')

  const draftResult = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'draft')

  return {
    totalUsers: usersResult.count || 0,
    totalProducts: productsResult.count || 0,
    activeProducts: activeResult.count || 0,
    draftProducts: draftResult.count || 0,
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/actions/admin.ts
git commit -m "feat: add admin server actions for users and products"
```

---

## Task 9: Create Admin Layout

**Files:**
- Create: `src/app/admin/layout.tsx`

- [ ] **Step 1: Create admin layout**

Create `src/app/admin/layout.tsx`:

```typescript
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="lg:pl-64">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/layout.tsx
git commit -m "feat: create admin layout with sidebar"
```

---

## Task 10: Create Admin Sidebar Component

**Files:**
- Create: `src/components/admin/admin-sidebar.tsx`

- [ ] **Step 1: Install lucide-react for icons**

Run: `npm install lucide-react`

- [ ] **Step 2: Create admin sidebar**

Create `src/components/admin/admin-sidebar.tsx`:

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Users,
  Package,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/products', label: 'Products', icon: Package },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { user, profile, signOut } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/login'
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          size="icon"
          variant="outline"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-40 h-screen w-64 bg-slate-900 text-white
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-700">
          <Link href="/admin/dashboard" className="text-xl font-bold">
            Admin Panel
          </Link>
          <button
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-slate-700">
          <p className="text-sm text-slate-400">Logged in as</p>
          <p className="font-medium truncate">{profile?.full_name || user?.email}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }
                `}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Sign Out */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/admin-sidebar.tsx package.json package-lock.json
git commit -m "feat: create admin sidebar with mobile responsive menu"
```

---

## Task 11: Create Dashboard Stats Component

**Files:**
- Create: `src/components/admin/dashboard-stats.tsx`

- [ ] **Step 1: Create dashboard stats component**

Create `src/components/admin/dashboard-stats.tsx`:

```typescript
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Users, Package, CheckCircle, FileText } from 'lucide-react'
import type { DashboardStats } from '@/types/admin'

interface DashboardStatsProps {
  stats: DashboardStats
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      label: 'Active Products',
      value: stats.activeProducts,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Draft Products',
      value: stats.draftProducts,
      icon: FileText,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Create Card component if not exists**

Check if `src/components/ui/card.tsx` exists. If not, create it using shadcn:

Run: `npx shadcn@latest add card`

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/dashboard-stats.tsx src/components/ui/card.tsx
git commit -m "feat: create dashboard stats cards component"
```

---

## Task 12: Create Dashboard Page

**Files:**
- Create: `src/app/admin/dashboard/page.tsx`

- [ ] **Step 1: Create dashboard page**

Create `src/app/admin/dashboard/page.tsx`:

```typescript
import { getDashboardStats } from '@/actions/admin'
import { DashboardStats } from '@/components/admin/dashboard-stats'

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-slate-600 mt-2">Welcome to your admin panel</p>
      </div>

      <DashboardStats stats={stats} />

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/products"
            className="p-6 bg-white rounded-lg border hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium">Add Product</h3>
            <p className="text-sm text-slate-600 mt-1">Create a new product listing</p>
          </a>
          <a
            href="/admin/users"
            className="p-6 bg-white rounded-lg border hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium">Manage Users</h3>
            <p className="text-sm text-slate-600 mt-1">View and manage user accounts</p>
          </a>
          <a
            href="/shop"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-white rounded-lg border hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium">View Shop</h3>
            <p className="text-sm text-slate-600 mt-1">See the customer-facing store</p>
          </a>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/dashboard/page.tsx
git commit -m "feat: create admin dashboard page"
```

---

## Task 13: Create Users Table Component

**Files:**
- Create: `src/components/admin/users-table.tsx`

- [ ] **Step 1: Install sonner for toast notifications**

Run: `npm install sonner`

- [ ] **Step 2: Add Toaster to root layout**

Update `src/app/layout.tsx` to include the Toaster:

```typescript
import { Toaster } from 'sonner'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Create users table component**

Create `src/components/admin/users-table.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { updateUserRole, deleteUser } from '@/actions/admin'
import type { Profile } from '@/types/auth'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Search, Trash2 } from 'lucide-react'

interface UsersTableProps {
  users: Profile[]
}

export function UsersTable({ users: initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState(initialUsers)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin'
    const userName = users.find(u => u.id === userId)?.full_name || userId

    // Optimistic update
    setUsers(prev => prev.map(u =>
      u.id === userId ? { ...u, role: newRole as 'customer' | 'admin' } : u
    ))

    const result = await updateUserRole(userId, newRole)

    if (result.error) {
      // Rollback on error
      setUsers(initialUsers)
      toast.error(result.error)
    } else {
      toast.success(`Updated ${userName} to ${newRole}`)
    }
  }

  const handleDelete = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete ${userName}?`)) return

    const result = await deleteUser(userId)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(`Deleted ${userName}`)
      setUsers(prev => prev.filter(u => u.id !== userId))
    }
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.full_name || 'Unnamed'}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === 'admin' ? 'default' : 'secondary'}
                      className="cursor-pointer"
                      onClick={() => handleRoleToggle(user.id, user.role)}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(user.id, user.full_name || user.email || 'User')}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-slate-500">
        {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
      </p>
    </div>
  )
}
```

- [ ] **Step 4: Ensure Table and Badge components exist**

Run: `npx shadcn@latest add table badge`

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/users-table.tsx src/components/ui/ src/app/layout.tsx package.json package-lock.json
git commit -m "feat: create users table with role toggle and delete"
```

---

## Task 14: Create Users Page

**Files:**
- Create: `src/app/admin/users/page.tsx`

- [ ] **Step 1: Create users page**

Create `src/app/admin/users/page.tsx`:

```typescript
import { getUsers } from '@/actions/admin'
import { UsersTable } from '@/components/admin/users-table'

export default async function AdminUsersPage() {
  const users = await getUsers()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-slate-600 mt-2">Manage user accounts and permissions</p>
      </div>

      <UsersTable users={users} />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/users/page.tsx
git commit -m "feat: create admin users page"
```

---

## Task 15: Create Product Form Modal Component

**Files:**
- Create: `src/components/admin/product-form-modal.tsx`

- [ ] **Step 1: Install shadcn dialog, input, textarea, select**

Run: `npx shadcn@latest add dialog input textarea select label`

- [ ] **Step 2: Create product form modal**

Create `src/components/admin/product-form-modal.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { createProduct, updateProduct } from '@/actions/admin'
import type { Product, ProductFormData } from '@/types/admin'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ProductFormModalProps {
  open: boolean
  onClose: () => void
  product?: Product
  onSuccess?: () => void
}

export function ProductFormModal({ open, onClose, product, onSuccess }: ProductFormModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<ProductFormData>>(
    product || {
      title: '',
      description: '',
      price: 0,
      category: '',
      status: 'active',
      images: [],
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const formDataObj = new FormData()
    formDataObj.append('title', formData.title || '')
    formDataObj.append('price', String(formData.price || 0))
    if (formData.description) formDataObj.append('description', formData.description)
    if (formData.category) formDataObj.append('category', formData.category)
    formDataObj.append('status', formData.status || 'active')
    formData.images?.forEach(img => formDataObj.append('images', img))

    const result = product
      ? await updateProduct(product.id, formDataObj)
      : await createProduct(formDataObj)

    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(product ? 'Product updated!' : 'Product created!')
      onClose()
      onSuccess?.()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Create Product'}</DialogTitle>
          <DialogDescription>
            {product ? 'Update product details below.' : 'Fill in the details to create a new product.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Product name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Product description"
              rows={4}
            />
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              required
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Electronics, Clothing"
            />
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'draft' | 'archived' })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Images URL */}
          <div>
            <Label htmlFor="images">Image URLs (one per line)</Label>
            <Textarea
              id="images"
              value={formData.images?.join('\n') || ''}
              onChange={(e) => setFormData({
                ...formData,
                images: e.target.value.split('\n').filter(url => url.trim())
              })}
              placeholder="https://example.com/image1.jpg"
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : product ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/admin/product-form-modal.tsx src/components/ui/
git commit -m "feat: create product form modal with validation"
```

---

## Task 16: Create Products Grid Component

**Files:**
- Create: `src/components/admin/products-grid.tsx`

- [ ] **Step 1: Create products grid component**

Create `src/components/admin/products-grid.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { deleteProduct } from '@/actions/admin'
import type { Product } from '@/types/admin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react'

interface ProductsGridProps {
  products: Product[]
  onEdit: (product: Product) => void
  onSuccess?: () => void
}

export function ProductsGrid({ products, onEdit, onSuccess }: ProductsGridProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft' | 'archived'>('all')

  const filteredProducts = products.filter(p =>
    statusFilter === 'all' || p.status === statusFilter
  )

  const handleDelete = async (productId: string, productTitle: string) => {
    if (!confirm(`Delete "${productTitle}"?`)) return

    const result = await deleteProduct(productId)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(`Deleted "${productTitle}"`)
      onSuccess?.()
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      active: 'default',
      draft: 'secondary',
      archived: 'outline',
    }
    return <Badge variant={variants[status]}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Filter by status:</label>
        <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-slate-500">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="line-clamp-1">{product.title}</CardTitle>
                {getStatusBadge(product.status)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                {product.description || 'No description'}
              </p>
              <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
              {product.category && (
                <p className="text-sm text-slate-500 mt-1">{product.category}</p>
              )}
              {product.images.length > 0 && (
                <div className="mt-3">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => onEdit(product)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(product.id, product.title)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No products found. Create your first product to get started.
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/products-grid.tsx
git commit -m "feat: create products grid with filter and actions"
```

---

## Task 17: Create Products Page

**Files:**
- Create: `src/app/admin/products/page.tsx`

- [ ] **Step 1: Create products page**

Create `src/app/admin/products/page.tsx`:

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getProducts } from '@/actions/admin'
import { ProductsGrid } from '@/components/admin/products-grid'
import { ProductFormModal } from '@/components/admin/product-form-modal'
import { Button } from '@/components/ui/button'
import type { Product } from '@/types/admin'
import { Plus } from 'lucide-react'

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setIsLoading(true)
    const data = await getProducts()
    setProducts(data)
    setIsLoading(false)
  }

  const handleCreate = () => {
    setEditingProduct(undefined)
    setIsModalOpen(true)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProduct(undefined)
  }

  const handleSuccess = () => {
    loadProducts()
    router.refresh()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading products...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-slate-600 mt-2">Manage your product inventory</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <ProductsGrid
        products={products}
        onEdit={handleEdit}
        onSuccess={handleSuccess}
      />

      <ProductFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        product={editingProduct}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/products/page.tsx
git commit -m "feat: create admin products page with CRUD"
```

---

## Task 18: Add Admin Link to Navigation (Optional)

**Files:**
- Modify: `src/components/layout/header.tsx` or similar

- [ ] **Step 1: Find header/navigation component**

Check your layout files for the header component.

- [ ] **Step 2: Add admin link for admin users**

If you have a header with navigation, add a conditional admin link:

```typescript
'use client'

import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'

export function Header() {
  const { isAdmin } = useAuth()

  return (
    <header>
      {/* ... existing header ... */}
      {isAdmin && (
        <Link href="/admin/dashboard" className="...">
          Admin
        </Link>
      )}
    </header>
  )
}
```

- [ ] **Step 3: Commit (if changes made)**

```bash
git add src/components/layout/
git commit -m "feat: add admin link to navigation"
```

---

## Task 19: Testing and Verification

**Files:**
- None (manual testing)

- [ ] **Step 1: Test database setup**

1. Go to Supabase Dashboard → Table Editor
2. Verify `profiles` table has `role` column
3. Verify `products` table exists
4. Run: `UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';`

- [ ] **Step 2: Test admin login flow**

1. Start dev server: `npm run dev`
2. Go to `/login`
3. Sign in with admin account
4. Verify redirect to `/admin/dashboard`
5. Verify sidebar shows navigation

- [ ] **Step 3: Test customer login flow**

1. Sign up new account or use existing customer
2. Sign in at `/login`
3. Verify redirect to `/account`
4. Try to access `/admin/dashboard` directly
5. Verify redirect back to `/account`

- [ ] **Step 4: Test dashboard**

1. Verify stats cards show correct numbers
2. Verify quick action buttons work

- [ ] **Step 5: Test user management**

1. Go to `/admin/users`
2. Verify users list loads
3. Test search functionality
4. Click role badge to toggle customer ↔ admin
5. Test delete user (with confirmation)

- [ ] **Step 6: Test product management**

1. Go to `/admin/products`
2. Click "Add Product"
3. Fill form and submit
4. Verify product appears in grid
5. Click edit, make changes, save
6. Click delete, confirm deletion

- [ ] **Step 7: Test mobile responsiveness**

1. Open browser dev tools, switch to mobile view
2. Verify hamburger menu appears
3. Test sidebar opens/closes
4. Verify all pages work on mobile

- [ ] **Step 8: Test security**

1. Open browser in incognito mode
2. Try accessing `/admin/dashboard` directly
3. Verify redirect to `/login`
4. Sign in as customer
5. Try accessing `/admin` routes
6. Verify redirect to `/account`

---

## Task 20: Final Cleanup

- [ ] **Step 1: Check for any TODO comments**

Run: `grep -r "TODO" src/app/admin src/components/admin src/actions/admin.ts`

- [ ] **Step 2: Run TypeScript check**

Run: `npm run build` (or `npx tsc --noEmit`)

- [ ] **Step 3: Final commit**

```bash
git add .
git commit -m "feat: complete admin dashboard implementation"
```

---

## Summary

This implementation plan creates a complete WordPress-style admin dashboard with:

1. **Server-side protection** via Next.js 16 proxy middleware
2. **Role-based access control** with automatic redirects
3. **Dashboard** with stats and quick actions
4. **User management** with search, role toggle, and delete
5. **Product CRUD** with form validation and image support
6. **Mobile responsive** sidebar navigation
7. **Security** at multiple layers (proxy, Server Actions, RLS)

**Total files created:** ~20
**Total files modified:** ~4
**Estimated time:** 2-3 hours

**References:**
- Spec: `docs/superpowers/specs/2025-03-25-admin-dashboard-design.md`
- Next.js 16 docs: https://nextjs.org/docs
- Supabase docs: https://supabase.com/docs
- shadcn/ui: https://ui.shadcn.com
