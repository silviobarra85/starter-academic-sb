/* V228 - WhatsApp/share preview helpers for news.
   The static site cannot change Open Graph tags at runtime for crawlers.
   These helpers keep URLs, slugs, descriptions and generated HTML consistent
   between the browser UI and the offline generator. */

export const NEWS_SHARE_DEFAULT_BASE_URL_V228 = "https://www.silviobarra.com/zonaorientale/";
export const NEWS_SHARE_DEFAULT_IMAGE_V228 = "https://www.silviobarra.com/zonaorientale/assets/icons/android-chrome-512x512.png";

export function stripNewsMarkdownV228(value = "") {
  return String(value || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/^#+\s*/gm, "")
    .replace(/[>~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function createNewsShareSlugV228(news = {}) {
  const title = stripNewsMarkdownV228(news.title || "comunicato") || "comunicato";
  const slug = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "comunicato";
  const suffix = String(news.id || news.publishedAt || "").replace(/[^a-zA-Z0-9]/g, "").slice(-8).toLowerCase();
  return suffix ? `${slug}-${suffix}` : slug;
}

export function buildNewsShareDescriptionV228(news = {}, maxLength = 180) {
  const text = stripNewsMarkdownV228(news.body || news.description || news.title || "Comunicato ZonaOrientale Salerno");
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 1)).trim()}…`;
}

export function normalizeNewsShareBaseUrlV228(baseUrl = NEWS_SHARE_DEFAULT_BASE_URL_V228) {
  const value = String(baseUrl || NEWS_SHARE_DEFAULT_BASE_URL_V228).trim() || NEWS_SHARE_DEFAULT_BASE_URL_V228;
  return value.endsWith("/") ? value : `${value}/`;
}

export function buildNewsSharePathV228(news = {}) {
  return `comunicati/${createNewsShareSlugV228(news)}.html`;
}

export function buildNewsShareUrlV228(news = {}, options = {}) {
  const baseUrl = normalizeNewsShareBaseUrlV228(options.baseUrl || NEWS_SHARE_DEFAULT_BASE_URL_V228);
  const cacheToken = encodeURIComponent(String(news.id || news.publishedAt || Date.now()).replace(/\s+/g, "-"));
  return `${baseUrl}${buildNewsSharePathV228(news)}?v=${cacheToken}`;
}

export function escapeNewsHtmlAttributeV228(value = "") {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function buildNewsSharePageHtmlV228(news = {}, options = {}) {
  const baseUrl = normalizeNewsShareBaseUrlV228(options.baseUrl || NEWS_SHARE_DEFAULT_BASE_URL_V228);
  const title = `${stripNewsMarkdownV228(news.title || "Comunicato") || "Comunicato"} - ZonaOrientale Salerno`;
  const description = buildNewsShareDescriptionV228(news);
  const image = options.imageUrl || NEWS_SHARE_DEFAULT_IMAGE_V228;
  const path = options.path || buildNewsSharePathV228(news);
  const canonicalUrl = `${baseUrl}${path}`;
  const newsHash = news.id ? `#news-${encodeURIComponent(String(news.id))}` : "#news";
  const redirectUrl = options.redirectUrl || `${baseUrl}${newsHash}`;
  const publishedAt = news.publishedAt || news.createdAt || "";

  return `<!doctype html>
<html lang="it">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeNewsHtmlAttributeV228(title)}</title>
  <meta name="description" content="${escapeNewsHtmlAttributeV228(description)}" />
  <link rel="canonical" href="${escapeNewsHtmlAttributeV228(canonicalUrl)}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="ZonaOrientale Salerno" />
  <meta property="og:title" content="${escapeNewsHtmlAttributeV228(title)}" />
  <meta property="og:description" content="${escapeNewsHtmlAttributeV228(description)}" />
  <meta property="og:image" content="${escapeNewsHtmlAttributeV228(image)}" />
  <meta property="og:url" content="${escapeNewsHtmlAttributeV228(canonicalUrl)}" />
  ${publishedAt ? `<meta property="article:published_time" content="${escapeNewsHtmlAttributeV228(publishedAt)}" />` : ""}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeNewsHtmlAttributeV228(title)}" />
  <meta name="twitter:description" content="${escapeNewsHtmlAttributeV228(description)}" />
  <meta name="twitter:image" content="${escapeNewsHtmlAttributeV228(image)}" />
  <meta http-equiv="refresh" content="0; url=${escapeNewsHtmlAttributeV228(redirectUrl)}" />
  <script>window.location.replace(${JSON.stringify(redirectUrl)});</script>
</head>
<body>
  <main>
    <h1>${escapeNewsHtmlAttributeV228(title)}</h1>
    <p>${escapeNewsHtmlAttributeV228(description)}</p>
    <p><a href="${escapeNewsHtmlAttributeV228(redirectUrl)}">Apri il comunicato su ZonaOrientale</a></p>
  </main>
</body>
</html>
`;
}
