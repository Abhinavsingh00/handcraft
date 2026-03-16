# Next.js 16 + Tailwind CSS v4 + shadcn/ui

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), configured with the latest modern web technologies for 2026.

## Tech Stack

- **Next.js 16.1.6** - React framework with App Router
- **React 19.2.3** - UI library with React Compiler enabled
- **TypeScript 5.x** - Type safety
- **Tailwind CSS v4** - Utility-first styling (CSS-first configuration)
- **shadcn/ui** - Accessible component primitives
- **ESLint** - Code linting
- **Turbopack** - Faster development builds

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Adding shadcn/ui Components

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

## Project Structure

```
src/
├── app/              # Next.js App Router
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Home page
│   └── globals.css   # Global styles
├── components/       # React components
│   └── ui/           # shadcn/ui components
└── lib/              # Utility functions
```

## Documentation

See [CLAUDE.md](./CLAUDE.md) for comprehensive project guidelines, best practices, and Next.js 16 + Tailwind v4 specific patterns.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [React Compiler Documentation](https://react.dev/learn/react-compiler)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Backend Integration

This project uses Supabase as the backend for product data. See [docs/BACKEND-SETUP.md](docs/BACKEND-SETUP.md) for setup instructions.

### Environment Configuration

```bash
# .env.local
NEXT_PUBLIC_DATA_SOURCE=mock|supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Data Source Toggle

- `mock`: Use local mock data (default, for development)
- `supabase`: Use Supabase database (production mode)

### Database Schema

Products table with categories, pricing, images, features, and bulk pricing tiers.

See `supabase/migrations/` for schema definitions.
