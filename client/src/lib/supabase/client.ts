/* client.ts — reads the cookie from the      
  browser. Used in components the user       
  interacts with (like the login form).   */

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url) throw new Error("Missing env var: NEXT_PUBLIC_SUPABASE_URL");
  if (!key) throw new Error("Missing env var: NEXT_PUBLIC_SUPABASE_ANON_KEY");
  return createBrowserClient(url, key);
}
