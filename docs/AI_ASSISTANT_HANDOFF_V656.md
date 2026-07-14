# AI Assistant Handoff V656

## Stato

V656 e una patch conservativa sopra V655.

## Decisione funzionale

La sezione globale **GIOCATORI** deve restare veloce e contenere solo:

- giocatori gia presenti nelle squadre Serie A;
- giocatori del listone;
- giocatori delle rose fantasy.

I giocatori presenti solo nei rumor restano consultabili in **RUMOR** e **UFFICIALITA**, ma non vengono materializzati nella lista globale **GIOCATORI**.

## Correzione V656

Dentro la scheda di ogni squadra e stato ripristinato il tab **Rosa**, che mostra la rosa squadra con `teamPlayersList(teamId)` e `playerItem`.

## File principali

- `static/iosudo/index.html`
- `static/iosudo/sw.js`
- `static/fanta-engine/js/apps/iosudo-app-v656.js`
- `static/fanta-engine/css/iosudo-app-v656.css`
- `static/fanta-engine/tools/audit-iosudo-v656.mjs`
