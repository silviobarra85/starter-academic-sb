import { UI_VERSION_V496, setMetaContentV496, setCanonicalV496, setTextForSelectorV496, formatTemplateV496, normalizeIconV496, resolveHashHrefV496, installFantaUiV496 } from '../ui/components-v496.js';
const PRESENTATION_VERSION_V481 = 'V496';

function hasExternalSchemeV481(value) {
  return /^[a-z][a-z0-9+.-]*:/i.test(String(value || ''));
}

function getNestedConfigValueV481(source, path, fallback = '') {
  const parts = String(path || '').split('.').filter(Boolean);
  let current = source || {};
  for (const part of parts) {
    if (!current || typeof current !== 'object' || !(part in current)) return fallback;
    current = current[part];
  }
  return current ?? fallback;
}

function detectPageIdV481(doc = document, win = window) {
  const explicit = doc?.body?.dataset?.leaguePage;
  if (explicit) return explicit;
  const path = String(win?.location?.pathname || '');
  if (path.endsWith('/competition.html')) return 'competition';
  if (path.endsWith('/player.html')) return 'player';
  if (path.endsWith('/bilanci.html')) return 'bilanci';
  if (path.endsWith('/news.html')) return 'news';
  return 'home';
}

function setMetaContentV481(doc, selector, value) {
  return setMetaContentV496(doc, selector, value);
}

function setCanonicalV481(doc, value) {
  return setCanonicalV496(doc, value);
}

function setTextForSelectorV481(doc, selector, text) {
  return setTextForSelectorV496(doc, selector, text);
}

function getLeagueSiteUrlV481(getValue, fallback = '') {
  const value = String(getValue('siteUrl', fallback) || fallback || '').trim();
  return value.endsWith('/') ? value : `${value}/`;
}

function getPageMetadataV481({ pageId = 'home', getValue, defaults = {}, getSiteUrl }) {
  const homeDefault = defaults?.branding?.pages?.home || {};
  const page = getValue(`branding.pages.${pageId}`, null) || getValue('branding.pages.home', homeDefault) || homeDefault;
  const siteName = getValue('branding.siteName', getValue('name', defaults.name || 'Fantacalcio'));
  const siteUrl = typeof getSiteUrl === 'function' ? getSiteUrl() : getLeagueSiteUrlV481(getValue, defaults.siteUrl || '');
  const imageUrl = getValue('branding.imageUrl', `${siteUrl}assets/icons/android-chrome-512x512.png`);
  return Object.freeze({
    pageId,
    siteName,
    title: page.title || siteName,
    description: page.description || homeDefault.description || '',
    canonicalUrl: page.canonicalUrl || siteUrl,
    ogType: page.ogType || 'website',
    imageUrl
  });
}

function applyMetadataV481({ doc, pageId, getValue, defaults, getSiteUrl }) {
  const meta = getPageMetadataV481({ pageId, getValue, defaults, getSiteUrl });
  if (meta.title) doc.title = meta.title;
  setMetaContentV481(doc, 'meta[name="description"]', meta.description);
  setCanonicalV481(doc, meta.canonicalUrl);
  setMetaContentV481(doc, 'meta[property="og:type"]', meta.ogType);
  setMetaContentV481(doc, 'meta[property="og:site_name"]', meta.siteName);
  setMetaContentV481(doc, 'meta[property="og:title"]', meta.title);
  setMetaContentV481(doc, 'meta[property="og:description"]', meta.description);
  setMetaContentV481(doc, 'meta[property="og:image"]', meta.imageUrl);
  setMetaContentV481(doc, 'meta[property="og:url"]', meta.canonicalUrl);
  setMetaContentV481(doc, 'meta[name="twitter:title"]', meta.title);
  setMetaContentV481(doc, 'meta[name="twitter:description"]', meta.description);
  setMetaContentV481(doc, 'meta[name="twitter:image"]', meta.imageUrl);
  return meta;
}

function formatFooterTextV481({ getValue }) {
  const footerVersion = getValue('currentVersion', '481');
  const siteName = getValue('branding.siteName', getValue('name', 'Fantacalcio'));
  const footerLastUpdated = getValue('branding.footerLastUpdated', '24/06/2026');
  const footerTemplate = getValue('branding.footerTemplate', '{siteName} · V{version} · Ultimo aggiornamento {lastUpdated}');
  return formatTemplateV496(footerTemplate || '{siteName} · V{version} · Ultimo aggiornamento {lastUpdated}', {
    siteName,
    version: footerVersion,
    lastUpdated: footerLastUpdated
  });
}

function applyBrandTextV481({ doc, getValue }) {
  const counts = {};
  counts.eyebrow = setTextForSelectorV481(doc, '[data-league-text-v445="homeEyebrow"]', getValue('branding.homeEyebrow', 'Lega Fantacalcio'));
  counts.title = setTextForSelectorV481(doc, '[data-league-text-v445="homeTitle"]', getValue('branding.homeTitle', getValue('name', 'Fantacalcio')));
  counts.subtitle = setTextForSelectorV481(doc, '[data-league-text-v445="homeSubtitle"]', getValue('branding.homeSubtitle', 'Dashboard operativa per club, rose, listoni, competizioni e regolamento.'));
  const footerText = formatFooterTextV481({ getValue });
  counts.footer = setTextForSelectorV481(doc, '[data-league-footer-v445]', footerText);
  return { footerText, counts };
}

const DEFAULT_ICON_MAP_V481 = Object.freeze({
  dashboard: '🏠', home: '🏠', news: '📰', teams: '👥', clubs: '👥', fm: '💰', market: '🔁',
  trophy: '🏆', honor: '🏛️', stats: '📊', archive: '🗂️', compare: '⚔️', dice: '🎲',
  rules: '📘', admin: '⚙️', team: '👕', list: '📋'
});

function normalizeIconV481(icon, id = '') {
  return normalizeIconV496(icon, id, DEFAULT_ICON_MAP_V481);
}

function resolveHashHrefV481(href = '#dashboard', { doc = document, win = window, pageId = '' } = {}) {
  return resolveHashHrefV496(href, { document: doc, window: win, pageId: pageId || detectPageIdV481(doc, win), detectPageId: detectPageIdV481 });
}

function collectMobileMoreItemsV481({ getValue, defaultMobileMore = [], registry }) {
  const configured = getValue('branding.mobileMore', defaultMobileMore);
  if (Array.isArray(configured) && configured.length) return configured;
  const registryItems = registry?.listNavItems?.('mobileMore') || [];
  if (registryItems.length) {
    return registryItems.map((page) => ({
      id: page.id,
      href: page.href || `#${page.id}`,
      label: page.nav?.label || page.label || page.id,
      icon: normalizeIconV481(page.nav?.icon, page.id)
    }));
  }
  return defaultMobileMore || [];
}

function applyMobileMoreLinksV481({ doc, win, pageId, getValue, defaultMobileMore, registry }) {
  const items = collectMobileMoreItemsV481({ getValue, defaultMobileMore, registry });
  const byId = new Map(items.map((item) => [String(item.id || ''), item]));
  let count = 0;
  doc?.querySelectorAll('#mobileMoreSheet .mobile-more-link')?.forEach((link) => {
    const id = link.dataset.leagueMobileMore || link.dataset.pageLink || String(link.getAttribute('href') || '').replace(/^\.\/|^#/, '');
    const item = byId.get(id);
    if (!item) return;
    const icon = link.querySelector('.mobile-more-icon');
    const label = link.querySelector('span:last-child');
    const normalizedIcon = normalizeIconV481(item.icon, id);
    if (icon && normalizedIcon) icon.textContent = normalizedIcon;
    if (label && item.label) label.textContent = item.label;
    if (item.href) link.setAttribute('href', resolveHashHrefV481(item.href, { doc, win, pageId }));
    count += 1;
  });
  return { count, itemCount: items.length };
}

function buildGetValueV481(options = {}) {
  if (typeof options.getValue === 'function') return options.getValue;
  const config = options.config || {};
  return (path, fallback = '') => getNestedConfigValueV481(config, path, fallback);
}

function resolveRegistryV481(win = window, explicit = null) {
  return explicit || win?.FantaLeagueSectionRegistryV480 || win?.FantaLeagueSectionRegistryV481 || null;
}

function applyLeagueRuntimePresentationV481(options = {}) {
  const doc = options.document || document;
  const win = options.window || window;
  const pageId = options.pageId || detectPageIdV481(doc, win);
  const getValue = buildGetValueV481(options);
  const defaults = options.defaults || {};
  const registry = resolveRegistryV481(win, options.registry);
  const ui = installFantaUiV496({ window: win, document: doc });
  const meta = applyMetadataV481({ doc, pageId, getValue, defaults, getSiteUrl: options.getSiteUrl });
  const brand = applyBrandTextV481({ doc, getValue });
  const mobileMore = applyMobileMoreLinksV481({ doc, win, pageId, getValue, defaultMobileMore: options.defaultMobileMore || [], registry });
  const result = Object.freeze({
    version: PRESENTATION_VERSION_V481,
    pageId,
    appliedAt: new Date().toISOString(),
    engineCommon: true,
    uiComponentsEngine: UI_VERSION_V496,
    uiComponentsReady: Boolean(ui),
    registryAvailable: Boolean(registry),
    metadataFromConfig: true,
    brandTextFromConfig: true,
    footerFromConfig: true,
    mobileMoreFromConfigOrRegistry: true,
    mobileMoreUpdatedLinks: mobileMore.count,
    mobileMoreItemCount: mobileMore.itemCount,
    footerText: brand.footerText,
    title: meta.title
  });
  if (win) {
    win.FantaLeaguePresentationV481 = Object.freeze({
      ...(win.FantaLeaguePresentationV481 || {}),
      version: PRESENTATION_VERSION_V481,
      uiComponentsEngine: UI_VERSION_V496,
      lastResult: result,
      applyRuntimePresentation: () => applyLeagueRuntimePresentationV481(options)
    });
  }
  return result;
}

function installLeaguePresentationV481(options = {}) {
  const win = options.window || window;
  const doc = options.document || document;
  const apply = (extra = {}) => applyLeagueRuntimePresentationV481({ ...options, ...extra });
  win.FantaLeaguePresentationV481 = Object.freeze({
    version: PRESENTATION_VERSION_V481,
    uiComponentsEngine: UI_VERSION_V496,
    applyRuntimePresentation: apply,
    lastResult: null
  });
  doc?.addEventListener?.('fanta-section-registry-ready-v480', () => {
    try { apply({ registry: resolveRegistryV481(win, options.registry) }); } catch (error) { console.warn('Fanta presentation V481 registry refresh failed.', error); }
  });
  return apply();
}

export {
  PRESENTATION_VERSION_V481,
  UI_VERSION_V496,
  applyLeagueRuntimePresentationV481,
  installLeaguePresentationV481,
  resolveHashHrefV481,
  detectPageIdV481,
  getPageMetadataV481
};
