"use client";

import { identifyPostHogUser } from "@/lib/posthog-client";
import { useEffect } from "react";

type PostHogIdentifyProps = {
  userId: string;
};

export function PostHogIdentify({ userId }: PostHogIdentifyProps): null {
  useEffect(() => {
    identifyPostHogUser(userId);
  }, [userId]);

  return null;
}
