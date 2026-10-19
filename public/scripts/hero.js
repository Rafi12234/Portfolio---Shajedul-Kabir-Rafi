/**
 * Hero 00 — light, dependency-free progressive enhancement.
 * CSS is responsible for the cinematic enter sequence; this module adds
 * subtle optical depth and accessible menu keyboard behavior.
 * No animation hides core content when JS is unavailable.
 */
(() => {
  'use strict';
  const root = document.querySelector('[data-hero]');
  const stage = document.querySelector('[data-depth-root]');
  const menu = document.querySelector('#mobile-menu');
  if (!root || !stage) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = window.matchMedia('(hover: none), (pointer: coarse)');
  let pointerX = 0, pointerY = 0, currentX = 0, currentY = 0, scrollAmount = 0;
  let queued = false, inView = true, enabled = false;

  function resetDepth() {
    for (const [name, value] of Object.entries({
      '--portrait-x': '0px', '--portrait-y': '0px', '--type-x': '0px', '--type-y': '0px',
      '--orb-x': '0px', '--orb-y': '0px', '--scroll-portrait': '0px',
      '--scroll-title': '0px', '--scroll-orb': '0px'
    })) stage.style.setProperty(name, value);
  }

  function frame() {
    queued = false;
    if (!enabled || !inView) return;
    currentX += (pointerX - currentX) * 0.095;
    currentY += (pointerY - currentY) * 0.095;
    stage.style.setProperty('--portrait-x', `${(currentX * 17).toFixed(2)}px`);
    stage.style.setProperty('--portrait-y', `${(currentY * 9).toFixed(2)}px`);
    stage.style.setProperty('--type-x', `${(-currentX * 11).toFixed(2)}px`);
    stage.style.setProperty('--type-y', `${(-currentY * 4).toFixed(2)}px`);
    stage.style.setProperty('--orb-x', `${(currentX * 8).toFixed(2)}px`);
    stage.style.setProperty('--orb-y', `${(currentY * 6).toFixed(2)}px`);
    stage.style.setProperty('--scroll-portrait', `${(-scrollAmount * 35).toFixed(2)}px`);
    stage.style.setProperty('--scroll-title', `${(scrollAmount * 27).toFixed(2)}px`);
    stage.style.setProperty('--scroll-orb', `${(scrollAmount * 19).toFixed(2)}px`);
    if (Math.abs(currentX-pointerX)>.002 || Math.abs(currentY-pointerY)>.002) schedule();
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(frame); } }
  function move(event) {
    if (!enabled) return;
    const r = stage.getBoundingClientRect();
    pointerX = Math.max(-1,Math.min(1, ((event.clientX-r.left)/r.width-.5)*2));
    pointerY = Math.max(-1,Math.min(1, ((event.clientY-r.top)/r.height-.5)*2));
    schedule();
  }
  function leave() { pointerX = 0; pointerY = 0; schedule(); }
  function onScroll() {
    if (!enabled) return;
    const b = root.getBoundingClientRect();
    scrollAmount = Math.max(0,Math.min(1,-b.top / Math.max(1,b.height)));
    schedule();
  }
  function refresh() {
    enabled = !reduce.matches && !coarse.matches;
    if (!enabled) {resetDepth();return;}
    onScroll();
  }
  stage.addEventListener('pointermove',move,{passive:true});
  stage.addEventListener('pointerleave',leave,{passive:true});
  window.addEventListener('scroll',onScroll,{passive:true});
  reduce.addEventListener('change',refresh);
  coarse.addEventListener('change',refresh);
  const observer = new IntersectionObserver(entries => {
    inView = entries[0]?.isIntersecting ?? false;
    if (inView) schedule();
  },{threshold:0});
  observer.observe(root);
  refresh();

  // Native <details> remains functional even with scripts blocked.
  if (menu) {
    menu.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menu.open) {
        menu.open = false;
        menu.querySelector('summary')?.focus();
      }
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {menu.open=false;}));
    document.addEventListener('pointerdown', event => {
      if (menu.open && !menu.contains(event.target)) menu.open=false;
    });
  }
})();
