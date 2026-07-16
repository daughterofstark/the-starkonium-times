# THE STARKONIUM TIMES — Implementation Plan

**Document:** `STARKONIUM_IMPLEMENTATION_PLAN.md`
**Status:** `rev. 1 — 2026-07-13`
**Companion document:** `STARKONIUM_WEBSITE_DESIGN_SPEC.md` (the master design vision)
**Purpose:** an execution-ready, phased build plan. A coding agent should be able to execute one phase at a time, in order, without inventing architecture.

> **Precedence rule.** Where this document and the design spec disagree, **this document wins**. It contains 17 deliberate refinements to the design spec (§0.3). Everything not refined here is inherited from the design spec unchanged.

---

## Table of contents

- [0. Preamble: naming, refinements, and how to use this document](#0-preamble)
- [Phase 0 — Repository bootstrap and invariants](#phase-0--repository-bootstrap-and-invariants)
- [Phase 1 — Design tokens and global shell](#phase-1--design-tokens-and-global-shell)
- [Phase 2 — Content collections and schemas](#phase-2--content-collections-and-schemas)
- [Phase 3 — Core reusable components](#phase-3--core-reusable-components)
- [Phase 4 — Homepage](#phase-4--homepage)
- [Phase 5 — Projects](#phase-5--projects)
- [Phase 6 — Writing and long-form reading](#phase-6--writing-and-long-form-reading)
- [Phase 7 — Paper reviews](#phase-7--paper-reviews)
- [Phase 8 — Experience, About and Now](#phase-8--experience-about-and-now)
- [Phase 9 — Volume I (the Blogger-era archive)](#phase-9--volume-i-the-blogger-era-archive)
- [Phase 10 — Search, RSS, SEO and metadata](#phase-10--search-rss-seo-and-metadata)
- [Phase 11 — Quality hardening](#phase-11--quality-hardening)
- [Phase 12 — Documentation and GitHub preparation](#phase-12--documentation-and-github-preparation)
- [Phase 13 — Deployment preview](#phase-13--deployment-preview)
- [Phase 14 — Final repository audit and ZIP packaging](#phase-14--final-repository-audit-and-zip-packaging)
- [Git strategy](#git-strategy)
- [Repository structure](#repository-structure)
- [Coding-agent workflow](#coding-agent-workflow)
- [Appendix A — Complete command reference](#appendix-a--complete-command-reference)
- [Appendix B — Phase dependency graph](#appendix-b--phase-dependency-graph)
- [Appendix C — Test matrix](#appendix-c--test-matrix)
- [Appendix D — Content authoring examples](#appendix-d--content-authoring-examples)
- [Appendix E — Definition of done](#appendix-e--definition-of-done)
- [Appendix F — Deferred features](#appendix-f--deferred-features)
- [Appendix G — Live-domain cutover plan (informational, not executed)](#appendix-g--live-domain-cutover-plan-informational-not-executed)

---

<a id="0-preamble"></a>
## 0. Preamble

### 0.1 The naming system — canonical, and used everywhere

This is the single naming system. Every string in the codebase, every doc, every meta tag uses it. No synonyms, no drift.

| Concept | Canonical string | Where it appears |
|---|---|---|
| **The publication / the website (the whole thing, all eras)** | **The Starkonium Times** | `<title>` suffix, RSS channel title, JSON-LD `name`, README, footer, OG images, colophon |
| **Compact wordmark / masthead** | **STARKONIUM** | Site header, favicon, mobile header, OG corner mark |
| **Domain** | `starkonium.com` | Canonicals, sitemap, `site` in `astro.config.mjs` |
| **The Blogger-era content (2021–2023)** | **Volume I** | Archive route, labels, chips, headings, prose |
| **Everything published on the new site** | **Volume II** | Used only where a contrast with Volume I is needed; otherwise unmarked (it is simply *The Starkonium Times*) |

**Chosen historical descriptor: `Volume I`.** The other candidates (*Original Archive*, *Blogger Era*, *legacy posts*) are **not used in any user-facing string**. `Volume I` is chosen because:

- It says "earlier", not "worse". A journal's Volume I is not inferior to its Volume II.
- It is a publication word, consistent with the masthead framing.
- It is short enough to be a chip: `VOLUME I`.

**Forbidden phrasings** (a CI grep enforces these — see Phase 11):

- ❌ "The Starkonium Times archive" (implies the name belongs only to the old site)
- ❌ "the old blog", "legacy", "the previous site", "Blogger era" *in user-facing copy* (the term `blogger-era` may appear in code identifiers and migration tooling only)
- ❌ "Starkonium" alone as the publication name in prose. STARKONIUM is a wordmark, not a name. Prose says "The Starkonium Times."

**In-code identifiers.** The `volume` field enum is `one | two` (not `times | current`, which was the design spec's value and is now superseded). Volume I renders as the chip `VOLUME I`; Volume II renders as nothing.

**Copy for the record (used in `/archive` and the colophon):**

> The Starkonium Times has been published since April 2021. Volume I (2021–2023) was written on Blogger. It has been imported here whole — same dates, same words, nothing edited. Volume II begins with the site you are reading.

### 0.2 What is being built

A static Astro website: personal site, project archive, research portfolio, extended CV, biology writing platform, paper-review archive, and public research notebook. Content is Markdown/MDX in Git. No database, no CMS, no server.

**The build must never touch** the live Blogger site or `starkonium.com` DNS. All work happens in a fresh repository and deploys to a preview domain. Cutover is Appendix G — documented, not executed.

### 0.3 The 17 refinements to the design spec

These override the design spec. Each is stated as an instruction, with its consequence.

| # | Refinement | Consequence in this plan |
|---|---|---|
| **R1** | Remove the superscript revision number from the primary wordmark. | The `Wordmark` component has **no `marker` prop**. It renders `STARKONIUM`, full stop. Design-spec OD-1 is closed: no numeral, no dagger. The site revision still exists as data and is shown as a text line in the footer and colophon (`rev. 7 — colophon`), never attached to the wordmark. |
| **R2** | Keep the wordmark primarily typographic. | Confirmed and unchanged. Type only. No mark, no tile, no icon. The favicon is a Fraunces `S` on cream. |
| **R3** | Preserve cream / orange / black. | Confirmed. Palette structure unchanged (Phase 1). |
| **R4** | Use **orange**, not vermilion/red. | The accent hue moves from `#E3510F` (vermilion, reads red-orange) to a **true orange**: `--orange: #F0760F` graphic / `--orange-ink: #A44E05` text. Token names change from `--vermilion*` to `--orange*` throughout. The two-token split (graphic vs. text) is **retained** — it is the mechanism that keeps the accent accessible on cream, and it survives the hue change. |
| **R5** | Maximum three loaded font families. | **Switzer is dropped.** The three loaded families are **Fraunces** (display), **Newsreader** (long-form body), **IBM Plex Mono** (all data, labels, navigation, UI). The interface-sans role is absorbed by IBM Plex Mono (uppercase, tracked, small) — which *strengthens* the lab-notebook identity rather than compromising it. A non-loaded `system-ui` stack is the fallback for any incidental sans. |
| **R6** | The Ledger remains the primary signature component. | Confirmed. Phase 3 builds it before any page uses it; Phase 4 puts it above the fold on the homepage. |
| **R7** | Project pages detailed, most sections optional. | Confirmed and tightened: the project schema has **6 required fields**; every body section is optional. A project with only required fields must render as a complete, dignified page (Phase 5 fixture `minimal-project`). |
| **R8** | Stable internal IDs, not visually prominent. | IDs (`PRJ-014`, `WRT-031`, `REV-008`, `EXP-003`) remain in frontmatter, remain unique and immutable, and are used for citation, OG images, ledger keys and BibTeX. They are **removed from page headers**. They appear only: in the citation block, in the BibTeX, in the OG image corner, and in `<meta>`. The "shelfmark" component (design spec M1) is **demoted** to a single small `updated 2026-07-09` line; the ID is not shown. |
| **R9** | Updates need no individual permalink pages in v1. | Updates become an **embedded array inside project frontmatter** (`updates: [...]`), not a separate collection with routes. `/log/[date]-[slug]` is **not built**. The Ledger links each update row to `/projects/[slug]#updates`. This removes ~14 routes, a collection, and the whole permalink surface, at the cost of nothing a v1 reader needs. |
| **R10** | One editorial project-list view in v1. | `/projects` ships the **Notes (editorial) view only**. No view toggle. |
| **R11** | Defer the dense sortable table. | The `IndexTable` component is **not built**. Deferred to Appendix F. |
| **R12** | V1 filters: status and field only. | The filter rail has exactly two facets. No method/tool/year facets in v1. `/writing` gets **kind** filtering only (its equivalent of "status"), plus nothing else. |
| **R13** | JS is progressive enhancement, not forbidden. | The rule becomes: **every page must be fully usable with JS off**, and JS may be added freely above that floor within the performance budget. Filters, search, TOC highlighting, reading progress and the mobile menu all use JS and all degrade. The "≤2KB on article pages" budget is relaxed to **≤8KB** (see Phase 11 budgets). |
| **R14** | No generic card grids, but bordered/grouped surfaces are allowed. | The blanket "no cards" ban is lifted. **What remains banned: uniform grids of equal-size tiles with image + title + blurb + "Read more".** Bordered, grouped surfaces (record blocks, callouts, the review assessment panel, the figure frame) are permitted and encouraged where grouping is *semantic*. The test is: *does the border enclose a thing that is genuinely one thing?* |
| **R15** | Do not manufacture updates to populate the Ledger. | The v1 content bar drops from "≥12 backfilled updates" to "**as many real updates as genuinely exist**". The Ledger must handle a sparse state gracefully (Phase 4 defines the fallbacks). A thin, honest Ledger is acceptable; a fabricated one is a failure. |
| **R16** | Launch may have 3 detailed projects + several shorter entries. | V1 content bar: **3 fully detailed projects + 2–4 short project entries** (title, thesis, status, dates, topics, maybe a repo — nothing more). Short entries are not second-class; they use the same template with sections omitted. |
| **R17** | Full Blogger migration not needed before the local prototype, but required before DNS cutover. | Migration (Phase 9) is **decoupled**: Phases 0–8 and 10–14 can complete with 2–3 sample Volume I posts as fixtures. The **full 14-post import and redirect manifest is a hard gate on cutover** (Appendix G), not on the ZIP deliverable. Phase 9 delivers the tooling, the manifest format, the `/archive` page, and a verified import of all 14 — but if the export file is unavailable when Phase 9 runs, the phase may ship with fixtures and a `MIGRATION_STATUS: incomplete` flag recorded in `RELEASE_MANIFEST.md`. |

### 0.4 Ground rules for the coding agent

1. **Do not invent architecture.** If this document does not specify something, check the design spec. If neither specifies it, choose the *simplest* option that satisfies the acceptance criteria, and record the choice in `docs/adr/`.
2. **Do not skip ahead.** One phase per branch. Do not implement Phase 6 components while doing Phase 3.
3. **Do not claim success without output.** Every phase report must include actual, pasted command output.
4. **Do not add dependencies not listed in this document** without recording an ADR and justifying it.
5. **Do not commit generated artefacts.** `dist/`, `.astro/`, `node_modules/`, `coverage/`, `pagefind/` are all ignored.
6. **Never touch the live site.** No DNS, no Blogger settings, no `starkonium.com` records. The Blogger export file is read-only input.

---

## Phase 0 — Repository bootstrap and invariants

**Branch:** `phase-0-bootstrap`
**Depends on:** nothing
**Delivers:** a repository that installs, lints, typechecks, tests and builds from a clean checkout — with zero pages in it.

### 0.1 Decisions

| Decision | Choice | Justification |
|---|---|---|
| **Repository name** | `the-starkonium-times` | Matches the publication name. Kebab-case, unambiguous, GitHub-friendly. |
| **Package manager** | **npm** | Mainstream, zero-install-friction, ships with Node, no corepack step, no agent confusion. pnpm's disk savings are irrelevant for a one-person static site. `package-lock.json` is committed. |
| **Node version** | **22.x LTS** (minimum `22.11.0`) | Current LTS through 2027. Pinned in `.nvmrc` and `package.json:engines`. Astro 5 requires ≥18.20; 22 is the safe, current floor. |
| **Framework** | **Astro 5**, `output: 'static'` | Per design spec §16. No SSR, no adapters, no middleware — the site must remain host-portable. |
| **Language** | TypeScript, `strict: true` | Astro's `strictest` tsconfig preset. |
| **UI framework** | **None.** Vanilla TS islands. | Four small islands (filters, search, TOC, menu). A framework would add 40KB+ to solve nothing. |
| **Styling** | Vanilla CSS, custom properties, `@layer` | No Tailwind. A prose-heavy document site with a bespoke type system is exactly where Tailwind's value inverts. |
| **Test runner** | **Vitest** | Native TS/ESM, fast, zero config with Astro. Used for schema tests, util tests, and content invariants. |
| **Integration/a11y tests** | **Playwright** + `@axe-core/playwright` | Runs against the production build (`npm run preview`). |
| **Linting** | **ESLint 9** (flat config) + `eslint-plugin-astro` + `eslint-plugin-jsx-a11y` (for Astro templates) | |
| **Formatting** | **Prettier** + `prettier-plugin-astro` | Checked in CI, not auto-fixed in CI. |
| **Licence** | **Dual.** Code: **MIT** (`LICENSE`). Content: **CC BY 4.0** (`LICENSE-CONTENT`). | The repo is public; the code should be reusable and the writing should be citable. Stated in README and the footer. |
| **Environment variables** | **None in v1.** | There are no secrets. `PUBLIC_SITE_URL` is the *only* permitted env var, and it has a committed default in `astro.config.mjs`. **No `.env` file is ever committed.** `.env*` is in `.gitignore`. If a future phase needs a secret, it is an ADR, not a quick fix. |

### 0.2 Exact bootstrap commands

Run in an empty directory:

```bash
# 1. Scaffold
npm create astro@latest the-starkonium-times -- \
  --template minimal \
  --typescript strict \
  --no-install \
  --no-git \
  --skip-houston

cd the-starkonium-times

# 2. Pin Node
node -v            # must print v22.x
echo "22" > .nvmrc

# 3. Core dependencies
npm install
npm install @astrojs/mdx @astrojs/sitemap @astrojs/rss

# 4. Content pipeline
npm install -D remark-math rehype-katex katex remark-smartypants

# 5. Tooling
npm install -D typescript @types/node
npm install -D eslint @eslint/js typescript-eslint eslint-plugin-astro eslint-plugin-jsx-a11y globals
npm install -D prettier prettier-plugin-astro
npm install -D vitest
npm install -D @playwright/test @axe-core/playwright
npx playwright install --with-deps chromium

# 6. Build-time extras (used from Phase 10)
npm install -D pagefind
npm install -D satori @resvg/resvg-js

# 7. Packaging + validation utilities (used from Phase 11/14)
npm install -D linkinator archiver

# 8. Fonts (self-hosted; see Phase 1)
npm install -D @fontsource-variable/fraunces @fontsource-variable/newsreader @fontsource/ibm-plex-mono

# 9. Git
git init -b main
git add -A
git commit -m "chore: bootstrap Astro 5 + TypeScript + tooling"
```

> **Note for the agent:** if `npm create astro` prompts interactively despite the flags, accept the *minimal* template and *strict* TypeScript, and decline git init and dependency install. Then continue from step 2.

### 0.3 `package.json` scripts (exact)

```json
{
  "name": "the-starkonium-times",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": { "node": ">=22.11.0", "npm": ">=10.0.0" },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build && npm run search:index",
    "preview": "astro preview --port 4321",
    "search:index": "pagefind --site dist --output-subdir _pagefind",

    "lint": "eslint . --max-warnings 0",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "astro check && tsc --noEmit",

    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "test:a11y": "playwright test --grep @a11y",

    "check:links": "node scripts/check-links.mjs",
    "check:content": "node scripts/check-content.mjs",
    "check:naming": "node scripts/check-naming.mjs",
    "check:budget": "node scripts/check-budget.mjs",
    "check:secrets": "node scripts/check-secrets.mjs",

    "validate": "npm run format:check && npm run lint && npm run typecheck && npm run test && npm run check:content && npm run check:naming",
    "validate:full": "npm run validate && npm run build && npm run check:budget && npm run check:links && npm run test:e2e",

    "package": "node scripts/package.mjs",

    "new:project": "node scripts/new-project.mjs",
    "new:update": "node scripts/new-update.mjs",
    "new:article": "node scripts/new-article.mjs",
    "new:review": "node scripts/new-review.mjs",
    "new:now": "node scripts/new-now.mjs"
  }
}
```

> `npm test` is `vitest run` (unit + schema). `npm run validate` is the fast gate (no build). `npm run validate:full` is the full gate (build + budgets + links + e2e). CI runs `validate:full`. The packaging script runs `validate:full` plus its own checks.

### 0.4 `.gitignore` (exact)

```gitignore
# dependencies
node_modules/

# build output
dist/
.astro/
.vercel/
.wrangler/

# search index (generated at build)
public/_pagefind/

# test + coverage
coverage/
test-results/
playwright-report/
blob-report/
.playwright/

# packaging
release/
*.zip

# env + secrets
.env
.env.*
!.env.example
*.pem
*.key
*.p12
secrets.*

# editor / OS
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.idea/
.DS_Store
Thumbs.db
*.swp
*~

# logs
npm-debug.log*
*.log

# migration raw input (see Phase 9 — read-only, not committed)
migration/raw/
```

### 0.5 `.editorconfig` (exact)

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true
max_line_length = off

[*.md]
trim_trailing_whitespace = false

[*.{yml,yaml}]
indent_size = 2
```

### 0.6 `.nvmrc`

```
22
```

### 0.7 `tsconfig.json`

Extends `astro/tsconfigs/strict`, plus:

```jsonc
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "verbatimModuleSyntax": true,
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@styles/*": ["src/styles/*"],
      "@utils/*": ["src/utils/*"],
      "@content/*": ["src/content/*"]
    }
  },
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "node_modules", "coverage"]
}
```

### 0.8 `astro.config.mjs` (Phase 0 form)

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkSmartypants from 'remark-smartypants';

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? 'https://starkonium.com',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [mdx(), sitemap({ filter: (p) => !p.includes('/_') })],
  markdown: {
    remarkPlugins: [remarkMath, remarkSmartypants],
    rehypePlugins: [[rehypeKatex, { output: 'mathml' }]],
    shikiConfig: { theme: 'github-light' }, // replaced with the custom cream theme in Phase 1
  },
  vite: { build: { cssMinify: 'lightningcss' } },
});
```

### 0.9 CI workflow (`.github/workflows/ci.yml`, baseline)

```yaml
name: CI
on:
  push: { branches: [main] }
  pull_request:
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - run: npm run validate
      - run: npm run build
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
      - run: npm run check:budget
      - run: npm run check:links
```

Phases 0–2 will have empty or trivial e2e/link steps; they must still *run and pass* (a zero-test Playwright run exits 0 only if `passWithNoTests`-equivalent config is set — use `--pass-with-no-tests` or ship one smoke test in Phase 0 that asserts the build emits `dist/index.html`).

### 0.10 README scaffold (Phase 0 content)

Sections, stubbed: title (*The Starkonium Times*), one-line description, requirements (Node 22, npm 10), quick start (`npm ci && npm run dev`), scripts table, repository layout, content authoring (link to `docs/`), licence (MIT code / CC BY 4.0 content), and a **"Not touching production"** notice.

### 0.11 Commit boundaries

| Commit | Message |
|---|---|
| 1 | `chore: bootstrap Astro 5 + TypeScript + tooling` |
| 2 | `chore: add editorconfig, gitignore, nvmrc, engines` |
| 3 | `chore: configure eslint, prettier, typescript strict` |
| 4 | `chore: configure vitest and playwright` |
| 5 | `chore: add npm scripts and validation pipeline` |
| 6 | `ci: add baseline GitHub Actions workflow` |
| 7 | `docs: README scaffold and licence files` |

### Phase 0 acceptance criteria

From a **clean checkout** (`git clone && cd`):

```bash
npm install       # or: npm ci
npm run lint      # exits 0
npm run typecheck # exits 0
npm test          # exits 0
npm run build     # exits 0, emits dist/
npm run preview   # serves dist/ on :4321
```

- [ ] `node -v` matches `.nvmrc`; `package.json:engines` enforces `>=22.11.0`.
- [ ] `package-lock.json` is committed; `npm ci` succeeds offline-ish from the lockfile.
- [ ] `.gitignore` excludes `node_modules`, `dist`, `.astro`, `.env*`, `coverage`, `*.zip`.
- [ ] No `.env` file exists. No secret-shaped strings anywhere (`npm run check:secrets` passes — the script exists even if it currently scans an almost-empty repo).
- [ ] CI passes on a pull request into `main`.
- [ ] `git status` is clean after a full `npm run validate && npm run build`.

---

## Phase 1 — Design tokens and global shell

**Branch:** `phase-1-design-system`
**Depends on:** Phase 0
**Delivers:** the complete visual language as CSS, plus the header, footer, navigation and page container. No content pages yet — a single `/` placeholder that exercises the shell.

### 1.1 Typography — exactly three loaded families (R5)

| Role | Family | Files loaded | Used for |
|---|---|---|---|
| **Display** | **Fraunces** (variable: `opsz`, `wght`, `SOFT`, `WONK`) | 1 × variable woff2, subset | Wordmark, page titles, section headings, pull quotes |
| **Text** | **Newsreader** (variable: `opsz`, `wght` + italic) | 2 × variable woff2 (roman + italic), subset | All long-form body prose, standfirsts, blockquotes |
| **Data / UI** | **IBM Plex Mono** (400, 500, 600) | 3 × static woff2, subset | Navigation, all labels, dates, status, metadata, chips, code, tables, the Ledger |

**Switzer is dropped.** Its interface-sans role is absorbed by IBM Plex Mono, set uppercase with generous tracking at small sizes. This is not a compromise: a lab notebook's index, its rubber stamps and its column headings *are* monospaced. Absorbing the sans role into the mono makes the identity more coherent, not less.

Non-loaded fallback for any incidental sans need: `system-ui, -apple-system, "Segoe UI", sans-serif`. It is a fallback, not a design element; nothing is specified in it.

**Stacks:**

```css
--font-display: "Fraunces Variable", "Iowan Old Style", Palatino, Georgia, serif;
--font-text:    "Newsreader Variable", Charter, Georgia, serif;
--font-mono:    "IBM Plex Mono", "SF Mono", Menlo, ui-monospace, monospace;
--font-fallback-sans: system-ui, -apple-system, "Segoe UI", sans-serif;
```

**Loading:**
- Self-hosted via `@fontsource-variable/*`, subset to Latin + the punctuation the site uses (`· — – ‘’“” ↗ † ×`).
- **Preload exactly two files per page:** Fraunces (all pages) + Newsreader roman (article/project pages) or IBM Plex Mono 400 (index pages).
- `font-display: swap`, with `size-adjust` / `ascent-override` metric-matched fallbacks so the swap causes **zero layout shift**.
- **Budget: ≤ 150KB total font payload** (down from 180KB, because one family fewer).

### 1.2 Type scale tokens

Fluid `clamp()`, min at 380px viewport, max at 1440px.

| Token | Family / weight | Size (min → max) | Line-height | Tracking | Use |
|---|---|---|---|---|---|
| `--text-display` | Fraunces 500, WONK | 34 → 50px | 1.08 | −0.01em | Homepage statement |
| `--text-h1` | Fraunces 500, WONK | 32 → 46px | 1.12 | −0.005em | Page + article titles |
| `--text-h2` | Fraunces 500 | 24 → 30px | 1.25 | 0 | Section headings |
| `--text-h3` | Plex Mono 600, uppercase | 13 → 14px | 1.35 | +0.08em | Sub-sections |
| `--text-standfirst` | Newsreader 400 italic | 19 → 22px | 1.5 | 0 | Standfirsts, project theses |
| `--text-body` | Newsreader 400 | 18 → 19px | **1.65** | 0 | Article body |
| `--text-ui` | Newsreader 400 | 16 → 17px | 1.55 | 0 | Interface prose (About, Now values) |
| `--text-nav` | Plex Mono 500, uppercase | 13px | 1.4 | +0.08em | Navigation |
| `--text-label` | Plex Mono 600, uppercase | 11 → 12px | 1.4 | +0.10em | Metadata labels, chips |
| `--text-meta` | Plex Mono 400 | 12 → 13px | 1.45 | +0.02em | Dates, Ledger rows, captions |
| `--text-small` | Newsreader 400 | 15px | 1.5 | 0 | Figure captions, sidenotes |
| `--text-code` | Plex Mono 400 | 14px | 1.6 | 0 | Code blocks |
| `--text-stamp` | Plex Mono 600, uppercase | 12 → 13px | 1 | +0.18em | Project status stamp |
| `--text-pullquote` | Fraunces 500 | 24 → 28px | 1.35 | −0.005em | Pull quotes |

**Rules:** no body text below 18px; no meaningful text below 11px; `font-variant-numeric: tabular-nums` on all mono; `text-wrap: balance` on headings; `text-wrap: pretty` on standfirsts and captions; nothing centred except the section-break glyph, display equations and the 404; nothing justified.

### 1.3 Colour tokens — orange, not vermilion (R4)

The accent moves to a true orange. The **two-token split is retained**: one orange for graphics (vivid, ≥3:1, non-text uses only), one darker orange for text (≥4.5:1, AA).

```css
:root {
  /* paper */
  --paper:         #F6F1E7;  /* cream — the page. ~92% of pixels. */
  --paper-raised:  #FBF8F1;  /* hover tints, figure grounds — lighter than paper */
  --paper-sunk:    #EDE6D6;  /* code, callouts, record blocks, failures */
  --paper-review:  #F3ECDE;  /* review pages only */

  /* ink */
  --ink-900:       #141210;  /* body + headings. warm near-black, never #000 */
  --ink-700:       #3B352E;  /* secondary prose, nav at rest */
  --ink-500:       #6B5A48;  /* umber — metadata, captions, labels */
  --ink-300:       #9A8F80;  /* warm grey — disabled/decorative ONLY */

  /* rules */
  --rule:          #D9D0BE;  /* hairlines */
  --rule-strong:   #B8AC96;  /* table headers, emphasis dividers */

  /* orange */
  --orange:        #F0760F;  /* GRAPHIC accent: stamps, rules, glyphs, status squares. NEVER text < 24px */
  --orange-ink:    #A44E05;  /* TEXT accent: all links, all accent text. AA on cream. */
  --orange-deep:   #86400A;  /* hover/active on accent text and primary buttons */
  --peach:         #F7E2C8;  /* highlight/<mark>, diff-added, gentle emphasis */

  /* figures only — never in chrome */
  --fig-1: #141210;  --fig-2: #F0760F;  --fig-3: #35564F;
  --fig-4: #B8974F;  --fig-5: #8A6E9E;
}
```

**Contrast (target values — Phase 1 must verify each with the automated checker; adjust the hex by ≤3% lightness if a pair misses):**

| Pair | Target | Requirement |
|---|---|---|
| `--ink-900` on `--paper` | ≥ 15:1 | AAA body |
| `--ink-700` on `--paper` | ≥ 10:1 | AAA secondary |
| `--ink-500` on `--paper` | ≥ 4.5:1 | AA metadata (≥12px) |
| `--orange-ink` on `--paper` | ≥ 4.5:1 | AA links |
| `--orange-deep` on `--paper` | ≥ 7:1 | AAA hover |
| `--orange` on `--paper` | ≥ 3:1 | **Non-text only.** Large text (≥24px) permitted. |
| `--orange-ink` on `--paper-sunk` | ≥ 4.5:1 | AA links inside callouts |
| `--ink-300` on `--paper` | — | Decorative only. **Never meaningful text.** |

> **The load-bearing rule, enforced by lint (Phase 11):**
> **`--orange` may never be used as a text colour below 24px. All accent text uses `--orange-ink`.**

**Application:** orange appears **at most 4 times per rendered viewport**. It is a red pen on a manuscript: rare, deliberate, always meaningful. If a fifth instance appears, something is wrong — count them.

**No dark mode in v1.** (Appendix F.)

### 1.4 Spacing, layout, radius, shadows

```css
--space-1: 0.25rem;  /* 4  */
--space-2: 0.5rem;   /* 8  */
--space-3: 0.75rem;  /* 12 */
--space-4: 1rem;     /* 16 */
--space-5: 1.5rem;   /* 24 */
--space-6: 2rem;     /* 32 */
--space-7: 3rem;     /* 48 */
--space-8: 4rem;     /* 64 */
--space-9: 6rem;     /* 96 */
--space-10: 8rem;    /* 128 */

--w-full:   1440px;  /* header, footer */
--w-page:   1180px;  /* project + index pages */
--w-bleed:   920px;  /* wide figures, tables */
--w-prose:   680px;  /* article body — 66ch */
--w-narrow:  560px;  /* Now, About bio, empty states */

--gutter: 1.5rem;    /* 24px → 40px (md) → 64px (lg) → 80px (2xl) */

--radius: 0;         /* EVERYWHERE. No exceptions in chrome. */

--dur-fast: 120ms;
--dur-base: 180ms;
--dur-slow: 240ms;   /* hard ceiling */
--ease:     cubic-bezier(0.2, 0.6, 0.2, 1);
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
```

**Radius: `0`, everywhere.** The only curved shapes on the site are the 6px status dot, and glyphs inside typefaces. Enforced by lint.

**Shadows: none**, except the search dialog:
`--shadow-dialog: 0 24px 64px -32px rgba(20, 18, 16, 0.35);`

**Breakpoints** (in `em`, so they respect user font-size):

```css
--bp-sm:  30em;  /*  480px */
--bp-md:  48em;  /*  768px */
--bp-lg:  64em;  /* 1024px */
--bp-xl:  80em;  /* 1280px */
--bp-2xl: 100em; /* 1600px */
```

### 1.5 CSS architecture

```
src/styles/
  index.css        # the only entry point; imports the layers in order
  tokens.css       # @layer tokens — everything in §1.2–1.4
  reset.css        # @layer reset — modern minimal reset
  base.css         # @layer base — html/body, typography defaults, focus, links, selection
  layout.css       # @layer layout — containers, grid, page shells
  components.css   # @layer components — imported per-component or here; see note
  prose.css        # @layer prose — the .prose typographic system (Phase 6 fills this)
  print.css        # @layer print — @media print foundations
  utilities.css    # @layer utilities — .visually-hidden, .no-js, .full-bleed
```

```css
@layer reset, tokens, base, layout, components, prose, utilities;
```

Component-scoped styles live in the `.astro` file's `<style>` block (Astro scopes them automatically). `components.css` holds only *shared* component primitives (chips, rules, stamps) that are used across many components. This keeps the global CSS small and the components self-contained.

### 1.6 Base styles — the non-negotiables

- **Focus:** `:focus-visible { outline: 2px solid var(--orange-ink); outline-offset: 2px; }` plus a 1px `--paper` inner ring so it survives on `--paper-sunk`. **Never** `outline: none` without a replacement. **Focus never animates.**
- **Links (prose):** `--orange-ink`, persistent 1px underline in `--rule`, `text-underline-offset: 3px`, `text-decoration-skip-ink: auto`. Hover: underline becomes `--orange-ink`. Inline links must be discoverable without hover.
- **Links (nav / quiet):** no underline at rest; 1px underline on hover.
- **Visited:** not styled differently (deliberate — on an archive, "visited grey" creates a false hierarchy of stale-looking rows).
- **Selection:** `::selection { background: var(--peach); color: var(--ink-900); }`
- **Reduced motion:** the global `prefers-reduced-motion: reduce` block sets all durations to `0.01ms` and `scroll-behavior: auto`. Every feature must still *work*.
- **`prefers-contrast: more`:** `--rule` → `--rule-strong`, `--ink-500` → `--ink-700`.
- **`.no-js`:** a class set on `<html>` and removed by an inline script in `<head>`. CSS uses `.no-js` to reveal no-JS fallbacks (full filter lists, static TOC, foot-of-page notes) and hide JS-only affordances (the ⌘K hint).

### 1.7 The global shell

#### `Wordmark.astro` (R1, R2)

```
Props: { size?: 'lg' | 'md' | 'sm'; as?: 'a' | 'span'; }
Renders: STARKONIUM
```

- Fraunces, uppercase, weight 500, `WONK` on, letter-spacing `+0.02em`, `--ink-900`.
- **No superscript. No numeral. No dagger. No marker of any kind.** The `marker` prop from the design spec does not exist.
- Links to `/` from every page. On `/` it is a `<span>` with no hover state (still in the DOM, not focusable as a link).
- Accessible name: `The Starkonium Times`. The visible text is `STARKONIUM`; a `.visually-hidden` span supplies the full publication name so screen readers and the a11y tree get it right. This is how the compact wordmark and the full name coexist.
- **Favicon / app icon:** a Fraunces `S`, `--ink-900` on `--paper`, no tile, no border, no element square. `favicon.svg` + `apple-touch-icon.png` (180×180) + `favicon.ico` (32×32 fallback).

#### `SiteHeader.astro`

```
┌──────────────────────────────────────────────────────────────────────┐
│ STARKONIUM        PROJECTS  WRITING  EXPERIENCE  ABOUT      ⌕   ● NOW │
└──────────────────────────────────────────────────────────────────────┘
```

- Height 72px. Background `--paper`. **No shadow, no blur, no border at rest.**
- Sticky. On scroll past 80px it gains a **1px `--rule` bottom border only** (120ms opacity fade). No shrink, no background change, no blur.
- **Four primary nav items** — Projects, Writing, Experience, About — set in `--text-nav` (Plex Mono uppercase). Reviews live under Writing (their index is `/reviews`, linked prominently from `/writing`). This is a design-spec decision, retained.
- `⌕` search trigger + a mono `⌘K` hint (hidden below `--bp-lg`). A real `<button>`. **Non-functional in Phase 1** — it renders and is focusable; Phase 10 wires it.
- `● NOW` at the far right: a 6px `--orange` square + `NOW` in `--text-nav`. Links to `/now`. **No pulse, no blink.**
- Active state: `--ink-900`, weight 600, 2px `--orange` underline offset 6px. Active on the section and all children (`/projects/*` → PROJECTS active). `aria-current="page"` exact / `aria-current="true"` parent.
- Hover (non-active): 1px `--rule` underline growing from the left, 140ms.

#### `MobileMenu.astro` (< `--bp-md`)

- Header collapses to: wordmark + `⌕` + a text **`MENU`** button (a word, not a hamburger — a piece of set type is more on-brand than an icon, and clearer).
- Opens a **full-screen opaque sheet** (`--paper`), not a drawer. Nothing glassy.
- Items: Fraunces 30px, one per line, 24px rhythm, hairline rule under each. **Six items here** (a sheet has room): Projects · Writing · Reviews · Experience · Now · About. Then a 2px rule, then: The Ledger · Archive · Topics · Search · CV.
- Foot: contact links, mono, small.
- Focus trapped; `Esc` closes; `inert` on the rest of the page; body scroll locked; focus returns to the trigger. Opens with a 160ms fade + 8px translate.
- **No-JS fallback:** the menu is a `<details>`/`<summary>` element by default. JS upgrades it to a focus-trapped dialog. With JS off it still opens and closes. **This is the pattern for all disclosure UI on the site.**
- Header hides on scroll-down / reappears on scroll-up **below `--bp-md` only** (180ms transform). This is the one piece of clever scroll behaviour permitted; vertical space is scarce on a phone.

#### `SiteFooter.astro`

Four columns (stacked on mobile), 13–14px, `--paper` ground, 1px top rule. **No dark footer.**

```
THE STARKONIUM TIMES   WORK          WRITING            ELSEWHERE
An evolving archive    Projects      All writing        GitHub ↗
of research, software, The Ledger    Paper reviews      ORCID ↗
reviews and writing.   Experience    Volume I (2021–23) Scholar ↗
                       Topics        Series             LinkedIn ↗
                       Now           Search             Email
                       About                            CV (PDF)
                                                        RSS · Log RSS
────────────────────────────────────────────────────────────────────
© 2026 {{AUTHOR}}.  Text CC BY 4.0 · Code MIT.        rev. 1 · colophon
Set in Fraunces, Newsreader and IBM Plex Mono.        Built with Astro.
────────────────────────────────────────────────────────────────────
```

The site revision (`rev. 1`) lives **here**, as a text line, not on the wordmark (R1). It links to `/colophon`.

#### `BaseLayout.astro`

```
skip link → SiteHeader → <main id="content" tabindex="-1"> <slot/> </main> → SiteFooter
```

Props: `title`, `description`, `ogImage?`, `type?`, `noindex?`, `bodyClass?`.
Emits: `<title>{title} — The Starkonium Times</title>`, meta description, canonical (absolute, no trailing slash), OG/Twitter tags, `<link rel="alternate" type="application/rss+xml">`, the `.no-js` remover script (inline, 1 line), font preloads.

#### `Container.astro`

Props: `width: 'full' | 'page' | 'bleed' | 'prose' | 'narrow'`. Applies the max-width and the responsive gutter. Every page uses it; no page sets its own margins.

#### `SkipLink.astro`

First focusable element. Visible on focus, top-left, `--paper` on `--ink-900`, square. Targets `#content`.

### 1.8 Print foundations

`print.css` (`@media print`), Phase 1 baseline:
- `--paper` → white; `--ink-900` → black; hairlines preserved at 0.5pt.
- Header, footer, nav, search, TOC, filter rails: `display: none`.
- Links: show the URL after the text (`a[href^="http"]::after { content: " (" attr(href) ")"; }`) — in prose only, not in nav.
- Body 11pt Newsreader; headings Fraunces; page margins 20mm.
- `page-break-inside: avoid` on figures, tables and callouts.

Phases 5, 6 and 8 extend this for project pages, articles and `/experience`.

### 1.9 The placeholder page

`/` renders: the wordmark, the four nav items, a single `<h1>The Starkonium Times</h1>`, one paragraph of prose exercising body type and an inline link, and the footer. That is all. Its job is to prove the shell works, not to be the homepage (Phase 4).

### 1.10 Commit boundaries

| Commit | Message |
|---|---|
| 1 | `feat(styles): colour, type, spacing and layout tokens` |
| 2 | `feat(styles): reset, base, focus, links, print foundations` |
| 3 | `feat(fonts): self-host Fraunces, Newsreader, IBM Plex Mono` |
| 4 | `feat(shell): Wordmark, Container, SkipLink` |
| 5 | `feat(shell): SiteHeader and desktop navigation` |
| 6 | `feat(shell): MobileMenu with no-JS details fallback` |
| 7 | `feat(shell): SiteFooter` |
| 8 | `feat(shell): BaseLayout and placeholder home` |
| 9 | `test(a11y): shell keyboard, contrast and overflow tests` |

### Phase 1 acceptance criteria

**Automated**

- [ ] `scripts/check-contrast.mjs` computes every pair in §1.3 and asserts the required ratio. Exits non-zero on any miss. Wired into `npm run validate`.
- [ ] Lint rule: `border-radius` may only be `0` or `50%` (the status dot). Any other value fails.
- [ ] Lint rule: `box-shadow` may only appear on `.search-dialog`. Any other use fails.
- [ ] Lint rule: `--orange` (not `--orange-ink`) may not be used in a `color:` declaration. Fails the build.
- [ ] Playwright: **no horizontal overflow** at 320, 375, 768, 1024, 1280, 1440 and 1600px, and at 400% zoom (`document.scrollWidth <= window.innerWidth`).
- [ ] Playwright: **keyboard traversal** — Tab from page load reaches the skip link first, then the wordmark, then each nav item, then search, then NOW, then main content. Focus is visible at every stop (`axe` focus-visible check + a screenshot assertion).
- [ ] Playwright: **mobile menu** — at 375px, `MENU` opens the sheet, `Esc` closes it, focus returns to the trigger, and the rest of the page is `inert`.
- [ ] Playwright with **JavaScript disabled**: the mobile menu still opens and closes (`<details>` fallback); every nav link is reachable and functional.
- [ ] axe-core: zero violations on the placeholder page at 375px and 1280px.
- [ ] Font payload ≤ 150KB total; exactly 2 preloads per page; **CLS = 0.00** measured on a cold cache (font swap must not shift).
- [ ] `prefers-reduced-motion` disables all transitions; the header border still appears (it is opacity, and instant is acceptable).

**Manual (documented in `docs/qa/phase-1.md` with screenshots)**

- [ ] **Visual token audit:** a `/dev/tokens` page (dev-only, `import.meta.env.DEV` guarded) renders every colour swatch with its computed contrast ratio, every type scale step with its live `clamp()` value, and every spacing step. Screenshot it. This page is the reference for the rest of the build.
- [ ] Orange is used **≤ 4 times** on the rendered shell.
- [ ] The wordmark carries no superscript, no numeral, no marker.
- [ ] No element on the page has a rounded corner or a shadow.

---

## Phase 2 — Content collections and schemas

**Branch:** `phase-2-content-model`
**Depends on:** Phase 0
**Delivers:** `src/content.config.ts` with all collections, Zod schemas, the Ledger aggregation utility, sample fixtures, and schema tests that prove invalid content fails the build.

### 2.1 Collections overview

| Collection | Loader | Directory | Routes | Notes |
|---|---|---|---|---|
| `projects` | `glob` | `src/content/projects/` | `/projects`, `/projects/[slug]` | **Updates are embedded here** (R9) |
| `writing` | `glob` | `src/content/writing/` | `/writing`, `/writing/[slug]` | Includes Volume I imports |
| `reviews` | `glob` | `src/content/reviews/` | `/reviews`, `/reviews/[slug]` | |
| `experience` | `glob` | `src/content/experience/` | `/experience` (single page) | **No detail routes in v1** |
| `now` | `glob` | `src/content/now/` | `/now` (newest only) | Older entries exist as data; `/now/archive` deferred |
| `topics` | `file` | `src/content/topics.yaml` | `/topics`, `/topics/[slug]` | Closed vocabulary |
| `series` | `file` | `src/content/series.yaml` | *(metadata only in v1; no routes)* | |
| `people` | `file` | `src/content/people.yaml` | *(no routes)* | Collaborator references |

**Not built (R9, R10, R11):** a `updates` collection, `/log/[date]-[slug]` routes, `/now/archive`, `/series/[slug]`, `/experience/[slug]`.

`/log` **is** built — it is the full Ledger archive page, generated from the aggregation utility (§2.9), not from a collection.

### 2.2 Shared conventions

- **Slugs:** kebab-case ASCII, derived from the filename, **immutable once published**. A slug change requires a `redirects.ts` entry. Slugs never contain dates.
- **IDs (R8):** `PRJ-001`, `WRT-001`, `REV-001`, `EXP-001`. Required in frontmatter. Unique, immutable, never reused. **Used for:** citation blocks, BibTeX keys, OG-image corner marks, Ledger row keys, `<meta name="citation_id">`. **Not shown** in page headers, index rows, or navigation.
- **Dates:** ISO `YYYY-MM-DD`. No times, no timezones. `z.coerce.date()`.
- **`draft: true`:** excluded from the production build, sitemap, RSS, search index and all listings. Visible in `dev` with a `DRAFT` banner. Implemented once, in `src/utils/content.ts:isPublished()`, and used by every query. **No page may filter drafts inline.**
- **`featured: true`:** eligible for a featured slot. Max 2 rendered per index; if more are flagged, the most recent win and the build emits a **warning** (not an error).
- **`topics: string[]`:** validated against `topics.yaml` at build. An unknown slug **fails the build**. This is the single most important guard against tag sprawl.
- **Relationships:** by slug, via `reference()`. Broken references fail the build.

### 2.3 `projects`

```ts
// src/content.config.ts (excerpt)
const projectStatus = z.enum([
  'active', 'validation', 'exploratory', 'speculative',
  'paused', 'completed', 'archived',
]);

const updateKind = z.enum([
  'built', 'result', 'validated', 'replan', 'fixed',
  'paused', 'resumed', 'submitted', 'published', 'note',
]);

const projectUpdate = z.object({
  date: z.coerce.date(),
  kind: updateKind,
  summary: z.string().min(10).max(200),   // plain text, no markdown
  link: z.string().url().optional(),      // optional outbound (commit, preprint, issue)
}).refine(
  (u) => u.kind !== 'paused' || u.summary.length >= 20,
  { message: 'A paused update must record why. Give a real reason (≥20 chars).' }
);

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) => z.object({
    // ── required (6) ────────────────────────────────────────────
    id: z.string().regex(/^PRJ-\d{3}$/),
    title: z.string().min(3).max(90),
    thesis: z.string().min(40).max(320),          // 2–3 sentences of real prose
    status: projectStatus,
    started: z.coerce.date(),
    field: z.string(),                            // topic slug, facet must be 'field'

    // ── optional ────────────────────────────────────────────────
    updated: z.coerce.date().optional(),          // floor; real value is derived (§2.4)
    topics: z.array(z.string()).default([]),
    type: z.enum(['research','software','analysis','writing','teaching','experiment'])
            .default('research'),
    updates: z.array(projectUpdate).default([]),  // R9 — embedded, no permalinks
    collaborators: z.array(z.object({
      person: z.string(),                          // people.yaml id
      role: z.enum(['supervisor','collaborator','co-author','advisor','student']),
    })).default([]),
    repositories: z.array(z.object({
      name: z.string(),
      url: z.string().url(),
      description: z.string().max(140).optional(),
      language: z.string().optional(),
      license: z.string().optional(),
    })).default([]),
    outputs: z.array(z.object({
      kind: z.enum(['preprint','paper','poster','talk','dataset','package','thesis']),
      title: z.string(),
      venue: z.string().optional(),
      date: z.coerce.date().optional(),
      doi: z.string().optional(),
      url: z.string().url().optional(),
    })).default([]),
    relatedWriting: z.array(reference('writing')).default([]),
    image: image().optional(),                     // author figure only. NEVER stock.
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});
```

**Validation rules (in `scripts/check-content.mjs`, run in `npm run validate`):**

| Rule | Failure mode |
|---|---|
| `field` must resolve to a topic with `facet: 'field'` | error |
| every `topics[]` slug must exist in `topics.yaml` | error |
| `id` must be unique across all projects | error |
| `updates` must be sorted descending by date after normalisation (the util sorts; the check asserts no duplicate `date`+`kind`+`summary` triples) | error |
| `status: 'paused'` requires the most recent update to have `kind: 'paused'` | **warning** (the author may pause without an update; the page will show `Paused` with no reason and that is visibly worse — the warning is the nudge) |
| `thesis` must not end mid-sentence (no trailing `…`) | warning |

### 2.4 Derived project fields (`src/utils/projects.ts`)

```
updatedAt   = max(frontmatter.updated ?? started, ...updates.map(u => u.date))
updateCount = updates.length
revision    = updateCount + 1          // used in the citation block only, never in a header (R8)
isCurrent   = status ∈ {active, validation}
```

Every consumer (index, homepage, Ledger, sitemap `lastmod`, OG image) uses `updatedAt`. **No page recomputes this.**

### 2.5 `writing`

```ts
const writingKind = z.enum([
  'essay', 'explainer', 'note', 'reflection', 'literature', 'personal', 'short',
]);

const writing = defineCollection({
  loader: glob({ base: './src/content/writing', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) => z.object({
    // required
    id: z.string().regex(/^WRT-\d{3}$/),
    title: z.string().min(3).max(110),
    kind: writingKind,
    published: z.coerce.date(),
    standfirst: z.string().min(60).max(280),
    topics: z.array(z.string()).min(1),

    // optional
    updated: z.coerce.date().optional(),
    volume: z.enum(['one', 'two']).default('two'),     // §0.1
    series: reference('series').optional(),
    seriesIndex: z.number().int().positive().optional(),
    relatedProjects: z.array(reference('projects')).default([]),
    revisions: z.array(z.object({
      date: z.coerce.date(),
      note: z.string().max(200),
    })).default([]),
    originalUrl: z.string().url().optional(),          // Volume I: the Blogger permalink
    seoTitle: z.string().max(60).optional(),
    image: image().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  })
  .refine((d) => !d.series || d.seriesIndex !== undefined,
    { message: 'A piece in a series must declare its seriesIndex.' })
  .refine((d) => d.volume !== 'one' || !!d.originalUrl,
    { message: 'Volume I posts must record their originalUrl for the redirect manifest.' }),
});
```

**Derived:** `readingTime = max(1, ceil(wordCount / 220))`. Computed at build from the rendered body. **Hidden when < 3 minutes** (design-spec OD-10, closed: hide).
**Derived:** `isRevised = updated && (updated - published) > 7 days` → shows a `rev.` marker.

### 2.6 `reviews`

```ts
const reviews = defineCollection({
  loader: glob({ base: './src/content/reviews', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    // required
    id: z.string().regex(/^REV-\d{3}$/),
    reviewed: z.coerce.date(),
    paper: z.object({
      title: z.string(),
      authors: z.array(z.string()).min(1),
      year: z.number().int().min(1900).max(2100),
      journal: z.string().optional(),
      volume: z.string().optional(),
      pages: z.string().optional(),
      doi: z.string().regex(/^10\.\d{4,9}\/\S+$/).optional(),
      preprintUrl: z.string().url().optional(),
      codeUrl: z.string().url().nullable().default(null),   // null renders as "none"
      dataUrl: z.string().url().nullable().default(null),
    }),
    verdict: z.enum([
      'convincing', 'partly-convincing', 'interesting-but-unconvincing',
      'not-convincing', 'important', 'flawed-but-useful',
    ]),
    verdictLine: z.string().min(40).max(160),
    field: z.string(),
    assessment: z.object({
      evidence:        dimension,
      novelty:         dimension,
      clarity:         dimension,
      reproducibility: dimension,
      usefulness:      dimension,
    }),

    // optional
    topics: z.array(z.string()).default([]),
    reproduction: z.object({
      attempted: z.boolean(),
      outcome: z.enum(['reproduced','partial','failed','not-attempted']),
      note: z.string().max(400).optional(),
    }).optional(),
    relation: z.enum(['none','cited-by-me','competing','collaborators']).default('none'),
    relatedProjects: z.array(reference('projects')).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

// every rating carries a written justification — enforced by the type, not by convention
const dimension = z.object({
  score: z.number().int().min(1).max(5),
  note: z.string().min(10).max(160),
});
```

**No aggregate score.** There is no field for one, no derived mean, and `reviewRating` is omitted from the JSON-LD (Phase 10). This is enforced by a test that asserts no `averageScore`/`overallScore` key exists anywhere in the review pipeline.

**Body requirement:** `scripts/check-content.mjs` parses each review's compiled headings and **errors** if `## Strongest contribution` is absent. Every review must say what is good about the paper before it says what is wrong.

**DOI behaviour:** if `paper.doi` exists, it renders as a link to `https://doi.org/{doi}` and is emitted as `<meta name="citation_doi">`. If it does not, the record block prints `DOI — none recorded`, and the preprint URL is used instead. A review of a paper with neither is permitted but produces a build warning.

### 2.7 `experience`

```ts
const experience = defineCollection({
  loader: glob({ base: './src/content/experience', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    id: z.string().regex(/^EXP-\d{3}$/),
    organisation: z.string(),
    position: z.string(),
    start: z.coerce.date(),
    end: z.coerce.date().nullable().default(null),   // null = current
    location: z.string(),                            // CITY-LEVEL ONLY. See §2.8.
    context: z.string().min(80).max(600),
    contribution: z.string().min(80),                // the most important field

    group: z.string().optional(),
    supervisor: z.string().optional(),               // people.yaml id
    methods: z.array(z.string()).default([]),
    tools: z.array(z.string()).default([]),
    outputs: z.array(outputSchema).default([]),
    presentations: z.array(z.string()).default([]),
    skills: z.array(z.string()).default([]),
    lessons: z.string().optional(),                  // prose, personal
    relatedProjects: z.array(reference('projects')).default([]),
    draft: z.boolean().default(false),
  }),
});
```

Derived: `current = end === null`. Sorted by `start` descending; current entries first on tie.

### 2.8 `now`

```ts
const now = defineCollection({
  loader: glob({ base: './src/content/now', pattern: '*.md' }),   // filename: YYYY-MM-DD.md
  schema: z.object({
    date: z.coerce.date(),
    building: z.string().optional(),
    buildingProject: reference('projects').optional(),
    investigating: z.string().optional(),
    writing: z.string().optional(),
    reading: z.array(z.string()).default([]),
    learning: z.string().optional(),
    recentlyDone: z.array(z.object({
      text: z.string(),
      date: z.coerce.date(),
    })).default([]),
    thinkingAbout: z.string().optional(),
    location: z.string(),          // "Bengaluru · {{INSTITUTION}}" — city + institution ONLY
    ledgerNote: z.string().max(120).optional(),   // what changed; feeds the Ledger (§2.9)
  }),
});
```

**Privacy rule, enforced by a test:** `location` must not match a street-address pattern (a digit followed by a word, a postcode shape, a building number). `scripts/check-content.mjs` rejects `location` values containing digits, or the words `street`, `road`, `lane`, `avenue`, `apt`, `flat`, `floor`, `block`. **City and institution only.** This is a hard rule, not a guideline.

`/now` renders the newest entry. Older entries remain in the collection as data (they feed the Ledger and will feed `/now/archive` in v2) but generate no routes in v1.

**Staleness:** `daysStale = today - date`. At > 60 days, the header shows `· overdue` in `--ink-500`. Honest, not decorative.

### 2.9 The Ledger — aggregation, sorting, tie-breaking

`src/utils/ledger.ts` — **the single source of truth.** Every surface that shows a Ledger (home, `/log`, project pages) calls this. No page assembles its own.

```ts
export type LedgerEntry = {
  key: string;          // stable, unique, deterministic — used as the React-less :key and for tests
  date: Date;
  type: 'update' | 'article' | 'review' | 'now';
  tag: string;          // 3-letter mono glyph shown in the row
  projectId?: string;   // PRJ-014 — used for filtering, not displayed as an ID
  projectSlug?: string;
  projectTitle?: string;
  summary: string;      // ≤ 200 chars, plain text
  href: string;         // where the row goes
};
```

**What is aggregated (four sources):**

| Source | Condition | `tag` | `href` |
|---|---|---|---|
| `projects[].updates[]` | always (each embedded update becomes one entry) | from `updateKind` → `UPD`/`RES`/`VAL`/`PLN`/`FIX`/`PSE`/`RSM`/`SUB`/`PUB`/`NTE` | `/projects/{slug}#updates` (R9 — no permalink) |
| `writing` | `!draft` | `ESS` / `EXP` / `NTE` / `REF` / `LIT` / `PER` / `SHT` (by `kind`) | `/writing/{slug}` |
| `reviews` | `!draft` | `REV` | `/reviews/{slug}` |
| `now` | only if `ledgerNote` is present | `NOW` | `/now` |

> **A Now entry appears in the Ledger only if the author wrote a `ledgerNote`.** This makes "meaningful revision" an explicit authorial act rather than a heuristic. Changing a typo in the reading list does not deserve a Ledger row; changing what you are building does.

**Deterministic sort (exact, and tested):**

1. `date` **descending**.
2. Tie → **type priority** ascending: `article` (0) → `review` (1) → `update` (2) → `now` (3). *(Rationale: a published article is the most significant event on a given day.)*
3. Tie → `projectId` ascending (lexicographic; entries without one sort last).
4. Tie → `key` ascending (lexicographic). **This guarantees a total order** — the same content always produces the same Ledger, byte for byte. A snapshot test asserts this.

**`key` construction:** `` `${type}:${slugOrId}:${isoDate}:${hash8(summary)}` ``. Deterministic, collision-free, stable across rebuilds.

**API:**

```ts
getLedger(opts?: {
  limit?: number;
  types?: LedgerEntry['type'][];
  projectSlug?: string;
  since?: Date;
}): LedgerEntry[]
```

- Home: `getLedger({ limit: 8 })`
- `/log`: `getLedger()` — grouped by month, paginated at 100
- Project page: `getLedger({ projectSlug, types: ['update'], limit: 5 })`

### 2.10 `topics.yaml`, `series.yaml`, `people.yaml`

```yaml
# src/content/topics.yaml  — a CLOSED vocabulary. Adding a topic is a deliberate act.
- slug: structural-biology
  label: Structural biology
  facet: field                # field | method | tool | theme
  description: >
    How molecules are shaped, and what the shape lets them do.
- slug: molecular-dynamics
  label: Molecular dynamics
  facet: method
- slug: pytorch
  label: PyTorch
  facet: tool
- slug: reproducibility
  label: Reproducibility
  facet: theme
```

```yaml
# src/content/series.yaml
- slug: a-to-z-genetics
  title: "A–Z: Genetics"
  volume: one
  status: paused              # active | complete | paused | abandoned
  ordered: true
  description: >
    A run through genetics one concept at a time, written for readers with
    no biology background.
```

```yaml
# src/content/people.yaml
- id: jane-doe
  name: Jane Doe
  affiliation: "{{INSTITUTION}}"
  role: Professor of Structural Biology
  url: https://example.edu/jane-doe      # optional
  orcid: 0000-0000-0000-0000             # optional
```

**People rule:** names render as text with an optional outbound link. **No photographs, no inferred detail, no person pages.** A collaborator's name on this site is a courtesy, not a claim.

**Series in v1 (R-scope):** the `series` + `seriesIndex` fields render as a metadata line on articles (`SERIES · A–Z: GENETICS · 3/26`) and drive prev/next links within the series. **No `/series/[slug]` routes** — deferred (Appendix F).

### 2.11 Fixtures

`src/content/` ships with these at the end of Phase 2 (they are **real placeholders**, clearly marked `draft: true` where they are not real content, and progressively replaced with real content in Phases 5–9):

| Fixture | Purpose |
|---|---|
| `projects/minimal-project.md` | Only the 6 required fields. No body. **Must render as a dignified page.** |
| `projects/comprehensive-project.mdx` | Every optional field + every body section + 6 updates |
| `projects/paused-project.md` | `status: paused` with a `paused` update carrying a real reason |
| `projects/completed-project.md` | `status: completed`, has outputs, no recent updates |
| `projects/no-updates-project.md` | `updates: []` — the Ledger must not break |
| `writing/short-note.md` | `kind: short`, ~180 words, no optional metadata, no TOC, no reading time |
| `writing/long-essay.mdx` | 3500 words, figures, sidenotes, pull quote, references |
| `writing/technical-article.mdx` | Code blocks, a table, two display equations |
| `writing/volume-one-sample.md` | `volume: one`, `originalUrl` set, an annotation |
| `reviews/complete-review.mdx` | Every field, full body, `reproduction` populated |
| `experience/current-role.md` | `end: null`, full `contribution` + `lessons` |
| `experience/past-role.md` | Minimal |
| `now/2026-07-09.md` | With a `ledgerNote` |
| `now/2026-05-01.md` | Without a `ledgerNote` (must **not** appear in the Ledger) |

### 2.12 Commit boundaries

| Commit | Message |
|---|---|
| 1 | `feat(content): topics, series and people data files` |
| 2 | `feat(content): projects collection with embedded updates` |
| 3 | `feat(content): writing collection` |
| 4 | `feat(content): reviews collection` |
| 5 | `feat(content): experience and now collections` |
| 6 | `feat(content): ledger aggregation with deterministic ordering` |
| 7 | `feat(content): derived-field utilities (updatedAt, readingTime, staleness)` |
| 8 | `feat(scripts): check-content validation script` |
| 9 | `test(content): schema tests and invalid-content failure cases` |
| 10 | `feat(content): sample fixtures for every content shape` |

### Phase 2 acceptance criteria

**Automated schema tests (`tests/unit/schema.test.ts`) — each must FAIL the build:**

- [ ] A project with a `topics` slug not in `topics.yaml`
- [ ] A project whose `field` resolves to a topic whose facet is not `field`
- [ ] A duplicate `id` across two projects
- [ ] An `id` not matching `PRJ-\d{3}`
- [ ] A `thesis` shorter than 40 or longer than 320 characters
- [ ] An update with `kind: paused` and a summary under 20 characters
- [ ] A `writing` entry with `series` set but no `seriesIndex`
- [ ] A `writing` entry with `volume: one` and no `originalUrl`
- [ ] A review with a dimension score but no `note`
- [ ] A review whose body has no `## Strongest contribution` heading
- [ ] A review with any aggregate-score field
- [ ] A `now` entry whose `location` contains a digit or a street word
- [ ] A `reference()` pointing at a non-existent slug

**Automated Ledger tests (`tests/unit/ledger.test.ts`):**

- [ ] Ordering is deterministic: running `getLedger()` twice on the same content yields an identical array (deep-equal, including `key`s).
- [ ] The four-level tie-break is exercised: a fixture with an article, a review, an update and a Now note **all on the same date** produces exactly the order `article, review, update, now`.
- [ ] A `now` entry without a `ledgerNote` does **not** appear.
- [ ] `draft: true` content does **not** appear.
- [ ] `getLedger({ projectSlug })` returns only that project's updates.
- [ ] A project with `updates: []` contributes nothing and throws nothing.
- [ ] Snapshot test: the full fixture Ledger matches a committed snapshot.

**Build:**

- [ ] `npm run typecheck` passes — all collection types are inferred, no `any`.
- [ ] `npm run check:content` passes on the fixtures and fails on each of a set of committed bad-fixture files in `tests/fixtures/invalid/` (each is loaded by the test, not by Astro).
- [ ] `npm run build` succeeds. Zero pages exist yet beyond the Phase 1 placeholder — that is correct.

---

## Phase 3 — Core reusable components

**Branch:** `phase-3-components`
**Depends on:** Phases 1, 2
**Delivers:** every reusable component, built in dependency order, plus a **dev-only component showcase** at `/dev/components`.

### 3.1 Anti-duplication rule

Before creating a component, the agent must check whether an existing one can take a prop instead. Specifically:

- **`EntryRow` is the single row primitive.** `ProjectPreview`, `WritingRow` and `ReviewPreview` are **thin wrappers around `EntryRow`**, each supplying a different metadata slot. They are not three independent implementations. If they drift apart, the phase has failed.
- **`Callout` and `Sidenote` are distinct** (one is in-flow, one is marginal) and must stay so.
- **`StatusLabel` and `ProjectStatusStamp` are distinct** (one is a flat inline chip, one is the rotated stamp) — but they read the same enum from the same map. One source of truth for status → glyph → colour → label.

### 3.2 Build order and specification

Build in this order; each depends only on those above it.

#### Tier 0 — primitives

**`EditorialRule.astro`**
Purpose: every horizontal divider on the site.
Props: `variant: 'hair' | 'strong' | 'double' | 'emphasis'`, `spacing?: 'tight'|'normal'|'loose'`.
Semantics: `<hr>` when it separates content; a styled `<div aria-hidden="true">` when purely decorative.
Variants: hair = 1px `--rule`; strong = 1px `--ink-900`; double = 3px + 2px gap + 1px (reviews and `/archive` only); emphasis = 2px `--orange`.
Never: used to fake a card border.

**`InsertionCaret.astro`**
Purpose: the site's bullet, section glyph and "more" affordance — the proofreader's insertion mark.
Implementation: **an inline SVG**, drawn to match Fraunces, not the `‸` character (design-spec OD-9, closed: SVG). Guarantees identical rendering everywhere and reliable `--orange` fill.
Props: `size?: 'sm'|'md'`, `colour?: 'orange'|'ink'`.
A11y: `aria-hidden="true"`, always. **It is never the accessible name of anything.**
Never: larger than 0.7× the adjacent cap height. Never animated except the 4px hover translate on rows.

**`StatusLabel.astro`**
Purpose: project status, inline, in lists and record blocks.
Props: `status: ProjectStatus`, `size?: 'sm'|'md'`.
Renders: `<span>` = an 8px glyph (`aria-hidden`) + a mono uppercase text label.
Status map (single source of truth, `src/utils/status.ts`):

| status | glyph | colour | label |
|---|---|---|---|
| `active` | ▪ filled square | `--orange` | ACTIVE |
| `validation` | ◪ half square | `--orange` | VALIDATION |
| `exploratory` | ▫ open square | `--ink-700` | EXPLORATORY |
| `speculative` | ▫ dashed square | `--ink-500` | SPECULATIVE |
| `paused` | ▬ bar | `--ink-500` | PAUSED |
| `completed` | ■ filled square | `--ink-900` | COMPLETED |
| `archived` | ▨ hatched square | `--ink-300` | ARCHIVED |

**Colour is never the sole carrier of meaning** (WCAG 1.4.1) — the glyph *shape* and the *text label* both encode it.

**`TopicList.astro`**
Purpose: render a set of topics as chips.
Props: `topics: string[]`, `variant: 'bordered' | 'inline'`, `max?: number` (default 6), `linked?: boolean` (default true).
`bordered` (used on project/article headers): square chips, 1px border, ≤24px tall. Border colour by facet: `field` = `--rule`; `method` = `--ink-500`; `tool` = none + `--paper-sunk` fill, mono.
`inline` (used on index rows): plain text, separated by a mono `·`. Lighter, more editorial.
Overflow: past `max`, render `+N more` as a text button that reveals the rest (a `<details>` — works without JS).
Never: pill-shaped. Never coloured by category.

**`MetadataList.astro`**
Purpose: the record block — the workhorse. A definition list.
Props: `items: { label: string; value: unknown; type?: 'text'|'mono'|'date'|'link'|'chips' }[]`, `dense?: boolean`.
Semantics: `<dl>` / `<dt>` / `<dd>`. **Not a table.**
Layout: `<dt>` = Plex Mono 11px uppercase `+0.10em` `--ink-500`, fixed 90px (72px on tablet); `<dd>` = Newsreader 15px `--ink-900`, with dates/IDs/tools in mono. Row gap `--space-3`. Rules above and below the block only, never between rows.
< `--bp-sm`: stacks — label above value. **Labels are never truncated with an ellipsis.**

**`EmptyState.astro`**
Props: `message: string`, `action?: { label: string; href: string }`.
Renders: a mono line of honest text + an optional text-button action.
**Never:** an illustration, a mascot, "Oops!", or an exclamation mark.

**`SectionHeader.astro`**
Props: `title: string`, `href?: string` (the "all X →" link), `level?: 2|3`.
Renders: a mono uppercase title on the left, an optional right-aligned text link, and a hairline rule beneath. This is the header used by every homepage region and every index section.

**`PageHeader.astro`**
Props: `title`, `standfirst?`, `meta?: MetaItem[]`, `stamp?: ProjectStatus`, `updated?: Date`.
Renders: `<h1>` (Fraunces), an optional standfirst (Newsreader italic), an optional `MetadataList`, an optional `ProjectStatusStamp`, and a small `updated {date}` line in mono `--ink-500`.
**R8:** the catalogue ID is **not rendered here.** The old "shelfmark" line collapses to the `updated` date alone.

#### Tier 1 — chrome (built in Phase 1, listed here for the inventory)

`Wordmark`, `SiteHeader`, `MobileMenu`, `SiteFooter`, `Container`, `SkipLink`, `BaseLayout`.

**`SearchTrigger.astro`** (new in Phase 3, wired in Phase 10)
Props: none. Renders a real `<button>` with `⌕` + a mono `⌘K` hint (hidden < `--bp-lg`), `aria-label="Search The Starkonium Times"`, `aria-haspopup="dialog"`.
No-JS: it is wrapped in a `<form action="/search" method="get">` with a hidden text input, so pressing it without JS lands on `/search`. **The trigger is never a dead control.**

#### Tier 2 — the signature

**`Ledger.astro` + `LedgerRow.astro`** — *the most important component on the site (R6).*

```
2026-07-09   UPD   fold-switch     Validation set rebuilt; AUC drops to 0.71.        ‸
2026-07-02   ESS   —               On the smell of a wet culture room                 ‸
2026-06-28   REV   —               Kim et al. 2026 · partly convincing                ‸
```

`Ledger` props: `entries: LedgerEntry[]`, `showProject?: boolean` (default true), `grouped?: 'none' | 'month'` (default `none`; `/log` uses `month`), `emptyMessage?: string`.
`LedgerRow` props: `entry: LedgerEntry`.

- Semantics: `<ul>` of `<li>`. **Not a `<table>`** — it is a list of events, not tabular data. Each `<li>` contains one `<a>` wrapping the whole row.
- Type: IBM Plex Mono 13px throughout. `font-variant-numeric: tabular-nums` so the date column aligns exactly.
- Columns: `date` (fixed 92px) · `tag` (fixed 40px, `--orange-ink`) · `project` (fixed 140px, `--ink-500`, or `—`) · `summary` (flex, `--ink-900`) · caret (right).
- Hairline rule between rows. **No rule above the first or below the last** (the surrounding `SectionHeader` supplies those).
- Hover: row ground → `--paper-raised` (120ms); caret translates 4px right (140ms). **No lift, no scale, no shadow.**
- Accessible name of each row link: `` `${tagLabel}: ${summary} — ${projectTitle ?? ''}, ${formattedDate}` ``. The 3-letter tag glyph is `aria-hidden`; the row link carries the expanded word.
- Responsive: < `--bp-sm`, the `project` column is dropped and the project title is prepended to the summary in `--ink-500`. Row min-height 48px on touch.
- Empty: renders `EmptyState` with the supplied `emptyMessage`. **Never** renders an empty `<ul>` or a bare rule.
- **`/log` grouping:** `grouped: 'month'` inserts a mono `2026 · JULY` heading (`<h2>`) before each month's rows, with an `EditorialRule variant="hair"`.

#### Tier 3 — entries

**`EntryRow.astro`** — the universal preview row (see §3.1).
Props: `href`, `title`, `titleLevel?: 2|3`, `description?`, `eyebrow?` (a slot: the mono line above the title), `meta?` (a slot: the mono line below), `topics?: string[]`.
Semantics: `<article>` containing an `<h2>`/`<h3>` whose text is the link. **The whole row is clickable** but the *accessible* link is the title (the row uses a stretched-link pattern with `::after`, so the accessible name stays clean).
Visual: no border, no ground, no shadow, no radius. Separated from siblings by a hairline. Hover: ground → `--paper-raised`; title → `--orange-ink`; caret translates 4px.
**This is not a card.** It has no enclosing box. (R14 permits bordered surfaces where the border encloses one semantic thing — an index row is a row, not a thing.)

**`ProjectPreview.astro`** = `EntryRow` + eyebrow (`StatusLabel` + `started`/`updated` dates) + description (`thesis`) + `TopicList variant="inline"` + a meta line (`N updates · M outputs`).
**`WritingRow.astro`** = `EntryRow` + eyebrow (`kind` + date + reading time + optional `VOLUME I` chip) + description (`standfirst`) + `TopicList variant="inline"`.
**`ReviewPreview.astro`** = `EntryRow` + eyebrow (`reviewed` date + verdict chip) + a citation line (authors, year, journal, DOI) + description (`verdictLine`) + an inline `AssessmentStrip` in compact mode.

**`ArticleMetadata.astro`**
Props: `kind`, `published`, `updated?`, `readingTime`, `volume`, `series?`, `seriesIndex?`, `topics`.
Renders the mono eyebrow line above an article's `<h1>`, plus (below the standfirst) the topic chips. Handles: hiding reading time < 3 min; showing `rev.` when revised; showing the `VOLUME I` chip; showing `SERIES · A–Z: GENETICS · 3/26`.

#### Tier 4 — prose

**`Figure.astro`**
Props: `src` (an `astro:assets` image), `alt` **(required — the component throws at build if empty and `decorative` is not set)**, `caption?`, `source?`, `bleed?: boolean`, `decorative?: boolean`, `longDescription?: string`.
Semantics: `<figure>` + `<figcaption>`. `aria-describedby` links the image to its caption. The caption is **not** a substitute for `alt` — they say different things.
Visual: image on `--paper-raised`, 1px `--rule` border, `--space-5` padding. **This is a permitted bordered surface (R14): the border encloses exactly one thing.**
Data figures: `longDescription` renders as a `<details>` below the caption containing the numbers or a table. **A data figure without a `longDescription` produces a build warning.** This is the accessible equivalent of "show your data" and it is exactly the site's stated value.
`bleed`: widens to `--w-bleed` (920px) on `--bp-lg`+; shrinks to the text measure below.

**`FigureCaption.astro`** — used by `Figure`; also usable standalone under a table.
Renders `Fig. 3 —` in mono uppercase `--orange-ink`, then Newsreader 15px `--ink-500`, left-aligned, max 60ch. **Never centred** (centred captions are unreadable at length). Optional `source` line in mono 12px beneath.
Figure numbering is **automatic per page**, via a build-time counter in the MDX pipeline.

**`Callout.astro`**
Props: `variant: 'note' | 'caveat' | 'method' | 'erratum'`, `date?` (required for `erratum`).
Visual: `--paper-sunk` ground, 2px left rule, no box, no radius. Label in mono uppercase `--orange-ink` (`NOTE` / `CAVEAT` / `METHOD` / `ERRATUM · 2026-07-05`). Left-rule colour: `--ink-500` (note, method), `--ink-900` (caveat), `--orange` (erratum).
**No emoji. No icons. No coloured backgrounds beyond the single sunk tint.**

**`Note.astro`** (the sidenote/footnote — *one system*)
Props: `id?` (auto-generated if absent).
**Three simultaneous renderings from one authored source:**
1. ≥ `--bp-xl`: a **margin note** in the right rail, aligned to the top of its referencing paragraph, `--text-meta`, `--ink-500`. Collisions are pushed down by a small layout pass.
2. < `--bp-xl` **or JS off**: a numbered inline `<details>` immediately after the referencing paragraph.
3. **Always**: a numbered entry in the foot-of-article `Notes` section.
The reference marker is a **superscript mono numeral in `--orange-ink`**, a real `<a>` with the accessible name `Note 3`, linking to the foot-of-page entry. The note body is an `<aside role="note">`.
**No note is ever unreachable.** This is the design spec's decision (one authoring system, three renderings) and it is retained exactly.

**`CodeBlock`** (an MDX/rehype integration, not a standalone `.astro` component)
- Shiki at build, with a **custom cream theme** (`src/styles/shiki-cream.json`), derived from the palette: plain `--ink-900`; comment `--ink-500` italic; keyword `--orange-deep` 600; string `--fig-3`; number `--fig-4`; function `--ink-900` 600; type `--fig-5`; variable `--ink-700`.
- Ground `--paper-sunk`, 1px `--rule`, `--radius: 0`, `--space-5` padding.
- Language label top-right, mono 11px uppercase `--ink-500`.
- Optional filename bar above (1px-ruled).
- A **copy button** — the only button permitted inside prose. It is a progressive enhancement: absent with JS off, and its absence breaks nothing.
- **No soft wrap.** Long lines scroll horizontally. The `<pre>` is `tabindex="0"`, `role="region"`, `aria-label="Code block, {lang}"`, with a visible focus ring — so keyboard users can scroll it. **No line numbers** unless the prose refers to a line.
- Diffs: added lines get a `--peach` ground; removed lines get a 1px strikethrough. **No red/green** (fails colour-blind readers, clashes with the palette).

**`Table.astro`** (a wrapper; MDX tables are auto-wrapped by a rehype plugin)
Props: `caption?`, `stack?: boolean`.
Visual: hairline rules only. No vertical rules, no zebra striping, no radius. Header row: mono 12px uppercase `+0.06em` `--ink-500`, 1px `--ink-900` bottom border. Body rows: 1px `--rule`. Numerals `tabular-nums`, right-aligned. Row hover `--paper-raised`.
Semantics: `<table>` with `<caption>`, `<thead>`, `<th scope="col|row">`.
Overflow: a horizontally scrollable container, `tabindex="0"`, `role="region"`, `aria-label` from the caption, with a right-edge fade. `stack: true` converts each row into a definition list below `--bp-md` (appropriate for ≤6-row tables, wrong for data tables — the author chooses).

#### Tier 5 — specials

**`ProjectStatusStamp.astro`**
Props: `status: ProjectStatus`.
Visual: a mono uppercase, `+0.18em`-tracked label inside a 1px rule box, **rotated −1.5°**, transparent fill. Colour: `--orange` for `active`/`validation`; `--ink-900` for `completed`; `--ink-500` for `paused`/`archived`; `--ink-900` dashed for `exploratory`/`speculative`.
**The −1.5° rotation is the site's one moment of imprecision, and that is the point.** Everything else is set square. The stamp is the human hand in a typeset object.
**Constraint, enforced by a test:** it appears **exactly once per project page and nowhere else on the site.** Lists and tables use `StatusLabel`.
**It never animates.** Stamps do not breathe.

**`AssessmentStrip.astro`** (reviews only — built here, used in Phase 7)
Props: `assessment: Assessment`, `compact?: boolean`.
Renders five dimensions; each as **five small squares** (filled `--ink-900`, empty = 1px `--rule`), plus the dimension name in mono and its **required written justification** in Newsreader 15px beside it.
**Not stars. Not a single aggregate score.** A single number would be both fake precision and needlessly combative.
`compact`: squares only, no justifications (used in `ReviewPreview`).
A11y: each dimension is a `<div role="img" aria-label="Evidence: 3 out of 5. Strong on the benchmark, untested off it.">`. The squares are `aria-hidden`.

**`CiteBlock.astro`**
Props: `id`, `title`, `date`, `url`, `type: 'article'|'review'|'project'`.
Renders a plain-text citation and a BibTeX block on `--paper-sunk`, with a copy button (JS enhancement).
**This is where the catalogue ID lives (R8)** — `WRT-031` appears in the BibTeX key and the citation line, and nowhere else on the page.
BibTeX key: `starkonium{ID}` (e.g. `starkoniumWRT031`).
No personal blog offers a BibTeX entry for an essay. This one does, for every article, review and project. It is a build-time function and it makes the site feel like a publication.

**`TableOfContents.astro`**
Props: `headings: MarkdownHeading[]`, `minHeadings?: number` (default 3).
Generated from `<h2>` only; `<h3>` nested only when a section has ≥3 of them. Renders **nothing** if there are fewer than `minHeadings` — a 300-word note gets no TOC.
Sticky left rail ≥ `--bp-lg`; a `<details>` disclosure below that.
**No-JS:** a plain static list of links. **JS enhancement:** `IntersectionObserver` highlights the current section with a 2px `--orange` left rule. If JS is off, nothing is highlighted and nothing is broken.

### 3.3 The component showcase

**`/dev/components`** — a single page, guarded by `import.meta.env.DEV`, that renders **every component in every state**: each status, each callout variant, each rule variant, a Ledger with 8 entries, a Ledger with 0 entries, each entry-row wrapper, a figure with and without a caption, a code block, a table, the stamp at all 7 statuses, the assessment strip, an empty state, and every type-scale step.

- It is the reference the agent screenshots for every visual acceptance criterion.
- It **must not appear in the production build**: a test asserts `dist/dev/` does not exist after `npm run build`.
- The token page from Phase 1 (`/dev/tokens`) sits beside it.

### 3.4 Commit boundaries

| Commit | Message |
|---|---|
| 1 | `feat(components): primitives — EditorialRule, InsertionCaret, EmptyState` |
| 2 | `feat(components): status system — StatusLabel, ProjectStatusStamp` |
| 3 | `feat(components): TopicList and MetadataList` |
| 4 | `feat(components): SectionHeader and PageHeader` |
| 5 | `feat(components): Ledger and LedgerRow` |
| 6 | `feat(components): EntryRow and its three wrappers` |
| 7 | `feat(components): ArticleMetadata` |
| 8 | `feat(prose): Figure, FigureCaption, Callout` |
| 9 | `feat(prose): Note — margin, inline and foot-of-page renderings` |
| 10 | `feat(prose): Shiki cream theme and CodeBlock integration` |
| 11 | `feat(prose): Table wrapper` |
| 12 | `feat(components): AssessmentStrip and CiteBlock` |
| 13 | `feat(components): TableOfContents with no-JS fallback` |
| 14 | `feat(dev): component showcase and token reference pages` |
| 15 | `test(components): render, a11y and state tests` |

### Phase 3 acceptance criteria

- [ ] **`/dev/components` exists** and renders every component in every state. Screenshots committed to `docs/qa/phase-3/`.
- [ ] **`/dev/*` is absent from `dist/`** after a production build. Asserted by a test.
- [ ] axe-core: zero violations on `/dev/components` at 375px and 1280px.
- [ ] `Figure` **fails the build** when `alt` is empty and `decorative` is not set. (Test: a fixture with a missing alt throws.)
- [ ] `ProjectStatusStamp` appears exactly once per project page — asserted in Phase 5 by a DOM-count test, and asserted here by a lint rule that the component is imported only by the project layout.
- [ ] `EntryRow` is the sole implementation behind `ProjectPreview`, `WritingRow` and `ReviewPreview` — asserted by a source-grep test (each wrapper imports `EntryRow`; none duplicates its markup).
- [ ] `Ledger` with `entries: []` renders an `EmptyState`, not an empty list, and does not throw.
- [ ] `Note` renders in all three places simultaneously; with JS disabled, every note is still reachable via its inline `<details>` **and** the foot-of-page list.
- [ ] `TableOfContents` renders nothing for a 2-heading document.
- [ ] Keyboard: the code block is focusable and horizontally scrollable with the arrow keys; the focus ring is visible.
- [ ] With JS disabled, `/dev/components` has **no dead controls**: the copy button is absent (not present-and-broken), the search trigger falls back to a `/search` form, and every `<details>` opens.
- [ ] No component in the inventory duplicates another's function. The agent must state, in the phase report, which components were *considered and rejected* as duplicates.

---

## Phase 4 — Homepage

**Branch:** `phase-4-homepage`
**Depends on:** Phases 1, 2, 3
**Delivers:** `/` — the real homepage, and `/log` (the full Ledger archive), which is the homepage's natural overflow.

### 4.1 The seven regions, in this exact order

| # | Region | Source | Component |
|---|---|---|---|
| 1 | **Opening statement** | `src/content/site.yaml → statement` | Prose, `--text-display` |
| 2 | **Recent** (the Ledger) | `getLedger({ limit: 8 })` | `SectionHeader` + `Ledger` |
| 3 | **Currently** | the newest `now` entry | A 3-column definition list |
| 4 | **Selected projects** | `projects` where `featured`, else the 4 most recently updated | `SectionHeader` + `ProjectPreview` ×3–4 |
| 5 | **Latest writing** | the 3 most recent `writing` + `reviews`, merged | `SectionHeader` + `WritingRow`/`ReviewPreview` |
| 6 | **About, short** | `src/content/site.yaml → shortAbout` (≤ 60 words) | Prose + a caret link to `/about` |
| 7 | **Contact and links** | `src/content/site.yaml → links` | `MetadataList` |

**Why the Ledger is second, above the projects:** a visitor learns that the site is *alive* before they learn what it *contains*. On a normal portfolio you learn what someone did; here you learn what they did this month. This ordering is the product thesis, and it is not negotiable.

**Region 1 — the statement.** Three lines maximum, Fraunces at `--text-display`, followed by two lines of context in mono `--ink-500`. **Not a name. Not a photo. Not a job title. A claim about the work.** The name is in the masthead; repeating it is redundancy dressed as a hero.

**Region 3 — Currently.** Pulled from the newest `now` entry — **a single source of truth**. The homepage never re-authors this content. Three columns on `--bp-lg`+ (`BUILDING` / `INVESTIGATING` / `READING`), two on `--bp-md`, one below. If the Now entry is > 60 days old, a mono line reads `Last updated 2026-04-01 — overdue.` Honest, and a useful nudge for the author.

### 4.2 `site.yaml`

A new single data file, `src/content/site.yaml`, holding the strings the homepage and footer need. It is not a collection with routes; it is loaded via the `file()` loader and typed.

```yaml
author: "{{AUTHOR}}"
publication: The Starkonium Times
wordmark: STARKONIUM
statement: >
  I work on how proteins decide what to bind, and on making that decision
  reproducible by someone who is not me.
statementContext: >
  Computational and structural biology. Currently at {{INSTITUTION}}.
  Everything below is dated and under revision.
shortAbout: >
  I am a computational biologist. I write about structure, method and the
  parts of research that do not survive the write-up.
revision: 1                       # the site revision. Footer + colophon ONLY (R1).
links:
  email: "{{EMAIL}}"
  emailNote: Best for anything real. I reply slowly but I do reply.
  github: "{{GITHUB}}"
  orcid: "{{ORCID}}"
  scholar: "{{SCHOLAR}}"
  linkedin: "{{LINKEDIN}}"
  cv: /cv.pdf
```

### 4.3 Fallback behaviour — the degenerate states (R15)

The homepage must be dignified when the site is new and thin. **Padding with fabricated content is a failure.** Each region degrades by *omission* or by *honest statement*, never by invention.

| Condition | Behaviour |
|---|---|
| **Ledger has 0 entries** | The `Recent` region is **omitted entirely** — no header, no rule, no empty state. A homepage with an empty box labelled "Recent" is worse than one without the section. |
| **Ledger has 1–7 entries** | Show what exists. **Do not pad.** The `all entries →` link is hidden if `total <= 8`. |
| **No Now entry** | The `Currently` region is **omitted entirely**. |
| **Now entry > 60 days old** | Region renders, with the mono `overdue` line. |
| **Now entry has only 1–2 populated fields** | Render only the populated fields; the grid collapses to the columns that exist. |
| **0 projects** | The `Selected projects` region is **omitted**. (This state should never ship, but the template must not throw.) |
| **1–2 projects** | Render them. The grid is a list; it does not need three. **Do not show a "coming soon" placeholder.** |
| **≥3 projects, none featured** | Show the 4 most recently updated (by `updatedAt`). |
| **0 reviews** | The `Latest writing` region shows articles only. There is **no separate reviews region** on the homepage, so no empty state is possible. |
| **0 writing** | The `Latest writing` region is **omitted**. |
| **No `shortAbout`** | Region 6 is omitted; region 7 (contact) still renders. |

**Implementation rule:** every region is a component that returns `null` when its data is empty. The homepage is a list of regions; it contains **no conditional markup** beyond `{region}`. This keeps the fallback logic in one place per region and makes it testable.

### 4.4 `/log`

The full Ledger archive. `getLedger()` with `grouped: 'month'`. Paginated at 100 rows (`/log`, `/log/2`, …). Filter by type (`?type=update,review`) — the same client-side, URL-state, pre-rendered-HTML mechanism as Phase 5's filters, and **fully functional with JS off** (all rows present; filters simply do nothing). Dense, text-only, and it must load in under 200ms.

### 4.5 Explicitly absent from the homepage

A photograph of the author (goes on `/about`), a skills grid, proficiency bars, a statistics counter, a logo wall, a testimonial, a call-to-action button, a newsletter form, an animated hero, scientific stock imagery, a "featured project" hero image, a carousel, or any decorative background.

**Motion:** none. The design spec's optional first-load reveal (OD-5) is **closed: cut it.** The homepage does not animate.

### 4.6 Commit boundaries

| Commit | Message |
|---|---|
| 1 | `feat(content): site.yaml with statement, about and links` |
| 2 | `feat(home): opening statement region` |
| 3 | `feat(home): Ledger region with empty-state omission` |
| 4 | `feat(home): Currently region sourced from the newest Now entry` |
| 5 | `feat(home): selected projects region` |
| 6 | `feat(home): latest writing region` |
| 7 | `feat(home): short about and contact regions` |
| 8 | `feat(log): full Ledger archive with month grouping and pagination` |
| 9 | `test(home): region ordering, fallbacks and a11y` |

### Phase 4 acceptance criteria

- [ ] **Content ordering:** a Playwright test asserts the DOM order of the seven regions exactly. A reordering fails the test.
- [ ] **No duplicated content logic:** a source-grep test asserts the homepage does not call `getCollection` directly for the Ledger, and does not re-sort anything. Every region reads from `src/utils/*`.
- [ ] **All sections sourced from collections/`site.yaml`.** No hard-coded strings in `index.astro` beyond section titles. Asserted by a lint rule (no string literals over 40 chars in the page file).
- [ ] **Fallbacks:** five Playwright tests, each against a temporary content set — zero Ledger entries, zero projects, no Now entry, a stale Now entry, zero reviews. Each asserts the correct region is omitted (not empty-stated), and that the page still validates with axe.
- [ ] **Responsive:** no horizontal overflow at 320/375/768/1024/1440/1600. `Currently` collapses 3 → 2 → 1 column correctly.
- [ ] **Lighthouse (mobile, throttled):** performance ≥ 98, accessibility 100, best-practices 100, SEO 100. **CLS = 0.00.** LCP ≤ 1.2s.
- [ ] **axe-core:** zero violations at 375px and 1280px.
- [ ] **JS off:** every region renders, every link works, the Ledger is complete, `/log` filters are inert but the full list is visible.
- [ ] **Orange count ≤ 4** on the rendered homepage at 1440×900. Asserted by a Playwright test that counts computed styles matching the orange tokens.
- [ ] The homepage contains **no `<img>`** other than (optionally) figures inside content. No hero image exists.

---

## Phase 5 — Projects

**Branch:** `phase-5-projects`
**Depends on:** Phases 2, 3, 4
**Delivers:** `/projects` (one editorial view, two filters) and `/projects/[slug]` (the full optional-section anatomy).

### 5.1 `/projects` — one view (R10, R11)

**Editorial list only.** No view toggle, no table, no grid. `ProjectPreview` rows, hairline-separated, sorted by `updatedAt` descending.

The two-to-three-line `thesis` is the single biggest quality lever on this page. It is a required schema field, written as prose, **never truncated from the body**.

### 5.2 Filters — exactly two facets (R12)

```
FILTER                              ┌─────────────────────────────────────
────────────                        │  PRJ row
STATUS                              │  PRJ row
☐ active         3                  │  PRJ row
☐ validation     1                  │
☐ exploratory    2                  │
☐ paused         1                  │
☐ completed      2                  │
                                    │
FIELD                               │
☐ computational biology   4         │
☐ structural biology      3         │
☐ image analysis          2         │
────────────                        │
Clear all                           │
```

- **Status** and **research field**. Nothing else. No method, no tool, no year.
- Checkboxes. Multi-select within a facet = **OR**; across facets = **AND**.
- Live counts, updated as filters change.
- **URL state:** `/projects?status=active,validation&field=structural-biology`. Shareable, bookmarkable, back-button-correct (`history.pushState` + `popstate`).
- **Mechanism (R13):** every project is pre-rendered into the HTML. JS toggles a `hidden` attribute. Therefore:
  - **JS off:** all projects visible, filter rail visible but inert (checkboxes render inside a `<form method="get" action="/projects">` with a `Filter` submit button — so filtering *still works* via a full page load, since the server-rendered page reads `Astro.url.searchParams` and applies the filter at build… **no.** *Correction:* the site is static, so query params cannot filter server-side. **Therefore, with JS off the filter rail is hidden entirely** (`.no-js .filter-rail { display: none }`) and all projects are shown. This is the honest degradation: no dead controls, no broken form.
  - **JS on:** instant, no network, no spinner, no layout shift.
- Result count announced via `aria-live="polite"`: `7 projects match.` Debounced.
- Zero results: `EmptyState` — `No projects match these filters.` + a `Clear filters` text button. **Never an illustration.**
- Responsive: sticky left rail (200px) ≥ `--bp-lg`; a `<details>` bar above the list at `--bp-md`; a full-screen focus-trapped sheet below that, triggered by a `Filter (2)` text button.

### 5.3 `/projects/[slug]` — the anatomy (R7)

**Six required fields produce a complete page.** Every body section is optional and is **omitted entirely** — never rendered as an empty heading.

**Layout ≥ `--bp-xl`:** `[200px TOC] [680px content] [220px margin]`.
**`--bp-lg`:** content + margin; TOC becomes a `<details>` under the header.
**< `--bp-lg`:** single column; sidenotes inline; experiments collapsed.

| # | Section | Source | Required? |
|---|---|---|---|
| 0 | `updated 2026-07-09` | derived `updatedAt` | auto. **No catalogue ID shown (R8).** |
| 1 | Status stamp | `status` | auto (the one stamp on the site) |
| 2 | Title | `title` | required |
| 3 | Thesis | `thesis` | required |
| 4 | Record block | frontmatter | auto — renders only the rows that have data |
| 5 | Problem | `## Problem` | optional |
| 6 | Motivation | `## Motivation` | optional |
| 7 | Research questions | `## Research questions` | optional |
| 8 | What I built | `## What I built` | optional |
| 9 | Architecture | `## Architecture` | optional |
| 10 | Experiments | `## Experiments` | optional |
| 11 | Findings | `## Findings` | optional |
| 12 | **Failures and dead ends** | `## Failures` | optional — **first-class** |
| 13 | Decisions | `## Decisions` | optional |
| 14 | Validation | `## Validation` | optional |
| 15 | Limitations | `## Limitations` | optional |
| 16 | Outputs | `outputs[]` | auto |
| 17 | Repositories | `repositories[]` | auto |
| 18 | **Updates** | `updates[]` | auto — a `Ledger` filtered to this project |
| 19 | Related writing | `relatedWriting[]` + shared topics | auto |
| 20 | Future work | `## Future work` | optional |
| 21 | Citation | derived | auto — `CiteBlock` (**this is where `PRJ-014` appears**) |

**The record block** (`MetadataList`) renders only rows with data: field, methods, tools, collaborators, started, updated, status, repositories, outputs. A minimal project shows four rows. That is correct and it looks fine.

**Failures** get the `--paper-sunk` ground and a 2px `--ink-500` left rule — visually **different**, never **lesser**. This is a permitted grouped surface (R14): the border encloses one semantic thing.

**Experiments** are repeated `<details>` blocks (open by default ≥ `--bp-lg`; the first open and the rest closed below). Each: a mono `EXP-01` label, a one-line hypothesis, setup, result, and a verdict chip (`supported` / `not supported` / `inconclusive`).

**Decisions** are a dated log. Each: `D-03 · 2026-02-11 · Switched from MSA depth filtering to per-column entropy`, 1–3 sentences of reasoning, and an outcome chip (`held` / `reversed` / `superseded`). Reversed decisions use a single-line strikethrough with the replacement following in `--orange-ink`.

**Updates on the project page (R9):** rendered by `Ledger` with `getLedger({ projectSlug, types: ['update'], limit: 5 })`, `showProject: false`. Below it, `all N updates →` expands the rest **in place** (a `<details>` — no permalink page, no navigation). Each row links to nothing (there is no permalink); rows with an optional `link` field link outward to the commit/preprint/issue.

### 5.4 Heading and TOC logic

- The MDX body's `<h2>`s become the TOC. `<h3>`s nest only when a section has ≥3 of them.
- Every `<h2>` gets an auto-generated `id` (GitHub-style slugification) and an `InsertionCaret` in the left margin.
- The TOC also injects **auto sections** that are not in the MDX body — `Outputs`, `Repositories`, `Updates`, `Related writing`, `Citation` — in their correct positions, so the TOC reflects the rendered page, not just the authored body. `src/utils/toc.ts` merges authored headings with auto-section headings and returns one ordered list.
- Fewer than 3 total headings → **no TOC** (a minimal project has none).

### 5.5 Print stylesheet

Project pages must print cleanly to A4: hairlines preserved, marginalia inlined, TOC dropped, all `<details>` forced open, the page URL in the footer. **A PI will print one.**

### 5.6 Fixtures required (each is a real file in `src/content/projects/`)

| Fixture | Asserts |
|---|---|
| `minimal-project` | Only the 6 required fields, empty body. Page renders: title, thesis, stamp, a 4-row record block, a citation block. **No empty headings. No TOC. No updates section.** No layout collapse. |
| `comprehensive-project` | Every field + every section + 6 updates + 3 outputs + 2 repos. TOC has 14 entries. |
| `active-project` | Stamp is `--orange`; appears in `Currently` if the Now entry references it. |
| `paused-project` | Stamp is `--ink-500`; the most recent update has `kind: paused` and a real reason; the reason is visible on the page. |
| `completed-project` | Stamp is `--ink-900`; has outputs; the updates list is historical. |
| `no-updates-project` | `updates: []`. The Updates section is **omitted**. The Ledger does not break. `updatedAt` falls back to `started`. |
| `many-updates-project` | 14 updates. Only 5 show; `all 14 updates →` expands the rest in place. |

### 5.7 Commit boundaries

| Commit | Message |
|---|---|
| 1 | `feat(projects): index page with editorial list view` |
| 2 | `feat(projects): status and field filters with URL state` |
| 3 | `feat(projects): no-JS degradation for the filter rail` |
| 4 | `feat(projects): detail layout with optional sections` |
| 5 | `feat(projects): record block, stamp and citation` |
| 6 | `feat(projects): experiments, decisions and failures treatments` |
| 7 | `feat(projects): embedded updates rendering and in-place expansion` |
| 8 | `feat(projects): TOC merging authored and auto sections` |
| 9 | `feat(projects): print stylesheet` |
| 10 | `test(projects): seven fixtures and their assertions` |

### Phase 5 acceptance criteria

- [ ] All seven fixtures exist and render. `minimal-project` renders with **zero empty headings** — asserted by a DOM test that finds no `<h2>` with no following sibling content.
- [ ] `ProjectStatusStamp` appears **exactly once** on every project page — a DOM-count assertion.
- [ ] The catalogue ID (`PRJ-\d{3}`) appears on the page **only inside the citation block** — asserted by a text-content regex that excludes the `.cite-block` subtree (R8).
- [ ] Filters: exactly two facets exist. A test asserts the filter rail contains no `method`, `tool` or `year` group (R12).
- [ ] Filter URL state round-trips: navigating to `/projects?status=paused` checks the box and hides the others; the back button restores the previous state.
- [ ] `aria-live` announces the result count on filter change.
- [ ] **JS off:** the filter rail is hidden, all projects are visible, no dead controls exist, and no console error is thrown.
- [ ] TOC omitted on `minimal-project`; present with 14 entries on `comprehensive-project`; includes the auto sections in the correct order.
- [ ] `many-updates-project` shows 5 updates and expands to 14 without navigation (R9 — no permalink route exists; a test asserts `dist/log/` contains no per-update pages).
- [ ] Print: a Playwright PDF render of `comprehensive-project` shows all `<details>` open, no nav, no TOC, and the URL in the footer.
- [ ] axe-core: zero violations on all seven fixtures.
- [ ] No horizontal overflow at any breakpoint on any fixture.

---

## Phase 6 — Writing and long-form reading

**Branch:** `phase-6-writing`
**Depends on:** Phases 2, 3
**Delivers:** `/writing`, `/writing/[slug]`, and the full `prose.css` typographic system — **the highest-craft surface on the site.**

### 6.1 `/writing`

- Grouped by year (mono year headings, hairline rules). `WritingRow` per piece.
- **Reviews appear in this feed**, labelled `REVIEW`, linking to `/reviews/[slug]`. They keep their own index too.
- **Volume I posts appear in the same list, in normal date order, at full contrast**, carrying a `VOLUME I` chip. They are **never** greyed, never marked "old", never `noindex`ed. (§0.1)
- **Featured:** up to 2, above the list, with a wider spread and a rule above/below.
- **Filter: `kind` only** (R12). Text links, not a rail: `All · Essays · Explainers · Reviews · Notes · Literature · Personal`. Same URL-state + client-side + hidden-with-JS-off mechanism as `/projects`.
- ≥ `--bp-xl`: hovering a row reveals its standfirst in the right margin. A genuinely nice use of the marginalia motif — and it does nothing at all on smaller screens, which is correct.

### 6.2 `/writing/[slug]` — the article

**Layout ≥ `--bp-xl`:** `[220px TOC] [640px text] [240px margin]`, centred as a group, 48px gutters.
**`--bp-lg`:** text + margin.
**< `--bp-lg`:** single column; sidenotes → inline `<details>`; TOC → `<details>`.

**Measure: 66ch, hard max 680px, at every breakpoint.** On a 1600px screen the *page* gets wider but the *text does not* — the extra space goes to the margins, which is what margins are for.

**Header:** the mono eyebrow (`ArticleMetadata`) → `<h1>` (Fraunces) → standfirst (Newsreader italic, 22px) → a 1px `--ink-900` rule at full text width → topic chips.

**`prose.css` — the body system** (this is the phase's core deliverable):

| Element | Spec |
|---|---|
| Paragraph | Newsreader 19px / 1.65, `--ink-900`, `margin-bottom: 1.5rem`. No indent. **Ragged right, no justification, hyphens off.** |
| `h2` | Fraunces 500, 28px, `margin-top: 3.5rem`, an `InsertionCaret` in the left margin, a 1px rule above at 1.25rem |
| `h3` | Plex Mono 600, 14px, uppercase, `+0.08em`, `--ink-500`, `margin-top: 2.25rem` |
| `h4` | Newsreader italic 19px. (If `h5`/`h6` are needed, the piece needs restructuring.) |
| `strong` | weight 600, **no colour change** |
| Inline link | `--orange-ink`, persistent 1px `--rule` underline, offset 3px. Discoverable without hover. |
| `ul` | `InsertionCaret` markers in `--orange`, `padding-left: 1.5rem`, item gap 0.5rem |
| `ol` | mono numerals |
| Blockquote | Newsreader 19px, `--ink-700`, 2px `--rule` left border, 1.5rem padding. **No italic. No giant quote glyph.** |
| Pull quote | Fraunces 500, 26px, breaking the measure by −40px on the left, a 2px `--orange` rule above, **no quotation marks**, attribution in mono below |
| Section break | A centred `‸ ‸ ‸` in `--orange`, 2rem margins — in place of a plain `<hr>` |
| Drop cap | **No.** (It fights the standfirst and looks affected on a 400-word note.) |
| Figures / captions / code / tables / callouts / notes | Per Phase 3 |
| Equations | KaTeX, **rendered at build**, MathML output on, KaTeX CSS subset inlined. **Zero client JS.** Display equations centred with a right-aligned mono number `(3)` when referenced. Every display equation carries an `aria-label` with a plain-language reading. **Rule for the author:** if an equation is essential to the argument, it must also be stated in prose. |

**Foot of article** (in order, each omitted if empty):

```
NOTES        1. …  2. …                    (numbered, mono — every Note appears here)
REFERENCES   [1] Kim, J. et al. (2026) …    DOI ↗
CITE         CiteBlock — plain citation + BibTeX + copy   ← WRT-031 lives here (R8)
REVISIONS    2026-07-05 — Fixed the units in Fig. 2.      (only if revisions[] exists)
RELATED      3 rows, WritingRow format
SERIES       A–Z: Genetics — ← previous · next →          (prev/next only; no series page in v1)
```

**Related-writing algorithm** (build-time, `src/utils/related.ts`): weight = same series (3) + shared project (2) + shared topic (1). Top 3. Heading is `Related`. **Never** "You might also like".

### 6.3 Progressive enhancement (R13)

| Feature | With JS | Without JS |
|---|---|---|
| TOC | Sticky, current section highlighted via `IntersectionObserver` (2px `--orange` left rule) | A plain static list of links. Works. |
| Reading progress | A 2px `--orange` line at the very top of the viewport, width = scroll through the **article body only**. `aria-hidden`. Not shown if the article is < 2 viewport heights. `requestAnimationFrame`-throttled, no CSS transition (a transitioned bar lags the scroll and feels broken). | Absent. Nothing breaks. |
| Sidenotes | Margin notes ≥ `--bp-xl` | Inline `<details>` + the foot-of-page list. Every note reachable. |
| Code copy button | Present | Absent (not present-and-broken) |
| Kind filter on `/writing` | Instant, URL state | Rail hidden, all pieces visible |

**The article must be fully readable, navigable and complete with JavaScript disabled.** This is tested, not assumed.

### 6.4 Print stylesheet (articles)

Hairlines preserved; nav/TOC/progress/search dropped; sidenotes inlined at their reference point; figures `page-break-inside: avoid`; references and the citation block retained; the URL in the footer; 11pt Newsreader; 20mm margins.

### 6.5 Fixtures required

| Fixture | Asserts |
|---|---|
| `short-note` | `kind: short`, ~180 words. **No TOC, no reading time, no progress bar, no related section if none exist.** Renders with dignity. |
| `long-essay` | 3500 words, 6 figures, 4 sidenotes, a pull quote, 12 references. TOC works, notes render in all three places. |
| `technical-article` | 4 code blocks (3 languages), 2 tables, 3 display equations. Shiki theme applied. KaTeX renders at build with **zero client JS** (asserted by a network-request count). |
| `article-with-references` | A full references section with DOIs. |
| `article-no-metadata` | Only the 6 required fields. No topics beyond one, no series, no relations, no revisions. **No empty foot sections.** |
| `volume-one-sample` | `volume: one`, `originalUrl` set, an `Annotation` callout, the `VOLUME I` chip, the dateline banner. |

### 6.6 Commit boundaries

| Commit | Message |
|---|---|
| 1 | `feat(writing): index grouped by year with kind filter` |
| 2 | `feat(writing): featured spread` |
| 3 | `feat(prose): the prose.css typographic system` |
| 4 | `feat(writing): article layout, header and standfirst` |
| 5 | `feat(writing): three-column layout with margin notes` |
| 6 | `feat(writing): build-time KaTeX with MathML and aria labels` |
| 7 | `feat(writing): foot-of-article — notes, references, cite, revisions` |
| 8 | `feat(writing): related-writing algorithm and series prev/next` |
| 9 | `feat(writing): TOC highlighting and reading progress (progressive)` |
| 10 | `feat(writing): article print stylesheet` |
| 11 | `test(writing): six fixtures and no-JS assertions` |

### Phase 6 acceptance criteria

- [ ] All six fixtures render correctly.
- [ ] `short-note`: no TOC, no reading time, no progress bar, no empty foot sections. Asserted by DOM absence.
- [ ] `article-no-metadata`: zero empty headings anywhere on the page.
- [ ] `technical-article`: **zero client-side JS requests for KaTeX or Shiki.** Asserted by a Playwright network assertion (`page.on('request')` count for `katex*` / `shiki*` = 0).
- [ ] Measure ≤ 680px at 1280, 1440 and 1600px. Asserted by a bounding-box test.
- [ ] Every `Note` appears in all three renderings; with JS disabled, all notes are reachable.
- [ ] **JS off:** TOC renders as a static list, article is fully readable, no dead controls, no console errors. Full-page screenshot committed.
- [ ] `prefers-reduced-motion`: the progress line still updates (it is not motion in the vestibular sense) but nothing transitions. Actually — **decision:** under reduced motion the progress line is **hidden** (it is purely decorative, and `aria-hidden`). Asserted.
- [ ] Reading time hidden for pieces < 3 minutes.
- [ ] Volume I posts appear in `/writing` in date order, at full contrast, with the `VOLUME I` chip and **no** "old"/"legacy"/"archived" string anywhere (asserted by `check:naming`).
- [ ] axe-core: zero violations on all six fixtures at 375px and 1280px.
- [ ] Print: a PDF render of `long-essay` inlines every sidenote and drops the chrome.
- [ ] Performance: an article page ships ≤ 8KB of JS (TOC + progress); CLS = 0.00.

---

## Phase 7 — Paper reviews

**Branch:** `phase-7-reviews`
**Depends on:** Phases 2, 3, 6
**Delivers:** `/reviews` and `/reviews/[slug]`.

### 7.1 The tension, and its resolution

Structured fields make reviews scannable and comparable — but a page of labelled fields is a database record, and nobody reads a database record.

**Resolution: prose first, structure second.** Every review opens with a **verdict paragraph** — 60–100 words of actual writing that says what the paper claims, whether it convinced the author, and why. The structured fields follow. A reader can read only the verdict and be well served.

### 7.2 Visual distinction — related, but structurally distinct

Reviews are recognisably The Starkonium Times. They are distinguished by **four devices**, none of which introduces a new colour scheme:

1. **Paper tint.** `--paper-review` (`#F3ECDE`) — one step warmer than the site cream. Immediately identifiable, never garish.
2. **The double rule** under the header (3px + 2px gap + 1px). A journal masthead device, used **only** on reviews and on `/archive`.
3. **The mono record block** at the top.
4. **The assessment strip**, which exists nowhere else on the site.

### 7.3 `/reviews` (index)

Not a table. A stack of **record entries** (`ReviewPreview`), reverse-chronological by *review* date, hairline-separated. Each shows: reviewed date, verdict chip, the full citation line (authors, year, journal, DOI ↗), the `verdictLine`, topic chips (inline), and a compact `AssessmentStrip` (squares only).

**Filters:** verdict and field. (Two facets, consistent with R12.)

### 7.4 `/reviews/[slug]` — required sections, in order

| # | Section | Source | Required |
|---|---|---|---|
| 1 | Record block | `paper` + `relation` + `reviewed` | required |
| 2 | **Verdict** | `## Verdict` | **required** — the prose paragraph, Newsreader 20px, above the fold |
| 3 | Assessment strip | `assessment` | required — 5 dimensions, each with its written justification |
| 4 | Central question | `## Central question` | required — one sentence, set as a pull quote |
| 5 | Methods | `## Methods` | required — 3–6 bullets, in the reviewer's words |
| 6 | Main claims | `## Main claims` | required — numbered `C1…Cn`, each with a chip: `supported` / `overstated` / `unsupported` / `not evaluated` |
| 7 | **Strongest contribution** | `## Strongest contribution` | **required — enforced by the schema check (Phase 2).** Every review must say what is good about the paper. This is a values decision, and it is what stops the section from becoming a demolition column. |
| 8 | Weaknesses | `## Weaknesses` | required — referencing claim numbers |
| 9 | Limitations | `## Limitations` | required — distinguished from weaknesses: things the authors acknowledge or that are inherent, vs. things they got wrong |
| 10 | **Reproducibility** | `reproduction` + `## Reproducibility` | required — a structured sub-block: code available (✓/✗ + link), data available, environment specified, seeds fixed, *did I attempt reproduction* and what happened. **This is the signature section** and it should be the most visually distinctive part of the page. |
| 11 | What I learned | `## What I learned` | required — prose, personal, often the best-written part |
| 12 | Open questions | `## Open questions` | required — bulleted; may be promoted into a project's research questions (link if so) |
| 13 | What I would do next | `## What I would do next` | required — the constructive turn |
| 14 | Overall assessment | `verdict` + `## Overall assessment` | required — a **verbal** verdict enum plus a closing sentence |
| 15 | Citation | derived | auto — `CiteBlock` (`REV-008` lives here) |

**The record block** carries: title, full author list (`et al.` after 6, with a `<details>` expand), journal + volume + pages, year, **DOI (always, linked)**, preprint link, a code/data availability chip (`code ✓ · data ✗`), the review date, and **the reviewer's relationship to the work** (`none` / `cited by me` / `competing work` / `collaborators`) — a small honesty affordance that no other site offers.

### 7.5 Scoring — the hard rule

**No aggregate numeric score.** Not in the schema, not derived, not in the JSON-LD, not in the OG image.

Where dimension ratings are used, **each rating carries a written justification** — enforced by the Zod type (`{ score, note }`), not by convention. A score without a sentence is a build error.

### 7.6 DOI and citation behaviour

- `paper.doi` present → renders as `doi:10.1038/…` linking to `https://doi.org/{doi}`, and is emitted as `<meta name="citation_doi" content="…">`.
- Absent → the record block prints `DOI — none recorded`, and the preprint URL is used. A review with neither produces a build **warning**.
- The review's *own* citation (`CiteBlock`) produces a BibTeX `@misc` entry with `note = {Review of {paper.title}}` and a `related` DOI field.
- **JSON-LD** (Phase 10): `schema.org/Review`, `itemReviewed: ScholarlyArticle` (with `sameAs: https://doi.org/…`), `author: Person`. **`reviewRating` is omitted** — the site does not produce an aggregate score, and inventing one for a crawler would be a lie. A test asserts `reviewRating` is absent from the emitted JSON-LD.

### 7.7 Commit boundaries

| Commit | Message |
|---|---|
| 1 | `feat(reviews): index with record entries and two filters` |
| 2 | `feat(reviews): review layout, paper tint and double rule` |
| 3 | `feat(reviews): record block with DOI and relation disclosure` |
| 4 | `feat(reviews): assessment strip with mandatory justifications` |
| 5 | `feat(reviews): reproducibility block` |
| 6 | `feat(reviews): citation and BibTeX for reviews` |
| 7 | `test(reviews): complete fixture and no-aggregate-score assertion` |

### Phase 7 acceptance criteria

- [ ] `reviews/complete-review.mdx` fixture exists with **every field populated** and every one of the 14 body sections present.
- [ ] A review missing `## Strongest contribution` **fails the build** (a bad fixture in `tests/fixtures/invalid/` proves it).
- [ ] A dimension with a `score` and no `note` **fails the build**.
- [ ] **No aggregate score exists anywhere:** a test greps the rendered HTML, the JSON-LD and the source for `averageScore`, `overallScore`, `totalScore`, `aggregateRating`, `reviewRating` and asserts zero matches.
- [ ] `--paper-review` is applied to `/reviews/[slug]` and to no other route. Asserted.
- [ ] The double rule appears on `/reviews/*` and `/archive` and nowhere else. Asserted by a component-usage grep.
- [ ] DOI renders as a working link; `citation_doi` meta tag is present.
- [ ] `AssessmentStrip` is announced correctly by a screen reader: each dimension is a `role="img"` with an `aria-label` containing the score **and** the justification.
- [ ] Reviews appear in `/writing` labelled `REVIEW`, linking to `/reviews/[slug]`.
- [ ] axe-core: zero violations. No horizontal overflow at any breakpoint.

---

## Phase 8 — Experience, About and Now

**Branch:** `phase-8-personal-pages`
**Depends on:** Phases 2, 3
**Delivers:** `/experience`, `/about`, `/now`, `/colophon`, `/topics`, `/topics/[slug]`, `/404`.

### 8.1 `/experience` — a single page, no detail routes

**The load-bearing distinction, stated on the page:**

> **Projects are organised by problem. Experience is organised by time and institution.**
> A project page answers *"what is this work?"*. An experience entry answers *"what did you do there, and who were you while you did it?"*

They cross-link heavily and duplicate nothing: the project page owns the methods and findings; the experience entry owns the **contribution**, the **decisions I was allowed to make**, and the **lessons**.

**Layout: a vertical spine.** A 1px `--ink-900` rule in the left gutter, with a small `--orange` square at each role's start year. Below `--bp-md` the spine is dropped and years become mono headings.

**Each entry is summary + expand** (a `<details>` — works without JS):
- **Collapsed:** organisation, position, dates, location, supervisor, the one-paragraph `context`, and four metadata rows (`CONTRIBUTION` truncated to one line, `METHODS`, `OUTPUTS`, `PROJECTS`).
- **Expanded:** the full anatomy — context, contribution (in full, first person, specific, honest about what was mine vs. the group's), methods, tools, decisions, challenges, results, outputs, presentations, skills, **lessons learned**, related projects, related writing.

**No `/experience/[slug]` routes in v1.** If an entry grows too long for the page, that is the trigger to add one — and it is a v2 decision, recorded in Appendix F.

**The CV.** `/cv.pdf` is a **hand-maintained two-page PDF** in `public/`. Auto-generating it from collections is a fun weekend and a permanent maintenance tax; formal CVs have conventions that fight a generic renderer. A build-time check **warns** if `cv.pdf` is more than 180 days older than the newest `experience` entry.

The download is a **text link with a mono file annotation** — `download CV — PDF · 2 pages · updated 2026-06` — never a filled button with a download icon.

**Print:** `/experience` has an excellent print stylesheet. Printing it produces a clean, long document. **That is the free "generated CV", and it is honest about being the long version.**

### 8.2 `/about`

1. **One photograph.** Warm-toned or black-and-white, not a corporate headshot, ideally at a bench or a desk with real mess. 320px wide, left, bio wrapping in two columns on desktop. Caption in mono: `Bengaluru, 2026.` **If no good photograph exists, ship without one.** Do not use an avatar illustration.
2. **Bio** — 150–250 words. Three paragraphs: what I work on and why it's hard; how I got here (brief, non-chronological); what I'm trying to become good at.
3. **How I work** — 4–6 one-sentence statements with caret markers. **They should be falsifiable and slightly uncomfortable.** *(e.g. "I do not trust a result I cannot rerun from a clean checkout." "I write the failure section first, because it's the part I'll want to skip.")*
4. **Curious about** — a short mono list of open questions. Allowed to be naive.
5. **Away from the bench** — literature, books, whatever is real. **This is what stops the site from being a CV.**
6. **Contact block** (§8.4).

**Forbidden copy** (enforced by `check:naming`): "passionate", "innovative", "cutting-edge", "leveraging", "at the intersection of", "results-driven", "aspiring", and the word "journey" in any form.

### 8.3 `/now`

The lightest page to update and one of the most rewarding to read.

- **Layout:** a definition list. Label column (mono 12px uppercase `--ink-500`, 140px, right-aligned) + content column (Newsreader 18px). Rows separated by 2rem of space, **no rules**. The calmest layout on the site.
- **Staleness, honestly:** the header shows `updated 2026-07-09 · 4 days ago`. Past 60 days, `· overdue` in `--ink-500`. No shame, just accuracy.
- **Location: city and institution only.** Enforced by the Phase 2 schema check. Never anything finer.
- **Lightweight update workflow:** `npm run new:now` copies the current entry to a new dated file and opens it. Change what changed, write a `ledgerNote`, commit. **Under two minutes.**
- **Feeds the Ledger:** only if `ledgerNote` is present (§2.9). Changing a typo in the reading list does not deserve a Ledger row; changing what you are building does.
- A footer line credits the `/now` page idea (Derek Sivers) and states the framing: *this is a lab notebook front page; it is meant to go stale and be replaced, not to be curated.*
- **`/now/archive` is deferred** (Appendix F) — it needs ≥3 entries to be interesting. The older entries exist as data from day one, so the page is a small addition later.

### 8.4 The contact block — not a page

Rendered at the foot of `/about`, at the foot of `/`, and in the footer. **There is no `/contact` route.** (An empty page with a form on it is the definition of a generic portfolio move.) For linking, `/about#contact`.

- Email is **plain text and copyable** — not a `mailto:` button, and **not obfuscated by JavaScript** (that breaks copy-paste). Build-time HTML-entity encoding is permitted.
- One line of copy under the email setting expectations. Human, and it pre-empts the "why didn't they reply" problem.
- **No contact form. No "Let's work together!". No calendar embed.**
- External links carry a mono `↗` (`aria-hidden`) and `rel="me"` where applicable (ORCID, GitHub — this also feeds `sameAs` in the JSON-LD).

### 8.5 `/colophon`

How the site is made: the three typefaces and why; the palette; the stack; the licences; and **the site revision history** (`rev. 1 — 2026-07-13 — first publication of Volume II`). This is where the revision number lives, since it no longer lives on the wordmark (R1). It is also where the §0.1 naming statement is published.

### 8.6 `/topics` and `/topics/[slug]`

- `/topics`: a browsable index grouped by facet (field / method / tool / theme), with entry counts. An excellent secondary navigation surface and an SEO asset.
- `/topics/[slug]`: everything referencing that topic, **grouped by content type** (Projects / Writing / Reviews / Experience). This is where the site's intellectual coherence becomes navigable: an essay about reproducibility, a project that had reproducibility problems, and an experience entry where reproducibility was the job all surface on one page.

### 8.7 `/404`

`No page here. This may be an old Starkonium Times link — try Volume I.` Plus links to `/archive`, `/writing` and `/search`. Centred (one of the three permitted centred surfaces). No illustration.

### 8.8 Commit boundaries

| Commit | Message |
|---|---|
| 1 | `feat(experience): spine layout with expandable entries` |
| 2 | `feat(experience): CV link and print stylesheet` |
| 3 | `feat(about): bio, how-I-work, curious-about, contact block` |
| 4 | `feat(now): definition-list layout with honest staleness` |
| 5 | `feat(now): new:now authoring script` |
| 6 | `feat(topics): index and topic pages grouped by type` |
| 7 | `feat(pages): colophon with naming statement and revision history` |
| 8 | `feat(pages): 404` |
| 9 | `test(pages): optional-content omission and a11y` |

### Phase 8 acceptance criteria

- [ ] **Optional content omitted cleanly:** fixtures for an experience entry with only the 7 required fields; a Now entry with only `date` + `location`; an About without a photograph. Each renders with **zero empty headings and zero empty labels**.
- [ ] `/experience` uses `<details>` and is fully expandable/collapsible **with JS off**.
- [ ] `/now` shows `· overdue` when the newest entry is > 60 days old. Asserted with a fixture dated in the past.
- [ ] The Now `location` schema check rejects a street address (already asserted in Phase 2; re-asserted here at the page level).
- [ ] No `/contact` route exists. A test asserts `dist/contact*` is absent.
- [ ] The email is present as plain, selectable text (not inside a `<button>`, not JS-injected). Asserted by reading the static HTML.
- [ ] `check:naming` finds zero forbidden words on `/about` ("passionate", "journey", etc.).
- [ ] `/experience` print render is clean and complete.
- [ ] `/topics/[slug]` groups by content type and shows counts.
- [ ] axe-core: zero violations on all five pages.

---

## Phase 9 — Volume I (the Blogger-era archive)

**Branch:** `phase-9-archive`
**Depends on:** Phases 2, 6
**Delivers:** `/archive`, the migration tooling, the migration manifest, and the imported Volume I articles.

> **R17 — decoupling.** The full 14-post import is **not** a gate on the ZIP deliverable. It **is** a hard gate on DNS cutover (Appendix G). If the Blogger export is unavailable when this phase runs, ship the tooling, the `/archive` page and the fixtures, and record `MIGRATION_STATUS: incomplete` in `RELEASE_MANIFEST.md` with the exact list of what remains.

> **Absolute constraint:** the live Blogger site is **read-only input**. No Blogger settings are changed. No `starkonium.com` DNS record is touched. Nothing is deleted from Blogger, ever — the export is committed to the repo as the permanent record.

### 9.1 The source

The current blog: **14 posts, April 2021 – September 2023**, across four label-series — *A–Z: Genetics* (1), *Industry / Industry Roundup* (5), *History of DNA* (4), *Origins of Life* (2). Images are hosted on `blogger.googleusercontent.com` and **have no alt text**.

### 9.2 Branding (§0.1, restated because this is where it matters most)

**The entire website is The Starkonium Times.** Volume I is not a separate publication, not an "archive of the old site", and not a lesser thing. It is the first volume of this publication.

- `/archive` is the **Volume I front page**, with its own masthead (`THE STARKONIUM TIMES` in Fraunces + the double rule) and a mono dateline: `Volume I · 14 pieces · April 2021 — September 2023`.
- Volume I posts live at `/writing/[slug]` like everything else, carry `volume: one`, and appear in `/writing` **in normal date order, at full contrast**, with a `VOLUME I` chip.
- Their article pages use the standard template, plus a dateline banner above the title: `Volume I · published 2022-04-10 · unedited`.
- **Never:** greyed out, `noindex`ed, hidden, collapsed, or labelled "old", "legacy", "archived" or "outdated". `check:naming` enforces this.

**Required copy — the author's note on `/archive`.** ~150 words, written in the present, stating: what this was, what the author was trying to do, what they would now say differently, and **an explicit statement that nothing has been edited or deleted**. This note is the most important piece of copy on the page. It turns the archive from a liability into a display of intellectual honesty.

### 9.3 The migration pipeline

```
migration/
  raw/                        # .gitignored — the Blogger Atom XML export lands here
  blogger-export.xml          # COMMITTED — the permanent record, never deleted
  manifest.csv                # COMMITTED — the migration manifest (§9.4)
  images/                     # COMMITTED — rehosted originals, pre-optimisation
scripts/
  migrate-blogger.mjs         # Atom XML → MDX + manifest rows
  migrate-images.mjs          # download → src/content/writing/_images/ → rewrite refs
  check-migration.mjs         # validates the manifest and the imported content
```

**`scripts/migrate-blogger.mjs`** — a one-off, idempotent, **non-destructive** script:

1. Parse `migration/blogger-export.xml`.
2. For each post: extract title, published date, updated date, labels, body HTML, and the original permalink.
3. Convert body HTML → Markdown (`turndown`), preserving headings, lists, emphasis, links and images.
4. Emit `src/content/writing/{slug}.md` with frontmatter: `id: WRT-0NN` (assigned in publication order, starting at `WRT-001`), `title`, `kind: explainer` (default; **manually reviewed**), `published` (the original date, **exactly**), `standfirst` (**must be hand-written** — the script emits a `TODO:` marker and the build fails until it is replaced), `topics` (mapped from labels), `series` + `seriesIndex` where the labels indicate one, `volume: one`, `originalUrl`.
5. Append a row to `migration/manifest.csv`.
6. **Never overwrite an existing file.** Re-running the script on an already-migrated post is a no-op with a log line.

**Manual review of all 14 is mandatory.** The corpus is small enough that a machine-perfect conversion is not worth chasing, and a human read-through catches the things that matter. The checklist lives in `docs/migration-review.md` and each post is signed off in the manifest's `notes` column.

**`scripts/migrate-images.mjs`:**

1. Find every `blogger.googleusercontent.com` reference across the imported posts.
2. Download each (~20 images) to `migration/images/` and then to `src/content/writing/_images/{slug}/`.
3. Rewrite the Markdown references to `astro:assets` imports.
4. **Emit an `alt: TODO` marker for every image.** The build **fails** while any `TODO` remains. **This is the single biggest accessibility improvement in the migration** — the originals have no alt text, and every one must be written by hand.

### 9.4 The migration manifest (`migration/manifest.csv`)

Committed, human-editable, and validated by `scripts/check-migration.mjs`.

| Column | Type | Notes |
|---|---|---|
| `old_url` | string | The full Blogger permalink, e.g. `https://www.starkonium.com/2023/09/1-z-alleles-and-chromosomes.html` |
| `new_url` | string | e.g. `/writing/alleles-and-chromosomes` |
| `id` | string | `WRT-001` |
| `title` | string | The original title, **unchanged** |
| `published` | date | The original publication date, **unchanged** |
| `labels` | string | Semicolon-separated original Blogger labels |
| `topics` | string | Semicolon-separated mapped topic slugs |
| `series` | string | Mapped series slug, or empty |
| `migration_status` | enum | `pending` / `converted` / `reviewed` / `verified` |
| `image_count` | int | |
| `image_status` | enum | `pending` / `downloaded` / `alt-written` / `verified` |
| `redirect_status` | enum | `pending` / `mapped` / `tested` |
| `standfirst_status` | enum | `todo` / `written` |
| `notes` | string | The reviewer's sign-off and anything unresolved |

**A post is not `verified` until:** `migration_status: reviewed`, `image_status: alt-written`, `standfirst_status: written`, and `redirect_status: mapped`.

### 9.5 Redirects

`src/redirects.ts` exports a map, consumed by Astro's `redirects` config (which emits static redirect pages) **and** by `public/_redirects` (Cloudflare's format, emitted at build by a small script), so redirects work identically on either host.

**Coverage required:**
- All 14 post permalinks → their new URLs (301).
- Blogger label archives: `/search/label/Industry` → `/topics/{mapped-slug}` (301).
- Blogger monthly archives: `/2022/04/` and `/2022_04_01_archive.html` → `/archive` (301).
- The Blogger feed: `/feeds/posts/default` → `/rss.xml` (301).

### 9.6 Rules for the migration — non-negotiable

- **Nothing is edited.** Typos, exuberant capitals, opinions the author has since abandoned, exclamation marks — all preserved. Corrections happen as **annotations** (dated `Callout variant="erratum"` or margin `Note`s), **never as silent edits.** This is the site's central claim about itself, and the migration is the first place it is tested.
- **Original publication dates are sacred.** A 2021 post is dated 2021 everywhere: in the list, in the RSS feed, in the JSON-LD, in the sitemap, in the OG image.
- **No `noindex` on Volume I.**
- **Blogger comments are not migrated.** If a comment is valuable, quote it in an annotation, with attribution.
- **The `standfirst` must be written by hand** for every imported post. Blogger posts have no standfirst, and a truncated first paragraph is not one. This is real editorial work and there is no shortcut.

### 9.7 Annotations (R17-adjacent — partial is fine)

Ship the `Annotation` mechanism plus **2–3 good annotations at launch**. A full annotation pass over all 14 posts is deferred (Appendix F). An annotated 2022 post is *better* content than a 2026 post, because it demonstrates change over time — but three good ones demonstrate the feature better than fourteen perfunctory ones.

### 9.8 Commit boundaries

| Commit | Message |
|---|---|
| 1 | `feat(migration): blogger export parser and MDX emitter` |
| 2 | `feat(migration): image downloader and reference rewriter` |
| 3 | `feat(migration): manifest format and validator` |
| 4 | `feat(archive): Volume I front page with masthead and author's note` |
| 5 | `feat(writing): Volume I dateline banner and chip` |
| 6 | `feat(migration): redirect map for posts, labels, archives and feed` |
| 7 | `content(migration): import and hand-review all 14 Volume I posts` |
| 8 | `content(migration): alt text for all imported images` |
| 9 | `content(migration): standfirsts for all 14 posts` |
| 10 | `feat(archive): annotations on three Volume I posts` |
| 11 | `test(migration): manifest, slug, date and image assertions` |

### Phase 9 acceptance criteria

- [ ] **No broken imported images.** Zero references to `blogger.googleusercontent.com` remain anywhere in `src/` or `dist/`. Asserted by a grep test.
- [ ] **Every imported image has hand-written alt text.** Zero `TODO` markers. The build fails otherwise.
- [ ] **Publication dates preserved exactly.** A test compares each imported post's `published` against the `manifest.csv` value against the raw XML. Three-way match required.
- [ ] **No duplicate slugs** across the whole `writing` collection.
- [ ] **Redirect manifest validation:** every `old_url` in the manifest has a redirect entry; every redirect target resolves to a page that exists in `dist/`. Zero orphans, zero dangling targets.
- [ ] **Link checking:** `linkinator` finds zero broken internal links across the whole build, including within imported posts (Blogger posts often link to each other).
- [ ] **Manual review checklist complete:** all 14 rows in `manifest.csv` are `verified`, with a sign-off in `notes`. If any are not, `MIGRATION_STATUS: incomplete` is recorded in the release manifest with the exact outstanding list (R17).
- [ ] **Naming:** `check:naming` finds zero instances of "legacy", "old blog", "previous site", "outdated", or "The Starkonium Times archive" in any user-facing string.
- [ ] Volume I posts appear in `/writing` at full contrast, in date order, with no visual demotion.
- [ ] `/archive` has the double rule, the Volume I dateline, the series index, and the author's note.
- [ ] **The live Blogger site is unchanged.** Stated explicitly in the phase report. No credentials were used, no settings touched.

---

## Phase 10 — Search, RSS, SEO and metadata

**Branch:** `phase-10-search-seo`
**Depends on:** Phases 4–9
**Delivers:** search (dialog + page), three RSS feeds, sitemap, robots, canonicals, OG images, JSON-LD.

### 10.1 Search — Pagefind

**Chosen: [Pagefind](https://pagefind.app).** Static, built at build time from the emitted HTML, supports filters and metadata, ~40KB of JS loaded **only when the dialog opens**, no server, no API key, no index-size problem at this scale, and it degrades to a real `/search` page. Nothing else is close for a static site of this shape.

Wired into `npm run build` as a post-step: `astro build && pagefind --site dist`.

**Indexed content types (all six required):** projects, writing, reviews, **project updates**, experience, topics.

> Project updates are embedded in project frontmatter (R9) and therefore have no page of their own to index. **Solution:** the project page renders each update's summary inside a `data-pagefind-body`-scoped block with `data-pagefind-meta="type:update"` and `data-pagefind-weight="0.6"`, so updates are individually findable and their results link to `/projects/{slug}#updates`. Verified by an index test.

**Pagefind metadata emitted per page:** `type` (project/writing/review/update/experience/topic), `title`, `id`, `kind`, `status`, `field`, `year`, `volume`, and `excerpt` (the `thesis` / `standfirst` / `verdictLine`).

**Excluded from the index** (`data-pagefind-ignore`): the site header, the footer, the TOC, the marginalia rail, the homepage Ledger rows (they would double-index every update), the filter rails, and all `draft: true` content (which is not in `dist/` at all).

**The dialog (⌘K / Ctrl-K):**

- Results **grouped by content type**, in a fixed order: Projects, Writing, Reviews, Updates, Experience, Topics. **Never one undifferentiated list.**
- Each result: title + a one-line highlighted excerpt. (The catalogue ID is **not** shown — R8.)
- Full keyboard operation: `↑`/`↓` navigate, `Enter` opens, `⌘Enter` opens in a new tab, `Esc` closes and restores focus to the trigger. Focus trapped. `role="dialog"`, `aria-modal="true"`, labelled.
- **Empty state before typing:** the 6 most recent Ledger entries under a `Recent` heading. Useful, and it teaches what the site contains.
- **No results:** `Nothing found for "chromatin loop". Try a broader term, or browse the topic index.` + a link to `/topics`.
- Debounce 120ms. **No spinner** (results arrive faster than a spinner is legible). If a query exceeds 400ms, a mono `…searching` line appears in place of results.
- **The one shadowed surface on the site:** `--shadow-dialog`.

**`/search` (the full page):**

- The same index, with the type filter. This is the no-JS fallback target of the header's `<form action="/search" method="get">` — so with JS off, pressing the search trigger lands here with the query in the URL. The page then... **cannot search without JS** (Pagefind is client-side). **Therefore:** with JS off, `/search` renders an honest `EmptyState` explaining that search requires JavaScript, plus **a complete, browsable index of everything on the site** grouped by type (which is genuinely useful and costs nothing — it is the same data the Ledger and the indexes already have). **No dead controls, no lie.**

### 10.2 RSS — three feeds

| Feed | Contents |
|---|---|
| `/rss.xml` | Everything: articles, reviews, project updates, Now notes. The full Ledger, essentially. |
| `/rss/writing.xml` | Articles + reviews only. |
| `/rss/log.xml` | Project updates only — so a collaborator can subscribe to the *work*, not the essays. |

- **Full content** in `<content:encoded>` for articles — not excerpts. This is a site that wants to be read; a truncated feed is a growth tactic, and there is no growth tactic here.
- Each item carries its `id`, `kind` and topics as `<category>` elements.
- Channel title: **The Starkonium Times** (never "Starkonium").
- Update items (which have no permalink, R9) use `/projects/{slug}#updates` as their `<link>` and a `<guid isPermaLink="false">` built from the Ledger `key` — stable across rebuilds, so feed readers do not re-notify. **A test asserts guid stability across two builds.**
- Volume I posts appear in the feeds with their **original 2021–2023 dates**.
- `<link rel="alternate" type="application/rss+xml">` on every page.

### 10.3 Sitemap, robots, canonicals

- `sitemap-index.xml` + per-collection sitemaps, via `@astrojs/sitemap`. `lastmod` from `updatedAt`. **Drafts excluded.** `/dev/*` excluded. Priority not set (Google ignores it).
- **Canonical URLs:** absolute, `https://starkonium.com/...`, **no trailing slash** (`trailingSlash: 'never'`, `build.format: 'file'`). One form, enforced.
- Volume I posts: canonical points at the **new** URL. `originalUrl` is recorded in frontmatter and shown in the archive dateline for provenance — it is **not** a canonical.
- **`robots.txt`:** allow all; `Disallow: /search`; `Disallow: /dev/`; sitemap linked.
  **Preview environments emit `Disallow: /` instead** — driven by `PUBLIC_SITE_URL` / a `PREVIEW` env flag (Phase 13). A test asserts the preview build's robots.txt blocks everything and the production build's does not.
- **AI crawlers are allowed.** The writing is CC BY 4.0 and the point is for it to be read. (Design-spec OD-7, closed: allow. This is a values call the author has now made consciously; flipping it is a one-line change in `robots.txt`.)

### 10.4 OG images

Generated at build with **Satori + resvg**. A **typographic template**, not a screenshot, not a photo, not a gradient.

```
┌──────────────────────────────────────────────────────────┐  1200 × 630
│  THE STARKONIUM TIMES                          PRJ-014   │  cream #F6F1E7
│  ───────────────────────────────────────────────────     │  1px ink rule
│                                                          │
│  Fold-switch propensity from                             │  Fraunces 500, 62px
│  coevolutionary signal                                   │  ink, max 3 lines
│                                                          │
│  ┌──────────┐                                            │
│  │  ACTIVE  │   structural biology · coevolution         │  stamp + mono meta
│  └──────────┘                                            │
│  ───────────────────────────────────────────────────     │
│  {{AUTHOR}}                              starkonium.com  │  mono 20px, umber
└──────────────────────────────────────────────────────────┘
```

- The **full publication name** appears here (`THE STARKONIUM TIMES`), not the compact wordmark — this is a share card, and it needs to say what it is.
- **This is one of the four places the catalogue ID appears** (R8): top-right, small, mono.
- Variants: projects show the status stamp; articles show `ESSAY · 12 min`; reviews show the verdict and the journal; the homepage shows the statement.
- **Never** a stock image, never a photo, never a gradient.

### 10.5 Structured data (JSON-LD)

| Page | Type |
|---|---|
| All | `WebSite` (name: *The Starkonium Times*, with `SearchAction`), `Person` (`{{AUTHOR}}`, with `sameAs`: GitHub, ORCID, Scholar, LinkedIn) |
| Article | `BlogPosting` — `headline`, `datePublished`, `dateModified`, `author`, `keywords` (topics), `wordCount`, `image` |
| Review | **`Review`** with `itemReviewed: ScholarlyArticle` (incl. `sameAs: https://doi.org/…`), `author: Person`. **`reviewRating` omitted** (§7.6). |
| Project | `CreativeWork` + a `SoftwareSourceCode` node per repository (`codeRepository`, `programmingLanguage`, `license`) |
| Experience | Folded into the `Person` graph (`alumniOf`, `worksFor`, `hasOccupation`) |
| About | `ProfilePage` |
| Indexes | `CollectionPage` + `BreadcrumbList` |

Reviews additionally emit `<meta name="citation_doi">`.

### 10.6 Metadata rules

- Titles: `{title} — The Starkonium Times`. Never exceed 60 characters before the suffix; `seoTitle` overrides.
- Descriptions: `thesis` (projects) / `standfirst` (articles) / `verdictLine` (reviews), truncated at 155 chars on a word boundary. Hand-written for index pages.
- **No share buttons on the site.** (They are tracking surfaces and nobody uses them.)
- **No analytics in v1.** (Appendix F.)
- **No third-party network requests. Zero.** No fonts CDN, no analytics, no embeds, no GitHub API. Asserted by a Playwright network test.

### 10.7 Commit boundaries

| Commit | Message |
|---|---|
| 1 | `feat(search): pagefind indexing with per-type metadata` |
| 2 | `feat(search): update indexing on project pages` |
| 3 | `feat(search): ⌘K dialog with grouped results and focus trap` |
| 4 | `feat(search): /search page with no-JS browsable index fallback` |
| 5 | `feat(rss): three feeds with stable guids` |
| 6 | `feat(seo): sitemap, robots and canonical URLs` |
| 7 | `feat(seo): Satori OG image generation` |
| 8 | `feat(seo): JSON-LD for all page types` |
| 9 | `test(seo): metadata snapshots, feed and sitemap validation` |

### Phase 10 acceptance criteria

- [ ] **Search index verification:** a test asserts the Pagefind index contains at least one entry of each of the six types (project, writing, review, **update**, experience, topic).
- [ ] **Empty-search behaviour:** the dialog before typing shows the 6 most recent Ledger entries. A no-result query shows the honest message and the `/topics` link.
- [ ] **Keyboard accessibility:** the dialog opens with ⌘K, traps focus, navigates with arrows, opens with Enter, closes with Esc, and returns focus to the trigger. axe: zero violations with the dialog open.
- [ ] **JS off:** the search trigger lands on `/search`, which renders a complete browsable index grouped by type. **No dead control, no broken form, no lie about what is available.**
- [ ] **RSS validation:** all three feeds pass the W3C feed validator. `guid`s are byte-identical across two consecutive builds (asserted).
- [ ] **Sitemap validation:** valid XML, drafts absent, `/dev/*` absent, `lastmod` matches `updatedAt`.
- [ ] **Canonical checks:** every page has exactly one absolute canonical, with no trailing slash. Asserted across all of `dist/`.
- [ ] **Metadata snapshot checks:** committed snapshots of the emitted `<head>` for one page of each type. A change to title/description/OG/JSON-LD structure fails the test until the snapshot is updated deliberately.
- [ ] **JSON-LD validates** in the Rich Results Test for `Person`, `BlogPosting`, `Review` and `CreativeWork`. `reviewRating` is absent.
- [ ] **OG images generate** for every project, article and review. Each is ≤ 120KB and contains the full publication name.
- [ ] **Zero third-party network requests** on any page. Asserted.
- [ ] Preview builds emit `Disallow: /`; production builds do not.

---

## Phase 11 — Quality hardening

**Branch:** `phase-11-hardening`
**Depends on:** Phases 0–10
**Delivers:** the full validation suite, the enforced budgets, and a documented QA record. **No new features.**

### 11.1 Performance budgets — enforced, not aspirational

`scripts/check-budget.mjs` runs against `dist/` after every build and **exits non-zero on any breach.**

| Metric | Budget | Notes |
|---|---|---|
| **HTML** (article page, gzipped) | ≤ 35KB | |
| **CSS** (total, gzipped) | ≤ 20KB | One stylesheet, no per-route CSS bloat |
| **JS — article page** | **≤ 8KB** | TOC observer + reading progress (R13 relaxed this from 2KB) |
| **JS — index pages** | ≤ 10KB | Filters |
| **JS — any page before interaction** | ≤ 12KB | |
| **JS — search** | ≤ 45KB | **Loaded only on ⌘K.** Not counted against the page budget. |
| **Fonts** | ≤ 150KB total | 3 families, subset, 2 preloads per page (R5) |
| **Images** | ≤ 200KB per page above the fold; every image AVIF/WebP with explicit `width`/`height` | |
| **OG images** | ≤ 120KB each | |
| **Third-party requests** | **0** | Absolute |
| **LCP** (mobile, throttled 4G) | ≤ 1.2s | |
| **CLS** | **0.00** | No exceptions. Fonts are metric-matched; images have dimensions. |
| **INP** | ≤ 100ms | |
| **Lighthouse** | perf ≥ 98 · a11y **100** · best-practices **100** · SEO **100** | Run on: `/`, a project, an article, a review, `/writing`, `/experience` |

### 11.2 The full validation suite

```bash
npm run validate:full
```

| Step | Tool | Automated? |
|---|---|---|
| Formatting | `prettier --check` | ✅ |
| Linting | `eslint --max-warnings 0` | ✅ |
| Type checking | `astro check && tsc --noEmit` | ✅ |
| Unit tests | Vitest | ✅ |
| **Content-schema tests** | Vitest + `check-content.mjs` (incl. every invalid fixture) | ✅ |
| **Route-generation tests** | A test asserts the exact set of routes in `dist/` matches a committed list. **Catches accidental route creation** (e.g. a `/log/[date]` page sneaking back in, or `/dev/*` leaking). | ✅ |
| **Naming enforcement** | `check-naming.mjs` — greps `dist/` for the forbidden strings (§0.1) and the forbidden copy (§8.2) | ✅ |
| **Design-system enforcement** | ESLint/stylelint rules: `border-radius` ∈ {0, 50%}; `box-shadow` only on `.search-dialog`; `--orange` never in a `color:` declaration | ✅ |
| **Contrast** | `check-contrast.mjs` — every token pair in §1.3 | ✅ |
| **Internal link checking** | `linkinator` over `dist/` — zero broken internal links; external links warn only | ✅ |
| **Accessibility** | `@axe-core/playwright` on every page type at 375px and 1280px — **zero violations** | ✅ |
| **Keyboard** | Playwright: tab order, focus visibility, focus trapping (dialog, menu, filter sheet), no traps, code blocks focusable | ✅ |
| **No-JS** | Playwright with `javaScriptEnabled: false` on every page type: content complete, no dead controls, no console errors | ✅ |
| **Reduced motion** | Playwright with `prefers-reduced-motion: reduce`: no transitions run; every feature still works; the progress line is hidden | ✅ |
| **Responsive** | Playwright: no horizontal overflow at 320/375/768/1024/1280/1440/1600 and at 400% zoom | ✅ |
| **Print** | Playwright PDF render of an article, a project and `/experience`; asserts chrome dropped, `<details>` open, sidenotes inlined | ✅ (structure) / ⚠️ (visual quality — manual) |
| **Lighthouse** | `lighthouse-ci` against `npm run preview` with the budgets in §11.1 | ✅ |
| **Production build** | `npm run build` — zero warnings that are actually errors; the emitted `dist/` is complete | ✅ |
| **Clean-checkout test** | A CI job that clones the repo fresh, runs `npm ci && npm run validate:full` | ✅ |
| **Secret scan** | `check-secrets.mjs` — regex scan for key-shaped strings, `.env` files, tokens, private keys | ✅ |

### 11.3 What still requires manual inspection

Automated tests cannot judge these. They are checked by hand, recorded with screenshots in `docs/qa/`, and signed off before release.

| Item | Why it cannot be automated |
|---|---|
| **Typographic quality** — rag, widows, orphans, heading balance, the measure at real reading distance | Only a human eye |
| **The orange count** (≤ 4 per viewport) | Automatable as a heuristic (and is), but the *judgement* of whether an orange element earns its place is not |
| **Does the Ledger feel alive?** | The core product question. If it looks thin and sad, the design is wrong (R15 forbids fixing this by fabricating content) |
| **Do the standfirsts sell the pieces?** | They are prose, not metadata |
| **Is the status honest?** | A `paused` project with a real reason vs. a fake `active` one |
| **The status stamp's −1.5° rotation** — does it read as a stamp or as a mistake? | |
| **Volume I posts at full contrast** — do they *feel* demoted despite passing the automated checks? | |
| **Print output quality** | Structure is testable; beauty is not |
| **The alt text** — is it *meaningful*, not just present? | A test can assert non-empty; only a human can assert useful |
| **The author's note on `/archive`** — is it worth reading? | |

### 11.4 Commit boundaries

| Commit | Message |
|---|---|
| 1 | `test(a11y): axe suite across every page type` |
| 2 | `test(keyboard): tab order, focus traps and visibility` |
| 3 | `test(no-js): every page type without JavaScript` |
| 4 | `test(responsive): overflow and zoom across seven widths` |
| 5 | `test(motion): reduced-motion assertions` |
| 6 | `test(print): PDF structure assertions` |
| 7 | `test(routes): route-generation snapshot` |
| 8 | `feat(scripts): budget, contrast, naming and secret checks` |
| 9 | `ci: lighthouse-ci with enforced budgets` |
| 10 | `ci: clean-checkout job` |
| 11 | `docs(qa): manual inspection record with screenshots` |

### Phase 11 acceptance criteria

- [ ] `npm run validate:full` passes from a clean checkout, with output pasted in the phase report.
- [ ] Every budget in §11.1 is **enforced by a script that fails the build**, not merely documented.
- [ ] The route-generation snapshot exists and is exact. `/dev/*`, `/log/[date]-*`, `/experience/[slug]`, `/series/*` and `/now/archive` are **absent** from it (they were never built — R9/R10/R11 and the v1 scope).
- [ ] Zero axe violations across every page type at both breakpoints.
- [ ] Zero broken internal links.
- [ ] Zero third-party requests.
- [ ] CLS = 0.00 on every page type.
- [ ] `docs/qa/` contains the manual-inspection record: dated, with screenshots, with each item in §11.3 explicitly signed off or flagged.
- [ ] No new features were added in this phase. (A diff review confirms it.)

---

## Phase 12 — Documentation and GitHub preparation

**Branch:** `phase-12-documentation`
**Depends on:** Phases 0–11
**Delivers:** everything a future maintainer (including the author, in a year) needs.

### 12.1 Documents

```
README.md                        # the front door
docs/
  setup.md                       # local development from zero
  authoring/
    projects.md                  # how to add a project
    updates.md                   # how to post a project update (the 60-second workflow)
    articles.md                  # how to write an article
    reviews.md                   # how to write a paper review
    now.md                       # how to update /now
  migration.md                   # the Blogger → Volume I pipeline, end to end
  migration-review.md            # the 14-post manual review checklist
  deployment.md                  # Cloudflare Pages, preview environments
  dns-cutover.md                 # the future cutover checklist (= Appendix G). NOT executed.
  conventions.md                 # commit format, branch naming, content conventions
  release.md                     # the release checklist
  security.md                    # secrets policy (there are none) and what to do if that changes
  adr/
    0001-astro-static.md
    0002-npm-over-pnpm.md
    0003-no-ui-framework.md
    0004-vanilla-css-over-tailwind.md
    0005-three-font-families.md
    0006-orange-two-token-split.md
    0007-embedded-project-updates.md      # R9 — and how to migrate to a collection later
    0008-volume-naming-system.md          # §0.1
    0009-pagefind-for-search.md
    0010-no-aggregate-review-score.md
    0011-hand-maintained-cv-pdf.md
  qa/                            # the manual-inspection records from Phase 11
```

**README** — required sections:
1. **The Starkonium Times** — what it is, one paragraph.
2. Requirements: Node 22 (`.nvmrc`), npm 10.
3. Quick start: `npm ci && npm run dev`.
4. Scripts table (every script in `package.json`, with a one-line purpose).
5. Repository layout (the tree from §Repository structure, annotated).
6. Content authoring — a table linking to each `docs/authoring/*.md`.
7. **The naming system** (§0.1) — stated prominently, because it is the thing most likely to drift.
8. Licences: **MIT** (code) / **CC BY 4.0** (content).
9. **"Not touching production"** — an explicit notice that this repository does not affect the live Blogger site or `starkonium.com` DNS, and that cutover is a separate, documented, un-executed procedure (`docs/dns-cutover.md`).

**`docs/authoring/updates.md`** deserves special care. It documents the **60-second workflow**, because *the site's entire thesis depends on the author actually posting*:

```bash
npm run new:update
# → prompts: project? kind? summary?
# → appends an entry to the project's frontmatter
git commit -am "PRJ-014: validation rebuilt" && git push
# → live in ~60 seconds
```

And the phone workflow: edit the project's `.md` file in the GitHub mobile web editor, add four lines to `updates:`, commit. **This must be tested by the author before release** (it is an acceptance criterion in Appendix E).

### 12.2 GitHub configuration

**`.github/workflows/ci.yml`** (final form)

```yaml
name: CI
on:
  push: { branches: [main] }
  pull_request:
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version-file: .nvmrc, cache: npm }
      - run: npm ci
      - run: npm run validate
      - run: npm run build
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
      - run: npm run check:budget
      - run: npm run check:links
      - run: npm run check:secrets
      - uses: actions/upload-artifact@v4
        if: failure()
        with: { name: playwright-report, path: playwright-report/ }

  clean-checkout:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version-file: .nvmrc, cache: npm }
      - run: npm ci
      - run: npm run validate:full
```

**`.github/pull_request_template.md`** — short. Phase, what changed, validation output pasted, acceptance criteria checked.

**`.github/ISSUE_TEMPLATE/`** — two only: `content.md` (a piece to write / a project to add) and `bug.md`. **Nothing more.** This is a one-person repository; issue-template bureaucracy is a smell.

**`.github/dependabot.yml`** — weekly, npm ecosystem, grouped minor+patch into a single PR, majors separate. Appropriate here: it is a static site with a small dependency tree, and a stale Astro is a real risk over a year.

**No CODEOWNERS, no CONTRIBUTING.md, no CODE_OF_CONDUCT.md, no PR-size bot, no changelog automation.** One person. Do not manufacture process.

### 12.3 Commit boundaries

| Commit | Message |
|---|---|
| 1 | `docs: README with naming system and production notice` |
| 2 | `docs: setup and conventions` |
| 3 | `docs: authoring guides (projects, updates, articles, reviews, now)` |
| 4 | `docs: migration guide and review checklist` |
| 5 | `docs: deployment guide and DNS cutover checklist (not executed)` |
| 6 | `docs: architecture decision records` |
| 7 | `docs: security, secrets and release checklists` |
| 8 | `ci: final workflow with clean-checkout job` |
| 9 | `chore(github): PR template, two issue templates, dependabot` |

### Phase 12 acceptance criteria

- [ ] Every document listed in §12.1 exists and is non-trivial (no stubs, no `TODO`).
- [ ] The README's naming section states §0.1 exactly.
- [ ] The README contains the explicit **"this repository does not touch production"** notice.
- [ ] 11 ADRs exist, each stating: context, decision, consequences, and *what would make us reverse it*.
- [ ] `docs/dns-cutover.md` is clearly marked **informational — not part of this implementation**.
- [ ] CI passes on a fresh PR, including the `clean-checkout` job.
- [ ] Dependabot config validates.
- [ ] A stranger could clone the repo and get to `npm run dev` using only the README.

---

## Phase 13 — Deployment preview

**Branch:** `phase-13-deployment`
**Depends on:** Phases 0–12
**Delivers:** a live preview deployment, built from GitHub, on a temporary domain. **No production DNS is touched.**

### 13.1 Host — Cloudflare Pages (primary recommendation)

**Chosen: Cloudflare Pages.** Both Cloudflare and Vercel are excellent for a static Astro site. Cloudflare wins here on four specific grounds:

1. **Bandwidth.** Free and unmetered, with no commercial cliff. The site may get a traffic spike from a single well-shared essay, and that should not produce a bill or a throttle.
2. **Edge quality for this audience.** The author is in Bengaluru and the readers are global. Cloudflare's edge is the strongest for a globally-scattered, low-volume readership.
3. **No framework lock-in.** The site is `output: 'static'` — it is a folder of files. Cloudflare Pages serves a folder of files. There is no adapter, no runtime, no middleware, nothing that would make a future move painful.
4. **`_redirects` is a first-class primitive**, which matters a great deal for Phase 9's 14+ redirect rules.

**The reversibility principle:** because the site is pure static output with no host-specific runtime features, **`git push` to a different host produces a working site.** Keep it that way. **No Cloudflare Functions, no Vercel Edge Middleware, no adapters, no ISR, no image-optimisation service.** This is recorded as ADR-0001 and it is a constraint, not a preference.

**Vercel** is documented in `docs/deployment.md` as the fallback, with its equivalent configuration, so the switch is a 20-minute job if it is ever wanted.

### 13.2 Environment separation

| Environment | Trigger | URL | `PUBLIC_SITE_URL` | robots.txt |
|---|---|---|---|---|
| **local** | `npm run dev` | `http://localhost:4321` | `http://localhost:4321` | not emitted |
| **preview** | any push to a non-`main` branch, and every PR | `https://<hash>.the-starkonium-times.pages.dev` | the preview URL | **`Disallow: /`** |
| **production (staging)** | push to `main` | `https://the-starkonium-times.pages.dev` | that URL | **`Disallow: /`** ← *see below* |
| **production (live)** | **not configured in v1** | `https://starkonium.com` | that URL | `Allow` |

> **Critical:** until DNS cutover (Appendix G), **even the `main`-branch deployment is a preview**. It must emit `Disallow: /` and must not be indexed. The `Allow` robots.txt is gated on `PUBLIC_SITE_URL === 'https://starkonium.com'` — a single condition, tested. **There is no way to accidentally index the preview.**

**Environment variables:** exactly one, `PUBLIC_SITE_URL`. It has a committed default. **No secrets exist.** No `.env` is committed. If the Cloudflare dashboard ever needs a token, it lives in the dashboard, never in the repo.

### 13.3 Cloudflare Pages configuration

| Setting | Value |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `22` (via `.nvmrc`, auto-detected) |
| Root directory | `/` |
| Environment variables | `PUBLIC_SITE_URL` (per-environment) |
| Production branch | `main` |
| Preview branches | all |

`public/_headers`:
```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: geolocation=(), microphone=(), camera=(), interest-cohort=()
  Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'

/_pagefind/*
  Cache-Control: public, max-age=3600

/fonts/*
  Cache-Control: public, max-age=31536000, immutable
```

> The CSP has **no third-party origins**, because the site makes **zero third-party requests** (Phase 10). If a CSP violation ever appears in the console, something has been added that should not have been.

`public/_redirects` — generated at build from `src/redirects.ts` (Phase 9), so the same map drives both the Astro static redirects and Cloudflare's edge redirects.

### 13.4 Commit boundaries

| Commit | Message |
|---|---|
| 1 | `feat(deploy): _headers with CSP and cache policy` |
| 2 | `feat(deploy): _redirects generation from the redirect map` |
| 3 | `feat(deploy): environment-aware robots.txt` |
| 4 | `docs: Cloudflare Pages deployment guide with Vercel fallback` |
| 5 | `test(deploy): preview robots and environment assertions` |

### Phase 13 acceptance criteria

- [ ] **A successful GitHub-triggered deployment.** A push to a branch produces a working preview URL. Pasted in the phase report.
- [ ] **The preview URL is live and correct** — every page renders, search works, feeds resolve, redirects fire.
- [ ] **The production build succeeds on the host**, not just locally.
- [ ] **Preview robots.txt emits `Disallow: /`.** Fetched from the live preview URL and pasted in the report.
- [ ] **No secrets are committed.** `npm run check:secrets` passes; the Cloudflare project has no repo-side tokens.
- [ ] **No live-domain changes.** Explicitly stated: `starkonium.com` DNS is unmodified; the Blogger site is unmodified and still serving. The agent must verify by fetching `https://www.starkonium.com/` and confirming it still returns the Blogger site.
- [ ] CSP produces zero console violations on every page type.
- [ ] Redirects fire correctly from the preview domain (test 3 of the 14).

---

## Phase 14 — Final repository audit and ZIP packaging

**Branch:** `phase-14-release`
**Depends on:** Phases 0–13
**Delivers:** `the-starkonium-times-v1-source.zip`, `RELEASE_MANIFEST.md`, and a `v1.0.0` tag.

### 14.1 The ZIP

**Name:** `the-starkonium-times-v1-source.zip`
**Structure:** the repository root **directly**. Unzipping produces `package.json`, `src/`, `README.md`… at the top level — **not** a nested `the-starkonium-times/` or a temp directory.

**`.git` is EXCLUDED.** The rationale, stated in the manifest:
- The ZIP is a *source distribution*, not a repository clone. `.git` would multiply its size and leak nothing useful.
- The Git history lives in the actual repository, clean, with one branch per phase and a `v1.0.0` tag.
- **The final commit hash is recorded in `RELEASE_MANIFEST.md`**, which is how the ZIP is tied to the history.
- All GitHub-compatible source **is** included: `.github/`, workflows, templates, `dependabot.yml`, `.gitignore`, `.editorconfig`, `.nvmrc`.

| Included | Excluded |
|---|---|
| `src/` (components, content, layouts, pages, styles, utils, assets) | `node_modules/` |
| `public/` | `dist/` |
| `tests/` | `.astro/` |
| `scripts/` | `.git/` |
| `docs/` | `coverage/`, `test-results/`, `playwright-report/` |
| `.github/` (workflows, templates, dependabot) | `.env`, `.env.*`, `*.pem`, `*.key` |
| `package.json`, **`package-lock.json`** | `.DS_Store`, `Thumbs.db`, `.vscode/`, `.idea/`, `*.swp` |
| `astro.config.mjs`, `tsconfig.json`, `eslint.config.js`, `.prettierrc` | `public/_pagefind/` (generated at build) |
| `vitest.config.ts`, `playwright.config.ts` | `migration/raw/` (raw Blogger download) |
| `.editorconfig`, `.gitignore`, `.nvmrc` | `*.zip`, `release/` |
| `README.md`, `RELEASE_MANIFEST.md`, `LICENSE`, `LICENSE-CONTENT` | Large unused assets (> 500KB, unreferenced) |
| `migration/blogger-export.xml`, `migration/manifest.csv`, `migration/images/` | |

> **On `migration/blogger-export.xml`:** it **is** included. It is the permanent, irreplaceable record of Volume I, it is small (a few hundred KB of XML), and losing it would be unrecoverable. `migration/raw/` — the untouched download directory used as a scratch space — is excluded.
>
> **On `public/_pagefind/`:** excluded. It is generated by `npm run build`. Including it would ship a stale index.

### 14.2 The packaging script — `npm run package`

`scripts/package.mjs`. It runs **14 steps in order** and **aborts on the first failure**. No step is skippable.

```
 1. Verify the working tree is clean         → git status --porcelain must be empty
 2. Verify the branch and tag                → on main, tagged v1.0.0
 3. npm run format:check                     → prettier
 4. npm run lint                             → eslint, --max-warnings 0
 5. npm run typecheck                        → astro check && tsc --noEmit
 6. npm test                                 → vitest (unit + schema)
 7. npm run build                            → astro build && pagefind
 8. npm run check:budget                     → performance budgets
    npm run check:links                      → zero broken internal links
    npm run test:e2e                         → playwright (incl. a11y, no-JS, keyboard)
 9. VERIFY REQUIRED FILES                    → the manifest of files that MUST exist (§14.3)
10. SCAN FOR FORBIDDEN FILES                 → node_modules, dist, .astro, .env, *.key, .DS_Store,
                                               coverage, *.zip, migration/raw — anywhere in the tree
11. SCAN FOR PROBABLE SECRETS                → regex scan (§14.4) over every file that will be zipped
12. CREATE THE ZIP                           → archiver, root-level, deterministic (sorted entries,
                                               fixed mtime) so the SHA-256 is reproducible
13. INSPECT THE ZIP                          → list entries; assert the required files are present,
                                               the forbidden ones are absent, and there is no
                                               nested wrapper directory
14. VERIFY BY EXTRACTION                     → extract to a temp dir; run:
                                                 npm ci
                                                 npm run validate
                                                 npm run build
                                               all must pass FROM THE EXTRACTED COPY
15. CHECKSUM                                 → sha256sum → written into RELEASE_MANIFEST.md
```

Step 14 is the one that matters. **The ZIP is not verified by inspecting it; it is verified by using it.** A ZIP that lists correctly but does not `npm ci && npm run build` from a clean extraction is a failed release.

### 14.3 Required-files manifest (`scripts/required-files.json`)

The script asserts each of these exists in the ZIP:

```
package.json            package-lock.json       tsconfig.json
astro.config.mjs        .nvmrc                  .gitignore
.editorconfig           eslint.config.js        .prettierrc
vitest.config.ts        playwright.config.ts
README.md               RELEASE_MANIFEST.md     LICENSE               LICENSE-CONTENT
.github/workflows/ci.yml
src/content.config.ts   src/styles/index.css    src/layouts/BaseLayout.astro
src/pages/index.astro   src/pages/404.astro
src/utils/ledger.ts     src/redirects.ts
docs/setup.md           docs/deployment.md      docs/dns-cutover.md
migration/manifest.csv
```

### 14.4 Secret-scan patterns (`scripts/check-secrets.mjs`)

Regex scan over every file that will be zipped. Any match **aborts the release**.

```
AWS access key            AKIA[0-9A-Z]{16}
Generic API key           (?i)(api[_-]?key|apikey)\s*[:=]\s*['"][A-Za-z0-9_\-]{16,}['"]
Bearer token              (?i)bearer\s+[A-Za-z0-9\-._~+/]{20,}
Private key block         -----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----
GitHub token              gh[pousr]_[A-Za-z0-9]{36,}
Cloudflare token          (?i)cloudflare.{0,20}['"][A-Za-z0-9_\-]{30,}['"]
Slack token               xox[baprs]-[A-Za-z0-9\-]{10,}
Generic secret assignment (?i)(secret|password|passwd|token)\s*[:=]\s*['"][^'"]{8,}['"]
.env file present         any path matching \.env(\..+)?$  (except .env.example)
```

**Known-safe allowlist:** the placeholder strings (`{{EMAIL}}`, `{{GITHUB}}`, etc.) and the ORCID pattern in `people.yaml`. The allowlist is a committed file and every entry has a comment.

### 14.5 `RELEASE_MANIFEST.md` — required contents

```markdown
# Release Manifest — The Starkonium Times

Release name:            The Starkonium Times v1.0.0
Date:                    2026-__-__
Version:                 1.0.0
Git commit:              <full 40-char SHA>
Git tag:                 v1.0.0
Branch:                  main
Working tree:            clean

Node version:            v22.__.__
npm version:             10.__.__
OS (build machine):      <uname -a>

Build command:           npm run build
Test command:            npm run validate:full

Build result:            PASS — <N> pages emitted in <T>s
Test result:             PASS — <N> unit, <N> e2e, <N> a11y, 0 violations
Lighthouse:              perf __ / a11y 100 / bp 100 / seo 100
Budgets:                 PASS (CSS __KB, JS __KB, fonts __KB, CLS 0.00)

ZIP filename:            the-starkonium-times-v1-source.zip
ZIP SHA-256:             <64-char hex>
ZIP size:                __ MB
ZIP verified:            PASS — extracted to a clean temp dir; `npm ci`,
                         `npm run validate`, `npm run build` all succeeded

## Included content
- <N> projects (<N> fully detailed, <N> short entries)
- <N> project updates (all real — none fabricated)
- <N> articles (<N> Volume I, <N> Volume II)
- <N> paper reviews
- <N> experience entries
- <N> Now entries
- <N> topics, <N> series
- cv.pdf (<N> pages, updated <date>)
- migration/blogger-export.xml (the permanent Volume I record)
- migration/manifest.csv (<N>/14 verified)

## Excluded content
node_modules/, dist/, .astro/, .git/, coverage/, test-results/,
playwright-report/, public/_pagefind/, migration/raw/, .env*, *.zip,
editor and OS metadata.

## MIGRATION_STATUS
<complete | incomplete — with the exact outstanding list>

## Known limitations
- <e.g. /now/archive deferred; series pages deferred; dark mode deferred>
- <see Appendix F of STARKONIUM_IMPLEMENTATION_PLAN.md>

## Deployment status
Preview:     https://the-starkonium-times.pages.dev  (robots: Disallow: /)
Production:  NOT DEPLOYED

## Production safety confirmation
- [x] The live Blogger site at starkonium.com is UNMODIFIED and still serving.
- [x] starkonium.com DNS records are UNMODIFIED.
- [x] No Blogger settings were changed.
- [x] No credentials for the live site were used at any point.
- [x] DNS cutover is documented in docs/dns-cutover.md and has NOT been executed.
```

### 14.6 Commit boundaries

| Commit | Message |
|---|---|
| 1 | `feat(scripts): required-files manifest and forbidden-file scan` |
| 2 | `feat(scripts): secret scanner with allowlist` |
| 3 | `feat(scripts): deterministic zip packaging` |
| 4 | `feat(scripts): extract-and-revalidate verification step` |
| 5 | `docs: RELEASE_MANIFEST` |
| 6 | `chore(release): v1.0.0` *(then: `git tag -a v1.0.0`)* |

### Phase 14 acceptance criteria

The extracted ZIP must behave **exactly like a clean GitHub checkout**:

```bash
unzip the-starkonium-times-v1-source.zip -d /tmp/verify
cd /tmp/verify
npm ci
npm run validate
npm run build
```

- [ ] All three commands pass, from the extracted copy, with output pasted in the report.
- [ ] The ZIP's root contains `package.json` directly — **no nested wrapper directory.**
- [ ] Every file in `scripts/required-files.json` is present.
- [ ] **Zero** forbidden files: no `node_modules`, `dist`, `.astro`, `.git`, `.env`, `coverage`, `*.zip`, `.DS_Store`, `migration/raw/`.
- [ ] The secret scan passes with zero findings.
- [ ] The SHA-256 is recorded in `RELEASE_MANIFEST.md` and matches the shipped file.
- [ ] The ZIP is **deterministic**: packaging twice from the same commit produces the same SHA-256.
- [ ] `git status` is clean; the tree is tagged `v1.0.0`; the manifest's commit hash matches `git rev-parse HEAD`.
- [ ] The production-safety confirmation in the manifest is complete and true.

---

## Git strategy

### Branches

`main` is the stable branch. **One branch per phase**, merged only after that phase's acceptance criteria pass with pasted evidence.

```
phase-0-bootstrap        phase-8-personal-pages
phase-1-design-system    phase-9-archive
phase-2-content-model    phase-10-search-seo
phase-3-components       phase-11-hardening
phase-4-homepage         phase-12-documentation
phase-5-projects         phase-13-deployment
phase-6-writing          phase-14-release
phase-7-reviews
```

### Rules

1. Branch from `main`. Merge to `main` with `--no-ff` (so the phase is one identifiable merge commit) after CI passes.
2. **Commit at every boundary listed in the phase.** Each phase specifies 5–15 commits. **A phase delivered as one enormous commit is a rejected phase** — the commit boundaries are part of the deliverable, because they are how the work is reviewed.
3. **Never commit generated artefacts.** `dist/`, `.astro/`, `node_modules/`, `coverage/`, `public/_pagefind/`.
4. Conventional commits: `feat(scope):`, `fix(scope):`, `test(scope):`, `docs:`, `chore:`, `ci:`, `content(scope):`.
5. **The final working tree must be clean.** `git status --porcelain` is empty before packaging.
6. Tag `v1.0.0` on the final `main` commit, annotated, with the release summary in the tag body.

### Commit-boundary principle

A commit should be a *thing that works*, or a *thing that is obviously incomplete but coherent*. "Added the Ledger" is a commit. "WIP" is not. "Phase 5" is not.

---

## Repository structure

```
the-starkonium-times/
├── .github/
│   ├── workflows/
│   │   └── ci.yml                    # validate → build → e2e → budgets → links → secrets
│   ├── ISSUE_TEMPLATE/
│   │   ├── content.md                # a piece to write / a project to add
│   │   └── bug.md
│   ├── pull_request_template.md
│   └── dependabot.yml
│
├── docs/                             # everything a maintainer needs (Phase 12)
│   ├── setup.md
│   ├── conventions.md
│   ├── deployment.md
│   ├── dns-cutover.md                # informational. NOT executed.
│   ├── migration.md
│   ├── migration-review.md
│   ├── release.md
│   ├── security.md
│   ├── authoring/                    # projects, updates, articles, reviews, now
│   ├── adr/                          # 11 architecture decision records
│   └── qa/                           # manual-inspection records + screenshots
│
├── migration/                        # the Volume I pipeline (Phase 9)
│   ├── blogger-export.xml            # COMMITTED. The permanent record. Never deleted.
│   ├── manifest.csv                  # COMMITTED. old_url → new_url + status columns.
│   ├── images/                       # COMMITTED. Rehosted originals.
│   └── raw/                          # .gitignored. Scratch space for the raw download.
│
├── public/                           # served verbatim at the site root
│   ├── fonts/                        # 3 families, subset woff2 (≤150KB total)
│   ├── cv.pdf                        # hand-maintained. 2 pages.
│   ├── favicon.svg                   # a Fraunces S. No tile.
│   ├── apple-touch-icon.png
│   ├── _headers                      # CSP, cache policy (Cloudflare)
│   └── _redirects                    # generated at build from src/redirects.ts
│
├── scripts/                          # build, validation and authoring tooling
│   ├── check-content.mjs             # schema + naming + privacy rules
│   ├── check-contrast.mjs            # every colour pair in the token file
│   ├── check-links.mjs               # linkinator over dist/
│   ├── check-naming.mjs              # the §0.1 naming system + forbidden copy
│   ├── check-budget.mjs              # performance budgets, fails the build
│   ├── check-secrets.mjs             # the release secret scan
│   ├── migrate-blogger.mjs           # Atom XML → MDX + manifest rows
│   ├── migrate-images.mjs            # download → rehost → rewrite → alt TODO
│   ├── check-migration.mjs           # manifest + import validation
│   ├── new-project.mjs               # authoring scaffolds
│   ├── new-update.mjs                #   ← the 60-second workflow. The site depends on it.
│   ├── new-article.mjs
│   ├── new-review.mjs
│   ├── new-now.mjs
│   ├── required-files.json
│   └── package.mjs                   # the 15-step release pipeline
│
├── src/
│   ├── assets/                       # images processed by astro:assets
│   ├── components/
│   │   ├── chrome/                   # Wordmark, SiteHeader, MobileMenu, SiteFooter,
│   │   │                             #   Container, SkipLink, SearchTrigger, SearchDialog
│   │   ├── primitives/               # EditorialRule, InsertionCaret, StatusLabel,
│   │   │                             #   TopicList, MetadataList, EmptyState,
│   │   │                             #   SectionHeader, PageHeader
│   │   ├── ledger/                   # Ledger, LedgerRow           ← THE SIGNATURE
│   │   ├── entries/                  # EntryRow + ProjectPreview, WritingRow, ReviewPreview
│   │   ├── prose/                    # Figure, FigureCaption, Callout, Note, Table,
│   │   │                             #   Annotation, Superseded
│   │   ├── special/                  # ProjectStatusStamp, AssessmentStrip, CiteBlock,
│   │   │                             #   TableOfContents, FilterRail
│   │   └── seo/                      # Head, JsonLd, OpenGraph
│   │
│   ├── content/                      # THE CONTENT. The reason the repo exists.
│   │   ├── projects/                 # .md/.mdx — updates embedded in frontmatter (R9)
│   │   ├── writing/                  # .md/.mdx — Volume I and Volume II together
│   │   │   └── _images/              # per-post image directories
│   │   ├── reviews/
│   │   ├── experience/
│   │   ├── now/                      # YYYY-MM-DD.md
│   │   ├── topics.yaml               # a CLOSED vocabulary
│   │   ├── series.yaml
│   │   ├── people.yaml
│   │   └── site.yaml                 # statement, short about, links, revision
│   │
│   ├── layouts/                      # BaseLayout, ArticleLayout, ProjectLayout, ReviewLayout
│   ├── pages/
│   │   ├── index.astro               # the homepage — 7 regions
│   │   ├── log.astro                 # the full Ledger
│   │   ├── projects/                 # index.astro, [slug].astro
│   │   ├── writing/                  # index.astro, [slug].astro
│   │   ├── reviews/                  # index.astro, [slug].astro
│   │   ├── topics/                   # index.astro, [slug].astro
│   │   ├── experience.astro
│   │   ├── about.astro
│   │   ├── now.astro
│   │   ├── archive.astro             # the Volume I front page
│   │   ├── colophon.astro
│   │   ├── search.astro
│   │   ├── 404.astro
│   │   ├── rss.xml.ts                # + rss/writing.xml.ts, rss/log.xml.ts
│   │   ├── og/[...route].png.ts      # Satori OG generation
│   │   └── dev/                      # DEV ONLY. Asserted absent from dist/.
│   │       ├── tokens.astro
│   │       └── components.astro
│   │
│   ├── scripts/                      # client-side islands (vanilla TS)
│   │   ├── search-dialog.ts
│   │   ├── filter-rail.ts
│   │   ├── toc.ts
│   │   ├── reading-progress.ts
│   │   └── mobile-menu.ts
│   │
│   ├── styles/
│   │   ├── index.css                 # the only entry point; @layer order
│   │   ├── tokens.css                # colour, type, spacing, layout, motion
│   │   ├── reset.css   base.css   layout.css
│   │   ├── components.css            # shared component primitives only
│   │   ├── prose.css                 # THE ARTICLE TYPOGRAPHY. The craft surface.
│   │   ├── print.css
│   │   ├── utilities.css
│   │   └── shiki-cream.json          # the custom code theme
│   │
│   ├── utils/
│   │   ├── ledger.ts                 # aggregation + deterministic ordering. ONE source.
│   │   ├── content.ts                # isPublished(), queries, draft handling
│   │   ├── projects.ts               # updatedAt, revision, derived fields
│   │   ├── reading-time.ts   related.ts   toc.ts   status.ts   cite.ts   dates.ts
│   │
│   ├── content.config.ts             # all collections + Zod schemas
│   └── redirects.ts                  # old Blogger URL → new URL
│
├── tests/
│   ├── unit/                         # vitest — schema, ledger, utils
│   ├── fixtures/invalid/             # content that MUST fail the build
│   ├── e2e/                          # playwright — pages, a11y, keyboard, no-JS, print
│   └── snapshots/                    # route list, ledger order, <head> metadata
│
├── .editorconfig      .gitignore      .nvmrc        .prettierrc
├── eslint.config.js   astro.config.mjs
├── vitest.config.ts   playwright.config.ts   tsconfig.json
├── package.json       package-lock.json
├── LICENSE            # MIT — the code
├── LICENSE-CONTENT    # CC BY 4.0 — the writing
├── README.md
└── RELEASE_MANIFEST.md
```

### Why each top-level directory exists

| Directory | Purpose |
|---|---|
| `.github/` | CI, and the minimum viable GitHub furniture for a one-person repo. Nothing more. |
| `docs/` | The maintainer's contract with their future self. ADRs are here so that "why is it like this?" has an answer in a year. |
| `migration/` | The Volume I record. `blogger-export.xml` is irreplaceable and is committed for that reason. |
| `public/` | Served verbatim: fonts, the CV, the favicon, the host config files. |
| `scripts/` | Build validation and — critically — the **authoring scaffolds**. `new-update.mjs` is load-bearing: the site's thesis dies if posting is a chore. |
| `src/content/` | The reason the repository exists. Everything else is a renderer for this directory. It is plain Markdown; it survives every redesign, including this one. |
| `src/components/` | Grouped by role, not by page. Each group has a clear boundary; `ledger/` is separated because it is the signature. |
| `src/scripts/` | Client-side islands, in vanilla TS. Four of them. All progressive enhancements. |
| `src/styles/` | The design system as CSS. `prose.css` is the craft surface and deserves its own file. |
| `src/utils/` | Derived data. **The rule: pages never compute; they read.** `ledger.ts` is the single source of truth for the site's most important component. |
| `tests/` | Including `fixtures/invalid/` — content that *must* fail the build. A schema you cannot prove rejects bad input is not a schema. |

---

## Coding-agent workflow

**For every phase, without exception:**

1. **Read** `STARKONIUM_WEBSITE_DESIGN_SPEC.md` and `STARKONIUM_IMPLEMENTATION_PLAN.md` completely. The refinements in §0.3 override the design spec.
2. **Inspect the repository before changing anything.** `git log --oneline -20`, `ls -R src/`, read the files you are about to touch. Do not assume the previous phase built what you expect.
3. **Confirm the previous phase's acceptance criteria still pass.** Run `npm run validate:full`. If it fails, **fix that before starting** — and report it as a regression, not as new work.
4. **Implement only the current phase.** Do not build ahead. Do not "quickly also add" a component from Phase 7 while in Phase 3.
5. **Add or update tests.** Every acceptance criterion that says "asserted" must have a test. A phase whose criteria are checked by eye is not complete.
6. **Run the complete validation suite.** `npm run validate:full`.
7. **Inspect the generated pages.** `npm run build && npm run preview`. Actually look at them. Screenshot the new surfaces into `docs/qa/phase-N/`.
8. **Update the documentation.** If a decision was made that is not in this plan, write an ADR.
9. **Record the exact files changed.** `git diff --stat main...HEAD`.
10. **Commit the phase** at the boundaries specified. Not one commit. Not thirty.
11. **Report**, with the following structure:

```
## Phase N — <name>

### Work completed
<what was built, in specifics>

### Commands run
<the exact commands, in order>

### Test results
<PASTED OUTPUT. Not "tests pass." The actual output.>

### Build results
<PASTED OUTPUT. Page count, build time, bundle sizes.>

### Files changed
<git diff --stat>

### Acceptance criteria
<each criterion, with PASS/FAIL and the evidence>

### Remaining limitations
<what is knowingly incomplete, and why>

### Commit
<hash, branch, and the merge status>
```

> **The agent must not claim success without showing actual command results.** "All tests pass" is not a report. The pasted output of `npm run validate:full` is a report. If a criterion cannot be met, say so plainly and explain why — an honest `FAIL` is worth more than a fabricated `PASS`, and this is a site whose entire premise is that unfinished work should be visible.

---

## Appendix A — Complete command reference

### Setup

```bash
nvm use                              # honours .nvmrc (Node 22)
npm ci                               # install from the lockfile — the ONLY install command for CI/verification
npm install                          # install + update the lockfile (development only)
npx playwright install --with-deps chromium
```

### Development

```bash
npm run dev                          # localhost:4321, drafts visible with a DRAFT banner
npm run dev -- --host                # expose on the LAN (for phone testing)
# dev-only reference pages:
#   /dev/tokens        every colour, type step and spacing step, with live contrast ratios
#   /dev/components    every component in every state
```

### Authoring

```bash
npm run new:project                  # scaffolds a project .md with the 6 required fields
npm run new:update                   # ← THE 60-SECOND WORKFLOW. Appends to a project's updates[].
npm run new:article
npm run new:review
npm run new:now                      # copies the current Now to a new dated file
```

### Validation

```bash
npm run format:check                 # prettier
npm run lint                         # eslint, --max-warnings 0
npm run typecheck                    # astro check && tsc --noEmit
npm test                             # vitest — unit, schema, ledger, invalid fixtures
npm run test:watch
npm run test:e2e                     # playwright — pages, a11y, keyboard, no-JS, print
npm run test:a11y                    # playwright, @a11y tag only

npm run check:content                # schemas, topic vocabulary, privacy rules
npm run check:naming                 # the naming system + forbidden copy
npm run check:budget                 # performance budgets (fails the build)
npm run check:links                  # linkinator over dist/
npm run check:secrets                # the release secret scan

npm run validate                     # format + lint + typecheck + test + content + naming   (fast)
npm run validate:full                # validate + build + budget + links + e2e               (the gate)
```

### Build and preview

```bash
npm run build                        # astro build && pagefind --site dist
npm run preview                      # serve dist/ on :4321
```

### Migration (Phase 9)

```bash
node scripts/migrate-blogger.mjs     # Atom XML → MDX + manifest rows. Idempotent. Never overwrites.
node scripts/migrate-images.mjs      # download → rehost → rewrite refs → emit alt: TODO
node scripts/check-migration.mjs     # validates the manifest, the dates, the slugs, the images
```

### Release (Phase 14)

```bash
git status --porcelain               # must be empty
npm run package                      # the 15-step pipeline → the-starkonium-times-v1-source.zip
sha256sum the-starkonium-times-v1-source.zip
git tag -a v1.0.0 -m "The Starkonium Times v1.0.0"
```

### Verifying the ZIP (what a reviewer runs)

```bash
unzip the-starkonium-times-v1-source.zip -d /tmp/verify && cd /tmp/verify
npm ci
npm run validate
npm run build
```

---

## Appendix B — Phase dependency graph

```
                          ┌──────────────────┐
                          │ P0  Bootstrap    │
                          └────────┬─────────┘
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
          ┌──────────────────┐          ┌──────────────────┐
          │ P1 Design system │          │ P2 Content model │
          └────────┬─────────┘          └────────┬─────────┘
                   └──────────────┬──────────────┘
                                  ▼
                        ┌──────────────────┐
                        │ P3  Components   │   ← the Ledger is built here
                        └────────┬─────────┘
                                 ▼
                        ┌──────────────────┐
                        │ P4  Homepage     │   ← + /log
                        └────────┬─────────┘
        ┌───────────────┬────────┼────────┬───────────────┐
        ▼               ▼        ▼        ▼               ▼
  ┌──────────┐   ┌──────────┐   ...  ┌──────────┐  ┌──────────────┐
  │P5 Projects│   │P6 Writing│        │P8 Personal│  │              │
  └────┬─────┘   └────┬─────┘        └──────────┘  │              │
       │              ▼                             │              │
       │        ┌──────────┐                        │              │
       │        │P7 Reviews│  (needs P6's prose)    │              │
       │        └────┬─────┘                        │              │
       │             │                              │              │
       │             ▼                              │              │
       │       ┌──────────────┐                     │              │
       │       │P9  Volume I  │  (needs P6)         │              │
       │       └──────┬───────┘                     │              │
       └──────────────┴─────────────┬───────────────┘              │
                                    ▼                              │
                        ┌────────────────────┐                     │
                        │ P10 Search/RSS/SEO │ ◄───────────────────┘
                        └─────────┬──────────┘
                                  ▼
                        ┌────────────────────┐
                        │ P11 Hardening      │
                        └─────────┬──────────┘
                                  ▼
                        ┌────────────────────┐
                        │ P12 Documentation  │
                        └─────────┬──────────┘
                                  ▼
                        ┌────────────────────┐
                        │ P13 Deploy preview │
                        └─────────┬──────────┘
                                  ▼
                        ┌────────────────────┐
                        │ P14 Release + ZIP  │
                        └────────────────────┘
```

| Phase | Hard dependencies | Notes |
|---|---|---|
| P0 | — | |
| P1 | P0 | |
| P2 | P0 | **Can run in parallel with P1.** |
| P3 | P1, P2 | Needs tokens *and* types. |
| P4 | P3 | Needs the Ledger. |
| P5 | P3, P4 | Uses `EntryRow`, `Ledger`, `FilterRail`. |
| P6 | P3 | Needs `prose.css` — its own core deliverable. |
| P7 | P6 | Reviews reuse the prose system. |
| P8 | P3 | Independent of P5/P6/P7. **Can run in parallel with P5.** |
| P9 | P6 | Volume I posts are articles. **R17: can be deferred/partial without blocking P10–P14.** |
| P10 | P4–P9 | It indexes everything, so everything must exist. |
| P11 | P0–P10 | |
| P12 | P0–P11 | |
| P13 | P12 | |
| P14 | P13 | |

**The critical path:** P0 → P1/P2 → P3 → P4 → P6 → P10 → P11 → P12 → P13 → P14.
**P5, P7, P8 and P9 hang off it** and can be reordered among themselves if a content dependency demands it.

---

## Appendix C — Test matrix

| Feature | Unit (vitest) | Integration / e2e (playwright) | Accessibility (axe + keyboard) | Manual visual | Production build |
|---|---|---|---|---|---|
| **Design tokens** | contrast-ratio calculations for every pair | — | contrast assertions on rendered pages | `/dev/tokens` audit; **is the orange right?** | CSS ≤ 20KB gzipped |
| **Wordmark** | — | renders `STARKONIUM`; accessible name is *The Starkonium Times* | accessible name present | **no marker, no numeral, no tile** (R1) | in every OG image |
| **Site header** | — | sticky border on scroll; active states | full tab order; focus visible; `aria-current` | — | — |
| **Mobile menu** | — | opens, closes, `Esc`, focus returns | focus trap; `inert` on the rest | sheet is opaque, full-screen | — |
| **No-JS navigation** | — | **every nav link works with JS off**; menu is a `<details>` | — | — | — |
| **Content schemas** | **every invalid fixture fails** (13 cases) | — | — | — | build fails on bad content |
| **Topic vocabulary** | unknown slug → build error | — | — | — | ✓ |
| **Now privacy rule** | street address → build error | — | — | — | ✓ |
| **The Ledger** | **deterministic order**; 4-level tie-break; snapshot; drafts excluded; empty state | renders on home, `/log`, project pages | list semantics; row accessible names | **does it feel alive?** (R15) | ≤ 8 rows on home |
| **Ledger — Now entries** | only with a `ledgerNote` | — | — | — | ✓ |
| **Homepage** | — | **exact region order**; 5 fallback states | axe 375 + 1280; no-JS | no hero, no cards, no counters | Lighthouse ≥ 98; CLS 0.00 |
| **Projects index** | filter logic | URL state round-trip; back button; `aria-live` count | keyboard filters; JS-off rail hidden | one view only (R10) | — |
| **Project page** | derived `updatedAt`, `revision` | **7 fixtures**; stamp count = 1; no empty headings | axe; TOC keyboard | stamp reads as a stamp at −1.5° | print PDF structure |
| **Project ID visibility** | — | `PRJ-\d{3}` appears **only** in the cite block (R8) | — | — | ✓ |
| **Embedded updates** | ledger aggregation from frontmatter | in-place expansion; **no `/log/[date]` routes exist** (R9) | `<details>` keyboard | — | route snapshot |
| **Writing index** | kind filter | year grouping; Volume I at full contrast | axe; no-JS | Volume I not visually demoted | — |
| **Article** | reading time; related algorithm | **6 fixtures**; measure ≤ 680px | notes in all 3 renderings; no-JS complete | **typographic quality: rag, widows, orphans** | JS ≤ 8KB; CLS 0.00 |
| **Equations** | — | **zero KaTeX client requests** | MathML + `aria-label` | — | build-time only |
| **Code blocks** | — | Shiki cream theme applied | focusable, scrollable, focus ring | theme is on-palette | no client highlighter |
| **Sidenotes** | — | margin / inline / foot-of-page | **every note reachable with JS off** | margin collisions resolved | — |
| **Reviews** | schema; **no aggregate score anywhere** | complete fixture; 14 sections | assessment strip `aria-label` incl. justification | `--paper-review` reads as related, not other | `reviewRating` absent from JSON-LD |
| **Strongest contribution** | **missing → build error** | — | — | — | ✓ |
| **Experience** | sorting | optional-content omission | `<details>` keyboard; JS-off expand | print = a usable long CV | — |
| **Now** | staleness calc | `· overdue` past 60 days | — | — | — |
| **Volume I** | date preservation (3-way match) | **zero blogger.googleusercontent refs**; redirects resolve | every image has hand-written alt | **author's note worth reading?** | link check |
| **Naming system** | — | — | — | — | **`check:naming` greps `dist/`** for forbidden strings |
| **Search** | — | 6 types indexed incl. **updates**; empty state; no-results | ⌘K, arrows, `Esc`, focus trap | grouped, not one list | JS loads only on open, ≤45KB |
| **Search, JS off** | — | `/search` shows a **complete browsable index** | no dead controls | — | — |
| **RSS** | guid stability across builds | 3 feeds; W3C valid | — | — | full content, not excerpts |
| **SEO** | — | canonical, no trailing slash, everywhere | — | — | `<head>` snapshots |
| **OG images** | — | generated for every entry | — | typographic; no stock, no gradient | ≤ 120KB each |
| **Third-party requests** | — | **count = 0 on every page** | — | — | CSP has no external origins |
| **Preview safety** | — | preview robots = `Disallow: /` | — | — | **live site unchanged** |
| **The ZIP** | — | — | — | — | **extract → `npm ci` → `validate` → `build`** |

---

## Appendix D — Content authoring examples

### D.1 A project

`src/content/projects/fold-switch-propensity.mdx`

```mdx
---
id: PRJ-014
title: Fold-switch propensity from coevolutionary signal
thesis: >
  Can a coevolutionary coupling matrix tell you that a protein has two folds
  before you ever run a simulation? Six months in, the honest answer is
  "sometimes, and I can't yet predict when."
status: active
started: 2025-11-02
field: structural-biology

topics: [coevolution, msa, molecular-dynamics, pytorch]
type: research
featured: true

repositories:
  - name: foldswitch-dca
    url: https://github.com/{{GITHUB}}/foldswitch-dca
    description: Inference pipeline and benchmarks
    language: Python
    license: MIT

outputs:
  - kind: preprint
    title: Coevolutionary signal is necessary but not sufficient for fold-switching
    venue: bioRxiv
    date: 2026-05-04
    doi: 10.1101/2026.05.04.123456

updates:
  - date: 2026-07-09
    kind: result
    summary: Validation set rebuilt without homologous leakage; AUC drops from 0.88 to 0.71.
  - date: 2026-05-04
    kind: submitted
    summary: Preprint posted to bioRxiv.
    link: https://doi.org/10.1101/2026.05.04.123456
  - date: 2026-02-11
    kind: replan
    summary: Switched from MSA depth filtering to per-column entropy. Depth was a proxy for nothing.
---

## Problem

<!-- Optional. As are all the sections below. A project with none of them
     still renders as a complete page. -->

## Failures

<!-- Sunk paper, 2px left rule. Visually different, never lesser.
     What I tried, why I thought it would work, why it didn't, what it cost. -->

## Decisions

<!-- D-03 · 2026-02-11 · Switched from MSA depth filtering to per-column entropy.
     Reasoning, then an outcome chip: held / reversed / superseded. -->
```

### D.2 A project update — the 60-second workflow

**There is no separate file** (R9). An update is four lines appended to the project's `updates:` array:

```yaml
  - date: 2026-07-09
    kind: result
    summary: Validation set rebuilt without homologous leakage; AUC drops from 0.88 to 0.71.
```

```bash
npm run new:update
# → project? fold-switch-propensity
# → kind?    result
# → summary? Validation set rebuilt without homologous leakage; AUC drops to 0.71.
git commit -am "PRJ-014: validation rebuilt" && git push
```

It appears within ~60 seconds in: the project page, the homepage Ledger, `/log`, `/rss/log.xml` and the search index.

**A `paused` update must state a reason** (schema-enforced, ≥20 chars):

```yaml
  - date: 2025-03-14
    kind: paused
    summary: Cluster quota is gone until September. Nothing to run this on. Resuming then.
```

**Do not manufacture updates to fill the Ledger (R15).** A thin, honest Ledger is acceptable. A padded one is a failure of the site's only real claim.

### D.3 An article

`src/content/writing/on-the-smell-of-a-wet-culture-room.mdx`

```mdx
---
id: WRT-031
title: On the smell of a wet culture room
kind: essay
published: 2026-07-02
standfirst: >
  Every lab I have worked in has had a smell, and I have never seen one
  described in a paper. This is an essay about the parts of doing science
  that do not survive the write-up.
topics: [memory, teaching, molecular-biology]
featured: true
---

Body prose in Newsreader at 19px, 66ch measure.

<Note>A margin note on wide screens, an inline details on narrow ones, and a
numbered entry at the foot of the article — from this one authored source.</Note>

<Figure
  src={import('./_images/wrt-031/culture-room.jpg')}
  alt="A culture room bench with three open plates and a spilled pipette tip box."
  caption="The bench, mid-afternoon, on the day the incubator failed."
  source="Author's photograph, 2024."
/>

<Callout variant="caveat">
  I am describing one lab, in one city, over three years. Do not generalise.
</Callout>
```

### D.4 A paper review

`src/content/reviews/kim-2026-fold-switch-coevolution.mdx`

```mdx
---
id: REV-008
reviewed: 2026-06-28
paper:
  title: Coevolutionary signal predicts fold-switching in metamorphic proteins
  authors: [Kim, J., Oyelaran, T., Behera, S.]
  year: 2026
  journal: Nature Methods
  volume: "23(6)"
  pages: 812–824
  doi: 10.1038/s41592-026-01234-5
  codeUrl: https://github.com/kimlab/foldswitch
  dataUrl: null
verdict: partly-convincing
verdictLine: >
  The separation is real on their benchmark and vanishes when homologues are
  removed from the negatives.
field: structural-biology
topics: [coevolution, benchmarking]
relation: competing
assessment:
  evidence:        { score: 3, note: Strong on the benchmark, untested off it. }
  novelty:         { score: 4, note: The statistic itself is genuinely new. }
  clarity:         { score: 5, note: Beautifully written; the methods are complete. }
  reproducibility: { score: 2, note: Code released, environment unpinned, seeds absent. }
  usefulness:      { score: 4, note: Directly informs PRJ-014's negative-set design. }
reproduction:
  attempted: true
  outcome: partial
  note: Reran on their data and matched Fig. 2. Could not match it on my own negative set.
relatedProjects: [fold-switch-propensity]
---

## Verdict

<!-- 60–100 words of real prose. What they claim, whether it convinced me, why. -->

## Strongest contribution

<!-- MANDATORY. The build fails without this heading.
     Say what is good about the paper before you say what is wrong with it. -->
```

**No aggregate score.** Five dimensions, each 1–5, **each with a written justification** — enforced by the type.

### D.5 An experience entry

`src/content/experience/institution-research-assistant.md`

```yaml
---
id: EXP-003
organisation: "{{INSTITUTION}}"
position: Research assistant
group: Structural bioinformatics group
supervisor: jane-doe
start: 2025-11-01
end: null                          # null = current
location: "Bengaluru"              # CITY ONLY. A street address fails the build.
context: >
  I joined to work out whether coevolutionary couplings carry information about
  fold-switching, and stayed to rebuild the pipeline that produces them.
contribution: >
  I built the inference pipeline end to end — MSA construction, DCA, the coupling
  statistic, and the benchmark harness. The negative-set design is mine, including
  the homology-removal step that broke my own earlier result.
methods: [dca, msa-construction, molecular-dynamics]
tools: [pytorch, gromacs, nextflow]
lessons: >
  I learned that a benchmark you designed yourself will flatter you, and that the
  only cure is to try to break it before someone else does.
relatedProjects: [fold-switch-propensity]
---
```

### D.6 A Now entry

`src/content/now/2026-07-09.md`

```yaml
---
date: 2026-07-09
building: >
  A rewrite of the contact-map pipeline so a clean checkout reproduces Figure 2
  in one command.
buildingProject: fold-switch-propensity
investigating: >
  Whether fold-switch propensity survives homology removal at all.
  Current honest answer: unclear.
reading:
  - "Ishiguro, *Klara and the Sun*"
  - "Eddy (2004), *What is a hidden Markov model?* — again"
thinkingAbout: >
  Whether "reproducible" and "reusable" are the same goal, and whether I have
  been conflating them.
location: "Bengaluru · {{INSTITUTION}}"
ledgerNote: Rebuilt the validation set; reading list updated.
---
```

**The `ledgerNote` is what puts this in the Ledger.** Omit it, and the Now entry updates silently — which is correct for a typo fix and wrong for a change of direction. **Meaningful revision is an authorial act, not a heuristic.**

---

## Appendix E — Definition of done

Version one is complete when **every** box is checked.

### Build and repository

- [ ] `npm ci && npm run validate:full && npm run build` passes from a clean checkout.
- [ ] CI is green on `main`, including the `clean-checkout` job.
- [ ] `git status --porcelain` is empty. The tree is tagged `v1.0.0`.
- [ ] Fourteen phase branches were merged, each with its specified commit boundaries. **No phase was delivered as a single commit.**
- [ ] `the-starkonium-times-v1-source.zip` extracts, installs from the lockfile, validates and builds — verified by extraction, not by inspection.
- [ ] `RELEASE_MANIFEST.md` is complete, including the SHA-256 and the commit hash.
- [ ] Zero secrets. Zero forbidden files. Zero `.env`.

### Design fidelity

- [ ] The wordmark is `STARKONIUM`, typographic, **with no superscript, no numeral and no periodic-table motif** (R1, R2).
- [ ] The publication is called **The Starkonium Times** in every user-facing string (§0.1). `check:naming` passes.
- [ ] Exactly **three** font families are loaded, ≤ 150KB total (R5).
- [ ] The accent is **orange**, and `--orange` never appears as a text colour below 24px. Every contrast pair passes (R4).
- [ ] `border-radius` is `0` everywhere. `box-shadow` appears only on the search dialog.
- [ ] There is **no generic card grid** anywhere. Bordered surfaces exist only where the border encloses one semantic thing (R14).
- [ ] Orange appears ≤ 4 times per viewport.
- [ ] The status stamp appears exactly once per project page and nowhere else.

### The product

- [ ] **The Ledger is the first thing below the statement on the homepage**, and it aggregates all four sources with a deterministic, tested order (R6).
- [ ] **Every update in the Ledger is real.** None was manufactured to fill space (R15).
- [ ] **The Ledger's most recent entry is less than 30 days old on launch day.**
- [ ] **3 fully detailed projects** + 2–4 short entries (R16). At least one has a **populated Failures section** and a decision log, and it is not visually demoted.
- [ ] At least one project is `paused`, **with an honest reason recorded**.
- [ ] All 14 Volume I posts are imported, with original dates, hand-written alt text, hand-written standfirsts, and working redirects — **or** `MIGRATION_STATUS: incomplete` is recorded with the exact outstanding list (R17). *(Complete migration is a hard gate on cutover, not on the ZIP.)*
- [ ] At least 1 new article and 1 complete paper review exist.
- [ ] **The paper review names the paper's strongest contribution before it names a weakness.**
- [ ] `/now` is genuinely current on launch day.
- [ ] `cv.pdf` exists, is two pages, and is current.
- [ ] `/archive` has the author's note, and it is worth reading.

### Quality

- [ ] Zero axe violations on every page type at 375px and 1280px.
- [ ] **Every page is fully usable with JavaScript disabled.** No dead controls anywhere.
- [ ] Zero broken internal links. Zero third-party network requests.
- [ ] CLS = 0.00 on every page type. Lighthouse: perf ≥ 98, a11y 100, best practices 100, SEO 100.
- [ ] All performance budgets are **enforced by a script**, not merely documented.
- [ ] The manual-inspection record in `docs/qa/` is complete and signed off.

### The honest test

- [ ] **The author has posted a project update from their phone, at least once, before release.** If that workflow is painful, the site will die, and it is better to find that out in week one than in month six.
- [ ] A stranger can, in 90 seconds on the homepage, say what the author works on and find a repository.
- [ ] The site does not look like any other researcher's site.

### Production safety

- [ ] The live Blogger site at `starkonium.com` is **unmodified and still serving**.
- [ ] `starkonium.com` DNS is **unmodified**.
- [ ] The preview deployment emits `Disallow: /`.
- [ ] `docs/dns-cutover.md` exists, is marked informational, and **has not been executed**.

---

## Appendix F — Deferred features

Explicitly **out of scope for v1**. Each is deferred with a stated trigger — the condition under which it becomes worth building. Deferring is a decision, not an omission.

| Feature | Deferred because | Build it when |
|---|---|---|
| **Dense sortable project catalogue** (R11) | Twelve projects are a list; forty are a catalogue. There are five. | ≥ 12 projects exist. The schema already supports it — it is a new view, not a new model. |
| **Multi-facet filters** (method, tool, year) (R12) | Two facets over five projects is already almost redundant. Seven facets would be theatre. | The two-facet filter is genuinely insufficient — i.e. a single status+field query still returns > 15 results. |
| **A permalink page per project update** (R9) | Updates are four lines. A page per four-line update is 40 routes carrying nothing. | An update routinely needs a figure, a code block and 400 words — at which point it is an article, not an update, and the answer may be to write one. |
| **A full annotation pass over all 14 Volume I posts** | Three good annotations demonstrate the feature better than fourteen perfunctory ones. | Naturally, over time. Each annotation is a Ledger entry. |
| **`/now/archive`** | Needs ≥ 3 Now entries to be interesting. The data exists from day one. | ≥ 3 Now entries. It is a ~1-hour page. |
| **`/series/[slug]` pages** | The series *metadata* and prev/next ship in v1. A landing page for a 1-post series is embarrassing. | A series has ≥ 4 entries. |
| **`/experience/[slug]` detail routes** | The expandable single page is better until an entry outgrows it. | One entry exceeds ~1200 words. |
| **Automatic CV generation** | Formal CVs have conventions that fight a generic renderer. The hand-made PDF plus the `/experience` print stylesheet already give two good outputs. | Never, probably. If ever: only after the content model has been stable for a year. |
| **Analytics** | Ship without. Decide later whether you actually want to know. | You have a specific question that a number would answer. Then: self-hosted Umami or Plausible. **Never Google Analytics.** |
| **Newsletter** | RSS first. Three feeds ship in v1. | Readers ask for one. Then: Buttondown (it exports). Never a modal. |
| **Comments** | A moderation job nobody wants, on a research notebook. | **Never.** Link to email. |
| **Account system / auth** | There is one user and no private content. | **Never.** |
| **A CMS** (even Git-backed, e.g. Decap/Tina) | It adds a build dependency and an auth surface for a single author who is comfortable in Markdown. | **Only if the Ledger goes quiet for 8 weeks** — that would be evidence of real authoring friction, and the site's whole thesis depends on the author actually posting. That is the trigger, and it is a serious one. |
| **Live GitHub statistics** | Star counts are noise, and it would be the site's only third-party request. | Never. |
| **Dark mode** | A cream-and-orange identity has no obvious dark counterpart, and a bad dark mode would damage the brand more than its absence damages usability. | Only as a deliberate **"dusk" design pass** — `#1A1714` paper, re-derived rules and tints, a lightened accent that passes AA on dark. **Not a token inversion.** It is a full design project, not a feature. |
| **Database / server backend** | The site is a folder of files, and that is its greatest strength. | **Never.** This is ADR-0001 and it is a constraint. |
| **Domain migration / DNS cutover** | Out of scope by explicit instruction. | See Appendix G. Documented, gated on a complete Volume I migration, and **not executed**. |

---

## Appendix G — Live-domain cutover plan (informational, not executed)

> **This appendix is informational.** It is **not part of the current implementation.** No step below is to be performed by the coding agent. It exists so that the future cutover is a checklist rather than an improvisation, and so that the constraints (a complete, verified Volume I migration) are visible now rather than discovered later.
>
> **Nothing in Phases 0–14 touches `starkonium.com`, its DNS, or the Blogger configuration.** The live site remains untouched and serving throughout.

### G.0 Preconditions — the gate

Cutover **may not begin** until all of these are true:

- [ ] `migration/manifest.csv`: **all 14 rows `verified`** — converted, hand-reviewed, alt text written, standfirsts written, redirects mapped (R17).
- [ ] Every old Blogger URL has a tested redirect.
- [ ] The preview deployment has passed a full QA pass on real devices.
- [ ] `RELEASE_MANIFEST.md` records `MIGRATION_STATUS: complete`.
- [ ] The author has read every one of the 14 imported posts on the preview site.

### G.1 Backup

1. Blogger → Settings → **Back up content** → download the Atom XML. Store it in **two** places outside the repo, in addition to the committed copy.
2. Export the Blogger template.
3. Screenshot every one of the 14 live post pages (a visual record of what the originals looked like).
4. Record the current live sitemap and the current Search Console coverage report.

### G.2 Registrar and DNS capture

1. Identify the registrar for `starkonium.com`.
2. **Capture the complete current DNS record set** — every A, AAAA, CNAME, MX, TXT record, with TTLs. Screenshot it and commit the capture to `docs/dns/pre-cutover-YYYY-MM-DD.md`. **This is the rollback artefact.** Without it, there is no rollback.
3. Note the current TTLs. **Lower them to 300s at least 48 hours before cutover** so a rollback propagates in minutes, not days.
4. Note the Blogger custom-domain configuration (the `ghs.google.com` CNAME and the Blogger-issued verification CNAME).

### G.3 Redirect and QA preparation

1. Verify every one of the 14 redirects on the preview domain.
2. Verify the label-archive and monthly-archive redirects.
3. Verify `/feeds/posts/default` → `/rss.xml`.
4. Full QA on the preview: every page, every breakpoint, real devices, real screen readers, JS off, print.

### G.4 Cutover

1. Add `starkonium.com` and `www.starkonium.com` as custom domains in Cloudflare Pages. **Do not change DNS yet.**
2. Set `PUBLIC_SITE_URL=https://starkonium.com` on the production environment. **Verify that `robots.txt` now emits `Allow`** — this is the one switch that turns the preview into a live site, and it must be confirmed *before* traffic arrives.
3. Change the DNS records to point at Cloudflare Pages. **Do not delete the old records — record them first (§G.2).**
4. Wait for propagation (minutes, given the lowered TTL).
5. **Verify SSL:** the certificate is issued, valid, and covers both apex and `www`. `https://` resolves without a warning. HSTS is not enabled until the site has been stable for a week (an early HSTS mistake is very hard to undo).
6. Verify the apex → `www` (or `www` → apex) redirect is consistent with the canonical URLs the site emits. **Pick one and be consistent** — the canonicals say no-`www`, so `www` → apex.

### G.5 Post-cutover

1. **Google Search Console:** add the new property, submit `sitemap-index.xml`, and use the Change of Address tool **only if the domain itself changed** (it has not — only the host). Since the domain is the same, the 301s do the work.
2. Re-crawl the 14 old URLs. **Every one must 301 to a live page. Zero 404s.**
3. Monitor Cloudflare analytics for 404s for **30 days**. Any Blogger URL pattern that appears and 404s gets a redirect added.
4. Keep the Blogger blog **published but unlinked for 30 days** as a rollback path. Then unpublish it. **Never delete it** — the export is committed, but the original is the original.

### G.6 Rollback

If the site is broken and cannot be fixed in under an hour:

1. Restore the DNS records captured in §G.2. (TTL is 300s, so this propagates in minutes.)
2. Blogger resumes serving. Nothing was deleted; nothing is lost.
3. Fix the problem on the preview domain. Cut over again when it is right.

**The rollback works only if §G.2 was done properly.** That is the single most important step in this appendix.

---

*End of implementation plan. `rev. 1 — 2026-07-13`.*
*Companion document: `STARKONIUM_WEBSITE_DESIGN_SPEC.md`. Where the two disagree, this document wins.*
