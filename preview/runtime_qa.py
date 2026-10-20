from pathlib import Path
from playwright.sync_api import sync_playwright
import subprocess,json
ROOT=Path(__file__).resolve().parents[1]
node = '''const ts=require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript/lib/typescript.js'); const fs=require('fs'); const c=fs.readFileSync(process.argv[1],'utf8'); const out=ts.transpileModule(c,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022},reportDiagnostics:true});console.error((out.diagnostics||[]).map(d=>d.messageText).join('\\n'));process.stdout.write(out.outputText)'''
r=subprocess.run(['node','-e',node,str(ROOT/'src/scripts/selected-projects.ts')],capture_output=True,text=True)
print('TypeScript parser errors:',r.stderr or 'none')
if r.returncode:raise RuntimeError(r.stderr)
js=r.stdout.replace("import gsap from 'gsap';",'').replace("import { ScrollTrigger } from 'gsap/ScrollTrigger';",'')
if 'import gsap' in js: raise ValueError('Could not remove imports')
mock='''const ScrollTrigger={update(){},refresh(){}};
const gsap={
 registerPlugin(){}, utils:{wrap(a,b,c){const n=(v)=> ((v-a)%(b-a)+(b-a))%(b-a)+a;return c===undefined?n:n(c)}},
 fromTo(element,from,to){if(!element)return {pause(){},resume(){},kill(){}}; const els = Array.isArray(element)?element:[element];for(const el of els)el.style.transform='translate3d(0,0,0)';return {pause(){},resume(){},kill(){}};},
 set(elements,props){const arr=Array.isArray(elements)?elements:[elements];arr.forEach(el=>{if(props.clearProps?.includes('transform'))el.style.removeProperty('transform')});},
};
'''
html=(ROOT/'previews/static-preview.html').read_text()
# add data-index as real component would produce
from bs4 import BeautifulSoup
soup=BeautifulSoup(html,'html.parser')
for i,card in enumerate(soup.select('[data-pg-card]')):
  # in static preview cards are first all even then odd
  global_index= 2*i if i<9 else 2*(i-9)+1
  card['data-pg-index']=str(global_index)
html=str(soup)
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':1440,'height':900})
    errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    page.set_content(html)
    page.add_script_tag(content=mock+'\n'+js)
    print('enhanced:',page.locator('.pg--enhanced').count())
    print('cards total:',page.locator('[data-pg-card]').count(),'visible:',page.locator('[data-pg-card]:visible').count())
    card=page.locator('[data-pg-card="make-my-event"]')
    card.locator('[data-pg-flip]').click(force=True)
    print('flip:',card.get_attribute('class'), 'repo tabindex:',card.locator('.pg__repo').get_attribute('tabindex'))
    # click to return
    card.locator('[data-pg-flip]').click(force=True)
    print('return:', 'is-flipped' in card.get_attribute('class'))
    page.locator('[data-pg-filter="ai"]').click(force=True)
    print('filter AI visible:',page.locator('[data-pg-card]:visible').count(), 'label:',page.locator('[data-pg-filter="ai"]').get_attribute('aria-pressed'))
    page.locator('[data-pg-pause]').click(force=True)
    print('manual pause:',page.locator('[data-pg-pause-text]').inner_text())
    page.set_viewport_size({'width':390,'height':844})
    page.locator('[data-pg-filter="all"]').click(force=True)
    # mobile all 18 now in lane0
    print('mobile lane counts:',page.locator('[data-pg-lane="0"] [data-pg-card]').count(),page.locator('[data-pg-lane="1"] [data-pg-card]').count())
    print('mobile overflow:',page.evaluate('document.documentElement.scrollWidth > window.innerWidth'))
    print('JS errors:',errors)
    browser.close()
