# Rafi — Hero 00 / The Editorial Cover

**Status:** Ready for your visual review. **Scope:** HEADER + HERO ONLY. No other portfolio section is included or implied to be approved.

A bespoke 100%-static Astro hero based on your luxury editorial reference: near-black/burgundy/cream, architectural condensed typography, real HTML text, a separately composited transparent Rafi portrait, an independent animated red disc, and precise scroll/pointer depth. The implementation rejects the former coding/terminal/VS Code visual theme.

## Run it (Astro)

Requires Node 20.19+ or Node 22.12+ (Astro 5 compatible) and an internet connection for the initial `npm install`.

```bash
npm install
npm run dev
```

Open `http://localhost:4321`. To generate deployable static HTML:

```bash
npm run build
npm run preview
```

The built website will be in `dist/`. There are no backend endpoints, databases, user accounts or API keys.

## View instantly without npm

Open **`preview/index.html`** directly in a modern browser (or serve `preview/` with any basic static server). It contains a mirrored, fully working **dependency-free** demo with all image assets, CSS and JavaScript. This is not a different design. Note that hosted Google Fonts require an internet connection; the design has local system-font fallbacks.

## What is actually layered / animated

| Layer | File/component | Motion |
|---|---|---|
| Base atmosphere | `public/assets/hero-atmosphere.webp` | Static backdrop visible immediately |
| Burgundy circle | `.hero__orb` (CSS-rendered, separate from backdrop) | Grows/reveals after portrait begins |
| Main headline | `.hero__masthead` (real HTML) | Giant masked typography behind subject |
| Rafi portrait | `public/assets/rafi-portrait.webp` / PNG fallback | Independent front-facing transparent cutout; upward/masked entrance |
| Name / role | `.hero__nameplate` | Editorial serif fade-and-rise |
| Left/right info | `.hero__side` | Staggered content entrance |
| Header / footer controls | `.site-header`, `.hero__bottom-strip` | Subtle reveals and interactive focus/hover treatments |

The CSS entrance timeline overlaps actions deliberately; **no artificial loading screen**. On capable desktop devices, `public/scripts/hero.js` adds subtle optical pointer parallax and a bounded scroll transform with requestAnimationFrame and IntersectionObserver. It intentionally does NOT use heavy 3D/WebGL or scroll hijacking. Mobile and reduced-motion users get a calm, static composition with full text and links.

## File structure

```text
RAFI_HERO_00/
├── README.md
├── AGENTS.md                 # guardrail: build only one chapter at a time
├── astro.config.mjs
├── package.json
├── src/pages/index.astro    # only page/section implemented
├── public/
│   ├── styles/hero.css
│   ├── scripts/hero.js
│   └── assets/
│       ├── rafi-portrait.png              # lossless transparent original
│       ├── rafi-portrait.webp             # optimized transparent production image
│       ├── hero-atmosphere.webp           # background with embedded disc softened
│       └── original-bg-reference.webp     # original supplied atmospheric reference
├── preview/                # self-contained view without Astro installation
├── scripts/check.mjs       # automated source/integrity smoke test
└── docs/HERO_HANDOFF.md    # design decisions, timing, responsive QA, integration
```

## Important integration notes

- **All text is actual HTML.** Do NOT replace it with a poster screenshot.
- Replace the current contact CTA link if you want another approved destination. The navigation links currently go to your existing public GitHub and LinkedIn, since later website sections do not exist yet.
- Portrait assets are derived from the previously generated subject you approved for this concept; compare facial likeness with your original photo before publishing. Do not treat them as an unedited photograph.
- Main theme color tokens are at top of `public/styles/hero.css`.
- Google Fonts: Big Shoulders Display, Instrument Serif and Instrument Sans loaded with a CSS link; font files are not bundled. For a production privacy/performance review, self-host legally downloaded versions if desired.
- If deploying to GitHub Pages under a repository subpath, set the Astro `base` in `astro.config.mjs` and verify public asset paths. Relative asset URLs are already used for the hero entry.
- The Hero does not include fabricated metrics, a contact backend or unfinished placeholder sections.

## Verification performed

- JS syntax and source integrity checks.
- Rendered desktop/tablet/mobile using an inline self-contained browser preview (remote/local page navigation was restricted in the test environment).
- 320, 390, 768, 1024 and 1440px viewport passes: no page-level horizontal overflow, image loaded, no JavaScript page errors.
- **Astro package installation and `astro build` were not executable in this environment.** Run `npm install && npm run build` locally before production deployment.
- Recommended manual review: actual Big Shoulders Display load, touch scroll, focus/hover, 1920px ultra-wide layout, Safari, Android/iOS, network failure and `prefers-reduced-motion`.

Next step: approve or request revisions to Hero 00. Do not implement chapter 01 until you explicitly approve this visual and its motion.
