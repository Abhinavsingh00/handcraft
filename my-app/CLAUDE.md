# Next.js 16 + Tailwind CSS v4 + shadcn/ui Project Guidelines

This project is built with the latest modern web technologies for 2026.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.6 | React framework with App Router |
| React | 19.2.3 | UI library with React Compiler enabled |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | v4.x | Utility-first styling (CSS-first config) |
| shadcn/ui | Latest | Accessible component primitives |

## Key Technologies & Changes

### Next.js 16 Highlights

- **App Router** (default) - File-based routing with layouts and streaming
- **React Server Components** - Reduced client JavaScript by default
- **Turbopack** - Faster development builds (enabled via `--turbopack`)
- **React Compiler** - Automatic optimization (enabled in `next.config.ts`)
- **Proxy file** - Renamed from `middleware.ts` to `proxy.ts`

### Tailwind CSS v4 Changes

- **CSS-first configuration** - Uses `@import "tailwindcss"` instead of `@tailwind` directives
- **`@theme` directive** - Configuration moved from JS config to CSS
- **No more `tailwind.config.js`** for basic setup (we keep one for shadcn/ui theming)
- **Oxide engine** - Rust-powered for 2-5x faster builds
- **Automatic content detection** - No manual content arrays needed

### shadcn/ui

- **Copy-paste components** - Components are copied to your project, not installed
- **Full customization** - You own the code, modify as needed
- **Radix UI primitives** - Built on accessible foundations
- **Tailwind-based** - Uses your Tailwind theme

## Project Structure

```
my-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with fonts
│   │   ├── page.tsx            # Home page
│   │   ├── globals.css         # Global styles + Tailwind v4 + CSS variables
│   │   └── proxy.ts            # (optional) Request interception
│   ├── components/             # React components
│   │   └── ui/                 # shadcn/ui components
│   │       └── button.tsx      # Example component
│   └── lib/                    # Utility functions
│       └── utils.ts            # cn() helper for merging classes
├── public/                     # Static assets
├── components.json             # shadcn/ui CLI configuration
├── tailwind.config.ts          # Tailwind configuration (for shadcn theming)
├── next.config.ts              # Next.js configuration (React Compiler enabled)
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## File Conventions

### App Router

- **`layout.tsx`** - Shared UI between routes (navigation, footer)
- **`page.tsx`** - Unique UI of a route
- **`loading.tsx`** - Loading UI with React Suspense
- **`error.tsx`** - Error UI for route segments
- **`not-found.tsx`** - 404 UI for unmatched routes
- **`proxy.ts`** - Request interception (formerly middleware.ts)

### Dynamic Routes

- **`[slug]`** - Single segment dynamic route
- **`[...slug]`** - Catch-all route (matches nested paths)
- **`[[...slug]]`** - Optional catch-all (matches root too)

### Route Groups

- **`(group)`** - Organize routes without affecting URL
- **`@slot`** - Parallel routes for split views

## Best Practices

### 1. Use Server Components by Default

```tsx
// app/page.tsx - Server Component (default)
export default async function Page() {
  const data = await fetch('https://api.example.com/data')
  return <div>{data.title}</div>
}
```

Only add `'use client'` when:
- Using React hooks (useState, useEffect, etc.)
- Using browser APIs (window, document, etc.)
- Handling user interactions (onClick, onChange, etc.)

### 2. Data Fetching

**Server Components (Preferred):**
```tsx
// Built-in caching, revalidation, deduplication
async function getUsers() {
  const res = await fetch('https://api.example.com/users', {
    next: { revalidate: 3600 } // Cache for 1 hour
  })
  return res.json()
}
```

**Server Actions:**
```tsx
'use server'
export async function updateUser(formData: FormData) {
  // Mutations go here
}
```

**Route Handlers (for external consumption):**
```tsx
// app/api/users/route.ts
export async function GET() {
  return Response.json({ users: [] })
}
```

### 3. Styling with Tailwind v4

```tsx
// Use utility classes directly
<div className="flex items-center gap-4 p-4 bg-card text-card-foreground rounded-lg">
```

```css
/* For custom themes, use CSS variables in globals.css */
:root {
  --primary: 0 0% 9%;
}

@theme inline {
  --color-primary: hsl(var(--primary));
}
```

### 4. Using shadcn/ui Components

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  )
}
```

### 5. Class Merging with cn()

```tsx
import { cn } from "@/lib/utils"

// Merge and override Tailwind classes
<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  isActive && "active-classes",
  className // allow consumer to override
)} />
```

### 6. TypeScript Best Practices

```tsx
// Define component props
interface UserCardProps {
  name: string
  email?: string // Optional
  onUpdate: () => void
}

export function UserCard({ name, email, onUpdate }: UserCardProps) {
  return <div>{name}</div>
}
```

## Common Patterns

### Suspense Boundaries

```tsx
import { Suspense } from 'react'

export default function Page() {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <AsyncComponent />
      </Suspense>
    </div>
  )
}
```

### Parallel Data Fetching

```tsx
// Good: Parallel fetching
const [users, posts] = await Promise.all([
  fetchUsers(),
  fetchPosts()
])

// Bad: Sequential fetching (waterfall)
const users = await fetchUsers()
const posts = await fetchPosts()
```

### Form Handling with Server Actions

```tsx
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const schema = z.object({
  name: z.string().min(1),
})

export async function createUser(formData: FormData) {
  const data = schema.parse(Object.fromEntries(formData))
  // Create user...
  revalidatePath('/users')
}
```

## Adding New shadcn/ui Components

```bash
# Using the CLI
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog

# Or manually from https://ui.shadcn.com/docs/components
```

## Development

```bash
# Start development server (with Turbopack)
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Run linter
npm run lint
```

## Important Notes

1. **React Compiler is enabled** - No need for manual `useMemo` or `useCallback` in most cases
2. **Use Server Components** - They're the default and more performant
3. **Client-side state** - Use Zustand, Jotai, or React Context for client state
4. **Forms** - Use React Hook Form + Zod for validation
5. **API routes** - Prefer Server Actions for mutations, Route Handlers for GET/external APIs

## Resources

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [React Compiler Documentation](https://react.dev/learn/react-compiler)

## Migration Notes (from older versions)

### From Next.js 15 to 16
- `middleware.ts` → `proxy.ts`
- React Compiler is now stable and production-ready
- New `@theme` directive for Tailwind v4

### From Tailwind v3 to v4
- `@tailwind base;` → `@import "tailwindcss";`
- Config moves to CSS with `@theme inline`
- PostCSS plugin changes to `@tailwindcss/postcss`
