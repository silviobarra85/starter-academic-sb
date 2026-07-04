/*
 * V339 - Filtri Calciomercato estratti in modulo protetto.
 *
 * Il modulo contiene la logica dei filtri della sezione Calciomercato:
 * ricerca testuale, selettori squadra/topic/fonte, range temporale e binding
 * controlli. Non scarica feed, non scrive Firebase e non modifica dati esterni.
 */

export function createCalciomercatoFiltersV339(deps = {}) {
  const escapeHtml = typeof deps.escapeHtml === "function"
    ? deps.escapeHtml
    : (value) => String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");

  const normalizeValue = typeof deps.normalizeValue === "function" ? deps.normalizeValue : (value) => String(value || "").toLowerCase().trim();
  const getArticles = typeof deps.getArticles === "function" ? deps.getArticles : () => [];
  const getTeams = typeof deps.getTeams === "function" ? deps.getTeams : () => [];
  const getTopicLabel = typeof deps.getTopicLabel === "function" ? deps.getTopicLabel : () => "Mercato";
  const getSourceLabel = typeof deps.getSourceLabel === "function" ? deps.getSourceLabel : () => "Fonte";
  const getStatus = typeof deps.getStatus === "function" ? deps.getStatus : () => "";
  const getTimestamp = typeof deps.getTimestamp === "function" ? deps.getTimestamp : () => 0;
  const getRangeBounds = typeof deps.getRangeBounds === "function" ? deps.getRangeBounds : () => ({ from: null, to: null });
  const formatDateTime = typeof deps.formatDateTime === "function" ? deps.formatDateTime : () => "";
  const getPlayers = typeof deps.getPlayers === "function" ? deps.getPlayers : () => [];
  const render = typeof deps.render === "function" ? deps.render : () => {};
  const reload = typeof deps.reload === "function" ? deps.reload : () => {};
  const resetRange = typeof deps.resetRange === "function" ? deps.resetRange : () => {};
  const loadOlder = typeof deps.loadOlder === "function" ? deps.loadOlder : () => {};
  const sectionSelector = deps.sectionSelector || '[data-page="calciomercato"]';
  const bindingFlag = deps.bindingFlag || "calciomercatoBoundV306";

  function getFilteredArticles(state = {}) {
    const search = normalizeValue(state.search);
    const selectedTeam = normalizeValue(state.team);
    const selectedTopic = normalizeValue(state.topic);
    const selectedSource = normalizeValue(state.source);
    const bounds = getRangeBounds();
    const fromTime = bounds.from ? bounds.from.getTime() : 0;
    const toTime = bounds.to ? bounds.to.getTime() : 0;

    return getArticles().filter((article) => {
      const teams = getTeams(article).map(normalizeValue);
      const topic = normalizeValue(getTopicLabel(article));
      const source = normalizeValue(getSourceLabel(article));
      const timestamp = getTimestamp(article);
      if (selectedTeam !== "all" && !teams.includes(selectedTeam)) return false;
      if (selectedTopic !== "all" && topic !== selectedTopic) return false;
      if (selectedSource !== "all" && source !== selectedSource) return false;
      if (fromTime && timestamp && timestamp < fromTime) return false;
      if (toTime && timestamp && timestamp > toTime) return false;
      if (!search) return true;
      const haystack = normalizeValue([
        article?.title,
        article?.description,
        getSourceLabel(article),
        article?.sourceName,
        article?.url,
        ...getTeams(article),
        getTopicLabel(article),
        getStatus(article),
        formatDateTime(article),
        ...getPlayers(article),
        ...(Array.isArray(article?.tags) ? article.tags : [])
      ].join(" "));
      return haystack.includes(search);
    });
  }

  function renderSelectOptions(values, selectedValue, fallbackLabel) {
    const unique = Array.from(new Set((Array.isArray(values) ? values : [])
      .map((value) => String(value || "").trim())
      .filter(Boolean)))
      .sort((a, b) => a.localeCompare(b, "it", { sensitivity: "base" }));
    const selectedKey = normalizeValue(selectedValue || "all");
    return [`<option value="all">${escapeHtml(fallbackLabel)}</option>`, ...unique.map((value) => {
      const key = normalizeValue(value);
      return `<option value="${escapeHtml(value)}" ${key === selectedKey ? "selected" : ""}>${escapeHtml(value)}</option>`;
    })].join("");
  }

  function renderTeamSelectOptions(values, selectedValue) {
    const selectedKey = normalizeValue(selectedValue || "all");
    const unique = Array.from(new Set((Array.isArray(values) ? values : [])
      .map((value) => String(value || "").trim())
      .filter(Boolean)));
    const withoutGeneral = unique
      .filter((value) => normalizeValue(value) !== "generale")
      .sort((a, b) => a.localeCompare(b, "it", { sensitivity: "base" }));
    const ordered = ["Generale", ...withoutGeneral];
    return [`<option value="all">Tutte le squadre</option>`, ...ordered.map((value) => {
      const key = normalizeValue(value);
      return `<option value="${escapeHtml(value)}" ${key === selectedKey ? "selected" : ""}>${escapeHtml(value)}</option>`;
    })].join("");
  }

  function renderSourceSelectOptions(values, selectedValue) {
    return renderSelectOptions(values, selectedValue, "Tutte le fonti");
  }

  function setupControls(state = {}) {
    const section = document.querySelector(sectionSelector);
    if (!section || section.dataset[bindingFlag] === "true") return;
    section.dataset[bindingFlag] = "true";
    section.addEventListener("input", (event) => {
      if (event.target?.id === "calciomercatoSearchV306") {
        state.search = event.target.value || "";
        render();
      }
      if (event.target?.id === "calciomercatoFromV316") {
        state.rangeFrom = event.target.value || "";
        state.manualRange = true;
        render();
      }
      if (event.target?.id === "calciomercatoToV316") {
        state.rangeTo = event.target.value || "";
        state.manualRange = true;
        render();
      }
    });
    section.addEventListener("change", (event) => {
      if (event.target?.id === "calciomercatoTeamFilterV306") {
        state.team = event.target.value || "all";
        render();
      }
      if (event.target?.id === "calciomercatoTopicFilterV306") {
        state.topic = event.target.value || "all";
        render();
      }
      if (event.target?.id === "calciomercatoSourceFilterV314") {
        state.source = event.target.value || "all";
        reload();
      }
    });
    section.addEventListener("click", (event) => {
      if (event.target?.id === "calciomercatoApplyRangeV316") {
        event.preventDefault();
        state.manualRange = true;
        reload();
      }
      if (event.target?.id === "calciomercatoResetRangeV316") {
        event.preventDefault();
        resetRange();
        reload();
      }
      if (event.target?.id === "calciomercatoLoadOlderV316") {
        event.preventDefault();
        loadOlder();
      }
    });
  }

  return {
    version: "V339",
    getFilteredArticles,
    renderSelectOptions,
    renderTeamSelectOptions,
    renderSourceSelectOptions,
    setupControls
  };
}
