#!/usr/bin/env python3
"""Integrate the first-visit video into the existing Astro portfolio.

Run once from the project root:
    python scripts/install_intro_film.py

No wholesale replacement of `src/pages/index.astro` or `src/scripts/motion.ts`.
The patch is idempotent and preserves prior portfolio customizations.
"""
from pathlib import Path
import sys

ROOT = Path.cwd()
PAGE = ROOT / 'src/pages/index.astro'
MOTION = ROOT / 'src/scripts/motion.ts'

HEAD_SCRIPT = '''    <!-- Play only on the first visit in this browser.
         This runs synchronously to prevent flashing on repeat loads. -->
    <script is:inline>
      (() => {
        try {
          const skipDeepLink = !!location.hash && location.hash !== '#page-top';
          const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
          const seen = localStorage.getItem('rafi-intro-seen-v2') === '1';
          if (!seen && !reduced && !skipDeepLink) {
            document.documentElement.classList.add('intro-pending');
          }
        } catch { /* storage unavailable: render the portfolio immediately */ }

        // Failsafe even if a JS module fails to load or the video stalls.
        window.setTimeout(() => {
          const doc = document.documentElement;
          if (!doc.classList.contains('intro-pending')) return;
          doc.classList.remove('intro-pending', 'intro-revealing');
          const overlay = document.querySelector('[data-intro-film]');
          if (overlay) overlay.hidden = true;
          document.querySelector('.portfolio-shell')?.removeAttribute('inert');
          document.dispatchEvent(new Event('portfolio:intro-complete'));
        }, 36000);
      })();
    </script>
'''

MOTION_GUARD = '''  // Keep the original Hero entrance from playing behind the intro film.
  if (document.documentElement.classList.contains('intro-pending')) {
    if (!introHeroQueued) {
      introHeroQueued = true;
      document.addEventListener('portfolio:intro-complete', () => {
        introHeroQueued = false;
        start();
      }, { once: true });
    }
    return;
  }
'''

def change(src: str, old: str, new: str, message: str) -> str:
    if old not in src:
        raise RuntimeError(f'{message}: expected insertion anchor not found: {old!r}')
    return src.replace(old, new, 1)


def apply():
    if not PAGE.exists() or not MOTION.exists():
        raise RuntimeError('Run from the Astro project root (missing src/pages/index.astro or src/scripts/motion.ts).')
    page = PAGE.read_text(encoding='utf-8')
    motion = MOTION.read_text(encoding='utf-8')
    edits=[]

    if 'import IntroFilm from' not in page:
        page = change(page, '---\n<!doctype html>', 'import IntroFilm from "../components/IntroFilm.astro";\n---\n<!doctype html>', 'Astro component import')
        edits.append('Added IntroFilm component import')

    if 'rafi-intro-seen-v2' not in page:
        page = change(page, '<head>', '<head>\n'+HEAD_SCRIPT.rstrip(), 'Initial visit detection')
        edits.append('Added prepaint visit check and safety watchdog')

    if 'href="./styles/intro-film.css"' not in page:
        page = change(page, '<link rel="stylesheet" href="./styles/hero.css" />', '<link rel="stylesheet" href="./styles/intro-film.css" />\n    <link rel="stylesheet" href="./styles/hero.css" />', 'Film stylesheet')
        edits.append('Added film stylesheet')

    if "import '../scripts/intro-film.ts';" not in page:
        page = change(page, "import '../scripts/motion.ts';", "import '../scripts/intro-film.ts';\n      import '../scripts/motion.ts';", 'Film controller')
        edits.append('Added intro controller before shared GSAP motion')

    if '<IntroFilm />' not in page:
        page = change(page, '<body>', '<body>\n    <IntroFilm />', 'Film overlay')
        edits.append('Mounted intro overlay')

    if 'introHeroQueued' not in motion:
        motion = change(motion, 'function start() {', 'let introHeroQueued = false;\nfunction start() {\n'+MOTION_GUARD.rstrip(), 'Hero timeline gating')
        edits.append('Deferred Hero entrance until video reveal finishes')

    if edits:
        PAGE.write_text(page, encoding='utf-8')
        MOTION.write_text(motion, encoding='utf-8')
        print('Intro video installed:')
        for note in edits:
            print('  ✓',note)
    else:
        print('Already installed. No changes necessary.')

if __name__ == '__main__':
    try:
        apply()
    except RuntimeError as exc:
        print('Install failed:',exc,file=sys.stderr)
        sys.exit(1)
