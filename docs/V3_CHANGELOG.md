# V3 — Research Carousel fixes and concept art

- Replaced broad orbit window hover pause with card-specific pointerenter/pointerleave. Empty glass theatre no longer stops motion.
- Implemented a Set of hovered cards so overlapping moving cards do not cause pause/resume races.
- Preserved intentional pause, touch dragging, intersection/visibility checks and reduced-motion support.
- Improved pointer-operated Close behavior: pointer closes do not force focus onto the card, which could otherwise accidentally keep the carousel paused as if keyboard navigation remained active.
- Added six newly generated, carefully cropped WebP concept visuals replacing the older generic SVG art.
- Each front card retains its strong short name but also renders the **exact full title** from `src/data/research.ts`. The visual content is not the source of textual metadata.
- Kept truthful distinctions between acceptance, completed electronic copyright agreement, submission, proposal, ongoing investigation and verified indexing.
- All other components, colors, orbit easing/physics and controls retained from V2.
