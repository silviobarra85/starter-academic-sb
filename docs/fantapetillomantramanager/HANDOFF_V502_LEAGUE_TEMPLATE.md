# Handoff V502 - Template nuova lega (FantaMantraManager)

La V502 aggiunge un template comune per generare nuove leghe senza duplicare manualmente `fantapetillomantramanager`.

## Impatto su questa lega

- currentVersion aggiornata a V502;
- footer/cache-buster aggiornati a V502;
- nessun cambio a dati, Firebase, EmailJS, Admin, Presidente, news, regolamenti, bilanci, listoni o calciomercato;
- fallback locali preservati;
- `static/zonaorientale/static` e `static/static` devono restare assenti.

## File comuni aggiunti

- `static/_league-template/`
- `static/fanta-engine/tools/create-league-v502.mjs`
- `static/fanta-engine/data/league-template-v502.json`

## Verifica manuale

Aprire le pagine principali e verificare footer V502, assenza errori console e nessuna contaminazione con l'altra lega.
