import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { queueTaggingBatch } from "@/lib/tag-queue";

const MAX_PER_RUN = 100;

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
    // Oldest first, so bookmarks about to leave the window go before newer ones
    orderBy: { createdAt: "asc" },
    // shortcut: a backlog above this waits for the next daily run; raise it or paginate if that happens
    take: MAX_PER_RUN,
  });

  if (untagged.length === 0) return NextResponse.json({ queued: 0, failed: 0 });

  const results = await queueTaggingBatch(untagged.map((b) => b.id));
  // QStash can reject single messages in a batch; those come back without a messageId
  const failed = results.filter((r) => !(r as { messageId?: string }).messageId).length;
  if (failed > 0) console.error(`Requeue: ${failed} of ${untagged.length} tag jobs were not queued`);
  return NextResponse.json({ queued: untagged.length - failed, failed });
}
