"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<null | { id: string; title: string | null; url: string }[]>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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

  return (
    <div className="mb-6 relative">
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search bookmarks..."
          className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500"
        />
        {isPending && (
          <span className="absolute right-3 top-2.5 text-xs text-zinc-400">
            Searching...
          </span>
        )}
        {query && !isPending && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-2.5 text-xs text-zinc-400 hover:text-zinc-600"
          >
            Clear
          </button>
        )}
      </div>

      {results !== null && (
        <div className="mt-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-hidden">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-zinc-500">No results found.</p>
          ) : (
            results.map((b) => (
              <a
                key={b.id}
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-700 border-b border-zinc-100 dark:border-zinc-700 last:border-0 transition-colors"
              >
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                  {b.title || b.url}
                </span>
                <span className="text-xs text-zinc-400 truncate">{b.url}</span>
              </a>
            ))
          )}
        </div>
      )}
    </div>
  );
}
