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
| P2.3 Collections (folders) | ⬜ Schema exists, no UI/endpoints |
| P2.4 AI auto-tagging via Gemini | ✅ Done |
| P2.5 Text search UI improvements | ✅ Done |
| P2.6 Bookmarklet | ⬜ Not started |

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
