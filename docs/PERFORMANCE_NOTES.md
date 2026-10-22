# Why the scroll felt shaky

Checked the portfolio's latest `src/scripts/motion.ts` and Sicko Soul's `frontend/src/hooks/useLenis.ts` through the connected GitHub repositories.

1. **Time base mismatch.** The portfolio sent GSAP's lag-smoothed ticker seconds into Lenis. Sicko Soul uses the actual browser RAF timestamp (`lenis.raf(time)`). With frame stalls from continuously moving cards and large images, a lag-smoothed clock can make scroll easing feel irregular.
2. **Long smoothing tail.** The portfolio used `lerp: 0.21` and `wheelMultiplier: .92`; the benchmark site's `lerp: 0.12` and `.9` respond more predictably. Small lerp is not universally better, but matching the reference eliminates one variable.
3. **Layout reading inside an animation tick.** `renderMotion` in `selected-projects.ts` was using `cinema.clientHeight` per tick. This patch uses cached `cinemaHeight` updated by `relayout()` instead.
4. **Competing timelines.** The previous Experience section revealed whole story panels late and staggered only rows. This patch animates all story content consistently.
5. **GPU limits.** The portfolio's continuously animated Engineering Universe, selected work, research carousel, and background effects still require rendering work. They already pause outside their sections (subject to your installed versions). No switch to Lenis can eliminate graphics/GPU bottlenecks.

## Manual QA

- Check HTML starts at page top after a refresh at 1/3 and 2/3 of the page.
- Test a fresh direct visit to `/#experience`: it should not be forced to top.
- Test the small Hero CV download on 320px mobile and 1440px desktop.
- Test the new logo on the navigation and the Contact footer (if installed).
- Try touch and wheel scrolling; on touch devices native scroll remains enabled.
- Switch DataPulse → Boraq → Robotics → DataPulse; every section title, subtitle, list and timeline should animate smoothly.
- Watch browser console for JS errors and test `prefers-reduced-motion`.
- `npm run build` should complete without errors before Vercel deploy.
- On production: verify PDF URL is `/assets/Shajedul_Kabir_Rafi_CV.pdf` and favicon is `/favicon.png`.
