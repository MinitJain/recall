<div align="center">

# Recall

**Save anything. Find everything.**

</div>

---

## The Problem

You read something valuable — an article, a thread, a tool — and you save it somewhere. A week later it's gone. Not gone from the internet, gone from your memory. You can't search for what you don't remember saving.

## How Recall Solves It

Recall gives every bookmark an AI-generated tag cloud the moment you save it. Paste a URL, get a title, description, thumbnail, and tags — automatically. Search by tag or keyword. Organize into collections. Never lose track of what you've read.

## Features

- **Instant metadata** — paste a URL, auto-fetches title, description, and thumbnail
- **AI tagging** — Gemini generates relevant tags per bookmark on save
- **Manual tags** — add or remove tags at any time
- **Collections** — group bookmarks into folders
- **Text search** — search across titles, descriptions, and tags
- **Auth** — secure accounts via Supabase Auth (email/password + magic link)

## How It Works

**User flow**

![User Flow](docs/recall-user-flow.png)

**Architecture**

![Architecture](docs/recall-architecture.svg)

**Database schema**

![Database Schema](docs/recall-db-schema.svg)

## Tech Stack

| Layer          | Technology              |
| -------------- | ----------------------- |
| Frontend + API | Next.js 16 (App Router) |
| Styling        | Tailwind CSS            |
| Database       | PostgreSQL via Supabase |
| ORM            | Prisma                  |
| AI Tagging     | Google Gemini API       |
| Auth           | Supabase Auth           |
| Deployment     | Vercel                  |

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project (free tier works)
- A [Gemini API key](https://aistudio.google.com/app/apikey) (free)

### Setup

```bash
git clone https://github.com/MinitJain/recall.git
cd recall/client
npm install
```

Create `client/.env.local`:

```env
DATABASE_URL=your_supabase_postgres_connection_string
DIRECT_URL=your_supabase_direct_connection_string
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

```bash
npx prisma generate
npx prisma db push
npm run dev
```

App runs at `http://localhost:3000`.

---

## Roadmap

**M8 — Chrome Extension**

- Floating save button on any page
- Popup with recent bookmarks
- Cross-browser sync via same account

**M9 — Deployment**

- Vercel production deploy
- Preview URLs on every PR

**Future**

- Bookmarklet (no extension required)
- Resurfacing — surface older bookmarks when you save something related
- Semantic / vector search
- D3.js knowledge graph
- Background queue workers for async AI tagging

---

## Contributing

PRs welcome. Open an issue before starting major changes.

[CodeRabbit](https://coderabbit.ai) reviews every PR automatically. CI runs lint, typecheck, and build on every push.

## License

MIT
