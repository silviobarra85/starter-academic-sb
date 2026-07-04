# Dashboard renderer bridge V527

La V527 riprende la roadmap funzionale dopo V526 e prosegue la migrazione graduale dei renderer dashboard verso `fanta-engine`.

## Obiettivo

Spostare nel motore comune una parte non distruttiva della dashboard: la decorazione post-render di metriche e container.

Il bridge V527 non riscrive la dashboard e non sostituisce i renderer locali. Si limita a:

- installare `static/fanta-engine/js/ui/dashboard-renderer-migration-v527.js`;
- decorare i blocchi dashboard gia renderizzati con attributi `data-dashboard-renderer-*`;
- normalizzare la metadata delle metriche pubbliche `metricClubs`, `metricTotalFm`, `metricAlerts` e `metricAlertsReason`;
- produrre un report runtime `window.FantaEngineDashboardRendererMigrationLastReportV527`;
- mantenere compatibili i renderer V505/V509.

## Cosa non cambia

- Nessuna scrittura Firebase.
- Nessuna modifica EmailJS.
- Nessun cambio ruoli Admin/Presidente.
- Nessuna cancellazione di fallback locali.
- Nessuno spostamento fisico dei dati.
- Nessuna modifica a `docs/zonaorientale/FUNZIONALITA'.md`.

## Funzionalita preservate

La V527 e additive-only. Le funzioni locali di rendering dashboard restano presenti e vengono richiamate prima del bridge comune.

Card Admin, Dashboard Presidente, Listone, Calciomercato e asset comuni V522 restano invariati.

## Verifica manuale

Aprire entrambe le leghe e controllare:

- footer V527;
- nessun errore console;
- Dashboard popolata;
- Listone/Calciomercato funzionanti;
- login Admin/Presidente invariato;
- in console `window.FantaEngineDashboardRendererMigrationLastReportV527` mostra `replacesLocalRenderers: false`.
