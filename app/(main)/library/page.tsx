import Link from "next/link";
import { TechniqueCard } from "@/components/TechniqueCard";
import { getAllPatterns } from "@/data/patterns";
import { getSessionUser } from "@/lib/auth";
import { isGuestAllowedPattern } from "@/lib/guestAccess";

export default async function LibraryPage() {
  const user = await getSessionUser();
  const all = getAllPatterns();
  const isGuest = !user;

  return (
    <main className="page-shell mt-6 lg:mt-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="label-caps mb-2 text-[var(--color-primary)]">Library</p>
          <h1 className="headline-lg text-[var(--color-on-surface)]">All techniques</h1>
          {isGuest && (
            <p className="mt-2 text-sm text-[var(--color-on-surface-variant)]">
              Guests can practice Box Breathing. Sign up to unlock everything else.
            </p>
          )}
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
          <TechniqueCard
            key={pattern.id}
            pattern={pattern}
            locked={isGuest && !isGuestAllowedPattern(pattern.id)}
          />
        ))}
      </div>
    </main>
  );
}
