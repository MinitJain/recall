"use client";

import { useState, useMemo, useRef } from "react";
import { Bookmark } from "lucide-react";
import BookmarkCard from "./BookmarkCard";

type TagItem = { id: string; name: string };
type CollectionItem = { id: string; name: string };
type BookmarkItem = {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
  thumbnail: string | null;
  createdAt: string;
  tags: TagItem[];
  collectionIds: string[];
};

type Sort = "newest" | "oldest" | "az";
type View = "list" | "grid";

export default function DashboardClient({
  bookmarks,
  initialCollections,
}: {
  bookmarks: BookmarkItem[];
  initialCollections: CollectionItem[];
}) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("newest");
  const [view, setView] = useState<View>("list");
  const [showAllTags, setShowAllTags] = useState(false);

  // Collections state
  const [collections, setCollections] =
    useState<CollectionItem[]>(initialCollections);
  const [creatingCollection, setCreatingCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [collectionError, setCollectionError] = useState<string | null>(null);

  // IDs that have been optimistically deleted — bookmarks prop flows in from parent on refresh
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  // Derived: prop list minus optimistic deletes — automatically includes new bookmarks after refresh
  const localBookmarks = useMemo(
    () => bookmarks.filter((b) => !deletedIds.has(b.id)),
    [bookmarks, deletedIds],
  );

  // Tag overrides — bookmarkId → Tag[] — kept in sync via onTagsChange from BookmarkCard
  const [tagOverrides, setTagOverrides] = useState<Map<string, TagItem[]>>(new Map());

  // Membership overrides — only entries that have been changed optimistically
  // Falls back to b.collectionIds from props for untouched bookmarks
  const [membershipOverrides, setMembershipOverrides] = useState<Map<string, string[]>>(
    new Map(),
  );

  // Reconcile membershipOverrides when fresh bookmarks arrive (React setState-during-render pattern):
  // remove stale keys and clear overrides where canonical data has caught up.
  const [prevBookmarks, setPrevBookmarks] = useState(bookmarks);
  if (prevBookmarks !== bookmarks) {
    setPrevBookmarks(bookmarks);
    const bookmarkIds = new Set(bookmarks.map((b) => b.id));
    setMembershipOverrides((prev) => {
      let changed = false;
      const next = new Map(prev);
      for (const [id, override] of prev) {
        // Remove entry for deleted bookmarks
        if (!bookmarkIds.has(id)) { next.delete(id); changed = true; continue; }
        // Clear entry when canonical data matches the override (server caught up)
        const canonical = bookmarks.find((b) => b.id === id)?.collectionIds ?? [];
        const same =
          override.length === canonical.length &&
          override.every((c) => canonical.includes(c));
        if (same) { next.delete(id); changed = true; }
      }
      return changed ? next : prev;
    });
  }

  const TAG_LIMIT = 8;

  // Stats — computed from full unfiltered list, using tag overrides from cards
  const totalTags = useMemo(() => {
    const names = new Set<string>();
    localBookmarks.forEach((b) => {
      const tags = tagOverrides.get(b.id) ?? b.tags;
      tags.forEach((t) => names.add(t.name));
    });
    return names.size;
  }, [localBookmarks, tagOverrides]);

  // Tag pills — sorted by frequency, max 20
  const tagPills = useMemo(() => {
    const freq = new Map<string, number>();
    localBookmarks.forEach((b) => {
      const tags = tagOverrides.get(b.id) ?? b.tags;
      tags.forEach((t) => freq.set(t.name, (freq.get(t.name) ?? 0) + 1));
    });
    return Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([name]) => name);
  }, [localBookmarks, tagOverrides]);

  // Filtered + sorted list — uses membershipOverrides for collection filtering
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = localBookmarks.filter((b) => {
      const ids = membershipOverrides.get(b.id) ?? b.collectionIds;
      const matchesCollection = activeCollection
        ? ids.includes(activeCollection)
        : true;
      const matchesTag = activeTag
        ? (tagOverrides.get(b.id) ?? b.tags).some((t) => t.name === activeTag)
        : true;
      const matchesQuery = q
        ? (b.title ?? "").toLowerCase().includes(q) ||
          b.url.toLowerCase().includes(q) ||
          (b.description ?? "").toLowerCase().includes(q)
        : true;
      return matchesCollection && matchesTag && matchesQuery;
    });

    if (sort === "newest")
      list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    else if (sort === "oldest")
      list = [...list].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    else if (sort === "az")
      list = [...list].sort((a, b) =>
        (a.title ?? "").localeCompare(b.title ?? ""),
      );

    return list;
  }, [localBookmarks, membershipOverrides, tagOverrides, activeCollection, activeTag, sort, query]);

  // Collection CRUD
  async function handleCreateCollection() {
    const name = newCollectionName.trim();
    if (!name) return;
    setCreatingCollection(false);
    setNewCollectionName("");
    setCollectionError(null);
    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        const created: CollectionItem = await res.json();
        setCollections((prev) => [...prev, created]);
      } else {
        setCollectionError("Failed to create collection");
      }
    } catch {
      setCollectionError("Failed to create collection");
    }
  }

  async function handleDeleteCollection(id: string) {
    const deletedIndex = collections.findIndex((c) => c.id === id);
    const deletedItem = collections[deletedIndex];
    if (!deletedItem) return;
    setCollections((prev) => prev.filter((c) => c.id !== id));
    if (activeCollection === id) setActiveCollection(null);
    const revert = () => setCollections((prev) => {
      if (prev.some((c) => c.id === id)) return prev;
      const next = [...prev];
      next.splice(Math.min(deletedIndex, next.length), 0, deletedItem);
      return next;
    });
    try {
      const res = await fetch(`/api/collections/${id}`, { method: "DELETE" });
      if (!res.ok) {
        revert();
        setCollectionError("Failed to delete collection");
      }
    } catch {
      revert();
      setCollectionError("Failed to delete collection");
    }
  }

  // Bookmark ↔ collection membership (optimistic)
  function getMembership(bookmarkId: string): string[] {
    const b = bookmarks.find((bk) => bk.id === bookmarkId);
    return membershipOverrides.get(bookmarkId) ?? b?.collectionIds ?? [];
  }

  async function addToCollection(bookmarkId: string, collectionId: string) {
    const current = getMembership(bookmarkId);
    if (current.includes(collectionId)) return;
    setMembershipOverrides((prev) => {
      const next = new Map(prev);
      next.set(bookmarkId, [...current, collectionId]);
      return next;
    });
    const revert = () => setMembershipOverrides((prev) => {
      const next = new Map(prev);
      next.set(bookmarkId, current);
      return next;
    });
    try {
      const res = await fetch(`/api/collections/${collectionId}/bookmarks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookmarkId }),
      });
      if (!res.ok) revert();
    } catch {
      revert();
    }
  }

  function handleTagsChange(bookmarkId: string, tags: TagItem[]) {
    setTagOverrides((prev) => {
      const next = new Map(prev);
      next.set(bookmarkId, tags);
      return next;
    });
  }

  // Snapshots membershipOverrides for bookmarks being optimistically deleted,
  // so handleDeleteFailed can restore them if the API call fails.
  const pendingDeletedOverrides = useRef<Map<string, string[]>>(new Map());

  function handleDeleteBookmark(bookmarkId: string) {
    // Snapshot the override (if any) before clearing it
    const snapshot = membershipOverrides.get(bookmarkId);
    if (snapshot !== undefined) {
      pendingDeletedOverrides.current = new Map(pendingDeletedOverrides.current).set(bookmarkId, snapshot);
    }
    setDeletedIds((prev) => new Set(prev).add(bookmarkId));
    setMembershipOverrides((prev) => {
      const next = new Map(prev);
      next.delete(bookmarkId);
      return next;
    });
  }

  function handleDeleteFailed(bookmarkId: string) {
    // Restore deleted ID so the card reappears
    setDeletedIds((prev) => {
      const next = new Set(prev);
      next.delete(bookmarkId);
      return next;
    });
    // Restore the membership override snapshot if there was one
    const snapshot = pendingDeletedOverrides.current.get(bookmarkId);
    if (snapshot !== undefined) {
      pendingDeletedOverrides.current = new Map(pendingDeletedOverrides.current);
      pendingDeletedOverrides.current.delete(bookmarkId);
      setMembershipOverrides((prev) => {
        const next = new Map(prev);
        next.set(bookmarkId, snapshot);
        return next;
      });
    } else {
      pendingDeletedOverrides.current = new Map(pendingDeletedOverrides.current);
      pendingDeletedOverrides.current.delete(bookmarkId);
    }
  }

  async function removeFromCollection(
    bookmarkId: string,
    collectionId: string,
  ) {
    const current = getMembership(bookmarkId);
    setMembershipOverrides((prev) => {
      const next = new Map(prev);
      next.set(bookmarkId, current.filter((id) => id !== collectionId));
      return next;
    });
    const revert = () => setMembershipOverrides((prev) => {
      const next = new Map(prev);
      next.set(bookmarkId, current);
      return next;
    });
    try {
      const res = await fetch(`/api/collections/${collectionId}/bookmarks/${bookmarkId}`, {
        method: "DELETE",
      });
      if (!res.ok) revert();
    } catch {
      revert();
    }
  }

  const activeCollectionName = collections.find(
    (c) => c.id === activeCollection,
  )?.name;

  return (
    <div className="flex flex-col gap-5">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--accent)] pointer-events-none"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search bookmarks..."
          aria-label="Search bookmarks"
          className="w-full h-11 rounded-xl border border-[var(--border-2)] bg-[var(--surface)] pl-9 pr-16 text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-100"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Stats — plain text, not interactive */}
      <p className="text-xs text-[var(--text-dim)]">
        {localBookmarks.length} bookmark{localBookmarks.length !== 1 ? "s" : ""}{" "}
        <span className="mx-1.5 opacity-40">·</span>{" "}
        {totalTags} tag{totalTags !== 1 ? "s" : ""}{" "}
        <span className="mx-1.5 opacity-40">·</span>{" "}
        {collections.length} collection{collections.length !== 1 ? "s" : ""}
      </p>

      {/* Collections */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
            Collections
          </span>
          {!creatingCollection && (
            <button
              onClick={() => setCreatingCollection(true)}
              className="text-xs text-[var(--accent)] hover:underline"
            >
              + New
            </button>
          )}
        </div>
        {collectionError && <p className="text-xs text-[var(--error)]">{collectionError}</p>}

        {creatingCollection && (
          <div className="flex gap-1.5">
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateCollection();
                if (e.key === "Escape") {
                  setCreatingCollection(false);
                  setNewCollectionName("");
                }
              }}
              placeholder="Collection name..."
              autoFocus
              maxLength={100}
              aria-label="New collection name"
              className="text-xs flex-1 rounded-lg border border-[var(--border-2)] bg-[var(--surface-2)] px-2.5 py-1.5 text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
            <button
              onClick={handleCreateCollection}
              disabled={!newCollectionName.trim()}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-[var(--accent)] text-[var(--accent-text)] disabled:opacity-40 transition-opacity"
            >
              Create
            </button>
            <button
              onClick={() => {
                setCreatingCollection(false);
                setNewCollectionName("");
              }}
              className="text-xs px-2 py-1.5 rounded-lg border border-[var(--border)] text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
              aria-label="Cancel"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {collections.map((col) => (
            <span key={col.id} className="relative inline-flex items-center">
              {confirmingDeleteId === col.id ? (
                // Inline confirmation state
                <span className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-red-400/50 bg-[var(--surface)] text-[var(--text-muted)]">
                  Delete &ldquo;{col.name}&rdquo;?
                  <button
                    onClick={() => { handleDeleteCollection(col.id); setConfirmingDeleteId(null); }}
                    className="text-red-400 hover:text-red-300 font-medium transition-colors"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setConfirmingDeleteId(null)}
                    className="text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
                  >
                    No
                  </button>
                </span>
              ) : (
                // Normal pill
                <>
                  <button
                    onClick={() =>
                      setActiveCollection(
                        activeCollection === col.id ? null : col.id,
                      )
                    }
                    className={`text-xs pl-3 pr-6 py-1.5 rounded-full border transition-all duration-100 inline-flex items-center gap-1.5 ${
                      activeCollection === col.id
                        ? "bg-[var(--accent)] text-[var(--accent-text)] border-[var(--accent)]"
                        : "bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    }`}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                    {col.name}
                  </button>
                  <button
                    onClick={() => setConfirmingDeleteId(col.id)}
                    aria-label={`Delete collection ${col.name}`}
                    className={`absolute right-2 text-xs leading-none transition-colors ${
                      activeCollection === col.id
                        ? "text-[var(--accent-text)] opacity-70 hover:opacity-100"
                        : "text-[var(--text-dim)] hover:text-red-400"
                    }`}
                  >
                    ×
                  </button>
                </>
              )}
            </span>
          ))}
          {collections.length === 0 && !creatingCollection && (
            <button
              onClick={() => setCreatingCollection(true)}
              className="text-xs px-3 py-1.5 rounded-full border border-dashed border-[var(--border-2)] text-[var(--text-dim)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-100 inline-flex items-center gap-1.5"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                <line x1="12" y1="11" x2="12" y2="17" /><line x1="9" y1="14" x2="15" y2="14" />
              </svg>
              New collection
            </button>
          )}
        </div>
      </div>

      {/* Tag filter pills */}
      {tagPills.length > 0 && (
        <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Tags</span>
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
          {(showAllTags ? tagPills : tagPills.slice(0, TAG_LIMIT)).map(
            (tag) => (
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
            ),
          )}
          {tagPills.length > TAG_LIMIT && (
            <button
              onClick={() => setShowAllTags((v) => !v)}
              className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-dim)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-100"
            >
              {showAllTags
                ? "Show less"
                : `+${tagPills.length - TAG_LIMIT} more`}
            </button>
          )}
        </div>
        </div>
      )}

      {/* Active collection banner */}
      {activeCollection && activeCollectionName && (
        <div className="flex items-center justify-between rounded-xl border border-[var(--accent)] bg-[var(--accent-soft)] px-3 py-2">
          <span className="flex items-center gap-2 text-xs font-medium text-[var(--accent)]">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            {activeCollectionName}
            <span className="font-normal opacity-70">
              - {filtered.length} bookmark{filtered.length !== 1 ? "s" : ""}
            </span>
          </span>
          <button
            onClick={() => setActiveCollection(null)}
            className="text-xs text-[var(--accent)] opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Clear collection filter"
          >
            Clear ×
          </button>
        </div>
      )}

      {/* Sort + view controls — only when there are bookmarks */}
      {localBookmarks.length > 0 && <div className="flex items-center justify-between">
        <p className="text-xs text-[var(--text-dim)]">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          {activeCollectionName && (
            <>
              {" "}
              in{" "}
              <span className="text-[var(--accent)]">
                {activeCollectionName}
              </span>
            </>
          )}
          {activeTag && (
            <>
              {" "}
              tagged <span className="text-[var(--accent)]">#{activeTag}</span>
            </>
          )}
        </p>
        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label="Sort bookmarks"
            className="text-xs rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-100 cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">A → Z</option>
          </select>

          <button
            onClick={() => setView("list")}
            aria-label="List view"
            aria-pressed={view === "list"}
            className={`p-1.5 rounded-lg border transition-all duration-100 ${
              view === "list"
                ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-soft)]"
                : "border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            }`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>

          <button
            onClick={() => setView("grid")}
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            className={`p-1.5 rounded-lg border transition-all duration-100 ${
              view === "grid"
                ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-soft)]"
                : "border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            }`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
          </button>
        </div>
      </div>}

      {/* No bookmarks at all */}
      {localBookmarks.length === 0 && (
        <div
          className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-center"
          style={{ padding: "48px 32px" }}
        >
          <Bookmark size={40} className="text-[var(--accent)]" />
          <div>
            <h2 className="text-xl font-semibold text-[var(--text)] mb-1">
              Nothing saved yet
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Paste any URL above to save your first bookmark
            </p>
          </div>
        </div>
      )}

      {/* Empty filter state */}
      {localBookmarks.length > 0 && filtered.length === 0 && (activeTag || query || activeCollection) && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-center py-12">
          <p className="text-sm text-[var(--text-muted)]">
            No bookmarks found
            {query && (
              <>
                {" "}
                for{" "}
                <span className="text-[var(--accent)]">
                  &ldquo;{query}&rdquo;
                </span>
              </>
            )}
            {activeTag && (
              <>
                {" "}
                tagged{" "}
                <span className="text-[var(--accent)]">#{activeTag}</span>
              </>
            )}
            {activeCollectionName && (
              <>
                {" "}
                in{" "}
                <span className="text-[var(--accent)]">
                  {activeCollectionName}
                </span>
              </>
            )}
          </p>
          <button
            onClick={() => {
              setActiveTag(null);
              setQuery("");
              setActiveCollection(null);
            }}
            className="text-xs text-[var(--accent)] hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Bookmark list / grid */}
      {filtered.length > 0 &&
        (view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((bookmark, i) => (
              <div
                key={bookmark.id}
                className="animate-fade-up"
                style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
              >
                <BookmarkCard
                  bookmark={{
                    ...bookmark,
                    tags: tagOverrides.get(bookmark.id) ?? bookmark.tags,
                    collectionIds:
                      membershipOverrides.get(bookmark.id) ?? bookmark.collectionIds,
                  }}
                  view="grid"
                  priority={i === 0}
                  collections={collections}
                  onAddToCollection={addToCollection}
                  onRemoveFromCollection={removeFromCollection}
                  onDelete={handleDeleteBookmark}
                  onDeleteFailed={handleDeleteFailed}
                  onTagsChange={handleTagsChange}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((bookmark, i) => (
              <div
                key={bookmark.id}
                className="animate-fade-up"
                style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
              >
                <BookmarkCard
                  bookmark={{
                    ...bookmark,
                    tags: tagOverrides.get(bookmark.id) ?? bookmark.tags,
                    collectionIds:
                      membershipOverrides.get(bookmark.id) ?? bookmark.collectionIds,
                  }}
                  view="list"
                  priority={i === 0}
                  collections={collections}
                  onAddToCollection={addToCollection}
                  onRemoveFromCollection={removeFromCollection}
                  onDelete={handleDeleteBookmark}
                  onDeleteFailed={handleDeleteFailed}
                  onTagsChange={handleTagsChange}
                />
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}
