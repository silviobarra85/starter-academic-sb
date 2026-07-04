# Handoff V500 - Dashboard cards engine

## Sintesi

La V500 aggiunge il motore comune `dashboard-cards-engine-v500.js` per osservare e marcare le card dashboard usando il registry V497.

## Cosa preserva

- Nessuna modifica ai dati Firebase.
- Nessuna modifica a EmailJS.
- Nessuna rimozione card.
- Nessuna cancellazione fallback locali.
- Nessuna modifica al modello Admin/Presidente.

## Verifiche

Dal path `static`:

```bash
node fanta-engine/tools/audit-dashboard-cards-engine-v500.mjs
node fanta-engine/tools/audit-runtime-regression-v500.mjs
node fanta-engine/tools/audit-multileague-contamination-v500.mjs
```

## Nota

La V500 e' intentionally `observe-first`: prepara la centralizzazione vera delle dashboard, ma non cambia ancora il comportamento visibile.
