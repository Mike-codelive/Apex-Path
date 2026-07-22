"use client";

import { startOAuth } from "@/actions/auth";
import { useState, useTransition } from "react";

type LoginFormProps = {
  initialError?: string;
};

type OAuthProvider = "google" | "github";

const providerLabels: Record<OAuthProvider, string> = {
  google: "Continue with Google",
  github: "Continue with GitHub",
};

export function LoginForm({ initialError }: LoginFormProps): React.ReactNode {
  const [error, setError] = useState<string | undefined>(initialError);
  const [pendingProvider, setPendingProvider] = useState<OAuthProvider | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSignIn(provider: OAuthProvider): void {
    setError(undefined);
    setPendingProvider(provider);

    startTransition(async (): Promise<void> => {
      const result = await startOAuth(provider);

      if (result.url) {
        window.location.assign(result.url);
        return;
      }

      setError(result.error);
      setPendingProvider(null);
    });
  }

  return (
    <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-sm">
      <div className="space-y-3 text-center">
        <p className="text-sm font-medium text-accent">Welcome to JobPilot</p>
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
          Find work that fits.
        </h1>
        <p className="text-sm leading-6 text-text-secondary">
          Sign in to build your profile and discover your strongest job matches.
        </p>
      </div>

      <div className="mt-8 space-y-3">
        {(["google", "github"] as const).map((provider) => {
          const isLoading = isPending && pendingProvider === provider;

          return (
            <button
              className="flex w-full items-center justify-center gap-3 rounded-md border border-border bg-surface px-4 py-3 text-sm font-medium text-text-primary transition-colors hover:bg-surface-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isPending}
              key={provider}
              onClick={() => handleSignIn(provider)}
              type="button"
            >
              <span aria-hidden="true" className="text-base leading-none">
                {provider === "google" ? "G" : "◉"}
              </span>
              {isLoading ? "Redirecting…" : providerLabels[provider]}
            </button>
          );
        })}
      </div>

      {error ? (
        <p className="mt-5 rounded-md bg-error/10 px-3 py-2 text-center text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}

      <p className="mt-8 text-center text-xs leading-5 text-text-muted">
        By continuing, you agree to securely authenticate through your selected provider.
      </p>
    </div>
  );
}
