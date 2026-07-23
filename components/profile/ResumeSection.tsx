"use client";

import { useRef, useState } from "react";

export function ResumeSection(): React.ReactNode {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  function openFilePicker(): void {
    inputRef.current?.click();
  }

  function updateFileName(file: File | undefined): void {
    if (file?.type === "application/pdf") {
      setFileName(file.name);
    }
  }

  return (
    <section className="rounded-xl border border-border bg-surface p-6 shadow-sm lg:p-8">
      <h2 className="text-xl font-semibold text-text-primary">Resume</h2>
      <p className="mt-1 text-sm text-text-secondary">
        Upload an existing resume to auto-fill the profile, or generate a new tailored one from your details below.
      </p>
      <div
        className="mt-6 flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface-secondary px-6 py-10 text-center"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          updateFileName(event.dataTransfer.files[0]);
        }}
      >
        <div className="grid size-14 place-items-center rounded-full border border-border bg-surface text-accent shadow-sm">
          <svg aria-hidden="true" className="size-7" viewBox="0 0 24 24" fill="none">
            <path d="M12 17V8m0 0-3.5 3.5M12 8l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 18.5H5.8A3.8 3.8 0 0 1 5.2 11a6.8 6.8 0 0 1 13.1 1.2A3.2 3.2 0 0 1 18 18.5h-1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <p className="mt-5 text-base font-semibold text-text-primary">
          {fileName || "Click to upload or drag and drop"}
        </p>
        <p className="mt-1 text-sm text-text-secondary">PDF formatting only. Maximum file size 5MB.</p>
        <input
          ref={inputRef}
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
    </section>
  );
}
