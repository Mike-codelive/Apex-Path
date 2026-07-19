import Image from "next/image";
import Link from "next/link";

export function Hero(): React.ReactNode {
  return (
    <section className="mx-auto max-w-[1440px] px-6 pt-8 sm:pt-12">
      <div className="landing-glow overflow-hidden border border-border">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-6 pb-10 pt-12 text-center sm:pb-14 sm:pt-16">
          <h1 className="max-w-3xl text-4xl font-bold tracking-[-0.06em] text-text-darkest sm:text-5xl sm:leading-[1.03]">
            Job hunting is hard.<br />Your tools shouldn’t be.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-text-secondary">
            Stop applying blind. JobPilot finds the jobs, researches the companies, and gets you everything you need to stand out.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/login" className="rounded-md bg-overlay px-4 py-2 text-xs font-medium text-accent-foreground hover:bg-text-slate">
              Get Started <span aria-hidden="true">›</span>
            </Link>
            <Link href="/login" className="rounded-md border border-border bg-surface px-4 py-2 text-xs font-medium text-text-dark hover:bg-surface-secondary">
              Find Your First Match
            </Link>
          </div>
        </div>
        <div className="border-t border-border bg-surface-secondary px-5 py-8 sm:px-12 sm:py-12">
          <div className="mx-auto max-w-[1110px] overflow-hidden rounded-xl border border-border bg-surface p-2 shadow-[0_18px_40px_rgba(16,24,40,0.13)]">
            <Image src="/images/dashboard-demo.png" alt="JobPilot dashboard preview" width={2394} height={1208} sizes="(max-width: 768px) 100vw, 1110px" className="h-auto w-full rounded-lg" priority />
          </div>
        </div>
      </div>
    </section>
  );
}
