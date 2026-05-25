# REFACTOR V207 - Hotfix avvio Fantamercato

## Obiettivo
Correggere il blocco di avvio introdotto dalle patch live V205/V206.

## Problema
La console mostrava:

```text
Uncaught TypeError: Assignment to constant variable.
```

La causa era una riassegnazione di `getActiveTransferListingsV119`, che nel codice nasce da una destructuring `const` degli helper Fantamercato. In un modulo JS quel binding non può essere riassegnato e l'errore interrompe tutto il bootstrap del sito.

## Modifica
Rimosso il blocco che sovrascriveva `getActiveTransferListingsV119`. Il caricamento dati live resta non bloccante:

- JSON/snapshot renderizzano per primi;
- comunicati live Firebase vengono aggiornati in background;
- Fantamercato resta lazy/live quando si apre Mercato o Dashboard Presidente;
- nessuna nuova lettura Firebase all'avvio pubblico oltre a quelle già previste.

## File modificati

```text
static/zonaorientale/index.html
static/zonaorientale/assets/app.js
```

## Test

```bash
node --check static/zonaorientale/assets/app.js
find static/zonaorientale/assets -type f -name '*.js' -print0 | xargs -0 -n 1 node --check
```
