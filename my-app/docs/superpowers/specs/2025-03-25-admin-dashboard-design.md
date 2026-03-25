# Admin Dashboard Design Specification

**Date:** 2025-03-25
**Status:** Approved
**Version:** 1.1

## Overview

Implement a WordPress-style admin dashboard with role-based access control. Users are categorized as 'customer' or 'admin' with separate dashboards and access permissions.

## Requirements

- Single login page with automatic role-based redirection
- Server-side route protection for admin routes
- WordPress-inspired admin UI with sidebar navigation
- Scalable architecture for future features
- WCAG 2.1 Level AA accessibility compliance

---

## Architecture

### Hybrid Approach (Recommended)

**Server-side:** Role protection via middleware, Server Actions for mutations
**Client-side:** Interactive UI components for rich user experience

### Route Structure

```
/admin
├── /dashboard          # Overview with stats
├── /users              # User management
├── /products           # Product CRUD
└── /layout.tsx         # Protected admin layout with sidebar
```

### Authentication Flow

```
User logs in at /login
  ↓
Auth context fetches profile with role
  ↓
If role = 'admin' → redirect to /admin/dashboard
If role = 'customer' → redirect to /account
```

---

## Database Schema

### 1. Profiles Table (Update)

```sql
-- Add role column with default
ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'customer';

-- Add check constraint
ALTER TABLE profiles ADD CONSTRAINT check_role
  CHECK (role IN ('customer', 'admin'));

-- Add index for role queries
CREATE INDEX idx_profiles_role ON profiles(role);
```

### 2. Products Table (New)

```sql
CREATE TABLE products (
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

-- Indexes for common queries
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_created_by ON products(created_by);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 3. Row Level Security (RLS)

```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can insert products"
  ON products FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

### 4. Initial Admin Setup

```sql
-- Create first admin user (run in Supabase SQL Editor)
-- Replace with actual email after user signs up
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-admin-email@example.com';
```

---

## Components

### Server Components

| Component | Location | Purpose |
|-----------|----------|---------|
| Admin Layout | `app/admin/layout.tsx` | Protected wrapper with sidebar |
| Dashboard Page | `app/admin/dashboard/page.tsx` | Overview stats |
| Users Page | `app/admin/users/page.tsx` | User management |
| Products Page | `app/admin/products/page.tsx` | Product management |

### Client Components

| Component | Location | Purpose |
|-----------|----------|---------|
| Admin Sidebar | `components/admin/admin-sidebar.tsx` | Navigation |
| Users Table | `components/admin/users-table.tsx` | User list with actions |
| Products Grid | `components/admin/products-grid.tsx` | Product display |
| Product Form | `components/admin/product-form.tsx` | Add/Edit product |
| Dashboard Stats | `components/admin/dashboard-stats.tsx` | Stats cards |

---

## Server-Side Protection

### Proxy Middleware (Next.js 16)

```typescript
// app/proxy.ts (at root of app directory)
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

### Server Actions with Zod Validation

```typescript
// app/actions/admin.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const ProductSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be positive'),
  category: z.string().optional(),
  status: z.enum(['active', 'draft', 'archived']).default('active'),
  images: z.array(z.string()).default([]),
})

export async function createProduct(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Authentication required' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    console.warn(`Unauthorized product creation attempt by user ${user.id}`)
    return { error: 'Unauthorized' }
  }

  // Validate input
  const validatedData = ProductSchema.safeParse(Object.fromEntries(formData))
  if (!validatedData.success) {
    return { error: validatedData.error.errors[0].message }
  }

  const { data, error } = await supabase
    .from('products')
    .insert({
      ...validatedData.data,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Product creation failed:', error)
    return { error: 'Failed to create product' }
  }

  revalidatePath('/admin/products')
  revalidatePath('/shop')
  return { success: true, data }
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Authentication required' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    console.warn(`Unauthorized product update attempt by user ${user.id}`)
    return { error: 'Unauthorized' }
  }

  const validatedData = ProductSchema.safeParse(Object.fromEntries(formData))
  if (!validatedData.success) {
    return { error: validatedData.error.errors[0].message }
  }

  const { error } = await supabase
    .from('products')
    .update(validatedData.data)
    .eq('id', id)

  if (error) {
    console.error('Product update failed:', error)
    return { error: 'Failed to update product' }
  }

  revalidatePath('/admin/products')
  revalidatePath('/shop')
  revalidatePath(`/product/${id}`)
  return { success: true }
}

export async function deleteProduct(id: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Authentication required' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    console.warn(`Unauthorized product deletion attempt by user ${user.id}`)
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Product deletion failed:', error)
    return { error: 'Failed to delete product' }
  }

  revalidatePath('/admin/products')
  revalidatePath('/shop')
  return { success: true }
}
```

---

## Client-Side Features

### Admin Sidebar

- Fixed left sidebar (dark theme)
- Collapsible on mobile
- Active route highlighting
- Icons for each section
- User info display
- Sign out button

### User Management

- Searchable user list
- Role toggle (customer ↔ admin)
- Delete user with confirmation
- Pagination

### Product Management

- Grid/list view toggle
- Create/Edit/Delete products
- Image upload with preview
- Category selection
- Status toggle (active/draft/archived)

### Dashboard Overview

- Total users count
- Total products count
- Recent activity feed
- Quick action buttons

---

## Login Flow

### Updated Login Handler

```typescript
// app/(auth)/login/page.tsx
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

  // Wait for auth state to update, then redirect based on role
  // The auth context will handle the redirection once profile is loaded
  setTimeout(() => {
    router.push('/account')  // Default fallback
    router.refresh()
  }, 500)
}
```

### Auth Context with Auto-Redirect

```typescript
// contexts/auth-context.tsx
const [user, setUser] = useState<User | null>(null)
const [profile, setProfile] = useState<Profile | null>(null)
const router = useRouter()

useEffect(() => {
  if (!supabase) return

  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    setUser(session?.user ?? null)

    if (session?.user) {
      const { data } = await fetchProfile(session.user.id)
      setProfile(data)

      // Auto-redirect based on role after login
      if (event === 'SIGNED_IN' && data?.role === 'admin') {
        router.push('/admin/dashboard')
        router.refresh()
      }
    } else {
      setProfile(null)
    }
    setLoading(false)
  })

  return () => subscription.unsubscribe()
}, [supabase, router])
```

### Sign Up Flow

```typescript
// Default new users to 'customer' role
await supabase.from('profiles').insert({
  id: user.id,
  full_name: fullName,
  email: email,
  role: 'customer',  // Always default to customer
})
```

---

## Error Handling

### Authentication Errors
- Invalid credentials → Show error message
- Unverified email → Prompt to check email
- Session expired → Auto-redirect to login

### Authorization Errors
- Non-admin accessing `/admin/*` → Redirect to `/account` with toast: "You don't have permission to access this page"
- Unauthorized Server Action → Return `{ error: 'Unauthorized' }`

### User Feedback
- Toast notifications for success/error (using sonner or react-hot-toast)
- Clear validation messages with field-level errors
- Loading skeletons during data fetch
- Smooth redirects with proper state cleanup

### Error Logging
- Log critical errors to console with context
- Include user ID (not sensitive data) for debugging
- Track failed authorization attempts for security monitoring
```typescript
// Example logging utility
function logError(context: string, error: unknown, userId?: string) {
  console.error(`[${context}]`, {
    error: error instanceof Error ? error.message : String(error),
    userId: userId?.substring(0, 8) + '...', // Partial ID for security
    timestamp: new Date().toISOString(),
  })
}
```

---

## Security Considerations

### Input Validation
- All Server Actions use Zod schema validation
- Sanitize HTML in product descriptions (prevent XSS)
- Validate file types and sizes for image uploads (max 5MB, images only)

### Rate Limiting
- Implement rate limiting on login attempts (5 attempts per 15 minutes)
- Rate limit product creation/deletion (10 actions per minute)

### CSRF Protection
- Next.js Server Actions have built-in CSRF protection
- Additional double-submit cookie pattern for sensitive operations

### Session Management
- Session refresh handled automatically by Supabase
- Short session timeout for admin users (optional: 1 hour)
- Force re-authentication for critical actions (delete user, etc.)

### Audit Trail
```typescript
// Log all admin actions for audit
async function logAdminAction(action: string, details: Record<string, any>) {
  const supabase = createClient()
  await supabase.from('audit_logs').insert({
    admin_id: user.id,
    action,
    details,
    timestamp: new Date().toISOString(),
  })
}
```

---

## UI/UX Specifications

### Design Tokens (Tailwind)

```css
/* Admin-specific theme overrides */
:root {
  --admin-sidebar-bg: 0 0% 10%;      /* slate-950 */
  --admin-sidebar-text: 0 0% 100%;   /* white */
  --admin-accent: 221 83% 53%;       /* blue-500 */
  --admin-accent-hover: 221 83% 45%; /* blue-600 */
}
```

### Component Props Interfaces

```typescript
// components/admin/admin-sidebar.tsx
interface AdminSidebarProps {
  currentPath: string
  user: User & { profile: Profile }
  isCollapsed: boolean
  onToggle: () => void
}

// components/admin/users-table.tsx
interface UsersTableProps {
  users: Profile[]
  onRoleChange: (userId: string, newRole: string) => Promise<void>
  onDelete: (userId: string) => Promise<void>
}

// components/admin/product-form.tsx
interface ProductFormProps {
  product?: Product
  onSubmit: (data: ProductFormData) => Promise<void>
  onCancel: () => void
}
```

### Responsive Breakpoints
- Desktop (≥1024px): Full sidebar, 3-column grids
- Tablet (768-1023px): Collapsible sidebar, 2-column grids
- Mobile (<768px): Hamburger menu, single column, full-width drawer

### Accessibility (WCAG 2.1 AA)
- All interactive elements keyboard accessible
- ARIA labels for icon-only buttons
- Focus visible on all focusable elements
- Color contrast ≥ 4.5:1 for text
- Form labels associated with inputs
- Error messages announced to screen readers

### Loading States
```typescript
// Skeleton loaders for:
- User table rows
- Product cards
- Stats cards

// Button loading states:
- Disable button during submission
- Show spinner with text
- Revert on success/error
```

---

## State Management

### Client State
- React Context for auth state (already implemented)
- Local component state for UI interactions (modals, forms, filters)
- URL search params for pagination and filters

### Server State
- Server Components fetch fresh data on each request
- Revalidation after mutations via `revalidatePath()`
- No client-side caching for admin data (always fresh)

### Optimistic Updates
```typescript
// Update UI immediately, rollback on error
const [users, setUsers] = useState(usersList)

const handleRoleToggle = async (userId: string, newRole: string) => {
  // Optimistic update
  setUsers(prev => prev.map(u =>
    u.id === userId ? { ...u, role: newRole } : u
  ))

  const result = await updateUserRole(userId, newRole)

  if (result.error) {
    // Rollback on error
    setUsers(usersList)
    toast.error(result.error)
  } else {
    toast.success('Role updated')
  }
}
```

---

## Testing Strategy

### Unit Testing (Vitest)
- Test Server Actions with mocked Supabase client
- Test validation schemas
- Test utility functions

### Integration Testing
- Test auth flow (login, signup, logout)
- Test role-based redirects
- Test CRUD operations with test database

### E2E Testing (Playwright)
- Admin login and navigation
- User management (create, update role, delete)
- Product management (create, edit, delete)
- Mobile responsiveness

### Performance Budget
- Initial page load: < 2s
- Time to Interactive: < 3s
- First Contentful Paint: < 1s
- Lighthouse score: ≥ 90 on all categories

---

## Testing Checklist

### Authentication
- [ ] Customer login → redirects to /account
- [ ] Admin login → redirects to /admin/dashboard
- [ ] Sign up → defaults to 'customer' role
- [ ] Sign out → clears session

### Authorization
- [ ] Customer tries /admin → redirected to /account
- [ ] Admin logout → can't access /admin
- [ ] Direct URL access protected

### Admin Features
- [ ] Dashboard shows correct stats
- [ ] Users list loads
- [ ] User role toggle works
- [ ] Product CRUD works
- [ ] Image upload works
- [ ] Mobile responsive

---

## Edge Cases & Fallbacks

### Role Changes During Session
- When admin's role changed to customer: next auth check redirects them
- When customer's role changed to admin: requires logout/login for access
- Listen to auth state changes and react accordingly

### Deleted Users
- Products retain `created_by` UUID even if user deleted
- Display "Unknown User" or "Deleted Account" for missing users
- Soft delete option instead of hard delete for users

### Missing Role in Profiles
- Database constraint ensures role is always set
- Fallback: treat missing role as 'customer'
- Log warning for investigation

### Concurrent Edits
- Last write wins for product edits
- Consider adding `updated_by` and conflict detection
- Show "edited by another user" warning if needed

### Image Upload Failures
- Validate file size before upload (max 5MB)
- Validate file type (images only: jpg, png, webp, gif)
- Show clear error message on failure
- Store images in Supabase Storage with RLS

### Network Errors
- Retry failed mutations with exponential backoff
- Show clear error messages
- Allow retry or cancel option
- Preserve form data on failure

### Session Expiry
- Auto-redirect to login on 401 errors
- Preserve intended destination for post-login redirect
- Show "Session expired" toast message

---

## Deployment Steps

### 1. Database Migration

Run in Supabase SQL Editor:

```sql
-- Step 1: Add role column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer';
ALTER TABLE profiles ADD CONSTRAINT check_role CHECK (role IN ('customer', 'admin'));

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

-- Step 3: Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_by ON products(created_by);

-- Step 4: Create update trigger
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

-- Step 5: Enable RLS and create policies
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

### 2. Create First Admin User

**Option A: Via Supabase Dashboard (Recommended)**
1. Sign up a user through your app
2. Go to Supabase Dashboard → Table Editor → profiles
3. Find the user and change `role` to 'admin'

**Option B: Via SQL (After User Signs Up)**
```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-admin-email@example.com';
```

### 3. Code Deployment

```bash
git add .
git commit -m "feat: Add admin dashboard with role-based access control"
git push origin main
```

### 4. Production Testing Checklist

```bash
# Test authentication
[ ] Customer login works, redirects to /account
[ ] Admin login works, redirects to /admin/dashboard
[ ] Sign up creates customer role by default
[ ] Sign out clears session correctly

# Test authorization
[ ] Customer cannot access /admin routes (redirected)
[ ] Admin can access all /admin routes
[ ] Direct URL access protected by middleware

# Test admin features
[ ] Dashboard loads and shows stats
[ ] Users list displays correctly
[ ] User role toggle works
[ ] Product CRUD operations work
[ ] Image upload works
[ ] Mobile responsive sidebar

# Test security
[ ] Non-admin server actions return unauthorized
[ ] RLS policies prevent unauthorized DB access
[ ] Session expiry redirects correctly
```

### 5. Rollback Plan

If critical issues arise:

```sql
-- Rollback database changes
DROP TABLE IF EXISTS products CASCADE;
ALTER TABLE profiles DROP COLUMN IF EXISTS role;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS check_role;
```

```bash
# Rollback code deployment
git revert HEAD
git push origin main
```

---

## Rollback Plan

### Database Rollback
```sql
-- Reverse migration script
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP FUNCTION IF EXISTS update_updated_at_column;
DROP INDEX IF EXISTS idx_products_created_by;
DROP INDEX IF EXISTS idx_products_category;
DROP INDEX IF EXISTS idx_products_status;
DROP INDEX IF EXISTS idx_profiles_role;
DROP TABLE IF EXISTS products;
ALTER TABLE profiles DROP COLUMN IF EXISTS role;
```

### Feature Flags
Add environment variable to disable admin dashboard:
```typescript
const ADMIN_ENABLED = process.env.ADMIN_DASHBOARD_ENABLED === 'true'

if (!ADMIN_ENABLED) {
  return NextResponse.redirect(new URL('/account', request.url))
}
```

---

## Future Enhancements

- Analytics dashboard
- Settings management
- Order management
- Content editor
- Bulk operations
- Export/Import features
