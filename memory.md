# Memory — Feature 07 AI Profile Extraction Complete

Last updated: 2026-07-27 CST

## What was built

Completed Feature 07. Added `agent/profile-extractor.ts` and `app/api/resume/extract/route.ts`; updated the profile types and editor, form, and resume components. The authenticated flow downloads the user's stored private resume, extracts PDF text, uses GPT-4o Structured Outputs with Zod validation, and atomically replaces supported fields in the browser draft. Email and job-preference fields remain unchanged, and Save Profile remains the only persistence step.

Added `openai`, `pdf-parse`, and `zod`. Updated `context/ui-registry.md` with the extraction interaction pattern and `context/progress-tracker.md` to mark Feature 07 complete and Feature 08 next.

## Decisions made

Resume extraction is owned by an authenticated API route; agent code performs parsing and model extraction but never writes to the database. Extracted values are evidence-based, normalized, limited to the supported profile fields, and require explicit user review and save.

`pdf-parse` is listed in `serverExternalPackages` so Next uses native Node resolution for its packaged PDF.js worker. Known invalid, malformed, or password-protected PDFs are reported as upload problems; unexpected parser infrastructure failures use the general extraction failure path.

## Problems solved

Next/Turbopack originally bundled PDF.js into a server chunk without emitting `pdf.worker.mjs`, causing every extraction attempt to fail with a fake-worker module error. Externalizing `pdf-parse` fixed worker resolution in both development and production server output.

The parser boundary was corrected so worker and runtime failures are no longer incorrectly returned as HTTP 422 invalid-PDF errors.

## Current state

Features 01–07 are complete. The developer verified authenticated end-to-end extraction against the stored resume after the worker fix. Strict TypeScript, ESLint, whitespace checks, production build, emitted server dependency inspection, and invalid-PDF classification pass.

## Next session starts with

Run `/remember restore`, confirm this handoff, then run `/architect feature 08`. Plan the authenticated `/api/resume/generate` flow that reads profile data, generates polished resume content with GPT-4o, renders a single-page PDF using `@react-pdf/renderer`, uploads it to the private resume object, and updates the profile reference.

## Open questions

None.
