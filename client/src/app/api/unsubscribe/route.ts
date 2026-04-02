import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { unsubscribeToken } from "@/lib/unsubscribe-token";

const STYLES = `
  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f4f5; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
  .card { background: #fff; border-radius: 16px; padding: 48px 40px; max-width: 420px; text-align: center; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
  h1 { font-size: 22px; font-weight: 700; color: #0f0f0f; margin: 0 0 10px; }
  p { font-size: 14px; color: #6b7280; line-height: 1.6; margin: 0 0 24px; }
  button, a { display: inline-block; background: #F0A500; color: #0f0f0f; font-weight: 700; font-size: 14px; text-decoration: none; padding: 11px 28px; border-radius: 10px; border: none; cursor: pointer; }
  .brand { font-size: 20px; font-weight: 700; color: #0f0f0f; margin-bottom: 24px; }
  .dot { color: #F0A500; }
`;

function html(body: string): NextResponse {
  return new NextResponse(`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><style>${STYLES}</style></head><body>${body}</body></html>`, {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}

function verifyToken(email: string, token: string): boolean {
  const expected = unsubscribeToken(email);
  const expectedBuf = Buffer.from(expected);
  const providedBuf = Buffer.from(token);
  return (
    expectedBuf.length === providedBuf.length &&
    timingSafeEqual(expectedBuf, providedBuf)
  );
}

// GET — show confirmation page (read-only, safe for email prefetch)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  if (!email || !token || !verifyToken(email, token)) {
    return new NextResponse("Invalid unsubscribe link.", { status: 400 });
  }

  return html(`
    <div class="card">
      <div class="brand">recall<span class="dot">.</span></div>
      <h1>Unsubscribe from digest?</h1>
      <p>You won't receive any more daily digest emails from Recall.</p>
      <form method="POST">
        <input type="hidden" name="email" value="${email}" />
        <input type="hidden" name="token" value="${token}" />
        <button type="submit">Yes, unsubscribe me</button>
      </form>
    </div>
  `);
}

// POST — perform the actual opt-out mutation
export async function POST(req: NextRequest) {
  const body = await req.formData();
  const email = body.get("email") as string | null;
  const token = body.get("token") as string | null;

  if (!email || !token || !verifyToken(email, token)) {
    return new NextResponse("Invalid unsubscribe link.", { status: 400 });
  }

  const admin = getSupabaseAdmin();
  let foundUser = null;
  let page = 1;
  const perPage = 1000;
  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) {
      return new NextResponse("Something went wrong. Please try again.", { status: 500 });
    }
    foundUser = data.users.find((u) => u.email === email) ?? null;
    if (foundUser || data.users.length < perPage) break;
    page++;
  }

  if (!foundUser) {
    return new NextResponse("No account found for this email.", { status: 404 });
  }

  const { error: updateError } = await admin.auth.admin.updateUserById(foundUser.id, {
    user_metadata: { ...foundUser.user_metadata, digest_opt_out: true },
  });

  if (updateError) {
    return new NextResponse("Something went wrong. Please try again.", { status: 500 });
  }

  return html(`
    <div class="card">
      <div class="brand">recall<span class="dot">.</span></div>
      <h1>You're unsubscribed.</h1>
      <p>You won't receive any more digest emails from Recall.</p>
      <a href="https://recallsave.vercel.app">Go back to Recall</a>
    </div>
  `);
}
