import { state } from "../core/state.js";
import { getLeagueDataPathV446, joinLeagueDataPathV446, loadLeagueConfigV443, getLeagueConfigValueV443 } from "../core/league-config-v443.js?v=789";

const DATA_PATH_ENGINE_CANDIDATES_V490 = [
  '../../../../fanta-engine/js/core/data-paths-v490.js',
  '../../../../../fanta-engine/js/core/data-paths-v490.js'
];

const SEASON_PATH_RESOLVER_CANDIDATES_V537 = [
  '../../../../fanta-engine/js/core/season-path-resolver-v537.js?v=540',
  '../../../../../fanta-engine/js/core/season-path-resolver-v537.js?v=540'
];

let seasonPathResolverPromiseV537 = null;

async function loadSeasonPathResolverV537() {
  if (seasonPathResolverPromiseV537) return seasonPathResolverPromiseV537;
  seasonPathResolverPromiseV537 = (async () => {
    let lastError = null;
    for (const candidate of SEASON_PATH_RESOLVER_CANDIDATES_V537) {
      try {
        return await import(new URL(candidate, import.meta.url).href);
      } catch (error) {
        lastError = error;
      }
    }
    console.warn('Risolutore path multi-season V537 non caricato, uso fallback V490/V446.', lastError);
    return null;
  })();
  return seasonPathResolverPromiseV537;
}

let dataPathEnginePromiseV490 = null;

async function loadDataPathEngineV490() {
  if (dataPathEnginePromiseV490) return dataPathEnginePromiseV490;
  dataPathEnginePromiseV490 = (async () => {
    let lastError = null;
    for (const candidate of DATA_PATH_ENGINE_CANDIDATES_V490) {
      try {
        return await import(new URL(candidate, import.meta.url).href);
      } catch (error) {
        lastError = error;
      }
    }
    console.warn('Motore data-path V490 non caricato, uso fallback locale V446/V485.', lastError);
    return null;
  })();
  return dataPathEnginePromiseV490;
}

async function ensureLeagueDataPathsV490() {
  await loadLeagueConfigV443().catch(() => null);
  await loadSeasonPathResolverV537().catch(() => null);
  await loadDataPathEngineV490().catch(() => null);
}

async function resolveLeagueDataPathV490(key, fallback = '') {
  const engine = await loadDataPathEngineV490().catch(() => null);
  if (engine?.resolveLeagueDataPathV490) {
    return engine.resolveLeagueDataPathV490({ key, fallback, getValue: getLeagueConfigValueV443 });
  }
  return getLeagueDataPathV446(key, fallback);
}

async function joinLeagueDataPathV490(baseKey, fileName, fallbackBase = './assets/') {
  const engine = await loadDataPathEngineV490().catch(() => null);
  if (engine?.joinLeagueDataPathV490) {
    return engine.joinLeagueDataPathV490({ baseKey, fileName, fallbackBase, getValue: getLeagueConfigValueV443 });
  }
  return joinLeagueDataPathV446(baseKey, fileName, fallbackBase);
}

async function resolveLeagueDataPathV537(key, fallback = '', options = {}) {
  const resolver = await loadSeasonPathResolverV537().catch(() => null);
  if (resolver?.resolveLeagueDataPathWithSeasonV537) {
    return resolver.resolveLeagueDataPathWithSeasonV537({
      key,
      fallback,
      kind: options.kind || '',
      getValue: getLeagueConfigValueV443,
      window,
      logger: console
    });
  }
  return resolveLeagueDataPathV490(key, fallback);
}

async function joinLeagueDataPathV537(baseKey, fileName, fallbackBase = './assets/', options = {}) {
  const resolver = await loadSeasonPathResolverV537().catch(() => null);
  if (resolver?.joinLeagueDataPathWithSeasonV537) {
    return resolver.joinLeagueDataPathWithSeasonV537({
      baseKey,
      fileName,
      fallbackBase,
      kind: options.kind || '',
      getValue: getLeagueConfigValueV443,
      window,
      logger: console
    });
  }
  return joinLeagueDataPathV490(baseKey, fileName, fallbackBase);
}

async function fetchJsonWithLocalFallbackV490(primaryUrl, fallbackUrl, label) {
  const engine = await loadDataPathEngineV490().catch(() => null);
  if (engine?.fetchJsonWithFallbackV490) {
    return engine.fetchJsonWithFallbackV490({
      urls: [primaryUrl, fallbackUrl],
      label,
      fetchImpl: fetch,
      consoleImpl: console,
      warningPrefix: 'Fallback statico V490'
    });
  }

  const urls = [primaryUrl, fallbackUrl].map((url) => String(url || '').trim()).filter(Boolean);
  let lastError = null;
  for (const url of [...new Set(urls)]) {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error(`${label || 'Risorsa'} non leggibile: ${url} (${response.status})`);
      return await response.json();
    } catch (error) {
      lastError = error;
      console.warn(`Fallback statico V490: ${label || 'risorsa'} non disponibile da ${url}`, error);
    }
  }
  throw lastError || new Error(`${label || 'Risorsa'} non leggibile`);
}

export async function loadListoniData() {
  try {
    await ensureLeagueDataPathsV490();
    const manifest = await fetchJsonWithLocalFallbackV490(
      await resolveLeagueDataPathV537('listoniManifest', '../fanta-engine/data/shared-assets/current/assets/listoni/manifest.json', { kind: 'listoni' }),
      await resolveLeagueDataPathV537('listoniManifestFallback', './assets/listoni/manifest.json', { kind: 'listoni' }),
      'manifest listoni'
    );
    const entries = Array.isArray(manifest.listoni) ? manifest.listoni : [];

    const loadedListoni = await Promise.all(entries.map(async (entry) => {
      try {
        const payload = await fetchJsonWithLocalFallbackV490(
          await joinLeagueDataPathV537('listoniBase', entry.file, '../fanta-engine/data/shared-assets/current/assets/listoni/', { kind: 'listoni' }),
          await joinLeagueDataPathV537('listoniBaseFallback', entry.file, './assets/listoni/', { kind: 'listoni' }),
          `listone ${entry.file}`
        );
        return {
          ...entry,
          meta: payload.meta || {},
          players: Array.isArray(payload.players) ? payload.players : []
        };
      } catch (error) {
        console.warn(error);
        return { ...entry, meta: {}, players: [], loadError: true };
      }
    }));

    state.listoni = loadedListoni.sort((a, b) => String(b.loadedAt || b.id || '').localeCompare(String(a.loadedAt || a.id || ''), 'it'));
  } catch (error) {
    console.warn('Listoni non caricati', error);
    state.listoni = [];
  }
}

export async function loadRostersData() {
  try {
    await ensureLeagueDataPathsV490();
    const manifestResponse = await fetch(await resolveLeagueDataPathV537('rostersManifest', './assets/rose/manifest.json', { kind: 'rosters' }), { cache: 'no-store' });
    if (!manifestResponse.ok) {
      state.rosters = [];
      return;
    }

    const manifest = await manifestResponse.json();
    const entries = Array.isArray(manifest.rosters) ? manifest.rosters : [];

    const loadedRosters = await Promise.all(entries.map(async (entry) => {
      try {
        const response = await fetch(await joinLeagueDataPathV537('rostersBase', entry.file, './assets/rose/', { kind: 'rosters' }), { cache: 'no-store' });
        if (!response.ok) throw new Error(`Rose non leggibili: ${entry.file}`);
        const payload = await response.json();
        return {
          ...entry,
          meta: payload.meta || {},
          rosters: Array.isArray(payload.rosters) ? payload.rosters : []
        };
      } catch (error) {
        console.warn(error);
        return { ...entry, meta: {}, rosters: [], loadError: true };
      }
    }));

    state.rosters = loadedRosters.sort((a, b) => String(b.loadedAt || b.id || '').localeCompare(String(a.loadedAt || a.id || ''), 'it'));
  } catch (error) {
    console.warn('Rose non caricate', error);
    state.rosters = [];
  }
}

export async function loadCompetitionCalendarData() {
  try {
    await ensureLeagueDataPathsV490();
    const manifestResponse = await fetch(await resolveLeagueDataPathV537('competitionsManifest', './assets/competitions/manifest.json', { kind: 'competitions' }), { cache: 'no-store' });
    if (!manifestResponse.ok) {
      state.competitionCalendars = [];
      return;
    }

    const manifest = await manifestResponse.json();
    const entries = Array.isArray(manifest.competitions)
      ? manifest.competitions
      : Array.isArray(manifest.items)
        ? manifest.items
        : [];

    const loadedCalendars = await Promise.all(entries.map(async (entry) => {
      try {
        const response = await fetch(await joinLeagueDataPathV537('competitionsBase', entry.file, './assets/competitions/', { kind: 'competitions' }), { cache: 'no-store' });
        if (!response.ok) throw new Error(`Calendario competizione non leggibile: ${entry.file}`);
        const payload = await response.json();
        return {
          ...entry,
          meta: payload.meta || {},
          competition: payload.competition || null,
          matches: Array.isArray(payload.matches) ? payload.matches : [],
          results: Array.isArray(payload.results) ? payload.results : []
        };
      } catch (error) {
        console.warn(error);
        return { ...entry, meta: {}, competition: null, matches: [], results: [], loadError: true };
      }
    }));

    state.competitionCalendars = loadedCalendars.sort((a, b) => String(b.loadedAt || b.id || '').localeCompare(String(a.loadedAt || a.id || ''), 'it'));
  } catch (error) {
    console.warn('Calendari competizioni statici non caricati', error);
    state.competitionCalendars = [];
  }
}
