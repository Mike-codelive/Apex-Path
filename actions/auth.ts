"use server";

import { createAuthActions } from "@insforge/sdk/ssr";
import { cookies, headers } from "next/headers";

const OAUTH_VERIFIER_COOKIE = "jobpilot-oauth-verifier";

type OAuthProvider = "google" | "github";

type StartOAuthResult =
  | { url: string; error?: never }
  | { url?: never; error: string };

function getAppUrl(
  requestHeaders: Headers,
): string {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";

  return host ? `${protocol}://${host}` : "http://localhost:3000";
}

export async function startOAuth(
  provider: OAuthProvider,
): Promise<StartOAuthResult> {
  try {
    const [cookieStore, requestHeaders] = await Promise.all([cookies(), headers()]);
    const auth = createAuthActions({
      baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
      anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
      cookies: cookieStore,
    });
    const redirectTo = `${getAppUrl(requestHeaders)}/callback`;
    const { data, error } = await auth.signInWithOAuth(provider, {
      redirectTo,
      additionalParams: provider === "google" ? { prompt: "select_account" } : undefined,
      skipBrowserRedirect: true,
    });

    if (error || !data.url || !data.codeVerifier) {
      return { error: "We couldn’t start sign-in. Please try again." };
    }

    cookieStore.set(OAUTH_VERIFIER_COOKIE, data.codeVerifier, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
      path: "/",
    });

    return { url: data.url };
  } catch (error) {
    console.error("Unable to start OAuth sign-in", error);
    return { error: "We couldn’t start sign-in. Please try again." };
  }
}
