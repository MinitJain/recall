export default function BookmarkCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      {/* Thumb placeholder */}
      <div className="w-16 h-16 flex-shrink-0 rounded-xl bg-[var(--surface-2)] animate-skeleton" />

      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {/* Title bar */}
        <div className="h-4 w-3/4 rounded bg-[var(--surface-2)] animate-skeleton" />
        {/* Domain bar */}
        <div className="h-3 w-1/3 rounded bg-[var(--surface-2)] animate-skeleton" />
        {/* Tag pills */}
        <div className="flex gap-1.5 mt-1">
          <div className="h-5 w-14 rounded-full bg-[var(--surface-2)] animate-skeleton" />
          <div className="h-5 w-10 rounded-full bg-[var(--surface-2)] animate-skeleton" />
        </div>
      </div>
    </div>
  );
}
