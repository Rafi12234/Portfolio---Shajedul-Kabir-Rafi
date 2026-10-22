"""Standalone governor/rendering smoke, not a full production-site profile."""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
JS = (ROOT / 'tests/build-ts/scroll-budget.js').read_text().replace('export {};', '')
CSS = (ROOT / 'public/styles/scroll-performance.css').read_text()
for w,h in [(1440,900),(390,844)]:
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium',args=['--no-sandbox'])
        page=browser.new_page(viewport={'width':w,'height':h})
        page.set_content('''<!doctype html><html><head><style>
            .portfolio-shell {position:relative;isolation:isolate;height:6000px;}
            .portfolio-shell__atmosphere{position:absolute;inset:0;background:radial-gradient(red,black)}
            .portfolio-shell__texture{position:absolute;inset:0;background:#aaa}
            @keyframes run {to{transform:translateX(10px)}}
            .cp__aura{animation:run 10s linear infinite}
            </style></head><body><div class="portfolio-shell">
            <div class="portfolio-shell__atmosphere"></div><div class="portfolio-shell__texture"></div>
            <div class="cp__aura">Decorative animation</div></div></body></html>''')
        page.add_style_tag(content=CSS)
        page.add_script_tag(content=JS)
        original=page.evaluate('''() => ({height:document.querySelector('.portfolio-shell__atmosphere').getBoundingClientRect().height,
            noiseHeight:document.querySelector('.portfolio-shell__texture').getBoundingClientRect().height})''')
        assert original['height'] <= 1200,original
        assert original['noiseHeight'] <= h+5,original
        page.evaluate('window.scrollTo(0,400)')
        page.wait_for_timeout(40)
        assert page.evaluate("document.documentElement.classList.contains('rafi-is-scrolling')")
        assert page.evaluate("getComputedStyle(document.querySelector('.cp__aura')).animationPlayState") == 'paused'
        page.wait_for_timeout(240)
        assert not page.evaluate("document.documentElement.classList.contains('rafi-is-scrolling')")
        assert page.evaluate("getComputedStyle(document.querySelector('.cp__aura')).animationPlayState") == 'running'
        print('PASS Chromium viewport', w,h,original)
        browser.close()
