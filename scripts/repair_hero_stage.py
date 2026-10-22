#!/usr/bin/env python3
"""Repair the half-screen Hero regression without modifying other sections.

The second CSS reveal panel was not the last child of its wrapper; both panels
moved left, leaving one across the left half of the Hero. This repair removes
the overlay from index.astro and ensures updated site-finish.css disables any
stale gate markup. Safe to run multiple times.
"""
from pathlib import Path
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / 'src/pages/index.astro'
CSS = ROOT / 'public/styles/site-finish.css'
BACKUP = ROOT / '.rafi-hero-repair-backups' / 'src/pages/index.astro'

GATE = (
    r'(?m)^[ \t]*<div class="hero__entry-gate" aria-hidden="true">\s*'
    r'<span class="hero__entry-panel"></span><span class="hero__entry-panel"></span>\s*'
    r'<span class="hero__entry-gate__mark"><img[^>]*></span>\s*'
    r'</div>\s*\n?'
)


def main() -> None:
    if not INDEX.is_file():
        raise SystemExit('Missing src/pages/index.astro. Extract at your Astro project root.')
    if not CSS.is_file() or '.hero__entry-gate { display: none !important; }' not in CSS.read_text(encoding='utf-8'):
        raise SystemExit('Missing updated public/styles/site-finish.css. Extract the entire repair ZIP first.')

    original = INDEX.read_text(encoding='utf-8')
    modified, count = re.subn(GATE, '', original, count=1)
    if 'hero__entry-gate' in modified:
        # Unknown custom overlay: guard CSS already hides it, but do not remove unfamiliar markup.
        print('WARN: A custom Hero gate was found. CSS disables it, but review its markup manually.')
    if modified != original:
        if not BACKUP.exists():
            BACKUP.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(INDEX, BACKUP)
        INDEX.write_text(modified, encoding='utf-8')
        print('✓ Removed the broken split-cover overlay from index.astro.')
    else:
        print('✓ No old overlay found; Hero markup is already clean.')
    print('✓ site-finish.css permanently hides any stale/cached Hero entry gate.')
    print('✓ Logo, CV, motion.ts, Experience and smooth-scroll code left unchanged.')
    print('Next: npm run build && npm run dev, then hard-refresh the page.')


if __name__ == '__main__':
    main()
