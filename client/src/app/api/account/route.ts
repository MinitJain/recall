import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/supabase/get-user";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { DELETE_CONFIRMATION } from "@/lib/account";

// GET /api/account — download everything stored for this account as JSON
export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const [bookmarks, collections] = await Promise.all([
    prisma.bookmark.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
      include: {
        tags: { select: { name: true } },
        collections: { select: { collection: { select: { name: true } } } },
      },
    }),
    prisma.collection.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
      select: { name: true, createdAt: true },
    }),
  ]);

  const data = {
    exportedAt: new Date().toISOString(),
    account: {
      email: user.email ?? null,
      createdAt: user.created_at,
      digestOptOut: user.user_metadata?.digest_opt_out === true,
    },
    collections,
    bookmarks: bookmarks.map((b) => ({
      url: b.url,
      title: b.title,
      description: b.description,
      thumbnail: b.thumbnail,
      createdAt: b.createdAt,
      tags: b.tags.map((t) => t.name),
      collections: b.collections.map((c) => c.collection.name),
    })),
  };

  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="ritro-export-${data.exportedAt.slice(0, 10)}.json"`,
      "Cache-Control": "no-store",
    },
  });
}

// DELETE /api/account — permanently delete the account and everything in it
export async function DELETE(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: { confirm?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  // Guards against an accidental or scripted call: the client must send the exact phrase
  if (body.confirm !== DELETE_CONFIRMATION) {
    return NextResponse.json({ error: "confirmation phrase does not match" }, { status: 400 });
  }

  // Data first: if the auth deletion then fails, the user can retry with nothing left behind.
  // Tags and collection links are removed by the schema's cascading deletes.
  await prisma.$transaction([
    prisma.collection.deleteMany({ where: { userId: user.id } }),
    prisma.bookmark.deleteMany({ where: { userId: user.id } }),
  ]);

  const { error } = await getSupabaseAdmin().auth.admin.deleteUser(user.id);
  if (error) {
    console.error("Account deletion: auth user removal failed:", error);
    return NextResponse.json(
      { error: "your saves were deleted, but the account could not be removed. Try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ deleted: true });
}
