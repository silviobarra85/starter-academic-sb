# Browser smoke tests hardening V508

La V508 rafforza i test browser introdotti in V503.

## File aggiunti

- `static/fanta-engine/tools/playwright-smoke-v508.mjs`
- `static/fanta-engine/data/playwright-hardening-v508.json`
- `static/fanta-engine/tools/audit-playwright-hardening-v508.mjs`

## Cosa controlla

- Pagine principali ZonaOrientale e FantaMantraManager.
- Viewport mobile `390x844` e desktop `1366x900`.
- Errori console e pageerror.
- Request fallite e risposte HTTP `>= 400`, ignorando favicon.
- Brand corretto per lega.
- Footer V508 dove previsto.
- Asset minimi caricati.
- Navigazione presente sulle home.
- Riferimenti a Listone/Calciomercato/Fantamercato sulle home.
- Report JSON e Markdown in `static/fanta-engine/reports/`.

## Esecuzione

```bash
npm install -D playwright
npx playwright install chromium
FANTA_BASE_URL=http://127.0.0.1:1313 FANTA_SITE_PREFIX=/starter-academic-sb/static node static/fanta-engine/tools/playwright-smoke-v508.mjs
```

Flag utili:

```bash
node static/fanta-engine/tools/playwright-smoke-v508.mjs --headed
node static/fanta-engine/tools/playwright-smoke-v508.mjs --mobile-only
node static/fanta-engine/tools/playwright-smoke-v508.mjs --desktop-only
node static/fanta-engine/tools/playwright-smoke-v508.mjs --report-dir=static/fanta-engine/reports
```

## Guardrail

Il test non fa login, non invia EmailJS, non scrive Firebase e non modifica dati. Usarlo su server locale o branch deploy prima di merge su `master`.
