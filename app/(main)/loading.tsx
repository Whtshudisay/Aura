export default function MainLoading() {
  return (
    <div className="page-shell mt-8 animate-pulse space-y-8" aria-busy="true" aria-label="Loading">
      <div className="h-10 w-64 max-w-full rounded-lg bg-white/5" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.85fr)]">
        <div className="h-56 rounded-[var(--radius-lg)] bg-white/5" />
        <div className="h-56 rounded-[var(--radius-lg)] bg-white/5" />
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4">
        <div className="h-48 rounded-[var(--radius-md)] bg-white/5" />
        <div className="h-48 rounded-[var(--radius-md)] bg-white/5" />
        <div className="h-48 rounded-[var(--radius-md)] bg-white/5" />
      </div>
    </div>
  );
}
