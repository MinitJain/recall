# Changelog

All notable changes to Ritro. Versions follow [Semantic Versioning](https://semver.org).

## [0.0.1] - Unreleased

First release under the Ritro name. The product was previously called Recall.

### Added

- **Background AI tagging.** Saving returns immediately; tags arrive a few seconds later through an Upstash QStash queue, with retries and a daily job that re-queues saves whose tag job never went out (#54).
- **Account settings.** Download all your data as JSON, or delete your account and everything in it (#63).
- **Privacy policy and terms of service** at `/privacy` and `/terms`, linked from the footer and sign-in page (#62).
- **Third-party notices** for bundled fonts and notable dependency licences (#62).
- **Unit tests** with Vitest, now run in CI (#65).

### Changed

- **Renamed from Recall to Ritro** everywhere, including the domain (`ritro.vercel.app`) and repository (`ritrolabs/ritro`) (#55).
- **Light editorial redesign** of the website (#68): paper and ink palette with one violet accent, Source Serif 4 headings, a date stamp on every save, and new landing, empty, error and 404 pages. Dark mode kept.
- **Extension is popup only.** The bar it used to inject into every website is gone, along with its content script and `localhost` permissions. Sessions now refresh automatically instead of expiring after about an hour, and logging out ends the session on the server too (#64). The popup matches the new design (#66).
- Fonts are self-hosted instead of fetched from Google at build time (#60).
- Dependencies updated: Prisma 7.10, Gemini SDK 2.x, React 19.3 (#61); Next.js 16.4, Supabase SSR 0.12 and others (#77); Vitest 5 (#76).

### Fixed

- The daily digest never ran, because Vercel Cron calls with `GET` and the handler only accepted `POST` (#61).
- Builds failed intermittently on Turbopack while fetching Google Fonts (#60).
- **Security:** the save URL check could be bypassed with bracketed IPv6, IPv4-mapped IPv6, hostnames that resolve to private addresses, and redirects. Every redirect hop is now checked, and the connection itself refuses private IPs (SSRF) (#65).

### Removed

- Unused search component and its `/api/bookmarks/search` endpoint, template SVGs and old screenshots (#61, #55).
- Landing page claims for features that don't exist yet (semantic "search by feeling", AI-suggested collections).
