# AI Handoff ZonaOrientale - V218

## Obiettivo

Uniformare la UI mobile e ripristinare il rendering delle pagine storiche pubbliche:

- pulsante "Su" unico e più curato su tutte le pagine, visibile solo da smartphone dopo scroll verso il basso;
- bottom menu visibile solo da smartphone, non da desktop o pagine desktop/touch;
- caricamento dati per Archivio, Statistiche e Confronta.

## Causa dei problemi

### Bottom menu su desktop

`competition.html` partiva con:

```html
<body class="is-mobile-ux competition-detail-page-v162">
```

Questa classe forzava il layout mobile anche su desktop. Inoltre alcune regole CSS legacy mostravano `.mobile-bottom-nav` appena `body.is-mobile-ux` era presente. V218 rimuove la classe iniziale dalla pagina competizione e aggiunge guard CSS/JS basati sul viewport: mobile solo con larghezza `<= 900px`.

### Archivio, Statistiche e Confronta vuoti

Il modulo V211 `historical-stats-compare-v211.js` era importato da `app.js`, ma non veniva installato. Di conseguenza i contenitori `historicalStatsContentV193` e `teamCompareContentV195` restavano con lo stato di caricamento.

Per Archivio, il refactor V209 esponeva il renderer ma non veniva richiamato esplicitamente nel ciclo finale `renderAll()` dopo il caricamento dati.

## Modifiche V218

- Installato realmente `installHistoricalStatsCompareRefactorV211()` in `assets/app.js`.
- Agganciato `renderAll()` per richiamare:
  - `historicalStatsCompareV218.renderAllSurfaces()`;
  - `renderSeasonArchiveV196()`.
- Aggiunte le route `stats`, `archive`, `compare` alla lista hash statici, così non vengono interpretate come slug squadra.
- Aggiunto pulsante globale `#globalScrollTopBtnV218` con classe `.zo-scroll-top-v218`.
- Rimosso il vecchio tasto `listoneScrollTopBtnV175` dalla pagina Listone.
- Sostituito il vecchio `competitionScrollTopBtnV166` in `competition.html`.
- Aggiunto il tasto anche in `player.html`.
- `competition.html` ora calcola `is-mobile-ux` a runtime e solo su smartphone.
- `assets/js/mobile/mobile-viewport.js` ora assegna `is-mobile-ux` solo se `window.innerWidth <= 900`, evitando desktop touch/laptop convertibili.
- Aggiunti override CSS finali in `styles.css` e `mobile-suite-v168.css` per nascondere bottom menu, more sheet, backdrop e pulsante Su da desktop.
- Aggiornati cache-buster e footer a `v=218`.

## File modificati

- `zonaorientale/index.html`
- `zonaorientale/competition.html`
- `zonaorientale/player.html`
- `zonaorientale/assets/app.js`
- `zonaorientale/assets/styles.css`
- `zonaorientale/assets/css/mobile-suite-v168.css`
- `zonaorientale/assets/js/mobile/mobile-viewport.js`
- `docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_CURRENT.md`
- `docs/zonaorientale/AI_HANDOFF_ZONAORIENTALE_V218.md`
- `docs/zonaorientale/REFACTOR_V218.md`

## Test manuali consigliati

1. Desktop: aprire Dashboard, Competizioni e una competizione singola. Il bottom menu non deve comparire.
2. Smartphone: aprire varie sezioni, scorrere verso il basso e verificare che il pulsante "Su" appaia; toccandolo deve tornare in cima.
3. Smartphone: in cima pagina il pulsante "Su" deve sparire.
4. Aprire `#stats`: le statistiche storiche devono popolarsi.
5. Aprire `#archive`: l'Archivio stagioni deve mostrare controlli e contenuti.
6. Aprire `#compare`: devono apparire i controlli di confronto e il contenuto tra squadre.
