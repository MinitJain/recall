import Link from "next/link";
import type { ReactNode } from "react";

// Shared shell for /privacy and /terms: readable measure, plain typography.
export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[var(--bg)] px-5 py-16 sm:py-24">
      <article className="mx-auto max-w-2xl text-[15px] leading-7 text-[var(--text-muted)] [&_a]:text-[var(--accent)] [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-12 [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-[var(--text)] [&_li]:mt-1.5 [&_p]:mt-4 [&_strong]:font-medium [&_strong]:text-[var(--text)] [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
        <Link href="/" className="text-sm no-underline">
          ← Ritro
        </Link>
        <h1 className="mt-8 text-3xl font-semibold tracking-tight text-[var(--text)]">{title}</h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">Last updated {updated}</p>
        {children}
      </article>
    </main>
  );
}
