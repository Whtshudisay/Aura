"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const DISMISS_KEY = "aura.guestBanner.dismissed";

export function GuestBanner({ signedIn }: { signedIn: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (signedIn) {
      setVisible(false);
      return;
    }
    try {
      setVisible(localStorage.getItem(DISMISS_KEY) !== "1");
    } catch {
      setVisible(true);
    }
  }, [signedIn]);

  if (!visible) return null;

  return (
    <div className="page-shell pt-2">
      <div className="glass flex flex-col gap-3 rounded-[var(--radius-md)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--color-on-surface-variant)]">
          You&apos;re exploring as a guest.{" "}
          <span className="text-[var(--color-on-surface)]">
            Sign up to save streaks and weekly progress.
          </span>
        </p>
        <div className="flex items-center gap-2">
          <Link
            href="/login?mode=register"
            className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-xs font-medium tracking-wide text-[var(--color-on-primary)]"
          >
            Save progress
          </Link>
          <button
            type="button"
            className="rounded-full px-3 py-2 text-xs text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"
            onClick={() => {
              try {
                localStorage.setItem(DISMISS_KEY, "1");
              } catch {
                // ignore
              }
              setVisible(false);
            }}
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
