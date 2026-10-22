#!/usr/bin/env python3
"""Integrate the Rafi final polish patch with a currently installed Astro site.

- Safe incremental file changes, no Lenis duplicate.
- Full backup of every touched file before mutation, once.
- Repeat-safe installation. See README_INSTALL.md.
"""
from __future__ import annotations
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BACKUP = ROOT / '.rafi-finish-backups'
INDEX = ROOT / 'src/pages/index.astro'
MOTION = ROOT / 'src/scripts/motion.ts'
EXPERIENCE = ROOT / 'src/scripts/experience.ts'
SELECTED = ROOT / 'src/scripts/selected-projects.ts'
CONTACT = ROOT / 'src/components/ContactClosingChapter.astro'


def backup(file: Path) -> None:
    if file.exists():
        dst = BACKUP / file.relative_to(ROOT)
        if not dst.exists():
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(file, dst)


def write_if_changed(file: Path, value: str, label: str) -> None:
    old = file.read_text(encoding='utf-8')
    if old == value:
        print(f'OK {label}: already patched')
    else:
        backup(file)
        file.write_text(value, encoding='utf-8')
        print(f'OK {label}: patched')


def require_one(text: str, marker: str, hint: str) -> None:
    if marker not in text:
        raise RuntimeError(f'Cannot find {hint}, aborting rather than making a risky edit.')


def modify_index() -> None:
    text = INDEX.read_text(encoding='utf-8')
    # Older introductory video: remove only known first-visit gate and imports.
    text = re.sub(r'\s*<!-- Play only on the first visit in this browser\.[\s\S]*?-->\s*<script is:inline>[\s\S]*?rafi-intro-seen-v2[\s\S]*?</script>', '', text, count=1)
    # Remove exact inline script known to implement the intro pending flag.
    text = re.sub(r'\s*<script is:inline>(?:(?!</script>).)*rafi-intro-seen-v2(?:(?!</script>).)*</script>', '', text, count=1, flags=re.S)
    text = re.sub(r'^\s*import IntroFilm from [^\n]+\n', '\n', text, flags=re.M)
    text = re.sub(r'^\s*<IntroFilm\s*/>\s*\n', '\n', text, flags=re.M)
    text = re.sub(r'^\s*<link[^>]+href=["\'][^"\']*intro-film\.css["\'][^>]*>\s*\n', '\n', text, flags=re.M)
    text = re.sub(r'^\s*import ["\']\.\./scripts/intro-film\.ts["\'];?\s*\n', '\n', text, flags=re.M)
    if 'rafi-intro-seen-v2' in text or '<IntroFilm' in text or 'intro-film.css' in text or 'intro-film.ts' in text:
        raise RuntimeError('A custom intro-film gate still remains. Remove it manually before running this installer.')

    # A synchronous head hint makes reload → top happen before the page starts animating.
    if 'data-rafi-finish-head' not in text:
        require_one(text, '  <head>', 'document <head>')
        head = '''  <head>
    <script is:inline data-rafi-finish-head>
      (() => {
        const html = document.documentElement;
        if (!matchMedia('(prefers-reduced-motion: reduce)').matches) html.classList.add('rafi-motion-ready');
        const nav = performance.getEntriesByType('navigation')[0];
        if (nav?.type === 'reload') {
          try { history.scrollRestoration = 'manual'; } catch (_) {}
          html.dataset.rafiReloadTop = 'true';
          if (location.hash) history.replaceState(history.state, '', location.pathname + location.search);
          scrollTo(0, 0);
        }
      })();
    </script>'''
        text = text.replace('  <head>', head, 1)
    if 'href="/favicon.png"' not in text:
        text = text.replace('    <title>', '    <link rel="icon" type="image/png" href="/favicon.png" />\n    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />\n    <title>', 1)
    if 'href="./styles/site-finish.css"' not in text:
        require_one(text, '</head>', 'head close tag')
        text = text.replace('  </head>', '    <link rel="stylesheet" href="./styles/site-finish.css" />\n  </head>', 1)
    if "import '../scripts/site-finish.ts'" not in text and 'import "../scripts/site-finish.ts"' not in text:
        found = re.search(r'(?m)^(\s*)import ["\']\.\./scripts/motion\.ts["\'];?\s*$', text)
        if not found:
            raise RuntimeError('Cannot locate bundled motion.ts import')
        indent = found.group(1)
        text = text[:found.end()] + '\n' + indent + "import '../scripts/site-finish.ts';" + text[found.end():]

    if 'class="site-logo__symbol"' in text:
        text, n = re.subn(r'<span class="site-logo__symbol">r<span class="site-logo__period">\.</span></span>',
            '<img class="site-logo__image" src="./assets/brand/rafi-signature.webp" width="57" height="54" alt="" decoding="async" />', text, count=1)
        if not n:
            raise RuntimeError('Unrecognized site-logo symbol markup; cannot update safely.')

    # The previous overlay had an invalid :last-child selector: the right panel
    # exited left and remained over the Hero. Never insert that gate again.
    text = re.sub(
        r'(?m)^[ \t]*<div class="hero__entry-gate" aria-hidden="true">\s*'
        r'<span class="hero__entry-panel"></span><span class="hero__entry-panel"></span>\s*'
        r'<span class="hero__entry-gate__mark"><img[^>]*></span>\s*'
        r'</div>\s*\n?', '', text, count=1,
    )

    if 'class="hero__cv-link"' not in text:
        match = re.search(r'(?m)^(\s*)<a class="hero__cta"[^>]+>[\s\S]*?^\s*</a>', text)
        if not match:
            raise RuntimeError('Cannot find existing hero GitHub CTA')
        indent, original = match.group(1), match.group()
        replaced = (indent + '<div class="hero__action-group">\n' +
          original + '\n' + indent + '  <a class="hero__cv-link" href="/assets/Shajedul_Kabir_Rafi_CV.pdf" download="Shajedul_Kabir_Rafi_CV.pdf" aria-label="Download Shajedul Kabir Rafi CV as PDF">' +
          '<span>DOWNLOAD CV</span><span aria-hidden="true">↓</span></a>\n' + indent + '</div>')
        text = text[:match.start()] + replaced + text[match.end():]
    write_if_changed(INDEX, text, 'index.astro')


def modify_motion() -> None:
    if not MOTION.is_file():
        print('SKIP motion.ts absent (manual installation needed)')
        return
    original = MOTION.read_text(encoding='utf-8')
    text = original
    # The obsolete optional intro-video queue may still be present locally.
    marker = 'let introHeroQueued = false;\nfunction start() {'
    if marker in text:
        start = text.index(marker)
        stop = text.find('  destroy();', start)
        if stop < 0 or 'intro-pending' not in text[start:stop]:
            raise RuntimeError('An unfamiliar Hero-intro gating block was found in motion.ts')
        text = text[:start] + 'function start() {\n' + text[stop:]
    if 'intro-pending' in text or 'portfolio:intro-complete' in text:
        raise RuntimeError('Unsupported intro gating code still remains in motion.ts')
    if 'Sicko-inspired native RAF clock' not in text:
        text = text.replace('let ticker: ((time: number) => void) | null = null;', 'let rafId: number | null = null;')
        start = text.find('function setupLenis() {')
        end = text.find('\nfunction setupHero(', start)
        if start < 0 or end < 0:
            raise RuntimeError('Cannot find the expected Lenis function in motion.ts')
        smooth = '''// Sicko-inspired native RAF clock (never GSAP's lag-smoothed ticker).
// One Lenis, one ScrollTrigger sync, native touch scrolling.
function setupLenis() {
  if (reduced.matches || !desktopPointer.matches) return;
  lenis = new Lenis({
    autoRaf: false,
    smoothWheel: true,
    syncTouch: false,
    lerp: 0.12,
    wheelMultiplier: 0.90,
    anchors: true,
  });
  lenis.on('scroll', ScrollTrigger.update);
  const frame = (time: number) => {
    lenis?.raf(time);
    rafId = window.requestAnimationFrame(frame);
  };
  const onVisibility = () => {
    if (document.hidden) {
      lenis?.stop();
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      rafId = null;
    } else {
      lenis?.start();
      if (rafId === null) rafId = window.requestAnimationFrame(frame);
      ScrollTrigger.refresh();
    }
  };
  rafId = window.requestAnimationFrame(frame);
  document.addEventListener('visibilitychange', onVisibility, { passive: true });
  removals.push(() => document.removeEventListener('visibilitychange', onVisibility));
  ScrollTrigger.config({ ignoreMobileResize: true });
}
'''
        text = text[:start] + smooth + text[end:]
        text = text.replace('  if (ticker) gsap.ticker.remove(ticker);\n  ticker = null;', '  if (rafId !== null) window.cancelAnimationFrame(rafId);\n  rafId = null;')
        if 'let rafId: number | null = null;' not in text:
            raise RuntimeError('Unable to declare the native RAF ID; aborting')
        if 'ticker' in text and ('gsap.ticker.add(ticker)' in text or 'gsap.ticker.remove(ticker)' in text):
            raise RuntimeError('Cannot safely replace all GSAP ticker references')
        # Additional restrained, GPU-composited entrance detail.
        anchor = "  if (tl && header) tl.from(header, { autoAlpha: 0, y: -15, duration: 0.65 }, 0.1);"
        if anchor in text:
            text = text.replace(anchor, anchor + '''
  const mark = header?.querySelector<HTMLElement>('.site-logo__image');
  if (tl && mark) tl.from(mark, { autoAlpha: 0, rotate: -14, scale: .67, duration: 1.15, ease: 'expo.out' }, 0.34);
  if (tl) tl.from(hero.querySelectorAll<HTMLElement>('.hero__action-group a'),
    { autoAlpha: 0, y: 18, stagger: .13, duration: .73, ease: 'power3.out' }, 1.96);''', 1)
        text = text.replace("scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1.3 }", "scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 0.8 }")
    write_if_changed(MOTION, text, 'motion.ts')


def modify_selected() -> None:
    if not SELECTED.is_file():
        print('SKIP selected-projects.ts absent')
        return
    text = SELECTED.read_text(encoding='utf-8')
    fixed = text.replace('const visibleLimit = cinema.clientHeight + step;', 'const visibleLimit = cinemaHeight + step; // cached; never force layout on an animation tick')
    write_if_changed(SELECTED, fixed, 'selected-projects.ts')


def modify_experience() -> None:
    if not EXPERIENCE.is_file():
        print('SKIP experience.ts absent')
        return
    text = EXPERIENCE.read_text(encoding='utf-8')
    if 'CONSISTENT_STORY_REVEAL' not in text:
        old = '''      .to(toStory, { autoAlpha: 1, y: 0, duration: 0.75, ease: 'power3.out' }, 0.87)
      .fromTo(toStory.querySelectorAll('.xp__project, .xp__career-step'),
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, stagger: 0.045, duration: 0.54, ease: 'power3.out' },
        0.99);'''
        new = '''      // CONSISTENT_STORY_REVEAL: the same headline, metadata, body and list
      // choreography for DataPulse, Boraq and AUST Robotics — no hidden jumps.
      .to(toStory, { autoAlpha: 1, y: 0, duration: .52, ease: 'power3.out' }, .84)
      .fromTo(toStory.querySelectorAll(
        '.xp__story-topline, .xp__story-name, .xp__position-row, .xp__description, .xp__work-head, .xp__project, .xp__career-heading, .xp__career-step, .xp__story-footnote'),
        { autoAlpha: 0, y: 18, x: -9 },
        { autoAlpha: 1, y: 0, x: 0, duration: .68, ease: 'power3.out', stagger: .065,
          clearProps: 'transform,opacity,visibility' },
        .89);'''
        if old not in text:
            raise RuntimeError('Expected Experience transition differs from version supported by patch')
        text = text.replace(old,new)
    write_if_changed(EXPERIENCE, text, 'experience.ts')


def modify_contact() -> None:
    if not CONTACT.is_file():
        print('SKIP Contact section not installed locally')
        return
    text = CONTACT.read_text(encoding='utf-8')
    old = 'class="rc__monogram">r<span>.</span></a>'
    new = 'class="rc__monogram"><img src="./assets/brand/rafi-signature.webp" alt="" width="60" height="60" decoding="async" /></a>'
    text = text.replace(old, new)
    write_if_changed(CONTACT, text, 'ContactClosingChapter.astro')


def remove_old_intro() -> None:
    # These three files were generated by the old video-only integration.
    paths = ('src/components/IntroFilm.astro', 'src/scripts/intro-film.ts', 'public/styles/intro-film.css')
    for rel in paths:
        file = ROOT / rel
        if file.is_file():
            backup(file)
            file.unlink()
            print(f'REMOVED {rel} (backup stored)')


def main() -> None:
    if not INDEX.is_file():
        raise SystemExit('Run this installer from a ZIP extracted into the Astro project root.')
    required = ('public/assets/brand/rafi-signature.webp', 'public/assets/Shajedul_Kabir_Rafi_CV.pdf',
                'src/scripts/site-finish.ts', 'public/styles/site-finish.css', 'public/favicon.png')
    for f in required:
        if not (ROOT / f).is_file():
            raise SystemExit(f'Missing {f}. Extract the ENTIRE ZIP first.')
    # Validate all changeable sources before editing to avoid half installs.
    for fn in (modify_index, modify_motion, modify_selected, modify_experience, modify_contact, remove_old_intro):
        fn()
    print('COMPLETE. Run npm run build, and review the QA checklist in README_INSTALL.md.')


if __name__ == '__main__':
    main()
