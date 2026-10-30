import { Client } from "@upstash/qstash";

// Fixed public URL, not the request's origin: QStash can't reach protected preview deployments
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://ritro.vercel.app";

export function queueTagging(bookmarkId: string) {
  return new Client().publishJSON({
    url: `${appUrl}/api/jobs/tag-bookmark`,
    body: { bookmarkId },
  });
}
