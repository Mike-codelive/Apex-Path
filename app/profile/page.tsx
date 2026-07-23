import { Navbar } from "@/components/layout/Navbar";
import { CompletionBanner } from "@/components/profile/CompletionBanner";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ResumeSection } from "@/components/profile/ResumeSection";

export default function ProfilePage(): React.ReactNode {
  return (
    <>
      <Navbar authenticated activePath="/profile" />
      <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:py-12">
        <div className="mx-auto max-w-5xl space-y-6">
          <CompletionBanner />
          <ResumeSection />
          <ProfileForm />
        </div>
      </main>
    </>
  );
}
