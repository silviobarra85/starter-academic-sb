/* V756 - Boot preloader mobile hard fail-safe.
   Corregge i blocchi su smartphone: il loader e' solo cosmetico e non deve mai impedire l'uso del sito.
   Non tocca Firebase, dati, router o render delle sezioni. */
(function bootPreloaderV756(){
  const version = 'V756';
  const root = document.documentElement;
  const overlay = document.getElementById('fantaBootPreloader');
  if (!overlay) return;
  const percentNode = overlay.querySelector('[data-fanta-preloader-progress]');
  const barNode = overlay.querySelector('[data-fanta-preloader-bar]');
  const textNode = overlay.querySelector('[data-fanta-preloader-status]');
  const isMobile = (() => {
    try { return window.matchMedia && window.matchMedia('(max-width: 820px)').matches; }
    catch (_) { return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || ''); }
  })();
  const maxWaitMs = isMobile ? 5200 : 7600;
  const emergencyWaitMs = isMobile ? 6900 : 9400;
  const messagePool = [
    'Preparo dati e interfaccia...',
    'Caricamento rose e bilanci...',
    'Allineo cache e dati statici...',
    'Quasi pronto...',
    'Gianluca Tozzi Caparrotti: “Calmatevi santità”',
    'Silvio: “sto solo facendo le congratulazioni a voi per come piangete”',
    'Forza Salernitana'
  ];
  let done = false;
  let progress = 0;
  let target = 16;
  let frame = 0;
  let msgIndex = 0;
  const startedAt = Date.now();
  const gates = { dom: document.readyState !== 'loading', load: document.readyState === 'complete', rendered: false, controls: false };

  function clamp(v,min,max){ return Math.max(min, Math.min(max, v)); }
  function paint(value){
    const rounded = Math.round(clamp(value,0,100));
    if (percentNode) percentNode.textContent = rounded + '%';
    if (barNode) barNode.style.setProperty('--fanta-boot-preloader-progress', rounded + '%');
    try { overlay.setAttribute('aria-valuenow', String(rounded)); } catch (_) {}
  }
  function setText(text){ if (textNode && text) textNode.textContent = text; }
  function setTarget(value, text){ target = Math.max(target, clamp(value, 0, done ? 100 : 96)); if (text) setText(text); }
  function hasUsableShell(){
    return Boolean(document.querySelector('.app-page[data-page="dashboard"], [data-page="clubs"], .app-header, .app-main'));
  }
  function forceHide(reason){
    if (done && overlay.hidden) return;
    done = true;
    if (frame) cancelAnimationFrame(frame);
    paint(100);
    setText('Pronto.');
    overlay.classList.add('is-hidden','is-force-hidden-v756');
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden','true');
    overlay.style.setProperty('display','none','important');
    overlay.style.setProperty('opacity','0','important');
    overlay.style.setProperty('visibility','hidden','important');
    overlay.style.setProperty('pointer-events','none','important');
    root.classList.remove('fanta-boot-preloader-active');
    try {
      window.ZonaOrientaleBootPreloaderV756.lastHide = { reason, elapsedMs: Date.now() - startedAt, at: new Date().toISOString() };
      window.dispatchEvent(new CustomEvent('zonaorientale:boot-preloader-hidden-v756', { detail: window.ZonaOrientaleBootPreloaderV756.lastHide }));
    } catch (_) {}
  }
  function complete(reason){
    if (done) return;
    done = true;
    if (frame) cancelAnimationFrame(frame);
    paint(100);
    setText('Pronto.');
    window.setTimeout(() => forceHide(reason || 'complete'), 120);
  }
  function checkReady(reason){
    if (done) return;
    gates.controls = hasUsableShell();
    const elapsed = Date.now() - startedAt;
    if (gates.dom && gates.rendered && gates.controls) return complete(reason || 'rendered-controls');
    if (gates.dom && gates.controls && elapsed > (isMobile ? 2600 : 4200)) return complete(reason || 'usable-shell');
    if (elapsed > maxWaitMs) return forceHide(reason || 'max-wait');
  }
  function markGate(name, text, nextTarget){
    gates[name] = true;
    if (Number.isFinite(nextTarget)) setTarget(nextTarget, text);
    window.setTimeout(() => checkReady(name), 0);
  }
  function tick(){
    if (done) return;
    const elapsed = Date.now() - startedAt;
    if (gates.dom) setTarget(42);
    if (gates.load) setTarget(60);
    if (gates.rendered) setTarget(88);
    if (gates.controls) setTarget(94);
    if (elapsed > 800 && elapsed % 1700 < 18) { setText(messagePool[msgIndex % messagePool.length]); msgIndex += 1; }
    progress += Math.max(0.45, (target - progress) * 0.12);
    if (progress > 96) progress = 96;
    paint(progress);
    frame = requestAnimationFrame(tick);
  }

  root.classList.add('fanta-boot-preloader-active');
  overlay.hidden = false;
  overlay.classList.remove('is-force-hidden-v756');
  paint(0);
  setText(messagePool[0]);

  document.addEventListener('DOMContentLoaded', () => markGate('dom', messagePool[1], 44), { once: true });
  window.addEventListener('load', () => markGate('load', messagePool[2], 62), { once: true });
  window.addEventListener('fanta:app-rendered-v560', () => markGate('rendered', messagePool[3], 88), { once: true });
  window.addEventListener('error', () => { window.setTimeout(() => forceHide('window-error'), 400); }, { once: true });
  window.addEventListener('unhandledrejection', () => { window.setTimeout(() => forceHide('unhandled-rejection'), 400); }, { once: true });
  window.setInterval(() => { if (!done && hasUsableShell()) markGate('controls', null, 94); }, 280);
  window.setTimeout(() => { if (!done) checkReady('soft-timeout'); }, maxWaitMs);
  window.setTimeout(() => { if (!done) forceHide('emergency-timeout'); }, emergencyWaitMs);
  frame = requestAnimationFrame(tick);

  window.ZonaOrientaleBootPreloaderV756 = {
    version,
    mobile: isMobile,
    maxWaitMs,
    emergencyWaitMs,
    forceHide,
    complete,
    startedAt: new Date(startedAt).toISOString(),
    lastHide: null
  };
})();
