"use client";

import { useState, type ReactNode } from "react";
import { Search, X } from "lucide-react";
import { EXAMPLES } from "./examples";

const SUGGESTIONS = ["focus music", "recipes", "essays"];

// Every word must appear in the title, description, site or tags, the same way the real search narrows down
function matches(query: string) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  return EXAMPLES.filter((e) => {
    const haystack = `${e.title} ${e.description} ${e.site} ${e.tags.join(" ")}`.toLowerCase();
    return words.every((w) => haystack.includes(w));
  });
}

// Show the description only when a word matched there and not in the title, so the reason is visible
function inDescriptionOnly(e: (typeof EXAMPLES)[number], query: string) {
  const title = e.title.toLowerCase();
  const description = e.description.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .some((w) => w && description.includes(w) && !title.includes(w));
}

function highlight(text: string, query: string): ReactNode {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return text;
  const escaped = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return text.split(new RegExp(`(${escaped.join("|")})`, "gi")).map((part, i) =>
    words.includes(part.toLowerCase()) ? (
      <mark key={i} className="rounded-sm bg-[var(--accent-soft)] px-0.5 text-[var(--accent)]">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

export default function SearchDemo() {
  const [query, setQuery] = useState("focus music");
  const results = matches(query);

  return (
    <div className="rounded-md border border-[var(--border-2)] bg-[var(--surface)] p-5 shadow-[var(--shadow-lift)]">
      <label className="flex h-11 items-center gap-2.5 rounded-md border border-[var(--border-2)] bg-[var(--bg)] px-3.5 focus-within:border-[var(--accent)]">
        <Search size={15} aria-hidden className="shrink-0 text-[var(--accent)]" />
        <span className="sr-only">Search the example archive</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-[15px] text-[var(--text)] outline-none placeholder:text-[var(--text-dim)]"
          placeholder="Try recipes, essays or music"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="inline-flex rounded p-1 text-[var(--text-dim)] hover:text-[var(--text)]"
          >
            <X size={14} aria-hidden />
          </button>
        )}
      </label>

      <p className="mt-3 text-xs text-[var(--text-dim)]" aria-live="polite">
        {results.length} of {EXAMPLES.length} saves
      </p>

      <ul className="mt-1 divide-y divide-[var(--border)]">
        {results.map((r) => (
          <li
            key={r.title}
            className="animate-fade-up flex flex-col gap-2 py-3.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
          >
            <div className="min-w-0">
              <p className="font-data text-[11px] text-[var(--text-dim)]">{r.site}</p>
              <p className="mt-0.5 truncate text-[15px] text-[var(--text)]">{highlight(r.title, query)}</p>
              {inDescriptionOnly(r, query) && (
                <p className="mt-0.5 text-[13px] text-[var(--text-muted)]">{highlight(r.description, query)}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {r.tags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setQuery(t)}
                  className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-xs text-[var(--accent)] transition-transform hover:-translate-y-px"
                >
                  {t}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>

      {results.length === 0 && (
        <p className="py-6 text-center text-sm text-[var(--text-muted)]">
          Nothing matches. Try{" "}
          {SUGGESTIONS.map((s, i) => (
            <span key={s}>
              <button type="button" onClick={() => setQuery(s)} className="text-[var(--accent)] underline underline-offset-2">
                {s}
              </button>
              {i < SUGGESTIONS.length - 1 ? ", " : "."}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}
