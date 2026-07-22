import posthog from "posthog-js";

function getPostHogKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_POSTHOG_KEY ??
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN
  );
}

export function initPostHog(): void {
  const key = getPostHogKey();

  if (typeof window === "undefined" || !key || posthog.__loaded) {
    return;
  }

  posthog.init(key, {
    api_host: "/ingest",
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: false,
    capture_exceptions: false,
    disable_session_recording: true,
    debug: process.env.NODE_ENV === "development",
  });
}

export function identifyPostHogUser(userId: string): void {
  posthog.identify(userId);
}

export function resetPostHog(): void {
  posthog.reset();
}
