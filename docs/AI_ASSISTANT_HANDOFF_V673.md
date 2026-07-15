# AI Assistant Handoff V673

## Scopo
Rifinitura sito mobile dopo rollback V672: il Listone mantiene il comportamento legacy stabile, ma le card giocatore del Listone ora seguono organizzazione/stile delle card delle Rose.

## Dettagli tecnici
- `static/fanta-engine/css/site-performance-v673.css`
- `static/zonaorientale/assets/app.js`
- `static/fantapetillomantramanager/assets/app.js`
- `static/*/index.html` aggiorna il CSS da V672 a V673.

Lo stato del giocatore nel Listone non è più dentro una box della griglia: viene renderizzato nel badge in alto a destra tramite `renderSiteListoneStatusBadgeV663`.

## Nota
Non reintrodurre il runtime V671 che rimuoveva `fpt-v584-col-player`: l'utente ha chiesto di mantenere quel comportamento come in V667/V672.
