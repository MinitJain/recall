import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { ContentPage, GITHUB_URL } from "@/components/site/SiteChrome";
import CopyButton from "@/components/site/CopyButton";
import RepoTree from "@/components/site/RepoTree";

export const metadata: Metadata = {
  title: "Open source | Ritro",
  description: "Every line of Ritro is public under the AGPL. See what lives where, how your data is protected, and run your own copy.",
};

const FACTS: [value: string, label: string][] = [
  ["AGPL-3.0", "licence"],
  ["0", "tracking cookies"],
  ["50", "automated tests"],
  ["3", "database tables"],
];

// Each promise points at the code that keeps it, so it can be checked rather than trusted
const PROMISES: { title: string; body: string; proof: string; href: string }[] = [
  {
    title: "Your links can't reach our servers' insides",
    body: "Ritro fetches the pages you save. Every address, every redirect and the connection itself are checked, so a link can only ever reach the public internet.",
    proof: "url-validation.ts · safe-fetch.ts",
    href: `${GITHUB_URL}/tree/main/client/src/lib`,
  },
  {
    title: "Only you can read your saves",
    body: "Database rules scope every row to its owner, and every API route checks who is asking before it reads or writes anything.",
    proof: "supabase-rls.sql",
    href: `${GITHUB_URL}/blob/main/client/supabase-rls.sql`,
  },
  {
    title: "You can leave with everything",
    body: "Download every bookmark, tag and collection as a file, or delete your account and all of it, yourself, from Settings.",
    proof: "api/account",
    href: `${GITHUB_URL}/tree/main/client/src/app/api/account`,
  },
  {
    title: "Nothing about you is sold",
    body: "No ads, no tracking cookies. The privacy policy names every service that touches your data, and why.",
    proof: "privacy policy",
    href: "/privacy",
  },
];

const RUN_IT = `git clone ${GITHUB_URL}.git && cd ritro/client
npm install
cp .env.example .env.local   # add your Supabase, Gemini and Upstash keys
npx prisma db push           # create the tables
npm run dev                  # http://localhost:3000`;

const STANDING_ON: [name: string, licence: string, what: string][] = [
  ["Next.js", "MIT", "The website and its API"],
  ["React", "MIT", "The interface"],
  ["Tailwind CSS", "MIT", "Styling"],
  ["Prisma", "Apache-2.0", "Talking to the database"],
  ["Supabase", "Apache-2.0 / MIT", "Accounts and Postgres"],
  ["Upstash", "MIT", "Queue and rate limits"],
  ["Lucide", "ISC", "Icons"],
  ["open-graph-scraper", "MIT", "Reading page previews"],
  ["Source Serif 4", "OFL-1.1", "Headings"],
  ["Geist and Geist Mono", "OFL-1.1", "Text and dates"],
];

export default function OpenSourcePage() {
  return (
    <ContentPage
      title="Every line of Ritro is open source."
      lead="Your archive is personal, so you should be able to see exactly what happens to it. The website, the API, the extension and the database are all public on GitHub."
    >
      <div className="animate-fade-up mt-10 flex flex-wrap items-end justify-between gap-8" style={{ animationDelay: "200ms" }}>
        <dl className="flex flex-wrap gap-x-10 gap-y-6">
          {FACTS.map(([value, label]) => (
            <div key={label}>
              <dt className="sr-only">{label}</dt>
              <dd className="font-serif text-4xl font-medium tracking-[-0.02em] text-[var(--text)]">{value}</dd>
              <dd className="mt-1 text-sm text-[var(--text-muted)]">{label}</dd>
            </div>
          ))}
        </dl>
        <div className="flex items-center gap-2 rounded-full border border-[var(--border-2)] bg-[var(--surface)] py-1.5 pl-4 pr-1.5">
          <a href={GITHUB_URL} className="font-data text-[13px] text-[var(--text)] hover:text-[var(--accent)]">
            github.com/ritrolabs/ritro
          </a>
          <CopyButton text={GITHUB_URL} />
        </div>
      </div>

      <section className="reveal mt-16">
        <RepoTree />
        <p className="mt-4 max-w-2xl text-sm text-[var(--text-muted)]">
          AGPL-3.0: use it, study it, change it and share it. If you run a changed version as a service for
          other people, share your changes with them too.
        </p>
      </section>

      <section className="mt-28">
        <h2 className="reveal max-w-2xl font-serif text-[clamp(2rem,4vw,3rem)] font-medium leading-tight tracking-[-0.02em]">
          Four promises, and the code that keeps them.
        </h2>
        <div className="mt-12 grid gap-x-12 gap-y-10 border-t border-[var(--border)] pt-10 md:grid-cols-2">
          {PROMISES.map((p) => (
            <div key={p.title} className="reveal">
              <h3 className="font-serif text-xl font-medium text-[var(--text)]">{p.title}</h3>
              <p className="mt-2 max-w-[52ch] text-[15px] leading-relaxed text-[var(--text-muted)]">{p.body}</p>
              <a
                href={p.href}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--border-2)] px-3 py-1 font-data text-xs text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <Check size={12} aria-hidden className="text-[var(--accent)]" />
                {p.proof}
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-28 grid gap-10 md:grid-cols-12">
        <div className="reveal md:col-span-5">
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-medium leading-tight tracking-[-0.02em]">
            Run your own copy.
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-[var(--text-muted)]">
            Five commands and free accounts on Supabase, Gemini and Upstash. The{" "}
            <a href={`${GITHUB_URL}#run-it-locally`} className="text-[var(--accent)] underline underline-offset-2">
              README
            </a>{" "}
            lists every setting.
          </p>
        </div>
        <div className="reveal min-w-0 md:col-span-7">
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[#1F1B16] shadow-[var(--shadow-lift)]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
              <span className="font-data text-xs text-white/50">Terminal</span>
              <CopyButton text={RUN_IT} />
            </div>
            <pre className="overflow-x-auto p-5 font-data text-[13px] leading-6 text-[#F1EBDF]">{RUN_IT}</pre>
          </div>
        </div>
      </section>

      <section className="mt-28 grid gap-10 md:grid-cols-12">
        <div className="reveal md:col-span-5">
          <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-medium leading-tight tracking-[-0.02em]">
            Help make it better.
          </h2>
        </div>
        <ol className="reveal space-y-4 text-[16px] leading-relaxed text-[var(--text-muted)] md:col-span-7">
          <li>
            <strong className="font-medium text-[var(--text)]">Found a bug?</strong>{" "}
            <a href={`${GITHUB_URL}/issues/new?template=bug_report.md`} className="text-[var(--accent)] underline underline-offset-2">
              Open an issue
            </a>
            . For security problems, report them privately from the repository&apos;s Security tab.
          </li>
          <li>
            <strong className="font-medium text-[var(--text)]">Want to change something?</strong> Fork the
            repository, make a branch, and open a pull request. Every pull request is checked by tests and
            reviewed automatically.
          </li>
          <li>
            <strong className="font-medium text-[var(--text)]">Bigger idea?</strong> Open an issue first so we
            can agree on the approach, or <Link href="/contact" className="text-[var(--accent)] underline underline-offset-2">write to me</Link>.
          </li>
        </ol>
      </section>

      <section className="mt-28">
        <h2 className="reveal max-w-2xl font-serif text-[clamp(2rem,4vw,3rem)] font-medium leading-tight tracking-[-0.02em]">
          Standing on open source.
        </h2>
        <ul className="reveal mt-10 grid gap-x-10 gap-y-6 border-t border-[var(--border)] pt-8 sm:grid-cols-2 lg:grid-cols-3">
          {STANDING_ON.map(([name, licence, what]) => (
            <li key={name}>
              <p className="text-[15px] font-medium text-[var(--text)]">{name}</p>
              <p className="mt-0.5 font-data text-xs text-[var(--text-dim)]">{licence}</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{what}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-[var(--text-muted)]">
          Full licence details are in{" "}
          <a href={`${GITHUB_URL}/blob/main/THIRD_PARTY_NOTICES.md`} className="text-[var(--accent)] underline underline-offset-2">
            THIRD_PARTY_NOTICES.md
          </a>
          .
        </p>
      </section>
    </ContentPage>
  );
}
