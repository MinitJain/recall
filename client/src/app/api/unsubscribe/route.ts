import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

function unsubscribeToken(email: string): string {
  return createHmac("sha256", process.env.CRON_SECRET!)
    .update(email)
    .digest("hex");
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  if (!email || !token) {
    return new NextResponse("Invalid unsubscribe link.", { status: 400 });
  }

  if (token !== unsubscribeToken(email)) {
    return new NextResponse("Invalid unsubscribe link.", { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (error) {
    return new NextResponse("Something went wrong. Please try again.", { status: 500 });
  }

  const user = data.users.find((u) => u.email === email);
  if (!user) {
    return new NextResponse("No account found for this email.", { status: 404 });
  }

  await admin.auth.admin.updateUserById(user.id, {
    user_metadata: { ...user.user_metadata, digest_opt_out: true },
  });

  return new NextResponse(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Unsubscribed — Recall</title>
  <style>
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f4f5; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { background: #fff; border-radius: 16px; padding: 48px 40px; max-width: 420px; text-align: center; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    h1 { font-size: 22px; font-weight: 700; color: #0f0f0f; margin: 0 0 10px; }
    p { font-size: 14px; color: #6b7280; line-height: 1.6; margin: 0 0 24px; }
    a { display: inline-block; background: #F0A500; color: #0f0f0f; font-weight: 700; font-size: 14px; text-decoration: none; padding: 11px 28px; border-radius: 10px; }
    .brand { font-size: 20px; font-weight: 700; color: #0f0f0f; margin-bottom: 24px; }
    .dot { color: #F0A500; }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">recall<span class="dot">.</span></div>
    <h1>You're unsubscribed.</h1>
    <p>You won't receive any more digest emails from Recall.</p>
    <a href="https://recallsave.vercel.app">Go back to Recall</a>
  </div>
</body>
</html>`,
    { status: 200, headers: { "Content-Type": "text/html" } }
  );
}
