#!/usr/bin/env python3
"""Upgrade a local RAFI portfolio checkout: continuous animations, less paint work.

Run from the repository root:
    python fix_continuous_scroll.py .

Writes ORIGINAL source files, not replacement app layers. Supports both an
unpatched checkout and the earlier scroll-budget patch, including its optional
runtime files. Produces an audit diff and a full updated project ZIP.
"""
from __future__ import annotations
import argparse
import difflib
import os
from pathlib import Path
import shutil
import subprocess
import sys
import zipfile

NEEDED = (
    'src/pages/index.astro', 'src/scripts/motion.ts',
    'src/scripts/engineering-universe.ts', 'src/scripts/selected-projects.ts',
    'src/scripts/research-publications.ts', 'public/styles/hero.css',
    'public/styles/engineering-universe.css', 'public/styles/client-projects.css',
    'public/styles/contact-closing-chapter.css', 'public/styles/experience.css',
    'public/styles/beyond-title.css', 'public/styles/research-publications.css',
    'public/styles/achievements.css',
)
OLD_FILES = ('src/scripts/scroll-budget.ts', 'public/styles/scroll-performance.css')
NOTICE = '/* RAFI / CONTINUOUS SCROLL V2 — animations stay active while scrolling. */'


def swap(src: str, old: str, new: str, label: str, *, optional: bool = False) -> str:
    if new in src and src.count(new) == 1:
        return src
    if src.count(old) == 1:
        return src.replace(old, new, 1)
    if optional and old not in src:
        return src
    raise ValueError(f'{label}: expected a single matching original code segment; refusing to guess.')


def remove(src: str, pattern: str, label: str) -> str:
    if src.count(pattern) > 1:
        raise ValueError(f'{label}: repeated snippet; refusing to guess.')
    return src.replace(pattern, '', 1)


def edit_source(root: Path) -> tuple[dict[str, str], dict[str, str]]:
    missing = [p for p in NEEDED if not (root / p).is_file()]
    if missing:
        raise ValueError('Missing original source files:\n  ' + '\n  '.join(missing) + '\nRun this from the REAL repository root.')
    before = {p: (root / p).read_text(encoding='utf-8') for p in NEEDED}
    after = dict(before)

    # Revert earlier broken scroll-budget, including runtime listener wiring.
    p = 'src/pages/index.astro'
    s = before[p]
    s = remove(s, '    <link rel="stylesheet" href="./styles/scroll-performance.css" />\n', p)
    after[p] = s

    p = 'src/scripts/motion.ts'
    s = before[p]
    s = remove(s, "import './scroll-budget';\n", p)
    old = """  // Parallax scrub is a desktop detail, not a touch-scrolling workload.
  // Keep the existing composition unchanged on desktop.
  if (desktopPointer.matches) {
    gsap.to(stage, {
      '--scroll-portrait': '-40px', '--scroll-title': '26px', '--scroll-orb': '16px',
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.25, invalidateOnRefresh: true },
    });
  }
  if (!desktopPointer.matches) return;"""
    new = """  // Keep the original parallax moving while scrolling, on touch and wheel.
  // Shorter scrub catch-up avoids animations continuing long after the gesture.
  gsap.to(stage, {
    '--scroll-portrait': '-40px', '--scroll-title': '26px', '--scroll-orb': '16px',
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.18, invalidateOnRefresh: true },
  });
  if (!desktopPointer.matches) return;"""
    s = swap(s, old, new, p + ' previous hero patch', optional=True)
    s = swap(s,
        "scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.7, invalidateOnRefresh: true },",
        "scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.18, invalidateOnRefresh: true },",
        p + ' original hero scrub', optional=True)
    if "scrub: 0.18, invalidateOnRefresh: true" not in s:
        raise ValueError(p + ': no recognizable hero ScrollTrigger')
    after[p] = s

    p = 'src/scripts/engineering-universe.ts'
    s = before[p]
    s = remove(s, " && !document.documentElement.classList.contains('rafi-is-scrolling')", p)
    s = remove(s, "  const onScrollActivity = () => updateControls();\n  document.addEventListener('rafi:scroll-activity', onScrollActivity);\n", p)
    s = remove(s, "    document.removeEventListener('rafi:scroll-activity', onScrollActivity);", p)
    s = swap(s,
        "const activeSlotCount = smallScreen.matches ? 4 : slots.length;",
        "const activeSlotCount = smallScreen.matches ? Math.min(3, slots.length) : Math.min(8, slots.length);",
        p + ': offscreen GPU layer reduction')
    after[p] = s

    p = 'src/scripts/selected-projects.ts'
    s = before[p]
    s = remove(s, " || document.documentElement.classList.contains('rafi-is-scrolling')", p)
    s = remove(s, "  const onScrollActivity = () => updateControls();\n  document.addEventListener('rafi:scroll-activity', onScrollActivity);\n", p)
    s = remove(s, "    document.removeEventListener('rafi:scroll-activity', onScrollActivity);", p)
    # Active cards continue animating at native frame rate; existing offscreen
    # visibility observer, layout caches and composition lifecycle are retained.
    after[p] = s

    p = 'src/scripts/research-publications.ts'
    s = before[p]
    s = remove(s, " && !document.documentElement.classList.contains('rafi-is-scrolling')", p)
    s = remove(s, "  const onScrollActivity = () => syncTicker();\n  document.addEventListener('rafi:scroll-activity', onScrollActivity);\n", p)
    s = remove(s, "    document.removeEventListener('rafi:scroll-activity', onScrollActivity);", p)
    # This CSS variable has no consumers in research-publications.css.
    # Avoid a style recalc/write for every orbit card every frame.
    s = remove(s, "      item.style.setProperty('--depth', ((frontDepth + 1) / 2).toFixed(3));\n", p)
    after[p] = s

    p = 'public/styles/hero.css'
    s = before[p]
    s = swap(s,
        '.portfolio-shell__atmosphere { position: absolute; z-index: -2; inset: 0; pointer-events: none;',
        '.portfolio-shell__atmosphere { position: absolute; z-index: -2; inset: 0 0 auto; height: clamp(900px, 110svh, 1200px); pointer-events: none;',
        p + ': background paint bounds')
    s = swap(s,
        '.portfolio-shell__texture { position: absolute; z-index: 20; inset: 0; pointer-events: none; opacity: .22;',
        '.portfolio-shell__texture { position: fixed; z-index: 20; inset: 0; height: 100svh; pointer-events: none; opacity: .22; background-size: 180px 180px; background-repeat: repeat;',
        p + ': grain compositing surface')
    # Avoid a costly blended layer on the hero disc; its atmosphere remains.
    s = swap(s, 'opacity: .14; mix-blend-mode: screen;',
        'opacity: .11; mix-blend-mode: normal;', p + ': large mixed-blend layer')
    after[p] = s

    p = 'public/styles/engineering-universe.css'
    s = before[p]
    note = f"""
{NOTICE}
.eu__flight {{ will-change: auto; }}
@media (prefers-reduced-motion: no-preference) {{
  .eu--running .eu__flight {{ will-change: transform, opacity; }}
}}
"""
    if NOTICE not in s:
        s = s.rstrip() + '\n' + note
    after[p] = s

    p = 'public/styles/client-projects.css'
    s = before[p]
    s = swap(s, 'filter:blur(44px);opacity:.28;will-change:transform',
        'filter:none;opacity:.28;will-change:auto', p + ': ambient blur')
    s = swap(s, 'filter:blur(12px);animation:cp-halo',
        'filter:none;animation:cp-halo', p + ': halo blur')
    note = f"""
{NOTICE}
.cp--motion-active .cp__aura {{ will-change: transform; }}
.cp:not(.cp--motion-active) .cp__aura {{ will-change: auto; }}
"""
    if NOTICE not in s:
        s = s.rstrip() + '\n' + note
    after[p] = s

    p = 'public/styles/contact-closing-chapter.css'
    s = before[p]
    s = swap(s, 'filter: blur(72px); will-change: transform;',
        'filter: none; will-change: auto;', p + ': huge glow blur')
    note = f"""
{NOTICE}
.rc:not([data-contact-motion='off']) .rc__glow {{ will-change: transform; }}
.rc[data-contact-motion='off'] .rc__glow {{ will-change: auto; }}
"""
    if NOTICE not in s:
        s = s.rstrip() + '\n' + note
    after[p] = s

    p = 'public/styles/experience.css'
    s = before[p]
    s = swap(s, 'will-change: clip-path;', 'will-change: auto;', p + ': hidden expander paint layer')
    after[p] = s

    # Move the previous patch's low-cost mobile surface treatments INTO the
    # actual section styles rather than another overriding CSS file.
    for p, selector, extra in (
        ('public/styles/beyond-title.css', '.bt__glass', 'backdrop-filter: none !important; -webkit-backdrop-filter: none !important;'),
        ('public/styles/research-publications.css', '.rgl__player', 'backdrop-filter: none !important; -webkit-backdrop-filter: none !important;'),
        ('public/styles/achievements.css', '.aw__photo-blur', 'filter: none !important; opacity: .22;'),
    ):
        s = before[p]
        if NOTICE not in s:
            s = s.rstrip() + f'\n\n{NOTICE}\n@media (max-width: 760px) {{\n  {selector} {{ {extra} }}\n}}\n'
        after[p] = s

    leftovers=[p for p,s in after.items() if 'rafi-is-scrolling' in s or 'rafi:scroll-activity' in s or "import './scroll-budget'" in s]
    if leftovers:
        raise ValueError('A scroll-freeze hook remains in: '+', '.join(leftovers))
    if 'const activeSlotCount' not in after['src/scripts/engineering-universe.ts']:
        raise ValueError('Engineering Universe must remain animated.')
    if 'onUpdate: renderMotion' not in after['src/scripts/selected-projects.ts']:
        raise ValueError('Selected Work animation hook missing.')
    if 'gsap.ticker.add(tick)' not in after['src/scripts/research-publications.ts']:
        raise ValueError('Research orbit ticker missing.')
    return before, after


def generate_diff(before: dict[str,str], after: dict[str,str]) -> str:
    result=[]
    for path in NEEDED:
        if before[path] == after[path]:
            continue
        result.extend(difflib.unified_diff(
            before[path].splitlines(True), after[path].splitlines(True),
            fromfile='a/'+path, tofile='b/'+path))
    return ''.join(result)


def zip_checkout(root: Path, output: Path) -> tuple[int,int]:
    exclude_names={'.git','.astro','node_modules','dist','.rafi-scroll-backup','.rafi-performance-backup','__pycache__','.next','.vercel'}
    exclude_patterns={'.DS_Store','Thumbs.db','.npmrc','.pypirc'}
    count=0; size=0
    with zipfile.ZipFile(output,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6,allowZip64=True) as zipf:
        for p in root.rglob('*'):
            if not p.is_file() or p.is_symlink(): continue
            rel=p.relative_to(root)
            if any(part in exclude_names for part in rel.parts) or p.name in exclude_patterns or p.name.startswith('.env'):continue
            if p.resolve()==output.resolve():continue
            zipf.write(p,arcname='Portfolio---Shajedul-Kabir-Rafi/'+rel.as_posix())
            count+=1;size+=p.stat().st_size
    return count,size


def run(root:Path, dry:bool, make_zip:bool)->list[str]:
    root=root.resolve()
    before,after=edit_source(root)
    changed=[p for p in NEEDED if before[p]!=after[p]]
    dropped=[p for p in OLD_FILES if (root/p).is_file()]
    print('Source files affected:',len(changed))
    for p in changed:print('  EDIT',p)
    for p in dropped:print('  REMOVE unused previous file',p)
    if dry:return changed

    backup=root/'.rafi-scroll-backup'
    for p in changed + dropped:
        dst=backup/p;dst.parent.mkdir(parents=True,exist_ok=True)
        shutil.copy2(root/p,dst)
    try:
        for p in changed:
            dst=root/p; tmp=dst.with_name(dst.name+'.perf-temp')
            tmp.write_text(after[p],encoding='utf-8',newline='')
            os.replace(tmp,dst)
        # Old governor and stylesheet are no longer referenced; retain originals in backup.
        for p in dropped:(root/p).unlink()
        diff=generate_diff(before,after)
        (root/'RAFI-CONTINUOUS-SCROLL-CHANGES.diff').write_text(diff,encoding='utf-8')
        if make_zip:
            archive=root.parent/'Rafi-Portfolio-Continuous-Scroll-Full-Updated.zip'
            n,b=zip_checkout(root,archive)
            print('FULL ZIP:',archive,f'({n} files, original size {b/1048576:.1f} MiB)')
    except Exception:
        for p in changed+dropped:
            shutil.copy2(backup/p,root/p)
        raise
    print('Actual Astro/TypeScript/CSS files updated; no new animation governor.')
    print('Review changes: git diff -- src/pages/index.astro src/scripts public/styles')
    print('Validate: npm run build')
    return changed


def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('repository',nargs='?',default='.',type=Path)
    ap.add_argument('--check',action='store_true',help='Check source compatibility without edits')
    ap.add_argument('--no-zip',action='store_true',help='Do not generate the full-project ZIP')
    a=ap.parse_args()
    try:run(a.repository,a.check,not a.no_zip)
    except Exception as exc:
        print('ERROR:',exc,file=sys.stderr);sys.exit(1)

if __name__=='__main__':main()
