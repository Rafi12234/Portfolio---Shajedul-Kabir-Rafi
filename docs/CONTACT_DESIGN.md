# THE FINAL WORD — Design intent

The contact section is a proper closing act, not a conventional contact form or a sixth card gallery. It offers a strong typographic conclusion (“LET'S / make it / REAL.”), organic long-exposure rings, and a numbered communication directory. The burgundy and champagne hues follow the established editorial design system.

## Interaction system

1. When the chapter enters the viewport the headline lines and the directory reveal once. This is event-driven GSAP, not a scrubbed scroll animation.
2. Background color fields drift slowly, a large orbital outline turns over 48 seconds, and a thin ticker moves continuously; all decorative CSS effects automatically pause offscreen, in background tabs and when reduced motion is preferred.
3. Social rows respond to hover or keyboard focus with a sliding luminous wash. The bottom signal indicator changes to the selected platform.
4. The email can be copied or opened directly, with an explicit subject on the prominent “LET'S TALK” CTA. There is no backend and no invented delivery confirmation.
5. Footer provides a return-to-top interaction and matches the r. personal identity in the Hero.

## Performance and access

- Fully namespaced `.rc` CSS to avoid collisions with all eight earlier sections.
- Pointer spotlight updates use rAF only while the pointer moves on the directory, and don't create a frame loop.
- No external images or fonts beyond the portfolio's existing design assets.
- All five channels use the exact URLs supplied by the user (Instagram underscores included).
- Mobile layout stacks the invitation above the directory; buttons and targets remain tap-friendly.
