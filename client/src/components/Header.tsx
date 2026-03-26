"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ThemeToggle from "./ThemeToggle";

export default function Header({ email }: { email: string }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-4 h-12 border-b border-[var(--border)] backdrop-blur-md bg-[var(--bg)]/80">
      <div className="flex items-center gap-2">
        <img src="/logo.svg" width={20} height={20} alt="Recall logo" />
        <span className="text-sm font-semibold tracking-tight text-[var(--text)]">
          Recall
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs text-[var(--text-dim)] hidden sm:block mr-2">{email}</span>
        <ThemeToggle />
        <button
          onClick={handleLogout}
          className="h-8 px-3 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] rounded-md transition-all duration-100"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
