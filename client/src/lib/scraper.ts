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
import { isSafeUrl } from "@/lib/url-validation";

// Many sites (X/Twitter, LinkedIn, Reddit, Cloudflare-fronted sites, news
// paywalls) block requests with no User-Agent or an unrecognized one. A
// realistic desktop-browser UA and Accept headers get treated as a normal
// page view instead of a bot, without pretending to be a specific browser
// version that goes stale.
const SCRAPE_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

export async function scrapeUrl(url: string) {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("scrape timeout")), 5000),
  );

  const scrape = ogs({ url, fetchOptions: { headers: SCRAPE_HEADERS } }).then(({ result }) => {
    const rawThumbnail = result.ogImage?.[0]?.url ?? null;
    return {
      title: result.ogTitle ?? result.dcTitle ?? url,
      description: result.ogDescription ?? null,
      thumbnail: rawThumbnail && isSafeUrl(rawThumbnail) ? rawThumbnail : null,
    };
  });

  return Promise.race([scrape, timeout]);
}
