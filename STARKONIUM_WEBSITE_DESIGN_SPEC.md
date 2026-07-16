# STARKONIUM — Website Design & Product Specification

**Document status:** `rev. 1 — 2026-07-12`
**Owner:** site author (referred to below as `{{AUTHOR}}`)
**Purpose:** a hand-off-ready specification. A frontend developer or coding agent should be able to build the site from this document with minimal ambiguity.
**Scope note:** this document contains design decisions, schemas, tokens and acceptance criteria. It deliberately contains no production implementation code.

Placeholders to be filled by the author before build: `{{AUTHOR}}`, `{{EMAIL}}`, `{{GITHUB}}`, `{{ORCID}}`, `{{SCHOLAR}}`, `{{LINKEDIN}}`, `{{INSTITUTION}}`, `{{CITY}}`. All example copy in this document is illustrative and must be replaced with real content.

---

## Table of contents

1. [Product vision](#1-product-vision)
2. [Audience](#2-audience)
3. [Brand identity](#3-brand-identity)
4. [Visual direction](#4-visual-direction)
5. [Information architecture](#5-information-architecture)
6. [Page-by-page specifications](#6-page-by-page-specifications)
7. [Navigation](#7-navigation)
8. [Design system](#8-design-system)
9. [Component inventory](#9-component-inventory)
10. [Typography system](#10-typography-system)
11. [Colour system](#11-colour-system)
12. [Layout and responsive behaviour](#12-layout-and-responsive-behaviour)
13. [Interaction and motion](#13-interaction-and-motion)
14. [Accessibility](#14-accessibility)
15. [Content models and schemas](#15-content-models-and-schemas)
16. [Technical architecture](#16-technical-architecture)
17. [SEO and metadata](#17-seo-and-metadata)
18. [Migration considerations](#18-migration-considerations)
19. [Version-one scope](#19-version-one-scope)
20. [Future expansion](#20-future-expansion)
21. [Explicit anti-patterns](#21-explicit-anti-patterns)
22. [Open design decisions](#22-open-design-decisions)
23. [Acceptance criteria](#23-acceptance-criteria)

---

## 1. Product vision

### 1.1 One sentence

**Starkonium is a public laboratory notebook with the manners of an independent journal: a single person's evolving archive of research, software, reviews and writing, where unfinished work is a first-class citizen.**

### 1.2 The thesis

Most personal research sites are *résumés with a blog attached*. They show completed, flattering artefacts. They are static, and they lie by omission — the failures, the abandoned analysis plans, the moment the validation broke, are all edited out.

Starkonium inverts this. The organising principle is not *achievement* but **revision**. The site's atomic unit is not the polished project page; it is the **dated entry** — an update, a note, a review, an erratum, a correction to something written three years ago. Projects are living documents that accrete updates. Old blog posts are not buried; they are *annotated* by a later self. The About page changes; the Now page changes weekly; the CV records what was learned, not only what was delivered.

This gives the site a property that portfolio templates cannot have: **it is worth returning to.** A reader who visited last month has a reason to visit again, and the homepage's job is to make that reason immediately visible.

### 1.3 Product principles

| # | Principle | Consequence for the build |
|---|---|---|
| P1 | **Dated over polished** | Every content type carries a date and, where relevant, a revision history. Unfinished work is publishable. |
| P2 | **The archive is the product** | Browsing, filtering and search are core features, not afterthoughts. Density is acceptable; clutter is not. |
| P3 | **Documents, not dashboards** | The site is read, not operated. Reading quality outranks interactivity everywhere. |
| P4 | **Failure is content** | Project pages have first-class sections for dead ends, wrong turns and superseded decisions. These are never visually demoted. |
| P5 | **Own the substrate** | Markdown/MDX in a Git repository. No closed CMS. The content survives every redesign, including this one. |
| P6 | **Calm and fast** | Zero client JS on reading pages. No animation that the reader did not initiate. |
| P7 | **Serious work, personal voice, one house** | A molecular-dynamics validation report and an essay about a novel live under one masthead, distinguished by *labels and layout*, never by a change of visual identity. |

### 1.4 Success criteria (qualitative)

- A principal investigator can, in 90 seconds, understand what `{{AUTHOR}}` works on, see evidence of current activity, and find a repository.
- A reader who came for a paper review stays for an essay.
- `{{AUTHOR}}` can post a two-line project update from a phone via a Git commit and it appears in three places automatically.
- The site does not look like any other researcher's site.

---

## 2. Audience

Ranked. Design conflicts are resolved in favour of the higher-ranked audience.

### A1 — Research readers (primary)

PIs, postdocs, collaborators, hiring committees, grad-admissions readers, people evaluating `{{AUTHOR}}` for a role or a collaboration.

- **Want:** what does this person actually do; how do they think; is the work real; is it rigorous; can I see code; can I see a CV.
- **Enter via:** homepage, a project page linked from a repo, `/experience`, a Google search of `{{AUTHOR}}`'s name.
- **Design implications:** methods and outputs must be scannable without reading prose. Status must be honest and legible. A concise PDF CV must be one click from anywhere. Evidence (repos, DOIs, figures) must be near the top of project pages, not buried.

### A2 — Peer scientists and technical readers

People who arrived from a link to a specific essay, review, or explainer.

- **Want:** an excellent long-form reading experience; correct maths and figures; references; a way to find more of the same kind.
- **Design implications:** article typography is the highest-craft surface on the site. Related-writing and series navigation must be strong. RSS is non-negotiable.

### A3 — Curious general readers

People who found the biology writing. Some arrive from the old *Starkonium Times* posts.

- **Want:** to be taught something without condescension; to not hit a paywall of jargon.
- **Design implications:** the writing archive must be filterable by *kind* so a general reader can find `explainer` and `essay` and ignore `research note`. Old posts must not feel like an embarrassing basement.

### A4 — `{{AUTHOR}}`

The author is a real user with real jobs to be done.

- **Want:** to add an update in under two minutes; to draft in Markdown; to never fight a CMS; to feel like posting.
- **Design implications:** authoring friction is a first-class design problem. Frontmatter must be short, with sensible defaults. `draft: true` must work. Update entries must be creatable as a single small file — or as a single item in the project's own frontmatter (see §15.3 for the decision).

**Explicitly not an audience:** recruiters looking for buzzword grids, SEO crawlers being farmed for traffic, and casual visitors who need to be *converted*. There is no funnel. There is no newsletter modal.

---

## 3. Brand identity

### 3.1 The name

**STARKONIUM.** It stays. It is treated as a *masthead*, in the sense a magazine or a journal has a masthead — not as a logo in the tech sense, and explicitly not as a chemical element tile.

The `-ium` suffix is a real risk: it invites the periodic-table reading, and that reading has already been claimed and exhausted by others. The counter-move is to lean hard on the **editorial** reading of the name instead: `-ium` as in *compendium*, *symposium*, *auditorium* — a **place where things are gathered**. Starkonium is a place, not a substance.

### 3.2 Wordmark

**Construction.** `STARKONIUM` set in **Fraunces**, uppercase, weight 500, optical size at display setting, `WONK` axis on, letter-spacing `+0.02em`, followed by a **superscript revision marker** set in IBM Plex Mono at 0.38em, raised, in vermilion.

```
STARKONIUM ⁷
└── Fraunces 500, uppercase, wonk on
              └── mono superscript, vermilion, = current site revision, links to /colophon
```

**What the superscript means.** It is a **footnote/erratum marker**, not a charge or a mass number. It increments when the site itself is revised, and it is a live link to `/colophon`, which lists what changed. It is the identity's smallest possible statement of the entire product thesis: *this document is under revision.*

**Risk, stated plainly.** A superscript numeral after a name ending in `-ium` can be misread as an ionic charge or isotope number — precisely the association we are avoiding. Three mitigations, all mandatory:

1. The marker is **never** rendered inside a box, tile, square, circle, or any bounded shape.
2. It is set in **mono**, in **vermilion**, at a size and baseline that reads as a footnote reference, and it is a **hyperlink** with `aria-label="Site revision 7 — see colophon"` and a tooltip on hover.
3. It is **omitted entirely** at small sizes (< 20px cap height), in the favicon, in OG images, and anywhere it cannot carry its explanatory link.

This is flagged as **Open Decision OD-1** (§22). The fallback, if the ionic reading proves sticky in user testing, is a **superscript dagger `†`** with identical behaviour — unambiguously editorial, equally on-brief. Build the wordmark component with a `marker: 'revision' | 'dagger' | 'none'` prop so this is a one-line change.

**Lockups.**

| Context | Form |
|---|---|
| Site header (desktop) | `STARKONIUM⁷` — full, 22px cap height |
| Site header (mobile) | `STARKONIUM` — no marker, 18px cap height |
| Favicon / app icon | A single `S` in Fraunces, ink on cream, with a vermilion insertion caret `‸` tucked under the spine. No square tile framing. |
| OG image | `STARKONIUM` in the top-left corner rule, small, uppercase, tracked out — a running head, not a logo |
| Print / PDF CV | `STARKONIUM` as a footer running head only; the CV's own header is `{{AUTHOR}}`'s name |
| Old-archive masthead | `THE STARKONIUM TIMES` in Fraunces with the double rule (see §8.6) — a deliberate period costume for the 2021–23 volume |

**Never:** rotated, tilted, gradient-filled, on a photograph, in a square, in a circle, with an atom, with a helix, animated on page load, or with a tagline lock-up.

### 3.3 Voice

- **Precise, plain, unhurried.** Short declaratives. Technical terms used correctly and not explained defensively.
- **Willing to say "I don't know," "this failed," "I was wrong."** These phrases are brand assets.
- **Dry, never cute.** Wit is allowed in the essays; the interface never jokes. Empty states inform; they do not perform.
- **First person, no corporate plural.** No "we" unless there were actually collaborators.
- **Forbidden register:** "passionate about", "innovative", "cutting-edge", "leveraging", "at the intersection of", "I'm a X who loves Y", "🚀".

**Interface copy examples.**

| Situation | Copy |
|---|---|
| Empty filter result | `No projects match these filters. Clear filters` |
| Search, no results | `Nothing found for "chromatin loop". Try a broader term, or browse the topic index.` |
| Draft badge (local only) | `DRAFT — not published` |
| Superseded content | `Superseded 2025-11-02. See revision note below.` |
| Paused project | `Paused since 2025-03-14 — reason recorded in the decision log.` |
| 404 | `No page here. This may be an old Starkonium Times link — try the archive.` |
| Error loading search index | `Search is unavailable. The archive index is still browsable.` |

### 3.4 Conceptual anchors (the ones we chose)

Adopted, from the brief's list: **evolving archive**, **internet laboratory notebook**, **research under revision**, **annotated thought**, **an editorial scientific journal belonging to one person**.

Rejected: **unstable matter** — it pulls straight back toward the chemistry/element imagery we are avoiding, and it invites glitch effects, which are an anti-pattern here (§21).

---

## 4. Visual direction

### 4.1 Reference frame

Hold these in mind, and nothing else:

- A **laboratory notebook**: gridded or ruled paper, page numbers, a date in the corner, a countersignature, corrections struck through with a single line and initialled — never erased.
- An **independent editorial journal** (think *The Believer*, *MacGuffin*, *Works That Work*): confident serif display, generous white space, real hierarchy, marginalia, hairline rules, a running head on every page.
- **Proofreading marks**: the insertion caret `‸`, the deletion stroke, `stet`, the marginal query `?`.
- A **library shelfmark**: `PRJ-014 · 2026-07-12 · rev.3` — an identifier that is *actually true*, printed small, in mono, in the corner.

### 4.2 The look, in one paragraph

Warm cream paper. Near-black warm ink. Hairline rules doing the work that boxes and shadows do elsewhere. **Zero corner radius** — every edge on the site is square, without exception. Type is the interface: a high-contrast, slightly odd editorial serif for display, a plain grotesque for navigation and metadata, a text-optimised serif for long reading, and a typewriter-ish mono for anything that is *data* — dates, statuses, DOIs, coordinates, code. Vermilion appears the way a red pen appears on a manuscript: rarely, deliberately, and always to mean something. A page has one status stamp, one accent gesture, and a great deal of quiet.

### 4.3 Signature: **The Ledger**

The single element the site is remembered by.

**The Ledger** is a dense, dated, one-line-per-entry chronological rail that unifies *every* content type on the site — project updates, new articles, paper reviews, `now` changes, errata. It is set entirely in mono at 13px, with hairline rules between rows, and it looks like the index page of a bound lab notebook.

```
2026-07-09   UPD   PRJ-014  fold-switch     Validation set rebuilt; AUC drops to 0.71. Not good.       →
2026-07-02   ESS   —        writing         On the smell of a wet culture room                          →
2026-06-28   REV   —        reviews         Kim et al. 2026 · Nat Methods · verdict: partly convincing  →
2026-06-21   UPD   PRJ-009  md-ensembles    Paused. Cluster quota gone until September.                 →
2026-06-18   NOW   —        now             Reading list updated                                        →
```

It appears in three places:

1. **Homepage** — the most recent 8 entries, immediately below the opening statement. This is what makes the homepage *alive*.
2. **`/log`** — the complete global updates archive, filterable and paginated, going back to the first entry.
3. **Project pages** — filtered to that project, at the foot of the page.

It is the same component in all three places. Building it well is the highest-leverage thing in this project.

**Why it works:** it encodes something true (chronology and provenance), it is honest (bad results appear next to good ones), it rewards return visits, it is fast (text only), and no other personal research site looks like this.

### 4.4 The four supporting motifs

Restrained. Each one must survive the test: *if this were removed, would the page lose information?* If not, it is decoration and it must earn its place another way.

#### M1 — The shelfmark

Every substantive page carries, top-right, a mono line in umber:

```
PRJ-014 · started 2025-11-02 · rev.7 · updated 2026-07-09
```

Real, generated data. Project IDs are stable and permanent (`PRJ-014`), as are article IDs (`WRT-031`), reviews (`REV-008`) and experience entries (`EXP-003`). They are citable. They appear in the URL as an optional prefix-free anchor and in the OG image. This is what makes the site feel like an *archive with a catalogue* rather than a blog.

**Rules:** 12px mono, `--umber`, letter-spaced `+0.04em`, uppercase for the prefix. Never bigger than the body text. On mobile it collapses to a single line below the title.

#### M2 — The insertion caret `‸`

The proofreader's insertion mark is the site's **bullet, marker and section glyph**.

- List bullets in editorial contexts: `‸` in vermilion instead of `•`.
- Section openers: a small vermilion `‸` sits in the left margin at the start of each `<h2>` on project and article pages.
- The "more" affordance: `‸ read on` instead of an arrow.
- The favicon's secret ingredient.

It is a mark that means *there is more here than was originally written* — which is the whole site.

**Rules:** never larger than 0.7× the adjacent cap height; never the sole indicator of anything (always has an accessible text label); never animated.

#### M3 — Marginalia

A persistent margin column (right on ≥1200px, inline on smaller) carrying **sidenotes, timestamps, status stamps and later annotations**. This is where the archive becomes *annotated thought*.

Its most important use: **annotations on old writing.** When a 2022 post says something `{{AUTHOR}}` no longer believes, a dated vermilion margin note appears beside the paragraph:

> `2026-04-02 —` This was wrong. AlphaFold-Multimer's interface confidence does not transfer to obligate homodimers; see PRJ-014.

The original text is **never edited silently**. This single feature converts the old blog from a liability into the site's best argument for itself.

#### M4 — The revision stroke and the status stamp

Two related devices, used sparingly.

**The revision stroke.** Superseded text is struck through in ink (single line, 1px, not decorative) with the replacement following in vermilion, and a dated note in the margin. Available as an MDX component (`<Superseded on="2025-11-02">…</Superseded>`).

**The status stamp.** Exactly **one per page**, in the project header. A mono, uppercase, letter-spaced label inside a 1px vermilion or ink rule box, rotated **−1.5°**, with slightly imperfect ink weight — a rubber stamp, not a badge.

```
┌───────────────┐
│  A C T I V E  │   ← rotated −1.5°, 1px vermilion rule, vermilion text, transparent fill
└───────────────┘
```

**The −1.5° rotation is the site's one moment of imprecision, and that is the point:** everything else is set square and exact. The stamp is the human hand in an otherwise typeset object. It appears **only** in project headers and nowhere else — status shown in lists and tables uses the flat status chip (§9), not the stamp.

**Cliché check.** Nothing on this site uses: glowing DNA, molecule renders, atom icons, hexagons, neon-blue gradients, stock microscopes, dark-mode "cyberpunk lab", gradient blobs, glassmorphism, or a periodic-table tile. The only imagery is **the author's own figures, plots and photographs**, presented as figures with captions and credit — the way a journal presents them.

---

## 5. Information architecture

### 5.1 Content types

Nine, and no more:

| Type | ID prefix | Route | Purpose |
|---|---|---|---|
| Project | `PRJ` | `/projects/[slug]` | A body of work, ongoing or finished |
| Update | `UPD` | `/log/[date]-[slug]` | A small dated event attached to a project |
| Article | `WRT` | `/writing/[slug]` | Any piece of writing that isn't a review |
| Review | `REV` | `/reviews/[slug]` | A structured paper review |
| Experience | `EXP` | `/experience/[slug]` | A role, position or research placement |
| Now | `NOW` | `/now` (+ `/now/archive`) | The current state of things |
| Person | — | (no page in v1) | Collaborator/supervisor references |
| Topic | — | `/topics/[slug]` | Unified taxonomy (see below) |
| Series | — | `/series/[slug]` | An ordered sequence of articles or projects |

### 5.2 The unified taxonomy — one system, four facets

**Decision:** do not build separate `fields`, `methods`, `technologies` and `tags` systems. They fragment, they duplicate (`molecular dynamics` as both a field and a method), and they produce four inconsistent filter UIs.

Instead: **one `Topic` entity with a `facet` discriminator.**

```
Topic {
  slug: "molecular-dynamics"
  label: "Molecular dynamics"
  facet: "method"            // "field" | "method" | "tool" | "theme"
}
```

| Facet | Meaning | Examples | Appears as |
|---|---|---|---|
| `field` | Research area | structural biology, computational biology, image analysis | Primary filter; shown in headers |
| `method` | Technique or approach | molecular dynamics, coevolutionary coupling, segmentation, docking |Chips on project/article headers |
| `tool` | Software, language, library | Python, GROMACS, PyTorch, napari, Nextflow | Mono chips, technical metadata rows |
| `theme` | Editorial / non-technical subject | reproducibility, scientific reasoning, literature, teaching | Chips on articles; drives essay browsing |

Every content type references topics through a single `topics: string[]` field. `/topics/[slug]` shows everything that references that topic, grouped by content type. `/topics` is a browsable index grouped by facet — this becomes an excellent secondary navigation surface and an SEO asset.

**Why this is right for Starkonium:** it means an essay about reproducibility, a project that had reproducibility problems, and an experience entry where reproducibility was the job all surface on the same page. The site's intellectual coherence becomes navigable.

### 5.3 Full route map

```
/                                  Home
/projects                          Project index (ledger + notes views, faceted)
/projects/[slug]                   Project page
/log                               Global updates archive (The Ledger, complete)
/log/[date]-[slug]                 Permalink for a single update (rarely visited directly; needed for RSS + citation)
/writing                           Writing archive (all kinds incl. reviews, archive volume, notes)
/writing/[slug]                    Article page
/reviews                           Paper review index
/reviews/[slug]                    Paper review page
/experience                        Extended CV
/experience/[slug]                 Single role, long form
/about                             About
/now                               Now
/now/archive                       Previous Now entries (the "evolving document" made real)
/archive                           The Starkonium Times, 2021–2023 (volume front page)
/topics                            Topic index, grouped by facet
/topics/[slug]                     Single topic
/series/[slug]                     Single series
/search                            Full-page search (progressive-enhancement fallback for the ⌘K dialog)
/colophon                          How the site is made; revision history; the superscript's explanation
/cv.pdf                            Concise formal CV (static asset)
/rss.xml                           Everything
/rss/writing.xml                   Articles + reviews only
/rss/log.xml                       Project updates only
/sitemap-index.xml
/robots.txt
/404
```

**Notes on two decisions.**

- **Reviews get their own route** (`/reviews/[slug]`, not `/writing/[slug]`). They have a distinct schema, a distinct layout, distinct structured data (`schema.org/Review`), and a distinct audience. But they **also appear in the `/writing` feed**, labelled `REVIEW`. Separate home, shared street.
- **The old blog lives at `/archive`**, which is a *volume front page* with its own masthead — not a junk drawer (§6.11). Its posts live at `/writing/[slug]` like everything else, carrying `volume: "times"`. They appear in the main writing feed, in date order, unhidden.

### 5.4 IA diagram

```
                                   ┌──────────────┐
                                   │     HOME     │  ← statement · ledger · currently · work · writing
                                   └──────┬───────┘
             ┌────────────────┬───────────┼───────────┬────────────────┐
             │                │           │           │                │
        ┌────▼────┐      ┌────▼────┐ ┌────▼────┐ ┌────▼─────┐    ┌─────▼────┐
        │ PROJECTS│      │ WRITING │ │  EXPER. │ │  ABOUT   │    │   NOW    │
        └────┬────┘      └────┬────┘ └────┬────┘ └──────────┘    └────┬─────┘
             │                │           │                            │
      ┌──────▼──────┐   ┌─────▼─────┐ ┌───▼────┐                 ┌─────▼─────┐
      │ project     │   │ article   │ │ role   │                 │ now/archive│
      │  page       │   │  page     │ │  page  │                 └───────────┘
      └──────┬──────┘   └─────┬─────┘ └────────┘
             │                │
             │          ┌─────▼─────┐        ┌──────────┐        ┌──────────┐
             │          │  REVIEWS  │        │  /archive│        │  /topics │
             │          │  (index)  │        │  (Times) │        │  /series │
             │          └───────────┘        └──────────┘        └──────────┘
             │
      ┌──────▼──────────────────────────────┐
      │  /log  — THE LEDGER (all updates)   │  ← also embedded on home + each project
      └─────────────────────────────────────┘
```

---

## 6. Page-by-page specifications

Global page furniture, present on every page unless stated: skip link → header (§7) → `<main>` → footer (§7.6). Every page has a `<title>`, a description, an OG image, a canonical URL, and exactly one `<h1>`.

---

### 6.1 Home — `/`

**Job:** in one screen, establish *who this is* and *that it is alive*. In three screens, prove it.

**Rejected structure:** hero headline + three feature cards + "selected work" grid + newsletter CTA. That is the template answer; it says nothing that isn't on a thousand other sites.

**Adopted structure** (top to bottom):

```
┌───────────────────────────────────────────────────────────────────────┐
│  STARKONIUM⁷        Projects  Writing  Experience  About      ⌘K  ●NOW│  header
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ‸ I work on how proteins decide what to bind, and on making          │  1. STATEMENT
│    that decision reproducible by someone who is not me.               │     Fraunces
│                                                                       │     clamp 34→52px
│    Computational and structural biology. Currently at {{INSTITUTION}} │     3 lines max
│    Everything below is dated and under revision.                      │     sans, umber
│                                                                       │
├───────────────────────────────────────────────────────────────────────┤
│  RECENT                                              all entries →    │  2. THE LEDGER
│  ─────────────────────────────────────────────────────────────────    │     8 rows
│  2026-07-09  UPD  PRJ-014  Validation set rebuilt; AUC drops to 0.71  │     mono 13px
│  2026-07-02  ESS  —        On the smell of a wet culture room         │     hairline rules
│  2026-06-28  REV  —        Kim et al. 2026 · partly convincing        │
│  …                                                                    │
├───────────────────────────────────────────────────────────────────────┤
│  CURRENTLY                                            the now page →   │  3. CURRENTLY
│  ─────────────────────────────────────────────────────────────────    │     3 cols → 1
│  BUILDING          INVESTIGATING           READING                     │     pulled from
│  A rewrite of the │ Whether fold-switch  │ Ishiguro, Klara and       │     /now, single
│  contact-map…     │ propensity…          │ the Sun                    │     source of truth
├───────────────────────────────────────────────────────────────────────┤
│  SELECTED WORK                                       all projects →    │  4. WORK
│  ─────────────────────────────────────────────────────────────────    │     3–4 entries
│  PRJ-014  [ACTIVE]                                                    │     editorial rows,
│  Fold-switch propensity from coevolutionary signal                    │     NOT cards
│  A one-sentence thesis about why this project exists and what it      │
│  would mean if it worked.                                             │
│  structural biology · coevolution · PyTorch      started 2025-11 ‸    │
│  ─────────────────────────────────────────────────────────────────    │
│  PRJ-009  [PAUSED]  …                                                 │
├───────────────────────────────────────────────────────────────────────┤
│  LATEST WRITING                                       all writing →    │  5. WRITING
│  ─────────────────────────────────────────────────────────────────    │     3 items,
│  ESSAY · 12 min · 2026-07-02                                          │     mixed kinds,
│  On the smell of a wet culture room                                   │     one must be
│  Two lines of standfirst, set in Newsreader, that actually sell the   │     a review
│  piece rather than truncating it with an ellipsis.                    │
├───────────────────────────────────────────────────────────────────────┤
│  ‸ About in 60 words. Then: email · GitHub · ORCID · Scholar · CV     │  6. COLOPHON
└───────────────────────────────────────────────────────────────────────┘
```

**Rationale for the order.**

1. **Statement before everything.** Not a name, not a photo, not a job title. A claim about the work. The name is in the masthead; repeating it is redundancy dressed as a hero.
2. **The Ledger is second, above the projects.** This is the site's core argument and its biggest differentiator. A visitor sees *activity* before they see *artefacts*. On a normal portfolio you learn what someone did; here you learn what they did *this week*.
3. **Currently third** — the human-scale answer to "what is this person actually thinking about", pulled live from `/now` so it is never stale relative to the Now page.
4. **Selected work fourth,** as editorial entries with a real one-sentence thesis, not cards. Four maximum.
5. **Latest writing fifth,** with a standfirst that is *written*, not truncated.
6. **A short about + links last** — the person who scrolled this far wants to contact you.

**Explicitly absent from the homepage:** a photograph of the author (goes on `/about`), a skills grid, a logo wall, a testimonial, a call-to-action button, a newsletter form, an animated hero, statistics counters.

**Empty/degenerate states:** if fewer than 8 ledger entries exist, show what exists and do not pad. If `/now` is older than 60 days, the `CURRENTLY` block shows a mono note: `Last updated 2026-04-01 — overdue.` (Honest, and a good nudge for the author.)

**Data:** home is fully static, built from content collections. Zero client JS except the search dialog trigger.

---

### 6.2 Projects index — `/projects`

**Job:** make 5 projects feel substantial and 40 projects feel navigable, using the same interface.

**Two views, toggled** (state in URL: `?view=index|notes`, persisted in `localStorage`, default `notes` on first visit, `index` once ≥12 projects exist):

#### View A — **Notes** (default)

Editorial entries in a single column, sorted by `updated` descending. Each entry is a **row, not a card**: no border, no background, no shadow, no radius. Separated by a hairline rule. Hover raises the paper tint by one step and slides the `‸` marker 4px right.

```
─────────────────────────────────────────────────────────────────────────
PRJ-014                                      [ACTIVE]   started 2025-11-02
                                                        updated 2026-07-09
Fold-switch propensity from coevolutionary signal
                                     ← Fraunces 500, clamp 24→30px
Can a coevolutionary coupling matrix tell you that a protein has two folds
before you ever run a simulation? Six months in, the honest answer is
"sometimes, and I can't yet predict when."
                                     ← Newsreader 18px, 2–3 lines, real prose

structural biology · coevolution · MSA · PyTorch · GROMACS
                                     ← topic chips, mono 12px
                                                            3 updates · 1 essay ‸
─────────────────────────────────────────────────────────────────────────
```

The two-to-three line description is a **required field** (`thesis`) and must be written as prose, not truncated from the body. This is the single biggest quality lever on this page.

#### View B — **Index** (the catalogue)

A genuine table, mono, dense, sortable by any column. This is what a lab notebook's index page looks like, and it scales to 100 projects without embarrassment.

```
  ID       PROJECT                              FIELD          STATUS      STARTED     UPDATED
  ───────────────────────────────────────────────────────────────────────────────────────────
  PRJ-014  Fold-switch propensity…              struct. bio    ▪ active    2025-11-02  2026-07-09
  PRJ-012  Reproducible MD ensembles            comp. bio      ▫ validation 2025-08-19 2026-05-30
  PRJ-009  Segmentation of live-cell tubulin    imaging        ▫ paused    2025-02-01  2025-03-14
  PRJ-006  Contact-map autoencoder              struct. bio    ▪ completed 2024-06-11  2024-12-02
```

Sorting is client-side on a pre-rendered table (progressive enhancement — the table is fully readable and sorted by `updated` with JS off).

#### Filtering

A **filter rail**, sticky on desktop (left, 200px), a collapsible sheet on mobile. Not a row of pills across the top.

```
FILTER
──────────────
STATUS
▪ active         4
▫ validation     1
▫ exploratory    3
▫ paused         2
▫ completed      6
▫ speculative    1
▫ archived       2

FIELD
computational biology   7
structural biology      5
image analysis          3
scientific software     4

METHOD  ⌄     (collapsed, expands to full list)
TOOL    ⌄
YEAR    ⌄
──────────────
Clear all
```

- Facets are **checkboxes** (multi-select within a facet = OR; across facets = AND). Counts shown and updated live.
- **State lives in the URL**: `/projects?status=active,validation&field=structural-biology&view=notes`. Shareable, bookmarkable, back-button-correct.
- Filtering is **client-side over the full pre-rendered list** (all projects are in the HTML; filtering toggles `hidden`). This means: works with JS off (all projects visible), instant with JS on, no layout shift, no spinner, no network.
- Result count announced to screen readers via `aria-live="polite"`: `12 projects match.`
- Zero results: `No projects match these filters.` + a `Clear filters` button. Never an illustration.

**Sort control:** `updated ↓` (default) · `started ↓` · `title A–Z`. Mono, three text links, current one underlined in vermilion.

**Not permitted here:** a masonry grid, project thumbnails/screenshots in a grid, hover-zoom images, a "featured project" hero, tag clouds.

---

### 6.3 Project page — `/projects/[slug]`

The most complex page on the site, and the one that most justifies the whole build. It must support a two-week exploratory hack and a two-year research programme with the *same* anatomy, by making almost every section optional.

**Layout (≥1200px):** three columns.

```
│ 200px      │  680px                                  │ 220px       │
│ STICKY TOC │  CONTENT                                │ MARGINALIA  │
│            │                                         │             │
│ Overview   │  PRJ-014 · started 2025-11-02 · rev.7   │             │
│ Problem    │                     ┌───────────┐       │             │
│ Questions  │                     │  ACTIVE   │       │             │
│ What I…    │                     └───────────┘       │             │
│ Architect. │  Fold-switch propensity from            │             │
│ Experiments│  coevolutionary signal                  │             │
│ Findings   │  ────────────────────────────────────   │             │
│ Failures   │  [thesis, 2–3 lines, Newsreader 20px]   │             │
│ Decisions  │                                         │             │
│ Validation │  RECORD                                 │  sidenotes  │
│ Limitations│  Field      structural biology          │  appear     │
│ Outputs    │  Methods    coevolution · MSA · MD      │  here,      │
│ Timeline   │  Tools      PyTorch · GROMACS · Nextflow│  aligned    │
│ Updates    │  With       {{PERSON}} (supervisor)     │  to their   │
│ Related    │  Started    2025-11-02                  │  reference  │
│ Future     │  Updated    2026-07-09                  │             │
│            │  Code       github.com/… ↗              │             │
│            │  Outputs    preprint ↗ · poster ↗       │             │
│            │  ────────────────────────────────────   │             │
│            │  1. Problem                             │             │
│            │  …                                      │             │
```

**Anatomy, in order.** `[R]` = required, `[O]` = optional (omit the section entirely if absent — never render an empty heading).

| # | Section | Req | Spec |
|---|---|---|---|
| 0 | **Shelfmark** | R | Top-right mono line: `PRJ-014 · started … · rev.7 · updated …`. `rev.N` = number of updates + 1. |
| 1 | **Status stamp** | R | The one stamp (§4.4 M4). Colour: vermilion for `active`/`validation`; ink for `completed`; umber for `paused`/`archived`; ink outline dashed for `exploratory`/`speculative`. |
| 2 | **Title** | R | `<h1>`, Fraunces 500, clamp 36→56px, max 2 lines. |
| 3 | **Thesis** | R | 2–3 sentences, Newsreader 20px, `--ink-700`. The same string used on the index and in OG. |
| 4 | **Record block** | R | A **definition list**, not a table: label column (sans 12px uppercase umber, 90px) + value column (mono/sans 14px). Contains: field, methods, tools, collaborators, started, updated, status, repositories, outputs, related writing. Hairline rule above and below. This is the "abstract page" of the notebook. |
| 5 | **Problem** | R | Prose. What is actually hard, stated so a non-specialist can follow the first paragraph and a specialist can follow the second. |
| 6 | **Motivation** | O | Why *I* am the one doing it. Personal, short. Can be merged into Problem. |
| 7 | **Research questions** | O | A **numbered** list — one of the few places numbering is honest, because they are referenced later by number (`Q2` is answered in Findings). Each question carries an inline status chip: `open` / `answered` / `abandoned`. |
| 8 | **What I built** | O | The concrete artefact. Prose + a bulleted list of components. |
| 9 | **Architecture** | O | A figure (SVG, author-drawn, cream/ink/vermilion only — **no default Mermaid styling**) + prose. Figure gets a caption and a `Fig. 1` label. |
| 10 | **Experiments** | O | Repeated sub-blocks. Each: `EXP-01` mono label, a one-line **hypothesis**, **setup** (bulleted, includes parameters), **result** (prose + figure/table), **verdict** chip: `supported` / `not supported` / `inconclusive`. Collapsible (`<details>`, open by default on desktop, closed on mobile beyond the first). |
| 11 | **Findings** | O | The claims. Each finding numbered `F1…`, each linked back to the question it addresses. Confidence stated in plain words: *"I believe this; I'd bet on it. / This is suggestive and I have not ruled out X."* |
| 12 | **Failures & dead ends** | O | **First-class.** Set on `--paper-sunk` with a 2px left rule in umber — visually *different*, never *lesser*. Each entry: what I tried, why I thought it would work, why it didn't, what it cost (in days). |
| 13 | **Decisions** | O | A dated **decision log** (ADR-lite). Each: `D-03 · 2026-02-11 · Switched from MSA depth filtering to per-column entropy` + 1–3 sentences of reasoning + an outcome chip (`held` / `reversed` / `superseded`). Reversed decisions use the revision stroke (M4). This section is a large part of why the site exists. |
| 14 | **Validation** | O | How I know it works (or that I don't yet). Explicit about the negative case: `Not yet validated. The plan is …` |
| 15 | **Limitations** | O | Prose or list. Honest. |
| 16 | **Outputs** | O | Preprints, papers, posters, talks, datasets, packages. Each with a type chip, date, DOI/link. |
| 17 | **Repositories** | O | Mono rows: repo name, one-line description, language, licence, link. Live GitHub stats are **not** fetched (no client JS, no dependency, and star counts are noise). |
| 18 | **Timeline** | O | A vertical time axis with dated nodes, collapsed by default to major milestones with an `expand ‸` control revealing every update. Not a horizontal Gantt. See §9 C-19. |
| 19 | **Updates** | Auto | The Ledger, filtered to this project, most recent 5 + `all N updates →` linking to `/log?project=prj-014`. |
| 20 | **Related writing** | Auto | Articles/reviews whose `relatedProjects` include this project, or that share ≥2 topics. |
| 21 | **Future work** | O | What I'd do next, and what I'd want a collaborator for. Ends with a contact line. |

**Print stylesheet:** project pages must print cleanly to A4 — hairlines preserved, marginalia inlined, TOC dropped, URL of the page in the footer. A PI will print one.

---

### 6.4 Project updates

**The model.** An update is a first-class content entity (`UPD`), stored as one small MDX file, referencing its parent project by slug. This is chosen over "an array inside project frontmatter" because updates need: their own permalink (for citation and RSS), their own optional body (some updates have a figure), and a global archive.

**Authoring cost is the design constraint.** A minimum update is:

```mdx
---
project: fold-switch-propensity
date: 2026-07-09
kind: result
summary: Validation set rebuilt without homologous leakage; AUC drops from 0.88 to 0.71.
---
```

Four lines, no body, done from a phone. That's the bar.

**The `kind` enum** (drives the 3-letter Ledger glyph and the icon-free colour):

| kind | Ledger tag | Means |
|---|---|---|
| `built` | `UPD` | Implemented something |
| `result` | `RES` | Found something (good or bad) |
| `validated` | `VAL` | Completed a validation step |
| `replan` | `PLN` | Changed the analysis plan or approach |
| `fixed` | `FIX` | Corrected a methodological problem |
| `paused` | `PSE` | Stopped work; must include a reason |
| `resumed` | `RSM` | Restarted |
| `submitted` | `SUB` | Submitted a paper/abstract |
| `published` | `PUB` | Something went out |
| `note` | `NTE` | An observation that isn't any of the above |

**Where updates appear.**

1. **Project page (§6.3 §19)** — reverse chronological, compact: `date · kind · summary`, expandable if a body exists.
2. **Homepage Ledger** — interleaved with articles and reviews, most recent 8.
3. **`/log`** — the complete archive. Filterable by `project`, `kind`, and year. Grouped by month with a mono month heading (`2026 · JULY`). Paginated at 100 rows. This page is deliberately dense and text-only; it should load in under 200ms.
4. **`/rss/log.xml`** — so a collaborator can subscribe to the work, not the essays.
5. **`/log/[date]-[slug]`** — permalink. Renders as a small single-entry page with the parent project's header context. Mostly exists for RSS and citation; it is not a page anyone browses to.

**A pause requires a reason.** Schema-enforced: `kind: paused` requires a non-empty `summary`. This is a values decision encoded as a validation rule.

---

### 6.5 Writing archive — `/writing`

**Job:** hold nine kinds of writing without feeling like nine different websites.

**The unifying device is the `kind` label**, set in mono, always in the same position, always the same size. Variety is carried by *labels and standfirsts*, not by different card designs. This is exactly how a magazine handles a features section, a reviews section and a diary column under one masthead.

**Kinds:**

| kind | Label | Typical length |
|---|---|---|
| `essay` | `ESSAY` | 1500–5000 words |
| `explainer` | `EXPLAINER` | 1000–3000 |
| `review` | `REVIEW` | (lives in `/reviews`, appears here) |
| `note` | `NOTE` | 200–800, research-notebook register |
| `reflection` | `REFLECTION` | project post-mortems |
| `literature` | `LITERATURE` | on books, reading, criticism |
| `personal` | `PERSONAL` | non-scientific essays |
| `short` | `SHORT` | < 200 words, a thought |

**Layout:**

```
WRITING                                                         [⌘K search]
Essays, explainers, notes and paper reviews. 31 pieces, 2021–present.
────────────────────────────────────────────────────────────────────────────

FEATURED  (2 items, only if flagged; a wider spread with a rule above/below)
  ESSAY · 2026-07-02 · 12 min
  On the smell of a wet culture room
  Three-line standfirst set at 20px Newsreader — the piece's argument,
  written to be read, not machine-truncated.                              ‸

────────────────────────────────────────────────────────────────────────────
FILTER:  All · Essays · Explainers · Reviews · Notes · Literature · Personal
         Series ⌄   Topics ⌄   Year ⌄                        sort: newest ⌄
────────────────────────────────────────────────────────────────────────────

2026
  07-02   ESSAY       On the smell of a wet culture room              12 min
  06-28   REVIEW      Kim et al. 2026 · fold-switch prediction         9 min
  06-11   NOTE        Why my RMSD plots were lying to me               4 min
2025
  11-30   EXPLAINER   What a coevolutionary coupling actually is      15 min
  …
2022                                                    ── THE STARKONIUM TIMES
  08-28   EXPLAINER   Industry Roundup: An Immuno-Oncological Interlude 6 min
  04-10   EXPLAINER   A–Z: VIPs every genetics enthusiast must know     8 min
```

- **Grouped by year**, mono year headings, hairline rule.
- Rows are `MM-DD · KIND · Title · reading time`. Hovering a row reveals its standfirst in the margin column on ≥1200px (a genuinely nice use of the marginalia motif) — and does nothing at all on smaller screens.
- **Archive volume**: rows from 2021–2023 carry a right-aligned mono volume tag `THE STARKONIUM TIMES` on the first row of each year-group. They are **in the same list**, not in a separate ghetto. See §6.11.
- **Series**: a piece in a series shows `SERIES · A–Z GENETICS · 3/26` in mono under the title. Series get their own page (`/series/[slug]`) with an ordered list and an introduction.
- **Reading time**: computed at build (words / 220, rounded up, min 1). Shown in mono. For `short` kind, omit entirely.
- **Updated dates**: if `updated` differs from `published` by > 7 days, the row shows `· rev.` in vermilion, and the article page shows both dates.
- **Featured**: `featured: true` in frontmatter, max 2 rendered, most recent first.
- **Filters**: same mechanism as `/projects` — URL state, client-side over pre-rendered HTML, works without JS.

**Related posts:** computed at build from shared topics + series + `relatedProjects`, weighted: same series (3) > shared project (2) > shared topic (1). Show top 3. No "you might also like" language — the heading is `Related`.

---

### 6.6 Article page — `/writing/[slug]`

The highest-craft surface. Everything here serves reading.

**Measure and layout.**

- Body text column: **`66ch`**, which at 19px Newsreader lands at ~640px. Hard max `680px`.
- ≥1200px: three columns — `[220px TOC] [640px text] [240px margin]`, centred as a group, gutters 48px.
- 1024–1199px: two columns — text + margin (TOC becomes a collapsible bar under the header).
- < 1024px: single column; sidenotes become inline `<details>` blocks; TOC becomes a `<details>` disclosure under the standfirst.

**Header.**

```
WRT-031 · published 2026-07-02 · 12 min · rev.2                     ← shelfmark
ESSAY                                                               ← kind label, mono, vermilion

On the smell of a wet culture room                                  ← h1, Fraunces, clamp 36→54px

A standfirst of two or three sentences, set in Newsreader at 22px,
italic, --ink-700, that states the argument rather than teasing it.
                                                                    ← 1px ink rule, full text width
molecular biology · memory · teaching                               ← topic chips
```

**Body typography.**

| Element | Spec |
|---|---|
| Paragraph | Newsreader, 19px / 1.65, `--ink-900`, margin-bottom 1.5rem, no first-line indent, no justification (ragged right, hyphens off) |
| `h2` | Fraunces 500, 28px, margin-top 3.5rem, preceded by a vermilion `‸` in the left margin, 1px rule above at 1.25rem gap |
| `h3` | Switzer 600, 17px, uppercase, letter-spacing +0.06em, umber, margin-top 2.25rem |
| `h4` | Newsreader italic 19px. (Rarely used; if `h5`/`h6` are needed, the piece needs restructuring.) |
| Emphasis | `<em>` true italic; `<strong>` weight 600, no colour change |
| Links (inline) | `--vermilion-ink`, no underline at rest, 1px underline on hover/focus with `text-underline-offset: 3px`. **Exception:** in body prose, links *do* carry a persistent 1px underline in `--rule` colour — inline links must be discoverable without hover. |
| Lists | `‸` markers in vermilion for `ul`; mono numerals for `ol`; `padding-left: 1.5rem`, item spacing 0.5rem |
| Pull quote | Fraunces 500, 26px, `--ink-900`, breaking the measure by −40px on the left, 2px vermilion rule above, no quotation marks, attribution in mono below |
| Blockquote | Newsreader 19px, `--ink-700`, 2px `--rule` left border, 1.5rem left padding, no italic, no giant quote glyph |
| Sidenote | Switzer 14px / 1.5, `--umber`, in the margin column, aligned to the top of the referencing paragraph. Reference marker is a **superscript mono numeral in vermilion**, clickable. |
| Footnote | Same content model as sidenotes. **Decision: there is one system.** Authors write `<Note>` and the system renders it as a margin sidenote on wide screens and as a numbered inline `<details>` on narrow ones, plus always as a numbered entry in the `Notes` section at the foot. No separate footnote/sidenote authoring. |
| References | A `References` section at the foot, mono-numbered, author-year, with DOI links. Cited in text as `[1]`, mono, vermilion, linking down. |
| Figure | Full text-column width, or `--bleed` (text width +120px each side) for wide figures. Image on `--paper-raised` with a 1px `--rule` border. Caption below. |
| Figure caption | `Fig. 3 —` in mono uppercase vermilion, then Switzer 14px `--umber`, left-aligned, max 60ch. Source/credit line in mono 12px below if applicable. |
| Table | See §9 C-22. Hairline rules only, mono numerals, right-aligned numerics, no zebra striping, sticky header on scroll for tall tables. |
| Code block | See §9 C-23. `--paper-sunk` background, 1px rule, IBM Plex Mono 14px/1.6, Shiki-highlighted at build with a custom cream theme, language label in mono top-right, copy button (the only button inside prose). No line numbers unless the prose refers to a line. |
| Inline code | IBM Plex Mono 0.9em, `--paper-sunk` background, 2px horizontal padding, no border, no radius. |
| Equations | KaTeX, rendered **at build** (no client-side KaTeX JS). Display equations centred with a right-aligned mono equation number `(3)` when referenced. Every display equation has an `aria-label` with a plain-language reading. |
| Horizontal rule | A centred vermilion `‸ ‸ ‸`, 2rem margins — the section break, in place of a plain `<hr>` |
| Drop cap | **No.** (Tempting, wrong: it fights the standfirst and looks affected on a 400-word note.) |

**Table of contents.** Sticky left rail, generated from `h2` only (`h3` shown nested only when a section has ≥3 of them). Current section highlighted with a vermilion left rule via `IntersectionObserver`. Falls back to a static list without JS.

**Reading progress.** A **2px vermilion line at the very top of the viewport**, width = scroll progress through the article body only (not the whole page). Nothing else. No percentage, no circle, no time-remaining counter. Hidden under `prefers-reduced-motion`? — No: it is not motion in the vestibular sense, but it *is* purely decorative, so it must be `aria-hidden` and must not appear if the article is shorter than 2 viewport heights.

**Foot of article.**

```
────────────────────────────────────────────────────────────────
NOTES         1. …  2. …                          (numbered, mono)
REFERENCES    [1] Kim, J. et al. (2026) …          DOI ↗
────────────────────────────────────────────────────────────────
CITE          {{AUTHOR}} (2026) "On the smell of a wet culture room."
              Starkonium, WRT-031. starkonium.com/writing/…
              [ copy BibTeX ]                     (mono block, --paper-sunk)
────────────────────────────────────────────────────────────────
REVISIONS     2026-07-05 — Fixed the units in Fig. 2. (only if revisions exist)
────────────────────────────────────────────────────────────────
RELATED       three rows, same format as the writing index
────────────────────────────────────────────────────────────────
SERIES        A–Z: Genetics — ← previous · index · next →
────────────────────────────────────────────────────────────────
```

**The `CITE` block is a differentiator.** No personal blog offers a BibTeX entry for an essay. This one does, for every article, review and project. It is a two-line build-time function and it makes the site feel like a publication.

**The four writing modes must all work.** Test the article template against: a 4000-word technical piece with 6 figures and 12 equations; a 300-word `short`; a paper review (different template, §6.7); and a personal essay with zero metadata beyond a date. The template degrades by *omitting* — no empty `References` heading, no TOC on a 300-word note, no reading-progress bar on a short.

---

### 6.7 Paper reviews — `/reviews`

**The tension to solve:** structured fields make reviews scannable and comparable, but a page of labelled fields is a database record, and nobody reads a database record.

**The resolution: prose first, structure second.**

Every review opens with a **verdict paragraph** — 60–100 words of actual writing that says what the paper claims, whether it convinced `{{AUTHOR}}`, and why. The structured fields follow. A reader can read only the verdict and be well served; a reader who wants the anatomy scrolls on.

#### Review index — `/reviews`

Not a table. A stack of **record entries**, each with a hairline rule, in reverse-chronological order of *review* date:

```
────────────────────────────────────────────────────────────────────────
REV-008 · reviewed 2026-06-28                        [ PARTLY CONVINCING ]

Kim, J., Oyelaran, T. & Behera, S. (2026)
Coevolutionary signal predicts fold-switching in metamorphic proteins
Nature Methods 23(6) · doi:10.1038/s41592-026-0xxxx ↗

The central claim is that a single coupling-matrix statistic separates
metamorphic proteins from single-fold controls. It does — on their
benchmark. I could not reproduce the separation once homologues were
removed from the negative set, which I think is the whole ballgame.

structural biology · coevolution · benchmarking     evidence ▪▪▪▫▫   ‸
────────────────────────────────────────────────────────────────────────
```

**Filters:** research area (field facet), year of paper, year of review, journal, verdict, reproducibility rating. Same faceted rail as `/projects`.

#### Review page template

| Section | Spec |
|---|---|
| **Record** | A mono definition block, top of page, on `--paper-sunk` with 1px rule: title, authors (full list, `et al.` after 6 with expand), journal + volume + pages, year, DOI (linked, always), preprint link, code/data availability (a chip: `code ✓ / data ✗ / neither`), review date, and the reviewer's relationship to the work (`none` / `cited by me` / `competing work` — a small honesty affordance). |
| **Verdict** | The prose paragraph. Newsreader 20px. Above the fold. |
| **Assessment strip** | Five dimensions, each 1–5, rendered as **five small squares**, filled in ink, empty with a 1px rule: `Evidence`, `Novelty`, `Clarity`, `Reproducibility`, `Usefulness to me`. Each has a required one-line justification in Switzer 14px beside it. **Not stars.** **Not a single aggregate score** — a single number would be both fake precision and needlessly combative. |
| **Central question** | One sentence. Set as a pull quote. |
| **Methods** | What they actually did, in `{{AUTHOR}}`'s words, in 3–6 bullets. |
| **Main claims** | Numbered `C1…Cn`. Each claim gets an inline chip: `supported` / `overstated` / `unsupported` / `not evaluated`. |
| **Strongest contribution** | Prose. **Mandatory field.** Every review must say what is good about the paper. This is enforced in the schema and it is a values decision: it stops the section from becoming a demolition column. |
| **Weaknesses** | Prose/bullets, referencing claim numbers. |
| **Limitations** | Distinguished from weaknesses: things the authors acknowledge or that are inherent, vs. things they got wrong. |
| **Reproducibility** | A structured sub-block: code available (✓/✗ + link), data available, environment specified, seeds fixed, `{{AUTHOR}} attempted reproduction` (✓/✗) and what happened. This is a signature Starkonium section and it should be visually the most distinctive part of the review page. |
| **What I learned** | Prose. Personal. Often the best-written part. |
| **Open questions** | Bulleted. Can be promoted into a project's research questions — link if so. |
| **What I would do next** | Prose. The constructive turn. |
| **Overall assessment** | A verdict enum + a closing sentence. Enum: `convincing` / `partly convincing` / `interesting but unconvincing` / `not convincing` / `important` / `flawed but useful`. (Deliberately verbal, not numeric.) |

**Visual distinction from essays** (achieved without a new colour scheme):

1. **Paper tint.** Review pages use `--paper-review` (`#F3ECDE`, one step warmer/darker than the site cream) as the page background. Immediately identifiable, never garish.
2. **Double rule** under the header (3px ink + 2px gap + 1px ink) — a journal masthead device, used *only* on reviews and on the `/archive` volume front.
3. **The mono record block** at the top.
4. **The assessment squares**, which exist nowhere else.

**Structured data:** `schema.org/Review` with `itemReviewed: ScholarlyArticle`, `reviewRating` omitted (no aggregate score — do not fabricate one for the schema), `author: Person`.

---

### 6.8 Extended CV / Experience — `/experience`

**How it differs from `/projects` — the load-bearing distinction:**

> **Projects are organised by problem. Experience is organised by time and institution.**
> A project page answers *"what is this work?"*. An experience page answers *"what did you do there, and who were you while you did it?"*

They cross-link heavily. The same lab-notebook work may appear as `PRJ-012` (the science) and inside `EXP-002` (the role). Neither duplicates the other: the project page owns the methods and findings; the experience page owns the *contribution*, the *decisions I was allowed to make*, the *challenges*, and the *lessons*.

**Layout: a vertical spine.**

```
EXPERIENCE                                          [ download CV (PDF, 2 pages) ]
An expanded record. The two-page version is a summary of this page,
not the other way round.
──────────────────────────────────────────────────────────────────────────────

  2025 ─┬── EXP-003                                          [ CURRENT ]
        │   Research assistant · {{INSTITUTION}}
        │   Structural bioinformatics group · with Prof. {{PERSON}}
        │   Nov 2025 — present · {{CITY}}
        │
        │   Predicting fold-switching from coevolutionary signal, and
        │   building the pipeline that makes the prediction reproducible.
        │
        │   CONTRIBUTION   Built the full inference pipeline (…)  ‸ expand
        │   METHODS        MSA construction · DCA · MD · PyTorch
        │   OUTPUTS        1 preprint · 1 poster · 2 packages
        │   PROJECTS       PRJ-014 · PRJ-012
        │
  2024 ─┼── EXP-002
        │   …
  2023 ─┴── EXP-001
```

- The **spine** is a 1px ink vertical rule in the left gutter with year nodes (a small vermilion square at each role start). This is the only timeline-like device on the site outside the project timeline, and it is the same component (§9 C-19).
- Each role is **summary + expand**. The collapsed state shows: org, position, dates, supervisor, one-paragraph context, and four metadata rows. The expanded state (`‸ expand`, or a link to `/experience/[slug]` for very long entries) reveals the full anatomy.

**Full experience-entry anatomy** (all optional except the first five):

organisation `[R]` · position `[R]` · dates `[R]` · location `[R]` · context paragraph `[R]` · supervisor/PI · group · research question of the project I joined · **exact contribution** (the most important field — written in the first person, specific, and honest about what was mine vs. the group's) · methods · tools · decisions I made · technical challenges · results · outputs (papers, preprints, posters, talks, datasets, software) · presentations · skills developed · **lessons learned** (prose, personal, the section a hiring reader will actually remember) · related projects `PRJ-*` · related writing.

**The downloadable CV.**

- `/cv.pdf`, a **hand-maintained two-page PDF** in `/public`. Rationale: auto-generating a CV PDF from content collections is a fun weekend and a permanent maintenance tax; formal CVs have conventions (ordering, phrasing, publication styles) that fight a generic renderer. Keep it hand-made, keep it in the repo, add a build-time check that warns if `cv.pdf` is more than 180 days older than the newest `experience` entry.
- The button is a **text link with a mono file annotation**: `download CV — PDF · 2 pages · updated 2026-06` — never a filled button with a download icon.
- `/experience` also has an excellent **print stylesheet**: printing the page produces a clean (if long) document. That is the free "generated CV", and it is honest about being the long version.

---

### 6.9 About — `/about`

Short, human, specific, and not a mission statement.

**Structure:**

1. **A photograph.** One. Black-and-white or warm-toned, not a corporate headshot, ideally at a bench or a desk with real mess. Set at 320px wide, left, with the bio wrapping in a two-column layout on desktop. Caption in mono: `{{CITY}}, 2026.` (If no good photograph exists, ship without — do not use an avatar illustration.)
2. **Bio** — 150–250 words. Three paragraphs: what I work on and why it's hard; how I got here (brief, non-chronological, no "journey"); what I'm trying to become good at.
3. **How I work** — 4–6 short statements, each one sentence, set as an editorial list with `‸` markers. These should be falsifiable and slightly uncomfortable. Illustrative examples, to be replaced:
   - *I do not trust a result I cannot rerun from a clean checkout.*
   - *I write the failure section first, because it's the part I'll want to skip.*
   - *I would rather publish a null result slowly than a positive one I don't believe.*
4. **Curious about** — a short mono list of open questions currently occupying the author. These are allowed to be naive.
5. **Away from the bench** — literature, books, whatever is real. This section is what stops the site from being a CV. Include a small list of what's been read recently (link to `/now` for the live version).
6. **Contact and links** (§6.13).

**Forbidden copy:** "passionate", "innovative", "aspiring", "I love solving problems", "results-driven", and the word "journey" in any form.

---

### 6.10 Now — `/now`

Deliberately the lightest page to *update* and one of the most rewarding to *read*.

```
NOW                                    updated 2026-07-09 · 3 days ago
                                       previous versions ‸
──────────────────────────────────────────────────────────────────────
BUILDING          A rewrite of the contact-map pipeline so that a
                  clean checkout reproduces Figure 2 in one command.
                  PRJ-014

INVESTIGATING     Whether fold-switch propensity survives homology
                  removal at all. Current honest answer: unclear.

WRITING           An essay about why negative results feel like
                  personal failures, which I keep abandoning.

READING           Ishiguro, *Klara and the Sun*
                  Eddy (2004), *What is a hidden Markov model?* — again
                  Three papers on MSA subsampling, badly

LEARNING          Rust, slowly, for the parts of the pipeline that
                  are embarrassingly slow in Python.

RECENTLY DONE     Rebuilt the validation set (2026-07-09)
                  Reviewed Kim et al. (2026-06-28)

THINKING ABOUT    Whether "reproducible" and "reusable" are the same
                  goal, and whether I've been conflating them.

WHERE             {{CITY}} · {{INSTITUTION}}
──────────────────────────────────────────────────────────────────────
Inspired by Derek Sivers' /now page idea. This one is a lab notebook
front page: it is meant to go stale and be replaced, not to be curated.
```

- **Layout:** a definition list. Label column (sans 12px uppercase umber, 140px, right-aligned) + content column (Newsreader 18px). Rows separated by 2rem of space, no rules. This is the calmest layout on the site and it should feel like a held breath.
- **Location:** city and institution only. Never anything finer. This is a stated privacy rule, in the schema comment.
- **Staleness is visible and honest:** the header shows `updated … · N days ago`. Past 60 days, the "N days ago" turns umber and reads `· overdue`. No shame, just accuracy.
- **`/now/archive`**: every previous Now, preserved with its date. This is the evolving-document motif turned into a real feature — reading four years of Now pages in sequence is a form of autobiography, and nobody else's site offers it. Each superseded entry is presented as a dated page, in mono headers, with a `superseded 2026-07-09` note.
- Changes to `/now` post an entry into the Ledger (`NOW`), with the summary being what changed.

---

### 6.11 Archive — `/archive` (*The Starkonium Times*, 2021–2023)

The old blog is currently 14 posts on Blogger, across four label-series (*A–Z: Genetics*, *Industry Roundup*, *History of DNA*, *Origins of Life*), running April 2021 – September 2023, written in a younger, more exuberant voice.

**The design problem:** if old posts are hidden, the site loses four years of evidence that this person has been writing about biology for a long time — which is an asset. If they're mixed in without comment, the voice mismatch is jarring and the author will feel it every time they look at the homepage.

**The solution: treat it as a *volume*, not as *old stuff*.**

Journals have volumes. Volume I is not inferior to Volume II; it is *earlier*, and it is bound differently. `/archive` is the front page of Volume I.

**`/archive` layout:**

- Its own **masthead**: `THE STARKONIUM TIMES` in Fraunces with the double rule, and a mono dateline: `Volume I · 14 pieces · April 2021 — September 2023`.
- **A note from the author** (150 words, written in the present): what this was, how old you were, what you were trying to do, what you'd now say differently, and an explicit statement that nothing has been edited or deleted. This note is the single most important piece of copy on the page and it turns the whole archive from a liability into a display of intellectual honesty.
- **Series index**, since the old blog was mostly series: `A–Z: Genetics` (1), `Industry Roundup` (5), `History of DNA` (4), `Origins of Life` (2). Each series becomes a real `Series` entity.
- **A chronological list** of all posts, in the standard writing-index row format.

**Labelling, everywhere else on the site:**

- Archive posts carry `volume: "times"`, which renders as a small mono tag: `THE STARKONIUM TIMES` in umber. **Never** as "old", "legacy", "archived", or a greyed-out row.
- They appear in `/writing` in normal date order, fully searchable, fully filterable, at full contrast.
- Their article pages use the normal template, with **one addition**: a dateline banner above the title —
  `From The Starkonium Times · published 2022-04-10 · unedited`
  — plus, where useful, **margin annotations** from present-day `{{AUTHOR}}` (motif M3), dated in vermilion.

**The annotation feature is the point.** An annotated 2022 post is *better* content than a 2026 post, because it demonstrates change over time. This should be shown off: the homepage may occasionally surface `2022-04-10 · annotated 2026-07-11` in the Ledger as an `ANN` entry.

**Not permitted:** an "Archive" banner in muted grey, a "this post may be out of date" warning bar, `noindex` on old posts, or removing them.

---

### 6.12 Search — `/search` + ⌘K

**Engine: [Pagefind](https://pagefind.app).** Static, built at build time from the emitted HTML, no server, no API key, no index size problem at this scale, supports **filters** and **metadata**, ~30KB of JS loaded *only when the search UI opens*, and it degrades to a real `/search` page.

**Two surfaces, one index.**

**A. The dialog (⌘K / Ctrl-K, or the header search affordance).**

```
┌────────────────────────────────────────────────────────────────┐
│  ⌕  coevolution                                          esc   │
├────────────────────────────────────────────────────────────────┤
│  PROJECTS                                                   2  │
│  PRJ-014  Fold-switch propensity from coevolutionary signal    │
│           …a coevolutionary coupling matrix tell you that…     │
│                                                                │
│  WRITING                                                    4  │
│  WRT-022  What a coevolutionary coupling actually is           │
│                                                                │
│  REVIEWS                                                    1  │
│  UPDATES                                                    3  │
│  TOPICS                                                     1  │
│  method · coevolution — 7 entries                              │
├────────────────────────────────────────────────────────────────┤
│  ↑↓ navigate   ↵ open   ⌘↵ open in new tab   see all results → │
└────────────────────────────────────────────────────────────────┘
```

- **Grouped by content type**, in fixed order: Projects, Writing, Reviews, Updates, Experience, Topics. Never one undifferentiated list.
- Each result: shelfmark ID (mono), title, one-line highlighted excerpt.
- Full keyboard operation. `Esc` closes and restores focus. Focus is trapped while open. `role="dialog"`, `aria-modal`, labelled.
- Empty state before typing: the 6 most recent Ledger entries, under the heading `Recent`. Useful, and it teaches what the site contains.
- No results: honest text + a link to `/topics`.
- Debounce 120ms. No loading spinner (results arrive faster than a spinner is legible); if a query exceeds 400ms, show a mono `…searching` line in place of results.

**B. `/search` (full page).**

The same index, with the faceted rail from `/projects` (type, field, method, tool, year, status, kind). This is the power surface: *"every `note` about `reproducibility` from 2025."* Query and facets are in the URL. Works as the no-JS fallback target of the header's `<form action="/search">`.

**Indexed:** every page's `<main>`, plus explicit Pagefind metadata for `id`, `type`, `kind`, `status`, `field`, `topics`, `year`, `title`, and `thesis`/`standfirst`. Excluded from indexing: the TOC, the marginalia rail, the Ledger rows on the homepage (to avoid every update appearing twice), the footer, and `draft: true` content.

---

### 6.13 Contact

**Not a page. A block** — appearing at the foot of `/about`, at the foot of the homepage, and in the site footer. There is no `/contact` route (it would be an empty page with a form on it, which is the definition of a generic portfolio move). If a route is needed for linking, `/about#contact`.

```
CONTACT
──────────────────────────────────────────────
Email        {{EMAIL}}                     ‸
             Best for anything real. I reply
             slowly but I do reply.

Elsewhere    GitHub ↗ · ORCID ↗ · Google Scholar ↗ · LinkedIn ↗
CV           download — PDF · 2 pages · updated 2026-06
Feeds        everything ↗ · writing ↗ · project log ↗
```

- Email is **plain text and copyable**, not a `mailto:` button and not obfuscated by JavaScript. (Use a simple server-side/build-time HTML entity encoding if spam is a concern; do not break copy-paste.)
- One line of copy under the email setting expectations — human, and it prevents the "why didn't they reply" problem.
- **No contact form.** No "Let's work together!" No calendar-booking embed.
- External links carry a small mono `↗` and `rel="me"` where applicable (ORCID, GitHub — this also feeds `sameAs` in the JSON-LD).

---

## 7. Navigation

### 7.1 The decision on top-level items

The brief proposes six: Projects, Writing, Paper Reviews, Experience, About, Now. Six is one or two too many for a masthead that must stay quiet.

**Adopted primary navigation — four items:**

```
STARKONIUM⁷        Projects   Writing   Experience   About        ⌕   ● NOW
```

**Reasoning:**

- **Paper Reviews → merged into Writing.** They are writing. They keep their own index (`/reviews`) and their own layout, and they are the first filter chip on `/writing` and a prominent link in its header. A visitor looking for reviews finds them in one click and does not have to parse a six-item menu to get anywhere else.
- **Now → not a nav item; a live indicator.** `● NOW` sits at the far right of the header, with a small vermilion square. It is the most-updated page on the site, so it earns *presence* — but as a status light, not as a peer of "Projects". It also appears as a full row in the mobile menu and in the footer.
- **The Ledger (`/log`) → not in primary nav.** It is reachable from the homepage (`all entries →`), from every project page, and from the footer. Putting it in the masthead would be putting the mechanism above the work.

**Everything else lives in the footer** (§7.6), which is a proper site index, not an afterthought.

### 7.2 Desktop header

- Height 72px. Background `--paper`. **No shadow, no blur, no border by default.**
- On scroll past 80px: the header becomes sticky and gains a **1px `--rule` bottom border only**. No background change, no shrink animation, no blur. The border appears with a 120ms opacity fade.
- Wordmark left. Nav items centre-right, Switzer 15px, `--ink-700`, letter-spacing `+0.01em`.
- Search: a `⌕` glyph plus the mono hint `⌘K` in umber (hidden below 1024px). Clicking opens the dialog. The whole thing is a real `<button>`.
- `● NOW`: mono 12px, uppercase, `--ink-700`, preceded by a 6px vermilion square. On hover the square does nothing (no pulse, no glow — see §21).

### 7.3 Active states

- **Current section**: the nav item is `--ink-900`, weight 600, with a **2px vermilion underline** offset 6px below the baseline. Present on the section index *and* all its children (`/projects/*` → Projects is active).
- **Hover (non-active)**: a 1px `--rule` underline appears, animating from left, 140ms. This is the only "animated underline" on the site and it is used here and on nothing else.
- **Focus**: the global focus ring (§14), which is visually distinct from both hover and active.
- `aria-current="page"` on the exact page, `aria-current="true"` on the section parent.

### 7.4 Mobile menu (< 768px)

- Header collapses to: wordmark (no superscript) left, `⌕` and a **text `Menu`** right. **A text label, not a hamburger** — three lines is a convention, but a word is clearer, and on this site a small piece of set type is more on-brand than an icon.
- Tapping `Menu` opens a **full-screen sheet**, not a slide-out drawer:
  - Background `--paper` (opaque; nothing glassy).
  - Items are large: Fraunces 32px, one per line, generous 24px vertical rhythm, each with a `‸` marker and a hairline rule below.
  - Order: Projects · Writing · Reviews · Experience · Now · About — **six items here**, because a full-screen sheet has room and mobile users benefit from directness.
  - Below a 2px rule: `The Ledger` · `Archive` · `Topics` · `Search` · `CV`.
  - Foot of sheet: contact links, mono, small.
  - Opens with a 160ms fade + 8px upward translate. Closes instantly on selection. Focus trapped; `Esc` and a `Close` text button both work; body scroll locked; `inert` applied to the rest of the page.
- Sticky behaviour on mobile: the header **hides on scroll down, reappears on scroll up** (a 180ms transform). This is the one piece of "clever" scroll behaviour permitted, and it exists because vertical space is scarce.

### 7.5 Wordmark behaviour

- Always links to `/`, from every page including `/`.
- On `/`, it is not a link visually (still focusable, still navigable) — no hover state.
- The superscript revision marker is present only in the desktop header and on `/colophon`.
- On `/archive/*` pages, the header wordmark stays `STARKONIUM⁷` — the *Times* masthead appears in the page content, not the site chrome. The site is one site.

### 7.6 Footer

A real index. Four columns on desktop, stacked on mobile. Set small (13–14px), quiet, on `--paper` with a 1px top rule. No dark footer.

```
─────────────────────────────────────────────────────────────────────────────
STARKONIUM              WORK              WRITING             ELSEWHERE
An evolving archive     Projects          All writing         GitHub ↗
of research, software,  The Ledger        Paper reviews       ORCID ↗
reviews and writing.    Experience        The Starkonium      Scholar ↗
                        Topics            Times (2021–23)     LinkedIn ↗
                        Now               Series              Email
                        About             Search              CV (PDF)
                                                              RSS · Log RSS
─────────────────────────────────────────────────────────────────────────────
© 2026 {{AUTHOR}}. Text CC BY 4.0 · Code MIT.        Built with Astro. rev.7 ‸
Set in Fraunces, Newsreader, Switzer and IBM Plex Mono.        colophon ‸
─────────────────────────────────────────────────────────────────────────────
```

The colophon line (typefaces, licence, revision) is a small piece of editorial confidence and costs nothing.

---

## 8. Design system

**Governing rule: restraint.** The entire site is built from ~26 components (§9). If a new visual pattern seems necessary, the correct first move is to check whether type, space and a hairline rule can do the job. They usually can.

### 8.1 Tokens — naming

CSS custom properties on `:root`, semantic names, no raw hex in components.

```
--paper, --paper-raised, --paper-sunk, --paper-review
--ink-900, --ink-700, --ink-500 (umber), --ink-300 (warm grey)
--rule, --rule-strong
--vermilion, --vermilion-ink, --vermilion-deep, --peach
--fig-1 … --fig-5    (figure/chart palette only — never used in chrome)
--space-1 … --space-12
--text-xs … --text-display
--measure-prose, --measure-ui
--dur-fast, --dur-base, --dur-slow, --ease
```

### 8.2 Spacing scale

Base unit **4px**. Steps (rem, assuming 16px root):

| Token | px | Use |
|---|---|---|
| `--space-1` | 4 | icon/text gaps |
| `--space-2` | 8 | chip padding, tight stacks |
| `--space-3` | 12 | metadata row gaps |
| `--space-4` | 16 | paragraph gap (UI) |
| `--space-5` | 24 | prose paragraph gap, component padding |
| `--space-6` | 32 | between related blocks |
| `--space-7` | 48 | between sections (mobile) |
| `--space-8` | 64 | between sections (desktop) |
| `--space-9` | 96 | between major page regions |
| `--space-10` | 128 | page top/bottom padding (desktop) |
| `--space-11` | 160 | rare — homepage region separation |
| `--space-12` | 192 | rare |

**Vertical rhythm rule:** section spacing on long pages is `--space-8` (64px) between `h2` sections, `--space-9` (96px) between page regions. Generosity here is what makes a dense site feel calm.

### 8.3 Grid and containers

12-column grid, 24px gutters (32px ≥1440px).

| Container | Max width | Use |
|---|---|---|
| `--w-full` | 1440px | header, footer, ledger on home |
| `--w-page` | 1180px | project pages, index pages (3-col layouts) |
| `--w-prose` | 680px | article body text |
| `--w-narrow` | 560px | Now page, About bio, empty states |
| `--w-bleed` | 920px | wide figures, tables inside articles |

Page gutters: 24px (mobile), 40px (tablet), 64px (desktop), 80px (≥1600px).

### 8.4 Corner radius

**`--radius: 0`. Everywhere. No exceptions in chrome.**

The only curved things on the entire site are: the status dot (a 6px circle), avatars (if ever used — none in v1), and glyphs inside typefaces. Buttons, inputs, chips, cards, figures, code blocks, dialogs: all square. This is the single most identity-defining constraint in the design system and it must not erode.

### 8.5 Shadows

**None.** Elevation is expressed with paper tints and hairline rules.

The one exception, and it is a real one: the **search dialog**, which floats above the page and must read as such:
`box-shadow: 0 24px 64px -32px rgba(20, 18, 16, 0.35);`
The mobile menu sheet is opaque and full-screen, so it needs no shadow.

### 8.6 Rules and dividers

| Name | Spec | Use |
|---|---|---|
| Hairline | `1px solid var(--rule)` | list separators, table rows, card borders |
| Strong rule | `1px solid var(--ink-900)` | under standfirsts, above pull quotes, section closes |
| Double rule | `3px ink / 2px gap / 1px ink` | **only** on review pages and `/archive` masthead |
| Emphasis rule | `2px solid var(--vermilion)` | above pull quotes, under active nav, TOC current item |
| Section break | `‸ ‸ ‸` centred, vermilion, 2rem margins | in prose, in place of `<hr>` |
| Left rule | `2px solid var(--ink-500)` | blockquotes, the Failures block |

### 8.7 Link styles

| Context | Rest | Hover / focus |
|---|---|---|
| **Prose inline link** | `--vermilion-ink`, 1px underline in `--rule`, offset 3px, `text-decoration-skip-ink: auto` | underline becomes `--vermilion-ink`, 1px → 1px (no thickening — it shifts the baseline) |
| **Nav link** | `--ink-700`, no underline | 1px `--rule` underline, animating from left, 140ms |
| **List/row link** (ledger, index rows) | entire row is the target; title in `--ink-900` | row background → `--paper-raised`; title → `--vermilion-ink`; `‸` marker slides 4px right |
| **External link** | as prose link + trailing mono `↗` at 0.75em | as prose link |
| **Quiet link** (footer, metadata) | `--ink-500`, no underline | `--ink-900`, 1px underline |
| **Visited** | Not styled differently. (Deliberate: on an archive, "visited" grey creates a false hierarchy of stale-looking rows.) |

### 8.8 Buttons

There are **three**, and the site should mostly avoid them. Reading sites do not need buttons.

| Variant | Spec |
|---|---|
| **Primary** (rare — used for: `Clear filters`, `Copy BibTeX`, dialog `Close`) | Ink background, cream text, 0 radius, 1px ink border, padding `10px 18px`, Switzer 14px 500, uppercase, `+0.04em`. Hover: background `--vermilion-deep`. |
| **Secondary** | Transparent, 1px `--ink-900` border, `--ink-900` text. Hover: background `--ink-900`, text `--paper`. |
| **Text button** (the default; used for downloads, expands, sorts, filters) | No border, no background. `--vermilion-ink`, mono or Switzer, with a `‸` or `↗` glyph. Hover: 1px underline. |

**No button ever has:** a rounded corner, a shadow, an icon in a circle, a gradient, a loading spinner, or the word "Learn more".

### 8.9 Tags / chips (topics)

```
structural biology     coevolution     PyTorch
└─ field: Switzer 12px, --ink-700, 1px --rule border, 4px 8px padding
                       └─ method: same, but border --ink-500
                                        └─ tool: IBM Plex Mono 12px, --paper-sunk bg, no border
```

- All square. All ≤ 24px tall. Never coloured by category (colour is reserved for status and accent).
- Hover: border → `--ink-900`; background → `--paper-raised`.
- On index rows, chips are separated by a mono `·` rather than being individually bordered — a lighter, more editorial treatment. Bordered chips are used only on project/article *headers*.
- Maximum 6 chips shown, then `+3 more` (a text button revealing the rest).

### 8.10 Status indicators

Seven statuses, **one hue family**, differentiated by fill/stroke/pattern. This is the discipline that keeps the site from turning into a dashboard.

| Status | Glyph | Colour | Meaning |
|---|---|---|---|
| `active` | `▪` filled square | `--vermilion` | Being worked on now |
| `validation` | `◪` half square | `--vermilion` | Built; being checked |
| `exploratory` | `▫` open square | `--ink-700` | Poking at it |
| `speculative` | `▫` open square, dashed border | `--ink-500` | An idea with a page |
| `paused` | `▬` horizontal bar | `--ink-500` | Stopped, reason recorded |
| `completed` | `■` filled square | `--ink-900` | Done |
| `archived` | `▨` hatched square | `--ink-300` | Superseded / retired |

- In lists: 8px glyph + mono 12px uppercase label + `+0.06em` tracking.
- On project headers: the **stamp** (§4.4).
- **Never colour-only.** The glyph shape and the text label always co-carry the meaning (WCAG 1.4.1).

### 8.11 Cards

**There are no cards.** This is a deliberate, load-bearing decision.

Everywhere a template would put a card, Starkonium puts a **row** or an **entry**: hairline-separated, full-bleed within its container, with no border box, no background fill at rest, and no shadow. Hover tints the row with `--paper-raised`.

The three "card-like" components that exist are:
- **Record block** (project/review metadata): a definition list with a rule above and below. No box.
- **Callout**: a `--paper-sunk` block with a 2px left rule. No box, no radius.
- **Search dialog**: the one true floating surface.

### 8.12 Article and project previews

Article preview (used on `/writing`, home, related):
```
2026-07-02 · ESSAY · 12 min                          ← mono 12px, --ink-500
On the smell of a wet culture room                   ← Fraunces 500, 22–26px
Standfirst, two lines, real prose.                   ← Newsreader 17px, --ink-700
molecular biology · memory · teaching             ‸  ← chips (unbordered), --ink-500
```

Project preview: as §6.2 View A. Same DNA, different fields. Both are the same underlying `EntryRow` component with a slot for metadata.

### 8.13 Metadata rows

The workhorse. A definition list:
```
FIELD      structural biology
METHODS    coevolution · MSA · molecular dynamics
TOOLS      PyTorch · GROMACS · Nextflow
STARTED    2025-11-02
```
- Label: Switzer 11px, uppercase, `+0.08em`, `--ink-500`, fixed width (90px desktop / 72px mobile), top-aligned.
- Value: Switzer 15px `--ink-900`; dates, IDs and tools in IBM Plex Mono 14px.
- Row gap `--space-3`. No rules between rows. Rules above and below the block only.

### 8.14 Blockquotes and callouts

- **Blockquote**: §6.6.
- **Callout**: four variants, distinguished by their **label**, not by colour or icon. All are `--paper-sunk` with a 2px left rule.

| Variant | Label (mono, uppercase, vermilion) | Left rule |
|---|---|---|
| `note` | `NOTE` | `--ink-500` |
| `caveat` | `CAVEAT` | `--ink-900` |
| `method` | `METHOD` | `--ink-500` |
| `erratum` | `ERRATUM · 2026-07-05` | `--vermilion` |

No emoji, no icons, no coloured backgrounds beyond the single sunk tint.

### 8.15 Figures

```
┌─────────────────────────────────────────┐
│                                         │  1px --rule border
│           [ the figure ]                │  --paper-raised background
│                                         │  padding: --space-5
└─────────────────────────────────────────┘
Fig. 3 — AUC drops from 0.88 to 0.71 once homologues are removed
from the negative set. Error bars are 95% CI over 5 seeds.
Source: PRJ-014, commit a3f91c.
```
- `Fig. N —` in mono, uppercase, vermilion. Caption in Switzer 14px `--umber`, max 60ch, left-aligned under the figure (never centred; centred captions are unreadable at length).
- Optional source/provenance line in mono 12px. **Every data figure on this site should be able to say where it came from.** That is a Starkonium value made visible.
- Author-drawn diagrams use only `--ink-900`, `--vermilion`, `--umber`, `--peach` on `--paper-raised`. Charts may use `--fig-1…5` (§11.4).
- Figures may `--bleed` to 920px. Images are `astro:assets`-optimised, AVIF + WebP, `loading="lazy"`, explicit `width`/`height` (CLS = 0).

### 8.16 Tables

Hairline only. `border-collapse: collapse`, no vertical rules, no zebra striping, no radius.
- Header row: Switzer 12px uppercase `+0.06em`, `--ink-500`, 1px `--ink-900` bottom border.
- Body rows: 1px `--rule` bottom border. Numerals in **IBM Plex Mono with `font-variant-numeric: tabular-nums`**, right-aligned.
- Row hover: `--paper-raised`.
- Caption above the table: `Table 2 —` in mono vermilion + Switzer 14px.
- Overflow: horizontally scrollable container with `tabindex="0"`, `role="region"`, `aria-label`, and a right-edge fade indicating more content. On mobile, tables with > 4 columns get an author-set `stack: true` option that renders each row as a definition list.

### 8.17 Code blocks

- `--paper-sunk` background, 1px `--rule` border, 0 radius, padding `--space-5`.
- IBM Plex Mono 14px / 1.6. **Shiki at build time** with a custom theme derived from the palette (see §11.5). No client-side highlighting JS.
- Language label top-right in mono 11px uppercase `--ink-500`.
- Copy button top-right (text button; the only button permitted inside prose).
- Optional `title` (a filename) in a 1px-ruled bar above.
- Long lines scroll horizontally; **no soft wrap** (wrapped code lies about structure).
- Diff highlighting supported: added lines get a `--peach` background tint, removed lines get a 1px strikethrough — no red/green (they fail colour-blind readers and clash with the palette).

### 8.18 Form elements

Very few exist: the search input, the filter checkboxes, and the newsletter form that we are not building.

- **Input**: transparent background, **no border except a 1px bottom rule** in `--ink-500`. Focus: bottom rule becomes 2px `--vermilion-ink`, plus the global focus ring. Switzer 16px (never below 16px on mobile — prevents iOS zoom). Placeholder `--ink-300`, and never used as a substitute for a label.
- **Checkbox** (filters): a custom 14px square, 1px `--ink-500` border, 0 radius. Checked: filled `--ink-900` with a cream `✓`. Real `<input type="checkbox">` underneath, never a div.
- **Label**: always present, always visible (never placeholder-only), Switzer 14px.
- Every form control has a `<label for>`, an accessible name, and a visible focus state.

### 8.19 States

| State | Spec |
|---|---|
| **Focus** | `outline: 2px solid var(--vermilion-ink); outline-offset: 2px;` plus a 1px `--paper` inner ring so it stays visible on any tint. Applied via `:focus-visible`. Never removed. Never replaced by a colour change alone. |
| **Hover** | Row/link tint + underline as specified. Never a scale transform, never a lift, never a shadow. |
| **Active/pressed** | 1px downward translate on buttons only. 60ms. |
| **Disabled** | `--ink-300` text, `cursor: not-allowed`, `aria-disabled`. Should almost never occur. |
| **Empty** | Mono line of honest text + a text-button action. Never an illustration, never a mascot, never "Oops!". |
| **Loading** | Only three things can load: search results, filter results (instant, no state needed), and images. Search shows a mono `…searching` after 400ms. Images use `astro:assets` with explicit dimensions and a `--paper-sunk` placeholder — **no skeleton shimmer** (it is animation for its own sake). |
| **Error** | A `--paper-sunk` block, 2px `--vermilion` left rule, mono `ERROR` label, plain-language explanation, and a next action. Never a red banner. |

---

## 9. Component inventory

Twenty-six. This is the complete set. Adding a twenty-seventh requires deleting one.

| # | Component | Used on | Notes |
|---|---|---|---|
| C-01 | `SiteHeader` | all | Sticky, border-on-scroll, wordmark + nav + search + NOW |
| C-02 | `SiteFooter` | all | Four-column index + colophon line |
| C-03 | `Wordmark` | header, footer, OG | Props: `size`, `marker: 'revision' \| 'dagger' \| 'none'` |
| C-04 | `MobileMenu` | < 768px | Full-screen sheet, focus-trapped |
| C-05 | `SearchDialog` | all (⌘K) | Pagefind; the one shadowed surface |
| C-06 | `SearchPage` | `/search` | Faceted, no-JS fallback |
| C-07 | `Ledger` | home, `/log`, project | **The signature.** Props: `entries`, `limit`, `showProject`, `grouped` |
| C-08 | `LedgerRow` | within C-07 | date · kind tag · project · summary · link |
| C-09 | `EntryRow` | `/writing`, `/projects` (notes view), related, search | The universal preview row |
| C-10 | `IndexTable` | `/projects` (index view) | Sortable, mono, progressive enhancement |
| C-11 | `FilterRail` | `/projects`, `/writing`, `/reviews`, `/search`, `/log` | Faceted checkboxes, URL state, counts, `aria-live` |
| C-12 | `Shelfmark` | project, article, review, experience | `PRJ-014 · started … · rev.7` |
| C-13 | `StatusStamp` | project header only | Rotated −1.5°, one per page |
| C-14 | `StatusChip` | lists, tables, record blocks | Glyph + label, no colour-only meaning |
| C-15 | `TopicChip` | headers, rows | Three facet styles (field/method/tool) |
| C-16 | `RecordBlock` | project, review, experience | The metadata definition list |
| C-17 | `MetaRow` | within C-16 and elsewhere | label + value |
| C-18 | `Prose` | article, review, project body | The MDX typographic wrapper — where §6.6 lives |
| C-19 | `Timeline` | project page, `/experience` | Vertical spine, collapsed→expanded |
| C-20 | `TableOfContents` | article, project | Sticky, IntersectionObserver, static fallback |
| C-21 | `Sidenote` | article (MDX `<Note>`) | Margin → inline `<details>` → foot-of-page list |
| C-22 | `Figure` | everywhere | Caption, `Fig. N`, source line, bleed option |
| C-23 | `CodeBlock` | prose | Shiki, copy button, filename bar |
| C-24 | `Callout` | prose (MDX) | 4 label variants |
| C-25 | `AssessmentStrip` | review pages only | 5 dimensions × 5 squares + justifications |
| C-26 | `CiteBlock` | article, review, project | BibTeX + plain citation, copy |

**MDX components available to authors:** `<Note>`, `<Callout>`, `<Figure>`, `<Superseded>`, `<Annotation>`, `<Cite>`, `<Table>`, `<Math>`. Eight. If a ninth is requested, ask what prose can't do.

---

## 10. Typography system

### 10.1 The four faces

All open-licence, all self-hosted as subset `woff2`. **No Google Fonts CDN** (privacy, and long-term ownership).

| Role | Face | Why this one |
|---|---|---|
| **Display** | **Fraunces** (variable: `opsz`, `wght`, `SOFT`, `WONK`) | A warm, high-contrast old-style with a *deliberate strangeness* — the `WONK` axis swaps in eccentric letterforms (a flat-topped `g`, an angled `y`) at display sizes. It is intelligent, warm and slightly odd, which is the brief in three words. It has an optical-size axis, so headlines and small labels can be *the same family at different optical sizes* rather than the same drawing scaled — which is what real editorial typography does. |
| **Long-form text** | **Newsreader** (variable: `opsz`, `wght`, italic) | Built by Production Type for reading on screens; a transitional serif with a large x-height, low stroke contrast, and genuinely good italics. It holds 4000 words of technical prose without fatigue and does not fight Fraunces. |
| **Interface / sans** | **Switzer** (variable, Fontshare/ITF) | A neutral-warm grotesque with slightly humanist proportions and a high x-height — clean at 11px for metadata labels, unfussy at 15px for navigation. Deliberately **not Inter** (the default of every AI-generated site) and not Helvetica. |
| **Mono / data** | **IBM Plex Mono** (400/500/600 + italic) | Slightly typewriter-ish, warm, with real personality in the numerals. Every date, ID, status, DOI and code block on this site is set in it, so it carries the "laboratory notebook" reading almost single-handedly. Tabular numerals by default. |

**Fallback stacks:**
```
--font-display: "Fraunces", "Iowan Old Style", "Palatino", Georgia, serif;
--font-text:    "Newsreader", "Charter", "Georgia", serif;
--font-sans:    "Switzer", "Helvetica Neue", "Segoe UI", system-ui, sans-serif;
--font-mono:    "IBM Plex Mono", "SF Mono", "Menlo", ui-monospace, monospace;
```

**Loading strategy:**
- Preload exactly **two** files: `Fraunces-variable-subset.woff2` and `Newsreader-variable-subset.woff2` (on article pages) or Fraunces + Switzer (on index pages). `font-display: swap` with metric-adjusted fallbacks (`size-adjust`, `ascent-override`) so the swap causes **zero layout shift**.
- Subset to Latin + the punctuation the site actually uses (`‸ · ↗ † — – ‘’“” ×`).
- **Total font payload budget: ≤ 180KB.** If exceeded, drop Fraunces' `SOFT` axis first, then the Newsreader italic.

### 10.2 The scale

Fluid, using `clamp()`. Root 16px. Values shown as `min → max` between 380px and 1440px viewports.

| Token | Face / weight | Size (min → max) | Line height | Tracking | Use |
|---|---|---|---|---|---|
| `--text-display` | Fraunces 500, wonk, opsz 96 | 34 → 52px | 1.08 | −0.01em | Homepage statement |
| `--text-h1` | Fraunces 500, wonk, opsz 72 | 32 → 48px | 1.12 | −0.005em | Page titles, article titles |
| `--text-h1-long` | Fraunces 500, wonk | 28 → 40px | 1.15 | 0 | Long article titles (> 60 chars) |
| `--text-h2` | Fraunces 500, opsz 36 | 24 → 30px | 1.25 | 0 | Section headings |
| `--text-h3` | Switzer 600, uppercase | 15 → 17px | 1.35 | +0.06em | Sub-sections |
| `--text-standfirst` | Newsreader 400 italic, opsz 24 | 19 → 22px | 1.5 | 0 | Standfirsts, project theses |
| `--text-body` | Newsreader 400, opsz 16 | 18 → 19px | **1.65** | 0 | Article body |
| `--text-ui` | Switzer 400 | 15 → 16px | 1.55 | 0 | Interface prose, nav, Now page values |
| `--text-small` | Switzer 400 | 14px | 1.5 | 0 | Captions, sidenotes |
| `--text-label` | Switzer 600, uppercase | 11 → 12px | 1.4 | **+0.08em** | Metadata labels |
| `--text-meta` | IBM Plex Mono 400 | 12 → 13px | 1.45 | +0.02em | Dates, IDs, shelfmarks, Ledger rows |
| `--text-code` | IBM Plex Mono 400 | 14px | 1.6 | 0 | Code blocks |
| `--text-stamp` | IBM Plex Mono 600, uppercase | 12 → 13px | 1 | **+0.18em** | Status stamp |
| `--text-pullquote` | Fraunces 500, opsz 48 | 24 → 28px | 1.35 | −0.005em | Pull quotes |

### 10.3 Hierarchy rules

1. **Never more than two type sizes above 20px on a single screen.** A page with a display statement does not also get an h1.
2. **Weight, case and face carry hierarchy before size does.** A mono uppercase 12px label is *higher* in the hierarchy than a 15px sans paragraph, because it is a signpost.
3. **The mono face means "this is data".** Never use it for prose. Never use the serif for a date.
4. **Fraunces is used sparingly** — titles, section headings, pull quotes, the wordmark. It never appears at body size. Its power comes from scarcity.
5. **No text is centred**, except: the `‸ ‸ ‸` section break, display equations, and the 404 page. Left-aligned, ragged right, everywhere else.
6. **No text is justified.** Ever. (CSS justification without proper hyphenation and h&j is worse than ragged.)
7. **`font-variant-numeric: tabular-nums`** on all mono and all table numerals, so columns of numbers align.
8. **`text-wrap: balance`** on all headings ≤ 3 lines; **`text-wrap: pretty`** on standfirsts and captions (prevents orphans).

### 10.4 Line length

| Context | Target measure | Hard max |
|---|---|---|
| Article body | **66ch** | 680px |
| Interface prose | 60–70ch | 640px |
| Standfirst | 55ch | 600px |
| Captions and sidenotes | 45–55ch | 320px (margin) |
| Ledger row summary | truncated at 90 chars with an ellipsis — but the `summary` field is capped at 200 chars in the schema, so truncation should be rare |
| Table cells | no limit; tables scroll |

### 10.5 Mobile type scaling

- Body text **does not shrink below 18px**. Long-form reading on a phone is the most common real use, and 16px serif on a 390px screen is a compromise made by sites that do not expect to be read.
- The display statement scales down hardest (52 → 34px) because it is the least information-dense.
- Metadata labels stay at 11px but gain tracking (+0.09em) to stay legible.
- The mono Ledger drops to 12px and hides the project column below 480px (the project name moves into the summary line).
- Line height **increases** slightly on mobile (body 1.65 → 1.7) because the measure is narrower and the eye returns more often.

---

## 11. Colour system

### 11.1 The palette

Cream dominates (~92% of pixels). Ink provides structure. Vermilion is the red pen — it appears on perhaps 1% of the page, and it always means something.

| Token | Hex | Name | Role |
|---|---|---|---|
| `--paper` | `#F6F1E7` | Cream | Page background. Everywhere. |
| `--paper-raised` | `#FBF8F1` | Off-white | Hover tints, figure backgrounds. **Lighter** than paper — the site lifts toward light, not toward grey. |
| `--paper-sunk` | `#EDE6D6` | Recessed cream | Code blocks, callouts, record blocks, the Failures section. |
| `--paper-review` | `#F3ECDE` | Review paper | Page background on `/reviews/*` only. |
| `--ink-900` | `#141210` | Ink | Body text, headings. A **warm** near-black, not `#000`. |
| `--ink-700` | `#3B352E` | Soft ink | Secondary prose, nav at rest, standfirsts. |
| `--ink-500` | `#6B5A48` | Umber | Metadata, captions, labels, quiet links. |
| `--ink-300` | `#9A8F80` | Warm grey | Disabled, tertiary, `archived` status. |
| `--rule` | `#D9D0BE` | Hairline | All 1px borders and dividers. |
| `--rule-strong` | `#B8AC96` | Strong hairline | Table header borders, emphasis dividers. |
| `--vermilion` | `#E3510F` | Vermilion | **Graphic** accent: stamps, rules, glyphs, the `‸`, the progress line, status squares. Large text only. |
| `--vermilion-ink` | `#B23A06` | Vermilion ink | **Text** accent: all links, all accent text. AA-compliant. |
| `--vermilion-deep` | `#8F2E05` | Deep vermilion | Hover/active on accent text and primary buttons. |
| `--peach` | `#F2DCC7` | Peach | Highlight/`<mark>` background, diff-added lines, gentle emphasis. |

**The two-orange rule.** `--vermilion` (`#E3510F`) is beautiful and does **not** pass AA for body-size text on cream (3.42:1). `--vermilion-ink` (`#B23A06`) does (5.33:1). Therefore:

> **`--vermilion` may never be used for text below 24px. All accent text uses `--vermilion-ink`.**

This is enforced by convention and by a CI contrast check (§23). It is the single most important rule in the colour system, and it is exactly the accessibility requirement the brief called out.

### 11.2 Contrast audit (against `--paper` `#F6F1E7`)

| Foreground | Ratio | Verdict |
|---|---|---|
| `--ink-900` `#141210` | **16.4 : 1** | AAA — body, headings |
| `--ink-700` `#3B352E` | **11.2 : 1** | AAA — secondary prose |
| `--ink-500` `#6B5A48` | **5.9 : 1** | AA — metadata, captions (≥14px) |
| `--ink-300` `#9A8F80` | **2.8 : 1** | ✗ decorative / disabled only. **Never for meaningful text.** |
| `--vermilion-ink` `#B23A06` | **5.3 : 1** | AA — links, accent text |
| `--vermilion-deep` `#8F2E05` | **7.6 : 1** | AAA — hover states |
| `--vermilion` `#E3510F` | **3.4 : 1** | ✗ text < 24px. ✓ large text (≥24px), ✓ non-text UI (3:1), ✓ graphics |
| `--rule` `#D9D0BE` | 1.4 : 1 | Decorative rules only — never a focus indicator, never a border that carries meaning alone |

Focus rings use `--vermilion-ink` (5.3:1 against cream, 3.1:1 against `--paper-sunk`) — passing the 3:1 non-text requirement on every surface.

### 11.3 Application rules

- **Vermilion appears at most 4 times per screen.** If a fifth instance appears, something is wrong. Count them.
- **Ink is the default for everything readable.** The eye should land on black text on cream, always.
- **Backgrounds never go dark.** No dark sections, no inverted heroes, no dark footer. The one dark surface on the site is a primary button, and there are almost none of those.
- Status colour is never the sole carrier of meaning (§8.10).

### 11.4 Figure / chart palette

Charts need more than three values. This is the **only** place additional hues are permitted, and they never appear in site chrome.

| Token | Hex | Role |
|---|---|---|
| `--fig-1` | `#141210` | Primary series (ink) |
| `--fig-2` | `#E3510F` | Secondary series (vermilion) |
| `--fig-3` | `#35564F` | Tertiary — a slate green, the palette's one cool counterpoint |
| `--fig-4` | `#B8974F` | Quaternary — muted ochre |
| `--fig-5` | `#8A6E9E` | Quinary — muted plum, used last and rarely |

- Sequential scales interpolate `--peach → --vermilion → --vermilion-deep`.
- Diverging scales run `--fig-3 → --paper → --vermilion`.
- All chart palettes must be checked for deuteranopia and protanopia; `--fig-2` and `--fig-3` must remain distinguishable, and series must also differ by **line style or marker shape**, not colour alone.

### 11.5 Code theme

A custom Shiki theme on `--paper-sunk`:

| Token | Colour |
|---|---|
| Plain text / punctuation | `--ink-900` |
| Comment | `--ink-500`, italic |
| Keyword | `--vermilion-deep`, weight 600 |
| String | `--fig-3` (slate green) |
| Number / constant | `--fig-4` (ochre) |
| Function name | `--ink-900`, weight 600 |
| Type / class | `--fig-5` (plum) |
| Variable | `--ink-700` |

Restrained, on-palette, and readable — the opposite of a neon syntax theme dropped into a cream page.

### 11.6 Dark mode

**Not in v1.** A cream-and-vermilion identity does not have an obvious dark counterpart, and a badly-made dark mode would damage the brand more than its absence damages usability. The page is a warm, low-blue-light cream at 16:1 contrast, which is already comfortable at night.

If added later (§20), it must be a **"dusk" mode**, not an inverted mode: `#1A1714` paper, `#EFE7DA` ink, `#F2793C` accent (lightened to pass AA on dark), and every rule and tint re-derived, not merely inverted. It is a full design pass, not a token swap. Flagged as **OD-4**.

---

## 12. Layout and responsive behaviour

### 12.1 Breakpoints

| Name | Range | Notes |
|---|---|---|
| `xs` | < 480px | Small phones |
| `sm` | 480–767px | Phones |
| `md` | 768–1023px | Tablets, small laptops |
| `lg` | 1024–1279px | Laptops |
| `xl` | 1280–1599px | Desktops — the design's home |
| `2xl` | ≥ 1600px | Large displays |

Mobile-first CSS. Breakpoints in `em` (`30em`, `48em`, `64em`, `80em`, `100em`) so they respect user font-size settings.

### 12.2 Column behaviour by page

| Page | `xl` (≥1280) | `lg` (1024–1279) | `md` (768–1023) | `sm/xs` (<768) |
|---|---|---|---|---|
| **Home** | Full width to 1440. Ledger full-width. Currently = 3 cols. | Same, Currently = 3 cols | Currently = 2 cols | Currently = 1 col; Ledger drops the project column below 480px |
| **Article** | TOC 220 / text 640 / margin 240 | text 640 / margin 240; TOC → sticky bar under header | Single column 640; TOC → `<details>`; sidenotes → inline `<details>` | Single column, full-bleed gutters 24px |
| **Project** | TOC 200 / content 680 / margin 220 | content 680 / margin 220 | Single column; record block stays a 2-col dl | Single column; record block → stacked dl; experiments collapse |
| **Projects index** | Filter rail 200 / list | Filter rail 200 / list | Filters → a `<details>` bar above the list | Filters → a full-screen sheet triggered by a `Filter (2)` text button |
| **Writing** | Filter row + list + hover-standfirst in margin | Same, no margin standfirst | Same | Rows collapse: date and kind on one mono line, title below |
| **Experience** | Spine + content | Spine + content | Spine collapses to a left rule only | No spine; entries separated by rules; years become mono headings |
| **Now** | 560px, centred-left | Same | Same | Label column moves above value |
| **Reviews** | Record + assessment side by side | Same | Stacked | Stacked; assessment squares stay horizontal |

### 12.3 Component-specific responsive rules

**Navigation.** ≥768px: full header. <768px: wordmark + `⌕` + `Menu` → full-screen sheet (§7.4). Header hides on scroll-down below 768px only.

**Metadata.** The record block's label column is fixed at 90px (desktop) / 72px (tablet). Below 480px it stacks: label above value, label in 11px mono uppercase. Never truncate a label with an ellipsis.

**Long-form articles.** The measure never exceeds 680px at any breakpoint. On `2xl`, the *page* gets wider but the *text does not* — the extra space goes to the margins, which is what margins are for.

**Tables.** ≥768px: as authored. <768px: horizontal scroll inside a labelled, focusable region, with a right-edge fade. Author can opt into `stack: true`, which converts each row into a definition list with the header cells as labels — appropriate for ≤ 6-row tables, wrong for data tables.

**Figures.** Bleed figures (920px) shrink to the text measure below `lg`, and to full-gutter width below `md`. Multi-panel figures declare a `panels` count and reflow to a single column below `md`. Any figure with essential fine detail must have a "view full size" link (opens the image directly — no lightbox JS).

**Sidenotes.** ≥1200px: true margin notes, positioned at the top of their referencing paragraph, never overlapping (a small layout pass pushes collisions down). 1024–1199px: still in the margin, but the margin narrows to 200px and the note text drops to 13px. <1024px: collapse to a numbered inline `<details>` immediately after the referencing paragraph — expanded content stays in the reading flow. **Always** additionally listed in the foot-of-article `Notes` section, so nothing is ever unreachable.

**Filters.** <768px, a `Filter` text button opens a full-screen sheet with the same checkboxes, a live result count, and `Apply` / `Clear all`. The sheet is a real dialog with focus trapping.

**Timelines.** Vertical at every breakpoint. Never horizontal, never a Gantt chart, never scroll-driven. Below `md`, nodes lose their year spine and become mono date headings.

**Touch.** All interactive targets ≥ 44×44px on touch (achieved by padding, not by growing the visible element). Ledger rows are ≥ 48px tall on mobile. Adjacent targets are ≥ 8px apart.

---

## 13. Interaction and motion

### 13.1 Philosophy

Motion on Starkonium exists to explain a state change, and for no other reason. If a reader can't tell what an animation was *for*, it should not exist. **The site should feel like paper that responds, not software that performs.**

### 13.2 Tokens

```
--dur-fast:  120ms   (tints, underlines, focus)
--dur-base:  180ms   (disclosure, filters, dialog)
--dur-slow:  240ms   (page transitions, sheets — the ceiling)
--ease:      cubic-bezier(0.2, 0.6, 0.2, 1)     /* fast out, gentle settle */
--ease-out:  cubic-bezier(0.16, 1, 0.3, 1)      /* sheets, dialogs */
```

**Nothing on this site animates for longer than 240ms.** Only `opacity` and `transform` are animated (never `height`, `top`, `width`, or `box-shadow`, except via `clip-path`/`grid-template-rows` for disclosures, which is GPU-safe enough at these sizes).

### 13.3 What animates

| Interaction | Behaviour |
|---|---|
| **Page transition** | Astro View Transitions: a 120ms cross-fade of `<main>` only. The header and footer persist (`transition:persist`). No slide, no scale, no wipe. Skipped entirely under reduced motion. |
| **Nav hover** | Underline grows from left, 140ms. |
| **Row hover** (ledger, index, related) | Background → `--paper-raised`, 120ms. The `‸` marker translates 4px right, 140ms. |
| **Link hover** | Underline colour change, 120ms. |
| **Focus** | Instant. **Focus rings never animate** — a delayed focus ring is an accessibility failure. |
| **Filter change** | Non-matching rows fade to 0 opacity over 120ms, then `display:none` at frame end. Matching rows appear instantly. **No reflow animation, no FLIP, no shuffle.** The list must not dance. |
| **Disclosure** (`<details>`, experiments, timeline expand, sidenotes on mobile) | Height via `grid-template-rows: 0fr → 1fr`, 180ms, plus content opacity 120ms delayed 60ms. The chevron/`‸` rotates 90°. |
| **Timeline expand** | Same disclosure mechanism. Nodes do not slide in one after another. |
| **Search dialog** | Backdrop fades in (120ms). Panel fades + translates 8px up (180ms, `--ease-out`). Closing is 120ms and does not translate. |
| **Mobile menu sheet** | Fade + 8px up, 200ms. |
| **Reading progress line** | Width updates on scroll, no transition (a transitioned progress bar lags the scroll and feels broken). Throttled via `requestAnimationFrame`. |
| **Reveal on scroll** | **One instance only**, and it is optional: the homepage's four regions may fade in (opacity 0 → 1, 8px translate, 200ms, staggered 60ms) *on first load only*, once, never again on navigation, and never below the fold on subsequent visits. Consider cutting it entirely. It is flagged as **OD-5**. |

### 13.4 What must never animate

Non-negotiable list:

- Page-load stagger of every element ("everything fades up on scroll"). This is the single clearest tell of a templated site.
- Parallax, of any layer, at any depth.
- Scroll-jacking, scroll-snapping, or scroll-driven scrubbing.
- Number counters ticking up.
- Typewriter / text-scramble / decode effects.
- Marquees or infinite ticker rows.
- Hover *scale* or *lift* on rows, cards or images. (Rows tint. That's it.)
- Cursor followers, magnetic buttons, custom cursors.
- Skeleton shimmer.
- The status stamp (it is a stamp; stamps do not breathe).
- The `● NOW` indicator (no pulse, no blink — a blinking dot on a reading site is a tic).
- Logo/wordmark animation of any kind.
- Anything triggered by mouse movement rather than by an intentional action.

### 13.5 Reduced motion

```
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Plus, explicitly: View Transitions disabled; the homepage reveal disabled; disclosures snap open; the mobile sheet appears without translation. Every one of these must still *work* — reduced motion removes movement, never function.

### 13.6 Performance rules

- `will-change` is used on at most two elements (dialog panel, mobile sheet) and removed after.
- Scroll listeners are passive and rAF-throttled. There are exactly three: reading progress, TOC highlight (IntersectionObserver, not a scroll listener), and the mobile header hide.
- No layout thrash: filtering toggles a class, it does not measure.
- **Target: zero client JS on `/writing/[slug]` and `/reviews/[slug]` except the TOC observer and the progress line — together under 2KB.**

---

## 14. Accessibility

Target: **WCAG 2.2 Level AA**, with AAA contrast on body text (already met at 16.4:1).

### 14.1 Contrast

Per §11.2. The binding rules:

- Body text: `--ink-900` on `--paper` = 16.4:1.
- **The orange accent is split in two** so that every text use passes AA (`--vermilion-ink`, 5.3:1) while the graphic accent stays vivid (`--vermilion`, used only where 3:1 suffices). This is the direct answer to the brief's requirement.
- Non-text UI (borders that carry meaning, status glyphs, focus rings, form boundaries): ≥ 3:1.
- Hairline rules at 1.4:1 are permitted **only** as decorative separators; they never carry meaning alone, and a component's boundary is never communicated by a hairline alone where that boundary is functional (e.g. the search input also has a label and a focus ring).

### 14.2 Keyboard

- Every interactive element is reachable with `Tab`, in DOM order, which matches visual order on every layout.
- **Skip link** (`Skip to content`) is the first focusable element; visible on focus, positioned top-left, cream on ink.
- Search: `⌘K` / `Ctrl-K` opens; `Esc` closes and returns focus to the trigger; `↑`/`↓` move through results; `Enter` opens; `⌘Enter` opens in a new tab. Focus trapped while open. `aria-modal="true"`.
- Mobile menu and filter sheets: focus trapped, `Esc` closes, focus returns to the trigger, the rest of the page is `inert`.
- Disclosures use native `<details>`/`<summary>` wherever possible — free keyboard support, free screen-reader semantics.
- Sortable table headers are `<button>`s inside `<th>` with `aria-sort`.
- No keyboard trap anywhere, including in code blocks (which must be `tabindex="0"` and scrollable, with a visible focus ring, so keyboard users can scroll them).

### 14.3 Focus

`:focus-visible` only (no rings on mouse click), 2px `--vermilion-ink` outline with 2px offset and a 1px `--paper` inner ring. **Never** `outline: none` without a replacement. Focus is never animated. Focus is never hidden by `overflow`. After navigation (including View Transitions), focus moves to `<main>` (`tabindex="-1"`) and the page title is announced.

### 14.4 Semantic structure

- One `<h1>` per page. Heading levels never skip. Headings describe content, not style.
- Landmarks: `<header>`, `<nav aria-label="Primary">`, `<main>`, `<aside aria-label="Notes">`, `<footer>`. The TOC is `<nav aria-label="On this page">`.
- The Ledger is a `<ul>` of `<li>`, not a table (it is a list of events, not tabular data). Real tables are `<table>` with `<caption>`, `<thead>`, `<th scope>`.
- The record block is a `<dl>`.
- Status is conveyed by a text label, always. The glyph is `aria-hidden`.
- The `‸` marker is `aria-hidden` everywhere. It is never the accessible name of anything.

### 14.5 Screen readers

- Filter results announced via `aria-live="polite"`: `12 projects match.` Debounced to avoid chatter.
- Search results announced on arrival: `8 results.`
- The reading progress line is `aria-hidden` (it is decorative; the article has headings and a TOC for real navigation).
- Sidenotes: the reference marker is a link with an accessible name (`Note 3`), the note itself is in an `<aside>` with `role="note"`, and every note also exists in the foot-of-page list. No note is ever visually-only.
- Equations: KaTeX with MathML output enabled, plus an author-supplied `aria-label` for display equations (`"AUC equals area under the ROC curve"`). If an equation is essential to the argument, it must also be stated in prose — a rule for the author, not the renderer.
- External links: the `↗` is `aria-hidden`; the link text carries `(opens in a new tab)` via a visually-hidden span *only* where `target="_blank"` is used — which should be rare (default is same-tab).

### 14.6 Alt text

Policy, enforced in the `Figure` component (which requires `alt`):

- **Decorative** images: `alt=""` and `role="presentation"`. There are almost none on this site.
- **Informative** figures: `alt` describes what the figure shows *and what it means* in one sentence.
- **Data figures** (plots, charts): `alt` gives the takeaway (`"AUC drops from 0.88 to 0.71 after homology removal"`), and a **long description** is provided in a `<details>` below the caption containing the underlying numbers or a table. This is the accessible equivalent of "show your data", and it aligns exactly with the site's reproducibility values.
- The caption is **not** a substitute for alt text; they say different things (`aria-describedby` links them).

### 14.7 Forms

Every input has a visible `<label>`. Errors are announced (`aria-describedby` + `role="alert"`), specific, and adjacent to the field. Placeholder text is never the only label. Search input is `type="search"` with `enterkeyhint="search"`.

### 14.8 Link clarity

No "click here", no "read more" as the sole link text. Link text describes the destination. On index rows the entire row is the link and its accessible name is the entry title plus its kind (`"Essay: On the smell of a wet culture room"`).

### 14.9 Reading and targets

- Body text ≥ 18px. No meaningful text below 12px anywhere (mono metadata at 12px is the floor, and it always has a 5.9:1 contrast).
- Touch targets ≥ 44×44px, spacing ≥ 8px.
- Text reflows without horizontal scrolling at 320px width and at 400% zoom (WCAG 1.4.10). Test explicitly.
- All sizing in `rem`, so browser font-size preferences work.
- `prefers-reduced-motion` honoured (§13.5). `prefers-contrast: more` bumps `--rule` to `--rule-strong` and `--ink-500` to `--ink-700`.

---

## 15. Content models and schemas

Astro Content Collections with Zod. Directory layout:

```
src/content/
  projects/     fold-switch-propensity.mdx
  updates/      2026-07-09-validation-rebuilt.mdx
  writing/      on-the-smell-of-a-wet-culture-room.mdx
  reviews/      kim-2026-fold-switch-coevolution.mdx
  experience/   2025-institution-research-assistant.mdx
  now/          2026-07-09.mdx
  people/       people.yaml          (a single data file, not a collection of pages)
  topics/       topics.yaml          (single data file)
  series/       series.yaml          (single data file)
```

### 15.0 Shared conventions

- **Slugs**: kebab-case, ASCII, derived from the filename, immutable once published. A slug change requires a redirect entry in `redirects.ts`. Slugs never contain dates (except `updates`, where the date is part of the identity).
- **IDs**: `PRJ-014` etc. Assigned in frontmatter (`id`), never reused, never reordered. A build-time check enforces uniqueness and monotonicity.
- **Dates**: ISO `YYYY-MM-DD`, no times, no timezones. Coerced to `Date` by Zod.
- **`draft: true`**: excluded from build in production; visible in dev with a `DRAFT` banner. Excluded from search, RSS, sitemap, and all listings.
- **`featured: true`**: eligible for the featured slot on its index. Max 2 rendered; if more are flagged, the most recent win and the build emits a warning.
- **`topics`**: an array of topic slugs. Validated against `topics.yaml` at build; an unknown slug fails the build. This prevents tag sprawl, which is the death of every personal archive.
- **Relationships** are by slug and validated with `reference()`.

### 15.1 `projects`

```yaml
---
id: PRJ-014                        # required, unique, immutable
title: Fold-switch propensity from coevolutionary signal   # required
slug: fold-switch-propensity       # required (from filename)
thesis: >                          # required, 2–3 sentences, 40–320 chars
  Can a coevolutionary coupling matrix tell you that a protein has two
  folds before you ever run a simulation? Six months in, the honest
  answer is "sometimes, and I can't yet predict when."
status: active                     # required — enum below
started: 2025-11-02                # required
updated: 2026-07-09                # required (or derived from newest update — see note)
field: structural-biology          # required — topic slug with facet=field
topics: [coevolution, msa, molecular-dynamics, pytorch, gromacs]  # required, ≥1
type: research                     # required — enum: research | software | analysis | writing | teaching | experiment
collaborators:                     # optional
  - person: jane-doe
    role: supervisor
repositories:                      # optional
  - name: foldswitch-dca
    url: https://github.com/…
    description: Inference pipeline and benchmarks
    language: Python
    license: MIT
outputs:                           # optional
  - kind: preprint                 # enum: preprint | paper | poster | talk | dataset | package | thesis
    title: Coevolutionary signal is necessary but not sufficient…
    venue: bioRxiv
    date: 2026-05-04
    doi: 10.1101/2026.05.04.xxxxxx
    url: https://…
relatedWriting: [what-a-coupling-actually-is]   # optional — refs to writing
relatedExperience: [exp-003]                    # optional
featured: true                     # optional, default false
draft: false                       # optional, default false
image: ./cover.png                 # optional — used for OG; must be an author figure, never stock
---

## Problem
…MDX body, using the section headings from §6.3…
```

**Enums.**
- `status`: `active | validation | exploratory | speculative | paused | completed | archived`
- `type`: `research | software | analysis | writing | teaching | experiment`
- `outputs[].kind`: `preprint | paper | poster | talk | dataset | package | thesis`
- `collaborators[].role`: `supervisor | collaborator | co-author | advisor | student`

**Rules.**
- `updated` is **derived**: `max(frontmatter.updated, newest update.date)`. The frontmatter field is a floor, not the truth.
- `rev.N` = `count(updates) + 1`.
- If `status: paused`, the most recent `paused` update must exist and carry a reason. Build warning if not.
- Structural rule: an MDX body with a `## Failures` or `## Dead ends` heading gets the sunk-paper treatment automatically.

### 15.2 `updates`

```yaml
---
project: fold-switch-propensity    # required — reference('projects')
date: 2026-07-09                   # required
kind: result                       # required — enum §6.4
summary: >                         # required, ≤ 200 chars, plain text, no markdown
  Validation set rebuilt without homologous leakage; AUC drops from
  0.88 to 0.71. This is probably the real number.
draft: false
---

Optional MDX body. Most updates have none. If present, it may contain a
figure, a code block, or a few paragraphs — but if it needs headings,
it is an article, not an update.
```

- Filename convention: `YYYY-MM-DD-short-slug.mdx` → URL `/log/2026-07-09-validation-rebuilt`.
- `kind: paused` **requires** a `summary` explaining why (schema-level `.refine()`).
- Updates are immutable once published. A correction is a *new* update with `kind: fixed`.

### 15.3 `writing`

```yaml
---
id: WRT-031
title: On the smell of a wet culture room
slug: on-the-smell-of-a-wet-culture-room
kind: essay                        # required — enum §6.5
published: 2026-07-02              # required
updated: 2026-07-05                # optional
standfirst: >                      # required, 1–3 sentences, 60–280 chars
  Every lab I've worked in has had a smell, and I have never seen one
  described in a paper. This is an essay about the parts of doing
  science that don't survive the write-up.
topics: [memory, teaching, molecular-biology]   # required, ≥1
series: null                       # optional — reference('series')
seriesIndex: null                  # required if series is set
volume: current                    # required — enum: current | times
relatedProjects: []                # optional
featured: true
draft: false
image: ./fig-1.png                 # optional
revisions:                         # optional — surfaced in the article's REVISIONS block
  - date: 2026-07-05
    note: Fixed the units in Fig. 2.
originalUrl: null                  # set for imported Times posts — the old Blogger URL
---
```

**Enums.** `kind`: `essay | explainer | note | reflection | literature | personal | short`. (`review` is *not* here — reviews are their own collection.)
`volume`: `current | times`.

### 15.4 `reviews`

```yaml
---
id: REV-008
slug: kim-2026-fold-switch-coevolution
reviewed: 2026-06-28               # required — date I wrote the review
paper:                             # required
  title: Coevolutionary signal predicts fold-switching in metamorphic proteins
  authors: [Kim, J., Oyelaran, T., Behera, S.]
  year: 2026
  journal: Nature Methods
  volume: "23(6)"
  pages: 812–824
  doi: 10.1038/s41592-026-0xxxx    # required if it exists — this is a review of a paper
  preprintUrl: https://…           # optional
  codeUrl: https://…               # optional (null means "no code" and is rendered as such)
  dataUrl: null
verdict: partly-convincing         # required — enum below
verdictLine: >                     # required, ≤ 160 chars — used in the index and OG
  The separation is real on their benchmark and vanishes when homologues
  are removed from the negatives.
field: structural-biology          # required
topics: [coevolution, benchmarking, metamorphic-proteins]
assessment:                        # required — all five, each 1–5 with a justification
  evidence:        { score: 3, note: Strong on the benchmark, untested off it. }
  novelty:         { score: 4, note: The statistic itself is genuinely new. }
  clarity:         { score: 5, note: Beautifully written; methods are complete. }
  reproducibility: { score: 2, note: Code released, environment unpinned, seeds absent. }
  usefulness:      { score: 4, note: Directly informs PRJ-014's negative-set design. }
reproduction:                      # optional but strongly encouraged
  attempted: true
  outcome: partial                 # enum: reproduced | partial | failed | not-attempted
  note: Reran on their data; matched Fig. 2. Failed to match after my own negative set.
relation: competing                # required — enum: none | cited-by-me | competing | collaborators
relatedProjects: [fold-switch-propensity]
featured: false
draft: false
---

## Verdict
…prose…
## Central question
…
```

**Enums.**
- `verdict`: `convincing | partly-convincing | interesting-but-unconvincing | not-convincing | important | flawed-but-useful`
- `reproduction.outcome`: `reproduced | partial | failed | not-attempted`
- `relation`: `none | cited-by-me | competing | collaborators`

**Rules.** The MDX body must contain a `## Strongest contribution` section — a `.refine()` on the compiled headings, or at minimum a build warning. This is the values check from §6.7.

### 15.5 `experience`

```yaml
---
id: EXP-003
slug: institution-research-assistant
organisation: "{{INSTITUTION}}"    # required
position: Research assistant       # required
group: Structural bioinformatics group   # optional
supervisor: jane-doe               # optional — reference('people')
start: 2025-11-01                  # required
end: null                          # null = current
location: "{{CITY}}"               # required — city-level only
current: true                      # derived from end === null
context: >                         # required — one paragraph, what the role was
  …
contribution: >                    # required — the most important field. First person, specific.
  …
methods: [dca, msa-construction, molecular-dynamics]
tools: [pytorch, gromacs, nextflow]
outputs: [ … ]                     # same shape as projects.outputs
presentations: [ … ]               # optional
skills: [ … ]                      # optional — free text, not topic slugs
lessons: >                         # optional but encouraged — prose, personal
  …
relatedProjects: [fold-switch-propensity, reproducible-md-ensembles]
featured: true
draft: false
---

Optional long-form MDX body for the expanded view / dedicated page.
```

### 15.6 `now`

One file per revision. The newest is `/now`; the rest are `/now/archive`.

```yaml
---
date: 2026-07-09                   # required — this is the identity
building: >                        # optional
  A rewrite of the contact-map pipeline so a clean checkout reproduces
  Fig. 2 in one command.
buildingProject: fold-switch-propensity     # optional ref
investigating: >
writing: >
reading:                           # optional — array of free-text lines
  - "Ishiguro, *Klara and the Sun*"
  - "Eddy (2004), *What is a hidden Markov model?* — again"
learning: >
recentlyDone:                      # optional
  - { text: Rebuilt the validation set, date: 2026-07-09 }
thinkingAbout: >
location: "{{CITY}} · {{INSTITUTION}}"      # city/institution only. Never finer.
---
```

The build emits the newest `now` file to `/now` and posts a `NOW` entry to the Ledger.

### 15.7 `people` (data file, not pages)

```yaml
- id: jane-doe
  name: Jane Doe
  affiliation: "{{INSTITUTION}}"
  role: Professor of Structural Biology
  url: https://…                   # optional
  orcid: 0000-0000-0000-0000       # optional
```

No person pages in v1. Names render as text, with an optional outbound link. **A collaborator's name appearing on this site is a courtesy, not a claim** — nothing about them is inferred, and no photographs.

### 15.8 `topics` (data file)

```yaml
- slug: molecular-dynamics
  label: Molecular dynamics
  facet: method                    # field | method | tool | theme
  description: >                   # optional, shown on /topics/[slug]
    Simulating atoms and hoping the force field is telling the truth.
  aliases: [md]                    # optional — for search
```

Closed vocabulary. Adding a topic is a deliberate act (edit one YAML file). Unknown topic slugs fail the build.

### 15.9 `series` (data file)

```yaml
- slug: a-to-z-genetics
  title: "A–Z: Genetics"
  volume: times                    # current | times
  description: >
    A run through genetics one concept at a time, written in 2022–23
    for readers with no biology background.
  status: paused                   # active | complete | paused | abandoned
  ordered: true                    # if true, entries have a canonical order and prev/next nav
```

Series can contain `writing` entries and, in principle, `projects`. In v1, writing only.

---

## 16. Technical architecture

### 16.1 Evaluation of the proposed stack

**Astro + TypeScript + MDX + content collections + GitHub + Vercel/Cloudflare Pages.**

**Verdict: correct. Adopt it, with five refinements.**

Astro is the right tool for exactly this shape of project: a content-heavy, mostly-static, reading-first site where the ideal amount of client JavaScript on most pages is zero. Content Collections give schema validation at build time, which is what turns a folder of Markdown into a real content model — and this spec leans on that heavily (unknown topic slugs failing the build is only possible because of it). MDX gives the author real components (`<Note>`, `<Figure>`, `<Superseded>`) without leaving Markdown. Git as the CMS satisfies the ownership requirement absolutely.

**Refinements:**

1. **No UI framework. No React, no Vue, no Svelte.** The interactive surface is: a search dialog, a filter rail, a TOC observer, a mobile menu. That is perhaps 300 lines of vanilla TypeScript in Astro islands. Adding a framework here would add 40KB+ and a hydration model to solve problems this site does not have. *(If a component ever genuinely needs it, add Svelte — smallest runtime, best fit.)*

2. **No Tailwind. Vanilla CSS with design tokens and `@layer`.** This is a document site with ~26 components and an elaborate prose typography system. Tailwind's value is in large component-driven UIs; in prose-heavy contexts it means either `@apply` (which is just CSS with extra steps) or a `prose` plugin whose defaults you spend a week overriding. Write the token file from §8 and §11, write ~1200 lines of well-organised CSS, and be done. Use `@layer reset, tokens, base, layout, components, prose, utilities` to keep specificity sane.

3. **Search: Pagefind**, not Fuse.js, not Algolia, not a server. Static, built from the emitted HTML, supports faceted filters, loads only on interaction, no API keys, no vendor.

4. **Deploy: Cloudflare Pages** over Vercel. Both are excellent; Cloudflare wins on: free bandwidth without a soft commercial cliff, edge cache quality worldwide (relevant — the author is in Bengaluru, readers will be global), and no framework lock-in. The site is fully static, so this is a genuinely reversible choice: `git push` to a different host and the site is live. **Keep it that way** — no Vercel-specific or Cloudflare-specific runtime features. `output: 'static'`. No SSR, no edge functions, no middleware.

5. **Content lives in the same repo**, not a submodule and not a headless CMS. `git commit -m "PRJ-014: validation rebuilt"` is the publishing workflow. Add a `pnpm new:update` script that scaffolds an update file from a one-line prompt, because reducing the author's friction from 90 seconds to 20 is the difference between a living site and a dead one.

### 16.2 The stack, specified

| Layer | Choice |
|---|---|
| Framework | **Astro 5**, `output: 'static'` |
| Language | **TypeScript**, `strict: true` |
| Content | **MDX** via `@astrojs/mdx`, Content Collections with Zod schemas (§15) |
| Styling | **Vanilla CSS**, custom properties, `@layer`, PostCSS for nesting + autoprefix. No CSS-in-JS. |
| Islands | Vanilla TS. Four of them: `SearchDialog`, `FilterRail`, `TableOfContents`, `MobileMenu`. `client:idle` or `client:visible`; never `client:load`. |
| Search | **Pagefind**, built post-build over `dist/` |
| Syntax highlighting | **Shiki**, build-time, custom cream theme (§11.5) |
| Maths | **remark-math + rehype-katex**, build-time, MathML output on, KaTeX CSS subset inlined. Zero client JS. |
| Images | `astro:assets`, AVIF + WebP + fallback, explicit dimensions, `loading="lazy"` below the fold |
| OG images | **Satori + resvg** at build time — a typographic template (cream, ink, vermilion, Fraunces title, mono shelfmark). One per entry. No screenshot service. |
| Feeds | `@astrojs/rss` — three feeds (§5.3) |
| Sitemap | `@astrojs/sitemap` |
| Fonts | Self-hosted, subset `woff2`, `fontsource` or manual, preloaded |
| Analytics | **None in v1.** If needed later: self-hosted Umami or Plausible. Never Google Analytics. No cookies, no banner. |
| Hosting | **Cloudflare Pages**, `main` branch auto-deploy, preview deploys on PRs |
| Repo | GitHub, public (the site's source being readable is on-brand) |
| CI | GitHub Actions: typecheck, build, link check, contrast check, schema check, Lighthouse CI budget (§23) |
| Package manager | pnpm |

### 16.3 Performance budgets (enforced in CI)

| Metric | Budget |
|---|---|
| HTML (article page, gzipped) | ≤ 30KB |
| CSS (total, gzipped) | ≤ 18KB |
| JS on `/writing/[slug]` | ≤ 2KB (TOC + progress) |
| JS on `/projects` | ≤ 6KB (filters) |
| JS on any page before interaction | ≤ 8KB |
| Search JS | ≤ 40KB, loaded **only** on ⌘K |
| Fonts | ≤ 180KB total, 2 preloaded |
| LCP (mobile, 4G) | ≤ 1.2s |
| CLS | **0.00** — no exceptions |
| INP | ≤ 100ms |
| Lighthouse (perf / a11y / best practices / SEO) | ≥ 98 / 100 / 100 / 100 |

### 16.4 Authoring workflow

1. `pnpm new:update` → prompts for project, kind, summary → writes the MDX file.
2. `pnpm dev` → drafts visible with a `DRAFT` banner.
3. `git commit && git push` → Cloudflare builds → live in ~60s.
4. Optional: GitHub's web editor or a mobile Git client means an update can be posted from a phone. **This is the workflow that keeps the Ledger alive, so it must be tested and documented in the README.**

### 16.5 What we are explicitly not building

No database. No CMS (not even a Git-backed one like Decap/TinaCMS — they add a build-time dependency and an auth surface for a single author who is comfortable in Markdown; flagged as **OD-6** if authoring proves painful). No comments (link to email; comments on a research notebook are a moderation job nobody wants). No newsletter in v1 (RSS first; if demand appears, Buttondown, which exports). No auth. No server.

---

## 17. SEO and metadata

### 17.1 Titles and descriptions

| Page | `<title>` | Description source |
|---|---|---|
| Home | `Starkonium — {{AUTHOR}}` | The statement, first sentence |
| Projects index | `Projects — Starkonium` | Hand-written, 140–160 chars |
| Project | `{title} — Projects — Starkonium` | `thesis`, truncated at 155 chars on a word boundary |
| Writing index | `Writing — Starkonium` | Hand-written |
| Article | `{title} — Starkonium` | `standfirst` |
| Review | `Review: {paper.title} — Starkonium` | `verdictLine` |
| Experience | `Experience — {{AUTHOR}} — Starkonium` | Hand-written |
| Now | `Now — Starkonium` | `Updated {date}. What {{AUTHOR}} is building, investigating and reading.` |
| Topic | `{label} — Starkonium` | Topic description + entry count |

Titles never exceed 60 characters before the ` — Starkonium` suffix; if a title is longer, the `seoTitle` optional frontmatter field overrides.

### 17.2 Open Graph images

Generated at build with Satori. **A typographic template, not a screenshot.**

```
┌──────────────────────────────────────────────────────────┐  1200 × 630
│  STARKONIUM                                   PRJ-014     │  cream #F6F1E7
│  ────────────────────────────────────────────────────     │  1px ink rule
│                                                          │
│  Fold-switch propensity from                             │  Fraunces 500, 62px
│  coevolutionary signal                                   │  ink, max 3 lines
│                                                          │
│  ┌──────────┐                                            │
│  │  ACTIVE  │  structural biology · coevolution          │  stamp + mono meta
│  └──────────┘                                            │
│                                                          │
│  ────────────────────────────────────────────────────     │
│  {{AUTHOR}}                              starkonium.com  │  mono 20px, umber
└──────────────────────────────────────────────────────────┘
```

Variants by type: projects show the status stamp; articles show `ESSAY · 12 min`; reviews show the verdict and the journal. The homepage OG shows the statement. **Never** a stock image, never a photo, never a gradient.

### 17.3 Structured data (JSON-LD)

| Page | Type |
|---|---|
| All pages | `WebSite` (with `SearchAction`), `Person` (`{{AUTHOR}}`, with `sameAs`: GitHub, ORCID, Scholar, LinkedIn) |
| Article | `BlogPosting` (or `ScholarlyArticle` for `kind: explainer`/`note` with references) — `headline`, `datePublished`, `dateModified`, `author`, `keywords` (topics), `wordCount`, `image` |
| Review | **`Review`** with `itemReviewed: ScholarlyArticle` (including its `sameAs: doi.org/…`), `author: Person`. **`reviewRating` is omitted** — the site does not produce an aggregate score, and inventing one for a crawler would be a lie. |
| Project | `CreativeWork` (+ `SoftwareSourceCode` for each repository, with `codeRepository`, `programmingLanguage`, `license`) |
| Experience | Part of the `Person` graph (`alumniOf`, `worksFor`, `hasOccupation`) |
| Index pages | `CollectionPage` + `BreadcrumbList` |

`ProfilePage` on `/about`. Breadcrumbs on all nested pages.

### 17.4 The rest

- **Canonical URLs** on every page, absolute, `https://starkonium.com/...`, no trailing slash (pick one and redirect the other — decision: **no trailing slash**).
- **Old Blogger URLs 301 → new URLs** (§18). Canonical on imported posts points at the *new* URL. `originalUrl` is recorded in frontmatter and shown in the archive dateline for provenance, but is **not** a canonical.
- **Sitemap**: `sitemap-index.xml` + per-collection sitemaps. `lastmod` from `updated`. Drafts excluded. Priority is not set (Google ignores it).
- **RSS**: three feeds, full content in `<content:encoded>` for articles (not excerpts — this is a site that wants to be read, and a truncated feed is a growth tactic). Each item carries its `id`, `kind` and topics as categories.
- **robots.txt**: allow all; disallow `/search?`; link the sitemap. **AI crawlers are allowed** — the writing is CC BY 4.0 and the point is for it to be read. *(Reconsider if this changes; it is a values call, not a technical one. **OD-7**.)*
- **Author information**: `Person` JSON-LD with `sameAs` for ORCID and Scholar; ORCID and GitHub links carry `rel="me"` for identity verification.
- **Social sharing**: `og:*` and `twitter:card="summary_large_image"` on every page. No share buttons on the site (they are tracking surfaces and nobody uses them).
- **Per-content-type metadata:** projects expose `status`, `field` and `updated` in the OG description; reviews expose the paper's DOI in a `citation_doi` meta tag (helps Scholar-adjacent crawlers find the connection).

---

## 18. Migration considerations

The current site is Blogger, at `starkonium.com`, titled *The Starkonium Times*: **14 posts, April 2021 – September 2023**, in four label-series (`A–Z: Genetics`, `History of DNA` ×4, `Industry` ×5, `Origins of Life` ×2), with images hosted on `blogger.googleusercontent.com`.

The domain is **not touched until the new site is complete**, per the brief. Build and launch on a staging host first.

### 18.1 Sequence

| Phase | Action |
|---|---|
| **0. Build** | New site developed and deployed at `starkonium.pages.dev` (or `new.starkonium.com` if a subdomain is convenient). `noindex` while in progress. Old site untouched and live throughout. |
| **1. Export** | Blogger → Settings → *Back up content* → an Atom XML file. This is the source of truth; commit it to the repo at `/migration/blogger-export.xml` and never delete it. |
| **2. Convert** | A one-off Node script: Atom XML → 14 MDX files in `src/content/writing/`. Converts Blogger's HTML body to Markdown (`turndown`), preserving headings, lists, emphasis, links and footnote markers. **Manual review of every one of the 14 is mandatory** — this is a small enough corpus that a machine-perfect conversion is not worth chasing, and a human read-through will catch the things that matter. |
| **3. Rehost images** | Download every `blogger.googleusercontent.com` asset (~20 images), commit them to `src/content/writing/_images/`, rewrite the references, and add `alt` text to each — the originals have none. **This is the single biggest accessibility improvement in the migration.** |
| **4. Frontmatter** | For each post: assign `id` (`WRT-001`…`WRT-014`, in publication order), `kind` (mostly `explainer`), preserve the original `published` date exactly, set `volume: times`, map Blogger labels → topic slugs and series, set `originalUrl` to the old permalink. |
| **5. Redirect map** | Build `redirects.ts` mapping every old Blogger path to the new slug. Blogger URLs look like `/2023/09/1-z-alleles-and-chromosomes.html`. Target: `/writing/alleles-and-chromosomes`. **All 14, plus** the label archives (`/search/label/Industry` → `/topics/industry`) **and** the monthly archives (`/2022/04/` → `/archive`). Serve as 301s from Cloudflare's `_redirects` file. |
| **6. Annotate** | Where present-day `{{AUTHOR}}` disagrees with past `{{AUTHOR}}`, add `<Annotation date="2026-…">` margin notes (§4.4 M3). Not required for launch, but two or three good annotations at launch would demonstrate the feature better than any amount of explaining it. |
| **7. Archive front** | Write `/archive` and its author's note (§6.11). This copy matters. |
| **8. Cutover** | Point `starkonium.com` DNS at Cloudflare Pages. Remove `noindex`. Keep the Blogger blog *published but unlinked* for 30 days as a rollback path, then unpublish (never delete — the export is committed). |
| **9. Verify** | Re-crawl: check every one of the 14 old URLs returns a 301 to a live page. Submit the new sitemap in Search Console. Watch for 404s in Cloudflare analytics for 30 days. |

### 18.2 Rules for the migration

- **Nothing is edited.** Typos, opinions, exuberant capitals, the exclamation marks — all preserved. Corrections happen as *annotations*, never as silent edits. This is the site's central claim about itself and the migration is the first place it is tested.
- **Original publication dates are sacred.** A 2021 post is dated 2021 everywhere: in the list, in the RSS feed, in the JSON-LD, in the sitemap.
- **No `noindex` on old posts.** They are part of the site.
- **The "Times" title survives** as the archive's masthead. It's a good title and it earned its place.
- Blogger comments (if any) are **not** migrated. If a comment is valuable, quote it in an annotation with attribution.

### 18.3 Risks

| Risk | Mitigation |
|---|---|
| Losing existing search ranking on the 14 posts | 301s from every old URL, same publication dates, canonical pointing to the new URL, sitemap submitted on day one. Ranking for a 14-post blog is not a large asset, but it costs nothing to preserve. |
| Blogger image URLs rot after unpublishing | Rehost **before** cutover (phase 3), not after. Verify no `googleusercontent.com` reference survives with a build-time link check. |
| Voice mismatch between 2022 and 2026 writing | Solved by design: the volume system and the author's note (§6.11). |
| The author never posts an update and the Ledger dies | The real risk. Mitigated by the 4-line update schema, the `pnpm new:update` script, and phone-based Git editing. If the Ledger is empty after 3 months, the homepage design is wrong and must be revisited. |

---

## 19. Version-one scope

**Ship a small, complete, honest site.** A v1 with 4 projects and 20 pieces of writing that is *finished* beats a v1 with 12 half-written project pages.

### 19.1 Must exist before launch

**Content**

| Item | Count | Notes |
|---|---|---|
| Detailed project pages | **5** | 2 must be `active`, 1 `completed`, 1 `paused` **with an honest reason**, 1 `exploratory`. **At least one project must have a populated `Failures` section and a decision log.** If none does, the site is not telling the truth yet. |
| Project updates | **≥ 12** | Backfilled with real dates. A Ledger with 3 rows looks abandoned on day one. Backfilling is legitimate — these events happened. |
| Imported *Times* posts | **all 14** | Converted, images rehosted, alt text written, `volume: times`, redirects live |
| New essay | **1** | Written for the new site, in the new voice. Ideally the piece that explains why the site exists — but *not* a "welcome to my new blog" post. Something with an argument. |
| Paper review | **1** | Fully populated, including the `reproduction` block. This is the template's proof. |
| Experience entries | **1 detailed** (+ 1–2 brief) | The detailed one must include `contribution` and `lessons`. |
| About | 1 | With a photograph if one exists |
| Now | 1 | Genuinely current |
| CV PDF | 1 | 2 pages, hand-made |
| Archive front page + author's note | 1 | The note is required copy |
| Colophon | 1 | Typefaces, licence, revision history, and what the superscript means |

**Features**

- Home (all six regions), Projects (both views + filters), Project pages (full anatomy), `/log`, Writing archive (filters, series, volume tags), Article pages (TOC, sidenotes, figures, code, maths, citation block), Reviews (index + template + assessment strip), Experience (spine + expand + CV), About, Now, Archive, Topics, Search (⌘K + `/search`), 404, RSS ×3, sitemap, OG images, redirects, print stylesheets for project + experience pages.
- Full accessibility conformance (§14) and all performance budgets met (§16.3).

### 19.2 Can wait

| Deferred | Why |
|---|---|
| `/now/archive` | Needs ≥ 3 Now entries to be interesting. Ship the schema, build the page in month 2. |
| `/series/[slug]` pages | The series *tag* ships in v1; dedicated series pages can wait until a series has ≥ 4 entries. |
| Annotations on old posts | Ship the component with 2–3 examples; the rest accrete naturally. |
| Person pages | Not needed. Possibly never needed. |
| Dark/dusk mode | §11.6. |
| Analytics | Ship without. Decide later whether you actually want to know. |
| Newsletter | RSS first. |
| Full-text search across PDF outputs | Later, if ever. |
| The `Timeline` component's expanded view | Ship collapsed-only if time is short; the updates list carries the load. |
| Comments | Never. |

### 19.3 Build order (suggested)

1. Tokens, typography, layout primitives, and the four fonts. **Get the article page beautiful first** — it is the hardest surface and everything else is easier once the type system is right.
2. Content schemas + one real project + one real article, end to end.
3. The Ledger. Then the homepage.
4. Projects index + filters. Writing index + filters.
5. Reviews. Experience. About. Now.
6. Search, feeds, OG, sitemap.
7. Migration (it is a discrete, self-contained chunk — do not let it block the design work).
8. Accessibility audit, performance audit, print stylesheets, 404.
9. Cutover.

---

## 20. Future expansion

Ordered by expected value, not by ease.

1. **Annotations at scale.** As the archive grows, a `/annotations` view — every place `{{AUTHOR}}` has publicly changed their mind, in one list, dated. This would be a genuinely novel page on the internet and it is the logical endpoint of the site's thesis.
2. **Reproduction reports.** Extend the review's `reproduction` block into its own content type: `REP-001, I tried to rerun this paper and here is what happened`. There is enormous unmet demand for this and almost nobody does it. It could become the thing Starkonium is known for.
3. **Interactive figures** as MDX islands — a slider over an MD trajectory, a live contact-map explorer. **Only where they teach something a static figure cannot.** Strict JS budget; must degrade to a static figure.
4. **Dusk mode** (§11.6) — a full design pass, not a token swap.
5. **A `/data` section** for datasets with DOIs (Zenodo), if the research produces them.
6. **Series as first-class long-form**: an `A–Z` style series with its own landing page, ordered reading, and progress.
7. **Talk/poster archive** with slides as PDFs, if the volume justifies a page.
8. **Webmentions** (not comments) — an inbound-link record via brid.gy, showing where the writing has been discussed. Static, no moderation.
9. **A public reading log** — the `/now` reading list, accumulated, with one-line verdicts. Cheap to build, disproportionately loved.

**Not on this list, deliberately:** a newsletter with a modal, a "hire me" page, testimonials, a course, an AI chatbot trained on the site.

---

## 21. Explicit anti-patterns

If any of these appear in the built site, the implementation has failed.

**Visual identity**
- Any periodic-table element tile, or anything resembling one (square + letter + number).
- Glowing DNA, double helices, molecule renders, atom icons, hexagon grids, neon blue, dark cyberpunk labs, microscope stock photography, "science-y" background patterns, circuit-board motifs, gradient meshes, glassmorphism, glow effects, blurred blobs.
- Rounded corners. Anywhere. (§8.4)
- Box shadows, except the one search dialog. (§8.5)
- Cards. (§8.11)
- Any colour outside the palette in §11, except inside figures (§11.4).
- Vermilion used as a background fill for large areas.
- A dark section, a dark footer, or an inverted hero.

**Layout & structure**
- A card grid of identical project tiles.
- A masonry layout.
- A conventional SaaS landing page: hero → three feature cards → logo wall → testimonial → CTA.
- A "Skills" section with proficiency bars or star ratings.
- A stats row with counting numbers ("14 projects · 3 papers · ∞ curiosity").
- Pill-shaped tags. Pills of any kind.
- A dashboard-looking anything.
- Centred body text or justified body text.
- Text over an image.

**Motion**
- Scroll-triggered fade-up on every element.
- Parallax, scroll-jacking, scroll-snap, cursor followers, magnetic buttons, custom cursors, typewriter effects, number counters, marquees, skeleton shimmer, hover-lift, hover-scale, page-load logo animations, a pulsing NOW dot.
- Any animation longer than 240ms.

**Content & copy**
- "I am passionate about…", "innovative", "cutting-edge", "leveraging", "at the intersection of", "results-driven", "journey", "Let's build something amazing together."
- "Learn more" / "Read more" / "Click here" as link text.
- Lorem ipsum surviving to production.
- Fake or aspirational content (a project page for something that does not exist).
- Truncated excerpts standing in for written standfirsts.
- Old posts marked as "legacy", greyed out, `noindex`ed, or hidden.
- A single aggregate score on a paper review.
- A review with no "strongest contribution" section.

**Product**
- A contact form. A newsletter modal. A cookie banner. A chatbot. Comments. A "hire me" CTA. Social share buttons. A visitor counter.
- Google Analytics.
- A closed CMS.
- Any dependency that makes the content non-portable.

---

## 22. Open design decisions

Decisions that need the author's judgement, or a real user in front of the built thing. Each has a **default** so the build is never blocked.

| # | Decision | Options | Default (build this) |
|---|---|---|---|
| **OD-1** | **The wordmark superscript.** Does `STARKONIUM⁷` read as an editorial footnote or as an ionic charge? | (a) Revision numeral (b) Dagger `†` (c) No marker | **(a)**, with the `marker` prop making (b) and (c) a one-line change. Test on five people who don't know the site. If two or more say "chemistry", switch to (b). |
| **OD-2** | **Serif body text for articles.** The brief suggested sans for body. This spec overrides that, using Newsreader for long-form and Switzer for interface. | (a) Serif long-form (b) Sans everywhere | **(a)**. It is a magazine convention, it reads better at length, and it makes essays feel different from index pages — which is the point. But this is the author's site and the author has to read it. Build a `?font=sans` dev toggle and let them live with both for a week. |
| **OD-3** | **Two views on `/projects`.** Is the Index (table) view worth the code before there are 12 projects? | (a) Both (b) Notes only, add Index at 12 projects | **(b)** for v1, with the data structured so (a) is a small addition. Ship Notes. |
| **OD-4** | **Dusk mode.** | (a) Never (b) v2, as a full design pass | **(b)**, deferred. Do not build a token-inverted dark mode. |
| **OD-5** | **The homepage first-load reveal.** The one scroll-reveal permitted. | (a) Ship it (b) Cut it | **(b) — cut it.** Test the site without it for two weeks. If it feels dead, add it. It probably won't. |
| **OD-6** | **A Git-backed CMS** (Decap/Tina) for phone-based authoring. | (a) No CMS, Git + GitHub mobile (b) Add one if authoring hurts | **(a)**. Revisit only if the Ledger goes quiet for 8 weeks — that would be evidence of real friction, and the site's whole thesis depends on the author actually posting. |
| **OD-7** | **AI crawlers in `robots.txt`.** | (a) Allow (b) Block | **(a) allow**, consistent with a CC BY 4.0 licence and the goal of being read. A values call the author should make consciously, not by default. |
| **OD-8** | **Is `/reviews` a separate route, or a filter on `/writing`?** | (a) Separate (b) Filter only | **(a)**, per §5.3 — reviews have a different schema, layout and structured-data type. But if after six months there are only two reviews, collapse it into `/writing`. Don't build a wing for a room. |
| **OD-9** | **The `‸` glyph.** It is not present in every fallback font and it is not universally recognised. | (a) The character (b) An inline SVG | **(b) inline SVG**, drawn to match Fraunces, `aria-hidden`, so it renders identically everywhere and can carry the vermilion reliably. The character is the *idea*; the SVG is the implementation. |
| **OD-10** | **Reading-time on `note` and `short` kinds.** "1 min read" on a 180-word thought is slightly absurd. | (a) Show always (b) Hide below 3 min | **(b) hide below 3 minutes.** |

---

## 23. Acceptance criteria

The build is done when every box below can be checked. These are testable, and most should be automated in CI.

### Identity & visual

- [ ] The wordmark is typographic. There is no element tile, no square, no atom, anywhere in the repository, including the favicon.
- [ ] `grep -ri "border-radius" src/` returns only `border-radius: 0` and the status dot. No other radius exists.
- [ ] `grep -ri "box-shadow" src/` returns exactly one non-zero result (the search dialog).
- [ ] No file in `/public` or `/src` is a stock image, an icon set, or a gradient.
- [ ] Vermilion appears no more than four times on any single rendered viewport at 1440×900.
- [ ] The status stamp appears exactly once per project page and nowhere else.
- [ ] Every one of the five signature motifs (Ledger, shelfmark, caret, marginalia, stamp/revision stroke) is implemented and visible in the shipped content.

### Typography

- [ ] Four families, self-hosted, subset, total ≤ 180KB. No requests to `fonts.googleapis.com` or `fonts.gstatic.com`.
- [ ] Article body is 18–19px, line height 1.65, measure ≤ 680px at every breakpoint.
- [ ] No body text below 18px; no metadata text below 12px; no meaningful text in `--ink-300`.
- [ ] Font swap causes zero layout shift (measured: CLS 0.00 with a cold cache on 3G).
- [ ] Numerals in tables and the Ledger are tabular and align.

### Colour & accessibility

- [ ] Automated contrast check passes for every token pair in §11.2, run in CI.
- [ ] **`--vermilion` (`#E3510F`) appears nowhere as a text colour below 24px.** Enforced by a lint rule.
- [ ] Axe and Pa11y report **zero** violations on: home, a project page, an article, a review, `/experience`, `/writing`, `/search`, 404.
- [ ] Full keyboard traversal of every page, including the search dialog, the mobile menu, the filter sheet, sortable tables, and scrollable code blocks. No traps. Focus always visible.
- [ ] The site is fully usable and readable with JavaScript disabled: all projects visible, all writing visible, search falls back to `/search` via a real form, TOC renders statically, sidenotes appear at the foot of the article.
- [ ] `prefers-reduced-motion` removes all motion; every feature still works.
- [ ] Every image has meaningful `alt`. Every data figure has a long description.
- [ ] Reflows without horizontal scroll at 320px and at 400% zoom.
- [ ] Touch targets ≥ 44px with ≥ 8px spacing.

### Performance

- [ ] All budgets in §16.3 met, enforced by Lighthouse CI on every PR.
- [ ] **CLS = 0.00** on every page type.
- [ ] `/writing/[slug]` ships ≤ 2KB of JS. `/reviews/[slug]` the same.
- [ ] Search JS loads only after the dialog is opened.
- [ ] No page makes a third-party network request. Zero. (No fonts, no analytics, no embeds, no GitHub API.)

### Content system

- [ ] All nine schemas implemented in Zod; an invalid frontmatter field fails the build.
- [ ] An unknown topic slug fails the build.
- [ ] `draft: true` content is absent from the production build, sitemap, RSS, and search index.
- [ ] A new project update can be published in under 60 seconds, from a phone, and appears on the project page, the homepage Ledger, `/log`, and `/rss/log.xml` on the next build.
- [ ] `kind: paused` without a reason fails the build.
- [ ] Every project, article and review page produces a valid BibTeX citation.
- [ ] IDs (`PRJ-*`, `WRT-*`, `REV-*`, `EXP-*`) are unique and monotonic; a duplicate fails the build.

### Migration

- [ ] All 14 *Starkonium Times* posts are live at new URLs with their original publication dates.
- [ ] All 14 old Blogger URLs 301 to the correct new page. Zero 404s in a full crawl of the old sitemap.
- [ ] Zero references to `blogger.googleusercontent.com` remain anywhere in the build.
- [ ] Every migrated image has alt text.
- [ ] `/archive` exists, has its masthead, and has an author's note that a stranger would find worth reading.
- [ ] No archived post is greyed out, `noindex`ed, hidden, or labelled "legacy".

### SEO

- [ ] Every page has a unique title, description, canonical, and generated OG image.
- [ ] JSON-LD validates in the Rich Results Test for `Person`, `BlogPosting`, `Review` and `CreativeWork`.
- [ ] Three RSS feeds validate against the W3C feed validator.
- [ ] Sitemap validates; drafts excluded; `lastmod` correct.

### The honest test

- [ ] **At least one project page documents a failure in detail**, and it is not visually demoted.
- [ ] **The paper review names the paper's strongest contribution** before it names a weakness.
- [ ] **The Ledger's most recent entry is less than 30 days old on launch day.**
- [ ] A stranger can, in 90 seconds on the homepage, say what `{{AUTHOR}}` works on and find a repository.
- [ ] The author has posted an update from their phone, at least once, before launch. If that workflow is painful, the site will die, and it is better to find out in week one.

---

*End of specification. `rev. 1 — 2026-07-12`.*
