# Research Liquid Glass V2 — implementation notes

## Visual direction

The source photo is a music-player album-cover perspective carousel. We adapt the **mechanism**, not the literal orange theme:

- 5-6 research-cover records circulate in a 3D loop, center card crisp and dominant; outer cards overlap and recede.
- Cover designs use geometric abstractions rooted in their disciplines: cross-modal data filaments, object-attention iris, security topology, submission signal waves, geospatial latitude/longitude, and histology-inspired cell formations. These are **decorative concepts**, not real figures/results from the papers.
- The floating bottom player has glass reflections, miniature cover thumbnail, current research label and selection controls.
- Selected cards gently move to center and flip. The back holds real HTML research details and links.
- Main palette stays near-black / burgundy / muted-crimson / champagne.

## Performance safeguards

- One `gsap.ticker` listener, attached only while the theatre is visible and playing. The portfolio's Lenis setup is reused, not duplicated.
- Orbit frame updates touch only `transform`, `opacity`, and `z-index`; width is cached by ResizeObserver and no geometry is read on every tick.
- GSAP tweens are event-triggered on selection, not scroll scrubbed.
- Disable movement while reader is open, hovered, reduced-motion, dragged, or when tab is hidden.
- SVG vectors avoid additional heavy image downloads.

## Research-data diligence

The entries were updated from the research titles/statuses disclosed in the conversation. Exact peer-reviewed publication URLs / indexed DOI records have **not** been independently verified. Do not mark CA-DAC as IEEE Xplore indexed solely from the IEEE eCF confirmation receipt. Previously supplied WIE Drive links were not matched to paper titles, and accordingly are not assigned to a specific accepted paper.

## Test checklist after installation

- Fresh desktop scroll to `#research`: verify infinite orbit begins when the stage enters the viewport.
- Flip each of 6 records; for long titles scroll inside flipped card.
- With a card open, verify the carousel pauses and the external link is clickable where present.
- Close; verify the loop resumes after pointer leaves and keyboard focus exits.
- Test Previous/Next, play/pause, drag, reduced-motion and narrow mobile.
- Confirm order: Selected Projects, Research, Experience.
