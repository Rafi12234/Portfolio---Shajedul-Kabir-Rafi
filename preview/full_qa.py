from pathlib import Path
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import subprocess
import tinycss2
ROOT=Path(__file__).resolve().parents[1]
css=(ROOT/'public/styles/selected-projects.css').read_text()
errors=[x.message for x in tinycss2.parse_stylesheet(css,skip_whitespace=True,skip_comments=True) if x.type=='error']
assert not errors,errors
node='''const ts=require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript/lib/typescript.js');const fs=require('fs');const s=fs.readFileSync(process.argv[1],'utf8');const o=ts.transpileModule(s,{reportDiagnostics:true,compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}});console.error((o.diagnostics||[]).map(d=>d.messageText).join('\\n'));process.stdout.write(o.outputText)'''
r=subprocess.run(['node','-e',node,str(ROOT/'src/scripts/selected-projects.ts')],capture_output=True,text=True,check=True)
assert not r.stderr.strip(),r.stderr
js=r.stdout.replace("import gsap from 'gsap';",'').replace("import { ScrollTrigger } from 'gsap/ScrollTrigger';",'')
mock='''const ScrollTrigger={refresh(){}};const gsap={registerPlugin(){},utils:{wrap(a,b,c){const func=v=>((v-a)%(b-a)+(b-a))%(b-a)+a;return c===undefined?func:func(c)}},fromTo(item,from,to){return {paused:false,pause(){this.paused=true},resume(){this.paused=false},kill(){}}},set(elements,props){(Array.isArray(elements)?elements:[elements]).forEach(el=>{if(props.clearProps?.includes('transform'))el.style.removeProperty('transform')})}};'''
html=(ROOT/'previews/static-preview.html').read_text()
soup=BeautifulSoup(html,'html.parser')
for i,card in enumerate(soup.select('[data-pg-card]')):
  card['data-pg-index']=str(2*i if i<9 else 2*(i-9)+1)
html=str(soup)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width,height in [(1440,900),(1024,768),(768,900),(390,844),(320,720)]:
  page=browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
  errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
  page.set_content(html)
  page.add_script_tag(content=mock+'\n'+js)
  # Ensure no accidental horizontal document overflow.
  sizes=page.evaluate('''() => ({scroll:document.documentElement.scrollWidth,inner:window.innerWidth})''')
  assert sizes['scroll']<=sizes['inner']+1,(width,sizes)
  # 18 projects and all in mobile lane after initialization.
  assert page.locator('[data-pg-card]').count()==18
  if width<=540:
   assert page.locator('[data-pg-lane="0"] [data-pg-card]').count()==18
   assert page.locator('[data-pg-lane="1"] [data-pg-card]').count()==0
  # Filter management and return all.
  page.locator('[data-pg-filter="management"]').click(force=True)
  assert page.locator('[data-pg-card]:visible').count()==2
  page.locator('[data-pg-filter="all"]').click(force=True)
  assert page.locator('[data-pg-card]:visible').count()==18
  # Flip card and expose exact link; unflip.
  card=page.locator('[data-pg-card="make-my-event"]')
  card.locator('button[data-pg-flip]').evaluate('(el) => el.click()')
  assert 'is-flipped' in card.get_attribute('class')
  assert card.locator('.pg__repo').get_attribute('tabindex')=='0'
  assert 'PROJECT OPEN' in page.locator('[data-pg-status]').inner_text()
  card.locator('button[data-pg-flip]').evaluate('(el) => el.click()')
  assert 'is-flipped' not in card.get_attribute('class')
  assert card.locator('.pg__repo').get_attribute('tabindex')=='-1'
  page.locator('[data-pg-pause]').click(force=True)
  assert 'RESUME' in page.locator('[data-pg-pause-text]').inner_text()
  assert not errs,(width,errs)
  print(width,'responsive + filters + flip + pause passed')
  page.close()
 # test reduced motion static fallback
 page=browser.new_page(viewport={'width':390,'height':844},reduced_motion='reduce')
 page.set_content(html);page.add_script_tag(content=mock+'\n'+js)
 assert not page.locator('.pg--enhanced').count()
 assert page.locator('[data-pg-pause]').is_disabled()
 assert page.locator('[data-pg-card]:visible').count()==18
 print('prefers-reduced-motion static archive passed')
 page.close()
 browser.close()
print('All local static rendering and interaction checks passed. (GSAP stub is not actual runtime.)')
