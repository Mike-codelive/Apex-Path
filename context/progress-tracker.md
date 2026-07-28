# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 2 — Profile Page
**Last completed:** 07 AI Profile Extraction from Resume
**Next:** 08 Resume PDF Generation from Profile

---

## Progress

### Phase 1 — Foundation

- [x] 01 Homepage
- [x] 02 Auth
- [x] 03 PostHog Initialization
- [x] 04 Database Schema

### Phase 2 — Profile Page

- [x] 05 Profile Page — Full UI
- [x] 06 Profile Save Logic
- [x] 07 AI Profile Extraction from Resume
- [ ] 08 Resume PDF Generation from Profile

### Phase 3 — Find Jobs Page

- [ ] 09 Find Jobs Page — Full UI
- [ ] 10 Adzuna Job Discovery
- [ ] 11 Filter + Sort + Pagination

### Phase 4 — Job Details Page

- [ ] 12 Job Details Page — Full UI
- [ ] 13 Company Research Agent

### Phase 5 — Dashboard

- [ ] 14 Dashboard Page — Full UI
- [ ] 15 Stats Bar — Real Data
- [ ] 16 Recent Activity — Real Data
- [ ] 17 Analytics Charts — PostHog Data

---

## Decisions Made During Build

_Add decisions here as they are made during implementation._

- Auth uses the current `@insforge/sdk` SSR helpers. The previously documented `@insforge/ssr` package is unavailable on npm.
- OAuth uses a server-owned PKCE verifier cookie and `/callback` route handler, which exchanges the InsForge code into secure session cookies before redirecting to `/dashboard`.
- Local InsForge public configuration is stored in ignored `.env.local`; `.env.example` documents the required variable names without credentials.
- PostHog initializes through Next.js `instrumentation-client.ts`, with configuration owned by `lib/posthog-client.ts`. Automatic capture is disabled so only the project event taxonomy is emitted.
- The InsForge schema is versioned in `insforge/migrations/`. Profiles are provisioned automatically from `auth.users`, and all application tables use owner-only RLS plus ownership-aware foreign keys.
- Resume files live in the private `resumes` bucket at `{user_id}/resume.pdf`. `profiles.resume_pdf_url` stores that private object key; authenticated access is restricted to the matching user path.
- Profile completion state is persisted in `completion_percentage` and `missing_fields`; tailored-resume fields remain out of scope.
- The profile page follows `context/designs/profile.png` as its visual source of truth. Feature 05 controls use mock values and local-only interactions; persistence remains isolated to Feature 06.
- Profile persistence uses authenticated, owner-scoped Server Actions. Completion is calculated from ten equally weighted profile categories; resume upload is an independent validated action using private storage and short-lived signed view URLs.
- Resume extraction uses an authenticated API route to download the current private object, `pdf-parse` v2 for text extraction, and GPT-4o Structured Outputs validated through Zod. It updates only the browser draft; the existing Save Profile action remains the sole profile write.

---

## Notes

- Homepage uses the supplied `public/` assets and is responsive. Source lint completed cleanly; production build is blocked in this environment because `next/font/google` cannot fetch Inter from Google Fonts.
- Auth requires Google and GitHub to be configured in InsForge and each deployment origin's `/callback` URL added to InsForge allowed redirect URLs. `NEXT_PUBLIC_APP_URL` is recommended for a stable callback origin.
- PostHog user identification runs on authenticated dashboard loads. `resetPostHog()` is ready for the logout flow when logout UI is added.
- Feature 04 live verification confirmed four application tables, 16 application RLS policies, four resume object policies, a private bucket, and automatic profile backfill for the existing auth account.
- Feature 05 adds the protected `/profile` UI, a reusable authenticated navbar state, the completion banner, resume controls, and the full responsive profile form. Lint and TypeScript checks pass; production build remains blocked only by unavailable Google Fonts network access in this environment.
- Feature 06 pre-fills and saves profile data, persists completion metadata, emits `profile_completed` only on the first completed transition, and supports select/drop PDF upload, replacement cleanup, and private resume viewing. Authenticated profile saving and resume behavior were verified working by the developer. Lint, strict TypeScript, validation checks, and whitespace checks pass.
- Feature 07 adds evidence-first profile extraction from the stored private PDF, atomic replacement of resume-supported draft fields, preservation of preference fields and email, and inline loading/success/failure states. `pdf-parse` is externalized from Next's server bundle so its packaged PDF.js worker resolves correctly in development and production; parser infrastructure failures are no longer reported as invalid uploads. The developer verified authenticated end-to-end extraction against the stored resume after the worker fix. PDF parsing, unauthenticated route handling, lint, strict TypeScript, whitespace checks, token checks, and a network-enabled production build pass.
