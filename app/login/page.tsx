import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { getSessionUser } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const user = await getSessionUser();
  if (user) redirect("/");

  const params = await searchParams;
  const mode = params.mode === "register" ? "register" : "login";

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
      <div className="mb-10 flex flex-col items-center text-center">
        <span
          className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--accent-sage-soft)] ring-1 ring-[var(--glass-border)] sm:mb-6 sm:h-24 sm:w-24 md:h-28 md:w-28"
          aria-hidden
        >
          <svg
            viewBox="0 0 24 24"
            className="h-10 w-10 text-[var(--color-primary)] sm:h-12 sm:w-12 md:h-14 md:w-14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
          >
            <circle cx="12" cy="12" r="3.5" />
            <circle cx="12" cy="12" r="7" opacity="0.55" />
            <circle cx="12" cy="12" r="10.5" opacity="0.28" />
          </svg>
        </span>
        <p className="label-caps text-sm tracking-[0.22em] text-[var(--color-on-surface)] sm:text-base">
          Aura
        </p>
        <h1 className="mt-4 text-2xl font-light text-[var(--color-on-surface)] sm:text-3xl">
          {mode === "login" ? "Welcome back" : "Begin your practice"}
        </h1>
        <p className="mt-2 max-w-sm text-sm text-[var(--color-on-surface-variant)]">
          {mode === "login"
            ? "Sign in to sync your weekly progress and streak."
            : "Create an account so your sessions stay with you."}
        </p>
      </div>

      <div className="glass w-full max-w-md rounded-[var(--radius-lg)] p-6 sm:p-8">
        <AuthForm key={mode} mode={mode} />

        <p className="mt-6 text-center text-sm text-[var(--color-on-surface-variant)]">
          {mode === "login" ? (
            <>
              New here?{" "}
              <Link
                href="/login?mode=register"
                className="text-[var(--color-primary)] hover:underline"
              >
                Create an account
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" className="text-[var(--color-primary)] hover:underline">
                Sign in
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
