import { getLeagueDataPathV446, getLeagueWhatsappBilanciUrlV443, joinLeagueDataPathV446, loadLeagueConfigV443 } from '../core/league-config-v443.js?v=457';

const BILANCI_SNAPSHOT_V435 = Object.freeze({
  manifestUrl: './assets/snapshots/seasons/manifest.json',
  configUrl: './assets/public/config.json',
  baseUrl: './assets/snapshots/seasons/'
});

function getBilanciSnapshotPathsV446() {
  return {
    manifestUrl: getLeagueDataPathV446('seasonSnapshotsManifest', BILANCI_SNAPSHOT_V435.manifestUrl),
    configUrl: getLeagueDataPathV446('publicConfig', BILANCI_SNAPSHOT_V435.configUrl),
    baseUrl: getLeagueDataPathV446('seasonSnapshotsBase', BILANCI_SNAPSHOT_V435.baseUrl)
  };
}

const MONTHS_V435 = [
  { id: 7, short: 'Lug', label: 'Luglio' },
  { id: 8, short: 'Ago', label: 'Agosto' },
  { id: 9, short: 'Set', label: 'Settembre' },
  { id: 10, short: 'Ott', label: 'Ottobre' },
  { id: 11, short: 'Nov', label: 'Novembre' },
  { id: 12, short: 'Dic', label: 'Dicembre' },
  { id: 1, short: 'Gen', label: 'Gennaio' },
  { id: 2, short: 'Feb', label: 'Febbraio' },
  { id: 3, short: 'Mar', label: 'Marzo' },
  { id: 4, short: 'Apr', label: 'Aprile' },
  { id: 5, short: 'Mag', label: 'Maggio' },
  { id: 6, short: 'Giu', label: 'Giugno' }
];

const CATEGORY_ROWS_V435 = [
  { id: 'INITIAL_BUDGET', label: 'Disponibilita' },
  { id: 'ACQUISTO', label: 'Acquisti' },
  { id: 'SVINCOLO', label: 'Svincoli' },
  { id: 'VENDITA', label: 'Vendite' },
  { id: 'SCAMBIO', label: 'Scambi' },
  { id: 'BONUS', label: 'Premi e bonus' },
  { id: 'ALTRO', label: 'Altri movimenti' }
];

const stateV435 = {
  manifest: null,
  config: null,
  seasons: new Map(),
  selectedSeasonId: '',
  selectedTeamId: ''
};

function escapeHtmlV435(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function toNumberV435(value) {
  const num = Number(value || 0);
  return Number.isFinite(num) ? num : 0;
}

function formatFmV435(value) {
  const num = Math.round(toNumberV435(value) * 100) / 100;
  if (!num) return '-';
  const sign = num > 0 ? '+' : '';
  return `${sign}${num.toLocaleString('it-IT', { maximumFractionDigits: 2 })}`;
}

function numberClassV435(value) {
  const num = toNumberV435(value);
  if (num > 0) return 'bilanci-positive-v435';
  if (num < 0) return 'bilanci-negative-v435';
  return '';
}

function parseSeasonYearsV435(seasonId) {
  const match = String(seasonId || '').match(/^(\d{4})-(\d{4})$/);
  if (!match) return null;
  return { start: Number(match[1]), end: Number(match[2]) };
}

function buildSeasonMonthsV435(seasonId) {
  const years = parseSeasonYearsV435(seasonId);
  return MONTHS_V435.map((month) => {
    const year = years ? (month.id >= 7 ? years.start : years.end) : '';
    const key = year ? `${year}-${String(month.id).padStart(2, '0')}` : `month-${month.id}`;
    const suffix = year ? ` ${String(year).slice(-2)}` : '';
    return { ...month, year, key, heading: `${month.short}${suffix}` };
  });
}

function monthKeyFromDateV435(dateValue, seasonId) {
  const text = String(dateValue || '').trim();
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return 'extra';
  const key = `${match[1]}-${match[2]}`;
  const allowed = new Set(buildSeasonMonthsV435(seasonId).map((m) => m.key));
  return allowed.has(key) ? key : 'extra';
}

function movementTypeV435(movement) {
  const type = String(movement?.type || '').trim().toUpperCase();
  return CATEGORY_ROWS_V435.some((row) => row.id === type) ? type : 'ALTRO';
}

function compareMovementsV435(a, b) {
  const dateCompare = String(a?.date || '').localeCompare(String(b?.date || ''));
  if (dateCompare) return dateCompare;
  return String(a?.description || '').localeCompare(String(b?.description || ''), 'it');
}

function getTeamNameV435(team) {
  return String(team?.name || team?.label || team?.teamName || team?.id || 'Squadra').trim();
}

function resolveTeamNameV435(snapshot, seasonTeamId) {
  const team = (snapshot?.seasonTeams || []).find((item) => item.id === seasonTeamId);
  return getTeamNameV435(team);
}

async function fetchJsonV435(url) {
  const response = await fetch(`${url}${url.includes('?') ? '&' : '?'}_=${Date.now()}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`HTTP ${response.status} su ${url}`);
  return response.json();
}

async function ensureBootstrapV435() {
  if (stateV435.manifest && stateV435.config) return;
  await loadLeagueConfigV443().catch(() => null);
  const pathsV446 = getBilanciSnapshotPathsV446();
  const [manifest, config] = await Promise.all([
    fetchJsonV435(pathsV446.manifestUrl),
    fetchJsonV435(pathsV446.configUrl).catch(() => ({}))
  ]);
  stateV435.manifest = manifest || { snapshots: [] };
  stateV435.config = config || {};
}

async function loadSeasonSnapshotV435(seasonId) {
  if (stateV435.seasons.has(seasonId)) return stateV435.seasons.get(seasonId);
  const entry = (stateV435.manifest?.snapshots || []).find((item) => item.seasonId === seasonId);
  if (!entry?.file) throw new Error(`Snapshot stagione non trovato per ${seasonId}`);
  const snapshot = await fetchJsonV435(joinLeagueDataPathV446('seasonSnapshotsBase', entry.file, BILANCI_SNAPSHOT_V435.baseUrl));
  stateV435.seasons.set(seasonId, snapshot);
  return snapshot;
}

function getSeasonLabelV435(seasonId) {
  const season = (stateV435.config?.seasons || []).find((item) => item.id === seasonId);
  return season?.name || seasonId;
}

function buildBilanciWhatsappUrlV440() {
  return getLeagueWhatsappBilanciUrlV443() || 'https://silviobarra.com/zonaorientale/bilanci.html';
}

async function buildBilanciWhatsappUrlV443() {
  await loadLeagueConfigV443().catch(() => null);
  return buildBilanciWhatsappUrlV440();
}

function setBilanciCopyStatusV440(message, kind = '') {
  const status = document.getElementById('bilanciWhatsappCopyStatusV440');
  if (!status) return;
  status.textContent = message || '';
  status.classList.remove('is-ok', 'is-error');
  if (kind) status.classList.add(kind);
  if (message) {
    window.clearTimeout(setBilanciCopyStatusV440.timeoutId);
    setBilanciCopyStatusV440.timeoutId = window.setTimeout(() => {
      status.textContent = '';
      status.classList.remove('is-ok', 'is-error');
    }, 3500);
  }
}

async function copyTextToClipboardV440(text) {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.top = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  const ok = document.execCommand('copy');
  textarea.remove();
  return ok;
}

async function copyBilanciWhatsappLinkV440() {
  const button = document.getElementById('bilanciWhatsappCopyV440');
  const url = await buildBilanciWhatsappUrlV443();
  try {
    if (button) button.disabled = true;
    const copied = await copyTextToClipboardV440(url);
    if (!copied) throw new Error('Copia non riuscita');
    setBilanciCopyStatusV440('Link copiato.', 'is-ok');
  } catch (error) {
    console.warn('Copia link WhatsApp Bilanci non disponibile', error);
    setBilanciCopyStatusV440('Copia non riuscita: seleziona e copia il link dalla barra indirizzi.', 'is-error');
  } finally {
    if (button) button.disabled = false;
  }
}

function getSeasonOptionsV435() {
  const entries = stateV435.manifest?.snapshots || [];
  return entries.map((entry) => ({ id: entry.seasonId, label: getSeasonLabelV435(entry.seasonId), file: entry.file }));
}

function buildTeamOptionsV435(snapshot) {
  return (snapshot?.seasonTeams || [])
    .map((team) => ({ id: team.id, name: getTeamNameV435(team) }))
    .sort((a, b) => a.name.localeCompare(b.name, 'it', { sensitivity: 'base' }));
}

function computeBalanceV435(snapshot, seasonTeamId) {
  const seasonId = snapshot?.seasonId || snapshot?.id || stateV435.selectedSeasonId;
  const monthColumns = buildSeasonMonthsV435(seasonId);
  const columns = [...monthColumns, { key: 'extra', heading: 'Extra', label: 'Fuori periodo' }];
  const movements = (snapshot?.fmMovements || [])
    .filter((movement) => (movement.seasonTeamId || movement.targetSeasonTeamId) === seasonTeamId)
    .sort(compareMovementsV435);

  const sums = new Map();
  for (const row of CATEGORY_ROWS_V435) {
    sums.set(row.id, Object.fromEntries(columns.map((column) => [column.key, 0])));
  }

  for (const movement of movements) {
    const type = movementTypeV435(movement);
    const key = monthKeyFromDateV435(movement.date, seasonId);
    sums.get(type)[key] += toNumberV435(movement.amount);
  }

  const monthlyTotals = Object.fromEntries(columns.map((column) => [column.key, 0]));
  for (const column of columns) {
    monthlyTotals[column.key] = CATEGORY_ROWS_V435.reduce((sum, row) => sum + sums.get(row.id)[column.key], 0);
  }

  let running = 0;
  const progressive = Object.fromEntries(columns.map((column) => {
    running += monthlyTotals[column.key];
    return [column.key, running];
  }));

  const total = movements.reduce((sum, movement) => sum + toNumberV435(movement.amount), 0);
  const income = movements.reduce((sum, movement) => sum + Math.max(0, toNumberV435(movement.amount)), 0);
  const expenses = movements.reduce((sum, movement) => sum + Math.min(0, toNumberV435(movement.amount)), 0);
  const extraCount = movements.filter((movement) => monthKeyFromDateV435(movement.date, seasonId) === 'extra').length;

  return { columns, movements, sums, monthlyTotals, progressive, total, income, expenses, extraCount };
}

function renderMetricsV435(snapshot, team, balance) {
  return `
    <article class="bilanci-metric-v435"><span>Squadra</span><strong>${escapeHtmlV435(getTeamNameV435(team))}</strong></article>
    <article class="bilanci-metric-v435"><span>Saldo finale</span><strong class="${numberClassV435(balance.total)}">${escapeHtmlV435(formatFmV435(balance.total))} FM</strong></article>
    <article class="bilanci-metric-v435"><span>Entrate</span><strong class="bilanci-positive-v435">${escapeHtmlV435(formatFmV435(balance.income))} FM</strong></article>
    <article class="bilanci-metric-v435"><span>Uscite</span><strong class="bilanci-negative-v435">${escapeHtmlV435(formatFmV435(balance.expenses))} FM</strong></article>
    <article class="bilanci-metric-v435"><span>Movimenti</span><strong>${balance.movements.length}</strong></article>
  `;
}

function renderTableV435(balance) {
  const header = balance.columns.map((column) => `<th class="number">${escapeHtmlV435(column.heading)}</th>`).join('');
  const rows = CATEGORY_ROWS_V435.map((row) => {
    const values = balance.columns.map((column) => {
      const value = balance.sums.get(row.id)[column.key];
      return `<td class="number ${numberClassV435(value)}">${escapeHtmlV435(formatFmV435(value))}</td>`;
    }).join('');
    const total = balance.columns.reduce((sum, column) => sum + balance.sums.get(row.id)[column.key], 0);
    return `<tr><td class="bilanci-row-label-v435">${escapeHtmlV435(row.label)}</td>${values}<td class="number ${numberClassV435(total)}">${escapeHtmlV435(formatFmV435(total))}</td></tr>`;
  }).join('');

  const totalRowValues = balance.columns.map((column) => {
    const value = balance.monthlyTotals[column.key];
    return `<td class="number ${numberClassV435(value)}">${escapeHtmlV435(formatFmV435(value))}</td>`;
  }).join('');
  const progressiveRowValues = balance.columns.map((column) => {
    const value = balance.progressive[column.key];
    return `<td class="number ${numberClassV435(value)}">${escapeHtmlV435(formatFmV435(value))}</td>`;
  }).join('');
  const warning = balance.extraCount
    ? `<div class="bilanci-extra-warning-v435"><strong>Attenzione:</strong> ${balance.extraCount} movimento/i hanno una data fuori dall'arco Luglio-Giugno della stagione selezionata e sono mostrati nella colonna Extra.</div>`
    : '';

  return `
    ${warning}
    <div class="bilanci-table-wrap-v435" role="region" aria-label="Bilancio mensile" tabindex="0">
      <table class="bilanci-table-v435">
        <thead><tr><th class="bilanci-row-label-v435">Voce</th>${header}<th class="number">Totale</th></tr></thead>
        <tbody>
          ${rows}
          <tr class="bilanci-total-row-v435"><td class="bilanci-row-label-v435">Totale mese</td>${totalRowValues}<td class="number ${numberClassV435(balance.total)}">${escapeHtmlV435(formatFmV435(balance.total))}</td></tr>
          <tr class="bilanci-balance-row-v435"><td class="bilanci-row-label-v435">Saldo progressivo</td>${progressiveRowValues}<td class="number ${numberClassV435(balance.total)}">${escapeHtmlV435(formatFmV435(balance.total))}</td></tr>
        </tbody>
      </table>
    </div>`;
}

function renderMovementDetailsV435(snapshot, balance) {
  if (!balance.movements.length) {
    return '<section class="panel"><p class="muted">Nessun movimento FM presente nello snapshot per questa squadra.</p></section>';
  }
  const byColumn = new Map(balance.columns.map((column) => [column.key, []]));
  for (const movement of balance.movements) {
    const key = monthKeyFromDateV435(movement.date, snapshot?.seasonId || snapshot?.id);
    if (!byColumn.has(key)) byColumn.set(key, []);
    byColumn.get(key).push(movement);
  }
  return balance.columns
    .filter((column) => (byColumn.get(column.key) || []).length)
    .map((column, index) => {
      const rows = (byColumn.get(column.key) || []).map((movement) => {
        const amount = toNumberV435(movement.amount);
        const description = movement.description || movement.playerName || '-';
        const type = movement.type || 'ALTRO';
        const player = movement.playerName ? ` · ${movement.playerName}` : '';
        return `<div class="bilanci-movement-row-v435">
          <small>${escapeHtmlV435(movement.date || '-')}</small>
          <strong>${escapeHtmlV435(type)}</strong>
          <span>${escapeHtmlV435(description + player)}</span>
          <strong class="number ${numberClassV435(amount)}">${escapeHtmlV435(formatFmV435(amount))}</strong>
        </div>`;
      }).join('');
      const monthTotal = (byColumn.get(column.key) || []).reduce((sum, movement) => sum + toNumberV435(movement.amount), 0);
      return `<details class="bilanci-month-card-v435">
        <summary><strong>${escapeHtmlV435(column.label || column.heading)}</strong><span class="number ${numberClassV435(monthTotal)}">${escapeHtmlV435(formatFmV435(monthTotal))} FM</span></summary>
        <div class="bilanci-movement-list-v435">${rows}</div>
      </details>`;
    }).join('');
}

async function renderBilanciV435() {
  const seasonSelect = document.getElementById('bilanciSeasonSelectV435');
  const teamSelect = document.getElementById('bilanciTeamSelectV435');
  const summary = document.getElementById('bilanciSummaryV435');
  const tableWrap = document.getElementById('bilanciTableWrapV435');
  const movements = document.getElementById('bilanciMovementsV435');
  if (!seasonSelect || !teamSelect || !summary || !tableWrap || !movements) return;

  try {
    await ensureBootstrapV435();
    const options = getSeasonOptionsV435();
    if (!options.length) throw new Error('Manifest snapshot stagioni vuoto.');
    if (!stateV435.selectedSeasonId) {
      stateV435.selectedSeasonId = stateV435.config?.currentSeasonId || options[0].id;
    }
    if (!options.some((item) => item.id === stateV435.selectedSeasonId)) stateV435.selectedSeasonId = options[0].id;

    seasonSelect.innerHTML = options.map((item) => `<option value="${escapeHtmlV435(item.id)}">${escapeHtmlV435(item.label)}</option>`).join('');
    seasonSelect.value = stateV435.selectedSeasonId;

    const snapshot = await loadSeasonSnapshotV435(stateV435.selectedSeasonId);
    const teams = buildTeamOptionsV435(snapshot);
    if (!teams.length) throw new Error('Nessuna squadra trovata nello snapshot selezionato.');
    if (!stateV435.selectedTeamId || !teams.some((team) => team.id === stateV435.selectedTeamId)) {
      stateV435.selectedTeamId = teams[0].id;
    }
    teamSelect.innerHTML = teams.map((team) => `<option value="${escapeHtmlV435(team.id)}">${escapeHtmlV435(team.name)}</option>`).join('');
    teamSelect.value = stateV435.selectedTeamId;

    const team = teams.find((item) => item.id === stateV435.selectedTeamId) || teams[0];
    const balance = computeBalanceV435(snapshot, team.id);
    summary.innerHTML = renderMetricsV435(snapshot, team, balance);
    tableWrap.innerHTML = balance.movements.length ? renderTableV435(balance) : '<p class="muted">Nessun movimento FM disponibile per questa squadra nella stagione selezionata.</p>';
    movements.innerHTML = renderMovementDetailsV435(snapshot, balance);
  } catch (error) {
    console.warn('Bilanci V435 non disponibili', error);
    summary.innerHTML = `<p class="notice notice-warning">Bilanci non disponibili: ${escapeHtmlV435(error.message || error)}</p>`;
    tableWrap.innerHTML = '';
    movements.innerHTML = '';
  }
}

function bindBilanciControlsV435() {
  const seasonSelect = document.getElementById('bilanciSeasonSelectV435');
  const teamSelect = document.getElementById('bilanciTeamSelectV435');
  const whatsappButton = document.getElementById('bilanciWhatsappCopyV440');
  if (whatsappButton?.dataset.boundV440 !== 'true') {
    whatsappButton.dataset.boundV440 = 'true';
    whatsappButton.addEventListener('click', copyBilanciWhatsappLinkV440);
  }
  if (seasonSelect?.dataset.boundV435 !== 'true') {
    seasonSelect.dataset.boundV435 = 'true';
    seasonSelect.addEventListener('change', () => {
      stateV435.selectedSeasonId = seasonSelect.value;
      stateV435.selectedTeamId = '';
      renderBilanciV435();
    });
  }
  if (teamSelect?.dataset.boundV435 !== 'true') {
    teamSelect.dataset.boundV435 = 'true';
    teamSelect.addEventListener('change', () => {
      stateV435.selectedTeamId = teamSelect.value;
      renderBilanciV435();
    });
  }
}

function initBilanciV435() {
  bindBilanciControlsV435();
  renderBilanciV435();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBilanciV435, { once: true });
} else {
  initBilanciV435();
}

window.addEventListener('hashchange', () => {
  if (String(window.location.hash || '') === '#bilanci') renderBilanciV435();
});

document.addEventListener('click', (event) => {
  if (event.target?.closest?.('[data-page-link="bilanci"]')) {
    window.setTimeout(renderBilanciV435, 0);
  }
}, true);

window.ZonaOrientaleBilanciSnapshotSectionV435 = Object.freeze({
  version: 'V440',
  source: 'assets/snapshots/seasons/*.json',
  noExtraDataset: true,
  whatsappPreviewUrl: buildBilanciWhatsappUrlV440(),
  render: renderBilanciV435
});
