"use client";

import { useState, useTransition } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<null | { id: string; title: string | null; url: string }[]>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSearch(value: string) {
    setQuery(value);
    if (!value.trim()) {
      setResults(null);
      return;
    }
    startTransition(async () => {
      const res = await fetch(
        `/api/bookmarks/search?q=${encodeURIComponent(value.trim())}`,
      );
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    });
  }

  function handleClear() {
    setQuery("");
    setResults(null);
  }

  const hostname = (url: string) => {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return url;
    }
  };

  return (
    <div className="mb-6 relative">
      <div className="relative">
        {/* Search icon */}
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)] pointer-events-none"
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search bookmarks..."
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] pl-9 pr-16 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-100"
        />
        {isPending && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-dim)]">
            Searching…
          </span>
        )}
        {query && !isPending && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-dim)] hover:text-[var(--text)] transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {results !== null && (
        <div className="absolute left-0 right-0 mt-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-lg overflow-hidden z-20 animate-fade-up">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-[var(--text-muted)]">No results found.</p>
          ) : (
            results.map((b) => (
              <a
                key={b.id}
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col px-4 py-2.5 hover:bg-[var(--surface-2)] border-b border-[var(--border)] last:border-0 transition-colors duration-100"
              >
                <span className="text-sm font-medium text-[var(--text)] truncate">
                  {b.title || hostname(b.url)}
                </span>
                <span className="text-xs text-[var(--text-dim)] truncate">{hostname(b.url)}</span>
              </a>
            ))
          )}
        </div>
      )}
    </div>
  );
}
