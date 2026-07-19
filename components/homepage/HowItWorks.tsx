import Image from "next/image";

const items = [
  ["Find jobs that actually fit", "Search by title and location or paste a job link. Get matched roles you can quickly scan."],
  ["Know the company before you apply", "Stop guessing what a company is about. JobPilot browses their site and gives you everything you need to apply with confidence."],
  ["Keep track of every application", "Keep a clear view of every job you’ve found, tailored. Your activity and progress all stay in one simple place."],
];

export function HowItWorks(): React.ReactNode {
  return (
    <section className="landing-divider mx-auto mt-8 max-w-[1440px] px-6 py-10 sm:mt-12 sm:py-16">
      <div className="grid overflow-hidden border border-border bg-surface lg:grid-cols-2">
        <div className="p-8 sm:p-12">
          <h2 className="max-w-sm text-3xl font-semibold leading-[1.05] tracking-[-0.05em] text-text-darkest sm:text-4xl">Manage Your Job Search With Ease</h2>
          <div className="mt-10 divide-y divide-border">
            {items.map(([title, description], index) => (
              <article key={title} className={`py-5 ${index === 0 ? "border-l-2 border-accent pl-4 pt-0" : ""}`}>
                <h3 className="text-sm font-semibold text-text-darkest">{title}</h3>
                <p className="mt-2 max-w-md text-xs leading-5 text-text-secondary">{description}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="flex items-center bg-surface-muted p-7 sm:p-12">
          <Image src="/images/jobs-lists.png" alt="Job matches list" width={1182} height={889} sizes="(max-width: 1024px) 100vw, 50vw" className="h-auto w-full" />
        </div>
      </div>
    </section>
  );
}
