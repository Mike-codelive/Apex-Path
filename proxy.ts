import { updateSession } from "@insforge/sdk/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.next();

  try {
    const { accessToken } = await updateSession({
      baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
      anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
      requestCookies: {
        get: (name: string) => request.cookies.get(name),
      },
      responseCookies: response.cookies,
    });

    if (accessToken) {
      return response;
    }
  } catch (error) {
    console.error("Unable to refresh auth session", error);
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/find-jobs/:path*"],
};
