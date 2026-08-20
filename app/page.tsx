import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { FeaturedPatternCard } from "@/components/FeaturedPatternCard";
import { TechniqueCard, ViewAllCard } from "@/components/TechniqueCard";
import { WeeklyProgressSidebar } from "@/components/WeeklyProgressSidebar";
import {
  getAllPatterns,
  getFeaturedPattern,
  getLibraryGridPatterns,
} from "@/data/patterns";
import { getSessionUser } from "@/lib/auth";
import { getWeeklyProgressForUser } from "@/lib/progress";

export default async function HomePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const featured = getFeaturedPattern();
  const grid = getLibraryGridPatterns();
  const total = getAllPatterns().length;
  const progress = await getWeeklyProgressForUser(user.id, user.weeklyGoalMin);
  const firstName = user.name.split(/\s+/)[0] || user.name;

  return (
    <div className="min-h-dvh pb-16">
      <SiteHeader streakDays={progress.streakDays} userName={user.name} />

      <main className="page-shell mt-4 flex w-full flex-col gap-8 lg:mt-8 lg:gap-10">
        <h1 className="display-lg text-[var(--color-on-surface)]">
          Find your center, {firstName}.
        </h1>

        {/* Top row: featured + weekly progress share the full width */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.85fr)] lg:items-stretch xl:grid-cols-[minmax(0,2fr)_minmax(300px,0.75fr)] xl:gap-8">
          <FeaturedPatternCard pattern={featured} />
          <WeeklyProgressSidebar progress={progress} signedIn />
        </div>

        {/* Technique grid uses the full content width under both widgets */}
        <section aria-labelledby="techniques-heading">
          <h2 id="techniques-heading" className="sr-only">
            Breathing techniques
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4 xl:gap-5">
            {grid.map((pattern) => (
              <TechniqueCard key={pattern.id} pattern={pattern} />
            ))}
            <ViewAllCard total={total} />
          </div>
        </section>
      </main>

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
