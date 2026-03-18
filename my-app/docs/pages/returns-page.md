# Returns Page Documentation

**Page Path:** `/returns`
**File Location:** `src/app/returns/page.tsx`
**Status:** ✅ Complete

---

## Overview
Returns & Refunds Policy page featuring 30-day happiness guarantee, clear return process timeline, eligibility conditions, and refund information.

---

## Features Implemented

### 1. Hero Section
- Background image: `/images/returns/returns-hero.svg`
- Gradient overlay for readability
- Badge with Heart icon: "Happiness Guarantee"
- Animated title and description
- Wave divider SVG at bottom

### 2. Happiness Guarantee Banner
Prominent gradient banner (primary to secondary):
- Smile icon in decorative circle
- Large heading: "Our 30-Day Happiness Guarantee"
- Reassuring message about customer satisfaction
- Background pattern overlay

### 3. Return Process Timeline
4-step vertical timeline with connected steps:
1. **Initiate Return** - Contact within 30 days
2. **Receive Approval** - Instructions within 24 hours
3. **Ship Item Back** - Prepaid label provided
4. **Receive Refund** - 5-7 business days

Each step:
- Numbered circle (secondary color)
- White card with shadow
- Title and description

### 4. Return Conditions Grid
Two-column comparison:

#### Eligible for Return (Green)
- Returned within 30 days
- Item unused in original packaging
- All tags attached
- Proof of purchase
- Custom orders with defects
- Wrong items shipped

#### Not Eligible for Return (Red)
- After 30-day period
- Signs of wear/use
- Missing original packaging
- Custom orders without defects
- Sale items (final sale)
- Personalized items with no defects

### 5. Refund Information Section
Gradient card with two subsections:

#### Refund Timeline
- 5-7 business days processing
- Credit to original payment method
- Email confirmation

#### Exchanges
- Free size/color exchanges
- Replacement sent right away
- Prepaid return label

#### Custom Orders Note
Special notice about custom-made items.

### 6. Damaged/Wrong Items Section
Dedicated section for issues:
- Contact immediately with photo
- Free replacement
- No return needed for damaged items
- Carrier claims handled by us

### 7. Contact CTA
Large gradient section with:
- RefreshCw icon
- "Ready to Start a Return?" heading
- Link to `/contact`

### 8. Related Links
Links to:
- Shipping Policy (`/shipping`)
- FAQ (`/faq`)
- Contact Us (`/contact`)

---

## Design Elements

### Colors Used
- **Primary:** Orange tones (brand primary)
- **Secondary:** Warm orange (brand secondary)
- **Green:** For eligible items
- **Red:** For ineligible items
- **Gradients:** From-secondary/10 to-primary/10

### Icons (Lucide React)
- `RefreshCw` - Returns/refresh icon
- `Smile` - Happiness guarantee
- `Heart` - Care and love
- `Clock` - Refund timeline
- `CheckCircle` - Eligible items / positive
- `AlertCircle` - Not eligible items / warnings

### Animations
- `animate-fade-in` - Hero badge and description
- `animate-slide-up` - Hero title
- Defined in `globals.css`

### Responsive Design
- Mobile: Timeline stacked, conditions 1 column
- Tablet: Conditions 2 columns
- Desktop: Full layout with centered content

---

## Technical Details

### Component Type
**Server Component** (no 'use client' directive)

### Key Files
- Page: `src/app/returns/page.tsx`
- Hero Image: `public/images/returns/returns-hero.svg`
- Styles: `src/app/globals.css` (animations)
- Font: Amatic SC (display), Cabin (body)

### Dependencies
```tsx
import Link from 'next/link'
import { RefreshCw, Smile, Heart, Clock, CheckCircle, AlertCircle } from 'lucide-react'
```

---

## Future Improvements

### Potential Additions
- [ ] Online return form integration
- [ ] Return label generation
- [ ] Return tracking status
- [ ] Print return label button
- [ ] Exchange product selector
- [ ] Return reason analytics
- [ ] FAQ accordion for common return questions

### Content Updates
- [ ] Add return shipping cost details
- [ ] Include international return process
- [ ] Add store credit option
- [ ] Update return window for holidays
- [ ] Add gift return policy

---

## Last Updated
**Date:** March 18, 2026
**Changes:** Added hero image, wave divider, animations
