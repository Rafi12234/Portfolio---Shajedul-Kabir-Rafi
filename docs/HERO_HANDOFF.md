# Hero 00 — Art Direction and Motion Handoff

## Creative intention

A high-end editorial film-poster cover for a software engineer, NOT a developer IDE UI. Deep obsidian and burgundy provide atmosphere; a near-monumental cream title acts as architecture; an independent red disc anchors depth; a sharp portrait becomes the human focal point; refined body text reveals meaningful real roles. This is a bespoke adaptation of the supplied reference's visual *language*, not a pixel-level clone.

## Order of visual events (overlapping, not blocking)

| Approx. start | Visual element | Animation |
|---|---|---|
| 0ms | Background | visible instantly |
| 60ms | Header | short reveal from top |
| 260ms | Portrait | clip reveals face/suit upward, gentle scale, ~1420ms |
| 650ms | Burgundy disc | circular/scale reveal behind subject, ~1240ms |
| 800ms | ENGINEER | masked headline rises into view, ~1230ms |
| 1180–1280ms | Left/right editorial blocks | staggered entrance |
| 1420ms | SHAJEDUL KABIR / RAFI | name reveal |
| 1710–1940ms | Lower imprints and chapter bar | understated finale |

The sequence was chosen for your brief: dark ambience first, foreground Rafi next, then red disc and background text, then side/name/CTA. Animation timelines intentionally overlap to avoid a long loading wait.

## Depth mechanics

- CSS `z-index` is the actual optical stack: background -2; orb 1; ENGINEER 2; portrait 5; flanking text 7; name 8.
- `hero.js` changes ONLY small transform-related CSS variables, bounded to the stage and only for fine-hover desktop pointers.
- Scroll effect is bounded; no scroll locking, virtual scroll or canvas/WebGL.
- For mobile/coarse input and reduced-motion, depth returns to zero.
- Before future sections are added, the end-of-hero scroll cue is a narrative visual; there is no fake scroll link to nonexistent content.

## Responsive composition

- Desktop 1440: large headline full stage width; photo foreground overlaps word; asymmetric role text beside portrait.
- 1024: scaled headline/photo and role text, preserving hierarchy.
- 768: headline legible and portrait repositioned upward into the letterforms; side copy remains outside face.
- 390 and 320: independent mobile arrangement; full ENGINEER letters visible, portrait face prominent, shorter left editorial phrase, right roles retained, bottom corner imprints removed to avoid collisions, actual navigation through native `<details>`.

## Next revisions you can request

- Portrait scale, center, and face position on desktop/mobile.
- Masthead lettering: ENGINEER vs alternative word, actual size and condensed type proportions.
- Nameplate location (currently across suit, not face).
- Burgundy circle size, opacity, grain and independent timing.
- Faster/slower photo/headline entrances; reduce or heighten depth effect.
- Content copy, side role list, footer text or CTA destinations.

Only after visual approval should we move to the next portfolio section.
