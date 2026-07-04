# Dashboard renderer migration V509

La V509 prosegue la centralizzazione delle funzionalita comuni in fanta-engine.

## File nuovi

- static/fanta-engine/js/ui/dashboard-renderer-helpers-v509.js
- static/fanta-engine/data/dashboard-renderer-migration-v509.json
- static/fanta-engine/tools/audit-dashboard-renderer-migration-v509.mjs

## Migrazione effettuata

- I pannelli Admin collassabili passano dal wrapper locale al renderer comune V509.
- Le metriche della Dashboard Presidente passano al renderer comune V509.
- I renderer locali restano presenti: la migrazione e graduale e reversibile.

## Cosa non cambia

- Firebase non cambia.
- EmailJS non cambia.
- Le rules non cambiano.
- La visibilita Admin/Presidente non cambia.
- Nessun DOM viene cancellato dal renderer V509.
- Proposte regolamento, Svincola Giocatori e Comunicato avvenuto scambio sono preservati.

## Prossimo passo

V510 deve produrre il report di centralizzazione e la checklist pre-merge.
