import { createHmac } from "crypto";

export function unsubscribeToken(email: string): string {
  const secret = process.env.CRON_SECRET;
  if (!secret) throw new Error("CRON_SECRET environment variable is not set");
  return createHmac("sha256", secret).update(email).digest("hex");
}
