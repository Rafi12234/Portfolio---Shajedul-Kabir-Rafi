import tempfile
import unittest
import sys
import zipfile
from pathlib import Path

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from fix_continuous_scroll import edit_source,run,NEEDED,NOTICE


BASE={
 'src/pages/index.astro': '<link href="./styles/hero-performance-v4.css"/>\n<!-- Shared motion -->\n',
 'src/scripts/motion.ts': '''import '../styles/motion.css';
  // Separate pointer and scroll custom props avoid clobbering CSS centering.
  gsap.to(stage, {
    '--scroll-portrait': '-40px', '--scroll-title': '26px', '--scroll-orb': '16px',
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.7, invalidateOnRefresh: true },
  });
  if (!desktopPointer.matches) return;''',
 'src/scripts/engineering-universe.ts': '''const playing = () => !disposed && inView && !document.hidden && !manualPause && !modalOpen && !reducedMotion.matches;
const activeSlotCount = smallScreen.matches ? 4 : slots.length;
  visibilityObserver.observe(stage);
    visibilityObserver.disconnect();''',
 'src/scripts/selected-projects.ts': '''function pauseNeeded() { return document.hidden || !inView || hovered || focused || manuallyPaused || inspecting || rm.matches; }
  observer.observe(cinema);
    stopMotion(); observer.disconnect(); intro?.kill();
        onUpdate: renderMotion,''',
 'src/scripts/research-publications.ts': '''const shouldRun = () => isVisible && !document.hidden && !reduced.matches && !isHovered && !keyboardFocused && !isDragging && !manualPaused && !travelling && openIndex === null;
      item.style.setProperty('--depth', ((frontDepth + 1) / 2).toFixed(3));
  document.addEventListener('visibilitychange', onVisibility);
    document.removeEventListener('visibilitychange', onVisibility);
    gsap.ticker.add(tick);''',
 'public/styles/hero.css': '''.portfolio-shell__atmosphere { position: absolute; z-index: -2; inset: 0; pointer-events: none; background: linear-gradient(red,black); }
.portfolio-shell__texture { position: absolute; z-index: 20; inset: 0; pointer-events: none; opacity: .22; background-image: url('grain.svg'); }\n.hero__orb::before{opacity: .14; mix-blend-mode: screen;}''',
 'public/styles/engineering-universe.css': '.eu__flight {opacity:0;will-change:transform,opacity;}\n.eu--running .eu__code-track{animation-play-state:running}',
 'public/styles/client-projects.css': '.cp__aura {filter:blur(44px);opacity:.28;will-change:transform}\n.cp__halo{filter:blur(12px);animation:cp-halo 12s linear infinite}',
 'public/styles/contact-closing-chapter.css': '.rc__glow{filter: blur(72px); will-change: transform;}\n',
 'public/styles/experience.css': '.xp__expander{will-change: clip-path;}\n',
 'public/styles/beyond-title.css': '.bt__glass { backdrop-filter: blur(20px); }',
 'public/styles/research-publications.css': '.rgl__player { backdrop-filter: blur(18px); }',
 'public/styles/achievements.css': '.aw__photo-blur { filter: blur(38px); }',
}


def make_fixture(root:Path,previous:bool=False):
    files=dict(BASE)
    if previous:
        files['src/pages/index.astro']=files['src/pages/index.astro'].replace('<!-- Shared motion -->','    <link rel="stylesheet" href="./styles/scroll-performance.css" />\n<!-- Shared motion -->')
        files['src/scripts/motion.ts']=files['src/scripts/motion.ts'].replace("import '../styles/motion.css';","import '../styles/motion.css';\nimport './scroll-budget';").replace('  // Separate pointer and scroll custom props avoid clobbering CSS centering.\n  gsap.to(stage, {', '''  // Parallax scrub is a desktop detail, not a touch-scrolling workload.
  // Keep the existing composition unchanged on desktop.
  if (desktopPointer.matches) {
    gsap.to(stage, {''').replace("scrub: 0.7,",'scrub: 0.25,').replace("    '--scroll-portrait':","      '--scroll-portrait':").replace("    ease: 'none',","      ease: 'none',").replace("    scrollTrigger:","      scrollTrigger:").replace("  });\n  if (!desktopPointer.matches)","    });\n  }\n  if (!desktopPointer.matches)")
        files['src/scripts/engineering-universe.ts']=files['src/scripts/engineering-universe.ts'].replace('!reducedMotion.matches;',"!reducedMotion.matches && !document.documentElement.classList.contains('rafi-is-scrolling');").replace('  visibilityObserver.observe(stage);',"  visibilityObserver.observe(stage);\n  const onScrollActivity = () => updateControls();\n  document.addEventListener('rafi:scroll-activity', onScrollActivity);").replace('    visibilityObserver.disconnect();',"    visibilityObserver.disconnect();\n    document.removeEventListener('rafi:scroll-activity', onScrollActivity);")
        files['src/scripts/selected-projects.ts']=files['src/scripts/selected-projects.ts'].replace('rm.matches;','rm.matches || document.documentElement.classList.contains(\'rafi-is-scrolling\');').replace('  observer.observe(cinema);',"  observer.observe(cinema);\n  const onScrollActivity = () => updateControls();\n  document.addEventListener('rafi:scroll-activity', onScrollActivity);").replace('    stopMotion(); observer.disconnect(); intro?.kill();',"    stopMotion(); observer.disconnect(); intro?.kill();\n    document.removeEventListener('rafi:scroll-activity', onScrollActivity);")
        files['src/scripts/research-publications.ts']=files['src/scripts/research-publications.ts'].replace('openIndex === null;',"openIndex === null && !document.documentElement.classList.contains('rafi-is-scrolling');").replace("  document.addEventListener('visibilitychange', onVisibility);","  document.addEventListener('visibilitychange', onVisibility);\n  const onScrollActivity = () => syncTicker();\n  document.addEventListener('rafi:scroll-activity', onScrollActivity);").replace("    document.removeEventListener('visibilitychange', onVisibility);","    document.removeEventListener('visibilitychange', onVisibility);\n    document.removeEventListener('rafi:scroll-activity', onScrollActivity);")
        files['src/scripts/scroll-budget.ts']='rafi event governor previous module'
        files['public/styles/scroll-performance.css']='html.rafi-is-scrolling{animation-play-state:paused}'
    for rel,value in files.items():
        p=root/rel;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(value,encoding='utf-8')
    return files


class UpgradeTests(unittest.TestCase):
    def test_base_checkout_keep_loops_active(self):
        with tempfile.TemporaryDirectory() as d:
            r=Path(d)
            make_fixture(r)
            before,after=edit_source(r)
            self.assertEqual(set(before),set(NEEDED))
            self.assertIn("scrub: 0.18",after['src/scripts/motion.ts'])
            self.assertIn('onUpdate: renderMotion',after['src/scripts/selected-projects.ts'])
            self.assertIn('gsap.ticker.add(tick)',after['src/scripts/research-publications.ts'])
            self.assertNotIn('rafi-is-scrolling',''.join(after.values()))
            self.assertIn('position: fixed',after['public/styles/hero.css'])
            run(r,False,False)
            self.assertTrue((r/'RAFI-CONTINUOUS-SCROLL-CHANGES.diff').exists())
            self.assertEqual(edit_source(r)[0],edit_source(r)[1])

    def test_restore_from_previous_patch(self):
        with tempfile.TemporaryDirectory() as d:
            r=Path(d)
            make_fixture(r,previous=True)
            run(r,False,False)
            self.assertNotIn('rafi:scroll-activity',(r/'src/scripts/engineering-universe.ts').read_text())
            self.assertNotIn('rafi-is-scrolling',(r/'src/scripts/selected-projects.ts').read_text())
            self.assertNotIn('scroll-performance.css',(r/'src/pages/index.astro').read_text())
            for path in ('src/scripts/scroll-budget.ts','public/styles/scroll-performance.css'):
                self.assertFalse((r/path).exists())
                self.assertTrue((r/'.rafi-scroll-backup'/path).exists())
            before,after=edit_source(r)
            self.assertEqual(before,after)

    def test_full_site_zip_includes_assets_not_secrets(self):
        with tempfile.TemporaryDirectory() as d:
            r=Path(d)/'Portfolio---Shajedul-Kabir-Rafi'
            make_fixture(r,previous=True)
            asset=r/'public/assets/example.webp'
            asset.parent.mkdir(parents=True,exist_ok=True)
            asset.write_bytes(b'WEBPtest-example-binary')
            (r/'.env').write_text('SECRET=do-not-package')
            (r/'node_modules').mkdir()
            (r/'node_modules/private.txt').write_text('excluded dependency')
            run(r,False,True)
            z=Path(d)/'Rafi-Portfolio-Continuous-Scroll-Full-Updated.zip'
            self.assertTrue(z.is_file())
            with zipfile.ZipFile(z) as f:
                names=f.namelist()
                self.assertTrue(any(x.endswith('public/assets/example.webp') for x in names))
                self.assertFalse(any('.env' in x or 'node_modules' in x or '.rafi-scroll-backup' in x for x in names))
                self.assertTrue(any(x.endswith('src/scripts/motion.ts') for x in names))
                self.assertFalse(any(x.endswith('src/scripts/scroll-budget.ts') for x in names))

    def test_missing_sources_fails_before_writing(self):
        with tempfile.TemporaryDirectory() as d:
            r=Path(d)
            (r/'src/pages').mkdir(parents=True)
            (r/'src/pages/index.astro').write_text('not the repo')
            with self.assertRaisesRegex(ValueError,'Missing original source files'):
                run(r,False,False)
            self.assertFalse((r/'.rafi-scroll-backup').exists())

if __name__=='__main__':unittest.main()
