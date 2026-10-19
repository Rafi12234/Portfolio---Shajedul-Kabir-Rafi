# AI / Coding Agent Contract

You are working on **Shajedul Kabir Rafi's static engineering portfolio**. Your job is not to maximize visual effects or generate generic sections. Build an original, precise, accessible, truthful experience that foregrounds software engineering evidence.

## Read order and authority

1. `docs/DECISIONS.md` — unresolved facts and approvals; never fill unknowns by guessing.
2. `docs/REQUIREMENTS.md` — product requirements and definition of done.
3. `docs/CONTENT.md`, `docs/PROJECTS.md`, `docs/RESEARCH.md` — claims and their publication states.
4. `docs/DESIGN.md` and `docs/MOTION.md` — visual and motion contracts.
5. `docs/ARCHITECTURE.md` and `docs/INTERACTIONS.md` — implementation boundaries.
6. `docs/QUALITY.md` and `docs/IMPLEMENTATION.md` — quality gates and roadmap.

If specifications conflict, **pause the conflicting change**, record it in `docs/DECISIONS.md`, and ask for a decision. Do not silently reinterpret requirements.

## Non-negotiables

- **Static site only**: prerender all content, no custom backend, DB, auth, or secrets in client bundles.
- **No AI-template visual language**: do not add purple gradients, generic bento card layouts, oversized decorative glow, fake code rain, meaningless scanlines, generic tech-logo walls, or random cursor gimmicks.
- **No plagiarism**: do not reuse code, assets, paid animation plugins, branded layouts, licensed fonts or another portfolio's exact design without appropriate rights.
- **No fabricated evidence**: do not invent users, metrics, citations, paper titles, deployed URLs, growth stats, contributor ownership, architecture diagrams presented as actual, GitHub activity counts, or employer endorsements.
- **Nuance matters**: *submitted* research is not *accepted*; *accepted/presented* is not necessarily *indexed/published*; a README's “production-ready” statement is not verified production usage.
- **Protect information**: omit phone number, private manuscript Drive links, credentials, customer data, private architecture details and client assets unless explicitly approved.
- **Accessibility**: all controls keyboard-operable; focus visible; reduced-motion behavior; semantic markup and contrast.
- **Performance**: avoid large main-thread work, unnecessary hydration, preloaders, scroll hijacking, or WebGL as a baseline dependency.

## Workflow for every feature

1. Identify the exact requirement, narrative purpose, and owning spec file.
2. State whether the feature is static, CSS-enhanced or React-hydrated.
3. Implement smallest working vertical slice, mobile first where feasible.
4. Verify with keyboard, touch, reduced motion, a low-powered device assumption and production build.
5. Update source content/contracts and acceptance checklist when implementation changes.
6. Do not mark a milestone complete from screenshots alone; interactions must work.

## Architecture discipline

- Page/layout content in `.astro`; stateful simulations in contained React islands.
- No generic `components/Everything.tsx`; group by role (`layout/`, `ui/`, `sections/`, `interactive/`).
- Centralize design tokens and motion constants; do not scatter magic numbers.
- Semantic HTML first. Links navigate, buttons act. No inaccessible div click handlers.
- Don't import GSAP/React into purely static components without demonstrated need.
- GSAP setup must be scoped and cleaned up (`gsap.context`/revert, listeners removed, React lifecycle handled).
- Never `eval` or execute user-supplied strings in command palette; match an allowlist.
- No dependency added without a written reason and bundle cost review.

## Visual review rubric

For each section ask: (1) What does the visitor learn? (2) Why does this composition exist? (3) Is the interaction specific to Rafi's work? (4) Would this still look intentional with animation off? (5) Would this be confused with a template? (6) Does it remain navigable on 360px screens?

## Safe copy rules

- Title: “Software Engineer” / “Junior Software Engineer” as supported; do not elevate to senior engineer.
- Current fourth-year academic standing is user-provided; the older CV introduction says third-year — see `docs/DECISIONS.md`.
- Research entries are tagged `accepted-and-presented`, `submitted`, `proposal-submitted`, or `ongoing`, never given a different status automatically.
- The CareerPath CV and repository READMEs disagree on the backend stack; get confirmation before displaying definitive backend tech.
- Case study ownership must reflect individual/team contribution accurately.

## Do not implement yet

Do not auto-generate all final pages or claim a finished website solely from these specs. Await real project screenshots, updated paper metadata, approved client disclosures, and design selection where called out. Build in the phased order of `docs/IMPLEMENTATION.md`.
