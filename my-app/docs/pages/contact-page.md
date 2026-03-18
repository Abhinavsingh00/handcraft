# Contact Page Documentation

**Page Path:** `/contact`
**File Location:** `src/app/contact/page.tsx`
**Status:** ✅ Complete

---

## Overview
Contact page with split layout featuring contact information, business hours, social links, and a full contact form. Includes FAQ preview and location image section.

---

## Features Implemented

### 1. Hero Section
- Background image: `/images/contact/contact-hero.jpg`
- Gradient overlay: `from-background/70 via-background/50 to-background`
- Badge with Mail icon: "Get in Touch"
- Animated heading: "Let's chat about pups!"
- Tagline about inquiries and dog photos

### 2. Main Content - Split Layout (5-column grid)

#### Left Column (2 cols) - Contact Info Cards
**Sticky sidebar with 3 cards:**

##### Contact Info Card
- Gradient: `from-primary/10 to-secondary/10`
- Heart icon in circle
- Contact details:
  - Email: hello@pawfectlyhandmade.com
  - Phone: (555) 123-4567
  - Location: Portland, Oregon (ship worldwide)

##### Business Hours Card
- Clock icon
- Hours:
  - Mon-Fri: 9am - 5pm PST
  - Saturday: 10am - 2pm PST
  - Sunday: Closed (dog park day!)

##### Social Card
- Pink/orange gradient
- Social buttons: Instagram, Facebook, TikTok

#### Right Column (3 cols) - Contact Form
- White rounded card with shadow
- Decorative paw print watermark
- Heading: "Drop us a line"
- Subtext: "We usually respond within 24 hours"

**Form Fields:**
- Name (required) - text input
- Email (required) - email input
- Subject (required) - select dropdown:
  - Question about an order
  - Product inquiry
  - Custom order request
  - Wholesale inquiry
  - Feedback or suggestion
  - Just want to chat!
- Message (required) - textarea (6 rows)
- Submit button with loading state
- Privacy policy link

**Submit Behavior:**
- Simulated 1.5s delay
- Alert on success: "Thanks for reaching out! We'll get back to you soon. 🐾"
- Form resets after submission

### 3. FAQ Preview Section
- Muted background
- 3 FAQ cards with emoji:
  - 📦 How long does shipping take?
  - ✨ Do you do custom orders?
  - 🐕 What if my dog doesn't like it?
- "View All FAQs →" button linking to `/faq`

### 4. Location Image Section
- Portland image: `/images/contact/portland.jpg`
- Aspect video (16:9)
- Gradient overlay from bottom
- Overlay content:
  - MapPin icon in glass circle
  - "Pawfectly Handmade HQ"
  - "Portland, Oregon"
  - "Where the magic happens ✨"
- Decorative circles

---

## State Management

### React State
```typescript
formData: {
  name: string
  email: string
  subject: string
  message: string
}
isSubmitting: boolean
```

### Form Handler
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)
  await new Promise(resolve => setTimeout(resolve, 1500))
  setIsSubmitting(false)
  alert('Thanks for reaching out! We\'ll get back to you soon. 🐾')
  setFormData({ name: '', email: '', subject: '', message: '' })
}
```

---

## Design Elements

### Layout
- **Desktop:** 2/5 left (sticky), 3/5 right (form)
- **Mobile:** Stacked vertically

### Colors
- Contact card gradient: Primary/Secondary
- Social card: Pink/Orange gradient
- Form card: White with border
- FAQ section: Muted bg

### Icons (Lucide React)
- `Mail` - Email badge & icon
- `Phone` - Phone number
- `MapPin` - Location
- `Clock` - Business hours
- `Heart` - Contact info header
- `PawPrint` - Decorative watermark
- `Send` - Submit button

### Animations (styled-jsx)
- `animate-fade-in` - Badge and description
- `animate-slide-up` - Hero heading

---

## Technical Details

### Component Type
**Client Component** ('use client' directive)

**Why Client Component:**
- useState for form data
- Form submission handling
- Loading state management
- Interactive form controls

### Key Files
- Page: `src/app/contact/page.tsx`
- Hero Image: `public/images/contact/contact-hero.jpg`
- Location Image: `public/images/contact/portland.jpg`
- Button Component: `@/components/ui/button`

### Dependencies
```tsx
'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mail, MapPin, Phone, Send, PawPrint, Clock, Heart } from 'lucide-react'
```

### Custom Animations
Inline styled-jsx:
```css
@keyframes fade-in { opacity: 0 → 1 }
@keyframes slide-up { translate Y + opacity }
```

---

## Form Features

### Validation
- HTML5 `required` attribute
- Email type validation
- Visual focus states with ring

### Focus States
```tsx
className="... focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none"
```

### Submit Button States
- **Idle:** "Send Message" with Send icon
- **Loading:** "Sending..." with spinner
- **Disabled:** 50% opacity

---

## Future Improvements

### Form Enhancements
- [ ] Real form submission (API endpoint)
- [ ] File upload for photos
- [ ] Order number lookup
- [ ] Auto-reply email
- [ ] Form validation feedback
- [ ] Save draft functionality
- [ ] Multi-step form for complex inquiries

### Content Additions
- [ ] Live chat widget
- [ ] FAQ accordion expansion
- [ ] Multiple locations
- [ ] Team member contacts
- [ ] Emergency contact info

### Technical Improvements
- [ ] Move animations to globals.css (convert to Server Component)
- [ ] Add reCAPTCHA
- [ ] Rate limiting
- [ ] Form analytics
- [ ] A/B testing for conversion

---

## Related Pages
- FAQ (`/faq`) - Linked from FAQ preview
- Privacy (`/privacy`) - Linked from form
- About (`/about`) - Company info
- Shop (`/shop`) - Product inquiries

---

## Contact Information

**Email:** hello@pawfectlyhandmade.com
**Phone:** (555) 123-4567
**Location:** Portland, Oregon
**Hours:** Mon-Fri 9am-5pm PST, Sat 10am-2pm PST

---

## Last Updated
**Date:** March 18, 2026
**Status:** Complete with styled-jsx animations
**Note:** Uses 'use client' for form state. Simulated submission - needs real API integration.
