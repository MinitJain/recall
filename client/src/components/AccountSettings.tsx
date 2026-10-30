"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { DELETE_CONFIRMATION } from "@/lib/account";

export default function AccountSettings() {
  const router = useRouter();
  const [phrase, setPhrase] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault();
    if (phrase !== DELETE_CONFIRMATION) return;
    setDeleting(true);
    setError(null);
    let res: Response;
    try {
      res = await fetch("/api/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: phrase }),
      });
    } catch {
      setError("Couldn't reach Ritro. Check your connection and try again.");
      setDeleting(false);
      return;
    }
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Try again.");
      setDeleting(false);
      return;
    }
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mt-8 flex flex-col gap-6">
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-sm font-semibold text-[var(--text)]">Export your data</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Download every bookmark, tag and collection as a JSON file.
        </p>
        {/* A plain link lets the browser handle the download from the attachment header */}
        <a
          href="/api/account"
          className="mt-4 inline-flex h-9 items-center rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 text-sm font-medium text-[var(--text)] hover:bg-[var(--border)] transition-colors duration-100"
        >
          Download export
        </a>
      </section>

      <section className="rounded-xl border border-red-500/30 bg-[var(--surface)] p-5">
        <h2 className="text-sm font-semibold text-[var(--text)]">Delete account</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Permanently deletes your account, bookmarks, tags and collections. This can&apos;t be
          undone. See the <Link href="/privacy" className="underline underline-offset-2">Privacy Policy</Link>{" "}
          for what else is kept and for how long.
        </p>
        <form onSubmit={handleDelete} className="mt-4 flex flex-col gap-3">
          <label htmlFor="delete-confirm" className="text-sm text-[var(--text-muted)]">
            Type <strong className="font-medium text-[var(--text)]">{DELETE_CONFIRMATION}</strong> to confirm
          </label>
          <input
            id="delete-confirm"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            autoComplete="off"
            className="h-9 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 text-sm text-[var(--text)] outline-none focus:border-red-500/60"
          />
          {error && (
            <p role="alert" className="text-sm text-red-500">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={phrase !== DELETE_CONFIRMATION || deleting}
            className="h-9 self-start rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-100"
          >
            {deleting ? "Deleting…" : "Delete my account"}
          </button>
        </form>
      </section>
    </div>
  );
}
