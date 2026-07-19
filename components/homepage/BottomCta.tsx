import Link from "next/link";

export function BottomCta(): React.ReactNode {
  return (
    <section className="mx-auto max-w-[1440px] px-6 pb-10 sm:pb-16">
      <div className="landing-glow border border-border px-6 py-16 text-center sm:px-12 sm:py-20">
        <h2 className="mx-auto max-w-2xl text-3xl font-semibold leading-[1.05] tracking-[-0.05em] text-text-darkest sm:text-4xl">Your next job search can feel a lot less overwhelming</h2>
        <p className="mt-5 text-sm text-text-secondary">Set up your profile, upload your resume, and start finding matches in minutes.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/login" className="rounded-md bg-overlay px-4 py-2 text-xs font-medium text-accent-foreground hover:bg-text-slate">Get Started <span aria-hidden="true">›</span></Link>
          <Link href="/login" className="rounded-md border border-border bg-surface px-4 py-2 text-xs font-medium text-text-dark hover:bg-surface-secondary">Find Your First Match</Link>
        </div>
      </div>
    </section>
  );
}
