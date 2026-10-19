# Implementation Plan & Milestone Gates

**Current phase:** Planning/documentation. **Deliverable of this ZIP:** Markdown specifications only. Do **not** mistake this file for an implemented site.

## Working agreement

Implement in controlled vertical slices. Never generate the entire website as one megacomponent or an undifferentiated AI template. Each milestone should leave behind an accessible, working and reviewed state. Prefer one exceptional interaction to five fragile prototypes.

## Milestone 0 — Confirm profile, permissions & creative direction

**Inputs:** `CONTENT.md`, `PROJECTS.md`, `RESEARCH.md`, `DECISIONS.md`.

- Confirm the correct academic status, official contact email, current jobs and preferred hero descriptor.
- Choose 3 lead case studies and clarify precise Rafi/team/client contribution.
- Request screenshots, logo permissions, demo/stores and publication metadata.
- Produce two genuinely different homepage art direction sketches, then select one coherent style. **Do not treat current palette as final until chosen.**

**Gate:** user approves core factual inventory, disclosure rules, visual direction and initial case-study priorities.

## Milestone 1 — Scaffold, architecture and visual tokens

**Inputs:** `ARCHITECTURE.md`, `DESIGN.md`, `MOTION.md`, `AGENTS.md`.

- Initialize Astro + TypeScript static output, add React integration only for planned islands.
- Define `src/styles/tokens.css`, typography, layout/grid helpers, component variants and responsive rules.
- Set up global layout, metadata/OG rules, page shell, meaningful keyboard navigation and stylesheet loading.
- Populate typed local profile/experience/project/research content without relying on public runtime APIs.
- Ensure one simple, beautiful working hero and footer display correctly with JS disabled.

**Gate:** built static route, good mobile hero, no unnecessary JS, visual tokens defined and reviewed.

## Milestone 2 — Core editorial experience

**Inputs:** `CONTENT.md`, `PROJECTS.md`, `RESEARCH.md`.

- Build sections: hero, selected work, currently working, engineering approach, research preview, leadership, contact.
- Add case-study index `/work/`, dynamic static `/work/[slug]/` pages, About and Research as approved.
- Create tailored **project plate** components for different artifact types: venue state flow, map/routing, mobile devices, brand site.
- Add credible copy, clear contribution labels and approved assets; no fake data.
- Add links, responsive design, semantic content and no-JS fallbacks.

**Gate:** all core pages function as a high-quality editorial site **without any advanced scroll animations**.

## Milestone 3 — Signature experience #1: Booking Lifecycle

**Inputs:** `INTERACTIONS.md`, Dhaka Ladies Club case study details.

- Use local finite-state simulation with fictional date/slot/customer.
- Display roles, transition rules, ambiguous statuses/guards and reset control.
- Implement responsive visual timeline + readable text fallback.
- Add keyboard, touch and screen reader status. State must not send network requests.

**Gate:** every transition functional, honest sample-labels visible, accessible keyboard/reset, no leak of internal APIs.

## Milestone 4 — Signature experience #2: Routing Under Pressure

**Inputs:** `INTERACTIONS.md`, GoliTransit case study technical proof.

- Use finite local illustrative graph or approved exported real static graph sample.
- Three meaningful controls max initially: mode, anomaly on/off, route preference.
- Update route visibility and **plain-language explanation** instantly.
- If supporting data isn't verified, all numbers must be labeled illustration, not model output.
- Separate animation logic from deterministic route selection/illustration state.

**Gate:** state/labels remain accurate, works on mobile, no heavy persistent canvas/WebGL loop, reduced-motion functional.

## Milestone 5 — Final interaction and motion polish

**Inputs:** `DESIGN.md`, `MOTION.md`, `QUALITY.md`.

- Add limited hero entrance, section/chapter line reveals and precision transitions only where they improve comprehension.
- Create optional Command Index (`⌘K` / `Ctrl+K`) to navigate routes/content; no fake command execution.
- Evaluate whether smooth-scroll integration improves or degrades wheel/trackpad/touch accessibility. Native scroll remains the default if in doubt.
- Pair motion implementations with reduced-motion branches and GSAP cleanup.

**Gate:** high perceived smoothness on modest devices; no animation-induced layout shifts or scroll trapping.

## Milestone 6 — Launch QA and deployment

**Inputs:** `QUALITY.md`, `ASSETS.md`, `DECISIONS.md`.

- Complete privacy/brand/rights checks, link validation and bibliography status audit.
- Run clean production build, static host preview, keyboard/e2e/accessibility test suite and Lighthouse.
- Validate SEO/OG/canonical/sitemap/robots, direct-load/deep-link routes, 404 and JS-disabled behavior.
- Tune page assets, font loading and illustration payload; avoid performance theater.
- Deploy to a static host with no runtime server, then do a mobile smoke test.

**Gate:** every checklist item in `QUALITY.md` has a recorded result; unresolved factual items are hidden or explicitly marked, not silently published.

## Dependency decisions

| Proposed | Stage | Why / veto |
|---|---|---|
| Astro | M1 | Static route/build foundation; veto if owner selects alternative |
| React | M3 | Interactive islands only; do not hydrate all page sections |
| GSAP ScrollTrigger | M5 | Add after baseline; scope, cleanup, benchmark |
| Lenis | M5 optional | Only if proven to improve feel without input latency/accessibility compromise |
| Shiki | M2 optional | For meaningful real excerpts, preferably build-time |
| Canvas/WebGL | Never baseline | Must show unique value and secure performance budget/fallback |
| API/contact form service | Outside MVP | Static site shouldn't fake server functions; mailto is sufficient |

## Content readiness matrix

| Work item | Current readiness | Blocking items |
|---|---|---|
| Intro/about | High | Confirm final positioning, public contact |
| Professional roles | Medium–high | Clarify allowed names/contributions |
| AUSTRC timeline | High | Optional logos/role proof |
| GoliTransit case study | Medium–high | Team split, real demo/evaluation, safe imagery |
| Dhaka Ladies Club case study | Medium | Role, deployment/payment caveats, client permission |
| AUSTRC mobile case study | Medium | Store URLs/approved screens |
| Sicko Soul case study | Medium | Client permission/screens and true delivery contribution |
| Research ledger | Medium | Manuscript titles/author lists, updated statuses and public citations |
| Deployable finished code | Not started | Milestones 0–6 |

## Suggested first implementation task for a coding agent

> Read the entire documentation pack in its specified order. Summarize factual blockers and design constraints; do not invent missing data. Then scaffold only the Astro static architecture, typed profile content, CSS design tokens, accessible shell, responsive navigation and a non-animated hero. Build and verify before starting signature interactions.

## Change discipline

Design changes should update `DESIGN.md`. Animation decisions update `MOTION.md`. New feature flows update `INTERACTIONS.md`. Content corrections update `CONTENT.md`, `PROJECTS.md` or `RESEARCH.md`. Conflicts/new approvals update `DECISIONS.md`. Avoid a situation where site code becomes the only source of truth without documentation.
