/**
 * RAFI / SCROLL BUDGET
 *
 * Sicko Soul-inspired animation lifecycle for the whole portfolio:
 * while a user is actually scrolling, the scroll interaction gets priority.
 * Section-owned GSAP loops and cosmetic CSS animation pause on the first
 * gesture and resume once scrolling settles. This does NOT hijack touch,
 * install another smooth-scroll engine, or run a permanent animation ticker.
 *
 * Consumers receive exactly two events per scroll session in the usual case.
 */
const root = document.documentElement;
const CLASS_NAME = 'rafi-is-scrolling';
const EVENT_NAME = 'rafi:scroll-activity';
const SETTLE_DELAY_MS = 170;

let settleTimer: number | undefined;
let scrolling = false;

function setScrolling(next: boolean) {
  if (scrolling === next) return;
  scrolling = next;
  root.classList.toggle(CLASS_NAME, next);
  document.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { scrolling: next } }));
}

function onScrollIntent() {
  if (document.hidden) return;
  setScrolling(true);
  if (settleTimer !== undefined) window.clearTimeout(settleTimer);
  settleTimer = window.setTimeout(() => {
    settleTimer = undefined;
    setScrolling(false);
  }, SETTLE_DELAY_MS);
}

function onVisibilityChange() {
  if (!document.hidden) return;
  if (settleTimer !== undefined) window.clearTimeout(settleTimer);
  settleTimer = undefined;
  setScrolling(false);
}

// Native scrolling remains native on phones; desktop Lenis remains the only
// desktop scrolling engine. All listeners are passive and do no layout reads.
window.addEventListener('scroll', onScrollIntent, { passive: true });
window.addEventListener('wheel', onScrollIntent, { passive: true });
window.addEventListener('touchmove', onScrollIntent, { passive: true });
document.addEventListener('visibilitychange', onVisibilityChange, { passive: true });

window.addEventListener('pagehide', () => {
  if (settleTimer !== undefined) window.clearTimeout(settleTimer);
  window.removeEventListener('scroll', onScrollIntent);
  window.removeEventListener('wheel', onScrollIntent);
  window.removeEventListener('touchmove', onScrollIntent);
  document.removeEventListener('visibilitychange', onVisibilityChange);
  setScrolling(false);
}, { once: true });

export {};
