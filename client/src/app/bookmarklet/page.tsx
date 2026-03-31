import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import BookmarkletSaver from "./BookmarkletSaver";

export const metadata = { title: "Save to Recall" };

function Logo() {
  return (
    <div className="flex items-center gap-2 mb-6">
      <Image src="/logo.svg" alt="Recall" width={24} height={24} />
      <span className="text-sm font-semibold text-[var(--text)]">Recall</span>
    </div>
  );
}

export default async function BookmarkletPage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string }>;
}) {
  const { url } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="flex flex-col items-center text-center px-6">
          <Logo />
          <p className="text-sm font-medium text-[var(--text)] mb-1">Not logged in</p>
          <p className="text-xs text-[var(--text-muted)] mb-4">Log in to Recall first, then click the bookmarklet again.</p>
          <a
            href="/auth"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-4 py-2 rounded-lg bg-[var(--accent)] text-[var(--accent-text)] hover:opacity-90 transition-opacity"
          >
            Log in
          </a>
        </div>
      </div>
    );
  }

  // Validate URL param
  let validUrl: string | null = null;
  if (url) {
    try {
      const parsed = new URL(url);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        validUrl = url;
      }
    } catch {
      // invalid
    }
  }

  if (!validUrl) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="flex flex-col items-center text-center px-6">
          <Logo />
          <p className="text-sm font-medium text-[var(--text)] mb-1">Invalid URL</p>
          <p className="text-xs text-[var(--text-muted)]">The bookmarklet did not pass a valid URL.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
      <div className="flex flex-col items-center w-full max-w-xs">
        <Logo />
        <p className="text-xs text-[var(--text-dim)] mb-6 truncate max-w-[240px]" title={validUrl}>
          {validUrl}
        </p>
        <BookmarkletSaver url={validUrl} />
      </div>
    </div>
  );
}
