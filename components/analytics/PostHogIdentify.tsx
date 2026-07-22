"use client";

import posthog from "posthog-js";
import { useEffect } from "react";

type PostHogIdentifyProps = {
  userId: string;
};

export function PostHogIdentify({ userId }: PostHogIdentifyProps): null {
  useEffect(() => {
    posthog.identify(userId);
  }, [userId]);

  return null;
}
