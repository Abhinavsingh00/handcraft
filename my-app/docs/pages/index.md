# Pages Documentation Index

This directory contains documentation for each page in the Pawfectly Handmade application.

---

## Available Page Documentation

| Page | Path | Status | Last Updated | Type |
|------|------|--------|--------------|------|
| [About Page](./about-page.md) | `/about` | ✅ Complete | Mar 18, 2026 | Client |
| [Contact Page](./contact-page.md) | `/contact` | ✅ Complete | Mar 18, 2026 | Client |
| [Shop Page](./shop-page.md) | `/shop` | ✅ Complete | Mar 18, 2026 | Client |
| [FAQ Page](./faq-page.md) | `/faq` | ✅ Complete | Mar 18, 2026 | Client |
| [Shipping Page](./shipping-page.md) | `/shipping` | ✅ Complete | Mar 18, 2026 | Server |
| [Returns Page](./returns-page.md) | `/returns` | ✅ Complete | Mar 18, 2026 | Server |
| [Privacy Policy](./privacy-page.md) | `/privacy` | ✅ Complete | Mar 18, 2026 | Server |
| [Terms of Service](./terms-page.md) | `/terms` | ✅ Complete | Mar 18, 2026 | Server |
| Home Page | `/` | ✅ Complete | - | - |
| Cart Page | `/cart` | ✅ Complete | - | - |
| Checkout | `/checkout` | ✅ Complete | - | - |
| Product Detail | `/product/[slug]` | ✅ Complete | - | - |
| Checkout Success | `/checkout/success` | ✅ Complete | - | - |

---

## Documentation Quick Links

### Marketing Pages
- [About](./about-page.md) - Brand story, team, values
- [Contact](./contact-page.md) - Form, info, location
- [Shop](./shop-page.md) - Product catalog with filters

### Information Pages
- [FAQ](./faq-page.md) - 18 FAQs with search & categories
- [Shipping](./shipping-page.md) - Shipping options & policies
- [Returns](./returns-page.md) - Return policy & process

### Legal Pages
- [Privacy](./privacy-page.md) - Data collection & usage
- [Terms](./terms-page.md) - Terms of service

---

## Page Types

### Client Components
Require `'use client'` directive:
- Interactive forms (Contact)
- State management (Shop filters, FAQ accordion)
- User interactions (all)

### Server Components
Default for static content:
- Legal pages (Privacy, Terms)
- Content pages (Shipping, Returns after animation fix)

---

## How to Use This Documentation

When working on a page:
1. Read the corresponding documentation file
2. Understand the features and design elements
3. Make your changes
4. Update the documentation with your changes
5. Update the "Last Updated" date

---

## Documentation Template

When adding new pages, use this template:

```markdown
# [Page Name] Documentation

**Page Path:** `/path`
**File Location:** `src/app/path/file.tsx`
**Status:** ✅ Complete / 🚧 In Progress

## Overview
[Brief description of page purpose]

## Features Implemented
[List all features]

## Design Elements
[Colors, icons, animations used]

## Technical Details
[Component type, dependencies]

## Future Improvements
[Planned features]

## Last Updated
**Date:** [Date]
**Changes:** [What was done]
```

---

## Quick Reference

### Common Icons Used (Lucide React)
- `Heart` - Love, care, favorites
- `Truck` - Shipping, delivery
- `Package` - Products, boxes
- `Clock` - Time, processing
- `CheckCircle` - Positive confirmation
- `AlertCircle` - Warnings, important info
- `Mail` - Email, contact
- `PawPrint` - Brand element, dogs
- `Shield` - Security, privacy
- `RefreshCw` - Returns, exchanges

### Common Color Gradients
- `from-primary/10 via-background to-secondary/10` - Standard hero
- `from-primary to-secondary` - CTA banners
- `from-green-50 to-emerald-50` - Positive sections
- `from-red-50 to-orange-50` - Warning sections
- `from-purple-50 to-pink-50` - Special features

### Common Animations (in globals.css)
- `animate-fade-in` - Fade in effect (0.8s)
- `animate-slide-up` - Slide up from bottom (0.6s)

---

## Notes

- All pages use Server Components by default (unless 'use client' is needed)
- Animations are defined in `globals.css` to avoid hydration errors
- Hero images use SVG format for scalability
- All pages link to related pages for better UX
- Footer and Navbar are shared components
