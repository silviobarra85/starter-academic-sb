/* V451 - FantaMantra Admin onboarding.
 * Read-only setup guide injected in the clone Admin page after admin login.
 * It does not write to Firebase and does not unlock Team Area.
 */
const ONBOARDING_PANEL_ID_V451 = 'fantaPetilloAdminOnboardingV451';
const SETUP_STEPS_V451 = [
  { id: 'rules', label: 'Rules Firestore V450 pubblicate', hint: 'Usa tools/firestore-rules-v450.rules nella console Firebase.' },
  { id: 'season', label: 'Stagione corrente', hint: 'Controlla Stagioni: 2025-2026 deve essere corrente.' },
  { id: 'presidents', label: 'Presidenti', hint: 'Inserisci i presidenti della nuova lega.' },
  { id: 'teams', label: 'Squadre madri', hint: 'Inserisci le squadre e, se disponibili, i nomi file dei loghi.' },
  { id: 'seasonTeams', label: 'Squadre per stagione', hint: 'Associa ogni squadra alla stagione corrente.' },
  { id: 'stadiums', label: 'Stadi', hint: 'Inserisci almeno livello o nome stadio per ogni squadra stagionale.' },
  { id: 'snapshots', label: 'Snapshot pubblici', hint: 'Admin -> Snapshot pubblici -> Aggiorna tutto, poi scarica overlay.' }
];

function getFantaMantraAdminCountsV451() {
  const text = document.getElementById('adminPanel')?.innerText || '';
  const extract = (label) => {
    const pattern = new RegExp(`${label}[^0-9]*(\\d+)`, 'i');
    const match = text.match(pattern);
    return match ? Number(match[1]) : null;
  };
  return {
    seasons: extract('Stagioni esistenti'),
    presidents: extract('Presidenti esistenti'),
    teams: extract('Squadre esistenti'),
    seasonTeams: extract('Squadre associate'),
    stadiums: extract('Stadi della stagione')
  };
}

function isFantaMantraAdminReadyForOnboardingV451(adminPanel) {
  if (!adminPanel) return false;
  const text = adminPanel.innerText || '';
  if (text.includes('Accedi come amministratore')) return false;
  return text.includes('Gestione Firebase') || Boolean(adminPanel.querySelector('#adminSeasonsPanel'));
}

function getStepStateV451(step, counts) {
  if (step.id === 'rules') return 'manual';
  if (step.id === 'season') return (counts.seasons || 0) > 0 ? 'done' : 'todo';
  if (step.id === 'presidents') return (counts.presidents || 0) > 0 ? 'done' : 'todo';
  if (step.id === 'teams') return (counts.teams || 0) > 0 ? 'done' : 'todo';
  if (step.id === 'seasonTeams') return (counts.seasonTeams || 0) > 0 ? 'done' : 'todo';
  if (step.id === 'stadiums') return (counts.stadiums || 0) > 0 ? 'done' : 'todo';
  return 'manual';
}

function getStepBadgeLabelV451(state) {
  if (state === 'done') return 'OK';
  if (state === 'manual') return 'Manuale';
  return 'Da fare';
}

function scrollToAdminPanelV451(panelId) {
  const target = document.getElementById(panelId);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  target.classList.add('onboarding-highlight-v451');
  window.setTimeout(() => target.classList.remove('onboarding-highlight-v451'), 1800);
}

function bindFantaMantraOnboardingActionsV451(panel) {
  panel.querySelectorAll('[data-onboarding-scroll-v451]').forEach((button) => {
    if (button.dataset.boundOnboardingV451 === 'true') return;
    button.dataset.boundOnboardingV451 = 'true';
    button.addEventListener('click', () => scrollToAdminPanelV451(button.dataset.onboardingScrollV451));
  });
}

function renderFantaMantraAdminOnboardingV451() {
  const adminPanel = document.getElementById('adminPanel');
  if (!isFantaMantraAdminReadyForOnboardingV451(adminPanel)) return;
  let panel = document.getElementById(ONBOARDING_PANEL_ID_V451);
  const counts = getFantaMantraAdminCountsV451();
  const rows = SETUP_STEPS_V451.map((step) => {
    const state = getStepStateV451(step, counts);
    const css = state === 'done' ? 'status-ok' : state === 'manual' ? 'status-warning' : 'status-muted';
    return `<li class="onboarding-step-v451 onboarding-step-${state}-v451"><span class="status ${css}">${getStepBadgeLabelV451(state)}</span><strong>${step.label}</strong><small>${step.hint}</small></li>`;
  }).join('');
  const html = `
    <div class="panel-header">
      <div>
        <p class="eyebrow">Setup nuova lega</p>
        <h2>Checklist FantaMantraManager</h2>
        <p>Guida veloce per inizializzare i dati reali. Il pannello e' solo informativo: non scrive su Firebase.</p>
      </div>
    </div>
    <div class="onboarding-grid-v451">
      <div>
        <h3>Ordine consigliato</h3>
        <ol class="onboarding-steps-v451">${rows}</ol>
      </div>
      <div>
        <h3>Vai ai pannelli</h3>
        <div class="onboarding-actions-v451">
          <button class="button button-secondary button-small" type="button" data-onboarding-scroll-v451="adminSeasonsPanel">Stagioni</button>
          <button class="button button-secondary button-small" type="button" data-onboarding-scroll-v451="adminPresidentsPanel">Presidenti</button>
          <button class="button button-secondary button-small" type="button" data-onboarding-scroll-v451="adminTeamsPanel">Squadre</button>
          <button class="button button-secondary button-small" type="button" data-onboarding-scroll-v451="adminSeasonTeamsPanel">Squadre stagione</button>
          <button class="button button-secondary button-small" type="button" data-onboarding-scroll-v451="adminStadiumsPanel">Stadi</button>
          <button class="button button-primary button-small" type="button" data-onboarding-scroll-v451="adminPublicSnapshotsPanel">Snapshot pubblici</button>
        </div>
        <p class="muted small">Dopo lo snapshot: scarica overlay snapshot, applicalo alla repo, fai test e commit. Area Squadra resta nascosta finche non avremo utenti presidente e dati veri.</p>
      </div>
    </div>`;
  if (!panel) {
    panel = document.createElement('article');
    panel.id = ONBOARDING_PANEL_ID_V451;
    panel.className = 'panel admin-collapsible-panel onboarding-panel-v451';
    const heading = adminPanel.querySelector('.page-heading');
    if (heading?.nextSibling) adminPanel.insertBefore(panel, heading.nextSibling);
    else adminPanel.prepend(panel);
  }
  if (panel.dataset.renderedHtmlV451 !== html) {
    panel.innerHTML = html;
    panel.dataset.renderedHtmlV451 = html;
  }
  bindFantaMantraOnboardingActionsV451(panel);
  document.body.classList.add('has-fantapetillo-onboarding-v451');
}

function initFantaMantraAdminOnboardingV451() {
  renderFantaMantraAdminOnboardingV451();
  if (window.__FantaMantraAdminOnboardingObserverV451) return;
  const observer = new MutationObserver(() => renderFantaMantraAdminOnboardingV451());
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.__FantaMantraAdminOnboardingObserverV451 = observer;
  window.setTimeout(renderFantaMantraAdminOnboardingV451, 300);
  window.setTimeout(renderFantaMantraAdminOnboardingV451, 1200);
  window.setTimeout(renderFantaMantraAdminOnboardingV451, 2500);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFantaMantraAdminOnboardingV451, { once: true });
} else {
  initFantaMantraAdminOnboardingV451();
}

window.FantaMantraAdminOnboardingGuardV451 = Object.freeze({
  version: 'V452',
  cloneSlug: 'fantapetillomantramanager',
  writesToFirebase: false,
  unlocksTeamArea: false,
  requiresAdminPanel: true,
  checklistOnly: true
});
