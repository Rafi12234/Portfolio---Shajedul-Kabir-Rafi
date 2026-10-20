"""Safe, idempotent performance changes to existing Astro sources.
Run in your repository root after extracting the patch.
Preserves your current layouts, previous section content and project fixes.
"""
from pathlib import Path
import sys

root = Path(__file__).resolve().parents[1]
mods=[]

def replace_at(path, old, new, *, required=True):
    target = root/path
    if not target.is_file():
        raise SystemExit(f'Missing required project file: {path}. Extract ZIP at repository root.')
    data=target.read_text(encoding='utf-8')
    if old in data:
        data=data.replace(old,new)
        target.write_text(data,encoding='utf-8')
        mods.append(str(path))
        return
    if new in data:
        return
    if required:
        raise SystemExit(f'Unexpected changes in {path}; could not find expected code. No forced replacement. Check git diff and merge manually.')

# The smoother LENIS ticker must not compete with uncontrolled refreshes.
replace_at(Path('src/scripts/motion.ts'),
    'lerp: 0.14, wheelMultiplier: 0.95, anchors: true,',
    'lerp: 0.21, wheelMultiplier: 0.92, anchors: true,')
replace_at(Path('src/scripts/motion.ts'),
    'gsap.ticker.lagSmoothing(0);',
    '// Cap the effect of long frame stalls instead of propagating huge GSAP deltas.\n  gsap.ticker.lagSmoothing(500, 33);')

# Remove one oversized moving glow from What I Build. The decorative bloom
# remains visually unchanged as a static gradient layer.
replace_at(Path('src/scripts/what-i-build.ts'),
'''      const bloom = root.querySelector<HTMLElement>('.wib__bloom');
      if (bloom) {
        decoMotion = gsap.to(bloom, { x: 13, y: 17, scale: 1.045, duration: 11, yoyo: true, repeat: -1, ease: 'sine.inOut', paused: true });
        if (sectionVisible) decoMotion.play();
      }
''',
'''      // Large moving blurs are expensive while Lenis and ScrollTrigger render.
      // Keep the original visual glow, but do not animate the blur layer.
''')
replace_at(Path('src/scripts/what-i-build.ts'),
    'continuousMotion = gsap.to(marquee, { xPercent: -50, duration: 43, ease:',
    'continuousMotion = gsap.to(marquee, { xPercent: -50, duration: 64, ease:')
replace_at(Path('src/scripts/what-i-build.ts'),
    'sectionVisible = true; continuousMotion?.play(); decoMotion?.play();',
    "sectionVisible = true; if (!document.hidden) { continuousMotion?.play(); marquee?.classList.add('is-playing'); }")
replace_at(Path('src/scripts/what-i-build.ts'),
    'sectionVisible = false; continuousMotion?.pause(); decoMotion?.pause();',
    "sectionVisible = false; continuousMotion?.pause(); marquee?.classList.remove('is-playing');")
replace_at(Path('src/scripts/what-i-build.ts'),
    '    requestAnimationFrame(() => ScrollTrigger.refresh());',
    '    // Global motion director performs the single scheduled refresh after initialization.')
# A tab switch shouldn't render the marquee behind hidden pages.
if 'const onVisibility = () =>' not in (root/'src/scripts/what-i-build.ts').read_text(encoding='utf-8'):
    replace_at(Path('src/scripts/what-i-build.ts'),
    '  setupMotion();\n  reducedMotion.addEventListener',
    '''  const onVisibility = () => {
    if (document.hidden) { continuousMotion?.pause(); marquee?.classList.remove('is-playing'); }
    else if (sectionVisible && !reducedMotion.matches) { continuousMotion?.play(); marquee?.classList.add('is-playing'); }
  };
  document.addEventListener('visibilitychange', onVisibility);
  setupMotion();
  reducedMotion.addEventListener''')
replace_at(Path('src/scripts/what-i-build.ts'),
    "  window.addEventListener('pagehide', stopMotion, { once: true });",
    "  window.addEventListener('pagehide', () => { document.removeEventListener('visibilitychange', onVisibility); stopMotion(); }, { once: true });")
replace_at(Path('public/styles/what-i-build.css'),
    'white-space:nowrap;will-change:transform;',
    'white-space:nowrap;will-change:auto;')
style=root/Path('public/styles/what-i-build.css')
text=style.read_text(encoding='utf-8')
if '.wib__marquee-track.is-playing' not in text:
    text+='\n/* GPU promotion only while the outline ticker is onscreen. */\n.wib__marquee-track.is-playing{will-change:transform;}\n'
    style.write_text(text,encoding='utf-8')
    mods.append(str(style))

# Several GSAP modules were each asking ScrollTrigger to refresh on the same
# page-load frame; consolidate refresh in the shared director.
replace_at(Path('src/scripts/skill-atlas.ts'),
    '    requestAnimationFrame(() => ScrollTrigger.refresh());',
    '    // Shared motion director refreshes trigger measurements once on startup.')

# Native internal anchors should never open a new tab.
page=root/Path('src/pages/index.astro')
source=page.read_text(encoding='utf-8')
wrong='href="#selected-work" target="_blank" rel="noopener noreferrer"'
if wrong in source:
    page.write_text(source.replace(wrong, 'href="#selected-work"'),encoding='utf-8')
    mods.append(str(page))

print('Smooth scroll performance patch applied.')
print('Modified:', ', '.join(sorted(set(mods))) or 'none (already applied)')
