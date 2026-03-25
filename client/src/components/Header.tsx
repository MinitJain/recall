"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Header({ email }: { email: string }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between mb-8">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Recall
      </h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-zinc-500 hidden sm:block">{email}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
