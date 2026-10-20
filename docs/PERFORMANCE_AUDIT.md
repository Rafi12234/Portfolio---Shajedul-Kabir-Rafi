# Portfolio scroll/motion audit — 2026-10-21

Base: `main` at `3ce85fde35b69b6c3c7ab1f51cf1232088b550dc` (read-only). No push performed.

## What was observed

- Four animation modules were all registering ScrollTrigger and some were calling `refresh()` during the same startup/resize window.
- Section 02 animated a large blurry ambient `.wib__bloom` layer while the outline marquee and ScrollTrigger reveals were active.
- Section 04's GSAP filmstrip wrote transform, z-index and DOM dataset state for 18 cards on every update; it also repeatedly read card heights to set focusability.
- Section 04 used CSS `filter: drop-shadow()` on continuously translated large project plates and animated image filters at hover. Its background red glow included `blur(30px)`.
- The browser has to decode 18 1672×941 PNGs if these covers are added unchanged (about 34 MB compressed). Pre-sized 1400×788 WebP covers reduce transfer size to about 2.1 MB total.
- Current Lenis `lerp:0.14` can lag noticeably behind aggressive wheel gestures. GSAP's `lagSmoothing(0)` disables large-frame-stall smoothing.

## What was changed

- One owned Lenis instance remains synchronized with GSAP ticker; lerp adjusted to 0.21 and lag smoothing set to (500,33) to limit stalls.
- What I Build keeps the marquee but moves at slower pace; expensive animated bloom becomes a static glow. Ticker pauses offscreen / hidden tabs; GPU promotion is conditional.
- Removes per-section redundant `ScrollTrigger.refresh()` calls for What I Build and Skills Atlas during normal initial load.
- Section 04 positions only cards near the visible cinema on each update, caches card positions internally, changes stacking order only when needed, and no longer writes dataset attributes per animation frame.
- Filmstrip pace reduced from 86px/s desktop to 52px/s desktop and 43px/s on mobile, while maintaining continuous motion and hover/focus pause.
- Heavy card drop-shadows and live image filters replaced with static panel shadows; giant blurred red glow made unblurred. Background strips stop animating outside their section.
- Modal uses a simple opacity/translate transition instead of expensive 3D scale and rotateX.
- Removes `target="_blank"` from same-page Selected Work navigation.
- Preserves keyboard navigation, reduced-motion mode, manual controls, category filtering and GitHub links.

## Image honesty

All 18 provided/generated visuals are labeled **DEMO VISUALS ONLY — conceptual UI mockups, not actual application screenshots** on the section, each card, and the modal.

**Exception that still needs your review:** The supplied asset named `flarespare_automotive_marketplace_showcase.png` depicts a car-parts e-commerce UI, whereas the GitHub repo linked under project `flaresphere` is a hand-tracking fireball effect. We have linked the supplied image per your request but cannot honestly characterize it as a matching product interface. Replace `public/assets/project-covers/flaresphere.webp` with a genuinely related, approved image when available. Do not claim the demo is a real screenshot.

## Important limitations

The fixes address identified source-level bottlenecks, but frame pacing varies with GPU/browser/OS input. This ZIP does not prove that a production build passes or guarantee zero frame drops on all devices. Run `npm run build`, use Chrome Performance > Record while scrolling 00→04, inspect long tasks and compositor frames, and test both high-refresh trackpads and standard mice. Existing code may have changed after the base SHA; the script refuses to replace unfamiliar markers rather than guessing.
