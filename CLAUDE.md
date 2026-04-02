# Recall — Claude Code Guide

Read `GUIDE.md` first — it contains the full project briefing and teaching rules for this session.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend + API | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL via Supabase |
| ORM | Prisma 7 |
| AI Tagging | Google Gemini API |
| Auth | Supabase Auth |
| Deployment | Vercel — live at **recallsave.vercel.app** |
| Rate Limiting | Upstash Redis |
| Analytics | Vercel Analytics + Speed Insights |

## Key Rules

- **Never push to remote** without asking first.
- **Never install or remove packages** without asking first.
- **Never delete files** without asking first.
- All `npm` commands run from `client/` — the repo root has no package.json.
- Prisma commands (`npx prisma generate`, `npx prisma db push`) also run from `client/`.
- **Never write more than 30–50 lines of code without stopping to explain** what was written and why, before continuing.

## Current State

**Phase 1 is complete. Project is live.**

- M8 (Chrome Extension) — ✅ Done
- M9 (Vercel deployment) — ✅ Done at [recallsave.vercel.app](https://recallsave.vercel.app)
- `proxy.ts` SSR session fix — ✅ Done
- Landing page + smart `/` routing — ✅ Done

**Next up: Phase 2**

| Task | Status |
|------|--------|
| P2.1 User dashboard (web UI) | ✅ Done |
| P2.2 Admin dashboard | ✅ Done |
| P2.3 Collections (folders) | ✅ Done |
| P2.4 AI auto-tagging via Gemini | ✅ Done |
| P2.5 Text search UI improvements | ✅ Done |
| P2.6 Bookmarklet | ✅ Done |
| P2.7 Daily digest email (resurfacing V1) | ⬜ Not started |

**TODO after Chrome Web Store publish:**
- Add "Add to Chrome" button to the "Save without leaving the page" section on landing page (`src/app/page.tsx` — Extension card)

**P2.7 Daily Digest — implementation plan**
- Vercel cron job hits `/api/digest` daily
- Picks 5 oldest unvisited bookmarks per user
- Sends email via Resend (free tier: 3,000/month)
- Email: title + URL + tags for each bookmark
- Requires: `RESEND_API_KEY` in env, custom domain for sending

**Phase 3 — Advanced**

| Task | Status |
|------|--------|
| P3.1 Semantic / vector search (pgvector) | ⬜ |
| P3.2 AI-suggested collections (Gemini clusters by tags) | ⬜ |
| P3.3 Resurfacing V2 — "you saved this about X, you're saving X again" | ⬜ |
| P3.4 Spaced repetition algorithm for digest | ⬜ |
| P3.5 D3.js knowledge graph (bookmarks as nodes, tags as edges) | ⬜ |
| P3.6 Background queue for async AI tagging | ⬜ |
| P3.7 Open/click tracking on digest emails | ⬜ |

## Project Structure

```
recall/
├── client/          # Next.js app (all source code lives here)
│   ├── app/         # App Router pages and API routes
│   ├── components/  # React components
│   ├── lib/         # Supabase client, Prisma client, utilities
│   └── prisma/      # schema.prisma
├── docs/            # Architecture diagrams
└── .github/         # CI workflow, PR template, Dependabot
```
