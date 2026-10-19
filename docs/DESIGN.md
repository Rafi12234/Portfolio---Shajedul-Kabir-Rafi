# Design Specification — THE WORKING TREE

**Purpose:** Give the portfolio its own visual grammar. This is a **proposed art direction**: deliberate, specific, testable and revisable after visual exploration. Not an instruction to clone any reference site.

## 1. Design thesis

A sophisticated engineer's *working tree*: a combination of editorial field notes, source-control precision, technical annotations, and confident architectural storytelling. The page should feel authored by someone who cares about systems. Code-like elements explain real work; they are never wallpaper.

Keywords: **documentary / engineered / editorial / restrained / high-craft / tactile / intentional**.

The visual identity lives in layout, typographic contrast, information hierarchy, controlled color, custom diagrams, and subtle transitions — *not* in a generic dark terminal skin.

## 2. Anti-patterns (automatic visual rejection)

- Purple/cyan blobs, glassmorphism, gradient headlines, overused bento grids, neon cards, pastel glow.
- A giant fake IDE window containing the whole homepage; arbitrary 0/1 or Matrix rain; fake compilation logs.
- Repeating identical left-text/right-image blocks, or identical rounded cards with a different logo on each.
- A rotating slogan/typewriter as primary hero content; fake “system online” telemetry; fabricated code samples.
- Endless animations, huge cursor followers, magnet effects on standard links, every letter animated independently.
- Making content unreadable until scroll triggers; hiding everything behind hover or keyboard shortcuts.
- Using another portfolio's exact component layout, paid template, source, images, fonts or branded visual assets.

## 3. Proposed palette (version 0.1)

A light-first *paper-and-graphite* base with occasional dark technical chapters. No gradients necessary.

| Token | Candidate value | Use |
|---|---|---|
| `--ink` | `#141A18` | Primary text, dark surfaces |
| `--paper` | `#F3F1EA` | Warm principal background |
| `--white` | `#FBFAF6` | Elevated reading zones |
| `--muted` | `#5F6962` | Secondary text (verify contrast) |
| `--rule` | `#CACEC5` | Hairline separators, grid anchors |
| `--pine` | `#24594F` | Rare meaningful focus/actions |
| `--copper` | `#A65F3A` | Achievement or annotation marker, sparingly |
| `--dark-matte` | `#101512` | Dramatic project/architecture chapter |
| `--dark-copy` | `#E7EAE4` | Text on dark sections |

These are test candidates, **not immutable brand colors**. Verify combinations for AA contrast, then freeze tokens. A neutral palette can be distinctive through composition and imagery.

**Accent rule:** At most one primary accent per viewport (exceptions for semantic charts/states). State colors in simulations must also have labels/shapes, never color only.

## 4. Typography system

- **Display / headings:** investigate `IBM Plex Sans` or another legally usable contemporary grotesk with subtle human character; custom tracking, not standard template presets.
- **Body:** high-quality readable sans, e.g. `IBM Plex Sans`, normal letter spacing. Long explanations are editorial prose, not monospace walls.
- **Technical metadata:** `IBM Plex Mono` (case-study coordinates, status chips, code, section numerals). Limit monospace to purposeful moments.
- Optional distinctive italic/serif micro-accents only if concept review demonstrates value; do not add a fourth font for novelty.
- Self-host only rights-cleared WOFF2; follow applicable font licenses. No font CDN dependency for essential typography.

Suggested responsive type ranges (fluid clamp, values approximate):

| Role | Mobile | Desktop | Notes |
|---|---|---|---|
| Hero name/headline | 48–64px | 96–152px | Intentional line breaks; never overflow |
| Chapter title | 36–46px | 64–96px | 1–3 lines max |
| Project title | 30–38px | 48–72px | Space to breathe |
| Body | 16–18px | 17–20px | 1.5–1.7 line-height |
| Dense meta / code | 12–14px | 12–14px | Never unreadably tiny |
| Eyebrow / index | 11–12px | 11–13px | Uppercase tracking only for labels |

Maintain line length ~58–75 characters for long reading passages. Hierarchy should survive font loading delays.

## 5. Grid and rhythm

- 12-column desktop grid for editorial alignment; 6-column tablet; 4-column mobile. Do not fill every column.
- Max reading width ~760px; max stage width ~1440–1600px. An interactive showcase may extend wider, with constrained accompanying text.
- Desktop outer gutters ~4–6vw; mobile ~20–24px. Keep technical labels anchored to a consistent baseline.
- Spacing: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 144px, with one responsive token scale.
- Borders are 1px hairlines to structure documentary information; use crisp corners for technical panels and only selective 4–8px rounding where functional.
- Do not use box shadows as decoration. Rely on tone, border, layering and whitespace.

## 6. Composition by chapter

### Hero — orientation, not special effects

- Large typographic name or engineering positioning statement; unusual but readable asymmetry.
- Slim left-margin index / active chapter cue; no oversized empty terminal mockup.
- Secondary metadata: current roles, location optional, direct CTA.
- A small **working-tree excerpt** containing a real project fact (e.g. `shipped: mobile app / independently built`) can add authenticity if phrasing is approved.
- Do not show fake code blocks saying `const developer = awesome`.

### Production systems

- Editorial project plates — large real product images next to *operational* diagrams and concise facts.
- Alternate visual arrangements based on each project's problem, not a repetitive card grid.
- Booking platform might use a calendar/state timeline; club mobile app might use tall device imagery; brand site might use visually bold campaign imagery (with permission).
- Each project exposes an accurate role, client/team status and meaningful verified contribution.

### Under the hood

- Dense-but-organized engineering breakdown: interactive architecture cards or diagrams paired with plain-language tradeoffs.
- Distinguish *documented actual implementation* from *illustrative conceptual visualization* with explicit labels.

### Research ledger

- Scholarly restraint, typography-first. Each paper appears like a carefully typeset abstract entry, clearly showing stage and year.
- Avoid “IEEE published researcher” unless IEEE Xplore/publication proof exists for the relevant item.

### Experience & leadership

- Draw a subtle branching history: professional roles are parallel ongoing lanes; AUSTRC progression is a separate ascending lane.
- Never make career progression imply an employer promotion where none occurred.

### Contact

- Elegant final chapter, generous whitespace, direct email / GitHub / LinkedIn. No misleading form or “message transmitted” terminal fiction.

## 7. Component art rules

| Component | Art direction |
|---|---|
| Navigation | Very small, stable, scannable; keep conventional labels |
| Chapter rail | Position/progress + index, not an intrusive scrollbar replacement |
| Project link | Title + type + role + evidence; clear hover/focus affordance |
| Status label | Readable plain text: `Accepted & presented`, `Submitted`, etc. |
| Code | Real excerpts or meaningful pseudocode with attribution; static syntax highlighting at build |
| Diagram | Vector-based, labeled, accessible text alternative; meaningful edges |
| Command panel | Functional command launcher with real destinations and helpful hints |
| Button | Stable hit target ≥44 CSS px touch target where practical |
| Image | Intentional crop; original or permission-cleared assets; meaningful caption |

## 8. Motion and state fidelity

This document owns appearance only. `MOTION.md` owns duration/scroll behavior. Interactive states belong to `INTERACTIONS.md`; use their diagrams and labels without overriding factual semantics.

## 9. Visual QA checklist

- [ ] Hero feels authored without animation and without gradients.
- [ ] At least 3 project compositions are meaningfully distinct.
- [ ] Genuine projects are recognizable through real assets and engineering decisions.
- [ ] The site has a coherent visual fingerprint in a desaturated screenshot.
- [ ] Type is readable on 360px mobile with no clipped words.
- [ ] Status/metadata elements are functional, not decorative clutter.
- [ ] Color use passes relevant contrast tests.
- [ ] Every intentionally unconventional layout is still quickly scannable.
- [ ] Major animations disabled: content still excellent.

## 10. Required design deliverables before build

Create two original desktop hero compositions plus one mobile adaptation, one representative project plate, one research ledger row, one case-study section, and a tiny token prototype. Review before freezing this proposed direction. Avoid fabricating external reference screenshots as a substitute for original design exploration.
