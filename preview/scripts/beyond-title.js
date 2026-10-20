/** Beyond the Title 01 — progressively enhanced, accessible editorial motion.
 * Native scroll, no third-party animation runtime. No hidden content without a working observer.
 */
(() => {
  'use strict';
  const section = document.querySelector('[data-beyond-title]');
  if (!section) return;
  const timeline = section.querySelector('[data-bt-timeline]');
  const revealables = Array.from(section.querySelectorAll('[data-bt-reveal]'));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = window.matchMedia('(hover:none), (pointer:coarse)');
  const supportsObserver = 'IntersectionObserver' in window;
  let queued = false;
  let visible = true;

  function allVisible() {
    section.classList.remove('bt--enhanced');
    revealables.forEach(el => el.classList.add('bt--in-view'));
    timeline?.style.setProperty('--bt-progress', '1');
    section.style.setProperty('--bt-aura-y', '0px');
  }

  // Setup only after the observer is available, so a script/network failure
  // never leaves information visually hidden.
  if (reduced.matches || !supportsObserver) { allVisible(); return; }

  const revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('bt--in-view');
      revealObserver.unobserve(entry.target); // once, not continually retriggered
    }
  }, { rootMargin: '0px 0px -6% 0px', threshold: .10 });
  for (const el of revealables) revealObserver.observe(el);
  section.classList.add('bt--enhanced');

  const visibilityObserver = new IntersectionObserver(entries => {
    visible = entries[0]?.isIntersecting ?? true;
    if (visible) queue();
  }, { threshold: 0 });
  visibilityObserver.observe(section);

  function frame() {
    queued = false;
    if (!visible || reduced.matches || !timeline) return;
    const rect = timeline.getBoundingClientRect();
    const viewport = Math.max(window.innerHeight, 1);
    const progress = Math.max(0, Math.min(1, (viewport * .70 - rect.top) / Math.max(rect.height, 1)));
    timeline.style.setProperty('--bt-progress', progress.toFixed(4));
    // Movement is small and does not affect the page's flow or scroll velocity.
    const srect = section.getBoundingClientRect();
    const center = srect.top + srect.height / 2;
    section.style.setProperty('--bt-aura-y', `${(Math.max(-1,Math.min(1,(viewport/2-center)/viewport))*18).toFixed(2)}px`);
  }
  function queue() {if (!queued){queued=true; requestAnimationFrame(frame);}}
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue, { passive: true });
  queue();

  // Glass caustic highlights follow the cursor inside individual panels.
  // They are cosmetic only: no animation, position or content depends on pointer.
  if (!coarse.matches) {
    section.querySelectorAll('.bt__glass').forEach(panel => {
      panel.addEventListener('pointermove', event => {
        const b=panel.getBoundingClientRect();
        panel.style.setProperty('--bt-mx', `${(event.clientX-b.left).toFixed(1)}px`);
        panel.style.setProperty('--bt-my', `${(event.clientY-b.top).toFixed(1)}px`);
      }, { passive: true });
    });
  }
  reduced.addEventListener('change', () => {if (reduced.matches) allVisible(); else queue();});
})();
