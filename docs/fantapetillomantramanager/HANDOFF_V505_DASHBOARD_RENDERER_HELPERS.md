# Handoff V505 - Dashboard renderer helpers comuni

## Sintesi

La V505 introduce `dashboard-renderer-helpers-v505.js` in `fanta-engine` e usa il renderer comune per la shell dei pannelli Admin collassabili di FantaMantraManager.

## File runtime toccati

- `static/fantapetillomantramanager/assets/app.js`
- `static/fantapetillomantramanager/assets/league-config.json`
- `static/fantapetillomantramanager/assets/js/core/league-config-v443.js`
- pagine HTML principali per footer/cache-buster V505

## Funzionalita' preservate

- Firebase invariato.
- EmailJS invariato.
- Dati/listoni/calciomercato invariati.
- Admin handlers invariati.
- Dashboard Presidente preservata dove presente.
- Nessuna cancellazione di fallback locali.

## Audit

Da `static`:

```bash
node fanta-engine/tools/audit-dashboard-renderer-helpers-v505.mjs
node fanta-engine/tools/audit-runtime-regression-v505.mjs
node fanta-engine/tools/audit-multileague-contamination-v505.mjs
```

## Verifica manuale

- aprire home e area Admin;
- verificare che i pannelli Admin si aprano/riducano;
- controllare console browser;
- verificare footer V505;
- verificare assenza contaminazioni tra leghe.
