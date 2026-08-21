import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { getSessionUser } from "@/lib/auth";
import { getWeeklyProgressForUser } from "@/lib/progress";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const progress = await getWeeklyProgressForUser(user.id, user.weeklyGoalMin);

  return (
    <div className="min-h-dvh pb-16">
      <SiteHeader streakDays={progress.streakDays} userName={user.name} />
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
