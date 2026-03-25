import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { Prisma } from "@/generated/prisma";
import { tagRatelimit } from "@/lib/ratelimit";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { success } = await tagRatelimit.limit(user.id);
  if (!success)
    return NextResponse.json(
      { error: "too many requests — slow down" },
      { status: 429 },
    );

  let body: { name?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  let bookmark;
  try {
    bookmark = await prisma.bookmark.findFirst({ where: { id, userId: user.id } });
  } catch {
    return NextResponse.json({ error: "failed to fetch bookmark" }, { status: 500 });
  }
  if (!bookmark) {
    return NextResponse.json({ error: "bookmark not found" }, { status: 404 });
  }

  try {
    const tag = await prisma.tag.create({
      data: { name, bookmarkId: id },
    });
    return NextResponse.json(tag, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ error: "tag already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "failed to create tag" }, { status: 500 });
  }
}
