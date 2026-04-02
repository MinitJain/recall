import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

function unsubscribeToken(email: string): string {
  return createHmac("sha256", process.env.CRON_SECRET!)
    .update(email)
    .digest("hex");
}

type BookmarkWithTags = {
  url: string;
  title: string | null;
  description: string | null;
  tags: Array<{ name: string }>;
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function buildBookmarkCard(bookmark: BookmarkWithTags, isLast: boolean): string {
  const hostname = safeHostname(bookmark.url);
  const initial = hostname.charAt(0).toUpperCase();
  const title = bookmark.title ? escapeHtml(bookmark.title) : escapeHtml(hostname);
  const description = bookmark.description
    ? escapeHtml(
        bookmark.description.length > 120
          ? bookmark.description.slice(0, 120) + "…"
          : bookmark.description
      )
    : "";

  const tagsHtml =
    bookmark.tags.length > 0
      ? `<div style="margin-top:10px;">${bookmark.tags
          .map(
            (t) =>
              `<span style="display:inline-block;font-size:11px;font-weight:500;color:#6d28d9;background:#ede9fe;border-radius:20px;padding:3px 10px;margin-right:5px;margin-bottom:4px;">${escapeHtml(t.name)}</span>`
          )
          .join("")}</div>`
      : "";

  return `
    <div style="padding:20px 0;${isLast ? "" : "border-bottom:1px solid #f0f0f0;"}">
      <div style="margin-bottom:8px;">
        <span style="display:inline-block;width:28px;height:28px;background:#ede9fe;color:#6d28d9;font-size:12px;font-weight:700;border-radius:7px;text-align:center;line-height:28px;margin-right:8px;vertical-align:middle;">${initial}</span>
        <span style="font-size:12px;color:#9ca3af;vertical-align:middle;">${escapeHtml(hostname)}</span>
      </div>
      <a href="${escapeHtml(bookmark.url)}" style="font-size:15px;font-weight:600;color:#111827;text-decoration:none;line-height:1.4;display:block;">${title}</a>
      ${description ? `<p style="font-size:13px;color:#6b7280;margin:6px 0 0;line-height:1.6;">${description}</p>` : ""}
      ${tagsHtml}
    </div>`;
}

function buildDigestHtml(bookmarks: BookmarkWithTags[], email: string): string {
  const unsubscribeUrl = `https://recallsave.vercel.app/api/unsubscribe?token=${unsubscribeToken(email)}&email=${encodeURIComponent(email)}`;
  const cards = bookmarks
    .map((b, i) => buildBookmarkCard(b, i === bookmarks.length - 1))
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Your Recall digest</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

        <!-- HEADER -->
        <tr><td style="background:#0f0f0f;border-radius:16px 16px 0 0;padding:28px 32px;text-align:center;">
          <div style="font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
            recall<span style="color:#F0A500;">.</span>
          </div>
          <div style="font-size:11px;color:#666;margin-top:6px;letter-spacing:1.5px;text-transform:uppercase;">
            Your daily digest
          </div>
        </td></tr>

        <!-- BODY -->
        <tr><td style="background:#ffffff;padding:32px 32px 24px;">
          <p style="font-size:20px;font-weight:700;color:#0f0f0f;margin:0 0 6px;letter-spacing:-0.3px;">Hey &#x1F44B;</p>
          <p style="font-size:14px;color:#6b7280;margin:0 0 28px;line-height:1.6;">
            Here are ${bookmarks.length} things you saved. Worth another look.
          </p>

          <!-- BOOKMARKS -->
          ${cards}

          <!-- CTA -->
          <div style="text-align:center;margin-top:32px;">
            <a href="https://recallsave.vercel.app/app" style="display:inline-block;background:#F0A500;color:#0f0f0f;font-size:14px;font-weight:700;text-decoration:none;padding:13px 32px;border-radius:10px;letter-spacing:0.1px;">
              Open Recall &rarr;
            </a>
          </div>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#0f0f0f;border-radius:0 0 16px 16px;padding:24px 32px;text-align:center;">
          <div style="font-size:15px;font-weight:700;color:#ffffff;margin-bottom:8px;letter-spacing:-0.3px;">
            recall<span style="color:#F0A500;">.</span>
          </div>
          <p style="font-size:12px;color:#555;margin:0;line-height:1.7;">
            You&#39;re receiving this because you use
            <a href="https://recallsave.vercel.app" style="color:#F0A500;text-decoration:none;">Recall</a>.<br />
            The internet gave it to you once. Recall gives it back.<br /><br />
            <a href="${unsubscribeUrl}" style="color:#555;text-decoration:underline;font-size:11px;">Unsubscribe</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  const allUsers = [];
  let page = 1;
  const perPage = 1000;
  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) {
      console.error("Digest: failed to list users:", error);
      return NextResponse.json({ error: "failed to fetch users" }, { status: 500 });
    }
    allUsers.push(...data.users);
    if (data.users.length < perPage) break;
    page++;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  let sent = 0;
  let skipped = 0;
  let errors = 0;

  for (const user of allUsers) {
    if (!user.email) {
      skipped++;
      continue;
    }

    if (user.user_metadata?.digest_opt_out === true) {
      skipped++;
      continue;
    }

    const count = await prisma.bookmark.count({ where: { userId: user.id } });
    if (count === 0) {
      skipped++;
      continue;
    }

    const take = Math.min(5, count);
    const skip = count <= 5 ? 0 : Math.floor(Math.random() * (count - take));
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: user.id },
      skip,
      take,
      include: { tags: true },
    });

    try {
      await resend.emails.send({
        from: "Recall <onboarding@resend.dev>",
        to: user.email,
        subject: "Good morning. Here's your Recall digest.",
        html: buildDigestHtml(bookmarks, user.email),
      });
      sent++;
    } catch (err) {
      console.error(`Digest: failed to send to ${user.email}:`, err);
      errors++;
    }
  }

  return NextResponse.json({ sent, skipped, errors });
}
