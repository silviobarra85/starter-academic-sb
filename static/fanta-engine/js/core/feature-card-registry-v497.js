const FEATURE_CARD_REGISTRY_VERSION_V497 = 'V497';

const DEFAULT_FEATURE_CARDS_V497 = Object.freeze([
  { id: 'dashboard-public', title: 'Dashboard', category: 'public', visibility: 'public', enabled: true, order: 10, common: true },
  { id: 'news', title: 'News', category: 'public', visibility: 'public', enabled: true, order: 20, common: true },
  { id: 'listone', title: 'Listone', category: 'public', visibility: 'public', enabled: true, order: 30, common: true },
  { id: 'matchday-draw', title: 'Sorteggio giornate', category: 'tool', visibility: 'public', featureKey: 'matchdayDrawTool', enabled: true, order: 40, common: true },
  { id: 'regolamento', title: 'Regolamento', category: 'public', visibility: 'public', enabled: true, order: 50, common: true },
  { id: 'team-area', title: 'Area Squadra', category: 'president', visibility: 'president', featureKey: 'teamArea', enabled: true, order: 100, common: true },
  { id: 'president-dashboard', title: 'Dashboard Presidente', category: 'president', visibility: 'president', featureKey: 'teamArea', enabled: true, order: 110, common: true, hiddenForAdmin: true },
  { id: 'release-players', title: 'Svincola Giocatori', category: 'president', visibility: 'president', featureKey: 'presidentReleasePlayers', enabled: false, order: 120, common: true, hiddenForAdmin: true },
  { id: 'trade-announcement', title: 'Comunicato avvenuto scambio', category: 'president', visibility: 'president', featureKey: 'presidentTradeAnnouncement', enabled: false, order: 130, common: true, hiddenForAdmin: true },
  { id: 'rule-proposals', title: 'Proposte regolamento', category: 'president', visibility: 'president', featureKey: 'ruleProposals', enabled: false, order: 140, common: true, hiddenForAdmin: true },
  { id: 'admin-dashboard', title: 'Dashboard Admin', category: 'admin', visibility: 'admin', featureKey: 'admin', enabled: true, order: 200, common: true },
  { id: 'admin-users', title: 'Utenti e presidenti', category: 'admin', visibility: 'admin', featureKey: 'admin', enabled: true, order: 210, common: true },
  { id: 'admin-news', title: 'Comunicati', category: 'admin', visibility: 'admin', featureKey: 'admin', enabled: true, order: 220, common: true }
]);

function normalizeIdV497(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
}

function asArrayV497(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function getNestedValueV497(source, path, fallback = undefined) {
  if (!source || !path) return fallback;
  const keys = String(path).split('.').filter(Boolean);
  let current = source;
  for (const key of keys) {
    if (current && Object.prototype.hasOwnProperty.call(current, key)) current = current[key];
    else return fallback;
  }
  return current === undefined ? fallback : current;
}

function resolveConfigV497(options = {}) {
  if (options.leagueConfig) return options.leagueConfig;
  if (typeof options.getLeagueConfig === 'function') return options.getLeagueConfig('', {}) || {};
  if (typeof window !== 'undefined') return window.FantaLeagueConfigV443 || window.FantaPetilloLeagueConfigV443 || window.ZonaOrientaleLeagueConfigV443 || {};
  return {};
}

function mergeCardsV497(baseCards = [], overrideCards = []) {
  const map = new Map();
  baseCards.forEach((card) => {
    const id = normalizeIdV497(card.id);
    if (id) map.set(id, { ...card, id });
  });
  overrideCards.forEach((card) => {
    const id = normalizeIdV497(card.id);
    if (!id) return;
    map.set(id, { ...(map.get(id) || {}), ...card, id });
  });
  return [...map.values()].sort((a, b) => Number(a.order || 999) - Number(b.order || 999) || String(a.title || a.id).localeCompare(String(b.title || b.id)));
}

function getFeatureFlagV497(config, card) {
  if (!card?.featureKey) return true;
  const value = getNestedValueV497(config, `features.${card.featureKey}`, undefined);
  return value === undefined ? Boolean(card.enabled) : Boolean(value);
}

function isLeagueAllowedV497(card, leagueId) {
  const allowed = asArrayV497(card.leagues).map(String).filter(Boolean);
  if (!allowed.length) return true;
  return allowed.includes(String(leagueId || ''));
}

function isVisibleForContextV497(card, context = {}) {
  const visibility = String(card.visibility || 'public');
  const role = String(context.role || (context.isAdmin ? 'admin' : context.isPresident ? 'president' : 'guest'));
  if (card.hiddenForAdmin && context.isAdmin) return false;
  if (visibility === 'public') return true;
  if (visibility === 'admin') return role === 'admin' || context.isAdmin === true;
  if (visibility === 'president') return role === 'president' || context.isPresident === true;
  if (visibility === 'authenticated') return Boolean(context.isAuthenticated || context.user);
  return false;
}

function getFeatureCardRegistryConfigV497(config = {}) {
  return config.featureCardRegistry || config.ui?.featureCardRegistry || {};
}

function buildFeatureCardRegistryV497(options = {}) {
  const config = resolveConfigV497(options);
  const registryConfig = getFeatureCardRegistryConfigV497(config);
  const baseCards = registryConfig.includeDefaults === false ? [] : DEFAULT_FEATURE_CARDS_V497;
  const cards = mergeCardsV497(baseCards, registryConfig.cards || []);
  const leagueId = config.leagueId || registryConfig.leagueId || '';
  return {
    version: FEATURE_CARD_REGISTRY_VERSION_V497,
    leagueId,
    mode: registryConfig.mode || 'metadata-first',
    cards,
    getAllCards() { return [...cards]; },
    getCard(id) { return cards.find((card) => card.id === normalizeIdV497(id)) || null; },
    getEnabledCards(context = {}) {
      return cards.filter((card) => isFeatureCardEnabledV497(card, { config, context, leagueId }));
    },
    getCardsByVisibility(visibility, context = {}) {
      return this.getEnabledCards(context).filter((card) => String(card.visibility || 'public') === String(visibility || 'public'));
    },
    describe() {
      return {
        version: FEATURE_CARD_REGISTRY_VERSION_V497,
        leagueId,
        mode: registryConfig.mode || 'metadata-first',
        totalCards: cards.length,
        enabledAtConfig: cards.filter((card) => getFeatureFlagV497(config, card) && card.enabled !== false).length,
        categories: [...new Set(cards.map((card) => card.category || 'uncategorized'))]
      };
    }
  };
}

function isFeatureCardEnabledV497(card, { config = {}, context = {}, leagueId = config.leagueId || '' } = {}) {
  if (!card || card.enabled === false) return false;
  if (!isLeagueAllowedV497(card, leagueId)) return false;
  if (!getFeatureFlagV497(config, card)) return false;
  return isVisibleForContextV497(card, context);
}

function installFeatureCardRegistryV497(options = {}) {
  const win = options.window || (typeof window !== 'undefined' ? window : null);
  const registry = buildFeatureCardRegistryV497(options);
  const api = {
    version: FEATURE_CARD_REGISTRY_VERSION_V497,
    registry,
    describe() { return this.registry.describe(); },
    getAllCards() { return this.registry.getAllCards(); },
    getCard(id) { return this.registry.getCard(id); },
    getEnabledCards(context = {}) { return this.registry.getEnabledCards(context); },
    getCardsByVisibility(visibility, context = {}) { return this.registry.getCardsByVisibility(visibility, context); },
    refresh(nextOptions = {}) {
      this.registry = buildFeatureCardRegistryV497({ ...options, ...nextOptions });
      return this.registry;
    }
  };
  if (win) win.FantaEngineFeatureCardRegistryV497 = api;
  return api;
}

export {
  FEATURE_CARD_REGISTRY_VERSION_V497,
  DEFAULT_FEATURE_CARDS_V497,
  buildFeatureCardRegistryV497,
  installFeatureCardRegistryV497,
  isFeatureCardEnabledV497,
  mergeCardsV497,
  normalizeIdV497
};
