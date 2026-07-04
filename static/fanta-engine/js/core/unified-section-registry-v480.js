const ENGINE_VERSION_V480 = 'V480';

function freezeDeepV480(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.getOwnPropertyNames(value).forEach((key) => freezeDeepV480(value[key]));
  return Object.freeze(value);
}

function normalizeKeyV480(value) {
  return String(value || '').replace(/^#/, '').trim().toLowerCase();
}

function normalizeSectionV480(section) {
  const id = normalizeKeyV480(section?.id);
  if (!id) throw new Error('Unified section registry V480: missing section id.');
  const visibility = section.visibility || (section.adminOnly ? 'admin' : section.requiresApprovedUser ? 'president' : section.public === false ? 'protected' : 'public');
  const area = section.area || (visibility === 'admin' ? 'admin' : visibility === 'president' ? 'presidents' : 'public');
  const nav = {
    desktop: section.nav?.desktop !== false,
    mobileMore: Boolean(section.nav?.mobileMore),
    mobilePrimary: Boolean(section.nav?.mobilePrimary),
    order: Number.isFinite(Number(section.nav?.order)) ? Number(section.nav.order) : 999,
    icon: section.nav?.icon || '',
    label: section.nav?.label || section.label || id
  };
  const dashboardCard = section.dashboardCard ? {
    enabled: section.dashboardCard.enabled !== false,
    order: Number.isFinite(Number(section.dashboardCard.order)) ? Number(section.dashboardCard.order) : nav.order,
    title: section.dashboardCard.title || section.label || id,
    description: section.dashboardCard.description || '',
    audience: section.dashboardCard.audience || visibility
  } : { enabled: false };
  return {
    ...section,
    id,
    label: section.label || id,
    href: section.href || `#${id}`,
    status: section.status || 'active',
    visibility,
    area,
    public: visibility === 'public' ? true : Boolean(section.public),
    adminOnly: visibility === 'admin' || Boolean(section.adminOnly),
    requiresApprovedUser: visibility === 'president' || Boolean(section.requiresApprovedUser),
    nav,
    dashboardCard
  };
}

function createUnifiedSectionRegistryV480(definition = {}) {
  const removedPages = definition.removedPages || {};
  const sections = (definition.sections || []).map(normalizeSectionV480);
  const pages = Object.fromEntries(sections.map((section) => [section.id, freezeDeepV480({ ...section })]));
  const defaultPage = normalizeKeyV480(definition.defaultPage) || 'dashboard';
  const registry = {
    engineVersion: ENGINE_VERSION_V480,
    version: definition.version || ENGINE_VERSION_V480,
    updatedAt: definition.updatedAt || '2026-06-24',
    leagueId: definition.leagueId || 'unknown',
    defaultPage,
    removedPages: freezeDeepV480({ ...removedPages }),
    pages: freezeDeepV480(pages),
    getPage(pageName) {
      return this.pages[normalizeKeyV480(pageName)] || null;
    },
    isKnownPage(pageName) {
      return Boolean(this.getPage(pageName));
    },
    normalizePage(pageName) {
      const key = normalizeKeyV480(pageName) || this.defaultPage;
      if (this.removedPages[key]?.fallback) return this.removedPages[key].fallback;
      return this.isKnownPage(key) ? key : this.defaultPage;
    },
    isAdminOnlyPage(pageName) {
      return Boolean(this.getPage(pageName)?.adminOnly);
    },
    requiresApprovedUserPage(pageName) {
      return Boolean(this.getPage(pageName)?.requiresApprovedUser);
    },
    listPages(filter = {}) {
      return Object.values(this.pages)
        .filter((page) => !filter.area || page.area === filter.area)
        .filter((page) => !filter.visibility || page.visibility === filter.visibility)
        .filter((page) => filter.status ? page.status === filter.status : true)
        .sort((a, b) => (a.nav?.order || 999) - (b.nav?.order || 999) || a.label.localeCompare(b.label));
    },
    listNavItems(kind = 'desktop') {
      const key = kind === 'mobilePrimary' ? 'mobilePrimary' : kind === 'mobileMore' ? 'mobileMore' : 'desktop';
      return this.listPages({ status: 'active' }).filter((page) => Boolean(page.nav?.[key]));
    },
    listDashboardCards(audience = '') {
      return this.listPages({ status: 'active' })
        .filter((page) => page.dashboardCard?.enabled)
        .filter((page) => !audience || page.dashboardCard?.audience === audience || page.visibility === audience)
        .sort((a, b) => (a.dashboardCard?.order || 999) - (b.dashboardCard?.order || 999));
    },
    canShowPage(pageName, context = {}) {
      const page = this.getPage(pageName);
      if (!page) return false;
      if (page.adminOnly) return Boolean(context.isAdmin);
      if (page.requiresApprovedUser) return Boolean(context.isApprovedTeamUser);
      return page.status === 'active';
    }
  };
  return freezeDeepV480(registry);
}

function installUnifiedSectionRegistryV480(registry, aliases = []) {
  if (typeof window === 'undefined') return registry;
  window.FantaLeagueSectionRegistryV480 = registry;
  aliases.filter(Boolean).forEach((alias) => {
    window[alias] = registry;
  });
  try {
    if (typeof document !== 'undefined') {
      document.dispatchEvent(new CustomEvent('fanta-section-registry-ready-v480', { detail: { registry, aliases, engineVersion: registry?.engineVersion || ENGINE_VERSION_V480 } }));
    }
  } catch (error) {
    console.warn('Unified section registry V480 installed without ready event.', error);
  }
  return registry;
}

export { ENGINE_VERSION_V480, createUnifiedSectionRegistryV480, installUnifiedSectionRegistryV480 };
