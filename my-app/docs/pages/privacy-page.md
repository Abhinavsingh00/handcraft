# Privacy Policy Page Documentation

**Page Path:** `/privacy`
**File Location:** `src/app/privacy/page.tsx`
**Status:** ✅ Complete

---

## Overview
Legal privacy policy page explaining data collection, usage, and user rights. Clean document-style layout with icon headers for each section.

---

## Features Implemented

### 1. Hero Section
- Gradient background: `from-primary/10 via-background to-secondary/10`
- Shield icon badge: "Your Privacy Matters"
- Heading: "Privacy Policy"
- Last updated date: "March 16, 2026"

### 2. Introduction Card
White card explaining privacy policy purpose and consent.

### 3. Policy Sections (9 sections)
Each section has:
- Icon in colored square
- Numbered heading
- Content with lists/subsections

#### Section List:
1. **Information We Collect** (Eye icon)
   - Personal information (name, email, payment)
   - Automatically collected (IP, browser, behavior)

2. **How We Use Your Information** (🎯 emoji)
   - Order processing, updates, support, marketing

3. **Information Sharing** (🤝 emoji)
   - Payment processors, shipping, analytics, legal

4. **Cookies and Tracking** (Cookie icon)
   - Preferences, analytics, personalization
   - Browser management note

5. **Data Security** (🔒 emoji)
   - SSL encryption, PCI compliance, audits

6. **Your Rights** (✋ emoji)
   - Access, correct, delete, opt-out rights

7. **Third-Party Links** (🔗 emoji)
   - External link disclaimer

8. **Children's Privacy** (👶 emoji)
   - Under 13 protection

9. **Policy Updates** (📅 emoji)
   - Change notification method

### 4. Contact Section
Gradient card with:
- "Questions About Your Privacy?"
- Email link: hello@pawfectlyhandmade.com
- Company address

### 5. Related Links
Links to:
- Terms of Service
- Shipping Policy
- Return Policy

---

## Design Elements

### Layout
- Document-style with numbered sections
- Max width: 4xl (896px)
- Section cards with spacing

### Colors
- Hero gradient: Primary/Secondary
- Icon squares: Primary/10 bg
- Contact card: Gradient with border

### Icons (Lucide React)
- `Shield` - Hero badge
- `Eye` - Info collection
- `Cookie` - Cookies & tracking
- `Mail` - Contact email
- `ArrowRight` - Link decoration

### Emojis Used
- 🎯 - How We Use
- 🤝 - Information Sharing
- 🔒 - Data Security
- ✋ - Your Rights
- 🔗 - Third-Party Links
- 👶 - Children's Privacy
- 📅 - Policy Updates

---

## Technical Details

### Component Type
**Server Component** (no 'use client' directive)

### Key Files
- Page: `src/app/privacy/page.tsx`
- No external images needed

### Dependencies
```tsx
import Link from 'next/link'
import { Shield, Eye, Cookie, Mail, ArrowRight } from 'lucide-react'
```

---

## Content Structure

### Data Types Collected
| Type | Examples | Storage |
|------|----------|---------|
| Personal | Name, email, phone, address | Secure database |
| Payment | Card info (via processor) | PCI-compliant processors |
| Behavioral | Pages, clicks, time | Analytics tools |
| Technical | IP, browser, device | Server logs |

### Third-Party Sharing
| Purpose | Service Type |
|---------|--------------|
| Payments | Stripe, PayPal |
| Shipping | USPS, UPS, FedEx |
| Email | Mailchimp, SendGrid |
| Analytics | Google Analytics |

---

## Future Improvements

### Content Additions
- [ ] GDPR compliance section
- [ ] CCPA (California) specifics
- [ ] Cookie consent banner reference
- [ ] Data retention timeframes
- [ ] Export data functionality

### UX Improvements
- [ ] Table of contents with anchor links
- [ ] Print-friendly version
- [ ] Language selector
- [ ] Collapse/expand sections
- [ ] Search within policy

### Technical Additions
- [ ] Last updated auto-display from file date
- [ ] Version history
- [ ] Comparison view (changes)
- [ ] PDF download

---

## Related Pages
- Terms (`/terms`) - Linked in related docs
- Shipping (`/shipping`) - Linked in related docs
- Returns (`/returns`) - Linked in related docs

---

## Legal Notes

**Last Updated:** March 16, 2026
**Jurisdiction:** Oregon, United States
**Contact:** hello@pawfectlyhandmade.com

---

## Last Updated
**Date:** March 18, 2026
**Status:** Complete Server Component
