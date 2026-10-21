# Engineering Universe — Motion Design & QA

## Original creative direction

Based on the user's reference video: an element emerges at the rear of a virtual scene and approaches the viewer along the same path. The apparent size changes as a result of **depth**, not because multiple independent words are randomly scaled and scattered. One word is visible at a time.

## Camera and choreography

- Perspective parent: `.eu__depth { perspective: 1030px; perspective-origin: 50% 50%; }`.
- Single reusable `data-eu-flight` element with permanent centering via the independent CSS `translate` property.
- GSAP first places it at **z = –1680px** at alpha 0.
- It approaches continuously to **z = +720px** over **3.12 seconds**, using `power1.in` for gentle acceleration.
- Alpha softly rises near the distant point, then fades in the last 0.35 seconds as it passes the virtual camera.
- At the cycle boundary the skill name is changed once. Nothing else is generated or reflowed during flight.
- Auto-play traverses every CV entry. The hero sequence begins with React.js / Python / Flutter / Next.js to introduce strong visual variety, then continues through the complete skill index.
- The nine discipline buttons jump to their corresponding technology; Previous/Next and Pause/Play provide explicit interaction.
- `Explore All` opens the indexed CV skills and evidence-labeled project-specific tools in a native accessible dialog.

## Why this is lightweight

- Only one 3D-transformed text element and its opacity are animated continuously by GSAP.
- Decorative perspective lines are a static SVG; there are no per-frame layout reads, no animated full-screen blur, and no WebGL dependency.
- Animations pause off-screen, behind an open dialog, in a hidden document, when paused by the visitor, or when reduced motion is preferred.
- Both earlier skills modules are no longer imported; **existing Lenis and the Hero/BeyondTitle scroll director remain unchanged**.
- Responsive type sizing makes long names smaller *before* projection to avoid unreadable initial states.

## Verification carried out

- Installer executed twice against a homepage fixture with the current expected section structure: changes applied once, no duplicates.
- TypeScript transpilation emitted zero syntactic errors.
- CSS tokenization had zero top-level syntax errors.
- Static HTML layout checks at widths **320, 390, 768, 1024 and 1440 pixels**: no horizontal page overflow; heading clipping corrected at 320px and 390px.
- CSS-perspective geometry verified in Chromium: the projected word widths increase monotonically as Z advances. This verifies the visual depth mechanism, not the entire production GSAP runtime.
- Static browser screenshots supplied in `previews/`.

## Local verification still required

Run `npm run build` inside the real Astro project after installing. Check that the skill sequence advances and loops, category selection and pause work, all 42 entries are accessible in the dialog, reduced motion is respected, and scrolling stays smooth in your actual full page. Real-browser performance/FPS across devices is not guaranteed by static checks.
