/* V443 - League config loader.
 * Additive helper for the multi-league transition: it exposes a safe config
 * object with ZonaOrientale defaults and never blocks existing runtime flows.
 */
const DEFAULT_LEAGUE_CONFIG_V443 = Object.freeze({
  leagueId: 'zonaorientale',
  slug: 'zonaorientale',
  name: 'ZonaOrientale Salerno',
  shortName: 'ZonaOrientale',
  basePath: '/zonaorientale/',
  siteUrl: 'https://silviobarra.com/zonaorientale/',
  currentVersion: '444',
  currentSeasonId: '2025-2026',
  assetsBasePath: './assets/',
  snapshotBasePath: './assets/snapshots/',
  logosBasePath: './assets/logos/',
  futureLeagueCandidate: Object.freeze({
    provisionalName: 'FantaPetilloMantraManager',
    nameCanChange: true,
    status: 'planned-after-template-hardening'
  }),
  whatsapp: Object.freeze({
    bilanciUrl: 'https://silviobarra.com/zonaorientale/bilanci.html',
    newsShareBase: 'https://silviobarra.com/zonaorientale/share/news/'
  }),
  features: Object.freeze({
    admin: true,
    teamArea: true,
    bilanci: true,
    calciomercato: true,
    fantamercato: true,
    mantraFilters: true
  }),
  guardrails: Object.freeze({
    configOnly: true,
    noFirebaseRefactor: true,
    noSnapshotRefactor: true,
    noAdminRefactor: true,
    preserveMobileUx: true,
    preserveDeviceBadgeV434: true
  })
});

const CONFIG_URL_V443 = './assets/league-config.json?v=444';

function isPlainObjectV443(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function mergeConfigV443(defaults, incoming) {
  if (!isPlainObjectV443(incoming)) return { ...defaults };
  const merged = { ...defaults, ...incoming };
  merged.whatsapp = { ...(defaults.whatsapp || {}), ...(incoming.whatsapp || {}) };
  merged.features = { ...(defaults.features || {}), ...(incoming.features || {}) };
  merged.guardrails = { ...(defaults.guardrails || {}), ...(incoming.guardrails || {}) };
  merged.futureLeagueCandidate = {
    ...(defaults.futureLeagueCandidate || {}),
    ...(incoming.futureLeagueCandidate || {})
  };
  return merged;
}

function sanitizeConfigV443(config) {
  const merged = mergeConfigV443(DEFAULT_LEAGUE_CONFIG_V443, config);
  return Object.freeze({
    ...merged,
    whatsapp: Object.freeze({ ...merged.whatsapp }),
    features: Object.freeze({ ...merged.features }),
    guardrails: Object.freeze({ ...merged.guardrails }),
    futureLeagueCandidate: Object.freeze({ ...merged.futureLeagueCandidate })
  });
}

let cachedConfigV443 = sanitizeConfigV443(DEFAULT_LEAGUE_CONFIG_V443);
let readyPromiseV443 = null;

function publishConfigV443(config, source = 'default') {
  cachedConfigV443 = sanitizeConfigV443(config);
  window.ZonaOrientaleLeagueConfigV443 = Object.freeze({
    version: 'V443',
    source,
    config: cachedConfigV443,
    loadedAt: new Date().toISOString(),
    configOnly: true,
    futureLeagueCandidate: cachedConfigV443.futureLeagueCandidate?.provisionalName || ''
  });
  return cachedConfigV443;
}

export function getLeagueConfigSyncV443() {
  return cachedConfigV443;
}

export function getLeagueConfigValueV443(path, fallback = '') {
  const parts = String(path || '').split('.').filter(Boolean);
  let current = cachedConfigV443;
  for (const part of parts) {
    if (!current || typeof current !== 'object' || !(part in current)) return fallback;
    current = current[part];
  }
  return current ?? fallback;
}

export function getLeagueWhatsappBilanciUrlV443() {
  return getLeagueConfigValueV443('whatsapp.bilanciUrl', DEFAULT_LEAGUE_CONFIG_V443.whatsapp.bilanciUrl);
}

export function loadLeagueConfigV443(options = {}) {
  if (readyPromiseV443 && !options.force) return readyPromiseV443;
  readyPromiseV443 = fetch(CONFIG_URL_V443, { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error(`league-config ${response.status}`);
      return response.json();
    })
    .then((json) => publishConfigV443(json, CONFIG_URL_V443))
    .catch((error) => {
      console.warn('League config V443 non disponibile, uso default ZonaOrientale.', error);
      return publishConfigV443(DEFAULT_LEAGUE_CONFIG_V443, 'default-fallback');
    });
  window.ZonaOrientaleLeagueConfigReadyV443 = readyPromiseV443;
  return readyPromiseV443;
}

export const LEAGUE_CONFIG_DEFAULT_V443 = DEFAULT_LEAGUE_CONFIG_V443;

publishConfigV443(DEFAULT_LEAGUE_CONFIG_V443, 'default-bootstrap');
loadLeagueConfigV443();
