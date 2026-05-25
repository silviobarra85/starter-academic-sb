export function installHistoricalStatsCompareRefactorV211(deps = {}) {
  const {
    state,
    escapeHtml,
    normalizeKey,
    renderTeamLogo,
    getTeamById,
    getSeasonTeamById,
    getSeasonTeamDisplayName,
    getSeasonTeamLogo,
    getCompetitionName,
    formatSeasonShortLabel,
    buildMaps,
    formatMatchResult,
    logger = console
  } = deps;

  if (!state) throw new Error("installHistoricalStatsCompareRefactorV211 requires state");

  const safeEscape = typeof escapeHtml === "function" ? escapeHtml : (value) => String(value ?? "");
  const safeNormalize = typeof normalizeKey === "function"
    ? normalizeKey
    : (value) => String(value || "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
  const safeLogo = typeof renderTeamLogo === "function" ? renderTeamLogo : (name) => `<span class="team-logo-fallback">${safeEscape(String(name || "-").slice(0, 2).toUpperCase())}</span>`;

  const HISTORICAL_COMPETITIONS = [
    { key: "CAMPIONATO", label: "Campionato", field: "championItalySeasonTeamId", cellField: "championItaly", medal: "oro" },
    { key: "COPPA_ITALIA", label: "Coppa Italia", field: "coppaItaliaWinnerSeasonTeamId", cellField: "coppaItalia", medal: "coppa" },
    { key: "CHAMPIONS_LEAGUE", label: "Champions League", field: "championsLeagueWinnerSeasonTeamId", cellField: "championsLeague", medal: "champions" },
    { key: "PLAYOFF", label: "Playoff", field: "playoffWinnerSeasonTeamId", cellField: "playoff", medal: "playoff" }
  ];

  function getSeasonSortValue(seasonId) {
    const match = String(seasonId || "").match(/\d{4}/);
    return match ? Number(match[0]) : 0;
  }

  function getSeasonLabel(seasonId) {
    const season = (state.raw?.seasons || []).find((item) => item.id === seasonId) || { id: seasonId, name: seasonId };
    return typeof formatSeasonShortLabel === "function" ? formatSeasonShortLabel(season) : (season.name || season.id || "-");
  }

  function getAllSeasonSnapshots() {
    const snapshots = Object.values(state.publicSeasonSnapshots || {}).filter(Boolean);
    const selected = state.publicSeasonSnapshot;
    if (selected && !snapshots.includes(selected)) snapshots.push(selected);
    return snapshots;
  }

  function collectSeasonTeams() {
    const byId = new Map();
    (state.raw?.seasonTeams || []).forEach((item) => {
      if (item?.id) byId.set(String(item.id), item);
    });
    getAllSeasonSnapshots().forEach((snapshot) => {
      (snapshot.seasonTeams || []).forEach((item) => {
        if (item?.id && !byId.has(String(item.id))) byId.set(String(item.id), item);
      });
    });
    return Array.from(byId.values());
  }

  function collectTeams() {
    const byId = new Map();
    (state.raw?.teams || []).forEach((item) => {
      if (item?.id) byId.set(String(item.id), item);
    });
    getAllSeasonSnapshots().forEach((snapshot) => {
      (snapshot.teams || []).forEach((item) => {
        if (item?.id && !byId.has(String(item.id))) byId.set(String(item.id), item);
      });
    });
    return byId;
  }

  function getTeamFromId(teamId) {
    if (!teamId) return null;
    if (typeof getTeamById === "function") {
      const found = getTeamById(teamId);
      if (found) return found;
    }
    return collectTeams().get(String(teamId)) || null;
  }

  function getSeasonTeamByAnyId(seasonTeamId) {
    if (!seasonTeamId) return null;
    if (typeof getSeasonTeamById === "function") {
      const found = getSeasonTeamById(seasonTeamId);
      if (found) return found;
    }
    return collectSeasonTeams().find((item) => String(item.id || "") === String(seasonTeamId)) || null;
  }

  function getSeasonTeamRecord(seasonTeamId) {
    const seasonTeam = getSeasonTeamByAnyId(seasonTeamId);
    if (!seasonTeam) return null;
    const team = getTeamFromId(seasonTeam.teamId) || {};
    const displayName = typeof getSeasonTeamDisplayName === "function"
      ? getSeasonTeamDisplayName(seasonTeam.id)
      : (seasonTeam.name || team.canonicalName || team.name || seasonTeam.id || seasonTeamId);
    const logo = typeof getSeasonTeamLogo === "function" ? getSeasonTeamLogo(seasonTeam) : (seasonTeam.logo || team.logo || "");
    return {
      seasonTeam,
      team,
      teamId: seasonTeam.teamId || seasonTeam.id || seasonTeamId,
      displayName: displayName || seasonTeam.name || team.canonicalName || team.name || seasonTeamId,
      canonicalName: team.canonicalName || team.name || seasonTeam.name || displayName || seasonTeamId,
      logo
    };
  }

  function makeCellFromRaw(seasonTeamId) {
    if (!seasonTeamId) return { kind: "empty" };
    const record = getSeasonTeamRecord(seasonTeamId);
    return {
      kind: "team",
      seasonTeamId,
      teamId: record?.teamId || "",
      label: record?.displayName || (typeof getSeasonTeamDisplayName === "function" ? getSeasonTeamDisplayName(seasonTeamId) : seasonTeamId),
      logo: record?.logo || ""
    };
  }

  function getHonorRows() {
    const snapshotRows = Array.isArray(state.publicHonorSnapshot?.honorRows) ? state.publicHonorSnapshot.honorRows : [];
    if (snapshotRows.length) return snapshotRows;
    return (state.raw?.honorRoll || []).map((row) => ({
      seasonId: row.seasonId || row.id || "",
      championItaly: makeCellFromRaw(row.championItalySeasonTeamId),
      secondPlace: makeCellFromRaw(row.secondPlaceSeasonTeamId),
      thirdPlace: makeCellFromRaw(row.thirdPlaceSeasonTeamId),
      coppaItalia: makeCellFromRaw(row.coppaItaliaWinnerSeasonTeamId),
      championsLeague: makeCellFromRaw(row.championsLeagueWinnerSeasonTeamId),
      playoff: makeCellFromRaw(row.playoffWinnerSeasonTeamId)
    }));
  }

  function getFifaRows() {
    const snapshotRows = Array.isArray(state.publicHonorSnapshot?.fifaRanking) ? state.publicHonorSnapshot.fifaRanking : [];
    if (snapshotRows.length) return snapshotRows;
    return state.raw?.fifaRankings || [];
  }

  function getSnapshotCellKey(cell) {
    if (!cell || cell.kind === "empty") return "";
    if (cell.teamId) return `team:${String(cell.teamId)}`;
    if (cell.seasonTeamId) {
      const record = getSeasonTeamRecord(cell.seasonTeamId);
      if (record?.teamId) return `team:${String(record.teamId)}`;
      if (record?.displayName) return `name:${safeNormalize(record.displayName)}`;
    }
    const label = cell.label || cell.teamName || cell.name || "";
    return label ? `name:${safeNormalize(label)}` : "";
  }

  function recordFromSnapshotCell(cell) {
    if (!cell || cell.kind === "empty") return null;
    if (cell.seasonTeamId) {
      const record = getSeasonTeamRecord(cell.seasonTeamId);
      if (record) return record;
    }
    const team = cell.teamId ? getTeamFromId(cell.teamId) : null;
    const label = cell.label || cell.teamName || cell.name || team?.canonicalName || team?.name || "Squadra";
    return {
      seasonTeam: null,
      team: team || {},
      teamId: cell.teamId || `name:${safeNormalize(label)}`,
      displayName: label,
      canonicalName: team?.canonicalName || team?.name || label,
      logo: cell.logo || team?.logo || ""
    };
  }

  function ensureTeamBucket(map, record) {
    if (!record) return null;
    const key = record.teamId ? `team:${record.teamId}` : `name:${safeNormalize(record.displayName)}`;
    const current = map.get(key) || {
      key,
      teamId: record.teamId || "",
      displayName: record.canonicalName || record.displayName || "-",
      latestName: record.displayName || record.canonicalName || "-",
      logo: record.logo || "",
      totalTitles: 0,
      titlesByType: Object.fromEntries(HISTORICAL_COMPETITIONS.map((item) => [item.key, 0])),
      podiums: { first: 0, second: 0, third: 0, total: 0 },
      seasons: []
    };
    current.latestName = record.displayName || current.latestName;
    if (!current.logo && record.logo) current.logo = record.logo;
    map.set(key, current);
    return current;
  }

  function getPresidentsForSeasonTeam(seasonTeam) {
    const ids = Array.isArray(seasonTeam?.presidentIds) ? seasonTeam.presidentIds : (seasonTeam?.presidentId ? [seasonTeam.presidentId] : []);
    const maps = typeof buildMaps === "function" ? buildMaps() : { presidentsById: new Map() };
    return ids.map((id) => maps.presidentsById?.get(id)).filter(Boolean);
  }

  function addPresidentWin(presidentBuckets, president, title) {
    if (!president?.id) return;
    const current = presidentBuckets.get(president.id) || {
      presidentId: president.id,
      name: president.name || president.id,
      totalTitles: 0,
      titlesByType: Object.fromEntries(HISTORICAL_COMPETITIONS.map((item) => [item.key, 0])),
      seasons: []
    };
    current.totalTitles += 1;
    current.titlesByType[title.type] = (current.titlesByType[title.type] || 0) + 1;
    current.seasons.push(title);
    presidentBuckets.set(president.id, current);
  }

  function buildHistoricalStats() {
    const rows = getHonorRows().sort((a, b) => getSeasonSortValue(getSeasonIdFromHonorRow(b)) - getSeasonSortValue(getSeasonIdFromHonorRow(a)));
    const teamBuckets = new Map();
    const presidentBuckets = new Map();
    const timeline = [];

    function addTitle(row, competition) {
      const seasonId = getSeasonIdFromHonorRow(row);
      const cell = row[competition.cellField];
      const record = recordFromSnapshotCell(cell);
      const bucket = ensureTeamBucket(teamBuckets, record);
      if (!bucket) return;
      const title = { seasonId, type: competition.key, label: competition.label, teamName: record.displayName };
      bucket.totalTitles += 1;
      bucket.titlesByType[competition.key] = (bucket.titlesByType[competition.key] || 0) + 1;
      bucket.seasons.push(title);
      timeline.push(title);
      if (record.seasonTeam) getPresidentsForSeasonTeam(record.seasonTeam).forEach((president) => addPresidentWin(presidentBuckets, president, title));
    }

    function addPodium(row, cellField, place) {
      const seasonId = getSeasonIdFromHonorRow(row);
      const record = recordFromSnapshotCell(row[cellField]);
      const bucket = ensureTeamBucket(teamBuckets, record);
      if (!bucket) return;
      bucket.podiums[place] += 1;
      bucket.podiums.total += 1;
      bucket.seasons.push({ seasonId, type: "PODIO", label: place, teamName: record.displayName });
    }

    rows.forEach((row) => {
      HISTORICAL_COMPETITIONS.forEach((competition) => addTitle(row, competition));
      addPodium(row, "championItaly", "first");
      addPodium(row, "secondPlace", "second");
      addPodium(row, "thirdPlace", "third");
    });

    const teamRanking = Array.from(teamBuckets.values()).sort((a, b) =>
      b.totalTitles - a.totalTitles ||
      b.podiums.total - a.podiums.total ||
      String(a.latestName || a.displayName).localeCompare(String(b.latestName || b.displayName), "it")
    );
    const podiumRanking = Array.from(teamBuckets.values()).filter((item) => item.podiums.total > 0).sort((a, b) =>
      b.podiums.first - a.podiums.first ||
      b.podiums.second - a.podiums.second ||
      b.podiums.third - a.podiums.third ||
      String(a.latestName || a.displayName).localeCompare(String(b.latestName || b.displayName), "it")
    );
    const presidentRanking = Array.from(presidentBuckets.values()).sort((a, b) =>
      b.totalTitles - a.totalTitles || String(a.name).localeCompare(String(b.name), "it")
    );
    const latestTitles = timeline.sort((a, b) => getSeasonSortValue(b.seasonId) - getSeasonSortValue(a.seasonId)).slice(0, 10);
    const fifaTop = getFifaRows().sort((a, b) => Number(b.score ?? b.points ?? 0) - Number(a.score ?? a.points ?? 0)).slice(0, 10);
    const seasonsFromRows = new Set(rows.map(getSeasonIdFromHonorRow).filter(Boolean));
    const seasonsCount = Math.max(new Set((state.raw?.seasons || []).map((item) => item.id).filter(Boolean)).size, seasonsFromRows.size);
    const totalTitles = teamRanking.reduce((sum, item) => sum + item.totalTitles, 0);
    return { rows, teamRanking, podiumRanking, presidentRanking, latestTitles, fifaTop, seasonsCount, totalTitles };
  }

  function getSeasonIdFromHonorRow(row) {
    return row?.seasonId || row?.id || row?.seasonLabel || "";
  }

  function renderHistoricalMetric(label, value, note = "") {
    return `
      <article class="historical-stat-metric-v193">
        <span>${safeEscape(label)}</span>
        <strong>${safeEscape(String(value ?? "-"))}</strong>
        ${note ? `<small>${safeEscape(note)}</small>` : ""}
      </article>`;
  }

  function renderHistoricalTeamName(item) {
    const name = item.latestName || item.displayName || item.teamName || "-";
    return `<span class="historical-stat-team-v193">${safeLogo(name, item.logo || "")}<strong>${safeEscape(name)}</strong></span>`;
  }

  function renderHistoricalTitleBreakdown(item) {
    const entries = HISTORICAL_COMPETITIONS
      .map((competition) => ({ label: competition.label, count: Number(item.titlesByType?.[competition.key] || 0) }))
      .filter((entry) => entry.count > 0);
    if (!entries.length) return `<span class="muted">Nessun titolo</span>`;
    return entries.map((entry) => `<span>${safeEscape(entry.label)} <strong>${entry.count}</strong></span>`).join("");
  }

  function renderHistoricalRanking(items, options = {}) {
    const { empty = "Nessun dato disponibile.", limit = 8, type = "titles" } = options;
    const visible = items.slice(0, limit);
    if (!visible.length) return `<p class="muted">${safeEscape(empty)}</p>`;
    return `<div class="historical-ranking-v193">${visible.map((item, index) => {
      const value = type === "podiums" ? `${item.podiums.first}-${item.podiums.second}-${item.podiums.third}` : String(item.totalTitles || 0);
      const caption = type === "podiums" ? `Oro ${item.podiums.first} · Argento ${item.podiums.second} · Bronzo ${item.podiums.third}` : `${item.podiums?.total || 0} podi campionato`;
      return `
        <article class="historical-ranking-row-v193">
          <span class="historical-rank-v193">${index + 1}</span>
          <div>
            ${renderHistoricalTeamName(item)}
            <small>${safeEscape(caption)}</small>
            <div class="historical-chip-row-v193">${renderHistoricalTitleBreakdown(item)}</div>
          </div>
          <strong>${safeEscape(value)}</strong>
        </article>`;
    }).join("")}</div>`;
  }

  function renderHistoricalPresidentRanking(items) {
    const visible = items.slice(0, 8);
    if (!visible.length) return `<p class="muted">Presidenti non calcolabili dai soli snapshot pubblici. Carica i dati amministrativi completi per questa vista.</p>`;
    return `<div class="historical-ranking-v193">${visible.map((item, index) => `
      <article class="historical-ranking-row-v193">
        <span class="historical-rank-v193">${index + 1}</span>
        <div>
          <strong>${safeEscape(item.name || "-")}</strong>
          <small>${safeEscape(item.seasons.slice(0, 3).map((season) => `${getSeasonLabel(season.seasonId)} ${season.label}`).join(" · ") || "Titoli storici")}</small>
          <div class="historical-chip-row-v193">${renderHistoricalTitleBreakdown(item)}</div>
        </div>
        <strong>${safeEscape(String(item.totalTitles || 0))}</strong>
      </article>`).join("")}</div>`;
  }

  function renderHistoricalTimeline(items) {
    if (!items.length) return `<p class="muted">Nessun titolo recente disponibile.</p>`;
    return `<div class="historical-timeline-v193">${items.map((item) => `
      <article>
        <span>${safeEscape(getSeasonLabel(item.seasonId))}</span>
        <strong>${safeEscape(item.label)}</strong>
        <small>${safeEscape(item.teamName || "-")}</small>
      </article>`).join("")}</div>`;
  }

  function renderHistoricalFifaTop(items) {
    if (!items.length) return `<p class="muted">Ranking FIFA non disponibile.</p>`;
    return `<div class="historical-ranking-v193">${items.map((item, index) => {
      const name = item.teamName || item.name || item.label || (item.teamId ? getTeamFromId(item.teamId)?.name : "") || "Squadra";
      const score = item.score ?? item.points ?? "-";
      return `
        <article class="historical-ranking-row-v193">
          <span class="historical-rank-v193">${item.position || index + 1}</span>
          <div>${safeLogo(name, item.logo || "")}<strong>${safeEscape(name)}</strong><small>${safeEscape(item.notes || "Ranking FIFA")}</small></div>
          <strong>${safeEscape(String(score))}</strong>
        </article>`;
    }).join("")}</div>`;
  }

  function renderHistoricalStats() {
    const summaryTarget = document.getElementById("historicalStatsSummaryV193");
    const contentTarget = document.getElementById("historicalStatsContentV193");
    if (!summaryTarget || !contentTarget) return;
    const stats = buildHistoricalStats();
    const decoratedTeams = stats.teamRanking.filter((item) => item.totalTitles > 0).length;
    summaryTarget.innerHTML = `
      ${renderHistoricalMetric("Stagioni", stats.seasonsCount, "archiviate nel sito")}
      ${renderHistoricalMetric("Titoli", stats.totalTitles, "competizioni principali")}
      ${renderHistoricalMetric("Club vincitori", decoratedTeams, "almeno un titolo")}
      ${renderHistoricalMetric("Ranking FIFA", stats.fifaTop.length, "prime posizioni disponibili")}`;
    contentTarget.innerHTML = `
      <article class="panel historical-stat-card-v193"><h3>Club più vincenti</h3>${renderHistoricalRanking(stats.teamRanking.filter((item) => item.totalTitles > 0), { empty: "Nessun titolo ancora inserito.", type: "titles" })}</article>
      <article class="panel historical-stat-card-v193"><h3>Podi Campionato</h3>${renderHistoricalRanking(stats.podiumRanking, { empty: "Nessun podio campionato ancora inserito.", type: "podiums" })}</article>
      <article class="panel historical-stat-card-v193"><h3>Presidenti vincenti</h3>${renderHistoricalPresidentRanking(stats.presidentRanking)}</article>
      <article class="panel historical-stat-card-v193"><h3>Ultimi titoli assegnati</h3>${renderHistoricalTimeline(stats.latestTitles)}</article>
      <article class="panel historical-stat-card-v193"><h3>Top FIFA Ranking</h3>${renderHistoricalFifaTop(stats.fifaTop)}</article>`;
  }

  const TEAM_COMPARE_STORAGE_KEY = "zonaOrientaleTeamCompareV195";

  function getCompareTeamKey(seasonTeam) {
    if (!seasonTeam) return "";
    return seasonTeam.teamId ? `team:${seasonTeam.teamId}` : `name:${safeNormalize(seasonTeam.name || seasonTeam.id || "")}`;
  }

  function ensureCompareProfile(profiles, seasonTeam) {
    const key = getCompareTeamKey(seasonTeam);
    if (!key) return null;
    const team = seasonTeam.teamId ? getTeamFromId(seasonTeam.teamId) : null;
    const existing = profiles.get(key) || {
      key,
      teamId: seasonTeam.teamId || "",
      displayName: team?.canonicalName || team?.name || seasonTeam.name || seasonTeam.id || "-",
      latestName: seasonTeam.name || team?.canonicalName || team?.name || "-",
      logo: (typeof getSeasonTeamLogo === "function" ? getSeasonTeamLogo(seasonTeam) : "") || team?.logo || "",
      seasonTeamIds: new Set(),
      seasonTeams: [],
      seasons: new Set(),
      presidents: new Set(),
      titles: [],
      podiums: { first: 0, second: 0, third: 0, total: 0 },
      matches: { played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 },
      fmMovements: 0,
      fifa: null
    };
    existing.teamId = existing.teamId || seasonTeam.teamId || "";
    existing.latestName = seasonTeam.name || existing.latestName;
    if (!existing.logo) existing.logo = (typeof getSeasonTeamLogo === "function" ? getSeasonTeamLogo(seasonTeam) : "") || team?.logo || "";
    if (seasonTeam.id) existing.seasonTeamIds.add(seasonTeam.id);
    existing.seasonTeams.push(seasonTeam);
    if (seasonTeam.seasonId) existing.seasons.add(seasonTeam.seasonId);
    getPresidentsForSeasonTeam(seasonTeam).forEach((president) => existing.presidents.add(president.name || president.id));
    profiles.set(key, existing);
    return existing;
  }

  function buildCompareLookup(profiles) {
    const byKey = new Map();
    const byTeamId = new Map();
    const bySeasonTeamId = new Map();
    const byName = new Map();
    profiles.forEach((profile) => {
      byKey.set(profile.key, profile);
      if (profile.teamId) byTeamId.set(String(profile.teamId), profile);
      profile.seasonTeamIds?.forEach((id) => bySeasonTeamId.set(String(id), profile));
      [profile.latestName, profile.displayName].forEach((name) => {
        const key = safeNormalize(name || "");
        if (key && !byName.has(key)) byName.set(key, profile);
      });
    });
    return { byKey, byTeamId, bySeasonTeamId, byName };
  }

  function findCompareProfileForCell(cell, lookup) {
    if (!cell || cell.kind === "empty") return null;
    if (cell.teamId && lookup.byTeamId.has(String(cell.teamId))) return lookup.byTeamId.get(String(cell.teamId));
    if (cell.seasonTeamId && lookup.bySeasonTeamId.has(String(cell.seasonTeamId))) return lookup.bySeasonTeamId.get(String(cell.seasonTeamId));
    const record = cell.seasonTeamId ? getSeasonTeamRecord(cell.seasonTeamId) : null;
    if (record?.teamId && lookup.byTeamId.has(String(record.teamId))) return lookup.byTeamId.get(String(record.teamId));
    const labelKey = safeNormalize(cell.label || cell.teamName || cell.name || record?.displayName || "");
    return labelKey ? lookup.byName.get(labelKey) || null : null;
  }

  function getCompareProfileMap() {
    const profiles = new Map();
    collectSeasonTeams()
      .filter((item) => item && (item.teamId || item.name || item.id))
      .sort((a, b) => getSeasonSortValue(b.seasonId) - getSeasonSortValue(a.seasonId))
      .forEach((seasonTeam) => ensureCompareProfile(profiles, seasonTeam));

    const lookup = buildCompareLookup(profiles);
    getHonorRows().forEach((row) => {
      const seasonId = getSeasonIdFromHonorRow(row);
      HISTORICAL_COMPETITIONS.forEach((competition) => {
        const profile = findCompareProfileForCell(row[competition.cellField], lookup);
        if (!profile) return;
        const duplicate = profile.titles.some((title) => title.seasonId === seasonId && title.type === competition.key);
        if (!duplicate) profile.titles.push({ seasonId, label: competition.label, type: competition.key });
        if (seasonId) profile.seasons.add(seasonId);
      });
      [[row.championItaly, "first"], [row.secondPlace, "second"], [row.thirdPlace, "third"]].forEach(([cell, place]) => {
        const profile = findCompareProfileForCell(cell, lookup);
        if (!profile) return;
        profile.__podiumKeys = profile.__podiumKeys || new Set();
        const key = `${seasonId}|${place}`;
        if (profile.__podiumKeys.has(key)) return;
        profile.__podiumKeys.add(key);
        profile.podiums[place] += 1;
        profile.podiums.total += 1;
        if (seasonId) profile.seasons.add(seasonId);
      });
    });

    collectPlayedMatches().forEach((match) => {
      const homeKey = lookup.bySeasonTeamId.get(String(match.homeSeasonTeamId || ""));
      const awayKey = lookup.bySeasonTeamId.get(String(match.awaySeasonTeamId || ""));
      const homeProfile = homeKey || null;
      const awayProfile = awayKey || null;
      const homeGoals = Number(match.homeGoals ?? match.homeScore ?? match.homeResult);
      const awayGoals = Number(match.awayGoals ?? match.awayScore ?? match.awayResult);
      if (!Number.isFinite(homeGoals) || !Number.isFinite(awayGoals)) return;
      function addMatch(profile, goalsFor, goalsAgainst) {
        if (!profile) return;
        profile.matches.played += 1;
        profile.matches.goalsFor += goalsFor;
        profile.matches.goalsAgainst += goalsAgainst;
        if (goalsFor > goalsAgainst) profile.matches.wins += 1;
        else if (goalsFor < goalsAgainst) profile.matches.losses += 1;
        else profile.matches.draws += 1;
      }
      addMatch(homeProfile, homeGoals, awayGoals);
      addMatch(awayProfile, awayGoals, homeGoals);
    });

    const refreshedLookup = buildCompareLookup(profiles);
    getFifaRows().forEach((item) => {
      const cell = { kind: "team", teamId: item.teamId || "", label: item.teamName || item.name || item.label || "", logo: item.logo || "" };
      const profile = findCompareProfileForCell(cell, refreshedLookup);
      if (!profile || profile.fifa) return;
      const score = item.score ?? item.points ?? "-";
      const position = item.position ? `#${item.position}` : "";
      profile.fifa = { score, position: item.position || "", notes: position ? `${position} posizione FIFA` : (item.notes || "Ranking FIFA") };
      if (item.logo && !profile.logo) profile.logo = item.logo;
    });

    return profiles;
  }

  function collectPlayedMatches() {
    const byId = new Map();
    (state.raw?.competitionMatches || []).forEach((match) => {
      if (match?.id) byId.set(match.id, match);
    });
    getAllSeasonSnapshots().forEach((snapshot) => {
      (snapshot.competitionMatches || []).forEach((match) => {
        if (match?.id && !byId.has(match.id)) byId.set(match.id, match);
      });
    });
    return Array.from(byId.values()).filter((match) => {
      const status = String(match?.status || "").toUpperCase();
      const hasScore = match.homeGoals !== "" && match.homeGoals !== null && match.homeGoals !== undefined &&
        match.awayGoals !== "" && match.awayGoals !== null && match.awayGoals !== undefined;
      return hasScore && (!status || status === "GIOCATA" || status === "PLAYED" || status === "COMPLETED");
    });
  }

  function getCompareProfiles() {
    return Array.from(getCompareProfileMap().values()).sort((a, b) =>
      String(a.latestName || a.displayName).localeCompare(String(b.latestName || b.displayName), "it", { numeric: true, sensitivity: "base" })
    );
  }

  function getTeamCompareSelection(profiles) {
    const keys = profiles.map((item) => item.key);
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem(TEAM_COMPARE_STORAGE_KEY) || "[]"); } catch (_) { saved = []; }
    const current = Array.isArray(state.teamCompareSelectionV195) ? state.teamCompareSelectionV195 : [];
    const first = current[0] || saved[0] || keys[0] || "";
    let second = current[1] || saved[1] || keys.find((key) => key !== first) || "";
    if (second === first) second = keys.find((key) => key !== first) || "";
    state.teamCompareSelectionV195 = [first, second];
    return state.teamCompareSelectionV195;
  }

  function setTeamCompareSelection(first, second) {
    if (first && second && first === second) {
      second = getCompareProfiles().find((item) => item.key !== first)?.key || "";
    }
    state.teamCompareSelectionV195 = [first || "", second || ""];
    try { localStorage.setItem(TEAM_COMPARE_STORAGE_KEY, JSON.stringify(state.teamCompareSelectionV195)); } catch (_) {}
    renderTeamCompare();
  }

  function renderCompareMetric(label, value, note = "") {
    return `<article class="team-compare-metric-v195"><span>${safeEscape(label)}</span><strong>${safeEscape(String(value ?? "-"))}</strong>${note ? `<small>${safeEscape(note)}</small>` : ""}</article>`;
  }

  function renderCompareProfileHeader(profile) {
    const name = profile.latestName || profile.displayName || "-";
    return `<div class="team-compare-profile-head-v195">${safeLogo(name, profile.logo || "")}<div><h3>${safeEscape(name)}</h3><p>${safeEscape(profile.displayName && profile.displayName !== name ? profile.displayName : "Profilo storico club")}</p></div></div>`;
  }

  function renderCompareProfileCard(profile) {
    if (!profile) return `<article class="panel team-compare-profile-v195"><p class="muted">Squadra non disponibile.</p></article>`;
    const seasons = Array.from(profile.seasons).sort((a, b) => getSeasonSortValue(b) - getSeasonSortValue(a));
    const lastTitles = [...profile.titles].sort((a, b) => getSeasonSortValue(b.seasonId) - getSeasonSortValue(a.seasonId)).slice(0, 4);
    const titleBreakdown = HISTORICAL_COMPETITIONS.map((competition) => {
      const count = profile.titles.filter((title) => title.type === competition.key).length;
      return count ? `<span>${safeEscape(competition.label)} <strong>${count}</strong></span>` : "";
    }).join("") || `<span class="muted">Nessun titolo</span>`;
    return `
      <article class="panel team-compare-profile-v195">
        ${renderCompareProfileHeader(profile)}
        <div class="team-compare-metrics-v195">
          ${renderCompareMetric("Titoli", profile.titles.length, "competizioni principali")}
          ${renderCompareMetric("Podi campionato", `${profile.podiums.first}-${profile.podiums.second}-${profile.podiums.third}`, "oro-argento-bronzo")}
          ${renderCompareMetric("Stagioni", seasons.length, seasons[0] ? `ultima ${getSeasonLabel(seasons[0])}` : "")}
          ${renderCompareMetric("FIFA", profile.fifa?.score ?? "-", profile.fifa?.notes || "ranking")}
          ${renderCompareMetric("Partite", profile.matches.played, `${profile.matches.wins}V ${profile.matches.draws}N ${profile.matches.losses}P`)}
          ${renderCompareMetric("Gol", `${profile.matches.goalsFor}-${profile.matches.goalsAgainst}`, "fatti-subiti")}
        </div>
        <div class="team-compare-chip-row-v195">${titleBreakdown}</div>
        <div class="team-compare-detail-v195"><strong>Presidenti storici</strong><p>${safeEscape(Array.from(profile.presidents).slice(0, 6).join(", ") || "Non disponibili")}</p></div>
        <div class="team-compare-detail-v195"><strong>Ultimi titoli</strong><p>${lastTitles.length ? lastTitles.map((title) => `${getSeasonLabel(title.seasonId)} ${title.label}`).join(" · ") : "Nessun titolo registrato"}</p></div>
      </article>`;
  }

  function getDirectMatches(left, right) {
    if (!left || !right) return { played: 0, leftWins: 0, rightWins: 0, draws: 0, leftGoals: 0, rightGoals: 0, recent: [] };
    const leftIds = left.seasonTeamIds || new Set();
    const rightIds = right.seasonTeamIds || new Set();
    const stats = { played: 0, leftWins: 0, rightWins: 0, draws: 0, leftGoals: 0, rightGoals: 0, recent: [] };
    collectPlayedMatches().forEach((match) => {
      const homeIsLeft = leftIds.has(match.homeSeasonTeamId);
      const awayIsLeft = leftIds.has(match.awaySeasonTeamId);
      const homeIsRight = rightIds.has(match.homeSeasonTeamId);
      const awayIsRight = rightIds.has(match.awaySeasonTeamId);
      if (!((homeIsLeft && awayIsRight) || (homeIsRight && awayIsLeft))) return;
      const homeGoals = Number(match.homeGoals ?? match.homeScore ?? match.homeResult);
      const awayGoals = Number(match.awayGoals ?? match.awayScore ?? match.awayResult);
      if (!Number.isFinite(homeGoals) || !Number.isFinite(awayGoals)) return;
      const leftGoals = homeIsLeft ? homeGoals : awayGoals;
      const rightGoals = homeIsLeft ? awayGoals : homeGoals;
      stats.played += 1;
      stats.leftGoals += leftGoals;
      stats.rightGoals += rightGoals;
      if (leftGoals > rightGoals) stats.leftWins += 1;
      else if (rightGoals > leftGoals) stats.rightWins += 1;
      else stats.draws += 1;
      stats.recent.push({ seasonId: match.seasonId || "", competition: typeof getCompetitionName === "function" ? getCompetitionName(match.competition || {}) : (match.competitionName || "Competizione"), date: match.matchDate || "", leftGoals, rightGoals });
    });
    stats.recent.sort((a, b) => getSeasonSortValue(b.seasonId) - getSeasonSortValue(a.seasonId) || String(b.date || "").localeCompare(String(a.date || "")));
    stats.recent = stats.recent.slice(0, 6);
    return stats;
  }

  function renderDirectCompare(left, right) {
    const direct = getDirectMatches(left, right);
    const leftName = left?.latestName || left?.displayName || "Squadra 1";
    const rightName = right?.latestName || right?.displayName || "Squadra 2";
    return `
      <article class="panel team-compare-direct-v195">
        <div class="team-compare-section-title-v195"><span>⚔️</span><div><h3>Scontri diretti</h3><p>Partite giocate trovate tra le due squadre nelle competizioni caricate.</p></div></div>
        <div class="team-compare-direct-score-v195">
          <div><strong>${safeEscape(String(direct.leftWins))}</strong><span>${safeEscape(leftName)}</span></div>
          <div><strong>${safeEscape(String(direct.draws))}</strong><span>Pareggi</span></div>
          <div><strong>${safeEscape(String(direct.rightWins))}</strong><span>${safeEscape(rightName)}</span></div>
        </div>
        <p class="muted center">${safeEscape(String(direct.played))} partite · Gol ${safeEscape(String(direct.leftGoals))}-${safeEscape(String(direct.rightGoals))}</p>
        <div class="team-compare-direct-list-v195">
          ${direct.recent.length ? direct.recent.map((match) => `<article><span>${safeEscape(getSeasonLabel(match.seasonId))}</span><strong>${safeEscape(match.leftGoals)}-${safeEscape(match.rightGoals)}</strong><small>${safeEscape(match.competition)}${match.date ? ` · ${safeEscape(match.date)}` : ""}</small></article>`).join("") : `<p class="muted">Nessuno scontro diretto trovato nei dati caricati.</p>`}
        </div>
      </article>`;
  }

  function renderCompareControls(profiles, leftKey, rightKey) {
    const options = profiles.map((profile) => `<option value="${safeEscape(profile.key)}">${safeEscape(profile.latestName || profile.displayName || profile.key)}</option>`).join("");
    return `
      <label><span>Squadra 1</span><select id="teamCompareLeftV195" class="input">${options}</select></label>
      <button id="teamCompareSwapV195" class="button button-secondary" type="button" aria-label="Scambia squadre">↔ Scambia</button>
      <label><span>Squadra 2</span><select id="teamCompareRightV195" class="input">${options}</select></label>
      <p class="team-compare-note-v195">Usa dati gia' caricati da JSON/snapshot. Nessuna lettura Firebase aggiuntiva.</p>`;
  }

  function bindTeamCompareControls(leftKey, rightKey) {
    const leftSelect = document.getElementById("teamCompareLeftV195");
    const rightSelect = document.getElementById("teamCompareRightV195");
    const swapBtn = document.getElementById("teamCompareSwapV195");
    if (leftSelect) leftSelect.value = leftKey || "";
    if (rightSelect) rightSelect.value = rightKey || "";
    leftSelect?.addEventListener("change", () => setTeamCompareSelection(leftSelect.value, rightSelect?.value || ""));
    rightSelect?.addEventListener("change", () => setTeamCompareSelection(leftSelect?.value || "", rightSelect.value));
    swapBtn?.addEventListener("click", () => setTeamCompareSelection(rightSelect?.value || "", leftSelect?.value || ""));
  }

  function renderTeamCompare() {
    const controlsTarget = document.getElementById("teamCompareControlsV195");
    const contentTarget = document.getElementById("teamCompareContentV195");
    if (!controlsTarget || !contentTarget) return;
    const profiles = getCompareProfiles();
    if (profiles.length < 2) {
      controlsTarget.innerHTML = `<p class="muted">Servono almeno due squadre per il confronto.</p>`;
      contentTarget.innerHTML = `<p class="muted">Dati squadre non sufficienti.</p>`;
      return;
    }
    const [leftKey, rightKey] = getTeamCompareSelection(profiles);
    const byKey = new Map(profiles.map((profile) => [profile.key, profile]));
    const left = byKey.get(leftKey) || profiles[0];
    const right = byKey.get(rightKey) || profiles.find((profile) => profile.key !== left.key) || profiles[1];
    controlsTarget.innerHTML = renderCompareControls(profiles, left.key, right.key);
    bindTeamCompareControls(left.key, right.key);
    contentTarget.innerHTML = `<div class="team-compare-profiles-v195">${renderCompareProfileCard(left)}${renderCompareProfileCard(right)}</div>${renderDirectCompare(left, right)}`;
  }

  function injectStyles() {
    if (!document || document.getElementById("historicalStatsCompareStylesV211")) return;
    const style = document.createElement("style");
    style.id = "historicalStatsCompareStylesV211";
    style.textContent = `
      .historical-stats-page-v193 { display: grid; gap: 1rem; }
      .historical-stats-hero-v193 { border: 1px solid rgba(251,191,36,.25); background: linear-gradient(135deg, rgba(15,23,42,.96), rgba(58,22,26,.72)); }
      .historical-stats-summary-v193 { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .8rem; }
      .historical-stat-metric-v193 { border: 1px solid rgba(251,191,36,.18); border-radius: 1rem; padding: .9rem; background: rgba(2,6,23,.35); min-width: 0; }
      .historical-stat-metric-v193 span, .historical-stat-metric-v193 small { display: block; color: var(--muted); overflow-wrap: anywhere; }
      .historical-stat-metric-v193 strong { display: block; color: #fff7ed; font-size: 1.55rem; margin: .2rem 0; overflow-wrap: anywhere; }
      .historical-stats-content-v193 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
      .historical-stat-card-v193 { display: grid; gap: .85rem; min-width: 0; overflow: hidden; }
      .historical-stat-card-v193 h3 { margin: 0; color: #fff7ed; overflow-wrap: anywhere; }
      .historical-ranking-v193 { display: grid; gap: .55rem; }
      .historical-ranking-row-v193 { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: .75rem; border-top: 1px solid rgba(148,163,184,.14); padding-top: .55rem; min-width: 0; }
      .historical-rank-v193 { width: 2rem; height: 2rem; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; background: rgba(251,191,36,.12); color: #fde68a; font-weight: 800; }
      .historical-stat-team-v193 { display: inline-flex; align-items: center; gap: .5rem; min-width: 0; }
      .historical-stat-team-v193 strong, .historical-ranking-row-v193 small, .historical-ranking-row-v193 div { overflow-wrap: anywhere; min-width: 0; }
      .historical-chip-row-v193 { display: flex; flex-wrap: wrap; gap: .35rem; margin-top: .3rem; }
      .historical-chip-row-v193 span { border: 1px solid rgba(251,191,36,.2); border-radius: 999px; padding: .18rem .5rem; font-size: .78rem; color: #fde68a; background: rgba(251,191,36,.07); }
      .historical-timeline-v193 { display: grid; gap: .45rem; }
      .historical-timeline-v193 article { display: grid; grid-template-columns: auto minmax(0, 1fr) minmax(0, 1fr); gap: .55rem; border-top: 1px solid rgba(148,163,184,.14); padding-top: .5rem; }
      .historical-timeline-v193 span, .historical-timeline-v193 small { color: var(--muted); overflow-wrap: anywhere; }
      .team-compare-page-v195, .team-compare-content-v195 { display: grid; gap: 1rem; }
      .team-compare-controls-v195 { display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr); gap: .75rem; align-items: end; margin-bottom: 1rem; }
      .team-compare-controls-v195 label { display: grid; gap: .35rem; min-width: 0; }
      .team-compare-controls-v195 label span { font-size: .78rem; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); font-weight: 800; }
      .team-compare-note-v195 { grid-column: 1 / -1; margin: 0; color: var(--muted); font-size: .88rem; }
      .team-compare-profiles-v195 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
      .team-compare-profile-v195 { display: grid; gap: .9rem; align-content: start; overflow: hidden; }
      .team-compare-profile-head-v195 { display: flex; align-items: center; gap: .85rem; min-width: 0; }
      .team-compare-profile-head-v195 h3 { margin: 0; color: #fff7ed; overflow-wrap: anywhere; }
      .team-compare-profile-head-v195 p { margin: .15rem 0 0; color: var(--muted); overflow-wrap: anywhere; }
      .team-compare-metrics-v195 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .55rem; }
      .team-compare-metric-v195 { border: 1px solid rgba(148,163,184,.18); border-radius: 1rem; padding: .7rem; background: rgba(15,23,42,.28); min-width: 0; }
      .team-compare-metric-v195 span, .team-compare-metric-v195 small { display: block; color: var(--muted); font-size: .78rem; overflow-wrap: anywhere; }
      .team-compare-metric-v195 strong { display: block; margin-top: .2rem; color: #fff7ed; font-size: 1.12rem; overflow-wrap: anywhere; }
      .team-compare-chip-row-v195 { display: flex; flex-wrap: wrap; gap: .4rem; }
      .team-compare-chip-row-v195 span { border: 1px solid rgba(251,191,36,.24); background: rgba(251,191,36,.09); color: #fde68a; border-radius: 999px; padding: .28rem .55rem; font-size: .8rem; overflow-wrap: anywhere; }
      .team-compare-detail-v195 { display: grid; gap: .22rem; min-width: 0; }
      .team-compare-detail-v195 strong { color: #fff7ed; }
      .team-compare-detail-v195 p { margin: 0; color: var(--muted); overflow-wrap: anywhere; }
      .team-compare-direct-v195 { display: grid; gap: .9rem; }
      .team-compare-section-title-v195 { display: flex; gap: .75rem; align-items: center; }
      .team-compare-section-title-v195 span { font-size: 1.5rem; }
      .team-compare-section-title-v195 h3 { margin: 0; color: #fff7ed; }
      .team-compare-section-title-v195 p { margin: .15rem 0 0; color: var(--muted); }
      .team-compare-direct-score-v195 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .7rem; text-align: center; }
      .team-compare-direct-score-v195 div { border-radius: 1.1rem; padding: .85rem .65rem; background: rgba(15,23,42,.35); border: 1px solid rgba(148,163,184,.16); min-width: 0; }
      .team-compare-direct-score-v195 strong { display: block; color: #fde68a; font-size: 1.7rem; }
      .team-compare-direct-score-v195 span { color: var(--muted); font-size: .82rem; overflow-wrap: anywhere; }
      .team-compare-direct-list-v195 { display: grid; gap: .5rem; }
      .team-compare-direct-list-v195 article { display: grid; grid-template-columns: minmax(0, 1fr) auto minmax(0, 1.2fr); gap: .55rem; align-items: center; border-top: 1px solid rgba(148,163,184,.13); padding-top: .5rem; }
      .team-compare-direct-list-v195 span, .team-compare-direct-list-v195 small { color: var(--muted); overflow-wrap: anywhere; }
      .team-compare-direct-list-v195 strong { color: #fff7ed; }
      @media (max-width: 900px) { .historical-stats-summary-v193 { grid-template-columns: repeat(2, minmax(0, 1fr)); } .historical-stats-content-v193 { grid-template-columns: 1fr; } }
      @media (max-width: 760px) { .team-compare-controls-v195 { grid-template-columns: 1fr; align-items: stretch; } .team-compare-controls-v195 .button { width: 100%; } .team-compare-profiles-v195 { grid-template-columns: 1fr; } .team-compare-metrics-v195 { grid-template-columns: repeat(2, minmax(0, 1fr)); } .team-compare-direct-list-v195 article { grid-template-columns: 1fr; text-align: left; } }
      @media (max-width: 520px) { .historical-stats-summary-v193 { grid-template-columns: 1fr; gap: .6rem; } .historical-ranking-row-v193, .historical-timeline-v193 article { grid-template-columns: 1fr; } .team-compare-metrics-v195, .team-compare-direct-score-v195 { grid-template-columns: 1fr; } }
    `;
    document.head.appendChild(style);
  }

  function installAdminHelpPanelHooks(accessors = {}) {
    const getPanel = accessors.get;
    const setPanel = accessors.set;
    if (typeof getPanel !== "function" || typeof setPanel !== "function") return;
    const previous = getPanel();
    setPanel(function renderAdminHelpPanelV211() {
      let html = typeof previous === "function" ? previous() : "";
      if (html && !html.includes("Statistiche storiche")) {
        html = html.replace("</div>\n    </section>", "        <article>\n          <h4>Statistiche storiche</h4>\n          <p>Pagina pubblica Hall of Fame: calcola titoli, podi, timeline e Top FIFA dai dati gia' caricati da JSON/snapshot, senza letture Firebase extra e con layout mobile-first.</p>\n        </article>\n      </div>\n    </section>");
      }
      if (html && !html.includes("Confronta squadre")) {
        html = html.replace("</div>\n    </section>", "        <article>\n          <h4>Confronta squadre</h4>\n          <p>Pagina pubblica mobile-first per confrontare due club su titoli, podi, ranking FIFA, partite e scontri diretti usando solo dati gia' caricati da JSON/snapshot.</p>\n        </article>\n      </div>\n    </section>");
      }
      return html;
    });
  }

  function renderAllSurfaces() {
    renderHistoricalStats();
    renderTeamCompare();
  }

  return {
    HISTORICAL_COMPETITIONS,
    getSeasonSortValue,
    getSeasonLabel,
    getSeasonTeamRecord,
    getPresidentsForSeasonTeam,
    buildHistoricalStats,
    renderHistoricalStats,
    getCompareProfileMap,
    getCompareProfiles,
    setTeamCompareSelection,
    getDirectMatches,
    renderTeamCompare,
    injectStyles,
    installAdminHelpPanelHooks,
    renderAllSurfaces,
    getHonorRows,
    getFifaRows
  };
}
