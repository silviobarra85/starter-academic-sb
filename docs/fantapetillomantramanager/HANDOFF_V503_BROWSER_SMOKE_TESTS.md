# Handoff V503 - Browser smoke tests

## Sintesi

La V503 aggiunge test browser Playwright comuni in `static/fanta-engine`. La lega FantaMantraManager non cambia logica runtime: footer/cache-buster passano a V503 e la config dichiara i browser smoke tests.

## File comuni

```text
static/fanta-engine/tools/playwright-smoke-v503.mjs
static/fanta-engine/tools/audit-browser-smoke-tests-v503.mjs
static/fanta-engine/data/browser-smoke-tests-v503.json
```

## Audit

```bash
cd static
node fanta-engine/tools/audit-browser-smoke-tests-v503.mjs
node fanta-engine/tools/audit-runtime-regression-v503.mjs
node fanta-engine/tools/audit-multileague-contamination-v503.mjs
```

## Verifica manuale

- Aprire le pagine pubbliche principali.
- Verificare footer V503.
- Controllare console browser.
- Verificare che non ci siano riferimenti incrociati tra leghe.
- Per FantaMantraManager, preservare Dashboard Presidente, Svincola, Comunicato scambio e Proposte regolamento.
