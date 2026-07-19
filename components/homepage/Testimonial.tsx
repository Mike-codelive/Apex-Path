import Image from "next/image";

export function Testimonial(): React.ReactNode {
  return (
    <section className="landing-divider mx-auto max-w-[1440px] px-6 py-14 sm:py-20">
      <div className="mx-auto max-w-3xl bg-surface px-5 py-10 text-center sm:px-12 sm:py-14">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">Success Stories</p>
        <blockquote className="mt-5 text-xl font-medium leading-8 tracking-[-0.03em] text-text-dark sm:text-2xl">
          “I used to spend my evenings copy-pasting resumes. Now I open my dashboard to see interviews waiting. It feels like cheating. Had 3 offers on the table simultaneously.”
        </blockquote>
        <div className="mt-6 flex items-center justify-center gap-3 text-left">
          <Image src="/images/user-icon.png" alt="Tom Wilson" width={28} height={28} className="rounded-full" />
          <div>
            <p className="text-xs font-semibold text-text-darkest">Tom Wilson</p>
            <p className="text-[10px] text-text-secondary">Junior Developer</p>
          </div>
        </div>
      </div>
    </section>
  );
}
