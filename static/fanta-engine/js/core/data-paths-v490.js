/* Fanta engine V490 - Data path adapter.
 * Small, dependency-free helpers used by league-specific loaders to resolve
 * data paths from league-config and to fetch JSON with a primary/fallback chain.
 * It does not know any Firebase/Admin/EmailJS detail and it does not remove
 * local league copies.
 */

function asStringV490(value, fallback = '') {
  const text = String(value ?? fallback ?? '').trim();
  return text || String(fallback ?? '').trim();
}

export function hasExternalSchemeV490(value) {
  return /^[a-z][a-z0-9+.-]*:/i.test(asStringV490(value));
}

export function normalizePathBaseV490(value, fallback = './assets/') {
  const raw = asStringV490(value, fallback) || fallback;
  if (hasExternalSchemeV490(raw) || raw.startsWith('/') || raw.endsWith('/')) return raw;
  return `${raw}/`;
}

export function stripLeadingSlashV490(value) {
  return String(value || '').replace(/^\/+/, '');
}

export function resolveLeagueDataPathV490({ key, fallback = '', getValue } = {}) {
  const read = typeof getValue === 'function' ? getValue : () => '';
  const configured = read(`dataPaths.${key || ''}`, '');
  return asStringV490(configured, fallback) || asStringV490(fallback);
}

export function joinLeagueDataPathV490({ baseKey, fileName, fallbackBase = './assets/', getValue } = {}) {
  const base = normalizePathBaseV490(
    resolveLeagueDataPathV490({ key: baseKey, fallback: fallbackBase, getValue }),
    fallbackBase
  );
  const file = stripLeadingSlashV490(fileName);
  return file ? `${base}${file}` : base;
}

export function createLeagueDataPathAdapterV490({ getValue } = {}) {
  return Object.freeze({
    version: 'V490',
    resolve: (key, fallback = '') => resolveLeagueDataPathV490({ key, fallback, getValue }),
    join: (baseKey, fileName, fallbackBase = './assets/') => joinLeagueDataPathV490({ baseKey, fileName, fallbackBase, getValue }),
    normalizeBase: normalizePathBaseV490,
    stripLeadingSlash: stripLeadingSlashV490,
  });
}

export async function fetchJsonWithFallbackV490({ urls, primaryUrl, fallbackUrl, label, fetchImpl, consoleImpl, cache = 'no-store', warningPrefix = 'Fallback statico V490' } = {}) {
  const fetcher = typeof fetchImpl === 'function' ? fetchImpl : globalThis.fetch;
  if (typeof fetcher !== 'function') throw new Error('fetch non disponibile per fetchJsonWithFallbackV490');
  const logger = consoleImpl || globalThis.console || { warn() {} };
  const candidates = Array.isArray(urls) && urls.length ? urls : [primaryUrl, fallbackUrl];
  const normalized = [...new Set(candidates.map((url) => asStringV490(url)).filter(Boolean))];
  let lastError = null;
  for (const url of normalized) {
    try {
      const response = await fetcher(url, { cache });
      if (!response.ok) throw new Error(`${label || 'Risorsa'} non leggibile: ${url} (${response.status})`);
      return await response.json();
    } catch (error) {
      lastError = error;
      logger.warn?.(`${warningPrefix}: ${label || 'risorsa'} non disponibile da ${url}`, error);
    }
  }
  throw lastError || new Error(`${label || 'Risorsa'} non leggibile`);
}

export const FANTA_ENGINE_DATA_PATHS_V490 = Object.freeze({
  version: 'V490',
  adapter: true,
  preservesLocalFallbacks: true,
  touchesFirebase: false,
  touchesEmailJs: false,
  touchesAdminFlows: false,
});
