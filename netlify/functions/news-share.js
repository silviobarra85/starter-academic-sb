/* V231 - Dynamic Open Graph preview for ZonaOrientale news.
   Netlify rewrites /zonaorientale/share/news/:id to this function.
   It reads the Firebase news document at request time, so a new comunicato can
   be shared immediately without generating static HTML files in the repo. */

const FIREBASE_PROJECT_ID = process.env.ZONAORIENTALE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "zonaorientale-d07af";
const FIREBASE_API_KEY = process.env.ZONAORIENTALE_FIREBASE_API_KEY || process.env.FIREBASE_WEB_API_KEY || "AIzaSyB7YQM3bNHwAqhJAUP3hOeYudwyTzioLFM";
const SITE_NAME = "ZonaOrientale Salerno";
const DEFAULT_IMAGE_PATH = "/zonaorientale/assets/icons/android-chrome-512x512.png";

function escapeHtml(value = "") {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function stripMarkdown(value = "") {
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

function buildDescription(news = {}, maxLength = 190) {
  const text = stripMarkdown(news.body || news.description || news.title || "Comunicato ZonaOrientale Salerno");
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 1)).trim()}...`;
}

function getOrigin(event) {
  const forwardedProto = event.headers?.["x-forwarded-proto"] || event.headers?.["X-Forwarded-Proto"] || "https";
  const host = event.headers?.host || event.headers?.Host || "silviobarra.com";
  return `${forwardedProto}://${host}`;
}

function getNewsId(event) {
  const fromQuery = event.queryStringParameters?.id || event.multiValueQueryStringParameters?.id?.[0] || "";
  if (fromQuery) return String(fromQuery);
  const path = String(event.path || "");
  const marker = "/zonaorientale/share/news/";
  const index = path.indexOf(marker);
  if (index >= 0) return decodeURIComponent(path.slice(index + marker.length).split(/[?#]/)[0] || "");
  return "";
}

function readFirestoreValue(value) {
  if (!value || typeof value !== "object") return "";
  if (Object.prototype.hasOwnProperty.call(value, "stringValue")) return value.stringValue;
  if (Object.prototype.hasOwnProperty.call(value, "integerValue")) return Number(value.integerValue || 0);
  if (Object.prototype.hasOwnProperty.call(value, "doubleValue")) return Number(value.doubleValue || 0);
  if (Object.prototype.hasOwnProperty.call(value, "booleanValue")) return Boolean(value.booleanValue);
  if (Object.prototype.hasOwnProperty.call(value, "timestampValue")) return value.timestampValue;
  if (Object.prototype.hasOwnProperty.call(value, "nullValue")) return null;
  if (value.arrayValue?.values) return value.arrayValue.values.map(readFirestoreValue);
  if (value.mapValue?.fields) return readFirestoreFields(value.mapValue.fields);
  return "";
}

function readFirestoreFields(fields = {}) {
  return Object.fromEntries(Object.entries(fields || {}).map(([key, value]) => [key, readFirestoreValue(value)]));
}

async function fetchNewsDocument(id) {
  if (!id) return null;
  const encodedId = encodeURIComponent(id);
  const url = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(FIREBASE_PROJECT_ID)}/databases/(default)/documents/news/${encodedId}?key=${encodeURIComponent(FIREBASE_API_KEY)}`;
  const response = await fetch(url, { headers: { accept: "application/json" } });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Firestore ${response.status}: ${text.slice(0, 200)}`);
  }
  const payload = await response.json();
  return { id, ...readFirestoreFields(payload.fields || {}) };
}

function buildHtml({ event, news, errorMessage = "" }) {
  const origin = getOrigin(event);
  const id = String(news?.id || getNewsId(event) || "");
  const encodedId = encodeURIComponent(id);
  const canonicalUrl = `${origin}/zonaorientale/share/news/${encodedId}`;
  const redirectUrl = `${origin}/zonaorientale/#news-${encodedId}`;
  const imageUrl = `${origin}${DEFAULT_IMAGE_PATH}`;
  const baseTitle = stripMarkdown(news?.title || "Comunicato") || "Comunicato";
  const title = `${baseTitle} - ${SITE_NAME}`;
  const description = errorMessage || buildDescription(news || {});
  const publishedAt = news?.publishedAt || news?.createdAt || "";

  return `<!doctype html>
<html lang="it">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${escapeHtml(imageUrl)}" />
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
  ${publishedAt ? `<meta property="article:published_time" content="${escapeHtml(publishedAt)}" />` : ""}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />
  <meta http-equiv="refresh" content="0; url=${escapeHtml(redirectUrl)}" />
  <script>window.location.replace(${JSON.stringify(redirectUrl)});</script>
</head>
<body>
  <main>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(description)}</p>
    <p><a href="${escapeHtml(redirectUrl)}">Apri il comunicato su ZonaOrientale</a></p>
  </main>
</body>
</html>`;
}

exports.handler = async function handler(event) {
  const headers = {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "public, max-age=60, s-maxage=300"
  };

  const id = getNewsId(event);
  if (!id) {
    return {
      statusCode: 400,
      headers,
      body: buildHtml({ event, news: { title: "Comunicato non trovato" }, errorMessage: "Link comunicato non valido." })
    };
  }

  try {
    const news = await fetchNewsDocument(id);
    if (!news) throw new Error("Comunicato non trovato");
    return { statusCode: 200, headers, body: buildHtml({ event, news }) };
  } catch (error) {
    console.error("news-share error", error);
    return {
      statusCode: 200,
      headers: { ...headers, "cache-control": "no-store" },
      body: buildHtml({
        event,
        news: { id, title: "Comunicato ZonaOrientale" },
        errorMessage: "Il comunicato esiste ma la preview dinamica non e disponibile in questo momento. Apri il link per leggerlo sul sito."
      })
    };
  }
};
