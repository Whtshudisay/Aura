import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="label-caps text-[var(--color-primary)]">Aura</p>
      <h1 className="headline-lg text-[var(--color-on-surface)]">Page not found</h1>
      <Link href="/" className="text-sm text-[var(--color-primary)] hover:underline">
        Return home
      </Link>
    </div>
  );
}
