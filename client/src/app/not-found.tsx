import Link from "next/link";

export const metadata = { title: "Not found | Ritro" };

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-5">
      <div className="max-w-md text-center">
        <span className="date-stamp" style={{ transform: "rotate(-3deg)" }}>
          Not on file
        </span>
        <h1 className="mt-8 font-serif text-4xl font-medium tracking-[-0.02em] text-[var(--text)]">
          This page isn&apos;t in the archive.
        </h1>
        <p className="mt-4 text-[16px] leading-relaxed text-[var(--text-muted)]">
          The link may be old or mistyped. Your saves are safe where you left them.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center rounded-md bg-[var(--accent)] px-5 text-sm font-medium text-[var(--accent-text)] hover:bg-[var(--accent-hover)]"
        >
          Back to Ritro
        </Link>
      </div>
    </main>
  );
}
