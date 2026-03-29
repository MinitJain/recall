<div align="center">

<img src="client/public/logo.svg" alt="Recall" width="64" height="64" />

# Recall

**Save anything. Find everything. Nothing gets lost.**

The internet moves fast. Your saves shouldn't disappear with it.

[![Live](https://img.shields.io/badge/live-recallsave.vercel.app-F0A500?style=flat-square&logo=vercel&logoColor=black)](https://recallsave.vercel.app)
[![Build](https://img.shields.io/github/actions/workflow/status/MinitJain/recall/ci.yml?style=flat-square&label=build)](https://github.com/MinitJain/recall/actions)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-brightgreen?style=flat-square)](https://github.com/MinitJain/recall/releases)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](https://github.com/MinitJain/recall/pulls)

</div>

## What is Recall?

Recall is a bookmark manager that actually works. Paste any URL — tweet, article, video, Reddit thread, product page — and Recall fetches the title, description, and preview automatically. Google Gemini tags it instantly. You search it later in plain English and find it.

No manual work. No lost tabs. No graveyard of forgotten links.

## Features

|    | Feature | Description | Status |
| -- | ------- | ----------- | ------ |
| 🔖 | **Save anything** | Any URL works. Tweet, blog post, YouTube video, image, Reddit thread, product page. | Live |
| 🤖 | **AI auto-tagging** | The moment you save, Gemini generates 3–5 relevant tags automatically. Not satisfied? You can always add or remove tags manually too. | Live |
| 🖼️ | **Rich previews** | Every bookmark shows title, description, and thumbnail fetched automatically from OG tags. | Live |
| 🧩 | **Chrome extension** | Save any tab in one click or with `Alt+Shift+S` (Windows/Linux) / `Option+Shift+S` (Mac). No copy-paste needed. | Live |
| 🔐 | **Secure auth** | Email/password + Google + GitHub via Supabase Auth. | Live |
| ⚡ | **Rate limiting** | Per-user rate limiting via Upstash Redis to keep the service stable. | Live |
| 🔍 | **Instant search** | Search by title, URL, or description. Filter by tag. Sort by newest, oldest, or A→Z. | Live |
| 📁 | **Collections** | Group bookmarks into folders manually, or let AI suggest groupings based on your saves. | Coming soon |
| ✨ | **Resurfacing** | Daily digest, random rediscovery, and "you saved this a year ago". Recall brings things back to you. | Coming soon |

## Tech Stack

| Layer | Technology |
| ----- | ---------- |
| Frontend + API | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL via Supabase |
| ORM | Prisma 7 |
| AI Tagging | Google Gemini API |
| Auth | Supabase Auth |
| Deployment | Vercel |
| Rate Limiting | Upstash Redis |
| Analytics | Vercel Analytics + Speed Insights |

## Getting Started

### Use the web app

Visit **[recallsave.vercel.app](https://recallsave.vercel.app)** — no setup required. Sign up with Google, GitHub, or email and start saving immediately.

### Run it locally

**Prerequisites**

- Node.js 20+
- A [Supabase](https://supabase.com) project (free tier works)
- A [Gemini API key](https://aistudio.google.com/app/apikey) (free)
- An [Upstash Redis](https://upstash.com) database (free tier works)

**Setup**

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
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

```bash
npx prisma generate
npx prisma db push
npm run dev
```

App runs at `http://localhost:3000`.

> All `npm` and `npx prisma` commands must be run from the `client/` directory.

## Chrome Extension

### From the Chrome Web Store

> **Coming soon.** The extension is not yet listed on the Chrome Web Store. Use the manual install below in the meantime.

### Manual Install (Load Unpacked)

No ZIP download needed. Just clone the repo and point Chrome at the `extension/` folder.

**Step 1 — Clone the repo**

```bash
git clone https://github.com/MinitJain/recall.git
```

Keep this folder somewhere permanent on your computer. Chrome needs it to stay there.

**Step 2 — Open Chrome Extensions**

In Chrome, navigate to `chrome://extensions` or go to Menu (⋮) > More tools > Extensions.

<!-- screenshot: chrome-extensions-page -->

**Step 3 — Enable Developer Mode**

Toggle **Developer mode** on in the top-right corner of the Extensions page.

<!-- screenshot: developer-mode-toggle -->

**Step 4 — Load the extension**

Click **Load unpacked** in the top-left corner.

<!-- screenshot: load-unpacked-button -->

**Step 5 — Select the extension folder**

In the file picker, navigate into the cloned repo and select the `extension/` folder. Select the folder itself, not a file inside it.

<!-- screenshot: folder-picker -->

**Step 6 — Done**

Recall will appear in your extensions list with the bookmark icon. Click the puzzle piece (🧩) in the Chrome toolbar and pin Recall to keep it visible.

<!-- screenshot: extension-pinned-toolbar -->

### Keyboard shortcut

| Shortcut | Action |
| -------- | ------ |
| `Alt+Shift+S` (Windows / Linux) | Save the current tab instantly, no popup needed |
| `Option+Shift+S` (Mac) | Save the current tab instantly, no popup needed |

> Remap it at `chrome://extensions/shortcuts`.

## How It Works

```
You find something worth saving
        ↓
Click the Recall extension icon (or press Alt+Shift+S)
        ↓
Recall sends the URL to the API at recallsave.vercel.app
        ↓
The server scrapes the page and fetches title, description, thumbnail
        ↓
Google Gemini reads the content and generates 3–5 tags
        ↓
Everything is saved to your account in the database
        ↓
Open recallsave.vercel.app/app and your bookmark is there,
tagged, previewed, and searchable
```

**The search side**

When you search, Recall looks across titles, descriptions, and tags simultaneously. You don't need to remember the exact title. Searching _"focus music productivity"_ will surface bookmarks tagged with any of those concepts.

## Architecture

![Architecture](docs/recall-architecture.svg)

![Database Schema](docs/recall-db-schema.svg)

## Roadmap

| Status | Item |
| ------ | ---- |
| ✅ | Chrome extension (save, popup, keyboard shortcut) |
| ✅ | AI auto-tagging via Gemini |
| ✅ | Vercel deployment at recallsave.vercel.app |
| ✅ | OAuth (Google + GitHub) |
| ✅ | User dashboard (web UI) |
| ✅ | Admin dashboard |
| ⬜ | Collections UI |
| ⬜ | Natural language / semantic search |
| ⬜ | Resurfacing (daily digest, random rediscovery, time capsule) |
| ⬜ | Bookmarklet (no extension required) |
| ⬜ | Chrome Web Store listing |
| ⬜ | D3.js knowledge graph |
| ⬜ | Background queue for async AI tagging |

## Contributing

PRs are welcome. Before starting anything major, open an issue first so we can align on the approach.

1. Fork the repo and create a feature branch off `main`
2. Make your changes. All source code lives in `client/`
3. Run `npx tsc --noEmit` to check for type errors
4. Open a PR. [CodeRabbit](https://coderabbit.ai) will review it automatically
5. CI runs lint, typecheck, and build on every push

Please don't open PRs that add unrelated dependencies, change the deployment config, or touch `prisma/schema.prisma` without discussing it first.

## Bug Reports

Found something broken? [Open an issue](https://github.com/MinitJain/recall/issues/new?template=bug_report.md) on GitHub.

Please include what you did, what you expected, what actually happened, and your browser + OS for extension bugs.

## Feature Requests

Have an idea? [Start a discussion](https://github.com/MinitJain/recall/discussions) or [open an issue](https://github.com/MinitJain/recall/issues/new?template=feature_request.md) with the `enhancement` label.

## License

MIT — see [LICENSE](LICENSE) for details.

## Acknowledgements

Built with [Next.js](https://nextjs.org), [Supabase](https://supabase.com), [Google Gemini](https://aistudio.google.com), [Prisma](https://prisma.io), [Vercel](https://vercel.com), [Upstash](https://upstash.com), [Tailwind CSS](https://tailwindcss.com), and [CodeRabbit](https://coderabbit.ai).

<div align="center">

**[recallsave.vercel.app](https://recallsave.vercel.app)** · Built for everyone who saves things and can never find them again.

</div>
