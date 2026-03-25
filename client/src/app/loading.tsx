export default function Loading() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="h-8 w-36 bg-zinc-200 dark:bg-zinc-800 rounded-md mb-8 animate-pulse" />

        {/* Save URL form skeleton */}
        <div className="h-10 w-full bg-zinc-200 dark:bg-zinc-800 rounded-md mb-8 animate-pulse" />

        {/* Bookmark card skeletons */}
        <div className="flex flex-col gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col gap-3"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Title line */}
              <div
                className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse"
                style={{ width: `${65 + (i % 3) * 10}%` }}
              />
              {/* Description line */}
              <div className="h-3 w-4/5 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              {/* URL + tags row */}
              <div className="flex gap-2">
                <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="h-3 w-12 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
                <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
