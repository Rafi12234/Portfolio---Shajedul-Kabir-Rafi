#!/usr/bin/env python3
"""Install Section 09: Contact, preserving all earlier Astro portfolio sections.

Designed for the repo's src/pages/index.astro, and works whether the client's
latest local sections have already been added to GitHub or remain local only.
Repeat-safe; stores originals in .contact-backup/ once.
"""
from pathlib import Path
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / 'src/pages/index.astro'
REQUIRED = (
    'src/components/ContactClosingChapter.astro',
    'src/data/contact.ts',
    'src/scripts/contact-closing-chapter.ts',
    'public/styles/contact-closing-chapter.css',
)


def backup_once(file: Path) -> None:
    backup = ROOT / '.contact-backup' / file.relative_to(ROOT)
    if not backup.exists():
        backup.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(file, backup)


def install() -> None:
    for f in (INDEX, *(ROOT / path for path in REQUIRED)):
        if not f.is_file():
            raise SystemExit(f'Missing {f}. Extract the whole ZIP at the existing Astro project root first.')
    old = INDEX.read_text(encoding='utf-8')
    text = old
    # 1. Astro frontmatter import.
    if not re.search(r'''(?m)^\s*import\s+ContactClosingChapter\s+from\s+["']\.{2}/components/ContactClosingChapter\.astro["']\s*;?''', text):
        front = re.match(r'\A---\s*\n', text)
        if not front:
            raise SystemExit('Could not find opening Astro frontmatter marker.')
        end = re.search(r'(?m)^---\s*$', text[front.end():])
        if not end:
            raise SystemExit('Could not find closing Astro frontmatter marker.')
        index = front.end() + end.start()
        text = text[:index] + 'import ContactClosingChapter from "../components/ContactClosingChapter.astro";\n' + text[index:]

    # 2. Stylesheet before </head>. Reuses the static assets pattern already present.
    if not re.search(r'''href=["']\./styles/contact-closing-chapter\.css["']''', text):
        head_end = re.search(r'</head\s*>', text)
        if not head_end:
            raise SystemExit('Could not find </head> in index.astro.')
        text = text[:head_end.start()] + '    <link rel="stylesheet" href="./styles/contact-closing-chapter.css" />\n  ' + text[head_end.start():]

    # 3. Bundled module script; does not insert into an `is:inline` first-visit script.
    if not re.search(r'''import\s+["']\.{2}/scripts/contact-closing-chapter\.ts["']\s*;?''', text):
        scripts = list(re.finditer(r'<script\b([^>]*)>([\s\S]*?)</script>', text))
        candidates = [m for m in scripts if not re.search(r'\bis:inline\b', m.group(1))]
        if not candidates:
            raise SystemExit('Could not find a bundled Astro <script> block. Add the import manually.')
        block = candidates[-1]
        closing = block.end() - len('</script>')
        text = text[:closing] + "      import '../scripts/contact-closing-chapter.ts';\n    " + text[closing:]

    # 4. Ensure closing chapter follows Client Projects, Achievements, or Experience.
    if not re.search(r'<ContactClosingChapter\s*/>', text):
        for name in ('ClientProjects', 'AchievementsGallery', 'ExperienceShowcase', 'SelectedProjects'):
            match = re.search(rf'(?m)^([ \t]*)<{name}\s*/>', text)
            if match:
                text = text[:match.end()] + '\n' + match.group(1) + '<ContactClosingChapter />' + text[match.end():]
                print(f'✓ Added ContactClosingChapter after {name}')
                break
        else:
            raise SystemExit('Could not find <ClientProjects />, <AchievementsGallery />, or <ExperienceShowcase />. Install your preceding sections first.')

    # 5. Existing site's "LET'S CONNECT" navbar should navigate to the new
    # contact chapter instead of bypassing it for the old external LinkedIn URL.
    nav_pattern = re.compile(r'(<a\s+class="site-nav__contact"\s+href=")[^"]+("[^>]*>)', re.I)
    def nav_replace(m: re.Match) -> str:
        tail = re.sub(r'\s+target="[^"]*"|\s+rel="[^"]*"', '', m.group(2))
        return m.group(1) + '#contact' + tail
    text = nav_pattern.sub(nav_replace, text, count=1)
    mobile = re.search(r'(<nav class="mobile-menu__panel"[^>]*>)([\s\S]*?)(</nav>)', text)
    if mobile:
        block = mobile.group(2)
        replacement = re.sub(
            r'<a\s+href="https?://(?:www\.)?linkedin\.com/[^"]+"\s+target="_blank"\s+rel="noopener noreferrer">(LET.S CONNECT[\s\S]*?)</a>',
            r'<a href="#contact">\1</a>',
            block,
            count=1,
        )
        if replacement != block:
            text = text[:mobile.start(2)] + replacement + text[mobile.end(2):]

    if text != old:
        backup_once(INDEX)
        INDEX.write_text(text, encoding='utf-8')
        print('✓ Updated index.astro (with one-time backup)')
    else:
        print('✓ index.astro already integrated')
    print('✓ Contact section ready. Run npm run dev, then npm run build.')


if __name__ == '__main__':
    install()
