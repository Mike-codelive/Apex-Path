import { LoginForm } from "@/components/auth/LoginForm";
import Image from "next/image";
import Link from "next/link";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

const errorMessages: Record<string, string> = {
  oauth: "We couldn’t complete sign-in. Please try again.",
};

export default async function LoginPage({
  searchParams,
}: LoginPageProps): Promise<React.ReactNode> {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="flex w-full max-w-md flex-col items-center">
        <Link className="mb-8" href="/" aria-label="JobPilot home">
          <Image alt="JobPilot" height={40} priority src="/logo.png" width={118} />
        </Link>
        <LoginForm initialError={error ? errorMessages[error] : undefined} />
      </div>
    </main>
  );
}
