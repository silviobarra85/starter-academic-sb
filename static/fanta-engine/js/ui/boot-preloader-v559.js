/* V559 - Boot preloader comune multi-lega.
   Si limita al feedback visivo di bootstrap: non carica dati e non modifica router/Firebase/EmailJS. */
(function bootPreloaderV559() {
  const version = 'V559';
  const root = document.documentElement;
  const overlay = document.getElementById('fantaBootPreloader');
  if (!overlay) return;

  const percentNode = overlay.querySelector('[data-fanta-preloader-progress]');
  const barNode = overlay.querySelector('[data-fanta-preloader-bar]');
  const textNode = overlay.querySelector('[data-fanta-preloader-status]');
  const startedAt = Date.now();
  let progress = 0;
  let target = 12;
  let done = false;
  let frame = 0;

  root.classList.add('fanta-boot-preloader-active');
  overlay.hidden = false;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function paint(value) {
    const rounded = Math.round(clamp(value, 0, 100));
    if (percentNode) percentNode.textContent = `${rounded}%`;
    if (barNode) barNode.style.setProperty('--fanta-boot-preloader-progress', `${rounded}%`);
    overlay.setAttribute('aria-valuenow', String(rounded));
  }

  function setTarget(nextTarget, label) {
    target = Math.max(target, clamp(nextTarget, 0, done ? 100 : 94));
    if (label && textNode) textNode.textContent = label;
  }

  function tick() {
    if (done) return;
    const elapsed = Date.now() - startedAt;
    if (elapsed > 1600) setTarget(62, 'Carico dati e interfaccia...');
    if (elapsed > 4200) setTarget(82, 'Preparo la dashboard...');
    if (elapsed > 7600) setTarget(91, 'Quasi pronto...');
    progress += Math.max(0.18, (target - progress) * 0.085);
    if (progress > 94) progress = 94;
    paint(progress);
    frame = window.requestAnimationFrame(tick);
  }

  function complete(label) {
    if (done) return;
    done = true;
    if (frame) window.cancelAnimationFrame(frame);
    if (label && textNode) textNode.textContent = label;
    progress = 100;
    target = 100;
    paint(100);
    window.setTimeout(() => {
      overlay.classList.add('is-hidden');
      root.classList.remove('fanta-boot-preloader-active');
      window.setTimeout(() => {
        overlay.hidden = true;
      }, 280);
    }, 260);
  }

  document.addEventListener('DOMContentLoaded', () => setTarget(46, 'Struttura pronta...'), { once: true });
  window.addEventListener('load', () => {
    setTarget(74, 'Asset caricati...');
    window.setTimeout(() => {
      if (!done) complete('Pronto.');
    }, 5200);
  }, { once: true });

  window.addEventListener('fanta:app-ready-v559', () => complete('Pronto.'), { once: true });
  window.setTimeout(() => {
    if (!done) complete('Pronto.');
  }, 14500);

  paint(0);
  frame = window.requestAnimationFrame(tick);

  window.FantaEngineBootPreloaderV559 = Object.freeze({
    version,
    visualOnly: true,
    firebaseChanged: false,
    emailjsChanged: false,
    routerChanged: false,
    complete
  });
})();
