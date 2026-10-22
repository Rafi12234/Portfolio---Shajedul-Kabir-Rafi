/**
 * Contact closing chapter: deliberately lightweight, no additional Lenis instance.
 * CSS handles slow decorative movement; IntersectionObserver suspends it offscreen.
 * GSAP is used once for its cinematic entrance and then for nothing continuous.
 */
import gsap from 'gsap';

const root = document.querySelector<HTMLElement>('[data-contact-section]');

if (root) {
  const directory = root.querySelector<HTMLElement>('[data-contact-directory]');
  const copyButton = root.querySelector<HTMLButtonElement>('[data-contact-copy]');
  const copyLabel = root.querySelector<HTMLElement>('[data-contact-copy-label]');
  const liveStatus = root.querySelector<HTMLElement>('[data-contact-status]');
  const channelLabel = root.querySelector<HTMLElement>('[data-contact-channel-label]');
  const channelTargets = Array.from(root.querySelectorAll<HTMLElement>('[data-contact-channel]'));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  let entered = false;
  let entrance: gsap.core.Timeline | null = null;
  let spotlightFrame = 0;
  let pendingX = 50;
  let pendingY = 50;

  function syncMotion() {
    root!.dataset.contactMotion = (visible && !document.hidden && !reduce.matches) ? 'on' : 'off';
  }

  const observer = new IntersectionObserver(entries => {
    visible = Boolean(entries[0]?.isIntersecting);
    syncMotion();
    if (!visible || entered || reduce.matches) return;
    entered = true;
    entrance = gsap.timeline({ defaults: { ease: 'power3.out' } });
    entrance
      .fromTo(root!.querySelectorAll('.rc__chapter, .rc__availability, .rc__heading-overline'),
        { autoAlpha: 0, y: 17 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.09, clearProps: 'opacity,visibility,transform' }, 0)
      .fromTo(root!.querySelectorAll('.rc__heading-line'),
        { autoAlpha: 0, yPercent: 65, rotate: 1.3 },
        { autoAlpha: 1, yPercent: 0, rotate: 0, duration: 0.91, stagger: 0.105, clearProps: 'opacity,visibility,transform' }, 0.12)
      .fromTo(root!.querySelectorAll('.rc__manifesto-bottom, .rc__manifesto-foot'),
        { autoAlpha: 0, y: 25 }, { autoAlpha: 1, y: 0, duration: 0.67, stagger: 0.13, clearProps: 'opacity,visibility,transform' }, 0.49)
      .fromTo(directory,
        { autoAlpha: 0, x: 42, rotateY: -5 },
        { autoAlpha: 1, x: 0, rotateY: 0, duration: 0.95, clearProps: 'opacity,visibility,transform' }, 0.18)
      .fromTo(root!.querySelectorAll('.rc__social'),
        { autoAlpha: 0, x: 20 }, { autoAlpha: 1, x: 0, duration: 0.55, stagger: 0.055, clearProps: 'opacity,visibility,transform' }, 0.54);
  }, { threshold: 0.12 });
  observer.observe(root);

  const resetLabel = () => { if (channelLabel) channelLabel.textContent = 'YOUR MOVE / I’M LISTENING'; };
  channelTargets.forEach(item => {
    const label = item.dataset.contactChannel || '';
    item.addEventListener('pointerenter', () => {
      if (channelLabel) channelLabel.textContent = `${label} / READY TO CONNECT`;
    });
    item.addEventListener('focusin', () => {
      if (channelLabel) channelLabel.textContent = `${label} / READY TO CONNECT`;
    });
    item.addEventListener('pointerleave', resetLabel);
    item.addEventListener('focusout', event => {
      if (!item.contains(event.relatedTarget as Node | null)) resetLabel();
    });
  });

  directory?.addEventListener('pointermove', event => {
    if (reduce.matches || event.pointerType !== 'mouse') return;
    const bounds = directory.getBoundingClientRect();
    pendingX = ((event.clientX - bounds.left) / bounds.width) * 100;
    pendingY = ((event.clientY - bounds.top) / bounds.height) * 100;
    if (spotlightFrame) return;
    spotlightFrame = window.requestAnimationFrame(() => {
      directory.style.setProperty('--rc-pointer-x', `${pendingX.toFixed(1)}%`);
      directory.style.setProperty('--rc-pointer-y', `${pendingY.toFixed(1)}%`);
      spotlightFrame = 0;
    });
  }, { passive: true });

  directory?.addEventListener('pointerleave', () => {
    directory.style.removeProperty('--rc-pointer-x');
    directory.style.removeProperty('--rc-pointer-y');
  });

  copyButton?.addEventListener('click', async () => {
    const email = copyButton.dataset.copyValue || '';
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      if (copyLabel) copyLabel.textContent = 'COPIED';
      if (liveStatus) liveStatus.textContent = 'Email address copied to clipboard.';
    } catch {
      if (copyLabel) copyLabel.textContent = 'EMAIL';
      if (liveStatus) liveStatus.textContent = 'Copy is unavailable in this browser. Open the email link instead.';
      window.location.href = `mailto:${email}`;
    }
  });

  const motionChanged = () => syncMotion();
  const visibilityChanged = () => syncMotion();
  document.addEventListener('visibilitychange', visibilityChanged);
  reduce.addEventListener('change', motionChanged);
  window.addEventListener('pagehide', () => {
    observer.disconnect();
    entrance?.kill();
    if (spotlightFrame) cancelAnimationFrame(spotlightFrame);
    document.removeEventListener('visibilitychange', visibilityChanged);
    reduce.removeEventListener('change', motionChanged);
  }, { once: true });
}
