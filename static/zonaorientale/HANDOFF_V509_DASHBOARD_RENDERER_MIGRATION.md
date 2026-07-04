# Handoff V509 - Dashboard renderer migration

## Sintesi

V509 centralizza un ulteriore blocco Dashboard in fanta-engine senza cambiare dati o ruoli.

## Modifiche

- Aggiunto dashboard-renderer-helpers-v509.js.
- Aggiunto manifest dashboard-renderer-migration-v509.json.
- renderAdminPanel usa renderAdminCollapsiblePanelV509.
- renderPresidentDashboardMetricV369 usa renderPresidentDashboardMetricV509.
- Aggiornati footer/cache-buster/config a V509.
- Aggiornato docs/OVERLAY_ROADMAP.md.

## Guardrail

- Nessuna modifica Firebase.
- Nessuna modifica EmailJS.
- Nessuna modifica rules.
- Nessuna cancellazione fallback locali.
- static/zonaorientale/static e static/static devono restare assenti.
