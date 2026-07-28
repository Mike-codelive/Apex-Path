import { NextResponse } from "next/server";

import { extractProfileFromResume } from "@/agent/profile-extractor";
import { createInsforgeServer } from "@/lib/insforge-server";
import type { ProfileExtractionApiResponse } from "@/types/profile";

function errorResponse(
  error: string,
  status: number,
): NextResponse<ProfileExtractionApiResponse> {
  return NextResponse.json({ success: false, error }, { status });
}

export async function POST(): Promise<
  NextResponse<ProfileExtractionApiResponse>
> {
  try {
    const insforge = await createInsforgeServer();
    const { data: authData, error: authError } =
      await insforge.auth.getCurrentUser();

    if (authError || !authData.user) {
      return errorResponse(
        "Your session has expired. Please sign in and try again.",
        401,
      );
    }

    const { data: profile, error: profileError } = await insforge.database
      .from("profiles")
      .select("resume_pdf_url")
      .eq("id", authData.user.id)
      .single();

    if (profileError || !profile) {
      console.error(
        "[api/resume/extract] Failed to load profile",
        profileError,
      );
      return errorResponse(
        "We could not load your resume. Please try again.",
        500,
      );
    }

    const resumeKey =
      typeof profile.resume_pdf_url === "string"
        ? profile.resume_pdf_url
        : "";

    if (
      !resumeKey ||
      !resumeKey.startsWith(`${authData.user.id}/`)
    ) {
      return errorResponse(
        "Upload a resume before extracting profile details.",
        404,
      );
    }

    const { data: resumeBlob, error: downloadError } = await insforge.storage
      .from("resumes")
      .download(resumeKey);

    if (downloadError || !resumeBlob) {
      console.error(
        "[api/resume/extract] Resume download failed",
        downloadError,
      );
      return errorResponse(
        "We could not read your uploaded resume. Please try again.",
        500,
      );
    }

    const extraction = await extractProfileFromResume(
      new Uint8Array(await resumeBlob.arrayBuffer()),
    );

    if (!extraction.success) {
      if (
        extraction.code === "invalid_pdf" ||
        extraction.code === "unreadable_pdf"
      ) {
        return errorResponse(
          "Could not extract text from this PDF. Please try a different file.",
          422,
        );
      }

      return errorResponse(
        "We could not extract your profile. Please try again.",
        502,
      );
    }

    return NextResponse.json({
      success: true,
      data: extraction.data,
    });
  } catch (error) {
    console.error("[api/resume/extract]", error);
    return errorResponse(
      "We could not extract your profile. Please try again.",
      500,
    );
  }
}
