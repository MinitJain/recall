import { prisma } from "@/lib/prisma";
import BookmarkCard from "@/components/BookmarkCard";
import SaveUrlForm from "@/components/SaveUrlForm";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AppPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { tags: true },
  });

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Header email={user.email ?? ""} />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <SaveUrlForm />
        <SearchBar />
        {bookmarks.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)] text-center py-12">
            No bookmarks yet. Paste a URL above to get started.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {bookmarks.map((bookmark, i) => (
              <div key={bookmark.id} style={{ animationDelay: `${i * 40}ms` }}>
                <BookmarkCard
                  bookmark={{
                    ...bookmark,
                    createdAt: bookmark.createdAt.toISOString(),
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
