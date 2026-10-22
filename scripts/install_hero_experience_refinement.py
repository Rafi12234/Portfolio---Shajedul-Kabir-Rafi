#!/usr/bin/env python3
"""Idempotent refinement of Rafi Hero CV CTA and Experience transitions.

This script is intentionally surgical: it does not overwrite the installed
project, research, client, contact or experience data. The bundled CSS supplies
visual fixes and the existing Experience timeline is replaced in-place.
"""
from pathlib import Path
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / 'src/pages/index.astro'
EXPERIENCE = ROOT / 'src/scripts/experience.ts'
CSS = ROOT / 'public/styles/hero-experience-refinement.css'
BACKUP_DIR = ROOT / '.rafi-experience-cv-backups'

# The original and first-polish Experience scripts share these exact anchors.
START = '    activeTimeline?.kill();\n    let swapped = false;'
END = '\n  }\n\n  buttons.forEach('
FLAG = 'RAFI_STORY_CROSSFADES_V2'

NEW_TIMELINE = '''    // RAFI_STORY_CROSSFADES_V2 — ALL THREE companies share the same origin.
    // Both articles are absolutely positioned by the bundled CSS while
    // crossfading; no second article can push the first one down the page.
    activeTimeline?.kill();
    const headlineParts = Array.from(toStory.querySelectorAll<HTMLElement>(
      '.xp__story-topline, .xp__story-name, .xp__position-row, .xp__description, .xp__work-head'
    ));
    const workParts = Array.from(toStory.querySelectorAll<HTMLElement>('.xp__project'));
    const careerParts = Array.from(toStory.querySelectorAll<HTMLElement>(
      '.xp__career-heading, .xp__career-step'
    ));
    const footnote = Array.from(toStory.querySelectorAll<HTMLElement>('.xp__story-footnote'));
    const revealParts = [...headlineParts, ...workParts, ...careerParts, ...footnote];

    // Reveal preparation happens BEFORE the timeline starts, not in an
    // onUpdate or an animation-completion callback. This eliminates a flash
    // of unstyled company text while the selected background expands.
    toStory.hidden = false;
    fromStory.style.zIndex = '1';
    toStory.style.zIndex = '2';
    gsap.set(toStory, { autoAlpha: 0, y: 24 });
    gsap.set(revealParts, { autoAlpha: 0, y: 18, x: -8 });

    let committed = false;
    const commitSelection = () => {
      if (committed) return;
      committed = true;
      setVisualState(index);
      activeIndex = index;
    };
    const cleanup = () => {
      commitSelection();
      fromStory.hidden = true;
      gsap.set(fromStory, { clearProps: 'transform,opacity,visibility' });
      gsap.set(toStory, { clearProps: 'transform,opacity,visibility' });
      gsap.set(revealParts, { clearProps: 'transform,opacity,visibility' });
      fromStory.style.removeProperty('z-index');
      toStory.style.removeProperty('z-index');
      gsap.set(expander, { clearProps: 'all' });
      animating = false;
      activeTimeline = null;
    };

    activeTimeline = gsap.timeline({
      defaults: { overwrite: 'auto' },
      onComplete: cleanup,
    });
    activeTimeline
      .to(fromStory, { autoAlpha: 0, x: -25, duration: .36, ease: 'power2.inOut' }, .06)
      .to(expander, {
        clipPath: 'inset(0% 0% 0% 0% round 0px)',
        duration: 1.09,
        ease: 'power3.inOut',
      }, 0)
      .call(commitSelection, [], .70)
      .to(expander, { autoAlpha: 0, duration: .48, ease: 'power2.inOut' }, .90)
      .to(toStory, { autoAlpha: 1, y: 0, duration: .62, ease: 'power3.out' }, .77)
      .to(headlineParts, {
        autoAlpha: 1, x: 0, y: 0, duration: .65, stagger: .085, ease: 'power3.out',
      }, .84)
      .to(workParts, {
        autoAlpha: 1, x: 0, y: 0, duration: .48, stagger: .065, ease: 'power3.out',
      }, 1.13);
    // No empty GSAP tweens for companies without a leadership timeline.
    if (careerParts.length) activeTimeline.to(careerParts, {
      autoAlpha: 1, x: 0, y: 0, duration: .48, stagger: .07, ease: 'power3.out',
    }, 1.24);
    if (footnote.length) activeTimeline.to(footnote, {
      autoAlpha: 1, x: 0, y: 0, duration: .46, ease: 'power3.out',
    }, 1.36);'''


def backup_once(path: Path) -> None:
    backup = BACKUP_DIR / path.relative_to(ROOT)
    if not backup.exists():
        backup.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, backup)


def patch_index() -> None:
    original = INDEX.read_text(encoding='utf-8')
    if 'href="./styles/hero-experience-refinement.css"' in original:
        print('✓ index.astro: stylesheet already registered')
        return
    if '</head>' not in original:
        raise RuntimeError('Could not find </head> in src/pages/index.astro')
    addition = '    <link rel="stylesheet" href="./styles/hero-experience-refinement.css" />\n'
    updated = original.replace('</head>', addition + '  </head>', 1)
    backup_once(INDEX)
    INDEX.write_text(updated, encoding='utf-8')
    print('✓ index.astro: new stylesheet loaded after previous styles')


def patch_experience() -> None:
    if not EXPERIENCE.is_file():
        raise RuntimeError('Missing src/scripts/experience.ts. Please install Experience before using this patch.')
    original = EXPERIENCE.read_text(encoding='utf-8')
    if FLAG in original:
        print('✓ experience.ts: smoother transitions already installed')
        return
    start = original.find(START)
    end = original.find(END, start + len(START))
    if start < 0 or end < 0:
        raise RuntimeError('Unsupported experience.ts layout. No Experience file was changed.')
    between = original[start:end]
    if 'activeTimeline = gsap.timeline(' not in between or 'toStory.hidden = false;' not in between:
        raise RuntimeError('Unexpected existing Experience timeline: refusing to overwrite customized behavior.')
    updated = original[:start] + NEW_TIMELINE + original[end:]
    backup_once(EXPERIENCE)
    EXPERIENCE.write_text(updated, encoding='utf-8')
    print('✓ experience.ts: stable overlay and all-company staggered reveal updated')


def main() -> None:
    if not INDEX.is_file() or not CSS.is_file() or not EXPERIENCE.is_file():
        raise SystemExit('Extract the ZIP into the current Astro project root before running this installer.')
    # Validate file contents before making ANY mutations.
    index = INDEX.read_text(encoding='utf-8')
    experience = EXPERIENCE.read_text(encoding='utf-8')
    if '</head>' not in index or ('<ExperienceShowcase' not in index and 'ExperienceShowcase' not in index):
        raise SystemExit('Expected the installed Experience section and an Astro head; cannot patch safely.')
    if FLAG not in experience:
        if START not in experience or END not in experience:
            raise SystemExit('Experience script does not match the supported versions; no files changed.')
    patch_experience()
    patch_index()
    print('✓ Complete. Run npm run build and refresh the browser.')


if __name__ == '__main__':
    main()
