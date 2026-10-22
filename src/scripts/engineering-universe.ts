/**
 * ENGINEERING UNIVERSE / V2
 * Multiple recyclable skill labels fly continuously toward the viewer across
 * a shared perspective camera. GSAP transforms only; no scroll handlers,
 * blur filters, extra ticker or Lenis instance.
 */
import gsap from 'gsap';
import { skillGroups } from '../data/skillAtlas';

type Entry = { name: string; groupId: string; groupName: string; groupShort: string; groupNumber: number };
type FlightSlot = { el: HTMLElement; timeline: gsap.core.Timeline | null; number: number };

const root = document.querySelector<HTMLElement>('[data-engineering-universe]');
if (root) {
  const stage = root.querySelector<HTMLElement>('[data-eu-theater]')!;
  const slotElements = Array.from(root.querySelectorAll<HTMLElement>('[data-eu-flight]'));
  const currentGroup = root.querySelector<HTMLElement>('[data-eu-current-group]')!;
  const currentName = root.querySelector<HTMLElement>('[data-eu-current-name]')!;
  const counter = root.querySelector<HTMLElement>('[data-eu-counter]')!;
  const status = root.querySelector<HTMLElement>('[data-eu-motion-status]')!;
  const announcer = root.querySelector<HTMLElement>('[data-eu-announcement]')!;
  const categories = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-eu-category]'));
  const pauseButton = root.querySelector<HTMLButtonElement>('[data-eu-pause]')!;
  const pauseLabel = root.querySelector<HTMLElement>('[data-eu-pause-label]')!;
  const pauseIcon = root.querySelector<HTMLElement>('[data-eu-pause-icon]')!;
  const nextButton = root.querySelector<HTMLButtonElement>('[data-eu-next]')!;
  const previousButton = root.querySelector<HTMLButtonElement>('[data-eu-previous]')!;
  const allButton = root.querySelector<HTMLButtonElement>('[data-eu-all]')!;
  const dialog = root.querySelector<HTMLDialogElement>('[data-eu-dialog]')!;
  const closeButton = root.querySelector<HTMLButtonElement>('[data-eu-close]')!;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const smallScreen = matchMedia('(max-width: 700px)');

  const allEntries: Entry[] = skillGroups.flatMap((group, i) => group.skills.map(name => ({
    name, groupId: group.id, groupName: group.title, groupShort: group.short, groupNumber: i + 1,
  })));
  const featured = ['React.js', 'Next.js', 'Flutter', 'Python', 'C++', 'Laravel (PHP)', 'Docker', 'MySQL', 'JavaScript', 'Figma'];
  allEntries.sort((a, b) => {
    const ai = featured.indexOf(a.name);
    const bi = featured.indexOf(b.name);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  // Fixed art-direction positions. Each word follows a consistent Z-axis path;
  // only its starting point differs. Not a random scattered collage.
  const paths = [
    [24, 30], [74, 67], [57, 31], [35, 65], [83, 39],
    [16, 54], [66, 76], [46, 45], [77, 20], [29, 78], [59, 58],
  ] as const;
  const slots: FlightSlot[] = slotElements.map((el, number) => ({ el, number, timeline: null }));

  let filter = 'all';
  let queue: Entry[] = allEntries;
  let cursor = 0;
  let current: Entry = queue[0];
  let inView = false;
  let manualPause = false;
  let modalOpen = false;
  let disposed = false;
  let lastFocused: HTMLElement | null = null;
  let sceneGeneration = 0;

  const playing = () => !disposed && inView && !document.hidden && !manualPause && !modalOpen && !reducedMotion.matches;

  function selectNext(): Entry {
    const entry = queue[cursor % queue.length];
    cursor = (cursor + 1) % queue.length;
    return entry;
  }

  function renderCurrent(entry: Entry, announce = false) {
    current = entry;
    currentName.textContent = entry.name;
    currentGroup.textContent = `${String(entry.groupNumber).padStart(2, '0')} / ${entry.groupShort}`;
    const index = queue.indexOf(entry);
    counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(queue.length).padStart(2, '0')}`;
    if (announce) announcer.textContent = `${entry.name}, ${entry.groupName}. Showing ${queue.length} matching skills.`;
  }

  function setWord(el: HTMLElement, entry: Entry, flightNumber: number) {
    el.textContent = entry.name;
    const n = entry.name.length;
    const size = n > 24 ? 56 : n > 19 ? 67 : n > 14 ? 82 : n > 9 ? 110 : 147;
    const mobile = n > 24 ? 27 : n > 19 ? 33 : n > 14 ? 42 : n > 9 ? 54 : 77;
    el.style.setProperty('--eu-flight-size', `${size}px`);
    el.style.setProperty('--eu-flight-mobile-size', `${mobile}px`);
    const position = paths[flightNumber % paths.length];
    el.style.left = `${position[0]}%`;
    el.style.top = `${position[1]}%`;
  }

  function stopAll() {
    sceneGeneration += 1;
    slots.forEach(slot => {
      slot.timeline?.kill();
      slot.timeline = null;
      gsap.killTweensOf(slot.el);
      gsap.set(slot.el, { clearProps: 'transform,opacity,visibility' });
      slot.el.style.opacity = '0';
    });
  }

  function staticPreview() {
    root.classList.add('eu--static-display');
    slots.forEach((slot, i) => {
      if (i === 0) {
        setWord(slot.el, queue[0], 0);
        gsap.set(slot.el, { x: 0, y: 0, z: 0, rotation: 0, autoAlpha: 1 });
      } else {
        gsap.set(slot.el, { autoAlpha: 0 });
      }
    });
    renderCurrent(queue[0]);
  }

  function buildFlights() {
    stopAll();
    cursor = 0;
    if (reducedMotion.matches || manualPause) {
      staticPreview();
      updateControls();
      return;
    }
    root.classList.remove('eu--static-display');
    const generation = sceneGeneration;
    // Each slot starts at a different moment. Overlapping flights give a
    // continuous flow, rather than forcing the visitor to wait between skills.
    const activeSlotCount = smallScreen.matches ? Math.min(3, slots.length) : Math.min(8, slots.length);
    slots.forEach((slot, i) => {
      if (i >= activeSlotCount) {
        gsap.set(slot.el, { autoAlpha: 0 });
        return;
      }
      const first = selectNext();
      setWord(slot.el, first, i);
      if (i === 0) renderCurrent(first);
      const timeline = gsap.timeline({
        paused: true,
        repeat: -1,
        delay: i * 0.57,
        onRepeat: () => {
          if (generation !== sceneGeneration) return;
          const entry = selectNext();
          setWord(slot.el, entry, (i + cursor) % paths.length);
          renderCurrent(entry);
        },
      });
      timeline
        .set(slot.el, { x: 0, y: 0, z: -1540, autoAlpha: 0, force3D: true }, 0)
        .to(slot.el, { z: 690, duration: 3.62, ease: 'power1.inOut', force3D: true }, 0)
        .to(slot.el, { autoAlpha: 1, duration: 0.50, ease: 'power2.out' }, 0.20)
        .to(slot.el, { autoAlpha: 0, duration: 0.37, ease: 'power2.in' }, 3.21)
        .to({}, { duration: 0.17 });
      slot.timeline = timeline;
    });
    updateControls();
  }

  function updateControls() {
    const run = playing();
    root.classList.toggle('eu--running', run);
    slots.forEach(slot => { if (run) slot.timeline?.play(); else slot.timeline?.pause(); });
    pauseButton.disabled = reducedMotion.matches;
    pauseButton.setAttribute('aria-pressed', String(manualPause));
    pauseIcon.textContent = manualPause ? '▶' : 'Ⅱ';
    pauseLabel.textContent = manualPause ? 'PLAY' : 'PAUSE';
    pauseButton.setAttribute('aria-label', manualPause ? 'Resume moving skills' : 'Pause moving skills');
    if (reducedMotion.matches) status.textContent = 'REDUCED MOTION / STATIC VIEW';
    else if (modalOpen) status.textContent = 'INDEX OPEN / ANIMATIONS PAUSED';
    else if (run) status.textContent = `${filter === 'all' ? 'ALL DISCIPLINES' : filter.toUpperCase()} / LIVE IN DEPTH`;
    else status.textContent = 'DEPTH MOTION PAUSED';
  }

  function changeFilter(group: string) {
    filter = group;
    queue = group === 'all' ? allEntries : allEntries.filter(item => item.groupId === group);
    if (!queue.length) { queue = allEntries; filter = 'all'; }
    categories.forEach(button => {
      const active = button.dataset.euCategory === filter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    buildFlights();
    renderCurrent(queue[0], true);
  }

  function stepSelection(direction: number) {
    // Manual next/previous restarts the visual flow from the requested word,
    // without waiting for any of the existing flights to finish.
    const currentIndex = queue.indexOf(current);
    const newIndex = (currentIndex + direction + queue.length) % queue.length;
    const chosen = queue[newIndex];
    if (!chosen) return;
    const reordered = [...queue.slice(newIndex), ...queue.slice(0, newIndex)];
    queue = reordered;
    buildFlights();
    renderCurrent(chosen, true);
    // Keep the selected skill visible when the stream is intentionally paused.
    if (manualPause || reducedMotion.matches) {
      root.classList.add('eu--static-display');
      slots.forEach((slot, i) => {
        if (i === 0) {
          setWord(slot.el, chosen, 0);
          gsap.set(slot.el, { z: 0, x: 0, y: 0, autoAlpha: 1 });
        } else gsap.set(slot.el, { autoAlpha: 0 });
      });
    }
  }

  categories.forEach(button => button.addEventListener('click', () => changeFilter(button.dataset.euCategory ?? 'all')));
  nextButton.addEventListener('click', () => stepSelection(1));
  previousButton.addEventListener('click', () => stepSelection(-1));
  pauseButton.addEventListener('click', () => {
    manualPause = !manualPause;
    if (!manualPause && root.classList.contains('eu--static-display') && !reducedMotion.matches) buildFlights();
    else updateControls();
  });

  function openIndex() {
    if (typeof dialog.showModal !== 'function' || dialog.open) return;
    lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    modalOpen = true;
    updateControls();
    dialog.showModal();
    closeButton.focus({ preventScroll: true });
  }
  allButton.addEventListener('click', openIndex);
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { modalOpen = false; updateControls(); lastFocused?.focus({ preventScroll: true }); });

  const visibilityObserver = new IntersectionObserver(entries => {
    inView = entries.some(entry => entry.isIntersecting && entry.intersectionRatio > 0.08);
    updateControls();
  }, { threshold: [0, 0.08, 0.30] });
  visibilityObserver.observe(stage);
  document.addEventListener('visibilitychange', updateControls);
  function preferenceChanged() { manualPause = false; buildFlights(); }
  reducedMotion.addEventListener('change', preferenceChanged);
  smallScreen.addEventListener('change', buildFlights);

  function dispose() {
    if (disposed) return;
    disposed = true;
    visibilityObserver.disconnect();

    document.removeEventListener('visibilitychange', updateControls);
    reducedMotion.removeEventListener('change', preferenceChanged);
    smallScreen.removeEventListener('change', buildFlights);
    stopAll();
  }
  window.addEventListener('pagehide', dispose, { once: true });
  root.classList.add('eu--enhanced');
  changeFilter('all');
}
