import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; tagId: string }> }
) {
  const { id, tagId } = await params;

  const tag = await prisma.tag.findFirst({
    where: { id: tagId, bookmarkId: id },
  });
  if (!tag) {
    return NextResponse.json({ error: "tag not found" }, { status: 404 });
  }

  await prisma.tag.delete({ where: { id: tagId } });

  return new NextResponse(null, { status: 204 });
}
