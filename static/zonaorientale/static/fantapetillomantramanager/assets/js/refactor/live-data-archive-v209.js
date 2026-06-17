export function createLiveDataArchiveRefactorV209(deps = {}) {
  const {
    state,
    loadCollection,
    makeEmptyRawData,
    getNewsRawDateValue,
    timestampToDate,
    optionalHelpers = {},
    getHashPage,
    getApprovedTeamUser,
    getCurrentSeasonId,
    archive = {},
    formatMatchResult,
    escapeHtml,
    logger = console
  } = deps;

  if (!state) throw new Error("createLiveDataArchiveRefactorV209 requires state");
  if (typeof loadCollection !== "function") throw new Error("createLiveDataArchiveRefactorV209 requires loadCollection");

  state.liveCollectionsV205 = state.liveCollectionsV205 || {
    newsLoadedAt: "",
    newsLoading: false,
    marketRequestedAt: ""
  };

  function sortLiveNewsRows(rows) {
    return [...(Array.isArray(rows) ? rows : [])].sort((a, b) => {
      const getTime = (item) => {
        const raw = typeof getNewsRawDateValue === "function"
          ? getNewsRawDateValue(item)
          : (item?.publishedAt || item?.createdAt || item?.date || "");
        const date = typeof timestampToDate === "function" ? timestampToDate(raw) : new Date(raw);
        return date && !Number.isNaN(date.getTime()) ? date.getTime() : 0;
      };
      return getTime(b) - getTime(a);
    });
  }

  function callOptional(name, ...args) {
    try {
      const exposed = typeof window !== "undefined" ? window[name] : null;
      if (typeof exposed === "function") return exposed(...args);
    } catch (error) {
      logger.warn(`[FantaPetillo V209] Helper window non riuscito: ${name}`, error);
    }
    try {
      const helper = optionalHelpers[name];
      if (typeof helper === "function") return helper(...args);
    } catch (error) {
      logger.warn(`[FantaPetillo V209] Helper opzionale non riuscito: ${name}`, error);
    }
    return null;
  }

  function renderLiveNewsSurfaces() {
    callOptional("renderNewsPublicV34");
    callOptional("renderDashboardNewsV42");
    callOptional("injectPresidentDashboardV192");
    callOptional("refreshVisibleTeamProfileV120");
    if (getHashPageSafe() === "archive") {
      window.requestAnimationFrame(() => renderSeasonArchive());
    }
  }

  async function loadLiveNewsFromFirebase(options = {}) {
    const { reason = "live-news", render = true } = options || {};
    if (!state.raw) state.raw = typeof makeEmptyRawData === "function" ? makeEmptyRawData() : {};
    if (state.liveCollectionsV205.newsLoading) return state.raw.news || [];
    state.liveCollectionsV205.newsLoading = true;
    try {
      const rows = await loadCollection("news");
      state.raw.news = sortLiveNewsRows(rows);
      state.liveCollectionsV205.newsLoadedAt = new Date().toISOString();
      state.liveCollectionsV205.newsReason = reason;
      if (render) renderLiveNewsSurfaces();
      return state.raw.news;
    } catch (error) {
      logger.warn("Comunicati live Firebase non disponibili, mantengo fallback snapshot/statico.", error);
      return state.raw.news || [];
    } finally {
      state.liveCollectionsV205.newsLoading = false;
    }
  }

  function getHashPageSafe() {
    try {
      if (typeof getHashPage === "function") return getHashPage();
    } catch (_) {}
    return String(window.location.hash || "#dashboard").replace("#", "") || "dashboard";
  }

  function shouldEnsureLiveMarketForPresident() {
    let approved = null;
    try { if (typeof getApprovedTeamUser === "function") approved = getApprovedTeamUser(); } catch (_) {}
    if (!state.user || !approved?.seasonTeamId) return false;
    const page = String(state.currentPage || getHashPageSafe() || "dashboard");
    return page === "teamarea" || page === "dashboard" || page === "fantamercato";
  }

  function ensureLiveTransferMarketForPresident(reason = "president-live-market") {
    if (!shouldEnsureLiveMarketForPresident()) return;
    if (state.transferMarketLoadedV119 || state.transferMarketLoadingV119 || state.transferMarketPromiseV170) return;
    state.liveCollectionsV205.marketRequestedAt = new Date().toISOString();
    callOptional("ensureTransferMarketDataV119", { force: true, reason });
  }

  function scheduleLiveNewsRefresh(reason = "background-live-news") {
    window.setTimeout(() => {
      loadLiveNewsFromFirebase({ reason, render: true }).catch((error) => {
        logger.warn("Comunicati live Firebase non disponibili in background; mantengo dati snapshot/statici.", error);
      });
    }, 0);
  }

  function renderSeasonArchive() {
    const controlsTarget = document.getElementById("seasonArchiveControlsV196");
    const contentTarget = document.getElementById("seasonArchiveContentV196");
    if (!controlsTarget || !contentTarget) return;

    const seasons = archive.getSortedSeasons?.() || [];
    if (!seasons.length) {
      controlsTarget.innerHTML = `<p class="muted">Nessuna stagione disponibile.</p>`;
      contentTarget.innerHTML = `<p class="muted">Carica config.json o fallback Firebase per visualizzare l'archivio.</p>`;
      return;
    }

    const selectedId = archive.getSeasonId?.() || getCurrentSeasonId?.();
    const hasSnapshot = Boolean(archive.getSnapshot?.(selectedId));
    const attempted = Boolean(state.seasonArchiveLoadAttemptedV204?.[selectedId]);
    if (!hasSnapshot && !attempted && typeof archive.ensureSnapshot === "function") {
      archive.renderLoading?.(selectedId);
      archive.ensureSnapshot(selectedId).then(() => renderSeasonArchive?.());
      return;
    }

    const archiveData = archive.build?.(selectedId);
    if (!archiveData) {
      contentTarget.innerHTML = `<p class="muted">Archivio non disponibile per la stagione selezionata.</p>`;
      return;
    }

    controlsTarget.innerHTML = archive.renderControls?.(seasons, selectedId) || "";
    const select = document.getElementById("seasonArchiveSelectV196");
    select?.addEventListener("change", () => archive.setSeasonId?.(select.value));
    document.getElementById("seasonArchiveSyncCurrentV196")?.addEventListener("click", () => archive.setSeasonId?.(getCurrentSeasonId?.()));

    const completedMatches = (archiveData.matches || []).filter((match) => String(match.status || "").toUpperCase() === "PLAYED" || formatMatchResult?.(match) !== "-").length;
    contentTarget.innerHTML = `
      <article class="panel season-archive-hero-v196">
        <div>
          <p class="eyebrow">${escapeHtml?.(archiveData.season.id || "Stagione") || "Stagione"}</p>
          <h3>${escapeHtml?.(archiveData.season.name || archive.getSeasonLabel?.(archiveData.season.id) || archiveData.season.id || "Stagione") || "Stagione"}</h3>
          <p>Riepilogo completo della stagione selezionata, utile per consultazione storica e controllo dati pubblicati.</p>
        </div>
        <div class="season-archive-metrics-v196">
          ${archive.renderMetric?.("Squadre", archiveData.seasonTeams.length, "partecipanti") || ""}
          ${archive.renderMetric?.("Competizioni", archiveData.competitions.length, "caricate") || ""}
          ${archive.renderMetric?.("Partite", archiveData.matches.length, `${completedMatches} con risultato`) || ""}
          ${archive.renderMetric?.("Giocatori", archiveData.rosterEntries.length || "-", "da rosterEntries") || ""}
        </div>
      </article>
      <div class="season-archive-grid-v196">
        <article class="panel season-archive-card-v196 season-archive-card-wide-v196">
          <div class="season-archive-card-heading-v196"><span>👥</span><div><h3>Squadre della stagione</h3><p>Nomi storici, presidenti, saldo, rosa e stadio.</p></div></div>
          ${archive.renderTeams?.(archiveData) || ""}
        </article>
        <article class="panel season-archive-card-v196 season-archive-card-wide-v196">
          <div class="season-archive-card-heading-v196"><span>🏟️</span><div><h3>Competizioni</h3><p>Stato, partite e vincitori delle competizioni.</p></div></div>
          ${archive.renderCompetitions?.(archiveData) || ""}
        </article>
        <article class="panel season-archive-card-v196 season-archive-card-wide-v196">
          <div class="season-archive-card-heading-v196"><span>🧭</span><div><h3>Timeline dati</h3><p>Riepilogo rapido di titoli, competizioni e comunicazioni live.</p></div></div>
          ${archive.renderTimeline?.(archiveData) || ""}
        </article>
      </div>`;
  }

  return {
    sortLiveNewsRows,
    loadLiveNewsFromFirebase,
    renderLiveNewsSurfaces,
    scheduleLiveNewsRefresh,
    shouldEnsureLiveMarketForPresident,
    ensureLiveTransferMarketForPresident,
    renderSeasonArchive,
    liveStatus: () => ({
      ...state.liveCollectionsV205,
      marketLoaded: Boolean(state.transferMarketLoadedV119 || state.transferMarketLoadedV170),
      newsCount: state.raw?.news?.length || 0
    })
  };
}
