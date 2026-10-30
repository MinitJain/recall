import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import AccountSettings from "@/components/AccountSettings";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Settings | Ritro" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth");

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Header email={user.email ?? ""} />
      <main className="max-w-2xl mx-auto pt-8 pb-16 px-4">
        <Link
          href="/app"
          className="text-xs text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors duration-100"
        >
          ← Back to bookmarks
        </Link>
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-[var(--text)]">Settings</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Signed in as {user.email}</p>
        <AccountSettings />
      </main>
    </div>
  );
}
