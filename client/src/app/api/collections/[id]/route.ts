import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/supabase/get-user";
import { collectionRatelimit } from "@/lib/ratelimit";
import { NextRequest } from "next/server";

// DELETE /api/collections/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUserFromRequest(req);
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });

  const { success } = await collectionRatelimit.limit(user.id);
  if (!success)
    return Response.json({ error: "too many requests - slow down" }, { status: 429 });

  const { id } = await params;

  const collection = await prisma.collection.findUnique({ where: { id } });
  if (!collection || collection.userId !== user.id) {
    return Response.json({ error: "not found" }, { status: 404 });
  }

  try {
    await prisma.collection.delete({ where: { id } });
  } catch (e: unknown) {
    if ((e as { code?: string })?.code === "P2025") {
      return new Response(null, { status: 204 }); // already deleted — idempotent
    }
    return Response.json({ error: "failed to delete collection" }, { status: 500 });
  }
  return new Response(null, { status: 204 });
}
