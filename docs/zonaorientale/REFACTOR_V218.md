# Refactor V218 - UI mobile globale e pagine storiche

## Sintesi

V218 risolve due problemi UI e un problema di bootstrap dei refactor storici.

Il pulsante "Su" diventa un componente globale mobile-only: non è più limitato al Listone o alla pagina competizione, compare solo quando l'utente scorre verso il basso e resta nascosto da desktop.

Il bottom menu viene vincolato agli smartphone: le regole CSS e il rilevamento JS non usano più solo `pointer: coarse`, perché laptop/desktop touch potevano ricevere erroneamente la UI mobile.

Le pagine Archivio, Statistiche e Confronta vengono renderizzate nel ciclo finale dopo il caricamento dati.

## Dettagli tecnici

### Pulsante "Su"

Nuovo markup standard:

```html
<button id="globalScrollTopBtnV218" class="zo-scroll-top-v218" type="button" aria-label="Torna in cima alla pagina" aria-hidden="true" tabindex="-1"><span aria-hidden="true">↑</span><strong>Su</strong></button>
```

Comportamento:

- visibile solo con `window.innerWidth <= 900` e `body.is-mobile-ux`;
- appare solo oltre `window.scrollY > 360`;
- usa `window.scrollTo({ top: 0, behavior: "smooth" })`;
- fuori mobile resta `display: none !important`.

### Bottom menu smartphone-only

`assets/js/mobile/mobile-viewport.js` ora usa:

```js
const isMobile = displayMode !== "desktop" && width <= 900;
```

In questo modo desktop touch e finestre larghe non attivano `is-mobile-ux`.

Sono stati aggiunti override finali in `styles.css` e `mobile-suite-v168.css`:

```css
@media (min-width: 901px) {
  .mobile-bottom-nav,
  .mobile-bottom-nav-v141,
  body.is-mobile-ux .mobile-bottom-nav,
  body.is-mobile-ux .mobile-bottom-nav-v141,
  body.competition-detail-page-v162 .mobile-bottom-nav-v141,
  .mobile-more-sheet,
  .mobile-more-backdrop,
  .mobile-page-subnav,
  .zo-scroll-top-v218 {
    display: none !important;
  }
}
```

### Archivio / Statistiche / Confronta

`assets/app.js` ora installa il modulo V211:

```js
const historicalStatsCompareV218 = installHistoricalStatsCompareRefactorV211({...});
historicalStatsCompareV218.injectStyles?.();
```

Poi estende `renderAll()`:

```js
renderAll = function renderAllV218() {
  const result = renderAllBeforeV218?.();
  historicalStatsCompareV218.renderAllSurfaces?.();
  renderSeasonArchiveV196?.();
  setupGlobalScrollTopButtonV218();
  return result;
};
```

Sono state aggiunte anche le route statiche `stats`, `archive`, `compare` alla funzione `isKnownStaticHashV43()`.

## Cache-buster

Aggiornati gli asset HTML principali a `?v=218` e aggiunti cache-buster sugli import modificati:

- `./js/mobile/mobile-viewport.js?v=218`
- `./js/refactor/historical-stats-compare-v211.js?v=218`
- `./js/admin/admin-competitions.js?v=218`
