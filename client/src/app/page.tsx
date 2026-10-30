import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ReturnSlip from "@/components/landing/ReturnSlip";
import BookmarkletLink from "@/components/landing/BookmarkletLink";
import ThemeToggle from "@/components/ThemeToggle";

const GITHUB_URL = "https://github.com/ritrolabs/ritro";
// Install steps (load unpacked) until the Chrome Web Store listing exists
const EXTENSION_URL = `${GITHUB_URL}#chrome-extension`;

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

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Ritro home">
          <Image src="/logo.svg" alt="" width={22} height={22} />
          <span className="font-serif text-xl font-semibold">Ritro</span>
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
          <a
            href="#how"
            className="hidden rounded-md px-3 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] sm:block"
          >
            How it works
          </a>
          <a
            href="#capture"
            className="hidden rounded-md px-3 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] sm:block"
          >
            Extension
          </a>
          <ThemeToggle />
          <Link
            href="/auth"
            className="rounded-md px-3 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-2)]"
          >
            Log in
          </Link>
        </nav>
      </header>

      <main>
        {/* Hero: the promise on the left, the mechanism (a returned save) on the right */}
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-12 sm:px-8 md:grid-cols-12 md:gap-10 md:pb-28 md:pt-20">
          <div className="min-w-0 md:col-span-7">
            <h1 className="font-serif text-[clamp(2.75rem,7vw,5.25rem)] font-medium leading-[1.02] tracking-[-0.03em] text-balance">
              Save anything.
              <br />
              <em className="font-normal text-[var(--accent)]">Find everything.</em>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-[var(--text-muted)]">
              Ritro is a personal archive for the links you mean to come back to. Save in a second,
              let it tag things for you, and it brings them back once you have forgotten them.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
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
            <p className="mt-6 text-sm text-[var(--text-dim)]">Free and open source. No ads, no tracking.</p>
          </div>
          <div className="min-w-0 md:col-span-5">
            <ReturnSlip today={new Date()} />
          </div>
        </section>

        <section id="how" className="border-t border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
            <h2 className="max-w-2xl font-serif text-[clamp(2rem,4vw,3rem)] font-medium leading-tight tracking-[-0.02em]">
              Most bookmarks are saved once and never opened again.
            </h2>
            <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-[var(--text-muted)]">
              Ritro is built around the part every other tool leaves out: getting things back to you.
            </p>
            <ol className="mt-14 divide-y divide-[var(--border)] border-y border-[var(--border)]">
              {steps.map((step) => (
                <li key={step.title} className="grid gap-3 py-8 md:grid-cols-12 md:gap-10">
                  <h3 className="font-serif text-2xl font-medium md:col-span-4">{step.title}</h3>
                  <p className="max-w-[60ch] text-[16px] leading-relaxed text-[var(--text-muted)] md:col-span-8">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
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
            <div className="min-w-0 md:col-span-7" aria-hidden>
              <div className="rounded-md border border-[var(--border-2)] bg-[var(--surface)] p-5 shadow-[var(--shadow-lift)]">
                <div className="flex h-11 items-center rounded-md border border-[var(--border-2)] bg-[var(--bg)] px-4 text-[15px]">
                  <span className="text-[var(--text)]">focus music</span>
                  <span className="ml-0.5 h-5 w-px animate-skeleton bg-[var(--accent)]" />
                </div>
                <ul className="mt-4 divide-y divide-[var(--border)]">
                  {[
                    { site: "youtube.com", title: "Three hours of lofi for deep work", tags: ["focus", "music"] },
                    { site: "nature.com", title: "Does background music help concentration?", tags: ["research", "focus"] },
                    { site: "open.spotify.com", title: "Brian Eno, Music for Airports", tags: ["ambient", "music"] },
                  ].map((r) => (
                    <li key={r.title} className="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div className="min-w-0">
                        <p className="font-data text-[11px] text-[var(--text-dim)]">{r.site}</p>
                        <p className="mt-0.5 truncate text-[15px] text-[var(--text)]">{r.title}</p>
                      </div>
                      <div className="flex shrink-0 gap-1.5">
                        {r.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-xs text-[var(--accent)]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-3 text-center text-xs text-[var(--text-dim)]">Example search.</p>
            </div>
          </div>
        </section>

        <section id="capture" className="border-b border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
            <h2 className="max-w-2xl font-serif text-[clamp(2rem,4vw,3rem)] font-medium leading-tight tracking-[-0.02em]">
              Save from wherever you are reading.
            </h2>
            <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
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
            <ul className="space-y-6 text-[16px] leading-relaxed text-[var(--text-muted)] md:col-span-7">
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
            <p className="mx-auto max-w-3xl font-serif text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-tight tracking-[-0.02em] text-balance">
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

      <footer className="border-t border-[var(--border)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-[var(--text-dim)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            <span className="font-serif font-semibold text-[var(--text)]">Ritro</span>
            <span className="mx-2" aria-hidden>
              ·
            </span>
            © 2026 Minit Jain. Code licensed under AGPL-3.0.
          </p>
          <nav aria-label="Footer" className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-[var(--text)]">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[var(--text)]">
              Terms
            </Link>
            <a href={GITHUB_URL} className="hover:text-[var(--text)]">
              GitHub
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
