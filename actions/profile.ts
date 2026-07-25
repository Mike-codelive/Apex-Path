"use server";

import { revalidatePath } from "next/cache";

import { createInsforgeServer } from "@/lib/insforge-server";
import { createPostHogServer } from "@/lib/posthog-server";
import {
  calculateProfileCompletion,
  MAX_RESUME_SIZE_BYTES,
  validateProfileValues,
} from "@/lib/profile";
import type {
  Education,
  ProfileActionState,
  ProfileFormValues,
  ResumeActionState,
  WorkExperience,
} from "@/types/profile";

const EXPERIENCE_LEVELS = new Set(["junior", "mid", "senior", "lead"]);
const REMOTE_PREFERENCES = new Set(["remote", "onsite", "hybrid", "any"]);
const WORK_AUTHORIZATIONS = new Set([
  "citizen",
  "permanent_resident",
  "visa_required",
]);

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readStringArray(formData: FormData, key: string): string[] {
  const value = readJson(readString(formData, key));

  if (!Array.isArray(value)) {
    return [];
  }

  return [
    ...new Set(
      value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ];
}

function readWorkExperience(formData: FormData): WorkExperience[] | null {
  const value = readJson(readString(formData, "workExperience"));

  if (!Array.isArray(value) || value.length > 3) {
    return null;
  }

  const roles: WorkExperience[] = [];

  for (const item of value) {
    if (!isRecord(item)) {
      return null;
    }

    roles.push({
      company: typeof item.company === "string" ? item.company.trim() : "",
      title: typeof item.title === "string" ? item.title.trim() : "",
      startDate: typeof item.startDate === "string" ? item.startDate.trim() : "",
      endDate: typeof item.endDate === "string" ? item.endDate.trim() : "",
      current: item.current === true,
      responsibilities:
        typeof item.responsibilities === "string"
          ? item.responsibilities.trim()
          : "",
    });
  }

  return roles.filter((role) =>
    [role.company, role.title, role.startDate, role.responsibilities].some(Boolean),
  );
}

function readEducation(formData: FormData): Education {
  return {
    degree: readString(formData, "educationDegree"),
    fieldOfStudy: readString(formData, "educationFieldOfStudy"),
    institution: readString(formData, "educationInstitution"),
    graduationYear: readString(formData, "educationGraduationYear"),
  };
}

function splitCommaSeparated(value: string): string[] {
  return [...new Set(value.split(",").map((item) => item.trim()).filter(Boolean))];
}

async function captureProfileCompleted(userId: string): Promise<void> {
  try {
    const posthog = createPostHogServer();
    await posthog.captureImmediate({
      distinctId: userId,
      event: "profile_completed",
      properties: { userId },
    });
    await posthog._shutdown(3000);
  } catch (error) {
    console.error("[actions/profile] Failed to capture profile_completed", error);
  }
}

export async function saveProfile(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  try {
    const insforge = await createInsforgeServer();
    const { data: authData, error: authError } =
      await insforge.auth.getCurrentUser();

    if (authError || !authData.user) {
      return {
        success: false,
        message: "Your session has expired. Please sign in and try again.",
      };
    }

    const workExperience = readWorkExperience(formData);
    const education = readEducation(formData);

    if (!workExperience) {
      return {
        success: false,
        message: "Some profile information is invalid. Please review the form.",
      };
    }

    const yearsExperienceValue = readString(formData, "yearsExperience");
    const yearsExperience = yearsExperienceValue
      ? Number(yearsExperienceValue)
      : null;

    if (
      yearsExperience !== null &&
      (!Number.isInteger(yearsExperience) || yearsExperience < 0)
    ) {
      return {
        success: false,
        message: "Years of experience must be zero or greater.",
      };
    }

    const experienceLevel = readString(formData, "experienceLevel");
    const remotePreference = readString(formData, "remotePreference");
    const workAuthorization = readString(formData, "workAuthorization");

    if (
      (experienceLevel && !EXPERIENCE_LEVELS.has(experienceLevel)) ||
      (remotePreference && !REMOTE_PREFERENCES.has(remotePreference)) ||
      (workAuthorization && !WORK_AUTHORIZATIONS.has(workAuthorization))
    ) {
      return {
        success: false,
        message: "One of the selected profile options is invalid.",
      };
    }

    const values: ProfileFormValues = {
      fullName: readString(formData, "fullName"),
      email: authData.user.email ?? "",
      phone: readString(formData, "phone"),
      location: readString(formData, "location"),
      linkedinUrl: readString(formData, "linkedinUrl"),
      portfolioUrl: readString(formData, "portfolioUrl"),
      workAuthorization,
      currentTitle: readString(formData, "currentTitle"),
      experienceLevel,
      yearsExperience: yearsExperienceValue,
      skills: readStringArray(formData, "skills"),
      industries: readStringArray(formData, "industries"),
      workExperience,
      education,
      jobTitlesSeeking: readString(formData, "jobTitlesSeeking"),
      remotePreference,
      salaryExpectation: readString(formData, "salaryExpectation"),
      preferredLocations: readString(formData, "preferredLocations"),
      resumePdfUrl: "",
      isComplete: false,
      completionPercentage: 0,
      missingFields: [],
    };
    const validationError = validateProfileValues(values);

    if (validationError) {
      return {
        success: false,
        message: validationError,
      };
    }

    const completion = calculateProfileCompletion(values);

    const { data: currentProfile, error: currentProfileError } =
      await insforge.database
        .from("profiles")
        .select("resume_pdf_url, is_complete, cover_letter_tone")
        .eq("id", authData.user.id)
        .single();

    if (currentProfileError || !currentProfile) {
      console.error("[actions/profile] Failed to load current profile", currentProfileError);
      return {
        success: false,
        message: "We could not load your profile. Please try again.",
      };
    }

    const { error: updateError } = await insforge.database
      .from("profiles")
      .update({
        full_name: values.fullName || null,
        email: authData.user.email,
        phone: values.phone || null,
        location: values.location || null,
        current_title: values.currentTitle || null,
        experience_level: values.experienceLevel || null,
        years_experience: yearsExperience,
        skills: values.skills,
        industries: values.industries,
        work_experience: values.workExperience,
        education: values.education,
        job_titles_seeking: splitCommaSeparated(values.jobTitlesSeeking),
        remote_preference: values.remotePreference || null,
        preferred_locations: splitCommaSeparated(values.preferredLocations),
        salary_expectation: values.salaryExpectation || null,
        linkedin_url: values.linkedinUrl || null,
        portfolio_url: values.portfolioUrl || null,
        work_authorization: values.workAuthorization || null,
        resume_pdf_url:
          typeof currentProfile.resume_pdf_url === "string"
            ? currentProfile.resume_pdf_url
            : null,
        is_complete: completion.isComplete,
        completion_percentage: completion.percentage,
        missing_fields: completion.missingFields,
        cover_letter_tone:
          typeof currentProfile.cover_letter_tone === "string"
            ? currentProfile.cover_letter_tone
            : null,
      })
      .eq("id", authData.user.id);

    if (updateError) {
      console.error("[actions/profile] Profile update failed", updateError);
      return {
        success: false,
        message: "We could not save your profile. Please try again.",
      };
    }

    if (currentProfile.is_complete !== true && completion.isComplete) {
      await captureProfileCompleted(authData.user.id);
    }

    revalidatePath("/profile");

    return {
      success: true,
      message: "Your profile has been saved.",
      completionPercentage: completion.percentage,
      missingFields: completion.missingFields,
    };
  } catch (error) {
    console.error("[actions/profile]", error);
    return {
      success: false,
      message: "We could not save your profile. Please try again.",
    };
  }
}

export async function uploadResume(
  _previousState: ResumeActionState,
  formData: FormData,
): Promise<ResumeActionState> {
  try {
    const resume = formData.get("resume");

    if (!(resume instanceof File) || resume.size === 0) {
      return {
        success: false,
        message: "Select a PDF resume before uploading.",
      };
    }

    if (resume.type !== "application/pdf") {
      return {
        success: false,
        message: "Please select a PDF resume.",
      };
    }

    if (resume.size > MAX_RESUME_SIZE_BYTES) {
      return {
        success: false,
        message: "Your resume must be 5 MB or smaller.",
      };
    }

    const insforge = await createInsforgeServer();
    const { data: authData, error: authError } =
      await insforge.auth.getCurrentUser();

    if (authError || !authData.user) {
      return {
        success: false,
        message: "Your session has expired. Please sign in and try again.",
      };
    }

    const { data: currentProfile, error: currentProfileError } =
      await insforge.database
        .from("profiles")
        .select("resume_pdf_url")
        .eq("id", authData.user.id)
        .single();

    if (currentProfileError || !currentProfile) {
      console.error(
        "[actions/profile] Failed to load resume profile",
        currentProfileError,
      );
      return {
        success: false,
        message: "We could not load your current resume. Please try again.",
      };
    }

    const previousResumeKey =
      typeof currentProfile.resume_pdf_url === "string"
        ? currentProfile.resume_pdf_url
        : "";
    const resumeKey = `${authData.user.id}/resume.pdf`;
    const { data: uploadData, error: uploadError } = await insforge.storage
      .from("resumes")
      .upload(resumeKey, resume);

    if (uploadError || !uploadData) {
      console.error("[actions/profile] Resume upload failed", uploadError);
      return {
        success: false,
        message: "We could not upload your resume. Please try again.",
      };
    }

    const { error: updateError } = await insforge.database
      .from("profiles")
      .update({ resume_pdf_url: uploadData.key })
      .eq("id", authData.user.id);

    if (updateError) {
      console.error("[actions/profile] Resume profile update failed", updateError);

      if (uploadData.key !== previousResumeKey) {
        const { error: cleanupError } = await insforge.storage
          .from("resumes")
          .remove(uploadData.key);

        if (cleanupError) {
          console.error(
            "[actions/profile] Failed to roll back resume upload",
            cleanupError,
          );
        }
      }

      return {
        success: false,
        message: "Your resume uploaded, but we could not save it to your profile.",
      };
    }

    if (previousResumeKey && previousResumeKey !== uploadData.key) {
      const { error: removePreviousError } = await insforge.storage
        .from("resumes")
        .remove(previousResumeKey);

      if (removePreviousError) {
        console.error(
          "[actions/profile] Failed to remove previous resume",
          removePreviousError,
        );
      }
    }

    const { data: signedResume, error: signedResumeError } =
      await insforge.storage
        .from("resumes")
        .createSignedUrl(uploadData.key, 3600);

    if (signedResumeError || !signedResume) {
      console.error("[actions/profile] Resume URL creation failed", signedResumeError);
      revalidatePath("/profile");
      return {
        success: true,
        message: "Your resume has been uploaded.",
      };
    }

    revalidatePath("/profile");

    return {
      success: true,
      message: "Your resume has been uploaded.",
      resumeDownloadUrl: signedResume.signedUrl,
    };
  } catch (error) {
    console.error("[actions/profile/uploadResume]", error);
    return {
      success: false,
      message: "We could not upload your resume. Please try again.",
    };
  }
}
