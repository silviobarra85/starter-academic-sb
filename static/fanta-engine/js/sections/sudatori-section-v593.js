(() => {
  'use strict';

  const VERSION = 'V593';
  const PAGE = 'sudatori';
  const ENGINE_BASE = '../fanta-engine';
  const DATA_MANIFEST = `${ENGINE_BASE}/data/sudatori/current/manifest.json?v=593`;
  const LISTONE_MANIFEST = `${ENGINE_BASE}/data/shared-assets/current/assets/listoni/manifest.json?v=593`;
  const state = { initialized: false, loaded: false, data: null, listoneByName: new Map(), listoneByNameTeam: new Map(), selectedTeamId: '', selectedPlayer: null, search: '' };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function normalize(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }

  const TEAM_ALIAS_V593 = new Map([
    ['atalanta','ata'],['ata','ata'],['bologna','bol'],['bol','bol'],['cagliari','cag'],['cag','cag'],['como','com'],['com','com'],['cremonese','cre'],['cre','cre'],['fiorentina','fio'],['fio','fio'],['frosinone','fro'],['fro','fro'],['genoa','gen'],['gen','gen'],['inter','int'],['internazionale','int'],['int','int'],['juventus','juv'],['juve','juv'],['juv','juv'],['lazio','laz'],['laz','laz'],['lecce','lec'],['lec','lec'],['milan','mil'],['ac milan','mil'],['mil','mil'],['monza','mon'],['mon','mon'],['napoli','nap'],['nap','nap'],['parma','par'],['par','par'],['pisa','pis'],['pis','pis'],['roma','rom'],['rom','rom'],['sassuolo','sas'],['sas','sas'],['torino','tor'],['tor','tor'],['udinese','udi'],['udi','udi'],['venezia','ven'],['ven','ven'],['verona','ver'],['hellas verona','ver'],['ver','ver']
  ]);
  function canonicalName(value) {
    return normalize(value).split(/\s+/).filter(Boolean).filter((token) => token.length > 1 && !/^(jr|sr|ii|iii)$/.test(token)).join(' ');
  }
  function compactName(value) { return canonicalName(value).replace(/\s+/g, ''); }
  function sortedCanonical(value) { return canonicalName(value).split(/\s+/).filter(Boolean).sort().join(' '); }
  function teamKey(value) { const key = normalize(value); return TEAM_ALIAS_V593.get(key) || key; }
  function listoneTeamKeys(player) { return [player?.realTeam, player?.realTeamOriginal, player?.teamName].map(teamKey).filter(Boolean); }

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
    const data = await fetchJson(`${ENGINE_BASE}/data/sudatori/current/${manifest.current || 'sudatori-data.json'}?v=593`);
    state.data = data;
    state.selectedTeamId = data.teams?.[0]?.id || '';
    state.loaded = true;
    await loadListone();
    return data;
  }
  async function loadListone() {
    state.listoneByName = new Map();
    state.listoneByNameTeam = new Map();
    state.listoneByCanon = new Map();
    state.listoneByCanonTeam = new Map();
    state.listoneByCompact = new Map();
    state.listoneByCompactTeam = new Map();
    state.listoneBySorted = new Map();
    state.listoneBySortedTeam = new Map();
    const addUnique = (map, key, player) => {
      if (!key) return;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(player);
    };
    const addPlayer = (p) => {
      const rawName = p.playerName || p.player_name || p.nome;
      const exact = normalize(rawName);
      const canon = canonicalName(rawName);
      const compact = compactName(rawName);
      const sorted = sortedCanonical(rawName);
      if (!exact) return;
      addUnique(state.listoneByName, exact, p);
      addUnique(state.listoneByCanon, canon, p);
      addUnique(state.listoneByCompact, compact, p);
      addUnique(state.listoneBySorted, sorted, p);
      listoneTeamKeys(p).forEach((team) => {
        addUnique(state.listoneByNameTeam, `${exact}::${team}`, p);
        addUnique(state.listoneByCanonTeam, `${canon}::${team}`, p);
        addUnique(state.listoneByCompactTeam, `${compact}::${team}`, p);
        addUnique(state.listoneBySortedTeam, `${sorted}::${team}`, p);
      });
    };
    try {
      const embedded = [];
      Object.values(state.data?.playersByTeam || {}).forEach((players) => {
        (players || []).forEach((p) => { if (p?.listone?.playerName) embedded.push(p.listone); });
      });
      embedded.forEach(addPlayer);
      const manifest = await fetchJson(LISTONE_MANIFEST);
      const listoni = Array.isArray(manifest.listoni) ? manifest.listoni : [];
      const sorted = listoni.filter((x) => x && x.file).sort((a, b) => String(b.loadedAt || b.id || '').localeCompare(String(a.loadedAt || a.id || '')));
      const metaId = state.data?.meta?.listoneId;
      const pick = sorted.find((x) => String(x.id || '') === String(metaId || '')) || sorted.find((x) => String(x.seasonId || '') === '2026-2027') || sorted[0];
      if (!pick) return;
      const json = await fetchJson(`${ENGINE_BASE}/data/shared-assets/current/assets/listoni/${pick.file}?v=593`);
      const players = Array.isArray(json.players) ? json.players : [];
      state.listoneByName = new Map();
      state.listoneByNameTeam = new Map();
      state.listoneByCanon = new Map();
      state.listoneByCanonTeam = new Map();
      state.listoneByCompact = new Map();
      state.listoneByCompactTeam = new Map();
      state.listoneBySorted = new Map();
      state.listoneBySortedTeam = new Map();
      players.forEach(addPlayer);
    } catch (err) {
      console.warn('[Sudatori V593] Listone live non caricato: uso snapshot incorporato se disponibile.', err);
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
    section.className = 'app-page sudatori-page-v593';
    section.dataset.page = PAGE;
    section.setAttribute('aria-labelledby', 'sudatoriTitleV593');
    section.innerHTML = `<section class="panel sudatori-shell-v593"><div class="sudatori-hero-v593"><div><p class="eyebrow">Sezione standalone</p><h2 id="sudatoriTitleV593">Per i SUDATORI</h2><p>Rose Serie A, schede giocatore, ritiri, allenatori, moduli e amichevoli estive.</p><small class="muted">Modulo isolato: legge dati statici e non modifica Firebase.</small></div></div><div class="sudatori-status-v593" data-sudatori-status>Caricamento dati Sudatori...</div></section>`;
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
  function uniqueListoneMatch(list, role) {
    const candidates = (list || []).filter(Boolean);
    if (!candidates.length) return null;
    if (candidates.length === 1) return candidates[0];
    const roleKey = String(role || '').toUpperCase().slice(0, 1);
    const byRole = candidates.filter((p) => String(p.classicRole || p.rosterRole || '').toUpperCase().slice(0, 1) === roleKey);
    return byRole.length === 1 ? byRole[0] : null;
  }
  function listoneFor(player) {
    const name = typeof player === 'string' ? player : player?.playerName;
    const key = normalize(name);
    const canon = canonicalName(name);
    const compact = compactName(name);
    const sorted = sortedCanonical(name);
    const role = typeof player === 'object' ? player?.role || player?.classicRole : '';
    const teams = typeof player === 'string' ? [] : [teamKey(player?.teamName), teamKey(player?.realTeam), teamKey(player?.realTeamOriginal)].filter(Boolean);
    const attempts = [];
    teams.forEach((team) => {
      attempts.push([state.listoneByNameTeam, `${key}::${team}`], [state.listoneByCanonTeam, `${canon}::${team}`], [state.listoneByCompactTeam, `${compact}::${team}`], [state.listoneBySortedTeam, `${sorted}::${team}`]);
    });
    attempts.push([state.listoneByName, key], [state.listoneByCanon, canon], [state.listoneByCompact, compact], [state.listoneBySorted, sorted]);
    for (const [map, mapKey] of attempts) {
      const match = uniqueListoneMatch(map?.get(mapKey), role);
      if (match) return match;
    }
    return (typeof player === 'object' ? player?.listone : null) || null;
  }
  function marketNotesFor(player) { const name = typeof player === 'string' ? player : player?.playerName; return state.data?.marketNotesByPlayer?.[normalize(name)] || []; }

  function renderKpis(data) {
    return `<div class="sudatori-kpis-v593" aria-label="Indicatori Sudatori"><div class="sudatori-kpi-v593"><span>Squadre Serie A</span><strong>${escapeHtml(data.meta?.teams || data.teams?.length || '-')}</strong></div><div class="sudatori-kpi-v593"><span>Giocatori monitorati</span><strong>${escapeHtml(data.meta?.players || '-')}</strong></div><div class="sudatori-kpi-v593"><span>Amichevoli</span><strong>${escapeHtml(data.meta?.friendlies || '-')}</strong></div><div class="sudatori-kpi-v593"><span>Note mercato</span><strong>${escapeHtml(data.meta?.marketNotes || '0')}</strong></div></div>`;
  }
  function renderToolbar(data) {
    const options = data.teams.map((t) => `<option value="${escapeHtml(t.id)}" ${t.id === state.selectedTeamId ? 'selected' : ''}>${escapeHtml(t.name)}</option>`).join('');
    return `<div class="sudatori-toolbar-v593"><input class="input" type="search" data-sudatori-search placeholder="Cerca squadra o giocatore..." value="${escapeHtml(state.search)}" /><select class="input" data-sudatori-team-select aria-label="Squadra Serie A">${options}</select><button class="button button-secondary" type="button" data-sudatori-reset>Mostra tutto</button></div>`;
  }
  function renderTeamCards(data) {
    const q = normalize(state.search);
    const teams = data.teams.filter((t) => !q || normalize(`${t.name} ${t.coach} ${t.module}`).includes(q) || getPlayers(t.id).some((p) => normalize(p.playerName).includes(q)));
    if (!teams.length) return '<p class="muted">Nessuna squadra trovata.</p>';
    return `<div id="sudatoriTeamsV593" class="sudatori-grid-v593">${teams.map((t) => {
      const players = getPlayers(t.id).slice(0, 10);
      return `<button class="sudatori-team-card-v593 ${t.id === state.selectedTeamId ? 'is-selected' : ''}" type="button" data-sudatori-team="${escapeHtml(t.id)}"><div class="sudatori-team-card-head-v593"><h3>${escapeHtml(t.name)}</h3><span class="sudatori-badge-v593">${escapeHtml(t.abbr || t.playersCount || '')}</span></div><div class="sudatori-card-meta-v593"><span>Allenatore<br><strong>${escapeHtml(t.coach || '-')}</strong></span><span>Modulo<br><strong>${escapeHtml(t.module || '-')}</strong></span><span>Ritiro<br><strong>${escapeHtml(t.retreatPlace || 'Da confermare')}</strong></span><span>Amichevoli<br><strong>${escapeHtml(t.friendliesCount || getFriendlies(t.id).length || 0)}</strong></span></div><div class="sudatori-roster-preview-v593" aria-label="Anteprima rosa">${players.map((p) => `<span class="sudatori-chip-v593" data-role="${escapeHtml(p.role)}">${escapeHtml(p.role || '-')} · ${escapeHtml(p.playerName)}</span>`).join('')}${getPlayers(t.id).length > players.length ? `<span class="sudatori-chip-v593">+${getPlayers(t.id).length - players.length}</span>` : ''}</div></button>`;
    }).join('')}</div>`;
  }

  function formationLineKey(position, role) {
    const pos = normalize(position).toUpperCase();
    const r = String(role || '').toUpperCase();
    if (pos === 'P' || pos === 'POR' || r === 'P') return 'goalkeeper';
    if (/^(DD|DC|DS)$/.test(pos)) return 'defense';
    if (/^(CD|CS|CC|MED|M|C)$/.test(pos)) return 'midfield';
    if (/^(TQ|T|AD|AS|W)$/.test(pos)) return 'attackingMidfield';
    if (/^(PC|A)$/.test(pos) || r === 'A') return 'attack';
    if (r === 'D') return 'defense';
    if (r === 'C') return 'midfield';
    return 'bench';
  }
  function renderPitch(team) {
    const xi = getPlayers(team.id).filter((p) => p.probableXi || p.formationPosition);
    if (!xi.length) return '<div class="sudatori-pitch-empty-v593">Probabile formazione non disponibile per questa squadra.</div>';
    const groups = { attack: [], attackingMidfield: [], midfield: [], defense: [], goalkeeper: [], bench: [] };
    xi.forEach((p) => groups[formationLineKey(p.formationPosition, p.role)].push(p));
    const renderPlayer = (p) => {
      const lp = listoneFor(p);
      const fantasyRoster = (lp?.fantasyRoster || p.fantasyRoster || '').trim();
      const sub = [p.formationPosition || p.role || '-', fantasyRoster || 'Svincolati'].filter(Boolean).join(' · ');
      return `<button class="sudatori-pitch-player-v593" type="button" data-sudatori-player="${escapeHtml(p.id)}" title="${escapeHtml(p.playerName)}"><strong>${escapeHtml(p.playerName)}</strong><small>${escapeHtml(sub)}</small></button>`;
    };
    const renderLine = (key, label) => groups[key].length ? `<div class="sudatori-pitch-line-v593 sudatori-pitch-line-${key}-v593" aria-label="${escapeHtml(label)}">${groups[key].map(renderPlayer).join('')}</div>` : '';
    return `<div class="sudatori-pitch-card-v593" aria-label="Probabile formazione ${escapeHtml(team.name)}"><div class="sudatori-pitch-head-v593"><div><h4>Probabile formazione</h4><p>${escapeHtml(team.module || 'Modulo da confermare')} · ${escapeHtml(team.coach || '-')}</p></div><span>${escapeHtml(xi.length)} giocatori</span></div><div class="sudatori-pitch-v593"><div class="sudatori-pitch-marking sudatori-pitch-marking-center"></div><div class="sudatori-pitch-marking sudatori-pitch-marking-box-a"></div><div class="sudatori-pitch-marking sudatori-pitch-marking-box-b"></div>${renderLine('attack', 'Attacco')}${renderLine('attackingMidfield', 'Trequarti')}${renderLine('midfield', 'Centrocampo')}${renderLine('defense', 'Difesa')}${renderLine('goalkeeper', 'Portiere')}${renderLine('bench', 'Altri probabili')}</div></div>`;
  }

  function renderRosterTable(team) {
    const players = getPlayers(team.id).filter((p) => !state.search || normalize(p.playerName).includes(normalize(state.search)));
    if (!players.length) return '<p class="muted">Nessun giocatore disponibile per questa selezione.</p>';
    const rows = players.map((p) => {
      const lp = listoneFor(p);
      const notes = marketNotesFor(p);
      const fantasyRoster = (lp?.fantasyRoster || p.fantasyRoster || '').trim() || 'Svincolati';
      const params = lp ? [lp.quotationCurrent != null ? `Qt ${lp.quotationCurrent}` : '', lp.fvm != null ? `FVM ${lp.fvm}` : '', lp.fantasyAverage != null ? `FM ${lp.fantasyAverage}` : lp.sourceExtra?.fantasyAverage ? `FM ${lp.sourceExtra.fantasyAverage}` : ''].filter(Boolean).join(' · ') : 'Non nel listone';
      const mercato = p.marketStatus || (notes[0]?.status) || 'In rosa';
      const xi = p.probableXi ? '<span class="sudatori-badge-v593 sudatori-xi-v593">Probabile XI</span>' : '';
      return `<tr data-role="${escapeHtml(p.role || '')}"><td><button type="button" class="sudatori-player-button-v593" data-sudatori-player="${escapeHtml(p.id)}">${escapeHtml(p.playerName)}</button></td><td><span class="sudatori-role-v593" data-role="${escapeHtml(p.role || '')}">${escapeHtml(p.role || '-')}</span></td><td>${escapeHtml(fantasyRoster)}</td><td>${escapeHtml(params || '-')}</td><td>${escapeHtml(mercato)} ${xi}</td></tr>`;
    }).join('');
    return `<div class="sudatori-table-wrap-v593"><table class="sudatori-table-v593"><thead><tr><th>Giocatore</th><th>Ruolo</th><th>Rosa fantacalcio</th><th>Parametri listone</th><th>Mercato</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  function renderFriendlies(team) {
    const items = getFriendlies(team.id);
    if (!items.length) return '<div class="sudatori-friendlies-v593"><p class="muted">Nessuna amichevole disponibile.</p></div>';
    return `<div id="sudatoriFriendliesV593" class="sudatori-friendlies-v593">${items.map((f) => `<div class="sudatori-friendly-v593"><strong>${escapeHtml(f.event || '-')}</strong><small>${escapeHtml(formatDate(f.date) || 'Data da definire')}${f.time ? ` · ${escapeHtml(f.time)}` : ''}${f.venue ? ` · ${escapeHtml(f.venue)}` : ''}</small><div>${escapeHtml(f.status || '')}</div></div>`).join('')}</div>`;
  }
  function renderPlayerPanel(player) {
    if (!player) return '<p class="muted">Seleziona un giocatore dalla rosa per vedere scheda, parametri e note mercato.</p>';
    const team = state.data.teams.find((t) => t.id === player.teamId) || {};
    const lp = listoneFor(player);
    const notes = marketNotesFor(player);
    const extra = lp || {};
    const url = buildFantacalcioUrl(lp, player.playerName);
    const fantasyRoster = (lp?.fantasyRoster || player.fantasyRoster || '').trim() || 'Svincolati';
    const formationNote = player.formationPosition ? `<div class="sudatori-note-v593"><strong>Probabile formazione:</strong><br>${escapeHtml(player.formationPosition)} nel ${escapeHtml(player.module || team.module || '-')} · affidabilità ${escapeHtml(player.formationReliability || '-')}<br>${escapeHtml(player.formationNote || '')}</div>` : '';
    return `<div class="sudatori-player-body-v593"><div><p class="eyebrow">Scheda giocatore</p><h3>${escapeHtml(player.playerName)}</h3><p>${escapeHtml(player.role || '-')} · ${escapeHtml(player.teamName || '-')} · Rosa fantacalcio: <strong>${escapeHtml(fantasyRoster)}</strong></p><p>${escapeHtml(team.coach || '-')} · ${escapeHtml(team.module || '-')}</p></div><div class="sudatori-param-grid-v593"><div class="sudatori-param-v593"><span>Qt.A</span><strong>${escapeHtml(extra.quotationCurrent ?? '-')}</strong></div><div class="sudatori-param-v593"><span>FVM</span><strong>${escapeHtml(extra.fvm ?? '-')}</strong></div><div class="sudatori-param-v593"><span>Media</span><strong>${escapeHtml(extra.average ?? extra.sourceExtra?.average ?? '-')}</strong></div><div class="sudatori-param-v593"><span>Fantamedia</span><strong>${escapeHtml(extra.fantasyAverage ?? extra.sourceExtra?.fantasyAverage ?? '-')}</strong></div><div class="sudatori-param-v593"><span>Presenze</span><strong>${escapeHtml(extra.played ?? extra.sourceExtra?.played ?? '-')}</strong></div><div class="sudatori-param-v593"><span>Stato listone</span><strong>${escapeHtml(extra.status || 'Non trovato')}</strong></div></div>${url ? `<a class="button button-primary" href="${escapeHtml(url)}" target="_blank" rel="noopener">Apri scheda Fantacalcio.it</a>` : '<div class="sudatori-note-v593">Link Fantacalcio.it non disponibile: manca id nel listone.</div>'}<div class="sudatori-note-v593"><strong>Mercato:</strong><br>${escapeHtml(player.marketStatus || 'In rosa')} · ${escapeHtml(player.marketDetail || 'Nessuna segnalazione mercato rilevante nelle fonti consultate.')} ${player.marketSource ? `<br><a href="${escapeHtml(player.marketSource)}" target="_blank" rel="noopener">Fonte mercato</a>` : ''}</div>${formationNote}<div class="sudatori-note-v593"><strong>Nota rosa:</strong><br>${escapeHtml(player.note || 'Nessuna nota specifica disponibile.')}</div><div><h4>Mercato / rapporti / contesto</h4>${notes.length ? notes.map((n) => `<div class="sudatori-market-note-v593"><strong>${escapeHtml(n.type || n.status || 'Nota mercato')}</strong><p>${escapeHtml(n.note || n.status || 'Aggiornamento disponibile.')}</p><small>${escapeHtml(n.team || '')}${n.source ? ` · ${escapeHtml(n.source)}` : ''}</small></div>`).join('') : '<p class="muted">Nessuna informazione mercato/rapporti disponibile nel file caricato.</p>'}</div><div><h4>Amichevoli squadra</h4>${getFriendlies(player.teamId).slice(0, 5).map((f) => `<div class="sudatori-friendly-v593"><strong>${escapeHtml(f.event)}</strong><small>${escapeHtml(formatDate(f.date) || 'Data da definire')}${f.time ? ` · ${escapeHtml(f.time)}` : ''}</small></div>`).join('') || '<p class="muted">Nessuna amichevole disponibile.</p>'}</div><div class="sudatori-sources-v593"><strong>Fonte rosa:</strong> ${player.rosterSource ? `<a href="${escapeHtml(player.rosterSource)}" target="_blank" rel="noopener">Transfermarkt / fonte rosa</a>` : 'non indicata'}</div></div>`;
  }

  function renderSources(data) {
    const sources = (data.sources || []).slice(0, 6);
    if (!sources.length) return '';
    return `<details class="sudatori-sources-v593"><summary>Fonti dati</summary><ul>${sources.map((s) => `<li>${s.url ? `<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener">${escapeHtml(s.name || s.url)}</a>` : escapeHtml(s.name || '-') } <span>${escapeHtml(s.use || '')}</span></li>`).join('')}</ul></details>`;
  }
  function render() {
    const section = ensureSection();
    const data = state.data;
    if (!data) return;
    const team = getTeamById(state.selectedTeamId) || data.teams?.[0];
    if (!team) return;
    section.innerHTML = `<section class="panel sudatori-shell-v593"><div class="sudatori-hero-v593"><div><p class="eyebrow">Sezione standalone · ${escapeHtml(data.meta?.version || VERSION)}</p><h2 id="sudatoriTitleV593">Per i SUDATORI</h2><p>Rose del campionato, schede giocatore, parametri dal listone, mercato, allenatori, moduli, ritiri e amichevoli.</p><small class="muted">Aggiornato al ${escapeHtml(formatDate(data.meta?.updatedAt))} · fonte: ${escapeHtml(data.meta?.sourceFile || '-')}</small></div><div class="sudatori-hero-actions-v593"><button class="button button-primary" type="button" data-sudatori-scroll="teams">Rose campionato</button><button class="button button-secondary" type="button" data-sudatori-scroll="friendlies">Amichevoli</button></div></div>${renderKpis(data)}${renderToolbar(data)}<section aria-labelledby="sudatoriRoseCampionatoTitleV593"><h3 id="sudatoriRoseCampionatoTitleV593">Card rose del campionato</h3><p class="muted">Ogni card mostra allenatore, modulo, ritiro, numero amichevoli e anteprima rosa.</p>${renderTeamCards(data)}</section><div class="sudatori-layout-v593"><section class="sudatori-section-card-v593" aria-labelledby="sudatoriRosterTitleV593"><header><div><h3 id="sudatoriRosterTitleV593">Rosa ${escapeHtml(team.name)}</h3><p>${escapeHtml(team.coach || '-')} · ${escapeHtml(team.module || '-')}</p></div><span class="sudatori-badge-v593">${escapeHtml(getPlayers(team.id).length)} giocatori</span></header>${renderRosterTable(team)}${renderPitch(team)}</section><section class="sudatori-section-card-v593 sudatori-player-panel-v593" aria-labelledby="sudatoriPlayerTitleV593"><header><div><h3 id="sudatoriPlayerTitleV593">Scheda giocatore</h3><p>Parametri e contesto dal file Sudatori + listone.</p></div></header>${renderPlayerPanel(state.selectedPlayer)}</section></div><section class="sudatori-section-card-v593" aria-labelledby="sudatoriFriendliesTitleV593" style="margin-top:1rem;"><header><div><h3 id="sudatoriFriendliesTitleV593">Ritiri e amichevoli ${escapeHtml(team.name)}</h3><p>${escapeHtml(team.retreatPlace || 'Ritiro da confermare')} ${team.retreatStart ? `· ${escapeHtml(formatDate(team.retreatStart))}` : ''}</p></div><span class="sudatori-badge-v593">${escapeHtml(getFriendlies(team.id).length)} eventi</span></header>${renderFriendlies(team)}</section>${renderSources(data)}</section>`;
    bindSectionEvents(section);
  }
  function bindSectionEvents(section) {
    section.querySelector('[data-sudatori-search]')?.addEventListener('input', (event) => { state.search = event.target.value || ''; render(); });
    section.querySelector('[data-sudatori-team-select]')?.addEventListener('change', (event) => { state.selectedTeamId = event.target.value || state.selectedTeamId; state.selectedPlayer = null; render(); });
    section.querySelector('[data-sudatori-reset]')?.addEventListener('click', () => { state.search = ''; render(); });
    section.querySelectorAll('[data-sudatori-team]').forEach((card) => card.addEventListener('click', () => { state.selectedTeamId = card.dataset.sudatoriTeam || state.selectedTeamId; state.selectedPlayer = null; render(); section.querySelector('#sudatoriRosterTitleV593')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
    section.querySelectorAll('[data-sudatori-player]').forEach((button) => button.addEventListener('click', () => { const id = button.dataset.sudatoriPlayer; state.selectedPlayer = getPlayers(state.selectedTeamId).find((p) => p.id === id) || null; render(); section.querySelector('#sudatoriPlayerTitleV593')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
    section.querySelectorAll('[data-sudatori-scroll]').forEach((button) => button.addEventListener('click', () => { const target = button.dataset.sudatoriScroll === 'friendlies' ? '#sudatoriFriendliesTitleV593' : '#sudatoriTeamsV593'; section.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
  }
  async function activateSudatori() {
    ensureNav(); ensureSection(); setActivePage(PAGE);
    try { await loadData(); render(); }
    catch (err) { console.error('[Sudatori V593] Errore caricamento', err); const status = ensureSection().querySelector('[data-sudatori-status]'); if (status) status.innerHTML = `<div class="notice notice-error">Errore caricamento sezione Sudatori: ${escapeHtml(err.message || err)}</div>`; }
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
  window.FantaSudatoriV593 = { activate: activateSudatori, reload: () => { state.loaded = false; state.data = null; return activateSudatori(); } };
})();
