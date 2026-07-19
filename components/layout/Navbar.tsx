import Image from "next/image";
import Link from "next/link";

const navigation = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/find-jobs", label: "Find Jobs" },
  { href: "/profile", label: "Profile" },
];

export function Navbar(): React.ReactNode {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6">
        <Link href="/" className="flex items-center" aria-label="JobPilot home">
          <Image src="/logo.png" alt="JobPilot" width={118} height={40} priority />
        </Link>
        <nav className="hidden items-center gap-8 sm:flex" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-medium text-text-dark transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/login"
          className="rounded-md bg-overlay px-4 py-2 text-xs font-medium text-accent-foreground transition-colors hover:bg-text-slate"
        >
          Start for free
        </Link>
      </div>
    </header>
  );
}
