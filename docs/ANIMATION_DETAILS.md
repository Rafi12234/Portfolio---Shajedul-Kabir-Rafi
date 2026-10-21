# Motion choreography — Engineering Universe V2

## Camera
- CSS `perspective: 1100px` on `.eu__depth` (940px on compact screens).
- Every skill traverses Z=-1540 to Z=+690 with a 3.62-second `power1.inOut` tween.
- Early and late opacity windows avoid hard cutoffs on entry/exit.
- Word typography has consistent warm-cream styling; apparent size varies mainly because of depth.

## Flight field
- Seven positions distributed across the scene using a deterministic path list.
- Each slot is recycled. After completing its flight, a new entry from the active category is assigned.
- On mobile, four slots operate to preserve legibility and reduce work.
- `ALL SKILLS` includes every CV entry; category buttons replace the queue and reset the flow.

## Code rain
- Eight independent vertical code tracks containing C/C++ source fragments.
- A duplicated sequence in each track produces an uninterrupted top-to-bottom marquee.
- Time offsets and differing track durations keep the background organic and editorial, while all words retain a clear center layer above it.
- Typography uses JetBrains Mono / IBM Plex Mono / Fira Code with system monospace fallbacks, in a subtle burgundy-red palette.

## Accessibility
- Real category buttons expose `aria-pressed` states.
- Reduced-motion setting changes the scene to a static first skill with manual navigation.
- Explore All exposes the full skill names so information never depends on watching the animation.
- Focus is returned to the opener when the full index closes.
