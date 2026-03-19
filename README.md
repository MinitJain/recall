# Recall

Save anything from the internet. Recall it with AI.

## How it works

![User Flow](docs/recall-user-flow.png)

![Architecture](docs/recall-architecture.svg)

![Database Schema](docs/recall-db-schema.svg)

## Features

- Paste any URL → auto-fetches title, description, and thumbnail
- AI-generated tags per bookmark (powered by Gemini)
- Manual tag add/remove
- Collections (folders) for organizing bookmarks
- Text search across saved content
- User authentication

## Tech Stack

- **Frontend + API** — Next.js 16 (App Router)
- **Styling** — Tailwind CSS
- **Database** — PostgreSQL via Supabase
- **ORM** — Prisma
- **AI Tagging** — Google Gemini API
- **Auth** — Supabase Auth
- **Deployment** — Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Gemini API key](https://aistudio.google.com/app/apikey)

### Setup

```bash
git clone https://github.com/MinitJain/recall.git
cd recall/client
npm install
```

Create a `.env.local` file inside `client/`:

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

App runs at `http://localhost:3000`

## Roadmap

Current version covers the core MVP. Planned for future phases:

**Phase 2**
- Chrome extension — floating save button on any page, popup with recent bookmarks, cross-browser sync via same account
- Bookmarklet — one-click saving that works in any browser, no extension required
- Resurfacing — surface older bookmarks with matching tags when you save something new

**Phase 3**
- Semantic / vector search (find similar bookmarks by meaning)
- D3.js knowledge graph — visualize bookmarks and tags as a graph
- Background queue workers for async AI tagging
- Page screenshot storage

## License

MIT
