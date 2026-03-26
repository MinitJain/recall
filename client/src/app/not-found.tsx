import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Amber blob — top left */}
      <div
        className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "rgba(240,165,0,0.12)", filter: "blur(120px)" }}
      />
      {/* Purple blob — bottom right */}
      <div
        className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "rgba(124,58,237,0.10)", filter: "blur(120px)" }}
      />

      <div className="relative z-10 flex flex-col items-center text-center gap-6">
        <p
          className="font-extrabold leading-none text-[var(--accent)]"
          style={{
            fontSize: "120px",
            fontFamily: "var(--font-syne), sans-serif",
            fontWeight: 800,
            textShadow: "0 0 60px rgba(240,165,0,0.35)",
          }}
        >
          404
        </p>
        <h1
          className="text-[var(--text)]"
          style={{
            fontSize: "32px",
            fontFamily: "var(--font-syne), sans-serif",
            fontWeight: 700,
          }}
        >
          This page doesn&apos;t exist.
        </h1>
        <p
          className="text-[var(--text-muted)] max-w-sm"
          style={{ fontSize: "16px", fontFamily: "var(--font-dm-sans), sans-serif" }}
        >
          The link might be broken, or the page may have been removed.
        </p>
        <div className="flex items-center gap-3 mt-2">
          <Link
            href="/"
            className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-text)] hover:bg-[var(--accent-hover)] transition-colors duration-100"
          >
            Go home
          </Link>
          <Link
            href="/app"
            className="rounded-lg border border-[var(--border-2)] px-5 py-2.5 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors duration-100"
          >
            Open app
          </Link>
        </div>
      </div>
    </main>
  );
}
