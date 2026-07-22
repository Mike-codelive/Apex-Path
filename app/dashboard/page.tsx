import { PostHogIdentify } from "@/components/analytics/PostHogIdentify";
import { createInsforgeServer } from "@/lib/insforge-server";
import { redirect } from "next/navigation";

export default async function DashboardPage(): Promise<React.ReactNode> {
  const insforge = await createInsforgeServer();
  const { data, error } = await insforge.auth.getCurrentUser();

  if (error || !data.user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <PostHogIdentify userId={data.user.id} />
      <section className="w-full max-w-md rounded-xl border border-border bg-surface p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-accent">You’re signed in</p>
        <h1 className="mt-3 text-2xl font-semibold text-text-primary">Welcome to JobPilot</h1>
        <p className="mt-3 text-sm leading-6 text-text-secondary">
          Your dashboard is being prepared for the next phase of the build.
        </p>
      </section>
    </main>
  );
}
