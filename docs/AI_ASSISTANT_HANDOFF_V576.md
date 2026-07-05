# AI Assistant Handoff - V576

Versione: V576 - Tabelle giocatori mobile specificity fix
Data: 05/07/2026

## Modifica

Corregge la mancata applicazione degli stili mobile a Area Squadra e Rose dopo V574/V575.

## Causa

Regole legacy mobile con `body.is-mobile-ux` e `!important` avevano specificità maggiore rispetto ai selettori V575. Inoltre alcune tabelle Area/Rose ereditavano classi del Listone, rendendo fragile la classificazione solo per classi CSS.

## File principali

- `static/fanta-engine/css/player-tables-mobile-v576.css`
- `static/fanta-engine/js/ui/player-tables-mobile-v576.js`
- `static/fanta-engine/tools/audit-player-tables-mobile-v576.mjs`
- `static/zonaorientale/index.html`
- `static/fantapetillomantramanager/index.html`

## Funzioni preservate

- Calciomercato resta disattivato.
- Svincola Giocatori resta attivo in ZonaOrientale.
- Link giocatore invariati.
- Firebase, EmailJS, Admin, Presidente e snapshot invariati.
- Resize colonne V570/V571 resta non caricato.

## Test

Eseguire:

```bash
node static/fanta-engine/tools/audit-player-tables-mobile-v576.mjs
node --check static/fanta-engine/js/ui/player-tables-mobile-v576.js
```
