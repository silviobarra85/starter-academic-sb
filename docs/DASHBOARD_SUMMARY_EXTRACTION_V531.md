# Dashboard summary extraction V531

La V531 introduce la seconda micro-estrazione dashboard verso `fanta-engine`.

## Obiettivo

Spostare nel motore comune un solo blocco pubblico non critico: la lettura/sintesi dei metadati dashboard gia renderizzati.

Il nuovo modulo e:

```text
static/fanta-engine/js/ui/dashboard-summary-extraction-v531.js
```

## Cosa fa

- legge in modo sicuro le metriche pubbliche `metricClubs`, `metricTotalFm`, `metricAlerts`, `metricAlertsReason`;
- rileva la presenza dei principali container dashboard pubblici;
- pubblica un report runtime in `window.FantaEngineDashboardSummaryExtractionLastReportV531`;
- mantiene i renderer locali come percorso primario;
- non modifica il DOM in modo funzionale;
- non sostituisce `renderDashboard`;
- non cambia Firebase;
- non cambia EmailJS;
- non sposta dati;
- non tocca Admin o Presidente.

## Perche e sicura

La V531 e additive-only: se il modulo non trovasse una metrica o un container, non blocca la pagina e non prende il controllo del renderer locale.

## Verifica

```bash
node static/fanta-engine/tools/audit-dashboard-summary-extraction-v531.mjs
```

Output atteso:

```text
Audit V531 superato: seconda micro-estrazione dashboard additive-only, renderer locali preservati e runtime a ?v=531.
```

## Runtime browser

In console puoi controllare:

```js
window.FantaEngineDashboardSummaryExtractionLastReportV531
```

Il report deve indicare:

```text
replacesLocalRenderers: false
touchesFirebase: false
touchesEmailJs: false
touchesData: false
```

## Guardrail

- I renderer locali restano attivi.
- Admin e Presidente restano protetti.
- Listoni e Calciomercato restano asset comuni in `fanta-engine/data/shared-assets/current`.
- I fallback locali non vengono cancellati.
- `FUNZIONALITA'.md` non viene modificato.
