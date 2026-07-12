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
    activeTeamId: '',
    activePlayerId: '',
    activeTab: 'xi'
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
    const params = new URLSearchParams(window.location.search);
    const requested = params.get('league') || '';
    if (LEAGUES[requested]) return LEAGUES[requested];
    const path = window.location.pathname || '';
    if (path.indexOf('/fantapetillomantramanager/') !== -1) return LEAGUES.fantapetillomantramanager;
    if (path.indexOf('/zonaorientale/') !== -1) return LEAGUES.zonaorientale;
    return { name: 'Per i SUDATORI', href: '../zonaorientale/' };
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

  function teamThemeClass(team) {
    const text = norm([team && team.name, team && team.id, team && team.abbr].filter(Boolean).join(' '));
    if (/atalanta|inter|internazionale/.test(text)) return 'iosudo-team-theme-nerazzurro';
    if (/bologna|cagliari|genoa/.test(text)) return 'iosudo-team-theme-rossoblu';
    if (/lazio|napoli/.test(text)) return 'iosudo-team-theme-azzurro';
    if (/como/.test(text)) return 'iosudo-team-theme-como';
    if (/juventus|udinese/.test(text)) return 'iosudo-team-theme-bianconero';
    if (/lecce|roma/.test(text)) return 'iosudo-team-theme-giallorosso';
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
    if (state.filter === 'all') return true;
    if (state.filter === 'new') return marketBadgeForPlayer(player).text === 'NUOVO';
    if (state.filter === 'rumor') return marketBadgeForPlayer(player).text === 'RUMOR';
    if (state.filter === 'sos') return playerHasSos(player);
    if (state.filter === 'xi') return Boolean(player.probableXi);
    return true;
  }

  function renderResults() {
    if (!state.data) return;
    const q = norm(state.query);
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
        && (norm(player.playerName).indexOf(q) !== -1 || norm(player.teamName).indexOf(q) !== -1 || norm(player.fantasyRoster).indexOf(q) !== -1);
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
    const fantasy = player.fantasyRoster ? '<p>Rosa fantasy: ' + escapeHtml(player.fantasyRoster) + '</p>' : '';
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
    const fantasy = player.fantasyRoster ? '<p>Rosa fantasy: ' + escapeHtml(player.fantasyRoster) + '</p>' : '';
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
    state.allPlayers = Object.values(state.data.playersByTeam || {}).reduce(function (acc, arr) { return acc.concat(arr || []); }, []);
    const updated = state.manifest.updatedAt || (state.data.meta && state.data.meta.updatedAt) || '';
    setStatus('Dati aggiornati al ' + formatDate(updated) + ' - versione ' + (state.manifest.version || state.data.meta.version || 'corrente'));
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
    document.querySelectorAll('[data-filter]').forEach(function (button) {
      button.addEventListener('click', function () {
        document.querySelectorAll('[data-filter]').forEach(function (b) { b.classList.remove('is-active'); });
        button.classList.add('is-active');
        state.filter = button.getAttribute('data-filter') || 'all';
        renderResults();
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
