import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/supabase/get-user";
import { bookmarkRatelimit } from "@/lib/ratelimit";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const user = await getUserFromRequest(req);
  if (!user)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { success } = await bookmarkRatelimit.limit(user.id);
  if (!success)
    return NextResponse.json(
      { error: "too many requests - slow down" },
      { status: 429 },
    );

  try {
    const bookmark = await prisma.bookmark.findFirst({
      where: { id, userId: user.id },
    });

    if (!bookmark) {
      return NextResponse.json(
        { error: "bookmark not found" },
        { status: 404 },
      );
    }

    await prisma.bookmark.delete({ where: { id: bookmark.id } });
  } catch (err) {
    console.error("Failed to delete bookmark:", err);
    return NextResponse.json(
      { error: "failed to delete bookmark" },
      { status: 500 },
    );
  }

  return new NextResponse(null, { status: 204 });
}
