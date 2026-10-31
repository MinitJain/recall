"use client";

import { useState } from "react";
import { Folder, FolderOpen } from "lucide-react";

type Entry = { path: string; summary: string; items: [name: string, what: string][] };

// What lives where in github.com/ritrolabs/ritro. Click a folder to see inside.
const TREE: Entry[] = [
  {
    path: "client/src/app",
    summary: "The website and its API: every page and every endpoint.",
    items: [
      ["api/bookmarks", "Save, list, edit and delete bookmarks"],
      ["api/jobs", "The tagging worker and the daily retry job"],
      ["api/account", "Download your data, delete your account"],
      ["api/digest", "The daily email of things you saved"],
      ["app", "Your dashboard and settings"],
      ["auth", "Sign up, log in, reset password"],
    ],
  },
  {
    path: "client/src/lib",
    summary: "The parts that keep your saves safe and moving.",
    items: [
      ["url-validation.ts", "Only public addresses may be fetched"],
      ["safe-fetch.ts", "Refuses private IPs at connect time"],
      ["tag-queue.ts", "Hands tagging to the background queue"],
      ["gemini.ts", "Asks the AI for tags from title and description"],
      ["ratelimit.ts", "Limits how fast anyone can save"],
    ],
  },
  {
    path: "client/src/components",
    summary: "The interface: cards, search, collections, settings.",
    items: [
      ["DashboardClient.tsx", "Search, filters, collections, Surprise me"],
      ["BookmarkCard.tsx", "One save, its tags and its date stamp"],
      ["AccountSettings.tsx", "Export and delete"],
    ],
  },
  {
    path: "client/prisma",
    summary: "The database: three tables, nothing hidden.",
    items: [
      ["Bookmark", "The link, its title, description and preview"],
      ["Tag", "Words on a bookmark, from AI or from you"],
      ["Collection", "Folders you make"],
    ],
  },
  {
    path: "extension",
    summary: "The Chrome extension. Popup only; it never runs on the pages you visit.",
    items: [
      ["popup.js", "Log in, save this page, recent saves"],
      ["auth.js", "Keeps you signed in, signs you out properly"],
      ["serviceworker.js", "The Alt+Shift+S shortcut"],
    ],
  },
];

export default function RepoTree() {
  const [open, setOpen] = useState(0);
  const entry = TREE[open];

  return (
    <div className="glass-panel grid overflow-hidden rounded-2xl md:grid-cols-5">
      <ul className="border-b border-[var(--border)] p-3 md:col-span-2 md:border-b-0 md:border-r" aria-label="Repository folders">
        {TREE.map((e, i) => {
          const active = i === open;
          const Icon = active ? FolderOpen : Folder;
          return (
            <li key={e.path}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-pressed={active}
                className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left font-data text-[13px] transition-colors ${
                  active ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
                }`}
              >
                <Icon size={15} aria-hidden className="shrink-0" />
                {e.path}/
              </button>
            </li>
          );
        })}
      </ul>
      {/* The live region stays mounted; only the inner block is keyed so it re-animates */}
      <div className="md:col-span-3" aria-live="polite">
        <div key={entry.path} className="animate-fade-up p-6 md:p-8">
          <p className="font-data text-xs text-[var(--text-dim)]">{entry.path}/</p>
          <p className="mt-2 font-serif text-2xl leading-snug text-[var(--text)]">{entry.summary}</p>
          <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {entry.items.map(([name, what]) => (
              <div key={name}>
                <dt className="font-data text-[13px] text-[var(--text)]">{name}</dt>
                <dd className="mt-0.5 text-sm text-[var(--text-muted)]">{what}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
