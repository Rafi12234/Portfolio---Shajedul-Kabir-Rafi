# Motion, Smooth Scrolling & Interaction Choreography

**Principle:** The scroll feels smooth because the page is responsive and carefully choreographed, not because scrolling is slowed or hijacked.

## Motion hierarchy

1. **Functional:** focus, navigation response, state transition, content selection. Must always work.
2. **Narrative:** one or two high-value scroll-linked stories (e.g. Booking Lifecycle, Routing Under Pressure).
3. **Atmospheric:** subtle text/border/image enters. Lowest priority and disabled first under constraints.

Avoid animating every component equally; asymmetry and stillness are part of the rhythm.

## Candidate tokens

| Motion | Duration / basis | Ease | Use |
|---|---|---|---|
| Instant response | 0–100ms | none | Focus, command selection, press feedback |
| Microstate | 150–220ms | ease-out | Button/link state, icon shift |
| Content reveal | 280–500ms | ease-out | Section-enter appearance |
| Panel transition | 300–550ms | cubic-bezier(0.22,1,0.36,1) | Command panel, diagram inspector |
| Chapter bridge | 450–850ms | carefully tested | Major visual handoff; avoid delaying scroll |
| Scroll-linked | Continuous progress | scrub | Only if explaining actual state relationships |

These are visual candidates; real-device performance and accessibility override artistic preference.

## Scrolling policy

- Native page scroll is baseline. Do not set `overflow: hidden` on `<body>` to emulate a cinematic showreel.
- `scroll-behavior: smooth` for in-page anchors only when reduced motion is not requested; prefer browser-native link behavior for essential navigation.
- Lenis is **not mandatory**. Add only after the fully functional native-scroll implementation, compare wheel, touch, keyboard, trackpad and scroll-to-anchor, and remove if it compromises responsiveness.
- GSAP ScrollTrigger only for precise, meaningful scroll timelines. Initialize after relevant DOM is ready; do not duplicate listeners on route transitions.
- Avoid unnecessary pinning, especially on short/mobile viewports. Sticky elements must not cover headings or trap content.
- Use `scroll-margin-top` for anchor landing positions below sticky navigation.

## Signature choreography proposals

### Hero

Content is visible in initial HTML. Optional entrance animates one or two typographic layers and a fine line over ~400ms. No fullscreen preloader, character-by-character typing, or delayed CTA availability.

### Production index

Project media may subtly settle into place on entry; one visual feature per project. Content stays visible if observer fails. On hover/focus, highlight meaningful relationship to adjacent metadata, not magnetic cursor movement.

### Booking Lifecycle

Change the currently active booking state with a clear, immediate and reversible animation. Transition should reflect allowed domain states, not a random progression. Avoid long theatrical sequences that prevent user exploration.

### Routing Under Pressure

Edges/route overlays morph or crossfade within an illustrative map/graph. Animated edges must have equivalent text status/route summary. If motion is disabled, switch immediately.

### Research ledger

Subtle ruled-line reveals are optional. Status tags never blink or pulse and do not imply live acceptance tracking.

## Accessibility and reduced motion

- With `prefers-reduced-motion: reduce`: no scroll scrubbing, parallax, inertia or animated typing; default to instant state transitions and static diagrams.
- Maintain focus visibility during all transitions. Focus should not enter a transformed/offscreen hidden element.
- Do not flash more than 3 times per second or use aggressive flicker/noise overlays.
- Avoid vestibular triggers: full viewport zoom, forced camera swings, excessive pin-and-scale, large opposing parallax.
- Respect browser back/forward scroll restoration and keyboard scrolling.

## Performance & cleanup

- Prefer opacity/transform for composited animations; animate width/height/top only when semantically necessary and bounded.
- Use minimal scroll observers, avoid large Lottie/WebGL dependencies, do not instantiate timeline per repeated item when a batch can suffice.
- Scope GSAP to a component and revert contexts on destroy; kill ScrollTriggers and remove resize/scroll handlers.
- Do not force layout reads/writes in alternating loops on scroll.
- Reserve dimensions for media to avoid CLS.
- Profile on modest Android hardware, trackpad and Safari; desktop gaming-PC smoothness does not prove success.

## QA scripts (manual)

- [ ] Scroll fast through entire page without frame stalls, blank content, content appearing late or scroll locks.
- [ ] Keyboard PageDown / Home / End / Space / Tab behavior remains predictable.
- [ ] Touch inertial scroll and overscroll feel native.
- [ ] Reduced-motion mode completely removes nonessential transformations.
- [ ] Deep links land below sticky navigation.
- [ ] Browser back returns to useful scroll position.
- [ ] No animation runs indefinitely while offscreen without purpose.
- [ ] Simulations can reset without reload.
- [ ] Scrolling with command palette open obeys dialog semantics; closing restores focus.
