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

**M7 (Auth) is complete.** Next milestone is **M8: Chrome Extension**.

After M8 comes M9 (Vercel deployment + preview URLs on PRs).

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
