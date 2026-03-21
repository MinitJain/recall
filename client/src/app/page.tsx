import { prisma } from "@/lib/prisma";
import BookmarkCard from "@/components/BookmarkCard";
import SaveUrlForm from "@/components/SaveUrlForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { tags: true },
  });

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
          Bookmarks
        </h1>
        <SaveUrlForm />
        {bookmarks.length === 0 ? (
          <p className="text-zinc-500 text-sm">
            No bookmarks yet. Paste a URL above to save one.
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
