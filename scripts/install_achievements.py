#!/usr/bin/env python3
"""Install Section 07 Achievements after Experience, without touching motion/other sections.

Safe to re-run. A one-time backup of any modified source file is saved.
"""
from pathlib import Path
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / 'src/pages/index.astro'
EXPERIENCE = ROOT / 'src/components/ExperienceShowcase.astro'
EXPECTED_FILES = [
    'src/components/AchievementsGallery.astro',
    'src/data/achievements.ts',
    'src/scripts/achievements.ts',
    'public/styles/achievements.css',
    'public/assets/achievements/best-panel-member.webp',
    'public/assets/achievements/best-panel-member-proof.png',
    'public/assets/achievements/hackathon-champion.webp',
    'public/assets/achievements/hackathon-champion-proof.png',
    'public/assets/achievements/research-symposium.webp',
    'public/assets/achievements/research-symposium-proof.png',
]


def backup_once(p: Path):
    dest = ROOT / '.achievements-backup' / p.relative_to(ROOT)
    if not dest.exists():
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(p, dest)


def run():
    for f in [INDEX, *(ROOT / path for path in EXPECTED_FILES)]:
        if not f.is_file():
            raise SystemExit(f'Missing required file: {f}. Extract the complete ZIP at your project root.')
    old = INDEX.read_text(encoding='utf-8')
    updated = old

    # Import Astro component in frontmatter without assuming other component order.
    if not re.search(r'(?m)^\s*import\s+AchievementsGallery\s+from\s+["\']\.\./components/AchievementsGallery\.astro["\'];?', updated):
        if not updated.lstrip().startswith('---'):
            raise SystemExit('Cannot locate Astro frontmatter in src/pages/index.astro')
        marker = updated.find('\n---', updated.find('---') + 3)
        if marker < 0:
            raise SystemExit('Cannot find closing Astro frontmatter marker')
        updated = updated[:marker] + '\nimport AchievementsGallery from "../components/AchievementsGallery.astro";' + updated[marker:]

    if not re.search(r'href=["\']\./styles/achievements\.css["\']', updated):
        link = '    <link rel="stylesheet" href="./styles/achievements.css" />'
        after_exp = re.search(r'(?m)^\s*<link rel="stylesheet" href="\./styles/experience\.css"\s*/>', updated)
        if after_exp:
            updated = updated[:after_exp.end()] + '\n' + link + updated[after_exp.end():]
        elif '</head>' in updated:
            updated = updated.replace('</head>', link + '\n  </head>', 1)
        else:
            raise SystemExit('Cannot find HTML head to attach achievements.css')

    if not re.search(r'import\s+["\']\.\./scripts/achievements\.ts["\'];?', updated):
        line = "      import '../scripts/achievements.ts';"
        after_exp = re.search(r'import\s+["\']\.\./scripts/experience\.ts["\'];?', updated)
        if after_exp:
            updated = updated[:after_exp.end()] + '\n' + line + updated[after_exp.end():]
        else:
            script = re.search(r'<script(?!\s+is:inline)[^>]*>([\s\S]*?)</script>', updated)
            if not script:
                raise SystemExit('Cannot find existing bundled <script> block')
            location = script.end() - len('</script>')
            updated = updated[:location] + line + '\n    ' + updated[location:]

    if not re.search(r'<AchievementsGallery\s*/>', updated):
        experience = re.search(r'(?m)^([ \t]*)<ExperienceShowcase\s*/>', updated)
        if not experience:
            raise SystemExit('Expected <ExperienceShowcase /> component. Install the Experience section first.')
        insertion = '\n' + experience.group(1) + '<AchievementsGallery />'
        updated = updated[:experience.end()] + insertion + updated[experience.end():]

    if updated != old:
        backup_once(INDEX)
        INDEX.write_text(updated, encoding='utf-8')
        print('✓ src/pages/index.astro — achievements inserted immediately after Experience')
    else:
        print('✓ src/pages/index.astro — already installed (no duplicate changes)')

    if EXPERIENCE.is_file():
        old_exp = EXPERIENCE.read_text(encoding='utf-8')
        new_exp = old_exp.replace('05 / THE JOURNEY', '06 / THE JOURNEY')
        if new_exp != old_exp:
            backup_once(EXPERIENCE)
            EXPERIENCE.write_text(new_exp, encoding='utf-8')
            print('✓ Existing Experience folio corrected from 05 to 06')
        else:
            print('✓ Experience folio preserved')

    print('✓ Installation complete — Selected Projects → Research → Experience → Achievements')
    print('  Run npm run dev / npm run build')


if __name__ == '__main__':
    run()
