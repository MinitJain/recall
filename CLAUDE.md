# Recall — Claude Code Guide

Read `GUIDE.md` first — it contains the full project briefing and teaching rules for this session.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend + API | Next.js 16 (App Router) |
| Styling | Tailwind CSS |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| AI Tagging | Google Gemini API |
| Auth | Supabase Auth |
| Deployment | Vercel (planned) |

## Key Rules

- **Never push to remote** without asking first.
- **Never install or remove packages** without asking first.
- **Never delete files** without asking first.
- All `npm` commands run from `client/` — the repo root has no package.json.
- Prisma commands (`npx prisma generate`, `npx prisma db push`) also run from `client/`.

## Current Milestone

**ui-overhaul branch is in progress** (landing page + smart `/` routing — not yet merged).

Before M8 can start, two things must be done on this branch:
1. Remove debug `console.log` from `client/src/app/page.tsx` line 9
2. Fix the Supabase SSR session refresh loop — create `client/src/proxy.ts` (Next.js 16.2 uses `proxy.ts`, NOT `middleware.ts`) using the Supabase SSR proxy pattern so token refresh happens before server components run

After that: **M8: Chrome Extension**, then M9 (Vercel deployment).

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
