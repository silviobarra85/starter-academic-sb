/* V394 - Admin-only API-Football player stats bridge for Soccer Data.
   Uses API-SPORTS / API-Football server-side with one explicit admin action per request.
   It does not write to Firebase: the admin UI saves the returned JSON through Firestore
   so API reads can later be exported as static JSON and reused without hitting the API. */

const FIREBASE_PROJECT_ID = process.env.ZONAORIENTALE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'zonaorientale-d07af';
const FIREBASE_API_KEY = process.env.ZONAORIENTALE_FIREBASE_API_KEY || process.env.FIREBASE_WEB_API_KEY || 'AIzaSyB7YQM3bNHwAqhJAUP3hOeYudwyTzioLFM';
const API_FOOTBALL_KEY = process.env.ZONAORIENTALE_API_FOOTBALL_KEY || process.env.API_FOOTBALL_KEY || process.env.API_FOOTBALL_API_KEY || process.env.APISPORTS_API_KEY || '';
const API_FOOTBALL_BASE_URL = 'https://v3.football.api-sports.io';

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

function cleanSeason(value = '') {
  const match = String(value || '').match(/(20\d{2})/);
  return match ? match[1] : String(new Date().getFullYear());
}

function cleanPlayerId(value = '') {
  return String(value || '').replace(/[^0-9]/g, '').trim();
}

function readRateLimit(response) {
  const header = (name) => response.headers.get(name) || response.headers.get(name.toLowerCase()) || '';
  return {
    limit: header('x-ratelimit-requests-limit') || header('x-ratelimit-limit') || '',
    remaining: header('x-ratelimit-requests-remaining') || header('x-ratelimit-remaining') || '',
    reset: header('x-ratelimit-requests-reset') || header('x-ratelimit-reset') || ''
  };
}

async function callApiFootball(pathname, params = {}) {
  if (!API_FOOTBALL_KEY) {
    throw new Error('API-Football key mancante: configura ZONAORIENTALE_API_FOOTBALL_KEY su Netlify.');
  }
  const url = new URL(pathname, API_FOOTBALL_BASE_URL);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && String(value).trim() !== '') url.searchParams.set(key, String(value).trim());
  });
  const response = await fetch(url.toString(), {
    headers: {
      accept: 'application/json',
      'x-apisports-key': API_FOOTBALL_KEY
    }
  });
  const rateLimit = readRateLimit(response);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const apiMessage = payload?.errors ? JSON.stringify(payload.errors) : '';
    throw new Error(`API-Football non disponibile (${response.status}). ${apiMessage}`.trim());
  }
  return { payload, rateLimit, url: url.toString() };
}

function normalizeCandidate(item = {}) {
  const player = item.player || {};
  const stats = Array.isArray(item.statistics) ? item.statistics : [];
  const firstStats = stats[0] || {};
  return {
    id: player.id || '',
    name: player.name || [player.firstname, player.lastname].filter(Boolean).join(' '),
    firstname: player.firstname || '',
    lastname: player.lastname || '',
    age: player.age || '',
    nationality: player.nationality || '',
    team: firstStats.team?.name || '',
    teamId: firstStats.team?.id || '',
    league: firstStats.league?.name || '',
    leagueId: firstStats.league?.id || '',
    season: firstStats.league?.season || ''
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Metodo non consentito.' });
  try {
    const authResult = await verifyAdmin(readBearerToken(event));
    if (!authResult.ok) return json(authResult.statusCode || 403, { error: authResult.message || 'Accesso admin negato.' });
    const body = JSON.parse(event.body || '{}');
    const action = String(body.action || 'stats').toLowerCase();
    const season = cleanSeason(body.season || body.seasonId || '');
    if (action === 'search') {
      const search = String(body.search || body.playerName || '').trim();
      if (search.length < 3) return json(400, { error: 'Cerca almeno 3 caratteri per API-Football.' });
      const { payload, rateLimit } = await callApiFootball('/players', { search, season });
      const candidates = (Array.isArray(payload.response) ? payload.response : []).map(normalizeCandidate);
      return json(200, {
        version: 'V394',
        provider: 'api-football',
        action: 'search',
        season,
        search,
        teamName: body.teamName || '',
        candidates,
        response: payload.response || [],
        results: payload.results || candidates.length,
        paging: payload.paging || {},
        parameters: payload.parameters || { search, season },
        rateLimit,
        fetchedAt: new Date().toISOString(),
        fetchedBy: authResult.uid || ''
      });
    }
    const playerId = cleanPlayerId(body.playerId || body.id || body.apiFootballId || '');
    if (!playerId) return json(400, { error: 'API-Football playerId mancante.' });
    const { payload, rateLimit } = await callApiFootball('/players', { id: playerId, season });
    return json(200, {
      version: 'V394',
      provider: 'api-football',
      action: 'stats',
      season,
      playerId,
      playerKey: body.playerKey || '',
      playerName: body.playerName || '',
      realTeam: body.realTeam || '',
      response: payload.response || [],
      results: payload.results || 0,
      paging: payload.paging || {},
      parameters: payload.parameters || { id: playerId, season },
      errors: payload.errors || {},
      rateLimit,
      fetchedAt: new Date().toISOString(),
      fetchedBy: authResult.uid || ''
    });
  } catch (error) {
    console.warn('api-football-player-stats V394 error', error);
    return json(500, { error: error?.message || 'Errore API-Football.' });
  }
};
