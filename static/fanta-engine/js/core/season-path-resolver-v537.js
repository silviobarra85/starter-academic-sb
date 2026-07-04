/**
 * V537 - Multi-season path resolver.
 *
 * Attiva l'adapter V526 come risolutore comune dei percorsi dati, senza spostare
 * file fisici e senza cambiare Firebase/EmailJS. Listoni e Calciomercato restano
 * shared assets centrali; rose, competizioni, snapshot, bilanci e honor restano
 * per-lega/per-stagione nei percorsi locali/configurati.
 */

export const SEASON_PATH_RESOLVER_VERSION_V537 = 'V537';

const SHARED_KINDS_V537 = new Set(['listoni', 'calciomercato']);
const SEASON_SCOPED_KINDS_V537 = new Set(['publicConfig', 'rosters', 'competitions', 'seasonSnapshots', 'bilanci', 'honor']);

const DEFAULT_PATHS_V537 = Object.freeze({
  listoniManifest: '../fanta-engine/data/shared-assets/current/assets/listoni/manifest.json',
  listoniBase: '../fanta-engine/data/shared-assets/current/assets/listoni/',
  listoniManifestFallback: './assets/listoni/manifest.json',
  listoniBaseFallback: './assets/listoni/',
  calciomercatoLinks: '../fanta-engine/data/shared-assets/current/assets/calciomercato/links.json',
  calciomercatoArchiveManifest: '../fanta-engine/data/shared-assets/current/assets/calciomercato/archive/manifest.json',
  calciomercatoArchiveBase: '../fanta-engine/data/shared-assets/current/assets/calciomercato/archive/',
  calciomercatoLinksFallback: './assets/calciomercato/links.json',
  calciomercatoArchiveManifestFallback: './assets/calciomercato/archive/manifest.json',
  calciomercatoArchiveBaseFallback: './assets/calciomercato/archive/',
  publicConfig: './assets/public/config.json',
  rostersManifest: './assets/rose/manifest.json',
  rostersBase: './assets/rose/',
  competitionsManifest: './assets/competitions/manifest.json',
  competitionsBase: './assets/competitions/',
  seasonSnapshotsManifest: './assets/snapshots/seasons/manifest.json',
  seasonSnapshotsBase: './assets/snapshots/seasons/',
  honorSnapshot: './assets/snapshots/honor.json',
  logosBase: './assets/logos/'
});

function asTextV537(value, fallback = '') {
  const text = String(value ?? fallback ?? '').trim();
  return text || String(fallback ?? '').trim();
}

function normalizeKindV537(kind, key = '') {
  const raw = asTextV537(kind);
  if (raw) return raw;
  const name = asTextV537(key);
  if (/listoni/i.test(name)) return 'listoni';
  if (/calciomercato/i.test(name)) return 'calciomercato';
  if (/rosters|rose/i.test(name)) return 'rosters';
  if (/competitions/i.test(name)) return 'competitions';
  if (/seasonSnapshots|snapshots/i.test(name)) return 'seasonSnapshots';
  if (/honor/i.test(name)) return 'honor';
  if (/publicConfig/i.test(name)) return 'publicConfig';
  return 'unknown';
}

function classifyKindV537(kind, key = '') {
  const id = normalizeKindV537(kind, key);
  if (SHARED_KINDS_V537.has(id)) return 'shared';
  if (SEASON_SCOPED_KINDS_V537.has(id)) return 'season-scoped';
  return 'configured';
}

function normalizeBaseV537(value) {
  const text = asTextV537(value);
  if (!text) return '';
  return text.endsWith('/') ? text : `${text}/`;
}

function joinPathV537(base, fileName) {
  const normalizedBase = normalizeBaseV537(base);
  const file = asTextV537(fileName).replace(/^\.\//, '');
  if (!normalizedBase) return file;
  return `${normalizedBase}${file}`;
}

function readConfiguredPathV537(getValue, key, fallback = '') {
  const read = typeof getValue === 'function' ? getValue : () => undefined;
  const direct = read(key, undefined);
  if (direct !== undefined && direct !== null && String(direct).trim()) return String(direct).trim();
  const nested = read(`dataPaths.${key}`, undefined);
  if (nested !== undefined && nested !== null && String(nested).trim()) return String(nested).trim();
  if (Object.prototype.hasOwnProperty.call(DEFAULT_PATHS_V537, key)) return DEFAULT_PATHS_V537[key];
  return asTextV537(fallback);
}

function getSeasonAdapterV537(options = {}) {
  return options.seasonAdapter
    || options.window?.FantaEngineSeasonDataAdapterRuntimeV526
    || options.window?.FantaEngineSeasonDataAdapterV526
    || options.window?.FantaEngineMultiSeasonRuntimeV526
    || null;
}

function getCurrentSeasonIdV537(options = {}) {
  const adapter = getSeasonAdapterV537(options);
  if (adapter?.currentSeasonId) return asTextV537(adapter.currentSeasonId);
  const read = typeof options.getValue === 'function' ? options.getValue : () => undefined;
  return asTextV537(read('currentSeasonId', ''));
}

export function describeSeasonPathV537({ key, path, fallback = '', kind = '', getValue, seasonAdapter, window: win } = {}) {
  const dataKind = normalizeKindV537(kind, key);
  const scope = classifyKindV537(dataKind, key);
  const currentSeasonId = getCurrentSeasonIdV537({ getValue, seasonAdapter, window: win });
  return Object.freeze({
    version: SEASON_PATH_RESOLVER_VERSION_V537,
    key: asTextV537(key),
    kind: dataKind,
    scope,
    seasonId: scope === 'shared' ? '' : currentSeasonId,
    path: asTextV537(path),
    fallbackPath: asTextV537(fallback),
    sharedAssetsCurrentPreserved: scope === 'shared',
    localFallbacksPreserved: true,
    physicalMigration: false,
    firebaseWrites: false,
    emailjsChanged: false
  });
}

export function resolveLeagueDataPathWithSeasonV537({ key, fallback = '', kind = '', getValue, seasonAdapter, window: win, logger } = {}) {
  const path = readConfiguredPathV537(getValue, key, fallback);
  const descriptor = describeSeasonPathV537({ key, path, fallback, kind, getValue, seasonAdapter, window: win });
  const target = win || (typeof window !== 'undefined' ? window : null);
  if (target) {
    target.FantaEngineSeasonPathResolverLastDescriptorV537 = descriptor;
  }
  logger?.debug?.('Season path V537', descriptor);
  return descriptor.path;
}

export function joinLeagueDataPathWithSeasonV537({ baseKey, fileName, fallbackBase = './assets/', kind = '', getValue, seasonAdapter, window: win, logger } = {}) {
  const base = resolveLeagueDataPathWithSeasonV537({ key: baseKey, fallback: fallbackBase, kind, getValue, seasonAdapter, window: win, logger });
  const path = joinPathV537(base, fileName);
  const descriptor = describeSeasonPathV537({ key: baseKey, path, fallback: joinPathV537(fallbackBase, fileName), kind, getValue, seasonAdapter, window: win });
  const target = win || (typeof window !== 'undefined' ? window : null);
  if (target) {
    target.FantaEngineSeasonPathResolverLastDescriptorV537 = descriptor;
  }
  logger?.debug?.('Season path join V537', descriptor);
  return path;
}

export function createSeasonPathResolverReportV537(runtimeOrOptions = {}) {
  const runtime = runtimeOrOptions?.version === SEASON_PATH_RESOLVER_VERSION_V537 ? runtimeOrOptions : null;
  const options = runtime ? runtime.options : runtimeOrOptions;
  const win = runtime?.window || options?.window || (typeof window !== 'undefined' ? window : null);
  const adapter = runtime?.seasonAdapter || getSeasonAdapterV537(options);
  return Object.freeze({
    version: SEASON_PATH_RESOLVER_VERSION_V537,
    scope: 'whole-site-multiseason-path-resolver',
    leagueId: asTextV537(runtime?.leagueId || options?.leagueId || adapter?.leagueId || ''),
    currentSeasonId: getCurrentSeasonIdV537({ ...options, seasonAdapter: adapter, window: win }),
    sharedDataKinds: [...SHARED_KINDS_V537],
    seasonScopedDataKinds: [...SEASON_SCOPED_KINDS_V537],
    sharedAssetsCurrentPreserved: true,
    localFallbacksPreserved: true,
    physicalMigration: false,
    firebaseWrites: false,
    emailjsChanged: false,
    supportsListoniSingleUpload: true,
    supportsCalciomercatoSingleUpload: true,
    pathsResolved: Number(runtime?.pathsResolved || 0),
    lastDescriptor: runtime?.lastDescriptor || win?.FantaEngineSeasonPathResolverLastDescriptorV537 || null,
    generatedAt: new Date().toISOString()
  });
}

export function createSeasonPathResolverV537(options = {}) {
  const win = options.window || (typeof window !== 'undefined' ? window : null);
  const seasonAdapter = getSeasonAdapterV537(options);
  const runtime = {
    version: SEASON_PATH_RESOLVER_VERSION_V537,
    options,
    window: win,
    seasonAdapter,
    leagueId: options.leagueId || seasonAdapter?.leagueId || '',
    pathsResolved: 0,
    lastDescriptor: null,
    resolve(key, fallback = '', extra = {}) {
      const path = resolveLeagueDataPathWithSeasonV537({
        key,
        fallback,
        kind: extra.kind,
        getValue: options.getValue,
        seasonAdapter: this.seasonAdapter,
        window: this.window,
        logger: options.logger
      });
      this.pathsResolved += 1;
      this.lastDescriptor = this.window?.FantaEngineSeasonPathResolverLastDescriptorV537 || null;
      return path;
    },
    join(baseKey, fileName, fallbackBase = './assets/', extra = {}) {
      const path = joinLeagueDataPathWithSeasonV537({
        baseKey,
        fileName,
        fallbackBase,
        kind: extra.kind,
        getValue: options.getValue,
        seasonAdapter: this.seasonAdapter,
        window: this.window,
        logger: options.logger
      });
      this.pathsResolved += 1;
      this.lastDescriptor = this.window?.FantaEngineSeasonPathResolverLastDescriptorV537 || null;
      return path;
    },
    describe(key, fallback = '', extra = {}) {
      const path = readConfiguredPathV537(options.getValue, key, fallback);
      return describeSeasonPathV537({ key, path, fallback, kind: extra.kind, getValue: options.getValue, seasonAdapter: this.seasonAdapter, window: this.window });
    },
    getReport() {
      const report = createSeasonPathResolverReportV537(this);
      if (this.window) this.window.FantaEngineSeasonPathResolverLastReportV537 = report;
      return report;
    }
  };
  return runtime;
}

export function installSeasonPathResolverV537(options = {}) {
  const runtime = createSeasonPathResolverV537(options);
  const win = runtime.window;
  if (options.state && typeof options.state === 'object') {
    options.state.seasonPathResolverV537 = runtime;
  }
  if (win) {
    win.FantaEngineSeasonPathResolverRuntimeV537 = runtime;
    win.FantaEngineSeasonPathResolverLastReportV537 = runtime.getReport();
  }
  return runtime;
}

export default installSeasonPathResolverV537;
