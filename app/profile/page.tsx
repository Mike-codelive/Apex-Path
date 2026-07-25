import { Navbar } from "@/components/layout/Navbar";
import { ProfileEditor } from "@/components/profile/ProfileEditor";
import { ProfileLoadError } from "@/components/profile/ProfileLoadError";
import { createInsforgeServer } from "@/lib/insforge-server";
import { normalizeProfile } from "@/lib/profile";
import { redirect } from "next/navigation";

export default async function ProfilePage(): Promise<React.ReactNode> {
  const insforge = await createInsforgeServer();
  const { data: authData, error: authError } =
    await insforge.auth.getCurrentUser();

  if (authError || !authData.user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await insforge.database
    .from("profiles")
    .select("*")
    .eq("id", authData.user.id)
    .single();

  if (profileError || !profile) {
    console.error("[profile/page] Failed to load profile", profileError);
    return (
      <>
        <Navbar authenticated activePath="/profile" />
        <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:py-12">
          <div className="mx-auto max-w-5xl">
            <ProfileLoadError />
          </div>
        </main>
      </>
    );
  }

  const profileName =
    typeof authData.user.profile?.name === "string"
      ? authData.user.profile.name
      : "";
  const initialValues = normalizeProfile(
    profile,
    authData.user.email ?? "",
    profileName,
  );
  let resumeDownloadUrl = "";

  if (initialValues.resumePdfUrl) {
    const { data: signedResume, error: signedResumeError } =
      await insforge.storage
        .from("resumes")
        .createSignedUrl(initialValues.resumePdfUrl, 3600);

    if (signedResumeError) {
      console.error(
        "[profile/page] Failed to create resume URL",
        signedResumeError,
      );
    } else {
      resumeDownloadUrl = signedResume?.signedUrl ?? "";
    }
  }

  return (
    <>
      <Navbar authenticated activePath="/profile" />
      <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:py-12">
        <div className="mx-auto max-w-5xl">
          <ProfileEditor
            initialValues={initialValues}
            resumeDownloadUrl={resumeDownloadUrl}
          />
        </div>
      </main>
    </>
  );
}
