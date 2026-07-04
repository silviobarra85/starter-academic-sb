const ENGINE_CANDIDATES_V480 = [
  '../../../../fanta-engine/js/core/unified-section-registry-v480.js',
  '../../../../../fanta-engine/js/core/unified-section-registry-v480.js'
];

async function loadSectionEngineV480() {
  let lastError = null;
  for (const candidate of ENGINE_CANDIDATES_V480) {
    try {
      return await import(new URL(candidate, import.meta.url).href);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('Motore sezioni V480 non disponibile.');
}

const { createUnifiedSectionRegistryV480, installUnifiedSectionRegistryV480 } = await loadSectionEngineV480();

const FANTA_MANTRA_SECTIONS_V480 = [
  { id: 'dashboard', label: 'Dashboard', visibility: 'public', area: 'public', source: 'index.html', nav: { order: 10, desktop: true, mobilePrimary: true, label: 'Dashboard', icon: 'home' } },
  { id: 'news', label: 'News', visibility: 'public', area: 'public', source: 'index.html + news.html + comunicati statici', nav: { order: 20, desktop: true, mobileMore: true, icon: 'news' } },
  { id: 'clubs', label: 'Rose', visibility: 'public', area: 'public', source: 'index.html', nav: { order: 30, desktop: true, mobileMore: true, icon: 'teams' } },
  { id: 'bilanci', label: 'Bilanci squadre', visibility: 'public', area: 'public', source: 'assets/js/sections/bilanci-snapshot-section-v435.js + assets/snapshots/seasons/*.json', extractedIn: 'V435', nav: { order: 40, desktop: true, mobileMore: true, label: 'Bilanci', icon: 'fm' } },
  { id: 'fantamercato', label: 'Fantamercato', visibility: 'public', area: 'public', source: 'index.html', nav: { order: 50, desktop: true, mobilePrimary: true, mobileMore: true, icon: 'market' } },
  { id: 'calciomercato', label: 'Calciomercato', visibility: 'public', area: 'public', source: 'index.html', nav: { order: 60, desktop: true, mobileMore: true, icon: 'news' } },
  { id: 'listone', label: 'Listone', visibility: 'public', area: 'public', source: 'index.html', nav: { order: 70, desktop: true, mobileMore: true, icon: 'list' } },
  { id: 'competitions', label: 'Competizioni', visibility: 'public', area: 'public', source: 'index.html + competition.html', nav: { order: 80, desktop: true, mobilePrimary: true, label: 'Competizioni', icon: 'trophy' } },
  { id: 'honor', label: "Albo d'Oro e FIFA Ranking", visibility: 'public', area: 'public', source: 'index.html', nav: { order: 90, desktop: true, mobileMore: true, icon: 'honor' } },
  { id: 'stats', label: 'Statistiche', visibility: 'public', area: 'public', source: 'assets/js/sections/stats-section-v404.js', extractedIn: 'V404', nav: { order: 100, desktop: true, mobileMore: true, icon: 'stats' } },
  { id: 'archive', label: 'Archivio', visibility: 'public', area: 'public', source: 'assets/js/sections/archive-section-v405.js', extractedIn: 'V405', nav: { order: 110, desktop: true, mobileMore: true, icon: 'archive' } },
  { id: 'compare', label: 'Confronta', visibility: 'public', area: 'public', source: 'assets/js/sections/compare-section-v403.js', extractedIn: 'V403', nav: { order: 120, desktop: true, mobileMore: true, icon: 'compare' } },
  { id: 'sorteggio', label: 'Sorteggio giornate', visibility: 'public', area: 'public', source: 'fanta-engine/js/tools/matchday-draw-engine-v501.js + wrapper locale V473 + index.html', addedIn: 'V473', nav: { order: 130, desktop: true, mobileMore: true, icon: 'dice' } },
  { id: 'regolamento', label: 'Regolamento', visibility: 'public', area: 'public', source: 'assets/js/sections/regolamento-section-v402.js', extractedIn: 'V402', nav: { order: 140, desktop: true, mobileMore: true, icon: 'rules' } },
  { id: 'admin', label: 'Admin', visibility: 'admin', area: 'admin', source: 'index.html', nav: { order: 900, desktop: true, mobileMore: true, icon: 'admin' } },
  { id: 'teamarea', label: 'Area squadra', visibility: 'president', area: 'presidents', source: 'dynamic-v34/v476', entrypointUnlockedIn: 'V476', nav: { order: 45, desktop: true, mobilePrimary: true, mobileMore: false, label: 'Area squadra', icon: 'team' }, dashboardCard: { enabled: true, order: 10, title: 'Area squadra', description: 'Richieste operative e strumenti presidente.', audience: 'president' } },
  { id: 'ruleproposals', label: 'Proposte regolamento', visibility: 'president', area: 'presidents', source: 'dynamic-v479', addedIn: 'V479', nav: { order: 46, desktop: false, mobileMore: false, icon: 'rules' }, dashboardCard: { enabled: true, order: 20, title: 'Proposte regolamento', description: 'Proponi nuove regole, modifiche o chiarimenti.', audience: 'president' } },
  { id: 'teamprofile', label: 'Scheda squadra', visibility: 'public', area: 'public', source: 'dynamic', nav: { order: 950, desktop: false, mobileMore: false, icon: 'team' } }
];

const SECTION_REGISTRY_V405 = createUnifiedSectionRegistryV480({
  version: 'V480',
  updatedAt: '2026-06-24',
  leagueId: 'fantapetillomantramanager',
  defaultPage: 'dashboard',
  removedPages: {
    soccerdata: { fallback: 'listone', removedIn: 'V398', reason: 'Sezione rimossa/inattiva per non affidabilita dei provider dati disponibili.' },
    finance: { fallback: 'regolamento', removedIn: 'V402', reason: 'Vecchio alias della pagina regolamento.' }
  },
  sections: FANTA_MANTRA_SECTIONS_V480
});

function getSectionPageV405(pageName) { return SECTION_REGISTRY_V405.getPage(pageName); }
function isKnownSectionPageV405(pageName) { return SECTION_REGISTRY_V405.isKnownPage(pageName); }
function normalizeSectionPageV405(pageName) { return SECTION_REGISTRY_V405.normalizePage(pageName); }
function isAdminOnlySectionPageV405(pageName) { return SECTION_REGISTRY_V405.isAdminOnlyPage(pageName); }
function listSectionPagesV405(filter = {}) { return SECTION_REGISTRY_V405.listPages(filter); }

const FANTA_MANTRA_SECTION_REGISTRY_V480_EXPORT = Object.freeze({
  ...SECTION_REGISTRY_V405,
  getPage: getSectionPageV405,
  isKnownPage: isKnownSectionPageV405,
  normalizePage: normalizeSectionPageV405,
  isAdminOnlyPage: isAdminOnlySectionPageV405,
  listPages: listSectionPagesV405,
  listNavItems: SECTION_REGISTRY_V405.listNavItems.bind(SECTION_REGISTRY_V405),
  listDashboardCards: SECTION_REGISTRY_V405.listDashboardCards.bind(SECTION_REGISTRY_V405),
  canShowPage: SECTION_REGISTRY_V405.canShowPage.bind(SECTION_REGISTRY_V405)
});

installUnifiedSectionRegistryV480(FANTA_MANTRA_SECTION_REGISTRY_V480_EXPORT, [
  'FantaMantraManagerSectionRegistryV480',
  'FantaPetilloSectionRegistryV480',
  'FantaPetilloSectionRegistryV405',
  'FantaPetilloSectionRegistryV404',
  'FantaPetilloSectionRegistryV403',
  'FantaPetilloSectionRegistryV402',
  'FantaPetilloSectionRegistryV401'
]);

export { FANTA_MANTRA_SECTION_REGISTRY_V480_EXPORT as SECTION_REGISTRY_V405 };
