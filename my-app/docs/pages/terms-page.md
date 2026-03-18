# Terms of Service Page Documentation

**Page Path:** `/terms`
**File Location:** `src/app/terms/page.tsx`
**Status:** ✅ Complete

---

## Overview
Legal terms of service page with 14 sections covering account terms, products, payments, liability, and dispute resolution. Features an important notice banner and numbered sections with icons.

---

## Features Implemented

### 1. Hero Section
- Gradient background: `from-secondary/10 via-background to-primary/10`
- Gavel icon badge: "Legal Terms"
- Heading: "Terms of Service"
- Last updated date: "March 16, 2026"

### 2. Agreement Notice Banner
Prominent gradient card with:
- AlertCircle icon
- "Important: Please Read Carefully" heading
- Agreement acceptance text

### 3. Policy Sections (14 sections)
Each section has:
- Icon in colored square (secondary/10 bg)
- Numbered heading
- Detailed content with lists

#### Section List:
1. **Account Registration & Security** (Users icon)
   - Accurate info requirement
   - Password security
   - Age requirement (18+)

2. **Products & Services** (Package icon)
   - Modification rights
   - Substitution policy
   - Quantity limits
   - Color/variation disclaimers

3. **Pricing & Payment** (CreditCard icon)
   - USD pricing
   - Payment methods
   - Security statement

4. **Shipping & Delivery** (🚚 emoji)
   - Estimate disclaimer
   - Delay causes (weather, carrier)
   - Risk of loss clause

5. **Returns & Refunds** (↩️ emoji)
   - 30-day guarantee
   - Condition requirements
   - Refund timeline
   - Links to `/returns`

6. **Intellectual Property** (©️ emoji)
   - Content ownership
   - Usage restrictions
   - Trademark notice

7. **User Conduct** (⚠️ emoji)
   - Prohibited activities list
   - Account termination rights

8. **Limitation of Liability** (🛡️ emoji)
   - Indirect damages exclusion
   - Liability cap (purchase amount)
   - Jurisdiction variations

9. **Indemnification** (🤝 emoji)
   - Hold harmless agreement

10. **Governing Law & Dispute Resolution** (⚖️ emoji)
    - Oregon jurisdiction
    - Binding arbitration
    - Portland venue

11. **Modifications to These Terms** (📝 emoji)
    - Immediate effectiveness
    - Continued use = acceptance

12. **Severability** (✂️ emoji)
    - Remainder enforceability

13. **Waiver** (📋 emoji)
    - No waiver clause

14. **Entire Agreement** (📄 emoji)
    - Complete agreement statement
    - Incorporates Privacy & Return policies

### 4. Contact Section
Gradient card with:
- "Questions About These Terms?"
- Email link
- Company address

### 5. Related Links
Links to:
- Privacy Policy
- Shipping Policy
- Return Policy

---

## Design Elements

### Layout
- Document-style with numbered sections
- Max width: 4xl (896px)
- Section cards with mb-8 spacing

### Colors
- Hero gradient: Secondary/Primary
- Icon squares: Secondary/10 bg
- Notice banner: Primary gradient
- Contact card: Secondary gradient

### Icons (Lucide React)
- `Gavel` - Hero badge
- `Users` - Account section
- `Package` - Products section
- `CreditCard` - Payment section
- `FileText` - Contact email
- `ArrowRight` - Link decoration

### Emojis Used
- 🚚 - Shipping
- ↩️ - Returns
- ©️ - Intellectual Property
- ⚠️ - User Conduct
- 🛡️ - Liability
- 🤝 - Indemnification
- ⚖️ - Governing Law
- 📝 - Modifications
- ✂️ - Severability
- 📋 - Waiver
- 📄 - Entire Agreement

---

## Technical Details

### Component Type
**Server Component** (no 'use client' directive)

### Key Files
- Page: `src/app/terms/page.tsx`
- No external images needed

### Dependencies
```tsx
import Link from 'next/link'
import { FileText, Gavel, AlertCircle, Users, Package, CreditCard, ArrowRight } from 'lucide-react'
```

---

## Key Legal Terms

### Age Requirement
- 18+ for account creation
- Parental consent for minors

### Product Variations
- Handmade = unique variations allowed
- Color differences (monitor settings)
- Size tolerances

### Payment Terms
- Prices in USD
- Right to modify without notice
- Not liable for pricing errors

### Shipping Disclaimer
- Times are estimates, not guaranteed
- Not liable for carrier delays
- Risk transfers at carrier handoff

### Liability Limitation
- Indirect damages excluded
- Cap = purchase price
- Jurisdiction-dependent

### Dispute Resolution
- Oregon law applies
- Binding arbitration
- Portland venue

---

## Future Improvements

### Content Additions
- [ ] GDPR compliance (EU users)
- [ ] Consumer protection laws by region
- [ ] Subscription terms (if added)
- [ ] Affiliate program terms
- [ ] Wholesale agreement reference

### UX Improvements
- [ ] Table of contents with anchor links
- [ ] Print-friendly version
- [ ] Language versions
- [ ] Section collapse/expand
- [ ] Search functionality
- [ ] "Accept" checkbox for registration

### Technical Additions
- [ ] Auto-updating last updated date
- [ ] Version comparison/changelog
- [ ] PDF export
- [ ] Accessibility improvements

---

## Related Pages
- Privacy (`/privacy`) - Linked in related docs
- Shipping (`/shipping`) - Linked in related docs
- Returns (`/returns`) - Linked in related docs and section 5

---

## Legal Notes

**Last Updated:** March 16, 2026
**Governing Law:** Oregon, United States
**Dispute Resolution:** Binding arbitration in Portland
**Contact:** hello@pawfectlyhandmade.com

---

## Important Clauses Summary

| Clause | Summary |
|--------|---------|
| Age | 18+ required |
| Pricing | USD, subject to change |
| Shipping | Estimates only, risk at carrier |
| Returns | 30 days, see Return Policy |
| IP | All content owned by Pawfectly Handmade |
| Liability | Limited to purchase price |
| Jurisdiction | Oregon, USA |
| Disputes | Binding arbitration |

---

## Last Updated
**Date:** March 18, 2026
**Status:** Complete Server Component
