const COMPARE_SECTION_HTML_V403 = `    <section class="app-page" data-page="compare" aria-labelledby="compareTitle">
      <div class="page-heading">
        <div>
          <p class="eyebrow">Head to head</p>
          <h2 id="compareTitle">Confronta squadre</h2>
          <p>Seleziona due club e confronta storia, titoli, podi, ranking FIFA e scontri diretti usando i dati gia' caricati da JSON e snapshot.</p>
        </div>
      </div>

      <section class="single-panel-layout team-compare-page-v195">
        <article class="panel team-compare-panel-v195">
          <div class="panel-header compact">
            <div>
              <h2>Confronto storico</h2>
              <p>Nessuna lettura Firebase extra: il confronto usa Albo, squadre stagione, ranking e partite gia' presenti nello stato del sito.</p>
            </div>
          </div>
          <div id="teamCompareControlsV195" class="team-compare-controls-v195">
            <p class="muted">Caricamento squadre...</p>
          </div>
          <div id="teamCompareContentV195" class="team-compare-content-v195">
            <p class="muted">Seleziona due squadre per iniziare il confronto.</p>
          </div>
        </article>
      </section>
    </section>
`;

function mountCompareSectionV403() {
  const host = document.querySelector('[data-page="compare"][data-section-template="compare-v403"]');
  if (!host) return false;
  if (host.dataset.sectionMounted === 'compare-v403') return true;
  host.outerHTML = COMPARE_SECTION_HTML_V403;
  const mounted = document.querySelector('[data-page="compare"]');
  if (mounted) mounted.dataset.sectionMounted = 'compare-v403';
  return Boolean(mounted);
}

mountCompareSectionV403();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountCompareSectionV403, { once: true });
} else {
  window.setTimeout(mountCompareSectionV403, 0);
}

window.ZonaOrientaleCompareSectionV403 = Object.freeze({
  version: 'V403',
  template: 'compare-v403',
  mount: mountCompareSectionV403
});
