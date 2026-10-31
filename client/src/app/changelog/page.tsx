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
          <article key={r.version} className="reveal grid gap-8 border-t border-[var(--border)] pt-10 md:grid-cols-12">
            <header className="md:col-span-4">
              <span className="date-stamp" style={{ transform: "rotate(-2deg)" }}>
                v{r.version}
              </span>
              <p className="mt-4 font-data text-xs text-[var(--text-dim)]">{r.date}</p>
              <h2 className="mt-2 font-serif text-2xl font-medium leading-snug text-[var(--text)]">{r.title}</h2>
            </header>
            <div className="space-y-8 md:col-span-8">
              {r.groups.map(([heading, items]) => (
                <section key={heading}>
                  <h3 className="font-serif text-lg italic text-[var(--text-muted)]">{heading}</h3>
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
