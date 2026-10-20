/** Section 02: premium editorial practice index.
 * One independent GSAP context. Does not instantiate Lenis or another ticker.
 * All five disciplines remain readable without JS; first preview is static fallback.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const root = document.querySelector<HTMLElement>('[data-wib]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const pointerPrecision = window.matchMedia('(hover: hover) and (pointer: fine)');

if (root) {
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-wib-discipline]'));
  const previews = Array.from(root.querySelectorAll<HTMLElement>('[data-wib-preview]'));
  const currentCount = root.querySelector<HTMLElement>('[data-wib-count]');
  const live = root.querySelector<HTMLElement>('[data-wib-live]');
  const evidence = root.querySelector<HTMLElement>('[data-wib-evidence]');
  const showcase = root.querySelector<HTMLElement>('[data-wib-showcase]');
  const marquee = root.querySelector<HTMLElement>('[data-wib-marquee]');

  const content: Record<string, { count: string; title: string; detail: string }> = {
    fullstack: { count: '01 / 05', title: 'FULL-STACK ENGINEERING', detail: 'From interface to application logic, I build connected experiences that work as a whole.' },
    frontend: { count: '02 / 05', title: 'FRONTEND EXPERIENCES', detail: 'Readable interfaces, expressive interactions, and considered performance on every screen.' },
    systems: { count: '03 / 05', title: 'BACKEND & SYSTEMS', detail: 'Behind the visible product: thoughtful APIs, dependable workflows, and sound data architecture.' },
    mobile: { count: '04 / 05', title: 'MOBILE DEVELOPMENT', detail: 'Cross-platform products designed for meaningful experiences wherever people go.' },
    ai: { count: '05 / 05', title: 'APPLIED AI & MACHINE LEARNING', detail: 'Exploring data, intelligent routing, and research-driven solutions to real problems.' },
  };

  let selected = 'fullstack';
  let animations: gsap.Context | null = null;
  let continuousMotion: gsap.core.Tween | null = null;
  let decoMotion: gsap.core.Tween | null = null;
  let sectionVisible = false;

  function setDiscipline(key: string) {
    const nextData = content[key];
    if (!nextData || key === selected) return;
    const upcoming = previews.find(preview => preview.dataset.wibPreview === key);
    if (!upcoming) return;
    selected = key;
    buttons.forEach(button => {
      const active = button.dataset.wibDiscipline === key;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (currentCount) currentCount.textContent = nextData.count;
    if (live) live.textContent = nextData.title;
    if (evidence) evidence.textContent = nextData.detail;

    const animate = !reducedMotion.matches;
    gsap.killTweensOf(previews);
    previews.forEach(preview => {
      const active = preview === upcoming;
      preview.hidden = !active;
      preview.setAttribute('aria-hidden', String(!active));
      preview.classList.toggle('is-visible', active);
      gsap.set(preview, { clearProps: 'transform,opacity,visibility' });
    });
    if (animate) {
      gsap.fromTo(upcoming, { autoAlpha: 0, y: 20, scale: 1.025 }, {
        autoAlpha: 1, y: 0, scale: 1, duration: .72,
        ease: 'power3.out', clearProps: 'transform,opacity,visibility',
      });
      if (evidence) gsap.fromTo(evidence, { autoAlpha: .45, y: 8 }, { autoAlpha: 1, y: 0, duration: .48, ease: 'power2.out' });
    }
  }

  buttons.forEach((button, index) => {
    const key = button.dataset.wibDiscipline;
    if (!key) return;
    button.addEventListener('click', () => setDiscipline(key));
    button.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse' && pointerPrecision.matches) setDiscipline(key);
    });
    button.addEventListener('focus', () => setDiscipline(key));
    button.addEventListener('keydown', event => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      event.preventDefault();
      const nextIndex = (index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
      buttons[nextIndex]?.focus();
    });
  });

  function stopMotion() {
    animations?.revert();
    animations = null;
    continuousMotion = null;
    decoMotion = null;
    // Normalize the static fallback after re-enabling reduced motion.
    root?.querySelectorAll<HTMLElement>('[data-wib-head],.wib__discipline,.wib__heading-aside,.wib__showcase').forEach(el => {
      gsap.set(el, { clearProps: 'transform,opacity,visibility,clipPath' });
    });
  }

  function setupMotion() {
    stopMotion();
    if (reducedMotion.matches) return;
    animations = gsap.context(() => {
      const headerLines = root.querySelectorAll<HTMLElement>('[data-wib-head]');
      gsap.from(headerLines, {
        yPercent: 70, autoAlpha: 0, duration: 1.12, stagger: .16,
        ease: 'expo.out',
        scrollTrigger: { trigger: root, start: 'top 82%', once: true },
      });
      const chapRule = root.querySelector<HTMLElement>('.wib__chapter-rule');
      if (chapRule) gsap.from(chapRule, {
        scaleX: 0, transformOrigin: 'left center', duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: root, start: 'top 91%', once: true },
      });
      const intro = root.querySelector<HTMLElement>('[data-wib-intro]');
      if (intro) gsap.from(intro, {
        y: 25, autoAlpha: 0, duration: .83, ease: 'power3.out',
        scrollTrigger: { trigger: intro, start: 'top 91%', once: true },
      });
      gsap.from(buttons, {
        y: 20, autoAlpha: 0, duration: .68, stagger: .085,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.querySelector('[data-wib-list]'), start: 'top 88%', once: true },
      });
      if (showcase) gsap.from(showcase, {
        y: 31, autoAlpha: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: showcase, start: 'top 84%', once: true },
      });
      // Gentle continuous outline type. Pauses offscreen and under reduced-motion.
      if (marquee) {
        continuousMotion = gsap.to(marquee, { xPercent: -50, duration: 43, ease: 'none', repeat: -1, paused: true });
        ScrollTrigger.create({
          trigger: root, start: 'top bottom', end: 'bottom top',
          onEnter: () => { sectionVisible = true; continuousMotion?.play(); decoMotion?.play(); },
          onEnterBack: () => { sectionVisible = true; continuousMotion?.play(); decoMotion?.play(); },
          onLeave: () => { sectionVisible = false; continuousMotion?.pause(); decoMotion?.pause(); },
          onLeaveBack: () => { sectionVisible = false; continuousMotion?.pause(); decoMotion?.pause(); },
        });
      }
      const bloom = root.querySelector<HTMLElement>('.wib__bloom');
      if (bloom) {
        decoMotion = gsap.to(bloom, { x: 13, y: 17, scale: 1.045, duration: 11, yoyo: true, repeat: -1, ease: 'sine.inOut', paused: true });
        if (sectionVisible) decoMotion.play();
      }
      const star = root.querySelector<HTMLElement>('.wib__end-symbol');
      if (star) gsap.fromTo(star, { rotate: -14 }, {
        rotate: 14, duration: 9, yoyo: true, repeat: -1, ease: 'sine.inOut',
        scrollTrigger: { trigger: star, start: 'top bottom', end: 'bottom top', toggleActions: 'play pause resume pause' },
      });
    }, root);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  setupMotion();
  reducedMotion.addEventListener('change', setupMotion);
  // Existing shared motion director owns Lenis; do not create a second scroll loop.
  window.addEventListener('pagehide', stopMotion, { once: true });
}
