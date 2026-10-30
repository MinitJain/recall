// Why this file exists:
// The API route's job is to handle
// HTTP — receive request, save to DB,
//  return response. Scraping is a
// separate concern. Keeping it in its
//  own file means if scraping breaks
// or you want to swap the library,
// you only touch one place. This is
// called separation of concerns.

import ogs from "open-graph-scraper";
import { isPublicHost, isSafeUrl } from "@/lib/url-validation";
import { publicOnlyAgent, safeFetch } from "@/lib/safe-fetch";

const MAX_REDIRECTS = 5;

// A readable fallback title without the query string, which can carry tokens or personal data
export function titleFromUrl(url: string) {
  const { hostname, pathname } = new URL(url);
  return hostname + (pathname === "/" ? "" : pathname);
}

// Follows redirects one hop at a time, checking each destination is public before
// fetching it, so a public link can't bounce the server to an internal address.
async function resolvePublicUrl(url: string, signal: AbortSignal): Promise<string> {
  let current = url;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    // Each hop gets 4s, and the whole scrape's deadline cancels whatever hop is in flight
    const res = await safeFetch(current, {
      redirect: "manual",
      signal: AbortSignal.any([signal, AbortSignal.timeout(4000)]),
    });
    await res.body?.cancel();
    const location = res.headers.get("location");
    if (res.status < 300 || res.status >= 400 || !location) return current;

    const next = new URL(location, current);
    if (next.protocol !== "http:" && next.protocol !== "https:") throw new Error("unsafe redirect");
    if (!(await isPublicHost(next.hostname))) throw new Error("redirect to a private address");
    current = next.href;
  }
  throw new Error("too many redirects");
}

export async function scrapeUrl(url: string) {
  // One deadline for the whole scrape: when it fires, every request still running is aborted
  const signal = AbortSignal.timeout(8000);
  const finalUrl = await resolvePublicUrl(url, signal);
  // The final URL was checked above; any further redirect would skip that check
  const { result } = await ogs({
    url: finalUrl,
    fetchOptions: { redirect: "error", dispatcher: publicOnlyAgent, signal },
  });
  const rawThumbnail = result.ogImage?.[0]?.url ?? null;
  return {
    title: result.ogTitle ?? result.dcTitle ?? titleFromUrl(url),
    description: result.ogDescription ?? null,
    thumbnail: rawThumbnail && isSafeUrl(rawThumbnail) ? rawThumbnail : null,
  };
}
