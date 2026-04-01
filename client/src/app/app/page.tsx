import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import BookmarkCardSkeleton from "@/components/BookmarkCardSkeleton";
import SaveUrlForm from "@/components/SaveUrlForm";
import Header from "@/components/Header";
import DashboardClient from "@/components/DashboardClient";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: "Your Bookmarks | Recall" };

async function DashboardLoader({ userId }: { userId: string }) {
  const [bookmarks, collections] = await Promise.all([
    prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { tags: true, collections: { select: { collectionId: true } } },
    }),
    prisma.collection.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const serialized = bookmarks.map(({ collections: cols, ...b }) => ({
    ...b,
    createdAt: b.createdAt.toISOString(),
    collectionIds: cols.map((c) => c.collectionId),
  }));

  return <DashboardClient bookmarks={serialized} initialCollections={collections} />;
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* Search bar skeleton */}
      <div className="h-11 rounded-xl bg-[var(--surface)] border border-[var(--border-2)] animate-pulse" />
      {/* Stats row skeleton */}
      <div className="flex gap-3">
        <div className="h-7 w-28 rounded-full bg-[var(--surface)] border border-[var(--border)] animate-pulse" />
        <div className="h-7 w-20 rounded-full bg-[var(--surface)] border border-[var(--border)] animate-pulse" />
      </div>
      {/* Tag pills skeleton */}
      <div className="flex gap-2">
        <div className="h-7 w-12 rounded-full bg-[var(--surface)] border border-[var(--border)] animate-pulse" />
        <div className="h-7 w-16 rounded-full bg-[var(--surface)] border border-[var(--border)] animate-pulse" />
        <div className="h-7 w-14 rounded-full bg-[var(--surface)] border border-[var(--border)] animate-pulse" />
      </div>
      {/* Sort/view controls skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-5 w-16 rounded bg-[var(--surface)] animate-pulse" />
        <div className="flex gap-2">
          <div className="h-7 w-16 rounded-lg bg-[var(--surface)] border border-[var(--border)] animate-pulse" />
          <div className="h-7 w-7 rounded-lg bg-[var(--surface)] border border-[var(--border)] animate-pulse" />
          <div className="h-7 w-7 rounded-lg bg-[var(--surface)] border border-[var(--border)] animate-pulse" />
        </div>
      </div>
      {/* Card skeletons */}
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
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardLoader userId={user.id} />
        </Suspense>
      </main>
    </div>
  );
}
