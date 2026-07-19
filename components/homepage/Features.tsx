import Image from "next/image";

const features = [
  ["Understand your match score", "See how your profile lines up with each role before you apply. Get a clear breakdown of what fits and what’s missing."],
  ["AI-Powered Job Matching", "Stop guessing which jobs are worth applying to. JobPilot scores every role against your actual skills so you can focus on the ones that matter."],
  ["Focus on the right roles", "Filter out low fit jobs and stay on the ones that actually matter. Spend less time sorting and more time applying."],
];

export function Features(): React.ReactNode {
  return (
    <section className="landing-divider mx-auto max-w-[1440px] px-6 py-10 sm:py-16">
      <div className="grid overflow-hidden border border-border bg-surface lg:grid-cols-2">
        <div className="flex items-center bg-surface-muted p-7 sm:p-12">
          <Image src="/images/agnet-log.png" alt="JobPilot agent activity log" width={1072} height={828} sizes="(max-width: 1024px) 100vw, 50vw" className="h-auto w-full rounded-xl" />
        </div>
        <div className="p-8 sm:p-12">
          <h2 className="max-w-md text-3xl font-semibold leading-[1.05] tracking-[-0.05em] text-text-darkest sm:text-4xl">Apply With More Confidence, Every Time</h2>
          <div className="mt-10 divide-y divide-border">
            {features.map(([title, description], index) => (
              <article key={title} className={`py-5 ${index === 1 ? "border-l-2 border-success pl-4" : ""}`}>
                <h3 className="text-sm font-semibold text-text-darkest">{title}</h3>
                <p className="mt-2 max-w-md text-xs leading-5 text-text-secondary">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
