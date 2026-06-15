/* V448 - FantaPetillo sandbox QA guard.
 * Keeps the clone visibly non-production and blocks risky entry points while
 * Firebase remains intentionally disabled in assets/firebase.js.
 */
const SANDBOX_BANNER_ID_V448 = 'fantaPetilloSandboxBannerV448';
const RISKY_SELECTORS_V448 = [
  '[data-page-link="admin"]',
  '[data-v42-page-link="admin"]',
  '[data-page-link="teamarea"]',
  '[data-v42-page-link="teamarea"]',
  '[href="#admin"]',
  '[href="#teamarea"]',
  '#openLoginBtn',
  '#logoutBtn',
  '#refreshBtn'
].join(',');

function ensureNoIndexMetaV448() {
  if (document.querySelector('meta[name="robots"][data-sandbox-v448]')) return;
  const meta = document.createElement('meta');
  meta.name = 'robots';
  meta.content = 'noindex,nofollow';
  meta.setAttribute('data-sandbox-v448', 'true');
  document.head.appendChild(meta);
}

function injectFantaPetilloSandboxBannerV448() {
  if (document.getElementById(SANDBOX_BANNER_ID_V448)) return;
  const banner = document.createElement('div');
  banner.id = SANDBOX_BANNER_ID_V448;
  banner.className = 'sandbox-banner-v448 sandbox-banner-v447';
  banner.setAttribute('role', 'status');
  banner.textContent = 'Sandbox FantaPetilloMantraManager - Firebase reale non collegato, dati placeholder.';
  document.body.prepend(banner);
}

function disableRiskyNodeV448(node) {
  node.classList.add('hidden', 'sandbox-disabled-v448', 'sandbox-disabled-v447');
  node.setAttribute('aria-hidden', 'true');
  node.setAttribute('tabindex', '-1');
  node.setAttribute('data-sandbox-disabled-v448', 'true');
}

function hideFantaPetilloRiskyEntrypointsV448() {
  document.querySelectorAll(RISKY_SELECTORS_V448).forEach(disableRiskyNodeV448);
  document.body.classList.add('is-sandbox-clone-v448', 'is-sandbox-clone-v447');
}

function installFantaPetilloSandboxObserverV448() {
  if (window.__FantaPetilloSandboxObserverV448) return;
  const observer = new MutationObserver(() => hideFantaPetilloRiskyEntrypointsV448());
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.__FantaPetilloSandboxObserverV448 = observer;
}

function initFantaPetilloSandboxGuardV448() {
  ensureNoIndexMetaV448();
  injectFantaPetilloSandboxBannerV448();
  hideFantaPetilloRiskyEntrypointsV448();
  installFantaPetilloSandboxObserverV448();
  window.setTimeout(hideFantaPetilloRiskyEntrypointsV448, 250);
  window.setTimeout(hideFantaPetilloRiskyEntrypointsV448, 1000);
  window.setTimeout(hideFantaPetilloRiskyEntrypointsV448, 2500);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFantaPetilloSandboxGuardV448, { once: true });
} else {
  initFantaPetilloSandboxGuardV448();
}

window.FantaPetilloSandboxGuardV448 = Object.freeze({
  version: 'V448',
  firebaseDisabled: true,
  realFirebaseConnected: false,
  productionReady: false,
  hidesRiskyEntrypoints: true,
  addsNoIndex: true
});
