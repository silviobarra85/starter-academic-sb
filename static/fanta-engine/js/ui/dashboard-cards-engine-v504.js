const DASHBOARD_CARDS_ENGINE_VERSION_V504 = 'V504';

const DEFAULT_DASHBOARD_CARD_SELECTORS_V504 = Object.freeze({
  'admin-dashboard': ['#adminPanel', '#adminDashboard', '[data-feature-card-id="admin-dashboard"]'],
  'admin-users': ['#adminUsersPanel', '#adminUsersSection', '[data-feature-card-id="admin-users"]'],
  'admin-news': ['#adminNewsPanel', '#adminPublicationPanel', '[data-feature-card-id="admin-news"]'],
  'president-dashboard': ['#teamarea', '#teamArea', '#teamDashboardPanelV369', '[data-feature-card-id="president-dashboard"]'],
  'team-area': ['#teamarea', '#teamArea', '[data-feature-card-id="team-area"]'],
  'release-players': ['#teamPlayerReleasePanelV261', '#teamPlayerReleasePanel', '[data-feature-card-id="release-players"]'],
  'trade-announcement': ['#teamTransferCommunicationPanelV242', '#teamTransferCommunicationPanelV50', '[data-feature-card-id="trade-announcement"]'],
  'rule-proposals': ['#ruleProposalsPresidentSectionV479', '#ruleProposalsAdminSectionV479', '[data-feature-card-id="rule-proposals"]']
});

const VISIBILITY_ENFORCE_MODES_V504 = new Set(['safe-enforce', 'enforce']);

function normalizeFeatureCardIdV504(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
}

function asArrayV504(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function getNestedValueV504(source, path, fallback = undefined) {
  if (!source || !path) return fallback;
  const keys = String(path).split('.').filter(Boolean);
  let current = source;
  for (const key of keys) {
    if (current && Object.prototype.hasOwnProperty.call(current, key)) current = current[key];
    else return fallback;
  }
  return current === undefined ? fallback : current;
}

function resolveLeagueConfigV504(options = {}) {
  if (options.leagueConfig) return options.leagueConfig;
  if (typeof options.getLeagueConfig === 'function') return options.getLeagueConfig('', {}) || {};
  if (typeof window !== 'undefined') {
    const configContainer = Object.values(window).find((value) => value && typeof value === 'object' && value.config && value.config.leagueId);
    return configContainer?.config || window.FantaLeagueConfigV443?.config || window.FantaLeagueConfigV443 || {};
  }
  return {};
}

function resolveFeatureRegistryV504(options = {}) {
  if (options.featureRegistry) return options.featureRegistry;
  if (typeof options.getFeatureRegistry === 'function') return options.getFeatureRegistry() || null;
  if (typeof window !== 'undefined') return window.FantaEngineFeatureCardRegistryRuntimeV497 || null;
  return null;
}

function resolveContextV504(options = {}) {
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

function getDashboardEngineConfigV504(config = {}) {
  return config.dashboardCardsEngine || config.ui?.dashboardCardsEngine || {};
}

function getSelectorMapV504(config = {}) {
  const engineConfig = getDashboardEngineConfigV504(config);
  return {
    ...DEFAULT_DASHBOARD_CARD_SELECTORS_V504,
    ...(engineConfig.selectors || {})
  };
}

function getCardsFromRegistryV504(registryApi, context = {}) {
  if (!registryApi) return [];
  if (typeof registryApi.getAllCards === 'function') return registryApi.getAllCards();
  if (registryApi.registry && typeof registryApi.registry.getAllCards === 'function') return registryApi.registry.getAllCards();
  if (typeof registryApi.getEnabledCards === 'function') return registryApi.getEnabledCards(context);
  return [];
}

function getEnabledCardIdsV504(registryApi, context = {}) {
  if (!registryApi) return new Set();
  const cards = typeof registryApi.getEnabledCards === 'function'
    ? registryApi.getEnabledCards(context)
    : registryApi.registry && typeof registryApi.registry.getEnabledCards === 'function'
      ? registryApi.registry.getEnabledCards(context)
      : [];
  return new Set(cards.map((card) => normalizeFeatureCardIdV504(card.id)).filter(Boolean));
}

function queryCardElementsV504(root, selectors = []) {
  const docRoot = root || (typeof document !== 'undefined' ? document : null);
  if (!docRoot || typeof docRoot.querySelectorAll !== 'function') return [];
  const elements = [];
  const seen = new Set();
  asArrayV504(selectors).forEach((selector) => {
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

function shouldMutateVisibilityV504({ card, enabled, mode, engineConfig }) {
  if (!VISIBILITY_ENFORCE_MODES_V504.has(String(mode || 'observe-first'))) return false;
  if (card?.enforceVisibility === false) return false;
  if (engineConfig?.enforceVisibility === false) return false;
  if (String(mode) === 'enforce') return true;

  // safe-enforce: govern only auth/role-gated dashboard cards, not public cards.
  const visibility = String(card?.visibility || 'public');
  if (visibility === 'public') return false;
  if (card?.safeEnforce === false) return false;
  if (card?.hiddenForAdmin === true) return true;
  if (visibility === 'admin' || visibility === 'president' || visibility === 'authenticated') return true;
  return enabled === false && card?.safeEnforce === true;
}

function setCardElementStateV504(element, card, enabled, mode, engineConfig = {}) {
  if (!element || !card) return;
  element.dataset.featureCardId = card.id;
  element.dataset.dashboardCardsEngineV504 = DASHBOARD_CARDS_ENGINE_VERSION_V504;
  element.dataset.dashboardCardVisibilityV504 = String(card.visibility || 'public');
  element.dataset.dashboardCardCategoryV504 = String(card.category || 'uncategorized');
  element.dataset.dashboardCardEnabledV504 = enabled ? 'true' : 'false';
  element.classList.toggle('fanta-dashboard-card-disabled-v504', !enabled);

  const mutateVisibility = shouldMutateVisibilityV504({ card, enabled, mode, engineConfig });
  element.dataset.dashboardCardEnforceModeV504 = String(mode || 'observe-first');
  element.dataset.dashboardCardVisibilityManagedV504 = mutateVisibility ? 'true' : 'false';

  if (mutateVisibility) {
    element.hidden = !enabled;
    element.setAttribute('aria-hidden', enabled ? 'false' : 'true');
    element.classList.toggle('fanta-dashboard-card-hidden-v504', !enabled);
  }
}

function buildDashboardCardSnapshotV504({ registryApi, context, config }) {
  const allCards = getCardsFromRegistryV504(registryApi, context);
  const enabledIds = getEnabledCardIdsV504(registryApi, context);
  const selectorMap = getSelectorMapV504(config);
  return allCards.map((card) => ({
    ...card,
    id: normalizeFeatureCardIdV504(card.id),
    enabledForContext: enabledIds.has(normalizeFeatureCardIdV504(card.id)),
    selectors: asArrayV504(selectorMap[normalizeFeatureCardIdV504(card.id)])
  }));
}

function createDashboardCardsEngineV504(options = {}) {
  const config = resolveLeagueConfigV504(options);
  const engineConfig = getDashboardEngineConfigV504(config);
  const mode = options.mode || engineConfig.mode || 'safe-enforce';
  const registryApi = resolveFeatureRegistryV504(options);
  const api = {
    version: DASHBOARD_CARDS_ENGINE_VERSION_V504,
    mode,
    leagueId: config.leagueId || engineConfig.leagueId || '',
    getContext(nextOptions = {}) {
      return resolveContextV504({ ...options, ...nextOptions });
    },
    getRegistry() {
      return resolveFeatureRegistryV504(options);
    },
    getSnapshot(nextOptions = {}) {
      const runtimeConfig = resolveLeagueConfigV504({ ...options, ...nextOptions });
      const context = resolveContextV504({ ...options, ...nextOptions });
      const runtimeRegistry = resolveFeatureRegistryV504({ ...options, ...nextOptions }) || registryApi;
      return buildDashboardCardSnapshotV504({ registryApi: runtimeRegistry, context, config: runtimeConfig });
    },
    shouldShow(cardId, context = this.getContext()) {
      const runtimeRegistry = this.getRegistry() || registryApi;
      return getEnabledCardIdsV504(runtimeRegistry, context).has(normalizeFeatureCardIdV504(cardId));
    },
    apply(root = (typeof document !== 'undefined' ? document : null), nextOptions = {}) {
      const runtimeConfig = resolveLeagueConfigV504({ ...options, ...nextOptions });
      const runtimeEngineConfig = getDashboardEngineConfigV504(runtimeConfig);
      const runtimeMode = nextOptions.mode || runtimeEngineConfig.mode || mode;
      const snapshot = this.getSnapshot(nextOptions);
      let touched = 0;
      let visibilityManaged = 0;
      snapshot.forEach((card) => {
        const selectors = card.selectors || getSelectorMapV504(runtimeConfig)[card.id] || [];
        const elements = queryCardElementsV504(root, selectors);
        elements.forEach((element) => {
          touched += 1;
          if (shouldMutateVisibilityV504({ card, enabled: card.enabledForContext, mode: runtimeMode, engineConfig: runtimeEngineConfig })) visibilityManaged += 1;
          setCardElementStateV504(element, card, card.enabledForContext, runtimeMode, runtimeEngineConfig);
        });
      });
      this.lastApply = {
        version: DASHBOARD_CARDS_ENGINE_VERSION_V504,
        appliedAt: new Date().toISOString(),
        mode: runtimeMode,
        touched,
        visibilityManaged,
        cards: snapshot.map(({ id, title, visibility, category, enabledForContext }) => ({ id, title, visibility, category, enabledForContext }))
      };
      return this.lastApply;
    },
    refresh(nextOptions = {}) {
      return this.apply(nextOptions.root || (typeof document !== 'undefined' ? document : null), nextOptions);
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
        this.observer.observe(target, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'class', 'data-feature-card-id'] });
      }
      if (typeof window !== 'undefined' && !this.authRefreshListenerInstalled) {
        this.authRefreshListenerInstalled = true;
        window.addEventListener('fanta:auth-state-changed', () => this.refresh({ root }), { passive: true });
        window.addEventListener('fanta:dashboard-context-changed', () => this.refresh({ root }), { passive: true });
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

function installDashboardCardsEngineV504(options = {}) {
  const win = options.window || (typeof window !== 'undefined' ? window : null);
  const engine = createDashboardCardsEngineV504(options);
  if (win) {
    win.FantaEngineDashboardCardsV504 = engine;
    win.FantaEngineDashboardCardsRuntimeV504 = engine;
    // Legacy alias kept so older diagnostics do not break.
    win.FantaEngineDashboardCardsRuntimeV500 = engine;
  }
  if (options.autoStart !== false) engine.start(options.root || (typeof document !== 'undefined' ? document : null));
  return engine;
}

export {
  DASHBOARD_CARDS_ENGINE_VERSION_V504,
  DEFAULT_DASHBOARD_CARD_SELECTORS_V504,
  createDashboardCardsEngineV504,
  installDashboardCardsEngineV504,
  normalizeFeatureCardIdV504,
  resolveContextV504,
  shouldMutateVisibilityV504
};
