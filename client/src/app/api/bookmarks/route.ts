import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scrapeUrl } from "@/lib/scraper";

export async function POST(req: NextRequest) {
  let body: { url?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const { url } = body;

  if (typeof url !== "string" || !url) {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  const blockedHosts = new Set(["localhost", "127.0.0.1", "::1", "0.0.0.0"]);
  const host = parsedUrl.hostname.toLowerCase();
  if (blockedHosts.has(host) || host.endsWith(".local")) {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  const normalizedUrl = parsedUrl.href;

  const metadata = await scrapeUrl(normalizedUrl).catch(() => ({
    title: normalizedUrl,
    description: null,
    thumbnail: null,
  }));

  let bookmark;
  try {
    bookmark = await prisma.bookmark.create({
      data: {
        url: normalizedUrl,
        title: metadata.title,
        description: metadata.description,
        thumbnail: metadata.thumbnail,
      },
    });
  } catch (err) {
    console.error("Failed to create bookmark:", err);
    return NextResponse.json({ error: "failed to save bookmark" }, { status: 500 });
  }

  return NextResponse.json(bookmark, { status: 201 });
}

export async function GET() {
  const bookmarks = await prisma.bookmark.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(bookmarks);
}
