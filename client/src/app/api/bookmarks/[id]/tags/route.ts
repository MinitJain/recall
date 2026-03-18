import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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
  if (name.length > 50) {
    return NextResponse.json({ error: "tag name too long" }, { status: 400 });
  }

  try {
    const bookmark = await prisma.bookmark.findUnique({ where: { id } });
    if (!bookmark) {
      return NextResponse.json({ error: "bookmark not found" }, { status: 404 });
    }

    const existing = await prisma.tag.findFirst({
      where: { bookmarkId: id, name },
    });
    if (existing) {
      return NextResponse.json({ error: "tag already exists" }, { status: 409 });
    }

    const tag = await prisma.tag.create({
      data: { name, bookmarkId: id },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch {
    return NextResponse.json({ error: "failed to create tag" }, { status: 500 });
  }
}
