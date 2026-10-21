#!/usr/bin/env python3
"""Idempotently install Experience Showcase after Selected Projects.

Also removes the previously-installed intro-video *wiring* and the Hero's
intro-video gate, so the Hero entrance starts on ordinary page load again.
The unused intro-video source files are left intact for easy rollback.
"""
from pathlib import Path
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / 'src/pages/index.astro'
MOTION = ROOT / 'src/scripts/motion.ts'


def backup_once(path: Path) -> None:
    backup = ROOT / '.experience-backup' / path.relative_to(ROOT)
    if not backup.exists():
        backup.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, backup)


def install() -> None:
    if not INDEX.is_file():
        raise SystemExit(f'Cannot locate {INDEX}; extract this archive at your existing Astro project root.')
    for rel in (
        'src/components/ExperienceShowcase.astro',
        'src/scripts/experience.ts',
        'src/data/experience.ts',
        'public/styles/experience.css',
        'public/assets/experience/datapulse.webp',
        'public/assets/experience/boraq.webp',
        'public/assets/experience/robotics.webp',
    ):
        if not (ROOT / rel).is_file():
            raise SystemExit(f'Missing {rel}; extract the entire ZIP before installing.')

    old = INDEX.read_text(encoding='utf-8')
    text = old
    # Remove previously installed Cloudinary opening film, as requested.
    # Only the exact inline gate containing this unique storage key is removed.
    text = re.sub(
        r'\s*<!-- Play only on the first visit in this browser\.[\s\S]*?-->'
        r'\s*<script is:inline>[\s\S]*?rafi-intro-seen-v2[\s\S]*?</script>',
        '', text, count=1,
    )
    text = re.sub(
        r'\s*<script is:inline>[\s\S]*?rafi-intro-seen-v2[\s\S]*?</script>',
        '', text, count=1,
    )
    text = re.sub(r'^\s*import IntroFilm from [^\n]+\n', '\n', text, flags=re.M)
    text = re.sub(r'^\s*<IntroFilm\s*/>\s*\n', '\n', text, flags=re.M)
    text = re.sub(r'^\s*<link rel="stylesheet" href="\./styles/intro-film\.css"\s*/>\s*\n', '\n', text, flags=re.M)
    text = re.sub(r'^\s*import [\'\"]\.\./scripts/intro-film\.ts[\'\"];?\s*\n', '\n', text, flags=re.M)

    component_import = 'import ExperienceShowcase from "../components/ExperienceShowcase.astro";'
    if component_import not in text:
        # The Astro frontmatter ends at the second leading ---.
        if not text.startswith('---'):
            raise SystemExit('Unexpected Astro frontmatter; please manually import ExperienceShowcase.')
        closing = text.find('\n---', 3)
        if closing < 0:
            raise SystemExit('Closing Astro frontmatter marker not found.')
        text = text[:closing] + '\n' + component_import + text[closing:]

    if 'href="./styles/experience.css"' not in text:
        style_line = '    <link rel="stylesheet" href="./styles/experience.css" />\n'
        marker = '    <link rel="stylesheet" href="./styles/selected-projects.css" />'
        if marker in text:
            text = text.replace(marker, marker + '\n' + style_line.rstrip(), 1)
        else:
            text = text.replace('  </head>', style_line + '  </head>', 1)

    if "import '../scripts/experience.ts';" not in text and 'import "../scripts/experience.ts";' not in text:
        script_tag = "      import '../scripts/experience.ts';"
        marker = "      import '../scripts/selected-projects.ts';"
        if marker in text:
            text = text.replace(marker, marker + '\n' + script_tag, 1)
        else:
            # Add the source to the last existing bundled module script.
            closings = list(re.finditer(r'</script>', text))
            if not closings:
                raise SystemExit('No script block found in index.astro for experience.ts import.')
            idx = closings[-1].start()
            text = text[:idx] + script_tag + '\n    ' + text[idx:]

    if '<ExperienceShowcase />' not in text:
        match = re.search(r'^([ \t]*)<SelectedProjects\s*/>', text, flags=re.M)
        if match:
            insertion_pos = match.end()
            text = text[:insertion_pos] + '\n' + match.group(1) + '<ExperienceShowcase />' + text[insertion_pos:]
        else:
            inline = re.search(r'<SelectedProjects\s*/>', text)
            if not inline:
                raise SystemExit('No <SelectedProjects /> marker found. Add <ExperienceShowcase /> after it manually.')
            text = text[:inline.end()] + '\n        <ExperienceShowcase />' + text[inline.end():]

    if text != old:
        backup_once(INDEX)
        INDEX.write_text(text, encoding='utf-8')
        print('✓ index.astro: removed intro-film wiring, added Experience section after Selected Projects')
    else:
        print('✓ index.astro: already integrated')

    if MOTION.is_file():
        prev = MOTION.read_text(encoding='utf-8')
        result = prev
        # Remove the unique intro gate, preserving the rest of start() and Lenis.
        marker = 'let introHeroQueued = false;\nfunction start() {'
        start_at = result.find(marker)
        if start_at >= 0:
            destroy_at = result.find('  destroy();', start_at)
            if destroy_at < 0 or 'intro-pending' not in result[start_at:destroy_at]:
                raise SystemExit('Hero intro gate has changed; cannot safely remove it automatically.')
            result = result[:start_at] + 'function start() {\n' + result[destroy_at:]
        if result != prev:
            backup_once(MOTION)
            MOTION.write_text(result, encoding='utf-8')
            print('✓ motion.ts: Hero entrance ungated; no new scroll controller created')
        else:
            print('✓ motion.ts: no video gate detected')
    print('✓ Experience Showcase installation complete. Run npm run dev and npm run build.')


if __name__ == '__main__':
    install()
