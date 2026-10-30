// The hero's demonstration: one saved link, as it comes back to you, stamped like a
// library return slip. Illustrative content, labelled as an example.

function formatStamp(date: Date) {
  return date
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();
}

export default function ReturnSlip({ today }: { today: Date }) {
  const saved = new Date(today);
  saved.setMonth(saved.getMonth() - 7);

  return (
    <figure className="relative mx-auto w-full max-w-sm">
      <div className="relative rounded-md border border-[var(--border-2)] bg-[var(--surface)] px-6 pb-7 pt-5 shadow-[var(--shadow-lift)]">
        <div className="flex items-baseline justify-between gap-4 border-b border-[var(--border-2)] pb-3">
          <span className="font-serif text-sm italic text-[var(--text-muted)]">Ritro archive</span>
          <span className="font-data text-[11px] text-[var(--text-dim)]">No. 0417</span>
        </div>

        <p className="mt-5 font-data text-xs text-[var(--text-dim)]">aeon.co</p>
        <p className="mt-1.5 font-serif text-[1.375rem] leading-snug text-[var(--text)]">
          Why you should read more slowly
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
          On attention, rereading, and what a book does to you when you stop skimming.
        </p>

        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tags">
          {["reading", "attention", "essays"].map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-[var(--border-2)] px-2.5 py-0.5 text-xs text-[var(--text-muted)]"
            >
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="date-stamp" style={{ transform: "rotate(-3deg)" }}>
            Saved {formatStamp(saved)}
          </span>
          <span
            className="date-stamp animate-stamp"
            style={{ ["--stamp-tilt" as string]: "2.5deg", animationDelay: "450ms" }}
          >
            Back {formatStamp(today)}
          </span>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-xs text-[var(--text-dim)]">
        Example. Something you saved, back in your morning digest.
      </figcaption>
    </figure>
  );
}
