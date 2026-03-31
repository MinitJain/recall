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
    <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
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
          className="flex-1 h-12 rounded-xl border border-[var(--border-2)] bg-[var(--surface)] px-4 text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-100"
        />
        <button
          type="submit"
          disabled={loading || !url}
          className="h-12 rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-[var(--accent-text)] hover:bg-[var(--accent-hover)] hover:shadow-[var(--shadow-glow)] disabled:opacity-50 transition-all duration-150 active:scale-95"
        >
          {loading ? "Saving…" : "Save"}
        </button>
      </form>
      {error && <p className="text-xs text-[var(--error)] mt-2">{error}</p>}

      {/* Bookmarklet install strip */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--border)]">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-dim)] flex-shrink-0">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
        <span className="text-xs text-[var(--text-dim)]">Save from any page —</span>
        <a
          href={`javascript:(function(){window.open('https://recallsave.vercel.app/bookmarklet?url='+encodeURIComponent(location.href),'recall-save','width=400,height=220,toolbar=0,menubar=0,location=0')})();`}
          onClick={(e) => e.preventDefault()}
          draggable
          className="text-xs text-[var(--accent)] hover:underline cursor-grab active:cursor-grabbing select-none"
          title="Drag this to your bookmarks bar"
        >
          drag to bookmarks bar
        </a>
      </div>
    </div>
  );
}
