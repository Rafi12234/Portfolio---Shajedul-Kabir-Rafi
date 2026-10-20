/** Section 03 — independent, progressively enhanced interactive capability atlas.
 * Reuses the existing GSAP/ScrollTrigger + Lenis scroll loop; never instantiates Lenis.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const root = document.querySelector<HTMLElement>('[data-skill-atlas]');
if (root) {
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-sa-node]'));
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-sa-panel]'));
  const center = root.querySelector<HTMLElement>('[data-sa-center]');
  const index = root.querySelector<HTMLElement>('[data-sa-index]');
  const counter = root.querySelector<HTMLElement>('[data-sa-count]');
  const previous = root.querySelector<HTMLButtonElement>('[data-sa-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-sa-next]');
  const experience = root.querySelector<HTMLElement>('[data-sa-experience]');
  const autoButton = root.querySelector<HTMLButtonElement>('[data-sa-autoplay]');
  const autoLabel = root.querySelector<HTMLElement>('[data-sa-autoplay-label]');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Advance sequentially 01 → 09 → 01. One timeout per step prevents drift.
  const AUTO_INTERVAL_MS = 2000;
  let autoEnabled = true;
  let autoTimer: number | null = null;
  let atlasVisible = false;
  let pointerInside = false;
  let focusInside = false;
  let activeIndex = 0;
  let context: gsap.Context | null = null;
  let orbitTweens: gsap.core.Tween[] = [];
  let activePanelTween: gsap.core.Tween | null = null;

  const pad = (n: number) => String(n + 1).padStart(2, '0');
  const keyFor = (button: HTMLButtonElement) => button.dataset.saNode || '';

  function clearAutoTimer() {
    if (autoTimer !== null) window.clearTimeout(autoTimer);
    autoTimer = null;
  }

  function canAutoAdvance() {
    return autoEnabled && atlasVisible && !pointerInside && !focusInside &&
      !document.hidden && !motionPreference.matches;
  }

  function updateAutoControl() {
    if (!autoButton) return;
    const allowed = !motionPreference.matches;
    autoButton.disabled = !allowed;
    autoButton.classList.toggle('is-playing', autoEnabled && allowed);
    autoButton.setAttribute('aria-pressed', String(autoEnabled && allowed));
    autoButton.setAttribute('aria-label', !allowed
      ? 'Automatic rotation unavailable with reduced motion'
      : autoEnabled ? 'Pause automatic skill rotation' : 'Resume automatic skill rotation');
    if (autoLabel) autoLabel.textContent = !allowed
      ? 'AUTO OFF · REDUCED MOTION'
      : autoEnabled ? 'AUTO · 02 SEC' : 'AUTO · PAUSED';
  }

  function scheduleAutoAdvance() {
    clearAutoTimer();
    updateAutoControl();
    if (!canAutoAdvance()) return;
    autoTimer = window.setTimeout(() => {
      autoTimer = null;
      select(activeIndex + 1);
      scheduleAutoAdvance();
    }, AUTO_INTERVAL_MS);
  }

  function select(indexToShow: number, moveFocus = false) {
    if (!buttons.length) return;
    const nextIndex = (indexToShow + buttons.length) % buttons.length;
    const target = buttons[nextIndex];
    const targetKey = keyFor(target);
    const newPanel = panels.find(panel => panel.dataset.saPanel === targetKey);
    if (!newPanel) return;

    const changed = nextIndex !== activeIndex;
    activeIndex = nextIndex;
    activePanelTween?.kill();
    panels.forEach(panel => {
      gsap.killTweensOf(panel);
      panel.hidden = panel !== newPanel;
      panel.classList.toggle('is-active', panel === newPanel);
      gsap.set(panel, { clearProps: 'opacity,visibility,transform' });
    });
    buttons.forEach((button, i) => {
      button.classList.toggle('is-active', i === nextIndex);
      button.setAttribute('aria-pressed', String(i === nextIndex));
    });
    if (center) center.textContent = [
      'LANGUAGES', 'FRONTEND', 'BACKEND', 'MOBILE', 'AI / ML',
      'DEVOPS', 'DATA', 'DESIGN', 'PEOPLE'
    ][nextIndex];
    if (index) index.innerHTML = `${pad(nextIndex)} <i>/ 09</i>`;
    if (counter) counter.textContent = `${pad(nextIndex)} — 09`;
    if (changed && !motionPreference.matches) {
      activePanelTween = gsap.fromTo(newPanel, { autoAlpha: 0, x: 23 }, {
        autoAlpha: 1, x: 0, duration: 0.62, ease: 'power3.out', clearProps: 'opacity,visibility,transform'
      });
      const tokens = newPanel.querySelectorAll('.sa__skill-tokens li');
      gsap.fromTo(tokens, { autoAlpha: 0, y: 9 }, {
        autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.045,
        ease: 'power2.out', clearProps: 'opacity,visibility,transform'
      });
    }
    if (moveFocus) target.focus({ preventScroll: true });
  }

  // Manual selection takes precedence and restarts the two-second countdown.
  function manualSelect(indexToShow: number, moveFocus = false) {
    select(indexToShow, moveFocus);
    scheduleAutoAdvance();
  }

  buttons.forEach((button, i) => {
    button.addEventListener('click', () => manualSelect(i));
    button.addEventListener('keydown', event => {
      let newIndex = -1;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') newIndex = i + 1;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') newIndex = i - 1;
      else if (event.key === 'Home') newIndex = 0;
      else if (event.key === 'End') newIndex = buttons.length - 1;
      if (newIndex !== -1) { event.preventDefault(); manualSelect(newIndex, true); }
    });
  });
  previous?.addEventListener('click', () => manualSelect(activeIndex - 1));
  next?.addEventListener('click', () => manualSelect(activeIndex + 1));

  // Accessible pause/resume for readers who want more than two seconds.
  if (autoButton) {
    autoButton.hidden = false;
    autoButton.addEventListener('click', () => {
      autoEnabled = !autoEnabled;
      scheduleAutoAdvance();
    });
  }

  // Only cycle while the atlas is meaningfully on-screen.
  const visibilityObserver = new IntersectionObserver(entries => {
    atlasVisible = entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.25);
    scheduleAutoAdvance();
  }, { threshold: [0, 0.25, 0.5, 1] });
  visibilityObserver.observe(experience ?? root);

  // Hover or keyboard focus suspends cycling so selected skills can be read.
  experience?.addEventListener('pointerenter', () => {
    pointerInside = true;
    scheduleAutoAdvance();
  });
  experience?.addEventListener('pointerleave', () => {
    pointerInside = false;
    scheduleAutoAdvance();
  });
  experience?.addEventListener('focusin', () => {
    focusInside = true;
    scheduleAutoAdvance();
  });
  experience?.addEventListener('focusout', event => {
    if (event.relatedTarget instanceof Node && experience.contains(event.relatedTarget)) return;
    focusInside = false;
    scheduleAutoAdvance();
  });
  document.addEventListener('visibilitychange', scheduleAutoAdvance);

  function stopMotion() {
    activePanelTween?.kill();
    activePanelTween = null;
    orbitTweens.forEach(tween => tween.kill());
    orbitTweens = [];
    context?.revert();
    context = null;
    root?.querySelectorAll<HTMLElement>('[data-sa-reveal],[data-sa-head],[data-sa-ledger-row]').forEach(element => {
      gsap.set(element, { clearProps: 'opacity,visibility,transform,clipPath' });
    });
  }

  function beginMotion() {
    stopMotion();
    if (motionPreference.matches) return;
    context = gsap.context(() => {
      const head = root.querySelector<HTMLElement>('[data-sa-head]');
      if (head) gsap.from(head, {
        autoAlpha: 0, yPercent: 85, duration: 1.15, ease: 'expo.out',
        scrollTrigger: { trigger: head, start: 'top 92%', once: true },
      });
      root.querySelectorAll<HTMLElement>('[data-sa-reveal]').forEach((element, i) => {
        gsap.from(element, {
          autoAlpha: 0, y: 20, duration: 0.76,
          delay: (i % 3) * 0.045, ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 93%', once: true },
        });
      });
      const experience = root.querySelector<HTMLElement>('[data-sa-experience]');
      if (experience) gsap.from(experience, {
        autoAlpha: 0, y: 40, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: experience, start: 'top 91%', once: true },
      });
      root.querySelectorAll<HTMLElement>('[data-sa-ledger-row]').forEach(row => {
        gsap.from(row, {
          autoAlpha: 0, y: 12, duration: 0.55, ease: 'power2.out',
          scrollTrigger: { trigger: row, start: 'top 94%', once: true },
        });
      });
      const outer = root.querySelector<HTMLElement>('[data-sa-orbit]');
      const inner = root.querySelector<HTMLElement>('[data-sa-orbit-reverse]');
      if (outer) orbitTweens.push(gsap.to(outer, { rotation: 360, duration: 82, ease: 'none', repeat: -1, paused: true }));
      if (inner) orbitTweens.push(gsap.to(inner, { rotation: -360, duration: 114, ease: 'none', repeat: -1, paused: true }));
      if (experience && orbitTweens.length) ScrollTrigger.create({
        trigger: experience, start: 'top bottom', end: 'bottom top',
        onEnter: () => orbitTweens.forEach(t => t.play()),
        onEnterBack: () => orbitTweens.forEach(t => t.play()),
        onLeave: () => orbitTweens.forEach(t => t.pause()),
        onLeaveBack: () => orbitTweens.forEach(t => t.pause()),
      });
    }, root);
    // Shared motion director refreshes trigger measurements once on startup.
  }

  select(0);
  beginMotion();
  updateAutoControl();
  motionPreference.addEventListener('change', () => {
    beginMotion();
    scheduleAutoAdvance();
  });
  window.addEventListener('pagehide', () => {
    clearAutoTimer();
    visibilityObserver.disconnect();
    document.removeEventListener('visibilitychange', scheduleAutoAdvance);
    stopMotion();
  }, { once: true });
}
