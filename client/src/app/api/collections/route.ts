import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/supabase/get-user";
import { NextRequest } from "next/server";

// GET /api/collections — list all collections for the user
export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });

  const collections = await prisma.collection.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  return Response.json(collections);
}

// POST /api/collections — create a new collection
export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });

  let body: { name?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) return Response.json({ error: "name is required" }, { status: 400 });
  if (name.length > 100) return Response.json({ error: "name too long" }, { status: 400 });

  let collection;
  try {
    collection = await prisma.collection.create({
      data: { name, userId: user.id },
    });
  } catch {
    return Response.json({ error: "failed to create collection" }, { status: 500 });
  }

  return Response.json(collection, { status: 201 });
}
