"use client";

import { useActionState } from "react";

import { saveProfile } from "@/actions/profile";
import { CompletionBanner } from "@/components/profile/CompletionBanner";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ResumeSection } from "@/components/profile/ResumeSection";
import type { ProfileActionState, ProfileFormValues } from "@/types/profile";

const INITIAL_ACTION_STATE: ProfileActionState = {
  success: false,
  message: "",
};

type ProfileEditorProps = {
  initialValues: ProfileFormValues;
  resumeDownloadUrl: string;
};

export function ProfileEditor({
  initialValues,
  resumeDownloadUrl,
}: ProfileEditorProps): React.ReactNode {
  const [actionState, formAction] = useActionState(
    saveProfile,
    INITIAL_ACTION_STATE,
  );
  const completionPercentage =
    actionState.completionPercentage ?? initialValues.completionPercentage;
  const missingFields =
    actionState.missingFields ?? initialValues.missingFields;

  return (
    <div className="space-y-6">
      <CompletionBanner
        completionPercentage={completionPercentage}
        missingFields={missingFields}
      />
      <ResumeSection resumeDownloadUrl={resumeDownloadUrl} />
      <form action={formAction}>
        <ProfileForm initialValues={initialValues} actionState={actionState} />
      </form>
    </div>
  );
}
