# Signature Interaction Blueprints

**Rule:** An interaction earns its place by explaining genuine engineering decisions or helping visitors navigate. Treat these as scoped prototypes, not compulsory gimmicks.

## Priority order

| Interaction | Rank | Reason | Static fallback |
|---|---|---|---|
| The Booking Lifecycle | Signature 1 | Demonstrates operational/state-machine engineering | State diagram + annotated screenshots |
| Routing Under Pressure | Signature 2 | Demonstrates multimodal graph/ML architecture | Storyboard with explanation |
| Command Index (`⌘K` / `Ctrl+K`) | Utility | Practical developer-flavored navigation | Full normal navigation |
| Engineering Diff | Optional P1 | Surfaces before/after decisions with evidence | Side-by-side notes |
| Research Status Ledger | P0 content, light interaction | Clear academic credibility | Accessible labeled list |
| Leadership Branch | Optional P2 | Shows AUSTRC progression | Semantic timeline |

## 1. Booking Lifecycle — state-machine explainer

**Candidate sources:** Dhaka Ladies Club and Elite Convention Hall repositories. **Permission:** Must confirm approved client-specific details before public visuals.

**Narrative:** Venue bookings aren't just a form; availability, temporary holds, payment processing and admin approval must coordinate. Show these dependencies in an elegant horizontal/vertical state lane.

**Candidate illustrative states:** `available → held → pending payment → pending approval → confirmed`, with branches to `expired`, `rejected` or `released` only where consistent with validated implementation. Do **not** assert this is the exact complete production state machine until checked.

**Controls:** Select date, simulate hold, advance simulated payment step, approve/reject, reset. All actions happen locally, with preloaded illustrative fixture data and transparent “interactive reconstruction; no booking or payment is processed” disclaimer.

**Screen regions:** minimal calendar, state trace, status detail, explanation panel. Responsive: reorder into a one-column sequence, preserve all controls.

**Tests:** no invalid state transitions, accessible controls/status changes, back/reset work, no personal booking information, no external API calls, no fake live payment.

## 2. Routing Under Pressure — explainable mobility

**Evidence:** GoliTransit repo describes OSM data, mode-restricted graph, multimodal Dijkstra, dynamic anomaly reweighting, asynchronous traffic-risk service. Repo also describes demo/dummy traffic labels; do not imply independently validated live metropolitan traffic predictions.

**Experience:** An original vector graph (not a generic live Google Maps iframe) displays a small stylized city grid. A visitor chooses modes (walk/rickshaw/car, if modeled), toggles a road closure or congestion event, and sees **illustrative** route choices update with readable explanations of edge restrictions and costs.

**Implementation choice:** Pure, deterministic client-side demo on a fixed topology; not the production model, not calls to a FastAPI service. Label example weights/metrics as **sample visualization data**, with a link to real GitHub case study.

**Panels:** (1) scenario, (2) graph illustration, (3) active constraints, (4) resulting path and “why this route” explanation. Color is never sole indicator; use solid/dashed shapes and labels.

**Accessibility:** Each scenario is keyboard-operable. Below the diagram, announce route outcome in text; meaningful SVG accessible label/description. Reduced motion changes route immediately.

## 3. Command Index — practical utility

**Trigger:** header control plus `⌘K` on macOS or `Ctrl+K` elsewhere (never override editable fields). Escape closes. Trap focus appropriately and restore it to opener.

**Allowlisted commands:** `home`, `work`, `research`, `about`, `experience`, `contact`, `github`, `resume` (only if approved), `help`. Command palette navigates *existing accessible routes/anchors*; it does not execute shell commands, eval JavaScript or query private services.

**Design:** Compact indexed panel with keyboard hints, result titles and descriptions, matching the site's editorial typography. No ASCII-art intro, fake compilation logs or broken easter eggs.

**Test:** mouse/touch/keyboard parity; Escape behavior; focus and screen reader labels; empty results; duplicate key combinations; mobile CTA discoverability.

## 4. Engineering Diff — evidence-led case studies

For each featured project, prepare 2–3 annotated decisions:

```text
Problem / constraint
     ↓
Alternative approaches considered
     ↓
Chosen implementation
     ↓
Consequences and tradeoffs
     ↓
Outcome (only verified facts, otherwise clearly qualitative)
```

Examples to investigate (not claims of implemented optimization): contention/booking-hold race conditions, routing calculation vs asynchronous ML latency, Flutter single-codebase maintenance, admin operations and permission boundaries.

Never create fake diff screenshots, fabricated Git history or invented quantitative improvements. Real diagrams may be **reconstructed from evidence**, visibly marked as such.

## 5. Research ledger

Primary state is exact publication stage, **not** a generic progress bar. Each item supports title, authors, venue, year, status, optional DOI/proceedings URL, optional abstract, optional collaboration note and last-verification date. Missing titles remain “Title pending owner confirmation” in internal data, **not visible as a published public placeholder**.

Do not infer that IEEE-hosted conference acceptance equals an IEEE Xplore indexed item. Proposal submissions and ongoing work must not appear as peer-reviewed published papers.

## 6. Leadership branch

Show AUSTRC progression as a separate documented history:

`Sub-Executive (Jan–Aug 2025) → Senior Sub-Executive (Aug 2025–Jan 2026) → Assistant Director (Jan–Jul 2026) → Director (Jul 2026–present)`.

Motion is supportive only; provide a simple timeline. Avoid implying the student's role is a paid employment promotion.

## Scope / budget control

Never build all complex interactions before case-study copy and assets exist. Signature 1 + Signature 2 + optional command palette constitute a strong first release; future interactions should be added only if they increase comprehension or demonstrate real capability.
