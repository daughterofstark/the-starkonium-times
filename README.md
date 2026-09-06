# The Starkonium Times

The Starkonium Times will become a static personal website for research,
projects, reviews, and long-form writing. The planned publication is an evolving
public research notebook built from Markdown and MDX in Git.

## Current status

Phase 8 personal pages. The repository contains the first real homepage
structure, public project pages, writing pages, paper review pages, personal
static pages, topic pages, the content model, and the core reusable component
set needed by later pages. Published pages are sourced from fake fixtures and
provisional copy. No search implementation, RSS, sitemap, migration, packaging,
or deployment work has started.

The live Blogger site and the `starkonium.com` domain are untouched. Current
work does not modify Blogger, DNS, or any production deployment.

The local repository is connected to
`https://github.com/daughterofstark/the-starkonium-times.git` as `origin`.
Pushing branches to GitHub does not deploy the site or touch Blogger/DNS.

## Resolved versions

- Node.js: `24.18.0` (active LTS)
- npm: `11.16.0` (bundled with the selected Node.js release)
- Astro: `7.0.8`
- TypeScript: `6.0.3` (latest stable compatible with Astro type checking)

These exact versions were resolved and frozen during Phase 0. Use the Node.js
version in `.nvmrc`; `package.json` pins npm and all JavaScript dependencies.
Major-version upgrades are intentionally excluded from the current project.

## Requirements

- Node.js `24.18.0`
- npm `11.16.0`
- Chromium installed through Playwright only in CI, or optionally for local
  browser-dependent e2e checks

## Setup

```sh
nvm install
nvm use
npm ci
```

No `.env` file is needed. Local builds use `http://localhost:4321` as the safe
site URL default. Preview deployments must set `DEPLOY_CONTEXT=preview` and an
explicit `SITE_URL`. Production builds must set `DEPLOY_CONTEXT=production` and
`SITE_URL=https://starkonium.com`; otherwise configuration fails clearly.
These server-side build variables are not exposed to browser code.

## Development

```sh
npm run dev
```

## Validation

```sh
npm run validate
npm run validate:full
```

`validate` runs formatting, linting, Astro/TypeScript checking, and the Vitest
unit test. `validate:full` also creates the static production build. In CI it
runs the Playwright test against `astro preview`; locally it skips the e2e smoke
test with a clear warning when Playwright Chromium is not installed.

Individual checks are available as `npm run format:check`, `npm run lint`,
`npm run typecheck`, `npm test`, and `npm run test:e2e`. Use `npm run format` and
`npm run lint:fix` for local fixes.

Phase 0 intentionally does not download Playwright Chromium during local setup.
The Playwright configuration and smoke test are committed, and GitHub Actions
installs Chromium with `npx playwright install --with-deps chromium` before
running `npm run test:e2e`. Local e2e may be run manually after installing a
Playwright browser, but it is not required for local validation.

## Build and preview

```sh
npm run build
npm run preview
```

The build is static and writes generated output to `dist/`, which is ignored by
Git.

## Repository structure

```text
.github/workflows/ci.yml  Baseline GitHub Actions validation
src/components/           Global shell components
src/content/              Fake fixture content and YAML metadata
src/content.config.ts     Astro 7 content collection configuration
src/layouts/              Base page layout
src/lib/                  Shared shell constants and smoke-test data
src/pages/index.astro     Phase 4 homepage assembled from fixture content
src/pages/projects/       Phase 5 project index and detail routes
src/pages/reviews/        Phase 7 paper review index and detail routes
src/pages/topics/         Phase 8 topic index and detail routes
src/pages/writing/        Phase 6 writing index and article routes
src/pages/dev/            Noindexed internal component showcase
src/styles/               Layered global CSS tokens, reset, base, layout, utilities, print
src/utils/                Content schemas, validators, derived fields, Ledger utilities
tests/unit/               Vitest smoke test
tests/e2e/                Playwright production-preview smoke test
astro.config.mjs          Static output and safe site URL configuration
eslint.config.js          ESLint flat configuration
playwright.config.ts      Production preview test configuration
prettier.config.mjs       Formatting configuration
vitest.config.ts          Unit test configuration
tsconfig.json             Strict TypeScript configuration
```

The design specification and implementation plan remain at the repository root
as planning inputs for later phases.

## Homepage

Phase 4 replaces the temporary placeholder with a v1 editorial front page at
`/`. It includes an opening statement, recent Ledger entries, the newest Now
entry, selected projects, latest writing/review fixtures, and short
About/contact sections. Links to future routes such as `/log`, `/cv.pdf`, and
`/rss.xml` remain placeholders until later phases create those routes.

## Projects

Phase 5 adds `/projects` and `/projects/[slug]`. The index lists non-draft
project fixtures in derived-update order with progressive status and field
filters. With JavaScript disabled, all public projects remain visible. Project
detail pages render frontmatter metadata, topics, optional body prose, outputs,
repositories, related writing links, and update rows when those fields exist.
Draft project fixtures do not generate public detail pages.

## Writing

Phase 6 adds `/writing` and `/writing/[slug]`. The index groups published
writing and reviews by year, includes a kind-only progressive filter, keeps
Volume I entries in the normal feed at full contrast, and highlights up to two
featured entries. Writing detail pages render the article header, topic chips,
the prose typography system, optional contents, reading metadata for longer
pieces, revisions, related writing, and series navigation when data exists.

## Paper reviews

Phase 7 adds `/reviews` and `/reviews/[slug]`. The index lists non-draft review
fixtures in reverse review-date order with progressive verdict and field
filters. With JavaScript disabled, all public reviews remain visible. Review
detail pages render prose-first verdicts, a mono record block, paper
availability, assessment strips with accessible labels, reproduction notes,
body prose, DOI citation metadata, and a reusable citation block. The review
pages intentionally avoid aggregate numeric ratings and structured rating
metadata.

## Personal pages and topics

Phase 8 adds `/experience`, `/about`, `/now`, `/colophon`, `/topics`,
`/topics/[slug]`, and `/404`. The experience page is a single no-JavaScript
chronology using native details/summary disclosure. The Now page renders the
newest Now entry and marks stale entries as overdue after 60 days. The About,
homepage, and footer use one shared contact block with a plain-text placeholder
email. There is intentionally no `/contact` route.

`/topics` groups the controlled vocabulary by facet and shows reference counts.
Each topic detail page groups public references by projects, writing, reviews,
and experience. Search, RSS, sitemap output, `/now/archive`, and a hand-managed
`/cv.pdf` are intentionally deferred.

## Content fixtures

Phase 2 fixture content lives under `src/content/` and is deliberately fake.
Projects, writing, reviews, experience entries, and Now entries use Markdown or
MDX collection files. Topics, series, and people metadata use YAML files loaded
with Astro 7's `file()` loader. Relationship and vocabulary rules are covered by
unit tests around the shared validators.

The fixtures exist to prove schemas, utilities, components, and homepage
selection rules, not to publish real biography, research claims, Blogger
imports, or final archives.

## Component showcase

Phase 3 adds `src/pages/dev/components.astro`, a noindexed internal showcase
page that renders the reusable component set against fake fixture data. It is
not linked from public navigation and exists only to prove components build
before final pages exist.

## Fonts

Phase 1 defines `--font-display`, `--font-reading`, `--font-interface`, and
`--font-code` tokens. The initial stacks name Fraunces, Newsreader, and IBM Plex
Mono with system fallbacks, but no font packages or self-hosted font files are
installed yet. Future font loading can change the token definitions without
rewriting components.

## Licences

Code is licensed under the MIT License in `LICENSE`. Unless otherwise noted,
original written and visual content is licensed under Creative Commons
Attribution 4.0 International in `LICENSE-CONTENT`. Third-party material retains
its original licence.
