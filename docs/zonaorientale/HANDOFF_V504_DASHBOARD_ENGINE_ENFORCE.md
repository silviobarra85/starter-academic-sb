# Handoff V504 - Dashboard cards safe-enforce - ZonaOrientale

## Sintesi

V504 collega ZonaOrientale al motore comune `dashboard-cards-engine-v504.js` in modalita' `safe-enforce`.

## Preservato

- Nessuna migrazione Firebase.
- Nessuna modifica EmailJS.
- Nessuna modifica a dati, rules, news, regolamenti, bilanci, listoni o calciomercato.
- Nessuna cancellazione di fallback locali.
- `static/zonaorientale/static` e `static/static` restano assenti.

## Verifiche

Da `static`:

```bash
node fanta-engine/tools/audit-dashboard-engine-enforce-v504.mjs
node fanta-engine/tools/audit-runtime-regression-v504.mjs
node fanta-engine/tools/audit-multileague-contamination-v504.mjs
```

## Manuale

Verificare login/admin/presidente e che le card visibili siano coerenti con il ruolo.
