(() => {
  'use strict';

  const VERSION = 'V628';
  const PAGE = 'sudatori';
  const ENGINE_BASE = '../fanta-engine';
  const DATA_MANIFEST = `${ENGINE_BASE}/data/sudatori/current/manifest.json?v=619`;
  const LISTONE_MANIFEST = `${ENGINE_BASE}/data/shared-assets/current/assets/listoni/manifest.json?v=619`;
  const state = { initialized: false, loaded: false, data: null, listoneByName: new Map(), listoneByNameTeam: new Map(), selectedTeamId: '', selectedPlayer: null, search: '', liveRoster: { loaded: false, active: false, entries: 0, matched: 0, map: new Map(), globalMap: new Map(), source: '' } };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function normalize(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }

  const TEAM_ALIAS_V628 = new Map([
    ['atalanta','ata'],['ata','ata'],['bologna','bol'],['bol','bol'],['cagliari','cag'],['cag','cag'],['como','com'],['com','com'],['cremonese','cre'],['cre','cre'],['fiorentina','fio'],['fio','fio'],['frosinone','fro'],['fro','fro'],['genoa','gen'],['gen','gen'],['inter','int'],['internazionale','int'],['int','int'],['juventus','juv'],['juve','juv'],['juv','juv'],['lazio','laz'],['laz','laz'],['lecce','lec'],['lec','lec'],['milan','mil'],['ac milan','mil'],['mil','mil'],['monza','mon'],['mon','mon'],['napoli','nap'],['nap','nap'],['parma','par'],['par','par'],['pisa','pis'],['pis','pis'],['roma','rom'],['rom','rom'],['sassuolo','sas'],['sas','sas'],['torino','tor'],['tor','tor'],['udinese','udi'],['udi','udi'],['venezia','ven'],['ven','ven'],['verona','ver'],['hellas verona','ver'],['ver','ver']
  ]);
  function canonicalName(value) {
    return normalize(value).split(/\s+/).filter(Boolean).filter((token) => token.length > 1 && !/^(jr|sr|ii|iii)$/.test(token)).join(' ');
  }
  function compactName(value) { return canonicalName(value).replace(/\s+/g, ''); }
  function sortedCanonical(value) { return canonicalName(value).split(/\s+/).filter(Boolean).sort().join(' '); }
  function teamKey(value) { const key = normalize(value); return TEAM_ALIAS_V628.get(key) || key; }
  function listoneTeamKeys(player) { return [player?.realTeam, player?.realTeamOriginal, player?.teamName].map(teamKey).filter(Boolean); }
function roleKeyForRoster(role) {
    const raw = String(role || '').trim().toUpperCase();
    const key = raw.charAt(0);
    if (key === 'P') return 'P';
    if (key === 'D') return 'D';
    if (key === 'C' || key === 'M' || key === 'T' || key === 'W') return 'C';
    if (key === 'A') return 'A';
    return key || '';
  }
  function leagueSlugFromLocation() {
    const path = String(window.location?.pathname || '').toLowerCase();
    if (path.includes('/fantapetillomantramanager/')) return 'fantapetillomantramanager';
    if (path.includes('/zonaorientale/')) return 'zonaorientale';
    const cfg = String(window.LEAGUE_SLUG || window.leagueSlug || '').toLowerCase();
    return cfg || 'zonaorientale';
  }
  function leagueBaseUrl() {
    return new URL('/' + leagueSlugFromLocation() + '/', window.location.origin);
  }
  function latestRosterEntry(manifest, seasonId) {
    const entries = Array.isArray(manifest?.rosters) ? manifest.rosters.slice() : [];
    const seasonEntries = seasonId ? entries.filter((entry) => String(entry.seasonId || '') === String(seasonId)) : entries;
    const pool = seasonEntries.length ? seasonEntries : entries;
    return pool.sort((a, b) => String(b.loadedAt || b.id || '').localeCompare(String(a.loadedAt || a.id || ''), 'it'))[0] || null;
  }
  function addRosterCandidate(map, key, value) {
    if (!key) return;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(value);
  }
  function rosterNameKeys(value) {
    return uniqueValues([normalize(value), canonicalName(value), compactName(value), sortedCanonical(value)]);
  }
  async function loadLeagueRosters() {
    state.liveRoster = { loaded: false, active: false, entries: 0, matched: 0, unmatched: 0, map: new Map(), globalMap: new Map(), source: '' };
    try {
      const base = leagueBaseUrl();
      const manifest = await fetchJson(new URL('assets/rose/manifest.json?t=' + Date.now(), base).href);
      const entry = latestRosterEntry(manifest, state.data?.meta?.seasonId || '2026-2027');
      if (!entry?.file) return;
      const payload = await fetchJson(new URL('assets/rose/' + entry.file + '?t=' + Date.now(), base).href);
      const rosters = Array.isArray(payload?.rosters) ? payload.rosters : [];
      const map = new Map();
      const globalMap = new Map();
      let entries = 0;
      rosters.forEach((roster) => {
        const fantasyRoster = String(roster?.name || roster?.teamName || roster?.rosterName || '').trim();
        (roster?.players || []).forEach((player, index) => {
          const playerName = player?.playerName || player?.name;
          if (!playerName || !fantasyRoster) return;
          const realTeam = teamKey(player?.realTeam || player?.teamName || player?.club || '');
          const role = roleKeyForRoster(player?.role || player?.classicRole || player?.rosterRole || '');
          const value = { fantasyRoster, playerName, realTeam, role, rosterCost: player?.cost ?? player?.rosterCost ?? '', rosterRole: player?.role || player?.rosterRole || role, sourceFile: entry.file, sourceId: entry.id || '', sourceIndex: index };
          entries += 1;
          rosterNameKeys(playerName).forEach((nameKey) => {
            addRosterCandidate(map, nameKey + '::' + realTeam + '::' + role, value);
            addRosterCandidate(map, nameKey + '::' + realTeam, value);
            addRosterCandidate(globalMap, nameKey + '::' + role, value);
            addRosterCandidate(globalMap, nameKey, value);
          });
        });
      });
      state.liveRoster = { loaded: true, active: entries > 0, entries, matched: 0, unmatched: 0, map, globalMap, source: entry.file, label: entry.label || payload?.meta?.label || '' };
    } catch (err) {
      console.warn('[Sudatori V628] Rose live non caricate: uso snapshot Sudatori incorporato.', err);
    }
  }
  function uniqueRosterCandidate(list, player) {
    const candidates = uniqueValues((list || []).map((x, i) => x ? String(i) : '')).map((idx) => (list || [])[Number(idx)]).filter(Boolean);
    if (!candidates.length) return null;
    const role = roleKeyForRoster(player?.role || player?.classicRole || '');
    const byRole = role ? candidates.filter((x) => roleKeyForRoster(x.role) === role) : candidates;
    const pool = byRole.length ? byRole : candidates;
    if (pool.length === 1) return pool[0];
    const teamSet = new Set(playerTeamKeys(player));
    const byTeam = pool.filter((x) => teamSet.has(teamKey(x.realTeam)));
    return byTeam.length === 1 ? byTeam[0] : null;
  }
  function liveRosterFor(player) {
    if (!state.liveRoster?.active || !player) return null;
    const role = roleKeyForRoster(player.role || player.classicRole || '');
    const teams = playerTeamKeys(player);
    for (const item of nameCandidates(player)) {
      const names = rosterNameKeys(item.value);
      for (const nameKey of names) {
        for (const team of teams) {
          const byTeamRole = uniqueRosterCandidate(state.liveRoster.map.get(nameKey + '::' + team + '::' + role), player);
          if (byTeamRole) return byTeamRole;
          const byTeam = uniqueRosterCandidate(state.liveRoster.map.get(nameKey + '::' + team), player);
          if (byTeam) return byTeam;
        }
        if (!item.teamOnly) {
          const byGlobalRole = uniqueRosterCandidate(state.liveRoster.globalMap.get(nameKey + '::' + role), player);
          if (byGlobalRole) return byGlobalRole;
          const globalList = state.liveRoster.globalMap.get(nameKey) || [];
          if (globalList.length === 1) return globalList[0];
        }
      }
    }
    return null;
  }
  function applyLiveRosters() {
    if (!state.liveRoster?.active || !state.data?.playersByTeam) return;
    let matched = 0;
    let unmatched = 0;
    Object.values(state.data.playersByTeam).forEach((players) => {
      (players || []).forEach((player) => {
        const match = liveRosterFor(player);
        player.liveRosterSource = state.liveRoster.source;
        if (match) {
          matched += 1;
          player.liveRosterMatch = true;
          player.fantasyRoster = match.fantasyRoster;
          player.rosterCost = match.rosterCost;
          player.rosterRole = match.rosterRole;
          player.fantasyRosterLive = match.fantasyRoster;
          if (player.listone) {
            player.listone.fantasyRoster = match.fantasyRoster;
            player.listone.rosterCost = match.rosterCost;
            player.listone.rosterRole = match.rosterRole;
          }
        } else {
          unmatched += 1;
          player.liveRosterMatch = false;
          player.fantasyRoster = '';
          player.rosterCost = '';
          player.rosterRole = player.rosterRole || player.role || '';
          if (player.listone) {
            player.listone.fantasyRoster = '';
            player.listone.rosterCost = '';
          }
        }
      });
    });
    state.liveRoster.matched = matched;
    state.liveRoster.unmatched = unmatched;
    if (state.data.meta) {
      state.data.meta.liveRosters = { source: state.liveRoster.source, entries: state.liveRoster.entries, matched, unmatched };
    }
  }
  function fantasyRosterLabel(player, listonePlayer) {
    if (state.liveRoster?.active) {
      return String(player?.fantasyRoster || '').trim() || 'Svincolati';
    }
    return String(player?.fantasyRoster || listonePlayer?.fantasyRoster || '').trim() || 'Svincolati';
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
    const data = await fetchJson(`${ENGINE_BASE}/data/sudatori/current/${manifest.current || 'sudatori-data.json'}?v=619`);
    state.data = data;
    state.selectedTeamId = data.teams?.[0]?.id || '';
    state.loaded = true;
    await loadListone();
    await loadLeagueRosters();
    applyLiveRosters();
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
      const json = await fetchJson(`${ENGINE_BASE}/data/shared-assets/current/assets/listoni/${pick.file}?v=619`);
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
      console.warn('[Sudatori V628] Listone live non caricato: uso snapshot incorporato se disponibile.', err);
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
    section.className = 'app-page sudatori-page-v628';
    section.dataset.page = PAGE;
    section.setAttribute('aria-labelledby', 'sudatoriTitleV628');
    section.innerHTML = `<section class="panel sudatori-shell-v628"><div class="sudatori-hero-v628"><div><p class="eyebrow">Sezione standalone</p><h2 id="sudatoriTitleV628">Per i SUDATORI</h2><p>Rose Serie A, schede giocatore, ritiri, allenatori, moduli e amichevoli estive.</p><small class="muted">Modulo isolato: legge dati statici e non modifica Firebase.</small></div></div><div class="sudatori-status-v628" data-sudatori-status>Caricamento dati Sudatori...</div></section>`;
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
  function getFormation(teamId) { return state.data?.formationsByTeam?.[teamId] || []; }
  function getInjuries(teamId) { return state.data?.injuriesByTeam?.[teamId] || []; }
  function getTransferTalks(teamId) { return state.data?.teamTransferTalksByTeam?.[teamId] || []; }
  function getMarketSummary(teamId) { return state.data?.marketSummaryByTeam?.[teamId] || { officialIncoming: [], officialOutgoing: [], talksIncoming: [], talksOutgoing: [], counts: {} }; }
  function uniqueListoneMatch(list, role) {
    const candidates = (list || []).filter(Boolean);
    if (!candidates.length) return null;
    if (candidates.length === 1) return candidates[0];
    const roleKey = String(role || '').toUpperCase().slice(0, 1);
    const byRole = candidates.filter((p) => String(p.classicRole || p.rosterRole || '').toUpperCase().slice(0, 1) === roleKey);
    return byRole.length === 1 ? byRole[0] : null;
  }
  function uniqueValues(values) {
    return Array.from(new Set((values || []).map((x) => String(x || '').trim()).filter(Boolean)));
  }
  function playerTeamKeys(player) {
    if (!player || typeof player === 'string') return [];
    return uniqueValues([player.teamName, player.teamId, player.realTeam, player.realTeamOriginal].map(teamKey));
  }
  function nameCandidates(player) {
    const raw = typeof player === 'string' ? player : player?.playerName;
    const stripped = String(raw || '').replace(/\s*\([^)]*\)\s*$/g, '').trim();
    const names = [{ value: raw, teamOnly: false }];
    if (stripped && stripped !== raw) names.push({ value: stripped, teamOnly: true });
    if (typeof player === 'object') {
      if (player.originalName && player.originalName !== raw) names.push({ value: player.originalName, teamOnly: true });
      if (player.disambiguatedName && player.disambiguatedName !== raw) names.push({ value: player.disambiguatedName, teamOnly: false });
      if (player.listone?.playerName) names.push({ value: player.listone.playerName, teamOnly: false });
    }
    const seen = new Set();
    return names.filter((item) => {
      const key = `${normalize(item.value)}::${item.teamOnly ? 'team' : 'global'}`;
      if (!normalize(item.value) || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  function listoneFor(player) {
    const role = typeof player === 'object' ? player?.role || player?.classicRole : '';
    const teams = playerTeamKeys(player);
    const candidates = nameCandidates(player);
    const tryName = (name, onlyTeam) => {
      const key = normalize(name);
      const canon = canonicalName(name);
      const compact = compactName(name);
      const sorted = sortedCanonical(name);
      const attempts = [];
      teams.forEach((team) => {
        attempts.push([state.listoneByNameTeam, `${key}::${team}`], [state.listoneByCanonTeam, `${canon}::${team}`], [state.listoneByCompactTeam, `${compact}::${team}`], [state.listoneBySortedTeam, `${sorted}::${team}`]);
      });
      if (!onlyTeam) attempts.push([state.listoneByName, key], [state.listoneByCanon, canon], [state.listoneByCompact, compact], [state.listoneBySorted, sorted]);
      for (const [map, mapKey] of attempts) {
        const match = uniqueListoneMatch(map?.get(mapKey), role);
        if (match) return match;
      }
      return null;
    };
    for (const item of candidates) {
      const match = tryName(item.value, item.teamOnly);
      if (match) return match;
    }
    return (typeof player === 'object' ? player?.listone : null) || null;
  }
  function noteTeamMatchesPlayer(note, player) {
    if (!player || typeof player === 'string') return false;
    const noteTeam = teamKey(note?.team || note?.teamName || '');
    return !!noteTeam && playerTeamKeys(player).includes(noteTeam);
  }
  function marketNotesFor(player) {
    const notesMap = state.data?.marketNotesByPlayer || {};
    const directKeys = uniqueValues(nameCandidates(player).map((item) => normalize(item.value)));
    const out = [];
    const seen = new Set();
    const addNotes = (notes) => (notes || []).forEach((note) => {
      const key = normalize(`${note?.type || ''} ${note?.status || ''} ${note?.note || ''} ${note?.source || ''} ${note?.team || ''}`);
      if (seen.has(key)) return;
      seen.add(key);
      out.push(note);
    });
    directKeys.forEach((key) => addNotes(notesMap[key]));
    if (player && typeof player === 'object') {
      const tokens = directKeys.flatMap((key) => key.split(/\s+/).filter((t) => t.length >= 4));
      Object.entries(notesMap).forEach(([key, notes]) => {
        if (directKeys.includes(key)) return;
        if (!tokens.length || !tokens.some((token) => key.split(/\s+/).includes(token))) return;
        const filtered = (notes || []).filter((note) => noteTeamMatchesPlayer(note, player));
        addNotes(filtered);
      });
    }
    return out;
  }
  function neutralMarketText(value) {
    const text = String(value || '').trim();
    if (!text) return true;
    return /^(in rosa|confermato|nessuna segnalazione|nessuna voce|nessuna trattativa|nessun rumor|ok)$/i.test(text) || /nessuna\s+segnalazione/i.test(text);
  }
  function marketSignalText(player) {
    return [player?.flag, player?.marketStatus, player?.marketNote]
      .filter((part) => part && !neutralMarketText(part))
      .join(' ');
  }
  function noteText(note) {
    return `${note?.type || ''} ${note?.status || ''} ${note?.note || ''} ${note?.source || ''}`.trim();
  }
  function isOfficialNewMarket(value) {
    return /nuovo\s+acquisto|acquisto\s+ufficiale|ufficiale\/riscatto|arrivo\s+dal|titolo\s+definitivo|contratto\s+fino/i.test(String(value || ''));
  }
  function isRumorMarket(value) {
    const text = String(value || '');
    if (!text || neutralMarketText(text)) return false;
    return /rumor|trattativ|interess|uscita|entrata|cessione|prestito|transfermarkt|tmw|da\s+verificare|monitorare|sondaggio|offerta|richiest|piace|obiettivo|contatti|negoziat/i.test(text);
  }
  function hasRumorNote(note) {
    const text = noteText(note);
    if (!text || neutralMarketText(text)) return false;
    return isRumorMarket(text);
  }
  function marketBadgeInfo(player) {
    const notes = marketNotesFor(player);
    const signalText = marketSignalText(player);
    const detailText = neutralMarketText(player?.marketDetail) ? '' : String(player?.marketDetail || '');
    const combinedOfficialText = `${signalText} ${detailText}`;
    const notesText = notes.map(noteText).filter(Boolean).join(' | ');
    if (player?.newAcquisition || isOfficialNewMarket(combinedOfficialText) || notes.some((n) => isOfficialNewMarket(noteText(n)))) {
      const note = notes.find((n) => isOfficialNewMarket(noteText(n)));
      return { label: 'NUOVO', cls: 'is-new', title: note?.note || player?.marketDetail || player?.flag || 'Nuovo acquisto ufficiale' };
    }
    if (isRumorMarket(`${signalText} ${detailText}`) || notes.some(hasRumorNote)) {
      const note = notes.find(hasRumorNote);
      return { label: 'RUMOR', cls: 'is-rumor', title: note?.note || player?.marketDetail || notesText || 'Segnalazione di mercato' };
    }
    return { label: 'CONFERMATO', cls: 'is-confirmed', title: 'Giocatore confermato: nessuna segnalazione mercato collegata.' };
  }
  function renderMarketSignal(player) {
    const badge = marketBadgeInfo(player);
    return `<span class="sudatori-market-flag-v628 ${badge.cls}" title="${escapeHtml(badge.title)}">${escapeHtml(badge.label)}</span>`;
  }

  function renderKpis(data) {
    return `<div class="sudatori-kpis-v628" aria-label="Indicatori Sudatori"><div class="sudatori-kpi-v628"><span>Squadre Serie A</span><strong>${escapeHtml(data.meta?.teams || data.teams?.length || '-')}</strong></div><div class="sudatori-kpi-v628"><span>Giocatori monitorati</span><strong>${escapeHtml(data.meta?.players || '-')}</strong></div><div class="sudatori-kpi-v628"><span>Amichevoli</span><strong>${escapeHtml(data.meta?.friendlies || '-')}</strong></div><div class="sudatori-kpi-v628"><span>Note mercato</span><strong>${escapeHtml(data.meta?.marketNotes || '0')}</strong></div><div class="sudatori-kpi-v628"><span>Trattative squadre</span><strong>${escapeHtml(data.meta?.teamTransferTalks || '0')}</strong></div><div class="sudatori-kpi-v628"><span>Infortunati / SOS</span><strong>${escapeHtml(data.meta?.injuries || '0')}</strong></div><div class="sudatori-kpi-v628"><span>Moduli allineati</span><strong>${escapeHtml(data.meta?.formationTeams || '0')}</strong></div></div>`;
  }
  function renderToolbar(data) {
    const options = data.teams.map((t) => `<option value="${escapeHtml(t.id)}" ${t.id === state.selectedTeamId ? 'selected' : ''}>${escapeHtml(t.name)}</option>`).join('');
    return `<div class="sudatori-toolbar-v628"><input class="input" type="search" data-sudatori-search placeholder="Cerca squadra o giocatore..." value="${escapeHtml(state.search)}" /><select class="input" data-sudatori-team-select aria-label="Squadra Serie A">${options}</select><button class="button button-secondary" type="button" data-sudatori-reset>Mostra tutto</button></div>`;
  }
  function renderTeamCards(data) {
    const q = normalize(state.search);
    const teams = data.teams.filter((t) => !q || normalize(`${t.name} ${t.coach} ${t.module}`).includes(q) || getPlayers(t.id).some((p) => normalize(p.playerName).includes(q)));
    if (!teams.length) return '<p class="muted">Nessuna squadra trovata.</p>';
    return `<div id="sudatoriTeamsV628" class="sudatori-grid-v628">${teams.map((t) => {
      const players = getPlayers(t.id).slice(0, 10);
      return `<button class="sudatori-team-card-v628 ${t.id === state.selectedTeamId ? 'is-selected' : ''}" type="button" data-sudatori-team="${escapeHtml(t.id)}"><div class="sudatori-team-card-head-v628"><h3>${escapeHtml(t.name)}</h3><span class="sudatori-badge-v628">${escapeHtml(t.abbr || t.playersCount || '')}</span></div><div class="sudatori-card-meta-v628"><span>Allenatore<br><strong>${escapeHtml(t.coach || '-')}</strong></span><span>Modulo<br><strong>${escapeHtml(t.formationModule || t.module || '-')}</strong></span><span>Ritiro<br><strong>${escapeHtml(t.retreatPlace || 'Da confermare')}</strong></span><span>Amichevoli<br><strong>${escapeHtml(t.friendliesCount || getFriendlies(t.id).length || 0)}</strong></span><span>Trattative<br><strong>${escapeHtml(t.transferTalksCount || getTransferTalks(t.id).length || 0)}</strong></span><span>SOS Fisico<br><strong>${escapeHtml(t.injuriesCount || getInjuries(t.id).length || 0)}</strong></span></div><div class="sudatori-roster-preview-v628" aria-label="Anteprima rosa">${players.map((p) => `<span class="sudatori-chip-v628" data-role="${escapeHtml(p.role)}">${escapeHtml(p.role || '-')} · ${escapeHtml(p.playerName)}</span>`).join('')}${getPlayers(t.id).length > players.length ? `<span class="sudatori-chip-v628">+${getPlayers(t.id).length - players.length}</span>` : ''}</div></button>`;
    }).join('')}</div>`;
  }

  function hasPhysicalSignal(text) {
    const value = String(text || '').trim();
    if (!value) return false;
    if (/^OK\b/i.test(value)) return false;
    if (/disponibil/i.test(value) && /nessuna\s+segnalaz/i.test(value)) return false;
    if (/nessuna\s+segnalaz/i.test(value)) return false;
    return true;
  }
  function physicalBadgeFromText(text) {
    const value = String(text || '').trim();
    if (!value || /^OK\b/i.test(value)) return '<span class="sudatori-physical-v628">OK</span>';
    const cls = /infortun|stop|operat|out|salta/i.test(value) ? 'is-out' : 'is-risk';
    return `<span class="sudatori-physical-v628 ${cls}">${escapeHtml(value)}</span>`;
  }
  function physicalPitchBadgeFromText(text) {
    const value = String(text || '').trim();
    if (!hasPhysicalSignal(value)) return '';
    return `<span class="sudatori-physical-v628 is-field-alert">${escapeHtml(value)}</span>`;
  }
  function pitchSideRank(position, slot) {
    const pos = String(position || '').trim().toUpperCase();
    const fallback = Number.isFinite(Number(slot)) ? Number(slot) / 100 : 0;
    const left = new Set(['DS', 'DCS', 'ES', 'CS', 'AS']);
    const right = new Set(['DD', 'DCD', 'ED', 'CD', 'AD']);
    if (left.has(pos)) return 10 + fallback;
    if (right.has(pos)) return 90 + fallback;
    return 50 + fallback;
  }
  function sortPitchLine(items) {
    return (items || []).slice().sort((a, b) => {
      const rank = pitchSideRank(a.position, a.formationSlot) - pitchSideRank(b.position, b.formationSlot);
      if (rank) return rank;
      return Number(a.formationSlot ?? 99) - Number(b.formationSlot ?? 99);
    });
  }
  function lineFromPosition(position, role) {
    const pos = normalize(position).toUpperCase();
    const r = String(role || '').toUpperCase();
    if (pos === 'P' || pos === 'POR' || r === 'P') return 'goalkeeper';
    if (/^(DD|DC|DS|DCD|DCS)$/.test(pos)) return 'defense';
    if (/^(CD|CS|CC|MED|M|C|ED|ES)$/.test(pos)) return 'midfield';
    if (/^(TQ|T|W|SP)$/.test(pos)) return 'attackingMidfield';
    if (/^(AD|AS|PC|A)$/.test(pos) || r === 'A') return 'attack';
    if (r === 'D') return 'defense';
    if (r === 'C') return 'midfield';
    return 'bench';
  }
  function renderPitch(team) {
    const formation = getFormation(team.id).slice().sort((a, b) => Number(a.formationSlot ?? 99) - Number(b.formationSlot ?? 99));
    const xi = formation.length ? formation : getPlayers(team.id).filter((p) => p.probableXi || p.formationPosition).map((p, index) => ({ playerName: p.playerName, playerId: p.id, position: p.formationPosition || p.role, formationLine: p.formationLine || lineFromPosition(p.formationPosition, p.role), formationSlot: p.formationSlot ?? index, inCurrentRoster: 'SI', marketStatus: p.marketStatus, physicalStatus: p.formationPhysicalStatus || p.physicalStatus, physicalRisk: p.formationPhysicalRisk, moduleUsed: p.module || team.formationModule || team.module, moduleSourceUsed: p.module || team.module }));
    if (!xi.length) return '<div class="sudatori-pitch-empty-v628">Probabile formazione non disponibile per questa squadra.</div>';
    const groups = { attack: [], attackingMidfield: [], midfield: [], defense: [], goalkeeper: [], bench: [] };
    xi.forEach((p) => groups[p.formationLine || lineFromPosition(p.position, '') || 'bench'].push(p));
    const renderPlayer = (p) => {
      const rosterPlayer = p.playerId ? getPlayers(team.id).find((x) => x.id === p.playerId) : null;
      const lp = rosterPlayer ? listoneFor(rosterPlayer) : null;
      const fantasyRoster = fantasyRosterLabel(rosterPlayer, lp);
      const sub = [p.position || rosterPlayer?.role || '-', fantasyRoster || (p.inCurrentRoster === 'NO' ? 'Non in rosa attuale' : 'Svincolati')].filter(Boolean).join(' · ');
      const body = `<strong>${escapeHtml(p.playerName)}</strong><small>${escapeHtml(sub)}</small>${physicalPitchBadgeFromText(p.physicalStatus)}`;
      if (p.playerId && rosterPlayer) return `<button class="sudatori-pitch-player-v628" type="button" data-sudatori-player="${escapeHtml(p.playerId)}" title="${escapeHtml(p.playerName)}">${body}</button>`;
      return `<span class="sudatori-pitch-player-v628 is-external" title="${escapeHtml(p.playerName)}">${body}</span>`;
    };
    const renderLine = (key, label) => groups[key].length ? `<div class="sudatori-pitch-line-v628 sudatori-pitch-line-${key}-v628" aria-label="${escapeHtml(label)}">${sortPitchLine(groups[key]).map(renderPlayer).join('')}</div>` : '';
    const adjusted = xi.some((p) => p.moduleAdjusted);
    const sourceUsed = xi.find((p) => p.moduleSourceUsed)?.moduleSourceUsed || '';
    const moduleNote = adjusted ? `<div class="sudatori-pitch-module-note-v628">Forma campetto allineata al modulo dichiarato ${escapeHtml(team.formationModule || team.module || '-')}; fonte formazione originale: ${escapeHtml(sourceUsed || '-')}.</div>` : '';
    return `<div class="sudatori-pitch-card-v628" aria-label="Probabile formazione ${escapeHtml(team.name)}"><div class="sudatori-pitch-head-v628"><div><h4>Probabile formazione</h4><p>${escapeHtml(team.formationModule || team.module || 'Modulo da confermare')} · ${escapeHtml(team.coach || '-')}</p>${moduleNote}</div><span>${escapeHtml(xi.length)} giocatori</span></div><div class="sudatori-pitch-v628"><div class="sudatori-pitch-marking sudatori-pitch-marking-center"></div><div class="sudatori-pitch-marking sudatori-pitch-marking-box-a"></div><div class="sudatori-pitch-marking sudatori-pitch-marking-box-b"></div>${renderLine('attack', 'Attacco')}${renderLine('attackingMidfield', 'Trequarti')}${renderLine('midfield', 'Centrocampo')}${renderLine('defense', 'Difesa')}${renderLine('goalkeeper', 'Portiere')}${renderLine('bench', 'Altri probabili')}</div></div>`;
  }

  function renderRosterTable(team) {
    const players = getPlayers(team.id).filter((p) => !state.search || normalize(p.playerName).includes(normalize(state.search)));
    if (!players.length) return '<p class="muted">Nessun giocatore disponibile per questa selezione.</p>';
    const rows = players.map((p) => {
      const lp = listoneFor(p);
      const fantasyRoster = fantasyRosterLabel(p, lp);
      const params = lp ? [lp.quotationCurrent != null ? `Qt ${lp.quotationCurrent}` : '', lp.fvm != null ? `FVM ${lp.fvm}` : '', lp.fantasyAverage != null ? `FM ${lp.fantasyAverage}` : lp.sourceExtra?.fantasyAverage ? `FM ${lp.sourceExtra.fantasyAverage}` : ''].filter(Boolean).join(' · ') : 'Non nel listone';
      const mercato = renderMarketSignal(p);
      const physicalText = p.physicalStatus || p.formationPhysicalStatus || 'OK';
      const physical = physicalBadgeFromText(physicalText);
      const injury = p.injuryReturn ? `<small>${escapeHtml(p.injuryReturn)}</small>` : '';
      return `<tr data-role="${escapeHtml(p.role || '')}"><td><button type="button" class="sudatori-player-button-v628" data-sudatori-player="${escapeHtml(p.id)}">${escapeHtml(p.playerName)}</button></td><td><span class="sudatori-role-v628" data-role="${escapeHtml(p.role || '')}">${escapeHtml(p.role || '-')}</span></td><td>${escapeHtml(fantasyRoster)}</td><td>${escapeHtml(params || '-')}</td><td>${mercato}</td><td>${physical}${injury}</td></tr>`;
    }).join('');
    return `<div class="sudatori-table-wrap-v628"><table class="sudatori-table-v628"><thead><tr><th>Giocatore</th><th>Ruolo</th><th>Rosa fantacalcio</th><th>Parametri listone</th><th>Mercato</th><th>Stato fisico</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }



  function itemArticleUrlV628(item) {
    return (item && (item.articleUrl || item.preciseArticleUrl || item.url || item.source || item.href)) || '';
  }

  function itemSourceLabelV628(item, fallback) {
    return (item && (item.sourceName || item.sourceLabel || item.sourceType)) || fallback || 'Fonte';
  }

  function renderInjuries(team) {
    const injuries = getInjuries(team.id);
    if (!injuries.length) {
      return '<section class="sudatori-injuries-v628" aria-labelledby="sudatoriInjuriesTitleV628"><header><div><h4 id="sudatoriInjuriesTitleV628">Infortunati / SOS Fanta</h4><p>Nessuna segnalazione fisica SOS Fanta nel file caricato.</p></div></header></section>';
    }
    const cards = injuries.map((item) => {
      const badge = physicalBadgeFromText(item.status);
      const injuryHref = itemArticleUrlV628(item);
      const source = injuryHref ? `<a href="${escapeHtml(injuryHref)}" target="_blank" rel="noopener">${escapeHtml(itemSourceLabelV628(item, 'Articolo SOS Fanta'))}</a>` : 'Fonte non indicata';
      const body = `<div class="sudatori-injury-head-v628"><strong>${escapeHtml(item.playerName || '-')}</strong>${badge}</div><p>${escapeHtml(item.injury || 'Dettaglio non indicato')}</p><small>Rientro: ${escapeHtml(item.potentialReturn || 'Da valutare')} · Impatto asta: ${escapeHtml(item.auctionImpact || '-')} · ${source}</small>${item.note ? `<div class="sudatori-injury-note-v628">${escapeHtml(item.note)}</div>` : ''}`;
      if (item.playerId) return `<article class="sudatori-injury-card-v628"><button type="button" class="sudatori-player-button-v628" data-sudatori-player="${escapeHtml(item.playerId)}">${body}</button></article>`;
      return `<article class="sudatori-injury-card-v628">${body}</article>`;
    }).join('');
    return `<section class="sudatori-injuries-v628" aria-labelledby="sudatoriInjuriesTitleV628"><header><div><h4 id="sudatoriInjuriesTitleV628">Infortunati / SOS Fanta ${escapeHtml(team.name)}</h4><p>Entità, rientri e note operative per asta/gestione.</p></div><span class="sudatori-badge-v628">${escapeHtml(injuries.length)} segnalazioni</span></header><div class="sudatori-injury-grid-v628">${cards}</div></section>`;
  }


  function renderMarketMiniItem(item, kind) {
    const name = item.playerName || item.target || '-';
    const role = item.roleBrief || item.role || '-';
    const origin = item.origin || item.formula || item.status || '';
    const itemHref = itemArticleUrlV628(item);
    const source = itemHref ? `<a href="${escapeHtml(itemHref)}" target="_blank" rel="noopener">${escapeHtml(itemSourceLabelV628(item, 'Articolo'))}</a>` : '';
    const status = item.status ? `<span>${escapeHtml(item.status)}</span>` : '';
    const date = item.updatedAt ? `<span>${escapeHtml(formatDate(item.updatedAt))}</span>` : '';
    return `<li class="sudatori-market-summary-item-v628" data-kind="${escapeHtml(kind)}"><strong>${escapeHtml(name)}</strong><small>${escapeHtml(role)}${origin ? ` · ${escapeHtml(origin)}` : ''}</small><span class="sudatori-market-summary-meta-v628">${status}${date}${source}</span></li>`;
  }

  function renderMarketSummaryList(title, items, kind) {
    const safeItems = items || [];
    const body = safeItems.length ? `<ul>${safeItems.slice(0, 8).map((item) => renderMarketMiniItem(item, kind)).join('')}</ul>${safeItems.length > 8 ? `<div class="sudatori-market-summary-more-v628">+${escapeHtml(safeItems.length - 8)} altri nomi nel file</div>` : ''}` : '<p class="muted">Nessun nome nel file.</p>';
    return `<article class="sudatori-market-summary-block-v628" data-kind="${escapeHtml(kind)}"><h5>${escapeHtml(title)} <span>${escapeHtml(safeItems.length)}</span></h5>${body}</article>`;
  }

  function renderMarketOverview(team) {
    const summary = getMarketSummary(team.id);
    return `<section class="sudatori-market-overview-v628" aria-labelledby="sudatoriMarketOverviewTitleV628"><header><div><h4 id="sudatoriMarketOverviewTitleV628">Riepilogo mercato ${escapeHtml(team.name)}</h4><p>Ufficialità e trattative separate fra entrata e uscita.</p></div></header><div class="sudatori-market-summary-grid-v628">${renderMarketSummaryList('Ufficialità in entrata', summary.officialIncoming, 'official-in')}${renderMarketSummaryList('Ufficialità in uscita', summary.officialOutgoing, 'official-out')}${renderMarketSummaryList('Trattative in entrata', summary.talksIncoming, 'talk-in')}${renderMarketSummaryList('Trattative in uscita', summary.talksOutgoing, 'talk-out')}</div></section>`;
  }

  function renderTransferTalks(team) {
    const talks = getTransferTalks(team.id);
    if (!talks.length) {
      return '<section class="sudatori-transfer-talks-v628" aria-labelledby="sudatoriTalksTitleV628"><header><div><h4 id="sudatoriTalksTitleV628">Trattative in corso</h4><p>Nessuna trattativa in corso disponibile nel file caricato.</p></div></header></section>';
    }
    const cards = talks.map((talk) => {
      const sources = Array.isArray(talk.sources) && talk.sources.length ? talk.sources : [{ source: talk.source, status: talk.status, updatedAt: talk.updatedAt, note: talk.note, sourceName: 'Fonte' }];
      const sourceLinks = sources.slice(0, 4).map((src, index) => {
        const label = src.sourceName || src.status || `Fonte ${index + 1}`;
        const srcHref = itemArticleUrlV628(src);
        const href = srcHref ? `<a href="${escapeHtml(srcHref)}" target="_blank" rel="noopener">${escapeHtml(label)}</a>` : escapeHtml(label);
        const date = src.updatedAt ? ` · ${escapeHtml(formatDate(src.updatedAt))}` : '';
        const probability = src.probability ? ` · ${escapeHtml(src.probability)}` : '';
        return `<li>${href}${date}${probability}</li>`;
      }).join('');
      const noteText = sources.map((src) => src.note || src.status || '').filter(Boolean).slice(0, 3).join(' | ');
      const direction = talk.directionLabel || (talk.direction === 'outgoing' ? 'Uscita' : 'Entrata');
      return `<article class="sudatori-transfer-card-v628" data-role="${escapeHtml(talk.roleBrief || '')}"><div class="sudatori-transfer-head-v628"><span class="sudatori-role-v628" data-role="${escapeHtml(talk.roleBrief || '')}">${escapeHtml(talk.roleBrief || '-')}</span><strong>${escapeHtml(talk.target || '-')}</strong></div><p><span class="sudatori-transfer-direction-v628">${escapeHtml(direction)}</span> · ${escapeHtml(talk.role || 'Ruolo non indicato')}${talk.origin ? ` · ${escapeHtml(talk.origin)}` : ''}</p><small>${escapeHtml(talk.reliability || 'Affidabilità non indicata')}${talk.updatedAt ? ` · ${escapeHtml(formatDate(talk.updatedAt))}` : ''} · ${escapeHtml(sources.length)} fonti/notizie</small>${sourceLinks ? `<ul class="sudatori-transfer-sources-v628">${sourceLinks}</ul>` : ''}${noteText ? `<div class="sudatori-transfer-note-v628">${escapeHtml(noteText)}</div>` : ''}</article>`;
    }).join('');
    return `<section class="sudatori-transfer-talks-v628" aria-labelledby="sudatoriTalksTitleV628"><header><div><h4 id="sudatoriTalksTitleV628">Trattative in corso ${escapeHtml(team.name)}</h4><p>Una sola card per giocatore; eventuali fonti multiple sono aggregate nella stessa scheda. Le ufficialità non vengono mostrate qui.</p></div><span class="sudatori-badge-v628">${escapeHtml(talks.length)} nomi</span></header><div class="sudatori-transfer-grid-v628">${cards}</div></section>`;
  }

  function renderFriendlies(team) {
    const items = getFriendlies(team.id);
    if (!items.length) return '<div class="sudatori-friendlies-v628"><p class="muted">Nessuna amichevole disponibile.</p></div>';
    return `<div id="sudatoriFriendliesV628" class="sudatori-friendlies-v628">${items.map((f) => `<div class="sudatori-friendly-v628"><strong>${escapeHtml(f.event || '-')}</strong><small>${escapeHtml(formatDate(f.date) || 'Data da definire')}${f.time ? ` · ${escapeHtml(f.time)}` : ''}${f.venue ? ` · ${escapeHtml(f.venue)}` : ''}</small><div>${escapeHtml(f.status || '')}</div></div>`).join('')}</div>`;
  }
  function renderPlayerPanel(player) {
    if (!player) return '<p class="muted">Seleziona un giocatore dalla rosa per vedere scheda, parametri, note mercato e stato fisico.</p>';
    const team = state.data.teams.find((t) => t.id === player.teamId) || {};
    const lp = listoneFor(player);
    const notes = marketNotesFor(player);
    const extra = lp || {};
    const url = buildFantacalcioUrl(lp, player.playerName);
    const fantasyRoster = fantasyRosterLabel(player, lp);
    const formationNote = player.formationPosition ? `<div class="sudatori-note-v628"><strong>Probabile formazione:</strong><br>${escapeHtml(player.formationPosition)} nel ${escapeHtml(player.module || team.formationModule || team.module || '-')} · affidabilità ${escapeHtml(player.formationReliability || '-')}<br>${escapeHtml(player.formationNote || '')}</div>` : '';
    const injuryNote = player.sosFantaFlag ? `<div class="sudatori-note-v628"><strong>Stato fisico SOS Fanta:</strong><br>${physicalBadgeFromText(player.physicalStatus || player.injuryStatus)} ${escapeHtml(player.injuryDetail || '')}<br><strong>Rientro:</strong> ${escapeHtml(player.injuryReturn || 'Da valutare')} · <strong>Impatto asta:</strong> ${escapeHtml(player.injuryImpact || '-')}<br>${player.injurySource ? `<a href="${escapeHtml(player.injurySource)}" target="_blank" rel="noopener">Articolo SOS Fanta</a>` : ''}${player.injuryNote ? `<div class="sudatori-injury-note-v628">${escapeHtml(player.injuryNote)}</div>` : ''}</div>` : (player.formationPhysicalStatus && !/^OK\b/i.test(player.formationPhysicalStatus) ? `<div class="sudatori-note-v628"><strong>Monitoraggio fisico formazione:</strong><br>${physicalBadgeFromText(player.formationPhysicalStatus)} ${escapeHtml(player.formationPotentialReturn || '')}${player.formationSosSource ? `<br><a href="${escapeHtml(player.formationSosSource)}" target="_blank" rel="noopener">Articolo SOS Fanta</a>` : ''}</div>` : '');
    return `<div class="sudatori-player-body-v628"><div><p class="eyebrow">Scheda giocatore</p><h3>${escapeHtml(player.playerName)}</h3><p>${escapeHtml(player.role || '-')} · ${escapeHtml(player.teamName || '-')} · Rosa fantacalcio: <strong>${escapeHtml(fantasyRoster)}</strong></p><p>${escapeHtml(team.coach || '-')} · ${escapeHtml(team.formationModule || team.module || '-')}</p></div><div class="sudatori-param-grid-v628"><div class="sudatori-param-v628"><span>Qt.A</span><strong>${escapeHtml(extra.quotationCurrent ?? '-')}</strong></div><div class="sudatori-param-v628"><span>FVM</span><strong>${escapeHtml(extra.fvm ?? '-')}</strong></div><div class="sudatori-param-v628"><span>Media</span><strong>${escapeHtml(extra.average ?? extra.sourceExtra?.average ?? '-')}</strong></div><div class="sudatori-param-v628"><span>Fantamedia</span><strong>${escapeHtml(extra.fantasyAverage ?? extra.sourceExtra?.fantasyAverage ?? '-')}</strong></div><div class="sudatori-param-v628"><span>Presenze</span><strong>${escapeHtml(extra.played ?? extra.sourceExtra?.played ?? '-')}</strong></div><div class="sudatori-param-v628"><span>Stato listone</span><strong>${escapeHtml(extra.status || 'Non trovato')}</strong></div></div>${url ? `<a class="button button-primary" href="${escapeHtml(url)}" target="_blank" rel="noopener">Apri scheda Fantacalcio.it</a>` : '<div class="sudatori-note-v628">Link Fantacalcio.it non disponibile: manca id nel listone.</div>'}${injuryNote}<div class="sudatori-note-v628"><strong>Mercato:</strong><br>${escapeHtml(player.marketStatus || 'In rosa')} · ${escapeHtml(player.marketDetail || 'Nessuna segnalazione mercato rilevante nelle fonti consultate.')} ${player.marketSource ? `<br><a href="${escapeHtml(player.marketSource)}" target="_blank" rel="noopener">Articolo mercato</a>` : ''}</div>${formationNote}<div class="sudatori-note-v628"><strong>Nota rosa:</strong><br>${escapeHtml(player.note || 'Nessuna nota specifica disponibile.')}</div><div><h4>Mercato / rapporti / contesto</h4>${notes.length ? notes.map((n) => `<div class="sudatori-market-note-v628"><strong>${escapeHtml(n.type || n.status || 'Nota mercato')}</strong><p>${escapeHtml(n.note || n.status || 'Aggiornamento disponibile.')}</p><small>${escapeHtml(n.team || '')}${itemArticleUrlV628(n) ? ` · <a href="${escapeHtml(itemArticleUrlV628(n))}" target="_blank" rel="noopener">${escapeHtml(itemSourceLabelV628(n, 'Articolo'))}</a>` : ''}</small></div>`).join('') : '<p class="muted">Nessuna informazione mercato/rapporti disponibile nel file caricato.</p>'}</div><div><h4>Amichevoli squadra</h4>${getFriendlies(player.teamId).slice(0, 5).map((f) => `<div class="sudatori-friendly-v628"><strong>${escapeHtml(f.event)}</strong><small>${escapeHtml(formatDate(f.date) || 'Data da definire')}${f.time ? ` · ${escapeHtml(f.time)}` : ''}</small></div>`).join('') || '<p class="muted">Nessuna amichevole disponibile.</p>'}</div><div class="sudatori-sources-v628"><strong>Fonte rosa:</strong> ${player.rosterSource ? `<a href="${escapeHtml(player.rosterSource)}" target="_blank" rel="noopener">Transfermarkt / fonte rosa</a>` : 'non indicata'}</div></div>`;
  }


  function renderSources(data) {
    const sources = (data.sources || []).slice(0, 9);
    if (!sources.length) return '';
    return `<details class="sudatori-sources-v628"><summary>Fonti dati</summary><ul>${sources.map((s) => `<li>${s.url ? `<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener">${escapeHtml(s.name || s.url)}</a>` : escapeHtml(s.name || '-') } <span>${escapeHtml(s.use || '')}</span></li>`).join('')}</ul></details>`;
  }
  function render() {
    const section = ensureSection();
    const data = state.data;
    if (!data) return;
    const team = getTeamById(state.selectedTeamId) || data.teams?.[0];
    if (!team) return;
    section.innerHTML = `<section class="panel sudatori-shell-v628"><div class="sudatori-hero-v628"><div><p class="eyebrow">Sezione standalone · ${escapeHtml(data.meta?.version || VERSION)}</p><h2 id="sudatoriTitleV628">Per i SUDATORI</h2><p>Rose del campionato, schede giocatore, parametri dal listone, mercato, trattative, infortunati SOS Fanta, allenatori, moduli, ritiri e amichevoli.</p><small class="muted">Aggiornato al ${escapeHtml(formatDate(data.meta?.updatedAt))} · fonte: ${escapeHtml(data.meta?.sourceFile || '-')}</small></div><div class="sudatori-hero-actions-v628"><button class="button button-primary" type="button" data-sudatori-scroll="teams">Rose campionato</button><button class="button button-secondary" type="button" data-sudatori-scroll="injuries">Infortunati</button><button class="button button-secondary" type="button" data-sudatori-scroll="talks">Trattative</button><button class="button button-secondary" type="button" data-sudatori-scroll="friendlies">Amichevoli</button></div></div>${renderKpis(data)}${renderToolbar(data)}<section aria-labelledby="sudatoriRoseCampionatoTitleV628"><h3 id="sudatoriRoseCampionatoTitleV628">Card rose del campionato</h3><p class="muted">Ogni card mostra allenatore, modulo, ritiro, numero amichevoli e anteprima rosa.</p>${renderTeamCards(data)}</section><div class="sudatori-layout-v628"><section class="sudatori-section-card-v628" aria-labelledby="sudatoriRosterTitleV628"><header><div><h3 id="sudatoriRosterTitleV628">Rosa ${escapeHtml(team.name)}</h3><p>${escapeHtml(team.coach || '-')} · ${escapeHtml(team.formationModule || team.module || '-')}</p></div><span class="sudatori-badge-v628">${escapeHtml(getPlayers(team.id).length)} giocatori</span></header>${renderRosterTable(team)}${renderPitch(team)}${renderInjuries(team)}${renderMarketOverview(team)}${renderTransferTalks(team)}</section><section class="sudatori-section-card-v628 sudatori-player-panel-v628" aria-labelledby="sudatoriPlayerTitleV628"><header><div><h3 id="sudatoriPlayerTitleV628">Scheda giocatore</h3><p>Parametri e contesto dal file Sudatori + listone.</p></div></header>${renderPlayerPanel(state.selectedPlayer)}</section></div><section class="sudatori-section-card-v628" aria-labelledby="sudatoriFriendliesTitleV628" style="margin-top:1rem;"><header><div><h3 id="sudatoriFriendliesTitleV628">Ritiri e amichevoli ${escapeHtml(team.name)}</h3><p>${escapeHtml(team.retreatPlace || 'Ritiro da confermare')} ${team.retreatStart ? `· ${escapeHtml(formatDate(team.retreatStart))}` : ''}</p></div><span class="sudatori-badge-v628">${escapeHtml(getFriendlies(team.id).length)} eventi</span></header>${renderFriendlies(team)}</section>${renderSources(data)}</section>`;
    bindSectionEvents(section);
  }
  function bindSectionEvents(section) {
    section.querySelector('[data-sudatori-search]')?.addEventListener('input', (event) => { state.search = event.target.value || ''; render(); });
    section.querySelector('[data-sudatori-team-select]')?.addEventListener('change', (event) => { state.selectedTeamId = event.target.value || state.selectedTeamId; state.selectedPlayer = null; render(); });
    section.querySelector('[data-sudatori-reset]')?.addEventListener('click', () => { state.search = ''; render(); });
    section.querySelectorAll('[data-sudatori-team]').forEach((card) => card.addEventListener('click', () => { state.selectedTeamId = card.dataset.sudatoriTeam || state.selectedTeamId; state.selectedPlayer = null; render(); section.querySelector('#sudatoriRosterTitleV628')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
    section.querySelectorAll('[data-sudatori-player]').forEach((button) => button.addEventListener('click', () => { const id = button.dataset.sudatoriPlayer; state.selectedPlayer = getPlayers(state.selectedTeamId).find((p) => p.id === id) || null; render(); section.querySelector('#sudatoriPlayerTitleV628')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
    section.querySelectorAll('[data-sudatori-scroll]').forEach((button) => button.addEventListener('click', () => { const target = button.dataset.sudatoriScroll === 'friendlies' ? '#sudatoriFriendliesTitleV628' : (button.dataset.sudatoriScroll === 'injuries' ? '#sudatoriInjuriesTitleV628' : (button.dataset.sudatoriScroll === 'talks' ? '#sudatoriTalksTitleV628' : '#sudatoriTeamsV628'));  section.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
  }
  async function activateSudatori() {
    ensureNav(); ensureSection(); setActivePage(PAGE);
    try { await loadData(); render(); }
    catch (err) { console.error('[Sudatori V628] Errore caricamento', err); const status = ensureSection().querySelector('[data-sudatori-status]'); if (status) status.innerHTML = `<div class="notice notice-error">Errore caricamento sezione Sudatori: ${escapeHtml(err.message || err)}</div>`; }
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
  window.FantaSudatoriV628 = { activate: activateSudatori, reload: () => { state.loaded = false; state.data = null; return activateSudatori(); } };
})();
