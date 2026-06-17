/* V450 - FantaPetillo Admin bootstrap guard.
 * Firebase reale dedicato + primo admin creato: Admin puo essere usato per inizializzare dati.
 * Il clone resta pre-produzione: noindex e Team Area presidenti restano protetti fino ai dati reali.
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

function injectFantaPetilloAdminBootstrapBannerV450() {
  if (document.getElementById(ADMIN_BOOTSTRAP_BANNER_ID_V450)) return;
  const banner = document.createElement('div');
  banner.id = ADMIN_BOOTSTRAP_BANNER_ID_V450;
  banner.className = 'sandbox-banner-v450 sandbox-banner-v449 sandbox-banner-v448 sandbox-banner-v447';
  banner.setAttribute('role', 'status');
  banner.textContent = 'FantaPetilloMantraManager - Admin bootstrap attivo. Area Squadra resta protetta fino ai dati reali e teamUsers.';
  document.body.prepend(banner);
}

function disableTeamAreaNodeV450(node) {
  if (node.closest?.('#adminPanel')) return;
  node.classList.add('hidden', 'sandbox-disabled-v450', 'sandbox-disabled-v449', 'sandbox-disabled-v448', 'sandbox-disabled-v447');
  node.setAttribute('aria-hidden', 'true');
  node.setAttribute('tabindex', '-1');
  node.setAttribute('data-admin-bootstrap-teamarea-disabled-v450', 'true');
}

function hideFantaPetilloTeamAreaEntrypointsV450() {
  document.querySelectorAll(TEAM_AREA_SELECTORS_V450).forEach(disableTeamAreaNodeV450);
  document.body.classList.add('is-admin-bootstrap-clone-v450', 'is-firebase-bootstrap-clone-v449', 'is-sandbox-clone-v448', 'is-sandbox-clone-v447');
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

function installFantaPetilloAdminBootstrapObserverV450() {
  if (window.__FantaPetilloAdminBootstrapObserverV450) return;
  const observer = new MutationObserver(() => {
    ensureAdminEntrypointsAvailableV450();
    hideFantaPetilloTeamAreaEntrypointsV450();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.__FantaPetilloAdminBootstrapObserverV450 = observer;
}

function initFantaPetilloAdminBootstrapGuardV450() {
  ensureNoIndexMetaV450();
  injectFantaPetilloAdminBootstrapBannerV450();
  ensureAdminEntrypointsAvailableV450();
  hideFantaPetilloTeamAreaEntrypointsV450();
  installFantaPetilloAdminBootstrapObserverV450();
  window.setTimeout(() => { ensureAdminEntrypointsAvailableV450(); hideFantaPetilloTeamAreaEntrypointsV450(); }, 250);
  window.setTimeout(() => { ensureAdminEntrypointsAvailableV450(); hideFantaPetilloTeamAreaEntrypointsV450(); }, 1000);
  window.setTimeout(() => { ensureAdminEntrypointsAvailableV450(); hideFantaPetilloTeamAreaEntrypointsV450(); }, 2500);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFantaPetilloAdminBootstrapGuardV450, { once: true });
} else {
  initFantaPetilloAdminBootstrapGuardV450();
}

window.FantaPetilloAdminBootstrapGuardV450 = Object.freeze({
  version: 'V452',
  firebaseDisabled: false,
  realFirebaseConnected: true,
  projectId: 'fantapetillomantramanager',
  dedicatedFirebaseProject: true,
  productionReady: false,
  adminBootstrapEnabled: true,
  hidesAdminEntrypoints: false,
  hidesLoginEntrypoint: false,
  hidesTeamAreaEntrypoints: true,
  addsNoIndex: true,
  firestoreRulesVersion: 'V450',
  adminOnboardingVersion: 'V451'
});
