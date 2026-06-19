/* V476 - FantaMantraManager Admin bootstrap unlock.
 * Admin resta disponibile, ma il banner tecnico viene rimosso e gli entrypoint Area Squadra non vengono piu nascosti dal bootstrap.
 * Le operazioni interne dell'Area Squadra continuano a usare le regole esistenti di login/account presidente.
 */
const ADMIN_BOOTSTRAP_BANNER_ID_V450 = 'fantaPetilloAdminBootstrapBannerV450';
const TEAM_AREA_SELECTORS_V450 = [
  '[data-page-link="teamarea"]',
  '[data-v42-page-link="teamarea"]',
  '[href="#teamarea"]'
].join(',');

function ensureNoIndexMetaV450() {
  if (document.querySelector('meta[name="robots"][data-admin-bootstrap-v450]')) return;
  const meta = document.createElement('meta');
  meta.name = 'robots';
  meta.content = 'noindex,nofollow';
  meta.setAttribute('data-admin-bootstrap-v450', 'true');
  document.head.appendChild(meta);
}

function removeFantaMantraManagerAdminBootstrapBannerV476() {
  document.getElementById(ADMIN_BOOTSTRAP_BANNER_ID_V450)?.remove();
  document.querySelectorAll('.sandbox-banner-v450').forEach((node) => node.remove());
}

function unlockTeamAreaNodeV476(node) {
  if (!node || node.closest?.('#adminPanel')) return;
  node.classList.remove('hidden', 'sandbox-disabled-v450', 'sandbox-disabled-v449', 'sandbox-disabled-v448', 'sandbox-disabled-v447');
  node.removeAttribute('aria-hidden');
  if (node.getAttribute('tabindex') === '-1') node.removeAttribute('tabindex');
  node.removeAttribute('data-admin-bootstrap-teamarea-disabled-v450');
  node.removeAttribute('data-firebase-bootstrap-disabled-v449');
  node.removeAttribute('data-sandbox-disabled-v448');
  node.removeAttribute('data-sandbox-disabled-v447');
}

function unlockFantaMantraManagerTeamAreaEntrypointsV476() {
  document.querySelectorAll(TEAM_AREA_SELECTORS_V450).forEach(unlockTeamAreaNodeV476);
  document.body.classList.remove('is-admin-bootstrap-clone-v450');
}

function ensureAdminEntrypointsAvailableV450() {
  const loginButton = document.getElementById('openLoginBtn');
  if (loginButton) {
    loginButton.classList.remove('sandbox-disabled-v449', 'sandbox-disabled-v448', 'sandbox-disabled-v447');
    loginButton.removeAttribute('data-firebase-bootstrap-disabled-v449');
    loginButton.removeAttribute('aria-hidden');
    loginButton.removeAttribute('tabindex');
  }
  document.querySelectorAll('[data-page-link="admin"], [data-v42-page-link="admin"], [href="#admin"]').forEach((node) => {
    node.classList.remove('sandbox-disabled-v449', 'sandbox-disabled-v448', 'sandbox-disabled-v447');
    node.removeAttribute('data-firebase-bootstrap-disabled-v449');
  });
}

function installFantaMantraManagerAdminBootstrapObserverV476() {
  if (window.__FantaPetilloAdminBootstrapObserverV450) return;
  const observer = new MutationObserver(() => {
    removeFantaMantraManagerAdminBootstrapBannerV476();
    ensureAdminEntrypointsAvailableV450();
    unlockFantaMantraManagerTeamAreaEntrypointsV476();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.__FantaPetilloAdminBootstrapObserverV450 = observer;
}

function initFantaPetilloAdminBootstrapGuardV450() {
  ensureNoIndexMetaV450();
  removeFantaMantraManagerAdminBootstrapBannerV476();
  ensureAdminEntrypointsAvailableV450();
  unlockFantaMantraManagerTeamAreaEntrypointsV476();
  installFantaMantraManagerAdminBootstrapObserverV476();
  window.setTimeout(() => { removeFantaMantraManagerAdminBootstrapBannerV476(); ensureAdminEntrypointsAvailableV450(); unlockFantaMantraManagerTeamAreaEntrypointsV476(); }, 250);
  window.setTimeout(() => { removeFantaMantraManagerAdminBootstrapBannerV476(); ensureAdminEntrypointsAvailableV450(); unlockFantaMantraManagerTeamAreaEntrypointsV476(); }, 1000);
  window.setTimeout(() => { removeFantaMantraManagerAdminBootstrapBannerV476(); ensureAdminEntrypointsAvailableV450(); unlockFantaMantraManagerTeamAreaEntrypointsV476(); }, 2500);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFantaPetilloAdminBootstrapGuardV450, { once: true });
} else {
  initFantaPetilloAdminBootstrapGuardV450();
}

window.FantaPetilloAdminBootstrapGuardV450 = Object.freeze({
  version: 'V476',
  firebaseDisabled: false,
  realFirebaseConnected: true,
  projectId: 'fantapetillomantramanager',
  dedicatedFirebaseProject: true,
  productionReady: false,
  adminBootstrapEnabled: true,
  hidesAdminEntrypoints: false,
  hidesLoginEntrypoint: false,
  hidesTeamAreaEntrypoints: false,
  addsNoIndex: true,
  firestoreRulesVersion: 'V450',
  adminOnboardingVersion: 'V451',
  bannerRemoved: true,
  teamAreaEntrypointsUnlockedIn: 'V476'
});

window.FantaMantraManagerTeamAreaUnlockV476 = Object.freeze({
  version: 'V476',
  scope: 'fantamantramanager-only',
  removesAdminBootstrapBanner: true,
  unlocksTeamAreaEntrypoints: true,
  touchesZonaOrientale: false,
  preservesExistingLoginAndPresidentFlows: true
});
