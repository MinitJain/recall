import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scrapeUrl } from "@/lib/scraper";

/**
 * Create a new bookmark from a submitted URL, scrape fallback metadata, and persist it to the database.
 *
 * Validates that `url` is present in the request body, attempts to retrieve title/description/thumbnail
 * for the URL (falling back to `title = url` with null description/thumbnail if scraping fails), and
 * stores the resulting bookmark record.
 *
 * @returns The created bookmark object on success; if `url` is missing returns an error payload with HTTP status 400.
 */
export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url) {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  const metadata = await scrapeUrl(url).catch(() => ({
    title: url,
    description: null,
    thumbnail: null,
  }));

  const bookmark = await prisma.bookmark.create({
    data: {
      url,
      title: metadata.title,
      description: metadata.description,
      thumbnail: metadata.thumbnail,
    },
  });

  return NextResponse.json(bookmark, { status: 201 });
}

/**
 * Retrieves all bookmarks ordered by creation time (newest first).
 *
 * @returns A JSON response containing an array of bookmark records ordered by `createdAt` descending.
 */
export async function GET() {
  const bookmarks = await prisma.bookmark.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(bookmarks);
}
