/*
 * V338 - Renderer protetto card Calciomercato.
 *
 * Questo modulo contiene solo funzioni pure di rendering HTML per le card
 * articolo. Non legge/scrive Firebase, non scarica feed, non modifica stato
 * globale e non cambia filtri o archivi.
 */

export function createCalciomercatoArticleRendererV338(deps = {}) {
  const escapeHtml = typeof deps.escapeHtml === "function"
    ? deps.escapeHtml
    : (value) => String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");

  const decodeText = typeof deps.decodeText === "function" ? deps.decodeText : (value) => String(value ?? "");
  const getTeams = typeof deps.getTeams === "function" ? deps.getTeams : () => [];
  const getTopicLabel = typeof deps.getTopicLabel === "function" ? deps.getTopicLabel : () => "Mercato";
  const getStatus = typeof deps.getStatus === "function" ? deps.getStatus : () => "";
  const getSourceLabel = typeof deps.getSourceLabel === "function" ? deps.getSourceLabel : () => "Fonte";
  const getImageInfo = typeof deps.getImageInfo === "function" ? deps.getImageInfo : () => ({});
  const formatDateTime = typeof deps.formatDateTime === "function" ? deps.formatDateTime : () => "";
  const renderPlayerTags = typeof deps.renderPlayerTags === "function" ? deps.renderPlayerTags : () => "";

  function normalizeList(list) {
    return Array.isArray(list) ? list.filter(Boolean) : [];
  }

  function renderTeamChips(teams) {
    const list = normalizeList(teams);
    if (!list.length) return "";
    return list.map((team) => `<span class="status ok calciomercato-team-chip-v308">${escapeHtml(team)}</span>`).join("");
  }

  function renderStatusChip(status) {
    if (!status) return "";
    return `<span class="status info calciomercato-status-chip-v308">${escapeHtml(status)}</span>`;
  }

  function renderArticleThumb(imageInfo, safeUrl) {
    const info = imageInfo && typeof imageInfo === "object" ? imageInfo : {};
    const thumbClass = `calciomercato-thumb-v306${info.isSourceFallback ? " calciomercato-thumb-source-v325" : ""}${info.isFaviconFallback ? " calciomercato-thumb-favicon-v328" : ""}${info.isTeamCrestFallback ? " calciomercato-thumb-crest-v329" : ""}${info.isTmwTeamTextFallback ? " calciomercato-thumb-tmw-team-v330" : ""}`;
    const fallbackAttr = info.fallbackSrc ? ` data-fallback-src="${escapeHtml(info.fallbackSrc)}" onerror="this.onerror=null;this.src=this.dataset.fallbackSrc;"` : "";
    if (info.src) {
      return `<a class="${thumbClass}" href="${escapeHtml(safeUrl || '#')}" target="_blank" rel="noopener" aria-label="Apri articolo"><img src="${escapeHtml(info.src)}" alt="${escapeHtml(info.alt || 'Anteprima articolo')}" loading="lazy"${fallbackAttr} /></a>`;
    }
    return `<div class="calciomercato-thumb-v306 calciomercato-thumb-placeholder-v306" aria-hidden="true">📰</div>`;
  }

  function renderArticleCard(article) {
    const title = decodeText(article?.title || "Articolo di mercato") || "Articolo di mercato";
    const url = String(article?.url || "").trim();
    const imageInfo = getImageInfo(article);
    const source = decodeText(getSourceLabel(article)) || "Fonte";
    const teams = getTeams(article).map(decodeText).filter(Boolean);
    const topic = decodeText(getTopicLabel(article)) || "Mercato";
    const status = decodeText(getStatus(article));
    const date = formatDateTime(article);
    const safeUrl = url && /^https?:\/\//i.test(url) ? url : "";

    return `
    <article class="calciomercato-card-v306 compact-card">
      ${renderArticleThumb(imageInfo, safeUrl)}
      <div class="calciomercato-card-body-v306">
        <div class="calciomercato-card-meta-v306">
          ${renderTeamChips(teams)}
          <span class="status warning">${escapeHtml(topic)}</span>
          ${renderStatusChip(status)}
          ${renderPlayerTags(article)}
        </div>
        <h3>${safeUrl ? `<a href="${escapeHtml(safeUrl)}" target="_blank" rel="noopener">${escapeHtml(title)}</a>` : escapeHtml(title)}</h3>
        <div class="calciomercato-card-footer-v306">
          <small class="muted">${escapeHtml(source)}${date ? ` · ${escapeHtml(date)}` : ""}</small>
          ${safeUrl ? `<a class="button button-secondary button-small" href="${escapeHtml(safeUrl)}" target="_blank" rel="noopener">Apri articolo</a>` : `<span class="muted">Link non configurato</span>`}
        </div>
      </div>
    </article>`;
  }

  return {
    version: "V338",
    renderArticleCard,
    renderTeamChips,
    renderStatusChip,
    renderArticleThumb
  };
}
