# Admin Dashboard Design Specification

**Date:** 2025-03-25
**Status:** Approved
**Version:** 1.0

## Overview

Implement a WordPress-style admin dashboard with role-based access control. Users are categorized as 'customer' or 'admin' with separate dashboards and access permissions.

## Requirements

- Single login page with automatic role-based redirection
- Server-side route protection for admin routes
- WordPress-inspired admin UI with sidebar navigation
- Scalable architecture for future features

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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Row Level Security (RLS)

```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can insert products"
  ON products FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));
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
// proxy.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function proxy(request) {
  const supabase = createServerClient(/* ... */)
  const { data: { session } } = await supabase.auth.getSession()

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
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

### Server Actions

```typescript
// actions/admin.ts
'use server'

export async function createProduct(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    return { error: 'Unauthorized' }
  }

  // Create product...
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

  const { error } = await signIn(email, password)

  if (!error) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'admin') {
      router.push('/admin/dashboard')
    } else {
      router.push('/account')
    }
    router.refresh()
  }
}
```

### Sign Up Flow

```typescript
// Default new users to 'customer' role
await supabase.from('profiles').insert({
  id: user.id,
  full_name: fullName,
  role: 'customer',
  email: email,
})
```

---

## Error Handling

### Authentication Errors
- Invalid credentials → Show error message
- Unverified email → Prompt to check email
- Session expired → Auto-redirect to login

### Authorization Errors
- Non-admin accessing `/admin/*` → Redirect to `/account`
- Unauthorized Server Action → Return `{ error: 'Unauthorized' }`

### User Feedback
- Toast notifications for success/error
- Clear validation messages
- Loading skeletons during data fetch
- Smooth redirects

### Error Logging
- Log critical errors to console
- Include user context (not sensitive data)
- Track failed authorization attempts

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

## Deployment Steps

1. **Database Migration**
   - Run SQL in Supabase SQL Editor
   - Verify tables and RLS policies

2. **Code Deployment**
   ```bash
   git add .
   git commit -m "feat: Add admin dashboard with role-based access"
   git push origin main
   ```

3. **Production Testing**
   - Test authentication flow
   - Test admin features
   - Verify role protection

4. **Create Admin User**
   - Create via Supabase dashboard
   - Set role to 'admin' manually
   - Test login and access

---

## Future Enhancements

- Analytics dashboard
- Settings management
- Order management
- Content editor
- Bulk operations
- Export/Import features
