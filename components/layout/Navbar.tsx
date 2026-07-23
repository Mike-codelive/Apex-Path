import Image from "next/image";
import Link from "next/link";

const navigation = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/find-jobs", label: "Find Jobs" },
  { href: "/profile", label: "Profile" },
];

type NavbarProps = {
  activePath?: string;
  authenticated?: boolean;
};

function NavigationIcon({ path }: { path: string }): React.ReactNode {
  if (path === "/dashboard") {
    return (
      <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.8" />
        <rect x="15" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.8" />
        <rect x="3" y="15" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.8" />
        <rect x="15" y="15" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (path === "/find-jobs") {
    return (
      <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5.5 21v-2.2a6.5 6.5 0 0 1 13 0V21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Navbar({
  activePath,
  authenticated = false,
}: NavbarProps): React.ReactNode {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6">
        <Link href="/" className="flex items-center" aria-label="JobPilot home">
          <Image src="/logo.png" alt="JobPilot" width={118} height={40} priority />
        </Link>
        <nav
          className={`items-center self-stretch ${authenticated ? "flex gap-3 sm:gap-8" : "hidden gap-8 sm:flex"}`}
          aria-label="Primary navigation"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={activePath === item.href ? "page" : undefined}
              className={`relative flex h-full items-center gap-2 text-sm font-medium transition-colors ${
                activePath === item.href
                  ? "text-accent after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-accent"
                  : "text-text-dark hover:text-accent"
              }`}
            >
              {authenticated ? <NavigationIcon path={item.href} /> : null}
              <span className={authenticated ? "hidden sm:inline" : undefined}>
              {item.label}
              </span>
            </Link>
          ))}
        </nav>
        {!authenticated ? (
          <Link
            href="/login"
            className="rounded-md bg-overlay px-4 py-2 text-xs font-medium text-accent-foreground transition-colors hover:bg-text-slate"
          >
            Start for free
          </Link>
        ) : null}
      </div>
    </header>
  );
}
