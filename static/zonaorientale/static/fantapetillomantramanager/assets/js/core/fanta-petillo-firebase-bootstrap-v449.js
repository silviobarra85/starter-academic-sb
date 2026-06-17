/* V449 - FantaPetillo Firebase bootstrap guard.
 * Firebase reale dedicato e' collegato, ma il clone resta pre-produzione:
 * Admin/Area Squadra rimangono nascosti fino a rules Firestore + seed admin.
 */
const BOOTSTRAP_BANNER_ID_V449 = 'fantaPetilloFirebaseBootstrapBannerV449';
const RISKY_SELECTORS_V449 = [
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

function ensureNoIndexMetaV449() {
  if (document.querySelector('meta[name="robots"][data-firebase-bootstrap-v449]')) return;
  const meta = document.createElement('meta');
  meta.name = 'robots';
  meta.content = 'noindex,nofollow';
  meta.setAttribute('data-firebase-bootstrap-v449', 'true');
  document.head.appendChild(meta);
}

function injectFantaPetilloBootstrapBannerV449() {
  if (document.getElementById(BOOTSTRAP_BANNER_ID_V449)) return;
  const banner = document.createElement('div');
  banner.id = BOOTSTRAP_BANNER_ID_V449;
  banner.className = 'sandbox-banner-v449 sandbox-banner-v448 sandbox-banner-v447';
  banner.setAttribute('role', 'status');
  banner.textContent = 'FantaPetilloMantraManager - Firebase dedicato collegato in bootstrap protetto. Admin e Area Squadra disabilitati fino a rules e primo admin.';
  document.body.prepend(banner);
}

function disableRiskyNodeV449(node) {
  node.classList.add('hidden', 'sandbox-disabled-v449', 'sandbox-disabled-v448', 'sandbox-disabled-v447');
  node.setAttribute('aria-hidden', 'true');
  node.setAttribute('tabindex', '-1');
  node.setAttribute('data-firebase-bootstrap-disabled-v449', 'true');
}

function hideFantaPetilloRiskyEntrypointsV449() {
  document.querySelectorAll(RISKY_SELECTORS_V449).forEach(disableRiskyNodeV449);
  document.body.classList.add('is-firebase-bootstrap-clone-v449', 'is-sandbox-clone-v448', 'is-sandbox-clone-v447');
}

function installFantaPetilloBootstrapObserverV449() {
  if (window.__FantaPetilloFirebaseBootstrapObserverV449) return;
  const observer = new MutationObserver(() => hideFantaPetilloRiskyEntrypointsV449());
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.__FantaPetilloFirebaseBootstrapObserverV449 = observer;
}

function initFantaPetilloFirebaseBootstrapGuardV449() {
  ensureNoIndexMetaV449();
  injectFantaPetilloBootstrapBannerV449();
  hideFantaPetilloRiskyEntrypointsV449();
  installFantaPetilloBootstrapObserverV449();
  window.setTimeout(hideFantaPetilloRiskyEntrypointsV449, 250);
  window.setTimeout(hideFantaPetilloRiskyEntrypointsV449, 1000);
  window.setTimeout(hideFantaPetilloRiskyEntrypointsV449, 2500);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFantaPetilloFirebaseBootstrapGuardV449, { once: true });
} else {
  initFantaPetilloFirebaseBootstrapGuardV449();
}

window.FantaPetilloFirebaseBootstrapGuardV449 = Object.freeze({
  version: 'V449',
  firebaseDisabled: false,
  realFirebaseConnected: true,
  projectId: 'fantapetillomantramanager',
  dedicatedFirebaseProject: true,
  productionReady: false,
  hidesRiskyEntrypoints: true,
  addsNoIndex: true,
  requiresFirestoreRulesBeforeLiveUse: true
});
