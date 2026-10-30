import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scrapeUrl } from "@/lib/scraper";
import { getUserFromRequest } from "@/lib/supabase/get-user";
import { bookmarkRatelimit, checkRatelimit } from "@/lib/ratelimit";
import { queueTagging } from "@/lib/tag-queue";
import { isPublicHost } from "@/lib/url-validation";

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { success } = await checkRatelimit(bookmarkRatelimit, user.id);
  if (!success)
    return NextResponse.json(
      { error: "too many requests - slow down" },
      { status: 429 },
    );

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

  // The scraper fetches this URL from our server, so it must not point at internal addresses
  if (!(await isPublicHost(parsedUrl.hostname))) {
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
        userId: user.id,
      },
    });
  } catch (err) {
    console.error("Failed to create bookmark:", err);
    return NextResponse.json(
      { error: "failed to save bookmark" },
      { status: 500 },
    );
  }

  try {
    await queueTagging(bookmark.id);
  } catch (err) {
    // The daily /api/jobs/requeue-untagged cron picks this bookmark up again
    console.error("Failed to queue AI tagging (non-fatal):", err);
  }

  return NextResponse.json(bookmark, { status: 201 });
}

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 500, // safety cap — pagination should be added when needed
    include: { tags: true },
  });
  return NextResponse.json(bookmarks);
}
