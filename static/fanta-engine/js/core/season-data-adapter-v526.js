/* Fanta engine V526 - Season data adapter.
 * Metadata-first adapter for multi-season leagues.
 * It normalizes currentSeasonId and classifies shared vs season-scoped data
 * without moving files, changing Firebase/EmailJS, or deleting local fallbacks.
 */

export const SEASON_DATA_ADAPTER_VERSION_V526 = 'V526';

const SHARED_DATA_KINDS_V526 = Object.freeze([
  'listoni',
  'calciomercato'
]);

const SEASON_SCOPED_DATA_KINDS_V526 = Object.freeze([
  'publicConfig',
  'rosters',
  'competitions',
  'seasonSnapshots',
  'bilanci',
  'honor'
]);

function asTextV526(value, fallback = '') {
  const text = String(value ?? fallback ?? '').trim();
  return text || String(fallback ?? '').trim();
}

export function normalizeSeasonIdV526(value, fallback = '') {
  const raw = asTextV526(value, fallback);
  if (!raw) return '';
  const match = raw.match(/(\d{4})\s*[-_/]\s*(\d{2,4})/);
  if (!match) return raw;
  const start = match[1];
  const end = match[2].length === 2 ? `${start.slice(0, 2)}${match[2]}` : match[2];
  return `${start}-${end}`;
}

export function getCurrentSeasonIdV526({ getValue, fallback = '' } = {}) {
  const read = typeof getValue === 'function' ? getValue : () => '';
  return normalizeSeasonIdV526(read('currentSeasonId', '') || fallback || '');
}

export function getConfiguredSeasonsV526({ getValue, fallbackSeasonId = '' } = {}) {
  const read = typeof getValue === 'function' ? getValue : () => undefined;
  const currentSeasonId = normalizeSeasonIdV526(read('currentSeasonId', '') || fallbackSeasonId || '');
  const configured = read('seasons', []);
  const seasons = Array.isArray(configured) ? configured : [];
  const normalized = seasons
    .map((season) => {
      const id = normalizeSeasonIdV526(season?.id || season?.seasonId || season?.name || '');
      if (!id) return null;
      return Object.freeze({
        ...season,
        id,
        seasonId: id,
        name: season?.name || `Stagione ${id}`,
        current: Boolean(season?.current) || id === currentSeasonId
      });
    })
    .filter(Boolean);
  if (!normalized.length && currentSeasonId) {
    return [Object.freeze({ id: currentSeasonId, seasonId: currentSeasonId, name: `Stagione ${currentSeasonId}`, current: true })];
  }
  return normalized;
}

export function isSharedDataKindV526(kind) {
  return SHARED_DATA_KINDS_V526.includes(asTextV526(kind));
}

export function isSeasonScopedDataKindV526(kind) {
  return SEASON_SCOPED_DATA_KINDS_V526.includes(asTextV526(kind));
}

export function classifyDataKindV526(kind) {
  const id = asTextV526(kind);
  if (isSharedDataKindV526(id)) return 'shared';
  if (isSeasonScopedDataKindV526(id)) return 'season-scoped';
  return 'unknown';
}

export function buildSeasonDataDescriptorV526({ kind, seasonId, path, fallbackPath, shared = false } = {}) {
  const normalizedKind = asTextV526(kind, 'unknown');
  const scope = shared || isSharedDataKindV526(normalizedKind) ? 'shared' : classifyDataKindV526(normalizedKind);
  return Object.freeze({
    version: SEASON_DATA_ADAPTER_VERSION_V526,
    kind: normalizedKind,
    scope,
    seasonId: scope === 'shared' ? '' : normalizeSeasonIdV526(seasonId),
    path: asTextV526(path),
    fallbackPath: asTextV526(fallbackPath),
    sharedAssetsSingleUploadPreserved: scope === 'shared',
    localFallbacksPreserved: true
  });
}

export function createSeasonDataAdapterV526({ getValue, leagueId = '', logger } = {}) {
  const read = typeof getValue === 'function' ? getValue : () => undefined;
  const initialSeasonId = getCurrentSeasonIdV526({ getValue: read });
  const api = {
    version: SEASON_DATA_ADAPTER_VERSION_V526,
    get leagueId() { return asTextV526(leagueId, read('leagueId', '')); },
    get currentSeasonId() { return getCurrentSeasonIdV526({ getValue: read, fallback: initialSeasonId }); },
    get seasons() { return getConfiguredSeasonsV526({ getValue: read, fallbackSeasonId: this.currentSeasonId }); },
    sharedDataKinds: SHARED_DATA_KINDS_V526,
    seasonScopedDataKinds: SEASON_SCOPED_DATA_KINDS_V526,
    normalizeSeasonId: (value, fallback = currentSeasonId) => normalizeSeasonIdV526(value, fallback),
    getCurrentSeasonId: () => getCurrentSeasonIdV526({ getValue: read, fallback: initialSeasonId }),
    getSeasons: () => getConfiguredSeasonsV526({ getValue: read, fallbackSeasonId: getCurrentSeasonIdV526({ getValue: read, fallback: initialSeasonId }) }),
    classifyDataKind: classifyDataKindV526,
    isSharedDataKind: isSharedDataKindV526,
    isSeasonScopedDataKind: isSeasonScopedDataKindV526,
    describeData: (descriptor = {}) => buildSeasonDataDescriptorV526({
      seasonId: getCurrentSeasonIdV526({ getValue: read, fallback: initialSeasonId }),
      ...descriptor
    }),
    guardrails: Object.freeze({
      metadataOnly: true,
      noFirebaseWrites: true,
      noEmailJsChanges: true,
      noPhysicalDataMigration: true,
      preservesSharedAssetsCurrent: true,
      preservesLocalFallbacks: true,
      listoniAndCalciomercatoRemainShared: true
    })
  };
  logger?.info?.('Season data adapter V526 installato', api.leagueId, api.currentSeasonId);
  return Object.freeze(api);
}

export function installSeasonDataAdapterV526({ window: win, getValue, leagueId, state, logger } = {}) {
  const target = win || (typeof window !== 'undefined' ? window : null);
  const api = createSeasonDataAdapterV526({ getValue, leagueId, logger });
  if (state && typeof state === 'object') {
    state.getCurrentSeasonIdV526 = () => api.currentSeasonId;
    state.seasonDataAdapterV526 = api;
  }
  if (target) {
    target.FantaEngineSeasonDataAdapterV526 = api;
    target.FantaEngineMultiSeasonRuntimeV526 = api;
  }
  return api;
}

export const FANTA_ENGINE_SEASON_DATA_ADAPTER_V526 = Object.freeze({
  version: SEASON_DATA_ADAPTER_VERSION_V526,
  metadataOnly: true,
  sharedDataKinds: SHARED_DATA_KINDS_V526,
  seasonScopedDataKinds: SEASON_SCOPED_DATA_KINDS_V526,
  touchesFirebase: false,
  touchesEmailJs: false,
  touchesAdminFlows: false,
  movesFiles: false,
  deletesLocalFallbacks: false
});
