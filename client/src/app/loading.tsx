// Shown for public pages too (landing, legal), so it stays neutral: no dashboard skeleton.
export default function Loading() {
  return <div className="min-h-screen bg-[var(--bg)]" aria-busy="true" />;
}
