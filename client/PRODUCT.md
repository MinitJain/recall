# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Heavy savers: people who save lots of links (articles, tweets and threads, videos, recipes, product pages) across devices for personal use, and never find them again. They save in the moment, often mid-task, and come back later with only a vague memory of what they saved. Not teams (a shared knowledge base is a later idea, not current scope).

## Product Purpose

Ritro saves anything with a URL, tags it automatically with AI, and brings it back to the user instead of letting it rot. Success is a user rediscovering and actually using something they saved, not just accumulating saves.

## Positioning

**It brings your saves back.** Resurfacing is the core promise: a daily digest email of things you forgot, "Surprise me" random rediscovery, and (planned) "you saved something similar" moments. AI tagging and search exist to support finding and resurfacing; they are not the headline.

## Operating Context

- Capture happens in the browser: the website's paste-a-URL box, the Chrome extension popup (and Alt+Shift+S shortcut), and a bookmarklet for any browser.
- Retrieval happens on the dashboard (search across titles, descriptions and tags; tag filters; collections; sort; list and grid views) and through the daily digest email.
- Settings: data export and account deletion.

## Capabilities and Constraints

- Next.js 16 App Router, Tailwind CSS v4, deployed on Vercel at ritro.vercel.app; Supabase auth (email/password, Google, GitHub) and Postgres; Gemini for tags; QStash queue so saving is instant and tags arrive seconds later.
- Tags are not present in the save response; the UI must handle "tags arrive later".
- The browser extension is popup-only (no on-page UI); email/password sign-in only.
- Free, non-commercial personal project run by one person (Minit Jain, India). No pricing, plans or paid tiers exist.
- UI copy rules (from the project guide): no em dashes in user-facing text, no hyphens as punctuation in UI copy, no emojis unless already present.

## Brand Commitments

- Name: Ritro (renamed from Recall, October 2026).
- Tagline: "Save anything. Find everything." must be kept.
- Light and dark themes: a dark mode toggle must remain alongside the default theme.
- The current bookmark logo mark and everything else visual are not binding.

## Evidence on Hand

- No real testimonials, user counts, press or case studies exist. Do not fabricate any.
- No current product screenshots (old ones were removed); real UI must be shown by building it, not by mockups claiming usage.
- Open source under AGPL-3.0 at github.com/ritrolabs/ritro: a true, usable trust point.

## Product Principles

1. Rediscovery over accumulation: every surface should push toward using what was saved.
2. Saving must feel instant and effortless; nothing blocks the save.
3. Honest and calm: no fake social proof, no dark patterns, no urgency tricks.
4. Personal and private by default: the user's saves are theirs; export and deletion are self-serve.

## Accessibility & Inclusion

No product-specific requirement established beyond WCAG 2.2 AA as the working baseline (contrast, keyboard navigation, visible focus, reduced motion).
