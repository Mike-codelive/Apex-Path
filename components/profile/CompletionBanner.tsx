export function CompletionBanner(): React.ReactNode {
  return (
    <section className="flex flex-col items-start justify-between gap-8 rounded-xl border border-error/20 bg-surface p-6 shadow-sm sm:flex-row sm:items-center lg:px-8 lg:py-10">
      <div>
        <div className="flex items-center gap-3">
          <svg aria-hidden="true" className="size-5 text-error" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            <path d="M12 7.5v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="16.5" r="1" fill="currentColor" />
          </svg>
          <h1 className="text-xl font-semibold text-text-primary">Profile needs attention</h1>
        </div>
        <p className="mt-3 max-w-xl text-sm leading-6 text-text-dark">
          Complete the missing fields to improve your chance of getting
          <br className="hidden sm:block" /> tailored matches and generating quality resumes.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {["PHONE", "LOCATION", "EDUCATION"].map((field) => (
            <span
              key={field}
              className="rounded-sm bg-error/10 px-2.5 py-1 text-xs font-semibold tracking-wide text-error"
            >
              {field}
            </span>
          ))}
        </div>
      </div>
      <div className="profile-completion-ring grid size-32 shrink-0 place-items-center self-center rounded-full sm:size-36">
        <div className="grid size-24 place-items-center rounded-full bg-surface sm:size-28">
          <span className="text-3xl font-semibold text-text-primary">70%</span>
        </div>
      </div>
    </section>
  );
}
