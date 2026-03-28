"use client";

import { useState, useMemo } from "react";
import { Bookmark, BookMarked, Tag } from "lucide-react";
import BookmarkCard from "./BookmarkCard";

type Tag = { id: string; name: string };
type BookmarkItem = {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
  thumbnail: string | null;
  createdAt: string;
  tags: Tag[];
};

type Sort = "newest" | "oldest" | "az";
type View = "list" | "grid";

export default function DashboardClient({ bookmarks }: { bookmarks: BookmarkItem[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("newest");
  const [view, setView] = useState<View>("list");
  const [showAllTags, setShowAllTags] = useState(false);

  const TAG_LIMIT = 8;

  // Stats — computed from full unfiltered list
  const totalTags = useMemo(() => {
    const names = new Set<string>();
    bookmarks.forEach((b) => b.tags.forEach((t) => names.add(t.name)));
    return names.size;
  }, [bookmarks]);

  // Tag pills — sorted by frequency, max 20
  const tagPills = useMemo(() => {
    const freq = new Map<string, number>();
    bookmarks.forEach((b) => b.tags.forEach((t) => freq.set(t.name, (freq.get(t.name) ?? 0) + 1)));
    return Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);
  }, [bookmarks]);

  // Filtered + sorted list
  const filtered = useMemo(() => {
    let list = activeTag
      ? bookmarks.filter((b) => b.tags.some((t) => t.name === activeTag))
      : bookmarks;

    if (sort === "oldest") list = [...list].reverse();
    else if (sort === "az") list = [...list].sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""));

    return list;
  }, [bookmarks, activeTag, sort]);

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
    <div className="flex flex-col gap-4">

      {/* Stats */}
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--accent)] bg-[var(--surface)] border border-[var(--border)] px-3 py-1.5 rounded-full">
          <BookMarked size={12} />
          {bookmarks.length} bookmark{bookmarks.length !== 1 ? "s" : ""}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--accent)] bg-[var(--surface)] border border-[var(--border)] px-3 py-1.5 rounded-full">
          <Tag size={12} />
          {totalTags} tag{totalTags !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Tag filter pills */}
      {tagPills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-100 ${
              activeTag === null
                ? "bg-[var(--accent)] text-[var(--accent-text)] border-[var(--accent)]"
                : "bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            }`}
          >
            All
          </button>
          {(showAllTags ? tagPills : tagPills.slice(0, TAG_LIMIT)).map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-100 ${
                activeTag === tag
                  ? "bg-[var(--accent)] text-[var(--accent-text)] border-[var(--accent)]"
                  : "bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              }`}
            >
              {tag}
            </button>
          ))}
          {tagPills.length > TAG_LIMIT && (
            <button
              onClick={() => setShowAllTags((v) => !v)}
              className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-dim)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-100"
            >
              {showAllTags ? "Show less" : `+${tagPills.length - TAG_LIMIT} more`}
            </button>
          )}
        </div>
      )}

      {/* Sort + view controls */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-[var(--text-dim)]">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          {activeTag ? ` for #${activeTag}` : ""}
        </p>
        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="text-xs rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-100 cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">A → Z</option>
          </select>

          {/* List icon */}
          <button
            onClick={() => setView("list")}
            aria-label="List view"
            className={`p-1.5 rounded-lg border transition-all duration-100 ${
              view === "list"
                ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-soft)]"
                : "border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>

          {/* Grid icon */}
          <button
            onClick={() => setView("grid")}
            aria-label="Grid view"
            className={`p-1.5 rounded-lg border transition-all duration-100 ${
              view === "grid"
                ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-soft)]"
                : "border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Empty filter state */}
      {filtered.length === 0 && activeTag && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-center py-12">
          <p className="text-sm text-[var(--text-muted)]">No bookmarks tagged <span className="text-[var(--accent)]">#{activeTag}</span></p>
          <button
            onClick={() => setActiveTag(null)}
            className="text-xs text-[var(--accent)] hover:underline"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Bookmark list / grid */}
      {filtered.length > 0 && (
        view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((bookmark, i) => (
              <div key={bookmark.id} className="animate-fade-up" style={{ animationDelay: `${i * 30}ms` }}>
                <BookmarkCard bookmark={bookmark} view="grid" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((bookmark, i) => (
              <div key={bookmark.id} className="animate-fade-up" style={{ animationDelay: `${i * 30}ms` }}>
                <BookmarkCard bookmark={bookmark} view="list" />
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
