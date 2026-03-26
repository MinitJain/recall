import BookmarkCardSkeleton from "@/components/BookmarkCardSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header placeholder */}
      <div className="h-12 border-b border-[var(--border)] bg-[var(--bg)]/80" />
      <main className="max-w-2xl mx-auto pt-6 pb-16 px-4">
        <div className="flex flex-col gap-3">
          <BookmarkCardSkeleton />
          <BookmarkCardSkeleton />
          <BookmarkCardSkeleton />
        </div>
      </main>
    </div>
  );
}
