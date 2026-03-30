import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/supabase/get-user";
import { NextRequest } from "next/server";

// DELETE /api/collections/[id]/bookmarks/[bookmarkId] — remove a bookmark from a collection
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; bookmarkId: string }> }
) {
  const user = await getUserFromRequest(req);
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });

  const { id: collectionId, bookmarkId } = await params;

  // Verify collection belongs to user
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
  });
  if (!collection || collection.userId !== user.id) {
    return Response.json({ error: "not found" }, { status: 404 });
  }

  try {
    await prisma.collectionBookmark.delete({
      where: { collectionId_bookmarkId: { collectionId, bookmarkId } },
    });
  } catch (e: unknown) {
    if ((e as { code?: string })?.code === "P2025") {
      return Response.json({ error: "not found" }, { status: 404 });
    }
    return Response.json({ error: "failed to remove bookmark from collection" }, { status: 500 });
  }

  return new Response(null, { status: 204 });
}
