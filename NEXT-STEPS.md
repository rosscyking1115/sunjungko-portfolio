# Phase 0 hand-off — commands to run on Windows

The sandbox completed all file-level scaffolding. Three steps still need your Windows terminal because they require local filesystem speed (npm install) or your GitHub credentials (push + branch protection).

---

## 1. Open a PowerShell window in this folder

```powershell
cd C:\Files\Jobs\sunjungko-portfolio
```

## 2. Delete the leftover Next.js placeholder SVGs

The sandbox couldn't delete these due to a Windows file-permission quirk on cross-mount writes. Two seconds in PowerShell:

```powershell
Remove-Item public\file.svg, public\globe.svg, public\next.svg, public\vercel.svg, public\window.svg -ErrorAction SilentlyContinue
```

## 3. Install dependencies

```powershell
npm install
```

Expect ~60–90 seconds. If you see warnings about peer deps, ignore them — `.npmrc` already sets `legacy-peer-deps=true` (lesson L3 from the kit).

## 4. Sanity check — Phase 0 exit gates

All three should pass:

```powershell
npm run typecheck
npm run lint
npm run build
```

If `npm run build` succeeds, Phase 0 is done.

## 5. Initialise git + push to GitHub

The sandbox's git init was rejected by the cross-mount filesystem (the `.git/objects` folder couldn't be created). Re-init cleanly from PowerShell:

```powershell
# wipe the partial sandbox-created .git folder
Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue

git init -b main
git add .
git commit -m "chore: scaffold (Phase 0)"

# create the GitHub repo — uses your existing gh CLI auth
gh repo create sunjungko-portfolio --public --source=. --remote=origin --push
```

## 6. Branch protection on `main`

GitHub → repo → **Settings** → **Branches** → **Add ruleset** (or Add rule on classic):

- **Branch name pattern:** `main`
- **Require a pull request before merging** ✓
- **Require status checks to pass before merging** — leave the list empty for now; we add exact display names in Phase 6 once CI exists. (Lesson L10: must match job `name:` field, not job ID.)

## 7. Open in your editor and confirm the scaffold renders

```powershell
npm run dev
# open http://localhost:3000
```

You should see Next.js's default placeholder. Don't worry about how it looks — Phase 1 overwrites the home page entirely with SunJung's hero.

---

## Decisions still open before Phase 1

- **LinkedIn URL** — needed for nav + footer + JSON-LD
- **Other socials** — Instagram (professional)? Behance? Read.cv? Are.na?
- **Reference portfolio websites** — 2–3 URLs of sites SunJung likes, so the Phase 1 hero/layout iterations match her taste
- **Wix domain verification** — log in with `sunjungko0914@gmail.com` and click the verify-email banner. Once unlocked we add the Vercel A/CNAME records in Phase 8.

Drop these into the next chat message and I'll start Phase 1.

---

## What's already in place (Phase 0 state)

- Next.js 16 + TypeScript strict + Tailwind v4 + React 19 + Turbopack
- Source layout under `src/app/` with `@/*` path alias to `./src/*`
- Node version pinned via `.nvmrc` (22.22.0)
- `.npmrc` with `legacy-peer-deps=true` (lesson L3)
- Geist fonts + clsx + tailwind-merge + class-variance-authority pre-listed in `package.json`
- Prettier + Tailwind plugin configured (`.prettierrc.mjs`)
- `.prettierignore` excludes `public/google*.html` (lesson L13) and `_inputs/`
- Husky pre-commit hook wired to `lint-staged` (will activate on first `npm install` via the `prepare` script)
- `.gitignore` excludes `_inputs/`, editor folders, env files, build artifacts
- CV at `public/cv.pdf` (will be linked from /about in Phase 3)
- Headshot at `public/img/headshot.jpg` and `public/img/headshot-hero.jpg` (used in Phase 1 hero)
- `.env.example` populated with the eight env vars Phase 4 needs

Original CV + headshot are kept under `_inputs/` (gitignored) for reprocessing later if needed.

---

## After Phase 0 is green, the work plan

| Phase | What we add | Time |
|---|---|---|
| 1 | Editorial home page — hero, type system, theme tokens, nav, footer, theme toggle, small-photo treatment | ~90 min |
| 2 | MDX case-study pipeline — `content/case-studies/` → /case-studies + /case-studies/[slug] with category filter | ~90 min |
| 3 | About page — bio MDX + education timeline + skills + CV download | ~60 min |
| 4 | Contact form — Resend + Turnstile + Upstash, server action with graceful degradation | ~120 min |
| 5 | Security hardening — CSP, HSTS, security.txt, Mozilla Observatory A+ | ~60 min |
| 6 | Tests — Vitest + Testing Library + Playwright + axe-core + CI matrix | ~120 min |
| 7 | SEO + structured data — sitemap, robots, JSON-LD, OG images, manifest | ~45 min |
| 8 | Analytics + custom domain — Vercel Analytics + Speed Insights + sunjungko.com | ~90 min |

Total wall time ≈ 11 hours. Realistically over 4–6 evenings.
