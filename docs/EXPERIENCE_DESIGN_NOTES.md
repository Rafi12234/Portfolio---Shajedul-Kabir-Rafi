# Experience Showcase — design & engineering notes

## The selected cinematic mechanism

The source card remains on the right while a temporary image layer expands from its exact bounding rectangle into the full-width section. Its image is revealed through an animated clipped mask, rather than animating width/height and causing costly layout updates. At the expansion peak, the background and color tokens swap, then the editorial text on the left reveals.

This is intentionally **not a popup** and does not use actual browser fullscreen. It is a self-contained chapter within the long-scrolling website.

## Three distinct visual worlds

- **DataPulse Global** — orange / black, enterprise operations, professional dashboard tools.
- **Boraq** — deep teal / black, meetings, AI workflow concepts and forms.
- **AUST Robotics Club** — green / black, robotics hardware and club platforms.

All are framed inside the site's shared wine-black and warm-cream editorial design vocabulary, preserving overall consistency. The supplied logos are embedded in the image backgrounds at top left; role descriptions and timelines are rendered as HTML, not in the art.

## Exact motion choreography

1. The existing full-section background, company story and three image cards are visible.
2. Click a card or use Previous/Next: the current narrative fades/slides away.
3. A temporary image mask expands from the chosen card bounds to all of the section (1.12 seconds, power3.inOut).
4. Around 0.72 seconds, the new company background, active card, accent color and story are selected.
5. At 0.87 seconds, the new editorial content enters with a staggered contribution list.
6. The temporary layer fades and is hidden when the timeline finishes.

There is **no autoplaying company carousel** and no constantly running animation once the section has entered.

## Responsive behavior

- Desktop: story left, 3 card navigator in a row from center-right to edge.
- Tablet: tighter typographic scale and card widths.
- Mobile: readable stacked narrative followed by 3 cards and Prev/Next controls. The company change remains functional.

## Performance

- 3 optimized image assets total ~420 KB.
- No new GSAP ticker registration, Lenis, ScrollTrigger scrub, or requestAnimationFrame loop.
- Only short timelines after a click; no transforms applied to the body or scroll container.
- Reduced-motion instantly swaps the content.
