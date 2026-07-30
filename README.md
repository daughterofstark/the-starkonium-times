# The Starkonium Times

The Starkonium Times will become a static personal website for research,
projects, reviews, and long-form writing. The planned publication is an evolving
public research notebook built from Markdown and MDX in Git.

## Current status

Phase 4 homepage. The repository contains the first real homepage structure,
the content model, and the core reusable component set needed by later pages.
The homepage is sourced from fake fixtures and provisional copy. No public
project detail pages, writing detail pages, review detail pages, search
implementation, migration, packaging, or deployment work has started.

The live Blogger site and the `starkonium.com` domain are untouched. Current
work does not modify Blogger, DNS, or any production deployment.

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
About/contact sections. Links to future indexes such as `/projects`, `/writing`,
`/reviews`, `/log`, `/cv`, and `/rss.xml` are placeholders until later phases
create those routes.

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
