# AI assistant handoff V509

## Stato attuale

Il progetto contiene due leghe statiche:

- static/zonaorientale
- static/fantapetillomantramanager

Il motore comune e in static/fanta-engine. Le cartelle static/zonaorientale/static e static/static devono restare assenti.

## Cosa e stato fatto fino a V509

Da V480 a V495 e stato stabilizzato il motore comune, rimossa la copia annidata ZonaOrientale e introdotti audit anti-contaminazione. Da V496 a V509 sono stati centralizzati UI, registry card, adapter EmailJS, adapter Firebase, dashboard cards, tool engine, template nuova lega, Playwright e primi renderer comuni.

La V509 aggiunge dashboard-renderer-helpers-v509.js e sposta due punti reali verso fanta-engine:

- renderAdminPanel ora usa renderAdminCollapsiblePanelV509.
- renderPresidentDashboardMetricV369 ora usa renderPresidentDashboardMetricV509.

Questa migrazione e intenzionalmente piccola: non cambia dati, ruoli, Firebase, EmailJS o DOM policy.

## Roadmap obbligatoria

Consultare e aggiornare sempre:

- docs/OVERLAY_ROADMAP.md

Il prossimo overlay consigliato e V510: report centralizzazione fanta-engine + checklist pre-merge.

## Guardrail

- Non modificare docs/zonaorientale/FUNZIONALITA'.md senza richiesta esplicita.
- Non ripristinare static/zonaorientale/static.
- Non ripristinare static/static.
- Non cancellare fallback locali.
- Non migrare Firebase a nuovi path senza backup, rules e test browser.
