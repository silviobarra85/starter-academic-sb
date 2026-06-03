const DEFAULT_SOURCES = [
  {
    id: 'tmw',
    name: 'TuttoMercatoWeb',
    url: 'https://www.tuttomercatoweb.com',
    feedUrl: 'https://www.tuttomercatoweb.com/rss/',
    enabled: true,
    topic: 'Mercato'
  },
  {
    id: 'sosfanta',
    name: 'SOS Fanta',
    url: 'https://www.sosfanta.com',
    feedUrl: 'https://www.sosfanta.com/feed/',
    enabled: true,
    topic: 'Fantacalcio'
  },
  {
    id: 'gianlucadimarzio',
    name: 'Gianluca Di Marzio',
    url: 'https://gianlucadimarzio.com',
    feedUrl: 'https://gianlucadimarzio.com/rss/',
    enabled: true,
    topic: 'Mercato'
  }
];

const SERIE_A_TEAMS = [
  'Atalanta', 'Bologna', 'Cagliari', 'Como', 'Cremonese', 'Fiorentina', 'Genoa',
  'Inter', 'Juventus', 'Lazio', 'Lecce', 'Milan', 'Napoli', 'Parma', 'Pisa',
  'Roma', 'Sassuolo', 'Torino', 'Udinese', 'Verona', 'Hellas Verona'
];

const MARKET_KEYWORDS = [
  'mercato', 'calciomercato', 'trattativa', 'trattative', 'interesse', 'obiettivo',
  'accordo', 'firma', 'prestito', 'riscatto', 'cessione', 'acquisto', 'offerta',
  'contatti', 'sondaggio', 'ufficiale', 'fantacalcio', 'infortun', 'asta', 'probabili'
];

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=900, stale-while-revalidate=1800'
    },
    body: JSON.stringify(body)
  };
}

function textBetween(input, startTag, endTag) {
  const start = input.indexOf(startTag);
  if (start < 0) return '';
  const from = start + startTag.length;
  const end = input.indexOf(endTag, from);
  if (end < 0) return '';
  return input.slice(from, end);
}

function stripCdata(value) {
  return String(value || '').replace(/^\s*<!\[CDATA\[/, '').replace(/\]\]>\s*$/, '').trim();
}

function decodeXml(value) {
  return stripCdata(value)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item || '').trim()).filter(Boolean);
  return String(value || '').split(/[;,]/).map((item) => item.trim()).filter(Boolean);
}

async function fetchWithTimeout(url, options = {}) {
  const timeoutMs = Number(options.timeoutMs || 8500);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      headers: {
        'user-agent': 'ZonaOrientaleCalciomercatoBot/1.0 (+https://silviobarra.com/zonaorientale/)',
        accept: options.accept || 'application/rss+xml, application/xml, text/xml, text/html;q=0.8'
      },
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
}

function makeAbsoluteUrl(url, baseUrl) {
  const raw = String(url || '').trim();
  if (!raw) return '';
  try {
    return new URL(raw, baseUrl).toString();
  } catch (_) {
    return '';
  }
}

function extractTag(block, tagName) {
  const escaped = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, 'i');
  const match = block.match(re);
  return match ? decodeXml(match[1]) : '';
}

function extractLink(block) {
  const atom = block.match(/<link\s+[^>]*href=["']([^"']+)["'][^>]*>/i);
  if (atom) return decodeXml(atom[1]);
  return extractTag(block, 'link');
}

function extractImage(block) {
  const media = block.match(/<(?:media:thumbnail|media:content)\s+[^>]*url=["']([^"']+)["'][^>]*>/i);
  if (media) return decodeXml(media[1]);
  const enclosure = block.match(/<enclosure\s+[^>]*url=["']([^"']+)["'][^>]*type=["']image\//i);
  if (enclosure) return decodeXml(enclosure[1]);
  return '';
}

function inferTeams(text) {
  const haystack = ` ${String(text || '').toLowerCase()} `;
  const teams = SERIE_A_TEAMS.filter((team) => haystack.includes(` ${team.toLowerCase()} `));
  return Array.from(new Set(teams.map((team) => (team === 'Hellas Verona' ? 'Verona' : team))));
}

function inferTopic(text, fallback) {
  const haystack = String(text || '').toLowerCase();
  if (/fantacalcio|asta|bonus|malus|probabili|infortun/.test(haystack)) return 'Fantacalcio';
  if (/ufficiale|firma|comunicato/.test(haystack)) return 'Ufficiale';
  if (/trattativa|contatti|obiettivo|offerta|sondaggio|interesse/.test(haystack)) return 'Trattativa';
  return fallback || 'Mercato';
}

function inferMarketStatus(text) {
  const haystack = String(text || '').toLowerCase();
  if (/ufficiale|ha firmato|comunicato/.test(haystack)) return 'Ufficiale';
  if (/accordo|intesa|chiusura|fatta/.test(haystack)) return 'Accordo';
  if (/offerta|rilancio/.test(haystack)) return 'Offerta';
  if (/sondaggio|interesse|piace|obiettivo/.test(haystack)) return 'Interesse';
  if (/trattativa|contatti/.test(haystack)) return 'Trattativa';
  return '';
}

function parseFeed(xml, source) {
  const blocks = [];
  const itemRe = /<item\b[\s\S]*?<\/item>/gi;
  const entryRe = /<entry\b[\s\S]*?<\/entry>/gi;
  let match;
  while ((match = itemRe.exec(xml))) blocks.push(match[0]);
  while ((match = entryRe.exec(xml))) blocks.push(match[0]);

  return blocks.map((block, index) => {
    const title = extractTag(block, 'title') || 'Articolo di mercato';
    const description = extractTag(block, 'description') || extractTag(block, 'summary') || extractTag(block, 'content:encoded');
    const link = makeAbsoluteUrl(extractLink(block), source.url || source.feedUrl || '');
    const date = extractTag(block, 'pubDate') || extractTag(block, 'published') || extractTag(block, 'updated');
    const category = extractTag(block, 'category');
    const text = `${title} ${description} ${category}`;
    const teams = inferTeams(text);
    const topic = inferTopic(text, source.topic || category || 'Mercato');
    const marketStatus = inferMarketStatus(text);
    return {
      id: `${source.id || source.name || 'source'}-${index}-${Buffer.from(link || title).toString('base64').slice(0, 12)}`,
      title,
      url: link,
      sourceId: source.id || '',
      sourceName: source.name || source.label || source.url || 'Fonte',
      description,
      image: makeAbsoluteUrl(extractImage(block), link || source.url || source.feedUrl || ''),
      publishedAt: date ? new Date(date).toISOString() : '',
      topic,
      marketStatus,
      teams: teams.length ? teams : normalizeList(source.defaultTeams || source.defaultTeam || []),
      players: [],
      tags: [category, source.topic].filter(Boolean)
    };
  }).filter((article) => article.url && article.title);
}

function isLikelyMarketArticle(article) {
  const text = `${article.title || ''} ${article.description || ''} ${article.topic || ''} ${article.marketStatus || ''}`.toLowerCase();
  return MARKET_KEYWORDS.some((keyword) => text.includes(keyword)) || (article.teams || []).length > 0;
}

async function loadConfigFromSite(event) {
  const host = event.headers.host;
  const proto = event.headers['x-forwarded-proto'] || 'https';
  const origin = host ? `${proto}://${host}` : (process.env.URL || process.env.DEPLOY_PRIME_URL || '');
  if (!origin) return null;
  const configUrl = `${origin}/zonaorientale/assets/calciomercato/links.json`;
  const response = await fetchWithTimeout(configUrl, { timeoutMs: 4500, accept: 'application/json' });
  if (!response.ok) return null;
  return response.json();
}

async function fetchSource(source) {
  const feedUrl = source.feedUrl || source.rssUrl || source.feed || '';
  if (!source.enabled && source.enabled !== undefined) return { source, articles: [], warning: `${source.name || source.url}: fonte disattivata` };
  if (!feedUrl) return { source, articles: [], warning: `${source.name || source.url}: feedUrl non configurato` };
  const response = await fetchWithTimeout(feedUrl, { timeoutMs: Number(source.timeoutMs || 8500) });
  if (!response.ok) return { source, articles: [], warning: `${source.name || feedUrl}: HTTP ${response.status}` };
  const xml = await response.text();
  const articles = parseFeed(xml, source).filter(isLikelyMarketArticle).slice(0, Number(source.limit || 12));
  return { source, articles, warning: articles.length ? '' : `${source.name || feedUrl}: nessun articolo utile trovato` };
}

exports.handler = async (event) => {
  try {
    const config = await loadConfigFromSite(event).catch(() => null);
    const configuredSources = Array.isArray(config?.sources) && config.sources.length ? config.sources : DEFAULT_SOURCES;
    const activeSources = configuredSources.filter((source) => source && source.enabled !== false).slice(0, 8);
    const results = await Promise.allSettled(activeSources.map(fetchSource));
    const warnings = [];
    const articles = [];
    const sources = activeSources.map((source) => ({
      id: source.id || '',
      name: source.name || source.label || source.url || 'Fonte',
      url: source.url || '',
      feedUrl: source.feedUrl || source.rssUrl || source.feed || '',
      enabled: source.enabled !== false
    }));

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        if (result.value.warning) warnings.push(result.value.warning);
        articles.push(...result.value.articles);
      } else {
        warnings.push(String(result.reason?.message || result.reason || 'Errore fonte'));
      }
    });

    const byUrl = new Map();
    articles
      .sort((a, b) => String(b.publishedAt || '').localeCompare(String(a.publishedAt || '')))
      .forEach((article) => {
        if (!byUrl.has(article.url)) byUrl.set(article.url, article);
      });

    return jsonResponse(200, {
      version: 'V309',
      sourceMode: 'automatic-rss',
      generatedAt: new Date().toISOString(),
      sources,
      warnings,
      articles: Array.from(byUrl.values()).slice(0, 40)
    });
  } catch (error) {
    return jsonResponse(200, {
      version: 'V309',
      sourceMode: 'automatic-rss-error',
      generatedAt: new Date().toISOString(),
      sources: DEFAULT_SOURCES,
      warnings: [String(error?.message || error || 'Errore recupero fonti')],
      articles: []
    });
  }
};
