/** Section 08 / Client Projects — the commission archive.
 *  No extra Lenis, no permanent JS animation ticker, all entrances run once.
 *  Only ambient CSS transform/opacity animations loop; paused when offscreen.
 */
import gsap from 'gsap';

const root = document.querySelector<HTMLElement>('[data-client-projects]');
if (root) {
  const dialog = root.querySelector<HTMLDialogElement>('[data-cp-dialog]');
  const openers = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-cp-open]'));
  const close = root.querySelector<HTMLButtonElement>('[data-cp-close]');
  const zone = root.querySelector<HTMLElement>('[data-cp-visual]');
  const frame = root.querySelector<HTMLElement>('[data-cp-frame]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const precisePointer = matchMedia('(hover: hover) and (pointer: fine)');
  let lastFocus: HTMLElement | null = null;
  let tiltFrame = 0;
  let pendingTilt: {x:number; y:number} | null = null;

  // Manage only this section's ambient CSS motion; no duplicate scroll engines.
  const visibility = new IntersectionObserver(entries => {
    root.classList.toggle('cp--motion-active', !!entries[0]?.isIntersecting && !reduced.matches);
  }, { rootMargin: '150px 0px 150px 0px', threshold: 0 });
  visibility.observe(root);

  function updateReduced() {
    root.classList.toggle('cp--motion-active', !reduced.matches && root.getBoundingClientRect().bottom > -150 && root.getBoundingClientRect().top < innerHeight + 150);
    if (reduced.matches) {
      frame?.style.removeProperty('--cp-tilt-x');
      frame?.style.removeProperty('--cp-tilt-y');
    }
  }
  reduced.addEventListener('change', updateReduced);

  // Individual reveal triggers. All markup stays visible if JavaScript fails.
  const revealers = Array.from(root.querySelectorAll<HTMLElement>('[data-cp-reveal]'));
  const reveal = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      reveal.unobserve(entry.target);
      if (reduced.matches) continue;
      const node = entry.target as HTMLElement;
      gsap.fromTo(node, { autoAlpha: 0, y: 24 }, {
        autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out',
        clearProps: 'transform,opacity,visibility',
      });
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
  revealers.forEach(node => reveal.observe(node));

  // Tiny physical tilt on actual artwork only; rAF throttle while pointer moves.
  if (zone && frame && precisePointer.matches) {
    const apply = () => {
      tiltFrame = 0;
      if (!pendingTilt) return;
      frame.style.setProperty('--cp-tilt-y', `${pendingTilt.x.toFixed(2)}deg`);
      frame.style.setProperty('--cp-tilt-x', `${pendingTilt.y.toFixed(2)}deg`);
    };
    zone.addEventListener('pointermove', event => {
      if (reduced.matches || !precisePointer.matches) return;
      const rect = zone.getBoundingClientRect();
      const x = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
      const y = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
      pendingTilt = {x: Math.max(-3, Math.min(3, x * 6)), y: Math.max(-2.5, Math.min(2.5, -y * 5))};
      if (!tiltFrame) tiltFrame = requestAnimationFrame(apply);
    }, { passive: true });
    zone.addEventListener('pointerleave', () => {
      pendingTilt = {x:0,y:0};
      if (!tiltFrame) tiltFrame = requestAnimationFrame(apply);
    }, { passive: true });
  }

  const onClose = () => {
    document.documentElement.classList.remove('cp-dialog-open');
    lastFocus?.focus({preventScroll:true});
  };
  function openDialog(event: MouseEvent) {
    if (!dialog) return;
    lastFocus = event.currentTarget as HTMLElement;
    if (!dialog.open) dialog.showModal();
    document.documentElement.classList.add('cp-dialog-open');
    close?.focus({preventScroll:true});
  }
  openers.forEach(button => button.addEventListener('click', openDialog));
  close?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('close', onClose);
  dialog?.addEventListener('click', event => {
    // Click only the backdrop, never the screenshot or a link.
    if (event.target === dialog) dialog.close();
  });

  window.addEventListener('pagehide', () => {
    visibility.disconnect();
    reveal.disconnect();
    if (tiltFrame) cancelAnimationFrame(tiltFrame);
    if (dialog?.open) dialog.close();
  }, {once:true});
}
