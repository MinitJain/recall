import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/supabase/get-user";
import { NextRequest } from "next/server";

// POST /api/collections/[id]/bookmarks — add a bookmark to a collection
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUserFromRequest(req);
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });

  const { id: collectionId } = await params;

  // Verify collection belongs to user
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
  });
  if (!collection || collection.userId !== user.id) {
    return Response.json({ error: "not found" }, { status: 404 });
  }

  let body: { bookmarkId?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }

  const bookmarkId =
    typeof body.bookmarkId === "string" ? body.bookmarkId.trim() : "";
  if (!bookmarkId) {
    return Response.json({ error: "bookmarkId is required" }, { status: 400 });
  }

  // Verify bookmark belongs to user
  const bookmark = await prisma.bookmark.findUnique({
    where: { id: bookmarkId },
  });
  if (!bookmark || bookmark.userId !== user.id) {
    return Response.json({ error: "bookmark not found" }, { status: 404 });
  }

  // Upsert to avoid duplicate errors
  await prisma.collectionBookmark.upsert({
    where: { collectionId_bookmarkId: { collectionId, bookmarkId } },
    create: { collectionId, bookmarkId },
    update: {},
  });

  return new Response(null, { status: 204 });
}
