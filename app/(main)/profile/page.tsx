import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import { getSessionUser } from "@/lib/auth";
import { getWeeklyProgressForUser } from "@/lib/progress";
import { MoodInsightCard } from "@/components/MoodInsightCard";

export default async function ProfilePage() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <main className="page-shell mt-6 max-w-lg lg:mt-10">
        <p className="label-caps mb-2 text-[var(--color-primary)]">Profile</p>
        <h1 className="headline-lg mb-4 text-[var(--color-on-surface)]">Guest</h1>
        <div className="glass space-y-4 rounded-[var(--radius-lg)] p-6">
          <p className="text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
            You can breathe right away as a guest. Create a free account to save
            streaks, weekly minutes, and recent sessions across devices.
          </p>
          <MoodInsightCard />
          <Link
            href="/login?mode=register"
            className="inline-flex rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-[var(--color-on-primary)]"
          >
            Create account
          </Link>
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--color-primary)] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    );
  }

  const progress = await getWeeklyProgressForUser(user.id, user.weeklyGoalMin);

  return (
    <main className="page-shell mt-6 max-w-lg lg:mt-10">
      <p className="label-caps mb-2 text-[var(--color-primary)]">Profile</p>
      <h1 className="headline-lg mb-6 text-[var(--color-on-surface)]">{user.name}</h1>

      <div className="glass space-y-6 rounded-[var(--radius-lg)] p-6">
        <div>
          <p className="label-caps mb-1 text-[var(--color-on-surface-variant)]">Email</p>
          <p className="text-[var(--color-on-surface)]">{user.email}</p>
        </div>
        <div>
          <p className="label-caps mb-1 text-[var(--color-on-surface-variant)]">
            Daily streak
          </p>
          <p className="text-2xl font-light text-[var(--color-on-surface)]">
            {progress.streakDays} days
          </p>
        </div>
        <div>
          <p className="label-caps mb-1 text-[var(--color-on-surface-variant)]">
            This week
          </p>
          <p className="text-2xl font-light text-[var(--color-on-surface)]">
            {progress.totalMin} / {progress.goalMin} min
          </p>
        </div>
        <MoodInsightCard serverMood={progress.mood} />
        <p className="text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
          Completed sessions are saved to your account and drive the weekly progress
          widget on the home screen.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Link
          href="/"
          className="inline-flex text-sm text-[var(--color-primary)] hover:underline"
        >
          ← Back to library
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
