import { Client } from "@upstash/qstash";

// Fixed public URL, not the request's origin: QStash can't reach protected preview deployments
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://ritro.vercel.app";
const workerUrl = `${appUrl}/api/jobs/tag-bookmark`;

export function queueTagging(bookmarkId: string) {
  return new Client().publishJSON({ url: workerUrl, body: { bookmarkId } });
}

// One QStash request for many jobs instead of one request per bookmark
export function queueTaggingBatch(bookmarkIds: string[]) {
  return new Client().batchJSON(
    bookmarkIds.map((bookmarkId) => ({ url: workerUrl, body: { bookmarkId } })),
  );
}
