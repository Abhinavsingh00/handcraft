# About Page Documentation

**Page Path:** `/about`
**File Location:** `src/app/about/page.tsx`
**Status:** ✅ Complete

---

## Overview
Brand story page showcasing the origin story, company values, crafting process, team members, and a call-to-action. Uses editorial layout with polaroid-style team cards and timeline process section.

---

## Features Implemented

### 1. Hero Section - Editorial Layout
- Background image: `/images/about/hero-dogs.jpg`
- Gradient overlay: `from-background/80 via-background/60 to-background`
- Badge with pulsing dot: "Our Story"
- **Staggered animated headline:**
  - "Crafted with" (0.1s delay)
  - "love, for" (0.2s delay)
  - "your best friend" (0.3s delay)
- Large tagline with animation delays
- Wave divider SVG at bottom

### 2. Origin Story Section
Asymmetrical grid layout (12-column):
- **Image column (offset, span 5):**
  - Rotated image container (rotate-2)
  - Hover effect: rotation resets
  - Floating "Founded 2019" badge
  - Shadow and rounded corners

- **Content column (span 5):**
  - Story about Barnaby (rescue dog)
  - Company mission statement
  - **Quick facts grid:**
    - 5K+ Happy Dogs
    - 100% Handmade
    - 50+ Products

### 3. Values Grid Section
Four value cards in responsive grid with:
- Background decorative blurred circles
- Each card has unique color scheme:

| Value | Icon | Colors | Animation |
|-------|------|--------|-----------|
| Made with Love | Heart | Pink/Rose | 0.1s delay |
| Premium Materials | Award | Amber/Yellow | 0.2s delay |
| Eco-Friendly | Leaf | Green/Emerald | 0.3s delay |
| Fast Shipping | Truck | Blue/Cyan | 0.4s delay |

**Card features:**
- Gradient backgrounds
- Colored borders
- Hover effects: shadow + translate up
- Decorative paw print overlay
- Icon in white rounded square
- Title and description

### 4. Process Timeline Section
Vertical timeline with 4 connected steps:
1. **Design** (Pink bg) - Sketch and prototype
2. **Source** (Amber bg) - Best materials
3. **Craft** (Green bg) - Handmade with care
4. **Test** (Blue bg) - Furry testers

**Timeline features:**
- Connector lines between steps
- Colored circle badges with numbers
- Hover scale effect on badges
- White cards for content
- Group hover effects

### 5. Team Section - Polaroid Style
Three team member cards with:
- Decorative dotted background elements
- **Polaroid-style cards:**
  - White bg with shadow
  - Rotated individually (rotate-2, -rotate-1, rotate-1)
  - Hover: rotation resets
  - Tape decoration at top
  - Square photo area with scale hover
  - Member info: name, role, quote, dog's name

**Team Members:**
1. Jessica Chen - Founder & Head Crafter (Barnaby • Golden Retriever)
2. Marcus Williams - Master Artisan (Luna • Husky Mix)
3. Sarah Martinez - Customer Happiness (Max • French Bulldog)

### 6. CTA Section
Gradient banner (primary to secondary):
- Animated background pattern (cross-hatch SVG)
- Large PawPrint icon (white/20)
- "Ready to treat your pup?" heading
- Two buttons:
  - Primary: "Shop Now" (white bg, primary text)
  - Outline: "Get in Touch" (transparent with white border)

---

## Design Elements

### Colors Used
- **Primary:** Orange brand color
- **Secondary:** Lighter orange
- **Muted:** Background for alternating sections
- **Value Cards:** Pink, Amber, Green, Blue gradients

### Icons (Lucide React)
- `Heart` - Made with Love
- `Award` - Premium Materials
- `Leaf` - Eco-Friendly
- `Truck` - Fast Shipping
- `PawPrint` - Brand element, decorative

### Animations (Inline styled-jsx)
```javascript
- fadeSlideUp - Values cards (0.6s)
- fade-in - Badge, description (0.8s)
- slide-up - Headlines (0.6s)
- Staggered delays: 0.1s, 0.2s, 0.3s, 0.4s
```

### Responsive Design
- Mobile: Stacked content, single column
- Tablet: 2-column grid for values
- Desktop: 4-column values, 12-column origin story

---

## Technical Details

### Component Type
**Client Component** ('use client' directive)

**Why Client Component:**
- Uses inline styled-jsx for custom animations
- Staggered animation delays via inline styles
- Interactive hover effects

### Key Files
- Page: `src/app/about/page.tsx`
- Hero Image: `public/images/about/hero-dogs.jpg`
- Craft Image: `public/images/about/handmade-craft.jpg`
- Team Images: `public/images/team/`
  - founder.jpg
  - artisan.jpg
  - customer-service.jpg

### Dependencies
```tsx
'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Heart, Award, Leaf, Truck, PawPrint } from 'lucide-react'
```

### Custom Animations
Defined via styled-jsx in component:
- `fadeSlideUp` - For values cards
- `fade-in` - For badge, description
- `slide-up` - For headline text blocks

---

## Future Improvements

### Potential Additions
- [ ] Video background for hero section
- [ ] Image gallery expansion
- [ ] Team member carousel for mobile
- [ ] Certifications/badges section
- [ ] Press/mentions section
- [ ] Animated statistics counter
- [ ] Interactive timeline
- [ ] Behind-the-scenes video embed

### Content Updates
- [ ] Add more team members as company grows
- [ ] Update statistics dynamically
- [ ] Add company timeline/milestones
- [ ] Include customer testimonials
- [ ] Add awards/recognition section

### Technical Improvements
- [ ] Move animations to globals.css (convert to Server Component)
- [ ] Add lazy loading for images
- [ ] Implement intersection observer for scroll animations
- [ ] Add parallax effects to hero

---

## Design Patterns Used

### 1. Asymmetrical Layout
Origin story uses offset grid for visual interest:
- Image: col-span-5, col-start-2
- Content: col-span-5

### 2. Staggered Animations
Hero headline uses sequential delays:
```jsx
<span style={{ animationDelay: '0.1s' }}>Crafted with</span>
<span style={{ animationDelay: '0.2s' }}>love, for</span>
<span style={{ animationDelay: '0.3s' }}>your best friend</span>
```

### 3. Polaroid Card Pattern
Team cards use polaroid photo aesthetic:
- White bg + shadow
- Slight rotation each
- Tape decoration overlay
- Hover to straighten

### 4. Timeline Pattern
Process section uses connected vertical timeline:
- Colored numbered circles
- Connector lines between steps
- Content cards to right

---

## Related Pages
- Shop (`/shop`) - CTA button links here
- Contact (`/contact`) - CTA button links here
- Home (`/`) - Main navigation

---

## Last Updated
**Date:** March 18, 2026
**Status:** Complete with styled-jsx animations
**Note:** Uses 'use client' for inline animations. Could be converted to Server Component by moving animations to globals.css.
