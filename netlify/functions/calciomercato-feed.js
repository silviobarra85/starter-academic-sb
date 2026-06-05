const TMW_TEAM_SOURCES_V329 = [
  ['atalanta', 'Atalanta', 'https://www.tuttomercatoweb.com/atalanta/'],
  ['bologna', 'Bologna', 'https://www.tuttomercatoweb.com/bologna/'],
  ['cagliari', 'Cagliari', 'https://www.tuttomercatoweb.com/cagliari/'],
  ['como', 'Como', 'https://www.tuttomercatoweb.com/como/'],
  ['fiorentina', 'Fiorentina', 'https://www.tuttomercatoweb.com/fiorentina/'],
  ['frosinone', 'Frosinone', 'https://www.tuttomercatoweb.com/frosinone/'],
  ['genoa', 'Genoa', 'https://www.tuttomercatoweb.com/genoa/'],
  ['inter', 'Inter', 'https://www.tuttomercatoweb.com/inter/'],
  ['juventus', 'Juventus', 'https://www.tuttomercatoweb.com/juventus/'],
  ['lazio', 'Lazio', 'https://www.tuttomercatoweb.com/lazio/'],
  ['lecce', 'Lecce', 'https://www.tuttomercatoweb.com/lecce/'],
  ['milan', 'Milan', 'https://www.tuttomercatoweb.com/milan/'],
  ['monza', 'Monza', 'https://www.tuttomercatoweb.com/monza/'],
  ['napoli', 'Napoli', 'https://www.tuttomercatoweb.com/napoli/'],
  ['parma', 'Parma', 'https://www.tuttomercatoweb.com/parma/'],
  ['roma', 'Roma', 'https://www.tuttomercatoweb.com/roma/'],
  ['sassuolo', 'Sassuolo', 'https://www.tuttomercatoweb.com/sassuolo/'],
  ['torino', 'Torino', 'https://www.tuttomercatoweb.com/torino/'],
  ['udinese', 'Udinese', 'https://www.tuttomercatoweb.com/udinese/'],
  ['venezia', 'Venezia', 'https://www.tuttomercatoweb.com/venezia/']
].map(([slug, team, url]) => ({
  id: `tmw-${slug}`,
  name: `TMW ${team}`,
  url,
  feedUrls: [url],
  enabled: true,
  topic: 'Mercato',
  sourceType: 'tmw-team-html',
  parseMode: 'html',
  defaultTeams: [team],
  fallbackImageMode: 'tmw-team-text',
  limit: 500,
  timeoutMs: 15000
}));

const DEFAULT_SOURCES = [
  ...TMW_TEAM_SOURCES_V329,
  {
    id: 'sosfanta',
    name: 'SOS Fanta',
    url: 'https://www.sosfanta.com',
    feedUrls: ['https://www.sosfanta.com/feed/'],
    enabled: true,
    topic: 'Fantacalcio',
    limit: 500
  },
  {
    id: 'gianlucadimarzio',
    name: 'Gianluca Di Marzio',
    url: 'https://gianlucadimarzio.com',
    feedUrls: ['https://gianlucadimarzio.com/rss/'],
    enabled: true,
    topic: 'Mercato',
    limit: 500
  },
  {
    id: 'fantacalcio',
    name: 'Fantacalcio.it',
    url: 'https://www.fantacalcio.it',
    feedUrls: ['https://rss.fantacalcio.it/'],
    enabled: true,
    topic: 'Fantacalcio',
    limit: 500
  },
  {
    id: 'calciomercato-it',
    name: 'CalcioMercato.it',
    url: 'https://www.calciomercato.it',
    feedUrls: ['https://www.calciomercato.it/feed/'],
    enabled: true,
    topic: 'Mercato',
    limit: 500
  }
];

const SERIE_A_TEAM_ALIASES = [
  { name: 'Atalanta', aliases: ['Atalanta', 'Dea'] },
  { name: 'Bologna', aliases: ['Bologna'] },
  { name: 'Cagliari', aliases: ['Cagliari'] },
  { name: 'Como', aliases: ['Como'] },
  { name: 'Cremonese', aliases: ['Cremonese'] },
  { name: 'Fiorentina', aliases: ['Fiorentina', 'Viola'] },
  { name: 'Frosinone', aliases: ['Frosinone'] },
  { name: 'Genoa', aliases: ['Genoa'] },
  { name: 'Inter', aliases: ['Inter', 'Internazionale', 'Nerazzurri'] },
  { name: 'Juventus', aliases: ['Juventus', 'Juve', 'Bianconeri'] },
  { name: 'Lazio', aliases: ['Lazio', 'Biancocelesti'] },
  { name: 'Lecce', aliases: ['Lecce'] },
  { name: 'Milan', aliases: ['Milan', 'Rossoneri'] },
  { name: 'Monza', aliases: ['Monza', 'Brianzoli'] },
  { name: 'Napoli', aliases: ['Napoli', 'Partenopei', 'Azzurri'] },
  { name: 'Parma', aliases: ['Parma'] },
  { name: 'Pisa', aliases: ['Pisa'] },
  { name: 'Roma', aliases: ['Roma', 'Giallorossi'] },
  { name: 'Sassuolo', aliases: ['Sassuolo'] },
  { name: 'Torino', aliases: ['Torino', 'Toro', 'Granata'] },
  { name: 'Udinese', aliases: ['Udinese'] },
  { name: 'Venezia', aliases: ['Venezia', 'Lagunari'] },
  { name: 'Verona', aliases: ['Verona', 'Hellas Verona', 'Hellas'] }
];

const CALCIOMERCATO_PERSON_STOPWORDS = new Set([
  'Serie A', 'Serie B', 'Champions League', 'Europa League', 'Conference League',
  'Calciomercato', 'Fantacalcio', 'TuttoMercatoWeb', 'SOS Fanta', 'Gianluca Di Marzio',
  'La Gazzetta', 'Sport', 'Mercato', 'Ufficiale', 'Esclusiva', 'Live', 'Video',
  'Italia', 'Italiano', 'Europeo', 'Mondiale', 'Coppa Italia', 'Supercoppa'
]);

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
    .replace(/&#(\d+);?/g, (match, code) => {
      const point = Number(code);
      if (!Number.isFinite(point) || point < 0) return match;
      try { return String.fromCodePoint(point); } catch (_) { return match; }
    })
    .replace(/&#x([0-9a-fA-F]+);?/g, (match, code) => {
      const point = parseInt(code, 16);
      if (!Number.isFinite(point) || point < 0) return match;
      try { return String.fromCodePoint(point); } catch (_) { return match; }
    })
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item || '').trim()).filter(Boolean);
  return String(value || '').split(/[;,]/).map((item) => item.trim()).filter(Boolean);
}

function clampNumber(value, fallback, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, Math.round(number)));
}

function getSourceFeedUrls(source) {
  const urls = [];
  normalizeList(source.feedUrls || source.rssUrls || source.feeds || []).forEach((url) => urls.push(url));
  normalizeList(source.feedUrl || source.rssUrl || source.feed || '').forEach((url) => urls.push(url));
  return Array.from(new Set(urls.map((url) => String(url || '').trim()).filter(Boolean)));
}

async function fetchWithTimeout(url, options = {}) {
  const timeoutMs = Number(options.timeoutMs || 12000);
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

function normalizeEntityKey(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function hasEntityMatch(text, alias) {
  const haystack = ` ${normalizeEntityKey(text)} `;
  const needle = normalizeEntityKey(alias);
  return !!needle && haystack.includes(` ${needle} `);
}

function uniqueEntities(values, limit = 12) {
  const seen = new Set();
  return (Array.isArray(values) ? values : [])
    .map((value) => String(value || '').replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .filter((value) => {
      const key = normalizeEntityKey(value);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);
}

function inferTeams(text) {
  const teams = [];
  SERIE_A_TEAM_ALIASES.forEach((team) => {
    if ((team.aliases || []).some((alias) => hasEntityMatch(text, alias))) teams.push(team.name);
  });
  return uniqueEntities(teams, 8);
}

function isLikelyPersonName(value, teams = []) {
  const raw = String(value || '').replace(/[.,:;!?()\[\]{}]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!raw || raw.length < 3 || raw.length > 42) return false;
  if (/^\d+$/.test(raw)) return false;
  const words = raw.split(' ').filter(Boolean);
  if (!words.length || words.length > 4) return false;
  if (CALCIOMERCATO_PERSON_STOPWORDS.has(raw)) return false;
  const key = normalizeEntityKey(raw);
  if (!key || key.length < 3) return false;
  const teamKeys = teams.map(normalizeEntityKey);
  if (teamKeys.includes(key)) return false;
  if (['serie', 'calcio', 'mercato', 'fantacalcio', 'diretta', 'ufficiale', 'ultime', 'news'].includes(key)) return false;
  return words.every((word) => /^[A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÖØ-öø-ÿ'’.-]{1,}$/.test(word));
}

function inferPeople(text, teams = []) {
  const rawText = String(text || '').replace(/\s+/g, ' ').trim();
  if (!rawText) return [];
  const candidates = [];
  const signalPatterns = [
    /(?:per|su|segue|piace|obiettivo|tratta|offerta per|rilancio per|contatti per|sondaggio per|accordo con|firma|ufficiale)\s+([A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+(?:\s+[A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+){0,3})/g,
    /([A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+(?:\s+[A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÖØ-öø-ÿ'’.-]+){0,3})\s+(?:verso|al|alla|alla corte|nel mirino|piace|firma|rinnova|saluta)/g
  ];
  signalPatterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(rawText))) candidates.push(match[1]);
  });
  return uniqueEntities(candidates.filter((candidate) => isLikelyPersonName(candidate, teams)), 10);
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
    const people = inferPeople(`${title}. ${description}`, teams);
    const topic = inferTopic(text, source.topic || category || 'Mercato');
    const marketStatus = inferMarketStatus(text);
    const sourceDefaultTeams = normalizeList(source.defaultTeams || source.defaultTeam || []);
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
      teams: teams.length ? teams : sourceDefaultTeams,
      detectedTeams: teams,
      players: [],
      detectedPlayers: people,
      entities: {
        teams,
        people,
        players: people
      },
      tags: [category, source.topic].filter(Boolean)
    };
  }).filter((article) => article.url && article.title);
}


function stripHtml(value) {
  return decodeXml(String(value || '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' '));
}

function getItalianMonthNumber(value) {
  const key = normalizeEntityKey(value);
  const months = {
    gennaio: 1, febbraio: 2, marzo: 3, aprile: 4, maggio: 5, giugno: 6,
    luglio: 7, agosto: 8, settembre: 9, ottobre: 10, novembre: 11, dicembre: 12
  };
  return months[key] || 0;
}

function formatIsoDay(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getRomeOffsetForDateKey(dayKey) {
  const month = Number(String(dayKey || '').slice(5, 7));
  return month >= 3 && month <= 10 ? '+02:00' : '+01:00';
}

function addDaysToDateKey(dayKey, delta) {
  const date = new Date(`${dayKey}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + Number(delta || 0));
  return formatIsoDay(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}

function getTodayRomeDateKey() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Rome',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date()).reduce((acc, part) => {
    if (part.type !== 'literal') acc[part.type] = part.value;
    return acc;
  }, {});
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function parseTmwDateLabelFromText(text, currentDayKey) {
  const cleaned = stripHtml(text || '').toLowerCase();
  if (/\boggi\b/.test(cleaned)) return getTodayRomeDateKey();
  if (/\bieri\b/.test(cleaned)) return addDaysToDateKey(getTodayRomeDateKey(), -1);
  const match = cleaned.match(/(?:lunedi|lunedì|martedi|martedì|mercoledi|mercoledì|giovedi|giovedì|venerdi|venerdì|sabato|domenica)\s+(\d{1,2})\s+([a-zà]+)/i)
    || cleaned.match(/\b(\d{1,2})\s+(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)\b/i);
  if (!match) return currentDayKey;
  const day = Number(match[1]);
  const month = getItalianMonthNumber(match[2]);
  if (!day || !month) return currentDayKey;
  const today = getTodayRomeDateKey();
  let year = Number(today.slice(0, 4));
  const candidate = formatIsoDay(year, month, day);
  if (candidate > addDaysToDateKey(today, 7)) year -= 1;
  return formatIsoDay(year, month, day);
}

function buildTmwPublishedAt(dayKey, timeValue) {
  const time = String(timeValue || '').match(/\b(\d{1,2}):(\d{2})\b/);
  if (!dayKey || !time) return '';
  const hour = String(Math.max(0, Math.min(23, Number(time[1]) || 0))).padStart(2, '0');
  const minute = String(Math.max(0, Math.min(59, Number(time[2]) || 0))).padStart(2, '0');
  return `${dayKey}T${hour}:${minute}:00${getRomeOffsetForDateKey(dayKey)}`;
}

function isTmwArticleUrl(url) {
  const raw = String(url || '').trim();
  if (!raw) return false;
  try {
    const parsed = new URL(raw, 'https://www.tuttomercatoweb.com/');
    const host = parsed.hostname.replace(/^www\./i, '').toLowerCase();
    if (host !== 'tuttomercatoweb.com') return false;
    if (/\/(rss|rss-lista|mobile|network|redazione|contatti|atalanta|bologna|cagliari|como|fiorentina|frosinone|genoa|inter|juventus|lazio|lecce|milan|monza|napoli|parma|roma|sassuolo|torino|udinese|venezia)\/?$/i.test(parsed.pathname)) return false;
    return /-\d{5,}\/?$/i.test(parsed.pathname);
  } catch (_) {
    return false;
  }
}

function extractImageFromHtmlFragment(fragment, baseUrl) {
  const block = String(fragment || '');
  const img = block.match(/<img\b[^>]*(?:src|data-src|data-original|data-lazy-src)=['"]([^'"]+)['"][^>]*>/i);
  if (!img) return '';
  return makeAbsoluteUrl(img[1], baseUrl || 'https://www.tuttomercatoweb.com/');
}

function extractTmwTeamImage(html, source) {
  const explicit = String(source.teamLogoUrl || source.fallbackImage || '').trim();
  if (explicit) return makeAbsoluteUrl(explicit, source.url || source.feedUrl || '');
  const team = normalizeEntityKey(normalizeList(source.defaultTeams || source.defaultTeam || [])[0] || source.name || '');
  if (!team) return '';
  const imgRe = /<img\b[\s\S]*?>/gi;
  let match;
  while ((match = imgRe.exec(html))) {
    const tag = match[0];
    const alt = normalizeEntityKey((tag.match(/\balt=['"]([^'"]+)['"]/i) || [])[1] || '');
    if (!alt || !alt.includes(team)) continue;
    const src = (tag.match(/\b(?:src|data-src|data-original|data-lazy-src)=['"]([^'"]+)['"]/i) || [])[1] || '';
    const image = makeAbsoluteUrl(src, source.url || source.feedUrl || '');
    if (image) return image;
  }
  return '';
}

function parseTmwTeamPage(html, source) {
  const sourceDefaultTeams = normalizeList(source.defaultTeams || source.defaultTeam || []);
  const teamImage = extractTmwTeamImage(html, source);
  const anchorRe = /<a\b([^>]*)\bhref=['"]([^'"]+)['"]([^>]*)>([\s\S]*?)<\/a>/gi;
  const articles = [];
  const seen = new Set();
  let match;
  let lastIndex = 0;
  let currentDayKey = getTodayRomeDateKey();
  while ((match = anchorRe.exec(html))) {
    const between = html.slice(lastIndex, match.index);
    currentDayKey = parseTmwDateLabelFromText(between, currentDayKey);
    lastIndex = anchorRe.lastIndex;
    const href = makeAbsoluteUrl(match[2], source.url || source.feedUrl || 'https://www.tuttomercatoweb.com/');
    if (!isTmwArticleUrl(href) || seen.has(href)) continue;
    const rawTitle = stripHtml(match[4]);
    const title = rawTitle.replace(/^\d{1,2}:\d{2}\s*/, '').trim();
    if (!title || title.length < 8) continue;
    const prefix = stripHtml(html.slice(Math.max(0, match.index - 240), match.index));
    const timeMatch = prefix.match(/(\d{1,2}:\d{2})(?![\s\S]*(\d{1,2}:\d{2}))/) || prefix.match(/\b(\d{1,2}:\d{2})\b/);
    const publishedAt = buildTmwPublishedAt(currentDayKey, timeMatch && timeMatch[1]);
    const text = `${title} ${sourceDefaultTeams.join(' ')}`;
    const teams = inferTeams(text);
    const people = inferPeople(title, teams.length ? teams : sourceDefaultTeams);
    const image = extractImageFromHtmlFragment(match[0], href);
    articles.push({
      id: `${source.id || 'tmw'}-${articles.length}-${Buffer.from(href).toString('base64').slice(0, 12)}`,
      title,
      url: href,
      sourceId: source.id || '',
      sourceName: source.name || source.label || 'TuttoMercatoWeb',
      sourceUrl: source.url || 'https://www.tuttomercatoweb.com',
      sourceType: 'tmw-team-html',
      fallbackImageMode: source.fallbackImageMode || 'tmw-team-text',
      description: '',
      image,
      teamLogoUrl: teamImage,
      publishedAt,
      topic: inferTopic(text, source.topic || 'Mercato'),
      marketStatus: inferMarketStatus(title),
      teams: teams.length ? teams : sourceDefaultTeams,
      detectedTeams: teams,
      players: [],
      detectedPlayers: people,
      entities: {
        teams,
        people,
        players: people
      },
      tags: [source.topic, 'TMW', 'Squadra'].filter(Boolean)
    });
    seen.add(href);
  }
  return articles.filter((article) => article.url && article.title);
}

function parseSourceContent(body, source) {
  const mode = normalizeEntityKey(`${source.parseMode || ''} ${source.sourceType || ''}`);
  const rssArticles = parseFeed(body, source);
  if (rssArticles.length && !mode.includes('html')) return rssArticles;
  if (mode.includes('tmw team html') || mode.includes('tmw') || /tuttomercatoweb\.com\/[^/]+\/?$/i.test(String(source.feedUrl || source.url || ''))) {
    const htmlArticles = parseTmwTeamPage(body, source);
    return htmlArticles.length ? htmlArticles : rssArticles;
  }
  return rssArticles;
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
  if (!source.enabled && source.enabled !== undefined) return { source, articles: [], warning: `${source.name || source.url}: fonte disattivata` };
  const feedUrls = getSourceFeedUrls(source);
  if (!feedUrls.length) return { source, articles: [], warning: `${source.name || source.url}: feedUrl non configurato` };
  const perSourceLimit = clampNumber(source.limit || source.sourceLimit, 500, 1, 2000);
  const settled = await Promise.allSettled(feedUrls.map(async (feedUrl) => {
    const response = await fetchWithTimeout(feedUrl, { timeoutMs: Number(source.timeoutMs || 12000) });
    if (!response.ok) throw new Error(`${source.name || feedUrl}: HTTP ${response.status}`);
    const body = await response.text();
    return parseSourceContent(body, { ...source, feedUrl }).filter(isLikelyMarketArticle);
  }));
  const warnings = [];
  const articles = [];
  settled.forEach((result, index) => {
    if (result.status === 'fulfilled') articles.push(...result.value);
    else warnings.push(result.reason?.message || `${source.name || feedUrls[index]}: feed non disponibile`);
  });
  const byUrl = new Map();
  articles
    .sort((a, b) => String(b.publishedAt || '').localeCompare(String(a.publishedAt || '')))
    .forEach((article) => {
      if (!byUrl.has(article.url)) byUrl.set(article.url, article);
    });
  const uniqueArticles = Array.from(byUrl.values()).slice(0, perSourceLimit);
  const warning = uniqueArticles.length ? warnings.join(' | ') : (warnings.join(' | ') || `${source.name || feedUrls[0]}: nessun articolo utile trovato`);
  return { source, articles: uniqueArticles, warning };
}

function parseDateParam(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizeSearch(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

function articleMatchesQuery(article, query) {
  const q = normalizeSearch(query);
  if (!q) return true;
  const haystack = normalizeSearch([
    article.title,
    article.description,
    article.sourceName,
    article.url,
    article.topic,
    article.marketStatus,
    ...(Array.isArray(article.teams) ? article.teams : []),
    ...(Array.isArray(article.players) ? article.players : []),
    ...(Array.isArray(article.detectedPlayers) ? article.detectedPlayers : []),
    ...(Array.isArray(article.detectedTeams) ? article.detectedTeams : []),
    ...(Array.isArray(article.tags) ? article.tags : [])
  ].join(' '));
  return haystack.includes(q);
}

function articleMatchesDateRange(article, fromDate, toDate) {
  if (!fromDate && !toDate) return true;
  const timestamp = article.publishedAt ? new Date(article.publishedAt).getTime() : 0;
  if (!timestamp || !Number.isFinite(timestamp)) return false;
  if (fromDate && timestamp < fromDate.getTime()) return false;
  if (toDate && timestamp > toDate.getTime()) return false;
  return true;
}

function getFeedRange(articles) {
  const timestamps = (Array.isArray(articles) ? articles : [])
    .map((article) => article && article.publishedAt ? new Date(article.publishedAt).getTime() : 0)
    .filter((timestamp) => timestamp && Number.isFinite(timestamp));
  if (!timestamps.length) {
    return { earliest: '', latest: '', totalBeforeDateRange: Array.isArray(articles) ? articles.length : 0 };
  }
  return {
    earliest: new Date(Math.min(...timestamps)).toISOString(),
    latest: new Date(Math.max(...timestamps)).toISOString(),
    totalBeforeDateRange: Array.isArray(articles) ? articles.length : 0
  };
}

function articleMatchesSource(article, sourceFilter) {
  const source = normalizeSearch(sourceFilter);
  if (!source || source === 'all') return true;
  return normalizeSearch(article.sourceName) === source || normalizeSearch(article.sourceId) === source;
}

exports.handler = async (event) => {
  try {
    const config = await loadConfigFromSite(event).catch(() => null);
    const configuredSources = Array.isArray(config?.sources) && config.sources.length ? config.sources : DEFAULT_SOURCES;
    const params = event.queryStringParameters || {};
    const query = String(params.q || params.query || '').trim();
    const fromDate = parseDateParam(params.from || params.dateFrom || params.start);
    const toDate = parseDateParam(params.to || params.dateTo || params.end);
    const sourceFilter = String(params.source || '').trim();
    const activeSources = configuredSources
      .filter((source) => source && source.enabled !== false)
      .filter((source) => articleMatchesSource({ sourceName: source.name || source.label || '', sourceId: source.id || '' }, sourceFilter))
      .slice(0, clampNumber(config?.maxSources, 50, 1, 50));
    const globalLimit = clampNumber(params.limit || params.maxArticles || config?.maxArticles, 5000, 1, 5000);
    const results = await Promise.allSettled(activeSources.map(fetchSource));
    const warnings = [];
    const articles = [];
    const sources = activeSources.map((source) => ({
      id: source.id || '',
      name: source.name || source.label || source.url || 'Fonte',
      url: source.url || '',
      feedUrl: getSourceFeedUrls(source)[0] || '',
      feedUrls: getSourceFeedUrls(source),
      enabled: source.enabled !== false,
      sourceType: source.sourceType || '',
      parseMode: source.parseMode || '',
      defaultTeams: normalizeList(source.defaultTeams || source.defaultTeam || []),
      fallbackImageMode: source.fallbackImageMode || ''
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

    const uniqueArticles = Array.from(byUrl.values())
      .filter((article) => articleMatchesSource(article, sourceFilter))
      .filter((article) => articleMatchesQuery(article, query));
    const feedRange = getFeedRange(uniqueArticles);
    const filteredArticles = uniqueArticles
      .filter((article) => articleMatchesDateRange(article, fromDate, toDate))
      .slice(0, globalLimit);

    const rangeWarnings = [];
    if ((fromDate || toDate) && !filteredArticles.length && uniqueArticles.length) {
      rangeWarnings.push('Nessun articolo nel range richiesto: i feed RSS espongono solo gli ultimi articoli disponibili, non un archivio storico completo.');
    }

    return jsonResponse(200, {
      version: 'V329',
      sourceMode: 'automatic-rss',
      generatedAt: new Date().toISOString(),
      query,
      range: {
        from: fromDate ? fromDate.toISOString() : '',
        to: toDate ? toDate.toISOString() : ''
      },
      limits: {
        maxArticles: globalLimit,
        maxSources: activeSources.length,
        perSourceMax: 2000
      },
      sources,
      warnings: [...warnings, ...rangeWarnings],
      removedSourcesV316: Array.isArray(config?.removedSourcesV316) ? config.removedSourcesV316 : ['TuttoMercatoWeb', 'tuttomercatoweb'],
      feedRange: {
        ...feedRange,
        totalFetched: Array.from(byUrl.values()).length,
        totalAfterQueryBeforeDateRange: uniqueArticles.length
      },
      articles: filteredArticles
    });
  } catch (error) {
    return jsonResponse(200, {
      version: 'V329',
      sourceMode: 'automatic-rss-error',
      generatedAt: new Date().toISOString(),
      sources: DEFAULT_SOURCES,
      warnings: [String(error?.message || error || 'Errore recupero fonti')],
      articles: []
    });
  }
};
