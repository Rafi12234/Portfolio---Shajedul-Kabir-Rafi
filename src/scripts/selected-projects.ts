/** Selected Work / cinematic filmstrip. Single set of project elements; no clone tracks.
 * Uses the existing GSAP ticker/ScrollTrigger ecosystem and never constructs Lenis.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { selectedProjects } from '../data/selectedProjects';

gsap.registerPlugin(ScrollTrigger);

const root = document.querySelector<HTMLElement>('[data-selected-work]');
if (root) {
  const cinema = root.querySelector<HTMLElement>('[data-sw-cinema]')!;
  const reel = root.querySelector<HTMLElement>('[data-sw-reel]')!;
  const cards = Array.from(reel.querySelectorAll<HTMLElement>('[data-sw-item]'));
  const filters = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-sw-filter]'));
  const pauseButton = root.querySelector<HTMLButtonElement>('[data-sw-pause]')!;
  const stateText = root.querySelector<HTMLElement>('[data-sw-state]')!;
  const dialog = root.querySelector<HTMLDialogElement>('[data-sw-dialog]')!;
  const modal = root.querySelector<HTMLElement>('[data-sw-modal]')!;
  const closeButton = root.querySelector<HTMLButtonElement>('[data-sw-close]')!;
  const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  const bySlug = new Map(selectedProjects.map((project) => [project.slug, project]));
  let activeGroup = 'all';
  let hovered = false;
  let focused = false;
  let manuallyPaused = false;
  let inView = false;
  let inspecting = false;
  let motion: gsap.core.Tween | null = null;
  let lastOpener: HTMLElement | null = null;
  let modalTween: gsap.core.Tween | null = null;
  let closeInProgress = false;
  let visibleCards: HTMLElement[] = [];
  let step = 255;
  let speed = 42;
  let trackLength = 0;
  const travel = { value: 0 };
  let frames = 0;
  let cinemaHeight = 0;
  // Cache positions outside the DOM so every animation tick stays write-only.
  const cardPositions = new Map<HTMLElement, number>();
  const cardLayers = new Map<HTMLElement, number>();
  const cardVisible = new Map<HTMLElement, boolean>();
  const cardLinks = new Map(cards.map(card => [card, card.querySelector<HTMLAnchorElement>('[data-sw-open]')!] as const));
  const activeAnimation = (): boolean => !rm.matches && visibleCards.length > 1;

  function say(value: string) { if (stateText.textContent !== value) stateText.textContent = value; }
  function pauseNeeded() { return document.hidden || !inView || hovered || focused || manuallyPaused || inspecting || rm.matches; }
  function updateControls() {
    const paused = pauseNeeded();
    if (motion) paused ? motion.pause() : motion.resume();
    pauseButton.setAttribute('aria-pressed', String(manuallyPaused));
    pauseButton.disabled = rm.matches || visibleCards.length < 2;
    pauseButton.textContent = manuallyPaused ? '▶  RESUME MOTION' : 'Ⅱ  PAUSE MOTION';
    if (inspecting) say('PROJECT DETAILS / OPEN');
    else if (rm.matches) say('ACCESSIBLE STATIC ARCHIVE');
    else if (visibleCards.length < 2) say('SINGLE PROJECT / STATIC');
    else say(paused ? 'MOTION PAUSED' : 'ARCHIVE IN MOTION');
  }
  function setFocusability() {
    // Read a cache, never layout, and do not rewrite a tabindex unless it changed.
    const height = cinemaHeight;
    visibleCards.forEach(card => {
      const y = cardPositions.get(card) ?? -10000;
      const onScreen = y > -step * 1.4 && y < height + step * .4;
      const link = cardLinks.get(card)!;
      const next = onScreen ? 0 : -1;
      if (link.tabIndex !== next) link.tabIndex = next;
    });
  }
  function renderMotion() {
    if (!activeAnimation() || trackLength <= 0) return;
    const low = -Math.max(240, step * 1.1);
    const visibleLimit = cinema.clientHeight + step;
    visibleCards.forEach((card, index) => {
      const adjusted = index * step - travel.value;
      const wrapped = ((adjusted - low) % trackLength + trackLength) % trackLength + low;
      cardPositions.set(card, wrapped);
      const shouldDraw = wrapped > low - step && wrapped < visibleLimit;
      if (cardVisible.get(card) !== shouldDraw) {
        card.style.visibility = shouldDraw ? 'visible' : 'hidden';
        card.style.pointerEvents = shouldDraw ? 'auto' : 'none';
        card.classList.toggle('sw__item--composited', shouldDraw);
        cardVisible.set(card, shouldDraw);
      }
      if (!shouldDraw) return;
      card.style.transform = `translate3d(0,${wrapped.toFixed(1)}px,0)`;
      const layer = 10 + Math.max(0, Math.floor(wrapped / Math.max(step, 1)));
      if (cardLayers.get(card) !== layer) {
        card.style.zIndex = String(layer);
        cardLayers.set(card, layer);
      }
    });
    if (++frames % 20 === 0) setFocusability();
  }
  function stopMotion() { motion?.kill(); motion = null; gsap.set(travel, { value: 0 }); }
  function relayout() {
    stopMotion();
    const wasAnimated = root.classList.contains('sw--animated');
    visibleCards = cards.filter(card => activeGroup === 'all' || card.dataset.swGroup === activeGroup);
    cardPositions.clear(); cardLayers.clear(); cardVisible.clear();
    cards.forEach(card => {
      card.hidden = !visibleCards.includes(card);
      card.style.transform = '';
      card.style.zIndex = '';
      card.style.visibility = '';
      card.style.pointerEvents = '';
      card.classList.remove('sw__item--composited');
      card.querySelector<HTMLAnchorElement>('[data-sw-open]')!.tabIndex = 0;
    });
    const animated = !rm.matches && visibleCards.length > 1;
    root.classList.toggle('sw--animated', animated);
    root.classList.toggle('sw--single', visibleCards.length === 1 && !rm.matches);
    if (wasAnimated !== animated) requestAnimationFrame(() => ScrollTrigger.refresh());
    cinemaHeight = cinema.clientHeight;
    if (!animated) { updateControls(); return; }
    // Respect actual CSS card heights at each breakpoint.
    step = Math.round(visibleCards[0]?.offsetHeight * (window.innerWidth < 700 ? .87 : .82)) || 255;
    speed = window.innerWidth < 700 ? 43 : 52;
    trackLength = step * visibleCards.length;
    motion = gsap.to(travel, {
      value: trackLength,
      duration: trackLength / speed,
      repeat: -1,
      ease: 'none',
      onUpdate: renderMotion,
      onRepeat: () => renderMotion(),
    });
    renderMotion();
    updateControls();
    // The carousel height is fixed. No ScrollTrigger refresh is needed for each filter.
  }

  function fillModal(slug: string) {
    const project = bySlug.get(slug);
    if (!project) return false;
    const idx = selectedProjects.indexOf(project) + 1;
    const num = String(idx).padStart(2,'0');
    const text = (selector: string, value: string) => {
      const element = dialog.querySelector<HTMLElement>(selector);
      if (element) element.textContent = value;
    };
    text('[data-sw-modal-title]', project.title);
    text('[data-sw-modal-subtitle]', project.kicker);
    text('[data-sw-modal-description]', project.summary);
    text('[data-sw-modal-eyebrow]', `PROJECT ${num} / ${project.group.replace('experimental','EXPERIMENTS').toUpperCase()}`);
    text('[data-sw-modal-pagination]', `${num} / ${selectedProjects.length}`);
    const modalImage = dialog.querySelector<HTMLImageElement>('[data-sw-modal-image]');
    if (modalImage) {
      modalImage.src = `/assets/project-covers/${project.slug}.webp`;
      modalImage.alt = `Generated demonstration mockup for ${project.title}, not a screenshot of the actual application`;
    }
    const art = dialog.querySelector<HTMLElement>('[data-sw-modal-art]')!;
    art.className = `sw__modal-art sw__modal-art--${project.tone}`;
    const stack = dialog.querySelector<HTMLElement>('[data-sw-modal-stack]')!;
    stack.replaceChildren(...project.stack.map(name => {
      const span = document.createElement('span'); span.textContent = name; return span;
    }));
    const features = dialog.querySelector<HTMLUListElement>('[data-sw-modal-features]')!;
    features.replaceChildren(...(project.highlights || []).map(feature => {
      const li = document.createElement('li'); li.textContent = feature; return li;
    }));
    const note = dialog.querySelector<HTMLElement>('[data-sw-modal-note]')!;
    note.hidden = !project.note;
    note.textContent = project.note ? `REPOSITORY NOTE / ${project.note}` : '';
    dialog.querySelector<HTMLAnchorElement>('[data-sw-modal-repo]')!.href = project.repo;
    return true;
  }
  function openModal(cardLink: HTMLAnchorElement) {
    if (!dialog.showModal || dialog.open) return;
    const card = cardLink.closest<HTMLElement>('[data-sw-project]');
    if (!card || !fillModal(card.dataset.swProject || '')) return;
    lastOpener = cardLink;
    inspecting = true;
    closeInProgress = false;
    document.documentElement.classList.add('sw-modal-open');
    dialog.showModal();
    updateControls();
    if (!rm.matches) {
      gsap.set(modal, { autoAlpha: 0, y: 20 });
      modalTween?.kill();
      modalTween = gsap.to(modal, { autoAlpha: 1, y: 0, duration: .44, ease: 'power3.out', clearProps: 'transform,opacity,visibility' });
    }
    closeButton.focus({ preventScroll: true });
  }
  function finishClose() {
    modalTween?.kill();
    if (dialog.open) dialog.close();
    document.documentElement.classList.remove('sw-modal-open');
    inspecting = false;
    closeInProgress = false;
    const returnTo = lastOpener;
    lastOpener = null;
    if (returnTo?.isConnected) {
      returnTo.tabIndex = 0;
      returnTo.focus({ preventScroll: true });
      if (!finePointer.matches) focused = false;
    }
    updateControls();
  }
  function closeModal() {
    if (closeInProgress || !dialog.open) return;
    closeInProgress = true;
    modalTween?.kill();
    if (rm.matches) { finishClose(); return; }
    modalTween = gsap.to(modal, { autoAlpha: 0, y: 12, duration: .22, ease: 'power2.in', onComplete: finishClose });
  }

  root.querySelectorAll<HTMLAnchorElement>('[data-sw-open]').forEach(link => {
    link.addEventListener('click', event => {
      if (typeof dialog.showModal !== 'function') return; // no-JS/older-browser link fallback
      event.preventDefault();
      openModal(link);
    });
  });
  closeButton.addEventListener('click', closeModal);
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeModal(); });
  dialog.addEventListener('click', event => { if (event.target === dialog) closeModal(); });
  dialog.addEventListener('close', () => { // also handles external/native close
    if (inspecting) finishClose();
  });
  filters.forEach(filter => filter.addEventListener('click', () => {
    activeGroup = filter.dataset.swFilter || 'all';
    filters.forEach(item => {
      const active = item === filter;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    relayout();
  }));
  pauseButton.addEventListener('click', () => { manuallyPaused = !manuallyPaused; updateControls(); });
  // Important: stop ONLY while pointing at an actual project card, not at
  // background lettering, empty cinema gutters, or the sides of the stage.
  const hoveredCards = new Set<HTMLAnchorElement>();
  root.querySelectorAll<HTMLAnchorElement>('[data-sw-open]').forEach(link => {
    link.addEventListener('pointerenter', event => {
      if (!finePointer.matches || event.pointerType === 'touch') return;
      hoveredCards.add(link);
      hovered = true;
      updateControls();
    });
    link.addEventListener('pointerleave', () => {
      hoveredCards.delete(link);
      hovered = hoveredCards.size > 0;
      updateControls();
    });
  });
  cinema.addEventListener('pointerleave', () => {
    hoveredCards.clear();
    hovered = false;
    updateControls();
  });
  cinema.addEventListener('focusin', () => { focused = true; updateControls(); });
  cinema.addEventListener('focusout', () => requestAnimationFrame(() => {
    focused = cinema.contains(document.activeElement); updateControls();
  }));
  const observer = new IntersectionObserver(entries => {
    inView = !!entries[0]?.isIntersecting;
    root.classList.toggle('sw--cinema-visible', inView && !document.hidden && !rm.matches);
    updateControls();
  }, { threshold: .06 });
  observer.observe(cinema);
  document.addEventListener('visibilitychange', () => {
    root.classList.toggle('sw--cinema-visible', inView && !document.hidden && !rm.matches);
    updateControls();
  });
  let resizeFrame = 0;
  let lastWidth = document.documentElement.clientWidth;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      const width = document.documentElement.clientWidth;
      if (Math.abs(width - lastWidth) < 2) return;
      lastWidth = width;
      relayout();
    });
  }, { passive: true });
  rm.addEventListener('change', relayout);
  let intro: gsap.core.Tween | undefined;
  if (!rm.matches) {
    const heading = root.querySelector<HTMLElement>('.sw__headline');
    if (heading) intro = gsap.from(heading, {
      y: 38, autoAlpha: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: heading, start: 'top 89%', once: true },
    });
  }
  relayout();
  window.addEventListener('pagehide', () => {
    stopMotion(); observer.disconnect(); intro?.kill();
    if (dialog.open) dialog.close();
    document.documentElement.classList.remove('sw-modal-open');
  }, { once: true });
}
