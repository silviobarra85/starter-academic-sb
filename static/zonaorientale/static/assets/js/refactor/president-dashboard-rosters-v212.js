/* V212 - Refactor Dashboard Presidente e risoluzione rose.
   Estrae e consolida la logica V192/V201 da app.js senza cambiare comportamento:
   - Dashboard Presidente evoluta
   - conteggi rosa da raw/snapshot/static rosters
   - hub mobile presidente
   - hook renderUserArea/renderAll/admin help
   - debug ZonaOrientaleRosterDebug
*/

export function installPresidentDashboardRostersRefactorV212(deps = {}) {
  const {
    state,
    escapeHtml = (value) => String(value ?? ""),
    normalizeKey = (value) => String(value ?? "").trim().toLowerCase(),
    normalizeRosterKey = null,
    mapStaticRosterPlayers = null,
    formatFm = (value) => String(value ?? ""),
    formatNewsDateTime = null,
    getNewsRawDateValue = null,
    getCurrentSeasonId = () => "",
    getCurrentUserDisplayName = () => "",
    getSeasonTeamById = null,
    getSeasonTeamDisplayName = null,
    getSeasonTeamPresidentNames = null,
    getTeamFmBalance = null,
    getActiveTransferListings = null,
    getCompetitionPublicDisplayName = null,
    getCompetitionDisplayName = null,
    hasMatchGoals = null,
    renderMatchResultHtml = null,
    getRenderUserArea = () => null,
    setRenderUserArea = () => {},
    getRenderAll = () => null,
    setRenderAll = () => {},
    getRenderMobileTeamAreaHub = () => null,
    setRenderMobileTeamAreaHub = () => {},
    getRenderAdminHelpPanel = () => null,
    setRenderAdminHelpPanel = () => {},
    getRosterForSeasonTeam = () => null,
    setRosterForSeasonTeam = () => {},
    getApprovedTeamUser = () => null,
    getDateValue = null
  } = deps;

  function getDateValueInternal(value) {
    if (typeof getDateValue === "function") return getDateValue(value);
    if (!value) return 0;
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const parsed = Date.parse(value);
      return Number.isNaN(parsed) ? 0 : parsed;
    }
    if (typeof value?.seconds === "number") return value.seconds * 1000;
    if (typeof value?.toDate === "function") {
      try { return value.toDate().getTime(); } catch (_) { return 0; }
    }
    return 0;
  }

  function formatDashboardDate(value) {
    const timestamp = getDateValueInternal(value);
    if (!timestamp) return "-";
    try {
      return new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "2-digit", year: "2-digit" }).format(new Date(timestamp));
    } catch (_) {
      return String(value || "-");
    }
  }

  function getTeamNameKeys(value) {
    const text = String(value || "").trim();
    if (!text) return [];
    const normalized = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const compact = normalized.replace(/[^a-z0-9]/g, "");
    const withoutCommon = normalized.replace(/\b(a\.s\.|as|a\.f\.c\.|afc|f\.c\.|fc|ssd|asd)\b/g, "").replace(/[^a-z0-9]/g, "");
    return [
      normalizeKey(text),
      typeof normalizeRosterKey === "function" ? normalizeRosterKey(text) : "",
      compact,
      withoutCommon
    ].filter(Boolean);
  }

  function getTeamKeysFromRecord(record) {
    const keys = new Set();
    [record?.name, record?.teamName, record?.seasonTeamName, record?.displayName, record?.canonicalName, record?.fantasyRoster, record?.rosterName]
      .forEach((value) => getTeamNameKeys(value).forEach((key) => keys.add(key)));
    return keys;
  }

  function getSeasonTeam(approved) {
    if (!approved?.seasonTeamId) return null;
    return typeof getSeasonTeamById === "function" ? getSeasonTeamById(approved.seasonTeamId) : null;
  }

  function findSeasonTeamForRoster(seasonTeamId, approved = null) {
    if (!seasonTeamId && !approved?.seasonTeamId) return null;
    const targetId = String(seasonTeamId || approved?.seasonTeamId || "");
    const direct = typeof getSeasonTeamById === "function" ? getSeasonTeamById(targetId) : null;
    if (direct) return direct;

    const raw = Array.isArray(state.raw?.seasonTeams) ? state.raw.seasonTeams : [];
    const fromRaw = raw.find((team) => String(team.id || "") === targetId);
    if (fromRaw) return fromRaw;

    const snapshots = Object.values(state.publicSeasonSnapshots || {}).filter(Boolean);
    for (const snapshot of snapshots) {
      const fromSnapshot = (snapshot.seasonTeams || []).find((team) => String(team.id || "") === targetId);
      if (fromSnapshot) return fromSnapshot;
    }

    if (approved) {
      return {
        id: targetId,
        seasonId: approved.seasonId || getCurrentSeasonId(),
        name: approved.teamName || approved.seasonTeamName || approved.displayName || targetId,
        teamName: approved.teamName || ""
      };
    }
    return { id: targetId, seasonId: getCurrentSeasonId(), name: targetId };
  }

  function dedupeRosterPlayers(players) {
    const seen = new Set();
    return (players || []).filter((player) => {
      const key = String(player.id || player.playerId || player.playerName || player.name || "").trim().toLowerCase();
      if (!key) return true;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function collectRosterEntriesFromSnapshot(seasonTeamId, seasonTeam) {
    const targetId = String(seasonTeamId || seasonTeam?.id || "");
    const seasonId = String(seasonTeam?.seasonId || getCurrentSeasonId());
    const sources = [];
    if (Array.isArray(state.raw?.rosterEntries)) sources.push(state.raw.rosterEntries);
    const currentSnapshot = state.publicSeasonSnapshots?.[seasonId];
    if (Array.isArray(currentSnapshot?.rosterEntries)) sources.push(currentSnapshot.rosterEntries);
    Object.entries(state.publicSeasonSnapshots || {}).forEach(([snapshotSeasonId, snapshot]) => {
      if (String(snapshotSeasonId) !== seasonId && Array.isArray(snapshot?.rosterEntries)) sources.push(snapshot.rosterEntries);
    });

    const allEntries = sources.flat().filter(Boolean);
    const activeEntries = allEntries.filter((entry) => String(entry.status || "ACTIVE").toUpperCase() !== "REMOVED");
    const exact = activeEntries.filter((entry) => String(entry.seasonTeamId || "") === targetId);
    if (exact.length) return dedupeRosterPlayers(exact);

    const teamKeys = getTeamKeysFromRecord(seasonTeam);
    if (!teamKeys.size) return [];
    const byName = activeEntries.filter((entry) => {
      const entryKeys = getTeamKeysFromRecord(entry);
      return [...entryKeys].some((key) => teamKeys.has(key));
    });
    return dedupeRosterPlayers(byName);
  }

  function collectStaticRosterPlayers(seasonTeam, approved = null) {
    const seasonId = String(seasonTeam?.seasonId || approved?.seasonId || getCurrentSeasonId());
    const snapshots = Array.isArray(state.rosters) ? state.rosters : [];
    const rosterSnapshot = snapshots.find((snapshot) => String(snapshot.seasonId || snapshot.meta?.seasonId || "") === seasonId) || snapshots[0] || null;
    if (!rosterSnapshot) return [];

    const targetKeys = new Set([
      ...getTeamKeysFromRecord(seasonTeam),
      ...getTeamNameKeys(approved?.teamName),
      ...getTeamNameKeys(approved?.seasonTeamName)
    ]);
    if (!targetKeys.size) return [];

    const staticRoster = (rosterSnapshot.rosters || []).find((roster) => {
      const rosterKeys = getTeamKeysFromRecord(roster);
      return [...rosterKeys].some((key) => targetKeys.has(key));
    });
    if (!staticRoster) return [];

    const targetId = seasonTeam?.id || approved?.seasonTeamId || "";
    if (typeof mapStaticRosterPlayers === "function") {
      return mapStaticRosterPlayers(staticRoster, seasonId, targetId) || [];
    }
    return (staticRoster.players || []).map((player) => ({
      ...player,
      seasonId,
      seasonTeamId: targetId,
      playerName: player.playerName || player.name || ""
    }));
  }

  function getRosterPlayersForSeasonTeam(seasonTeamId, approved = null) {
    const seasonTeam = findSeasonTeamForRoster(seasonTeamId, approved);
    if (!seasonTeam) return [];
    const snapshotEntries = collectRosterEntriesFromSnapshot(seasonTeam.id || seasonTeamId, seasonTeam);
    if (snapshotEntries.length) return snapshotEntries;
    return collectStaticRosterPlayers(seasonTeam, approved);
  }

  function getDashboardRoster(approved) {
    const players = getRosterPlayersForSeasonTeam(approved?.seasonTeamId, approved);
    if (players.length) return players;
    const seasonTeam = findSeasonTeamForRoster(approved?.seasonTeamId, approved);
    try {
      const roster = seasonTeam && typeof originalRosterForSeasonTeam === "function" ? originalRosterForSeasonTeam(seasonTeam) : null;
      return Array.isArray(roster?.players) ? roster.players : [];
    } catch (error) {
      console.warn("Dashboard presidente: rosa non disponibile", error);
      return [];
    }
  }

  function getRecentMovements(seasonTeamId, limit = 5) {
    const seasonId = getCurrentSeasonId();
    return (state.raw?.fmMovements || [])
      .filter((item) => item.seasonTeamId === seasonTeamId && (!seasonId || item.seasonId === seasonId))
      .sort((a, b) => getDateValueInternal(b.date || b.createdAt || b.updatedAt) - getDateValueInternal(a.date || a.createdAt || a.updatedAt))
      .slice(0, limit);
  }

  function getRecentNews(seasonTeamId, limit = 3) {
    const seasonId = getCurrentSeasonId();
    return (state.raw?.news || [])
      .filter((item) => (!seasonId || !item.seasonId || item.seasonId === seasonId) && item.seasonTeamId === seasonTeamId)
      .sort((a, b) => getDateValueInternal((typeof getNewsRawDateValue === "function" ? getNewsRawDateValue(b) : b.date) || b.createdAt) - getDateValueInternal((typeof getNewsRawDateValue === "function" ? getNewsRawDateValue(a) : a.date) || a.createdAt))
      .slice(0, limit);
  }

  function getCompetitionName(competitionId) {
    const competition = (state.raw?.competitions || []).find((item) => item.id === competitionId);
    if (!competition) return "Competizione";
    if (typeof getCompetitionPublicDisplayName === "function") return getCompetitionPublicDisplayName(competition);
    if (typeof getCompetitionDisplayName === "function") return getCompetitionDisplayName(competition);
    return competition.name || competition.code || "Competizione";
  }

  function getMatches(seasonTeamId, limit = 4) {
    const seasonId = getCurrentSeasonId();
    return (state.raw?.competitionMatches || [])
      .filter((match) => (!seasonId || !match.seasonId || match.seasonId === seasonId) && (match.homeSeasonTeamId === seasonTeamId || match.awaySeasonTeamId === seasonTeamId))
      .sort((a, b) => getDateValueInternal(b.matchDate || b.date || b.updatedAt || b.createdAt) - getDateValueInternal(a.matchDate || a.date || a.updatedAt || a.createdAt))
      .slice(0, limit);
  }

  function renderMetric(label, value, hint = "") {
    return `<article class="president-dashboard-metric-v192"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong>${hint ? `<small>${escapeHtml(hint)}</small>` : ""}</article>`;
  }

  function renderMovements(movements) {
    if (!movements.length) return `<p class="muted">Nessun movimento FM recente.</p>`;
    return `<div class="president-dashboard-list-v192">${movements.map((movement) => `<article><strong>${escapeHtml(movement.playerName || movement.description || "Movimento FM")}</strong><span>${escapeHtml(formatDashboardDate(movement.date || movement.createdAt))} · ${escapeHtml(movement.type || "FM")} · ${escapeHtml(formatFm(movement.amount || 0))}</span></article>`).join("")}</div>`;
  }

  function renderMatches(matches, seasonTeamId) {
    if (!matches.length) return `<p class="muted">Nessuna partita recente o programmata trovata.</p>`;
    return `<div class="president-dashboard-list-v192">${matches.map((match) => {
      const home = typeof getSeasonTeamDisplayName === "function" ? getSeasonTeamDisplayName(match.homeSeasonTeamId) : (match.homeTeamName || "Casa");
      const away = typeof getSeasonTeamDisplayName === "function" ? getSeasonTeamDisplayName(match.awaySeasonTeamId) : (match.awayTeamName || "Trasferta");
      const result = (typeof hasMatchGoals === "function" && hasMatchGoals(match) && typeof renderMatchResultHtml === "function")
        ? renderMatchResultHtml(match)
        : escapeHtml(formatDashboardDate(match.matchDate || match.date));
      const ownSide = match.homeSeasonTeamId === seasonTeamId ? "Casa" : "Trasferta";
      return `<article><strong>${escapeHtml(home || "Casa")} - ${escapeHtml(away || "Trasferta")}</strong><span>${escapeHtml(getCompetitionName(match.competitionId))} · ${escapeHtml(ownSide)} · ${result}</span></article>`;
    }).join("")}</div>`;
  }

  function renderNews(news) {
    if (!news.length) return `<p class="muted">Nessun comunicato squadra recente.</p>`;
    return `<div class="president-dashboard-list-v192">${news.map((item) => {
      const rawDate = typeof getNewsRawDateValue === "function" ? getNewsRawDateValue(item) : (item.date || item.createdAt);
      const formatted = typeof formatNewsDateTime === "function" ? formatNewsDateTime(rawDate) : formatDashboardDate(rawDate);
      return `<article><strong>${escapeHtml(item.title || "Comunicato squadra")}</strong><span>${escapeHtml(formatted || "-")}</span></article>`;
    }).join("")}</div>`;
  }

  function renderPresidentDashboard(approved) {
    if (!approved?.seasonTeamId) return "";
    const seasonTeam = getSeasonTeam(approved) || findSeasonTeamForRoster(approved.seasonTeamId, approved);
    const teamName = (typeof getSeasonTeamDisplayName === "function" ? getSeasonTeamDisplayName(approved.seasonTeamId) : "") || approved.teamName || "La mia squadra";
    const roster = getDashboardRoster(approved);
    const fmBalance = typeof getTeamFmBalance === "function" ? getTeamFmBalance(approved.seasonTeamId) : null;
    const marketLoaded = Boolean(state.transferMarketLoadedV119 || state.transferMarketLoadedV170 || state.transferMarketLiveLoadedV205);
    const seasonId = getCurrentSeasonId();
    const listings = (marketLoaded && typeof getActiveTransferListings === "function")
      ? getActiveTransferListings(seasonId).filter((item) => item.seasonTeamId === approved.seasonTeamId).length
      : null;
    const negotiations = marketLoaded
      ? (state.raw?.transferNegotiations || []).filter((item) => item.seasonId === seasonId && (item.fromSeasonTeamId === approved.seasonTeamId || item.toSeasonTeamId === approved.seasonTeamId) && String(item.status || "PENDING").toUpperCase() === "PENDING").length
      : null;
    const movements = getRecentMovements(approved.seasonTeamId, 5);
    const matches = getMatches(approved.seasonTeamId, 4);
    const news = getRecentNews(approved.seasonTeamId, 3);
    const presidentNames = typeof getSeasonTeamPresidentNames === "function" ? getSeasonTeamPresidentNames(seasonTeam) : (approved.presidentName || getCurrentUserDisplayName());

    return `
      <section id="presidentDashboardV192" class="panel president-dashboard-v192" aria-labelledby="presidentDashboardTitleV192">
        <div class="panel-header compact president-dashboard-header-v192">
          <div>
            <p class="eyebrow">Dashboard presidente</p>
            <h2 id="presidentDashboardTitleV192">${escapeHtml(teamName)}</h2>
            <p>${escapeHtml(presidentNames || "-")} · ${escapeHtml(seasonId || "Stagione corrente")}</p>
          </div>
          <div class="president-dashboard-actions-v192">
            <button class="button button-secondary button-small" type="button" data-open-team-profile="${escapeHtml(approved.seasonTeamId)}">Pagina squadra</button>
            <button class="button button-secondary button-small" type="button" data-v42-page-link="clubs">Tutte le rose</button>
            <button class="button button-primary button-small" type="button" data-v42-page-link="fantamercato">Mercato</button>
          </div>
        </div>
        <div class="president-dashboard-metrics-v192">
          ${renderMetric("Saldo FM", fmBalance !== null && fmBalance !== undefined ? formatFm(fmBalance) : "-", "saldo squadra")}
          ${renderMetric("Rosa", `${roster.length}/30`, roster.length > 30 ? "oltre limite" : "giocatori")}
          ${renderMetric("In vendita", listings === null ? "lazy" : String(listings), listings === null ? "apri Mercato per caricare" : "giocatori")}
          ${renderMetric("Trattative", negotiations === null ? "lazy" : String(negotiations), negotiations === null ? "caricate nel Mercato" : "aperte")}
        </div>
        <div class="president-dashboard-content-v192">
          <article><div class="president-dashboard-card-title-v192"><span>💰</span><h3>Ultimi movimenti FM</h3></div>${renderMovements(movements)}</article>
          <article><div class="president-dashboard-card-title-v192"><span>🏆</span><h3>Partite squadra</h3></div>${renderMatches(matches, approved.seasonTeamId)}</article>
          <article><div class="president-dashboard-card-title-v192"><span>📰</span><h3>Comunicati squadra</h3></div>${renderNews(news)}</article>
        </div>
        <p class="muted president-dashboard-note-v192">La dashboard non aggiunge letture Firebase all'avvio: il mercato resta lazy e viene caricato solo quando apri Mercato o Dashboard Presidente operativa.</p>
      </section>`;
  }

  function injectPresidentDashboard() {
    const target = document.getElementById("teamAreaBody");
    const approved = typeof getApprovedTeamUser === "function" ? getApprovedTeamUser() : null;
    const existing = document.getElementById("presidentDashboardV192");
    if (existing) existing.remove();
    if (!target || !state.user || !approved?.seasonTeamId) return;
    const summary = target.querySelector(".team-area-summary-panel") || target.querySelector(".panel");
    if (!summary) return;
    summary.insertAdjacentHTML("afterend", renderPresidentDashboard(approved));
  }

  const originalRosterForSeasonTeam = typeof getRosterForSeasonTeam === "function" ? getRosterForSeasonTeam() : null;

  function installRosterOverride() {
    setRosterForSeasonTeam(function getRosterForSeasonTeamV212(seasonTeam) {
      const players = getRosterPlayersForSeasonTeam(seasonTeam?.id, null);
      if (players.length) {
        return {
          id: seasonTeam?.id || "",
          name: seasonTeam?.name || seasonTeam?.teamName || "",
          playerCount: players.length,
          players
        };
      }
      const fallback = originalRosterForSeasonTeam?.(seasonTeam);
      if (fallback) return fallback;
      return { id: seasonTeam?.id || "", name: seasonTeam?.name || "", playerCount: 0, players: [] };
    });
  }

  function renderMobileTeamAreaHub(approved) {
    if (!approved?.seasonTeamId) return "";
    const seasonTeam = findSeasonTeamForRoster(approved.seasonTeamId, approved);
    const teamName = (typeof getSeasonTeamDisplayName === "function" ? getSeasonTeamDisplayName(approved.seasonTeamId) : "") || seasonTeam?.name || approved.teamName || "La mia squadra";
    const presidentNames = typeof getSeasonTeamPresidentNames === "function" ? getSeasonTeamPresidentNames(seasonTeam) : (approved.presidentName || approved.displayName || "-");
    const rosterCount = getRosterPlayersForSeasonTeam(approved.seasonTeamId, approved).length;
    const fmBalance = typeof getTeamFmBalance === "function" ? getTeamFmBalance(approved.seasonTeamId) : null;
    const pendingSent = (state.raw?.transferNegotiations || []).filter((item) => item.fromSeasonTeamId === approved.seasonTeamId && String(item.status || "PENDING").toUpperCase() === "PENDING").length;
    const pendingReceived = (state.raw?.transferNegotiations || []).filter((item) => item.toSeasonTeamId === approved.seasonTeamId && String(item.status || "PENDING").toUpperCase() === "PENDING").length;
    const listings = (state.transferMarketLoadedV119 || state.transferMarketLoadedV170 || state.transferMarketLiveLoadedV205) && typeof getActiveTransferListings === "function"
      ? getActiveTransferListings(getCurrentSeasonId()).filter((item) => item.seasonTeamId === approved.seasonTeamId).length
      : 0;

    return `
      <section id="mobileTeamAreaHubV144" class="mobile-teamarea-hub-v144" aria-label="Azioni rapide Dashboard Presidente">
        <div class="mobile-teamarea-hero-v144 mobile-teamarea-hero-v167">
          <span class="mobile-teamarea-kicker-v144">Dashboard Presidente</span>
          <h3>${escapeHtml(teamName)}</h3>
          <p class="mobile-teamarea-president-v167">${escapeHtml(presidentNames || "-")}</p>
          <p>${escapeHtml(`${rosterCount}/30 giocatori${fmBalance !== null ? ` · ${formatFm(fmBalance)}` : ""}`)}</p>
          <button class="button button-secondary button-small mobile-teamarea-open-profile-v167" type="button" data-open-team-profile="${escapeHtml(approved.seasonTeamId)}">Apri pagina squadra</button>
        </div>
        <div class="mobile-teamarea-stats-v144">
          <span><strong>${escapeHtml(String(listings))}</strong><small>in vendita</small></span>
          <span><strong>${escapeHtml(String(pendingSent))}</strong><small>inviate</small></span>
          <span><strong>${escapeHtml(String(pendingReceived))}</strong><small>ricevute</small></span>
        </div>
        <div class="mobile-teamarea-actions-v144">
          <a class="mobile-teamarea-action-v144" href="#clubs" data-page-link="clubs"><span>👥</span><strong>Tutte le rose</strong><small>lega</small></a>
          <a class="mobile-teamarea-action-v144" href="#fantamercato" data-page-link="fantamercato"><span>🔁</span><strong>Mercato</strong><small>trasferibili</small></a>
          <button class="mobile-teamarea-action-v144" type="button" data-mobile-teamarea-scroll=".trade-proposal-panel"><span>✍️</span><strong>Proposta</strong><small>nuova trattativa</small></button>
          <button class="mobile-teamarea-action-v144" type="button" data-mobile-teamarea-scroll=".trade-list-panel"><span>🤝</span><strong>Trattative</strong><small>storico</small></button>
          <button class="mobile-teamarea-action-v144" type="button" data-mobile-teamarea-scroll="#teamNewsRequestForm"><span>📰</span><strong>Comunicato</strong><small>squadra</small></button>
        </div>
      </section>`;
  }

  function injectStyles() {
    if (document.getElementById("presidentDashboardStylesV192")) return;
    const style = document.createElement("style");
    style.id = "presidentDashboardStylesV192";
    style.textContent = `
      .president-dashboard-v192 { border: 1px solid rgba(59,130,246,.28); background: linear-gradient(135deg, rgba(15,23,42,.92), rgba(30,41,59,.78)); }
      .president-dashboard-header-v192 { gap: 1rem; align-items: flex-start; }
      .president-dashboard-actions-v192 { display: flex; flex-wrap: wrap; gap: .55rem; justify-content: flex-end; }
      .president-dashboard-metrics-v192 { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .75rem; margin: 1rem 0; }
      .president-dashboard-metric-v192 { min-width: 0; border: 1px solid rgba(255,255,255,.12); border-radius: 1rem; padding: .85rem; background: rgba(2,6,23,.45); }
      .president-dashboard-metric-v192 span, .president-dashboard-metric-v192 small { display: block; color: var(--muted); overflow-wrap: anywhere; }
      .president-dashboard-metric-v192 strong { display: block; margin: .22rem 0; font-size: 1.35rem; overflow-wrap: anywhere; }
      .president-dashboard-content-v192 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .85rem; }
      .president-dashboard-content-v192 > article { min-width: 0; border: 1px solid rgba(255,255,255,.12); border-radius: 1rem; padding: .9rem; background: rgba(15,23,42,.58); }
      .president-dashboard-card-title-v192 { display: flex; align-items: center; gap: .45rem; margin-bottom: .7rem; }
      .president-dashboard-card-title-v192 h3 { margin: 0; font-size: 1rem; }
      .president-dashboard-list-v192 { display: grid; gap: .55rem; }
      .president-dashboard-list-v192 article { border-radius: .8rem; padding: .65rem; background: rgba(255,255,255,.055); min-width: 0; }
      .president-dashboard-list-v192 strong, .president-dashboard-list-v192 span { display: block; overflow-wrap: anywhere; }
      .president-dashboard-list-v192 span { color: var(--muted); font-size: .88rem; margin-top: .15rem; }
      .president-dashboard-note-v192 { margin-top: .85rem; }
      @media (max-width: 980px) {
        .president-dashboard-metrics-v192 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .president-dashboard-content-v192 { grid-template-columns: 1fr; }
      }
      @media (max-width: 760px) {
        .president-dashboard-v192 { margin-inline: 0; }
        .president-dashboard-header-v192 { align-items: stretch; }
        .president-dashboard-actions-v192 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); width: 100%; }
        .president-dashboard-actions-v192 .button { width: 100%; min-width: 0; padding-inline: .45rem; }
        .president-dashboard-metrics-v192 { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .55rem; }
        .president-dashboard-metric-v192 { padding: .72rem; }
        .president-dashboard-metric-v192 strong { font-size: 1.12rem; }
      }
      @media (max-width: 420px) {
        .president-dashboard-actions-v192 { grid-template-columns: 1fr; }
        .president-dashboard-metrics-v192 { grid-template-columns: 1fr; }
      }
    `;
    document.head.appendChild(style);
  }

  function installRenderHooks() {
    const renderUserAreaBefore = getRenderUserArea();
    if (typeof renderUserAreaBefore === "function") {
      setRenderUserArea(function renderUserAreaV212() {
        const result = renderUserAreaBefore?.();
        injectPresidentDashboard();
        return result;
      });
    }

    const renderAllBefore = getRenderAll();
    if (typeof renderAllBefore === "function") {
      setRenderAll(function renderAllV212() {
        const result = renderAllBefore?.();
        injectPresidentDashboard();
        return result;
      });
    }

    if (typeof getRenderMobileTeamAreaHub() === "function") {
      setRenderMobileTeamAreaHub(renderMobileTeamAreaHub);
    }
  }

  function installAdminHelpHook() {
    const renderAdminHelpBefore = getRenderAdminHelpPanel();
    if (typeof renderAdminHelpBefore !== "function") return;
    setRenderAdminHelpPanel(function renderAdminHelpPanelV212() {
      let html = renderAdminHelpBefore?.() || "";
      if (html && !html.includes("Dashboard presidente")) {
        html = html.replace("</div>\n    </section>", "        <article>\n          <h4>Dashboard presidente</h4>\n          <p>Riepilogo operativo per presidenti: saldo FM, rosa, mercato lazy, trattative, movimenti, partite e comunicati squadra. Mobile-first e senza letture Firebase aggiuntive all'avvio.</p>\n        </article>\n      </div>\n    </section>");
      }
      return html;
    });
  }

  function install() {
    installRosterOverride();
    injectStyles();
    installRenderHooks();
    installAdminHelpHook();
    window.ZonaOrientaleRosterDebug = {
      playersForTeam: getRosterPlayersForSeasonTeam,
      seasonTeam: findSeasonTeamForRoster,
      keys: getTeamNameKeys
    };
  }

  install();

  return {
    getTeamNameKeys,
    getTeamKeysFromRecord,
    findSeasonTeamForRoster,
    getRosterPlayersForSeasonTeam,
    getDashboardRoster,
    renderPresidentDashboard,
    renderMobileTeamAreaHub,
    injectPresidentDashboard,
    install
  };
}
