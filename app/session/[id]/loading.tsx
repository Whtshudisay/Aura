export default function SessionLoading() {
  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center gap-6"
      aria-busy="true"
      aria-label="Loading session"
    >
      <div className="h-48 w-48 animate-pulse rounded-full bg-white/5 sm:h-56 sm:w-56" />
      <div className="h-4 w-32 animate-pulse rounded bg-white/5" />
    </div>
  );
}
