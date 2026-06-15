/* V447 - FantaPetillo sandbox guard.
 * UI-only guard: makes the clone visibly non-production and hides risky entry points.
 * Firebase writes are blocked separately in assets/firebase.js.
 */
function injectFantaPetilloSandboxBannerV447() {
  if (document.getElementById('fantaPetilloSandboxBannerV447')) return;
  const banner = document.createElement('div');
  banner.id = 'fantaPetilloSandboxBannerV447';
  banner.className = 'sandbox-banner-v447';
  banner.setAttribute('role', 'status');
  banner.textContent = 'Sandbox FantaPetilloMantraManager - Firebase disabilitato, dati placeholder.';
  document.body.prepend(banner);
}

function hideFantaPetilloRiskyEntrypointsV447() {
  document.querySelectorAll('[data-page-link="admin"], [data-v42-page-link="admin"], [data-page-link="teamarea"], [data-v42-page-link="teamarea"], #openLoginBtn, #logoutBtn, #refreshBtn')
    .forEach((node) => {
      node.classList.add('hidden', 'sandbox-disabled-v447');
      node.setAttribute('aria-hidden', 'true');
      node.setAttribute('tabindex', '-1');
    });
  document.body.classList.add('is-sandbox-clone-v447');
}

function initFantaPetilloSandboxGuardV447() {
  injectFantaPetilloSandboxBannerV447();
  hideFantaPetilloRiskyEntrypointsV447();
  window.setTimeout(hideFantaPetilloRiskyEntrypointsV447, 250);
  window.setTimeout(hideFantaPetilloRiskyEntrypointsV447, 1000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFantaPetilloSandboxGuardV447, { once: true });
} else {
  initFantaPetilloSandboxGuardV447();
}

window.FantaPetilloSandboxGuardV447 = Object.freeze({
  version: 'V447',
  firebaseDisabled: true,
  productionReady: false
});
