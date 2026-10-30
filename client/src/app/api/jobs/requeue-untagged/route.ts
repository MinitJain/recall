import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { queueTagging } from "@/lib/tag-queue";

// Daily safety net: re-queue bookmarks whose tag job never reached QStash.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("Authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const now = Date.now();
  const untagged = await prisma.bookmark.findMany({
    where: {
      tags: { none: {} },
      // Last 2 days only, so a page Gemini can never tag is retried twice, not forever.
      // Skip the newest 10 minutes: their first job may still be running.
      createdAt: {
        gte: new Date(now - 2 * 24 * 60 * 60 * 1000),
        lte: new Date(now - 10 * 60 * 1000),
      },
    },
    select: { id: true },
  });

  const results = await Promise.allSettled(untagged.map((b) => queueTagging(b.id)));
  const failed = results.filter((r) => r.status === "rejected").length;
  return NextResponse.json({ queued: untagged.length - failed, failed });
}
