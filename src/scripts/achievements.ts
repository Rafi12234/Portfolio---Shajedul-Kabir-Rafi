/** Achievement Evidence Gallery — one-shot entrance, event-driven exhibit switch. */
import gsap from 'gsap';
import { achievements } from '../data/achievements';

const root = document.querySelector<HTMLElement>('[data-achievements]');
if (root) {
  const photos = Array.from(root.querySelectorAll<HTMLElement>('[data-aw-photo]'));
  const stories = Array.from(root.querySelectorAll<HTMLElement>('[data-aw-story]'));
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-aw-select]'));
  const imageCounter = root.querySelector<HTMLElement>('[data-aw-evidence-counter]')!;
  const storyCounter = root.querySelector<HTMLElement>('[data-aw-story-counter]')!;
  const caption = root.querySelector<HTMLElement>('[data-aw-photo-caption]')!;
  const announcement = root.querySelector<HTMLElement>('[data-aw-announcement]')!;
  const theater = root.querySelector<HTMLElement>('[data-aw-theater]')!;
  const exhibit = root.querySelector<HTMLElement>('[data-aw-exhibit]')!;
  const dialog = root.querySelector<HTMLDialogElement>('[data-aw-dialog]')!;
  const close = root.querySelector<HTMLButtonElement>('[data-aw-close]')!;
  const dialogImage = root.querySelector<HTMLImageElement>('[data-aw-dialog-image]')!;
  const dialogTitle = root.querySelector<HTMLElement>('[data-aw-dialog-title]')!;
  const dialogNote = root.querySelector<HTMLElement>('[data-aw-dialog-note]')!;
  const dialogNumber = root.querySelector<HTMLElement>('[data-aw-dialog-no]')!;
  const dialogLink = root.querySelector<HTMLAnchorElement>('[data-aw-dialog-link]')!;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let transitioning = false;
  let switchTimeline: gsap.core.Timeline | null = null;
  let lastFocused: HTMLElement | null = null;

  function setIndex(index: number) {
    const entry = achievements[index];
    imageCounter.textContent = `${entry.number} / 03`;
    storyCounter.textContent = `${entry.number} — 03`;
    caption.textContent = `${entry.issuer.toUpperCase()} / ${entry.award.toUpperCase()}`;
    announcement.textContent = `Showing ${entry.award}, ${entry.date}`;
    buttons.forEach((button, i) => {
      button.classList.toggle('is-active', i === index);
      button.setAttribute('aria-pressed', String(i === index));
    });
    active = index;
  }

  function immediate(index: number) {
    photos.forEach((photo, i) => {
      photo.hidden = i !== index;
      photo.classList.toggle('is-active', i === index);
      gsap.set(photo, { clearProps: 'all' });
    });
    stories.forEach((story, i) => {
      story.hidden = i !== index;
      gsap.set(story, { clearProps: 'all' });
    });
    setIndex(index);
    transitioning = false;
  }

  function select(index: number) {
    if (!achievements[index] || index === active || transitioning) return;
    if (reduced.matches) { immediate(index); return; }
    transitioning = true;
    const outgoingPhoto = photos[active];
    const incomingPhoto = photos[index];
    const outgoingStory = stories[active];
    const incomingStory = stories[index];
    incomingPhoto.hidden = false;
    incomingStory.hidden = false;
    incomingPhoto.classList.add('is-active');
    gsap.set(incomingPhoto, { zIndex: 2, clipPath: 'inset(0 100% 0 0)' });
    gsap.set(incomingStory, { autoAlpha: 0, y: 22 });
    switchTimeline?.kill();
    switchTimeline = gsap.timeline({
      onComplete: () => {
        outgoingPhoto.hidden = true;
        outgoingPhoto.classList.remove('is-active');
        outgoingStory.hidden = true;
        gsap.set([incomingPhoto, outgoingPhoto, incomingStory, outgoingStory], { clearProps: 'all' });
        setIndex(index);
        transitioning = false;
        switchTimeline = null;
      },
    });
    switchTimeline
      .to(outgoingStory, { autoAlpha: 0, y: -14, duration: .24, ease: 'power2.in' }, 0)
      .to(incomingPhoto, { clipPath: 'inset(0 0% 0 0)', duration: .90, ease: 'power3.inOut' }, .04)
      .add(() => setIndex(index), .38)
      .to(incomingStory, { autoAlpha: 1, y: 0, duration: .72, ease: 'power3.out' }, .35)
      .fromTo(incomingStory.querySelectorAll('.aw__story-overline, .aw__story-lead, .aw__facts > div, .aw__story-actions'),
        { y: 11, opacity: 0 },
        { y: 0, opacity: 1, duration: .44, stagger: .055, ease: 'power2.out' }, .51);
  }

  buttons.forEach((button, index) => button.addEventListener('click', () => select(index)));

  function openProof(trigger: HTMLElement) {
    if (typeof dialog.showModal !== 'function' || dialog.open) return;
    lastFocused = trigger;
    const entry = achievements[active];
    dialogImage.src = entry.proof;
    dialogImage.alt = entry.photoAlt;
    dialogTitle.textContent = entry.award;
    dialogNote.textContent = `${entry.issuer} · ${entry.date} · ${entry.note}`;
    dialogNumber.textContent = entry.number;
    dialogLink.href = entry.externalUrl;
    dialog.showModal();
    close.focus();
  }
  root.querySelectorAll<HTMLButtonElement>('[data-aw-zoom],[data-aw-inspect]').forEach(button => button.addEventListener('click', () => openProof(button)));
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { lastFocused?.focus(); lastFocused = null; dialogImage.removeAttribute('src'); });

  // Pointer spotlight uses a CSS custom property, no continuous ticker or scroll work.
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const move = (event: PointerEvent) => {
    if (!finePointer.matches || reduced.matches) return;
    const rect = exhibit.getBoundingClientRect();
    exhibit.style.setProperty('--aw-glow-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
    exhibit.style.setProperty('--aw-glow-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
  };
  exhibit.addEventListener('pointermove', move, { passive: true });

  const observer = new IntersectionObserver(entries => {
    if (!entries[0]?.isIntersecting) return;
    observer.disconnect();
    if (reduced.matches) return;
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .fromTo(root.querySelectorAll('.aw__eyebrow, .aw__intro-title h2, .aw__intro-aside'),
        { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: .85, stagger: .10 }, 0)
      .fromTo(theater, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1.0 }, .15)
      .fromTo(buttons, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: .67, stagger: .12, clearProps: 'opacity,visibility,transform' }, .52);
  }, { threshold: 0.09 });
  observer.observe(root);

  window.addEventListener('pagehide', () => {
    observer.disconnect();
    exhibit.removeEventListener('pointermove', move);
    switchTimeline?.kill();
  }, { once: true });
}
