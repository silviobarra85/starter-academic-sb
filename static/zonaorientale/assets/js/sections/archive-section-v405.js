const ARCHIVE_SECTION_HTML_V405 = `    <section class="app-page" data-page="archive" aria-labelledby="archiveTitle">
      <div class="page-heading">
        <div>
          <p class="eyebrow">Archivio storico</p>
          <h2 id="archiveTitle">Archivio stagioni</h2>
          <p>Consulta una stagione completa: squadre, competizioni, albo, partite recenti, rose e movimenti usando dati gia' caricati da JSON/snapshot.</p>
        </div>
      </div>

      <section class="single-panel-layout season-archive-page-v196">
        <article class="panel season-archive-panel-v196">
          <div class="panel-header compact">
            <div>
              <h2>Esplora stagione</h2>
              <p>Seleziona una stagione per aprire una scheda storica completa, ottimizzata anche da mobile.</p>
            </div>
          </div>
          <div id="seasonArchiveControlsV196" class="season-archive-controls-v196">
            <p class="muted">Caricamento stagioni...</p>
          </div>
          <div id="seasonArchiveContentV196" class="season-archive-content-v196">
            <p class="muted">Seleziona una stagione per consultare l'archivio.</p>
          </div>
        </article>
      </section>
    </section>
`;

function mountArchiveSectionV405() {
  const host = document.querySelector('[data-page="archive"][data-section-template="archive-v405"]');
  if (!host) return false;
  if (host.dataset.sectionMounted === 'archive-v405') return true;
  host.outerHTML = ARCHIVE_SECTION_HTML_V405;
  const mounted = document.querySelector('[data-page="archive"]');
  if (mounted) mounted.dataset.sectionMounted = 'archive-v405';
  return Boolean(mounted);
}

mountArchiveSectionV405();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountArchiveSectionV405, { once: true });
} else {
  window.setTimeout(mountArchiveSectionV405, 0);
}

window.ZonaOrientaleArchiveSectionV405 = Object.freeze({
  version: 'V405',
  template: 'archive-v405',
  mount: mountArchiveSectionV405
});
