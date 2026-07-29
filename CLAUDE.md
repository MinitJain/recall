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

## UI Writing Rules

- **No em dashes (—) in user-facing text** — use a period or rewrite the sentence
- **No hyphens as punctuation in UI copy** — rewrite instead
- **No emojis in UI** unless they already exist in a specific place or the user explicitly requests one

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
| P2.7 Daily digest email (resurfacing V1) | ✅ Done |

**TODO after Chrome Web Store publish:**
- Add "Add to Chrome" button to the "Save without leaving the page" section on landing page (`src/app/page.tsx` — Extension card)

**P2.7 Daily Digest — implementation plan**
- Vercel cron job hits `/api/digest` daily
- Picks 5 oldest unvisited bookmarks per user
- Sends email via Resend (free tier: 3,000/month)
- Email: title + URL + tags for each bookmark
- Requires: `RESEND_API_KEY` in env, custom domain for sending

**Phase 3 — Advanced**

Build order agreed: P3.16 (schema) → P3.8 (Telegram) → P3.3 (resurfacing on save) → P2.7 digest update → CONTRIBUTING.md → P3.1 (pgvector).

| Task | Status |
|------|--------|
| P3.16 Generalize `Bookmark` → `Item` model (type: link/note/photo, `sourceChannel`, upload storage) | ⬜ |
| P3.1 Semantic / vector search (pgvector) | ⬜ |
| P3.2 AI-suggested collections (Gemini clusters by tags) | ⬜ |
| P3.3 Resurfacing V2 — passive match on save ("you saved something similar") | ⬜ |
| P3.4 Spaced repetition algorithm for digest | ⬜ |
| P3.5 D3.js knowledge graph (bookmarks as nodes, tags as edges) | ⬜ |
| P3.6 Background queue for async AI tagging | ⬜ |
| P3.7 Open/click tracking on digest emails | ⬜ |
| P3.8 Telegram bot — save + query bookmarks in natural language ("get me that recipe from last week") | ⬜ |
| P3.9 WhatsApp/Instagram bot — same, needs Meta Business API, build after Telegram proves the flow | ⬜ |
| P3.10 Extension resurfacing popup — flag similar past save while browsing (depends on P3.1) | ⬜ |
| P3.11 "On this day" — surface bookmarks saved N months/years ago, like Facebook Memories | ⬜ |
| P3.12 Voice note query via bot — speak the request, Gemini transcribes + searches | ⬜ |
| P3.13 Weekly recap digest — bot sends top 5 unopened saves every Sunday | ⬜ |
| P3.14 Cross-device push notification for resurfacing (not just extension popup) | ⬜ |
| P3.15 "Related to what you're reading now" sidebar widget on dashboard | ⬜ |
| P3.17 Retrieval-time follow-up — bot answers query, then flags similar saved items too | ⬜ |

**P3.16 schema generalization — notes**
- `Bookmark` model becomes generic `Item`: adds `type` (`link` / `note` / `photo`), `sourceChannel` (`web` / `extension` / `telegram` / `whatsapp`), `content` (raw text for notes), `storageUrl` (Supabase Storage path for photo uploads)
- Links of any kind (tweet, YouTube, Reddit, product page) stay on the existing scrape path — no separate model needed
- Photo uploads use Supabase Storage (free tier 1GB). Gemini tags photos directly (multimodal), same pipeline as text tagging
- v1 scope: links (any kind) + text notes + photo upload. Video upload deferred — bigger storage cost, lower use frequency
- This must land before P3.8, since the Telegram ingest path needs the generalized model to accept photos/notes, not just URLs
- **Generic channel adapter** — `sourceChannel` shouldn't be a hardcoded enum tied to Telegram/WhatsApp only. Design the ingest path so a new platform (X/Twitter DM, Discord, Signal, etc.) plugs in as just another adapter feeding the same `/api/items` endpoint, not a rebuild of the ingest logic each time

**Save-via-chat platform comparison — easiest to hardest**

| Platform | Verification needed | Notes |
|---|---|---|
| Telegram | None — just create a bot via BotFather, get a token | Build first, live in minutes, always free |
| Email forward | None — just a receiving address (inbound parsing via Resend/Postmark) | No approval, good fallback, free tier available |
| SMS (Twilio) | Business verification, lighter than Meta's | Costs per message, no real free tier |
| WhatsApp | Meta Business verification + app review | Most-wanted by users, most friction to ship |
| Slack/Teams | OAuth app review, scoped to workspace installs | Only relevant once team KB (P4.7) exists |

**When to submit the Meta app review for WhatsApp:** only after Telegram (and ideally email-forward) already prove the ingest + chatbot flow end-to-end, and only with a working privacy policy + terms of service page, a demo video of the real working flow, and a verified business entity or personal account tied to it. Submitting early with no real users or a half-built demo usually stalls or gets rejected — treat this as a Phase 4 task, not something to start in parallel with Phase 3.

**P3.8/P3.9 bot — notes**
- Telegram: official Bot API, free, single webhook endpoint. Build first.
- WhatsApp/Instagram: Meta Business API, needs approval + cost. Do after Telegram proves the flow.
- Save flow: user sends link/photo/text to bot → same ingest path as extension (`/api/items` once P3.16 lands)
- Query flow: user message → Gemini parses intent (date range, tags, keywords) → hits existing `/api/bookmarks` search → formats reply
- Auth: need to link a Telegram/WhatsApp user ID to a Recall account (one-time linking command, e.g. `/link <code>` shown in web dashboard)

**P3.3 resurfacing on save — notes**
- Triggers the moment a new item is saved (any channel), not just via digest or browsing
- v1: match on existing Gemini tags, no new infra — ships alongside P3.8
- v2: pgvector similarity (needs P3.1) once tag-matching gets too coarse at higher volume
- Digest (P2.7) gets extended to surface these matches too, not just oldest-unvisited items

**P3.10 resurfacing popup — notes**
- Cheap version: match on existing Gemini tags (no new infra)
- Better version: pgvector similarity on page content (needs P3.1 first)
- Extension checks current page against saved bookmarks on load, shows popup above a similarity threshold
- Trigger point: **browsing** — user lands on a page similar to a past save, popup fires unprompted, e.g. "hey, you saved this a while ago"
- **Popup is primary, digest (P2.7) is fallback** — when the extension is installed and active, the in-browser popup is the intended notification for browse-time matches, decided over relying on digest email for this case. Digest still runs for its own purpose (daily list of oldest-unvisited + resurfaced matches for users without the extension active), but it isn't the primary channel for "you're browsing something similar right now" — that's real-time, a popup fits, a once-daily email doesn't

**P3.17 retrieval-time follow-up — notes**
- Trigger point: **retrieving** — different from P3.3 (fires on save) and P3.10 (fires on browse)
- User asks the bot for something ("show me that tweet about X") → bot returns the answer → bot also checks similarity against the rest of the user's saves → appends a follow-up if a match clears the threshold: "here's the tweet. Btw, you also saved something similar a while back"
- Same similarity engine as P3.3/P3.10 (tags v1, pgvector v2) — this is a third surface for the same match, not new matching logic
- Only fires above a similarity threshold — don't append noise to every reply

**Resurfacing edge cases — applies to P3.3, P3.10, P3.17 (all three surfaces share one matching engine, so plan these once)**

Matching quality:
- False positives — shared tags don't mean actually related (both tagged "productivity" but unrelated). Needs a real similarity threshold, not just any tag overlap
- False negatives — genuinely related items missed because Gemini tagged them inconsistently
- Near-duplicate spam — same tweet saved twice in one session (retweet + original) shouldn't trigger "similar to a past save"
- Cross-type matching — photo of a recipe vs a recipe link. Needs an explicit rule on whether these match, not left implicit

Volume / fatigue:
- Notification fatigue — cap resurfacing popups per day, or users start ignoring them
- Many matches, not one — a save can match several old items. Decide: show top 1 or a list
- Cooldown per item — don't resurface the same old item repeatedly once already shown

Data lifecycle:
- Deleted/archived source item — don't resurface an item the user has since deleted, or a dead link
- Cold start — brand new user, nothing to match yet. All three surfaces must handle "no match" gracefully, not error
- Stale content — matched link's content may have changed since it was saved

Privacy / context:
- Team/shared collections (P4.7) — resurfacing must never leak a teammate's private save into someone else's popup
- WhatsApp/Telegram group chat vs DM — retrieval-time follow-up (P3.17) should only fire in DM, not group threads, to avoid exposing a private save to a group
- Sensitive content — consider a per-collection opt-out for resurfacing (health, job search, etc.)

Feedback / trust:
- No feedback loop today — add thumbs up/down on resurfaced items so matching can improve later
- Fail open — if the similarity check errors (API down, rate limit), the save/query/browse itself must still succeed. Same pattern as `498cf5d fix(api): fail open when the rate limiter is unreachable`

**Phase 4 — Startup / product wedge**

Biggest bet: chatbot-over-your-saves + multi-channel capture. Neither Pocket nor Raindrop does conversational retrieval across WhatsApp/Telegram/web in one place — that's the differentiator, not just another bookmark manager.

| Task | Notes |
|------|-------|
| P4.1 Chatbot over saved knowledge (RAG) | Answers questions from user's own saves, cited. Needs P3.1 (pgvector) + embeddings + LLM answer step. Bigger than search — conversational, not just retrieval |
| P4.2 Duplicate/related check before save | Bot checks "you already saved 3 things like this" at save time, not just after |
| P4.3 AI-generated weekly summary digest | Gist of what was saved this week, not just a link list — upgrade to P2.7 |
| P4.4 Unified dashboard by source channel | Show + filter items by `sourceChannel` (WhatsApp/Telegram/extension/bookmarklet/web) — depends on P3.16 |
| P4.5 Universal forward number | One phone number/bot works across WhatsApp + Telegram + SMS, same backend |
| P4.6 Mobile app w/ native share sheet | Share from any app directly into Recall |
| P4.7 Shared team knowledge base | Org-wide saves, chatbot answers from team's collective saves |
| P4.8 Slack/Teams integration | Save + retrieve without leaving work chat |
| P4.9 Monetization tiers | Free: link-only, limited AI queries/month. Paid: photo/video storage, unlimited chatbot queries, semantic search, team spaces |
| P4.10 Public API | Devs build on top — differentiator vs closed competitors |
| P4.11 Streaks / habit loop | "Resurfaced knowledge 5 days running" — retention mechanic |
| P4.12 Public curated collection profile | Share a collection publicly — content marketing / growth loop |

## Open Risks / Gaps — plan for these before/while building

- **Data migration (P3.16)** — `Bookmark → Item` isn't a fresh schema, it's a rename/restructure on a **live production app** with real user data. Needs a migration step (rename table, backfill `type: 'link'` for existing rows), not just "generalize the model"
- **Bot security (P3.8/P3.9)** — Telegram/WhatsApp webhooks are new public-facing endpoints. Need webhook signature verification and per-bot-user rate limiting, same rigor as existing API routes get
- **Legal/privacy** — a real ToS + privacy policy is needed once processing WhatsApp messages, photos, and running AI over user content — not just as a Meta app review prerequisite. Must define what's stored and how deletion/export requests are handled
- **Gemini usage monitoring** — free tier is 1,500 req/day. Multi-channel ingest + chatbot RAG queries (P4.1) can exceed that fast with even light multi-user usage. No monitoring/alerting or fallback-to-paid plan exists yet
- **Testing strategy for Phase 3/4** — nothing defined yet for the new surfaces (bot flows, resurfacing accuracy, RAG answer quality). Needs at least a manual QA checklist per new feature, same spirit as the existing Definition of Done
- **API backward compatibility** — the extension currently calls `/api/bookmarks`. Renaming to `/api/items` (P3.16) breaks the shipped Chrome extension unless the old route is kept as an alias or the extension is updated in lockstep
- **Duplicate detection across channels** — same URL saved via extension AND Telegram creates two separate rows today. Different from resurfacing "similar" items — this is exact-duplicate prevention, and multi-channel save makes it far more likely
- **Account-linking security (`/link <code>`)** — the linking code needs an expiry and single-use enforcement, otherwise a guessed/reused code could attach a stranger's Telegram/WhatsApp to someone else's account
- **Content moderation / platform liability** — once anyone can save anything from anywhere (especially with team KB, P4.7), there's no policy yet for illegal/harmful saved content
- **Data export/deletion (GDPR-style)** — no user-facing "export my data" or "delete my account and everything in it" flow exists, despite storing WhatsApp messages, photos, and AI-derived data
- **Embedding/vector cost at scale** — pgvector storage is free, but generating embeddings (Gemini) has its own per-call cost/quota, separate from the tagging quota already flagged. Two different budgets, only one tracked so far
- **Performance budget for AI paths** — the existing Performance Budgets section covers API/page load, but chatbot RAG and resurfacing similarity checks have no latency target defined

## Contributors

- Other devs join via **fork + PR** — no direct write access to this repo
- Normal dev workflow for them: clone their fork, branch, PR, CodeRabbit reviews. GUIDE.md's teaching rules (explain-everything, MERN bridge, quizzes) apply only to solo sessions with the project owner — don't apply them to contributor PRs or contributor-facing docs
- README.md's existing "Contributing" section is the source of truth for external contributors

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
