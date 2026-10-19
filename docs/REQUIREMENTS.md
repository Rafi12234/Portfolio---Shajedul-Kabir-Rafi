# Product Requirements & Acceptance Criteria

**Product:** Shajedul Kabir Rafi static engineering portfolio · **Version:** 0.1 · **Status:** Proposed baseline

## Goals (prioritized)

P0 — communicate professional credibility, produce distinctive original art direction, present verified engineering evidence, remain static and usable on all devices.

P1 — interactive signature case studies, polished native-feeling motion, excellent accessibility, robust SEO, easy content maintenance.

P2 — themed command palette, optional filtered work index and optional locally simulated system visualizations.

## Non-goals

No custom backend, login, private dashboard, CMS service, live contact-processing API, visitor tracking without explicit policy, dynamic GitHub contribution stats, server-rendered user-specific state, interactive feature requiring secret tokens, fabricated realtime infrastructure telemetry or 3D/WebGL as a launch dependency.

## Information architecture

| Route / chapter | Required content | Priority |
|---|---|---|
| `/` | Hero, thesis, selected work, current roles, engineering approach, research preview, leadership proof, contact | P0 |
| `/work/` | Curated case studies, tags, classification by type | P1 |
| `/work/[slug]/` | Problem, role, constraints, decisions, architecture, implementation, honest status, screenshots, learnings, source/demo as approved | P0 for 3 cases |
| `/research/` | Research ledger, status distinctions, approved titles/citation links, collaborators | P1 |
| `/about/` | Longer profile, experience, AUSTRC progression, education, awards | P1 |
| `/404` | Useful return paths, no gimmicky trap | P1 |

A single-page initial launch plus 3 case-study routes is acceptable if content completeness warrants staging extra routes. All important navigation must work without opening command palette.

## Functional requirements

- R-001: Generate static HTML and assets at build time; no app-owned runtime backend. **Test:** inspect built output/deployment architecture.
- R-002: Responsive layout at 360, 390, 768, 1024, 1440 and 1920 widths. **Test:** no clipped copy or horizontal scroll.
- R-003: Every key section has semantic heading, meaningful content and unique but coherent composition.
- R-004: Project listing uses typed local metadata and human-authored summaries; no dependency on live GitHub API.
- R-005: Case-study page provides explicit **individual contribution**, team context, caveats and public/private visibility labels.
- R-006: Research page makes statuses distinguishable; no implied IEEE indexing without DOI/proceedings proof.
- R-007: Command palette (if built) supports keyboard launch, escape, focus trap/return, labeled options, mouse/touch equivalent and fuzzy matching within fixed command registry. No shell access.
- R-008: Demonstrators are client-side and use approved or clearly illustrative sample data only.
- R-009: A visitor can reach email or LinkedIn/GitHub links in one or two interactions from every major route.
- R-010: Static contact route is `mailto:` or approved third-party service. Do not fake “message sent”.
- R-011: CV download exists only after user supplies updated and approved PDF.
- R-012: Images include descriptive alternatives or are explicitly decorative; interactions have semantic labels.
- R-013: Route metadata, OG cards, canonical URL, robots policy, sitemap and structured data from verified facts.
- R-014: Default scrolling remains usable without JS; if Lenis is used, it must be optional and fully tested.
- R-015: No unlicensed third-party assets or proprietary screenshots committed by default.
- R-016: All visual effects degrade gracefully with `prefers-reduced-motion` and low-performance environments.

## Core story requirements

- Lead with two real current roles; fourth-year status is a supporting detail, not the primary headline.
- Include substantial production-oriented case studies rather than defaulting to academic exercises.
- Promote GoliTransit's hackathon recognition without misrepresenting model evaluation or deployed scale.
- Include published-status distinctions for all research items and identify unanswered metadata.
- Present AUSTRC solo mobile-app ownership and leadership progression accurately.
- Represent personal, team, open-source, client and internal projects distinctly.
- Avoid vague metrics, fake testimonials, misleading badges or claiming every public repo is a deployed product.

## Content acceptance gates

- G-001: Every prominent fact classified as directly user-stated, CV-supported, repository-supported, externally confirmed or pending owner approval.
- G-002: Every linked project URL loads and matches the claim; no link to an unapproved admin portal.
- G-003: Every research item has an appropriate status, title/author/citation only if available/confirmed, link policy and last-reviewed date.
- G-004: Project screenshots and logos have usage approval and redacted customer information.
- G-005: No stale student-year or research status in public hero.

## Non-functional targets

- Google Core Web Vitals at p75 when real-user data becomes available: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1.
- Lighthouse lab targets on representative pages: performance ≥90, accessibility ≥95, best practices ≥95, SEO ≥95 where practicable; not launch facts to advertise.
- Semantic keyboard support for all interactive elements; AA contrast for normal text ≥4.5:1 and large text ≥3:1.
- Honor system reduced-motion. Baseline text readable and navigation functional before hydration.
- No unintended scroll locking, sticky overlaps, excessive animation on touch devices, or gratuitous heavy JavaScript.

## Release definition of done

No broken routes/links, no factual placeholders published, three evidenced case studies or deliberately reduced scope, quality tests documented, mobile checked, source approvals captured, all primary links validated, sitemap and structured data verified, JS-disabled fallbacks adequate, no privacy leakage.
