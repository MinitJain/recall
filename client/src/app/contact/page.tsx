import type { Metadata } from "next";
import { ContentPage, GITHUB_URL } from "@/components/site/SiteChrome";
import CopyButton from "@/components/site/CopyButton";

export const metadata: Metadata = {
  title: "Contact | Ritro",
  description: "Write to the person who builds Ritro.",
};

const EMAIL = "minitjain.work@gmail.com";

export default function ContactPage() {
  return (
    <ContentPage
      title="Write to the person who builds Ritro."
      lead="Ritro is made by one person, Minit Jain. Questions, ideas, bug reports and privacy requests all reach me directly."
    >
      <div className="reveal mt-12 flex w-fit max-w-full flex-wrap items-center gap-3 rounded-2xl border border-[var(--border-2)] bg-[var(--surface)] py-3 pl-6 pr-3 shadow-[var(--shadow-lift)]">
        <a href={`mailto:${EMAIL}`} className="font-serif text-2xl text-[var(--text)] hover:text-[var(--accent)]">
          {EMAIL}
        </a>
        <CopyButton text={EMAIL} />
      </div>

      <ul className="reveal mt-12 max-w-2xl space-y-4 text-[16px] leading-relaxed text-[var(--text-muted)]">
        <li>
          <strong className="font-medium text-[var(--text)]">Bugs and feature ideas</strong> are easiest to track as{" "}
          <a href={`${GITHUB_URL}/issues`} className="text-[var(--accent)] underline underline-offset-2">
            GitHub issues
          </a>
          .
        </li>
        <li>
          <strong className="font-medium text-[var(--text)]">Security problems</strong>: please report them privately
          from the repository&apos;s Security tab, not in a public issue.
        </li>
        <li>
          <strong className="font-medium text-[var(--text)]">Your data</strong>: you can download or delete it
          yourself from Settings. For anything else, email me and you&apos;ll hear back within 30 days.
        </li>
      </ul>
    </ContentPage>
  );
}
