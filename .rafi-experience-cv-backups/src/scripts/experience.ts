/**
 * Section 05: experience cards expand into their company environment.
 * Intentionally event-driven: zero permanent ticker work, zero Lenis instances,
 * zero scroll listeners. Only one GSAP timeline runs during a company switch.
 */
import gsap from 'gsap';
import { experienceOrganizations } from '../data/experience';

const root = document.querySelector<HTMLElement>('[data-experience]');

if (root) {
  const stage = root.querySelector<HTMLElement>('[data-xp-stage]')!;
  const expander = root.querySelector<HTMLElement>('[data-xp-expander]')!;
  const expansionImage = root.querySelector<HTMLImageElement>('[data-xp-expand-image]')!;
  const stories = Array.from(root.querySelectorAll<HTMLElement>('[data-xp-story]'));
  const backdrops = Array.from(root.querySelectorAll<HTMLElement>('[data-xp-background]'));
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-xp-select]'));
  const swatches = Array.from(root.querySelectorAll<HTMLElement>('.xp__swatches i'));
  const counter = root.querySelector<HTMLElement>('[data-xp-counter]')!;
  const status = root.querySelector<HTMLElement>('[data-xp-status]')!;
  const prev = root.querySelector<HTMLButtonElement>('[data-xp-prev]')!;
  const next = root.querySelector<HTMLButtonElement>('[data-xp-next]')!;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (value: number) => Math.min(100, Math.max(0, value));

  let activeIndex = 0;
  let animating = false;
  let activeTimeline: gsap.core.Timeline | null = null;

  function setVisualState(index: number) {
    const org = experienceOrganizations[index];
    stage.style.setProperty('--xp-accent', org.accent);
    stage.classList.remove('xp__stage--datapulse', 'xp__stage--boraq', 'xp__stage--robotics');
    stage.classList.add(`xp__stage--${org.id}`);
    buttons.forEach((button, i) => {
      const selected = i === index;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    backdrops.forEach((background, i) => background.classList.toggle('is-active', index === i));
    swatches.forEach((swatch, i) => swatch.classList.toggle('is-active', i === index));
    counter.innerHTML = `${String(index + 1).padStart(2, '0')} <span>/ 03</span>`;
    status.textContent = `Showing ${org.name} experience`;
  }

  function immediateSelect(index: number) {
    stories.forEach((story, i) => {
      gsap.set(story, { clearProps: 'transform,opacity,visibility' });
      story.hidden = i !== index;
    });
    setVisualState(index);
    activeIndex = index;
    animating = false;
    gsap.set(expander, { clearProps: 'all' });
  }

  function select(index: number, origin?: HTMLElement) {
    if (animating || index === activeIndex) return;
    if (!experienceOrganizations[index]) return;

    // Respect system preference and avoid a heavy mask animation on limited layouts.
    if (reduced.matches) {
      immediateSelect(index);
      return;
    }

    const fromStory = stories[activeIndex];
    const toStory = stories[index];
    const stageRect = stage.getBoundingClientRect();
    const cardRect = (origin ?? buttons[index]).getBoundingClientRect();
    const top = clamp(((cardRect.top - stageRect.top) / stageRect.height) * 100);
    const right = clamp(((stageRect.right - cardRect.right) / stageRect.width) * 100);
    const bottom = clamp(((stageRect.bottom - cardRect.bottom) / stageRect.height) * 100);
    const left = clamp(((cardRect.left - stageRect.left) / stageRect.width) * 100);
    const initialMask = `inset(${top.toFixed(2)}% ${right.toFixed(2)}% ${bottom.toFixed(2)}% ${left.toFixed(2)}% round 3px)`;

    animating = true;
    expansionImage.src = experienceOrganizations[index].background;
    gsap.set(expander, { autoAlpha: 1, clipPath: initialMask });
    gsap.set(fromStory, { autoAlpha: 1, x: 0 });

    activeTimeline?.kill();
    let swapped = false;
    const swapContent = () => {
      if (swapped) return;
      swapped = true;
      toStory.hidden = false;
      gsap.set(toStory, { autoAlpha: 0, y: 23 });
      setVisualState(index);
      activeIndex = index;
    };

    activeTimeline = gsap.timeline({
      defaults: { overwrite: 'auto' },
      onComplete: () => {
        swapContent();
        fromStory.hidden = true;
        gsap.set(fromStory, { clearProps: 'transform,opacity,visibility' });
        gsap.set(toStory, { clearProps: 'transform,opacity,visibility' });
        gsap.set(expander, { clearProps: 'all' });
        animating = false;
        activeTimeline = null;
      },
    });
    activeTimeline
      .to(fromStory, { autoAlpha: 0, x: -20, duration: 0.26, ease: 'power2.in' }, 0)
      .to(expander, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.12, ease: 'power3.inOut' }, 0)
      .call(swapContent, [], 0.72)
      .to(expander, { autoAlpha: 0, duration: 0.49, ease: 'power2.inOut' }, 0.91)
      // CONSISTENT_STORY_REVEAL: the same headline, metadata, body and list
      // choreography for DataPulse, Boraq and AUST Robotics — no hidden jumps.
      .to(toStory, { autoAlpha: 1, y: 0, duration: .52, ease: 'power3.out' }, .84)
      .fromTo(toStory.querySelectorAll(
        '.xp__story-topline, .xp__story-name, .xp__position-row, .xp__description, .xp__work-head, .xp__project, .xp__career-heading, .xp__career-step, .xp__story-footnote'),
        { autoAlpha: 0, y: 18, x: -9 },
        { autoAlpha: 1, y: 0, x: 0, duration: .68, ease: 'power3.out', stagger: .065,
          clearProps: 'transform,opacity,visibility' },
        .89);
  }

  buttons.forEach((button, index) => button.addEventListener('click', () => select(index, button)));
  prev.addEventListener('click', () => select((activeIndex + experienceOrganizations.length - 1) % experienceOrganizations.length, buttons[(activeIndex + experienceOrganizations.length - 1) % experienceOrganizations.length]));
  next.addEventListener('click', () => select((activeIndex + 1) % experienceOrganizations.length, buttons[(activeIndex + 1) % experienceOrganizations.length]));

  // Scroll entrance is triggered once, not scrubbed on every scroll frame.
  const observer = new IntersectionObserver(entries => {
    const entry = entries[0];
    if (!entry?.isIntersecting) return;
    observer.disconnect();
    if (reduced.matches) return;
    gsap.fromTo(root.querySelectorAll('.xp__intro-kicker, .xp__intro-grid h2'),
      { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.95, stagger: 0.11, ease: 'power3.out' });
    gsap.fromTo(buttons,
      { y: 38, opacity: 0 }, { y: 0, opacity: 1, duration: 0.84, stagger: 0.115, delay: 0.22, ease: 'power3.out', clearProps: 'transform,opacity' });
  }, { threshold: 0.12 });
  observer.observe(root);

  window.addEventListener('pagehide', () => {
    observer.disconnect();
    activeTimeline?.kill();
  }, { once: true });
}
