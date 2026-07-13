(function () {
  'use strict';

  const DATA_ROOT = '../fanta-engine/data/sudatori/current/';
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
    activeTab: 'xi',
    liveRoster: { loaded: false, active: false, entries: 0, matched: 0, map: new Map(), globalMap: new Map(), source: '' }
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

  const TEAM_ALIAS_V621 = new Map([
    ['atalanta','ata'],['ata','ata'],['bologna','bol'],['bol','bol'],['cagliari','cag'],['cag','cag'],['como','com'],['com','com'],['cremonese','cre'],['cre','cre'],['fiorentina','fio'],['fio','fio'],['frosinone','fro'],['fro','fro'],['genoa','gen'],['gen','gen'],['inter','int'],['internazionale','int'],['int','int'],['juventus','juv'],['juve','juv'],['juv','juv'],['lazio','laz'],['laz','laz'],['lecce','lec'],['lec','lec'],['milan','mil'],['ac milan','mil'],['mil','mil'],['monza','mon'],['mon','mon'],['napoli','nap'],['nap','nap'],['parma','par'],['par','par'],['pisa','pis'],['pis','pis'],['roma','rom'],['rom','rom'],['sassuolo','sas'],['sas','sas'],['torino','tor'],['tor','tor'],['udinese','udi'],['udi','udi'],['venezia','ven'],['ven','ven'],['verona','ver'],['hellas verona','ver'],['ver','ver']
  ]);

  function teamKey(value) {
    const key = norm(value);
    return TEAM_ALIAS_V621.get(key) || key;
  }

  function canonName(value) {
    return norm(value).split(/\s+/).filter(Boolean).filter(function (token) { return token.length > 1 && !/^(jr|sr|ii|iii)$/.test(token); }).join(' ');
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

  function rosterNameKeys(value) { return uniqueValues([norm(value), canonName(value), compactName(value), sortedName(value)]); }

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
      console.warn('[ioSudo V621] Rose live non caricate: uso snapshot Sudatori incorporato.', error);
    }
  }

  function uniqueRosterCandidate(list, player) {
    const candidates = (list || []).filter(Boolean);
    if (!candidates.length) return null;
    const role = roleKeyForRoster(player && player.role || '');
    const byRole = role ? candidates.filter(function (entry) { return roleKeyForRoster(entry.role) === role; }) : candidates;
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

  function fantasyRosterText(player) {
    if (state.liveRoster && state.liveRoster.active) return String(player && player.fantasyRoster || '').trim();
    return String(player && player.fantasyRoster || '').trim();
  }

  function sameName(a, b) {
    const na = norm(a);
    const nb = norm(b);
    if (!na || !nb) return false;
    if (na === nb) return true;
    const aa = na.split(' ').filter(Boolean);
    const bb = nb.split(' ').filter(Boolean);
    if (aa.length === 1 && bb.length > 1) return bb.includes(aa[0]);
    if (bb.length === 1 && aa.length > 1) return aa.includes(bb[0]);
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
    const text = norm([item && item.sourceName, item && item.sourceLabel, item && item.source, item && item.url, item && item.note, item && item.status].filter(Boolean).join(' '));
    if (/calciolecce/.test(text)) return 'CalcioLecce';
    if (/eurosport/.test(text)) return 'Eurosport';
    if (/transfermarkt|calciomercato detail|gk wettbewerb|tm pagina/.test(text)) return 'Transfermarkt';
    if (/tuttomercatoweb|tmw/.test(text)) return 'TMW';
    if (/sport sky|sky/.test(text)) return 'Sky';
    if (/sos fanta|sosfanta/.test(text)) return 'SOS Fanta';
    const name = String(item && (item.sourceName || item.sourceLabel || '') || '').trim();
    if (name && norm(name) !== 'fonte') return name;
    return '';
  }

  function directUrlProvider(url) {
    const text = norm(url || '');
    if (/calciolecce/.test(text)) return 'CalcioLecce';
    if (/eurosport/.test(text)) return 'Eurosport';
    if (/transfermarkt/.test(text)) return 'Transfermarkt';
    if (/tuttomercatoweb|tmw/.test(text)) return 'TMW';
    if (/sky/.test(text)) return 'Sky';
    if (/sosfanta|sos fanta/.test(text)) return 'SOS Fanta';
    return '';
  }

  function sourceHref(item) {
    const direct = safeUrl(item && (item.source || item.url || item.href));
    const provider = sourceProvider(item);
    const directProvider = directUrlProvider(direct);
    if (direct && (!provider || !directProvider || norm(provider) === norm(directProvider))) return direct;
    if (provider === 'CalcioLecce') return 'https://www.calciolecce.it/';
    if (provider === 'Eurosport') return 'https://www.eurosport.it/calcio/calciomercato/';
    if (provider === 'Transfermarkt') return 'https://www.transfermarkt.it/calciomercato/detail/forum/154/gk_group/nationalCompetitions/gk_wettbewerb_id/IT1/page/1';
    if (provider === 'TMW') return 'https://www.tuttomercatoweb.com/serie-a/';
    if (provider === 'Sky') return 'https://sport.sky.it/calciomercato/tabellone';
    if (provider === 'SOS Fanta') return 'https://www.sosfanta.com/';
    return direct || '';
  }

  function formatDate(value) {
    const text = String(value || '').trim();
    if (!text) return '';
    const match = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) return match[3] + '/' + match[2] + '/' + match[1];
    return text;
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

  function teamInjuries(teamId) {
    return (state.data && state.data.injuriesByTeam && state.data.injuriesByTeam[teamId]) || [];
  }

  function teamFormation(teamId) {
    return (state.data && state.data.formationsByTeam && state.data.formationsByTeam[teamId]) || [];
  }

  function teamFriendlies(teamId) {
    return (state.data && state.data.friendliesByTeam && state.data.friendliesByTeam[teamId]) || [];
  }

  function playerById(playerId, teamId) {
    const id = String(playerId || '');
    if (!id) return null;
    const localPlayers = teamId ? teamPlayers(teamId) : [];
    const foundLocal = localPlayers.find(function (player) { return String(player.id || '') === id; });
    if (foundLocal) return foundLocal;
    return state.allPlayers.find(function (player) { return String(player.id || '') === id; }) || null;
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
    const candidate = item && (item.playerName || item.target || item.name || item.title);
    if (sameName(candidate, player.playerName)) return true;
    if (player.originalName && sameName(candidate, player.originalName)) return true;
    if (player.disambiguatedName && sameName(candidate, player.disambiguatedName)) return true;
    if (player.listone && sameName(candidate, player.listone.playerName)) return true;
    return false;
  }

  function talksForPlayer(player) {
    const summary = teamSummary(player.teamId);
    return [].concat(summary.talksIncoming || [], summary.talksOutgoing || [])
      .filter(function (item) { return itemMatchesPlayer(item, player); });
  }

  function officialIncomingForPlayer(player) {
    return (teamSummary(player.teamId).officialIncoming || [])
      .filter(function (item) { return itemMatchesPlayer(item, player); });
  }

  function officialOutgoingForPlayer(player) {
    return (teamSummary(player.teamId).officialOutgoing || [])
      .filter(function (item) { return itemMatchesPlayer(item, player); });
  }

  function isPhysicalIssue(value) {
    const text = norm(value || '');
    if (!text) return false;
    if (text.indexOf('nessuna segnalazione') !== -1) return false;
    if (text.indexOf('disponibile') !== -1 && text.indexOf('infortun') === -1 && text.indexOf('stop') === -1) return false;
    return true;
  }

  function playerHasSos(player) {
    if (player && player.sosFantaFlag) return true;
    if (isPhysicalIssue(player && (player.physicalStatus || player.injuryStatus || player.formationPhysicalStatus))) return true;
    return teamInjuries(player.teamId).some(function (injury) { return itemMatchesPlayer(injury, player); });
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

  function renderSummary() {
    const cards = [
      ['Squadre', summaryCount('teams') || (state.data.teams || []).length],
      ['Giocatori', summaryCount('players') || state.allPlayers.length],
      ['Ufficialita', summaryCount('officialMoves') || 0],
      ['Trattative', summaryCount('teamTransferTalks') || 0],
      ['SOS', summaryCount('injuries') || 0],
      ['Amichevoli', summaryCount('friendlies') || 0]
    ];
    els.summary.innerHTML = cards.map(function (card) {
      return '<article class="iosudo-kpi"><strong>' + escapeHtml(card[1]) + '</strong><span>' + escapeHtml(card[0]) + '</span></article>';
    }).join('');
  }


  function dateValue(value, missingValue) {
    const text = String(value || '').trim();
    if (!text) return missingValue == null ? 0 : missingValue;
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

  function collectMarketRows(kind) {
    const rows = [];
    (state.data.teams || []).forEach(function (team) {
      const summary = teamSummary(team.id);
      const keys = kind === 'official'
        ? [['officialIncoming', 'Entrata'], ['officialOutgoing', 'Uscita']]
        : [['talksIncoming', 'Entrata'], ['talksOutgoing', 'Uscita']];
      keys.forEach(function (pair) {
        const key = pair[0];
        const label = pair[1];
        (summary[key] || []).forEach(function (item) {
          rows.push({ team: team, item: item, key: key, label: label });
        });
      });
    });
    rows.sort(function (a, b) {
      const diff = itemUpdatedTime(b.item) - itemUpdatedTime(a.item);
      if (diff) return diff;
      const an = String((a.item && (a.item.playerName || a.item.target)) || '');
      const bn = String((b.item && (b.item.playerName || b.item.target)) || '');
      return an.localeCompare(bn, 'it');
    });
    return rows;
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
      (entry[1] || []).forEach(function (item) {
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

  function rowMatchesQuery(row, q) {
    if (!q) return true;
    const item = row && row.item || row;
    const teams = row && row.teams ? Array.from(row.teams).join(' ') : row && row.team && row.team.name;
    return itemSearchBlob(item, teams).indexOf(q) !== -1;
  }

  function globalMarketItem(row, badgeText) {
    const item = row.item || row;
    const name = item.playerName || item.target || 'Giocatore';
    const teamName = item.teamName || (row.team && row.team.name) || '';
    const direction = item.directionLabel || item.direction || row.label || '';
    const updated = formatDate(item.updatedAt);
    const detail = [teamName, direction, item.status, updated].filter(Boolean).join(' · ');
    const route = [item.origin, item.formula].filter(Boolean).join(' · ');
    const note = item.note ? '<p>' + escapeHtml(item.note) + '</p>' : '';
    const badgeCls = badgeText === 'UFFICIALE' ? 'iosudo-badge-new' : 'iosudo-badge-rumor';
    return '<article class="iosudo-list-row iosudo-compact-row"><h4>'
      + escapeHtml(name) + ' <span class="iosudo-badge ' + badgeCls + '">' + escapeHtml(badgeText) + '</span></h4>'
      + (detail ? '<p>' + escapeHtml(detail) + '</p>' : '')
      + (route ? '<p>' + escapeHtml(route) + '</p>' : '')
      + note
      + sourcesHtml(item)
      + '</article>';
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
    return '<article class="iosudo-list-row iosudo-compact-row"><h4>' + escapeHtml(item.event || 'Amichevole') + '</h4>'
      + '<p>' + escapeHtml(when) + '</p>'
      + (teams ? '<p>Squadre: ' + escapeHtml(teams) + '</p>' : '')
      + (result ? '<p>Risultato: ' + escapeHtml(result) + '</p>' : '')
      + (item.status ? '<p>Stato: ' + escapeHtml(item.status) + '</p>' : '')
      + (item.venue || item.location ? '<p>' + escapeHtml(item.venue || item.location) + '</p>' : '')
      + sourcesHtml(item)
      + '</article>';
  }

  function globalViewTitle(view) {
    if (view === 'sos') return 'SOS / problemi fisici';
    if (view === 'rumor') return 'Rumor e trattative';
    if (view === 'official') return 'Ufficialita';
    if (view === 'friendlies') return 'Amichevoli';
    return 'Squadre';
  }

  function renderGlobalView(q) {
    let rows = [];
    let mapper = globalMarketItem;
    let badge = 'RUMOR';
    let empty = 'Nessuna voce trovata.';
    let orderNote = 'Ordine decrescente per data.';
    if (state.quickView === 'sos') {
      rows = collectSosRows();
      mapper = globalSosItem;
      empty = 'Nessun giocatore SOS trovato.';
    } else if (state.quickView === 'rumor') {
      rows = collectMarketRows('rumor');
      mapper = function (row) { return globalMarketItem(row, 'RUMOR'); };
      empty = 'Nessun rumor o trattativa trovata.';
    } else if (state.quickView === 'official') {
      rows = collectMarketRows('official');
      mapper = function (row) { return globalMarketItem(row, 'UFFICIALE'); };
      empty = 'Nessuna ufficialita trovata.';
    } else if (state.quickView === 'friendlies') {
      rows = collectFriendlyRows();
      mapper = globalFriendlyItem;
      empty = 'Nessuna amichevole trovata.';
      orderNote = 'Ordine crescente per data.';
    }
    rows = rows.filter(function (row) { return rowMatchesQuery(row, q); });
    els.results.innerHTML = '<section class="iosudo-global-view"><div class="iosudo-global-head">'
      + '<div><p class="iosudo-eyebrow">Vista rapida</p><h2 class="iosudo-card-title">' + escapeHtml(globalViewTitle(state.quickView)) + '</h2>'
      + '<p class="iosudo-card-subtitle">' + escapeHtml(rows.length) + ' voci · ' + escapeHtml(orderNote) + '</p></div>'
      + '</div>'
      + (rows.length ? '<div class="iosudo-list iosudo-global-list">' + rows.map(mapper).join('') + '</div>' : '<p class="iosudo-empty">' + escapeHtml(empty) + '</p>')
      + '</section>';
  }

  function setQuickView(view) {
    state.quickView = view || 'teams';
    state.filter = 'all';
    state.activeTeamId = '';
    state.activePlayerId = '';
    if (els.focus) els.focus.classList.add('hidden');
    if (els.app) els.app.classList.remove('is-team-open');
    document.querySelectorAll('[data-view]').forEach(function (button) {
      button.classList.toggle('is-active', (button.getAttribute('data-view') || 'teams') === state.quickView);
    });
    if (window.location.hash) history.replaceState(null, '', window.location.pathname + window.location.search);
    renderResults();
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
    return '<article class="iosudo-team-card ' + escapeHtml(teamThemeClass(team)) + '">'
      + '<button type="button" data-team-id="' + escapeHtml(team.id) + '">'
      + '<div class="iosudo-card-head"><div>'
      + '<h3 class="iosudo-card-title">' + escapeHtml(team.name) + '</h3>'
      + '<p class="iosudo-card-subtitle">Modulo ' + escapeHtml(team.formationModule || team.module || '-') + ' - ' + escapeHtml(team.coach || 'Allenatore n.d.') + '</p>'
      + '</div><span class="iosudo-pill">Apri</span></div>'
      + '<div class="iosudo-card-meta">'
      + '<span class="iosudo-pill">Nuovi ' + escapeHtml(team.officialIncomingCount || 0) + '</span>'
      + '<span class="iosudo-pill">Uscite ' + escapeHtml(team.officialOutgoingCount || 0) + '</span>'
      + '<span class="iosudo-pill">Rumor ' + escapeHtml((team.talksIncomingCount || 0) + (team.talksOutgoingCount || 0)) + '</span>'
      + '<span class="iosudo-pill">SOS ' + escapeHtml(team.injuriesCount || 0) + '</span>'
      + '</div></button></article>';
  }

  function playerCard(player) {
    const badge = marketBadgeForPlayer(player);
    const sos = playerHasSos(player) ? '<span class="iosudo-badge iosudo-badge-sos">SOS</span>' : '';
    const xi = player.probableXi ? '<span class="iosudo-pill">XI</span>' : '';
    return '<article class="iosudo-player-card ' + escapeHtml(roleClass(player.role)) + '">'
      + '<button type="button" data-player-id="' + escapeHtml(player.id) + '" data-team-id="' + escapeHtml(player.teamId) + '" aria-label="Apri dettaglio di ' + escapeHtml(player.playerName) + '">'
      + '<div class="iosudo-player-title"><div>'
      + '<h3>' + escapeHtml(player.playerName) + '</h3>'
      + '<p class="iosudo-card-subtitle">' + escapeHtml(player.teamName || '') + ' - ' + escapeHtml(player.role || '-') + '</p>'
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
    const module = team && (team.formationModule || team.module) || '';
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
        const risk = isPhysicalIssue(item.physicalStatus || item.physicalRisk) ? '<span class="iosudo-pitch-risk">SOS</span>' : '';
        const player = playerForFormationItem(teamId, item);
        const playerId = player && player.id ? String(player.id) : '';
        const roleCss = roleClass((player && player.role) || item.role || item.fantasyRole || line);
        const attrs = playerId ? ' data-player-detail-id="' + escapeHtml(playerId) + '" data-team-id="' + escapeHtml(teamId) + '"' : '';
        const tag = playerId ? 'button' : 'div';
        const type = playerId ? ' type="button" aria-label="Apri dettaglio di ' + escapeHtml(item.playerName || '') + '"' : '';
        return '<' + tag + ' class="iosudo-pitch-player ' + escapeHtml(roleCss) + '"' + type + attrs + '>'
          + '<span class="iosudo-pitch-role">' + escapeHtml(item.position || item.sourcePosition || '') + '</span>'
          + '<span class="iosudo-pitch-name">' + escapeHtml(item.playerName || '') + '</span>'
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
    return '<article class="iosudo-list-row"><h4>' + escapeHtml(item.event || 'Amichevole') + '</h4>'
      + '<p>' + escapeHtml(formatDate(item.date) || 'Data da confermare') + (item.time ? ' - ' + escapeHtml(item.time) : '') + '</p>'
      + (item.venue ? '<p>' + escapeHtml(item.venue) + '</p>' : '')
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
    const sos = playerHasSos(player) ? '<span class="iosudo-badge iosudo-badge-sos">SOS</span>' : '';
    const fantasyName = fantasyRosterText(player);
    const fantasy = fantasyName ? '<p>Rosa fantasy: ' + escapeHtml(fantasyName) + '</p>' : '';
    return '<article class="iosudo-list-row iosudo-player-list-row ' + escapeHtml(roleClass(player.role)) + '">'
      + '<button class="iosudo-player-row-button" type="button" data-player-detail-id="' + escapeHtml(player.id) + '" data-team-id="' + escapeHtml(player.teamId) + '" aria-label="Apri dettaglio di ' + escapeHtml(player.playerName) + '">'
      + '<h4>' + escapeHtml(player.playerName) + ' ' + badgeHtml(badge) + ' ' + sos + '</h4>'
      + '<p>Ruolo: ' + escapeHtml(player.role || '-') + (player.probableXi ? ' - Probabile XI' : '') + '</p>'
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

  function renderPlayerDetail(playerId, teamId) {
    const player = playerById(playerId, teamId);
    if (!player) return;
    state.activePlayerId = player.id;
    state.activeTeamId = player.teamId || teamId || '';
    const team = getTeam(state.activeTeamId);
    const badge = marketBadgeForPlayer(player);
    const sos = playerHasSos(player) ? '<span class="iosudo-badge iosudo-badge-sos">SOS</span>' : '';
    const xi = player.probableXi ? '<span class="iosudo-pill">Probabile XI</span>' : '';
    const fantasyName = fantasyRosterText(player);
    const fantasy = fantasyName ? '<p>Rosa fantasy: ' + escapeHtml(fantasyName) + '</p>' : '';
    const officialIn = officialIncomingForPlayer(player);
    const officialOut = officialOutgoingForPlayer(player);
    const talks = talksForPlayer(player);
    const injuries = teamInjuries(state.activeTeamId).filter(function (item) { return itemMatchesPlayer(item, player); });
    const formationItems = teamFormation(state.activeTeamId).filter(function (item) { return sameName(item.playerName, player.playerName); });
    els.focus.innerHTML = '<div class="iosudo-panel-header"><div>'
      + '<p class="iosudo-eyebrow">Dettaglio giocatore</p>'
      + '<h2 class="iosudo-card-title">' + escapeHtml(player.playerName) + '</h2>'
      + '<p class="iosudo-card-subtitle">' + escapeHtml((team && team.name) || player.teamName || '') + ' - ' + escapeHtml(player.role || '-') + '</p>'
      + '<div class="iosudo-card-meta">' + badgeHtml(badge) + sos + xi + '</div></div>'
      + '<div class="iosudo-panel-actions">'
      + '<button class="iosudo-close iosudo-back-team" type="button" data-back-team="true" aria-label="Torna alla squadra">Squadra</button>'
      + '<button class="iosudo-close" type="button" aria-label="Chiudi scheda" data-close-focus="true">x</button>'
      + '</div></div>'
      + '<article class="iosudo-player-detail-card ' + escapeHtml(roleClass(player.role)) + '">'
      + '<h3>' + escapeHtml(player.playerName) + '</h3>'
      + '<p>Ruolo: ' + escapeHtml(player.role || '-') + '</p>'
      + fantasy
      + (player.marketDetail ? '<p>Mercato: ' + escapeHtml(player.marketDetail) + '</p>' : '')
      + (player.physicalStatus ? '<p>Stato fisico: ' + escapeHtml(player.physicalStatus) + '</p>' : '')
      + '</article>'
      + '<div class="iosudo-tab-panel">'
      + detailSection('Probabile formazione', formationItems, formationDetailItem)
      + detailSection('Ufficialita in entrata', officialIn, marketItem)
      + detailSection('Ufficialita in uscita', officialOut, marketItem)
      + detailSection('Trattative e rumors', talks, marketItem)
      + detailSection('SOS / infortuni', injuries, injuryItem)
      + (!officialIn.length && !officialOut.length && !talks.length && !injuries.length && !formationItems.length ? '<p class="iosudo-empty">Nessun dettaglio aggiuntivo per questo giocatore.</p>' : '')
      + '</div>';
    els.focus.classList.remove('hidden');
    if (els.app) els.app.classList.add('is-team-open');
    bindPlayerDetail();
    window.location.hash = 'team=' + encodeURIComponent(state.activeTeamId) + '&player=' + encodeURIComponent(player.id);
  }

  function bindPlayerDetail() {
    const back = els.focus.querySelector('[data-back-team]');
    if (back) {
      back.addEventListener('click', function () {
        state.activePlayerId = '';
        renderTeamPanel(state.activeTeamId);
      });
    }
    els.focus.querySelectorAll('[data-player-detail-id]').forEach(function (node) {
      node.addEventListener('click', function () {
        renderPlayerDetail(node.getAttribute('data-player-detail-id'), node.getAttribute('data-team-id') || state.activeTeamId);
        els.focus.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
    const close = els.focus.querySelector('[data-close-focus]');
    if (close) {
      close.addEventListener('click', function () {
        state.activeTeamId = '';
        state.activePlayerId = '';
        els.focus.classList.add('hidden');
        if (els.app) els.app.classList.remove('is-team-open');
        if (window.location.hash) history.replaceState(null, '', window.location.pathname + window.location.search);
      });
    }
  }

  function renderTeamPanel(teamId) {
    const team = getTeam(teamId);
    if (!team) {
      els.focus.classList.add('hidden');
      return;
    }
    state.activeTeamId = teamId;
    state.activePlayerId = '';
    if (els.app) els.app.classList.add('is-team-open');
    const summary = teamSummary(teamId);
    const tab = state.activeTab;
    const tabContent = tab === 'xi'
      ? '<div class="iosudo-pitch">' + renderPitch(teamId) + '</div>'
      : tab === 'mercato'
        ? '<div class="iosudo-tab-panel">'
          + '<h3>Ufficialita in entrata</h3>' + renderList('Ufficialita in entrata', summary.officialIncoming || [], marketItem)
          + '<h3>Ufficialita in uscita</h3>' + renderList('Ufficialita in uscita', summary.officialOutgoing || [], marketItem)
          + '<h3>Trattative in entrata</h3>' + renderList('Trattative in entrata', summary.talksIncoming || [], marketItem)
          + '<h3>Trattative in uscita</h3>' + renderList('Trattative in uscita', summary.talksOutgoing || [], marketItem)
          + '</div>'
        : tab === 'sos'
          ? '<div class="iosudo-tab-panel">' + renderList('SOS', teamInjuries(teamId), injuryItem) + '</div>'
          : tab === 'rose'
            ? '<div class="iosudo-tab-panel">' + renderList('Rosa', teamPlayersList(teamId), playerItem) + '</div>'
            : '<div class="iosudo-tab-panel">' + renderList('Amichevoli', teamFriendlies(teamId), friendlyItem) + '</div>';
    els.focus.innerHTML = '<div class="iosudo-panel-header"><div>'
      + '<p class="iosudo-eyebrow">Squadra</p>'
      + '<h2 class="iosudo-card-title">' + escapeHtml(team.name) + '</h2>'
      + '<p class="iosudo-card-subtitle">Modulo ' + escapeHtml(team.formationModule || team.module || '-') + ' - ' + escapeHtml(team.coach || 'Allenatore n.d.') + '</p>'
      + '<div class="iosudo-card-meta">'
      + '<span class="iosudo-pill">Nuovi ' + escapeHtml(team.officialIncomingCount || 0) + '</span>'
      + '<span class="iosudo-pill">Uscite ' + escapeHtml(team.officialOutgoingCount || 0) + '</span>'
      + '<span class="iosudo-pill">Rumor ' + escapeHtml((team.talksIncomingCount || 0) + (team.talksOutgoingCount || 0)) + '</span>'
      + '<span class="iosudo-pill">SOS ' + escapeHtml(team.injuriesCount || 0) + '</span>'
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
    els.focus.querySelectorAll('[data-player-detail-id]').forEach(function (node) {
      node.addEventListener('click', function () {
        renderPlayerDetail(node.getAttribute('data-player-detail-id'), node.getAttribute('data-team-id') || state.activeTeamId);
        els.focus.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
    els.focus.querySelectorAll('[data-tab]').forEach(function (button) {
      button.addEventListener('click', function () {
        state.activeTab = button.getAttribute('data-tab') || 'xi';
        renderTeamPanel(state.activeTeamId);
      });
    });
    const close = els.focus.querySelector('[data-close-focus]');
    if (close) {
      close.addEventListener('click', function () {
        state.activeTeamId = '';
        state.activePlayerId = '';
        els.focus.classList.add('hidden');
        if (els.app) els.app.classList.remove('is-team-open');
        if (window.location.hash) history.replaceState(null, '', window.location.pathname + window.location.search);
      });
    }
  }

  function bindCards() {
    els.results.querySelectorAll('.iosudo-team-card [data-team-id]').forEach(function (node) {
      node.addEventListener('click', function () {
        const teamId = node.getAttribute('data-team-id');
        state.activeTab = 'xi';
        state.quickView = 'teams';
        document.querySelectorAll('[data-view]').forEach(function (b) { b.classList.toggle('is-active', (b.getAttribute('data-view') || 'teams') === 'teams'); });
        renderTeamPanel(teamId);
        els.focus.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
    els.results.querySelectorAll('[data-player-id]').forEach(function (node) {
      node.addEventListener('click', function () {
        const teamId = node.getAttribute('data-team-id');
        renderPlayerDetail(node.getAttribute('data-player-id'), teamId);
        els.focus.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function parseHash() {
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash) return;
    const params = new URLSearchParams(hash);
    const teamId = params.get('team');
    const tab = params.get('tab');
    const playerId = params.get('player');
    if (tab) state.activeTab = tab;
    if (playerId) renderPlayerDetail(playerId, teamId);
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
    const dataFile = state.manifest.current || 'sudatori-data.json';
    state.data = await getJson(DATA_ROOT + dataFile);
    setStatus('Caricamento rose live della lega...');
    await loadLeagueRosters();
    applyLiveRosters();
    state.allPlayers = Object.values(state.data.playersByTeam || {}).reduce(function (acc, arr) { return acc.concat(arr || []); }, []);
    const updated = state.manifest.updatedAt || (state.data.meta && state.data.meta.updatedAt) || '';
    setStatus('Dati aggiornati al ' + formatDate(updated) + ' - versione ' + (state.manifest.version || state.data.meta.version || 'corrente') + (state.liveRoster && state.liveRoster.active ? ' - rose live ' + state.liveRoster.source : ''));
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
        renderResults();
      });
    }
    document.querySelectorAll('[data-view]').forEach(function (button) {
      button.addEventListener('click', function () {
        setQuickView(button.getAttribute('data-view') || 'teams');
      });
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
