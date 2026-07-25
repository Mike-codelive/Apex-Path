import type {
  Education,
  ProfileCompletion,
  ProfileCompletionInput,
  ProfileFormValues,
  WorkExperience,
} from "@/types/profile";

export const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024;

const EMPTY_EDUCATION: Education = {
  degree: "",
  fieldOfStudy: "",
  institution: "",
  graduationYear: "",
};

const MAX_SHORT_TEXT_LENGTH = 200;
const MAX_LONG_TEXT_LENGTH = 4000;
const MAX_TAG_COUNT = 50;
const MAX_TAG_LENGTH = 80;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function readWorkExperience(value: unknown): WorkExperience[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.slice(0, 3).flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }

    return [{
      company: readString(item.company),
      title: readString(item.title),
      startDate: readString(item.startDate),
      endDate: readString(item.endDate),
      current: item.current === true,
      responsibilities: readString(item.responsibilities),
    }];
  });
}

function readEducation(value: unknown): Education {
  if (!isRecord(value)) {
    return EMPTY_EDUCATION;
  }

  return {
    degree: readString(value.degree),
    fieldOfStudy: readString(value.fieldOfStudy),
    institution: readString(value.institution),
    graduationYear: readString(value.graduationYear),
  };
}

function isValidHttpUrl(value: string): boolean {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function hasOversizedValue(values: string[], maxLength: number): boolean {
  return values.some((value) => value.length > maxLength);
}

export function calculateProfileCompletion(
  profile: ProfileCompletionInput,
): ProfileCompletion {
  const checks = [
    ["full_name", profile.fullName.trim().length > 0],
    ["phone", profile.phone.trim().length > 0],
    ["location", profile.location.trim().length > 0],
    ["current_title", profile.currentTitle.trim().length > 0],
    ["experience_level", profile.experienceLevel.trim().length > 0],
    ["skills", profile.skills.length > 0],
    ["work_experience", profile.workExperience.length > 0],
    [
      "education",
      profile.education.degree.trim().length > 0 &&
        profile.education.fieldOfStudy.trim().length > 0 &&
        profile.education.institution.trim().length > 0 &&
        profile.education.graduationYear.trim().length > 0,
    ],
    ["job_titles_seeking", profile.jobTitlesSeeking.trim().length > 0],
    ["remote_preference", profile.remotePreference.trim().length > 0],
  ] satisfies Array<[string, boolean]>;
  const missingFields = checks
    .filter(([, complete]) => !complete)
    .map(([field]) => field);
  const percentage = (checks.length - missingFields.length) * 10;

  return {
    isComplete: percentage === 100,
    percentage,
    missingFields,
  };
}

export function validateProfileValues(
  profile: ProfileFormValues,
): string | null {
  const shortValues = [
    profile.fullName,
    profile.phone,
    profile.location,
    profile.currentTitle,
    profile.salaryExpectation,
    profile.jobTitlesSeeking,
    profile.preferredLocations,
    profile.education.degree,
    profile.education.fieldOfStudy,
    profile.education.institution,
  ];

  if (hasOversizedValue(shortValues, MAX_SHORT_TEXT_LENGTH)) {
    return "One or more profile fields are too long.";
  }

  if (
    profile.yearsExperience &&
    !/^\d+$/.test(profile.yearsExperience)
  ) {
    return "Years of experience must be a whole number.";
  }

  if (
    !isValidHttpUrl(profile.linkedinUrl) ||
    !isValidHttpUrl(profile.portfolioUrl)
  ) {
    return "LinkedIn and portfolio links must be valid web addresses.";
  }

  if (
    profile.skills.length > MAX_TAG_COUNT ||
    profile.industries.length > MAX_TAG_COUNT ||
    hasOversizedValue(profile.skills, MAX_TAG_LENGTH) ||
    hasOversizedValue(profile.industries, MAX_TAG_LENGTH)
  ) {
    return "Skills and industries must contain short, relevant entries.";
  }

  for (const role of profile.workExperience) {
    if (
      !role.company ||
      !role.title ||
      !role.startDate ||
      !role.responsibilities ||
      (!role.current && !role.endDate)
    ) {
      return "Complete every field in each work experience role.";
    }

    if (
      hasOversizedValue(
        [role.company, role.title, role.startDate, role.endDate],
        MAX_SHORT_TEXT_LENGTH,
      ) ||
      role.responsibilities.length > MAX_LONG_TEXT_LENGTH
    ) {
      return "One or more work experience fields are too long.";
    }
  }

  const educationValues = Object.values(profile.education);
  const hasEducation = educationValues.some(Boolean);

  if (hasEducation && educationValues.some((value) => !value)) {
    return "Complete every education field or leave the section empty.";
  }

  if (
    profile.education.graduationYear &&
    !/^(19|20)\d{2}$/.test(profile.education.graduationYear)
  ) {
    return "Graduation year must be a four-digit year.";
  }

  return null;
}

export function normalizeProfile(
  value: unknown,
  fallbackEmail: string,
  fallbackName: string,
): ProfileFormValues {
  const profile = isRecord(value) ? value : {};

  return {
    fullName: readString(profile.full_name) || fallbackName,
    email: readString(profile.email) || fallbackEmail,
    phone: readString(profile.phone),
    location: readString(profile.location),
    linkedinUrl: readString(profile.linkedin_url),
    portfolioUrl: readString(profile.portfolio_url),
    workAuthorization: readString(profile.work_authorization),
    currentTitle: readString(profile.current_title),
    experienceLevel: readString(profile.experience_level),
    yearsExperience:
      typeof profile.years_experience === "number"
        ? String(profile.years_experience)
        : "",
    skills: readStringArray(profile.skills),
    industries: readStringArray(profile.industries),
    workExperience: readWorkExperience(profile.work_experience),
    education: readEducation(profile.education),
    jobTitlesSeeking: readStringArray(profile.job_titles_seeking).join(", "),
    remotePreference: readString(profile.remote_preference),
    salaryExpectation: readString(profile.salary_expectation),
    preferredLocations: readStringArray(profile.preferred_locations).join(", "),
    resumePdfUrl: readString(profile.resume_pdf_url),
    isComplete: profile.is_complete === true,
    completionPercentage:
      typeof profile.completion_percentage === "number"
        ? profile.completion_percentage
        : 0,
    missingFields: readStringArray(profile.missing_fields),
  };
}
