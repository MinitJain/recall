"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Tag = {
  id: string;
  name: string;
};

type Bookmark = {
  id: string;
  url: string;
  title: string | null;
  description: string | null;
  thumbnail: string | null;
  createdAt: string;
  tags: Tag[];
};

export default function BookmarkCard({ bookmark }: { bookmark: Bookmark }) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/bookmarks/${bookmark.id}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "failed to add tag");
      } else {
        setInput("");
        router.refresh();
      }
    } catch {
      setError("failed to add tag");
    } finally {
      setLoading(false);
    }
  }

  async function removeTag(tagId: string) {
    if (removingId) return;
    setRemovingId(tagId);
    setError(null);
    try {
      const res = await fetch(`/api/bookmarks/${bookmark.id}/tags/${tagId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setError("failed to remove tag");
        return;
      }
      router.refresh();
    } catch {
      setError("failed to remove tag");
    } finally {
      setRemovingId(null);
    }
  }

  async function deleteBookmark() {
    if (deleting) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/bookmarks/${bookmark.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setError("failed to delete");
        setDeleting(false);
        return;
      }
      router.refresh();
    } catch {
      setError("failed to delete");
      setDeleting(false);
    }
  }

  return (
    <div className="group relative flex gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-all duration-150 hover:border-[var(--border-2)] hover:shadow-[var(--shadow-glow)] animate-fade-up">
      {/* Thumbnail */}
      {bookmark.thumbnail && (
        <img
          src={bookmark.thumbnail}
          alt={bookmark.title ?? ""}
          className="w-16 h-16 flex-shrink-0 rounded-xl object-cover bg-[var(--surface-2)]"
        />
      )}

      {/* Content */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        {/* Title + delete */}
        <div className="flex items-start justify-between gap-2">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-sm text-[var(--text)] hover:text-[var(--accent)] transition-colors duration-100 line-clamp-1"
          >
            {bookmark.title ?? hostname}
          </a>
          <button
            type="button"
            onClick={deleteBookmark}
            disabled={deleting}
            aria-label="Delete bookmark"
            className="flex-shrink-0 opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded text-[var(--text-dim)] hover:text-red-400 hover:bg-[var(--error-bg)] transition-all duration-100 disabled:opacity-30"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
            </svg>
          </button>
        </div>

        {/* Description */}
        {bookmark.description && (
          <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
            {bookmark.description}
          </p>
        )}

        {/* Hostname */}
        <span className="text-xs text-[var(--text-muted)]">{hostname}</span>

        {/* Tags */}
        {bookmark.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-0.5">
            {bookmark.tags.map((tag) => (
              <span
                key={tag.id}
                className="tag-enter flex items-center gap-1 text-xs bg-[var(--accent-soft)] text-[var(--accent)] px-2.5 py-0.5 rounded-full"
              >
                {tag.name}
                <button
                  type="button"
                  aria-label={`Remove tag ${tag.name}`}
                  onClick={() => removeTag(tag.id)}
                  disabled={removingId === tag.id}
                  className="text-[var(--text-dim)] hover:text-[var(--error)] disabled:opacity-40 leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Add tag */}
        <div className="flex gap-1.5 mt-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTag()}
            placeholder="Add tag..."
            maxLength={50}
            className="text-xs flex-1 min-w-0 rounded-md border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1 text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-100"
          />
          <button
            onClick={addTag}
            disabled={loading || !input.trim()}
            className="text-xs px-2.5 py-1 rounded-md bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-40 transition-all duration-100"
          >
            Add
          </button>
        </div>

        {error && <p className="text-xs text-[var(--error)] mt-0.5">{error}</p>}
      </div>
    </div>
  );
}
