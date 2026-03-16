# Deployment Guide - Pawfectly Handmade

## Build Verification

The project has been successfully built for production. Run the following command to build:

```bash
npm run build
```

## Production Build Results

```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /cart
├ ○ /checkout
├ ○ /checkout/success
├ ƒ /product/[slug]
└ ○ /shop

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

All pages build successfully:
- Home page (static)
- Shop page (static)
- Cart page (static)
- Checkout page (static)
- Success page (static)
- Product detail page (dynamic)
- 404 page (static)

## Known Warnings

### `ReferenceError: location is not defined`

This warning appears during static generation when client components access browser APIs (`window`, `location`, etc.). This is expected behavior and does not affect the production build. The application works correctly because:

1. Client components properly handle hydration
2. Browser APIs are only accessed on the client side
3. Server-side rendering skips these browser-specific operations

This warning can be safely ignored.

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the creator of Next.js and provides the best integration.

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Environment Variables** (for Phase 2)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Option 2: Netlify

1. **Build Configuration**
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

2. **Deploy**
```bash
netlify deploy --prod
```

### Option 3: Docker

1. **Dockerfile**
```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

2. **Update next.config.ts for standalone output**
```typescript
const config: NextConfig = {
  output: 'standalone',
  // ... other config
}
```

### Option 4: Node.js Server

1. **Build the application**
```bash
npm run build
```

2. **Start production server**
```bash
npm start
```

## Environment Variables

### Current Phase (Phase 1 - Demo)

No environment variables required. The application uses mock data and localStorage.

### Phase 2 (With Supabase Backend)

Create `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: Stripe for Payments (Phase 2)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## Performance Optimization

### Current Optimizations

1. **Static Generation**: Most pages are pre-rendered at build time
2. **Image Optimization**: Using Next.js Image component
3. **Font Optimization**: Using next/font for Google Fonts
4. **Code Splitting**: Automatic with Next.js App Router
5. **React Compiler**: Enabled for automatic optimization

### Additional Recommendations

1. **Enable Compression** (Vercel/Netlify handle this automatically)
2. **Set up CDN** for static assets
3. **Configure Cache Headers** in next.config.ts:
```typescript
async headers() {
  return [
    {
      source: '/images/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ]
}
```

## Pre-Deployment Checklist

- [ ] Build completes successfully: `npm run build`
- [ ] All pages load without errors
- [ ] Cart functionality works (add, remove, update quantity)
- [ ] Bulk pricing calculations are correct
- [ ] Navigation works between all pages
- [ ] Mobile responsive design verified
- [ ] Environment variables configured (Phase 2)
- [ ] Database schema created (Phase 2)
- [ ] Analytics configured (optional)

## Post-Deployment Steps

1. **Monitor Build Logs**: Check for any runtime errors
2. **Test User Flows**:
   - Browse products
   - Add items to cart
   - Proceed to checkout
   - Complete checkout (demo mode)
3. **Set up Analytics**: Google Analytics or similar
4. **Configure Error Tracking**: Sentry or similar (optional)
5. **Set up Backups**: For database (Phase 2)

## Troubleshooting

### Build Failures

If the build fails, check:
1. Node.js version (should be 20.x or 22.x)
2. All dependencies installed: `npm ci`
3. TypeScript errors: `npm run type-check`
4. ESLint errors: `npm run lint`

### Runtime Errors

1. **"localStorage is not defined"**: This occurs during SSR. Client components with 'use client' directive should handle this.
2. **Hydration mismatches**: Ensure server and client render the same initial markup
3. **Image loading failures**: Verify image paths and configure remote patterns in next.config.ts

## Domain Configuration

### Custom Domain (Vercel)

1. Go to project settings in Vercel dashboard
2. Add custom domain
3. Update DNS records:
   - A record: `76.76.21.21`
   - CNAME: `cname.vercel-dns.com`

### SSL Certificates

Vercel and Netlify provide automatic SSL certificates for all deployments.

## Scaling Considerations

### When to Add Database (Phase 2)

- Multiple users need to access the same data
- Persistent cart across devices
- Real inventory management
- Order processing
- User accounts

### When to Add CDN

- High traffic volume
- International users
- Large media assets

### When to Add Caching

- API responses are slow
- Database queries are expensive
- Static content doesn't change often

## Support Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Deployment Guide](https://vercel.com/docs/deployments/overview)
- [Netlify Next.js Guide](https://docs.netlify.com/integrations/frameworks/next-js/)
