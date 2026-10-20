/** Shared GSAP motion director for Hero 00 and Beyond the Title 01.
 * GSAP handles timelines, ScrollTrigger handles scroll-linked effects,
 * Lenis smooths fine-pointer wheel scrolling, synchronized on ONE ticker.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import '../styles/motion.css';

gsap.registerPlugin(ScrollTrigger);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const desktopPointer = matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)');
const hero = document.querySelector<HTMLElement>('[data-hero]');
const stage = document.querySelector<HTMLElement>('[data-depth-root]');
const section = document.querySelector<HTMLElement>('[data-beyond-title]');
let lenis: Lenis | null = null;
let context: gsap.Context | null = null;
let ticker: ((time: number) => void) | null = null;
let previousReduced = reduced.matches;
let previousDesktop = desktopPointer.matches;
let firstIntro = true;
let pending = false;
const removals: Array<() => void> = [];

// Navigation must stay usable with JavaScript disabled.
const mobileMenu = document.querySelector<HTMLDetailsElement>('#mobile-menu');
if (mobileMenu) {
  mobileMenu.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobileMenu.open) {
      mobileMenu.open = false;
      mobileMenu.querySelector<HTMLElement>('summary')?.focus();
    }
  });
  document.addEventListener('pointerdown', event => {
    if (mobileMenu.open && !mobileMenu.contains(event.target as Node)) mobileMenu.open = false;
  });
  mobileMenu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => { mobileMenu.open = false; })
  );
}

function setupLenis() {
  if (reduced.matches || !desktopPointer.matches) return;
  lenis = new Lenis({
    autoRaf: false, smoothWheel: true, syncTouch: false,
    lerp: 0.14, wheelMultiplier: 0.95, anchors: true,
  });
  lenis.on('scroll', ScrollTrigger.update);
  ticker = (seconds: number) => lenis?.raf(seconds * 1000);
  gsap.ticker.add(ticker);
  gsap.ticker.lagSmoothing(0);
}

function setupHero(entrance: boolean) {
  if (!hero || !stage) return;
  const header = document.querySelector<HTMLElement>('.site-header__inner');
  const portrait = hero.querySelector<HTMLElement>('.hero__portrait-reveal');
  const orb = hero.querySelector<HTMLElement>('.hero__orb');
  const headline = hero.querySelector<HTMLElement>('.hero__masthead');
  const left = hero.querySelector<HTMLElement>('.hero__side--left');
  const right = hero.querySelector<HTMLElement>('.hero__side--right');
  const name = hero.querySelector<HTMLElement>('.hero__nameplate');
  const lower = hero.querySelectorAll('.hero__lower-left,.hero__lower-right');
  const bottom = hero.querySelector<HTMLElement>('.hero__bottom-strip');
  const tl = entrance ? gsap.timeline({ defaults: { ease: 'power3.out' } }) : null;
  if (tl && header) tl.from(header, { autoAlpha: 0, y: -15, duration: 0.65 }, 0.1);
  if (tl && portrait) tl.from(portrait, {
    autoAlpha: 0, y: 98, scale: 1.035,
    clipPath: 'inset(100% 0% 0% 0%)', duration: 1.22,
    ease: 'power4.out', clearProps: 'clipPath',
  }, 0.23);
  if (tl && orb) tl.from(orb, { autoAlpha: 0, scale: 0.77, duration: 1.22, ease: 'expo.out' }, 0.65);
  if (tl && headline) tl.from(headline, { autoAlpha: 0, yPercent: 105, duration: 1.13, ease: 'expo.out' }, 0.88);
  if (tl && left) tl.from(left, { autoAlpha: 0, y: 27, duration: 0.84 }, 1.12);
  if (tl && right) tl.from(right, { autoAlpha: 0, y: 27, duration: 0.84 }, 1.2);
  if (tl && name) tl.from(name, { autoAlpha: 0, y: 34, duration: 0.95 }, 1.38);
  if (tl && lower.length) tl.from(lower, { autoAlpha: 0, y: 17, duration: 0.72, stagger: 0.11 }, 1.68);
  if (tl && bottom) tl.from(bottom, { autoAlpha: 0, y: 13, duration: 0.7 }, 1.87);

  // Separate pointer and scroll custom props avoid clobbering CSS centering.
  gsap.to(stage, {
    '--scroll-portrait': '-40px', '--scroll-title': '26px', '--scroll-orb': '16px',
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.7, invalidateOnRefresh: true },
  });
  if (!desktopPointer.matches) return;
  const px = gsap.quickTo(stage, '--portrait-x', { duration: 0.65, ease: 'power3.out' });
  const py = gsap.quickTo(stage, '--portrait-y', { duration: 0.65, ease: 'power3.out' });
  const tx = gsap.quickTo(stage, '--type-x', { duration: 0.8, ease: 'power3.out' });
  const ty = gsap.quickTo(stage, '--type-y', { duration: 0.8, ease: 'power3.out' });
  const ox = gsap.quickTo(stage, '--orb-x', { duration: 0.9, ease: 'power3.out' });
  const oy = gsap.quickTo(stage, '--orb-y', { duration: 0.9, ease: 'power3.out' });
  const move = (event: PointerEvent) => {
    const r = stage.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const x = gsap.utils.clamp(-1, 1, ((event.clientX - r.left) / r.width - 0.5) * 2);
    const y = gsap.utils.clamp(-1, 1, ((event.clientY - r.top) / r.height - 0.5) * 2);
    px((x * 16) + 'px'); py((y * 9) + 'px');
    tx((-x * 10) + 'px'); ty((-y * 4) + 'px');
    ox((x * 8) + 'px'); oy((y * 6) + 'px');
  };
  const leave = () => {
    px('0px'); py('0px'); tx('0px'); ty('0px'); ox('0px'); oy('0px');
  };
  stage.addEventListener('pointermove', move, { passive: true });
  stage.addEventListener('pointerleave', leave, { passive: true });
  removals.push(() => {
    stage.removeEventListener('pointermove', move);
    stage.removeEventListener('pointerleave', leave);
  });
}

function setupBeyondTitle() {
  if (!section) return;
  const rule = section.querySelector<HTMLElement>('.bt__chapter-rule');
  if (rule) gsap.from(rule, {
    scaleX: 0, transformOrigin: 'left center',
    duration: 1.08, ease: 'power3.out',
    scrollTrigger: { trigger: section, start: 'top 83%', once: true },
  });
  section.querySelectorAll<HTMLElement>('[data-bt-reveal]').forEach(element => {
    const event = element.classList.contains('bt__event');
    const x = event ? (element.classList.contains('bt__event--left') ? -24 : 24) : 0;
    gsap.from(element, {
      autoAlpha: 0, x, y: event ? 22 : 28,
      duration: event ? 0.9 : 0.82, ease: 'power3.out',
      clearProps: 'transform',
      scrollTrigger: { trigger: element, start: 'top 87%', once: true },
    });
  });
  const timeline = section.querySelector<HTMLElement>('[data-bt-timeline]');
  const progress = section.querySelector<HTMLElement>('.bt__timeline-progress');
  if (timeline && progress) gsap.fromTo(progress,
    { scaleY: 0, transformOrigin: 'center top' },
    { scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: timeline, start: 'top 72%', end: 'bottom 54%', scrub: 0.45, invalidateOnRefresh: true } }
  );
  const aura = section.querySelector<HTMLElement>('.bt__aura');
  if (aura && desktopPointer.matches) gsap.fromTo(aura,
    { y: -16 }, { y: 16, ease: 'none',
      scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1.3 } }
  );
  if (!desktopPointer.matches) return;
  section.querySelectorAll<HTMLElement>('.bt__glass').forEach(panel => {
    const pointer = (event: PointerEvent) => {
      const r = panel.getBoundingClientRect();
      panel.style.setProperty('--bt-mx', (event.clientX - r.left) + 'px');
      panel.style.setProperty('--bt-my', (event.clientY - r.top) + 'px');
    };
    panel.addEventListener('pointermove', pointer, { passive: true });
    removals.push(() => panel.removeEventListener('pointermove', pointer));
  });
}

function destroy() {
  removals.splice(0).forEach(fn => fn());
  context?.revert();
  context = null;
  if (ticker) gsap.ticker.remove(ticker);
  ticker = null;
  if (lenis) {
    lenis.off('scroll', ScrollTrigger.update);
    lenis.destroy();
    lenis = null;
  }
  ['--portrait-x','--portrait-y','--type-x','--type-y','--orb-x','--orb-y',
   '--scroll-portrait','--scroll-title','--scroll-orb']
    .forEach(p => stage?.style.removeProperty(p));
}

function start() {
  destroy();
  previousReduced = reduced.matches;
  previousDesktop = desktopPointer.matches;
  if (reduced.matches) return;
  setupLenis();
  context = gsap.context(() => {
    setupHero(firstIntro);
    setupBeyondTitle();
  });
  firstIntro = false;
  requestAnimationFrame(() => ScrollTrigger.refresh());
}
function scheduleRestart() {
  if (pending) return;
  pending = true;
  requestAnimationFrame(() => {
    pending = false;
    if (previousReduced !== reduced.matches || previousDesktop !== desktopPointer.matches) start();
  });
}
reduced.addEventListener('change', scheduleRestart);
desktopPointer.addEventListener('change', scheduleRestart);
window.addEventListener('pagehide', destroy, { once: true });
document.fonts?.ready.then(() => ScrollTrigger.refresh());
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start, { once: true });
} else start();
