#!/usr/bin/env node
/* V228 - Genera pagine statiche per anteprime WhatsApp dei comunicati.

   Uso dalla root del sito statico:
     node tools/generate-news-share-pages.mjs

   Il comando legge assets/snapshots/seasons/*.json, crea/aggiorna:
     - comunicati/<slug>.html per ogni comunicato
     - news.html con i meta Open Graph dell'ultimo comunicato

   Perche serve: WhatsApp non esegue il JavaScript della webapp e legge solo
   i meta tag presenti nell'HTML statico al momento dello scraping. */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const SITE_DIR = path.resolve(path.dirname(__filename), "..");
const SNAPSHOT_DIR = path.join(SITE_DIR, "assets", "snapshots", "seasons");
const SHARE_DIR = path.join(SITE_DIR, "comunicati");
const SITE_NAME = "FantaMantraManager";
const SITE_SHORT_NAME = "FantaMantra";
const BASE_URL = process.env.FANTAPETILLO_BASE_URL || "https://silviobarra.com/fantapetillomantramanager/";
const IMAGE_URL = process.env.FANTAPETILLO_SHARE_IMAGE || "https://silviobarra.com/fantapetillomantramanager/assets/icons/fantamantramanager-android-chrome-512-v475.png";

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

function escapeHtml(value = "") {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeBaseUrl(value = BASE_URL) {
  const base = String(value || BASE_URL).trim() || BASE_URL;
  return base.endsWith("/") ? base : `${base}/`;
}

function createSlug(news = {}) {
  const title = stripMarkdown(news.title || "comunicato") || "comunicato";
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

function getSortTime(news = {}) {
  const raw = news.publishedAt || news.createdAt || "";
  if (raw && typeof raw === "object" && Number.isFinite(raw.seconds)) return raw.seconds * 1000;
  const time = Date.parse(String(raw || ""));
  return Number.isFinite(time) ? time : 0;
}

function buildDescription(news = {}, maxLength = 180) {
  const text = stripMarkdown(news.body || news.description || news.title || `${SITE_NAME} comunicato`);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 1)).trim()}…`;
}

function buildSharePath(news = {}) {
  return `comunicati/${createSlug(news)}.html`;
}

function buildRelativeRedirectUrl(news = {}, pathName = "") {
  const newsHash = news.id ? `#news-${encodeURIComponent(String(news.id))}` : "#news";
  const value = String(pathName || "");
  if (value.includes("/")) return `../${newsHash}`;
  return `./${newsHash}`;
}

function buildSharePageHtml(news = {}, options = {}) {
  const baseUrl = normalizeBaseUrl(options.baseUrl || BASE_URL);
  const title = `${stripMarkdown(news.title || "Comunicato") || "Comunicato"} - ${SITE_NAME}`;
  const description = buildDescription(news);
  const pathName = options.path || buildSharePath(news);
  const canonicalUrl = `${baseUrl}${pathName}`;
  const redirectUrl = options.redirectUrl || buildRelativeRedirectUrl(news, pathName);
  const publishedAt = news.publishedAt || news.createdAt || "";

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
  <meta property="og:image" content="${escapeHtml(IMAGE_URL)}" />
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
  ${publishedAt ? `<meta property="article:published_time" content="${escapeHtml(publishedAt)}" />` : ""}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(IMAGE_URL)}" />
  <meta http-equiv="refresh" content="0; url=${escapeHtml(redirectUrl)}" />
  <script>window.location.replace(${JSON.stringify(redirectUrl)});</script>
</head>
<body>
  <main>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(description)}</p>
    <p><a href="${escapeHtml(redirectUrl)}">Apri il comunicato su ${escapeHtml(SITE_SHORT_NAME)}</a></p>
  </main>
</body>
</html>
`;
}

function buildNoNewsHtml() {
  const baseUrl = normalizeBaseUrl(BASE_URL);
  const title = `Comunicati - ${SITE_NAME}`;
  const description = `Pagina comunicati ${SITE_NAME}: i comunicati saranno pubblicati qui quando saranno disponibili per la stagione 2026-2027.`;
  const canonicalUrl = `${baseUrl}news.html`;
  const redirectUrl = './#news';
  return `<!doctype html>
<html lang="it">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${escapeHtml(IMAGE_URL)}" />
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(IMAGE_URL)}" />
  <meta http-equiv="refresh" content="0; url=${escapeHtml(redirectUrl)}" />
  <script>window.location.replace(${JSON.stringify(redirectUrl)});</script>
</head>
<body>
  <main>
    <h1>${escapeHtml(title)}</h1>
    <p>Nessun comunicato ${escapeHtml(SITE_SHORT_NAME)} e' stato ancora pubblicato per la stagione 2026-2027.</p>
    <p><a href="${escapeHtml(redirectUrl)}">Apri la sezione comunicati su ${escapeHtml(SITE_SHORT_NAME)}</a></p>
  </main>
</body>
</html>
`;
}


function replaceMetaContent(html, attributeName, attributeValue, content) {
  const escapedValue = attributeValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`<meta\\s+${attributeName}="${escapedValue}"\\s+content="[^"]*"\\s*/?>`, "i");
  const replacement = `<meta ${attributeName}="${attributeValue}" content="${escapeHtml(content)}" />`;
  return pattern.test(html) ? html.replace(pattern, replacement) : html;
}

async function updateIndexOpenGraph(latestNews) {
  const indexPath = path.join(SITE_DIR, "index.html");
  let html = await fs.readFile(indexPath, "utf8");
  const title = `${stripMarkdown(latestNews.title || "Comunicato") || "Comunicato"} - ${SITE_NAME}`;
  const description = buildDescription(latestNews);
  const latestPath = buildSharePath(latestNews);
  const latestUrl = `${normalizeBaseUrl(BASE_URL)}${latestPath}`;
  html = replaceMetaContent(html, "name", "description", description);
  html = replaceMetaContent(html, "property", "og:title", title);
  html = replaceMetaContent(html, "property", "og:description", description);
  html = replaceMetaContent(html, "property", "og:image", IMAGE_URL);
  html = replaceMetaContent(html, "property", "og:url", latestUrl);
  html = replaceMetaContent(html, "name", "twitter:title", title);
  html = replaceMetaContent(html, "name", "twitter:description", description);
  if (!/name="twitter:image"/i.test(html)) {
    html = html.replace(/<meta name="twitter:description" content="[^"]*" \/>/i, (match) => `${match}\n  <meta name="twitter:image" content="${escapeHtml(IMAGE_URL)}" />`);
  } else {
    html = replaceMetaContent(html, "name", "twitter:image", IMAGE_URL);
  }
  await fs.writeFile(indexPath, html, "utf8");
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function collectNews() {
  const manifest = await readJson(path.join(SNAPSHOT_DIR, "manifest.json"));
  const byId = new Map();
  for (const entry of manifest.snapshots || []) {
    const file = entry.file || `${entry.seasonId}.json`;
    const snapshot = await readJson(path.join(SNAPSHOT_DIR, file));
    for (const news of snapshot.news || []) {
      if (!news?.id) continue;
      byId.set(news.id, { ...news, seasonId: news.seasonId || snapshot.seasonId || entry.seasonId || "" });
    }
  }
  return [...byId.values()].sort((a, b) => getSortTime(b) - getSortTime(a));
}

async function main() {
  const newsItems = await collectNews();
  await fs.mkdir(SHARE_DIR, { recursive: true });
  for (const news of newsItems) {
    const sharePath = buildSharePath(news);
    const outputFile = path.join(SITE_DIR, sharePath);
    await fs.writeFile(outputFile, buildSharePageHtml(news, { path: sharePath, baseUrl: BASE_URL }), "utf8");
  }
  if (newsItems[0]) {
    const latest = newsItems[0];
    await fs.writeFile(
      path.join(SITE_DIR, "news.html"),
      buildSharePageHtml(latest, {
        path: "news.html",
        baseUrl: BASE_URL,
        redirectUrl: buildRelativeRedirectUrl(latest, "news.html")
      }),
      "utf8"
    );
    await updateIndexOpenGraph(latest);
  }
  console.log(`Generate ${newsItems.length} pagine comunicato in ${path.relative(process.cwd(), SHARE_DIR) || SHARE_DIR}.`);
  if (newsItems[0]) console.log(`Ultimo comunicato: ${newsItems[0].title || newsItems[0].id}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
