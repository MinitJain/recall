import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const raw = req.nextUrl.searchParams.get("q");
  const q = raw?.trim() ?? "";
  if (!q) {
    return NextResponse.json({ error: "q is required" }, { status: 400 });
  }

  let bookmarks;
  try {
    bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: user.id,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { url: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 50,
      select: {
        id: true,
        url: true,
        title: true,
        description: true,
        thumbnail: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return NextResponse.json({ error: "search failed" }, { status: 500 });
  }

  return NextResponse.json(bookmarks);
}
