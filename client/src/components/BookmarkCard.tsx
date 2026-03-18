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
  const [error, setError] = useState<string | null>(null);

  async function addTag() {
    const name = input.trim();
    if (!name) return;
    setLoading(true);
    setError(null);
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
    }
    setLoading(false);
    router.refresh();
  }

  async function removeTag(tagId: string) {
    const res = await fetch(`/api/bookmarks/${bookmark.id}/tags/${tagId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      setError("failed to remove tag");
      return;
    }
    router.refresh();
  }

  return (
    <div className="border rounded-lg p-4 flex gap-4 bg-white shadow-sm">
      {bookmark.thumbnail && (
        <img
          src={bookmark.thumbnail}
          alt={bookmark.title ?? ""}
          className="w-24 h-24 object-cover rounded"
        />
      )}
      <div className="flex flex-col gap-1 flex-1">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-blue-600 hover:underline"
        >
          {bookmark.title ?? bookmark.url}
        </a>
        {bookmark.description && (
          <p className="text-sm text-gray-500 line-clamp-2">
            {bookmark.description}
          </p>
        )}
        <span className="text-xs text-gray-400">{bookmark.url}</span>

        <div className="flex flex-wrap gap-1 mt-2">
          {bookmark.tags.map((tag) => (
            <span
              key={tag.id}
              className="flex items-center gap-1 text-xs bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-full"
            >
              {tag.name}
              <button
                onClick={() => removeTag(tag.id)}
                className="text-zinc-400 hover:text-red-500"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTag()}
            placeholder="Add a tag..."
            className="text-xs border rounded px-2 py-1 flex-1"
          />
          <button
            onClick={addTag}
            disabled={loading}
            className="text-xs bg-zinc-800 text-white px-3 py-1 rounded hover:bg-zinc-700 disabled:opacity-50"
          >
            Add
          </button>
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    </div>
  );
}
