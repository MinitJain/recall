import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ReturnSlip from "@/components/landing/ReturnSlip";
import BookmarkletLink from "@/components/landing/BookmarkletLink";
import { SiteFooter, SiteHeader, GITHUB_URL } from "@/components/site/SiteChrome";
import SearchDemo from "@/components/landing/SearchDemo";
import SurpriseDemo from "@/components/landing/SurpriseDemo";

const EXTENSION_URL = "/extension";

const steps = [
  {
    title: "You save it.",
    body: "Paste a link on the site, click the extension, press Alt+Shift+S, or use the bookmarklet in any browser. Saving takes a second and never waits on anything else.",
  },
  {
    title: "Ritro files it.",
    body: "It reads the page's title, description and preview image, and a few seconds later AI adds tags. You can add your own, sort saves into collections, or leave it all alone.",
  },
  {
    title: "It comes back.",
    body: "Every morning, up to five things from your archive arrive in your inbox. When you have a minute, Surprise me pulls out one you have forgotten.",
  },
];

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/app");
  const todayIso = new Date().toISOString();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SiteHeader />

      <main>
        {/* Hero: the promise on the left, the mechanism (a returned save) on the right */}
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-12 sm:px-8 md:grid-cols-12 md:gap-10 md:pb-28 md:pt-20">
          <div className="min-w-0 md:col-span-7">
            <h1 className="animate-fade-up font-serif text-[clamp(2.75rem,7vw,5.25rem)] font-medium leading-[1.02] tracking-[-0.03em] text-balance">
              Save anything.
              <br />
              <em className="font-normal text-[var(--accent)]">Find everything.</em>
            </h1>
            <p className="animate-fade-up mt-7 max-w-xl text-lg leading-relaxed text-[var(--text-muted)]" style={{ animationDelay: "120ms" }}>
              Ritro is a personal archive for the links you mean to come back to. Save in a second,
              let it tag things for you, and it brings them back once you have forgotten them.
            </p>
            <div className="animate-fade-up mt-9 flex flex-wrap items-center gap-x-6 gap-y-4" style={{ animationDelay: "240ms" }}>
              <Link
                href="/auth?mode=signup"
                className="group inline-flex h-12 items-center gap-2 rounded-md bg-[var(--accent)] px-6 text-[15px] font-medium text-[var(--accent-text)] transition-colors hover:bg-[var(--accent-hover)]"
              >
                Start your archive
                <ArrowRight
                  size={16}
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
              <a
                href="#capture"
                className="text-[15px] font-medium text-[var(--text)] underline decoration-[var(--border-2)] underline-offset-4 hover:decoration-[var(--accent)]"
              >
                Add the extension
              </a>
            </div>
            <p className="mt-6 text-sm text-[var(--text-dim)]">Free and open source. No ads, no tracking cookies.</p>
          </div>
          <div className="min-w-0 md:col-span-5">
            <ReturnSlip todayIso={todayIso} />
          </div>
        </section>

        <section id="how" className="border-t border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
            <h2 className="reveal max-w-2xl font-serif text-[clamp(2rem,4vw,3rem)] font-medium leading-tight tracking-[-0.02em]">
              Most bookmarks are saved once and never opened again.
            </h2>
            <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-[var(--text-muted)]">
              Ritro is built around the part every other tool leaves out: getting things back to you.
            </p>
            <ol className="mt-14 divide-y divide-[var(--border)] border-y border-[var(--border)]">
              {steps.map((step) => (
                <li key={step.title} className="reveal grid gap-3 py-8 md:grid-cols-12 md:gap-10">
                  <h3 className="font-serif text-2xl font-medium md:col-span-4">{step.title}</h3>
                  <p className="max-w-[60ch] text-[16px] leading-relaxed text-[var(--text-muted)] md:col-span-8">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
            <div className="reveal mt-12 grid gap-6 md:grid-cols-12 md:gap-10">
              <p className="font-serif text-xl italic text-[var(--text-muted)] md:col-span-4">
                Try it on an example archive.
              </p>
              <div className="md:col-span-8">
                <SurpriseDemo todayIso={todayIso} />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[var(--surface-2)]">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 md:grid-cols-12 md:py-28">
            <div className="min-w-0 md:col-span-5">
              <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-medium leading-tight tracking-[-0.02em]">
                Find it with the words you remember.
              </h2>
              <p className="mt-5 text-[17px] leading-relaxed text-[var(--text-muted)]">
                Search looks across titles, descriptions and tags at once, so a half remembered
                phrase is usually enough. Narrow it down with a tag or a collection.
              </p>
            </div>
            <div className="reveal min-w-0 md:col-span-7">
              <SearchDemo />
              <p className="mt-3 text-center text-xs text-[var(--text-dim)]">Example archive. Type to search it.</p>
            </div>
          </div>
        </section>

        <section id="capture" className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
            <h2 className="reveal max-w-2xl font-serif text-[clamp(2rem,4vw,3rem)] font-medium leading-tight tracking-[-0.02em]">
              Save from wherever you are reading.
            </h2>
            <div className="reveal mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
              <div>
                <h3 className="font-serif text-xl font-medium">Chrome extension</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-muted)]">
                  Save the page you are on from the toolbar, or with{" "}
                  <kbd className="rounded border border-[var(--border-2)] bg-[var(--surface)] px-1.5 py-0.5 font-data text-xs text-[var(--text)]">
                    Alt+Shift+S
                  </kbd>{" "}
                  without opening anything. The Chrome Web Store listing is on its way; until then, install it
                  from GitHub.
                </p>
                <a
                  href={EXTENSION_URL}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:underline"
                >
                  Get the extension <ArrowRight size={14} aria-hidden />
                </a>
              </div>
              <div>
                <h3 className="font-serif text-xl font-medium">Bookmarklet</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-muted)]">
                  Using another browser? Drag this button to your bookmarks bar once, then click it on any
                  page to save it.
                </p>
                <div className="mt-4">
                  <BookmarkletLink />
                </div>
              </div>
              <div>
                <h3 className="font-serif text-xl font-medium">Paste a link</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-muted)]">
                  On your phone or someone else&apos;s computer, open Ritro and paste the link into the box
                  at the top. That&apos;s all it takes.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 md:grid-cols-12 md:py-28">
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-medium leading-tight tracking-[-0.02em] md:col-span-5">
              Your archive stays yours.
            </h2>
            <ul className="reveal space-y-6 text-[16px] leading-relaxed text-[var(--text-muted)] md:col-span-7">
              <li>
                <strong className="font-medium text-[var(--text)]">Open source.</strong> Every line of Ritro is
                public on{" "}
                <a href={GITHUB_URL} className="text-[var(--accent)] underline underline-offset-2">
                  GitHub
                </a>{" "}
                under the AGPL, so you can read exactly what happens to your saves.
              </li>
              <li>
                <strong className="font-medium text-[var(--text)]">Take it with you.</strong> Download
                everything as a file, or delete your account and all of it, from Settings at any time.
              </li>
              <li>
                <strong className="font-medium text-[var(--text)]">Nothing sold.</strong> No ads, no
                tracking cookies. The{" "}
                <Link href="/privacy" className="text-[var(--accent)] underline underline-offset-2">
                  privacy policy
                </Link>{" "}
                lists every service that touches your data.
              </li>
            </ul>
          </div>
        </section>

        <section className="border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="mx-auto max-w-6xl px-5 py-24 text-center sm:px-8 md:py-32">
            <p className="reveal mx-auto max-w-3xl font-serif text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-tight tracking-[-0.02em] text-balance">
              The internet gave it to you once.{" "}
              <em className="font-normal text-[var(--accent)]">Ritro gives it back.</em>
            </p>
            <Link
              href="/auth?mode=signup"
              className="mt-10 inline-flex h-12 items-center gap-2 rounded-md bg-[var(--accent)] px-6 text-[15px] font-medium text-[var(--accent-text)] transition-colors hover:bg-[var(--accent-hover)]"
            >
              Start your archive <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
