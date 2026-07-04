const DASHBOARD_CARDS_ENGINE_VERSION_V500 = 'V500';

const DEFAULT_DASHBOARD_CARD_SELECTORS_V500 = Object.freeze({
  'admin-dashboard': ['#adminPanel', '#adminDashboard', '[data-feature-card-id="admin-dashboard"]'],
  'admin-users': ['#adminUsersPanel', '#adminUsersSection', '[data-feature-card-id="admin-users"]'],
  'admin-news': ['#adminNewsPanel', '#adminPublicationPanel', '[data-feature-card-id="admin-news"]'],
  'president-dashboard': ['#teamarea', '#teamArea', '#teamDashboardPanelV369', '[data-feature-card-id="president-dashboard"]'],
  'team-area': ['#teamarea', '#teamArea', '[data-feature-card-id="team-area"]'],
  'release-players': ['#teamPlayerReleasePanelV261', '#teamPlayerReleasePanel', '[data-feature-card-id="release-players"]'],
  'trade-announcement': ['#teamTransferCommunicationPanelV242', '#teamTransferCommunicationPanelV50', '[data-feature-card-id="trade-announcement"]'],
  'rule-proposals': ['#ruleProposalsPresidentSectionV479', '#ruleProposalsAdminSectionV479', '[data-feature-card-id="rule-proposals"]']
});

function normalizeFeatureCardIdV500(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
}

function asArrayV500(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function getNestedValueV500(source, path, fallback = undefined) {
  if (!source || !path) return fallback;
  const keys = String(path).split('.').filter(Boolean);
  let current = source;
  for (const key of keys) {
    if (current && Object.prototype.hasOwnProperty.call(current, key)) current = current[key];
    else return fallback;
  }
  return current === undefined ? fallback : current;
}

function resolveLeagueConfigV500(options = {}) {
  if (options.leagueConfig) return options.leagueConfig;
  if (typeof options.getLeagueConfig === 'function') return options.getLeagueConfig('', {}) || {};
  if (typeof window !== 'undefined') {
    const configContainer = Object.values(window).find((value) => value && typeof value === 'object' && value.config && value.config.leagueId);
    return configContainer?.config || window.FantaLeagueConfigV443?.config || window.FantaLeagueConfigV443 || {};
  }
  return {};
}

function resolveFeatureRegistryV500(options = {}) {
  if (options.featureRegistry) return options.featureRegistry;
  if (typeof options.getFeatureRegistry === 'function') return options.getFeatureRegistry() || null;
  if (typeof window !== 'undefined') return window.FantaEngineFeatureCardRegistryRuntimeV497 || null;
  return null;
}

function resolveContextV500(options = {}) {
  const provided = typeof options.contextProvider === 'function' ? options.contextProvider() : (options.context || {});
  const role = provided?.role || (provided?.isAdmin ? 'admin' : provided?.isPresident ? 'president' : provided?.isAuthenticated || provided?.user ? 'authenticated' : 'guest');
  return {
    ...provided,
    role,
    isAdmin: Boolean(provided?.isAdmin || role === 'admin'),
    isPresident: Boolean(provided?.isPresident || role === 'president'),
    isAuthenticated: Boolean(provided?.isAuthenticated || provided?.user || role === 'admin' || role === 'president' || role === 'authenticated')
  };
}

function getDashboardEngineConfigV500(config = {}) {
  return config.dashboardCardsEngine || config.ui?.dashboardCardsEngine || {};
}

function getSelectorMapV500(config = {}) {
  const engineConfig = getDashboardEngineConfigV500(config);
  return {
    ...DEFAULT_DASHBOARD_CARD_SELECTORS_V500,
    ...(engineConfig.selectors || {})
  };
}

function getCardsFromRegistryV500(registryApi, context = {}) {
  if (!registryApi) return [];
  if (typeof registryApi.getAllCards === 'function') return registryApi.getAllCards();
  if (registryApi.registry && typeof registryApi.registry.getAllCards === 'function') return registryApi.registry.getAllCards();
  if (typeof registryApi.getEnabledCards === 'function') return registryApi.getEnabledCards(context);
  return [];
}

function getEnabledCardIdsV500(registryApi, context = {}) {
  if (!registryApi) return new Set();
  const cards = typeof registryApi.getEnabledCards === 'function'
    ? registryApi.getEnabledCards(context)
    : registryApi.registry && typeof registryApi.registry.getEnabledCards === 'function'
      ? registryApi.registry.getEnabledCards(context)
      : [];
  return new Set(cards.map((card) => normalizeFeatureCardIdV500(card.id)).filter(Boolean));
}

function queryCardElementsV500(root, selectors = []) {
  const docRoot = root || (typeof document !== 'undefined' ? document : null);
  if (!docRoot || typeof docRoot.querySelectorAll !== 'function') return [];
  const elements = [];
  const seen = new Set();
  asArrayV500(selectors).forEach((selector) => {
    if (!selector) return;
    try {
      docRoot.querySelectorAll(selector).forEach((element) => {
        if (!seen.has(element)) {
          seen.add(element);
          elements.push(element);
        }
      });
    } catch (_) {
      // Invalid selectors are ignored so a league can keep partial mappings safely.
    }
  });
  return elements;
}

function setCardElementStateV500(element, card, enabled, mode) {
  if (!element || !card) return;
  element.dataset.featureCardId = card.id;
  element.dataset.dashboardCardsEngineV500 = DASHBOARD_CARDS_ENGINE_VERSION_V500;
  element.dataset.dashboardCardVisibilityV500 = String(card.visibility || 'public');
  element.dataset.dashboardCardCategoryV500 = String(card.category || 'uncategorized');
  element.dataset.dashboardCardEnabledV500 = enabled ? 'true' : 'false';
  element.classList.toggle('fanta-dashboard-card-disabled-v500', !enabled);
  if (mode === 'enforce') {
    element.hidden = !enabled;
    element.setAttribute('aria-hidden', enabled ? 'false' : 'true');
  }
}

function buildDashboardCardSnapshotV500({ registryApi, context, config }) {
  const allCards = getCardsFromRegistryV500(registryApi, context);
  const enabledIds = getEnabledCardIdsV500(registryApi, context);
  const selectorMap = getSelectorMapV500(config);
  return allCards.map((card) => ({
    ...card,
    id: normalizeFeatureCardIdV500(card.id),
    enabledForContext: enabledIds.has(normalizeFeatureCardIdV500(card.id)),
    selectors: asArrayV500(selectorMap[normalizeFeatureCardIdV500(card.id)])
  }));
}

function createDashboardCardsEngineV500(options = {}) {
  const config = resolveLeagueConfigV500(options);
  const engineConfig = getDashboardEngineConfigV500(config);
  const mode = options.mode || engineConfig.mode || 'observe-first';
  const registryApi = resolveFeatureRegistryV500(options);
  const api = {
    version: DASHBOARD_CARDS_ENGINE_VERSION_V500,
    mode,
    leagueId: config.leagueId || engineConfig.leagueId || '',
    getContext(nextOptions = {}) {
      return resolveContextV500({ ...options, ...nextOptions });
    },
    getRegistry() {
      return resolveFeatureRegistryV500(options);
    },
    getSnapshot(nextOptions = {}) {
      const runtimeConfig = resolveLeagueConfigV500({ ...options, ...nextOptions });
      const context = resolveContextV500({ ...options, ...nextOptions });
      const runtimeRegistry = resolveFeatureRegistryV500({ ...options, ...nextOptions }) || registryApi;
      return buildDashboardCardSnapshotV500({ registryApi: runtimeRegistry, context, config: runtimeConfig });
    },
    shouldShow(cardId, context = this.getContext()) {
      const runtimeRegistry = this.getRegistry() || registryApi;
      return getEnabledCardIdsV500(runtimeRegistry, context).has(normalizeFeatureCardIdV500(cardId));
    },
    apply(root = (typeof document !== 'undefined' ? document : null), nextOptions = {}) {
      const runtimeConfig = resolveLeagueConfigV500({ ...options, ...nextOptions });
      const runtimeMode = nextOptions.mode || mode;
      const snapshot = this.getSnapshot(nextOptions);
      let touched = 0;
      snapshot.forEach((card) => {
        const selectors = card.selectors || getSelectorMapV500(runtimeConfig)[card.id] || [];
        const elements = queryCardElementsV500(root, selectors);
        elements.forEach((element) => {
          touched += 1;
          setCardElementStateV500(element, card, card.enabledForContext, runtimeMode);
        });
      });
      this.lastApply = {
        version: DASHBOARD_CARDS_ENGINE_VERSION_V500,
        appliedAt: new Date().toISOString(),
        mode: runtimeMode,
        touched,
        cards: snapshot.map(({ id, title, visibility, category, enabledForContext }) => ({ id, title, visibility, category, enabledForContext }))
      };
      return this.lastApply;
    },
    start(root = (typeof document !== 'undefined' ? document : null)) {
      if (!root) return null;
      const run = () => this.apply(root);
      if (typeof document !== 'undefined' && document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once: true });
      else run();
      if (typeof MutationObserver !== 'undefined' && root && !this.observer) {
        const target = root.body || root;
        this.observer = new MutationObserver(() => {
          if (this.applyScheduled) return;
          this.applyScheduled = true;
          setTimeout(() => {
            this.applyScheduled = false;
            this.apply(root);
          }, 80);
        });
        this.observer.observe(target, { childList: true, subtree: true });
      }
      return this;
    },
    stop() {
      if (this.observer) this.observer.disconnect();
      this.observer = null;
      return this;
    }
  };
  return api;
}

function installDashboardCardsEngineV500(options = {}) {
  const win = options.window || (typeof window !== 'undefined' ? window : null);
  const engine = createDashboardCardsEngineV500(options);
  if (win) {
    win.FantaEngineDashboardCardsV500 = engine;
    win.FantaEngineDashboardCardsRuntimeV500 = engine;
  }
  if (options.autoStart !== false) engine.start(options.root || (typeof document !== 'undefined' ? document : null));
  return engine;
}

export {
  DASHBOARD_CARDS_ENGINE_VERSION_V500,
  DEFAULT_DASHBOARD_CARD_SELECTORS_V500,
  createDashboardCardsEngineV500,
  installDashboardCardsEngineV500,
  normalizeFeatureCardIdV500,
  resolveContextV500
};
