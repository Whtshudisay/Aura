import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { GuestBanner } from "@/components/GuestBanner";
import { getSessionUser } from "@/lib/auth";
import { emptyWeeklyProgress, getWeeklyProgressForUser } from "@/lib/progress";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  const progress = user
    ? await getWeeklyProgressForUser(user.id, user.weeklyGoalMin)
    : emptyWeeklyProgress();

  return (
    <div className="min-h-dvh pb-16">
      <SiteHeader streakDays={progress.streakDays} userName={user?.name ?? null} />
      <GuestBanner signedIn={Boolean(user)} />
      {children}
      <nav
        className="fixed inset-x-0 bottom-0 z-20 flex border-t border-[var(--glass-border)] bg-[var(--color-surface-lowest)]/90 px-6 py-3 backdrop-blur-xl sm:hidden"
        aria-label="Mobile"
      >
        <Link href="/" className="flex-1 text-center label-caps text-[var(--color-primary)]">
          Library
        </Link>
        <Link
          href="/profile"
          className="flex-1 text-center label-caps text-[var(--color-on-surface-variant)]"
        >
          Profile
        </Link>
      </nav>
    </div>
  );
}
