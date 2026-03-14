import { prisma } from "@/lib/prisma";
import BookmarkCard from "@/components/BookmarkCard";

/**
 * Render the home page that displays bookmarks fetched from the database in descending creation order.
 *
 * @returns A React element containing either a no-bookmarks message or a vertical list of BookmarkCard components for each bookmark.
 */
export default async function Home() {
  const bookmarks = await prisma.bookmark.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
          Bookmarks
        </h1>
        {bookmarks.length === 0 ? (
          <p className="text-zinc-500 text-sm">
            No bookmarks yet. POST to /api/bookmarks to add one.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {bookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={{
                  ...bookmark,
                  createdAt: bookmark.createdAt.toISOString(),
                }}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
