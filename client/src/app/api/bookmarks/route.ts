import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scrapeUrl } from "@/lib/scraper";

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

export async function GET() {
  const bookmarks = await prisma.bookmark.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(bookmarks);
}
