"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard blocked (insecure context or permission): the text stays selectable on the page
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : `${label} to clipboard`}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-[var(--border-2)] bg-[var(--surface)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)]"
    >
      {copied ? <Check size={13} aria-hidden className="text-[var(--success)]" /> : <Copy size={13} aria-hidden />}
      {copied ? "Copied" : label}
    </button>
  );
}
