import { exchangeOAuthCode } from "@/lib/insforge-auth";
import { getPostHogClient } from "@/lib/posthog-server";
import { NextRequest, NextResponse } from "next/server";

const OAUTH_VERIFIER_COOKIE = "jobpilot-oauth-verifier";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const code = request.nextUrl.searchParams.get("insforge_code");
  const codeVerifier = request.cookies.get(OAUTH_VERIFIER_COOKIE)?.value;
  const loginUrl = new URL("/login?error=oauth", request.url);

  if (!code || !codeVerifier) {
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.redirect(new URL("/dashboard", request.url));

  // Read PostHog anonymous distinct ID from cookie for server-side correlation
  const phCookieRaw = request.cookies.get(
    `ph_${process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN}_posthog`
  )?.value;
  let distinctId = "anonymous";
  if (phCookieRaw) {
    try {
      distinctId = JSON.parse(decodeURIComponent(phCookieRaw)).distinct_id ?? "anonymous";
    } catch {
      // fall back to anonymous
    }
  }

  const posthog = getPostHogClient();

  try {
    const completed = await exchangeOAuthCode({
      code,
      codeVerifier,
      requestCookies: request.cookies,
      responseCookies: response.cookies,
    });

    response.cookies.delete(OAUTH_VERIFIER_COOKIE);

    if (!completed) {
      posthog.capture({
        distinctId,
        event: "oauth_signin_failed",
        properties: { reason: "code_exchange_failed" },
      });
      await posthog.flush();
      const failedResponse = NextResponse.redirect(loginUrl);
      failedResponse.cookies.delete(OAUTH_VERIFIER_COOKIE);
      return failedResponse;
    }

    posthog.capture({
      distinctId,
      event: "oauth_signin_completed",
      properties: { source: "oauth_callback" },
    });
    await posthog.flush();

    return response;
  } catch (error) {
    console.error("Unable to complete OAuth sign-in", error);
    posthog.capture({
      distinctId,
      event: "oauth_signin_failed",
      properties: { reason: "exception" },
    });
    await posthog.flush();
    const failedResponse = NextResponse.redirect(loginUrl);
    failedResponse.cookies.delete(OAUTH_VERIFIER_COOKIE);
    return failedResponse;
  }
}
