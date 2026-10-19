# Quality Gates — Accessibility, Performance, SEO & Release

> **V2 VISUAL/PROCESS QUALITY OVERRIDE:** In addition to tests below, each section must pass art-direction review against owner's black/burgundy/cream editorial reference, large condensed typography, real portrait or designed fallback, polished motion and distinct compositions. Explicit OWNER APPROVAL PER SECTION required; no unreviewed whole-site generation. Coding/terminal/VS Code styling rejected.

**Principle:** The portfolio represents software engineering. Its reliability, usability and speed are part of the work sample. Fancy motion cannot excuse fragile semantics, privacy failures or broken routes.

## 1. Accessibility acceptance

- Proper `header`, `nav`, `main`, `section`, `article`, `footer` semantics; exactly one useful `h1` per page; meaningful heading structure.
- All interactive elements real `button`/`a`/form controls, with accessible names and visible focus. No `onClick` on unlabeled `div`.
- Keyboard navigation for all core content and signature experiences; home/end/arrow patterns only where appropriate; escape closes modal/command UI and returns focus to its trigger.
- Visually distinct focus indicator on both light and dark themes. Never suppress outline without an equivalent.
- Aim for WCAG 2.2 AA: 4.5:1 normal text, 3:1 large text; non-text component contrast and focus visibility checked. Responsive content works at 200% zoom and narrow 320–360px screens.
- Every diagram includes textual alternative or adjacent summary explaining nodes and state transitions.
- For dynamic sample simulations, use `aria-live="polite"` only for meaningful changes, not every animation frame; ensure controls announce selected options/states.
- Ensure reduced motion disables parallax, scroll inertia, scrubbed transforms, text splitting and staged entrance waits; content visible immediately.
- Touch targets comfortably sized (aim ≥44px), no hover-only content, mobile dialogs fully operable.

## 2. Performance budgets and observation

**User-experience targets, not guaranteed current scores:** at field 75th percentile LCP ≤2.5 seconds, INP ≤200ms, CLS ≤0.1 when sufficient real-user data exists. Lighthouse mobile targets: performance ≥90, accessibility ≥95, best practices ≥95, SEO ≥95 where realistic, with recorded device/throttle context.

- Keep route content static HTML; no whole-page React hydration.
- Avoid render-blocking external web fonts; prioritize stable local fonts with sensible fallback metrics.
- Hero image (if any) sizes optimized and prioritized; other large images lazy-loaded.
- Interactions load only on routes that need them; defer large visualization chunks until discovery/intent.
- Reserve image/media dimensions to prevent layout shifts.
- Prefer vector and static explanation over large animation libraries; don't add both a physics/canvas framework and GSAP unless benchmarked and justified.
- Measure JavaScript bundles and long tasks after every major feature. Set route-specific budgets during implementation based on real baseline data rather than inventing a numeric limit now.
- Animation performance: no persistent frame loops when offscreen, no per-frame DOM reconstruction, no repeated layout thrashing.

## 3. Smooth-scrolling acceptance

- Native scroll wheel/touch/keyboard behavior remains fast and predictable.
- No scroll hijack, artificial 100vh lock, giant sticky/pinning sections or forced scroll snapping across primary navigation.
- `prefers-reduced-motion` = no custom inertial scroll/scroll-linked kinetic effects.
- Deep-link anchors work below sticky nav; browser back/forward retains useful position.
- Validate on Chrome desktop/mobile, Safari iOS/macOS, Firefox desktop and budget Android when possible. Trackpads and coarse-pointer inputs behave naturally.
- Scroll-linked animations must not block content if JS fails or observers initialize late.

## 4. Static, SEO & content validation

- Confirm exported `dist/` contains fully rendered HTML and static files; no runtime Node server requirement.
- `astro.config` site base/canonical configured; sitemap contains only actual public routes; robots.txt correct for production vs previews.
- Unique title/meta description and social OG card per route; images legally owned/approved.
- Semantic Article/Person/CreativeWork schema only when fields are genuine; **no invented employer structured data, publication DOI or rating schema**.
- Canonical tags, no duplicate slugs, no broken hash links, 404 page, readable routes.
- Search and screen-reader users can find all substantive project/research content without running client JavaScript.
- Each research status reviewed at launch; no unverified “published IEEE paper” label.
- No client-sensitive data/assets/links, source maps exposing secrets, or unapproved docs. `mailto:` should not promise delivery confirmation.

## 5. Responsive/adaptive matrix

| Viewport/device | Critical test |
|---|---|
| 320–390px phone | No clip/overflow; hero still meaningful; one-handed nav; legible labels |
| 768px tablet | Grids collapse logically; diagrams remain usable |
| 1024–1440px laptop | Typographic hierarchy, sticky rails, hover/focus consistency |
| 1920px/wide | Intentional whitespace, not overstretched paragraphs |
| Coarse touch | All content available without hover; no expensive pseudo-cursor |
| Keyboard only | Primary links, command palette, demos, back navigation |
| Reduced-motion OS setting | No parallax, scrubbing or delayed reveal; demos usable instantly |
| JS disabled/slow | Core story, projects, research and contact available |
| Dark/high-contrast modes | Legible focus states, diagrams and code status labels |

## 6. Suggested tooling (when implementation exists)

- `npm run check` / Astro type checking, TypeScript strict mode.
- ESLint + Prettier (or one consistent formatter) for linting.
- Playwright for route/link/navigation/keyboard/reduced-motion e2e tests.
- axe-core and manual keyboard/screen-reader audit; automate obvious violations but don't treat passes as total compliance.
- Lighthouse CI/DevTools for lab metrics; actual hardware observation for perceived smoothness.
- `npm run build` must pass on a clean install; package lock committed.
- Optionally check links with a build-time crawler; prevent link verification from relying on third-party server at runtime.

## 7. High-value end-to-end acceptance cases

1. Direct-load `/work/golitransit/` on a static host; full text visible before React hydration.
2. Open command palette by Ctrl/Cmd+K, search GoliTransit, navigate, escape/return focus after closing.
3. Walk booking demo through hold → pending → approved, then reject/reset; inspect text/assistive feedback and ensure no real booking action.
4. Route anomaly toggle changes graphic *and* textual explanation; sample data clearly declared.
5. Keyboard-only navigation reaches all case studies, back links and contact.
6. Emulate reduced motion and verify no blank delayed content.
7. Block JS and verify identity, core copy, experience, research statuses and links remain readable.
8. Run accessibility contrast/zoom/mobile checks in every distinct light/dark chapter.
9. Validate no unauthorized paper/manuscript links, customer data or brand assets in `dist/`.
10. Verify internal/external link redirects, status, target and accessibility labeling.

## 8. Definition of done per feature

A feature is **done** only if content is approved, semantics correct, interactions functional, motion fallback in place, mobile layout reviewed, loading budget reasonable, tests run, and owning documentation updated.

## 9. Launch checklist

- [ ] Owner approved visual system and current profile details.
- [ ] Featured project personal contributions clarified, accurate and safe to disclose.
- [ ] Three flagship case studies have genuine decisions/constraints and sanitized assets.
- [ ] Research metadata and status text verified as of launch.
- [ ] Updated CV PDF obtained or CV link intentionally omitted.
- [ ] No placeholder titles, fake data or bogus statistics visible as real facts.
- [ ] All routes and canonical/meta/sitemap/OG tested on built site.
- [ ] Mobile/keyboard/reduced-motion/JS-disabled flows tested.
- [ ] Build static and deploy preview verified.
- [ ] Legal/license/permission review passed; no private customer or research materials in public output.
