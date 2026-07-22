import { PostHog } from "posthog-node";

export function createPostHogServer(): PostHog {
  const key =
    process.env.NEXT_PUBLIC_POSTHOG_KEY ??
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

  if (!key) {
    throw new Error("PostHog project key is not configured");
  }

  return new PostHog(key, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });
}
