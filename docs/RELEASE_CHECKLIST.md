# Release checklist: Ritro 0.0.1

Work through this in order. Nothing here publishes anything until the last section.

## 1. Merge the open work: done

All merged on 30–31 October 2026: #54 queue, #55 rename, #60 fonts, #61 cleanup, #62 legal pages, #63 account export and deletion, #64 popup-only extension, #65 SSRF fix and tests, #66 extension restyle, #68 redesign, and dependency updates #70, #72, #73, #76 and #77. Every PR passed CI, Vercel, CodeQL and CodeRabbit before merging.

## 2. Production configuration (Vercel → Settings → Environment Variables)

Store every key, token and password as **Secret**.

- [ ] `NEXT_PUBLIC_APP_URL=https://ritro.vercel.app`
- [ ] `QSTASH_URL`, `QSTASH_TOKEN`, `QSTASH_CURRENT_SIGNING_KEY`, `QSTASH_NEXT_SIGNING_KEY` (US region)
- [ ] `CRON_SECRET` (needed by the digest and requeue crons)
- [ ] `RESEND_API_KEY`: the digest starts sending at 08:00 UTC once #61 is live. Leave it unset if you're not ready.
- [ ] Rotate credentials that were shared in plain text during setup: Supabase service role key, database password, Upstash Redis token, QStash token and signing keys
- [ ] Supabase → Auth → URL configuration: Site URL `https://ritro.vercel.app`, redirect URLs `https://ritro.vercel.app/**` and `http://localhost:3000/**`
- [ ] Supabase → Auth → Email templates: no "Recall" left in the text
- [ ] Google OAuth consent screen and GitHub OAuth app: name set to Ritro

## 3. Verify production after the merges

- [ ] `https://ritro.vercel.app` loads, `/privacy` and `/terms` load, and a bad path shows the 404
- [ ] Sign up with email, then sign in with Google and with GitHub
- [ ] Save a link: the save is instant, and tags appear after a refresh
- [ ] Settings: export downloads JSON; deleting a throwaway account works
- [ ] Vercel → Logs: the next `/api/digest` and `/api/jobs/requeue-untagged` cron runs return 200
- [ ] Load the extension unpacked: log in, save, delete, use Alt+Shift+S, and reopen it more than an hour later to check you're still signed in

## 4. Needs a human decision

- [ ] **Lawyer review** of `/privacy` and `/terms`, especially the minimum age (18), Indian governing law, and the Gemini free-tier disclosure
- [ ] **Gemini billing:** on the free tier, Google may use page titles and descriptions to improve its products. Enabling billing avoids that, and the privacy policy would need updating to match.
- [ ] **Branch protection on `main`:** require CI and one review before merging
- [x] **GitHub security features:** secret scanning with push protection, Dependabot alerts and security updates, private vulnerability reporting and CodeQL default setup are on
- [ ] **Google/GitHub sign-in in the extension:** needs a fixed extension ID (manifest `key`) registered as a Supabase redirect URL

## 5. Publish (only with explicit approval)

- [ ] Restyle the digest email and unsubscribe page to the new design (they still use the old amber look)
- [ ] Tag `v0.0.1` on `main` and create a GitHub release with `ritro-extension-v0.0.1.zip` (zip of `extension/`)
- [ ] Chrome Web Store: new listing with the privacy policy URL, a justification for `activeTab` and `storage`, and screenshots of the popup
