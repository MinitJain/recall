export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header skeleton */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 h-12 border-b border-[var(--border)] bg-[var(--bg)]/80">
        <div className="h-4 w-16 bg-[var(--surface-2)] rounded animate-skeleton" />
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-[var(--surface-2)] rounded-md animate-skeleton" />
          <div className="h-8 w-16 bg-[var(--surface-2)] rounded-md animate-skeleton" />
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Save URL form skeleton */}
        <div className="flex gap-2 mb-6">
          <div className="h-9 flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg animate-skeleton" />
          <div className="h-9 w-16 bg-[var(--surface-2)] rounded-lg animate-skeleton" />
        </div>

        {/* Search bar skeleton */}
        <div className="h-9 w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg mb-6 animate-skeleton" />

        {/* Bookmark card skeletons */}
        <div className="flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 flex gap-4"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-[var(--surface-2)] animate-skeleton" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 bg-[var(--surface-2)] rounded animate-skeleton" style={{ width: `${55 + (i % 3) * 12}%` }} />
                <div className="h-3 w-4/5 bg-[var(--surface-2)] rounded animate-skeleton" />
                <div className="h-3 w-24 bg-[var(--surface-2)] rounded animate-skeleton" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
