# Handoff nuovo assistente - V373

Versione corrente: V373 Soccer Data FBref batch-01.

## Stato

La sezione Soccer Data e additiva e read-only. Mostra solo i giocatori con `statusCode: IN_LISTONE` e usa mapping statici in `assets/soccer-data`.

## File chiave

- `assets/soccer-data/manifest.json`
- `assets/soccer-data/fbref-player-map.v373.json`
- `assets/soccer-data/fbref-player-map.v373.csv`
- `assets/soccer-data/fbref-review-batch.v373.csv`
- `tools/audit-soccer-data-fbref-batch-v373.mjs`

## Prossimo passo consigliato

V374: continuare con `batch-02`, sempre a piccoli gruppi e lasciando `needs-review` sui casi dubbi.

## Vincoli permanenti

- Non recuperare FBref live dal browser.
- Non includere asteriscati.
- Non cambiare schema Firebase.
- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` salvo richiesta esplicita.
- Prima di ogni modifica verificare che non si perdano funzionalita esistenti.
