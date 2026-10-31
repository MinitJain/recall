// Illustrative saves for the landing page demos. Shown with an "Example" label; not real user data.
export type ExampleSave = {
  site: string;
  url: string;
  title: string;
  description: string;
  tags: string[];
  savedMonthsAgo: number;
};

export const EXAMPLES: ExampleSave[] = [
  {
    site: "aeon.co",
    url: "aeon.co/essays/read-slowly",
    title: "Why you should read more slowly",
    description: "On attention, rereading, and what a book does to you when you stop skimming.",
    tags: ["reading", "attention", "essays"],
    savedMonthsAgo: 7,
  },
  {
    site: "seriouseats.com",
    url: "seriouseats.com/the-best-focaccia",
    title: "The easiest focaccia you will ever bake",
    description: "No kneading, an overnight rise, and a lot of olive oil.",
    tags: ["recipes", "baking", "bread"],
    savedMonthsAgo: 14,
  },
  {
    site: "youtube.com",
    url: "youtube.com/watch?v=lofi-deep-work",
    title: "Three hours of lofi for deep work",
    description: "A long, quiet mix for writing and studying without lyrics in the way.",
    tags: ["focus", "music"],
    savedMonthsAgo: 3,
  },
  {
    site: "nature.com",
    url: "nature.com/articles/music-and-focus",
    title: "Does background music help concentration?",
    description: "What studies say about music, memory and getting work done.",
    tags: ["research", "focus", "music"],
    savedMonthsAgo: 9,
  },
  {
    site: "open.spotify.com",
    url: "open.spotify.com/album/music-for-airports",
    title: "Brian Eno, Music for Airports",
    description: "The ambient album that started it all.",
    tags: ["ambient", "music"],
    savedMonthsAgo: 20,
  },
  {
    site: "paulgraham.com",
    url: "paulgraham.com/greatwork.html",
    title: "How to Do Great Work",
    description: "Curiosity, delight and the desire to do something impressive.",
    tags: ["careers", "essays", "productivity"],
    savedMonthsAgo: 11,
  },
  {
    site: "x.com",
    url: "x.com/thread/designing-calm-software",
    title: "A thread on designing calm software",
    description: "Notifications, defaults, and leaving people alone.",
    tags: ["design", "productivity"],
    savedMonthsAgo: 5,
  },
  {
    site: "nytimes.com",
    url: "nytimes.com/cooking/weeknight-dal",
    title: "A weeknight dal that tastes like a weekend",
    description: "Red lentils, tempered spices and twenty five minutes.",
    tags: ["recipes", "dinner"],
    savedMonthsAgo: 2,
  },
];

export function stampDate(date: Date) {
  return date
    .toLocaleDateString("en-GB", { timeZone: "UTC", day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();
}

export function monthsBefore(iso: string, months: number) {
  const d = new Date(iso);
  const day = d.getUTCDate();
  // Step via the 1st, then clamp: 30 April minus 2 months is 28 February, not 2 March
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() - months);
  const lastDay = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
  d.setUTCDate(Math.min(day, lastDay));
  return d;
}
