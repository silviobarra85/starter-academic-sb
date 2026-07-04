/* V560 - Boot preloader comune multi-lega.
   La chiusura non dipende piu dal solo window.load: aspetta render app, controlli DOM e quiet frame. */
(function bootPreloaderV560() {
  const version = 'V560';
  const root = document.documentElement;
  const overlay = document.getElementById('fantaBootPreloader');
  if (!overlay) return;

  const percentNode = overlay.querySelector('[data-fanta-preloader-progress]');
  const barNode = overlay.querySelector('[data-fanta-preloader-bar]');
  const textNode = overlay.querySelector('[data-fanta-preloader-status]');
  const startedAt = Date.now();
  const gates = {
    dom: document.readyState !== 'loading',
    load: document.readyState === 'complete',
    rendered: false,
    controls: false,
    quiet: false
  };
  let progress = 0;
  let target = 10;
  let done = false;
  let frame = 0;
  let lastLongTaskAt = 0;
  let readinessTimer = 0;

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
    target = Math.max(target, clamp(nextTarget, 0, done ? 100 : 96));
    if (label && textNode) textNode.textContent = label;
  }

  function markGate(name, label, nextTarget) {
    gates[name] = true;
    if (Number.isFinite(nextTarget)) setTarget(nextTarget, label);
    scheduleReadinessCheck();
  }

  function isPresentAndEnabled(selector) {
    const element = document.querySelector(selector);
    return Boolean(element && !element.disabled);
  }

  function hasRequiredControls() {
    const requiredDom = [
      '#openLoginBtn',
      '#globalSeasonSelect',
      '[data-page-link="dashboard"]',
      '[data-page-link="competitions"]',
      '[data-page-link="listone"]',
      '.app-page[data-page="dashboard"]',
      '.mobile-bottom-nav',
      '#mobileMoreBtn',
      'footer [data-league-footer-v445]'
    ];
    const domReady = requiredDom.every((selector) => Boolean(document.querySelector(selector)));
    const enabledReady = ['#openLoginBtn', '#globalSeasonSelect'].every(isPresentAndEnabled);
    const activePageReady = Boolean(document.querySelector('.app-page.is-active, .app-page.active'));
    return domReady && enabledReady && activePageReady;
  }

  function afterFrames(callback) {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(callback);
    });
  }

  function waitForIdle(callback) {
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(() => callback(), { timeout: 1600 });
      return;
    }
    window.setTimeout(callback, 260);
  }

  function observeLongTasks() {
    if (!('PerformanceObserver' in window)) return;
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration >= 50) lastLongTaskAt = performance.now();
        }
      });
      observer.observe({ entryTypes: ['longtask'] });
      window.setTimeout(() => observer.disconnect(), 30000);
    } catch (_) {}
  }

  function scheduleQuietGate() {
    afterFrames(() => {
      waitForIdle(() => {
        afterFrames(() => {
          const now = performance?.now ? performance.now() : Date.now();
          const quietEnough = !lastLongTaskAt || now - lastLongTaskAt >= 380;
          if (quietEnough) markGate('quiet', 'Interfaccia pronta...', 96);
          else window.setTimeout(scheduleQuietGate, 180);
        });
      });
    });
  }

  function scheduleReadinessCheck() {
    if (readinessTimer) window.clearTimeout(readinessTimer);
    readinessTimer = window.setTimeout(checkReadiness, 80);
  }

  function checkReadiness() {
    if (done) return;
    gates.controls = hasRequiredControls();
    const ready = gates.dom && gates.load && gates.rendered && gates.controls && gates.quiet;
    if (ready) {
      complete('Pronto.');
      return;
    }
    if (gates.rendered && !gates.quiet) scheduleQuietGate();
    const elapsed = Date.now() - startedAt;
    if (elapsed > 22000 && gates.rendered && gates.controls) {
      complete('Pronto.');
      return;
    }
    if (elapsed > 34000) complete('Pronto.');
  }

  function tick() {
    if (done) return;
    const elapsed = Date.now() - startedAt;
    if (elapsed > 1200 && !gates.dom) setTarget(28, 'Preparo struttura...');
    if (gates.dom) setTarget(42, 'Struttura pronta...');
    if (gates.load) setTarget(58, 'Asset caricati...');
    if (gates.rendered) setTarget(82, 'Render iniziale completato...');
    if (gates.controls) setTarget(91, 'Attivo i comandi...');
    if (gates.quiet) setTarget(96, 'Interfaccia pronta...');
    if (elapsed > 7000 && !gates.rendered) setTarget(68, 'Carico dati e interfaccia...');
    if (elapsed > 14000 && !gates.rendered) setTarget(78, 'Ultimo controllo dati...');
    progress += Math.max(0.16, (target - progress) * 0.075);
    if (progress > 96) progress = 96;
    paint(progress);
    frame = window.requestAnimationFrame(tick);
  }

  function complete(label) {
    if (done) return;
    done = true;
    if (frame) window.cancelAnimationFrame(frame);
    if (readinessTimer) window.clearTimeout(readinessTimer);
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

  document.addEventListener('DOMContentLoaded', () => markGate('dom', 'Struttura pronta...', 42), { once: true });
  window.addEventListener('load', () => markGate('load', 'Asset caricati...', 58), { once: true });
  window.addEventListener('fanta:app-rendered-v560', () => {
    markGate('rendered', 'Render iniziale completato...', 82);
    scheduleQuietGate();
  }, { once: true });

  window.setInterval(() => {
    if (!done && hasRequiredControls()) markGate('controls', 'Attivo i comandi...', 91);
  }, 350);
  window.setTimeout(() => { if (!done) checkReadiness(); }, 22000);
  window.setTimeout(() => { if (!done) complete('Pronto.'); }, 34000);

  observeLongTasks();
  paint(0);
  frame = window.requestAnimationFrame(tick);

  window.FantaEngineBootPreloaderV560 = Object.freeze({
    version,
    readyEvent: 'fanta:app-rendered-v560',
    waitsForWindowLoad: true,
    waitsForControls: true,
    waitsForQuietFrame: true,
    visualOnly: true,
    firebaseChanged: false,
    emailjsChanged: false,
    routerChanged: false,
    complete
  });
})();
