import { createClient } from "@supabase/supabase-js";

// Service role client — bypasses RLS, server-only, never use in browser or client components
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
