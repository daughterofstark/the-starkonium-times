# The Starkonium Times

The Starkonium Times will become a static personal website for research,
projects, reviews, and long-form writing. The planned publication is an evolving
public research notebook built from Markdown and MDX in Git.

## Current status

Phase 0 repository bootstrap only. The repository currently contains one
minimal smoke page and the tooling needed to install, format, lint, typecheck,
test, build, and preview it. No final design, collections, site content, search,
migration, or deployment work has started.

The live Blogger site and the `starkonium.com` domain are untouched. Phase 0
does not modify Blogger, DNS, or any production deployment.

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
Playwright browser, but it is not required for Phase 0 local validation.

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
src/lib/                  Minimal shared Phase 0 code
src/pages/index.astro     The single temporary smoke page
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

## Licences

Code is licensed under the MIT License in `LICENSE`. Unless otherwise noted,
original written and visual content is licensed under Creative Commons
Attribution 4.0 International in `LICENSE-CONTENT`. Third-party material retains
its original licence.
