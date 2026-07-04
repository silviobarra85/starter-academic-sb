# Dashboard enforce V528

La V528 aggiunge un layer conservativo di hardening attorno alla migrazione dashboard iniziata in V527.

## Obiettivo

Rendere piu sicuro il bridge dashboard comune senza sostituire i renderer locali.

Il nuovo modulo e:

```text
static/fanta-engine/js/ui/dashboard-enforce-v528.js
```

## Cosa fa

- installa `window.FantaEngineDashboardEnforceRuntimeV528`;
- marca i root dashboard con attributi `data-dashboard-enforce-*`;
- marca aree Admin/Presidente come flussi protetti;
- produce `window.FantaEngineDashboardEnforceLastReportV528`;
- richiama prima il bridge V527 e poi applica le guardie V528;
- impedisce che la roadmap venga interpretata come sostituzione totale dei renderer locali.

## Cosa non fa

- Non sostituisce `renderDashboard`.
- Non cancella funzioni locali.
- Non cambia Firebase.
- Non cambia EmailJS.
- Non cambia policy ruoli Admin/Presidente.
- Non sposta fisicamente dati stagionali.
- Non cancella fallback Listoni/Calciomercato.
- Non modifica `docs/zonaorientale/FUNZIONALITA'.md`.

## Funzionalita preservate

Dashboard pubblica, Area Admin, Dashboard Presidente, Listone e Calciomercato continuano a usare i renderer e i loader gia presenti. La V528 e additive-only.

## Verifica runtime

In console, su entrambe le leghe:

```js
window.FantaEngineDashboardEnforceLastReportV528
```

Il report deve mostrare:

```text
replacesLocalRenderers: false
firebaseWrites: false
emailjsChanged: false
protectsAdminFlows: true
protectsPresidentFlows: true
```
