(function () {
  'use strict';

  const DATA_ROOT = '/fanta-engine/data/sudatori/current/';

  function sudatoriDataFileFromManifest(manifest) {
    const candidates = [manifest && manifest.dataFile, manifest && manifest.file, manifest && manifest.currentFile, manifest && manifest.current];
    const file = candidates.find((value) => typeof value === 'string' && value.trim());
    return file || 'sudatori-data.json';
  }
  const LISTONE_ROOT = '/fanta-engine/data/shared-assets/current/assets/listoni/';
  const LEAGUES = {
    zonaorientale: { name: 'Zona Orientale', href: '../zonaorientale/' },
    fantapetillomantramanager: { name: 'Fanta Petillo Mantra Manager', href: '../fantapetillomantramanager/' }
  };
  const state = {
    manifest: null,
    data: null,
    allPlayers: [],
    query: '',
    filter: 'all',
    quickView: 'teams',
    activeTeamId: '',
    activePlayerId: '',
    activeFriendlyKey: '',
    friendlyReturnContext: null,
    activeTab: 'xi',
    liveRoster: { loaded: false, active: false, entries: 0, matched: 0, map: new Map(), globalMap: new Map(), source: '' },
    latestListone: { loaded: false, active: false, entries: 0, map: new Map(), globalMap: new Map(), players: [], source: '', label: '' },
    virtualPlayers: new Map(),
    playerRowsCache: { dirty: true, rows: [] },
    fastPlayerRowsCache: { dirty: true, rows: [] },
    globalRowsCache: { rumor: null, official: null, sos: null, friendlies: null },
    playerDetailCache: new Map(),
    playerMarketRowsCache: new Map(),
    visibleCaps: { players: 36, rumor: 40, official: 40, sos: 80, friendlies: 80 },
    renderTimer: 0
  };

  const els = {};
  let deferredInstallPrompt = null;

  function $(id) { return document.getElementById(id); }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function norm(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  const TEAM_ALIAS_V640 = new Map([
    ['atalanta','ata'],['ata','ata'],['bologna','bol'],['bol','bol'],['cagliari','cag'],['cag','cag'],['como','com'],['com','com'],['cremonese','cre'],['cre','cre'],['fiorentina','fio'],['fio','fio'],['frosinone','fro'],['fro','fro'],['genoa','gen'],['gen','gen'],['inter','int'],['internazionale','int'],['int','int'],['juventus','juv'],['juve','juv'],['juv','juv'],['lazio','laz'],['laz','laz'],['lecce','lec'],['lec','lec'],['milan','mil'],['ac milan','mil'],['mil','mil'],['monza','mon'],['mon','mon'],['napoli','nap'],['nap','nap'],['parma','par'],['par','par'],['pisa','pis'],['pis','pis'],['roma','rom'],['rom','rom'],['sassuolo','sas'],['sas','sas'],['torino','tor'],['tor','tor'],['udinese','udi'],['udi','udi'],['venezia','ven'],['ven','ven'],['verona','ver'],['hellas verona','ver'],['ver','ver']
  ]);

  function teamKey(value) {
    const key = norm(value);
    return TEAM_ALIAS_V640.get(key) || key;
  }

  const NAME_ALIAS_V640 = new Map([ // V725_THURAM_NOTE: Thuram generico resta ambiguo; M. Thuram=Marcus Thuram, K. Thuram=Khephren Thuram già gestito.
    ['kilicksoy', 'kilicsoy'],
    ['kilicsoy', 'kilicsoy'],
    ['brooke norton cuffy', 'norton cuffy'],
    ['norton cuffy', 'norton cuffy'],
    ['n dicka', 'ndicka'],
    ['ndicka', 'ndicka'],
    ['j martinez', 'martinez jo'],
    ['jo martinez', 'martinez jo'],
    ['martinez jo', 'martinez jo'],
    ['jeremie boga', 'boga'],
    ['boga', 'boga'],
    ['rafik belghali', 'belghali'],
    ['belghali', 'belghali'],
    ['lorenzo pellegrini', 'pellegrini lo'],
    ['pellegrini lo', 'pellegrini lo'],
    ['alisson santos', 'santos a'],
    ['santos a', 'santos a'],
    ['lo colombo', 'colombo'],
    ['lorenzo colombo', 'colombo'],
    ['zambo anguissa', 'anguissa'],
    ['anguissa', 'anguissa'],
    ['jonathan david', 'david'],
    ['david', 'david'],
    ['evan ferguson', 'ferguson e'],
    ['ferguson e', 'ferguson e'],
    ['ivan provedel', 'provedel'],
    ['provedel', 'provedel'],
    ['tramoni m', 'tramoni m'],
    ['matteo tramoni', 'tramoni m'],
    ['bonazzoli', 'bonazzoli'],
    ['federico bonazzoli', 'bonazzoli'],
    ['k thuram', 'khephren thuram'],
    ['thuram k', 'khephren thuram'],
    ['khephren thuram', 'khephren thuram'],
    ['n gonzalez', 'nico gonzalez'],
    ['gonzalez n', 'nico gonzalez'],
    ['nico gonzalez', 'nico gonzalez'],
    ['trevoh chalobah', 'trevoh chalobah'],
    ['chalobah', 'trevoh chalobah'],
    ['oulai', 'christ inao oulai'],
    ['christ inao oulai', 'christ inao oulai'],
    ['cheddira', 'walid cheddira'],
    ['walid cheddira', 'walid cheddira'],
    ['gallo', 'antonino gallo'],
    ['antonino gallo', 'antonino gallo'],
    ['nicolussi caviglia', 'hans nicolussi caviglia'],
    ['hans nicolussi caviglia', 'hans nicolussi caviglia'],
    ['y fofana', 'youssouf fofana'],
    ['fofana y', 'youssouf fofana'],
    ['youssouf fofana', 'youssouf fofana'],
    ['d berardi', 'domenico berardi'],
    ['berardi d', 'domenico berardi'],
    ['domenico berardi', 'domenico berardi'],
    ['m kone', 'manu kone'],
    ['kone m', 'manu kone'],
    ['manu kone', 'manu kone'],
    ['l moro', 'luca moro'],
    ['moro l', 'luca moro'],
    ['luca moro', 'luca moro'],
    ['vojvoda', 'mergim vojvoda'],
    ['mergim vojvoda', 'mergim vojvoda'],
    ['zaniolo', 'nicolo zaniolo'],
    ['nicolo zaniolo', 'nicolo zaniolo'],
    ['celik', 'zeki celik'],
    ['zeki celik', 'zeki celik'],
    ['valdepenas', 'victor valdepenas'],
    ['victor valdepenas', 'victor valdepenas'],
    ['soule', 'matias soule'],
    ['matias soule', 'matias soule'],
    ['pinamonti', 'andrea pinamonti'],
    ['andrea pinamonti', 'andrea pinamonti'],
    ['pulisic', 'christian pulisic'],
    ['christian pulisic', 'christian pulisic'],
    ['ricci', 'samuele ricci'],
    ['samuele ricci', 'samuele ricci'],
    ['rabiot', 'adrien rabiot'],
    ['adrien rabiot', 'adrien rabiot'],
    ['tomori', 'fikayo tomori'],
    ['fikayo tomori', 'fikayo tomori'],
    ['lucumi', 'jhon lucumi'],
    ['jhon lucumi', 'jhon lucumi'],
    ['jhon lucumì', 'jhon lucumi'],
    ['jhon lucumí', 'jhon lucumi'],
    ['de gea', 'david de gea'],
    ['david de gea', 'david de gea'],
    ['dossena', 'alberto dossena'],
    ['alberto dossena', 'alberto dossena'],
    ['bernabe', 'adrian bernabe'],
    ['bernabé', 'adrian bernabe'],
    ['adrian bernabe', 'adrian bernabe'],
    ['lauriente', 'armand lauriente'],
    ['laurienté', 'armand lauriente'],
    ['armand lauriente', 'armand lauriente'],
    ['armand laurienté', 'armand lauriente'],
    ['chakvetadze', 'giorgi chakvetadze'],
    ['giorgi chakvetadze', 'giorgi chakvetadze'],
    ['de silvestri', 'lorenzo de silvestri'],
    ['de silvestri*', 'lorenzo de silvestri'],
    ['lorenzo de silvestri', 'lorenzo de silvestri'],
    ['di gregorio', 'michele di gregorio'],
    ['michele di gregorio', 'michele di gregorio'],
    ['di lorenzo', 'giovanni di lorenzo'],
    ['giovanni di lorenzo', 'giovanni di lorenzo'],
    ['frattesi', 'davide frattesi'],
    ['davide frattesi', 'davide frattesi'],
    ['zemura', 'jordan zemura'],
    ['jordan zemura', 'jordan zemura'],
    ['suzuki', 'zion suzuki'],
    ['zion suzuki', 'zion suzuki'],
    ['zanaga', 'edoardo zanaga'],
    ['edoardo zanaga', 'edoardo zanaga'],
    ['sommer', 'yann sommer'],
    ['yann sommer', 'yann sommer'],
    ['massolin', 'yanis massolin'],
    ['yanis massolin', 'yanis massolin'],
    ['amey', 'wisdom amey'],
    ['wisdom amey', 'wisdom amey'],
    ['bondo', 'warren bondo'],
    ['warren bondo', 'warren bondo'],
    ['vlahovic', 'dusan vlahovic'],
    ['dusan vlahovic', 'dusan vlahovic'],
    ['milinkovic savic', 'vanja milinkovic savic'],
    ['vanja milinkovic savic', 'vanja milinkovic savic'],
    ['frendrup', 'morten frendrup'],
    ['morten frendrup', 'morten frendrup'],
    ['engelhardt', 'yannik engelhardt'],
    ['yannik engelhardt', 'yannik engelhardt'],
    ['ravanelli', 'luca ravanelli'],
    ['luca ravanelli', 'luca ravanelli'],
    ['lucca', 'lorenzo lucca'],
    ['lorenzo lucca', 'lorenzo lucca'],
    ['taremi', 'mehdi taremi'],
    ['mehdi taremi', 'mehdi taremi'],
    ['aebischer', 'michel aebischer'],
    ['michel aebischer', 'michel aebischer'],
    ['pobega', 'tommaso pobega'],
    ['tommaso pobega', 'tommaso pobega'],
    ['karlsson', 'jesper karlsson'],
    ['jesper karlsson', 'jesper karlsson'],
    ['mandragora', 'rolando mandragora'],
    ['rolando mandragora', 'rolando mandragora'],
    ['nzola', 'm bala nzola'],
    ['m bala nzola', 'm bala nzola'],
    ['caprile', 'elia caprile'],
    ['elia caprile', 'elia caprile'],
    ['s esposito', 'sebastiano esposito'],
    ['sebastiano esposito', 'sebastiano esposito'],
    ['f esposito', 'francesco pio esposito'],
    ['pio esposito', 'francesco pio esposito'],
    ['francesco pio esposito', 'francesco pio esposito'],
    ['a sala', 'alex sala'],
    ['alex sala', 'alex sala'],
    ['l berardi', 'lorenzo berardi'],
    ['lorenzo berardi', 'lorenzo berardi'],
    ['akarakiri', 'demi akarakiri'],
    ['demi akarakiri', 'demi akarakiri'],
    ['akinsanmiro', 'ebenezer akinsanmiro'],
    ['ebenezer akinsanmiro', 'ebenezer akinsanmiro'],
    ['arokodare', 'tolu arokodare'],
    ['tolu arokodare', 'tolu arokodare'],
    ['atta', 'arthur atta'],
    ['arthur atta', 'arthur atta'],
    ['balbo', 'luis balbo'],
    ['luis balbo', 'luis balbo'],
    ['baldanzi', 'tommaso baldanzi'],
    ['tommaso baldanzi', 'tommaso baldanzi'],
    ['basic', 'toma basic'],
    ['toma basic', 'toma basic'],
    ['boga', 'jeremie boga'],
    ['jeremie boga', 'jeremie boga'],
    ['oraolini', 'riccardo orsolini'],
    ['riccardo oraolini', 'riccardo orsolini'],
    ['orsolini', 'riccardo orsolini'],
    ['riccardo orsolini', 'riccardo orsolini'],

    ['cittadini', 'giorgio cittadini'],
    ['giorgio cittadini', 'giorgio cittadini'],
    ['gaetano', 'gianluca gaetano'],
    ['gianluca gaetano', 'gianluca gaetano'],
    ['maldini', 'daniel maldini'],
    ['daniel maldini', 'daniel maldini'],
    ['ravaglia', 'federico ravaglia'],
    ['federico ravaglia', 'federico ravaglia'],
    ['holm', 'emil holm'],
    ['emil holm', 'emil holm'],
    ['motolese', 'mattia motolese'],
    ['mattia motolese', 'mattia motolese'],
    ['stivanello', 'riccardo stivanello'],
    ['riccardo stivanello', 'riccardo stivanello'],
    ['menegazzo', 'lorenzo menegazzo'],
    ['lorenzo menegazzo', 'lorenzo menegazzo'],
    ['dominguez', 'sergi dominguez'],
    ['sergi dominguez', 'sergi dominguez'],

    ['lookman', 'ademola lookman'],
    ['ademola lookman', 'ademola lookman'],
    ['castellanos', 'valentin castellanos'],
    ['valentin castellanos', 'valentin castellanos'],
    ['dumfries', 'denzel dumfries'],
    ['denzel dumfries', 'denzel dumfries'],
    ['n dicka', 'evan ndicka'],
    ['ndicka', 'evan ndicka'],
    ['evan ndicka', 'evan ndicka'],
    ['strefezza', 'gabriel strefezza'],
    ['gabriel strefezza', 'gabriel strefezza'],
    ['rowe', 'jonathan rowe'],
    ['jonathan rowe', 'jonathan rowe'],
    ['baturina', 'martin baturina'],
    ['martin baturina', 'martin baturina'],
    ['conceicao', 'francisco conceicao'],
    ['conceição', 'francisco conceicao'],
    ['francisco conceicao', 'francisco conceicao'],
    ['francisco conceição', 'francisco conceicao'],
    ['ndoye', 'dan ndoye'],
    ['dan ndoye', 'dan ndoye'],
    ['m thuram', 'marcus thuram'],
    ['marcus thuram', 'marcus thuram'],
    ['bonny', 'ange yoan bonny'],
    ['ange yoan bonny', 'ange yoan bonny'],
    ['kean', 'moise kean'],
    ['moise kean', 'moise kean'],
    ['gudmundsson', 'albert gudmundsson'],
    ['gudmundsson a', 'albert gudmundsson'],
    ['albert gudmundsson', 'albert gudmundsson'],
    ['scamacca', 'gianluca scamacca'],
    ['gianluca scamacca', 'gianluca scamacca'],
    ['krstovic', 'nikola krstovic'],
    ['nikola krstovic', 'nikola krstovic'],
    ['zaccagni', 'mattia zaccagni'],
    ['mattia zaccagni', 'mattia zaccagni'],
    ['gatti', 'federico gatti'],
    ['federico gatti', 'federico gatti'],
    ['koopmeiners', 'teun koopmeiners'],
    ['teun koopmeiners', 'teun koopmeiners'],
    ['yildiz', 'kenan yildiz'],
    ['kenan yildiz', 'kenan yildiz'],
    ['politano', 'matteo politano'],
    ['matteo politano', 'matteo politano'],
  ]);

  function rawCanonName(value) {
    return norm(value).split(/\s+/).filter(Boolean).filter(function (token) { return !/^(jr|sr|ii|iii)$/.test(token); }).join(' ');
  }

  function canonName(value) {
    const raw = rawCanonName(value);
    return NAME_ALIAS_V640.get(raw) || raw;
  }

  function compactName(value) { return canonName(value).replace(/\s+/g, ''); }
  function sortedName(value) { return canonName(value).split(/\s+/).filter(Boolean).sort().join(' '); }

  function uniqueValues(values) {
    const seen = new Set();
    return (values || []).map(function (x) { return String(x || '').trim(); }).filter(function (x) {
      if (!x || seen.has(x)) return false;
      seen.add(x);
      return true;
    });
  }

  function rosterNameKeys(value) {
    const raw = rawCanonName(value);
    const canonical = canonName(value);
    return uniqueValues([
      norm(value), raw, canonical,
      raw.replace(/\s+/g, ''), canonical.replace(/\s+/g, ''),
      raw.split(/\s+/).filter(Boolean).sort().join(' '),
      canonical.split(/\s+/).filter(Boolean).sort().join(' ')
    ]);
  }

  function roleKeyForRoster(role) {
    const raw = String(role || '').trim().toUpperCase();
    const key = raw.charAt(0);
    if (key === 'P') return 'P';
    if (key === 'D') return 'D';
    if (key === 'C' || key === 'M' || key === 'T' || key === 'W') return 'C';
    if (key === 'A') return 'A';
    return key || '';
  }

  function playerTeamKeys(player) {
    return uniqueValues([player && player.teamName, player && player.teamId, player && player.realTeam, player && player.realTeamOriginal, player && player.listone && player.listone.realTeam, player && player.listone && player.listone.realTeamOriginal].map(teamKey));
  }

  function playerNameCandidates(player) {
    const raw = player && player.playerName || '';
    const stripped = String(raw || '').replace(/\s*\([^)]*\)\s*$/g, '').trim();
    const names = [{ value: raw, teamOnly: false }];
    if (stripped && stripped !== raw) names.push({ value: stripped, teamOnly: true });
    if (player && player.originalName && player.originalName !== raw) names.push({ value: player.originalName, teamOnly: true });
    if (player && player.disambiguatedName && player.disambiguatedName !== raw) names.push({ value: player.disambiguatedName, teamOnly: false });
    if (player && player.listone && player.listone.playerName) names.push({ value: player.listone.playerName, teamOnly: false });
    const seen = new Set();
    return names.filter(function (item) {
      const key = norm(item.value) + '::' + (item.teamOnly ? 'team' : 'global');
      if (!norm(item.value) || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function leagueKey() {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get('league') || '';
    if (LEAGUES[requested]) return requested;
    const path = String(window.location.pathname || '').toLowerCase();
    if (path.indexOf('/fantapetillomantramanager/') !== -1) return 'fantapetillomantramanager';
    if (path.indexOf('/zonaorientale/') !== -1) return 'zonaorientale';
    return 'zonaorientale';
  }

  function leagueBaseUrl() { return new URL('/' + leagueKey() + '/', window.location.origin); }

  function latestRosterEntry(manifest, seasonId) {
    const entries = Array.isArray(manifest && manifest.rosters) ? manifest.rosters.slice() : [];
    const seasonEntries = seasonId ? entries.filter(function (entry) { return String(entry.seasonId || '') === String(seasonId); }) : entries;
    const pool = seasonEntries.length ? seasonEntries : entries;
    return pool.sort(function (a, b) { return String(b.loadedAt || b.id || '').localeCompare(String(a.loadedAt || a.id || ''), 'it'); })[0] || null;
  }

  function addRosterCandidate(map, key, value) {
    if (!key) return;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(value);
  }

  async function loadLeagueRosters() {
    state.liveRoster = { loaded: false, active: false, entries: 0, matched: 0, unmatched: 0, map: new Map(), globalMap: new Map(), source: '' };
    try {
      const base = leagueBaseUrl();
      const manifest = await getJson(new URL('assets/rose/manifest.json', base).href);
      const entry = latestRosterEntry(manifest, state.data && state.data.meta && state.data.meta.seasonId || '2026-2027');
      if (!entry || !entry.file) return;
      const payload = await getJson(new URL('assets/rose/' + entry.file, base).href);
      const rosters = Array.isArray(payload && payload.rosters) ? payload.rosters : [];
      const map = new Map();
      const globalMap = new Map();
      let entries = 0;
      rosters.forEach(function (roster) {
        const fantasyRoster = String(roster && (roster.name || roster.teamName || roster.rosterName) || '').trim();
        (roster && roster.players || []).forEach(function (player, index) {
          const playerName = player && (player.playerName || player.name);
          if (!playerName || !fantasyRoster) return;
          const realTeam = teamKey(player.realTeam || player.teamName || player.club || '');
          const role = roleKeyForRoster(player.role || player.classicRole || player.rosterRole || '');
          const value = { fantasyRoster: fantasyRoster, playerName: playerName, realTeam: realTeam, role: role, rosterCost: player.cost != null ? player.cost : player.rosterCost || '', rosterRole: player.role || player.rosterRole || role, sourceFile: entry.file, sourceIndex: index };
          entries += 1;
          rosterNameKeys(playerName).forEach(function (nameKey) {
            addRosterCandidate(map, nameKey + '::' + realTeam + '::' + role, value);
            addRosterCandidate(map, nameKey + '::' + realTeam, value);
            addRosterCandidate(globalMap, nameKey + '::' + role, value);
            addRosterCandidate(globalMap, nameKey, value);
          });
        });
      });
      state.liveRoster = { loaded: true, active: entries > 0, entries: entries, matched: 0, unmatched: 0, map: map, globalMap: globalMap, source: entry.file, label: entry.label || payload?.meta?.label || '' };
    } catch (error) {
      console.warn('[ioSudo V651] Rose live non caricate: uso snapshot Sudatori incorporato.', error);
    }
  }


  function latestListoneEntry(manifest, seasonId) {
    const entries = Array.isArray(manifest && manifest.listoni) ? manifest.listoni.slice() : [];
    const seasonEntries = seasonId ? entries.filter(function (entry) { return String(entry.seasonId || '') === String(seasonId); }) : entries;
    const pool = seasonEntries.length ? seasonEntries : entries;
    return pool.sort(function (a, b) { return String(b.loadedAt || b.id || '').localeCompare(String(a.loadedAt || a.id || ''), 'it'); })[0] || null;
  }

  async function loadLatestListone() {
    state.latestListone = { loaded: false, active: false, entries: 0, map: new Map(), globalMap: new Map(), players: [], source: '', label: '' };
    try {
      const manifest = await getJson(LISTONE_ROOT + 'manifest.json');
      const entry = latestListoneEntry(manifest, state.data && state.data.meta && state.data.meta.seasonId || '2026-2027');
      if (!entry || !entry.file) return;
      const payload = await getJson(LISTONE_ROOT + entry.file);
      const players = Array.isArray(payload && payload.players) ? payload.players : [];
      const map = new Map();
      const globalMap = new Map();
      players.forEach(function (player, index) {
        const playerName = player && (player.playerName || player.name);
        if (!playerName) return;
        const realTeam = teamKey(player.realTeam || player.realTeamOriginal || player.teamName || '');
        const role = roleKeyForRoster(player.classicRole || player.role || player.rosterRole || '');
        const value = Object.assign({}, player, { playerName: playerName, realTeam: realTeam, role: role, listoneFile: entry.file, sourceIndex: index });
        rosterNameKeys(playerName).forEach(function (nameKey) {
          addRosterCandidate(map, nameKey + '::' + realTeam + '::' + role, value);
          addRosterCandidate(map, nameKey + '::' + realTeam, value);
          addRosterCandidate(globalMap, nameKey + '::' + role, value);
          addRosterCandidate(globalMap, nameKey, value);
        });
      });
      state.latestListone = { loaded: true, active: players.length > 0, entries: players.length, map: map, globalMap: globalMap, players: players.map(function (player, index) { const playerName = player && (player.playerName || player.name); const realTeam = teamKey(player.realTeam || player.realTeamOriginal || player.teamName || ''); const role = roleKeyForRoster(player.classicRole || player.role || player.rosterRole || ''); return Object.assign({}, player, { playerName: playerName, realTeam: realTeam, role: role, listoneFile: entry.file, sourceIndex: index }); }).filter(function (player) { return player.playerName; }), source: entry.file, label: entry.label || payload?.meta?.label || entry.id || '' };
    } catch (error) {
      console.warn('[ioSudo V651] Listone piu recente non caricato.', error);
    }
  }

  function uniqueListoneCandidate(list, player) {
    const candidates = (list || []).filter(Boolean);
    if (!candidates.length) return null;
    const role = roleKeyForRoster(player && player.role || '');
    const byRole = role ? candidates.filter(function (entry) { return roleKeyForRoster(entry.classicRole || entry.role || entry.rosterRole) === role; }) : candidates;
    const pool = byRole.length ? byRole : candidates;
    if (pool.length === 1) return pool[0];
    const teams = new Set(playerTeamKeys(player));
    const byTeam = pool.filter(function (entry) { return teams.has(teamKey(entry.realTeam || entry.realTeamOriginal)); });
    return byTeam.length === 1 ? byTeam[0] : null;
  }

  function latestListoneFor(player) {
    if (!state.latestListone || !state.latestListone.active || !player) return null;
    const role = roleKeyForRoster(player.role || '');
    const teams = playerTeamKeys(player);
    const candidates = playerNameCandidates(player);
    for (let c = 0; c < candidates.length; c += 1) {
      const item = candidates[c];
      const keys = rosterNameKeys(item.value);
      for (let k = 0; k < keys.length; k += 1) {
        const nameKey = keys[k];
        for (let t = 0; t < teams.length; t += 1) {
          const team = teams[t];
          const byTeamRole = uniqueListoneCandidate(state.latestListone.map.get(nameKey + '::' + team + '::' + role), player);
          if (byTeamRole) return byTeamRole;
          const byTeam = uniqueListoneCandidate(state.latestListone.map.get(nameKey + '::' + team), player);
          if (byTeam) return byTeam;
        }
        if (!item.teamOnly) {
          const byGlobalRole = uniqueListoneCandidate(state.latestListone.globalMap.get(nameKey + '::' + role), player);
          if (byGlobalRole) return byGlobalRole;
          const globalList = state.latestListone.globalMap.get(nameKey) || [];
          if (globalList.length === 1) return globalList[0];
        }
      }
    }
    return looseListoneForPlayer(player);
  }


  function looseListoneForPlayer(player) {
    if (!state.latestListone || !state.latestListone.active || !player) return null;
    const candidates = playerNameCandidates(player);
    const teams = new Set(playerTeamKeys(player));
    const role = roleKeyForRoster(player.role || player.roleBrief || player.classicRole || player.rosterRole || '');
    const seen = new Set();
    const pool = [];
    candidates.forEach(function (item) {
      rosterNameKeys(item.value).forEach(function (nameKey) {
        const rows = state.latestListone.globalMap.get(nameKey) || [];
        rows.forEach(function (entry) {
          const key = [entry.fantacalcioId, entry.playerName, entry.realTeam, entry.classicRole || entry.role].map(function (x) { return String(x || ''); }).join('|');
          if (!seen.has(key)) {
            seen.add(key);
            pool.push(entry);
          }
        });
      });
    });
    if (!pool.length) return null;
    if (teams.size) {
      const byTeam = pool.filter(function (entry) { return teams.has(teamKey(entry.realTeam || entry.realTeamOriginal)); });
      if (byTeam.length === 1) return byTeam[0];
      if (role) {
        const byTeamRole = byTeam.filter(function (entry) { return roleKeyForRoster(entry.classicRole || entry.role || entry.rosterRole) === role; });
        if (byTeamRole.length === 1) return byTeamRole[0];
      }
    }
    if (pool.length === 1) return pool[0];
    if (role) {
      const byRole = pool.filter(function (entry) { return roleKeyForRoster(entry.classicRole || entry.role || entry.rosterRole) === role; });
      if (byRole.length === 1) return byRole[0];
    }
    return null;
  }

  function playerInLatestListone(player) {
    const match = latestListoneFor(player);
    if (match) return { present: true, label: state.latestListone.label || state.latestListone.source || 'Listone', item: match };
    if (!state.latestListone || !state.latestListone.loaded) return { present: Boolean(player && player.listone), label: 'snapshot', item: player && player.listone || null };
    return { present: false, label: state.latestListone.label || state.latestListone.source || 'Listone', item: null };
  }

  function uniqueRosterCandidate(list, player) {
    const candidates = (list || []).filter(Boolean);
    if (!candidates.length) return null;
    const role = roleKeyForRoster(player && player.role || '');
    const byRole = role ? candidates.filter(function (entry) { return roleKeyForRoster(entry.role) === role; }) : candidates;
    if (role && candidates.length && !byRole.length) return null;
    const pool = byRole.length ? byRole : candidates;
    if (pool.length === 1) return pool[0];
    const teams = new Set(playerTeamKeys(player));
    const byTeam = pool.filter(function (entry) { return teams.has(teamKey(entry.realTeam)); });
    return byTeam.length === 1 ? byTeam[0] : null;
  }

  function liveRosterFor(player) {
    if (!state.liveRoster || !state.liveRoster.active || !player) return null;
    const role = roleKeyForRoster(player.role || '');
    const teams = playerTeamKeys(player);
    const candidates = playerNameCandidates(player);
    for (let c = 0; c < candidates.length; c += 1) {
      const item = candidates[c];
      const keys = rosterNameKeys(item.value);
      for (let k = 0; k < keys.length; k += 1) {
        const nameKey = keys[k];
        for (let t = 0; t < teams.length; t += 1) {
          const team = teams[t];
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
    if (!state.liveRoster || !state.liveRoster.active || !state.data || !state.data.playersByTeam) return;
    let matched = 0;
    let unmatched = 0;
    Object.values(state.data.playersByTeam).forEach(function (players) {
      (players || []).forEach(function (player) {
        const match = liveRosterFor(player);
        player.liveRosterSource = state.liveRoster.source;
        if (match) {
          matched += 1;
          player.liveRosterMatch = true;
          player.fantasyRoster = match.fantasyRoster;
          player.rosterCost = match.rosterCost;
          player.rosterRole = match.rosterRole;
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
          if (player.listone) {
            player.listone.fantasyRoster = '';
            player.listone.rosterCost = '';
          }
        }
      });
    });
    state.liveRoster.matched = matched;
    state.liveRoster.unmatched = unmatched;
  }

  function applyLiveRosterMatchToPlayer(player) {
    if (!state.liveRoster || !state.liveRoster.active || !player) return null;
    const match = liveRosterFor(player);
    if (!match) return null;
    player.liveRosterSource = state.liveRoster.source;
    player.liveRosterMatch = true;
    player.fantasyRoster = match.fantasyRoster;
    player.rosterCost = match.rosterCost;
    player.rosterRole = match.rosterRole;
    if (player.listone) {
      player.listone.fantasyRoster = match.fantasyRoster;
      player.listone.rosterCost = match.rosterCost;
      player.listone.rosterRole = match.rosterRole;
    }
    return match;
  }

  function fantasyRosterText(player) {
    if (state.liveRoster && state.liveRoster.active) return String(player && player.fantasyRoster || '').trim();
    return String(player && player.fantasyRoster || '').trim();
  }

  function initialSensitiveConflict(na, nb) {
    const sensitive = new Set(['vasquez', 'sulemana']);
    const aa = na.split(' ').filter(Boolean);
    const bb = nb.split(' ').filter(Boolean);
    if (!aa.length || !bb.length) return false;
    const lastA = aa[aa.length - 1];
    const lastB = bb[bb.length - 1];
    if (aa.length === 1 && bb.length > 1 && sensitive.has(aa[0])) return true;
    if (bb.length === 1 && aa.length > 1 && sensitive.has(bb[0])) return true;
    if (lastA && lastA === lastB && sensitive.has(lastA)) {
      return aa.slice(0, -1).join(' ') !== bb.slice(0, -1).join(' ');
    }
    return false;
  }

  function sameName(a, b) {
    const na = canonName(a);
    const nb = canonName(b);
    if (!na || !nb) return false;
    if (na === nb) return true;
    if (initialSensitiveConflict(na, nb)) return false;
    const aa = na.split(' ').filter(Boolean);
    const bb = nb.split(' ').filter(Boolean);
    if (aa.length > 1 && bb.length > 1 && aa.slice().sort().join(' ') === bb.slice().sort().join(' ')) return true;
    if (aa.length === 1 && bb.length > 1) return bb.includes(aa[0]);
    if (bb.length === 1 && aa.length > 1) return aa.includes(bb[0]);
    if (aa.length > 1 && bb.length > aa.length && aa.every(function (token) { return bb.includes(token); })) return true;
    if (bb.length > 1 && aa.length > bb.length && bb.every(function (token) { return aa.includes(token); })) return true;
    return false;
  }

  function safeUrl(url) {
    const text = String(url || '').trim();
    if (!text) return '';
    if (/^https?:\/\//i.test(text)) return text;
    return '';
  }

  function sourceProvider(item) {
    if (item && item._iosudoProvider) return String(item._iosudoProvider || '').trim();
    const articleDirect = item && (item.articleUrl || item.preciseArticleUrl || item.url || item.source || item.href);
    const directProvider = directUrlProvider(articleDirect);
    const explicitName = String(item && (item.sourceName || item.sourceLabel || '') || '').trim();
    if (directProvider && (!explicitName || /\//.test(explicitName))) return directProvider;
    const text = norm([item && item.sourceName, item && item.sourceLabel, item && item.articleUrl, item && item.source, item && item.url, item && item.note, item && item.status].filter(Boolean).join(' '));
    if (/calciolecce/.test(text)) return 'CalcioLecce';
    if (/eurosport/.test(text)) return 'Eurosport';
    if (/transfermarkt|calciomercato detail|gk wettbewerb|tm pagina/.test(text)) return 'Transfermarkt';
    if (/tuttomercatoweb|tmw/.test(text)) return 'TMW';
    if (/sport sky|sky/.test(text)) return 'Sky';
    if (/sos fanta|sosfanta/.test(text)) return 'SOS Fanta';
    if (/gianlucadimarzio|di marzio/.test(text)) return 'Gianluca Di Marzio';
    if (/alfredopedulla|pedulla/.test(text)) return 'Alfredo Pedulla';
    if (/fantacalcio/.test(text)) return 'Fantacalcio.it';
    if (/fanpage/.test(text)) return 'Fanpage';
    if (/sportmediaset|mediaset/.test(text)) return 'SportMediaset';
    if (/bwin/.test(text)) return 'Bwin';
    if (/udinese it|udinese/.test(text)) return 'Udinese.it';
    if (/calciodangolo|calcio d angolo/.test(text)) return "Calcio d'Angolo";
    if (/pazzidifanta|pazzi di fanta/.test(text)) return 'Pazzi di Fanta';
    const name = String(item && (item.sourceName || item.sourceLabel || '') || '').trim();
    if (name && norm(name) !== 'fonte') return name;
    return '';
  }

  function compactHostname(url) {
    const text = String(url || '').trim();
    if (!/^https?:\/\//i.test(text)) return '';
    try {
      const host = new URL(text).hostname.replace(/^www\./, '');
      const known = {
        'gianlucadimarzio.com': 'Gianluca Di Marzio',
        'alfredopedulla.com': 'Alfredo Pedulla',
        'fantacalcio.it': 'Fantacalcio.it',
        'fanpage.it': 'Fanpage',
        'sportmediaset.mediaset.it': 'SportMediaset',
        'blackwhitereadallover.com': 'Black & White & Read All Over'
      };
      if (known[host]) return known[host];
      const parts = host.split('.');
      if (parts.length >= 2) return parts.slice(-2).join('.');
      return host || '';
    } catch (_) {
      return '';
    }
  }

  function directUrlProvider(url) {
    const text = norm(url || '');
    if (/gianlucadimarzio|di marzio/.test(text)) return 'Gianluca Di Marzio';
    if (/alfredopedulla|pedulla/.test(text)) return 'Alfredo Pedulla';
    if (/fantacalcio/.test(text)) return 'Fantacalcio.it';
    if (/fanpage/.test(text)) return 'Fanpage';
    if (/sportmediaset|mediaset/.test(text)) return 'SportMediaset';
    if (/calciolecce/.test(text)) return 'CalcioLecce';
    if (/eurosport/.test(text)) return 'Eurosport';
    if (/transfermarkt/.test(text)) return 'Transfermarkt';
    if (/tuttomercatoweb|tmw/.test(text)) return 'TMW';
    if (/sky/.test(text)) return 'Sky';
    if (/sosfanta|sos fanta/.test(text)) return 'SOS Fanta';
    if (/bwin/.test(text)) return 'Bwin';
    if (/udinese/.test(text)) return 'Udinese.it';
    if (/calciodangolo/.test(text)) return "Calcio d'Angolo";
    if (/pazzidifanta/.test(text)) return 'Pazzi di Fanta';
    return compactHostname(url);
  }



  function sourceHref(item) {
    const verification = norm(item && (item.sourceVerification || item.sourceType || ''));
    const direct = safeUrl(item && (item.articleUrl || item.preciseArticleUrl || item.article || item.url || item.source || item.href));
    if (direct) return direct;
    if (verification.indexOf('da verificare') !== -1 || verification.indexOf('fonte generica') !== -1) return '';
    const provider = sourceProvider(item);
    if (provider === 'CalcioLecce') return 'https://www.calciolecce.it/';
    if (provider === 'Eurosport') return 'https://www.eurosport.it/calcio/calciomercato/';
    if (provider === 'Transfermarkt') return 'https://www.transfermarkt.it/calciomercato/detail/forum/154/gk_group/nationalCompetitions/gk_wettbewerb_id/IT1/page/1';
    if (provider === 'TMW') return 'https://www.tuttomercatoweb.com/serie-a/';
    if (provider === 'Sky') return 'https://sport.sky.it/calciomercato/tabellone';
    if (provider === 'SOS Fanta') return 'https://www.sosfanta.com/';
    if (provider === 'Bwin') return 'https://www.bwin.it/it/news/calcio/amichevoli-estive-udinese-2026';
    if (provider === 'Udinese.it') return 'https://www.udinese.it/';
    if (provider === "Calcio d'Angolo") return 'https://calciodangolo.com/';
    if (provider === 'Pazzi di Fanta') return 'https://www.pazzidifanta.com/';
    return '';
  }

  function excelSerialDate(value) {
    const text = String(value || '').trim();
    if (!text) return null;
    const serialMatch = text.match(/^0*(\d{5})(?:\.0+)?$/) || text.match(/^\+?0*(\d{5})(?:-\d{1,2}(?:-\d{1,2})?)?$/) || text.match(/(?:^|\D)0*([3-9]\d{4})(?:\D|$)/);
    if (!serialMatch) return null;
    const serial = Number(serialMatch[1]);
    if (!Number.isFinite(serial) || serial < 30000 || serial > 60000) return null;
    return new Date(Date.UTC(1899, 11, 30) + Math.round(serial) * 86400000);
  }

  function formatDate(value) {
    const text = String(value || '').trim();
    if (!text) return '';
    const serialDate = excelSerialDate(text);
    if (serialDate) {
      const dd = String(serialDate.getUTCDate()).padStart(2, '0');
      const mm = String(serialDate.getUTCMonth() + 1).padStart(2, '0');
      const yyyy = String(serialDate.getUTCFullYear());
      return dd + '/' + mm + '/' + yyyy;
    }
    const match = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) return match[3] + '/' + match[2] + '/' + match[1];
    return text;
  }


  function formatDateTime(value, fallbackDate) {
    const text = String(value || '').trim();
    if (!text) return formatDate(fallbackDate || '');
    const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::\d{2})?/);
    if (iso) return iso[3] + '/' + iso[2] + '/' + iso[1] + ' ore ' + iso[4] + ':' + iso[5];
    const it = text.match(/^(\d{2})\/(\d{2})\/(\d{4})[T\s,]*(?:ore\s*)?(\d{1,2}):(\d{2})/i);
    if (it) return it[1] + '/' + it[2] + '/' + it[3] + ' ore ' + String(it[4]).padStart(2, '0') + ':' + it[5];
    const dateOnly = formatDate(text);
    return dateOnly || formatDate(fallbackDate || '');
  }

  function setStatus(message) {
    if (els.status) els.status.textContent = message;
  }

  function resolveLeague() {
    const key = leagueKey();
    return LEAGUES[key] || { name: 'Per i SUDATORI', href: '../zonaorientale/' };
  }

  function setupLeagueChrome() {
    const league = resolveLeague();
    const backLink = $('iosudoBackLink');
    const leagueName = $('iosudoLeagueName');
    if (leagueName) leagueName.textContent = league.name;
    if (backLink) backLink.href = league.href;
    document.title = 'ioSudo - ' + league.name;
  }

  function getTeam(teamId) {
    return (state.data && state.data.teams || []).find(function (team) { return team.id === teamId; }) || null;
  }

  function teamPlayers(teamId) {
    return (state.data && state.data.playersByTeam && state.data.playersByTeam[teamId]) || [];
  }

  function teamSummary(teamId) {
    return (state.data && state.data.marketSummaryByTeam && state.data.marketSummaryByTeam[teamId]) || {};
  }


  function teamCounters(teamId, summary) {
    const currentSummary = summary || teamSummary(teamId) || {};
    const officialIncoming = Array.isArray(currentSummary.officialIncoming) ? currentSummary.officialIncoming.length : 0;
    const officialOutgoing = Array.isArray(currentSummary.officialOutgoing) ? currentSummary.officialOutgoing.length : 0;
    const talksIncoming = Array.isArray(currentSummary.talksIncoming) ? currentSummary.talksIncoming.length : 0;
    const talksOutgoing = Array.isArray(currentSummary.talksOutgoing) ? currentSummary.talksOutgoing.length : 0;
    const injuriesFromSummary = Array.isArray(currentSummary.injuries) ? currentSummary.injuries.length : 0;
    const injuriesFromTeam = teamInjuries(teamId).length;
    return {
      officialIncoming: officialIncoming,
      officialOutgoing: officialOutgoing,
      talksIncoming: talksIncoming,
      talksOutgoing: talksOutgoing,
      rumors: talksIncoming + talksOutgoing,
      injuries: injuriesFromSummary || injuriesFromTeam
    };
  }

  function teamInjuries(teamId) {
    return (state.data && state.data.injuriesByTeam && state.data.injuriesByTeam[teamId]) || [];
  }

  function teamFormation(teamId) {
    return (state.data && state.data.formationsByTeam && state.data.formationsByTeam[teamId]) || [];
  }


  function teamFormationMeta(teamId) {
    const rows = teamFormation(teamId);
    const row = rows.find(function (item) {
      return item && (item.module || item.formationModule || item.coach || item.compatibleModules);
    }) || {};
    return {
      module: String(row.module || row.formationModule || '').trim(),
      compatibleModules: String(row.compatibleModules || '').trim(),
      coach: String(row.coach || '').trim()
    };
  }

  function teamModuleText(team) {
    const meta = teamFormationMeta(team && team.id || '');
    return String(team && (team.formationModule || team.module) || meta.module || '').trim();
  }

  function teamCoachText(team) {
    const meta = teamFormationMeta(team && team.id || '');
    return String(team && team.coach || meta.coach || '').trim();
  }

  const FRIENDLY_NON_MATCH_RE_V649 = /(guida|ritir|radun|preparazion|convocat|verifica|calendario|fonti|nuovi arrivi|oggi tornano|gestione fantacalcio|amichevoli non ancora|conferenza)/i;

  function isRealFriendlyMatch(item, team) {
    const event = String(item && item.event || '').trim();
    if (!event || FRIENDLY_NON_MATCH_RE_V649.test(event)) return false;
    if (/triangolare/i.test(event)) return false;
    if (!/\S\s*[-–—]\s*\S/.test(event)) return false;
    if (!formatDate(item && item.date)) return false;
    const blob = norm(event);
    const teamBlob = norm(team && (team.name || team.id || team.abbr) || item && item.teamName || '');
    if (teamBlob && blob.indexOf(teamBlob) !== -1) return true;
    const serieA = ['atalanta','bologna','cagliari','como','fiorentina','frosinone','genoa','inter','juventus','juve','lazio','lecce','milan','monza','napoli','parma','roma','sassuolo','torino','udinese','venezia'];
    return serieA.some(function (name) { return blob.indexOf(name) !== -1; });
  }

  function teamFriendlies(teamId) {
    const team = getTeam(teamId) || { id: teamId, name: teamId };
    return ((state.data && state.data.friendliesByTeam && state.data.friendliesByTeam[teamId]) || [])
      .filter(function (item) { return isRealFriendlyMatch(item, team); })
      .slice()
      .sort(function (a, b) {
        const diff = dateValue(a && a.date, Number.MAX_SAFE_INTEGER) - dateValue(b && b.date, Number.MAX_SAFE_INTEGER);
        if (diff) return diff;
        return String(a && a.event || '').localeCompare(String(b && b.event || ''), 'it');
      });
  }


  function friendlyDetailKey(item) {
    if (!item) return '';
    return String(item.matchKey || item._iosudoFriendlyKey || norm([item.teamId || item.teamName, item.date, item.event].join('|')) || '');
  }

  function friendlyStatsStore(key) {
    const store = state.data && state.data.friendlyPlayerStatsByMatch || {};
    return store[String(key || '')] || null;
  }

  function friendlyStatsForItem(item) {
    if (!item) return [];
    if (Array.isArray(item.playerStats) && item.playerStats.length) return item.playerStats;
    const detail = friendlyStatsStore(friendlyDetailKey(item));
    return detail && Array.isArray(detail.players) ? detail.players : [];
  }

  function friendlyTotalsForItem(item) {
    const detail = friendlyStatsStore(friendlyDetailKey(item));
    return item && item.statsTotals || detail && detail.totals || {};
  }

  function friendlyDetailByKey(matchKey, teamId) {
    const key = String(matchKey || '');
    if (!key || !state.data) return null;
    let found = null;
    const byTeam = state.data.friendliesByTeam || {};
    Object.entries(byTeam).some(function (entry) {
      const tid = entry[0];
      if (teamId && tid !== teamId) return false;
      return (entry[1] || []).some(function (item) {
        if (friendlyDetailKey(item) === key) {
          found = item;
          return true;
        }
        return false;
      });
    });
    if (found) return found;
    const detail = friendlyStatsStore(key);
    if (!detail) return null;
    return Object.assign({}, detail, { playerStats: detail.players || [], statsTotals: detail.totals || {} });
  }

  function friendlyDetailActionAttrs(item) {
    const key = friendlyDetailKey(item);
    if (!key) return '';
    return ' data-friendly-detail-key="' + escapeHtml(key) + '" data-team-id="' + escapeHtml(item.teamId || '') + '"';
  }

  function friendlyGoalSummary(stats) {
    const scorers = (stats || []).filter(function (row) { return Number(row.goals || 0) > 0; }).map(function (row) {
      return row.playerName + ' ' + row.goals;
    });
    const own = (stats || []).filter(function (row) { return Number(row.ownGoals || 0) > 0; }).map(function (row) {
      return row.playerName + ' AG' + row.ownGoals;
    });
    return scorers.concat(own).join(', ');
  }

  function friendlyStatBadge(label, value, css) {
    if (value === null || value === undefined || value === '') return '';
    return '<span class="iosudo-friendly-badge ' + escapeHtml(css || '') + '">' + escapeHtml(label + value) + '</span>';
  }


  function playerForFriendlyStatRow(row) {
    if (!row) return null;
    const teamId = row.teamId || (row.teamName ? (state.data.teams || []).find(function (team) { return sameName(team.name, row.teamName); })?.id : '');
    const name = row.playerName || row.target || row.name;
    if (!name) return null;
    const local = teamId ? teamPlayers(teamId) : [];
    const foundLocal = local.find(function (player) { return itemMatchesPlayer(row, player); });
    if (foundLocal) return foundLocal;
    return state.allPlayers.find(function (player) {
      const sameTeam = !teamId || !player.teamId || player.teamId === teamId || sameName(player.teamName, row.teamName);
      return sameTeam && itemMatchesPlayer(row, player);
    }) || null;
  }

  function friendlyStatRow(row) {
    const goals = Number(row.goals || 0);
    const ownGoals = Number(row.ownGoals || 0);
    const injuryText = String(row.injuryGame || '').trim();
    const hasInjury = injuryText && !/^(no|no gara)$/i.test(injuryText);
    const minutes = row.minutes === null || row.minutes === undefined || row.minutes === '' ? '-' : row.minutes + '’';
    const role = row.role ? '<span class="iosudo-friendly-role ' + escapeHtml(roleClass(row.role)) + '">' + escapeHtml(row.role) + '</span>' : '';
    const linkedPlayer = playerForFriendlyStatRow(row);
    const playerNameHtml = linkedPlayer
      ? '<button class="iosudo-friendly-player-link" type="button" data-player-detail-id="' + escapeHtml(linkedPlayer.id) + '" data-team-id="' + escapeHtml(linkedPlayer.teamId || row.teamId || '') + '" aria-label="Apri dettaglio giocatore ' + escapeHtml(linkedPlayer.playerName || row.playerName || 'Giocatore') + '"><strong>' + escapeHtml(linkedPlayer.playerName || row.playerName || 'Giocatore') + '</strong></button>'
      : '<strong>' + escapeHtml(row.playerName || 'Giocatore') + '</strong>';
    return '<article class="iosudo-friendly-stat-row">'
      + '<div class="iosudo-friendly-stat-main">' + playerNameHtml + role + '</div>'
      + '<div class="iosudo-friendly-badges">'
      + friendlyStatBadge('', minutes, 'iosudo-friendly-minutes')
      + friendlyStatBadge('', row.startStatus || '', row.starter ? 'iosudo-friendly-starter' : 'iosudo-friendly-sub')
      + (goals ? friendlyStatBadge('G', goals, 'iosudo-friendly-goal') : '')
      + (ownGoals ? friendlyStatBadge('AG', ownGoals, 'iosudo-friendly-own-goal') : '')
      + friendlyStatBadge('INF ', injuryText || 'NO', hasInjury ? 'iosudo-friendly-injury' : 'iosudo-friendly-no-injury')
      + '</div>'
      + (row.note ? '<p>' + escapeHtml(row.note) + '</p>' : '')
      + '</article>';
  }


  function returnFromFriendlyDetail() {
    const ctx = state.friendlyReturnContext || {};
    state.activePlayerId = '';
    state.activeFriendlyKey = '';
    if (ctx.type === 'globalFriendlies') {
      state.activeTeamId = '';
      state.quickView = 'friendlies';
      if (els.focus) els.focus.classList.add('hidden');
      if (els.app) els.app.classList.remove('is-team-open');
      document.querySelectorAll('[data-view]').forEach(function (button) {
        button.classList.toggle('is-active', (button.getAttribute('data-view') || 'teams') === 'friendlies');
      });
      if (window.location.hash) history.replaceState(null, '', window.location.pathname + window.location.search);
      renderResults();
      if (els.results) els.results.scrollIntoView({ behavior: 'auto', block: 'start' });
      return;
    }
    const teamId = ctx.teamId || state.activeTeamId;
    if (teamId) {
      state.activeTab = ctx.tab || 'amichevoli';
      renderTeamPanel(teamId);
      if (els.focus) els.focus.scrollIntoView({ behavior: 'auto', block: 'start' });
      return;
    }
    setQuickView('friendlies');
  }

  function renderFriendlyDetail(matchKey, teamId) {
    if (!els.focus) return;
    const item = friendlyDetailByKey(matchKey, teamId);
    if (!item) return;
    const key = friendlyDetailKey(item) || matchKey;
    const stats = friendlyStatsForItem(item);
    const totals = friendlyTotalsForItem(item);
    const teamName = item.teamName || (getTeam(item.teamId || teamId) || {}).name || '';
    const when = [formatDate(item.date) || 'Data da confermare', item.time].filter(Boolean).join(' - ');
    const result = item.result || item.score || item.finalScore || '';
    const goalSummary = friendlyGoalSummary(stats);
    state.activeFriendlyKey = key;
    state.activeTeamId = item.teamId || teamId || state.activeTeamId || '';
    if (els.app) els.app.classList.add('is-team-open');
    const statRows = stats.length
      ? '<div class="iosudo-friendly-stats">' + stats.map(friendlyStatRow).join('') + '</div>'
      : '<p class="iosudo-empty">Tabellino giocatori non disponibile per questa amichevole.</p>';
    const totalsHtml = stats.length ? '<div class="iosudo-friendly-kpis">'
      + '<span class="iosudo-pill">Giocatori ' + escapeHtml(totals.players || stats.length) + '</span>'
      + '<span class="iosudo-pill">Titolari ' + escapeHtml(totals.starters || 0) + '</span>'
      + '<span class="iosudo-pill">Impiegati ' + escapeHtml(totals.used || 0) + '</span>'
      + '<span class="iosudo-pill">Gol ' + escapeHtml(totals.goals || 0) + '</span>'
      + '<span class="iosudo-pill">Autogol ' + escapeHtml(totals.ownGoals || 0) + '</span>'
      + '<span class="iosudo-pill">INF gara ' + escapeHtml(totals.injuryGame || 0) + '</span>'
      + '</div>' : '';
    els.focus.innerHTML = '<div class="iosudo-panel-header iosudo-friendly-detail-header"><div>'
      + '<p class="iosudo-eyebrow">Amichevole</p>'
      + '<h2 class="iosudo-card-title">' + escapeHtml(item.event || 'Amichevole') + (result ? ' <span class="iosudo-result-badge">' + escapeHtml(result) + '</span>' : '') + '</h2>'
      + '<p class="iosudo-card-subtitle">' + escapeHtml([teamName, when, item.venue || item.location].filter(Boolean).join(' · ')) + '</p>'
      + totalsHtml
      + '</div><button class="iosudo-close" type="button" aria-label="Chiudi scheda" data-close-focus="true">x</button></div>'
      + '<div class="iosudo-friendly-detail-card">'
      + (item.status ? '<p><strong>Stato:</strong> ' + escapeHtml(item.status) + '</p>' : '')
      + (goalSummary ? '<p><strong>Marcatori:</strong> ' + escapeHtml(goalSummary) + '</p>' : '')
      + (item.note ? '<p>' + escapeHtml(item.note) + '</p>' : '')
      + sourcesHtml(item)
      + '</div>'
      + '<div class="iosudo-friendly-detail-actions"><button class="iosudo-secondary-action" type="button" data-back-friendly="true">Torna alle amichevoli</button></div>'
      + statRows;
    els.focus.classList.remove('hidden');
    window.location.hash = 'friendly=' + encodeURIComponent(key) + (state.activeTeamId ? '&team=' + encodeURIComponent(state.activeTeamId) : '');
  }

  function playerById(playerId, teamId) {
    const id = String(playerId || '');
    if (!id) return null;
    const localPlayers = teamId ? teamPlayers(teamId) : [];
    const foundLocal = localPlayers.find(function (player) { return String(player.id || '') === id; });
    if (foundLocal) return foundLocal;
    const foundGlobal = state.allPlayers.find(function (player) { return String(player.id || '') === id; });
    if (foundGlobal) return foundGlobal;
    if (state.virtualPlayers && state.virtualPlayers.has(id)) return state.virtualPlayers.get(id);
    return null;
  }

  function playerForFormationItem(teamId, item) {
    const name = item && item.playerName;
    if (!name) return null;
    return teamPlayers(teamId).find(function (player) {
      return sameName(name, player.playerName)
        || sameName(name, player.originalName)
        || sameName(name, player.disambiguatedName)
        || (player.listone && sameName(name, player.listone.playerName));
    }) || null;
  }

  function itemMatchesPlayer(item, player) {
    if (!item || !player) return false;
    const candidate = item && (item.playerName || item.target || item.name || item.title);
    if (sameName(candidate, player.playerName)) return true;
    if (player.originalName && sameName(candidate, player.originalName)) return true;
    if (player.disambiguatedName && sameName(candidate, player.disambiguatedName)) return true;
    if (player.listone && sameName(candidate, player.listone.playerName)) return true;
    return false;
  }

  function friendlyStatsForPlayer(player) {
    if (!player || !state.data) return [];
    const store = state.data.friendlyPlayerStatsByMatch || {};
    const rows = [];
    Object.entries(store).forEach(function (entry) {
      const key = entry[0];
      const match = entry[1] || {};
      (match.players || []).forEach(function (row) {
        const samePlayer = itemMatchesPlayer(row, player);
        const sameTeam = !row.teamId || !player.teamId || row.teamId === player.teamId || sameName(row.teamName, player.teamName);
        if (samePlayer && sameTeam) {
          rows.push(Object.assign({}, row, {
            matchKey: key,
            event: match.event || row.event || row.match || 'Amichevole',
            date: match.date || row.date || '',
            result: match.result || row.result || row.score || '',
            teamName: match.teamName || row.teamName || player.teamName || '',
            venue: match.venue || row.venue || '',
            source: row.source || match.source || '',
            url: row.url || row.articleUrl || match.url || match.articleUrl || ''
          }));
        }
      });
    });
    rows.sort(function (a, b) { return itemUpdatedTime(b) - itemUpdatedTime(a); });
    return rows;
  }

  function playerFriendlyItem(row) {
    const goals = Number(row.goals || 0);
    const ownGoals = Number(row.ownGoals || 0);
    const injuryText = String(row.injuryGame || '').trim();
    const hasInjury = injuryText && !/^(no|no gara)$/i.test(injuryText);
    const minutes = row.minutes === null || row.minutes === undefined || row.minutes === '' ? '-' : row.minutes + '’';
    const attrs = row.matchKey ? ' data-friendly-detail-key="' + escapeHtml(row.matchKey) + '" data-team-id="' + escapeHtml(row.teamId || '') + '"' : '';
    return '<article class="iosudo-list-row iosudo-player-friendly-card">'
      + '<button class="iosudo-friendly-row-button" type="button"' + attrs + ' aria-label="Apri riepilogo amichevole ' + escapeHtml(row.event || '') + '">'
      + '<h4>' + escapeHtml(row.event || row.match || 'Amichevole') + (row.result ? ' <span class="iosudo-result-badge">' + escapeHtml(row.result) + '</span>' : '') + '</h4>'
      + '<p>' + escapeHtml([formatDate(row.date) || row.date || '', row.teamName || ''].filter(Boolean).join(' · ')) + '</p>'
      + '<div class="iosudo-friendly-badges">'
      + friendlyStatBadge('', minutes, 'iosudo-friendly-minutes')
      + friendlyStatBadge('', row.startStatus || '', row.starter ? 'iosudo-friendly-starter' : 'iosudo-friendly-sub')
      + (goals ? friendlyStatBadge('G', goals, 'iosudo-friendly-goal') : '')
      + (ownGoals ? friendlyStatBadge('AG', ownGoals, 'iosudo-friendly-own-goal') : '')
      + friendlyStatBadge('INF ', injuryText || 'NO', hasInjury ? 'iosudo-friendly-injury' : 'iosudo-friendly-no-injury')
      + '</div>'
      + (row.note ? '<p>' + escapeHtml(row.note) + '</p>' : '')
      + '</button>'
      + (row.source || row.url ? '<p>' + sourceLink(row) + '</p>' : '')
      + '</article>';
  }

  function marketItemKey(item, key) {
    return norm([
      key || '',
      item && (item.playerName || item.target || item.name || item.title),
      item && (item.teamId || item.teamName),
      item && (item.direction || item.directionLabel),
      item && item.status,
      item && item.updatedAt,
      sourceHref(item)
    ].filter(Boolean).join('|'));
  }

  function uniqueMarketItems(items, key) {
    const seen = new Set();
    return (items || []).filter(Boolean).filter(function (item) {
      const itemKey = marketItemKey(item, key);
      if (!itemKey || seen.has(itemKey)) return false;
      seen.add(itemKey);
      return true;
    });
  }

  function attachedRowsForPlayer(player) {
    if (!player) return [];
    return [].concat(player._iosudoMarketRows || [], player.virtualMarketRows || []).filter(Boolean);
  }

  function talksForPlayer(player) {
    const attached = attachedRowsForPlayer(player)
      .filter(function (row) { return row && /^talks/.test(row.key || ''); })
      .map(function (row) { return row.item; });
    const summary = teamSummary(player && player.teamId);
    const local = [].concat(summary.talksIncoming || [], summary.talksOutgoing || [])
      .filter(function (item) { return itemMatchesPlayer(item, player); });
    return uniqueMarketItems(attached.concat(local), 'talks');
  }

  function officialIncomingForPlayer(player) {
    const attached = attachedRowsForPlayer(player)
      .filter(function (row) { return row && row.key === 'officialIncoming'; })
      .map(function (row) { return row.item; });
    const local = (teamSummary(player && player.teamId).officialIncoming || [])
      .filter(function (item) { return itemMatchesPlayer(item, player); });
    return uniqueMarketItems(attached.concat(local), 'officialIncoming');
  }

  function officialOutgoingForPlayer(player) {
    const attached = attachedRowsForPlayer(player)
      .filter(function (row) { return row && row.key === 'officialOutgoing'; })
      .map(function (row) { return row.item; });
    const local = (teamSummary(player && player.teamId).officialOutgoing || [])
      .filter(function (item) { return itemMatchesPlayer(item, player); });
    return uniqueMarketItems(attached.concat(local), 'officialOutgoing');
  }

  function injuriesForPlayer(player) {
    if (!player || !state.data) return [];
    const results = [];
    const seen = new Set();
    function add(item, teamId) {
      if (!item || !itemMatchesPlayer(item, player)) return;
      const key = marketItemKey(item, 'injury') + '::' + String(teamId || '');
      if (seen.has(key)) return;
      seen.add(key);
      results.push(item);
    }
    const directTeamId = String(player.teamId || '');
    if (directTeamId) {
      teamInjuries(directTeamId).forEach(function (item) { add(item, directTeamId); });
    }
    Object.entries(state.data.injuriesByTeam || {}).forEach(function (entry) {
      const teamId = String(entry[0] || '');
      if (directTeamId && teamId === directTeamId) return;
      (entry[1] || []).forEach(function (item) { add(item, teamId); });
    });
    return results;
  }

  function isPhysicalIssue(value) {
    const text = norm(value || '');
    if (!text) return false;
    if (text.indexOf('nessuna segnalazione') !== -1) return false;
    if (text.indexOf('nessuna segnalazione recente') !== -1) return false;
    if (text.indexOf('disponibile') !== -1 && text.indexOf('infortun') === -1 && text.indexOf('stop') === -1 && text.indexOf('operato') === -1) return false;
    if (/^(ok|si|no|n d|nd|-)$/.test(text)) return false;
    return /(infortun|lesione|stop|operat|pubalgia|distorsione|trauma|ernia|monitorare|rientro|indisponibil|problema|affaticament|dolor|recupero)/.test(text);
  }

  function playerHasSos(player) {
    if (player && player.sosFantaFlag) return true;
    if (isPhysicalIssue(player && (player.physicalStatus || player.injuryStatus || player.formationPhysicalStatus))) return true;
    return injuriesForPlayer(player).length > 0;
  }

  function marketBadgeForPlayer(player) {
    if (player.newAcquisition || officialIncomingForPlayer(player).length) {
      return { text: 'NUOVO', cls: 'iosudo-badge-new' };
    }
    if (talksForPlayer(player).length) {
      return { text: 'RUMOR', cls: 'iosudo-badge-rumor' };
    }
    const status = norm(player.marketStatus + ' ' + player.marketDetail + ' ' + player.marketNote);
    const neutral = status.indexOf('nessuna segnalazione') !== -1 || status === 'in rosa';
    if (!neutral && /(rumor|trattativa|interesse|mercato|monitorare|uscita|entrata)/.test(status)) {
      return { text: 'RUMOR', cls: 'iosudo-badge-rumor' };
    }
    return { text: 'CONFERMATO', cls: 'iosudo-badge-confirmed' };
  }

  function badgeHtml(badge) {
    return '<span class="iosudo-badge ' + escapeHtml(badge.cls || '') + '">' + escapeHtml(badge.text || '') + '</span>';
  }

  function sourceLabel(item, index) {
    const provider = sourceProvider(item);
    const explicit = String(item && (item.sourceName || item.sourceLabel || '') || '').trim();
    const raw = String(item && (item.source || item.url || '') || '').trim();
    let label = provider || (explicit && norm(explicit) !== 'fonte' ? explicit : 'Fonte');
    if (label === 'Fonte' && raw && !/^https?:\/\//i.test(raw)) label = raw;
    if (label === 'Fonte') label = 'Fonte ' + String((index || 0) + 1);
    const date = formatDate(item && item.updatedAt);
    return date ? label + ' · ' + date : label;
  }

  function sourceLink(item, index) {
    const url = sourceHref(item);
    const label = escapeHtml(sourceLabel(item, index));
    const status = item && item.status ? ' title="' + escapeHtml(item.status) + '"' : '';
    if (!url) return '<span class="iosudo-source-link iosudo-source-link-muted"' + status + '>' + label + '</span>';
    return '<a class="iosudo-source-link" href="' + escapeHtml(url) + '" target="_blank" rel="noopener"' + status + '>' + label + '</a>';
  }

  function splitSourceNameTokens(source) {
    const rawName = String(source && (source.sourceName || source.sourceLabel || '') || '').trim();
    if (!rawName || /^https?:\/\//i.test(rawName)) return [source];
    const tokens = rawName.split(/\s*(?:\/|;|\|)\s*/).map(function (token) { return token.trim(); }).filter(Boolean);
    if (tokens.length <= 1) return [source];
    return tokens.map(function (token, index) {
      const clone = Object.assign({}, source, { sourceName: token, sourceLabel: token, _iosudoProvider: token });
      if (index > 0) {
        clone.source = '';
        clone.url = '';
        clone.href = '';
      }
      return clone;
    });
  }

  function sourceList(item) {
    const sources = Array.isArray(item && item.sources) && item.sources.length ? item.sources : [item];
    const expanded = [];
    sources.filter(Boolean).forEach(function (source) {
      splitSourceNameTokens(source).forEach(function (entry) { expanded.push(entry); });
    });
    const seen = new Set();
    return expanded.filter(function (source) {
      const key = norm(sourceProvider(source) || sourceLabel(source, 0)) + '|' + norm(sourceHref(source));
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function sourcesHtml(item) {
    const sources = sourceList(item);
    if (!sources.length) return '';
    return '<div class="iosudo-sources"><span class="iosudo-sources-label">Fonti:</span><div class="iosudo-source-chips">'
      + sources.map(function (source, index) { return sourceLink(source, index); }).join('')
      + '</div></div>';
  }

  function summaryCount(key) {
    const meta = state.data && state.data.meta || {};
    const manifest = state.manifest || {};
    return manifest[key] != null ? manifest[key] : meta[key];
  }

  function liveSummaryCount(key) {
    // V665: le card di riepilogo devono contare le stesse voci mostrate dalle viste rapide.
    // Prima "Giocatori" usava solo il conteggio Excel/manifest (714), mentre la vista GIOCATORI
    // includeva anche le voci listone/rose fantasy deduplicate (es. 1071).
    // Per le amichevoli il manifest contava anche il dato grezzo, mentre la vista mostra solo partite effettive filtrate/deduplicate.
    if (key === 'teams') return (state.data.teams || []).length;
    if (key === 'players') return summaryCount('players') || state.allPlayers.length || 0;
    if (key === 'friendlies') return cachedGlobalRows('friendlies', collectFriendlyRows).length || 0;
    if (key === 'teamTransferTalks') return cachedGlobalRows('rumor', function () { return collectMarketRows('rumor'); }).length || 0;
    if (key === 'officialMoves') return cachedGlobalRows('official', function () { return collectMarketRows('official'); }).length || 0;
    return summaryCount(key) || 0;
  }

  function renderSummary() {
    const cards = [
      ['Squadre', liveSummaryCount('teams')],
      ['Giocatori', liveSummaryCount('players')],
      ['Ufficialita', liveSummaryCount('officialMoves')],
      ['Trattative', liveSummaryCount('teamTransferTalks')],
      ['SOS', liveSummaryCount('injuries')],
      ['Amichevoli', liveSummaryCount('friendlies')]
    ];
    els.summary.innerHTML = cards.map(function (card) {
      return '<article class="iosudo-kpi"><strong>' + escapeHtml(card[1]) + '</strong><span>' + escapeHtml(card[0]) + '</span></article>';
    }).join('');
  }


  function dateValue(value, missingValue) {
    const text = String(value || '').trim();
    if (!text) return missingValue == null ? 0 : missingValue;
    const serialDate = excelSerialDate(text);
    if (serialDate) return serialDate.getTime();
    const parsed = Date.parse(text.length === 10 ? text + 'T00:00:00Z' : text);
    return Number.isNaN(parsed) ? (missingValue == null ? 0 : missingValue) : parsed;
  }

  function itemUpdatedTime(item) {
    return dateValue(item && (item.updatedAt || item.date || item.loadedAt), 0);
  }

  function itemSearchBlob(item, extra) {
    return norm([
      extra,
      item && item.teamName,
      item && item.playerName,
      item && item.target,
      item && item.event,
      item && item.origin,
      item && item.formula,
      item && item.status,
      item && item.direction,
      item && item.directionLabel,
      item && item.note,
      item && item.sourceName,
      item && item.sourceLabel,
      item && item.source
    ].filter(Boolean).join(' '));
  }


  function marketPrimaryName(item) {
    return String(item && (item.playerName || item.target || item.name || item.title) || '').trim();
  }

  function marketGroupKeyFromItem(item) {
    const name = marketPrimaryName(item);
    return canonName(name) || norm(name);
  }

  function normalizeTransferSide(value, fallback) {
    const text = String(value || '').trim();
    if (!text) return fallback || 'SVINCOLATO';
    if (/svincol/i.test(text)) return 'SVINCOLATO';
    return text;
  }

  function sourceEntryTime(entry, parent) {
    return itemUpdatedTime(entry) || itemUpdatedTime(parent) || 0;
  }

  function sourceEntryKey(entry, parent) {
    return norm([sourceProvider(entry), sourceHref(entry), entry && (entry.sourceName || entry.sourceLabel), parent && parent.updatedAt].filter(Boolean).join('|'));
  }

  function sortedSourcesFromItems(items) {
    const rows = [];
    const seen = new Set();
    (items || []).forEach(function (item) {
      sourceList(item).forEach(function (source) {
        const clone = Object.assign({}, source);
        if (!clone.updatedAt && item && item.updatedAt) clone.updatedAt = item.updatedAt;
        if (!clone.status && item && item.status) clone.status = item.status;
        const key = sourceEntryKey(clone, item);
        if (key && seen.has(key)) return;
        if (key) seen.add(key);
        clone._iosudoSourceTime = sourceEntryTime(clone, item);
        rows.push(clone);
      });
    });
    rows.sort(function (a, b) {
      const diff = (b._iosudoSourceTime || 0) - (a._iosudoSourceTime || 0);
      if (diff) return diff;
      return String(sourceLabel(a, 0)).localeCompare(String(sourceLabel(b, 0)), 'it');
    });
    return rows;
  }

  function sourcesFromItemsHtml(items, latestOnly) {
    const sources = sortedSourcesFromItems(items || []);
    if (!sources.length) return '';
    const visible = latestOnly ? sources.slice(0, 1) : sources;
    return '<div class="iosudo-sources"><span class="iosudo-sources-label">' + (latestOnly ? 'Ultimo link:' : 'Fonti:') + '</span><div class="iosudo-source-chips">'
      + visible.map(function (source, index) { return sourceLink(source, index); }).join('')
      + '</div></div>';
  }

  function marketLatestTime(items) {
    return Math.max.apply(Math, (items || []).map(function (item) {
      const sourceTimes = sortedSourcesFromItems([item]).map(function (source) { return source._iosudoSourceTime || 0; });
      return Math.max.apply(Math, [itemUpdatedTime(item)].concat(sourceTimes).concat([0]));
    }).concat([0]));
  }

  function uniqueText(values) {
    const seen = new Set();
    return (values || []).map(function (value) { return String(value || '').trim(); }).filter(function (value) {
      const key = norm(value);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function groupedMarketRows(kind) {
    const groups = new Map();
    (state.data.teams || []).forEach(function (team) {
      const summary = teamSummary(team.id);
      const keys = kind === 'official'
        ? [['officialIncoming', 'Entrata'], ['officialOutgoing', 'Uscita']]
        : [['talksIncoming', 'Entrata'], ['talksOutgoing', 'Uscita']];
      keys.forEach(function (pair) {
        const key = pair[0];
        const label = pair[1];
        (summary[key] || []).forEach(function (item) {
          const name = marketPrimaryName(item);
          const groupKey = marketGroupKeyFromItem(item);
          if (!groupKey) return;
          const enriched = Object.assign({}, item, {
            _iosudoKey: key,
            _iosudoLabel: label,
            _iosudoTeamId: team.id || item.teamId || '',
            _iosudoTeamName: team.name || item.teamName || ''
          });
          const group = groups.get(groupKey) || {
            playerName: name,
            item: enriched,
            items: [],
            teams: new Set(),
            labels: new Set(),
            latestTime: 0,
            kind: kind
          };
          group.items.push(enriched);
          group.teams.add(team.name || item.teamName || '');
          group.labels.add(label);
          const latest = marketLatestTime([enriched]);
          if (latest >= group.latestTime) {
            group.latestTime = latest;
            group.item = enriched;
            group.playerName = name || group.playerName;
            group.team = team;
            group.key = key;
            group.label = label;
          }
          groups.set(groupKey, group);
        });
      });
    });
    return Array.from(groups.values()).map(function (group) {
      group.items.sort(function (a, b) { return marketLatestTime([b]) - marketLatestTime([a]); });
      group._iosudoSearchText = norm([group.playerName, Array.from(group.teams).join(' ')].concat(group.items.map(function (item) { return itemSearchBlob(item, ''); })).join(' '));
      return group;
    }).sort(function (a, b) {
      const diff = (b.latestTime || 0) - (a.latestTime || 0);
      if (diff) return diff;
      return String(a.playerName || '').localeCompare(String(b.playerName || ''), 'it');
    });
  }

  function collectMarketRows(kind) {
    return groupedMarketRows(kind);
  }

  function collectSosRows() {
    const rows = [];
    Object.entries(state.data.injuriesByTeam || {}).forEach(function (entry) {
      const teamId = entry[0];
      const team = getTeam(teamId) || { id: teamId, name: teamId };
      (entry[1] || []).forEach(function (item) {
        rows.push({ team: team, item: item, label: 'SOS' });
      });
    });
    rows.sort(function (a, b) {
      const diff = itemUpdatedTime(b.item) - itemUpdatedTime(a.item);
      if (diff) return diff;
      return String(a.item.playerName || '').localeCompare(String(b.item.playerName || ''), 'it');
    });
    return rows;
  }

  function collectFriendlyRows() {
    const map = new Map();
    Object.entries(state.data.friendliesByTeam || {}).forEach(function (entry) {
      const teamId = entry[0];
      const team = getTeam(teamId) || { id: teamId, name: teamId };
      teamFriendlies(teamId).forEach(function (item) {
        const key = norm([item.date, item.event, item.venue || item.location].join('|'));
        if (!map.has(key)) {
          map.set(key, { item: Object.assign({}, item), teams: new Set(), label: 'Amichevole' });
        }
        map.get(key).teams.add(team.name || item.teamName || teamId);
      });
    });
    return Array.from(map.values()).sort(function (a, b) {
      const diff = dateValue(a.item && a.item.date, Number.MAX_SAFE_INTEGER) - dateValue(b.item && b.item.date, Number.MAX_SAFE_INTEGER);
      if (diff) return diff;
      return String(a.item.event || '').localeCompare(String(b.item.event || ''), 'it');
    });
  }



  function roleDisplayFromValue(value) {
    const raw = String(value || '').trim();
    const key = roleKeyForRoster(raw);
    if (key === 'P' || key === 'D' || key === 'C' || key === 'A') return key;
    const text = norm(raw);
    if (/portiere|goalkeeper/.test(text)) return 'P';
    if (/difens|terzin|bracc|centrale/.test(text)) return 'D';
    if (/centrocamp|mediano|mezzala|trequart|esterno/.test(text)) return 'C';
    if (/attacc|punta|ala/.test(text)) return 'A';
    return '';
  }

  function marketItemRole(item) {
    if (!item) return '';
    const direct = roleDisplayFromValue(item.roleBrief || item.classicRole || item.fantasyRole || item.playerRole || item.role || item.position);
    if (direct) return direct;
    const nested = [].concat(item.items || [], item.sources || []).filter(Boolean);
    for (let i = 0; i < nested.length; i += 1) {
      const role = marketItemRole(nested[i]);
      if (role) return role;
    }
    return '';
  }

  function roleFromAttachedRows(player) {
    const rows = attachedRowsForPlayer(player);
    for (let i = 0; i < rows.length; i += 1) {
      const role = marketItemRole(rows[i] && rows[i].item);
      if (role) return role;
    }
    return '';
  }

  function displayRoleForPlayer(player) {
    if (!player) return '-';
    const direct = roleDisplayFromValue(player.role || player.roleBrief || player.classicRole || player.fantasyRole || player.playerRole || player.rosterRole);
    if (direct) return direct;
    const listone = latestListoneFor(player);
    const fromListone = roleDisplayFromValue(listone && (listone.classicRole || listone.role || listone.rosterRole));
    if (fromListone) return fromListone;
    const fromRows = roleFromAttachedRows(player);
    if (fromRows) return fromRows;
    return '-';
  }

  function isSvincolatoText(value) {
    return /svincolat|free agent|senza squadra/.test(norm(value || ''));
  }

  function officialDestinationFromItem(item, fallback) {
    const all = [].concat(item || [], item && item.items || []).filter(Boolean).sort(function (a, b) {
      return itemUpdatedTime(b) - itemUpdatedTime(a);
    });
    for (let i = 0; i < all.length; i += 1) {
      const entry = all[i];
      const blob = [entry.origin, entry.formula, entry.status, entry.note].filter(Boolean).join(' ');
      if (isSvincolatoText(blob)) return 'Svincolato';
      const origin = cleanOriginTeam(entry.origin);
      if (origin) return origin;
    }
    return fallback || '';
  }

  function officialCurrentTeamForPlayer(player) {
    const officialOut = officialOutgoingForPlayer(player).slice().sort(function (a, b) { return itemUpdatedTime(b) - itemUpdatedTime(a); });
    if (officialOut.length) {
      const destination = officialDestinationFromItem(officialOut[0], '');
      if (destination) return destination;
    }
    const officialIn = officialIncomingForPlayer(player).slice().sort(function (a, b) { return itemUpdatedTime(b) - itemUpdatedTime(a); });
    if (officialIn.length) {
      const item = officialIn[0];
      const team = getTeam(item.teamId) || { name: item.teamName || '' };
      return team.name || item.teamName || '';
    }
    return '';
  }

  function isSerieATeamName(value) {
    const key = teamKey(value);
    if (!key) return false;
    return (state.data && state.data.teams || []).some(function (team) {
      return teamKey(team.name) === key || teamKey(team.id) === key;
    });
  }

  function isOfficiallyOutOfSerieA(player) {
    if (!player) return false;
    const officialOut = officialOutgoingForPlayer(player).slice().sort(function (a, b) { return itemUpdatedTime(b) - itemUpdatedTime(a); });
    if (!officialOut.length) return false;
    const lastOut = officialOut[0];
    const destination = officialDestinationFromItem(lastOut, '');
    if (!destination || isSerieATeamName(destination)) return false;
    const outTime = itemUpdatedTime(lastOut);
    const laterSerieALink = officialIncomingForPlayer(player).concat(talksForPlayer(player)).some(function (item) {
      const itemTime = itemUpdatedTime(item);
      if (outTime && itemTime && itemTime < outTime) return false;
      const team = getTeam(item.teamId) || { name: item.teamName || '' };
      const directionBlob = norm([item.direction, item.directionLabel, item.status, item.note].filter(Boolean).join(' '));
      const looksSerieA = isSerieATeamName(team.name || item.teamName) || directionBlob.indexOf('rinnovo') !== -1 || directionBlob.indexOf('permanenza') !== -1;
      return looksSerieA;
    });
    if (laterSerieALink) return false;
    return true;
  }

  function shouldShowInGlobalPlayers(player) {
    return !isOfficiallyOutOfSerieA(player);
  }

  function marketPlayerName(row) {
    const item = row && row.item || row || {};
    return String(item.playerName || item.target || item.name || item.title || '').trim();
  }

  function marketPlayerRole(row) {
    const item = row && row.item || row || {};
    return marketItemRole(item);
  }

  function marketPlayerKey(row) {
    return [canonName(marketPlayerName(row)), roleKeyForRoster(marketPlayerRole(row))].filter(Boolean).join('::');
  }

  function virtualPlayerId(row) {
    const raw = marketPlayerKey(row) || canonName(marketPlayerName(row));
    return 'market-' + raw.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function roleMatchesMarket(player, role) {
    if (!role) return true;
    const playerRole = roleKeyForRoster(player && player.role || '');
    return !playerRole || playerRole === role;
  }

  function marketNameMatchesPlayer(row, player) {
    if (!row || !player) return false;
    if (itemMatchesPlayer(row.item, player)) return true;
    const name = marketPlayerName(row);
    return sameName(name, player.playerName)
      || sameName(name, player.originalName)
      || sameName(name, player.disambiguatedName)
      || Boolean(player.listone && sameName(name, player.listone.playerName));
  }

  function cleanOriginTeam(value) {
    const text = String(value || '').trim();
    if (!text || /\//.test(text) || /,/.test(text) || /(o|oppure|anche|newcastle|leeds|sunderland)/i.test(text)) return '';
    return text;
  }

  function findPlayerForMarketRow(row) {
    const name = marketPlayerName(row);
    if (!name) return null;
    const teamId = row && row.team && row.team.id || '';
    const role = roleKeyForRoster(marketPlayerRole(row));
    const localCandidates = teamId ? teamPlayers(teamId) : [];
    const local = localCandidates.find(function (player) {
      return marketNameMatchesPlayer(row, player) && roleMatchesMarket(player, role);
    });
    if (local) return local;

    const origin = cleanOriginTeam(row && row.item && row.item.origin);
    if (origin) {
      const originKey = teamKey(origin);
      const byOrigin = state.allPlayers.filter(function (player) {
        return marketNameMatchesPlayer(row, player)
          && roleMatchesMarket(player, role)
          && playerTeamKeys(player).indexOf(originKey) !== -1;
      });
      if (byOrigin.length === 1) return byOrigin[0];
    }

    const global = state.allPlayers.filter(function (player) {
      return marketNameMatchesPlayer(row, player) && roleMatchesMarket(player, role);
    });
    if (global.length === 1) return global[0];
    return null;
  }

  function currentRealTeamForMarketRow(row) {
    const item = row && row.item || {};
    const team = row && row.team || getTeam(item.teamId) || { id: item.teamId || '', name: item.teamName || '' };
    const key = String(row && row.key || '');
    const direction = norm(item.direction || item.directionLabel || row && row.label || '');
    const outgoing = /Outgoing$|talksOutgoing|officialOutgoing/.test(key) || direction.indexOf('uscita') !== -1 || direction.indexOf('outgoing') !== -1;
    const official = /official/.test(key) || norm(item.status).indexOf('ufficial') !== -1;
    const origin = cleanOriginTeam(item.origin);
    if (outgoing) {
      if (official) return officialDestinationFromItem(item, team.name || item.teamName || origin || '');
      return team.name || item.teamName || '';
    }
    if (official) return team.name || item.teamName || origin || '';
    return origin || team.name || item.teamName || '';
  }

  function makeVirtualPlayer(row) {
    const item = row && row.item || {};
    const team = row && row.team || getTeam(item.teamId) || { id: item.teamId || '', name: item.teamName || '' };
    const role = marketPlayerRole(row);
    const currentTeam = currentRealTeamForMarketRow(row);
    const player = {
      id: virtualPlayerId(row),
      virtualMarketPlayer: true,
      playerName: marketPlayerName(row),
      originalName: item.originalName || '',
      disambiguatedName: item.disambiguatedName || '',
      role: role || '',
      teamId: team.id || item.teamId || '',
      teamName: currentTeam || team.name || item.teamName || '',
      realTeam: currentTeam || team.name || item.teamName || '',
      marketTeamId: team.id || item.teamId || '',
      marketTeamName: team.name || item.teamName || '',
      updatedAt: item.updatedAt || item.date || '',
      marketDetail: item.note || item.status || '',
      virtualMarketRows: []
    };
    return player;
  }


  function playerCacheId(player) {
    if (!player) return '';
    return String(player.id || player.playerName || '') + '::' + String(player.teamId || player.teamName || player.realTeam || '');
  }

  function marketRowMatchesKnownPlayer(row, player) {
    if (!row || !player) return false;
    const role = roleKeyForRoster(marketPlayerRole(row));
    if (!roleMatchesMarket(player, role)) return false;
    if (marketNameMatchesPlayer(row, player)) return true;
    const item = row.item || row;
    return itemMatchesPlayer(item, player);
  }

  function marketRowsForKnownPlayer(player) {
    if (!player || player.virtualMarketPlayer) return player && player.virtualMarketRows || [];
    const cacheKey = playerCacheId(player);
    if (cacheKey && state.playerMarketRowsCache && state.playerMarketRowsCache.has(cacheKey)) {
      return state.playerMarketRowsCache.get(cacheKey);
    }
    const rows = [].concat(
      cachedGlobalRows('rumor', function () { return collectMarketRows('rumor'); }),
      cachedGlobalRows('official', function () { return collectMarketRows('official'); })
    ).filter(function (row) {
      return marketRowMatchesKnownPlayer(row, player);
    });
    if (cacheKey) state.playerMarketRowsCache.set(cacheKey, rows);
    return rows;
  }

  function attachMarketRowsForPlayer(player) {
    if (!player || player.virtualMarketPlayer) return;
    const rows = marketRowsForKnownPlayer(player);
    player._iosudoMarketRows = rows;
  }

  function playerLastUpdateTime(player) {
    const values = [itemUpdatedTime(player)];
    talksForPlayer(player).forEach(function (item) { values.push(itemUpdatedTime(item)); });
    officialIncomingForPlayer(player).forEach(function (item) { values.push(itemUpdatedTime(item)); });
    officialOutgoingForPlayer(player).forEach(function (item) { values.push(itemUpdatedTime(item)); });
    injuriesForPlayer(player).forEach(function (item) { values.push(itemUpdatedTime(item)); });
    values.push(dateValue(player && player.injuryUpdatedAt, 0));
    return Math.max.apply(Math, values.filter(function (value) { return Number.isFinite(value); }).concat([0]));
  }

  function playerLastUpdateText(player) {
    const time = playerLastUpdateTime(player);
    if (!time) return '-';
    return formatDate(new Date(time).toISOString().slice(0, 10));
  }

  function listonePlayerId(item) {
    const raw = String(item && (item.fantacalcioId || item.id || item.playerName || '') || '');
    return 'listone-' + raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + roleKeyForRoster(item && (item.classicRole || item.role || ''));
  }

  function sameListonePerson(listone, player) {
    if (!listone || !player) return false;
    if (player.listone && listone.fantacalcioId && String(player.listone.fantacalcioId || '') === String(listone.fantacalcioId || '')) return true;
    const listRole = roleKeyForRoster(listone.classicRole || listone.role || listone.rosterRole || '');
    const playerRole = roleKeyForRoster(player.role || player.classicRole || player.rosterRole || '');
    if (listRole && playerRole && listRole !== playerRole) return false;
    const listName = listone.playerName || listone.name;
    const same = sameName(listName, player.playerName)
      || sameName(listName, player.originalName)
      || sameName(listName, player.disambiguatedName)
      || Boolean(player.listone && sameName(listName, player.listone.playerName));
    if (!same) return false;
    const listTeam = teamKey(listone.realTeam || listone.realTeamOriginal || listone.teamName || '');
    const playerTeams = new Set(playerTeamKeys(player));
    if (listTeam && playerTeams.size && playerTeams.has(listTeam)) return true;
    return true;
  }

  function findPlayerForListoneEntry(entry) {
    const matches = state.allPlayers.filter(function (player) { return sameListonePerson(entry, player); });
    if (matches.length === 1) return matches[0];
    if (matches.length > 1) {
      const listTeam = teamKey(entry.realTeam || entry.realTeamOriginal || entry.teamName || '');
      const byTeam = matches.filter(function (player) { return playerTeamKeys(player).indexOf(listTeam) !== -1; });
      if (byTeam.length === 1) return byTeam[0];
      const withSameId = matches.filter(function (player) { return player.listone && entry.fantacalcioId && String(player.listone.fantacalcioId || '') === String(entry.fantacalcioId || ''); });
      if (withSameId.length === 1) return withSameId[0];
    }
    return null;
  }

  function findRecordForListoneEntry(entry, rowsByKey) {
    const real = findPlayerForListoneEntry(entry);
    if (real) return rowsByKey.get('real:' + String(real.id || '')) || null;
    const listName = entry && (entry.playerName || entry.name) || '';
    const listRole = roleKeyForRoster(entry && (entry.classicRole || entry.role || entry.rosterRole || ''));
    const listTeam = teamKey(entry && (entry.realTeam || entry.realTeamOriginal || entry.teamName || ''));
    const records = Array.from(rowsByKey.values()).filter(function (record) {
      const player = record && record.player;
      if (!player || !player.virtualMarketPlayer) return false;
      const playerRole = roleKeyForRoster(player.role || '');
      if (listRole && playerRole && listRole !== playerRole) return false;
      if (!sameName(listName, player.playerName)) return false;
      if (listTeam) {
        const teams = new Set(playerTeamKeys(player));
        if (teams.size && teams.has(listTeam)) return true;
      }
      return true;
    });
    return records.length === 1 ? records[0] : null;
  }

  function makeListoneOnlyPlayer(item) {
    const teamName = item.realTeamOriginal || item.teamName || item.realTeam || '';
    return {
      id: listonePlayerId(item),
      listoneOnlyPlayer: true,
      playerName: item.playerName || item.name || 'Giocatore',
      originalName: item.playerName || item.name || '',
      disambiguatedName: item.playerName || item.name || '',
      role: roleKeyForRoster(item.classicRole || item.role || item.rosterRole || ''),
      teamId: teamKey(teamName),
      teamName: teamName,
      realTeam: teamName,
      realTeamOriginal: teamName,
      updatedAt: '',
      marketDetail: '',
      listone: item,
      virtualMarketRows: []
    };
  }

  function applyListoneToPlayer(player, item) {
    if (!player || !item) return;
    player.listone = player.listone || item;
    if (!roleDisplayFromValue(player.role)) player.role = roleKeyForRoster(item.classicRole || item.role || item.rosterRole || '') || player.role;
    const listTeam = item.realTeamOriginal || item.teamName || item.realTeam || '';
    const currentTeam = player.realTeam || player.teamName || player.realTeamOriginal || '';
    const hasOfficialCurrent = Boolean(officialCurrentTeamForPlayer(player) || player.newAcquisition || player.marketSource);
    if (listTeam && !hasOfficialCurrent) {
      player.realTeamOriginal = listTeam;
      player.realTeam = listTeam;
      player.teamName = listTeam;
    } else if (listTeam && !currentTeam) {
      player.realTeamOriginal = listTeam;
      player.realTeam = listTeam;
      player.teamName = listTeam;
    }
  }

  function addListoneRowsToPlayers(rowsByKey) {
    if (!state.latestListone || !state.latestListone.active) return;
    const seen = new Set();
    (state.latestListone.players || []).forEach(function (item) {
      const unique = String(item.fantacalcioId || '') + '::' + String(item.playerName || '') + '::' + String(item.classicRole || item.role || '') + '::' + String(item.realTeam || item.realTeamOriginal || '');
      if (seen.has(unique)) return;
      seen.add(unique);
      const record = findRecordForListoneEntry(item, rowsByKey);
      if (record && record.player) {
        applyListoneToPlayer(record.player, item);
        if (record.player.virtualMarketPlayer && !record.player.listoneOnlyPlayer) record.player.listoneMatchedVirtual = true;
        return;
      }
      const player = makeListoneOnlyPlayer(item);
      applyLiveRosterMatchToPlayer(player);
      const key = 'listone:' + listonePlayerId(item);
      if (!rowsByKey.has(key)) rowsByKey.set(key, { player: player, item: player, updatedTime: 0, marketRows: [] });
      state.virtualPlayers.set(player.id, player);
    });
  }

  function collectPlayerRows() {
    const rowsByKey = new Map();
    state.virtualPlayers = new Map();

    state.allPlayers.forEach(function (player) {
      player._iosudoMarketRows = [];
      rowsByKey.set('real:' + String(player.id || ''), { player: player, item: player, updatedTime: playerLastUpdateTime(player), marketRows: [] });
    });

    [].concat(
      cachedGlobalRows('rumor', function () { return collectMarketRows('rumor'); }),
      cachedGlobalRows('official', function () { return collectMarketRows('official'); })
    ).forEach(function (row) {
      const name = marketPlayerName(row);
      if (!name) return;
      const existing = findPlayerForMarketRow(row);
      if (existing) {
        const key = 'real:' + String(existing.id || '');
        const record = rowsByKey.get(key) || { player: existing, item: existing, updatedTime: playerLastUpdateTime(existing), marketRows: [] };
        record.marketRows.push(row);
        existing._iosudoMarketRows = record.marketRows;
        record.updatedTime = Math.max(record.updatedTime || 0, itemUpdatedTime(row.item));
        rowsByKey.set(key, record);
        return;
      }

      const key = 'virtual:' + marketPlayerKey(row);
      let record = rowsByKey.get(key);
      if (!record) {
        const player = makeVirtualPlayer(row);
        record = { player: player, item: player, updatedTime: 0, marketRows: [] };
        rowsByKey.set(key, record);
        state.virtualPlayers.set(player.id, player);
      }
      record.marketRows.push(row);
      record.player.virtualMarketRows = record.marketRows;
      if (!roleDisplayFromValue(record.player.role)) {
        record.player.role = marketPlayerRole(row) || record.player.role;
      }
      const currentTeam = currentRealTeamForMarketRow(row);
      if (currentTeam) {
        record.player.realTeam = currentTeam;
        record.player.teamName = currentTeam;
      }
      record.updatedTime = Math.max(record.updatedTime || 0, itemUpdatedTime(row.item));
      if (!record.player.updatedAt && row.item && row.item.updatedAt) record.player.updatedAt = row.item.updatedAt;
    });

    addListoneRowsToPlayers(rowsByKey);

    rowsByKey.forEach(function (record) {
      const resolvedRole = displayRoleForPlayer(record.player);
      if (resolvedRole && resolvedRole !== '-') record.player.role = resolvedRole;
      applyLiveRosterMatchToPlayer(record.player);
      const officialTeam = officialCurrentTeamForPlayer(record.player);
      if (officialTeam) {
        record.player.realTeamCurrent = officialTeam;
        record.player.realTeam = officialTeam;
        record.player.teamName = officialTeam;
      }
    });

    return Array.from(rowsByKey.values()).filter(function (record) {
      const player = record && record.player;
      const listone = playerInLatestListone(player);
      return shouldShowInGlobalPlayers(player) || Boolean(listone && listone.present) || Boolean(player && player.listoneOnlyPlayer) || Boolean(fantasyRosterText(player));
    }).sort(function (a, b) {
      const diff = (b.updatedTime || 0) - (a.updatedTime || 0);
      if (diff) return diff;
      const roleOrder = { P: 0, D: 1, C: 2, A: 3 };
      const ar = roleOrder[String(a.player.role || '').charAt(0).toUpperCase()] ?? 9;
      const br = roleOrder[String(b.player.role || '').charAt(0).toUpperCase()] ?? 9;
      if (ar !== br) return ar - br;
      return String(a.player.playerName || '').localeCompare(String(b.player.playerName || ''), 'it');
    });
  }

  function invalidatePlayerRowsCache() {
    state.playerRowsCache = { dirty: true, rows: [] };
    state.fastPlayerRowsCache = { dirty: true, rows: [] };
    state.playerDetailCache = new Map();
    state.playerMarketRowsCache = new Map();
  }



  function marketRowCanCreateVirtualPlayer(row) {
    const name = marketPlayerName(row);
    if (!name) return false;
    const text = String(name || '').trim();
    const blob = norm(text);
    if (!blob) return false;
    // Evita pseudo-giocatori o righe aggregate tipo "A / B" che non identificano una sola persona.
    if (/[\/,]/.test(text) || /\b(o|oppure|anche)\b/i.test(text)) return false;
    if (/^(da definire|profilo|profili|diversi profili|attaccante|difensore|centrocampista|portiere|esterno|punta)$/.test(blob)) return false;
    return true;
  }

  function marketRowsAreOfficial(rows) {
    return (rows || []).some(function (row) {
      const item = row && row.item || row || {};
      return /official/i.test(String(row && row.key || '')) || norm([item.status, item.directionLabel, item.direction].filter(Boolean).join(' ')).indexOf('ufficial') !== -1;
    });
  }

  function fastPlayerSourceText(player, listonePresent) {
    if (player && player.virtualMarketPlayer) {
      const labels = [];
      function add(value) {
        const label = compactSourceLabel(value);
        if (label && labels.indexOf(label) === -1) labels.push(label);
      }
      (player.virtualMarketRows || []).forEach(function (row) {
        const item = row && row.item || row || {};
        add(item.sourceName || item.sourceLabel || item.originalSource || item.source || item.url || item.articleUrl || item.href);
        (item.sources || []).forEach(function (source) { add(source.sourceName || source.sourceLabel || source.source || source.url || source.articleUrl || source.href); });
      });
      const prefix = marketRowsAreOfficial(player.virtualMarketRows) ? 'Ufficialita' : 'Rumor';
      return labels.length ? prefix + ' · ' + labels.slice(0, 3).join(' · ') : prefix;
    }
    return listonePresent ? 'Listone' : 'Dati ioSudo';
  }

  function addMarketOnlyPlayersToFastRows(rows, seen) {
    const records = new Map();
    const existingPersonKeys = new Set((rows || []).map(function (row) { return fastListoneDedupKey(row.player); }).filter(Boolean));
    const marketRows = [].concat(
      cachedGlobalRows('rumor', function () { return collectMarketRows('rumor'); }),
      cachedGlobalRows('official', function () { return collectMarketRows('official'); })
    );
    marketRows.forEach(function (row) {
      if (!marketRowCanCreateVirtualPlayer(row)) return;
      const existing = findPlayerForMarketRow(row);
      if (existing) {
        const attached = existing._iosudoMarketRows || [];
        if (attached.indexOf(row) === -1) attached.push(row);
        existing._iosudoMarketRows = attached;
        return;
      }
      const key = 'market:' + marketPlayerKey(row);
      if (!key || key === 'market:') return;
      let record = records.get(key);
      if (!record) {
        const player = makeVirtualPlayer(row);
        record = { player: player, marketRows: [] };
        records.set(key, record);
      }
      record.marketRows.push(row);
      record.player.virtualMarketRows = record.marketRows;
      const currentTeam = currentRealTeamForMarketRow(row);
      if (currentTeam) {
        record.player.realTeam = currentTeam;
        record.player.teamName = currentTeam;
      }
      if (!record.player.updatedAt && row.item && row.item.updatedAt) record.player.updatedAt = row.item.updatedAt;
    });
    records.forEach(function (record) {
      const player = record.player;
      const personKey = fastListoneDedupKey(player);
      if (personKey && existingPersonKeys.has(personKey)) return;
      if (personKey) existingPersonKeys.add(personKey);
      const key = 'market:' + String(player.id || personKey || '');
      if (seen.has(key)) return;
      seen.add(key);
      applyLiveRosterMatchToPlayer(player);
      state.virtualPlayers.set(player.id, player);
      rows.push(prepareFastPlayerRow(player));
    });
  }

  function fastPlayerUpdatedTime(player) {
    return Math.max(
      itemUpdatedTime(player),
      dateValue(player && player.injuryUpdatedAt, 0),
      dateValue(state.manifest && state.manifest.updatedAt, 0),
      dateValue(state.data && state.data.meta && state.data.meta.updatedAt, 0)
    );
  }

  function fastPlayerStatusText(player) {
    if (player && player.virtualMarketPlayer) return marketRowsAreOfficial(player.virtualMarketRows) ? 'UFFICIALE' : 'RUMOR';
    const status = norm([player && player.marketStatus, player && player.marketDetail, player && player.marketNote].filter(Boolean).join(' '));
    if (player && player.newAcquisition) return 'NUOVO';
    if (!status || status.indexOf('nessuna segnalazione') !== -1 || status === 'in rosa') return 'CONFERMATO';
    if (/(rumor|trattativa|interesse|mercato|monitorare|uscita|entrata|offerta|sondaggio)/.test(status)) return 'RUMOR';
    return 'CONFERMATO';
  }

  function fastPlayerBadge(player) {
    const text = fastPlayerStatusText(player);
    if (text === 'NUOVO' || text === 'UFFICIALE') return { text: text, cls: 'iosudo-badge-new' };
    if (text === 'RUMOR') return { text: text, cls: 'iosudo-badge-rumor' };
    return { text: text, cls: 'iosudo-badge-confirmed' };
  }

  function fastPlayerHasSos(player) {
    if (player && player.sosFantaFlag) return true;
    return isPhysicalIssue(player && (player.physicalStatus || player.injuryStatus || player.formationPhysicalStatus));
  }

  function fastCurrentTeamText(player) {
    const listone = player && player.listone;
    const listTeam = listone && (listone.realTeamOriginal || listone.teamName || listone.realTeam);
    const real = String(player && (player.realTeamCurrent || player.realTeam || player.teamName || player.realTeamOriginal) || listTeam || '').trim();
    const marketTeam = String(player && (player.marketTeamName || '') || '').trim();
    if (player && player.virtualMarketPlayer && marketTeam && real && teamKey(marketTeam) !== teamKey(real)) return real + ' -> ' + marketTeam;
    if (player && player.virtualMarketPlayer && marketTeam && !real) return marketTeam;
    return real || '-';
  }

  function fastPlayerSearchText(player, badgeText) {
    return norm([
      player && player.playerName,
      player && player.originalName,
      player && player.disambiguatedName,
      displayRoleForPlayer(player),
      fastCurrentTeamText(player),
      player && player.teamName,
      player && player.marketTeamName,
      player && player.virtualMarketPlayer ? 'rumor trattativa mercato ufficialita' : '',
      fantasyRosterText(player),
      badgeText,
      fastPlayerHasSos(player) ? 'SOS' : '',
      player && player.listone ? 'listone presente si' : 'listone no assente'
    ].filter(Boolean).join(' '));
  }


  function nameInfoV698(value) {
    const raw = canonName(value || '');
    const tokens = raw.split(/\s+/).filter(Boolean);
    const families = [];
    let initial = '';
    function addFamily(x) { x = String(x || '').trim(); if (x && families.indexOf(x) === -1) families.push(x); }
    if (!tokens.length) return { raw: '', tokens: [], families: [], initial: '' };
    if (tokens.length >= 2 && tokens[0].length === 1) {
      initial = tokens[0];
      addFamily(tokens.slice(1).join(' '));
      addFamily(tokens[tokens.length - 1]);
    } else if (tokens.length >= 2 && tokens[tokens.length - 1].length === 1) {
      initial = tokens[tokens.length - 1];
      addFamily(tokens.slice(0, -1).join(' '));
      addFamily(tokens[tokens.length - 2]);
    } else if (tokens.length === 1) {
      addFamily(tokens[0]);
    } else {
      initial = tokens[0].charAt(0);
      addFamily(tokens[tokens.length - 1]);
      if (tokens.length >= 3) addFamily(tokens.slice(-2).join(' '));
      addFamily(tokens.slice(1).join(' '));
    }
    return { raw: raw, tokens: tokens, families: families, initial: initial };
  }

  function samePersonNameV698(a, b, allowSurnameOnly) {
    const ia = nameInfoV698(a);
    const ib = nameInfoV698(b);
    if (!ia.raw || !ib.raw) return false;
    if (ia.raw === ib.raw) return true;
    const familyHit = ia.families.some(function (family) { return ib.families.indexOf(family) !== -1; });
    if (!familyHit) return false;
    if (ia.initial && ib.initial && ia.initial !== ib.initial) return false;
    if (allowSurnameOnly && (ia.tokens.length === 1 || ib.tokens.length === 1)) return true;
    return Boolean(ia.initial && ib.initial && ia.initial === ib.initial);
  }

  function samePersonRoleV698(a, b, allowSurnameOnly) {
    if (!a || !b) return false;
    const ar = roleKeyForRoster((a.role || (a.listone && (a.listone.classicRole || a.listone.role)) || ''));
    const br = roleKeyForRoster((b.role || (b.listone && (b.listone.classicRole || b.listone.role)) || ''));
    if (ar && br && ar !== br) return false;
    return samePersonNameV698(a.playerName || a.originalName || a.disambiguatedName, b.playerName || b.originalName || b.disambiguatedName, allowSurnameOnly);
  }

  function mergeFastPlayerRowV698(target, source) {
    if (!target || !target.player || !source || !source.player) return target;
    const a = target.player;
    const b = source.player;
    if (!a.listone && b.listone) a.listone = b.listone;
    if (!a.fantasyRoster && b.fantasyRoster) a.fantasyRoster = b.fantasyRoster;
    if (!a.rosterCost && b.rosterCost) a.rosterCost = b.rosterCost;
    if (!a.rosterRole && b.rosterRole) a.rosterRole = b.rosterRole;
    a._iosudoMarketRows = uniqueMarketItems([].concat(a._iosudoMarketRows || [], b._iosudoMarketRows || [], b.virtualMarketRows || []), 'dedupe-v698-market');
    const aInfo = nameInfoV698(a.playerName || '');
    const bInfo = nameInfoV698(b.playerName || '');
    if ((bInfo.tokens.length > aInfo.tokens.length || String(b.playerName || '').length > String(a.playerName || '').length) && !b.listoneOnlyPlayer) {
      a.playerName = b.playerName || a.playerName;
      a.originalName = b.originalName || b.playerName || a.originalName;
      a.disambiguatedName = b.disambiguatedName || b.playerName || a.disambiguatedName;
    }
    const fresh = prepareFastPlayerRow(a);
    Object.assign(target, fresh);
    return target;
  }

  function findUniqueFastRowForListoneV698(item, rows) {
    const probeTeam = item && (item.realTeamOriginal || item.teamName || item.realTeam || '');
    const probe = {
      playerName: item && (item.playerName || item.name) || '',
      originalName: item && (item.playerName || item.name) || '',
      disambiguatedName: item && (item.playerName || item.name) || '',
      role: roleKeyForRoster(item && (item.classicRole || item.role || item.rosterRole || '')),
      realTeam: probeTeam,
      teamName: probeTeam,
      realTeamOriginal: probeTeam,
      listone: item
    };
    const strict = (rows || []).filter(function (row) {
      const p = row && row.player;
      if (!p || p.listoneOnlyPlayer || p.virtualMarketPlayer) return false;
      if (!samePersonRoleV698(p, probe, true)) return false;
      const pt = teamKey(p.realTeam || p.teamName || p.realTeamOriginal || '');
      const it = teamKey(probeTeam || '');
      return !it || !pt || it === pt;
    });
    if (strict.length === 1) return strict[0];
    const loose = (rows || []).filter(function (row) {
      const p = row && row.player;
      return p && !p.listoneOnlyPlayer && !p.virtualMarketPlayer && samePersonRoleV698(p, probe, true);
    });
    return loose.length === 1 ? loose[0] : null;
  }

  function fastListoneDedupKey(player) {
    return [
      canonName(player && (player.playerName || player.originalName || player.disambiguatedName || '')),
      roleKeyForRoster(player && player.role || ''),
      teamKey(player && (player.realTeam || player.teamName || player.realTeamOriginal || ''))
    ].join('::');
  }

  function prepareFastPlayerRow(player) {
    const badge = fastPlayerBadge(player);
    const updatedTime = fastPlayerUpdatedTime(player);
    const listonePresent = Boolean(player && player.listone) || Boolean(playerInLatestListone(player).present);
    const row = {
      player: player,
      item: player,
      updatedTime: updatedTime,
      marketRows: [],
      _iosudoFastPlayerRow: true,
      _iosudoFastBadge: badge,
      _iosudoFastSos: fastPlayerHasSos(player),
      _iosudoFastFantasy: fantasyRosterText(player) || '-',
      _iosudoFastTeam: fastCurrentTeamText(player),
      _iosudoFastUpdated: updatedTime ? (formatDate(new Date(updatedTime).toISOString().slice(0, 10)) || '-') : '-',
      _iosudoFastListonePresent: listonePresent,
      _iosudoFastSource: fastPlayerSourceText(player, listonePresent),
      _iosudoPlayerSearchText: fastPlayerSearchText(player, badge.text)
    };
    return row;
  }

  function fastPlayerDedupKeysV698(player) {
    const role = roleKeyForRoster(player && player.role || player && player.listone && player.listone.classicRole || '');
    const team = teamKey(player && (player.realTeam || player.teamName || player.realTeamOriginal || '') || player && player.listone && (player.listone.realTeamOriginal || player.listone.realTeam || player.listone.teamName) || '');
    const names = uniqueValues([
      player && player.playerName,
      player && player.originalName,
      player && player.disambiguatedName,
      player && player.listone && player.listone.playerName
    ]);
    const keys = [];
    names.forEach(function (name) {
      const c = canonName(name);
      if (c) keys.push(c + '::' + role + '::' + team);
      const noInitial = c.replace(/\b[a-z]\b/g, '').replace(/\s+/g, ' ').trim();
      if (noInitial && noInitial !== c) keys.push(noInitial + '::' + role + '::' + team);
    });
    return uniqueValues(keys);
  }

  function dedupeFastPlayerRowsV698(rows) {
    const out = [];
    (rows || []).forEach(function (row) {
      const p = row && row.player;
      if (!p) return;
      const hit = out.find(function (existing) {
        const q = existing && existing.player;
        if (!q) return false;
        const sameTeam = teamKey(p.realTeam || p.teamName || p.realTeamOriginal || '') === teamKey(q.realTeam || q.teamName || q.realTeamOriginal || '');
        if (!sameTeam && !(p.listoneOnlyPlayer || q.listoneOnlyPlayer)) return false;
        return samePersonRoleV698(p, q, true);
      });
      if (hit) {
        if (hit.player && hit.player.listoneOnlyPlayer && !p.listoneOnlyPlayer) {
          mergeFastPlayerRowV698(row, hit);
          const index = out.indexOf(hit);
          if (index !== -1) out[index] = row;
        } else {
          mergeFastPlayerRowV698(hit, row);
        }
        return;
      }
      out.push(row);
    });
    return out;
  }

  function collectFastPlayerRows() {
    if (state.fastPlayerRowsCache && !state.fastPlayerRowsCache.dirty) return state.fastPlayerRowsCache.rows || [];
    const rows = [];
    const seen = new Set();
    state.virtualPlayers = new Map();
    (state.allPlayers || []).forEach(function (player) {
      if (!player) return;
      applyLiveRosterMatchToPlayer(player);
      const key = 'real:' + String(player.id || fastListoneDedupKey(player));
      if (seen.has(key)) return;
      seen.add(key);
      rows.push(prepareFastPlayerRow(player));
    });

    // Mantiene eventuali giocatori presenti solo nel listone, ma con matching leggero.
    if (state.latestListone && state.latestListone.active) {
      const existingKeys = new Set(rows.map(function (row) { return fastListoneDedupKey(row.player); }));
      (state.latestListone.players || []).forEach(function (item) {
        const teamName = item.realTeamOriginal || item.teamName || item.realTeam || '';
        const probe = {
          playerName: item.playerName || item.name || '',
          originalName: item.playerName || item.name || '',
          disambiguatedName: item.playerName || item.name || '',
          role: roleKeyForRoster(item.classicRole || item.role || item.rosterRole || ''),
          realTeam: teamName,
          teamName: teamName,
          realTeamOriginal: teamName,
          listone: item
        };
        const matchedRow = findUniqueFastRowForListoneV698(item, rows);
        if (matchedRow && matchedRow.player) {
          applyListoneToPlayer(matchedRow.player, item);
          applyLiveRosterMatchToPlayer(matchedRow.player);
          Object.assign(matchedRow, prepareFastPlayerRow(matchedRow.player));
          const matchedKey = fastListoneDedupKey(matchedRow.player);
          if (matchedKey) existingKeys.add(matchedKey);
          return;
        }
        // V723: non materializza più i giocatori presenti solo nel listone dentro la vista GIOCATORI.
        // Il KPI e la vista devono restare allineati al master Excel/Rose distinto; il listone continua
        // a decorare i giocatori già agganciati, ma non crea righe virtuali aggiuntive.
        return;
      });
    }

    // V665: performance mobile: i giocatori presenti solo in RUMOR/UFFICIALITA non vengono materializzati in GIOCATORI; la Rosa resta disponibile dentro la scheda squadra.
    // Restano visibili nelle rispettive sezioni mercato; GIOCATORI resta limitata a rose Serie A, listone e rose fantasy.
    // addMarketOnlyPlayersToFastRows(rows, seen);

    const dedupedRowsV698 = dedupeFastPlayerRowsV698(rows);
    rows.length = 0;
    dedupedRowsV698.forEach(function (row) { rows.push(row); });

    rows.sort(function (a, b) {
      const roleOrder = { P: 0, D: 1, C: 2, A: 3 };
      const ar = roleOrder[String(a.player.role || '').charAt(0).toUpperCase()] ?? 9;
      const br = roleOrder[String(b.player.role || '').charAt(0).toUpperCase()] ?? 9;
      if (ar !== br) return ar - br;
      return String(a.player.playerName || '').localeCompare(String(b.player.playerName || ''), 'it');
    });
    state.fastPlayerRowsCache = { dirty: false, rows: rows };
    return rows;
  }

  function preparePlayerRowForCache(row) {
    const player = row && row.player || row;
    if (!player) return row;
    const badge = marketBadgeForPlayer(player).text;
    const listone = playerInLatestListone(player);
    row._iosudoPlayerSearchText = norm([
      player.playerName,
      displayRoleForPlayer(player),
      currentRealTeamText(player),
      player.teamName,
      fantasyRosterText(player),
      badge,
      playerHasSos(player) ? 'SOS' : '',
      listone.present ? 'listone presente si' : 'listone no assente'
    ].filter(Boolean).join(' '));
    return row;
  }

  function playerRowsForView() {
    // V651: la vista GIOCATORI usa una lista compatta e indicizzata.
    // I dettagli completi di mercato/SOS restano disponibili quando si apre il singolo giocatore.
    return collectFastPlayerRows();
  }

  function prewarmPlayerRowsCache() {
    // V649: cache GIOCATORI costruita solo quando l'utente apre davvero la vista.
    // Evita lavoro pesante in background mentre si naviga tra Squadre, Mercato, SOS e Amichevoli.
    return;
  }

  function scheduleRenderResults() {
    if (state.renderTimer) window.clearTimeout(state.renderTimer);
    state.renderTimer = window.setTimeout(function () {
      state.renderTimer = 0;
      renderResults();
    }, state.quickView === 'players' ? 140 : 70);
  }

  function defaultVisibleCap(view) {
    if (view === 'players') return 36;
    if (view === 'rumor' || view === 'official') return 40;
    return 80;
  }

  function capStep(view) {
    return view === 'players' ? 36 : 60;
  }

  function resetVisibleCap(view) {
    if (!view || view === 'teams') return;
    state.visibleCaps[view] = defaultVisibleCap(view);
  }

  function visibleCapForView(view) {
    const current = Number(state.visibleCaps && state.visibleCaps[view]);
    return Number.isFinite(current) && current > 0 ? current : defaultVisibleCap(view);
  }

  function increaseVisibleCap(view) {
    if (!view || view === 'teams') return;
    state.visibleCaps[view] = visibleCapForView(view) + capStep(view);
  }

  function restoreScrollPosition(y) {
    const target = Math.max(0, Number(y) || 0);
    const apply = function () { window.scrollTo({ top: target, left: 0, behavior: 'auto' }); };
    window.requestAnimationFrame(function () {
      apply();
      window.setTimeout(apply, 0);
    });
  }

  function cachedGlobalRows(key, builder) {
    if (!state.globalRowsCache) state.globalRowsCache = {};
    if (Array.isArray(state.globalRowsCache[key])) return state.globalRowsCache[key];
    const rows = builder();
    state.globalRowsCache[key] = rows;
    return rows;
  }

  function invalidateGlobalRowsCache() {
    state.globalRowsCache = { rumor: null, official: null, sos: null, friendlies: null };
  }

  function playerRowMatchesQuery(row, q) {
    if (!q) return true;
    return String(row && row._iosudoPlayerSearchText || '').indexOf(q) !== -1;
  }

  function rowMatchesQuery(row, q) {
    if (!q) return true;
    if (row && row._iosudoSearchText) return row._iosudoSearchText.indexOf(q) !== -1;
    if (row && Array.isArray(row.items)) {
      const teamsText = row.teams ? Array.from(row.teams).join(' ') : row.team && row.team.name;
      return norm([row.playerName, teamsText].concat(row.items.map(function (item) { return itemSearchBlob(item, ''); })).join(' ')).indexOf(q) !== -1;
    }
    const item = row && row.item || row;
    const teams = row && row.teams ? Array.from(row.teams).join(' ') : row && row.team && row.team.name;
    return itemSearchBlob(item, teams).indexOf(q) !== -1;
  }


  function currentRealTeamText(player) {
    const officialTeam = officialCurrentTeamForPlayer(player);
    if (officialTeam) return officialTeam;
    const listone = playerInLatestListone(player);
    const listoneTeam = listone && listone.item && (listone.item.realTeamOriginal || listone.item.teamName || listone.item.realTeam);
    if (listoneTeam) return String(listoneTeam || '').trim();
    return String(player && (player.realTeamCurrent || player.realTeam || player.teamName || player.realTeamOriginal) || '').trim() || '-';
  }

  function compactSourceLabel(value) {
    const text = String(value || '').trim();
    const blob = norm(text);
    if (!text) return '';
    if (blob.indexOf('sosfanta') !== -1 || blob.indexOf('sos fanta') !== -1) return 'SOS Fanta';
    if (blob.indexOf('tuttomercatoweb') !== -1 || blob === 'tmw' || blob.indexOf(' tmw ') !== -1) return 'TMW';
    if (blob.indexOf('transfermarkt') !== -1) return 'Transfermarkt';
    if (blob.indexOf('eurosport') !== -1) return 'Eurosport';
    if (blob.indexOf('calciolecce') !== -1 || blob.indexOf('calcio lecce') !== -1) return 'CalcioLecce';
    if (blob.indexOf('gianlucadimarzio') !== -1 || blob.indexOf('di marzio') !== -1) return 'Gianluca Di Marzio';
    if (blob.indexOf('fantacalcio') !== -1) return 'Fantacalcio.it';
    if (blob.indexOf('pazzidifanta') !== -1 || blob.indexOf('pazzi di fanta') !== -1) return 'Pazzi di Fanta';
    if (blob.indexOf('fanpage') !== -1) return 'Fanpage';
    if (blob.indexOf('as roma') !== -1 || blob.indexOf('asroma') !== -1) return 'AS Roma';
    if (/^https?:\/\//i.test(text)) {
      try { return new URL(text).hostname.replace(/^www\./, '').split('.')[0]; } catch (_) { return 'Fonte'; }
    }
    return text.split('/')[0].trim();
  }

  function playerSourceText(player, row) {
    const labels = [];
    function add(value) {
      const label = compactSourceLabel(value);
      if (label && labels.indexOf(label) === -1) labels.push(label);
    }
    const listone = playerInLatestListone(player);
    if ((listone && listone.present) || player.listone || player.listoneOnlyPlayer) add('Listone');
    const marketRows = [].concat(row && row.marketRows || [], player && player._iosudoMarketRows || [], player && player.virtualMarketRows || []);
    marketRows.forEach(function (marketRow) {
      const item = marketRow && marketRow.item || marketRow || {};
      add(item.sourceName || item.sourceLabel || item.source || item.url || item.articleUrl || item.originalSource);
      (item.sources || []).forEach(function (source) { add(source.sourceName || source.sourceLabel || source.source || source.url || source.articleUrl); });
    });
    officialIncomingForPlayer(player).concat(officialOutgoingForPlayer(player)).concat(talksForPlayer(player)).forEach(function (item) {
      add(item.sourceName || item.sourceLabel || item.source || item.url || item.articleUrl);
      (item.sources || []).forEach(function (source) { add(source.sourceName || source.sourceLabel || source.source || source.url || source.articleUrl); });
    });
    injuriesForPlayer(player).forEach(function (item) {
      add(item.sourceName || item.sourceLabel || item.source || item.url || item.articleUrl || 'SOS Fanta');
    });
    return labels.length ? labels.join(' · ') : '-';
  }

  function globalPlayerItem(row) {
    if (row && row._iosudoPlayerHtml) return row._iosudoPlayerHtml;
    const player = row.player || row.item || row;
    const fast = row && row._iosudoFastPlayerRow;
    const badge = fast ? row._iosudoFastBadge : marketBadgeForPlayer(player);
    const displayRole = displayRoleForPlayer(player);
    const sos = (fast ? row._iosudoFastSos : playerHasSos(player)) ? '<span class="iosudo-badge iosudo-badge-sos">SOS</span>' : '';
    const listonePresent = fast ? Boolean(row._iosudoFastListonePresent) : playerInLatestListone(player).present;
    const listoneBadge = '<span class="iosudo-pill ' + (listonePresent ? 'iosudo-listone-ok' : 'iosudo-listone-missing') + '">Listone: ' + (listonePresent ? 'SI' : 'NO') + '</span>';
    const fantasy = fast ? row._iosudoFastFantasy : (fantasyRosterText(player) || '-');
    const updated = fast ? row._iosudoFastUpdated : playerLastUpdateText(player);
    const currentTeam = fast ? row._iosudoFastTeam : currentRealTeamText(player);
    const sourceText = fast ? row._iosudoFastSource : playerSourceText(player, row);
    const html = '<article class="iosudo-list-row iosudo-compact-row iosudo-player-global-row ' + escapeHtml(roleClass(displayRole)) + '">'
      + '<button type="button" class="iosudo-player-row-button" data-player-id="' + escapeHtml(player.id) + '" data-team-id="' + escapeHtml(player.teamId) + '" aria-label="Apri dettaglio di ' + escapeHtml(player.playerName) + '">'
      + '<h4>' + escapeHtml(player.playerName || 'Giocatore') + ' ' + badgeHtml(badge) + sos + '</h4>'
      + '<p><strong>' + escapeHtml(displayRole) + '</strong> · Squadra reale: ' + escapeHtml(currentTeam) + ' · Fantasy: ' + escapeHtml(fantasy) + '</p>'
      + '<p>Ultimo aggiornamento: ' + escapeHtml(updated) + ' · ' + listoneBadge + '</p>'
      + '<p>Sorgente: ' + escapeHtml(sourceText) + '</p>'
      + '</button></article>';
    if (row) row._iosudoPlayerHtml = html;
    return html;
  }



  function compactSourcesHtml(item) {
    const sources = sourceList(item);
    if (!sources.length) return '';
    const first = sources[0];
    const extra = sources.length > 1 ? '<span class="iosudo-source-more">+' + escapeHtml(sources.length - 1) + '</span>' : '';
    return '<div class="iosudo-sources iosudo-sources-compact"><span class="iosudo-sources-label">Fonte:</span><div class="iosudo-source-chips">'
      + sourceLink(first, 0) + extra + '</div></div>';
  }

  function officialMoveSides(item) {
    const key = String(item && item._iosudoKey || '').trim();
    const direction = norm([item && item.direction, item && item.directionLabel, item && item._iosudoLabel, key].filter(Boolean).join(' '));
    const teamName = String(item && (item._iosudoTeamName || item.teamName) || '').trim();
    const other = String(item && item.origin || '').trim();
    if (key === 'officialOutgoing' || /uscita|outgoing/.test(direction)) {
      return { from: normalizeTransferSide(teamName, '-'), to: normalizeTransferSide(other, 'SVINCOLATO') };
    }
    return { from: normalizeTransferSide(other, 'SVINCOLATO'), to: normalizeTransferSide(teamName, '-') };
  }

  function officialTransferText(items) {
    const parts = [];
    (items || []).forEach(function (item) {
      uniqueText([item.formula, item.status, item.note]).forEach(function (part) {
        if (!/^(ufficiale|ufficialita|comunicato ufficiale)$/i.test(part)) parts.push(part);
      });
    });
    return uniqueText(parts).slice(0, 3).join(' · ') || '-';
  }

  function globalOfficialItem(row) {
    const items = row.items || [row.item || row];
    const latest = row.latestTime || marketLatestTime(items);
    const date = latest ? formatDate(new Date(latest).toISOString().slice(0, 10)) : formatDate(items[0] && items[0].updatedAt);
    const sides = items.map(officialMoveSides);
    const from = uniqueText(sides.map(function (x) { return x.from; })).join(' / ') || '-';
    const to = uniqueText(sides.map(function (x) { return x.to; })).join(' / ') || '-';
    const transfer = officialTransferText(items);
    return '<article class="iosudo-list-row iosudo-compact-row iosudo-market-row-compact iosudo-official-group-card"><h4>'
      + escapeHtml(row.playerName || marketPrimaryName(items[0]) || 'Giocatore')
      + ' <span class="iosudo-badge iosudo-badge-new">UFFICIALE</span></h4>'
      + '<div class="iosudo-market-fields iosudo-official-fields">'
      + '<div class="iosudo-market-field"><span>Data trasferimento</span><strong>' + escapeHtml(date || '-') + '</strong></div>'
      + '<div class="iosudo-market-field"><span>Da</span><strong>' + escapeHtml(from) + '</strong></div>'
      + '<div class="iosudo-market-field"><span>A</span><strong>' + escapeHtml(to) + '</strong></div>'
      + '<div class="iosudo-market-field iosudo-market-field-wide"><span>Trasferimento</span><strong>' + escapeHtml(transfer) + '</strong></div>'
      + '</div>'
      + sourcesFromItemsHtml(items, true)
      + '</article>';
  }

  function globalRumorItem(row) {
    const items = row.items || [row.item || row];
    const latest = row.latestTime || marketLatestTime(items);
    const updated = latest ? formatDate(new Date(latest).toISOString().slice(0, 10)) : '';
    const teams = row.teams ? Array.from(row.teams).filter(Boolean).join(' / ') : (row.team && row.team.name || items[0] && items[0].teamName || '');
    const directions = uniqueText(items.map(function (item) { return item._iosudoLabel || item.directionLabel || item.direction; })).join(' / ');
    const origins = uniqueText(items.map(function (item) { return item.origin; })).slice(0, 3).join(' / ');
    const notes = uniqueText(items.map(function (item) { return item.note || item.status; })).slice(0, 2).join(' · ');
    return '<article class="iosudo-list-row iosudo-compact-row iosudo-market-row-compact iosudo-rumor-group-card"><h4>'
      + escapeHtml(row.playerName || marketPrimaryName(items[0]) || 'Giocatore')
      + ' <span class="iosudo-badge iosudo-badge-rumor">RUMOR</span></h4>'
      + '<p>' + escapeHtml([teams, directions, updated].filter(Boolean).join(' · ')) + '</p>'
      + (origins ? '<p>Scenario: ' + escapeHtml(origins) + '</p>' : '')
      + (notes ? '<p>' + escapeHtml(notes) + '</p>' : '')
      + sourcesFromItemsHtml(items, false)
      + '</article>';
  }

  function globalMarketItem(row, badgeText) {
    if (row && row.items && badgeText === 'UFFICIALE') return globalOfficialItem(row);
    if (row && row.items) return globalRumorItem(row);
    const cacheKey = badgeText === 'UFFICIALE' ? '_iosudoOfficialHtml' : '_iosudoRumorHtml';
    if (row && row[cacheKey]) return row[cacheKey];
    const item = row.item || row;
    const name = item.playerName || item.target || 'Giocatore';
    const teamName = item.teamName || (row.team && row.team.name) || '';
    const direction = item.directionLabel || item.direction || row.label || '';
    const updated = formatDate(item.updatedAt);
    const detail = [teamName, direction, item.status, updated].filter(Boolean).join(' · ');
    const route = [item.origin, item.formula].filter(Boolean).join(' · ');
    const note = item.note ? '<p>' + escapeHtml(item.note) + '</p>' : '';
    const badgeCls = badgeText === 'UFFICIALE' ? 'iosudo-badge-new' : 'iosudo-badge-rumor';
    const html = '<article class="iosudo-list-row iosudo-compact-row iosudo-market-row-compact"><h4>'
      + escapeHtml(name) + ' <span class="iosudo-badge ' + badgeCls + '">' + escapeHtml(badgeText) + '</span></h4>'
      + (detail ? '<p>' + escapeHtml(detail) + '</p>' : '')
      + (route ? '<p>' + escapeHtml(route) + '</p>' : '')
      + note
      + compactSourcesHtml(item)
      + '</article>';
    if (row) row[cacheKey] = html;
    return html;
  }

  function groupItemsByPlayer(items, key, team) {
    const groups = new Map();
    (items || []).forEach(function (item) {
      const name = marketPrimaryName(item);
      const groupKey = marketGroupKeyFromItem(item);
      if (!groupKey) return;
      const enriched = Object.assign({}, item, {
        _iosudoKey: key,
        _iosudoLabel: /Outgoing|uscita/i.test(key) ? 'Uscita' : 'Entrata',
        _iosudoTeamId: team && team.id || item.teamId || '',
        _iosudoTeamName: team && team.name || item.teamName || ''
      });
      const group = groups.get(groupKey) || { playerName: name, item: enriched, items: [], latestTime: 0, team: team };
      group.items.push(enriched);
      const latest = marketLatestTime([enriched]);
      if (latest >= group.latestTime) {
        group.latestTime = latest;
        group.item = enriched;
        group.playerName = name || group.playerName;
      }
      groups.set(groupKey, group);
    });
    return Array.from(groups.values()).sort(function (a, b) {
      const diff = (b.latestTime || 0) - (a.latestTime || 0);
      if (diff) return diff;
      return String(a.playerName || '').localeCompare(String(b.playerName || ''), 'it');
    });
  }

  function teamOfficialCard(row, direction) {
    const item = row.item || (row.items && row.items[0]) || {};
    const sides = officialMoveSides(item);
    const date = row.latestTime ? formatDate(new Date(row.latestTime).toISOString().slice(0, 10)) : formatDate(item.updatedAt);
    const label = direction === 'out' ? 'A' : 'Da';
    const side = direction === 'out' ? sides.to : sides.from;
    return '<article class="iosudo-list-row iosudo-team-market-card iosudo-team-market-card-compact"><h4>'
      + '<span>' + escapeHtml(row.playerName || marketPrimaryName(item) || 'Giocatore') + '</span>'
      + '<span class="iosudo-badge iosudo-badge-new">UFFICIALE</span></h4>'
      + '<p><strong>' + escapeHtml(label) + ':</strong> ' + escapeHtml(side || '-') + ' · ' + escapeHtml(date || '-') + '</p>'
      + sourcesFromItemsHtml(row.items || [item], true)
      + '</article>';
  }

  function teamTalkCard(row, direction) {
    const items = row.items || [row.item || row];
    const item = row.item || items[0] || {};
    const latest = row.latestTime ? formatDate(new Date(row.latestTime).toISOString().slice(0, 10)) : formatDate(item.updatedAt);
    const label = direction === 'out' ? 'Squadre interessate' : 'Squadra attuale';
    const teams = uniqueText(items.map(function (entry) { return entry.origin; })).join(' / ') || '-';
    const note = uniqueText(items.map(function (entry) { return entry.note || entry.status; })).slice(0, 2).join(' · ');
    return '<article class="iosudo-list-row iosudo-team-market-card iosudo-team-market-card-compact"><h4>'
      + '<span>' + escapeHtml(row.playerName || marketPrimaryName(item) || 'Giocatore') + '</span>'
      + '<span class="iosudo-badge iosudo-badge-rumor">RUMOR</span></h4>'
      + '<p><strong>' + escapeHtml(label) + ':</strong> ' + escapeHtml(teams) + (latest ? ' · ' + escapeHtml(latest) : '') + '</p>'
      + (note ? '<p>' + escapeHtml(note) + '</p>' : '')
      + sourcesFromItemsHtml(items, false)
      + '</article>';
  }

  function renderMarketSubsection(title, rows, renderer, empty, open) {
    const body = rows.length ? '<div class="iosudo-list iosudo-team-market-list">' + rows.map(renderer).join('') + '</div>' : '<p class="iosudo-empty iosudo-empty-compact">' + escapeHtml(empty || 'Nessuna voce.') + '</p>';
    return '<details class="iosudo-market-section" ' + (open ? 'open' : '') + '>'
      + '<summary><span>' + escapeHtml(title) + '</span><span class="iosudo-market-section-count">' + escapeHtml(rows.length) + '</span></summary>'
      + body
      + '</details>';
  }

  function renderTeamMarketPanel(team, summary) {
    const officialIn = groupItemsByPlayer(summary.officialIncoming || [], 'officialIncoming', team);
    const officialOut = groupItemsByPlayer(summary.officialOutgoing || [], 'officialOutgoing', team);
    const talksIn = groupItemsByPlayer(summary.talksIncoming || [], 'talksIncoming', team);
    const talksOut = groupItemsByPlayer(summary.talksOutgoing || [], 'talksOutgoing', team);
    return '<div class="iosudo-tab-panel iosudo-team-market-panel">'
      + renderMarketSubsection('UFFICIALITA\' IN ENTRATA', officialIn, function (row) { return teamOfficialCard(row, 'in'); }, 'Nessuna ufficialita in entrata.', true)
      + renderMarketSubsection('UFFICIALITA\' IN USCITA', officialOut, function (row) { return teamOfficialCard(row, 'out'); }, 'Nessuna ufficialita in uscita.', true)
      + renderMarketSubsection('TRATTATIVE IN ENTRATA', talksIn, function (row) { return teamTalkCard(row, 'in'); }, 'Nessuna trattativa in entrata.', false)
      + renderMarketSubsection('TRATTATIVE IN USCITA', talksOut, function (row) { return teamTalkCard(row, 'out'); }, 'Nessuna trattativa in uscita.', false)
      + '</div>';
  }

  function globalSosItem(row) {
    const item = row.item || row;
    const teamName = item.teamName || (row.team && row.team.name) || '';
    const updated = formatDate(item.updatedAt);
    return '<article class="iosudo-list-row iosudo-compact-row"><h4>'
      + escapeHtml(item.playerName || 'Giocatore') + ' <span class="iosudo-badge iosudo-badge-sos">SOS</span></h4>'
      + '<p>' + escapeHtml([teamName, item.status, updated].filter(Boolean).join(' · ')) + '</p>'
      + (item.injury ? '<p>' + escapeHtml(item.injury) + '</p>' : '')
      + (item.potentialReturn ? '<p>Rientro: ' + escapeHtml(item.potentialReturn) + '</p>' : '')
      + (item.note ? '<p>' + escapeHtml(item.note) + '</p>' : '')
      + sourcesHtml(item)
      + '</article>';
  }

  function globalFriendlyItem(row) {
    const item = row.item || row;
    const teams = row.teams ? Array.from(row.teams).sort().join(', ') : (item.teamName || '');
    const when = [formatDate(item.date) || 'Data da confermare', item.time].filter(Boolean).join(' · ');
    const result = item.result || item.score || item.finalScore || '';
    const stats = friendlyStatsForItem(item);
    return '<article class="iosudo-list-row iosudo-compact-row iosudo-friendly-card">'
      + '<button class="iosudo-friendly-row-button" type="button"' + friendlyDetailActionAttrs(item) + ' aria-label="Apri riepilogo amichevole ' + escapeHtml(item.event || '') + '">'
      + '<h4>' + escapeHtml(item.event || 'Amichevole') + (result ? ' <span class="iosudo-result-badge">' + escapeHtml(result) + '</span>' : '') + '</h4>'
      + '<p>' + escapeHtml(when) + '</p>'
      + (teams ? '<p>Squadre: ' + escapeHtml(teams) + '</p>' : '')
      + (stats.length ? '<p><span class="iosudo-badge">Tabellino</span> ' + escapeHtml(stats.length) + ' giocatori · clicca per dettagli</p>' : '<p>Clicca per riepilogo partita</p>')
      + (item.status ? '<p>Stato: ' + escapeHtml(item.status) + '</p>' : '')
      + (item.venue || item.location ? '<p>' + escapeHtml(item.venue || item.location) + '</p>' : '')
      + '</button>'
      + sourcesHtml(item)
      + '</article>';
  }

  function globalViewTitle(view) {
    if (view === 'sos') return 'SOS / problemi fisici';
    if (view === 'rumor') return 'Rumor e trattative';
    if (view === 'official') return 'Ufficialita';
    if (view === 'friendlies') return 'Amichevoli';
    if (view === 'players') return 'Giocatori';
    return 'Squadre';
  }

  function renderGlobalView(q) {
    let rows = [];
    let mapper = globalMarketItem;
    let badge = 'RUMOR';
    let empty = 'Nessuna voce trovata.';
    let orderNote = 'Ordine decrescente per data.';
    if (state.quickView === 'sos') {
      rows = cachedGlobalRows('sos', collectSosRows);
      mapper = globalSosItem;
      empty = 'Nessun giocatore SOS trovato.';
    } else if (state.quickView === 'rumor') {
      rows = cachedGlobalRows('rumor', function () { return collectMarketRows('rumor'); });
      mapper = function (row) { return globalMarketItem(row, 'RUMOR'); };
      empty = 'Nessun rumor o trattativa trovata.';
    } else if (state.quickView === 'official') {
      rows = cachedGlobalRows('official', function () { return collectMarketRows('official'); });
      mapper = function (row) { return globalMarketItem(row, 'UFFICIALE'); };
      empty = 'Nessuna ufficialita trovata.';
    } else if (state.quickView === 'friendlies') {
      rows = cachedGlobalRows('friendlies', collectFriendlyRows);
      mapper = globalFriendlyItem;
      empty = 'Nessuna amichevole trovata.';
      orderNote = 'Ordine crescente per data.';
    } else if (state.quickView === 'players') {
      rows = playerRowsForView();
      mapper = globalPlayerItem;
      empty = 'Nessun giocatore trovato.';
      orderNote = 'Ordine decrescente per ultimo aggiornamento.';
    }
    rows = rows.filter(function (row) { return state.quickView === 'players' ? playerRowMatchesQuery(row, q) : rowMatchesQuery(row, q); });
    const totalRows = rows.length;
    const cap = visibleCapForView(state.quickView);
    const visibleRows = rows.slice(0, cap);
    const hasMore = totalRows > visibleRows.length;
    const capNote = hasMore ? ' · mostro ' + visibleRows.length + ' di ' + totalRows : '';
    const moreButton = hasMore ? '<div class="iosudo-more-wrap"><button type="button" class="iosudo-more-button" data-iosudo-more="' + escapeHtml(state.quickView) + '">Mostra altre voci</button></div>' : '';
    els.results.innerHTML = '<section class="iosudo-global-view"><div class="iosudo-global-head">'
      + '<div><p class="iosudo-eyebrow">Vista rapida</p><h2 class="iosudo-card-title">' + escapeHtml(globalViewTitle(state.quickView)) + '</h2>'
      + '<p class="iosudo-card-subtitle">' + escapeHtml(totalRows) + ' voci · ' + escapeHtml(orderNote + capNote) + '</p></div>'
      + '</div>'
      + (visibleRows.length ? '<div class="iosudo-list iosudo-global-list">' + visibleRows.map(mapper).join('') + '</div>' + moreButton : '<p class="iosudo-empty">' + escapeHtml(empty) + '</p>')
      + '</section>';
    bindCards();
    renderSummary();
  }

  function setQuickView(view) {
    const nextView = view || 'teams';
    if (state.quickView === nextView && !state.query && !(els.focus && !els.focus.classList.contains('hidden'))) return;
    const viewChanged = state.quickView !== nextView;
    state.quickView = nextView;
    if (viewChanged) resetVisibleCap(nextView);
    state.filter = 'all';
    state.activeTeamId = '';
    state.activePlayerId = '';
    state.activeFriendlyKey = '';
    state.friendlyReturnContext = null;
    if (els.focus) els.focus.classList.add('hidden');
    if (els.app) els.app.classList.remove('is-team-open');
    document.querySelectorAll('[data-view]').forEach(function (button) {
      button.classList.toggle('is-active', (button.getAttribute('data-view') || 'teams') === state.quickView);
    });
    if (window.location.hash) history.replaceState(null, '', window.location.pathname + window.location.search);
    try {
      renderResults();
    } catch (error) {
      console.error('[ioSudo] errore rendering vista rapida', state.quickView, error);
      if (els.results) els.results.innerHTML = '<p class="iosudo-empty">Non riesco a mostrare la vista ' + escapeHtml(globalViewTitle(state.quickView)) + '.</p>';
    }
    if (state.quickView !== 'teams' && els.results) {
      els.results.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }

  function teamThemeClass(team) {
    const text = norm([team && team.name, team && team.id, team && team.abbr].filter(Boolean).join(' '));
    if (/atalanta/.test(text)) return 'iosudo-team-theme-atalanta';
    if (/inter|internazionale/.test(text)) return 'iosudo-team-theme-inter';
    if (/bologna/.test(text)) return 'iosudo-team-theme-bologna';
    if (/cagliari/.test(text)) return 'iosudo-team-theme-cagliari';
    if (/genoa/.test(text)) return 'iosudo-team-theme-genoa';
    if (/lazio/.test(text)) return 'iosudo-team-theme-lazio';
    if (/napoli/.test(text)) return 'iosudo-team-theme-napoli';
    if (/como/.test(text)) return 'iosudo-team-theme-como';
    if (/juventus/.test(text)) return 'iosudo-team-theme-juventus';
    if (/udinese/.test(text)) return 'iosudo-team-theme-udinese';
    if (/lecce/.test(text)) return 'iosudo-team-theme-lecce';
    if (/roma/.test(text)) return 'iosudo-team-theme-roma';
    if (/frosinone/.test(text)) return 'iosudo-team-theme-frosinone';
    if (/monza/.test(text)) return 'iosudo-team-theme-monza';
    if (/fiorentina/.test(text)) return 'iosudo-team-theme-fiorentina';
    if (/milan/.test(text)) return 'iosudo-team-theme-milan';
    if (/parma/.test(text)) return 'iosudo-team-theme-parma';
    if (/torino/.test(text)) return 'iosudo-team-theme-torino';
    if (/venezia/.test(text)) return 'iosudo-team-theme-venezia';
    if (/sassuolo/.test(text)) return 'iosudo-team-theme-sassuolo';
    return 'iosudo-team-theme-default';
  }

  function teamCard(team) {
    const counts = teamCounters(team.id);
    return '<article class="iosudo-team-card ' + escapeHtml(teamThemeClass(team)) + '">'
      + '<button type="button" data-team-id="' + escapeHtml(team.id) + '">'
      + '<div class="iosudo-card-head"><div>'
      + '<h3 class="iosudo-card-title">' + escapeHtml(team.name) + '</h3>'
      + '<p class="iosudo-card-subtitle">Modulo ' + escapeHtml(teamModuleText(team) || '-') + ' - ' + escapeHtml(teamCoachText(team) || 'Allenatore n.d.') + '</p>'
      + '</div><span class="iosudo-pill">Apri</span></div>'
      + '<div class="iosudo-card-meta">'
      + '<span class="iosudo-pill">Nuovi ' + escapeHtml(counts.officialIncoming || 0) + '</span>'
      + '<span class="iosudo-pill">Uscite ' + escapeHtml(counts.officialOutgoing || 0) + '</span>'
      + '<span class="iosudo-pill">Rumor ' + escapeHtml(counts.rumors || 0) + '</span>'
      + '<span class="iosudo-pill">SOS ' + escapeHtml(counts.injuries || 0) + '</span>'
      + '</div></button></article>';
  }

  function playerCard(player) {
    const badge = marketBadgeForPlayer(player);
    const displayRole = displayRoleForPlayer(player);
    const sos = playerHasSos(player) ? '<span class="iosudo-badge iosudo-badge-sos">SOS</span>' : '';
    const xi = player.probableXi ? '<span class="iosudo-pill">XI</span>' : '';
    return '<article class="iosudo-player-card ' + escapeHtml(roleClass(displayRole)) + '">'
      + '<button type="button" data-player-id="' + escapeHtml(player.id) + '" data-team-id="' + escapeHtml(player.teamId) + '" aria-label="Apri dettaglio di ' + escapeHtml(player.playerName) + '">'
      + '<div class="iosudo-player-title"><div>'
      + '<h3>' + escapeHtml(player.playerName) + '</h3>'
      + '<p class="iosudo-card-subtitle">' + escapeHtml(player.teamName || '') + ' - ' + escapeHtml(displayRole) + '</p>'
      + '</div><div class="iosudo-card-meta">' + badgeHtml(badge) + sos + xi + '</div></div>'
      + '</button></article>';
  }

  function playerPassesFilter(player) {
    return Boolean(player);
  }

  function renderResults() {
    if (!state.data) return;
    const q = norm(state.query);
    if (state.quickView && state.quickView !== 'teams') {
      renderGlobalView(q);
      return;
    }
    if (!q) {
      const teams = (state.data.teams || []).slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
      els.results.innerHTML = '<div class="iosudo-team-grid">' + teams.map(teamCard).join('') + '</div>';
      bindCards();
      return;
    }
    const matchingTeams = (state.data.teams || []).filter(function (team) {
      return norm(team.name).indexOf(q) !== -1 || norm(team.abbr).indexOf(q) !== -1;
    });
    const matchingPlayers = state.allPlayers.filter(function (player) {
      return playerPassesFilter(player)
        && (norm(player.playerName).indexOf(q) !== -1 || norm(player.teamName).indexOf(q) !== -1 || norm(fantasyRosterText(player)).indexOf(q) !== -1);
    }).slice(0, 80);
    const teamsHtml = matchingTeams.length ? '<h2 class="iosudo-card-title">Squadre</h2><div class="iosudo-team-grid">' + matchingTeams.map(teamCard).join('') + '</div>' : '';
    const playersHtml = matchingPlayers.length ? '<h2 class="iosudo-card-title">Giocatori</h2><div class="iosudo-player-grid">' + matchingPlayers.map(playerCard).join('') + '</div>' : '';
    els.results.innerHTML = teamsHtml + playersHtml || '<p class="iosudo-empty">Nessun risultato.</p>';
    bindCards();
  }

  function sideRank(position, fallback) {
    const p = String(position || '').toUpperCase();
    if (p.endsWith('S') || p.indexOf('SIN') !== -1) return -30;
    if (p === 'DCS' || p === 'BCS' || p === 'CCS' || p === 'ECS') return -15;
    if (p.endsWith('D') || p.indexOf('DES') !== -1) return 30;
    if (p === 'DCD' || p === 'BCD' || p === 'CCD' || p === 'ECD') return 15;
    return Number.isFinite(fallback) ? fallback : 0;
  }

  function sortedFormationItems(items) {
    return items.slice().sort(function (a, b) {
      const ar = sideRank(a.position || a.sourcePosition, a.formationSlot);
      const br = sideRank(b.position || b.sourcePosition, b.formationSlot);
      if (ar !== br) return ar - br;
      return (a.formationSlot || 0) - (b.formationSlot || 0);
    });
  }

  function normalizeFormationLine(line, item, module) {
    const text = norm(line || (item && item.sourceLine) || '');
    const position = String(item && (item.position || item.sourcePosition) || '').toUpperCase();
    const mod = String(module || '').trim();
    if (/goalkeeper|portiere|porta/.test(text) || position === 'P') return 'goalkeeper';
    if (/^(DD|DS|DC|DCD|DCS|BRACCIO|BRC)/.test(position)) return 'defense';

    if (mod === '4-2-3-1') {
      if (/^(PC|A)$/.test(position)) return 'attack';
      if (/^(AD|AS|TQ|SP)$/.test(position)) return 'attacking_midfield';
      if (/^(CC|MED|M|ED|ES|E)$/.test(position)) return 'midfield';
    }
    if (mod === '4-3-2-1' || mod === '3-4-2-1') {
      if (/^(PC|A)$/.test(position)) return 'attack';
      if (/^(TQ|SP|AD|AS)$/.test(position)) return 'attacking_midfield';
      if (/^(CC|MED|M|ED|ES|E)$/.test(position)) return 'midfield';
    }
    if (mod === '4-3-1-2') {
      if (/^(TQ)$/.test(position)) return 'attacking_midfield';
      if (/^(PC|SP|AD|AS|A)$/.test(position)) return 'attack';
      if (/^(CC|MED|M|ED|ES|E)$/.test(position)) return 'midfield';
    }
    if (mod === '4-3-3') {
      if (/^(PC|AD|AS|A)$/.test(position)) return 'attack';
      if (/^(CC|MED|M|ED|ES|E|TQ|SP)$/.test(position)) return 'midfield';
    }
    if (mod === '4-4-2' || mod === '3-5-2') {
      if (/^(PC|SP|AD|AS|A)$/.test(position)) return 'attack';
      if (/^(CC|MED|M|ED|ES|E|TQ)$/.test(position)) return 'midfield';
    }

    if (/defense|difesa|difens/.test(text)) return 'defense';
    if (/wingback|quint|estern/.test(text)) return 'wingbacks';
    if (/attackingmidfield|attacking midfield|trequart|rifinit|sottopunta/.test(text) || /^(TQ|SP)$/.test(position)) return 'attacking_midfield';
    if (/midfield|centrocampo|mediana|mediano/.test(text) || /^(CC|MED|M|ED|ES|E)$/.test(position)) return 'midfield';
    if (/attack|attacco|attacc/.test(text) || /^(PC|AD|AS|A)$/.test(position)) return 'attack';
    return 'midfield';
  }

  function renderPitch(teamId) {
    const team = getTeam(teamId);
    const module = teamModuleText(team);
    const groups = {
      attack: [],
      attacking_midfield: [],
      midfield: [],
      wingbacks: [],
      defense: [],
      goalkeeper: []
    };
    teamFormation(teamId).forEach(function (item) {
      const line = normalizeFormationLine(item.formationLine, item, module);
      if (!groups[line]) groups[line] = [];
      groups[line].push(item);
    });
    const order = ['attack', 'attacking_midfield', 'midfield', 'wingbacks', 'defense', 'goalkeeper'];
    const rows = order.map(function (line) {
      const items = sortedFormationItems(groups[line] || []);
      if (!items.length) return '';
      return '<div class="iosudo-pitch-row">' + items.map(function (item) {
        const player = playerForFormationItem(teamId, item);
        const hasSosInXi = (player && playerHasSos(player)) || isPhysicalIssue(item.physicalStatus || item.physicalRisk || item.injuryStatus || item.formationPhysicalStatus || item.formationPhysicalRisk);
        const risk = hasSosInXi ? '<span class="iosudo-pitch-risk">SOS</span>' : '';
        const playerId = player && player.id ? String(player.id) : '';
        const roleCss = roleClass((player && player.role) || item.role || item.fantasyRole || line);
        const fantasyRoster = String((player && fantasyRosterText(player)) || item.fantasyRoster || item.fantasyTeam || item.rosterName || '').trim();
        const fantasyHtml = fantasyRoster ? '<span class="iosudo-pitch-fantasy">' + escapeHtml(fantasyRoster) + '</span>' : '';
        const attrs = playerId ? ' data-player-detail-id="' + escapeHtml(playerId) + '" data-team-id="' + escapeHtml(teamId) + '"' : '';
        const tag = playerId ? 'button' : 'div';
        const type = playerId ? ' type="button" aria-label="Apri dettaglio di ' + escapeHtml(item.playerName || '') + '"' : '';
        return '<' + tag + ' class="iosudo-pitch-player ' + escapeHtml(roleCss) + '"' + type + attrs + '>'
          + '<span class="iosudo-pitch-role">' + escapeHtml(item.position || item.sourcePosition || '') + '</span>'
          + '<span class="iosudo-pitch-name">' + escapeHtml(item.playerName || '') + '</span>'
          + fantasyHtml
          + risk
          + '</' + tag + '>';
      }).join('') + '</div>';
    }).join('');
    return rows || '<p class="iosudo-empty">Probabile XI non disponibile.</p>';
  }

  function renderList(title, items, mapper) {
    if (!items || !items.length) return '<div class="iosudo-list"><p class="iosudo-empty">Nessuna voce in ' + escapeHtml(title.toLowerCase()) + '.</p></div>';
    return '<div class="iosudo-list">' + items.map(mapper).join('') + '</div>';
  }

  function marketItem(item) {
    const name = item.playerName || item.target || 'Giocatore';
    const detail = [item.origin, item.formula, item.status || item.directionLabel].filter(Boolean).join(' - ');
    const notes = item.note ? '<p>' + escapeHtml(item.note) + '</p>' : '';
    return '<article class="iosudo-list-row"><h4>' + escapeHtml(name) + '</h4>'
      + (detail ? '<p>' + escapeHtml(detail) + '</p>' : '')
      + notes
      + sourcesHtml(item)
      + '</article>';
  }

  function injuryItem(item) {
    return '<article class="iosudo-list-row"><h4>' + escapeHtml(item.playerName || 'Giocatore') + ' <span class="iosudo-badge iosudo-badge-sos">SOS</span></h4>'
      + '<p>' + escapeHtml(item.injury || item.status || item.note || '') + '</p>'
      + (item.potentialReturn ? '<p>Rientro: ' + escapeHtml(item.potentialReturn) + '</p>' : '')
      + (item.source ? '<p>' + sourceLink(item) + '</p>' : '')
      + '</article>';
  }

  function friendlyItem(item) {
    const result = item.result || item.score || item.finalScore || '';
    const stats = friendlyStatsForItem(item);
    return '<article class="iosudo-list-row iosudo-friendly-card">'
      + '<button class="iosudo-friendly-row-button" type="button"' + friendlyDetailActionAttrs(item) + ' aria-label="Apri riepilogo amichevole ' + escapeHtml(item.event || '') + '">'
      + '<h4>' + escapeHtml(item.event || 'Amichevole') + (result ? ' <span class="iosudo-result-badge">' + escapeHtml(result) + '</span>' : '') + '</h4>'
      + '<p>' + escapeHtml(formatDate(item.date) || 'Data da confermare') + (item.time ? ' - ' + escapeHtml(item.time) : '') + '</p>'
      + (item.venue ? '<p>' + escapeHtml(item.venue) + '</p>' : '')
      + (stats.length ? '<p><span class="iosudo-badge">Tabellino</span> ' + escapeHtml(stats.length) + ' giocatori · clicca per dettagli</p>' : '<p>Clicca per riepilogo partita</p>')
      + '</button>'
      + (item.source ? '<p>' + sourceLink(item) + '</p>' : '')
      + '</article>';
  }

  function roleKey(role) {
    const raw = String(role || '').trim().toUpperCase();
    const key = raw.charAt(0);
    if (key === 'P' || raw.indexOf('PORT') === 0 || raw.indexOf('GOAL') === 0) return 'p';
    if (key === 'D') return 'd';
    if (key === 'C' || key === 'M' || key === 'W' || key === 'T') return 'c';
    if (key === 'A') return 'a';
    return 'x';
  }

  function roleClass(role) {
    return 'iosudo-player-role-' + roleKey(role);
  }

  function roleOrder(role) {
    const key = roleKey(role);
    const order = { p: 1, d: 2, c: 3, a: 4 };
    return order[key] || 9;
  }

  function teamPlayersList(teamId) {
    return teamPlayers(teamId).slice().sort(function (a, b) {
      const ar = roleOrder(a.role);
      const br = roleOrder(b.role);
      if (ar !== br) return ar - br;
      return String(a.playerName || '').localeCompare(String(b.playerName || ''));
    });
  }

  function playerItem(player) {
    const badge = marketBadgeForPlayer(player);
    const displayRole = displayRoleForPlayer(player);
    const sos = playerHasSos(player) ? '<span class="iosudo-badge iosudo-badge-sos">SOS</span>' : '';
    const fantasyName = fantasyRosterText(player);
    const fantasy = fantasyName ? '<p>Rosa fantasy: ' + escapeHtml(fantasyName) + '</p>' : '';
    return '<article class="iosudo-list-row iosudo-player-list-row ' + escapeHtml(roleClass(displayRole)) + '">'
      + '<button class="iosudo-player-row-button" type="button" data-player-detail-id="' + escapeHtml(player.id) + '" data-team-id="' + escapeHtml(player.teamId) + '" aria-label="Apri dettaglio di ' + escapeHtml(player.playerName) + '">'
      + '<h4>' + escapeHtml(player.playerName) + ' ' + badgeHtml(badge) + ' ' + sos + '</h4>'
      + '<p>Ruolo: ' + escapeHtml(displayRole) + (player.probableXi ? ' - Probabile XI' : '') + '</p>'
      + fantasy
      + '</button></article>';
  }

  function detailSection(title, items, mapper) {
    if (!items || !items.length) return '';
    return '<h3>' + escapeHtml(title) + '</h3>' + renderList(title, items, mapper);
  }

  function formationDetailItem(item) {
    return '<article class="iosudo-list-row"><h4>' + escapeHtml(item.playerName || 'Giocatore') + '</h4>'
      + '<p>' + escapeHtml(item.position || item.sourcePosition || 'Posizione n.d.') + (item.formationLine ? ' - ' + escapeHtml(item.formationLine) : '') + '</p>'
      + (item.physicalStatus || item.physicalRisk ? '<p>' + escapeHtml(item.physicalStatus || item.physicalRisk) + '</p>' : '')
      + '</article>';
  }

  function detailBadgeForPlayer(player, detail) {
    if (player.newAcquisition || (detail.officialIn && detail.officialIn.length)) {
      return { text: 'NUOVO', cls: 'iosudo-badge-new' };
    }
    if (detail.talks && detail.talks.length) return { text: 'RUMOR', cls: 'iosudo-badge-rumor' };
    return marketBadgeForPlayer(player);
  }

  function playerLastUpdateTextFromDetail(player, detail) {
    const values = [itemUpdatedTime(player), dateValue(player && player.injuryUpdatedAt, 0)];
    (detail.talks || []).forEach(function (item) { values.push(itemUpdatedTime(item)); });
    (detail.officialIn || []).forEach(function (item) { values.push(itemUpdatedTime(item)); });
    (detail.officialOut || []).forEach(function (item) { values.push(itemUpdatedTime(item)); });
    (detail.injuries || []).forEach(function (item) { values.push(itemUpdatedTime(item)); });
    (detail.friendlies || []).forEach(function (item) { values.push(itemUpdatedTime(item)); });
    const time = Math.max.apply(Math, values.filter(function (value) { return Number.isFinite(value); }).concat([0]));
    return time ? formatDate(new Date(time).toISOString().slice(0, 10)) : '-';
  }

  function detailHasSos(player, detail) {
    if (player && player.sosFantaFlag) return true;
    if (isPhysicalIssue(player && (player.physicalStatus || player.injuryStatus || player.formationPhysicalStatus))) return true;
    return Boolean(detail && detail.injuries && detail.injuries.length);
  }

  function playerDetailModel(player) {
    const cacheKey = playerCacheId(player);
    if (cacheKey && state.playerDetailCache && state.playerDetailCache.has(cacheKey)) {
      return state.playerDetailCache.get(cacheKey);
    }
    attachMarketRowsForPlayer(player);
    const model = {
      officialIn: officialIncomingForPlayer(player),
      officialOut: officialOutgoingForPlayer(player),
      talks: talksForPlayer(player),
      injuries: teamInjuries(player && player.teamId || '').filter(function (item) { return itemMatchesPlayer(item, player); }),
      formationItems: teamFormation(player && player.teamId || '').filter(function (item) { return sameName(item.playerName, player.playerName); }),
      friendlies: friendlyStatsForPlayer(player)
    };
    model.badge = detailBadgeForPlayer(player, model);
    model.hasSos = detailHasSos(player, model);
    model.lastUpdateText = playerLastUpdateTextFromDetail(player, model);
    if (cacheKey) state.playerDetailCache.set(cacheKey, model);
    return model;
  }

  function renderPlayerDetail(playerId, teamId) {
    const player = playerById(playerId, teamId);
    if (!player) return;
    state.activePlayerId = player.id;
    state.activeTeamId = player.teamId || teamId || '';
    if (!player.teamId && state.activeTeamId) player.teamId = state.activeTeamId;
    const detail = playerDetailModel(player);
    const team = getTeam(state.activeTeamId);
    const displayRealTeam = currentRealTeamText(player) || (team && team.name) || player.teamName || '';
    const displayRole = displayRoleForPlayer(player);
    const badge = detail.badge || marketBadgeForPlayer(player);
    const sos = detail.hasSos ? '<span class="iosudo-badge iosudo-badge-sos">SOS</span>' : '';
    const xi = player.probableXi ? '<span class="iosudo-pill">Probabile XI</span>' : '';
    const fantasyName = fantasyRosterText(player);
    const fantasy = '<p>Rosa fantasy: ' + escapeHtml(fantasyName || '-') + '</p>';
    const detailListone = playerInLatestListone(player);
    const listoneInfo = '<p>Listone recente: ' + escapeHtml(detailListone.present ? 'SI' : 'NO') + '</p>';
    const updatedInfo = '<p>Ultimo aggiornamento: ' + escapeHtml(detail.lastUpdateText || playerLastUpdateText(player)) + '</p>';
    const officialIn = detail.officialIn || [];
    const officialOut = detail.officialOut || [];
    const talks = detail.talks || [];
    const injuries = detail.injuries || [];
    const formationItems = detail.formationItems || [];
    const friendlies = detail.friendlies || [];
    els.focus.innerHTML = '<div class="iosudo-panel-header"><div>'
      + '<p class="iosudo-eyebrow">Dettaglio giocatore</p>'
      + '<h2 class="iosudo-card-title">' + escapeHtml(player.playerName) + '</h2>'
      + '<p class="iosudo-card-subtitle">' + escapeHtml(displayRealTeam) + ' - ' + escapeHtml(displayRole) + '</p>'
      + '<div class="iosudo-card-meta">' + badgeHtml(badge) + sos + xi + '</div></div>'
      + '<div class="iosudo-panel-actions">'
      + '<button class="iosudo-close iosudo-back-team" type="button" data-back-team="true" aria-label="Torna alla squadra">Squadra</button>'
      + '<button class="iosudo-close" type="button" aria-label="Chiudi scheda" data-close-focus="true">x</button>'
      + '</div></div>'
      + '<article class="iosudo-player-detail-card ' + escapeHtml(roleClass(displayRole)) + '">'
      + '<h3>' + escapeHtml(player.playerName) + '</h3>'
      + '<p>Ruolo: ' + escapeHtml(displayRole) + '</p>'
      + '<p>Squadra reale: ' + escapeHtml(displayRealTeam || '-') + '</p>'
      + (player.virtualMarketPlayer ? '<p>Presente nelle trattative/ufficialita, non ancora agganciato a una scheda rosa Serie A.</p>' : '')
      + fantasy + listoneInfo + updatedInfo
      + (player.marketDetail ? '<p>Mercato: ' + escapeHtml(player.marketDetail) + '</p>' : '')
      + (player.physicalStatus ? '<p>Stato fisico: ' + escapeHtml(player.physicalStatus) + '</p>' : '')
      + '</article>'
      + '<div class="iosudo-tab-panel">'
      + detailSection('Probabile formazione', formationItems, formationDetailItem)
      + detailSection('Ufficialita in entrata', officialIn, marketItem)
      + detailSection('Ufficialita in uscita', officialOut, marketItem)
      + detailSection('Trattative e rumors', talks, marketItem)
      + detailSection('SOS / infortuni', injuries, injuryItem)
      + detailSection('Amichevoli giocate', friendlies, playerFriendlyItem)
      + (!officialIn.length && !officialOut.length && !talks.length && !injuries.length && !formationItems.length && !friendlies.length ? '<p class="iosudo-empty">Nessun dettaglio aggiuntivo per questo giocatore.</p>' : '')
      + '</div>';
    els.focus.classList.remove('hidden');
    if (els.app) els.app.classList.add('is-team-open');
    bindPlayerDetail();
    window.location.hash = 'team=' + encodeURIComponent(state.activeTeamId) + '&player=' + encodeURIComponent(player.id);
  }

  function bindPlayerDetail() {
    // V652: gestione delegata sul contenitore focus, senza listener ricreati a ogni dettaglio.
  }

  function renderTeamPanel(teamId) {
    const team = getTeam(teamId);
    if (!team) {
      els.focus.classList.add('hidden');
      return;
    }
    state.activeTeamId = teamId;
    state.activePlayerId = '';
    state.activeFriendlyKey = '';
    if (els.app) els.app.classList.add('is-team-open');
    const summary = teamSummary(teamId);
    const counts = teamCounters(teamId, summary);
    const teamTabs = new Set(['xi', 'mercato', 'sos', 'rose', 'amichevoli']);
    if (!teamTabs.has(state.activeTab)) state.activeTab = 'xi';
    const tab = state.activeTab;
    const tabContent = tab === 'xi'
      ? '<div class="iosudo-pitch">' + renderPitch(teamId) + '</div>'
      : tab === 'mercato'
        ? renderTeamMarketPanel(team, summary)
        : tab === 'sos'
          ? '<div class="iosudo-tab-panel">' + renderList('SOS', teamInjuries(teamId), injuryItem) + '</div>'
          : tab === 'rose'
            ? '<div class="iosudo-tab-panel">' + renderList('Rosa', teamPlayersList(teamId), playerItem) + '</div>'
            : '<div class="iosudo-tab-panel">' + renderList('Amichevoli', teamFriendlies(teamId), friendlyItem) + '</div>';
    els.focus.innerHTML = '<div class="iosudo-panel-header"><div>'
      + '<p class="iosudo-eyebrow">Squadra</p>'
      + '<h2 class="iosudo-card-title">' + escapeHtml(team.name) + '</h2>'
      + '<p class="iosudo-card-subtitle">Modulo ' + escapeHtml(teamModuleText(team) || '-') + ' - ' + escapeHtml(teamCoachText(team) || 'Allenatore n.d.') + '</p>'
      + '<div class="iosudo-card-meta">'
      + '<span class="iosudo-pill">Nuovi ' + escapeHtml(counts.officialIncoming || 0) + '</span>'
      + '<span class="iosudo-pill">Uscite ' + escapeHtml(counts.officialOutgoing || 0) + '</span>'
      + '<span class="iosudo-pill">Rumor ' + escapeHtml(counts.rumors || 0) + '</span>'
      + '<span class="iosudo-pill">SOS ' + escapeHtml(counts.injuries || 0) + '</span>'
      + '</div></div><button class="iosudo-close" type="button" aria-label="Chiudi scheda" data-close-focus="true">x</button></div>'
      + '<div class="iosudo-tabs">'
      + tabButton('xi', 'XI') + tabButton('mercato', 'Mercato') + tabButton('sos', 'SOS') + tabButton('rose', 'Rosa') + tabButton('amichevoli', 'Amichevoli')
      + '</div>' + tabContent;
    els.focus.classList.remove('hidden');
    bindTeamPanel();
    window.location.hash = 'team=' + encodeURIComponent(teamId) + '&tab=' + encodeURIComponent(tab);
  }

  function tabButton(id, label) {
    return '<button class="iosudo-tab ' + (state.activeTab === id ? 'is-active' : '') + '" type="button" data-tab="' + escapeHtml(id) + '">' + escapeHtml(label) + '</button>';
  }

  function bindTeamPanel() {
    // V652: niente listener per-tab/per-card sul pannello. Gestione delegata una sola volta in init().
  }

  function handleFocusClick(event) {
    if (!els.focus) return;
    const friendlyNode = event.target && event.target.closest ? event.target.closest('[data-friendly-detail-key]') : null;
    if (friendlyNode && els.focus.contains(friendlyNode)) {
      event.preventDefault();
      state.friendlyReturnContext = { type: 'teamFriendlies', teamId: state.activeTeamId, tab: 'amichevoli' };
      renderFriendlyDetail(friendlyNode.getAttribute('data-friendly-detail-key'), friendlyNode.getAttribute('data-team-id') || state.activeTeamId);
      els.focus.scrollIntoView({ behavior: 'auto', block: 'start' });
      return;
    }
    const playerNode = event.target && event.target.closest ? event.target.closest('[data-player-detail-id]') : null;
    if (playerNode && els.focus.contains(playerNode)) {
      event.preventDefault();
      renderPlayerDetail(playerNode.getAttribute('data-player-detail-id'), playerNode.getAttribute('data-team-id') || state.activeTeamId);
      els.focus.scrollIntoView({ behavior: 'auto', block: 'start' });
      return;
    }
    const tabButton = event.target && event.target.closest ? event.target.closest('[data-tab]') : null;
    if (tabButton && els.focus.contains(tabButton)) {
      event.preventDefault();
      state.activeTab = tabButton.getAttribute('data-tab') || 'xi';
      renderTeamPanel(state.activeTeamId);
      return;
    }
    const friendlyBack = event.target && event.target.closest ? event.target.closest('[data-back-friendly]') : null;
    if (friendlyBack && els.focus.contains(friendlyBack)) {
      event.preventDefault();
      returnFromFriendlyDetail();
      return;
    }
    const back = event.target && event.target.closest ? event.target.closest('[data-back-team]') : null;
    if (back && els.focus.contains(back)) {
      event.preventDefault();
      state.activePlayerId = '';
      renderTeamPanel(state.activeTeamId);
      return;
    }
    const close = event.target && event.target.closest ? event.target.closest('[data-close-focus]') : null;
    if (close && els.focus.contains(close)) {
      event.preventDefault();
      state.activeTeamId = '';
      state.activePlayerId = '';
      state.activeFriendlyKey = '';
      els.focus.classList.add('hidden');
      if (els.app) els.app.classList.remove('is-team-open');
      if (window.location.hash) history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }

  function bindCards() {
    // V652: niente listener per-card. I click su squadre/giocatori sono gestiti una sola volta in init().
  }

  function handleResultsClick(event) {
    if (!els.results) return;
    const friendlyNode = event.target && event.target.closest ? event.target.closest('[data-friendly-detail-key]') : null;
    if (friendlyNode && els.results.contains(friendlyNode)) {
      event.preventDefault();
      state.friendlyReturnContext = { type: 'globalFriendlies', quickView: 'friendlies' };
      renderFriendlyDetail(friendlyNode.getAttribute('data-friendly-detail-key'), friendlyNode.getAttribute('data-team-id') || '');
      els.focus.scrollIntoView({ behavior: 'auto', block: 'start' });
      return;
    }
    const moreNode = event.target && event.target.closest ? event.target.closest('[data-iosudo-more]') : null;
    if (moreNode && els.results.contains(moreNode)) {
      event.preventDefault();
      const y = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      increaseVisibleCap(moreNode.getAttribute('data-iosudo-more') || state.quickView);
      renderResults();
      restoreScrollPosition(y);
      return;
    }
    const playerNode = event.target && event.target.closest ? event.target.closest('[data-player-id]') : null;
    if (playerNode && els.results.contains(playerNode)) {
      event.preventDefault();
      renderPlayerDetail(playerNode.getAttribute('data-player-id'), playerNode.getAttribute('data-team-id') || '');
      els.focus.scrollIntoView({ behavior: 'auto', block: 'start' });
      return;
    }
    const teamNode = event.target && event.target.closest ? event.target.closest('.iosudo-team-card [data-team-id]') : null;
    if (teamNode && els.results.contains(teamNode)) {
      event.preventDefault();
      const teamId = teamNode.getAttribute('data-team-id');
      state.activeTab = 'xi';
      state.quickView = 'teams';
      document.querySelectorAll('[data-view]').forEach(function (b) { b.classList.toggle('is-active', (b.getAttribute('data-view') || 'teams') === 'teams'); });
      renderTeamPanel(teamId);
      els.focus.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }

  function parseHash() {
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash) return;
    const params = new URLSearchParams(hash);
    const teamId = params.get('team');
    const tab = params.get('tab');
    const playerId = params.get('player');
    const friendlyKey = params.get('friendly');
    if (tab) state.activeTab = tab;
    if (friendlyKey) renderFriendlyDetail(friendlyKey, teamId);
    else if (playerId) renderPlayerDetail(playerId, teamId);
    else if (teamId) renderTeamPanel(teamId);
  }

  async function getJson(path) {
    const url = path + (path.indexOf('?') === -1 ? '?' : '&') + 't=' + Date.now();
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status + ' ' + path);
    return res.json();
  }

  async function loadData() {
    setStatus('Caricamento manifest...');
    state.manifest = await getJson(DATA_ROOT + 'manifest.json');
    setStatus('Caricamento dati Sudatori...');
    const dataFile = sudatoriDataFileFromManifest(state.manifest);
    state.data = await getJson(DATA_ROOT + dataFile);
    setStatus('Caricamento rose live della lega...');
    await loadLeagueRosters();
    applyLiveRosters();
    setStatus('Caricamento listone piu recente...');
    await loadLatestListone();
    state.allPlayers = Object.values(state.data.playersByTeam || {}).reduce(function (acc, arr) { return acc.concat(arr || []); }, []);
    invalidateGlobalRowsCache();
    invalidatePlayerRowsCache();
    prewarmPlayerRowsCache();
    const updated = state.manifest.updatedAt || (state.data.meta && state.data.meta.updatedAt) || '';
    const updatedWithTime = state.manifest.updatedAtTime || state.manifest.generatedAt || (state.data.meta && (state.data.meta.generatedAt || state.data.meta.updatedAtTime)) || updated;
    const overlayStamp = state.manifest.overlayGeneratedAt || state.manifest.generatedAt || updatedWithTime;
    setStatus('Overlay ' + (state.manifest.version || state.data.meta.version || 'corrente') + ' del ' + formatDateTime(overlayStamp, updated) + ' - dati aggiornati al ' + formatDateTime(updatedWithTime, updated) + (state.liveRoster && state.liveRoster.active ? ' - rose live ' + state.liveRoster.source : '') + (state.latestListone && state.latestListone.active ? ' - listone ' + state.latestListone.source : ''));
    renderSummary();
    renderResults();
    parseHash();
  }

  function bindInstall() {
    window.addEventListener('beforeinstallprompt', function (event) {
      event.preventDefault();
      deferredInstallPrompt = event;
      if (els.installBtn) els.installBtn.hidden = false;
    });
    if (els.installBtn) {
      els.installBtn.addEventListener('click', async function () {
        if (!deferredInstallPrompt) return;
        deferredInstallPrompt.prompt();
        await deferredInstallPrompt.userChoice.catch(function () {});
        deferredInstallPrompt = null;
        els.installBtn.hidden = true;
      });
    }
  }

  function init() {
    els.app = $('iosudoApp');
    els.status = $('iosudoStatus');
    els.summary = $('iosudoSummary');
    els.results = $('iosudoResults');
    els.focus = $('iosudoTeamFocus');
    els.search = $('iosudoSearch');
    els.installBtn = $('iosudoInstallBtn');
    setupLeagueChrome();
    bindInstall();
    if (els.search) {
      els.search.addEventListener('input', function () {
        state.query = els.search.value;
        resetVisibleCap(state.quickView);
        scheduleRenderResults();
      });
    }
    if (els.results) els.results.addEventListener('click', handleResultsClick);
    if (els.focus) els.focus.addEventListener('click', handleFocusClick);
    window.addEventListener('hashchange', function () {
      if (!window.location.hash && state.activeFriendlyKey) {
        returnFromFriendlyDetail();
        return;
      }
      parseHash();
    });
    document.addEventListener('click', function (event) {
      const button = event.target && event.target.closest ? event.target.closest('[data-view]') : null;
      if (!button) return;
      event.preventDefault();
      setQuickView(button.getAttribute('data-view') || 'teams');
    });
    loadData().catch(function (error) {
      console.error(error);
      setStatus('Errore caricamento dati. Riprova piu tardi.');
      els.results.innerHTML = '<p class="iosudo-empty">Non riesco a leggere i dati Sudatori.</p>';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());

/* V698: aggiornamento dati globale v41; RUMOR/UFFICIALITA raggruppate e header con data+ora. */

/* V698: deduplica conservativa GIOCATORI/Rosa da lista duplicati utente; matching listone per persona anche se la squadra del listone e arretrata. */

/* V698: aggiornamento dati globale v44; mantiene deduplica V696 e header data+ora. */

/* V698: aggiornamento dati globale v45; mantiene deduplica V696/V697 e header data+ora. */


/* V701: aggiornamento dati globale v48; mantiene deduplica V696+ e header data+ora. */

/* V701: aggiornamento dati globale v48; mantiene deduplica V696+ e header data+ora. */


/* V712: aggiornamento Excel v66, rumor TM 17/07, Vojvoda-Udinese non ufficiale e badge SOS nel pitch XI derivato dal giocatore. */

/* V713: aggiornamento Excel v67; Hamed Junior Traorè SOS prudenziale da Transfermarkt; nessuna nuova ufficialità o amichevole giocata. */

// V714: alias K. Thuram -> Khephren Thuram e candidati duplicati controllati da dataset.

// V721: Excel V76; Fiogbe U23 ufficiale, Oulai/Desplanches visite terminate non ufficiali, scheda giocatore con amichevoli giocate.

// V721 safety: no generic alias for Esposito/Pessina; 10 alias V721 confermati applicati e candidati nuovi non fusi senza conferma.

// V721: Bologna-Arminia cliccabile con badge minuti/titolare/gol/autogol/infortunio gara da tabellino ufficiale.

// V721: scheda giocatore con riepilogo amichevoli giocate da friendlyPlayerStatsByMatch.

// V722: Excel V78; alias confermati V76, Casale rientrato, click giocatore da tabellino amichevole apre dettaglio con riepilogo amichevoli.

// V731: nuovi inserimenti normalizzati a nome+cognome nei dati; XI/formazioni non toccati.

// V731: alias confermati nome+cognome; Atalanta-U23 tabellino giocatori; Richardson ufficiale.

/* V739: Excel V107; Liberali/Saelemaekers confermati, Saelemaekers disambiguato da Chukwueze, Milan-Milan Futuro 7-0, nuovi rumor mercato, timestamp header. */

/* V739: Excel V107; Liberali/Saelemaekers confermati, Saelemaekers disambiguato da Chukwueze, Milan-Milan Futuro 7-0, nuovi rumor mercato, timestamp header. */

/* V739: Excel V107; Liberali/Saelemaekers confermati, Saelemaekers disambiguato da Chukwueze, Milan-Milan Futuro 7-0, nuovi rumor mercato, timestamp header. */

/* V739: Excel V109; disambiguazioni V737 protette, nuovi tabellini 19/07 (Genoa, Lecce, Venezia, Fiorentina), De Gea rientrato, Baldanzi SOS prudenziale. */
