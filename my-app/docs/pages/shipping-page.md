# Shipping Page Documentation

**Page Path:** `/shipping`
**File Location:** `src/app/shipping/page.tsx`
**Status:** ✅ Complete

---

## Overview
Shipping Policy page with comprehensive information about shipping options, processing times, international shipping, and package protection.

---

## Features Implemented

### 1. Hero Section
- Background image: `/images/shipping/shipping-hero.svg`
- Gradient overlay for readability
- Badge with Truck icon: "Delivery Information"
- Animated title and description
- Wave divider SVG at bottom

### 2. Shipping Options Cards
Three shipping tiers displayed in responsive grid:
- **Standard Shipping** ($4.99) - 3-5 business days - Most Popular badge
- **Expedited Shipping** ($9.99) - 2-3 business days
- **International Shipping** (Calculated) - 7-14 business days

Each card includes:
- Icon (Truck, Clock, Globe)
- Price display
- Delivery time badge
- Feature list with checkmarks
- Gradient backgrounds with colored borders

### 3. Order Processing Times
Grid layout showing:
- 1-2 business days for most orders
- 3-5 days for custom orders
- Mon-Fri processing days
- Visual number circles with gradients

### 4. International Shipping Section
Purple/pink gradient card with:
- Shipping rates info
- Delivery times
- Customs & duties notice
- Restricted items warning

### 5. Package Protection Section
Green gradient card with:
- Insurance included
- Tracking numbers
- Secure packaging
- Signature required for orders over $100
- Lost package support
- Damage claims info

### 6. APO/FPO Military Addresses
Simple section showing support for military addresses with patriotic badge.

### 7. Questions CTA
Contact CTA with gradient background, linking to `/contact`.

### 8. Related Links
Links to:
- Return Policy (`/returns`)
- FAQ (`/faq`)
- Contact Us (`/contact`)

---

## Design Elements

### Colors Used
- **Primary:** Blue tones for trust/shipping theme
- **Gradients:** From-primary/10 to-secondary/10
- **Borders:** Colored borders matching card themes (blue, orange, purple, green)

### Icons (Lucide React)
- `Truck` - Primary shipping icon
- `Package` - Packaging symbol
- `Clock` - Delivery times
- `Globe` - International shipping
- `Shield` - Package protection
- `CheckCircle` - Feature list items

### Animations
- `animate-fade-in` - Hero badge and description
- `animate-slide-up` - Hero title
- Defined in `globals.css`

### Responsive Design
- Mobile: Stacked cards
- Tablet: 2-column grid
- Desktop: 3-column grid for options

---

## Technical Details

### Component Type
**Server Component** (no 'use client' directive)

### Key Files
- Page: `src/app/shipping/page.tsx`
- Hero Image: `public/images/shipping/shipping-hero.svg`
- Styles: `src/app/globals.css` (animations)
- Font: Amatic SC (display), Cabin (body)

### Dependencies
```tsx
import Link from 'next/link'
import { Truck, Package, Clock, Globe, Shield, CheckCircle } from 'lucide-react'
```

---

## Future Improvements

### Potential Additions
- [ ] Live shipping calculator integration
- [ ] Tracking number input
- [ ] Real-time shipping rates from carriers
- [ ] Map of international shipping zones
- [ ] Shipping provider logos (USPS, UPS, FedEx)
- [ ] Holiday shipping schedule

### Content Updates
- [ ] Add express shipping options
- [ ] Include Saturday delivery option
- [ ] Add same-day delivery for local areas
- [ ] Update free shipping threshold dynamically

---

## Last Updated
**Date:** March 18, 2026
**Changes:** Added hero image, wave divider, animations
