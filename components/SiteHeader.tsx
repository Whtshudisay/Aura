"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/actions/auth";

export function SiteHeader({
  streakDays = 0,
  userName,
}: {
  streakDays?: number;
  userName?: string | null;
}) {
  const pathname = usePathname();
  const onLibrary = pathname === "/" || pathname.startsWith("/library");
  const onProfile = pathname.startsWith("/profile");

  return (
    <header className="page-shell flex items-center justify-between gap-4 py-6">
      <Link
        href="/"
        className="flex items-center gap-2.5 text-[var(--color-on-surface)] transition-opacity hover:opacity-90"
        aria-label="AURA home"
      >
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-sage-soft)] ring-1 ring-[var(--glass-border)]"
          aria-hidden
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 text-[var(--color-primary)]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="4" />
            <circle cx="12" cy="12" r="8" opacity="0.45" />
          </svg>
        </span>
        <span className="label-caps tracking-[0.18em]">Aura</span>
      </Link>

      <nav
        className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 sm:flex"
        aria-label="Primary"
      >
        <NavLink href="/" active={onLibrary}>
          Library
        </NavLink>
        <NavLink href="/profile" active={onProfile}>
          Profile
        </NavLink>
      </nav>

      <div className="flex items-center gap-2 sm:gap-3">
        <div
          className="glass inline-flex items-center rounded-full px-3.5 py-1.5 text-sm text-[var(--color-on-surface-variant)]"
          aria-label={`Daily streak: ${streakDays} days`}
        >
          <span className="mr-1.5 hidden text-[var(--color-primary)] sm:inline" aria-hidden>
            ✦
          </span>
          Daily Streak: {streakDays}
        </div>

        {userName ? (
          <form action={logoutAction}>
            <button
              type="submit"
              className="hidden rounded-full px-3 py-1.5 text-xs tracking-wide text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-on-surface)] sm:inline"
            >
              Sign out
            </button>
          </form>
        ) : (
          <Link
            href="/login"
            className="hidden rounded-full px-3 py-1.5 text-xs tracking-wide text-[var(--color-primary)] sm:inline"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "label-caps pb-1 transition-colors",
        active
          ? "text-[var(--color-on-surface)] border-b border-[var(--color-primary)]"
          : "text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]",
      )}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
