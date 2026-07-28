"use client";

import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useFormStatus } from "react-dom";

import type {
  ProfileActionState,
  ProfileFormValues,
} from "@/types/profile";

const inputClass =
  "h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-text-primary shadow-sm outline-none placeholder:text-text-muted focus:border-accent focus:ring-1 focus:ring-accent disabled:bg-surface-secondary disabled:text-text-secondary";
const labelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-wide text-text-dark";
const sectionClass = "border-t border-border pt-10";

type ProfileFormProps = {
  values: ProfileFormValues;
  actionState: ProfileActionState;
  onValuesChange: Dispatch<SetStateAction<ProfileFormValues>>;
};

export function ProfileForm({
  values,
  actionState,
  onValuesChange,
}: ProfileFormProps): React.ReactNode {
  const { pending } = useFormStatus();
  const [skillDraft, setSkillDraft] = useState<string>("");
  const [industryDraft, setIndustryDraft] = useState<string>("");

  function addTag(
    value: string,
    key: "skills" | "industries",
    clear: () => void,
  ): void {
    const tag = value.trim();

    onValuesChange((current) => ({
      ...current,
      [key]:
        tag && !current[key].includes(tag)
          ? [...current[key], tag]
          : current[key],
    }));
    clear();
  }

  function addRole(): void {
    onValuesChange((current) => {
      if (current.workExperience.length >= 3) {
        return current;
      }

      return {
        ...current,
        workExperience: [
          ...current.workExperience,
          {
            company: "",
            title: "",
            startDate: "",
            endDate: "",
            current: false,
            responsibilities: "",
          },
        ],
      };
    });
  }

  function updateRole(
    index: number,
    nextValues: Partial<ProfileFormValues["workExperience"][number]>,
  ): void {
    onValuesChange((current) => ({
      ...current,
      workExperience: current.workExperience.map((role, roleIndex) =>
        roleIndex === index ? { ...role, ...nextValues } : role,
      ),
    }));
  }

  function updateValues(nextValues: Partial<ProfileFormValues>): void {
    onValuesChange((current) => ({ ...current, ...nextValues }));
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-6 shadow-sm lg:p-8">
      <div className="border-b border-border pb-6">
        <h2 className="text-xl font-semibold text-text-primary">Profile Information</h2>
        <p className="mt-1 text-sm text-text-secondary">
          This context is used to accurately represent you in agent interactions.
        </p>
      </div>

      <div className="space-y-10 pt-10">
        <input type="hidden" name="skills" value={JSON.stringify(values.skills)} />
        <input type="hidden" name="industries" value={JSON.stringify(values.industries)} />
        <input
          type="hidden"
          name="workExperience"
          value={JSON.stringify(
            values.workExperience.map(({ company, title, startDate, endDate, current, responsibilities }) => ({
              company,
              title,
              startDate,
              endDate,
              current,
              responsibilities,
            })),
          )}
        />
        <fieldset>
          <legend className="mb-8 text-base font-semibold text-text-primary">Personal Info</legend>
          <div className="grid gap-x-5 gap-y-6 md:grid-cols-2">
            <label>
              <span className={labelClass}>Full Name</span>
              <input name="fullName" className={inputClass} value={values.fullName} onChange={(event) => updateValues({ fullName: event.target.value })} />
            </label>
            <label>
              <span className={labelClass}>Email</span>
              <input className={inputClass} type="email" value={values.email} disabled />
            </label>
            <label>
              <span className={labelClass}>Phone Number</span>
              <input name="phone" className={inputClass} type="tel" value={values.phone} onChange={(event) => updateValues({ phone: event.target.value })} placeholder="+1 (555) 000-0000" />
            </label>
            <label>
              <span className={labelClass}>Location</span>
              <input name="location" className={inputClass} value={values.location} onChange={(event) => updateValues({ location: event.target.value })} placeholder="City, Country" />
            </label>
            <label>
              <span className={labelClass}>LinkedIn URL</span>
              <input name="linkedinUrl" className={inputClass} type="url" value={values.linkedinUrl} onChange={(event) => updateValues({ linkedinUrl: event.target.value })} placeholder="https://linkedin.com/in/your-name" />
            </label>
            <label>
              <span className={labelClass}>Portfolio / GitHub</span>
              <input name="portfolioUrl" className={inputClass} type="url" value={values.portfolioUrl} onChange={(event) => updateValues({ portfolioUrl: event.target.value })} placeholder="https://github.com/your-name" />
            </label>
            <label>
              <span className={labelClass}>Work Authorization</span>
              <select name="workAuthorization" className={inputClass} value={values.workAuthorization} onChange={(event) => updateValues({ workAuthorization: event.target.value })}>
                <option value="">Select authorization</option>
                <option value="citizen">Citizen</option>
                <option value="permanent_resident">Permanent Resident</option>
                <option value="visa_required">Requires Sponsorship</option>
              </select>
            </label>
          </div>
        </fieldset>

        <fieldset className={sectionClass}>
          <legend className="mb-8 text-base font-semibold text-text-primary">Professional Info</legend>
          <div className="grid gap-x-5 gap-y-6 md:grid-cols-2">
            <label className="md:col-span-2">
              <span className={labelClass}>Current/Recent Job Title</span>
              <input name="currentTitle" className={inputClass} value={values.currentTitle} onChange={(event) => updateValues({ currentTitle: event.target.value })} />
            </label>
            <label>
              <span className={labelClass}>Experience Level</span>
              <select name="experienceLevel" className={inputClass} value={values.experienceLevel} onChange={(event) => updateValues({ experienceLevel: event.target.value })}>
                <option value="">Select experience</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
              </select>
            </label>
            <label>
              <span className={labelClass}>Years of Experience</span>
              <input name="yearsExperience" className={inputClass} type="number" min="0" value={values.yearsExperience} onChange={(event) => updateValues({ yearsExperience: event.target.value })} />
            </label>
            <div className="md:col-span-2">
              <label htmlFor="skill-input" className={labelClass}>Skills</label>
              <div className="flex gap-2">
                <input
                  id="skill-input"
                  className={inputClass}
                  value={skillDraft}
                  placeholder="Add a skill"
                  onChange={(event) => setSkillDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addTag(skillDraft, "skills", () => setSkillDraft(""));
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => addTag(skillDraft, "skills", () => setSkillDraft(""))}
                  className="rounded-md bg-surface-tertiary px-5 text-sm font-semibold text-text-dark transition-colors hover:bg-border"
                >
                  Add
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {values.skills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() =>
                      updateValues({
                        skills: values.skills.filter((item) => item !== skill),
                      })
                    }
                    className="rounded-md border border-border bg-surface-secondary px-3 py-2 text-sm font-medium text-text-primary"
                    aria-label={`Remove ${skill}`}
                  >
                    {skill} <span className="text-text-muted">×</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="industry-input" className={labelClass}>Industries Worked In (Optional)</label>
              <div className="flex gap-2">
                <input
                  id="industry-input"
                  className={inputClass}
                  value={industryDraft}
                  placeholder="E.g. FinTech, Healthcare"
                  onChange={(event) => setIndustryDraft(event.target.value)}
                />
                <button
                  type="button"
                  onClick={() => addTag(industryDraft, "industries", () => setIndustryDraft(""))}
                  className="rounded-md bg-surface-tertiary px-5 text-sm font-semibold text-text-dark transition-colors hover:bg-border"
                >
                  Add
                </button>
              </div>
              {values.industries.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {values.industries.map((industry) => (
                    <button
                      key={industry}
                      type="button"
                      onClick={() =>
                        updateValues({
                          industries: values.industries.filter(
                            (item) => item !== industry,
                          ),
                        })
                      }
                      className="rounded-md border border-border bg-surface-secondary px-3 py-2 text-sm font-medium text-text-primary"
                    >
                      {industry} <span className="text-text-muted">×</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </fieldset>

        <fieldset className={sectionClass}>
          <div className="mb-8 flex items-center justify-between">
            <legend className="text-base font-semibold text-text-primary">Work Experience</legend>
            <button
              type="button"
              onClick={addRole}
              disabled={values.workExperience.length >= 3}
              className="text-sm font-semibold text-accent disabled:cursor-not-allowed disabled:text-text-muted"
            >
              ＋ Add role
            </button>
          </div>
          <div className="space-y-5">
            {values.workExperience.map((role, index) => (
              <div key={index} className="rounded-lg border border-border bg-surface-secondary p-5">
                <div className="grid gap-x-5 gap-y-6 md:grid-cols-2">
                  <label>
                    <span className={labelClass}>Company Name</span>
                    <input className={inputClass} value={role.company} onChange={(event) => updateRole(index, { company: event.target.value })} />
                  </label>
                  <label>
                    <span className={labelClass}>Job Title</span>
                    <input className={inputClass} value={role.title} onChange={(event) => updateRole(index, { title: event.target.value })} />
                  </label>
                  <label>
                    <span className={labelClass}>Start Date</span>
                    <input className={inputClass} type="month" value={role.startDate} onChange={(event) => updateRole(index, { startDate: event.target.value })} />
                  </label>
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label htmlFor={`end-${index}`} className="text-xs font-semibold uppercase tracking-wide text-text-dark">End Date</label>
                      <label className="flex items-center gap-2 text-xs font-medium text-text-dark">
                        <input
                          type="checkbox"
                          checked={role.current}
                          onChange={(event) => updateRole(index, { current: event.target.checked, endDate: "" })}
                          className="size-4 accent-accent"
                        />
                        Currently working here
                      </label>
                    </div>
                    <input
                      id={`end-${index}`}
                      className={inputClass}
                      type="month"
                      value={role.endDate}
                      disabled={role.current}
                      onChange={(event) => updateRole(index, { endDate: event.target.value })}
                    />
                  </div>
                  <label className="md:col-span-2">
                    <span className={labelClass}>Key Responsibilities</span>
                    <textarea
                      className={`${inputClass} min-h-24 resize-y py-3`}
                      value={role.responsibilities}
                      onChange={(event) => updateRole(index, { responsibilities: event.target.value })}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset className={sectionClass}>
          <legend className="mb-8 text-base font-semibold text-text-primary">Education</legend>
          <div className="grid gap-x-5 gap-y-6 md:grid-cols-2">
            <label>
              <span className={labelClass}>Highest Degree</span>
              <select
                name="educationDegree"
                className={inputClass}
                value={values.education.degree}
                onChange={(event) =>
                  updateValues({
                    education: {
                      ...values.education,
                      degree: event.target.value,
                    },
                  })
                }
              >
                <option value="">Select degree</option>
                <option value="high-school">High School</option>
                <option value="associate">Associate Degree</option>
                <option value="bachelor">Bachelor&apos;s Degree</option>
                <option value="master">Master&apos;s Degree</option>
                <option value="doctorate">Doctorate</option>
              </select>
            </label>
            <label>
              <span className={labelClass}>Field of Study</span>
              <input
                name="educationFieldOfStudy"
                className={inputClass}
                value={values.education.fieldOfStudy}
                onChange={(event) =>
                  updateValues({
                    education: {
                      ...values.education,
                      fieldOfStudy: event.target.value,
                    },
                  })
                }
              />
            </label>
            <label>
              <span className={labelClass}>Institution Name</span>
              <input
                name="educationInstitution"
                className={inputClass}
                value={values.education.institution}
                onChange={(event) =>
                  updateValues({
                    education: {
                      ...values.education,
                      institution: event.target.value,
                    },
                  })
                }
                placeholder="E.g. State University"
              />
            </label>
            <label>
              <span className={labelClass}>Graduation Year</span>
              <input
                name="educationGraduationYear"
                className={inputClass}
                value={values.education.graduationYear}
                onChange={(event) =>
                  updateValues({
                    education: {
                      ...values.education,
                      graduationYear: event.target.value,
                    },
                  })
                }
                inputMode="numeric"
                placeholder="YYYY"
              />
            </label>
          </div>
        </fieldset>

        <fieldset className={sectionClass}>
          <legend className="mb-8 text-base font-semibold text-text-primary">Job Preferences</legend>
          <div className="grid gap-x-5 gap-y-6 md:grid-cols-2">
            <label className="md:col-span-2">
              <span className={labelClass}>Job Titles Seeking</span>
              <input name="jobTitlesSeeking" className={inputClass} value={values.jobTitlesSeeking} onChange={(event) => updateValues({ jobTitlesSeeking: event.target.value })} />
            </label>
            <label>
              <span className={labelClass}>Remote Preference</span>
              <select name="remotePreference" className={inputClass} value={values.remotePreference} onChange={(event) => updateValues({ remotePreference: event.target.value })}>
                <option value="">Select preference</option>
                <option value="any">Any</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
              </select>
            </label>
            <label>
              <span className={labelClass}>Salary Expectation (Optional)</span>
              <input name="salaryExpectation" className={inputClass} value={values.salaryExpectation} onChange={(event) => updateValues({ salaryExpectation: event.target.value })} placeholder="E.g. $120k+" />
            </label>
            <label className="md:col-span-2">
              <span className={labelClass}>Preferred Locations (Optional)</span>
              <input name="preferredLocations" className={inputClass} value={values.preferredLocations} onChange={(event) => updateValues({ preferredLocations: event.target.value })} placeholder="E.g. New York, London" />
            </label>
          </div>
        </fieldset>

        <div className="border-t border-border pt-6">
          {actionState.message ? (
            <p
              role="status"
              className={`mb-4 rounded-md px-4 py-3 text-sm font-medium ${
                actionState.success
                  ? "bg-success-lightest text-success-foreground"
                  : "bg-error/10 text-error"
              }`}
            >
              {actionState.message}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent-dark focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save Profile"}
          </button>
        </div>
      </div>
    </section>
  );
}
