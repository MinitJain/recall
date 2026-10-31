import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ContentPage, GITHUB_URL } from "@/components/site/SiteChrome";

export const metadata: Metadata = {
  title: "FAQ | Ritro",
  description: "Answers about cost, your data, AI tags, the extension and deleting your account.",
};

const link = "text-[var(--accent)] underline underline-offset-2";

const FAQS: [question: string, answer: ReactNode][] = [
  ["Is Ritro free?", "Yes. There are no paid plans and no ads. Ritro is a personal project, run by one person."],
  [
    "How do I save something?",
    <>
      Paste a link on your dashboard, use the <Link href="/extension" className={link}>Chrome extension</Link>, or drag
      the bookmarklet into your bookmarks bar. Every save lands in the same archive.
    </>,
  ],
  [
    "Where do the tags come from?",
    "A few seconds after you save, Google Gemini reads the page title and description and suggests tags. You can remove any tag or add your own. If tagging fails, the save is kept and Ritro tries again later.",
  ],
  [
    "Where is my data stored?",
    <>
      Your saves live in a Supabase database hosted in Mumbai, India. The <Link href="/privacy" className={link}>privacy
      policy</Link> lists every service involved and what each one sees.
    </>,
  ],
  [
    "Does anyone read my saves?",
    "Ritro never reads them. To suggest tags, each page title and description is sent to Google Gemini on its free tier, where Google may use it to improve its products and reviewers may read it. Avoid saving pages whose titles you consider sensitive.",
  ],
  [
    "Can I export or delete everything?",
    "Yes. Settings has a button to download all your data as a file, and one to delete your account. Deleting removes every save, tag and collection right away.",
  ],
  [
    "What is the daily email?",
    "Each morning Ritro can send you a few things you saved and forgot about. One click on the unsubscribe link in any of those emails turns it off.",
  ],
  [
    "Is the code public?",
    <>
      Yes, under the AGPL license. Read it, run it yourself or contribute on{" "}
      <a href={GITHUB_URL} className={link}>GitHub</a>. The <Link href="/open-source" className={link}>open source
      page</Link> explains how it is built.
    </>,
  ],
  [
    "I found a bug or have an idea.",
    <>
      Open a GitHub issue or <Link href="/contact" className={link}>write to me</Link>. Security problems go through the
      repository&apos;s Security tab, privately.
    </>,
  ],
];

export default function FaqPage() {
  return (
    <ContentPage title="Questions, answered." lead="The things people ask before they trust Ritro with their saves.">
      <div className="reveal mt-12 max-w-3xl divide-y divide-[var(--border)] border-y border-[var(--border)]">
        {FAQS.map(([question, answer]) => (
          <details key={question} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-serif text-xl text-[var(--text)] [&::-webkit-details-marker]:hidden">
              {question}
              <span aria-hidden className="text-2xl leading-none text-[var(--accent)] transition-transform duration-200 group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-[var(--text-muted)]">{answer}</p>
          </details>
        ))}
      </div>
    </ContentPage>
  );
}
