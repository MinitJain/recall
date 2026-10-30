# Release checklist: Ritro 0.0.1

Work through this in order. Nothing here publishes anything until the last section.

## 1. Merge the open work (in this order)

- [ ] #54 Background tagging queue
- [ ] #55 Rename to Ritro
- [ ] #60 Self-hosted fonts
- [ ] #61 Cleanup, digest fix, dependency updates (then close Dependabot #52, #56, #57, #58, #59 as superseded)
- [ ] #62 Privacy policy, terms, notices (**after legal review**, see section 4)
- [ ] #63 Account export and deletion
- [ ] #64 Extension popup only
- [ ] #65 SSRF fix, tests, CI
- [ ] Redesign PR
- [ ] #66 Extension restyle

Stacked PRs retarget to `main` automatically when their base merges. CodeRabbit only reviews PRs that target `main`, so read its comments as each one retargets.

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
- [ ] **GitHub security features (free for public repos):** turn on secret scanning with push protection, Dependabot security updates, and CodeQL default setup (Settings → Code security)
- [ ] **Google/GitHub sign-in in the extension:** needs a fixed extension ID (manifest `key`) registered as a Supabase redirect URL

## 5. Publish (only with explicit approval)

- [ ] Tag `v0.0.1` on `main` and create a GitHub release with `ritro-extension-v0.0.1.zip` (zip of `extension/`)
- [ ] Chrome Web Store: new listing with the privacy policy URL, a justification for `activeTab` and `storage`, and screenshots of the popup
