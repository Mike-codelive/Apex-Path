type CompletionBannerProps = {
  completionPercentage: number;
  missingFields: string[];
};

const FIELD_LABELS: Record<string, string> = {
  full_name: "FULL NAME",
  phone: "PHONE",
  location: "LOCATION",
  current_title: "JOB TITLE",
  experience_level: "EXPERIENCE",
  skills: "SKILLS",
  work_experience: "WORK HISTORY",
  education: "EDUCATION",
  job_titles_seeking: "JOB PREFERENCES",
  remote_preference: "REMOTE PREFERENCE",
};

export function CompletionBanner({
  completionPercentage,
  missingFields,
}: CompletionBannerProps): React.ReactNode {
  const ringOffset = 100 - completionPercentage;
  const isComplete = completionPercentage === 100;

  return (
    <section
      className={`flex flex-col items-start justify-between gap-8 rounded-xl border bg-surface p-6 shadow-sm sm:flex-row sm:items-center lg:px-8 lg:py-10 ${
        isComplete ? "border-success/20" : "border-error/20"
      }`}
    >
      <div>
        <div className="flex items-center gap-3">
          {isComplete ? (
            <svg aria-hidden="true" className="size-5 text-success" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <path d="m8 12 2.5 2.5L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg aria-hidden="true" className="size-5 text-error" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <path d="M12 7.5v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="16.5" r="1" fill="currentColor" />
            </svg>
          )}
          <h1 className="text-xl font-semibold text-text-primary">
            {isComplete ? "Profile complete" : "Profile needs attention"}
          </h1>
        </div>
        <p className="mt-3 max-w-xl text-sm leading-6 text-text-dark">
          {isComplete ? (
            "Your profile is ready for tailored job matches and quality resume generation."
          ) : (
            <>
              Complete the missing fields to improve your chance of getting
              <br className="hidden sm:block" /> tailored matches and generating quality resumes.
            </>
          )}
        </p>
        {!isComplete ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {missingFields.map((field) => (
              <span
                key={field}
                className="rounded-sm bg-error/10 px-2.5 py-1 text-xs font-semibold tracking-wide text-error"
              >
                {FIELD_LABELS[field] ?? field.replaceAll("_", " ").toUpperCase()}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <div className="relative grid size-32 shrink-0 place-items-center self-center sm:size-36">
        <svg aria-hidden="true" className="absolute inset-0 size-full -rotate-90" viewBox="0 0 42 42">
          <circle className={isComplete ? "text-success/15" : "text-error/15"} cx="21" cy="21" r="16" fill="none" stroke="currentColor" strokeWidth="4" />
          <circle
            className={isComplete ? "text-success" : "text-error"}
            cx="21"
            cy="21"
            r="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset={ringOffset}
          />
        </svg>
        <span className="text-3xl font-semibold text-text-primary">
          {completionPercentage}%
        </span>
      </div>
    </section>
  );
}
