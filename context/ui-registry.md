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
