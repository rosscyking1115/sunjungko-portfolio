# Maintenance & Reproducibility Guide — sunjungko-portfolio

> Single-source handoff for **evelynsjko.com**. Read top-to-bottom once;
> after that use the table of contents.

## Contents

1. [What this site is](#what-this-site-is)
2. [Live URLs and accounts](#live-urls-and-accounts)
3. [Stack at a glance](#stack-at-a-glance)
4. [How the project is wired together](#how-the-project-is-wired-together)
5. [Every-day maintenance recipes](#every-day-maintenance-recipes)
6. [Environment variables](#environment-variables)
7. [Service setup playbooks](#service-setup-playbooks)
8. [The PR / deploy workflow](#the-pr--deploy-workflow)
9. [Renewal calendar](#renewal-calendar)
10. [Lessons learned](#lessons-learned)
11. [Troubleshooting cookbook](#troubleshooting-cookbook)
12. [Reproducing from scratch](#reproducing-from-scratch)
13. [Things deferred for later](#things-deferred-for-later)

---

## What this site is

Personal portfolio for **SunJung Ko (Evelyn)**, MSc Strategic Marketing & Branding at the University of Sheffield, targeting entry-level brand-strategy and market-research roles in London from October 2026.

Live at `https://evelynsjko.com`. `https://sunjungko.com` will join later as a 301 redirect target once the domain transfers out of Wix (currently locked, transfer-eligible from late May 2026).

Built in eight phases:

| Phase | What it added                                                           |
| ----- | ----------------------------------------------------------------------- |
| 0     | Next.js 16 + Tailwind v4 + Husky scaffold                               |
| 1     | Editorial home + warm oatmeal palette + cookie-based theme              |
| 2     | MDX case-study pipeline + category filter                               |
| 3     | About + education timeline + experience timeline + skills + CV download |
| 4     | Contact form (Resend + Turnstile + Upstash + sonner)                    |
| 5     | CSP, HSTS, security.txt, Permissions-Policy                             |
| 6     | Vitest + Playwright + axe-core + GitHub Actions CI                      |
| 7     | sitemap, robots, manifest, JSON-LD, OG cards                            |
| 8     | Vercel deployment + custom domain + env vars                            |

---

## Live URLs and accounts

| Resource              | URL / Where                                                             |
| --------------------- | ----------------------------------------------------------------------- |
| Production site       | https://evelynsjko.com                                                  |
| GitHub repo           | https://github.com/rosscyking1115/sunjungko-portfolio                   |
| Vercel project        | https://vercel.com → `sunjungko-portfolio`                              |
| Domain (current)      | `evelynsjko.com` — registered via Vercel, ~May 2027 renewal             |
| Domain (future)       | `sunjungko.com` — locked at Wix until ~late May 2026, then transferable |
| Resend dashboard      | https://resend.com (Sunjung's account, separate from Ross's)            |
| Cloudflare Turnstile  | https://dash.cloudflare.com → Turnstile (Sunjung's account)             |
| Upstash Redis         | https://console.upstash.com (Sunjung's account)                         |
| Google Search Console | https://search.google.com/search-console                                |

All keys live in Vercel → Settings → Environment Variables (Production-only). See [Environment variables](#environment-variables).

---

## Stack at a glance

| Layer           | Choice                                                             |
| --------------- | ------------------------------------------------------------------ |
| Framework       | Next.js 16 (App Router, Turbopack)                                 |
| Language        | TypeScript strict                                                  |
| Runtime         | React 19                                                           |
| Styling         | Tailwind CSS v4 with CSS-variable design tokens                    |
| Display font    | EB Garamond (next/font/google, self-hosted)                        |
| Body font       | Geist Sans + Geist Mono                                            |
| Theme           | Cookie-based provider with `useSyncExternalStore` (no next-themes) |
| Content         | MDX in `content/case-studies/` and `content/about.mdx`             |
| Forms           | react-hook-form + zod, server action for submission                |
| Email           | Resend (free tier — 1 verified domain)                             |
| Bot protection  | Cloudflare Turnstile                                               |
| Rate limit      | Upstash Redis sliding window 5/min/IP                              |
| Notifications   | Sonner (toast)                                                     |
| Tests           | Vitest + Testing Library + Playwright + axe-core                   |
| CI              | GitHub Actions (3 jobs + CodeQL)                                   |
| Deploy          | Vercel auto-deploy on push to `main`                               |
| Static analysis | CodeQL weekly + on PR                                              |
| Dep updates     | Dependabot grouped weekly                                          |

---

## How the project is wired together

```
src/
├─ app/
│  ├─ layout.tsx                 Root layout: theme cookie, JSON-LD, fonts, Toaster
│  ├─ page.tsx                   Home: Hero + FeaturedCaseStudies
│  ├─ globals.css                Design tokens + Tailwind directives
│  ├─ opengraph-image.tsx        Default OG card (1200×630)
│  ├─ sitemap.ts                 Auto-generated from MDX
│  ├─ robots.ts
│  ├─ manifest.ts
│  ├─ work/
│  │  ├─ page.tsx                Gallery with category filter
│  │  └─ [slug]/
│  │     ├─ page.tsx             MDX case-study renderer
│  │     ├─ opengraph-image.tsx  Per-case-study OG
│  │     └─ not-found.tsx
│  ├─ about/page.tsx             Bio + timelines + skills + CV download
│  └─ contact/
│     ├─ page.tsx
│     └─ actions.ts              Server action: validate → honeypot → rate-limit → Turnstile → Resend
│
├─ components/
│  ├─ layout/   Container, Nav, Footer, ThemeProvider, ThemeToggle
│  ├─ ui/       Button, Input, Textarea, Label
│  ├─ home/     Hero, FeaturedCaseStudies
│  ├─ work/     CaseStudyCard, CaseStudyFilter
│  ├─ about/    ExperienceTimeline, EducationTimeline, SkillsCluster, CvDownload
│  └─ contact/  ContactForm
│
├─ lib/
│  ├─ site-config.ts        Single source of truth for identity (name, role, tagline, URL, socials)
│  ├─ env.ts                Centralised env-var typing with safe defaults
│  ├─ utils.ts              cn() helper
│  ├─ case-studies.ts       MDX loader (server-only)
│  ├─ about.ts              Bio MDX loader (server-only)
│  ├─ experience.ts         Bobbi + Dongguk practicum
│  ├─ education.ts          MSc → Pre-Master → EF → Dongguk BA
│  ├─ skills.ts             Brand strategy / Research / Tools / Languages
│  ├─ contact-schema.ts     zod schema (client + server share)
│  ├─ email-template.ts     Contact-form email HTML + text
│  ├─ rate-limit.ts         Upstash factory
│  ├─ theme-cookie.ts       Browser cookie helpers
│  ├─ theme-cookie.server.ts
│  └─ json-ld.ts            Person + WebSite + ProfilePage + Article schemas
│
└─ types/case-study.ts      Frontmatter zod schema + TS types

content/
├─ about.mdx                Three-paragraph bio
└─ case-studies/
   ├─ patagonia-brand-evaluation.mdx
   └─ uk-confectionery-market-analysis.mdx

public/
├─ cv.pdf                   CV download
├─ img/headshot.jpg         About-page portrait (350×450)
├─ img/headshot-hero.jpg    Hero portrait
├─ google*.html             Search Console verification (DO NOT REFORMAT — see L13)
└─ .well-known/security.txt RFC 9116, expires 2027-05-01

tests/
├─ unit/         cn, contactSchema, renderContactEmail, theme-cookie
└─ e2e/          smoke + a11y across all pages

.github/
├─ workflows/ci.yml          3 jobs: Lint+typecheck+build, Vitest, Playwright
├─ workflows/codeql.yml      Weekly + on-PR
└─ dependabot.yml            Grouped weekly minor + monthly Actions
```

---

## Every-day maintenance recipes

### Add a new case study

1. Create `content/case-studies/<slug>.mdx`. Copy frontmatter from an existing one:
   ```mdx
   ---
   title: "Name of the work"
   slug: <slug> # kebab-case, must match filename
   summary: "One-line elevator pitch."
   category: "Brand strategy" # or "Market research" / "Digital" / "Content"
   period: "2026"
   publishedAt: "2026-08-15" # ISO date — drives sort order
   featured: true # appears on home page strip
   client: "..." # optional
   role: "..." # optional
   duration: "..." # optional
   frameworks: ["..."] # optional, becomes chips on detail page
   ---

   ## Body in MDX
   ```
2. Push (or PR + merge). The home strip, `/work` gallery, sitemap, JSON-LD, and OG image regenerate automatically.

### Update bio prose

Edit `content/about.mdx`. Push.

### Edit education / experience / skills

Edit `src/lib/education.ts`, `src/lib/experience.ts`, `src/lib/skills.ts`. Plain TypeScript arrays.

### Swap the CV

Drop a new file at `public/cv.pdf`. Push. The "Download CV" button on `/about` serves it as `SunJung-Ko-CV.pdf`.

### Change site identity (name, role, tagline, links)

Edit `src/lib/site-config.ts`. One file, every component reads from it (hero, nav, footer, JSON-LD, OG cards, metadata).

### Change colours / typography

Edit CSS variables at the top of `src/app/globals.css` (`:root` for light, `.dark` for dark). For typography, edit the font imports in `src/app/layout.tsx`.

### Add a new dependency

```powershell
npm install some-package
git add package.json package-lock.json
git commit -m "feat: add some-package for X"
git push
```

**Always commit `package.json` and `package-lock.json` together** (lesson L2). CI runs `npm ci` which fails if they're out of sync.

### Run the test suite locally

```powershell
npm test                 # unit + component (Vitest)
npm run test:coverage    # with coverage report
npm run test:e2e         # Playwright (requires npm run build first)
npm run test:e2e:ui      # Playwright UI mode (debugging)
```

### Run dev locally

```powershell
npm run dev              # http://localhost:3000
```

The contact form gracefully degrades in dev — submissions log to terminal instead of sending email.

---

## Environment variables

All set in Vercel → Project → Settings → Environment Variables, **Production only**.

| Variable                         | Purpose                                                         | Where to get it                                                                 | Sensitive? |
| -------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------- |
| `NEXT_PUBLIC_SITE_URL`           | Used by metadata, sitemap, OG images. `https://evelynsjko.com`. | hardcoded                                                                       | No         |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Renders Turnstile widget on /contact. **Public by design.**     | Cloudflare Turnstile widget settings                                            | No         |
| `TURNSTILE_SECRET_KEY`           | Server-side bot-check verification                              | Cloudflare, Secret key field                                                    | **Yes**    |
| `RESEND_API_KEY`                 | Authenticates Resend SDK calls                                  | Resend → API Keys                                                               | **Yes**    |
| `RESEND_FROM_EMAIL`              | Sender address. Must be on a verified Resend domain.            | `hello@evelynsjko.com` after domain verify, `onboarding@resend.dev` as fallback | No         |
| `RESEND_TO_EMAIL`                | Inbox that receives contact form messages                       | `sunjungko0914@gmail.com`                                                       | No         |
| `UPSTASH_REDIS_REST_URL`         | Upstash REST endpoint                                           | Upstash database overview                                                       | No         |
| `UPSTASH_REDIS_REST_TOKEN`       | Upstash REST API token                                          | Upstash database overview                                                       | **Yes**    |

### Critical rules

**`NEXT_PUBLIC_*` vars are baked into the client bundle at build time.** Adding or changing one does nothing until you redeploy. Always trigger a redeploy after touching them: Vercel → Deployments → top entry → ⋯ → Redeploy.

**Production only — never Preview.** The contact-form chain (Resend, Turnstile, Upstash) is Production-only. In Preview/Development the form falls back to console-logging the submission. Prevents burning Resend quota on PR test fills.

---

## Service setup playbooks

### Resend

1. https://resend.com → log in (or GitHub OAuth).
2. **API Keys → Create API Key** → name it `sunjungko-portfolio` → copy.
3. **Domains → Add Domain** → `evelynsjko.com` → add the DNS records Resend shows (SPF + DKIM TXT) at Vercel (Settings → Domains → DNS Records).
4. Wait until domain shows **Verified** (5–30 min).
5. Update `RESEND_FROM_EMAIL` in Vercel to `SunJung Ko Portfolio <hello@evelynsjko.com>` and redeploy.

**Free tier: 1 verified domain.** If you ever want to add another, either upgrade to Pro ($20/mo) or use a separate Resend account.

### Cloudflare Turnstile

1. https://dash.cloudflare.com → Turnstile → **Add site**.
2. Name `sunjungko-portfolio`, hostname `evelynsjko.com` + `localhost` + `sunjungko-portfolio.vercel.app`, mode **Managed**.
3. Copy **Site key** → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
4. Copy **Secret key** → `TURNSTILE_SECRET_KEY`.
5. Redeploy (mandatory — site key is `NEXT_PUBLIC_*`).

### Upstash Redis

1. https://upstash.com → Create Database → Redis → eu-west-1, TLS on.
2. Copy **REST URL** and **REST Token** from the database overview.
3. Add to Vercel as `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
4. Redeploy.

**Free tier: 1 database per account, 10k commands/day.** A contact submission is ~2 commands.

### Google Search Console

1. https://search.google.com/search-console → **Add Property** → URL prefix → `https://evelynsjko.com`.
2. Verify via HTML file: download `googleXXXXX.html`, drop into `public/`, push.
3. **Sitemaps** → enter `sitemap.xml` → Submit.
4. **URL Inspection** → paste site URL → **Request Indexing**.

The HTML verification file MUST stay byte-identical (lesson L13 — it's already in `.prettierignore`).

---

## The PR / deploy workflow

### Daily flow

```powershell
git checkout -b some-change-branch
# make edits
git add .
git commit -m "feat: thing"
git push -u origin some-change-branch
```

Open PR on GitHub. CI runs:

| Check                             | What it runs                      | Required to merge |
| --------------------------------- | --------------------------------- | ----------------- |
| `Lint, typecheck, build`          | Prettier, ESLint, tsc, next build | Yes               |
| `Vitest (unit + component)`       | 28 unit tests + coverage          | Yes               |
| `Playwright (E2E + a11y)`         | 14 E2E tests (smoke + axe)        | Yes               |
| `Analyze (javascript-typescript)` | CodeQL static analysis            | Yes               |

Branch protection (Settings → Rules → Branches) requires all four. **Use the `name:` field values verbatim** — see lesson L10.

Vercel auto-deploys main within 90 seconds.

---

## Renewal calendar

Set calendar reminders for these.

| Item                               | Renewal                                                         | Where                                |
| ---------------------------------- | --------------------------------------------------------------- | ------------------------------------ |
| `evelynsjko.com` domain            | ~May 2027 (auto-renews if card on file)                         | Vercel → Domains                     |
| `sunjungko.com` domain             | ~Feb 2027                                                       | Wix (or wherever you transfer it to) |
| `security.txt` Expires field       | 2027-05-01 — bump the file before it expires                    | `public/.well-known/security.txt`    |
| Resend API key rotation            | Optional, no expiry. Rotate annually for hygiene.               | Resend → API Keys                    |
| Cloudflare Turnstile keys          | No expiry, rotate only if leaked                                | Cloudflare → Turnstile               |
| Upstash REST token                 | No expiry, rotate only if leaked                                | Upstash database                     |
| Google Search Console verification | Permanent as long as `public/google*.html` stays byte-identical | n/a                                  |

**Sunjung's Graduate visa: valid Nov 2026 → Nov 2028** — unrelated to the site but the visa-availability line in the contact-form copy assumes 2 years from the deploy date. If she's still using this site in 2028, update the copy in `src/app/contact/page.tsx` and the bio in `content/about.mdx`.

---

## Lessons learned

These are the bugs / gotchas hit during build. Documenting so future-you doesn't re-discover.

### L1 — Never run `npm audit fix --force`

Downgrades next.js six major versions to "fix" advisories that don't exist on Next 16. Pin majors, manage advisories manually.

### L2 — Always commit `package.json` and `package-lock.json` together

CI's `npm ci` requires the lock to match. Drift = broken build until the lockfile is committed.

### L3 — `legacy-peer-deps=true` in `.npmrc`

Without it, peer-dep edges from `@vercel/analytics` and similar create vite version conflicts. Set on day one.

### L4 — Skip `next-themes` on React 19

Roll a 30-line cookie-based provider with `useSyncExternalStore` instead. Same UX, no FOUC, no hydration warnings.

### L5 — Beware `react-hooks/set-state-in-effect`

ESLint's new rule (Next 16) flags any `useEffect` whose only job is `setState`. Fix via `useSyncExternalStore` (theme) or moving the effect into the event handler that caused it (closing nav on route change).

### L6 — Server Components cannot have `onClick`

Wrap the whole card in a `<Link>` and use `relative z-10` for nested click priority instead.

### L7 — Tailwind v4 `@plugin` paths

Bare specifiers work with current Tailwind v4. The kit's old advice to use relative paths is no longer needed.

### L8 — Don't use `vite-tsconfig-paths` with Vitest

ESM-only, breaks Vitest's CJS hybrid. Wire `@/*` via explicit `resolve.alias`.

### L9 — `import "server-only"` throws in Vitest

Stub it via `tests/__mocks__/server-only.ts` (empty file) aliased in vitest.config.

### L10 — Branch-protection check names match the **display name**

Use `name:` field value (`Lint, typecheck, build`), not the job ID (`quality`).

### L11 — Every page needs exactly one `<h1>`

axe-core fails the build if a page has zero or two.

### L12 — Filter chips: use `aria-current`, not `aria-pressed`

For navigation-style filters where chips are `<Link>`, `aria-pressed` triggers axe's "button must have accessible name" rule.

### L13 — Add `public/google*.html` to `.prettierignore`

Search Console rejects the verification file if a single byte changes.

### L14 — `NEXT_PUBLIC_*` env changes require a **redeploy**

Baked into the client bundle at build time. Set the var, then Deployments → ⋯ → Redeploy.

### L15 — Coverage thresholds: be picky about `include`

Blanket `include: ["src/**"]` counts integration-heavy files and the gate flaps. List only truly unit-testable modules.

### L16 — `prepare` script + Husky in CI

`"prepare": "husky"` runs on `npm install` everywhere including CI. Either guard it (`is-ci || husky`) or accept the ~50ms cost.

### L17 — Cursor / VS Code can lock files during writes

For large rewrites, use `cat > file <<'EOF'` heredocs through bash, OR rename the locked folder out of the way (Windows allows rename even on locked folders).

### L18 — Strip stray NUL bytes from CSS

A bad terminal paste can leave a NUL at the end of `globals.css`, silently breaking Tailwind. If `npm run build` complains about CSS that looks fine, run `xxd globals.css | tail` and check for `00`.

### L19 — Contact `muted-foreground` contrast

`oklch(0.45)` over the warm background sits at AA boundary. We use `oklch(0.45 0.012 60)` and it passes; if axe ever flags it, bump to `oklch(0.40)`.

### L20 — Contact form 500 in production = missing public env var

`NEXT_PUBLIC_TURNSTILE_SITE_KEY` not baked into build. Check Vercel build logs, then redeploy.

### L21 — `next-mdx-remote` v5 has a CVE

Vercel's security check blocks deploys. Use v6+. The build itself succeeds; the deploy step fails with "Vulnerable version detected".

### L22 — Satori (next/og) requires `display: flex` on multi-child divs

Mixing HTML entities with `{variable}` creates 3 text nodes. Collapse into a template literal `{`"${var}"`}` OR add `display: "flex"` on the div.

### L23 — `opengraph-image.tsx` has limited valid exports

Only: default function, `alt`, `size`, `contentType`, optionally `generateImageMetadata` (with a specific signature). DO NOT add `generateStaticParams` — that's a page export and breaks the build with `PageNotFoundError`.

### L24 — Resend free tier = 1 verified domain

For multiple sites, options are: (a) pay $20/mo for Pro, (b) use a separate Resend account per site, (c) reuse the verified domain with a different `From` display name, (d) switch to Brevo (300/day, multi-domain free).

### L25 — Upstash free tier = 1 database per account

Either share the database between projects with different rate-limit `prefix` values, OR create separate accounts.

### L26 — Playwright on Windows + parallel workers + axe = STATUS_ACCESS_VIOLATION

Multiple parallel tests injecting axe into one `next start` instance causes worker process crashes (exit code 3221226505). Set `fullyParallel: false` and `workers: 1`. Sequential runs ~2× longer but stable.

### L27 — Heading order with case-study cards

Cards are h3 inside the home page (parent h2) but need h2 inside `/work` (parent h1). Pass `headingAs` prop to `CaseStudyCard`.

### L28 — `aria-label` collisions in tests

Footer mailto with `aria-label="Email"` collides with form's Email input under `getByLabel`. Use specific labels (`Email SunJung Ko`) and `getByRole("textbox", { name: ... })` in tests.

### L29 — Wix domain transfer lock

Newly-registered Wix domains lock for 60 days. Transfer-eligible after that, but the email verification must be completed first.

### L30 — Vercel CDN cache after deploy

Headers and OG images cache at Vercel's edge for 30–60s after a fresh deploy. Don't panic if `securityheaders.com` shows old grades for the first minute.

---

## Troubleshooting cookbook

### "Contact form 500 in production"

1. Vercel project → Logs tab → filter by Errors
2. Likely culprits:
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` set but build hasn't been redone → redeploy (L14)
   - Trailing space/newline in an env var (zod's `.email()` rejects)
   - Resend domain not yet verified → `RESEND_FROM_EMAIL=onboarding@resend.dev` as temp fallback

### "Form submits but no email arrives"

1. Vercel Function Logs for the `/contact` action
2. Resend → Logs to confirm the request reached them
3. Spam folder
4. Verify `RESEND_FROM_EMAIL` is on a domain in **Verified** status

### "Turnstile widget never appears"

1. DevTools Console for CSP or 4xx errors on `challenges.cloudflare.com`
2. `NEXT_PUBLIC_TURNSTILE_SITE_KEY` set in Vercel
3. If just-added, redeploy
4. Confirm the hostname `evelynsjko.com` is on the Turnstile site config

### "Rate limit triggers immediately on every submit"

1. Upstash Logs tab — are commands hitting?
2. URL/token correctly paired (don't swap)
3. Free tier daily 10k limit (unlikely)

### "OG card shows wrong / Next.js default"

LinkedIn's cache is the most stubborn — use https://www.linkedin.com/post-inspector to force-refresh. opengraph.xyz is the easier preview tool.

### "GitHub PR check stuck on Expected"

Required check name in branch ruleset doesn't match display name. See L10.

### "Format check fails on a file we shouldn't touch"

Add the file to `.prettierignore`. Recommit.

### "Vercel build: Vulnerable version of next-mdx-remote"

Bump to v6+ in `package.json`, run `npm install` to update lockfile, commit BOTH (L2), push.

### "Playwright `worker process exited unexpectedly`"

On Windows. Set `workers: 1` and `fullyParallel: false` in `playwright.config.ts` (L26).

### "Build fails with `PageNotFoundError` on opengraph-image"

Invalid export — see L23. Strip `generateStaticParams` and any other non-OG exports.

### "axe heading-order on /work"

Cards are h3 under page h1 — skip a level. Pass `headingAs="h2"` (L27).

---

## Reproducing from scratch

If `node_modules` blows up or you want to re-set up a dev machine:

```powershell
# Prereqs
# - Node 22+ (.nvmrc pins 22)
# - npm 10+
# - Git
# - VS Code or Cursor
# - GitHub CLI (gh)

git clone https://github.com/rosscyking1115/sunjungko-portfolio.git
cd sunjungko-portfolio
npm install
cp .env.example .env.local      # optional — for full local feature testing
npm run dev                      # http://localhost:3000
```

Production sanity check:

```powershell
npm run build
npm run start
```

Full test suite:

```powershell
npm test                                      # unit + component
npx playwright install --with-deps chromium  # one-time browser download
npm run build && npm run test:e2e             # E2E
```

Redeploy a specific commit on Vercel:

- Vercel project → Deployments → find the commit → ⋯ → **Promote to Production**.

---

## Things deferred for later

- **CSP nonces via middleware.** Currently uses `'unsafe-inline'` for script-src. Switching to nonces earns Mozilla Observatory A+ but adds ~50 lines of middleware. A grade is plenty for a portfolio.
- **Vercel Analytics + Speed Insights.** Not installed. CSP already allows the endpoints if added later.
- **Sentry / error tracking.** Vercel logs cover ~95% of debug needs.
- **Comments / blog.** MDX pipeline already in place; adding `content/blog/` would mirror `content/case-studies/`.
- **i18n.** No internationalisation. Bilingual (English + Korean) was discussed and skipped.
- **Auto-merge for Dependabot patches.** Watch a few PRs first, then enable `auto-merge: true` for patches.
- **Tests for `ContactForm` / `ThemeToggle` / `Nav`.** Integration-heavy and better-covered by Playwright.
- **CV photo on /about.** Already shipped — Sunjung's portrait at 224px. Bigger version of headshot.jpg if a higher-res original becomes available.
- **`sunjungko.com` redirect.** Pending Wix transfer eligibility (~late May 2026). Once transferred to Vercel/Cloudflare, configure as 308 redirect to `evelynsjko.com`.

---

## Quick reference — daily commands

```powershell
# Dev
npm run dev

# Add content
# (drop file in content/case-studies/, edit content/about.mdx,
#  edit src/lib/{site-config,experience,education,skills}.ts)

# Quality gates locally
npm run lint
npm run format
npm run typecheck
npm test
npm run build

# Ship
git checkout -b feature/something
git add .
git commit -m "feat: ..."
git push -u origin feature/something
# Open PR on GitHub, wait for CI green, merge.

# Update deps
# Wait for Dependabot's weekly Monday PRs. Review, merge if green.
```

---

_Built May 2026 across 8 phases. Edit this file whenever you change architecture, swap services, or learn something painful._
