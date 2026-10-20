import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const root = new URL('../', import.meta.url).pathname;
const read = path => readFileSync(join(root, path), 'utf8');
const html = read('src/pages/index.astro');
const component = read('src/components/BeyondTitle.astro');
const heroCSS = read('public/styles/hero.css');
const btCSS = read('public/styles/beyond-title.css');
const module = read('src/scripts/motion.ts');
const pkg = JSON.parse(read('package.json'));
const required = [
  'public/assets/rafi-portrait.png',
  'public/assets/rafi-portrait.webp',
  'public/assets/hero-atmosphere.webp',
  'src/styles/motion.css',
];
const errors = [];
for (const name of required) if (!existsSync(join(root, name))) errors.push('Missing '+name);
for (const selector of ['data-hero','data-depth-root','id="hero-name"', "import '../scripts/motion.ts'"]) {
  if (!html.includes(selector)) errors.push('Missing page marker '+selector);
}
for (const selector of ['data-beyond-title','data-bt-timeline','data-bt-reveal']) {
  if (!component.includes(selector)) errors.push('Missing section marker '+selector);
}
for (const dep of ['gsap','lenis']) if (!pkg.dependencies?.[dep]) errors.push('Missing '+dep);
if (heroCSS.includes('.motion-capable') || btCSS.includes('bt--enhanced')) errors.push('Conflicting legacy animations');
if (!module.includes('gsap.ticker.add(ticker)') || !module.includes('lenis?.raf(seconds * 1000)')) errors.push('Ticker sync missing');
if (!module.includes('prefers-reduced-motion')) errors.push('Reduced-motion handling missing');
if (errors.length) { console.error(errors.join('\n')); process.exitCode=1; }
else console.log('Source QA: Hero + Beyond the Title, GSAP/Lenis, assets and fallbacks OK.');
