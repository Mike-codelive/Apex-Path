import Link from "next/link";

export function ProfileLoadError(): React.ReactNode {
  return (
    <section className="rounded-xl border border-error/20 bg-surface p-8 text-center shadow-sm">
      <div className="mx-auto grid size-12 place-items-center rounded-full bg-error/10 text-error">
        <svg aria-hidden="true" className="size-6" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M12 7.5v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="16.5" r="1" fill="currentColor" />
        </svg>
      </div>
      <h1 className="mt-4 text-xl font-semibold text-text-primary">
        We couldn&apos;t load your profile
      </h1>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
        Your saved information has not been changed. Please try loading the page again.
      </p>
      <Link
        href="/profile"
        className="mt-6 inline-flex rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-dark focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-none"
      >
        Try again
      </Link>
    </section>
  );
}
