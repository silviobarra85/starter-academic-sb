# Handoff nuovo assistente - V374

Versione runtime: V374

## Stato Soccer Data

La sezione Soccer Data e attiva e protetta. Mostra solo giocatori con `statusCode: IN_LISTONE` dal listone `2026-06-04`.

## Mapping FBref

- Mapping corrente: `assets/soccer-data/fbref-player-map.v374.json`
- Giocatori attivi: 532
- Asteriscati esclusi: 131
- Mapping confermati: 100
- Batch completati: batch-01, batch-02
- Prossimo batch suggerito: batch-03

## Vincoli

- Non fare scraping live dal browser.
- Non scrivere su Firebase.
- Non includere asteriscati nella sezione Soccer Data.
- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` salvo richiesta esplicita.
- Ogni nuovo batch deve mantenere e verificare i marker V371/V372/V373/V374.

## Audit principale

```bash
node static/zonaorientale/tools/audit-soccer-data-fbref-batch-v374.mjs
bash static/zonaorientale/tools/check-zonaorientale.sh
```
