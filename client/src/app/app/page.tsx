import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import BookmarkCard from "@/components/BookmarkCard";
import BookmarkCardSkeleton from "@/components/BookmarkCardSkeleton";
import SaveUrlForm from "@/components/SaveUrlForm";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Bookmark } from "lucide-react";

export const metadata = { title: "Your Bookmarks | Recall" };

async function BookmarkList({ userId }: { userId: string }) {
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { tags: true },
  });

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-center" style={{ padding: "48px 32px" }}>
        <Bookmark size={40} className="text-[var(--accent)]" />
        <div>
          <h2 className="text-xl font-semibold text-[var(--text)] mb-1">Nothing saved yet</h2>
          <p className="text-sm text-[var(--text-muted)]">Paste any URL above to save your first bookmark</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {bookmarks.map((bookmark, i) => (
        <div key={bookmark.id} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
          <BookmarkCard
            bookmark={{
              ...bookmark,
              createdAt: bookmark.createdAt.toISOString(),
            }}
          />
        </div>
      ))}
    </div>
  );
}

function BookmarkListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <BookmarkCardSkeleton />
      <BookmarkCardSkeleton />
      <BookmarkCardSkeleton />
    </div>
  );
}

export default async function AppPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Header email={user.email ?? ""} />
      <main className="max-w-2xl mx-auto pt-6 pb-16 px-4">
        <SaveUrlForm />
        <SearchBar />
        <Suspense fallback={<BookmarkListSkeleton />}>
          <BookmarkList userId={user.id} />
        </Suspense>
      </main>
    </div>
  );
}
