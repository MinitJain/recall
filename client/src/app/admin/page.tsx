import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { unstable_cache } from "next/cache";
import Header from "@/components/Header";

export const metadata = { title: "Admin | Recall" };

// Cache only the expensive listUsers call for 5 minutes.
// revalidate = 300 is ineffective here because cookies() forces dynamic rendering.
const getCachedAuthUsers = unstable_cache(
  async () => {
    const { data, error } = await getSupabaseAdmin().auth.admin.listUsers({ perPage: 1000 });
    if (error) { console.error("getCachedAuthUsers failed:", error); return []; }
    return data.users;
  },
  ["admin-auth-users"],
  { revalidate: 300 },
);

export default async function AdminPage() {
  // Auth check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  // Admin guard
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!adminEmails.includes((user.email ?? "").toLowerCase())) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl font-bold text-[var(--accent)] mb-4">403</p>
          <p className="text-[var(--text-muted)] text-sm">You are not authorized to view this page.</p>
        </div>
      </div>
    );
  }

  // All queries run in parallel
  const now = new Date();
  const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  const [
    totalBookmarks,
    totalTags,
    uniqueUsers,
    todayCount,
    topTags,
    topUsers,
    recentBookmarks,
  ] = await Promise.all([
    prisma.bookmark.count(),
    prisma.tag.count(),
    prisma.bookmark.groupBy({ by: ["userId"] }),
    prisma.bookmark.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.tag.groupBy({
      by: ["name"],
      _count: { name: true },
      orderBy: { _count: { name: "desc" } },
      take: 10,
    }),
    prisma.bookmark.groupBy({
      by: ["userId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
    prisma.bookmark.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { tags: true },
    }),
  ]);

  const totalUsers = uniqueUsers.length;

  // Fetch emails for all user IDs from Supabase auth (cached 5 min)
  const authUsers = await getCachedAuthUsers();
  const emailMap = new Map(authUsers.map((u) => [u.id, u.email ?? u.id]));

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Header email={user.email ?? ""} />
      <main className="max-w-4xl mx-auto pt-6 pb-16 px-4">

        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[var(--text)]">Admin</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Overview of all activity on Recall</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total Users", value: totalUsers },
            { label: "Total Bookmarks", value: totalBookmarks },
            { label: "Total Tags", value: totalTags },
            { label: "Saved Today", value: todayCount },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 flex flex-col gap-1"
            >
              <span className="text-xs text-[var(--text-muted)]">{label}</span>
              <span className="text-2xl font-semibold text-[var(--accent)]">{value}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">

          {/* Top tags */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="text-sm font-semibold text-[var(--text)] mb-4">Top Tags</h2>
            {topTags.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)]">No tags yet.</p>
            ) : (
              <ol className="flex flex-col gap-2">
                {topTags.map((tag, i) => (
                  <li key={tag.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="text-xs text-[var(--text-dim)] w-4">{i + 1}</span>
                      <span className="text-sm text-[var(--text)] bg-[var(--accent-soft)] text-[var(--accent)] px-2 py-0.5 rounded-full">
                        {tag.name}
                      </span>
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">{tag._count.name}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Top users */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h2 className="text-sm font-semibold text-[var(--text)] mb-4">Most Active Users</h2>
            {topUsers.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)]">No users yet.</p>
            ) : (
              <ol className="flex flex-col gap-2">
                {topUsers.map((u, i) => (
                  <li key={u.userId} className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="text-xs text-[var(--text-dim)] w-4">{i + 1}</span>
                      <span className="text-sm text-[var(--text)] truncate max-w-[200px]">
                        {emailMap.get(u.userId) ?? u.userId}
                      </span>
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">{u._count.id} bookmarks</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        {/* Recent bookmarks */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="text-sm font-semibold text-[var(--text)] mb-4">Recent Bookmarks</h2>
          {recentBookmarks.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)]">No bookmarks yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-[var(--border)]">
              {recentBookmarks.map((b) => {
                let hostname = b.url;
                try { hostname = new URL(b.url).hostname.replace(/^www\./, ""); } catch {}
                return (
                  <div key={b.id} className="py-3 flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <a
                        href={b.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[var(--text)] hover:text-[var(--accent)] truncate transition-colors"
                      >
                        {b.title ?? hostname}
                      </a>
                      <span className="text-xs text-[var(--text-dim)] truncate">{hostname}</span>
                      {b.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {b.tags.map((t) => (
                            <span key={t.id} className="text-xs bg-[var(--accent-soft)] text-[var(--accent)] px-1.5 py-0.5 rounded-full">
                              {t.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                      <span className="text-xs text-[var(--text-dim)] truncate max-w-[160px]">
                        {emailMap.get(b.userId) ?? b.userId}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
