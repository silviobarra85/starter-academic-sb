/* V443/V445 - League config loader.
 * Additive helper for the multi-league transition: it exposes a safe config
 * object with ZonaOrientale defaults and never blocks existing runtime flows.
 * V445 adds presentation helpers for metadata, titles, mobile More labels and
 * share base URLs, still with ZonaOrientale fallbacks and no data/Firebase refactor.
 */

const DEFAULT_DATA_PATHS_V446 = Object.freeze({
  publicConfig: './assets/public/config.json',
  seasonSnapshotsManifest: './assets/snapshots/seasons/manifest.json',
  seasonSnapshotsBase: './assets/snapshots/seasons/',
  honorSnapshot: './assets/snapshots/honor.json',
  listoniManifest: './assets/listoni/manifest.json',
  listoniBase: './assets/listoni/',
  rostersManifest: './assets/rose/manifest.json',
  rostersBase: './assets/rose/',
  competitionsManifest: './assets/competitions/manifest.json',
  competitionsBase: './assets/competitions/',
  logosBase: './assets/logos/',
  calciomercatoLinks: './assets/calciomercato/links.json',
  calciomercatoArchiveManifest: './assets/calciomercato/archive/manifest.json',
  calciomercatoArchiveBase: './assets/calciomercato/archive/'
});

const DEFAULT_MOBILE_MORE_V445 = Object.freeze([
  Object.freeze({ id: 'news', href: '#news', label: 'News', icon: '📰' }),
  Object.freeze({ id: 'clubs', href: '#clubs', label: 'Tutte le rose', icon: '👥' }),
  Object.freeze({ id: 'bilanci', href: '#bilanci', label: 'Bilanci squadre', icon: '💰' }),
  Object.freeze({ id: 'honor', href: '#honor', label: "Albo d'Oro e Palmarès", icon: '🏛️' }),
  Object.freeze({ id: 'stats', href: '#stats', label: 'Statistiche storiche', icon: '📊' }),
  Object.freeze({ id: 'archive', href: '#archive', label: 'Archivio stagioni', icon: '🗂️' }),
  Object.freeze({ id: 'compare', href: '#compare', label: 'Confronta squadre', icon: '⚔️' }),
  Object.freeze({ id: 'regolamento', href: '#regolamento', label: 'Regolamento', icon: '📘' }),
  Object.freeze({ id: 'fantamercato', href: '#fantamercato', label: 'Fantamercato', icon: '🔁' }),
  Object.freeze({ id: 'calciomercato', href: '#calciomercato', label: 'Calciomercato', icon: '📰' }),
  Object.freeze({ id: 'listone', href: '#listone', label: 'Listone', icon: '📋' }),
  Object.freeze({ id: 'admin', href: '#admin', label: 'Admin', icon: '⚙️' })
]);

const DEFAULT_LEAGUE_PAGES_V445 = Object.freeze({
  home: Object.freeze({
    title: 'ZonaOrientale Salerno',
    description: "Dashboard ufficiale della Lega Fantacalcio ZonaOrientale Salerno: rose, listoni, fantamercato, competizioni, albo d'oro, statistiche, archivio e comunicati.",
    canonicalUrl: 'https://silviobarra.com/zonaorientale/',
    ogType: 'website'
  }),
  competition: Object.freeze({
    title: 'Competizione - ZonaOrientale Salerno',
    description: 'Calendario completo competizione ZonaOrientale Salerno.',
    canonicalUrl: 'https://silviobarra.com/zonaorientale/competition.html',
    ogType: 'website'
  }),
  player: Object.freeze({
    title: 'Scheda giocatore - ZonaOrientale Salerno',
    description: 'Scheda giocatore Fantacalcio.it integrata nel gestionale ZonaOrientale Salerno.',
    canonicalUrl: 'https://silviobarra.com/zonaorientale/player.html',
    ogType: 'website'
  }),
  bilanci: Object.freeze({
    title: 'Bilanci FM · ZonaOrientale Salerno',
    description: 'Consulta i bilanci FM delle squadre ZonaOrientale: movimenti mensili, entrate, uscite e saldo progressivo per stagione e squadra.',
    canonicalUrl: 'https://silviobarra.com/zonaorientale/bilanci.html',
    ogType: 'website'
  })
});

const DEFAULT_LEAGUE_CONFIG_V443 = Object.freeze({
  leagueId: 'zonaorientale',
  slug: 'zonaorientale',
  name: 'ZonaOrientale Salerno',
  shortName: 'ZonaOrientale',
  basePath: '/zonaorientale/',
  siteUrl: 'https://silviobarra.com/zonaorientale/',
  currentVersion: '452',
  currentSeasonId: '2025-2026',
  assetsBasePath: './assets/',
  snapshotBasePath: './assets/snapshots/',
  logosBasePath: './assets/logos/',
  dataPaths: DEFAULT_DATA_PATHS_V446,
  futureLeagueCandidate: Object.freeze({
    provisionalName: 'FantaPetilloMantraManager',
    nameCanChange: true,
    status: 'planned-after-template-hardening'
  }),
  whatsapp: Object.freeze({
    bilanciUrl: 'https://silviobarra.com/zonaorientale/bilanci.html',
    newsShareBase: 'https://silviobarra.com/zonaorientale/share/news/'
  }),
  branding: Object.freeze({
    siteName: 'ZonaOrientale Salerno',
    homeEyebrow: 'Lega Fantacalcio',
    homeTitle: 'ZonaOrientale Salerno',
    homeSubtitle: 'Dashboard operativa per club, rose, listoni, competizioni e regolamento.',
    imageUrl: 'https://silviobarra.com/zonaorientale/assets/icons/android-chrome-512x512.png',
    pages: DEFAULT_LEAGUE_PAGES_V445,
    mobileMore: DEFAULT_MOBILE_MORE_V445
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
    preserveDeviceBadgeV434: true,
    runtimePresentationFromConfig: true,
    metadataShareOnly: true
  })
});

const CONFIG_URL_V443 = './assets/league-config.json?v=453';

function isPlainObjectV443(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function mergeShallowObjectV443(defaultValue, incomingValue) {
  return { ...(isPlainObjectV443(defaultValue) ? defaultValue : {}), ...(isPlainObjectV443(incomingValue) ? incomingValue : {}) };
}

function freezePagesV445(pages = {}) {
  const source = mergeShallowObjectV443(DEFAULT_LEAGUE_PAGES_V445, pages);
  return Object.freeze(Object.fromEntries(
    Object.entries(source).map(([key, value]) => [key, Object.freeze({ ...(value || {}) })])
  ));
}

function freezeMobileMoreV445(items) {
  const source = Array.isArray(items) && items.length ? items : DEFAULT_MOBILE_MORE_V445;
  return Object.freeze(source.map((item) => Object.freeze({ ...(item || {}) })));
}

function mergeBrandingV445(defaultBranding = {}, incomingBranding = {}) {
  const merged = mergeShallowObjectV443(defaultBranding, incomingBranding);
  merged.pages = freezePagesV445(mergeShallowObjectV443(defaultBranding.pages, incomingBranding.pages));
  merged.mobileMore = freezeMobileMoreV445(incomingBranding.mobileMore || defaultBranding.mobileMore);
  return merged;
}

function mergeConfigV443(defaults, incoming) {
  if (!isPlainObjectV443(incoming)) return { ...defaults };
  const merged = { ...defaults, ...incoming };
  merged.whatsapp = { ...(defaults.whatsapp || {}), ...(incoming.whatsapp || {}) };
  merged.branding = mergeBrandingV445(defaults.branding || {}, incoming.branding || {});
  merged.dataPaths = { ...(defaults.dataPaths || DEFAULT_DATA_PATHS_V446), ...(incoming.dataPaths || {}) };
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
    branding: Object.freeze({
      ...merged.branding,
      pages: freezePagesV445(merged.branding?.pages),
      mobileMore: freezeMobileMoreV445(merged.branding?.mobileMore)
    }),
    dataPaths: Object.freeze({ ...(merged.dataPaths || DEFAULT_DATA_PATHS_V446) }),
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
    version: 'V452',
    source,
    config: cachedConfigV443,
    loadedAt: new Date().toISOString(),
    configOnly: true,
    runtimePresentationFromConfig: true,
    staticDataPathsFromConfig: true,
    cloneSandboxReady: true,
    cloneSandboxAudited: true,
    cloneFirebaseBootstrapReady: true,
    cloneAdminBootstrapReady: true,
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


function hasExternalSchemeV446(value) {
  return /^[a-z][a-z0-9+.-]*:/i.test(String(value || ''));
}

function normalizePathBaseV446(value, fallback = './assets/') {
  const raw = String(value || fallback || '').trim() || fallback;
  if (hasExternalSchemeV446(raw) || raw.startsWith('/') || raw.endsWith('/')) return raw;
  return `${raw}/`;
}

function stripLeadingSlashV446(value) {
  return String(value || '').replace(/^\/+/g, '');
}

export function getLeagueDataPathV446(key, fallback = '') {
  const configured = getLeagueConfigValueV443(`dataPaths.${key}`, '');
  const value = String(configured || fallback || '').trim();
  return value || String(fallback || '');
}

export function joinLeagueDataPathV446(baseKey, fileName, fallbackBase = './assets/') {
  const base = normalizePathBaseV446(getLeagueDataPathV446(baseKey, fallbackBase), fallbackBase);
  const file = stripLeadingSlashV446(fileName);
  if (!file) return base;
  return `${base}${file}`;
}

export function getLeagueLogoPathV446(value) {
  const raw = String(value || '').trim();
  if (!raw || raw.startsWith('data:')) return '';
  if (hasExternalSchemeV446(raw) || raw.startsWith('/') || raw.startsWith('./') || raw.startsWith('../') || raw.startsWith('assets/')) return raw;
  return joinLeagueDataPathV446('logosBase', raw, './assets/logos/');
}

export function withLeagueCacheBusterV446(url, version = getLeagueConfigValueV443('currentVersion', '446')) {
  const raw = String(url || '').trim();
  if (!raw) return '';
  const glue = raw.includes('?') ? '&' : '?';
  return `${raw}${glue}v=${encodeURIComponent(version || '446')}`;
}

export function getLeagueWhatsappBilanciUrlV443() {
  return getLeagueConfigValueV443('whatsapp.bilanciUrl', DEFAULT_LEAGUE_CONFIG_V443.whatsapp.bilanciUrl);
}

export function getLeagueSiteUrlV443() {
  const value = String(getLeagueConfigValueV443('siteUrl', DEFAULT_LEAGUE_CONFIG_V443.siteUrl) || DEFAULT_LEAGUE_CONFIG_V443.siteUrl).trim();
  return value.endsWith('/') ? value : `${value}/`;
}

export function getLeagueNewsShareBaseUrlV445() {
  const configured = String(getLeagueConfigValueV443('whatsapp.newsShareBase', '') || '').trim();
  if (configured) return configured.endsWith('/') ? configured : `${configured}/`;
  return `${getLeagueSiteUrlV443()}share/news/`;
}

export function getLeaguePageMetadataV445(pageId = 'home') {
  const page = getLeagueConfigValueV443(`branding.pages.${pageId}`, null)
    || getLeagueConfigValueV443('branding.pages.home', DEFAULT_LEAGUE_CONFIG_V443.branding.pages.home);
  const siteName = getLeagueConfigValueV443('branding.siteName', getLeagueConfigValueV443('name', DEFAULT_LEAGUE_CONFIG_V443.name));
  const imageUrl = getLeagueConfigValueV443('branding.imageUrl', `${getLeagueSiteUrlV443()}assets/icons/android-chrome-512x512.png`);
  return Object.freeze({
    pageId,
    siteName,
    title: page.title || siteName,
    description: page.description || DEFAULT_LEAGUE_CONFIG_V443.branding.pages.home.description,
    canonicalUrl: page.canonicalUrl || getLeagueSiteUrlV443(),
    ogType: page.ogType || 'website',
    imageUrl
  });
}

function detectPageIdV445() {
  const explicit = document.body?.dataset?.leaguePage;
  if (explicit) return explicit;
  const path = String(window.location?.pathname || '');
  if (path.endsWith('/competition.html')) return 'competition';
  if (path.endsWith('/player.html')) return 'player';
  if (path.endsWith('/bilanci.html')) return 'bilanci';
  return 'home';
}

function setMetaContentV445(selector, value) {
  if (!value) return;
  const element = document.head?.querySelector(selector);
  if (element) element.setAttribute('content', value);
}

function setCanonicalV445(value) {
  if (!value) return;
  let element = document.head?.querySelector('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head?.appendChild(element);
  }
  element.setAttribute('href', value);
}

function applyMetaTagsV445(pageId) {
  const meta = getLeaguePageMetadataV445(pageId);
  if (meta.title) document.title = meta.title;
  setMetaContentV445('meta[name="description"]', meta.description);
  setCanonicalV445(meta.canonicalUrl);
  setMetaContentV445('meta[property="og:type"]', meta.ogType);
  setMetaContentV445('meta[property="og:site_name"]', meta.siteName);
  setMetaContentV445('meta[property="og:title"]', meta.title);
  setMetaContentV445('meta[property="og:description"]', meta.description);
  setMetaContentV445('meta[property="og:image"]', meta.imageUrl);
  setMetaContentV445('meta[property="og:url"]', meta.canonicalUrl);
  setMetaContentV445('meta[name="twitter:title"]', meta.title);
  setMetaContentV445('meta[name="twitter:description"]', meta.description);
  setMetaContentV445('meta[name="twitter:image"]', meta.imageUrl);
}

function setTextForSelectorV445(selector, text) {
  if (!text) return;
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = text;
  });
}

function applyBrandTextV445() {
  setTextForSelectorV445('[data-league-text-v445="homeEyebrow"]', getLeagueConfigValueV443('branding.homeEyebrow', 'Lega Fantacalcio'));
  setTextForSelectorV445('[data-league-text-v445="homeTitle"]', getLeagueConfigValueV443('branding.homeTitle', getLeagueConfigValueV443('name', 'ZonaOrientale Salerno')));
  setTextForSelectorV445('[data-league-text-v445="homeSubtitle"]', getLeagueConfigValueV443('branding.homeSubtitle', 'Dashboard operativa per club, rose, listoni, competizioni e regolamento.'));
  const footerVersion = getLeagueConfigValueV443('currentVersion', '445');
  const siteName = getLeagueConfigValueV443('branding.siteName', getLeagueConfigValueV443('name', 'ZonaOrientale Salerno'));
  setTextForSelectorV445('[data-league-footer-v445]', `${siteName} · V${footerVersion} audit clone FantaPetillo · Ultimo aggiornamento 15/06/2026`);
}

function resolveHashHrefV445(href = '#dashboard') {
  const value = String(href || '#dashboard');
  if (/^[a-z][a-z0-9+.-]*:/i.test(value) || value.startsWith('./') || value.startsWith('../') || value.startsWith('/')) return value;
  const standalone = detectPageIdV445() !== 'home';
  return standalone && value.startsWith('#') ? `./${value}` : value;
}

function applyMobileMoreLinksV445() {
  const items = getLeagueConfigValueV443('branding.mobileMore', DEFAULT_MOBILE_MORE_V445);
  const byId = new Map((Array.isArray(items) ? items : DEFAULT_MOBILE_MORE_V445).map((item) => [String(item.id || ''), item]));
  document.querySelectorAll('#mobileMoreSheet .mobile-more-link').forEach((link) => {
    const id = link.dataset.leagueMobileMore || link.dataset.pageLink || String(link.getAttribute('href') || '').replace(/^\.\/|^#/, '');
    const item = byId.get(id);
    if (!item) return;
    const icon = link.querySelector('.mobile-more-icon');
    const label = link.querySelector('span:last-child');
    if (icon && item.icon) icon.textContent = item.icon;
    if (label && item.label) label.textContent = item.label;
    if (item.href) link.setAttribute('href', resolveHashHrefV445(item.href));
  });
}

export function applyLeagueRuntimePresentationV445(pageId = detectPageIdV445()) {
  try {
    applyMetaTagsV445(pageId);
    applyBrandTextV445();
    applyMobileMoreLinksV445();
    window.ZonaOrientaleLeagueRuntimePresentationV445 = Object.freeze({
      version: 'V452',
      pageId,
      appliedAt: new Date().toISOString(),
      metadataFromConfig: true,
      mobileMoreFromConfig: true,
      shareBaseFromConfig: true,
      preserves: [
        'valori ZonaOrientale invariati come fallback',
        'nessuna modifica a Firebase/Admin/snapshot loader',
        'nessuna modifica a routing principale o dati statici',
        'badge dispositivo V434 mantenuto'
      ]
    });
  } catch (error) {
    console.warn('Presentazione da league-config V445 non applicata.', error);
  }
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
      console.warn('League config V443/V445 non disponibile, uso default ZonaOrientale.', error);
      return publishConfigV443(DEFAULT_LEAGUE_CONFIG_V443, 'default-fallback');
    })
    .then((config) => {
      applyLeagueRuntimePresentationV445();
      return config;
    });
  window.ZonaOrientaleLeagueConfigReadyV443 = readyPromiseV443;
  return readyPromiseV443;
}

export const LEAGUE_CONFIG_DEFAULT_V443 = DEFAULT_LEAGUE_CONFIG_V443;
export const LEAGUE_CONFIG_DEFAULT_MOBILE_MORE_V445 = DEFAULT_MOBILE_MORE_V445;
export const LEAGUE_CONFIG_DEFAULT_DATA_PATHS_V446 = DEFAULT_DATA_PATHS_V446;

publishConfigV443(DEFAULT_LEAGUE_CONFIG_V443, 'default-bootstrap');
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    applyLeagueRuntimePresentationV445();
    loadLeagueConfigV443();
  }, { once: true });
} else {
  applyLeagueRuntimePresentationV445();
  loadLeagueConfigV443();
}
