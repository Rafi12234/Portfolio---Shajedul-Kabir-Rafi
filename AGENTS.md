# Agent Contract — Luxury Editorial Portfolio

This is a **design-first**, static portfolio for Shajedul Kabir Rafi. Latest user instruction (2026-10-20) wins.

## Supersession (HARD RULE)

**Dismiss the old coding, programming, terminal, VS Code and source-control website theme.** Do not follow THE WORKING TREE as a visual metaphor. Software engineering is the SUBJECT, not an interface costume. No command-prompt homepage, git-branch navigation, fake code windows, IDE chrome, Matrix rain, neon syntax colors, typewriter hero or programmer-terminal branding.

**Current required direction:** owner-supplied creative portfolio screenshot: monumental condensed parchment typography; almost-black and burgundy environment; authentic portrait overlapping giant typography; luxury editorial gridded panels with hairline borders; carefully balanced asymmetry; beautiful serif/sans pairings; highly polished, frequent but purposeful animations/transitions; same warm black/red/cream palette. Adapt into an original Rafi-specific design; never copy person's photos, exact page composition, texts or project art.

## Mandatory reading order

docs/DECISIONS.md → docs/BRIEF.md → docs/REFERENCE_ANALYSIS.md → docs/DESIGN.md → docs/MOTION.md → docs/SECTION_BLUEPRINTS.md → docs/REQUIREMENTS.md → docs/CONTENT.md → docs/PROJECTS.md → docs/RESEARCH.md → docs/ASSETS.md → docs/INTERACTIONS.md → docs/ARCHITECTURE.md → docs/QUALITY.md → docs/IMPLEMENTATION.md → docs/SOURCES.md.

## Visual acceptance

- Palette fixed around #0A0708, #130809, #1E1312, #501615, #E4CCAF, #C1AF9D, #A68C7B, #B85E55. Check accessible contrast.
- Strong display typography + expressive serif + readable sans. Candidate faces Big Shoulders Display, Instrument Serif, Instrument Sans; self-host with valid licenses. Monospace only for real technical evidence.
- Original large portrait/typography interaction in hero. Do not fabricate Rafi's face. Real assets only with permission.
- Different chapters must have different compelling compositions while sharing gridlines, spatial rhythm and color vocabulary.
- No default gradient SaaS landing page, no generic bento tiles or stock/decorative tech illustrations, no fake stats, no empty filler animations.
- Always inspect actual browser screenshots; evaluate with and without animation, multiple widths, real photo crop, font fallback, and keyboard focus.

## Motion acceptance

Every major chapter deserves one well-designed motion signature; every link/control has refined hover/focus/press feedback. Use mask reveals, rule reveals, restrained image movement, clip transitions, and editorial scene changes. Not 50 identical fades. Scroll must remain responsive, not hijacked. Reduced motion must reveal everything instantly; no lost content or focus. GSAP/ScrollTrigger used only when justified; Lenis optional based on measured UX.

## Development law (ABSOLUTE)

**Never build multiple sections at once.** For EACH section:
1. Read the relevant specs, real content, photos and constraints.
2. Art-direct the layout; propose responsive compositions and exact visual hierarchy.
3. Specify reveal/hover/scroll choreography and reduced-motion alternative.
4. Implement ONLY the selected section.
5. Build, render, compare desktop/tablet/mobile screenshots; fix typography, crop, contrast and motion.
6. Present for review; iterate until the owner expressly approves.
7. Lock that section and record choices; then and ONLY THEN request the next chapter.

First implementation scope = **header + hero (00) only**. Documentation-update requests must not generate site files.

## Functional and ethical laws

Static prerender, semantic HTML, accessible navigation, no backend, authentication or client secrets. Keep CV facts honest: DataPulse Global/Boraq; AUST/leadership; project attributions; accepted/presented vs submitted research. Never leak confidential client assets, internal datasets, manuscript PDFs or phone numbers unless permitted. No misleading fake live APIs or business metrics.

Test 320/360/390/768/1024/1440/1920 breakpoints, touch, keyboard, reduced motion, link health, image loading, production build. Follow docs/QUALITY.md.

If specifications conflict, record the conflict in docs/DECISIONS.md. The user's latest editorial-theme instruction always supersedes earlier aesthetic suggestions.
