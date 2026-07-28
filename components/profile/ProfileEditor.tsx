"use client";

import { useActionState, useState } from "react";

import { saveProfile } from "@/actions/profile";
import { CompletionBanner } from "@/components/profile/CompletionBanner";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ResumeSection } from "@/components/profile/ResumeSection";
import type {
  ProfileActionState,
  ProfileExtractedValues,
  ProfileFormValues,
} from "@/types/profile";

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
  const [draft, setDraft] = useState<ProfileFormValues>(initialValues);
  const completionPercentage =
    actionState.completionPercentage ?? initialValues.completionPercentage;
  const missingFields =
    actionState.missingFields ?? initialValues.missingFields;

  function applyExtraction(values: ProfileExtractedValues): void {
    setDraft((current) => ({
      ...current,
      ...values,
    }));
  }

  return (
    <div className="space-y-6">
      <CompletionBanner
        completionPercentage={completionPercentage}
        missingFields={missingFields}
      />
      <ResumeSection
        hasResume={Boolean(initialValues.resumePdfUrl)}
        resumeDownloadUrl={resumeDownloadUrl}
        onExtracted={applyExtraction}
      />
      <form action={formAction}>
        <ProfileForm
          values={draft}
          actionState={actionState}
          onValuesChange={setDraft}
        />
      </form>
    </div>
  );
}
