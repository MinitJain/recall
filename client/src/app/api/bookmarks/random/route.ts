import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/supabase/get-user";

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const count = await prisma.bookmark.count({ where: { userId: user.id } });
  if (count === 0)
    return NextResponse.json({ error: "no bookmarks" }, { status: 404 });

  const skip = Math.floor(Math.random() * count);
  const bookmark = await prisma.bookmark.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
    skip,
    include: { tags: true, collections: true },
  });

  if (!bookmark)
    return NextResponse.json({ error: "not found" }, { status: 404 });

  return NextResponse.json({
    ...bookmark,
    createdAt: bookmark.createdAt.toISOString(),
    collectionIds: bookmark.collections.map((c) => c.collectionId),
  });
}
