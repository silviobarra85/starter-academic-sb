# AI Assistant Handoff V664

Overlay solo sito. Non tocca ioSudo e non modifica dataset.

## Cosa preservare

- ioSudo resta invariato.
- `Per i SUDATORI` pubblico resta disattivato.
- Le tabelle desktop restano tabelle.
- Su mobile Listone/Rose usano card progressive con filtri attivi.

## Modifiche V664

- Card mobile Listone: niente duplicazione squadra.
- Card mobile Tutte le Rose: niente duplicazione ruolo/squadra.
- Contenitore card neutro, non verde.
- Card colorate per ruolo.
- Colonna/listone `Modifica`: su mobile non mostra piu' etichetta + valore, ma badge compatto in basso a destra.
- Scheda/profilo squadra: la sezione Rosa usa le stesse card mobile.
- Footer index aggiornato a V664.

## File modificati

- `static/zonaorientale/assets/app.js`
- `static/fantapetillomantramanager/assets/app.js`
- `static/zonaorientale/index.html`
- `static/fantapetillomantramanager/index.html`
- `static/fanta-engine/css/site-performance-v664.css`
- `static/fanta-engine/tools/audit-site-mobile-cards-v664.mjs`
