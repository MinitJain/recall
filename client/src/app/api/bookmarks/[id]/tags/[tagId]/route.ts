import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; tagId: string }> }
) {
  const { id, tagId } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const tag = await prisma.tag.findFirst({
      where: { id: tagId, bookmarkId: id, bookmark: { userId: user.id } },
    });
    if (!tag) {
      return NextResponse.json({ error: "tag not found" }, { status: 404 });
    }

    await prisma.tag.delete({ where: { id: tagId } });
  } catch {
    return NextResponse.json({ error: "failed to delete tag" }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
