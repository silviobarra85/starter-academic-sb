# Dashboard renderer extraction V529

La V529 introduce il primo passo di estrazione controllata dei renderer dashboard verso `fanta-engine`.

## Obiettivo

Spostare nel motore comune una sola funzione non critica, lasciando invariati i renderer locali e mantenendo fallback immediato.

Il nuovo modulo e:

```text
static/fanta-engine/js/ui/dashboard-renderer-extraction-v529.js
```

## Cosa viene estratto

Viene estratta la sincronizzazione dei metadati delle metriche dashboard pubbliche:

```text
metricClubs
metricTotalFm
metricAlerts
metricAlertsReason
```

Prima la sincronizzazione era cablata direttamente in `assets/app.js` dentro il bridge V527. Ora passa da `fanta-engine`, tramite:

```js
window.FantaEngineDashboardRendererExtractionRuntimeV529.syncPublicMetrics(...)
```

## Perche e sicuro

- Non sostituisce `renderDashboard`.
- Non modifica HTML visibile delle card dashboard.
- Non cambia Admin o Presidente.
- Non cambia Firebase.
- Non cambia EmailJS.
- Non sposta dati.
- Non cancella fallback locali Listoni/Calciomercato.
- Mantiene fallback locale se il runtime V529 non e disponibile.

## Funzionalita preservate

Dashboard pubblica, Area Admin, Dashboard Presidente, Listone, Calciomercato e navigazione restano sui percorsi gia funzionanti. La V529 sposta solo la parte di sincronizzazione metadati/post-render delle metriche dashboard.

## Verifica runtime

In console, su entrambe le leghe:

```js
window.FantaEngineDashboardRendererExtractionLastReportV529
```

Deve mostrare:

```text
extraction: public-dashboard-metric-sync
replacesLocalRenderers: false
fallbackLocalSyncAvailable: true
firebaseWrites: false
emailjsChanged: false
```
