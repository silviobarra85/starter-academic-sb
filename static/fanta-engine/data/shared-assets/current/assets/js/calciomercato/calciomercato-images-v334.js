/*
 * V334 - Helper immagini/testi Calciomercato estratti da app.js.
 * Refactor protetto: nessuna chiamata rete, nessuna modifica DOM persistente,
 * nessun cambio a feed, archivi, filtri o card.
 */

const CALCIOMERCATO_SOURCE_IMAGE_LABELS_V334 = {
  "tmw": "TuttoMercatoWeb",
  "tuttomercatoweb": "TuttoMercatoWeb",
  "sosfanta": "SOS Fanta",
  "sos-fanta": "SOS Fanta",
  "gianlucadimarzio": "Gianluca Di Marzio",
  "gianluca-di-marzio": "Gianluca Di Marzio",
  "fantacalcio": "Fantacalcio.it",
  "fantacalcio-it": "Fantacalcio.it",
  "calciomercato-it": "CalcioMercato.it",
  "calciomercato": "CalcioMercato.it"
};

function identityNormalize(value) {
  return String(value || "").trim().toLowerCase();
}

function arrayNormalize(value) {
  if (Array.isArray(value)) return value.map((item) => String(item || "").trim()).filter(Boolean);
  const raw = String(value || "").trim();
  return raw ? [raw] : [];
}

function escapeSvgText(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");
}

function buildSourceImageSvg(label) {
  const safeLabel = escapeSvgText(label || "Fonte");
  const initials = safeLabel
    .replace(/&amp;/g, "&")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "ZO";
  const safeInitials = escapeSvgText(initials.slice(0, 4));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360" role="img" aria-label="Fonte ${safeLabel}">
    <rect width="640" height="360" rx="44" fill="#0f172a"/>
    <rect x="28" y="28" width="584" height="304" rx="34" fill="#172554" stroke="#f8b500" stroke-width="4"/>
    <circle cx="320" cy="142" r="70" fill="#f8b500" opacity="0.95"/>
    <text x="320" y="165" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="54" font-weight="800" fill="#0f172a">${safeInitials}</text>
    <text x="320" y="246" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="800" fill="#fff7ed">${safeLabel}</text>
    <text x="320" y="286" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" fill="#fed7aa">Fonte articolo</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function decodeTextOnce(value) {
  const raw = String(value || "");
  if (!raw || !raw.includes("&")) return raw;
  const numericDecoded = raw
    .replace(/&#(\d+);?/g, (match, code) => {
      const point = Number(code);
      if (!Number.isFinite(point) || point < 0) return match;
      try { return String.fromCodePoint(point); } catch (error) { return match; }
    })
    .replace(/&#x([0-9a-fA-F]+);?/g, (match, code) => {
      const point = parseInt(code, 16);
      if (!Number.isFinite(point) || point < 0) return match;
      try { return String.fromCodePoint(point); } catch (error) { return match; }
    })
    .replace(/&apos;?/g, "'")
    .replace(/&quot;?/g, '"')
    .replace(/&nbsp;?/g, " ")
    .replace(/&amp;?/g, "&")
    .replace(/&lt;?/g, "<")
    .replace(/&gt;?/g, ">");
  if (typeof document === "undefined") return numericDecoded;
  decodeTextOnce._element = decodeTextOnce._element || document.createElement("textarea");
  decodeTextOnce._element.innerHTML = numericDecoded;
  return decodeTextOnce._element.value || numericDecoded;
}

function decodeText(value) {
  let decoded = String(value || "");
  if (!decoded || !decoded.includes("&")) return decoded;
  for (let index = 0; index < 2; index += 1) {
    const next = decodeTextOnce(decoded);
    if (next === decoded) break;
    decoded = next;
    if (!decoded.includes("&")) break;
  }
  return decoded.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").trim();
}

function getSourceHomepage(article, sourceConfig) {
  const candidates = [
    article?.sourceUrl,
    article?.sourceHomepage,
    article?.sourceHome,
    sourceConfig?.url,
    sourceConfig?.siteUrl,
    sourceConfig?.homepage,
    article?.url
  ];
  for (const candidate of candidates) {
    const raw = String(candidate || "").trim();
    if (!/^https?:\/\//i.test(raw)) continue;
    try {
      const parsed = new URL(raw);
      return parsed.origin;
    } catch (error) {
      // Ignora URL non validi e prova il candidato successivo.
    }
  }
  return "";
}

function buildSourceFaviconUrl(article, sourceConfig) {
  const explicitIcon = String(
    article?.sourceFavicon ||
    article?.favicon ||
    sourceConfig?.sourceFavicon ||
    sourceConfig?.favicon ||
    sourceConfig?.faviconUrl ||
    ""
  ).trim();
  if (/^https?:\/\//i.test(explicitIcon) || explicitIcon.startsWith("./") || explicitIcon.startsWith("/")) return explicitIcon;
  const homepage = getSourceHomepage(article, sourceConfig);
  if (!homepage) return "";
  try {
    return new URL("/favicon.ico", homepage).toString();
  } catch (error) {
    return "";
  }
}

function buildTeamCrestSvg(teamName) {
  const safeTeam = escapeSvgText(teamName || "Squadra");
  const initials = safeTeam
    .replace(/&amp;/g, "&")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "ZO";
  const safeInitials = escapeSvgText(initials.slice(0, 3));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360" role="img" aria-label="Scudetto ${safeTeam}">
    <defs>
      <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#020617"/><stop offset="1" stop-color="#1e3a8a"/></linearGradient>
      <linearGradient id="shield" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#f8b500"/><stop offset="1" stop-color="#fff7ed"/></linearGradient>
    </defs>
    <rect width="640" height="360" rx="44" fill="url(#bg)"/>
    <path d="M320 42 458 92v92c0 82-55 126-138 156-83-30-138-74-138-156V92L320 42Z" fill="url(#shield)" stroke="#fff7ed" stroke-width="6"/>
    <path d="M218 118h204v66c0 58-37 91-102 118-65-27-102-60-102-118v-66Z" fill="#0f172a" opacity="0.95"/>
    <text x="320" y="196" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="900" fill="#f8b500">${safeInitials}</text>
    <text x="320" y="276" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="900" fill="#fff7ed">${safeTeam}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function buildTmwTeamTextSvg(teamName) {
  const teamLabel = decodeText(teamName || "Squadra") || "Squadra";
  const fullLabel = `TMW - ${teamLabel}`;
  const safeTeam = escapeSvgText(teamLabel);
  const safeFullLabel = escapeSvgText(fullLabel);
  const safeCompactLabel = escapeSvgText(fullLabel.length > 24 ? `${fullLabel.slice(0, 23)}…` : fullLabel);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360" role="img" aria-label="${safeFullLabel}">
    <defs>
      <linearGradient id="tmwBg" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#020617"/><stop offset="1" stop-color="#111827"/></linearGradient>
      <linearGradient id="tmwBand" x1="0" x2="1" y1="0" y2="0"><stop stop-color="#f8b500"/><stop offset="1" stop-color="#fed7aa"/></linearGradient>
    </defs>
    <rect width="640" height="360" rx="44" fill="url(#tmwBg)"/>
    <rect x="34" y="34" width="572" height="292" rx="34" fill="#0f172a" stroke="#f8b500" stroke-width="4"/>
    <rect x="74" y="76" width="492" height="78" rx="26" fill="url(#tmwBand)"/>
    <text x="320" y="132" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="58" font-weight="900" fill="#0f172a">TMW</text>
    <text x="320" y="226" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="900" fill="#fff7ed">${safeCompactLabel}</text>
    <text x="320" y="276" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="800" fill="#fed7aa">${safeTeam}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function createSourceConfigFinder({ normalizeValue, getSources, getSourceLabel }) {
  return function findSourceConfig(article) {
    const articleKeys = [
      article?.sourceId,
      article?.sourceName,
      article?.source,
      article?.sourceLabel,
      getSourceLabel(article)
    ].map(normalizeValue).filter(Boolean);
    if (!articleKeys.length) return null;
    return getSources().find((source) => {
      const sourceKeys = [source?.id, source?.name, source?.label, source?.url]
        .map(normalizeValue)
        .filter(Boolean);
      return sourceKeys.some((key) => articleKeys.includes(key));
    }) || null;
  };
}

export function createCalciomercatoImageHelpersV334(dependencies = {}) {
  const normalizeValue = dependencies.normalizeValue || identityNormalize;
  const normalizeList = dependencies.normalizeList || arrayNormalize;
  const getSources = dependencies.getSources || (() => []);
  const getSourceLabel = dependencies.getSourceLabel || (() => "Fonte");
  const findSourceConfig = createSourceConfigFinder({ normalizeValue, getSources, getSourceLabel });

  function getSourceImageKey(article) {
    const raw = article?.sourceId || article?.sourceName || article?.source || article?.sourceLabel || getSourceLabel(article);
    return normalizeValue(raw).replace(/\./g, "-");
  }

  function isStaticArchiveArticle(article) {
    const mode = normalizeValue([
      article?.archiveSourceMode,
      article?.sourceMode,
      article?.mode,
      article?.sourceType
    ].filter(Boolean).join(" "));
    return !!article?.archiveDay || mode.includes("static-archive") || mode.includes("static-rss-archive");
  }

  function isTmwTeamSource(article, sourceConfig) {
    const values = [
      article?.sourceId,
      article?.sourceName,
      article?.source,
      article?.sourceType,
      article?.fallbackImageMode,
      sourceConfig?.id,
      sourceConfig?.name,
      sourceConfig?.sourceType,
      sourceConfig?.fallbackImageMode
    ].map(normalizeValue).filter(Boolean);
    return values.some((value) => value === "team-crest" || value === "tmw-team-text" || value.includes("tmw-team") || value.startsWith("tmw-"));
  }

  function getFallbackTeamLabel(article, sourceConfig) {
    const team = normalizeList(article?.teams || article?.detectedTeams || sourceConfig?.defaultTeams || sourceConfig?.defaultTeam || []).find(Boolean);
    if (team) return decodeText(team);
    const sourceLabel = decodeText(getSourceLabel(article) || sourceConfig?.name || "");
    return sourceLabel.replace(/^TMW\s+/i, "").trim() || "Squadra";
  }

  function isTmwTeamLogoFallbackImage(article, directImage) {
    if (!directImage) return false;
    const sourceConfig = findSourceConfig(article);
    if (!isTmwTeamSource(article, sourceConfig)) return false;
    const teamLogoUrl = String(article?.teamLogoUrl || article?.fallbackImage || sourceConfig?.teamLogoUrl || sourceConfig?.fallbackImage || "").trim();
    return !!teamLogoUrl && directImage === teamLogoUrl;
  }

  function getArticleImageInfo(article) {
    const directImage = String(article?.image || article?.thumbnail || article?.imageUrl || article?.ogImage || "").trim();
    const sourceConfig = findSourceConfig(article);
    if (directImage && !isTmwTeamLogoFallbackImage(article, directImage)) {
      return { src: directImage, alt: "", isSourceFallback: false, isFaviconFallback: false, isTeamCrestFallback: false, isTmwTeamTextFallback: false };
    }
    const source = decodeText(getSourceLabel(article) || sourceConfig?.name || sourceConfig?.label || "Fonte") || "Fonte";
    const sourceKey = getSourceImageKey(article);
    const label = CALCIOMERCATO_SOURCE_IMAGE_LABELS_V334[sourceKey] || source || "Fonte";
    const fallbackSvg = buildSourceImageSvg(label);
    if (isTmwTeamSource(article, sourceConfig)) {
      const teamName = getFallbackTeamLabel(article, sourceConfig);
      const tmwTeamTextSvg = buildTmwTeamTextSvg(teamName);
      return { src: tmwTeamTextSvg, fallbackSrc: fallbackSvg, alt: `TMW - ${teamName}`, isSourceFallback: true, isFaviconFallback: false, isTeamCrestFallback: false, isTmwTeamTextFallback: true };
    }
    const faviconUrl = buildSourceFaviconUrl(article, sourceConfig);
    if (faviconUrl) return { src: faviconUrl, fallbackSrc: fallbackSvg, alt: `Favicon ${source}`, isSourceFallback: true, isFaviconFallback: true, isTeamCrestFallback: false, isTmwTeamTextFallback: false };
    return { src: fallbackSvg, alt: `Fonte ${label}`, isSourceFallback: true, isFaviconFallback: false, isTeamCrestFallback: false, isTmwTeamTextFallback: false };
  }

  return {
    version: "V334",
    labels: CALCIOMERCATO_SOURCE_IMAGE_LABELS_V334,
    decodeText,
    decodeTextOnce,
    escapeSvgText,
    buildSourceImageSvg,
    buildSourceFaviconUrl,
    getSourceHomepage,
    buildTeamCrestSvg,
    buildTmwTeamTextSvg,
    findSourceConfig,
    getSourceImageKey,
    isStaticArchiveArticle,
    isTmwTeamSource,
    getFallbackTeamLabel,
    isTmwTeamLogoFallbackImage,
    getArticleImageInfo
  };
}
