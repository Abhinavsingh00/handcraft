# FAQ Page Documentation

**Page Path:** `/faq`
**File Location:** `src/app/faq/page.tsx`
**Status:** ✅ Complete

---

## Overview
Interactive FAQ page with category filtering, search functionality, and accordion-style expandable answers. Features 18 FAQs across 6 categories with sticky category navigation.

---

## Features Implemented

### 1. Hero Section
- Gradient background: `from-primary/10 via-background to-secondary/10`
- Decorative paw prints (opacity 5%)
- Badge: "Help & Support"
- Large heading: "Frequently Asked Questions"
- Tagline about finding answers
- **Search bar:**
  - Search icon
  - Rounded-2xl input
  - Focus states with ring
  - Real-time filtering

### 2. Category Navigation (Sticky)
Sticky header with category pills:
- **All Questions** (default)
- **Shipping** (3 FAQs)
- **Products** (3 FAQs)
- **Returns** (3 FAQs)
- **Orders** (3 FAQs)
- **Product Care** (3 FAQs)

**Features:**
- Sticky: `sticky top-16`
- Backdrop blur
- Active state: Primary bg + shadow + scale
- Icons for each category

### 3. FAQ Accordion
18 expandable FAQ items with:
- White cards with shadow
- Icon in colored square
- Question text
- Expandable answer
- Chevron rotation on expand
- Staggered slide-up animation

**FAQ Categories:**

| Category | Icon | Count | Topics |
|----------|------|-------|--------|
| Shipping | Truck | 3 | Delivery time, free shipping, international |
| Products | Heart | 3 | Handmade quality, materials, custom orders |
| Returns | RefreshCw | 3 | Return policy, exchanges, replacements |
| Orders | Shield/Clock | 3 | Tracking, modifications, bulk discounts |
| Product Care | Sparkles | 3 | Leather cleaning, washing beds, rope toys |

### 4. Empty State
When search/category yields no results:
- 🔍 Emoji
- "No results found" heading
- Suggestion to adjust search

### 5. "Still Have Questions" CTA
Gradient card with:
- Heart icon in circle
- "Still have questions?" heading
- Two buttons:
  - Contact Us (Mail icon)
  - Phone number (Phone icon)

### 6. Quick Links Section
3 link cards:
- Shipping Info
- Returns (30-day happiness guarantee)
- Size Guide

---

## State Management

### React State
```typescript
selectedCategory: string (default: 'all')
openItems: Set<string> (expanded FAQ IDs)
searchQuery: string
```

### Toggle Handler
```typescript
const toggleItem = (id: string) => {
  const newSet = new Set(openItems)
  if (newSet.has(id)) {
    newSet.delete(id)
  } else {
    newSet.add(id)
  }
  setOpenItems(newSet)
}
```

### Filtering Logic
```typescript
const filteredFAQs = faqData.filter(faq => {
  const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
  const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  return matchesCategory && matchesSearch
})
```

---

## Design Elements

### Colors
- Active category: Primary bg
- Inactive: White with border
- Open FAQ icon: Primary bg
- Closed FAQ icon: Primary/10 bg

### Icons (Lucide React)
- `PawPrint` - All Questions, decorative
- `Truck` - Shipping
- `Heart` - Products
- `RefreshCw` - Returns
- `Shield` / `Clock` / `Package` - Orders
- `Sparkles` - Product Care
- `HelpCircle` - Hero badge
- `Search` - Search input
- `ChevronDown` - Expand indicator
- `ArrowRight` - Quick links

### Animations (styled-jsx)
```css
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```
Staggered delay: `index * 0.05s`

### Expand Animation
```tsx
className={`... transition-all duration-300 ${
  isOpen ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
}`}
```

---

## Technical Details

### Component Type
**Client Component** ('use client' directive)

**Why Client Component:**
- useState for open/closed items
- Interactive accordion
- Search functionality
- Category selection

### Key Files
- Page: `src/app/faq/page.tsx`
- No external images needed

### Dependencies
```tsx
'use client'
import { useState } from 'react'
import { PawPrint, ChevronDown, Mail, Phone, Truck, Heart, Shield, Clock, RefreshCw } from 'lucide-react'
import { Search, HelpCircle, Package, Sparkles, ArrowRight } from 'lucide-react'
```

### FAQ Data Structure
```typescript
interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  icon: any
}
```

---

## FAQ Data Summary

**Total FAQs:** 18
**Total Categories:** 6 (+ "All")

### Shipping FAQs
1. How long does shipping take?
2. Do you offer free shipping?
3. Do you ship internationally?

### Products FAQs
1. Are your products really handmade?
2. What materials do you use?
3. Can I get a custom order?

### Returns FAQs
1. What is your return policy?
2. What if the product doesn't fit?
3. My dog damaged the product. Can I get a replacement?

### Orders FAQs
1. How can I track my order?
2. Can I modify or cancel my order?
3. Do you offer bulk discounts?

### Product Care FAQs
1. How do I clean leather products?
2. Are the beds and blankets machine washable?
3. How do I clean the rope toys?

---

## Future Improvements

### Potential Additions
- [ ] FAQ rating (helpful/not helpful)
- [ ] Suggest related FAQs
- [ ] Print-friendly version
- [ ] FAQ search suggestions/autocomplete
- [ ] Video answers for complex questions
- [ ] Multilingual support
- [ ] Dark mode toggle
- [ ] FAQ sharing (permalinks)

### Content Additions
- [ ] Wholesale inquiries
- [ ] International returns
- [ ] Gift card FAQs
- [ ] Account management
- [ ] Payment options

### Technical Improvements
- [ ] Move animations to globals.css
- [ ] Add URL params for direct FAQ links
- [ ] Analytics for FAQ clicks
- [ ] A/B testing for category organization
- [ ] Search highlighting

---

## Related Pages
- Contact (`/contact`) - "Still have questions" CTA
- Shipping (`/shipping`) - Quick link
- Returns (`/returns`) - Quick link
- Size Guide (`/size-guide`) - Quick link

---

## Last Updated
**Date:** March 18, 2026
**Status:** Complete with styled-jsx animations
**Note:** Uses 'use client' for accordion state and filtering.
