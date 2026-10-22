/**
 * First-visit cinematic Cloudinary film.
 * HERO CONTRACT: no `portfolio:intro-complete` event while video is playing;
 * motion.ts is gated until the film finishes/fails/is skipped.
 * No extra GSAP ticker, Lenis controller or forced scroll refresh here.
 */
const film = document.querySelector<HTMLElement>('[data-intro-film]');
const html = document.documentElement;

if (film) {
  if (!html.classList.contains('intro-pending')) {
    film.hidden = true;
  } else {
    const video = film.querySelector<HTMLVideoElement>('[data-intro-video]')!;
    const skip = film.querySelector<HTMLButtonElement>('[data-intro-skip]')!;
    const sound = film.querySelector<HTMLButtonElement>('[data-intro-sound]')!;
    const progress = film.querySelector<HTMLElement>('[data-intro-progress]')!;
    const status = film.querySelector<HTMLElement>('[data-intro-status]')!;
    const shell = document.querySelector<HTMLElement>('.portfolio-shell');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

    let active = true;
    let didSignal = false;
    let loadTimer = 0;
    let playbackTimer = 0;
    let hideTimer = 0;

    // Visitors cannot focus or scroll to underlying page until film is done.
    shell?.setAttribute('inert', '');
    // First visit means once per browser (localStorage), not once per tab.
    // Mark early so a refresh during playback does not replay it repeatedly.
    try { localStorage.setItem('rafi-intro-seen-v2', '1'); } catch { /* Safari private mode etc. */ }

    const signalHero = () => {
      if (didSignal) return;
      didSignal = true;
      document.dispatchEvent(new Event('portfolio:intro-complete'));
    };

    const setProgress = () => {
      const duration = video.duration;
      const portion = Number.isFinite(duration) && duration > 0
        ? Math.min(1, Math.max(0, video.currentTime / duration))
        : 0;
      progress.style.transform = `scaleX(${portion})`;
    };

    const finish = (instant = false) => {
      if (!active) return;
      active = false;
      window.clearTimeout(loadTimer);
      window.clearTimeout(playbackTimer);
      video.pause();
      progress.style.transform = 'scaleX(1)';
      status.textContent = 'ENTERING THE PORTFOLIO';

      // The Hero timeline has NOT run yet. It starts only now, AFTER the film
      // has ended, failed, or been explicitly skipped, as the overlay dissolves.
      html.classList.add('intro-revealing');
      html.classList.remove('intro-pending');
      film.classList.add('is-leaving');
      signalHero();

      const hide = () => {
        window.clearTimeout(hideTimer);
        film.hidden = true;
        video.removeAttribute('src');
        video.load();
        shell?.removeAttribute('inert');
        html.classList.remove('intro-revealing');
        skip.removeAttribute('aria-disabled');
      };
      hideTimer = window.setTimeout(hide, instant ? 0 : 950);
    };

    skip.addEventListener('click', () => finish(false));
    sound.addEventListener('click', () => {
      video.muted = !video.muted;
      const enabled = !video.muted;
      sound.setAttribute('aria-pressed', String(enabled));
      sound.setAttribute('aria-label', enabled ? 'Mute video sound' : 'Turn on video sound');
      sound.textContent = enabled ? 'SOUND ON ↗' : 'SOUND OFF ↗';
    });
    video.addEventListener('playing', () => {
      window.clearTimeout(loadTimer);
      status.textContent = 'IDENTITY REVEAL / PLAYING';
      const ms = Number.isFinite(video.duration) && video.duration > 0
        ? Math.min(35000, video.duration * 1000 + 9000)
        : 25000;
      window.clearTimeout(playbackTimer);
      playbackTimer = window.setTimeout(() => finish(false), ms);
    });
    video.addEventListener('waiting', () => { status.textContent = 'BUFFERING THE FILM'; });
    video.addEventListener('timeupdate', setProgress, { passive: true });
    video.addEventListener('ended', () => finish(false), { once: true });
    video.addEventListener('error', () => finish(true), { once: true });
    reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) finish(true); });

    // Load the remote MP4 ONLY if intro is eligible. On repeat visits the video
    // doesn't autoplay, preload or waste network bandwidth underneath the Hero.
    if (reducedMotion.matches) {
      finish(true);
    } else {
      loadTimer = window.setTimeout(() => finish(true), 9000);
      video.muted = true;
      video.src = video.dataset.introSrc || '';
      try {
        video.load();
        const p = video.play();
        if (p && typeof p.catch === 'function') p.catch(() => finish(true));
      } catch { finish(true); }
    }

    // Defensive cleanup for back-forward-cache navigation.
    window.addEventListener('pagehide', () => { if (active) finish(true); }, { once: true });
  }
}
