import { readFileSync } from 'node:fs';
const read = p => readFileSync(new URL('../'+p,import.meta.url),'utf8');
const page=read('src/pages/index.astro');
const js=read('src/scripts/motion.ts');
const css=read('public/styles/hero.css')+read('public/styles/beyond-title.css');
const lock=JSON.parse(read('package-lock.json'));
const checks={
  'Astro motion import':page.includes("import '../scripts/motion.ts'"),
  'No duplicate legacy scripts':!page.includes('./scripts/hero.js')&&!page.includes('./scripts/beyond-title.js'),
  'GSAP + ScrollTrigger':js.includes("from 'gsap'")&&js.includes("from 'gsap/ScrollTrigger'"),
  'Lenis one ticker':js.includes('lenis?.raf(seconds * 1000)')&&js.includes('gsap.ticker.add(ticker)'),
  'Native reduced motion':js.includes('prefers-reduced-motion: reduce'),
  'Lenis cleanup':js.includes('lenis.destroy()'),
  'No legacy CSS timelines':!css.includes('.motion-capable')&&!css.includes('bt--enhanced'),
  'Dependencies locked':!!lock.packages['node_modules/gsap']&&!!lock.packages['node_modules/lenis'],
};
const failed=Object.entries(checks).filter(([,ok])=>!ok);
if(failed.length){ console.error('Failed: '+failed.map(([name])=>name).join(', '));process.exitCode=1;}
else console.log('GSAP/Lenis structural integration checks passed.');
