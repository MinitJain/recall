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

function isSafeThumbnailUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    const hostname = parsed.hostname;
    // Block private/internal IP ranges
    if (/^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(hostname)) return false;
    return true;
  } catch {
    return false;
  }
}

export async function scrapeUrl(url: string) {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("scrape timeout")), 5000),
  );

  const scrape = ogs({ url }).then(({ result }) => {
    const rawThumbnail = result.ogImage?.[0]?.url ?? null;
    return {
      title: result.ogTitle ?? result.dcTitle ?? url,
      description: result.ogDescription ?? null,
      thumbnail: rawThumbnail && isSafeThumbnailUrl(rawThumbnail) ? rawThumbnail : null,
    };
  });

  return Promise.race([scrape, timeout]);
}
