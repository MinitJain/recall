import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import StickyHeader from "@/components/landing/StickyHeader";

export const GITHUB_URL = "https://github.com/ritrolabs/ritro";

const NAV_LINKS: [label: string, href: string][] = [
  ["How it works", "/#how"],
  ["Extension", "/extension"],
  ["Changelog", "/changelog"],
  ["Open source", "/open-source"],
];

// Shared header for every public page: full-width at the top, a floating glass pill once scrolled
export function SiteHeader() {
  return (
    <StickyHeader>
      <div className="site-header-bar mx-auto flex h-16 items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Ritro home">
          <Image src="/logo.svg" alt="" width={22} height={22} />
          <span className="font-serif text-xl font-semibold">Ritro</span>
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
          {NAV_LINKS.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="hidden rounded-md px-3 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] md:block"
            >
              {label}
            </Link>
          ))}
          <ThemeToggle />
          <Link
            href="/auth"
            className="rounded-md px-3 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-2)]"
          >
            Log in
          </Link>
        </nav>
      </div>
    </StickyHeader>
  );
}

const FOOTER_COLUMNS: { title: string; links: [label: string, href: string][] }[] = [
  {
    title: "Product",
    links: [
      ["Open Ritro", "/auth"],
      ["Chrome extension", "/extension"],
      ["Changelog", "/changelog"],
    ],
  },
  {
    title: "Open source",
    links: [
      ["How it's built", "/open-source"],
      ["GitHub", GITHUB_URL],
      ["llms.txt", "/llms.txt"],
    ],
  },
  {
    title: "Ritro",
    links: [
      ["Contact", "/contact"],
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-serif text-xl font-semibold text-[var(--text)]">Ritro</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-[var(--text-muted)]">
            Save anything. Find everything. A personal archive that brings your saves back.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-serif text-sm italic text-[var(--text-dim)]">{col.title}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    {href.startsWith("http") || href.endsWith(".txt") ? (
                      <a href={href} className="text-[var(--text-muted)] hover:text-[var(--text)]">
                        {label}
                      </a>
                    ) : (
                      <Link href={href} className="text-[var(--text-muted)] hover:text-[var(--text)]">
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t border-[var(--border)]">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-[var(--text-dim)] sm:px-8">
          © 2026 Minit Jain. Code licensed under AGPL-3.0.
        </p>
      </div>
    </footer>
  );
}

// Page shell for content pages: shared header, a readable column, shared footer
export function ContentPage({ title, lead, children }: { title: string; lead?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 pb-24 pt-14 sm:px-8 md:pt-20">
        <h1 className="animate-fade-up max-w-3xl font-serif text-[clamp(2.5rem,6vw,4.25rem)] font-medium leading-[1.04] tracking-[-0.03em] text-balance">
          {title}
        </h1>
        {lead && (
          <p className="animate-fade-up mt-6 max-w-2xl text-lg leading-relaxed text-[var(--text-muted)]" style={{ animationDelay: "120ms" }}>
            {lead}
          </p>
        )}
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
