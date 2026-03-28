import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import BookmarkCardSkeleton from "@/components/BookmarkCardSkeleton";
import SaveUrlForm from "@/components/SaveUrlForm";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import DashboardClient from "@/components/DashboardClient";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: "Your Bookmarks | Recall" };

async function DashboardLoader({ userId }: { userId: string }) {
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { tags: true },
  });

  const serialized = bookmarks.map((b) => ({
    ...b,
    createdAt: b.createdAt.toISOString(),
  }));

  return (
    <>
      <SearchBar />
      <DashboardClient bookmarks={serialized} />
    </>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-3 mt-6">
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
