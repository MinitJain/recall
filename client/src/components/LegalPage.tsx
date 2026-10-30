import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
      <article className="mx-auto max-w-2xl text-[15px] leading-[1.7] text-[var(--text-muted)] [&_a]:text-[var(--accent)] [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-12 [&_h2]:mb-3 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-medium [&_h2]:text-[var(--text)] [&_li]:mt-1.5 [&_p]:mt-4 [&_strong]:font-medium [&_strong]:text-[var(--text)] [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm no-underline">
          <ArrowLeft size={13} strokeWidth={2} aria-hidden /> Ritro
        </Link>
        <h1 className="mt-8 font-serif text-4xl font-medium tracking-[-0.02em] text-[var(--text)]">{title}</h1>
        <p className="mt-2 text-sm text-[var(--text-dim)]">Last updated {updated}</p>
        {children}
      </article>
    </main>
  );
}
