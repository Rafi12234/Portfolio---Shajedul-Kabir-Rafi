# Motion integration — Hero 00 and Beyond the Title 01

The two existing sections now use a shared **GSAP + ScrollTrigger + Lenis** motion director. No new section is added. The reference-inspired luxury design, content, and portrait remain intact.

## Run locally

```bash
npm ci
npm run check:source
npm run check:motion
npm run dev
npm run build
```

**Evaluate http://localhost:4321**, not the historical static `preview/index.html` (that is a legacy snapshot with the older motion code).

- GSAP timeline: portrait, burgundy disc, ENGINEER masthead, name and side labels.
- ScrollTrigger: layered Hero scrolling; reveal education milestones once; progress red timeline spine; ambient section depth.
- Lenis: enabled for desktop fine-pointer wheel use only, driven by GSAP ticker. Native touch/keyboard behavior and reduced-motion fallback remain.
- No whole-page lock, no forced snap, no fake preloader. Without JS, content remains readable.

**Verification limitation:** This update has structural code checks, but the dependencies and full animation performance still need a real local `npm ci && npm run build` and browser/device review. If wheel smoothing feels delayed, adjust Lenis `lerp` in `src/scripts/motion.ts` or disable Lenis while retaining ScrollTrigger. Do not re-enable old hero.js/beyond-title.js scripts alongside motion.ts.
