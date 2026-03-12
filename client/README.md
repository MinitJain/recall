# Smart Bookmarks

An AI-powered "second brain" for saving and organizing anything from the internet — articles, tweets, videos, PDFs, and images.

## What it does

- Paste any URL → automatically fetches title, description, and thumbnail
- AI generates 3–5 tags for each saved item
- Manually add or remove tags
- Search saved items by text
- Organize bookmarks into Collections (folders)
- User authentication (sign up / sign in)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend + API | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| AI Tagging | Google Gemini API (free) |
| URL Metadata | open-graph-scraper |
| Auth | Supabase Auth |

## Project Structure

```
client/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home / dashboard
│   │   ├── auth/page.tsx     # Login / signup
│   │   └── api/              # API routes (backend logic)
│   │       ├── bookmarks/
│   │       ├── collections/
│   │       └── tags/
│   ├── components/           # Reusable UI components
│   ├── lib/                  # Utilities (Prisma, OpenAI, scraper)
│   └── types/                # TypeScript types
└── prisma/
    └── schema.prisma         # Database schema
```

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free)
- A [Google Gemini](https://aistudio.google.com) API key (free)

### Setup

1. Install dependencies:

```bash
npm install
```

2. Fill in your environment variables in the `.env` file (created automatically).

3. Push the database schema to Supabase:

```bash
npx prisma db push
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Add these to your `.env` file (never commit this file):

```env
DATABASE_URL=your_supabase_postgres_connection_string
DIRECT_URL=your_supabase_direct_connection_string
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Roadmap

- **Phase 1 (MVP):** Save URLs, view bookmarks, AI tagging, search, collections, auth
- **Phase 2:** Semantic search, PDF/image uploads, memory resurfacing
- **Phase 3:** Knowledge graph, browser extension, Python AI microservice
