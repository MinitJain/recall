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

export async function scrapeUrl(url: string) {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("scrape timeout")), 5000),
  );

  const scrape = ogs({ url }).then(({ result }) => ({
    title: result.ogTitle ?? result.dcTitle ?? url,
    description: result.ogDescription ?? null,
    thumbnail: result.ogImage?.[0]?.url ?? null,
  }));

  return Promise.race([scrape, timeout]);
}
