# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes
3. If no — build it following ui-rules.md and ui-tokens.md, then add it here

After building any component — update this file with the component name, file path, and exact classes used.

---

## Components

### Landing Page Sections

Files: `components/homepage/Hero.tsx`, `components/homepage/HowItWorks.tsx`, `components/homepage/Features.tsx`, `components/homepage/Testimonial.tsx`, `components/homepage/BottomCta.tsx`
Last updated: 2026-07-18

| Property | Class |
| --- | --- |
| Background | `bg-surface`, `bg-surface-secondary`, `bg-surface-muted`, `landing-glow` |
| Border | `border border-border` |
| Border radius | `rounded-md`, `rounded-xl` for image frames |
| Text — primary | `text-text-darkest`, `text-text-dark` |
| Text — secondary | `text-text-secondary` |
| Spacing | `px-6`, `p-8 sm:p-12`, `gap-3`, `mt-5`, `mt-10` |
| Hover state | `hover:bg-text-slate`, `hover:bg-surface-secondary`, `hover:text-accent` |
| Shadow | `shadow-[0_18px_40px_rgba(16,24,40,0.13)]` for the dashboard image frame |
| Accent usage | `bg-accent`, `border-accent`, `border-success`, `text-accent` |

**Pattern notes:** Marketing sections use token-based white surfaces with thin border dividers and alternating muted image panels. Primary CTAs are dark filled buttons; secondary CTAs are white, bordered buttons. Large display headings use tight tracking and `text-text-darkest`.

### Site Navigation and Footer

Files: `components/layout/Navbar.tsx`, `components/layout/Footer.tsx`
Last updated: 2026-07-18

| Property | Class |
| --- | --- |
| Background | `bg-surface` |
| Border | `border-b border-border`, `border-t border-border` |
| Border radius | `rounded-md` for CTA only |
| Text — primary | `text-text-dark` |
| Text — secondary | `text-text-secondary` |
| Spacing | `h-16 px-6`, `py-7`, `gap-6` |
| Hover state | `hover:text-accent`, `hover:bg-text-slate` |
| Shadow | none |
| Accent usage | CTA uses `text-accent-foreground`; links use `hover:text-accent` |

**Pattern notes:** Site chrome is full-width white with a 64px header, logo at left, minimal centered desktop navigation, and a dark primary CTA.

### OAuth Login Form

File: `components/auth/LoginForm.tsx`
Last updated: 2026-07-20

| Property | Class |
| --- | --- |
| Background | `bg-surface`, `bg-surface-secondary` on button hover, `bg-error/10` for recoverable errors |
| Border | `border border-border` |
| Border radius | `rounded-xl` for the login card, `rounded-md` for provider buttons and error state |
| Text — primary | `text-text-primary` heading and buttons; `text-text-secondary` body; `text-text-muted` legal copy |
| Spacing | `p-8`, `space-y-3`, `mt-8`, `px-4 py-3` |
| Hover state | `hover:bg-surface-secondary`, `focus:ring-2 focus:ring-accent` |
| Shadow | `shadow-sm` |
| Accent usage | `text-accent`, `focus:ring-accent`, `bg-error/10 text-error` for recoverable errors |

**Pattern notes:** Authentication is presented as a compact, centered white surface. Provider buttons use the existing secondary-button treatment, full width for clear touch targets, with a visible focus ring and friendly inline errors instead of raw provider messages.

### Authenticated Dashboard Placeholder

File: `app/dashboard/page.tsx`
Last updated: 2026-07-20

| Property | Class |
| --- | --- |
| Background | `bg-background`, `bg-surface` |
| Border | `border border-border` |
| Border radius | `rounded-xl` |
| Text — primary | `text-text-primary`, `text-text-secondary` |
| Spacing | `p-8`, `mt-3`, `px-6 py-12` |
| Hover state | none |
| Shadow | `shadow-sm` |
| Accent usage | `text-accent` |

**Pattern notes:** This is a temporary, protected route destination for the completed OAuth flow. It uses the same centered auth-surface pattern and must be replaced by the full dashboard UI in Phase 5.

## Non-UI Features

### Database Schema

Files: `insforge/migrations/20260722_001_foundation_schema.sql`, `insforge/migrations/20260722_002_resume_storage_policies.sql`
Last updated: 2026-07-22

**Pattern notes:** Feature 04 is infrastructure-only and adds no UI components or visual patterns. Existing registry conventions remain unchanged for Feature 05.

### Profile Page

Files: `components/profile/CompletionBanner.tsx`, `components/profile/ResumeSection.tsx`, `components/profile/ProfileForm.tsx`, `app/profile/page.tsx`
Last updated: 2026-07-23

| Property | Class |
| --- | --- |
| Background | `bg-background`, `bg-surface`, `bg-surface-secondary` |
| Border | `border border-border`, `border-dashed border-border`, `border-error/20` |
| Border radius | `rounded-xl` for section cards, `rounded-lg` for inset panels, `rounded-md` for controls |
| Text — primary | `text-text-primary`, `text-xl font-semibold` for card headings, `text-base font-semibold` for form sections |
| Text — secondary | `text-text-secondary`, `text-sm`; uppercase labels use `text-xs font-semibold tracking-wide text-text-dark` |
| Spacing | `p-6 lg:p-8` for cards, `space-y-10` between form sections, `gap-x-5 gap-y-6` for field grids |
| Hover state | `hover:bg-surface-secondary`, `hover:bg-accent-dark`, `focus:ring-1 focus:ring-accent` |
| Shadow | `shadow-sm` |
| Accent usage | `bg-accent text-accent-foreground`, `text-accent`, `accent-accent`; attention state uses `bg-error/10 text-error` |

**Pattern notes:** Profile forms use two-column desktop grids that collapse to one column, token-only white cards, 44px controls, uppercase compact labels, and full-width primary submit actions. Inset work-history and upload panels use the secondary surface without introducing another card radius level. Interactive mock controls remain client-side and contain no persistence logic.

### Authenticated Navigation

File: `components/layout/Navbar.tsx`
Last updated: 2026-07-23

| Property | Class |
| --- | --- |
| Background | `bg-surface` |
| Border | `border-b border-border` |
| Border radius | none |
| Text — primary | `text-sm font-medium text-text-dark` |
| Text — secondary | none |
| Spacing | `h-16 px-6`, `gap-3 sm:gap-8` |
| Hover state | `hover:text-accent` |
| Shadow | none |
| Accent usage | Active route uses `text-accent` with `after:bg-accent` |

**Pattern notes:** Authenticated navigation keeps the shared 64px site header, adds compact line icons, removes the marketing CTA, and marks the current route with accent text plus a bottom rule. Mobile retains icons while hiding labels.
