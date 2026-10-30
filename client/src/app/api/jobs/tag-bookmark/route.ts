import { NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { prisma } from "@/lib/prisma";
import { generateTags } from "@/lib/gemini";

// QStash calls this after a bookmark is saved. Throwing returns 500, so QStash retries.
async function handler(req: Request) {
  const { bookmarkId } = await req.json();

  const bookmark = await prisma.bookmark.findUnique({
    where: { id: bookmarkId },
    include: { _count: { select: { tags: true } } },
  });
  // Deleted before the job ran: nothing to tag, and a retry won't change that
  if (!bookmark) return NextResponse.json({ skipped: true });
  // Already tagged by an earlier delivery of this job: don't pay for Gemini twice
  if (bookmark._count.tags > 0) return NextResponse.json({ skipped: true });

  const tagNames = await generateTags(bookmark.title, bookmark.description);
  if (tagNames.length > 0) {
    await prisma.tag.createMany({
      data: tagNames.map((name) => ({ name, bookmarkId })),
      skipDuplicates: true,
    });
  }

  return NextResponse.json({ tags: tagNames.length });
}

// Wrapped per request: building the verifier at import reads the signing keys,
// which breaks `next build` wherever they aren't set (CI, preview builds)
export const POST = (req: Request) => verifySignatureAppRouter(handler)(req);
