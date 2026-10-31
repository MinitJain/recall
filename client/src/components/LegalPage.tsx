import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";

// Shared shell for /privacy and /terms: site header and footer around a readable column.
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
    <div className="min-h-screen bg-[var(--bg)]">
      <SiteHeader />
      <main className="px-5 pb-24 pt-14 sm:pt-20">
        <article className="mx-auto max-w-2xl text-[15px] leading-[1.7] text-[var(--text-muted)] [&_a]:text-[var(--accent)] [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-12 [&_h2]:mb-3 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-medium [&_h2]:text-[var(--text)] [&_li]:mt-1.5 [&_p]:mt-4 [&_strong]:font-medium [&_strong]:text-[var(--text)] [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
          <h1 className="font-serif text-4xl font-medium tracking-[-0.02em] text-[var(--text)]">{title}</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">Last updated {updated}</p>
          {children}
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}
