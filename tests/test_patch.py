"""Small deterministic source anchors and idempotence smoke tests.
Run: python -m unittest discover -s tests -v
The tests intentionally do NOT substitute for an Astro production build.
"""
import tempfile
from pathlib import Path
import sys
import unittest
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from apply_optimizations import apply_changes, replace_once


class PatchTests(unittest.TestCase):
    def test_idempotent_replace(self):
        self.assertEqual(replace_once('HEADER\nxyz', 'xyz', 'xyz\nnew', 'x'), 'HEADER\nxyz\nnew')
        self.assertEqual(replace_once('HEADER\nxyz\nnew', 'xyz', 'xyz\nnew', 'x'), 'HEADER\nxyz\nnew')
        with self.assertRaises(ValueError):
            replace_once('different', 'xyz', 'new', 'missing')

    def test_apply_and_dry_run_no_duplicates(self):
        fixtures = {
            'src/pages/index.astro': '<link\n      href="./styles/hero-performance-v4.css"\n    />',
            'src/scripts/motion.ts': """import '../styles/motion.css';
  // Separate pointer and scroll custom props avoid clobbering CSS centering.
  gsap.to(stage, {
    '--scroll-portrait': '-40px', '--scroll-title': '26px', '--scroll-orb': '16px',
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.7, invalidateOnRefresh: true },
  });
  if (!desktopPointer.matches) return;""",
            'src/scripts/engineering-universe.ts': """const playing = () => !disposed && inView && !document.hidden && !manualPause && !modalOpen && !reducedMotion.matches;
  visibilityObserver.observe(stage);
    visibilityObserver.disconnect();""",
            'src/scripts/selected-projects.ts': """function pauseNeeded() { return document.hidden || !inView || hovered || focused || manuallyPaused || inspecting || rm.matches; }
  observer.observe(cinema);
    stopMotion(); observer.disconnect(); intro?.kill();""",
            'src/scripts/research-publications.ts': """const shouldRun = () => isVisible && !document.hidden && !reduced.matches && !isHovered && !keyboardFocused && !isDragging && !manualPaused && !travelling && openIndex === null;
  document.addEventListener('visibilitychange', onVisibility);
    document.removeEventListener('visibilitychange', onVisibility);""",
            'public/styles/hero.css': '.hero { position: relative; }',
        }
        with tempfile.TemporaryDirectory() as name:
            root = Path(name)
            for rel, contents in fixtures.items():
                f = root / rel
                f.parent.mkdir(parents=True, exist_ok=True)
                f.write_text(contents, encoding='utf-8')
            self.assertEqual(len(apply_changes(root, True)), 7)
            self.assertEqual(len(apply_changes(root, False)), 7)
            self.assertEqual(apply_changes(root, False), [])
            css = (root / 'public/styles/scroll-performance.css').read_text()
            self.assertIn('animation-play-state: paused !important', css)
            result = (root / 'src/scripts/motion.ts').read_text()
            self.assertIn("import './scroll-budget'", result)
            self.assertEqual(result.count("import './scroll-budget'"), 1)
            self.assertIn('if (desktopPointer.matches)', result)
            self.assertEqual((root / 'src/pages/index.astro').read_text().count('scroll-performance.css'), 1)
            self.assertEqual(len(apply_changes(root, True)), 0)

    def test_fail_atomic_on_missing_anchor(self):
        with tempfile.TemporaryDirectory() as name:
            root = Path(name)
            files = ['src/pages/index.astro','src/scripts/motion.ts','src/scripts/engineering-universe.ts','src/scripts/selected-projects.ts','src/scripts/research-publications.ts','public/styles/hero.css']
            for f in files:
                path = root / f
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text('WRONG CODE', encoding='utf-8')
            with self.assertRaises(ValueError):
                apply_changes(root, False)
            self.assertFalse((root / 'src/scripts/scroll-budget.ts').exists())


if __name__ == '__main__':
    unittest.main()
