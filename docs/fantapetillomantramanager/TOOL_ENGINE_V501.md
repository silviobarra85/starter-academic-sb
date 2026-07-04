# Tool engine V501 - FantaMantraManager

La V501 centralizza il primo tool comune in `static/fanta-engine`: il Sorteggio giornate.

## File centrali

```text
static/fanta-engine/js/tools/matchday-draw-engine-v501.js
static/fanta-engine/data/tool-engine-v501.json
```

## File locali preservati

```text
static/fantapetillomantramanager/assets/js/sections/matchday-draw-tool-v473.js
static/fantapetillomantramanager/assets/css/matchday-draw-tool-v473.css
```

Il file JS locale ora e un wrapper: prova a caricare il motore comune V501 e, se non disponibile, usa il fallback locale V473.

## Funzionalita preservate

- range giornate 1-38;
- esclusioni singole o range;
- seed riproducibile;
- output JSON;
- copia risultato;
- salvataggio/ripristino localStorage;
- nessuna scrittura Firebase.

## Audit

```bash
cd static
node fanta-engine/tools/audit-tool-engine-v501.mjs
node fanta-engine/tools/audit-runtime-regression-v501.mjs
node fanta-engine/tools/audit-multileague-contamination-v501.mjs
```
