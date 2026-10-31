import type { Metadata } from "next";
import { ContentPage, GITHUB_URL } from "@/components/site/SiteChrome";

export const metadata: Metadata = {
  title: "Changelog | Ritro",
  description: "Every release of Ritro, newest first.",
};

// shortcut: kept by hand next to CHANGELOG.md (Vercel builds from client/, so the root file isn't readable here); move both to one source if releases get frequent
const RELEASES: { version: string; date: string; title: string; groups: [heading: string, items: string[]][] }[] = [
  {
    version: "0.0.1",
    date: "31 October 2026",
    title: "Recall becomes Ritro",
    groups: [
      [
        "New",
        [
          "Saving is instant. AI tags arrive a few seconds later from a background queue that retries on failure.",
          "Settings: download all your data, or delete your account and everything in it.",
          "A privacy policy and terms, written to be read.",
          "This changelog, an open source page and an extension page.",
        ],
      ],
      [
        "Changed",
        [
          "A new name, address and look: paper and ink, one violet accent, and a date stamp on every save.",
          "The extension only runs when you click it, stays signed in, and signs you out properly.",
          "The home page shows the product working instead of describing it.",
        ],
      ],
      [
        "Fixed",
        [
          "The daily digest email never ran. It now goes out every morning.",
          "Saved links could be used to reach private addresses. Every address, redirect and connection is now checked.",
        ],
      ],
    ],
  },
];

export default function ChangelogPage() {
  return (
    <ContentPage title="Every release, newest first." lead="What changed in Ritro, in plain words.">
      <div className="mt-16 space-y-20">
        {RELEASES.map((r) => (
          <article key={r.version} className="reveal border-t border-[var(--border)] pt-10">
            <header className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="date-stamp" style={{ transform: "rotate(-2deg)" }}>
                v{r.version}
              </span>
              <h2 className="font-serif text-2xl font-medium leading-snug text-[var(--text)]">{r.title}</h2>
              <p className="font-data text-xs text-[var(--text-dim)]">{r.date}</p>
            </header>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {r.groups.map(([heading, items]) => (
                <section key={heading} className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-5">
                  <h3 className="font-serif text-xl font-semibold italic text-[var(--text)]">{heading}</h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-[var(--text-muted)] marker:text-[var(--accent)]">
                    {items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </article>
        ))}
      </div>
      <p className="mt-16 text-sm text-[var(--text-muted)]">
        The technical version, with pull request numbers, is in{" "}
        <a href={`${GITHUB_URL}/blob/main/CHANGELOG.md`} className="text-[var(--accent)] underline underline-offset-2">
          CHANGELOG.md
        </a>
        .
      </p>
    </ContentPage>
  );
}
