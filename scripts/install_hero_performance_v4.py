#!/usr/bin/env python3
"""Safe incremental Hero typography/CV layout and portfolio motion performance patch.

No section is replaced. Existing pages remain untouched other than index, motion,
selected-projects and optional first-render image metadata. Creates backups.
"""
from __future__ import annotations
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / 'src/pages/index.astro'
MOTION = ROOT / 'src/scripts/motion.ts'
SELECTED = ROOT / 'src/scripts/selected-projects.ts'
CSS = ROOT / 'public/styles/hero-performance-v4.css'
BACKUPS = ROOT / '.rafi-v4-backups'


def backup(path: Path) -> None:
    target = BACKUPS / path.relative_to(ROOT)
    if not target.is_file():
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, target)


def update(path: Path, content: str, name: str) -> None:
    prev = path.read_text(encoding='utf-8')
    if prev == content:
        print(f'✓ {name}: already up to date')
        return
    backup(path)
    path.write_text(content, encoding='utf-8')
    print(f'✓ {name}: updated; original backed up')


def patch_index() -> None:
    original = INDEX.read_text(encoding='utf-8')
    text = original
    # Only touch the Hero masthead, not research/project headings.
    one = re.compile(r'(<p\s+class="hero__masthead"[^>]*>)(?:ENGINEER|<span\s+class="hero__masthead-pre">SOFTWARE</span>\s*<span\s+class="hero__masthead-core">ENGINEER</span>)(</p>)')
    replaced, matches = one.subn(
        r'\1<span class="hero__masthead-pre">SOFTWARE</span><span class="hero__masthead-core">ENGINEER</span>\2',
        text, count=1
    )
    if not matches:
        raise RuntimeError('Could not identify exact Hero masthead; refusing to modify an unknown design.')
    text = replaced
    if 'href="./styles/hero-performance-v4.css"' not in text:
        if '</head>' not in text:
            raise RuntimeError('Missing </head>')
        text = text.replace('</head>', '  <link rel="stylesheet" href="./styles/hero-performance-v4.css" />\n  </head>', 1)
    # Guard against a legacy intro/overlay from earlier iterations.
    # Do not silently remove unfamiliar custom markup: the old reveal is disabled
    # by CSS, and the previous repair installer remains the authority on it.
    update(INDEX, text, 'index.astro')


def patch_selected() -> None:
    if not SELECTED.is_file():
        print('~ Selected Projects script missing, skipping optimization')
        return
    content = SELECTED.read_text(encoding='utf-8')
    if 'const visibleLimit = cinema.clientHeight + step;' in content:
        content = content.replace('const visibleLimit = cinema.clientHeight + step;',
                                  'const visibleLimit = cinemaHeight + step; // cached outside each animation frame', 1)
        update(SELECTED, content, 'selected-projects.ts: no per-frame cinema height read')
    elif 'const visibleLimit = cinemaHeight + step;' in content:
        print('✓ selected-projects.ts: cached layout read already present')
    else:
        print('~ selected-projects.ts custom motion loop; no unsafe automatic edit')


def patch_motion() -> None:
    if not MOTION.is_file():
        print('~ motion.ts missing; skipping Lenis patch')
        return
    src = MOTION.read_text(encoding='utf-8')
    if 'let rafId: number | null = null;' in src and 'gsap.ticker.add(ticker)' not in src:
        print('✓ motion.ts: native browser-frame Lenis timing already installed')
        return
    # Avoid adding a second Lenis controller. Convert only the original
    # GSAP-ticker-based version; custom alternatives are left intact.
    expected = (
        'let ticker: ((time: number) => void) | null = null;' in src
        and '  ticker = (seconds: number) => lenis?.raf(seconds * 1000);' in src
        and '  if (ticker) gsap.ticker.remove(ticker);' in src
        and 'function setupLenis() {' in src
        and '\nfunction setupHero(' in src
    )
    if not expected:
        print('~ motion.ts uses a different Lenis implementation; keeping it unchanged')
        return
    src = src.replace('let ticker: ((time: number) => void) | null = null;',
                      'let rafId: number | null = null;', 1)
    begin = src.find('function setupLenis() {')
    end = src.find('\nfunction setupHero(', begin)
    new_lenis = '''// Native browser RAF clock — adapted from the smooth Sicko Soul setup.
// Only one Lenis instance is created; ScrollTrigger stays synchronized.
function setupLenis() {
  if (reduced.matches || !desktopPointer.matches) return;
  lenis = new Lenis({
    autoRaf: false,
    smoothWheel: true,
    syncTouch: false,
    lerp: 0.12,
    wheelMultiplier: 0.90,
    anchors: true,
  });
  lenis.on('scroll', ScrollTrigger.update);
  const frame = (time: number) => {
    lenis?.raf(time);
    rafId = window.requestAnimationFrame(frame);
  };
  const onVisibility = () => {
    if (document.hidden) {
      lenis?.stop();
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
    } else {
      lenis?.start();
      if (rafId === null) rafId = requestAnimationFrame(frame);
      ScrollTrigger.refresh();
    }
  };
  rafId = window.requestAnimationFrame(frame);
  document.addEventListener('visibilitychange', onVisibility);
  removals.push(() => document.removeEventListener('visibilitychange', onVisibility));
  ScrollTrigger.config({ ignoreMobileResize: true });
}
'''
    src = src[:begin] + new_lenis + src[end:]
    src = src.replace('  if (ticker) gsap.ticker.remove(ticker);\n  ticker = null;',
                      '  if (rafId !== null) window.cancelAnimationFrame(rafId);\n  rafId = null;', 1)
    if 'gsap.ticker.add(ticker)' in src or 'gsap.ticker.remove(ticker)' in src:
        raise RuntimeError('Obsolete GSAP Lenis ticker not completely removed; aborting.')
    update(MOTION, src, 'motion.ts: native RAF smooth scrolling')


def main() -> None:
    for path in (INDEX, CSS):
        if not path.is_file():
            raise SystemExit(f'Missing {path.relative_to(ROOT)}: extract the entire ZIP into your Astro root.')
    original = INDEX.read_text(encoding='utf-8')
    if '<div class="hero__bottom-strip"' not in original or 'hero__masthead' not in original:
        raise SystemExit('Unexpected Hero page; no changes made.')
    if 'hero__cv-link' not in original:
        raise SystemExit('CV download is not installed. Apply your previous CV integration first.')
    patch_index()
    patch_selected()
    patch_motion()
    print('✓ Done. Sections, links, CV file, logos, content, animations and Lenis instance preserved.')
    print('  Please run npm run build, then check your full site in Chrome Performance.')

if __name__ == '__main__':
    main()
