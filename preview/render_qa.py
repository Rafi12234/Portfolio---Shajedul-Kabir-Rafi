import json,subprocess,base64
from pathlib import Path
from html import escape
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
code='import(\"file://'+str(ROOT/'src/data/selectedProjects.ts')+'\").then(m=>process.stdout.write(JSON.stringify({projects:m.selectedProjects,groups:m.projectGroups})))'
r=subprocess.run(['node','--no-warnings','--experimental-strip-types','-e',code],capture_output=True,text=True,check=True)
data=json.loads(r.stdout)
css=(ROOT/'public/styles/selected-projects.css').read_text().replace('url(\'../assets/hero-atmosphere.webp\')','none')
# use a deterministic condensed local font fallback for screenshots only
css+='\n.pg{--display:"Noto Sans Condensed Black";--serif:"Liberation Serif";--ui:"Liberation Sans"}\n'

def card(p,index,i):
  tagstr=''.join('<span>'+escape(x)+'</span>' for x in p['stack'])
  art=escape(p['art']);tone=escape(p['tone']);name=escape(p['title']);kicker=escape(p['kicker'])
  no=f'{index+1:02d}'
  glyph=''.join(word[0] for word in name.split())[:3]
  return f'''<article class="pg__item pg__item--{tone}" data-pg-card="{p['slug']}" data-pg-group="{p['group']}" style="--pg-slot:{i}"><div class="pg__card"><button class="pg__card-trigger" data-pg-flip type="button" aria-expanded="false"><span class="pg__card-inner"><span class="pg__face pg__face--front"><span class="pg__micro-row"><span class="pg__pin"></span><span>{kicker}</span><span class="pg__number">{no} / 18</span></span><span class="pg__art pg__art--{art}"><span class="pg__art-grid"></span><span class="pg__art-axis"></span><span class="pg__art-ring"></span><span class="pg__art-bars"><i></i><i></i><i></i></span><span class="pg__art-glyph">{glyph}</span></span><span class="pg__front-end"><strong>{name}</strong><span>TURN TO EXPLORE ↗</span></span></span><span class="pg__face pg__face--back"><span class="pg__micro-row">PROJECT NOTES / {no}</span><strong class="pg__back-title">{name}</strong><span class="pg__back-summary">{escape(p['summary'])}</span><span class="pg__stack-label">TOOLS / TECHNOLOGIES</span><span class="pg__stack">{tagstr}</span><span class="pg__back-end">CLICK TO RETURN</span></span></span></button><a class="pg__repo" href="{escape(p['repo'])}" target="_blank">VIEW REPOSITORY ↗</a></div></article>'''
filters=''.join(f'<button type="button" class="pg__filter '+('is-selected' if g['key']=='all' else '')+f'" data-pg-filter="{g["key"]}" aria-pressed="'+('true' if g['key']=='all' else 'false')+f'">{g["name"]}<small>{g["count"]:02d}</small></button>' for g in data['groups'])
lanes=''.join('<div class="pg__lane pg__lane--'+str(lane)+'" data-pg-lane="'+str(lane)+'">'+''.join(card(p,i,n) for n,(i,p) in enumerate([(i,p) for i,p in enumerate(data['projects']) if i%2==lane]))+'</div>' for lane in [0,1])
html=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{{margin:0;background:#0a0708}}{css}</style></head><body><section class="pg pg--enhanced" id="selected-work" data-project-gallery><div class="pg__atmosphere"></div><div class="pg__shell"><div class="pg__chapter"><span><i></i>04 / SELECTED WORK</span><span class="pg__chapter-rule"></span><span>THE PROJECT INDEX · 2026</span></div><div class="pg__top"><div class="pg__copy"><span class="pg__eyebrow">REAL WORK ✳ MANY DISCIPLINES</span><h2 class="pg__title">A BODY<br>OF <em>WORK.</em></h2><p class="pg__intro">Products, platforms and experiments. Each project is a different problem explored through engineering and design.</p><div class="pg__instruction"><span class="pg__instruction-line"></span>MOVE THROUGH THE WORK <span class="pg__instruction-arrow">↘</span></div></div><div class="pg__index"><span>18</span><span>PROJECTS</span><span>06 CURATED FIELDS</span></div></div><div class="pg__filters"><span class="pg__filter-label">EXPLORE BY FIELD /</span><div class="pg__filter-options">{filters}</div></div><div class="pg__experience"><div class="pg__editorial"><div class="pg__spine"><span class="pg__vertical-rule"></span><span>SELECTED WORK / ARCHIVE</span></div><div class="pg__editorial-content"><span class="pg__mini-label">THE CURATED COLLECTION <span>✦</span></span><p class="pg__statement">Not just<br><em>things I've made.</em><br><strong>THINGS I'VE LEARNED.</strong></p><div class="pg__editorial-divider"></div><p class="pg__support">The gallery moves continuously. Hover to pause. Select a project and the plate turns to reveal its story and stack.</p><div class="pg__legend"><span>01—18</span><span>◌</span><span>OCT · 2026</span></div><div class="pg__controls"><button class="pg__pause" data-pg-pause><span data-pg-pause-icon>Ⅱ</span><span data-pg-pause-text>PAUSE MOVEMENT</span></button><span class="pg__status" data-pg-status>IN MOTION</span></div></div></div><div class="pg__gallery" data-pg-gallery><div class="pg__gallery-vignette"></div><div class="pg__lanes" data-pg-lanes>{lanes}</div><div class="pg__gallery-caption"><span>03 / OBJECTS IN MOTION</span><span>HOVER TO HALT · CLICK TO TURN</span></div></div></div><footer class="pg__footer"><span>THE ARCHIVE IS ALWAYS EVOLVING.</span><a href="https://github.com/Rafi12234">ALL REPOSITORIES ↗</a></footer></div></section></body></html>'''
(ROOT/'previews/static-preview.html').write_text(html)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w,h in [(1440,1000),(1024,900),(768,950),(390,844),(320,720)]:
  page=browser.new_page(viewport={'width':w,'height':h},device_scale_factor=1)
  page.set_content(html,wait_until='load')
  page.wait_for_timeout(250)
  # capture upper section and gallery middle
  page.screenshot(path=str(ROOT/f'previews/projects_{w}.png'),full_page=True)
  measure=page.evaluate('''() => ({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,headline:(()=>{const r=document.querySelector('.pg__title').getBoundingClientRect();return [r.left,r.right]})(),gallery:(()=>{const r=document.querySelector('.pg__gallery').getBoundingClientRect();return [r.width,r.height]})()})''')
  print(w,h,measure)
  page.close()
 browser.close()
