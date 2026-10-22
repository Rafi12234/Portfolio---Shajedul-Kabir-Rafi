#!/usr/bin/env python3
"""Section 08: add Sicko Soul Client Projects after Achievements (or Experience).

Idempotent, one-time backups. Does NOT modify existing animation scripts,
Lenis, achievements, research, hero, or previous design sections.
"""
from pathlib import Path
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / 'src/pages/index.astro'
REQUIRED = (
    'src/components/ClientProjects.astro',
    'src/data/clientProjects.ts',
    'src/scripts/client-projects.ts',
    'public/styles/client-projects.css',
    'public/assets/client-projects/sicko-soul-showcase.webp',
    'public/assets/client-projects/sicko-soul-original.png',
)


def backup_once(path: Path) -> None:
    backup = ROOT / '.client-projects-backup' / path.relative_to(ROOT)
    if not backup.exists():
        backup.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, backup)


def insert_after_component(text: str, new_component: str) -> tuple[str, str]:
    if re.search(r'<ClientProjects\s*/>', text):
        return text, 'already integrated'
    for anchor in ('AchievementsGallery', 'ExperienceShowcase'):
        match = re.search(r'(?m)^([ \t]*)<' + anchor + r'\s*/>', text)
        if match:
            indent = match.group(1)
            text = text[:match.end()] + '\n' + indent + new_component + text[match.end():]
            return text, f'added after {anchor}'
    raise SystemExit('Cannot find <AchievementsGallery /> or <ExperienceShowcase /> in index.astro. Install Experience first.')


def install() -> None:
    for file in [INDEX, *(ROOT / path for path in REQUIRED)]:
        if not file.is_file():
            raise SystemExit(f'Missing {file}. Extract the entire ZIP into the Astro project root.')
    old = INDEX.read_text(encoding='utf-8')
    text = old

    if not re.search(r'(?m)^\s*import\s+ClientProjects\s+from\s+["\']\.\./components/ClientProjects\.astro["\'];?', text):
        if not text.lstrip().startswith('---'):
            raise SystemExit('Could not find Astro frontmatter.')
        marker = text.find('\n---', text.find('---') + 3)
        if marker < 0: raise SystemExit('Could not find closing Astro frontmatter.')
        text = text[:marker] + '\nimport ClientProjects from "../components/ClientProjects.astro";' + text[marker:]

    if not re.search(r'href=["\']\./styles/client-projects\.css["\']', text):
        style = '    <link rel="stylesheet" href="./styles/client-projects.css" />'
        anchor = re.search(r'<link[^>]+styles/(?:achievements|experience)\.css[^>]*>', text)
        if anchor:
            text = text[:anchor.end()] + '\n' + style + text[anchor.end():]
        elif '</head>' in text:
            text = text.replace('</head>', style + '\n  </head>', 1)
        else: raise SystemExit('No </head> found for stylesheet import.')

    if not re.search(r'import\s+["\']\.\./scripts/client-projects\.ts["\'];?', text):
        script = "      import '../scripts/client-projects.ts';"
        matches = list(re.finditer(r'<script(?!\s+is:inline)[^>]*>[\s\S]*?</script>', text))
        if not matches:
            raise SystemExit('No existing Astro-bundled <script> block found.')
        block = matches[-1]
        close_pos = text.find('</script>', block.start(), block.end())
        text = text[:close_pos] + script + '\n    ' + text[close_pos:]

    text, placement = insert_after_component(text, '<ClientProjects />')
    if text != old:
        backup_once(INDEX)
        INDEX.write_text(text, encoding='utf-8')
        print('✓ index.astro updated —', placement)
    else:
        print('✓ index.astro already installed; unchanged')
    print('✓ Client Projects (08) installed. Run npm run dev and npm run build.')

if __name__ == '__main__':
    install()
