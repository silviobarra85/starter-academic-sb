# V506 - Tool/form validators comuni

La V506 centralizza in `fanta-engine` i validatori puri per form e tool.

## File principali

- `static/fanta-engine/js/core/form-validators-v506.js`
- `static/fanta-engine/data/form-validators-v506.json`
- `static/fanta-engine/js/tools/matchday-draw-engine-v506.js`

## Funzioni comuni

- normalizzazione testo
- parsing interi
- clamp range numerici
- parsing liste e range tipo `1,2,5-8`
- validazione required
- validazione range numerici
- summary errori
- escape HTML

## Primo consumer

Il primo consumer runtime e' il Sorteggio giornate. I wrapper locali restano in `assets/js/sections/matchday-draw-tool-v473.js` e importano il motore comune V506. Se il motore comune non carica, resta attivo il fallback locale V473.

## Guardrail

La V506 non modifica Firebase, EmailJS, Admin, Dashboard Presidente, dati, rules, news, regolamenti, bilanci, listoni o calciomercato. Non cancella fallback locali.
