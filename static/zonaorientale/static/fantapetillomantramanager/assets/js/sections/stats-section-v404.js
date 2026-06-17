const STATS_SECTION_HTML_V404 = `    <section class="app-page" data-page="stats" aria-labelledby="statsTitle">
      <div class="page-heading">
        <div>
          <p class="eyebrow">Hall of Fame</p>
          <h2 id="statsTitle">Statistiche storiche</h2>
          <p>Record, titoli, podi e protagonisti della storia FantaPetillo. Usa solo dati gia' caricati da JSON statici o snapshot, senza letture Firebase aggiuntive.</p>
        </div>
      </div>
      <section class="single-panel-layout historical-stats-page-v193">
        <article class="panel historical-stats-hero-v193">
          <div class="panel-header compact">
            <div>
              <h2>Hall of Fame della Lega</h2>
              <p>Una vista sintetica per consultare la storia della lega da desktop e smartphone.</p>
            </div>
          </div>
          <div id="historicalStatsSummaryV193" class="historical-stats-summary-v193">
            <p class="muted">Caricamento statistiche...</p>
          </div>
        </article>
        <div id="historicalStatsContentV193" class="historical-stats-content-v193">
          <p class="muted">Caricamento statistiche...</p>
        </div>
      </section>
    </section>
`;

function mountStatsSectionV404() {
  const host = document.querySelector('[data-page="stats"][data-section-template="stats-v404"]');
  if (!host) return false;
  if (host.dataset.sectionMounted === 'stats-v404') return true;
  host.outerHTML = STATS_SECTION_HTML_V404;
  const mounted = document.querySelector('[data-page="stats"]');
  if (mounted) mounted.dataset.sectionMounted = 'stats-v404';
  return Boolean(mounted);
}

mountStatsSectionV404();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountStatsSectionV404, { once: true });
} else {
  window.setTimeout(mountStatsSectionV404, 0);
}

window.FantaPetilloStatsSectionV404 = Object.freeze({
  version: 'V404',
  template: 'stats-v404',
  mount: mountStatsSectionV404
});
