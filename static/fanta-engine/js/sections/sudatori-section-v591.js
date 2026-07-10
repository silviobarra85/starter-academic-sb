(() => {
  'use strict';

  const VERSION = 'V591';
  const PAGE = 'sudatori';
  const ENGINE_BASE = '../fanta-engine';
  const DATA_MANIFEST = `${ENGINE_BASE}/data/sudatori/current/manifest.json?v=591`;
  const LISTONE_MANIFEST = `${ENGINE_BASE}/data/shared-assets/current/assets/listoni/manifest.json?v=591`;
  const state = { initialized: false, loaded: false, data: null, listoneByName: new Map(), selectedTeamId: '', selectedPlayer: null, search: '' };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function normalize(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }
  function escapeHtml(value) {
    return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }
  function formatDate(value) {
    const raw = String(value || '').trim();
    const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return m ? `${m[3]}/${m[2]}/${m[1]}` : raw;
  }
  async function fetchJson(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status} su ${url}`);
    return res.json();
  }
  function buildFantacalcioUrl(listonePlayer, fallbackName) {
    const id = listonePlayer?.fantacalcioId || listonePlayer?.fantacalcio_id || listonePlayer?.idFantacalcio;
    if (!id) return '';
    const playerName = listonePlayer?.playerName || fallbackName || 'giocatore';
    const teamCode = String(listonePlayer?.realTeam || '').trim().toUpperCase();
    const teamSlugs = { ATA: 'atalanta', BOL: 'bologna', CAG: 'cagliari', COM: 'como', CRE: 'cremonese', EMP: 'empoli', FIO: 'fiorentina', FRO: 'frosinone', GEN: 'genoa', INT: 'inter', JUV: 'juventus', LAZ: 'lazio', LEC: 'lecce', MIL: 'milan', MON: 'monza', NAP: 'napoli', PAR: 'parma', PIS: 'pisa', ROM: 'roma', SAS: 'sassuolo', TOR: 'torino', UDI: 'udinese', VEN: 'venezia', VER: 'verona' };
    const slug = String(playerName).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const teamSlug = teamSlugs[teamCode] || teamCode.toLowerCase();
    if (!slug || !teamSlug) return '';
    const target = `https://www.fantacalcio.it/serie-a/squadre/${teamSlug}/${slug}/${encodeURIComponent(id)}`;
    return `./player.html?url=${encodeURIComponent(target)}&name=${encodeURIComponent(playerName)}`;
  }

  async function loadData() {
    if (state.loaded) return state.data;
    const manifest = await fetchJson(DATA_MANIFEST);
    const data = await fetchJson(`${ENGINE_BASE}/data/sudatori/current/${manifest.current || 'sudatori-data.json'}?v=591`);
    state.data = data;
    state.selectedTeamId = data.teams?.[0]?.id || '';
    state.loaded = true;
    await loadListone();
    return data;
  }
  async function loadListone() {
    try {
      const manifest = await fetchJson(LISTONE_MANIFEST);
      const listoni = Array.isArray(manifest.listoni) ? manifest.listoni : [];
      const sorted = listoni.filter((x) => x && x.file).sort((a, b) => String(b.loadedAt || b.id || '').localeCompare(String(a.loadedAt || a.id || '')));
      const pick = sorted.find((x) => String(x.seasonId || '') === '2026-2027') || sorted[0];
      if (!pick) return;
      const json = await fetchJson(`${ENGINE_BASE}/data/shared-assets/current/assets/listoni/${pick.file}?v=591`);
      const players = Array.isArray(json.players) ? json.players : [];
      state.listoneByName = new Map();
      players.forEach((p) => {
        const key = normalize(p.playerName || p.player_name || p.nome);
        if (key && !state.listoneByName.has(key)) state.listoneByName.set(key, p);
      });
    } catch (err) {
      console.warn('[Sudatori V591] Listone non caricato.', err);
    }
  }

  function ensureNav() {
    const desktopNav = $('.app-nav');
    if (desktopNav && !desktopNav.querySelector(`[data-page-link="${PAGE}"]`)) {
      const link = document.createElement('a');
      link.href = `#${PAGE}`;
      link.className = 'nav-link';
      link.dataset.pageLink = PAGE;
      link.dataset.leagueMobileMore = PAGE;
      link.textContent = 'Per i SUDATORI';
      desktopNav.insertBefore(link, desktopNav.querySelector('[data-page-link="admin"]') || null);
    }
    const mobileSheet = $('#mobileMoreSheet');
    if (mobileSheet && !mobileSheet.querySelector(`[data-page-link="${PAGE}"]`)) {
      const link = document.createElement('a');
      link.href = `#${PAGE}`;
      link.className = 'mobile-more-link';
      link.dataset.leagueMobileMore = PAGE;
      link.dataset.pageLink = PAGE;
      link.innerHTML = '<span class="mobile-more-icon">🔥</span><span>Per i SUDATORI</span>';
      mobileSheet.insertBefore(link, mobileSheet.querySelector('[data-page-link="admin"]') || null);
    }
  }

  function ensureSection() {
    let section = $(`.app-page[data-page="${PAGE}"]`);
    if (section) return section;
    const main = $('.app-main') || document.body;
    section = document.createElement('section');
    section.className = 'app-page sudatori-page-v591';
    section.dataset.page = PAGE;
    section.setAttribute('aria-labelledby', 'sudatoriTitleV591');
    section.innerHTML = `<section class="panel sudatori-shell-v591"><div class="sudatori-hero-v591"><div><p class="eyebrow">Sezione standalone</p><h2 id="sudatoriTitleV591">Per i SUDATORI</h2><p>Rose Serie A, schede giocatore, ritiri, allenatori, moduli e amichevoli estive.</p><small class="muted">Modulo isolato: legge dati statici e non modifica Firebase.</small></div></div><div class="sudatori-status-v591" data-sudatori-status>Caricamento dati Sudatori...</div></section>`;
    const admin = $('#adminPanel');
    if (admin) main.insertBefore(section, admin);
    else main.appendChild(section);
    return section;
  }
  function setActivePage(page) {
    $$('.app-page').forEach((el) => el.classList.toggle('is-active', el.dataset.page === page));
    $$('[data-page-link]').forEach((link) => {
      const active = link.dataset.pageLink === page;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
    });
    $('#mobileMoreSheet')?.classList.add('hidden');
    $('#mobileMoreBackdrop')?.classList.add('hidden');
    $('#mobileMoreBtn')?.setAttribute('aria-expanded', 'false');
  }
  function getTeamById(id) { return state.data?.teams?.find((t) => t.id === id) || null; }
  function getPlayers(teamId) { return state.data?.playersByTeam?.[teamId] || []; }
  function getFriendlies(teamId) { return state.data?.friendliesByTeam?.[teamId] || []; }
  function listoneFor(playerName) { return state.listoneByName.get(normalize(playerName)) || null; }
  function marketNotesFor(playerName) { return state.data?.marketNotesByPlayer?.[normalize(playerName)] || []; }

  function renderKpis(data) {
    return `<div class="sudatori-kpis-v591" aria-label="Indicatori Sudatori"><div class="sudatori-kpi-v591"><span>Squadre Serie A</span><strong>${escapeHtml(data.meta?.teams || data.teams?.length || '-')}</strong></div><div class="sudatori-kpi-v591"><span>Giocatori monitorati</span><strong>${escapeHtml(data.meta?.players || '-')}</strong></div><div class="sudatori-kpi-v591"><span>Amichevoli</span><strong>${escapeHtml(data.meta?.friendlies || '-')}</strong></div><div class="sudatori-kpi-v591"><span>Note mercato</span><strong>${escapeHtml(data.meta?.marketNotes || '0')}</strong></div></div>`;
  }
  function renderToolbar(data) {
    const options = data.teams.map((t) => `<option value="${escapeHtml(t.id)}" ${t.id === state.selectedTeamId ? 'selected' : ''}>${escapeHtml(t.name)}</option>`).join('');
    return `<div class="sudatori-toolbar-v591"><input class="input" type="search" data-sudatori-search placeholder="Cerca squadra o giocatore..." value="${escapeHtml(state.search)}" /><select class="input" data-sudatori-team-select aria-label="Squadra Serie A">${options}</select><button class="button button-secondary" type="button" data-sudatori-reset>Mostra tutto</button></div>`;
  }
  function renderTeamCards(data) {
    const q = normalize(state.search);
    const teams = data.teams.filter((t) => !q || normalize(`${t.name} ${t.coach} ${t.module}`).includes(q) || getPlayers(t.id).some((p) => normalize(p.playerName).includes(q)));
    if (!teams.length) return '<p class="muted">Nessuna squadra trovata.</p>';
    return `<div id="sudatoriTeamsV591" class="sudatori-grid-v591">${teams.map((t) => {
      const players = getPlayers(t.id).slice(0, 10);
      return `<button class="sudatori-team-card-v591 ${t.id === state.selectedTeamId ? 'is-selected' : ''}" type="button" data-sudatori-team="${escapeHtml(t.id)}"><div class="sudatori-team-card-head-v591"><h3>${escapeHtml(t.name)}</h3><span class="sudatori-badge-v591">${escapeHtml(t.abbr || t.playersCount || '')}</span></div><div class="sudatori-card-meta-v591"><span>Allenatore<br><strong>${escapeHtml(t.coach || '-')}</strong></span><span>Modulo<br><strong>${escapeHtml(t.module || '-')}</strong></span><span>Ritiro<br><strong>${escapeHtml(t.retreatPlace || 'Da confermare')}</strong></span><span>Amichevoli<br><strong>${escapeHtml(t.friendliesCount || getFriendlies(t.id).length || 0)}</strong></span></div><div class="sudatori-roster-preview-v591" aria-label="Anteprima rosa">${players.map((p) => `<span class="sudatori-chip-v591" data-role="${escapeHtml(p.role)}">${escapeHtml(p.role || '-')} · ${escapeHtml(p.playerName)}</span>`).join('')}${getPlayers(t.id).length > players.length ? `<span class="sudatori-chip-v591">+${getPlayers(t.id).length - players.length}</span>` : ''}</div></button>`;
    }).join('')}</div>`;
  }
  function renderRosterTable(team) {
    const players = getPlayers(team.id);
    if (!players.length) return '<p class="muted">Rosa non disponibile.</p>';
    return `<div class="sudatori-table-wrap-v591"><table class="sudatori-table-v591" data-sudatori-roster-table><thead><tr><th>Giocatore</th><th>Ruolo</th><th>Squadra</th><th>Parametri</th><th>Mercato</th></tr></thead><tbody>${players.map((p) => {
      const lp = listoneFor(p.playerName);
      const notes = marketNotesFor(p.playerName);
      const params = lp ? [lp.quotationCurrent ? `Qt ${lp.quotationCurrent}` : '', lp.fvm ? `FVM ${lp.fvm}` : '', lp.sourceExtra?.fantasyAverage ? `FM ${lp.sourceExtra.fantasyAverage}` : ''].filter(Boolean).join(' · ') : 'Non nel listone';
      return `<tr data-role="${escapeHtml(p.role || '')}"><td><button type="button" class="sudatori-player-button-v591" data-sudatori-player="${escapeHtml(p.id)}">${escapeHtml(p.playerName)}</button></td><td><span class="sudatori-role-v591" data-role="${escapeHtml(p.role || '')}">${escapeHtml(p.role || '-')}</span></td><td>${escapeHtml(p.teamName)}</td><td>${escapeHtml(params || '-')}</td><td>${notes.length ? `<span class="sudatori-badge-v591">${notes.length} nota/e</span>` : '<span class="muted">Nessuna</span>'}</td></tr>`;
    }).join('')}</tbody></table></div>`;
  }
  function renderFriendlies(team) {
    const items = getFriendlies(team.id);
    if (!items.length) return '<div class="sudatori-friendlies-v591"><p class="muted">Nessuna amichevole disponibile.</p></div>';
    return `<div id="sudatoriFriendliesV591" class="sudatori-friendlies-v591">${items.map((f) => `<div class="sudatori-friendly-v591"><strong>${escapeHtml(f.event || '-')}</strong><small>${escapeHtml(formatDate(f.date) || 'Data da definire')}${f.time ? ` · ${escapeHtml(f.time)}` : ''}${f.venue ? ` · ${escapeHtml(f.venue)}` : ''}</small><div>${escapeHtml(f.status || '')}</div></div>`).join('')}</div>`;
  }
  function renderPlayerPanel(player) {
    if (!player) return `<div class="sudatori-player-empty-v591">Seleziona un giocatore dalla rosa per aprire la scheda.</div>`;
    const team = getTeamById(player.teamId) || {};
    const lp = listoneFor(player.playerName);
    const notes = marketNotesFor(player.playerName);
    const url = buildFantacalcioUrl(lp, player.playerName);
    const extra = lp?.sourceExtra || {};
    return `<div class="sudatori-player-body-v591"><div><p class="eyebrow">Scheda giocatore</p><h3>${escapeHtml(player.playerName)}</h3><p>${escapeHtml(player.role || '-')} · ${escapeHtml(player.teamName || '-')} · ${escapeHtml(team.coach || '-')} · ${escapeHtml(team.module || '-')}</p></div><div class="sudatori-param-grid-v591"><div class="sudatori-param-v591"><span>Qt.A</span><strong>${escapeHtml(lp?.quotationCurrent ?? '-')}</strong></div><div class="sudatori-param-v591"><span>FVM</span><strong>${escapeHtml(lp?.fvm ?? '-')}</strong></div><div class="sudatori-param-v591"><span>Media</span><strong>${escapeHtml(extra.average ?? '-')}</strong></div><div class="sudatori-param-v591"><span>Fantamedia</span><strong>${escapeHtml(extra.fantasyAverage ?? '-')}</strong></div><div class="sudatori-param-v591"><span>Presenze</span><strong>${escapeHtml(extra.played ?? '-')}</strong></div><div class="sudatori-param-v591"><span>Stato listone</span><strong>${escapeHtml(lp?.status || 'Non trovato')}</strong></div></div>${url ? `<a class="button button-primary" href="${escapeHtml(url)}" target="_blank" rel="noopener">Apri scheda Fantacalcio.it</a>` : '<div class="sudatori-note-v591">Link Fantacalcio.it non disponibile: manca id nel listone.</div>'}<div class="sudatori-note-v591"><strong>Nota rosa:</strong><br>${escapeHtml(player.note || 'Nessuna nota specifica disponibile.')}</div><div><h4>Mercato / rapporti / contesto</h4>${notes.length ? notes.map((n) => `<div class="sudatori-market-note-v591"><strong>${escapeHtml(n.type || n.status || 'Nota mercato')}</strong><p>${escapeHtml(n.note || n.status || 'Aggiornamento disponibile.')}</p><small>${escapeHtml(n.fromTeam || '')}${n.toTeam ? ` -> ${escapeHtml(n.toTeam)}` : ''}${n.source ? ` · ${escapeHtml(n.source)}` : ''}</small></div>`).join('') : '<p class="muted">Nessuna informazione mercato/rapporti disponibile nel file caricato.</p>'}</div><div><h4>Amichevoli squadra</h4>${getFriendlies(player.teamId).slice(0, 5).map((f) => `<div class="sudatori-friendly-v591"><strong>${escapeHtml(f.event)}</strong><small>${escapeHtml(formatDate(f.date) || 'Data da definire')}${f.time ? ` · ${escapeHtml(f.time)}` : ''}</small></div>`).join('') || '<p class="muted">Nessuna amichevole disponibile.</p>'}</div><div class="sudatori-sources-v591"><strong>Fonte rosa:</strong> ${player.rosterSource ? `<a href="${escapeHtml(player.rosterSource)}" target="_blank" rel="noopener">Transfermarkt / fonte rosa</a>` : 'non indicata'}</div></div>`;
  }
  function renderSources(data) {
    const sources = (data.sources || []).slice(0, 6);
    if (!sources.length) return '';
    return `<details class="sudatori-sources-v591"><summary>Fonti dati</summary><ul>${sources.map((s) => `<li>${s.url ? `<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener">${escapeHtml(s.name || s.url)}</a>` : escapeHtml(s.name || '-') } <span>${escapeHtml(s.use || '')}</span></li>`).join('')}</ul></details>`;
  }
  function render() {
    const section = ensureSection();
    const data = state.data;
    if (!data) return;
    const team = getTeamById(state.selectedTeamId) || data.teams?.[0];
    if (!team) return;
    section.innerHTML = `<section class="panel sudatori-shell-v591"><div class="sudatori-hero-v591"><div><p class="eyebrow">Sezione standalone · ${escapeHtml(data.meta?.version || VERSION)}</p><h2 id="sudatoriTitleV591">Per i SUDATORI</h2><p>Rose del campionato, schede giocatore, parametri dal listone, mercato, allenatori, moduli, ritiri e amichevoli.</p><small class="muted">Aggiornato al ${escapeHtml(formatDate(data.meta?.updatedAt))} · fonte: ${escapeHtml(data.meta?.sourceFile || '-')}</small></div><div class="sudatori-hero-actions-v591"><button class="button button-primary" type="button" data-sudatori-scroll="teams">Rose campionato</button><button class="button button-secondary" type="button" data-sudatori-scroll="friendlies">Amichevoli</button></div></div>${renderKpis(data)}${renderToolbar(data)}<section aria-labelledby="sudatoriRoseCampionatoTitleV591"><h3 id="sudatoriRoseCampionatoTitleV591">Card rose del campionato</h3><p class="muted">Ogni card mostra allenatore, modulo, ritiro, numero amichevoli e anteprima rosa.</p>${renderTeamCards(data)}</section><div class="sudatori-layout-v591"><section class="sudatori-section-card-v591" aria-labelledby="sudatoriRosterTitleV591"><header><div><h3 id="sudatoriRosterTitleV591">Rosa ${escapeHtml(team.name)}</h3><p>${escapeHtml(team.coach || '-')} · ${escapeHtml(team.module || '-')}</p></div><span class="sudatori-badge-v591">${escapeHtml(getPlayers(team.id).length)} giocatori</span></header>${renderRosterTable(team)}</section><section class="sudatori-section-card-v591 sudatori-player-panel-v591" aria-labelledby="sudatoriPlayerTitleV591"><header><div><h3 id="sudatoriPlayerTitleV591">Scheda giocatore</h3><p>Parametri e contesto dal file Sudatori + listone.</p></div></header>${renderPlayerPanel(state.selectedPlayer)}</section></div><section class="sudatori-section-card-v591" aria-labelledby="sudatoriFriendliesTitleV591" style="margin-top:1rem;"><header><div><h3 id="sudatoriFriendliesTitleV591">Ritiri e amichevoli ${escapeHtml(team.name)}</h3><p>${escapeHtml(team.retreatPlace || 'Ritiro da confermare')} ${team.retreatStart ? `· ${escapeHtml(formatDate(team.retreatStart))}` : ''}</p></div><span class="sudatori-badge-v591">${escapeHtml(getFriendlies(team.id).length)} eventi</span></header>${renderFriendlies(team)}</section>${renderSources(data)}</section>`;
    bindSectionEvents(section);
  }
  function bindSectionEvents(section) {
    section.querySelector('[data-sudatori-search]')?.addEventListener('input', (event) => { state.search = event.target.value || ''; render(); });
    section.querySelector('[data-sudatori-team-select]')?.addEventListener('change', (event) => { state.selectedTeamId = event.target.value || state.selectedTeamId; state.selectedPlayer = null; render(); });
    section.querySelector('[data-sudatori-reset]')?.addEventListener('click', () => { state.search = ''; render(); });
    section.querySelectorAll('[data-sudatori-team]').forEach((card) => card.addEventListener('click', () => { state.selectedTeamId = card.dataset.sudatoriTeam || state.selectedTeamId; state.selectedPlayer = null; render(); section.querySelector('#sudatoriRosterTitleV591')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
    section.querySelectorAll('[data-sudatori-player]').forEach((button) => button.addEventListener('click', () => { const id = button.dataset.sudatoriPlayer; state.selectedPlayer = getPlayers(state.selectedTeamId).find((p) => p.id === id) || null; render(); section.querySelector('#sudatoriPlayerTitleV591')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
    section.querySelectorAll('[data-sudatori-scroll]').forEach((button) => button.addEventListener('click', () => { const target = button.dataset.sudatoriScroll === 'friendlies' ? '#sudatoriFriendliesTitleV591' : '#sudatoriTeamsV591'; section.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
  }
  async function activateSudatori() {
    ensureNav(); ensureSection(); setActivePage(PAGE);
    try { await loadData(); render(); }
    catch (err) { console.error('[Sudatori V591] Errore caricamento', err); const status = ensureSection().querySelector('[data-sudatori-status]'); if (status) status.innerHTML = `<div class="notice notice-error">Errore caricamento sezione Sudatori: ${escapeHtml(err.message || err)}</div>`; }
  }
  function handleHash() { if ((String(window.location.hash || '').replace(/^#/, '') || 'dashboard') === PAGE) activateSudatori(); }
  function init() {
    if (state.initialized) return;
    state.initialized = true;
    ensureNav(); ensureSection();
    document.addEventListener('click', (event) => { const link = event.target.closest?.(`[data-page-link="${PAGE}"], a[href="#${PAGE}"]`); if (!link) return; event.preventDefault(); if (window.location.hash !== `#${PAGE}`) window.location.hash = PAGE; else activateSudatori(); });
    window.addEventListener('hashchange', handleHash);
    handleHash();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.FantaSudatoriV591 = { activate: activateSudatori, reload: () => { state.loaded = false; state.data = null; return activateSudatori(); } };
})();
