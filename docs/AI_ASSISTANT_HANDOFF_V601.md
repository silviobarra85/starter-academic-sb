# AI Assistant Handoff - V601 Sudatori

Versione corrente: **V601**.

## Stato

Overlay applica il nuovo Excel `fantacalcio_serie_a_2026_27_aggiornato_raduni_rumors_2026-07-11(1).xlsx` alla sezione **Per i SUDATORI**.

## Dati principali

- `playersByTeam`: rigenerato dal foglio `Rose`;
- `friendliesByTeam`: rigenerato dal foglio `Ritiri_Amichevoli`;
- `formationsByTeam`: rigenerato dal foglio `Probabili_Formazioni`;
- `teamTransferTalksByTeam`: rigenerato da `Trattative_Squadre_11_07`;
- `transfermarktRumors`: popolato da `Rumors_TM_11_07`;
- `injuriesByTeam`: mantenuto da `Infortunati_10_07`.

## Verifiche attese

```bash
node static/fanta-engine/tools/audit-sudatori-section-v601.mjs
node --check static/fanta-engine/js/sections/sudatori-section-v601.js
```

## Nota futura

Per successivi aggiornamenti Excel, rigenerare sempre `sudatori-data.json`, aggiornare `manifest.json`, creare audit dedicato e mantenere i fix UI introdotti in V598.
