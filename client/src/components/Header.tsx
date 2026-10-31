"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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
    <header className="sticky top-0 z-10 h-14 border-b border-[var(--border)] backdrop-blur-md bg-[var(--bg)]/75">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2">
        <Image src="/logo.svg" width={20} height={20} alt="Ritro logo" />
        <span className="font-serif text-lg font-semibold text-[var(--text)]">
          Ritro
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs text-[var(--text-dim)] hidden sm:block mr-2">{email}</span>
        <ThemeToggle />
        <Link
          href="/app/settings"
          className="h-8 px-3 inline-flex items-center text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] rounded-md transition-all duration-100"
        >
          Settings
        </Link>
        <button
          onClick={handleLogout}
          className="h-8 px-3 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] rounded-md transition-all duration-100"
        >
          Log out
        </button>
      </div>
      </div>
    </header>
  );
}
