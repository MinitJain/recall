"use client";

import { useEffect, useState } from "react";

export default function BookmarkletSaver({ url }: { url: string }) {
  const [status, setStatus] = useState<"saving" | "saved" | "duplicate" | "error">("saving");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function save() {
      try {
        const res = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        if (res.status === 409) {
          setStatus("duplicate");
        } else if (res.ok) {
          setStatus("saved");
          setTimeout(() => window.close(), 1500);
        } else {
          const data = await res.json().catch(() => ({}));
          setErrorMsg(data.error ?? "Failed to save");
          setStatus("error");
        }
      } catch {
        setErrorMsg("Network error — are you online?");
        setStatus("error");
      }
    }
    save();
  }, [url]);

  return (
    <div className="flex flex-col items-center justify-center gap-3 text-center px-6">
      {status === "saving" && (
        <>
          <div className="w-8 h-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
          <p className="text-sm text-[var(--text-muted)]">Saving...</p>
        </>
      )}
      {status === "saved" && (
        <>
          <div className="w-10 h-10 rounded-full bg-[var(--accent-soft)] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)]">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-sm font-medium text-[var(--text)]">Saved to Recall</p>
          <p className="text-xs text-[var(--text-dim)]">
            {window.opener ? "This window will close..." : (
              <a href="/app" className="text-[var(--accent)] hover:underline">View your bookmarks</a>
            )}
          </p>
        </>
      )}
      {status === "duplicate" && (
        <>
          <div className="w-10 h-10 rounded-full bg-[var(--surface-2)] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-muted)]">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="text-sm font-medium text-[var(--text)]">Already saved</p>
          <p className="text-xs text-[var(--text-dim)]">This URL is already in your Recall.</p>
        </>
      )}
      {status === "error" && (
        <>
          <div className="w-10 h-10 rounded-full bg-[var(--error-bg)] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--error)]">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="text-sm font-medium text-[var(--text)]">Could not save</p>
          <p className="text-xs text-[var(--error)]">{errorMsg}</p>
        </>
      )}
    </div>
  );
}
