import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="label-caps mb-3 text-[var(--color-primary)]">Offline</p>
      <h1 className="headline-lg mb-3 text-[var(--color-on-surface)]">
        You&apos;re offline
      </h1>
      <p className="mb-8 max-w-sm text-sm text-[var(--color-on-surface-variant)]">
        Cached pages and breathing sessions still work. Reconnect when you can to
        sync progress.
      </p>
      <Link
        href="/"
        className="rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-medium text-[var(--color-on-primary)]"
      >
        Back to library
      </Link>
    </main>
  );
}
