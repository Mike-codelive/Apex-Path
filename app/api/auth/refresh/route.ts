import { createRefreshAuthRouter } from "@insforge/sdk/ssr";

const authRouter = createRefreshAuthRouter({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
});

export const { POST } = authRouter;
