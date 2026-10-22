#!/usr/bin/env python3
"""Apply RAFI's verified, minimal animation-budget improvements.

Run from anywhere:
    python apply_optimizations.py /path/to/Portfolio---Shajedul-Kabir-Rafi

The script edits an existing checkout because the original binary image backups
cannot be distributed from this package. It checks EVERY anchor before writing
anything, backs up modified files, and can be rerun without duplicated edits.
"""
from __future__ import annotations

import argparse
import os
from pathlib import Path
import shutil
import sys
from datetime import datetime, timezone

PACKAGE = Path(__file__).resolve().parent
MODULE = 'src/scripts/scroll-budget.ts'
STYLES = 'public/styles/scroll-performance.css'


def replace_once(src: str, old: str, new: str, name: str) -> str:
    if new in src:
        return src  # already applied (old may be a substring of new)
    if src.count(old) == 1:
        return src.replace(old, new, 1)
    raise ValueError(f'Unexpected source for {name}: expected an unambiguous anchor. No files were written.')


def apply_changes(root: Path, dry_run: bool) -> list[str]:
    required = [
        'src/pages/index.astro',
        'src/scripts/motion.ts',
        'src/scripts/engineering-universe.ts',
        'src/scripts/selected-projects.ts',
        'src/scripts/research-publications.ts',
        'public/styles/hero.css',
    ]
    missing = [path for path in required if not (root / path).is_file()]
    if missing:
        raise ValueError('Missing portfolio files: ' + ', '.join(missing))

    original = {path: (root / path).read_text(encoding='utf-8') for path in required}
    updated = dict(original)

    # Runtime is initialized exactly once, before the section animation modules.
    path = 'src/scripts/motion.ts'
    updated[path] = replace_once(
        updated[path],
        "import '../styles/motion.css';",
        "import '../styles/motion.css';\nimport './scroll-budget';",
        path + ': import governor',
    )

    # Small devices don't need animated CSS custom-property hero parallax on
    # every touch scroll frame. Desktop keeps the same cinematic scrub effect.
    old = """  // Separate pointer and scroll custom props avoid clobbering CSS centering.
  gsap.to(stage, {
    '--scroll-portrait': '-40px', '--scroll-title': '26px', '--scroll-orb': '16px',
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.7, invalidateOnRefresh: true },
  });
  if (!desktopPointer.matches) return;"""
    new = """  // Parallax scrub is a desktop detail, not a touch-scrolling workload.
  // Keep the existing composition unchanged on desktop.
  if (desktopPointer.matches) {
    gsap.to(stage, {
      '--scroll-portrait': '-40px', '--scroll-title': '26px', '--scroll-orb': '16px',
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.25, invalidateOnRefresh: true },
    });
  }
  if (!desktopPointer.matches) return;"""
    updated[path] = replace_once(updated[path], old, new, path + ': desktop-only parallax')

    # The flight scene's GSAP loops are paused while the scroll interaction
    # needs the rendering budget. Existing IntersectionObserver remains owner.
    path = 'src/scripts/engineering-universe.ts'
    updated[path] = replace_once(
        updated[path],
        'const playing = () => !disposed && inView && !document.hidden && !manualPause && !modalOpen && !reducedMotion.matches;',
        "const playing = () => !disposed && inView && !document.hidden && !manualPause && !modalOpen && !reducedMotion.matches && !document.documentElement.classList.contains('rafi-is-scrolling');",
        path + ': playing predicate',
    )
    updated[path] = replace_once(
        updated[path],
        '  visibilityObserver.observe(stage);',
        "  visibilityObserver.observe(stage);\n  const onScrollActivity = () => updateControls();\n  document.addEventListener('rafi:scroll-activity', onScrollActivity);",
        path + ': on scroll activity',
    )
    updated[path] = replace_once(
        updated[path],
        '    visibilityObserver.disconnect();',
        "    visibilityObserver.disconnect();\n    document.removeEventListener('rafi:scroll-activity', onScrollActivity);",
        path + ': dispose listener',
    )

    # Selected Projects stops its per-frame 18-card renderer during a gesture.
    path = 'src/scripts/selected-projects.ts'
    updated[path] = replace_once(
        updated[path],
        'function pauseNeeded() { return document.hidden || !inView || hovered || focused || manuallyPaused || inspecting || rm.matches; }',
        "function pauseNeeded() { return document.hidden || !inView || hovered || focused || manuallyPaused || inspecting || rm.matches || document.documentElement.classList.contains('rafi-is-scrolling'); }",
        path + ': pause predicate',
    )
    updated[path] = replace_once(
        updated[path],
        '  observer.observe(cinema);',
        "  observer.observe(cinema);\n  const onScrollActivity = () => updateControls();\n  document.addEventListener('rafi:scroll-activity', onScrollActivity);",
        path + ': scroll listener',
    )
    updated[path] = replace_once(
        updated[path],
        '    stopMotion(); observer.disconnect(); intro?.kill();',
        "    stopMotion(); observer.disconnect(); intro?.kill();\n    document.removeEventListener('rafi:scroll-activity', onScrollActivity);",
        path + ': cleanup',
    )

    # Research orbit stops updating six DOM properties for each card every
    # frame while a visitor is scrolling through it.
    path = 'src/scripts/research-publications.ts'
    updated[path] = replace_once(
        updated[path],
        'const shouldRun = () => isVisible && !document.hidden && !reduced.matches && !isHovered && !keyboardFocused && !isDragging && !manualPaused && !travelling && openIndex === null;',
        "const shouldRun = () => isVisible && !document.hidden && !reduced.matches && !isHovered && !keyboardFocused && !isDragging && !manualPaused && !travelling && openIndex === null && !document.documentElement.classList.contains('rafi-is-scrolling');",
        path + ': shouldRun predicate',
    )
    updated[path] = replace_once(
        updated[path],
        "  document.addEventListener('visibilitychange', onVisibility);",
        "  document.addEventListener('visibilitychange', onVisibility);\n  const onScrollActivity = () => syncTicker();\n  document.addEventListener('rafi:scroll-activity', onScrollActivity);",
        path + ': scroll activity listener',
    )
    updated[path] = replace_once(
        updated[path],
        "    document.removeEventListener('visibilitychange', onVisibility);",
        "    document.removeEventListener('visibilitychange', onVisibility);\n    document.removeEventListener('rafi:scroll-activity', onScrollActivity);",
        path + ': cleanup',
    )

    # Performance-only stylesheet is last, leaving original mobile/laptop
    # art direction untouched. Astro still serves all images via Cloudinary.
    path = 'src/pages/index.astro'
    updated[path] = replace_once(
        updated[path],
        '      href="./styles/hero-performance-v4.css"\n    />',
        '      href="./styles/hero-performance-v4.css"\n    />\n    <link rel="stylesheet" href="./styles/scroll-performance.css" />',
        path + ': style link',
    )

    # Include the two newly authored files in the same atomic edit plan.
    for rel in (MODULE, STYLES):
        data = (PACKAGE / rel).read_text(encoding='utf-8')
        existing = root / rel
        if existing.is_file() and existing.read_text(encoding='utf-8') != data:
            raise ValueError(f'{rel} already exists with different content; refusing to overwrite.')
        updated[rel] = data
        if existing.is_file():
            original[rel] = existing.read_text(encoding='utf-8')

    changed = [rel for rel, content in updated.items() if original.get(rel) != content]
    if dry_run or not changed:
        return changed

    # Validate all source expectations BEFORE making even the first backup.
    backup_dir = root / '.rafi-performance-backup' / datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
    for rel in changed:
        target = root / rel
        if target.exists():
            destination = backup_dir / rel
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(target, destination)

    # Atomic per-file swap. Restore from the saved backups if writing fails.
    committed: list[str] = []
    try:
        for rel in changed:
            target = root / rel
            target.parent.mkdir(parents=True, exist_ok=True)
            temp = target.with_name(target.name + '.rafi-tmp')
            temp.write_text(updated[rel], encoding='utf-8')
            os.replace(temp, target)
            committed.append(rel)
    except Exception:
        for rel in committed:
            target = root / rel
            backup = backup_dir / rel
            if backup.is_file():
                shutil.copy2(backup, target)
            else:
                target.unlink(missing_ok=True)
        raise
    return changed


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('repository', type=Path, help='Path to your current Portfolio repository checkout')
    parser.add_argument('--check', action='store_true', help='Check compatibility without modifying any file')
    args = parser.parse_args()
    try:
        root = args.repository.expanduser().resolve()
        changed = apply_changes(root, args.check)
    except (ValueError, OSError) as exc:
        print('ERROR:', exc, file=sys.stderr)
        return 1
    print(('COMPATIBLE' if args.check else 'APPLIED') + f': {len(changed)} file(s) ' + ('would change' if args.check else 'updated'))
    for path in changed:
        print('  ' + path)
    print('No changes were pushed to GitHub.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
