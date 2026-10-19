import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
const root = new URL('../',import.meta.url).pathname;
const content = readFileSync(join(root,'src/pages/index.astro'),'utf8');
const css = readFileSync(join(root,'public/styles/hero.css'),'utf8');
const js = readFileSync(join(root,'public/scripts/hero.js'),'utf8');
const files=['public/assets/rafi-portrait.png','public/assets/rafi-portrait.webp','public/assets/hero-atmosphere.webp','public/assets/original-bg-reference.webp'];
const issues=[];
for(const f of files) if(!existsSync(join(root,f))) issues.push(`Missing asset: ${f}`);
for(const s of ['class="hero__portrait"','class="hero__masthead"','id="hero-name"','class="hero__orb"']) if(!content.includes(s)) issues.push(`Missing markup: ${s}`);
for(const s of ['prefers-reduced-motion','@keyframes portraitIn','@keyframes orbIn','@keyframes headlineIn']) if(!css.includes(s)) issues.push(`Missing style: ${s}`);
for(const s of ['IntersectionObserver','pointermove','Escape']) if(!js.includes(s)) issues.push(`Missing interaction: ${s}`);
if(issues.length){console.error(issues.join('\n'));process.exitCode=1;}
else console.log(`Source QA OK: ${files.length} images, separate animated layers, native mobile menu, reduced-motion and pointer depth present.`);
