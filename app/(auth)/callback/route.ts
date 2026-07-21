import { exchangeOAuthCode } from "@/lib/insforge-auth";
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

  try {
    const completed = await exchangeOAuthCode({
      code,
      codeVerifier,
      requestCookies: request.cookies,
      responseCookies: response.cookies,
    });

    response.cookies.delete(OAUTH_VERIFIER_COOKIE);

    if (!completed) {
      const failedResponse = NextResponse.redirect(loginUrl);
      failedResponse.cookies.delete(OAUTH_VERIFIER_COOKIE);
      return failedResponse;
    }

    return response;
  } catch (error) {
    console.error("Unable to complete OAuth sign-in", error);
    const failedResponse = NextResponse.redirect(loginUrl);
    failedResponse.cookies.delete(OAUTH_VERIFIER_COOKIE);
    return failedResponse;
  }
}
