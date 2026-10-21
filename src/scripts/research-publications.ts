/**
 * Research 05 / liquid glass 3D orbit.
 * One shared GSAP ticker, attached only while in view and actively travelling.
 * Orbit movement uses transform-only writes (no reads per frame).
 * Hover pauses ONLY when the pointer is over a research card, not the theatre.
 * Ticker also pauses for dragging, keyboard accessibility, reading and visibility.
 */
import gsap from 'gsap';
import { researchRecords } from '../data/research';

const root = document.querySelector<HTMLElement>('[data-research-liquid]');
if (root) {
  const theatre = root.querySelector<HTMLElement>('[data-rgl-theatre]')!;
  const windowEl = root.querySelector<HTMLElement>('[data-rgl-orbit]')!;
  const track = root.querySelector<HTMLElement>('[data-rgl-track]')!;
  const items = Array.from(root.querySelectorAll<HTMLElement>('[data-rgl-card]'));
  const picks = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-rgl-pick]'));
  const backs = Array.from(root.querySelectorAll<HTMLElement>('[data-rgl-back]'));
  const fronts = Array.from(root.querySelectorAll<HTMLElement>('[data-rgl-front]'));
  const closes = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-rgl-close]'));
  const art = root.querySelector<HTMLImageElement>('[data-rgl-player-art]')!;
  const title = root.querySelector<HTMLElement>('[data-rgl-player-title]')!;
  const overline = root.querySelector<HTMLElement>('[data-rgl-player-overline]')!;
  const venue = root.querySelector<HTMLElement>('[data-rgl-player-venue]')!;
  const count = root.querySelector<HTMLElement>('[data-rgl-player-count]')!;
  const progress = root.querySelector<HTMLElement>('[data-rgl-progress]')!;
  const live = root.querySelector<HTMLElement>('[data-rgl-live]')!;
  const pauseButton = root.querySelector<HTMLButtonElement>('[data-rgl-toggle]')!;
  const pauseGlyph = root.querySelector<HTMLElement>('[data-rgl-toggle-glyph]')!;
  const previous = root.querySelector<HTMLButtonElement>('[data-rgl-prev]')!;
  const next = root.querySelector<HTMLButtonElement>('[data-rgl-next]')!;
  const explore = root.querySelector<HTMLButtonElement>('[data-rgl-explore]')!;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const TAU = Math.PI * 2;
  const STEP = TAU / items.length;
  const state = { phase: 0 };
  const isSmall = () => window.innerWidth <= 760;
  const modulo = (value: number, n: number) => ((value % n) + n) % n;
  const angleNormalize = (theta: number) => Math.atan2(Math.sin(theta), Math.cos(theta));
  let orbitWidth = 1100;
  let isVisible = false;
  let isHovered = false; // strictly card hover; the surrounding orbit window never pauses playback
  let keyboardFocused = false;
  let isDragging = false;
  let pointerStart = 0;
  let lastPointer = 0;
  let hasDragged = false;
  let suppressClickUntil = 0;
  let manualPaused = false;
  let selectedIndex = 0;
  let openIndex: number | null = null;
  let travelling = false;
  let tickerAttached = false;
  let activeTween: gsap.core.Tween | null = null;
  let closeCall: gsap.core.Tween | null = null;

  const emit = (message: string) => { live.textContent = message; };
  const shouldRun = () => isVisible && !document.hidden && !reduced.matches && !isHovered && !keyboardFocused && !isDragging && !manualPaused && !travelling && openIndex === null;

  function refreshWidth() {
    orbitWidth = windowEl.clientWidth || 1100;
    render();
  }

  function chooseNearest() {
    let best = selectedIndex;
    let distance = Number.POSITIVE_INFINITY;
    for (let i = 0; i < items.length; i++) {
      const d = Math.abs(angleNormalize(state.phase + i * STEP));
      if (d < distance) { best = i; distance = d; }
    }
    if (best !== selectedIndex) setCurrent(best);
  }

  function setCurrent(index: number) {
    selectedIndex = index;
    const entry = researchRecords[index];
    title.textContent = entry.shortTitle;
    overline.textContent = `NOW EXPLORING / ${entry.domain}`;
    venue.textContent = entry.status;
    art.src = entry.cover;
    count.innerHTML = `${entry.index} <i>/</i> ${String(researchRecords.length).padStart(2, '0')}`;
    progress.style.width = `${(index + 1) * 100 / researchRecords.length}%`;
    // Updating the player during autoplay should not spam screen-reader announcements.
  }

  function render() {
    if (!track.classList.contains('is-ready')) return;
    const radius = Math.min(orbitWidth * (isSmall() ? 0.28 : 0.21), isSmall() ? 155 : 310);
    const travel = isSmall() ? 18 : 27;
    items.forEach((item, index) => {
      const a = state.phase + index * STEP;
      const frontDepth = Math.cos(a);
      const sinA = Math.sin(a);
      const theta = angleNormalize(a);
      const x = Math.sign(theta) * radius * Math.pow(Math.abs(theta) / STEP, 0.86);
      const y = (1 - frontDepth) * -travel + Math.abs(sinA) * 3;
      const scale = 0.67 + ((frontDepth + 1) / 2) * 0.33;
      const rotation = -sinA * 29;
      const alpha = Math.min(1, Math.max(0.28, 0.70 + frontDepth * 0.30));
      // Fade the far-side wrap seam outside the visible orbit: no teleporting card.
      const seamFade = Math.min(1, Math.max(0, (Math.PI - Math.abs(theta)) / 0.35));
      item.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) translate(-50%,-50%) rotateY(${rotation.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
      item.style.zIndex = String(Math.round(40 + frontDepth * 34));
      item.style.opacity = (alpha * seamFade).toFixed(3);
      item.style.pointerEvents = seamFade < 0.2 ? 'none' : '';
      item.style.setProperty('--depth', ((frontDepth + 1) / 2).toFixed(3));
    });
  }

  const tick = (_time: number, deltaMs: number) => {
    if (!shouldRun()) { syncTicker(); return; }
    state.phase += Math.min(deltaMs, 64) * 0.000115; // Front-facing cards travel left -> right.
    if (state.phase > TAU * 8) state.phase -= TAU * 8;
    render();
    chooseNearest();
  };

  function syncTicker() {
    const want = shouldRun();
    if (want && !tickerAttached) {
      gsap.ticker.add(tick);
      tickerAttached = true;
    } else if (!want && tickerAttached) {
      gsap.ticker.remove(tick);
      tickerAttached = false;
    }
    const actuallyPaused = manualPaused || openIndex !== null || isHovered || isDragging || keyboardFocused || reduced.matches;
    pauseGlyph.textContent = actuallyPaused ? '▶' : 'Ⅱ';
    pauseButton.setAttribute('aria-pressed', String(manualPaused));
    pauseButton.setAttribute('aria-label', manualPaused ? 'Resume automatic carousel' : 'Pause automatic carousel');
  }

  function markFlipped(index: number) {
    items[index].classList.add('is-open');
    fronts[index].setAttribute('aria-hidden', 'true');
    fronts[index].setAttribute('inert', '');
    backs[index].removeAttribute('aria-hidden');
    backs[index].removeAttribute('inert');
    windowEl.classList.add('is-reading');
    explore.innerHTML = 'CLOSE DOSSIER <span aria-hidden="true">↙</span>';
    emit(`${researchRecords[index].title}, details open`);
    const target = closes[index];
    const delay = reduced.matches ? 0 : 640;
    closeCall?.kill();
    closeCall = gsap.delayedCall(delay / 1000, () => target.focus({ preventScroll: true }));
    syncTicker();
  }

  function closeDetail(restoreFocus = true) {
    if (openIndex === null) return;
    const index = openIndex;
    closeCall?.kill();
    openIndex = null;
    items[index].classList.remove('is-open');
    backs[index].setAttribute('aria-hidden', 'true');
    backs[index].setAttribute('inert', '');
    fronts[index].removeAttribute('aria-hidden');
    fronts[index].removeAttribute('inert');
    windowEl.classList.remove('is-reading');
    explore.innerHTML = 'EXPLORE RESEARCH <span aria-hidden="true">↗</span>';
    if (restoreFocus) {
      picks[index].focus({ preventScroll: true });
    } else {
      // Pointer-operated Close must not leave keyboard focus trapping autoplay.
      if (document.activeElement === closes[index]) closes[index].blur();
      keyboardFocused = false;
    }
    emit(`${researchRecords[index].shortTitle}, details closed`);
    syncTicker();
  }

  function openDetail(index: number) {
    if (travelling || index < 0 || index >= items.length) return;
    if (Date.now() < suppressClickUntil) return;
    if (openIndex === index) { closeDetail(); return; }
    if (openIndex !== null) closeDetail(false);
    activeTween?.kill();
    travelling = true;
    openIndex = index;
    syncTicker();
    const delta = angleNormalize(state.phase + index * STEP);
    const finish = () => {
      travelling = false;
      setCurrent(index);
      markFlipped(index);
    };
    if (reduced.matches || Math.abs(delta) < 0.015) {
      state.phase -= delta;
      render();
      finish();
    } else {
      activeTween = gsap.to(state, { phase: state.phase - delta, duration: 0.82, ease: 'power3.inOut', onUpdate: render, onComplete: finish });
    }
  }

  function navigate(direction: number) {
    // Use whichever card is nearest to the front; wrap without visible jump.
    const target = modulo(selectedIndex + direction, items.length);
    if (openIndex !== null) closeDetail(false);
    activeTween?.kill();
    travelling = true;
    syncTicker();
    const delta = angleNormalize(state.phase + target * STEP);
    const finish = () => { travelling = false; setCurrent(target); emit(`${researchRecords[target].shortTitle} selected`); syncTicker(); };
    if (reduced.matches) { state.phase -= delta; render(); finish(); }
    else { activeTween = gsap.to(state, { phase: state.phase - delta, duration: 0.73, ease: 'power3.inOut', onUpdate: render, onComplete: finish }); }
  }

  picks.forEach((button, index) => button.addEventListener('click', () => openDetail(index)));
  closes.forEach(button => button.addEventListener('click', event => {
    // Keyboard click has detail === 0; pointer click restores normal autoplay.
    closeDetail(event.detail === 0);
  }));
  previous.addEventListener('click', () => navigate(-1));
  next.addEventListener('click', () => navigate(1));
  explore.addEventListener('click', () => openIndex === null ? openDetail(selectedIndex) : closeDetail(false));
  pauseButton.addEventListener('click', () => { manualPaused = !manualPaused; syncTicker(); emit(manualPaused ? 'Carousel paused' : 'Carousel playback resumed'); });

  // Do not stop when entering the empty theatre or orbit rectangle.
  // Only the actual transformed <article data-rgl-card> surfaces pause autoplay.
  // A Set handles adjacent/overlapping carousel cards without spurious restarts.
  const hoveredCards = new Set<HTMLElement>();
  items.forEach(card => {
    card.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch') return;
      hoveredCards.add(card);
      isHovered = true;
      syncTicker();
    });
    card.addEventListener('pointerleave', event => {
      if (event.pointerType === 'touch') return;
      hoveredCards.delete(card);
      isHovered = hoveredCards.size > 0;
      syncTicker();
    });
  });
  // Clear stale hover when dragging leaves the entire orbit region.
  windowEl.addEventListener('pointerleave', () => {
    if (isDragging) return;
    hoveredCards.clear();
    isHovered = false;
    syncTicker();
  });
  windowEl.addEventListener('focusin', (event) => {
    if (!(event.target instanceof HTMLElement && event.target.matches(':focus-visible'))) return;
    keyboardFocused = true; syncTicker();
  });
  windowEl.addEventListener('focusout', () => {
    requestAnimationFrame(() => { if (!windowEl.contains(document.activeElement)) { keyboardFocused = false; syncTicker(); } });
  });
  windowEl.addEventListener('keydown', event => {
    if (event.key === 'Escape' && openIndex !== null) { event.preventDefault(); closeDetail(); }
    if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && openIndex === null) {
      event.preventDefault(); navigate(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  windowEl.addEventListener('pointerdown', event => {
    if (event.button !== 0 || openIndex !== null || travelling || reduced.matches) return;
    isDragging = true; pointerStart = lastPointer = event.clientX; hasDragged = false;
    syncTicker();
  });
  window.addEventListener('pointermove', event => {
    if (!isDragging) return;
    const dx = event.clientX - lastPointer;
    lastPointer = event.clientX;
    if (Math.abs(event.clientX - pointerStart) > 8) {
      hasDragged = true;
      windowEl.classList.add('is-dragging');
      state.phase += dx / Math.max(260, orbitWidth) * 2.7;
      render(); chooseNearest();
    }
  }, { passive: true });
  const endDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    windowEl.classList.remove('is-dragging');
    if (hasDragged) suppressClickUntil = Date.now() + 300;
    hoveredCards.clear();
    items.forEach(card => { if (card.matches(':hover')) hoveredCards.add(card); });
    isHovered = hoveredCards.size > 0;
    syncTicker();
  };
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  const observer = new IntersectionObserver(entries => {
    isVisible = !!entries[0]?.isIntersecting;
    if (isVisible && !track.classList.contains('is-ready')) {
      track.classList.add('is-ready');
      requestAnimationFrame(() => { refreshWidth(); setCurrent(0); });
    }
    syncTicker();
  }, { threshold: 0.08 });
  observer.observe(theatre);
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(refreshWidth) : null;
  ro?.observe(windowEl);
  const onVisibility = () => syncTicker();
  const onReduced = () => { syncTicker(); if (reduced.matches) { activeTween?.kill(); travelling = false; render(); } };
  document.addEventListener('visibilitychange', onVisibility);
  reduced.addEventListener('change', onReduced);
  track.classList.add('is-ready');
  requestAnimationFrame(() => { refreshWidth(); setCurrent(0); syncTicker(); });

  window.addEventListener('pagehide', () => {
    if (tickerAttached) gsap.ticker.remove(tick);
    observer.disconnect(); ro?.disconnect();
    activeTween?.kill(); closeCall?.kill();
    document.removeEventListener('visibilitychange', onVisibility);
    reduced.removeEventListener('change', onReduced);
  }, { once: true });
}
