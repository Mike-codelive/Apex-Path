import Image from "next/image";
import Link from "next/link";

export function Footer(): React.ReactNode {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-6 py-7 sm:flex-row sm:items-center sm:justify-between">
        <Image src="/logo.png" alt="JobPilot" width={118} height={40} />
        <nav className="flex flex-wrap gap-6 text-xs text-text-secondary" aria-label="Footer navigation">
          <Link href="/dashboard" className="hover:text-accent">Dashboard</Link>
          <Link href="/" className="hover:text-accent">Privacy Policy</Link>
          <Link href="/" className="hover:text-accent">Terms &amp; Condition</Link>
        </nav>
      </div>
    </footer>
  );
}
