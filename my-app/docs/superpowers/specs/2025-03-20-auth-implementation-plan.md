# Authentication + Customer Dashboard - Implementation Plan

**Based on:** 2025-03-19-authentication-dashboard-design.md
**Date:** March 20, 2025
**Scope:** Phase 1-2 (Auth + Customer Dashboard)
**Approach:** Phased implementation

---

## Phase 1: Authentication Infrastructure

### Step 1: Database Setup

**File:** `supabase/migrations/20250320_profiles_and_auth.sql`

Create profiles table with RLS policies and trigger for auto-creation on signup.

### Step 2: Create Auth Types

**File:** `src/types/auth.ts`

Define Profile, AuthUser, SignUpData, SignInData interfaces.

### Step 3: Update Supabase Server Client

**File:** `src/lib/supabase/server.ts`

Update for Next.js 16 SSR pattern.

### Step 4: Create Auth Context

**File:** `src/contexts/auth-context.tsx`

Context provider with signIn, signUp, signOut, signInWithGoogle methods.

### Step 5: Create Auth Hook

**File:** `src/hooks/use-auth.ts`

Simple wrapper for auth context.

### Step 6: Update Root Layout

**File:** `src/app/layout.tsx`

Wrap children with AuthProvider.

### Step 7: Create Auth Layout

**File:** `src/app/(auth)/layout.tsx`

Minimal centered layout for auth pages.

### Step 8: Create Login Page

**File:** `src/app/(auth)/login/page.tsx`

Email/password form + Google OAuth button.

### Step 9: Create Register Page

**File:** `src/app/(auth)/register/page.tsx`

Full name, email, password, confirm password form.

### Step 10: Create Forgot Password Page

**File:** `src/app/(auth)/forgot-password/page.tsx`

Email input for password reset.

### Step 11: Create OAuth Callback Handler

**File:** `src/app/auth/callback/route.ts`

Handle Google OAuth callback.

### Step 12: Update Navbar with Auth Buttons

**File:** `src/components/layout/navbar.tsx`

Show Login/Register when logged out, User menu when logged in.

### Step 13: Create Middleware for Route Protection

**File:** `src/middleware.ts`

Protect /account and /admin routes.

---

## Testing Checklist for Phase 1

- [ ] Navigate to /login page
- [ ] Navigate to /register page
- [ ] Create new account
- [ ] Login with email/password
- [ ] Login with Google OAuth
- [ ] Navbar shows correct state
- [ ] Logout works
- [ ] Protected routes redirect to login

---

## Next: Phase 2 (Customer Dashboard)

Once Phase 1 is tested, proceed with customer dashboard pages.
