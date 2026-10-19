# Decisions Register, Risks & Owner Questions

> **V2 DEFINITIVE OWNER DECISIONS (2026-10-20):** D-11 RESOLVED: art direction is luxury cinematic editorial aligned to supplied black/burgundy/cream portrait-led portfolio reference. Old THE WORKING TREE, programming/coding/terminal/VS Code visual theme is explicitly CANCELED. Owner requires rich condensed/serif typography, outstanding animations/transitions and extraordinary smooth scrolling; **section-by-section implementation only**, starting header+hero, no full-site generation. Open questions remain Rafi portrait/media rights, exact hero headline and factual approvals. Any older contradictory direction below is superseded by this paragraph.

**Current status:** Pre-implementation. These decisions are intentionally explicit: AI coding assistants must not settle ambiguities by guessing.

## Confirmations needed before public launch

| ID | Priority | Subject | What is known | What to confirm / recommendation |
|---|---|---|---|---|
| D-01 | HIGH | Academic year | CV opening says 3rd-year; user later says 4th-year CSE | Prefer 4th year as current; verify just before publishing |
| D-02 | HIGH | Email spelling | CV image shows personal Gmail address | Confirm exact preferred public email, or use a dedicated professional one |
| D-03 | HIGH | Research metadata | User says one SPICSCON paper accepted/presented, two WIE papers submitted | Titles, complete authors, event details, latest decisions, official verification/DOI if available |
| D-04 | HIGH | Sharing manuscript links | Four Google Drive document URLs supplied in chat | May manuscripts/abstracts be public? Do not include unapproved Drive links in repo |
| D-05 | HIGH | Projects and clients | User refers to production implementations for Dhaka Ladies Club, Elite Convention Hall, and Sicko Soul | Confirm deployment status, individual contribution, contract/privacy restrictions, screenshot rights |
| D-06 | HIGH | CareerPath technology | CV lists Node.js; repo README documents Laravel 10 and MySQL 8 | Which stack is accurate for version to be showcased? Link exact branch/commit |
| D-07 | HIGH | Elite distinctiveness | Elite README still contains DLC paths/DB naming | Confirm independent customer system vs rebranding/shared codebase, describe honestly |
| D-08 | HIGH | GoliTransit results | CV says hackathon champion; repo README describes dummy traffic labels and dev graph | Confirm team roles, award proof, model evaluation, datasets and demo fidelity |
| D-09 | HIGH | AUSTRC app release | CV says app-store deployment / sole developer; repo does not provide verified store URLs | Platform/store links, ownership split, whether all claimed features are live |
| D-10 | HIGH | Current organizations | CV describes DataPulse and Boraq since Jun 2026; AUSTRC Director since Jul 2026 | Confirm latest dates, titles, what association may be disclosed publicly |
| D-11 | MEDIUM | Final art direction | New luxury-editorial black/burgundy/cream art direction selected; final individual hero composition awaits signoff | Review two hero options, type/font and palette before full build |
| D-12 | MEDIUM | Technology | Astro + React islands recommended for static portfolio | Confirm deploy target and comfort with Astro; Vite React SPA is acceptable alternative if required |
| D-13 | MEDIUM | Featured work order | Operational work + GoliTransit + club app suggested | Identify top 3 projects that best reflect target career opportunities |
| D-14 | MEDIUM | Resume PDF | CV supplied as screenshots in chat | Obtain updated, approved resume PDF before public download |
| D-15 | MEDIUM | Personal imagery | No verified portrait/brand image supplied | Supply optional high-quality portrait; site must be excellent without it |
| D-16 | MEDIUM | Career positioning | Professional full stack/mobile/ML/research breadth | Choose leading specialization/ideal roles: full-stack, backend/platform, mobile, applied ML, or general software engineering |
| D-17 | LOW | CGPA and school history | CV snapshot states 3.41/4.00, past school GPAs | Whether to publish at all; recommend About/resume only |
| D-18 | LOW | Phone | Phone in CV image | Recommend omit publicly unless strong reason and explicit approval |
| D-19 | LOW | Research collaborator | User names Dibyo Fabian Dofadar and faculty role | Confirm preferred credit wording and updated role before publication |

## Confirmed design constraints from user

- Static portfolio; **no custom backend**.
- Distinctive, unusually polished, **software-engineering/coding/terminal-inspired** visual identity.
- Not a conventional purple-white gradient/glassmorphic AI-vibe template.
- Extremely fluid, purposeful scrolling and unique interactive chapters.
- Must represent working as a junior engineer and remotely with a startup, alongside fourth-year CSE education.
- Documentation-first; actual source implementation comes later.

These constraints should not be diluted by a coding-agent convenience decision.

## Major architecture decisions (proposed, awaiting implementation)

- **ADR-001:** Astro static pre-rendering, `.astro` for editorial pages, React islands only for stateful experiences.
- **ADR-002:** Project/research records as local typed content (Astro collections / TypeScript), not GitHub API calls at runtime.
- **ADR-003:** Native document scrolling by default; GSAP only for justified effects; Lenis after device testing, never required.
- **ADR-004:** Site-wide visual design in `DESIGN.md`; motion in `MOTION.md`; no ad-hoc component styles outside those constraints.
- **ADR-005:** Public research ledger makes accepted/presented vs submitted vs proposal vs ongoing explicit.
- **ADR-006:** Client-safe diagrams and local state simulations, no live booking/health/ML APIs, no private system endpoints in the portfolio.

## Known source-quality caveats

1. GitHub repository READMEs describe intended behavior and implementation, but do not independently prove deployment, enterprise use, adoption or external results.
2. `Portfolio-Website-2.0` README appears to reference another portfolio author and a custom license/trial plugins; **do not copy it or its assets** when building the unique portfolio. Perform independent design work.
3. The GoliTransit repo uses dummy/synthetic traffic inputs in documentation—avoid implying an operational live traffic data feed.
4. SafePath BD repo distinguishes synthetic traffic/transit from measured city-wide datasets, and lists production data work still incomplete.
5. CareerPath CV/README backend claims conflict; Elite README contains apparent inherited DLC strings.
6. Paper documents were not read from Drive in this session; do not reconstruct findings, titles or authors from guesses.

## Decisions to record during build

For each design/architecture change capture: date, original proposal, alternatives, tradeoff, decision maker, impact on docs and any evidence needed. Don't create an elaborate ADR hierarchy until real changes justify it.

## Suggested response request to owner (once ready)

> Please confirm your preferred public email and job headline, which client projects can be named and shown, whether the robotics app has public store links, and the full titles/status proofs of the three conference papers. The rest of the portfolio can be designed around the information already supplied.
