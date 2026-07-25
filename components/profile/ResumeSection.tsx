"use client";

import { useRef, useState, useTransition } from "react";

import { uploadResume } from "@/actions/profile";
import { MAX_RESUME_SIZE_BYTES } from "@/lib/profile";
import type { ResumeActionState } from "@/types/profile";

const INITIAL_RESUME_STATE: ResumeActionState = {
  success: false,
  message: "",
};

type ResumeSectionProps = {
  resumeDownloadUrl: string;
};

export function ResumeSection({
  resumeDownloadUrl,
}: ResumeSectionProps): React.ReactNode {
  const inputRef = useRef<HTMLInputElement>(null);
  const [actionState, setActionState] = useState<ResumeActionState>(
    INITIAL_RESUME_STATE,
  );
  const [pending, startTransition] = useTransition();
  const [fileName, setFileName] = useState<string>("");
  const [selectionError, setSelectionError] = useState<string>("");
  const currentResumeUrl =
    actionState.resumeDownloadUrl ?? resumeDownloadUrl;

  function submitResume(formData: FormData): void {
    startTransition(async () => {
      const result = await uploadResume(INITIAL_RESUME_STATE, formData);
      setActionState(result);

      if (result.success) {
        setFileName("");
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    });
  }

  function openFilePicker(): void {
    inputRef.current?.click();
  }

  function updateFileName(file: File | undefined): void {
    if (!file) {
      setFileName("");
      return;
    }

    if (file.type !== "application/pdf") {
      setFileName("");
      setSelectionError("Please select a PDF resume.");
      return;
    }

    if (file.size > MAX_RESUME_SIZE_BYTES) {
      setFileName("");
      setSelectionError("Your resume must be 5 MB or smaller.");
      return;
    }

    setSelectionError("");
    setActionState(INITIAL_RESUME_STATE);
    setFileName(file.name);
  }

  return (
    <form action={submitResume} className="rounded-xl border border-border bg-surface p-6 shadow-sm lg:p-8">
      <h2 className="text-xl font-semibold text-text-primary">Resume</h2>
      <p className="mt-1 text-sm text-text-secondary">
        Upload an existing resume to auto-fill the profile, or generate a new tailored one from your details below.
      </p>
      <div
        className="mt-6 flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface-secondary px-6 py-10 text-center"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const file = event.dataTransfer.files[0];
          updateFileName(file);
          if (file?.type === "application/pdf" && inputRef.current) {
            inputRef.current.files = event.dataTransfer.files;
          }
        }}
      >
        <div className="grid size-14 place-items-center rounded-full border border-border bg-surface text-accent shadow-sm">
          <svg aria-hidden="true" className="size-7" viewBox="0 0 24 24" fill="none">
            <path d="M12 17V8m0 0-3.5 3.5M12 8l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 18.5H5.8A3.8 3.8 0 0 1 5.2 11a6.8 6.8 0 0 1 13.1 1.2A3.2 3.2 0 0 1 18 18.5h-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <p className="mt-5 text-base font-semibold text-text-primary">
          {fileName ||
            (currentResumeUrl
              ? "Resume uploaded — select a PDF to replace it"
              : "Click to upload or drag and drop")}
        </p>
        <p className="mt-1 text-sm text-text-secondary">PDF formatting only. Maximum file size 5MB.</p>
        <input
          ref={inputRef}
          name="resume"
          type="file"
          accept="application/pdf"
          className="sr-only"
          onChange={(event) => updateFileName(event.target.files?.[0])}
        />
        <button
          type="button"
          onClick={openFilePicker}
          className="mt-6 rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-text-dark shadow-sm transition-colors hover:bg-surface-secondary focus:ring-2 focus:ring-accent focus:outline-none"
        >
          Select Resume
        </button>
        {fileName ? (
          <button
            type="submit"
            disabled={pending}
            className="mt-3 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent-dark focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Uploading…" : "Upload Resume"}
          </button>
        ) : null}
        {selectionError || actionState.message ? (
          <p
            role="status"
            className={`mt-3 rounded-md px-3 py-2 text-sm font-medium ${
              actionState.success && !selectionError
                ? "bg-success-lightest text-success-foreground"
                : "bg-error/10 text-error"
            }`}
          >
            {selectionError || actionState.message}
          </p>
        ) : null}
        {currentResumeUrl ? (
          <a
            href={currentResumeUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-accent-dark focus:ring-2 focus:ring-accent focus:outline-none"
          >
            <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none">
              <path d="M7 3h7l4 4v14H7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M14 3v5h4M10 13h5M10 17h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            View uploaded resume
          </a>
        ) : null}
      </div>
      <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-border pt-5 sm:flex-row sm:items-center">
        <p className="text-sm text-text-secondary">Need a fresh document based on the fields below?</p>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent-dark focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:outline-none sm:w-auto"
        >
          <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none">
            <path d="M7 3h7l4 4v14H7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M14 3v5h4M10 12h5M10 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Generate Resume from Profile
        </button>
      </div>
    </form>
  );
}
