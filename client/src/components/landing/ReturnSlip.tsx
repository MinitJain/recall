"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { EXAMPLES, monthsBefore, stampDate } from "./examples";

// The hero demo: a link is saved, gets tagged, and comes back, on a loop through a few examples.
// One timer drives everything; each moment below is a point on that timeline (ms).
const TYPE_MS_PER_CHAR = 38;
const CARD_AT = 1500;
const TAG_AT = 2100;
const TAG_STEP = 280;
const SAVED_AT = 3100;
const BACK_AT = 4200;
const CYCLE = 7200;
const TICK = 80;

const DEMOS = EXAMPLES.slice(0, 3);

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia(motionQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export default function ReturnSlip({ todayIso }: { todayIso: string }) {
  // Server render and "reduce motion" both show the finished slip; animation starts after hydration
  const reduced = useSyncExternalStore(subscribeMotion, () => window.matchMedia(motionQuery).matches, () => true);
  const animate = !reduced;
  const [elapsed, setElapsed] = useState(0);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!animate) return;
    let visible = true;
    // Pause while scrolled out of view or in a background tab
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    if (ref.current) io.observe(ref.current);
    const id = setInterval(() => {
      if (visible && !document.hidden) setElapsed((prev) => prev + TICK);
    }, TICK);
    return () => {
      clearInterval(id);
      io.disconnect();
    };
  }, [animate]);

  // One counter drives the loop: which example, and how far into its timeline
  const index = Math.floor(elapsed / CYCLE) % DEMOS.length;
  const t = animate ? elapsed % CYCLE : CYCLE;

  const demo = DEMOS[index];
  const typed = animate ? demo.url.slice(0, Math.floor(t / TYPE_MS_PER_CHAR)) : demo.url;
  const typing = animate && t < demo.url.length * TYPE_MS_PER_CHAR;
  const show = (at: number) => !animate || t >= at;
  const leaving = animate && t > CYCLE - 450;

  return (
    <figure ref={ref} className="relative mx-auto w-full max-w-sm" aria-label="Example: a link being saved, tagged and brought back">
      {/* The save box the link is typed into */}
      <div className="mb-3 flex h-11 items-center gap-2 rounded-md border border-[var(--border-2)] bg-[var(--surface)] pl-3 pr-1.5 shadow-[var(--shadow-lift)]">
        <span className="min-w-0 flex-1 truncate font-data text-[12px] text-[var(--text)]">
          {typed}
          {typing && <span className="ml-px inline-block h-3.5 w-px translate-y-0.5 animate-skeleton bg-[var(--accent)]" />}
        </span>
        <span
          className={`rounded px-2.5 py-1 text-xs font-medium transition-colors duration-300 ${
            show(CARD_AT - 200) ? "bg-[var(--accent)] text-[var(--accent-text)]" : "bg-[var(--surface-2)] text-[var(--text-dim)]"
          }`}
        >
          Save
        </span>
      </div>

      <div
        className={`rounded-md border border-[var(--border-2)] bg-[var(--surface)] px-6 pb-7 pt-5 shadow-[var(--shadow-lift)] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          show(CARD_AT) && !leaving ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <div className="flex items-baseline justify-between gap-4 border-b border-[var(--border-2)] pb-3">
          <span className="font-serif text-sm italic text-[var(--text-muted)]">Ritro archive</span>
          <span className="font-data text-[11px] text-[var(--text-dim)]">No. {417 + index}</span>
        </div>

        <p className="mt-5 font-data text-xs text-[var(--text-dim)]">{demo.site}</p>
        <p className="mt-1.5 font-serif text-[1.375rem] leading-snug text-[var(--text)]">{demo.title}</p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{demo.description}</p>

        <ul className="mt-4 flex min-h-[26px] flex-wrap gap-1.5" aria-label="Tags">
          {demo.tags.map((tag, i) => (
            <li
              key={tag}
              className={`rounded-full border border-[var(--border-2)] px-2.5 py-0.5 text-xs text-[var(--text-muted)] transition-[opacity,transform] duration-300 ${
                show(TAG_AT + i * TAG_STEP) ? "scale-100 opacity-100" : "scale-75 opacity-0"
              }`}
            >
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex min-h-[26px] flex-wrap items-center gap-3">
          {show(SAVED_AT) && (
            <span key={`s${index}`} className={`date-stamp ${animate ? "animate-stamp" : ""}`} style={{ ["--stamp-tilt" as string]: "-3deg", transform: animate ? undefined : "rotate(-3deg)" }}>
              Saved {stampDate(monthsBefore(todayIso, demo.savedMonthsAgo))}
            </span>
          )}
          {show(BACK_AT) && (
            <span key={`b${index}`} className={`date-stamp ${animate ? "animate-stamp" : ""}`} style={{ ["--stamp-tilt" as string]: "2.5deg", transform: animate ? undefined : "rotate(2.5deg)" }}>
              Back {stampDate(new Date(todayIso))}
            </span>
          )}
        </div>
      </div>
      <figcaption className="mt-3 text-center text-xs text-[var(--text-dim)]">
        Example. Something you saved, back in your morning digest.
      </figcaption>
    </figure>
  );
}
