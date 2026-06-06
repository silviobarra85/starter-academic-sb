/* V392 - Admin-only FBref player stats fetcher for Soccer Data.
   Fetches one mapped player page at a time, parses all visible/commented tables,
   returns normalized JSON. It does not write to Firebase: the admin UI saves the
   returned payload after confirmation through the regular Firebase client. */

const FIREBASE_PROJECT_ID = process.env.ZONAORIENTALE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'zonaorientale-d07af';
const FIREBASE_API_KEY = process.env.ZONAORIENTALE_FIREBASE_API_KEY || process.env.FIREBASE_WEB_API_KEY || 'AIzaSyB7YQM3bNHwAqhJAUP3hOeYudwyTzioLFM';
const FBREF_ALLOWED_HOST = 'fbref.com';
const USER_AGENT = 'ZonaOrientaleSoccerData/392 (+https://silviobarra.com/zonaorientale/)';

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store, no-cache, must-revalidate, max-age=0'
    },
    body: JSON.stringify(body)
  };
}

function readBearerToken(event) {
  const header = event.headers?.authorization || event.headers?.Authorization || '';
  const match = String(header).match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : '';
}

function readFirestoreValue(value) {
  if (!value || typeof value !== 'object') return '';
  if (Object.prototype.hasOwnProperty.call(value, 'stringValue')) return value.stringValue;
  if (Object.prototype.hasOwnProperty.call(value, 'integerValue')) return Number(value.integerValue || 0);
  if (Object.prototype.hasOwnProperty.call(value, 'doubleValue')) return Number(value.doubleValue || 0);
  if (Object.prototype.hasOwnProperty.call(value, 'booleanValue')) return Boolean(value.booleanValue);
  if (Object.prototype.hasOwnProperty.call(value, 'timestampValue')) return value.timestampValue;
  if (Object.prototype.hasOwnProperty.call(value, 'nullValue')) return null;
  if (value.arrayValue?.values) return value.arrayValue.values.map(readFirestoreValue);
  if (value.mapValue?.fields) return readFirestoreFields(value.mapValue.fields);
  return '';
}

function readFirestoreFields(fields = {}) {
  return Object.fromEntries(Object.entries(fields || {}).map(([key, value]) => [key, readFirestoreValue(value)]));
}

async function verifyAdmin(token) {
  if (!token) return { ok: false, statusCode: 401, message: 'Token admin mancante.' };
  const lookupUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(FIREBASE_API_KEY)}`;
  const lookupResponse = await fetch(lookupUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ idToken: token })
  });
  if (!lookupResponse.ok) return { ok: false, statusCode: 401, message: 'Token Firebase non valido o scaduto.' };
  const lookup = await lookupResponse.json();
  const uid = lookup.users?.[0]?.localId || '';
  if (!uid) return { ok: false, statusCode: 401, message: 'UID admin non trovato nel token.' };
  const adminUrl = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(FIREBASE_PROJECT_ID)}/databases/(default)/documents/admins/${encodeURIComponent(uid)}?key=${encodeURIComponent(FIREBASE_API_KEY)}`;
  const adminResponse = await fetch(adminUrl, { headers: { authorization: `Bearer ${token}`, accept: 'application/json' } });
  if (!adminResponse.ok) return { ok: false, statusCode: 403, message: 'Utente autenticato ma non autorizzato come admin.' };
  const adminDocument = await adminResponse.json();
  const adminData = readFirestoreFields(adminDocument.fields || {});
  if (adminData.disabled === true || String(adminData.status || '').toLowerCase() === 'disabled') {
    return { ok: false, statusCode: 403, message: 'Admin disabilitato.' };
  }
  return { ok: true, uid };
}

function stripTags(value = '') {
  return String(value || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<br\s*\/?\s*>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function getAttribute(tag = '', name = '') {
  const pattern = new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i');
  const match = String(tag || '').match(pattern);
  return match ? (match[2] || match[3] || match[4] || '').trim() : '';
}

function normalizeColumnKey(value = '', fallback = '') {
  return String(value || fallback || '')
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_\-]+/g, '')
    .replace(/^_+|_+$/g, '')
    .toLowerCase() || String(fallback || 'col').toLowerCase();
}

function parseNumber(value) {
  if (value === null || value === undefined) return null;
  const raw = String(value).trim();
  if (!raw || raw === '-' || raw === '—') return null;
  const normalized = raw.replace(/,/g, '').replace(/%$/, '');
  const number = Number(normalized);
  return Number.isFinite(number) ? number : raw;
}

function parseCells(rowHtml = '') {
  const cells = [];
  const cellRegex = /<(t[dh])\b([^>]*)>([\s\S]*?)<\/t[dh]>/gi;
  let match;
  while ((match = cellRegex.exec(rowHtml))) {
    const tagName = match[1].toLowerCase();
    const attrs = match[2] || '';
    const html = match[3] || '';
    const hrefMatch = html.match(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/i);
    cells.push({
      tag: tagName,
      dataStat: getAttribute(attrs, 'data-stat'),
      text: stripTags(html),
      href: hrefMatch ? hrefMatch[1] : '',
      colspan: Number(getAttribute(attrs, 'colspan') || 1) || 1
    });
  }
  return cells;
}

function parseRows(sectionHtml = '', columns = [], scope = 'tbody') {
  const rows = [];
  const rowRegex = /<tr\b([^>]*)>([\s\S]*?)<\/tr>/gi;
  let match;
  while ((match = rowRegex.exec(sectionHtml))) {
    const rowAttrs = match[1] || '';
    const rowHtml = match[2] || '';
    if (/class\s*=\s*["'][^"']*thead/i.test(rowAttrs)) continue;
    const cells = parseCells(rowHtml);
    if (!cells.length) continue;
    const values = {};
    cells.forEach((cell, index) => {
      const fallbackColumn = columns[index]?.key || `col_${index + 1}`;
      const key = normalizeColumnKey(cell.dataStat || fallbackColumn, fallbackColumn);
      values[key] = cell.text;
      if (cell.href) values[`${key}_href`] = cell.href;
    });
    if (Object.values(values).some((value) => String(value || '').trim())) {
      rows.push({ scope, values });
    }
  }
  return rows;
}

function parseTable(tableTag = '', tableHtml = '') {
  const id = getAttribute(tableTag, 'id');
  const caption = stripTags((tableHtml.match(/<caption\b[^>]*>([\s\S]*?)<\/caption>/i) || [])[1] || '');
  const thead = (tableHtml.match(/<thead\b[^>]*>([\s\S]*?)<\/thead>/i) || [])[1] || '';
  const headerRows = Array.from(thead.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)).map((m) => parseCells(m[1]));
  const lastHeader = headerRows.length ? headerRows[headerRows.length - 1] : [];
  const columns = lastHeader.map((cell, index) => ({
    key: normalizeColumnKey(cell.dataStat || cell.text, `col_${index + 1}`),
    label: cell.text || cell.dataStat || `Colonna ${index + 1}`,
    dataStat: cell.dataStat || ''
  }));
  const tbodyMatches = Array.from(tableHtml.matchAll(/<tbody\b[^>]*>([\s\S]*?)<\/tbody>/gi));
  const rows = [];
  tbodyMatches.forEach((tbodyMatch) => rows.push(...parseRows(tbodyMatch[1] || '', columns, 'tbody')));
  const tfoot = (tableHtml.match(/<tfoot\b[^>]*>([\s\S]*?)<\/tfoot>/i) || [])[1] || '';
  if (tfoot) rows.push(...parseRows(tfoot, columns, 'tfoot'));
  return { id, caption, columns, rows };
}

function parseFbrefTables(html = '') {
  const uncommented = String(html || '').replace(/<!--([\s\S]*?)-->/g, '$1');
  const tables = [];
  const tableRegex = /<table\b([^>]*)>([\s\S]*?)<\/table>/gi;
  let match;
  while ((match = tableRegex.exec(uncommented))) {
    const table = parseTable(match[1] || '', match[2] || '');
    if (table.id || table.rows.length) tables.push(table);
  }
  return tables;
}

function findPlayerName(html = '') {
  const h1 = stripTags((String(html).match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '');
  if (h1) return h1.replace(/Stats.*$/i, '').trim() || h1;
  const title = stripTags((String(html).match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '');
  return title.replace(/ Stats.*$/i, '').replace(/\|.*$/g, '').trim();
}

function findSummaryRow(tables = [], seasonId = '') {
  const standardTables = tables.filter((table) => /standard/i.test(table.id || table.caption || ''));
  const candidates = standardTables.length ? standardTables : tables;
  const seasonNeedle = String(seasonId || '').replace('/', '-');
  for (const table of candidates) {
    const rows = Array.isArray(table.rows) ? table.rows : [];
    const exact = rows.find((row) => {
      const values = row.values || {};
      const seasonValue = String(values.year_id || values.season || values.year || '').replace('/', '-');
      return seasonNeedle && seasonValue.includes(seasonNeedle);
    });
    if (exact) return { table, row: exact };
    const tfoot = rows.find((row) => row.scope === 'tfoot');
    if (tfoot) return { table, row: tfoot };
    if (rows.length) return { table, row: rows[rows.length - 1] };
  }
  return { table: null, row: null };
}

function buildSummary(tables = [], meta = {}) {
  const found = findSummaryRow(tables, meta.seasonId || '');
  const values = found.row?.values || {};
  const n = (...keys) => {
    for (const key of keys) {
      if (Object.prototype.hasOwnProperty.call(values, key)) return parseNumber(values[key]);
    }
    return null;
  };
  return {
    playerKey: meta.playerKey || '',
    playerName: meta.playerName || '',
    fbrefId: meta.fbrefId || '',
    fbrefName: meta.fbrefName || '',
    fbrefUrl: meta.fbrefUrl || '',
    realTeam: meta.realTeam || '',
    season: meta.seasonId || values.year_id || values.season || '',
    competition: values.comp_level || values.comp || '',
    matches: n('games'),
    starts: n('games_starts', 'starts'),
    minutes: n('minutes', 'minutes_90s'),
    goals: n('goals'),
    assists: n('assists'),
    xg: n('xg'),
    npxg: n('npxg'),
    xa: n('xa'),
    xag: n('xg_assist', 'xag'),
    yellowCards: n('cards_yellow', 'yellow_cards'),
    redCards: n('cards_red', 'red_cards'),
    statsStatus: found.row ? 'fetched' : 'no-standard-row',
    sourceTableId: found.table?.id || '',
    sourceScope: found.row?.scope || ''
  };
}

function sanitizeFbrefUrl(rawUrl = '') {
  const url = new URL(String(rawUrl || ''), 'https://fbref.com');
  const host = String(url.hostname || '').replace(/^www\./, '').toLowerCase();
  if (host !== FBREF_ALLOWED_HOST) throw new Error('URL non ammesso: usa un profilo giocatore FBref.');
  const match = url.pathname.match(/^\/en\/players\/([^/]+)\/([^/]+)/i);
  if (!match) throw new Error('URL FBref non valido: deve essere un profilo giocatore /en/players/<id>/<slug>.');
  return {
    fbrefId: decodeURIComponent(match[1] || '').trim(),
    fbrefUrl: `${url.origin}${url.pathname}`
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Metodo non consentito.' });
  try {
    const authResult = await verifyAdmin(readBearerToken(event));
    if (!authResult.ok) return json(authResult.statusCode || 403, { error: authResult.message || 'Accesso admin negato.' });
    const body = JSON.parse(event.body || '{}');
    const parsedUrl = sanitizeFbrefUrl(body.fbrefUrl || body.url || '');
    const response = await fetch(parsedUrl.fbrefUrl, {
      headers: {
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'user-agent': USER_AGENT
      }
    });
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      return json(response.status, { error: `FBref non ha restituito la pagina (${response.status}). Usa il fallback Importa HTML FBref dalla riga del giocatore.`, detail: text.slice(0, 300), fallback: 'manual-html-import-v392' });
    }
    const html = await response.text();
    const tables = parseFbrefTables(html);
    const fbrefName = body.fbrefName || findPlayerName(html);
    const meta = {
      version: 'V392',
      source: 'fbref-player-page',
      fetchedAt: new Date().toISOString(),
      fetchedBy: authResult.uid || '',
      playerKey: body.playerKey || '',
      playerName: body.playerName || '',
      realTeam: body.realTeam || '',
      seasonId: body.seasonId || '',
      fbrefId: body.fbrefId || parsedUrl.fbrefId,
      fbrefName,
      fbrefUrl: parsedUrl.fbrefUrl,
      tableCount: tables.length
    };
    const summary = buildSummary(tables, meta);
    return json(200, {
      ...meta,
      meta,
      summary,
      tables,
      tableCount: tables.length,
      fetchedAt: meta.fetchedAt
    });
  } catch (error) {
    console.warn('fbref-player-stats V391 error', error);
    return json(500, { error: error?.message || 'Errore recupero FBref.' });
  }
};
