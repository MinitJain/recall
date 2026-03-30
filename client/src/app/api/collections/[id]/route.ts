import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/supabase/get-user";
import { NextRequest } from "next/server";

// DELETE /api/collections/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUserFromRequest(req);
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;

  const collection = await prisma.collection.findUnique({ where: { id } });
  if (!collection || collection.userId !== user.id) {
    return Response.json({ error: "not found" }, { status: 404 });
  }

  try {
    await prisma.collection.delete({ where: { id } });
  } catch {
    return Response.json({ error: "failed to delete collection" }, { status: 500 });
  }
  return new Response(null, { status: 204 });
}
