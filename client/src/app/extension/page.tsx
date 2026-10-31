import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, GITHUB_URL } from "@/components/site/SiteChrome";
import BookmarkletLink from "@/components/landing/BookmarkletLink";
import CopyButton from "@/components/site/CopyButton";

export const metadata: Metadata = {
  title: "Chrome extension | Ritro",
  description: "Save the page you're reading to Ritro in one click or with Alt+Shift+S. Install the extension, or use the bookmarklet in any browser.",
};

const STEPS: [title: string, body: React.ReactNode][] = [
  ["Get the code", <>Download or clone the repository and keep the folder somewhere permanent. Chrome loads the extension from it.</>],
  ["Open the extensions page", <>Go to <code className="font-data text-[13px] text-[var(--text)]">chrome://extensions</code> and switch on <strong className="font-medium text-[var(--text)]">Developer mode</strong> in the top right corner.</>],
  ["Load it", <>Click <strong className="font-medium text-[var(--text)]">Load unpacked</strong> and choose the <code className="font-data text-[13px] text-[var(--text)]">extension</code> folder inside the repository.</>],
  ["Pin it", <>Open the puzzle piece menu in the toolbar and pin Ritro so it&apos;s one click away.</>],
];

const FIRST_MINUTE: [when: string, what: string][] = [
  ["On any page", "Click the Ritro icon and press Save this page. Or press Alt+Shift+S (Option+Shift+S on a Mac) and it saves without opening anything."],
  ["A few seconds later", "AI tags appear on the save. Open your archive to see them, add your own, or put it in a collection."],
  ["Tomorrow morning", "Your digest can bring it back, along with other things you saved and forgot."],
];

export default function ExtensionPage() {
  return (
    <ContentPage
      title="Save from the page you're reading."
      lead="The Ritro extension saves the current tab in one click, or with a keyboard shortcut without opening anything. It only runs when you click it, never on the pages you visit."
    >
      <section className="mt-16 grid gap-10 md:grid-cols-12">
        <div className="reveal md:col-span-5">
          <h2 className="font-serif text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium leading-tight tracking-[-0.02em]">
            Install it in a minute.
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-[var(--text-muted)]">
            The Chrome Web Store listing is on its way. Until then, load it straight from the open source
            code. It works in Chrome, Edge, Brave and Arc.
          </p>
          <div className="mt-6 flex items-center gap-2 rounded-full border border-[var(--border-2)] bg-[var(--surface)] py-1.5 pl-4 pr-1.5 w-fit max-w-full">
            <span className="truncate font-data text-[13px] text-[var(--text)]">git clone {GITHUB_URL}.git</span>
            <CopyButton text={`git clone ${GITHUB_URL}.git`} />
          </div>
        </div>
        <ol className="reveal space-y-px overflow-hidden rounded-2xl border border-[var(--border)] md:col-span-7">
          {STEPS.map(([title, body], i) => (
            <li key={title} className="flex gap-5 bg-[var(--surface)] p-6">
              <span className="font-serif text-3xl font-medium leading-none text-[var(--accent)]">{i + 1}</span>
              <div>
                <h3 className="text-[16px] font-medium text-[var(--text)]">{title}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-[var(--text-muted)]">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-28">
        <h2 className="reveal font-serif text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium leading-tight tracking-[-0.02em]">
          Your first minute with it.
        </h2>
        <dl className="reveal mt-10 grid gap-8 border-t border-[var(--border)] pt-8 md:grid-cols-3">
          {FIRST_MINUTE.map(([when, what]) => (
            <div key={when}>
              <dt className="font-serif text-lg italic text-[var(--accent)]">{when}</dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-[var(--text-muted)]">{what}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 text-sm text-[var(--text-muted)]">
          The extension signs in with email and password. If you joined with Google or GitHub,{" "}
          <Link href="/auth" className="text-[var(--accent)] underline underline-offset-2">set a password</Link> first
          with &quot;Forgot password?&quot;. Change the shortcut at{" "}
          <code className="font-data text-[13px]">chrome://extensions/shortcuts</code>.
        </p>
      </section>

      <section className="mt-28 grid gap-10 md:grid-cols-12">
        <div className="reveal md:col-span-5">
          <h2 className="font-serif text-[clamp(1.75rem,3.5vw,2.5rem)] font-medium leading-tight tracking-[-0.02em]">
            Not on Chrome?
          </h2>
        </div>
        <div className="reveal md:col-span-7">
          <p className="text-[16px] leading-relaxed text-[var(--text-muted)]">
            Drag this button to your bookmarks bar once. Then, on any page in any browser, click it to save
            that page to Ritro.
          </p>
          <div className="mt-5">
            <BookmarkletLink />
          </div>
        </div>
      </section>
    </ContentPage>
  );
}
