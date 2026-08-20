import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { TechniqueCard } from "@/components/TechniqueCard";
import { getAllPatterns } from "@/data/patterns";
import { getSessionUser } from "@/lib/auth";
import { getWeeklyProgressForUser } from "@/lib/progress";

export default async function LibraryPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const all = getAllPatterns();
  const progress = await getWeeklyProgressForUser(user.id, user.weeklyGoalMin);

  return (
    <div className="min-h-dvh pb-16">
      <SiteHeader streakDays={progress.streakDays} userName={user.name} />
      <main className="page-shell mt-6 lg:mt-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="label-caps mb-2 text-[var(--color-primary)]">Library</p>
            <h1 className="headline-lg text-[var(--color-on-surface)]">All techniques</h1>
          </div>
          <Link
            href="/"
            className="text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"
          >
            ← Home
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {all.map((pattern) => (
            <TechniqueCard key={pattern.id} pattern={pattern} />
          ))}
        </div>
      </main>
    </div>
  );
}
