"use client";

import { useState } from "react";
import { Shuffle } from "lucide-react";
import { EXAMPLES, monthsBefore, stampDate } from "./examples";

// Lets visitors try "Surprise me" on the example archive: each click brings back a different save
export default function SurpriseDemo({ todayIso }: { todayIso: string }) {
  const [pick, setPick] = useState<number | null>(null);
  const [draws, setDraws] = useState(0);

  function draw() {
    let next = Math.floor(Math.random() * EXAMPLES.length);
    if (next === pick) next = (next + 1) % EXAMPLES.length;
    setPick(next);
    setDraws((d) => d + 1);
  }

  const save = pick === null ? null : EXAMPLES[pick];

  return (
    <div className="flex flex-col items-start gap-5">
      <button
        type="button"
        onClick={draw}
        className="group inline-flex h-11 items-center gap-2 rounded-md border border-[var(--border-2)] bg-[var(--surface)] px-4 text-sm font-medium text-[var(--text)] shadow-[var(--shadow-lift)] transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-[var(--surface-2)] active:translate-y-0"
      >
        <Shuffle size={15} aria-hidden className="text-[var(--accent)] transition-transform duration-300 group-hover:rotate-12" />
        {save ? "Surprise me again" : "Try Surprise me"}
      </button>

      <div aria-live="polite" className="w-full">
        {save && (
          <article
            key={draws}
            className="animate-fade-up w-full rounded-md border border-[var(--border-2)] bg-[var(--surface)] p-5 shadow-[var(--shadow-lift)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-data text-xs text-[var(--text-dim)]">{save.site}</p>
              <span className="date-stamp animate-stamp" style={{ ["--stamp-tilt" as string]: "-3deg" }}>
                Back {stampDate(new Date(todayIso))}
              </span>
            </div>
            <p className="mt-2 font-serif text-xl leading-snug text-[var(--text)]">{save.title}</p>
            <p className="mt-1.5 text-sm text-[var(--text-muted)]">
              You saved this {save.savedMonthsAgo} months ago, on {monthsBefore(todayIso, save.savedMonthsAgo).toLocaleDateString("en-GB", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" })}.
            </p>
          </article>
        )}
      </div>
    </div>
  );
}
