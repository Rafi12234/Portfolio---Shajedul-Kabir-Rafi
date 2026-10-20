# Uploaded Visual Reference — Filmstrip Motion Analysis

Source: user-supplied 720 × 960 MP4, 270 video frames at 30 fps, total 9.068 seconds (2026-10-20). Video is an inspiration source, **not** a repository asset/license grant.

## Frame progression / observed timeline

| Interval | What the reference is doing | Translation into Rafi's portfolio |
|---|---|---|
| 0.0–0.9s (frames 0–27) | Several angled desktop-preview cards are already in motion. Background repeats huge condensed black lettering on white. The camera stays fixed while the cards move upward. | Static enormous warm-cream lettering against black-wine canvas. Tilting project plates translate upward in a single independent stream. |
| 0.9–2.1s (frames 27–63) | Large light and dark website previews pass the center. The cards overlap, partly obscuring neighboring pages, with subdued soft shadows. | One column of alternating parchment, burgundy, charcoal, ember plates; consistent shadows; offsets and rotations varied per plate. |
| 2.1–3.6s (frames 63–108) | A light page and dark portrait-led page trade visual prominence; no hard cuts, snapping or rotation reversal. | Linear, continuous travel; no timed snap, no fade between cards, no reversing animation. |
| 3.6–5.1s (frames 108–153) | New preview compositions enter from below. Large background lettering remains fixed and still visible between tilted cards. | New cards naturally enter/leave the finite clipped stage; background stays stationary. |
| 5.1–6.9s (frames 153–207) | Repeated dark/light compositions slide upward with varying tilt; cards retain their rigid printed-page geometry. | Flat rectangular interactive surfaces in perspective, rather than 3D flips. |
| 6.9–9.0s (frames 207–269) | Earlier compositions recur as the conveyor sequence continues; no break in the camera perspective. | Arithmetic wrapping around a single collection of project nodes to avoid clone duplicates; endless continuous movement. |

Contact sheets sampled every 0.3 seconds across the full video are for internal analysis only. Each of the 270 frames was decoded in sequence during review. The most important distinction from the earlier project implementation is **one theatrical vertical filmstrip vs two independent conveyor lanes**.

## User-requested interaction adaptation

Unlike the reference video, interactive project cards should pause on hover, and clicking one should launch a beautiful modal including trustworthy descriptions, key capabilities, technology stacks, and a direct repository link. In this implementation only the modal moves in 3D; the original preview cards remain flat editorial planes, preserving the supplied aesthetic.

## Color adaptation

Reference: light paper background, bold black text and mixed website pages. Portfolio: obsidian `#0A0708`, black wine `#130809`, deep burgundy `#501615`, parchment `#E4CCAF`, muted red `#B85E55`, sand `#C1AF9D`. Different visual previews deliberately alternate lighter/darker plates to preserve the reference's graphic rhythm.

## Quality constraints

No scroll trapping, second Lenis instance, cloned focusable cards, heavy WebGL, fake client screenshots, illegible modal text or placeholder achievements. Mobile gets the same functional project interaction with compact plates. Reduced-motion users see a static accessible gallery.
