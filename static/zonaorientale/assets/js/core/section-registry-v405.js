const SECTION_REGISTRY_V405 = Object.freeze({
  version: 'V405',
  updatedAt: '2026-06-06',
  defaultPage: 'dashboard',
  removedPages: Object.freeze({
    soccerdata: Object.freeze({ fallback: 'listone', removedIn: 'V398', reason: 'Sezione rimossa/inattiva per non affidabilita dei provider dati disponibili.' })
  }),
  pages: Object.freeze({
    dashboard: Object.freeze({ label: 'Dashboard', public: true, source: 'index.html', status: 'active', area: 'public' }),
    news: Object.freeze({ label: 'News', public: true, source: 'index.html + news.html + comunicati statici', status: 'active', area: 'public' }),
    clubs: Object.freeze({ label: 'Rose', public: true, source: 'index.html', status: 'active', area: 'public' }),
    bilanci: Object.freeze({ label: 'Bilanci squadre', public: true, source: 'assets/js/sections/bilanci-snapshot-section-v435.js + assets/snapshots/seasons/*.json', status: 'active', area: 'public', extractedIn: 'V435' }),
    fantamercato: Object.freeze({ label: 'Fantamercato', public: true, source: 'index.html', status: 'active', area: 'presidents' }),
    calciomercato: Object.freeze({ label: 'Calciomercato', public: true, source: 'index.html', status: 'active', area: 'public' }),
    listone: Object.freeze({ label: 'Listone', public: true, source: 'index.html', status: 'active', area: 'public' }),
    competitions: Object.freeze({ label: 'Competizioni', public: true, source: 'index.html + competition.html', status: 'active', area: 'public' }),
    honor: Object.freeze({ label: "Albo d'Oro e FIFA Ranking", public: true, source: 'index.html', status: 'active', area: 'public' }),
    stats: Object.freeze({ label: 'Statistiche', public: true, source: 'assets/js/sections/stats-section-v404.js', status: 'active', area: 'public', extractedIn: 'V404' }),
    archive: Object.freeze({ label: 'Archivio', public: true, source: 'assets/js/sections/archive-section-v405.js', status: 'active', area: 'public', extractedIn: 'V405' }),
    compare: Object.freeze({ label: 'Confronta', public: true, source: 'assets/js/sections/compare-section-v403.js', status: 'active', area: 'public', extractedIn: 'V403' }),
    regolamento: Object.freeze({ label: 'Regolamento', public: true, source: 'assets/js/sections/regolamento-section-v402.js', status: 'active', area: 'public', extractedIn: 'V402' }),
    admin: Object.freeze({ label: 'Admin', public: false, adminOnly: true, source: 'index.html', status: 'active', area: 'admin' }),
    teamarea: Object.freeze({ label: 'Area squadra', public: false, requiresApprovedUser: true, source: 'dynamic', status: 'active', area: 'presidents' }),
    teamprofile: Object.freeze({ label: 'Scheda squadra', public: true, source: 'dynamic', status: 'active', area: 'public' })
  })
});

function getSectionPageV405(pageName) {
  const key = String(pageName || '').replace(/^#/, '').trim();
  return SECTION_REGISTRY_V405.pages[key] || null;
}

function isKnownSectionPageV405(pageName) {
  return Boolean(getSectionPageV405(pageName));
}

function normalizeSectionPageV405(pageName) {
  const key = String(pageName || '').replace(/^#/, '').trim() || SECTION_REGISTRY_V405.defaultPage;
  if (SECTION_REGISTRY_V405.removedPages[key]) return SECTION_REGISTRY_V405.removedPages[key].fallback;
  return isKnownSectionPageV405(key) ? key : SECTION_REGISTRY_V405.defaultPage;
}

function isAdminOnlySectionPageV405(pageName) {
  return Boolean(getSectionPageV405(pageName)?.adminOnly);
}

function listSectionPagesV405() {
  return Object.entries(SECTION_REGISTRY_V405.pages).map(([id, meta]) => ({ id, ...meta }));
}

const ZONA_ORIENTALE_SECTION_REGISTRY_V405_EXPORT = Object.freeze({
  ...SECTION_REGISTRY_V405,
  getPage: getSectionPageV405,
  isKnownPage: isKnownSectionPageV405,
  normalizePage: normalizeSectionPageV405,
  isAdminOnlyPage: isAdminOnlySectionPageV405,
  listPages: listSectionPagesV405
});

window.ZonaOrientaleSectionRegistryV405 = ZONA_ORIENTALE_SECTION_REGISTRY_V405_EXPORT;
window.ZonaOrientaleSectionRegistryV404 = ZONA_ORIENTALE_SECTION_REGISTRY_V405_EXPORT;
window.ZonaOrientaleSectionRegistryV403 = ZONA_ORIENTALE_SECTION_REGISTRY_V405_EXPORT;
window.ZonaOrientaleSectionRegistryV402 = ZONA_ORIENTALE_SECTION_REGISTRY_V405_EXPORT;
window.ZonaOrientaleSectionRegistryV401 = ZONA_ORIENTALE_SECTION_REGISTRY_V405_EXPORT;
