# 08 · Client Projects / The Commission Archive

## Design reference and intent

The uploaded Sicko Soul site screenshot is intentionally the hero artifact. The section is not a marketplace widget, fake case-study carousel, or duplicate of the Selected Projects filmstrip; it is a boutique *client commission archive*.

- Muted burgundy / champagne / black: compatible with the established portfolio identity.
- In-frame documentary photo of the real streetwear site: the client is clearly named and linked.
- Oversized editorial typography and long moving imprint band: deliberately different from the research glass orbit and Experience grid.
- A second 'unreleased' cluster is an honest teaser, with NO fictional client/project names or dead action buttons.

## Motion choreography

1. Ambient burgundy light gently travels on opposing paths (CSS `transform`; no JS loop).
2. A muted typographic ticker runs indefinitely while this section is on screen.
3. Two fine-line rings orbit behind the presented site screenshot.
4. A low-opacity glint moves occasionally across the screenshot glass.
5. The photograph frame tilts *only when someone moves their pointer over the actual visual zone* and returns smoothly on pointer exit.
6. The unreleased project folders float and separate slightly on hover.
7. The small reveal animation for each piece of editorial text runs once via IntersectionObserver+GSAP.

If the section goes offscreen, the CSS motion pauses. If the visitor requests reduced motion, continuous motion is disabled.

## Content accuracy

The supplied reference is a screenshot of `sickosoul.shop`. The case study says only what is supported: it is a streetwear-label web presence with dark photographic editorial identity. No invented client conversions, e-commerce integrations, delivery team details, technologies, or fabricated metrics.

## Expand / link

- `Visit live website` opens the user-provided URL in a new tab.
- `Inspect the work` opens a native dialog with the *full uploaded* 1919 × 969 image.
- Dialog handles Escape, backdrop click, close control, and focus restoration.

## Files

- `src/components/ClientProjects.astro`: layout and semantic markup
- `src/data/clientProjects.ts`: client name/description/link, easy to edit
- `src/scripts/client-projects.ts`: lightweight pointer and entrance events
- `public/styles/client-projects.css`: all style and motion
- `public/assets/client-projects/sicko-soul-showcase.webp`: lightweight page visual (~118 KB)
- `public/assets/client-projects/sicko-soul-original.png`: exactly the supplied image (~2.5 MB), loaded only for inspection

Do not expose client-sensitive details or make claims about completed product functionality without client approval.
