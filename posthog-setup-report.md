<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into JobPilot, a Next.js 16 App Router application using InsForge for authentication. PostHog is initialized client-side via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), with a reverse proxy configured in `next.config.ts` to route events through `/ingest` and avoid ad-blockers. A singleton server-side client in `lib/posthog-server.ts` handles event capture from API routes. Three key events are instrumented across the OAuth sign-in flow, and users are identified client-side once they reach the authenticated dashboard.

| Event | Description | File |
|---|---|---|
| `oauth_signin_initiated` | User clicks a provider button (Google or GitHub) to begin the OAuth sign-in flow. | `components/auth/LoginForm.tsx` |
| `oauth_signin_completed` | OAuth code exchange succeeded and the user is authenticated. | `app/(auth)/callback/route.ts` |
| `oauth_signin_failed` | OAuth code exchange failed and the user could not be authenticated. | `app/(auth)/callback/route.ts` |

User identification (`posthog.identify`) is called client-side in `app/dashboard/page.tsx` via the `PostHogIdentify` component, which receives the authenticated user's ID from the server component and links the anonymous session to the known user.

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/504246/dashboard/1886341)
- [Auth conversion funnel (wizard)](https://us.posthog.com/project/504246/insights/0rMkic9H)
- [Sign-ins by provider (wizard)](https://us.posthog.com/project/504246/insights/jKqYEG4N)
- [OAuth sign-in failures (wizard)](https://us.posthog.com/project/504246/insights/9r2q4fs1)

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. Currently `PostHogIdentify` runs on every dashboard load, which covers this case, but verify once the dashboard renders real user data.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
