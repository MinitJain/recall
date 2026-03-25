"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SaveUrlForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "something went wrong");
        return;
      }

      setUrl("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <label htmlFor="bookmark-url" className="sr-only">
          URL
        </label>
        <input
          id="bookmark-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a URL to save..."
          autoComplete="url"
          required
          className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-100"
        />
        <button
          type="submit"
          disabled={loading || !url}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-text)] hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors duration-100 active:scale-95"
        >
          {loading ? "Saving…" : "Save"}
        </button>
      </form>
      {error && <p className="text-xs text-[var(--error)] mt-2">{error}</p>}
    </div>
  );
}
