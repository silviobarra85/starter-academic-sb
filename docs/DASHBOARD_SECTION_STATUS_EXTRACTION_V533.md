# Dashboard section status extraction V533

La V533 e la terza micro-estrazione dashboard verso `fanta-engine`.

## Modulo

```text
static/fanta-engine/js/ui/dashboard-section-status-extraction-v533.js
```

## Obiettivo

Estrazione: `public-dashboard-section-status`.

Centralizzare un helper pubblico non critico che legge lo stato delle sezioni collegate alla dashboard:

```text
dashboard
listone
calciomercato
bilanci
fantamercato
sorteggio
```

Il report runtime viene pubblicato in:

```js
window.FantaEngineDashboardSectionStatusExtractionLastReportV533
```

## Cosa fa

- Legge quali sezioni `data-page` sono presenti.
- Legge quali link `data-page-link` sono presenti.
- Rileva la pagina attiva.
- Controlla la presenza delle metriche pubbliche dashboard.
- Espone un report read-only per futuri audit e per la prossima attivazione multi-season/path resolver.

## Cosa non fa

- Non sostituisce `renderDashboard`.
- Non scrive nel DOM.
- Non modifica `window.location.hash`.
- Non chiama `setAppPage`.
- Non modifica Firebase.
- Non modifica EmailJS.
- Non sposta dati.
- Non cancella fallback locali.
- Non modifica `FUNZIONALITA'.md`.

La V533 e **additive-only**.

## Verifica

```bash
node static/fanta-engine/tools/audit-dashboard-section-status-extraction-v533.mjs
```

Output atteso:

```text
Audit V533 superato: terza micro-estrazione dashboard additive-only, runtime whole-site a ?v=533 e docs/handoff aggiornati.
```

## Test manuale consigliato

1. Aprire ZonaOrientale.
2. Aprire FantaPetilloMantraManager.
3. Controllare che Dashboard, Listone e Calciomercato aprano senza ritorni a dashboard.
4. Controllare in console:

```js
window.FantaEngineDashboardSectionStatusExtractionLastReportV533
```

Il report deve indicare:

```text
replacesLocalRenderers: false
mutatesDom: false
mutatesHash: false
callsSetAppPage: false
```

## Overlay rimanenti consigliati dopo V533

Restano **3 overlay consigliati**:

1. **V534 - Multi-season path resolver activation**.
2. **V535 - Shared assets fallback cleanup readiness**.
3. **V536 - Merge readiness / release candidate**.
