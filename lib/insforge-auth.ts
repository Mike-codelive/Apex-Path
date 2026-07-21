import { createAuthActions, type CookieStore, type CookieWriter } from "@insforge/sdk/ssr";

type ExchangeOAuthCodeInput = {
  code: string;
  codeVerifier: string;
  requestCookies: Pick<CookieStore, "get">;
  responseCookies: CookieWriter;
};

export async function exchangeOAuthCode({
  code,
  codeVerifier,
  requestCookies,
  responseCookies,
}: ExchangeOAuthCodeInput): Promise<boolean> {
  const auth = createAuthActions({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
    requestCookies,
    responseCookies,
  });
  const { error } = await auth.exchangeOAuthCode(code, codeVerifier);

  return !error;
}
