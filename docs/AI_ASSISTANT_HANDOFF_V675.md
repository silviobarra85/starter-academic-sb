# AI Assistant Handoff V675

## Stato

Patch solo sito. ioSudo e dataset non vengono modificati.

## Obiettivo

Allineare il renderer mobile del Listone allo stile delle card Rose ispezionate dall'utente. Le card Listone ora usano la stessa griglia di classi delle card Rose V668 e lo stato e' mostrato come badge in alto a destra.

## File principali

- `static/zonaorientale/assets/app.js`
- `static/fantapetillomantramanager/assets/app.js`
- `static/fanta-engine/css/site-performance-v675.css`
- `static/zonaorientale/index.html`
- `static/fantapetillomantramanager/index.html`

## Note operative

Non reinserire runtime di rimozione di `td.fpt-v584-col-player`: dopo V672 il comportamento legacy e' stato mantenuto per stabilita'. La correzione V675 lavora sul renderer della card, non sulla cella legacy.
