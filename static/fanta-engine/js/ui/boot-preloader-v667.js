/* V667 - Boot preloader piu rapido con sottomessaggi configurabili. */
(function bootPreloaderV667() {
  const version = 'V667';
  const root = document.documentElement;
  const overlay = document.getElementById('fantaBootPreloader');
  if (!overlay) return;
  const percentNode = overlay.querySelector('[data-fanta-preloader-progress]');
  const barNode = overlay.querySelector('[data-fanta-preloader-bar]');
  const textNode = overlay.querySelector('[data-fanta-preloader-status]');
  const messages = [
    'Michele è nu scem',
    'Giosuè ha vinto un altra volta',
    'Inviando bonifico a Scapello',
    'Vannacci è la vergogna del genere umano',
    'Remigrando Michele in Moldavia',
    'Il femminicidio è discriminazione',
    'Forza Salernitana',
    'Zio Dino, Tano e Tozzi sono la Cupola'
  ];
  const startedAt = Date.now();
  const gates = { dom: document.readyState !== 'loading', load: document.readyState === 'complete', rendered: false, controls: false };
  let progress = 0, target = 12, done = false, frame = 0, readinessTimer = 0, messageIndex = 0;
  root.classList.add('fanta-boot-preloader-active');
  overlay.hidden = false;
  function clamp(v,min,max){ return Math.max(min, Math.min(max, v)); }
  function paint(value){
    const rounded = Math.round(clamp(value,0,100));
    if (percentNode) percentNode.textContent = `${rounded}%`;
    if (barNode) barNode.style.setProperty('--fanta-boot-preloader-progress', `${rounded}%`);
    overlay.setAttribute('aria-valuenow', String(rounded));
  }
  function setText(label){ if (label && textNode) textNode.textContent = label; }
  function rotateMessage(){
    if (done || !textNode) return;
    const next = messages[messageIndex % messages.length];
    messageIndex += 1;
    setText(next);
  }
  function setTarget(nextTarget, label){ target = Math.max(target, clamp(nextTarget, 0, done ? 100 : 96)); if (label) setText(label); }
  function markGate(name, label, nextTarget){ gates[name] = true; if (Number.isFinite(nextTarget)) setTarget(nextTarget, label); scheduleReadinessCheck(); }
  function hasRequiredControls(){
    const softRequired = ['[data-page-link="dashboard"]', '.app-page[data-page="dashboard"]', 'footer [data-league-footer-v445]'];
    return softRequired.every((selector) => Boolean(document.querySelector(selector)));
  }
  function scheduleReadinessCheck(){ if (readinessTimer) clearTimeout(readinessTimer); readinessTimer=setTimeout(checkReadiness, 60); }
  function checkReadiness(){
    if (done) return;
    gates.controls = hasRequiredControls();
    const elapsed = Date.now() - startedAt;
    if (gates.dom && gates.rendered && gates.controls) return complete('Pronto.');
    if (elapsed > 5200 && gates.dom && gates.controls) return complete('Pronto.');
    if (elapsed > 7600) return complete('Pronto.');
  }
  function tick(){
    if (done) return;
    const elapsed = Date.now() - startedAt;
    if (gates.dom) setTarget(44, null);
    if (gates.load) setTarget(62, null);
    if (gates.rendered) setTarget(88, null);
    if (gates.controls) setTarget(94, null);
    if (elapsed > 900 && elapsed < 1200) rotateMessage();
    if (elapsed > 2100 && elapsed < 2400) rotateMessage();
    if (elapsed > 3400 && elapsed < 3700) rotateMessage();
    progress += Math.max(.35, (target-progress)*.115);
    if (progress > 96) progress=96;
    paint(progress);
    frame = requestAnimationFrame(tick);
  }
  function complete(label){
    if (done) return;
    done = true;
    if (frame) cancelAnimationFrame(frame);
    if (readinessTimer) clearTimeout(readinessTimer);
    setText(label || 'Pronto.');
    progress=100; target=100; paint(100);
    setTimeout(() => {
      overlay.classList.add('is-hidden');
      root.classList.remove('fanta-boot-preloader-active');
      setTimeout(() => { overlay.hidden = true; }, 180);
    }, 160);
  }
  document.addEventListener('DOMContentLoaded', () => markGate('dom', messages[0], 44), { once: true });
  window.addEventListener('load', () => markGate('load', messages[1], 62), { once: true });
  window.addEventListener('fanta:app-rendered-v560', () => markGate('rendered', messages[2], 88), { once: true });
  setInterval(() => { if (!done && hasRequiredControls()) markGate('controls', messages[messageIndex % messages.length], 94); }, 300);
  setTimeout(() => { if (!done) checkReadiness(); }, 5200);
  setTimeout(() => { if (!done) complete('Pronto.'); }, 7600);
  paint(0); rotateMessage(); frame = requestAnimationFrame(tick);
  window.FantaEngineBootPreloaderV667 = Object.freeze({ version, readyEvent: 'fanta:app-rendered-v560', faster: true, maxWaitMs: 7600, visualOnly: true, complete });
})();
