"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // "checking" while we validate the code, "ready" once confirmed, "invalid" if missing/expired
  const [status, setStatus] = useState<"checking" | "ready" | "invalid">("checking");

  useEffect(() => {
    // The callback route (/auth/callback) already exchanged the code and established
    // the session server-side before redirecting here. We just need to confirm a
    // valid recovery session exists — no code exchange needed on the client.
    const supabase = createClient();
    supabase.auth.getUser()
      .then(({ data, error }) => {
        setStatus(data.user && !error ? "ready" : "invalid");
      })
      .catch(() => {
        setStatus("invalid");
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message);
        return;
      }
      router.push("/app");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex flex-col items-center gap-4 group">
            <div className="inline-flex items-center justify-center w-12 h-12">
              <Image src="/logo.svg" alt="Recall" width={48} height={48} priority />
            </div>
            <h1 className="text-xl font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors duration-100">Recall</h1>
          </Link>
          <p className="text-sm text-[var(--text-muted)] mt-1">Choose a new password</p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-sm font-semibold text-[var(--text)] mb-5">Set new password</h2>

          {status === "checking" && (
            <p className="text-sm text-[var(--text-muted)] text-center py-4">Verifying your link…</p>
          )}

          {status === "invalid" && (
            <div className="flex flex-col gap-4">
              <p role="alert" className="text-xs text-[var(--error)] bg-[var(--error-bg)] rounded-lg px-3 py-2">
                This reset link is invalid or has expired. Please request a new one.
              </p>
              <Link
                href="/auth"
                className="text-center rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-text)] hover:bg-[var(--accent-hover)] transition-colors duration-100"
              >
                Back to login
              </Link>
            </div>
          )}

          {status === "ready" && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password-input" className="text-xs font-medium text-[var(--text-muted)]">
                  New password
                </label>
                <div className="relative">
                  <input
                    id="password-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 pr-9 text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors duration-100"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirm-password-input" className="text-xs font-medium text-[var(--text-muted)]">
                  Confirm new password
                </label>
                <input
                  id="confirm-password-input"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--accent)] transition-colors duration-100"
                />
              </div>

              {error && (
                <p role="alert" aria-live="polite" className="text-xs text-[var(--error)] bg-[var(--error-bg)] rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-text)] hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors duration-100 active:scale-95 mt-1"
              >
                {loading ? "Saving…" : "Set new password"}
              </button>
            </form>
          )}
        </div>

        {status !== "invalid" && (
          <div className="mt-6 text-center">
            <Link href="/auth" className="text-xs text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors duration-100">
              ← Back to login
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
