# Quick navigation smoke V532

La V532 consolida la stabilita percepita nelle interazioni rapide **Dashboard/Listone/Calciomercato**.

## Obiettivo

Dopo la centralizzazione degli asset comuni e le micro-estrazioni dashboard, serve una baseline di controllo prima di continuare a spostare renderer nel motore comune.

Il nuovo modulo e:

```text
static/fanta-engine/js/ui/quick-navigation-smoke-v532.js
```

## Cosa fa

- osserva i cambi hash/pagina tra `dashboard`, `listone` e `calciomercato`;
- pubblica un report runtime in `window.FantaEngineQuickNavigationSmokeLastReportV532`;
- segnala nel report se avviene un possibile ritorno rapido a dashboard dopo una navigazione verso Listone/Calciomercato;
- mantiene i renderer locali;
- preserva Admin e Presidente;
- preserva gli asset comuni in `fanta-engine/data/shared-assets/current`.

## Cosa non fa

- Non cambia `window.location.hash`.
- Non chiama `setAppPage`.
- Non renderizza dati.
- Non modifica Firebase.
- Non modifica EmailJS.
- Non cancella fallback locali.
- Non modifica `FUNZIONALITA'.md`.

La V532 e **additive-only**: osserva e documenta, ma non cambia la navigazione.

## Verifica

```bash
node static/fanta-engine/tools/audit-quick-navigation-smoke-v532.mjs
```

Output atteso:

```text
Audit V532 superato: smoke interazioni rapide Dashboard/Listone/Calciomercato, runtime whole-site a ?v=532 e docs/handoff aggiornati.
```

## Test manuale consigliato

1. Aprire ZonaOrientale.
2. Ricaricare la pagina.
3. Cliccare velocemente Dashboard -> Listone -> Calciomercato -> Dashboard.
4. Ripetere lo stesso su FantaPetilloMantraManager.
5. Controllare in console:

```js
window.FantaEngineQuickNavigationSmokeLastReportV532
```

Il report deve indicare:

```text
replacesNavigation: false
mutatesHash: false
callsSetAppPage: false
possibleDashboardFallback: false
```

## Overlay rimanenti consigliati dopo V532

Se non emergono regressioni, restano **4 overlay consigliati** prima della release multi-lega consolidata:

1. **V533 - Terza micro-estrazione dashboard**: estrarre un helper pubblico non critico, con fallback locale.
2. **V534 - Multi-season path resolver activation**: usare l'adapter V526 per risolvere path per-stagione senza spostare file fisici.
3. **V535 - Shared assets fallback cleanup readiness**: preparare audit e manifest per ridurre la duplicazione operativa dei fallback, senza cancellarli automaticamente.
4. **V536 - Merge readiness / release candidate**: audit finale whole-site, handoff consolidato e checklist pre-merge.
