"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

type Tag = { id: string; name: string };
type Collection = { id: string; name: string };

type Bookmark = {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
  thumbnail: string | null;
  createdAt: string;
  tags: Tag[];
  collectionIds: string[];
};

type Props = {
  bookmark: Bookmark;
  view?: "list" | "grid";
  collections?: Collection[];
  onAddToCollection?: (bookmarkId: string, collectionId: string) => void;
  onRemoveFromCollection?: (bookmarkId: string, collectionId: string) => void;
  onDelete?: (bookmarkId: string) => void;
  onTagsChange?: (bookmarkId: string, tags: Tag[]) => void;
};

export default function BookmarkCard({
  bookmark,
  view = "list",
  collections = [],
  onAddToCollection,
  onRemoveFromCollection,
  onDelete,
  onTagsChange,
}: Props) {
  const [localTags, setLocalTags] = useState(bookmark.tags);
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    onTagsChange?.(bookmark.id, localTags);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localTags]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCollectionMenu, setShowCollectionMenu] = useState(false);

  const hostname = (() => {
    try {
      return new URL(bookmark.url).hostname.replace(/^www\./, "");
    } catch {
      return bookmark.url;
    }
  })();

  async function addTag() {
    const name = input.trim();
    if (!name) return;
    if (localTags.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
      setError("tag already exists");
      return;
    }
    setLoading(true);
    setError(null);
    const tempId = `temp-${Date.now()}`;
    setLocalTags((prev) => [...prev, { id: tempId, name }]);
    setInput("");
    try {
      const res = await fetch(`/api/bookmarks/${bookmark.id}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "failed to add tag");
        setLocalTags((prev) => prev.filter((t) => t.id !== tempId));
      } else {
        const data = await res.json();
        setLocalTags((prev) =>
          prev.map((t) => (t.id === tempId ? { id: data.id, name: data.name } : t))
        );
      }
    } catch {
      setError("failed to add tag");
      setLocalTags((prev) => prev.filter((t) => t.id !== tempId));
    } finally {
      setLoading(false);
    }
  }

  async function removeTag(tagId: string) {
    if (removingIds.has(tagId)) return;
    setRemovingIds((prev) => new Set(prev).add(tagId));
    setError(null);
    const snapshot = localTags;
    setLocalTags((prev) => prev.filter((t) => t.id !== tagId));
    try {
      const res = await fetch(`/api/bookmarks/${bookmark.id}/tags/${tagId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setError("failed to remove tag");
        setLocalTags(snapshot);
      }
    } catch {
      setError("failed to remove tag");
      setLocalTags(snapshot);
    } finally {
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(tagId);
        return next;
      });
    }
  }

  async function deleteBookmark() {
    if (deleting) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/bookmarks/${bookmark.id}`, { method: "DELETE" });
      if (!res.ok) {
        setError("failed to delete");
        setDeleting(false);
        return;
      }
      onDelete?.(bookmark.id); // only called on success
    } catch {
      setError("failed to delete");
      setDeleting(false);
    }
  }

  function toggleCollection(collectionId: string) {
    const isMember = bookmark.collectionIds.includes(collectionId);
    if (isMember) onRemoveFromCollection?.(bookmark.id, collectionId);
    else onAddToCollection?.(bookmark.id, collectionId);
    setShowCollectionMenu(false);
  }

  // Collection chips — always visible on the card, with inline remove
  const collectionChips = bookmark.collectionIds.length > 0 ? (
    <div className="flex flex-wrap gap-1 mt-0.5">
      {bookmark.collectionIds.map((colId) => {
        const col = collections.find((c) => c.id === colId);
        if (!col) return null;
        return (
          <span key={colId} className="inline-flex items-center gap-1 text-xs bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-muted)] px-2 py-0.5 rounded-full">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            {col.name}
            <button
              type="button"
              aria-label={`Remove from ${col.name}`}
              onClick={() => onRemoveFromCollection?.(bookmark.id, colId)}
              className="text-[var(--text-dim)] hover:text-red-400 leading-none transition-colors"
            >
              ×
            </button>
          </span>
        );
      })}
    </div>
  ) : null;

  // Folder + button — always visible when collections exist, opens picker dropdown
  const collectionButton = collections.length > 0 ? (
    <div
      className="relative"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setShowCollectionMenu(false);
        }
      }}
    >
      <button
        type="button"
        onClick={() => setShowCollectionMenu((v) => !v)}
        aria-label="Add to collection"
        className={`w-6 h-6 flex items-center justify-center rounded transition-all duration-100 ${
          showCollectionMenu
            ? "text-[var(--accent)] bg-[var(--accent-soft)]"
            : "text-[var(--text-dim)] hover:text-[var(--accent)]"
        }`}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {showCollectionMenu && (
        <div className="absolute right-0 top-7 z-20 w-44 rounded-xl border border-[var(--border-2)] bg-[var(--surface)] shadow-lg py-1">
          {collections.map((col) => {
            const isMember = bookmark.collectionIds.includes(col.id);
            return (
              <button
                key={col.id}
                type="button"
                onClick={() => toggleCollection(col.id)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors text-left"
              >
                <span className={`flex-shrink-0 font-medium ${isMember ? "text-[var(--accent)]" : "text-[var(--text-dim)]"}`}>
                  {isMember ? "✓" : "+"}
                </span>
                <span className="truncate">{col.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  ) : null;

  if (view === "grid") {
    return (
      <div className="group relative flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden transition-all duration-150 hover:border-[var(--border-2)] hover:shadow-[var(--shadow-glow)] animate-fade-up">
        {/* Thumbnail */}
        {bookmark.thumbnail ? (
          <Image
            src={bookmark.thumbnail}
            alt={bookmark.title ?? ""}
            width={400}
            height={128}
            className="w-full h-32 object-cover bg-[var(--surface-2)]"
            unoptimized
          />
        ) : (
          <div className="w-full h-32 bg-[var(--surface-2)]" />
        )}

        {/* Content */}
        <div className="flex flex-col gap-1.5 p-3 flex-1">
          <div className="flex items-start justify-between gap-2">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-sm text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-100 line-clamp-2 leading-snug"
            >
              {bookmark.title ?? hostname}
            </a>
            <div className="flex items-center gap-1 flex-shrink-0">
              {collectionButton}
              <button
                type="button"
                onClick={deleteBookmark}
                disabled={deleting}
                aria-label="Delete bookmark"
                className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded text-[var(--text-dim)] hover:text-red-400 hover:bg-[var(--error-bg)] transition-all duration-100 disabled:opacity-30"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                </svg>
              </button>
            </div>
          </div>

          <span className="text-xs text-[var(--text-muted)]">{hostname}</span>

          {localTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-0.5">
              {localTags.map((tag) => (
                <span key={tag.id} className="text-xs bg-[var(--accent-soft)] text-[var(--accent)] px-2 py-0.5 rounded-full">
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {collectionChips}

          {error && <p className="text-xs text-[var(--error)] mt-0.5">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-all duration-150 hover:border-[var(--border-2)] hover:shadow-[var(--shadow-glow)] animate-fade-up">
      {/* Thumbnail */}
      {bookmark.thumbnail && (
        <Image
          src={bookmark.thumbnail}
          alt={bookmark.title ?? ""}
          width={64}
          height={64}
          className="w-16 h-16 flex-shrink-0 rounded-xl object-cover bg-[var(--surface-2)]"
          unoptimized
        />
      )}

      {/* Content */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        {/* Title + actions */}
        <div className="flex items-start justify-between gap-2">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-sm text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-100 line-clamp-1"
          >
            {bookmark.title ?? hostname}
          </a>
          <div className="flex items-center gap-1 flex-shrink-0">
            {collectionButton}
            <button
              type="button"
              onClick={deleteBookmark}
              disabled={deleting}
              aria-label="Delete bookmark"
              className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded text-[var(--text-dim)] hover:text-red-400 hover:bg-[var(--error-bg)] transition-all duration-100 disabled:opacity-30"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Description */}
        {bookmark.description && (
          <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
            {bookmark.description}
          </p>
        )}

        {/* Hostname */}
        <span className="text-xs text-[var(--text-muted)]">{hostname}</span>

        {/* Tags + inline add input */}
        <div className="flex flex-wrap gap-1 mt-0.5 items-center">
          {localTags.map((tag) => (
            <span
              key={tag.id}
              className="tag-enter flex items-center gap-1 text-xs bg-[var(--accent-soft)] text-[var(--accent)] px-2.5 py-0.5 rounded-full"
            >
              {tag.name}
              <button
                type="button"
                aria-label={`Remove tag ${tag.name}`}
                onClick={() => removeTag(tag.id)}
                disabled={removingIds.has(tag.id)}
                className="text-[var(--text-dim)] hover:text-[var(--error)] disabled:opacity-40 leading-none"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTag()}
            placeholder="+ tag"
            maxLength={50}
            aria-label="Add tag"
            disabled={loading}
            className="text-xs h-6 w-16 focus:w-24 rounded-full border border-dashed border-[var(--border)] bg-transparent px-2.5 text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--accent)] transition-all duration-150 disabled:opacity-40"
          />
        </div>

        {/* Collection chips */}
        {collectionChips}

        {error && <p className="text-xs text-[var(--error)] mt-0.5">{error}</p>}
      </div>
    </div>
  );
}
