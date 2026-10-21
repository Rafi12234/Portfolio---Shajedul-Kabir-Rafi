#!/usr/bin/env python3
"""Install or upgrade the bespoke research carousel in an Astro portfolio.

Run at the portfolio root after extracting the entire ZIP there.
- Replaces Section 05 research component/data/TS/CSS with V3 package files
  (archive extraction handles these files; backup/commit BEFORE extraction).
- Adds imports/styles/scripts only if missing.
- Forces section order: Selected Projects -> Research -> Experience.
- Updates Experience folio from 05 to 06, when present.
- Safe to run twice (no duplicate imports or section tags).
"""
from pathlib import Path
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / 'src/pages/index.astro'
EXP = ROOT / 'src/components/ExperienceShowcase.astro'


def backup_once(path: Path):
    backup = ROOT / '.research-backup' / path.relative_to(ROOT)
    if path.exists() and not backup.exists():
        backup.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, backup)


def install():
    if not INDEX.is_file():
        raise SystemExit('ERROR: Could not find src/pages/index.astro. Extract at your existing Astro project root.')
    for path in [
        'src/components/ResearchPublicationsShowcase.astro',
        'src/data/research.ts',
        'src/scripts/research-publications.ts',
        'public/styles/research-publications.css',
        'public/assets/research/banglafakemmd.webp',
        'public/assets/research/driver-vision.webp',
        'public/assets/research/zero-trust.webp',
        'public/assets/research/submission.webp',
        'public/assets/research/geospatial.webp',
        'public/assets/research/histopathology.webp',
    ]:
        if not (ROOT / path).is_file():
            raise SystemExit(f'ERROR: Missing {path}. Extract the complete ZIP first.')

    previous = INDEX.read_text(encoding='utf-8')
    edited = previous
    component_import = 'import ResearchPublicationsShowcase from "../components/ResearchPublicationsShowcase.astro";'
    if not re.search(r'^import\s+ResearchPublicationsShowcase\s+from\s+.+?;$', edited, re.M):
        frontmatter_end = edited.find('\n---', 3)
        if not edited.startswith('---') or frontmatter_end < 0:
            raise SystemExit('ERROR: Cannot detect Astro frontmatter in index.astro.')
        edited = edited[:frontmatter_end] + '\n' + component_import + edited[frontmatter_end:]

    if not re.search(r'href=["\']\./styles/research-publications\.css["\']', edited):
        line = '    <link rel="stylesheet" href="./styles/research-publications.css" />'
        anchor = '    <link rel="stylesheet" href="./styles/selected-projects.css" />'
        if anchor in edited:
            edited = edited.replace(anchor, anchor + '\n' + line, 1)
        else:
            closing = re.search(r'(?m)^([ \t]*)</head>', edited)
            if not closing:
                raise SystemExit('ERROR: No closing </head> tag in index.astro.')
            indent = closing.group(1)
            edited = edited[:closing.start()] + indent + line.strip() + '\n' + edited[closing.start():]

    if not re.search(r'import\s+["\']\.\./scripts/research-publications\.ts["\']\s*;', edited):
        source = "      import '../scripts/research-publications.ts';"
        anchor = "      import '../scripts/selected-projects.ts';"
        if anchor in edited:
            edited = edited.replace(anchor, anchor + '\n' + source, 1)
        else:
            inline_script = re.search(r'<script(?!\s+is:inline)[^>]*>[\s\S]*?</script>', edited)
            if not inline_script:
                raise SystemExit('ERROR: No Astro bundled <script> block found. Import research-publications.ts manually.')
            script = inline_script.group(0)
            new_script = script.replace('</script>', source + '\n    </script>')
            edited = edited[:inline_script.start()] + new_script + edited[inline_script.end():]

    # Remove prior / duplicate mount tags then unconditionally reinsert after projects.
    edited = re.sub(r'^[ \t]*<ResearchPublicationsShowcase\s*/>\s*\n', '', edited, flags=re.M)
    m = re.search(r'(^[ \t]*)<SelectedProjects\s*/>', edited, flags=re.M)
    if not m:
        raise SystemExit('ERROR: <SelectedProjects /> marker missing; integrate component manually.')
    edited = edited[:m.end()] + '\n' + m.group(1) + '<ResearchPublicationsShowcase />' + edited[m.end():]

    if 'href="./styles/research-publications.css"' not in edited:
        raise SystemExit('ERROR: research stylesheet was not linked.')
    if not re.search(r'import\s+["\']\.\./scripts/research-publications\.ts["\']\s*;', edited):
        raise SystemExit('ERROR: research animation script was not imported.')

    if edited != previous:
        backup_once(INDEX)
        INDEX.write_text(edited, encoding='utf-8')
        print('✓ index.astro updated: Selected Projects → Research & Publications → Experience')
    else:
        print('✓ index.astro already up to date')

    if EXP.is_file():
        previous = EXP.read_text(encoding='utf-8')
        edited = previous.replace('05 / THE JOURNEY', '06 / THE JOURNEY')
        if edited != previous:
            backup_once(EXP)
            EXP.write_text(edited, encoding='utf-8')
            print('✓ Experience label updated from Section 05 to Section 06')
    print('✓ Research Liquid Glass V3 installation complete. Check npm run build.')


if __name__ == '__main__':
    install()
