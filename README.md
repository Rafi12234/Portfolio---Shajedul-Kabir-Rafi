# Shajedul Kabir Rafi — Engineering Portfolio

**Status:** Pre-development specification · **Updated:** 2026-10-19 · **Website type:** Fully static

> A meticulously designed, fast, accessible engineering portfolio rooted in real shipped systems, research, and technical leadership. Not a terminal-themed template.

This ZIP contains **documentation only**. It intentionally contains no generated application source, copied project code, screenshots, proprietary assets, manuscript PDFs, credentials, or inferred performance figures.

## Start here

1. Read [`docs/BRIEF.md`](docs/BRIEF.md) for the creative direction and factual positioning.
2. Review [`docs/DECISIONS.md`](docs/DECISIONS.md) and settle the unresolved facts/content approvals.
3. Read [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md) for non-negotiable functionality and acceptance criteria.
4. Lock [`docs/DESIGN.md`](docs/DESIGN.md) and [`docs/MOTION.md`](docs/MOTION.md) before implementing elaborate UI.
5. Develop using [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), [`docs/INTERACTIONS.md`](docs/INTERACTIONS.md), and [`docs/IMPLEMENTATION.md`](docs/IMPLEMENTATION.md).
6. Populate content from [`docs/CONTENT.md`](docs/CONTENT.md), [`docs/PROJECTS.md`](docs/PROJECTS.md), and [`docs/RESEARCH.md`](docs/RESEARCH.md).
7. Use [`docs/QUALITY.md`](docs/QUALITY.md), [`docs/ASSETS.md`](docs/ASSETS.md), and [`docs/SOURCES.md`](docs/SOURCES.md) for launch verification.

## Documentation ownership

| File | Source of truth for |
|---|---|
| `AGENTS.md` | Agent behavior, safety, project workflow |
| `docs/BRIEF.md` | Creative thesis, differentiation, target audience |
| `docs/REQUIREMENTS.md` | Scope, experience requirements, success criteria |
| `docs/DESIGN.md` | Art direction, type, layout, color, components |
| `docs/MOTION.md` | Scrolling, animation, interaction timing |
| `docs/INTERACTIONS.md` | Signature experiences and functional specs |
| `docs/ARCHITECTURE.md` | Static framework, structure, data contracts |
| `docs/CONTENT.md` | Verified-profile draft and writing standards |
| `docs/PROJECTS.md` | Case-study inventory, priorities, evidence gaps |
| `docs/RESEARCH.md` | Research statuses and publication policy |
| `docs/QUALITY.md` | Accessibility, performance, SEO and QA |
| `docs/ASSETS.md` | Required images, rights, data, permissions |
| `docs/IMPLEMENTATION.md` | Milestones, dependencies, acceptance gates |
| `docs/SOURCES.md` | Claim-to-source traceability and caveats |
| `docs/DECISIONS.md` | Known mismatches, pending decisions, change log |

## Initial site thesis

**Public-facing idea:** “Software engineer building systems for real-world operations, and exploring intelligent systems through applied research.”

**Creative direction:** **THE WORKING TREE** — an editorial engineering field notebook with the typographic rigor of a source-control interface and the depth of a real case-study archive. This is a concept proposal, *not an irrevocable visual decision*.

**What this is not:** a fullscreen fake terminal, purple/neon gradients, stock illustrations, a grid of sixty GitHub repos, a 3D animation showcase with no engineering evidence, or an AI-generated buzzword résumé.

## Recommended framework, subject to final approval

- Astro + TypeScript for prerendered content and routing.
- React islands for genuine interaction only.
- Custom CSS design tokens; Tailwind only if useful, not as a visual identity.
- GSAP ScrollTrigger only where native CSS cannot accomplish the intended timeline; Lenis optional after device testing.
- Markdown/MDX-style project content; use Astro Content Collections for validated data.
- Zero custom backend, database, authentication, server actions, or runtime API requirements.

## Privacy and permissions

Do **not** publish phone numbers, unpublished paper manuscripts, client records, company-sensitive code/architecture, credentials, unapproved screenshots, or private analytics. The user supplied Google Drive manuscript links in conversation; they are **deliberately omitted** from repository documentation until public-sharing approval. A research manuscript link is not the same as a verified published-paper DOI.

## Documentation status

This pack consolidates the supplied CV images, user-provided research statements, and a review of accessible GitHub repository names, metadata, and key READMEs on 2026-10-19. It is an **implementation-ready planning baseline**, not a claim that every personal, publication, deployment, or contribution detail was independently checked.
