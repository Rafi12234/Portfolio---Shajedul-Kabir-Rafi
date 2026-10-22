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

    // RAFI_STORY_CROSSFADES_V2 — ALL THREE companies share the same origin.
    // Both articles are absolutely positioned by the bundled CSS while
    // crossfading; no second article can push the first one down the page.
    activeTimeline?.kill();
    const headlineParts = Array.from(toStory.querySelectorAll<HTMLElement>(
      '.xp__story-topline, .xp__story-name, .xp__position-row, .xp__description, .xp__work-head'
    ));
    const workParts = Array.from(toStory.querySelectorAll<HTMLElement>('.xp__project'));
    const careerParts = Array.from(toStory.querySelectorAll<HTMLElement>(
      '.xp__career-heading, .xp__career-step'
    ));
    const footnote = Array.from(toStory.querySelectorAll<HTMLElement>('.xp__story-footnote'));
    const revealParts = [...headlineParts, ...workParts, ...careerParts, ...footnote];

    // Reveal preparation happens BEFORE the timeline starts, not in an
    // onUpdate or an animation-completion callback. This eliminates a flash
    // of unstyled company text while the selected background expands.
    toStory.hidden = false;
    fromStory.style.zIndex = '1';
    toStory.style.zIndex = '2';
    gsap.set(toStory, { autoAlpha: 0, y: 24 });
    gsap.set(revealParts, { autoAlpha: 0, y: 18, x: -8 });

    let committed = false;
    const commitSelection = () => {
      if (committed) return;
      committed = true;
      setVisualState(index);
      activeIndex = index;
    };
    const cleanup = () => {
      commitSelection();
      fromStory.hidden = true;
      gsap.set(fromStory, { clearProps: 'transform,opacity,visibility' });
      gsap.set(toStory, { clearProps: 'transform,opacity,visibility' });
      gsap.set(revealParts, { clearProps: 'transform,opacity,visibility' });
      fromStory.style.removeProperty('z-index');
      toStory.style.removeProperty('z-index');
      gsap.set(expander, { clearProps: 'all' });
      animating = false;
      activeTimeline = null;
    };

    activeTimeline = gsap.timeline({
      defaults: { overwrite: 'auto' },
      onComplete: cleanup,
    });
    activeTimeline
      .to(fromStory, { autoAlpha: 0, x: -25, duration: .36, ease: 'power2.inOut' }, .06)
      .to(expander, {
        clipPath: 'inset(0% 0% 0% 0% round 0px)',
        duration: 1.09,
        ease: 'power3.inOut',
      }, 0)
      .call(commitSelection, [], .70)
      .to(expander, { autoAlpha: 0, duration: .48, ease: 'power2.inOut' }, .90)
      .to(toStory, { autoAlpha: 1, y: 0, duration: .62, ease: 'power3.out' }, .77)
      .to(headlineParts, {
        autoAlpha: 1, x: 0, y: 0, duration: .65, stagger: .085, ease: 'power3.out',
      }, .84)
      .to(workParts, {
        autoAlpha: 1, x: 0, y: 0, duration: .48, stagger: .065, ease: 'power3.out',
      }, 1.13);
    // No empty GSAP tweens for companies without a leadership timeline.
    if (careerParts.length) activeTimeline.to(careerParts, {
      autoAlpha: 1, x: 0, y: 0, duration: .48, stagger: .07, ease: 'power3.out',
    }, 1.24);
    if (footnote.length) activeTimeline.to(footnote, {
      autoAlpha: 1, x: 0, y: 0, duration: .46, ease: 'power3.out',
    }, 1.36);
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
