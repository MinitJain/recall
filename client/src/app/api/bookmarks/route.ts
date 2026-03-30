import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scrapeUrl } from "@/lib/scraper";
import { getUserFromRequest } from "@/lib/supabase/get-user";
import { bookmarkRatelimit } from "@/lib/ratelimit";
import { generateTags } from "@/lib/gemini";
import { isPrivateIp } from "@/lib/url-validation";

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { success } = await bookmarkRatelimit.limit(user.id);
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

  const blockedHosts = new Set(["localhost", "127.0.0.1", "::1", "0.0.0.0"]);
  const host = parsedUrl.hostname.toLowerCase();
  if (blockedHosts.has(host) || host.endsWith(".local") || isPrivateIp(host)) {
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

  let aiTagsFailed = false;
  try {
    const tagNames = await generateTags(metadata.title ?? null, metadata.description);
    if (tagNames.length > 0) {
      await prisma.tag.createMany({
        data: tagNames.map((name) => ({ name, bookmarkId: bookmark.id })),
        skipDuplicates: true,
      });
    }
  } catch (err) {
    console.error("AI tagging failed (non-fatal):", err);
    aiTagsFailed = true;
  }

  return NextResponse.json({ ...bookmark, aiTagsFailed }, { status: 201 });
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
