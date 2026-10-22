/** RAFI — finishing behavior: top on reload; no intro video or scroll controller. */
const doc = document.documentElement;
const refreshed = doc.dataset.rafiReloadTop === 'true';
if (refreshed) {
  const reset = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };
  reset();
  window.addEventListener('pageshow', reset, { once: true });
}

