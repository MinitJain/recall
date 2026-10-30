"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-5">
      <div className="max-w-md text-center">
        <span className="date-stamp" style={{ transform: "rotate(-3deg)" }}>
          Misfiled
        </span>
        <h1 className="mt-8 font-serif text-4xl font-medium tracking-[-0.02em] text-[var(--text)]">
          Something went wrong on our side.
        </h1>
        <p className="mt-4 text-[16px] leading-relaxed text-[var(--text-muted)]">
          Your saves are safe. Try again, and if it keeps happening, come back in a few minutes.
        </p>
        <div className="mt-8 flex items-center justify-center gap-5">
          <button
            onClick={reset}
            className="inline-flex h-11 items-center rounded-md bg-[var(--accent)] px-5 text-sm font-medium text-[var(--accent-text)] hover:bg-[var(--accent-hover)]"
          >
            Try again
          </button>
          <Link href="/" className="text-sm font-medium text-[var(--text)] underline underline-offset-4">
            Back to Ritro
          </Link>
        </div>
      </div>
    </main>
  );
}
