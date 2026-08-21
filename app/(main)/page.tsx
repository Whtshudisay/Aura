import { FeaturedPatternCard } from "@/components/FeaturedPatternCard";
import { TechniqueCard, ViewAllCard } from "@/components/TechniqueCard";
import { WeeklyProgressSidebar } from "@/components/WeeklyProgressSidebar";
import { CalmNowBanner, CalmNowFab } from "@/components/CalmNowButton";
import {
  getAllPatterns,
  getFeaturedPattern,
  getLibraryGridPatterns,
} from "@/data/patterns";
import { getSessionUser } from "@/lib/auth";
import { isGuestAllowedPattern } from "@/lib/guestAccess";
import { emptyWeeklyProgress, getWeeklyProgressForUser } from "@/lib/progress";

export default async function HomePage() {
  const user = await getSessionUser();
  const featured = getFeaturedPattern();
  const grid = getLibraryGridPatterns();
  const total = getAllPatterns().length;
  const progress = user
    ? await getWeeklyProgressForUser(user.id, user.weeklyGoalMin)
    : emptyWeeklyProgress();
  const firstName = user?.name?.split(/\s+/)[0] || "friend";
  const isGuest = !user;

  return (
    <main className="page-shell mt-4 flex w-full flex-col gap-8 lg:mt-8 lg:gap-10">
      <h1 className="display-lg text-[var(--color-on-surface)]">
        Find your center, {firstName}.
      </h1>

      <CalmNowBanner />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.85fr)] lg:items-stretch xl:grid-cols-[minmax(0,2fr)_minmax(300px,0.75fr)] xl:gap-8">
        <FeaturedPatternCard pattern={featured} />
        <WeeklyProgressSidebar progress={progress} signedIn={Boolean(user)} />
      </div>

      <section aria-labelledby="techniques-heading">
        <h2 id="techniques-heading" className="sr-only">
          Breathing techniques
        </h2>
        {isGuest && (
          <p className="mb-4 text-sm text-[var(--color-on-surface-variant)]">
            Guest access includes{" "}
            <span className="text-[var(--color-on-surface)]">Box Breathing</span>{" "}
            only. Sign up to unlock the full library.
          </p>
        )}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4 xl:gap-5">
          {grid.map((pattern) => (
            <TechniqueCard
              key={pattern.id}
              pattern={pattern}
              locked={isGuest && !isGuestAllowedPattern(pattern.id)}
            />
          ))}
          <ViewAllCard total={total} />
        </div>
      </section>
      <CalmNowFab />
    </main>
  );
}
